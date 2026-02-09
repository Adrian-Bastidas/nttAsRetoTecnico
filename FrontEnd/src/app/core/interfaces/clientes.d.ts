export interface Cliente {
  clienteId: number;
  nombre: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  estado: boolean;
}

export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ClientePageResponse {
  data: PageResponse<Cliente>;
}
export interface ClientePaginationResult {
  clientes: Cliente[];
  totalElements: number;
  totalPages: number;
}
