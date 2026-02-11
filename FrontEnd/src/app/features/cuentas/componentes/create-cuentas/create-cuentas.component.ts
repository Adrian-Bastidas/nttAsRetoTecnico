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
import { ClientesService } from 'src/app/core/services/clientes/clientes.service';
import { CuentasService } from 'src/app/core/services/cuentas/cuentas.service';
import { GeneralService } from 'src/app/core/services/GeneralServices/general-services.service';
import {
  FormConstructorComponent,
  SearchConfig,
} from 'src/app/shared/components/form-constructor/form-constructor.component';
import { ShortPopUpComponent } from 'src/app/shared/components/short-pop-up/short-pop-up.component';

@Component({
  selector: 'app-create-cuentas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShortPopUpComponent,
    FormConstructorComponent,
  ],
  templateUrl: './create-cuentas.component.html',
  styleUrl: './create-cuentas.component.css',
})
export class CreateCuentasComponent implements OnInit {
  @ViewChild(FormConstructorComponent)
  formConstructor!: FormConstructorComponent;

  formulario: FormGroup;
  formFields: FormField[] = [];
  formButtons: FormButton[] = [];
  searchConfig: SearchConfig = {
    enabled: false,
    fieldName: 'clientSearch',
    label: 'Buscar Cliente',
    placeholder: 'Ingrese la identificación del cliente',
    infoFields: [
      { label: 'Nombre', key: 'nombre' },
      { label: 'Identificación', key: 'identificacion' },
      { label: 'Dirección', key: 'direccion' },
      { label: 'Teléfono', key: 'telefono' },
    ],
  };

  mostrarPopup: boolean = false;
  message: string = '';
  typeModal: string = 'error';
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientesService,
    private cuentasService: CuentasService,
    private router: Router,
    private generalService: GeneralService,
  ) {
    this.formulario = this.fb.group({
      tipoCuenta: ['', [Validators.required]],
      saldoInicial: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.initializeFormFields();
    this.initializeFormButtons();
    this.loadCuentaData();
  }

  private initializeFormFields(): void {
    this.formFields = [
      {
        name: 'tipoCuenta',
        label: 'Tipo de Cuenta',
        type: 'select',
        placeholder: 'Seleccione el tipo de cuenta',
        errorMessage: 'El tipo de cuenta es requerido!',
        options: [
          { value: 'Ahorros', label: 'Ahorros' },
          { value: 'Corriente', label: 'Corriente' },
        ],
      },
      {
        name: 'saldoInicial',
        label: 'Saldo Inicial',
        type: 'number',
        placeholder: '0.00',
        errorMessage: 'El saldo inicial es requerido!',
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

  private async loadCuentaData(): Promise<void> {
    const cuenta = this.generalService.getObject();

    if (cuenta && cuenta.cuentaId) {
      this.isEdit = true;
      this.formulario.patchValue({
        tipoCuenta: cuenta.tipoCuenta,
        saldoInicial: cuenta.saldoInicial,
      });

      if (cuenta.cliente && cuenta.cliente.identificacion) {
        setTimeout(async () => {
          await this.onSearch(cuenta.cliente.identificacion);

          this.initializeFormFields();
          this.initializeFormButtons();
        }, 100);
      }
    }
  }

  async onSearch(searchTerm: string): Promise<void> {
    try {
      const response = await this.clientService.loadClientesById(searchTerm);

      if (response && response.clienteId) {
        this.formConstructor.setSearchData(response);

        if (!this.isEdit) {
          this.showSuccess('Cliente encontrado correctamente');
        }
      } else {
        this.formConstructor.clearSearchData();
      }
    } catch (error) {
      console.error('Error buscando cliente:', error);
      this.showError('Error al buscar el cliente');
      this.formConstructor.clearSearchData();
    }
  }

  reiniciar(): void {
    if (this.isEdit) {
      this.loadCuentaData();
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
          'Debe buscar y seleccionar un cliente antes de crear la cuenta',
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
    const clienteData = this.formConstructor.searchData;

    const cuentaData = {
      tipoCuenta: formularioValues.tipoCuenta,
      saldoInicial: Number(formularioValues.saldoInicial),
      clienteId: clienteData.clienteId,
    };

    try {
      if (this.isEdit) {
        const cuenta = this.generalService.getObject();
        const response = await this.cuentasService.editCuenta(
          cuenta.cuentaId,
          cuentaData,
        );
        if (response && Object.keys(response).length !== 0) {
          this.showSuccess('Cuenta actualizada correctamente');
          this.generalService.clearObject();
          setTimeout(() => {
            this.goToList();
          }, 1500);
        }
      } else {
        await this.cuentasService.createCuentas(cuentaData);
        this.formulario.reset();
        if (this.formConstructor) {
          this.formConstructor.clearSearchData();
        }
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      this.showError('Error al procesar la solicitud');
    }
  }

  goToList(): void {
    this.router.navigate(['/cuentas']);
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
