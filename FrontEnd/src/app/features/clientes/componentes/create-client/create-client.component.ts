import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormButton, FormField } from 'src/app/core/interfaces/form';

import { ShortPopUpComponent } from 'src/app/shared/components/short-pop-up/short-pop-up.component';
import { FormConstructorComponent } from 'src/app/shared/components/form-constructor/form-constructor.component';
import { ClientesService } from 'src/app/core/services/clientes/clientes.service';
import { GeneralService } from 'src/app/core/services/GeneralServices/general-services.service';

@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShortPopUpComponent,
    FormConstructorComponent,
  ],
  templateUrl: './create-client.component.html',
  styleUrl: './create-client.component.css',
})
export class CreateClientComponent implements OnInit {
  formulario: FormGroup;
  formFields: FormField[] = [];
  formButtons: FormButton[] = [];
  mostrarPopup: boolean = false;
  message: string = '';
  typeModal: string = 'error';
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientesService,
    private router: Router,
    private generalService: GeneralService,
  ) {
    this.formulario = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      genero: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      identificacion: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13),
        ],
      ],
      direccion: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(10),
        ],
      ],
      contrasena: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      estado: [{ value: true, disabled: true }],
    });
  }

  ngOnInit() {
    this.initializeFormFields();
    this.initializeFormButtons();
    this.loadClientData();
  }

  private initializeFormFields(): void {
    this.formFields = [
      {
        name: 'nombre',
        label: 'Nombre Completo',
        type: 'text',
        maxLength: 100,
        errorMessage: 'El nombre es requerido!',
      },
      {
        name: 'genero',
        label: 'Género',
        type: 'select',
        placeholder: 'Seleccione su género',
        errorMessage: 'El género es requerido!',
        options: [
          { value: 'Masculino', label: 'Masculino' },
          { value: 'Femenino', label: 'Femenino' },
          { value: 'Otro', label: 'Otro' },
        ],
      },
      {
        name: 'edad',
        label: 'Edad',
        type: 'number',
        errorMessage: 'La edad es requerida!',
      },
      {
        name: 'identificacion',
        label: 'Identificación',
        type: 'text',
        maxLength: 13,
        errorMessage: 'La identificación es requerida!',
        customKeydownHandler: this.preventInvalidKeys.bind(this),
      },
      {
        name: 'direccion',
        label: 'Dirección',
        type: 'text',
        maxLength: 200,
        errorMessage: 'La dirección es requerida!',
      },
      {
        name: 'telefono',
        label: 'Teléfono',
        type: 'tel',
        maxLength: 10,
        placeholder: '0999999999',
        errorMessage: 'El teléfono es requerido!',
        customKeydownHandler: this.preventInvalidKeys.bind(this),
      },
      {
        name: 'contrasena',
        label: 'Contraseña',
        type: 'password',
        maxLength: 20,
        errorMessage: 'La contraseña es requerida!',
      },
      {
        name: 'estado',
        label: 'Estado',
        type: 'select',
        readonly: true,
        options: [
          { value: true, label: 'Activo' },
          { value: false, label: 'Inactivo' },
        ],
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
        label: 'Enviar',
        type: 'submit',
        class: 'btn-submit',
        action: this.enviar.bind(this),
      },
    ];
  }

  private loadClientData(): void {
    const cliente = this.generalService.getObject();
    if (cliente) {
      this.formulario.patchValue(cliente);
      this.formulario.get('identificacion')?.disable();
      this.isEdit = true;
    }
  }

  reiniciar(): void {
    const cliente = this.generalService.getObject();
    if (cliente) {
      this.generalService.clearObject();
    }
    this.formulario.reset({
      estado: { value: true, disabled: true },
    });
  }

  async enviar(): Promise<void> {
    if (this.formulario.valid) {
      await this.submitForm();
    }
  }

  private async submitForm(): Promise<void> {
    const formularioValues = this.formulario.getRawValue();
    if (this.isEdit) {
      const cliente = this.generalService.getObject();
      const response = await this.clientService.editClient(
        cliente.clienteId,
        formularioValues,
      );
      if (response && Object.keys(response).length !== 0) {
        this.reiniciar();
        this.goToList();
      }
    } else {
      await this.clientService.createClients(formularioValues);
      this.reiniciar();
    }
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

  goToList(): void {
    this.router.navigate(['/']);
  }

  private showError(message: string): void {
    this.typeModal = 'error';
    this.message = message;
    this.abrirPopup();
  }

  abrirPopup(): void {
    this.mostrarPopup = true;
  }
}
