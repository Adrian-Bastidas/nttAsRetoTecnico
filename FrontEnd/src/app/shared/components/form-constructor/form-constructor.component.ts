import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormButton, FormField } from 'src/app/core/interfaces/form';

export interface SearchConfig {
  enabled: boolean;
  fieldName: string;
  label: string;
  placeholder: string;
  readonly?: boolean;
  infoFields?: { label: string; key: string }[];
}

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

  @Input() searchConfig: SearchConfig = {
    enabled: false,
    fieldName: 'search',
    label: 'Buscar',
    placeholder: 'Ingrese el criterio de búsqueda',
  };

  @Output() onSearch = new EventEmitter<string>();
  @Output() onSubmit = new EventEmitter<void>();
  @Output() onBack = new EventEmitter<void>();

  searchTerm: string = '';
  searchData: any = null;

  ngOnInit(): void {
    if (!this.formGroup) {
      throw new Error('FormGroup is required for FormConstructorComponent');
    }
  }

  get formControls() {
    return this.formGroup.controls;
  }

  hasSearchField(): boolean {
    return this.searchConfig.enabled;
  }

  getSearchLabel(): string {
    return this.searchConfig.label;
  }

  getSearchPlaceholder(): string {
    return this.searchConfig.placeholder;
  }

  isSearchDisabled(): boolean {
    return this.searchConfig.readonly || false;
  }

  getNonSearchFields(): FormField[] {
    return this.fields;
  }

  handleSearch(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.onSearch.emit(this.searchTerm.trim());
    }
  }

  setSearchData(data: any): void {
    this.searchData = data;
  }

  clearSearchData(): void {
    this.searchData = null;
    this.searchTerm = '';
  }

  getSearchDataFields(): { label: string; value: any }[] {
    if (!this.searchData || !this.searchConfig.infoFields?.length) return [];

    return this.searchConfig.infoFields.map((field) => ({
      label: field.label,
      value: this.getNestedProperty(this.searchData, field.key) || 'N/A',
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
}
