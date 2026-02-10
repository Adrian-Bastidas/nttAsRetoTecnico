import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormButton, FormField } from 'src/app/core/interfaces/form';

@Component({
  selector: 'app-form-constructor',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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

  @Input() clientInfoFields: { label: string; key: string }[] = [];
  @Output() onSearchClient = new EventEmitter<string>();
  @Output() onSubmit = new EventEmitter<void>();
  @Output() onBack = new EventEmitter<void>();

  searchClientTerm: string = '';
  clientData: any = null;

  ngOnInit(): void {
    if (!this.formGroup) {
      throw new Error('FormGroup is required for FormConstructorComponent');
    }
  }

  get formControls() {
    return this.formGroup.controls;
  }

  hasSearchClientField(): boolean {
    return this.fields.some((field) => field.isSearchClient === true);
  }

  getSearchClientPlaceholder(): string {
    const searchField = this.fields.find(
      (field) => field.isSearchClient === true,
    );
    return (
      searchField?.searchPlaceholder || 'Ingrese identificación del cliente'
    );
  }

  getNonSearchFields(): FormField[] {
    return this.fields.filter((field) => !field.isSearchClient);
  }

  handleSearchClient(): void {
    if (this.searchClientTerm && this.searchClientTerm.trim() !== '') {
      this.onSearchClient.emit(this.searchClientTerm.trim());
    }
  }

  setClientData(data: any): void {
    this.clientData = data;
  }

  clearClientData(): void {
    this.clientData = null;
    this.searchClientTerm = '';
  }

  getClientInfoFields(): { label: string; value: any }[] {
    if (!this.clientData || !this.clientInfoFields.length) return [];

    return this.clientInfoFields.map((field) => ({
      label: field.label,
      value: this.getNestedProperty(this.clientData, field.key) || 'N/A',
    }));
  }
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
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
  isSearchClientDisabled(): boolean {
    const searchField = this.fields.find(
      (field) => field.isSearchClient === true,
    );
    return searchField?.readonly || false;
  }
}
