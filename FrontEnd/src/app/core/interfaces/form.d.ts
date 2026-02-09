export interface FormFieldOption {
  value: string | number | boolean;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'date' | 'tel' | 'password' | 'select';
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  errorMessage?: string;
  options?: FormFieldOption[];
  customInputHandler?: (event: Event, formGroup: FormGroup) => void;
  customKeydownHandler?: (event: KeyboardEvent) => void;
}

export interface FormButton {
  label: string;
  type: 'submit' | 'button' | 'reset';
  class?: string;
  action?: () => void;
  disabled?: boolean;
}
