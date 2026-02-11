export interface CuentasPaginationResult {
  cuentas: CuentaResponseVo[];
  totalElements: number;
  totalPages: number;
}
interface Cliente {
  clienteId: number;
  nombre: string;
  identificacion: string;
}
export interface CreateCuenta {
  clienteId: number;
  tipoCuenta: string;
  saldoInicial: number;
}

interface CuentaResponseVo {
  cuentaId: number;
  numeroCuenta: string;
  tipoCuenta: string;
  saldoInicial: number;
  estado: boolean;
  cliente: Cliente;
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

export interface EstadoCuentaReporte {
  fecha: string;
  cliente: string;
  numeroCuenta: string;
  tipo: string;
  saldoInicial: number;
  estado: boolean;
  movimiento: number;
  saldoDisponible: number;
}

export interface ReportsPaginationResult {
  reportes: EstadoCuentaReporte[];
  totalElements: number;
  totalPages: number;
}
