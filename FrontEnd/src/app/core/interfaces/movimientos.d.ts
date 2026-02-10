export interface MovimientosPaginationResult {
  movimientos: Movimientos[];
  totalElements: number;
  totalPages: number;
}

interface Movimientos {
  numeroCuenta: number;
  tipo: string;
  saldo: number;
  estado: boolean;
  movimiento: string;
}

interface MovimientoResponse {
  numeroCuenta: string;
  fecha: string;
  valor: number;
  tipo: string;
}
