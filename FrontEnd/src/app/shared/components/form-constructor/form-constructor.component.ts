import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormButton, FormField } from 'src/app/core/interfaces/form';

@Component({
  selector: 'app-form-constructor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-constructor.component.html',
  styleUrl: './form-constructor.component.css',
})
export class FormConstructorComponent implements OnInit {
  @Input() title: string = 'Formulario';
  @Input() formGroup!: FormGroup;
  @Input() fields: FormField[] = [];
  @Input() buttons: FormButton[] = [];
  @Input() showBackButton: boolean = true;
  @Input() backButtonLabel: string = 'Regresar';
  @Input() gridColumns: number = 2;

  @Output() onSubmit = new EventEmitter<void>();
  @Output() onBack = new EventEmitter<void>();

  ngOnInit(): void {
    if (!this.formGroup) {
      throw new Error('FormGroup is required for FormConstructorComponent');
    }
  }

  get formControls() {
    return this.formGroup.controls;
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.formGroup.valid) {
      this.onSubmit.emit();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  handleButtonClick(button: FormButton, event: Event): void {
    event.preventDefault();
    if (button.action) {
      button.action();
    }
  }

  goBack(): void {
    this.onBack.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.formGroup.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  getErrorMessage(field: FormField): string {
    return field.errorMessage || 'Este campo es requerido!';
  }

  handleInput(event: Event, field: FormField): void {
    if (field.customInputHandler) {
      field.customInputHandler(event, this.formGroup);
    }
  }

  handleKeydown(event: KeyboardEvent, field: FormField): void {
    if (field.customKeydownHandler) {
      field.customKeydownHandler(event);
    }
  }

  isButtonDisabled(button: FormButton): boolean {
    if (button.disabled !== undefined) {
      return button.disabled;
    }
    if (button.type === 'submit') {
      return this.formGroup.invalid;
    }
    return false;
  }

  getGridStyle(): { [key: string]: string } {
    return {
      'grid-template-columns': `repeat(${this.gridColumns}, 1fr)`,
    };
  }
}
