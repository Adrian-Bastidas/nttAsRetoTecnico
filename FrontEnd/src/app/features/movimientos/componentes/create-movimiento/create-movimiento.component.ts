import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormButton, FormField } from 'src/app/core/interfaces/form';
import { CuentasService } from 'src/app/core/services/cuentas/cuentas.service';
import { GeneralService } from 'src/app/core/services/GeneralServices/general-services.service';
import { MovimientosService } from 'src/app/core/services/movimientos/movimientos.service';
import {
  FormConstructorComponent,
  SearchConfig,
} from 'src/app/shared/components/form-constructor/form-constructor.component';
import { ShortPopUpComponent } from 'src/app/shared/components/short-pop-up/short-pop-up.component';

@Component({
  selector: 'app-create-movimiento',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShortPopUpComponent,
    FormConstructorComponent,
  ],
  templateUrl: './create-movimiento.component.html',
  styleUrl: './create-movimiento.component.css',
})
export class CreateMovimientoComponent implements OnInit {
  @ViewChild(FormConstructorComponent)
  formConstructor!: FormConstructorComponent;

  formulario: FormGroup;
  formFields: FormField[] = [];
  formButtons: FormButton[] = [];
  searchConfig: SearchConfig = {
    enabled: false,
    fieldName: 'accountSearch',
    label: 'Buscar Cuenta',
    placeholder: 'Ingrese el número de la cuenta',
    infoFields: [
      { label: 'Tipo de Cuenta', key: 'tipoCuenta' },
      { label: 'Cliente', key: 'cliente.nombre' },
    ],
  };

  mostrarPopup: boolean = false;
  message: string = '';
  typeModal: string = 'error';
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private movimientosService: MovimientosService,
    private cuentasService: CuentasService,
    private router: Router,
    private generalService: GeneralService,
  ) {
    this.formulario = this.fb.group({
      valor: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.initializeFormFields();
    this.initializeFormButtons();
    this.loadMovimientoData();
  }

  private initializeFormFields(): void {
    this.formFields = [
      {
        name: 'valor',
        label: 'Valor',
        type: 'number',
        placeholder: '0.00',
        errorMessage: 'El valor es requerido!',
      },
    ];

    this.searchConfig = {
      ...this.searchConfig,
      enabled: true,
      readonly: this.isEdit,
    };
  }

  private initializeFormButtons(): void {
    this.formButtons = [
      {
        label: 'Reiniciar',
        type: 'button',
        class: 'btn-reset',
        action: this.reiniciar.bind(this),
      },
      {
        label: this.isEdit ? 'Actualizar' : 'Enviar',
        type: 'submit',
        class: 'btn-submit',
        action: this.enviar.bind(this),
      },
    ];
  }

  private async loadMovimientoData(): Promise<void> {
    const movimiento = this.generalService.getObject();

    if (movimiento && movimiento.movimientoId) {
      this.isEdit = true;

      this.formulario.patchValue({
        tipoCuenta: movimiento.tipoCuenta,
        valor: this.extraerValor(movimiento.movimiento),
      });

      if (movimiento.movimientoId) {
        setTimeout(async () => {
          await this.onSearch(movimiento.numeroCuenta);

          this.initializeFormFields();
          this.initializeFormButtons();
        }, 100);
      }
    }
  }
  extraerValor(movimiento: string): number {
    const esRetiro = movimiento.toLowerCase().includes('retiro');
    const valor = parseInt(movimiento.match(/\d+/)?.[0] || '0', 10);
    return esRetiro ? -valor : valor;
  }
  async onSearch(searchTerm: string): Promise<void> {
    try {
      const response = await this.cuentasService.loadCuentaByNumero(searchTerm);

      if (response && response.cuentaId) {
        this.formConstructor.setSearchData(response);

        if (!this.isEdit) {
          this.showSuccess('Cuenta encontrada correctamente');
        }
      } else {
        this.showError('No se encontró ninguna cuenta con ese número');
        this.formConstructor.clearSearchData();
      }
    } catch (error) {
      console.error('Error buscando cuenta:', error);
      this.formConstructor.clearSearchData();
    }
  }

  reiniciar(): void {
    if (this.isEdit) {
      this.loadMovimientoData();
    } else {
      this.formulario.reset();
      if (this.formConstructor) {
        this.formConstructor.clearSearchData();
      }
    }
  }

  async enviar(): Promise<void> {
    if (this.formulario.valid) {
      if (!this.formConstructor.searchData) {
        this.showError(
          'Debe buscar y seleccionar una cuenta antes de crear el movimiento',
        );
        return;
      }

      await this.submitForm();
    } else {
      this.showError('Por favor complete todos los campos requeridos');
    }
  }

  private async submitForm(): Promise<void> {
    const formularioValues = this.formulario.getRawValue();
    const movimientoDataFromSearch = this.formConstructor.searchData;

    const movimientoData = {
      tipo: movimientoDataFromSearch.tipoCuenta,
      fecha: new Date().toISOString(),
      valor: Number(formularioValues.valor),
      numeroCuenta: movimientoDataFromSearch.numeroCuenta,
    };

    try {
      if (this.isEdit) {
        const movement = this.generalService.getObject();
        const response = await this.movimientosService.editMovimiento(
          movement.movimientoId,
          movimientoData,
        );
        if (response && Object.keys(response).length !== 0) {
          this.generalService.clearObject();
          setTimeout(() => {
            this.goToList();
          }, 1500);
        }
      } else {
        await this.movimientosService.createMovimiento(movimientoData);
        this.formulario.reset();
        if (this.formConstructor) {
          this.formConstructor.clearSearchData();
        }
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  }

  goToList(): void {
    this.router.navigate(['/movimientos']);
  }

  private showError(message: string): void {
    this.typeModal = 'error';
    this.message = message;
    this.abrirPopup();
  }

  private showSuccess(message: string): void {
    this.typeModal = 'success';
    this.message = message;
    this.abrirPopup();
  }

  abrirPopup(): void {
    this.mostrarPopup = true;
  }

  onBack(): void {
    this.generalService.clearObject();
    this.isEdit = false;
    this.goToList();
  }
}
