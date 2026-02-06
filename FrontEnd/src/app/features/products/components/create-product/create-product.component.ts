import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/interfaces/product';
import {
  ProductoInternalService,
  ProductService,
} from 'src/app/core/services/products.service';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { ShortPopUpComponent } from 'src/app/shared/components/short-pop-up/short-pop-up.component';
import { TableConstructorComponent } from 'src/app/shared/components/table-constructor/table-constructor.component';

@Component({
  selector: 'app-create-product',
  imports: [CommonModule, ReactiveFormsModule, ShortPopUpComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent implements OnInit {
  formulario: FormGroup;
  mostrarPopup: boolean = false;
  message: string = '';
  typeModal: string = 'error';
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoInternalService,
    private productService: ProductService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [{ value: '', disabled: true }],
    });
  }
  ngOnInit() {
    const producto = this.productoService.getProducto();

    if (producto) {
      this.formulario.patchValue(producto);
      this.formulario.get('id')?.disable();
      this.isEdit = true;
    }

    this.productoService.clearProducto();
    this.formulario
      .get('date_release')
      ?.valueChanges.subscribe((valor: string) => {
        const [anio, mes, dia] = valor.split('-').map(Number);

        if ([anio, mes, dia].some(isNaN)) return;

        const fecha = new Date(anio, mes - 1, dia);
        fecha.setFullYear(fecha.getFullYear() + 1);

        const diaRev = fecha.getDate().toString().padStart(2, '0');
        const mesRev = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anioRev = fecha.getFullYear();

        const date_revision = `${anioRev}-${mesRev}-${diaRev}`;

        this.formulario
          .get('date_revision')
          ?.setValue(date_revision, { emitEvent: false });
      });
  }
  get f() {
    return this.formulario.controls;
  }

  reiniciar() {
    this.formulario.reset({
      name: '',
      date_release: '',
      date_revision: { value: '', disabled: true },
    });
  }
  async enviar() {
    event?.preventDefault();
    if (this.formulario.valid) {
      const fechaString = this.formulario.get('date_release')?.value;
      if (fechaString) {
        const [year, month, day] = fechaString.split('-').map(Number);

        if (day && month && year) {
          const fechaIngresada = new Date(year, month - 1, day);
          const fechaActual = new Date();

          fechaActual.setHours(0, 0, 0, 0);
          fechaIngresada.setHours(0, 0, 0, 0);

          if (fechaIngresada >= fechaActual) {
            if (this.isEdit) {
              const formularioValues = this.formulario.value;
              formularioValues.date_revision =
                this.formulario.get('date_revision')?.value;
              await this.productService.editProduct(
                this.formulario.get('id')?.value,
                formularioValues
              );
              this.reiniciar();
            } else {
              const validate = await this.productService.validateId(
                this.formulario.get('id')?.value
              );

              if (!validate) {
                const formularioValues = this.formulario.value;
                formularioValues.date_revision =
                  this.formulario.get('date_revision')?.value;
                await this.productService.createProducts(formularioValues);
                this.reiniciar();
              } else {
                this.typeModal = 'error';
                this.message = 'El ID ya existe, por favor ingrese otro';
                this.abrirPopup();
              }
            }
          } else {
            this.typeModal = 'error';
            this.message =
              'La fecha de liberación no puede ser anterior a la actual';
            this.abrirPopup();
          }
        }
      }
    } else {
      this.formulario.markAllAsTouched();
    }
  }
  onDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value.replace(/\D/g, '');

    let year = '';
    let month = '';
    let day = '';

    if (rawValue.length >= 4) {
      year = rawValue.substring(0, 4);
    } else {
      year = rawValue;
    }

    if (rawValue.length >= 6) {
      month = rawValue.substring(4, 6);
      let monthNum = parseInt(month, 10);
      if (monthNum > 12) monthNum = 12;
      if (monthNum < 1) monthNum = 1;
      month = monthNum.toString().padStart(2, '0');
    } else if (rawValue.length > 4) {
      month = rawValue.substring(4);
    }

    if (rawValue.length > 6) {
      day = rawValue.substring(6, 8);
    }

    if (year.length === 4 && month && day) {
      const maxDay = new Date(+year, +month, 0).getDate();
      if (parseInt(day) > maxDay) {
        day = maxDay.toString().padStart(2, '0');
      }
    }

    let formattedValue = year;
    if (month) formattedValue += '-' + month;
    if (day) formattedValue += '-' + day;

    input.value = formattedValue;
    this.formulario
      .get('date_release')
      ?.setValue(formattedValue, { emitEvent: false });
  }

  preventInvalidKeys(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
    ];
    const isNumber = /^[0-9]$/.test(event.key);
    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  goToList() {
    this.router.navigate(['/']);
  }
  abrirPopup() {
    this.mostrarPopup = true;
  }
}
