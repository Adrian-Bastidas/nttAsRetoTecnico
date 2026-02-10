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
import { FormConstructorComponent } from 'src/app/shared/components/form-constructor/form-constructor.component';
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
  mostrarPopup: boolean = false;
  message: string = '';
  typeModal: string = 'error';
  isEdit: boolean = false;

  clientInfoFields = [
    { label: 'Nombre', key: 'nombre' },
    { label: 'Identificación', key: 'identificacion' },
    { label: 'Dirección', key: 'direccion' },
    { label: 'Teléfono', key: 'telefono' },
  ];

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
        name: 'clientSearch',
        label: 'Buscar Cliente',
        type: 'search-client',
        isSearchClient: true,
        searchPlaceholder: 'Ingrese la identificación del cliente',
        readonly: this.isEdit, // ✅ Bloquear en modo edición
      },

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

      // ✅ Cargar datos de la cuenta en el formulario
      this.formulario.patchValue({
        tipoCuenta: cuenta.tipoCuenta,
        saldoInicial: cuenta.saldoInicial,
      });

      // ✅ Si tiene cliente, buscar automáticamente
      if (cuenta.cliente && cuenta.cliente.identificacion) {
        // Esperar a que el ViewChild esté disponible
        setTimeout(async () => {
          await this.onSearchClient(cuenta.cliente.identificacion);

          // ✅ Bloquear búsqueda después de cargar
          this.initializeFormFields();
          this.initializeFormButtons();
        }, 100);
      }
    }
  }

  async onSearchClient(searchTerm: string): Promise<void> {
    try {
      const response = await this.clientService.loadClientesById(searchTerm);

      if (response && response.clienteId) {
        this.formConstructor.setClientData(response);

        if (!this.isEdit) {
          this.showSuccess('Cliente encontrado correctamente');
        }
      } else {
        this.showError('No se encontró ningún cliente con esa identificación');
        this.formConstructor.clearClientData();
      }
    } catch (error) {
      console.error('Error buscando cliente:', error);
      this.showError('Error al buscar el cliente');
      this.formConstructor.clearClientData();
    }
  }

  reiniciar(): void {
    if (this.isEdit) {
      // ✅ En modo edición, volver a cargar datos originales
      this.loadCuentaData();
    } else {
      // ✅ En modo creación, limpiar todo
      this.formulario.reset();
      if (this.formConstructor) {
        this.formConstructor.clearClientData();
      }
    }
  }

  async enviar(): Promise<void> {
    if (this.formulario.valid) {
      if (!this.formConstructor.clientData) {
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
    const clienteData = this.formConstructor.clientData;

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
        this.showSuccess('Cuenta creada correctamente');
        this.formulario.reset();
        if (this.formConstructor) {
          this.formConstructor.clearClientData();
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
