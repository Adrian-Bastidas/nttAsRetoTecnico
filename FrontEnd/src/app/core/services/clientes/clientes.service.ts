import { Injectable } from '@angular/core';
import { ShortPopUpService } from '../popup.service';
import {
  Cliente,
  ClientePageResponse,
  ClientePaginationResult,
  PageResponse,
} from '../../interfaces/clientes';
import apiClient from '../../interceptors/axios.interceptor';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor(private popupService: ShortPopUpService) {}
  async loadPaginatedClientes(
    page: number,
    size: number,
  ): Promise<ClientePaginationResult> {
    return this.handleRequest<ClientePaginationResult>({
      request: () =>
        apiClient.get<PageResponse<Cliente>>('/clientes/paginated', {
          params: { page, size },
        }),

      successData: (pageResponse) => ({
        clientes: pageResponse.content ?? [],
        totalElements: pageResponse.totalElements ?? 0,
        totalPages: pageResponse.totalPages ?? 0,
      }),

      errorMessage: 'Error al cargar los clientes',
      fallback: {
        clientes: [],
        totalElements: 0,
        totalPages: 0,
      },
    });
  }

  async loadPaginatedClientesById(
    identificacion: string,
    page: number,
    size: number,
  ): Promise<ClientePaginationResult> {
    return this.handleRequest<ClientePaginationResult>({
      request: () =>
        apiClient.get<PageResponse<Cliente>>(
          `/clientes/paginated/${identificacion}`,
          {
            params: { page, size },
          },
        ),

      successData: (pageResponse) => ({
        clientes: pageResponse.content ?? [],
        totalElements: pageResponse.totalElements ?? 0,
        totalPages: pageResponse.totalPages ?? 0,
      }),

      errorMessage: 'Error al cargar los clientes',
      fallback: {
        clientes: [],
        totalElements: 0,
        totalPages: 0,
      },
    });
  }

  async createProducts(body: Cliente): Promise<Cliente> {
    return this.handleRequest<Cliente>({
      request: () => apiClient.post('bp/products', body),
      onSuccess: () =>
        this.popupService.showSuccess('Producto creado con éxito'),
      errorMessage: 'Error al crear producto',
      fallback: {} as Cliente,
    });
  }

  async validateId(id: string): Promise<boolean> {
    return this.handleRequest<boolean>({
      request: () => apiClient.get(`bp/products/verification/${id}`),
      successData: (data) => data ?? false,
      errorMessage: 'Error al validar productos',
      fallback: false,
    });
  }

  // async editProduct(id: string, body: ProductWId): Promise<Cliente> {
  //   return this.handleRequest<Cliente>({
  //     request: () => apiClient.put(`bp/products/${id}`, body),
  //     onSuccess: () =>
  //       this.popupService.showSuccess('Producto editado con éxito'),
  //     errorMessage: 'Error al editar productos',
  //     fallback: {} as Cliente,
  //   });
  // }

  async deleteProduct(id: string): Promise<string> {
    return this.handleRequest<string>({
      request: () => apiClient.delete(`bp/products/${id}`),
      successData: (data) => {
        const message = data?.message ?? 'Producto eliminado con éxito';
        this.popupService.showSuccess(message);
        return message;
      },
      errorMessage: 'Error al eliminar producto',
      fallback: '',
    });
  }

  private async handleRequest<T>({
    request,
    onSuccess,
    successData,
    errorMessage,
    fallback,
  }: {
    request: () => Promise<any>;
    onSuccess?: () => void;
    successData?: (data: any) => T;
    errorMessage: string;
    fallback: T;
  }): Promise<T> {
    try {
      const response = await request();
      onSuccess?.();
      const data = response?.data?.data ?? response?.data;
      return successData ? successData(data) : data;
    } catch (error) {
      console.error(`❌ ${errorMessage}:`, error);
      this.popupService.showError(errorMessage);
      return fallback;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProductoInternalService {
  private productoParaEditar: Cliente | null = null;
  private productoSubject = new BehaviorSubject<Cliente | null>(null);

  setProducto(producto: Cliente): void {
    this.productoParaEditar = producto;
  }

  getProducto(): Cliente | null {
    return this.productoParaEditar;
  }

  clearProducto(): void {
    this.productoParaEditar = null;
  }

  setDelProducto(producto: Cliente): void {
    this.productoSubject.next(producto);
  }

  getDelProducto(): Cliente | null {
    return this.productoSubject.value;
  }

  getProductoObservable() {
    return this.productoSubject.asObservable();
  }

  clearDelProducto(): void {
    this.productoSubject.next(null);
  }
}
