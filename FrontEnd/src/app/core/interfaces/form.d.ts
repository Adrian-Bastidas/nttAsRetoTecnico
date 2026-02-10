export interface FormFieldOption {
  value: string | number | boolean;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'select'
    | 'date'
    | 'tel'
    | 'search-client';
  placeholder?: string;
  errorMessage?: string;
  maxLength?: number;
  readonly?: boolean;
  options?: { value: any; label: string }[];
  customInputHandler?: (event: Event, formGroup: FormGroup) => void;
  customKeydownHandler?: (event: KeyboardEvent) => void;

  isSearchClient?: boolean;
  searchPlaceholder?: string;
}

export interface FormButton {
  label: string;
  type: 'submit' | 'button' | 'reset';
  class?: string;
  action?: () => void;
  disabled?: boolean;
}
