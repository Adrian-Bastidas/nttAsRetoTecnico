import { Injectable } from '@angular/core';
import { Product, ProductWId } from '../interfaces/product';
import { BehaviorSubject } from 'rxjs';
import apiClient from '../interceptors/axios.interceptor';
import { ShortPopUpService } from './popup.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private popupService: ShortPopUpService) {}

  async loadProducts(): Promise<Product[]> {
    return this.handleRequest<Product[]>({
      request: () => apiClient.get('bp/products'),
      successData: (data) => data || [],
      errorMessage: 'Error al cargar productos',
      fallback: [],
    });
  }

  async createProducts(body: Product): Promise<Product> {
    return this.handleRequest<Product>({
      request: () => apiClient.post('bp/products', body),
      onSuccess: () =>
        this.popupService.showSuccess('Producto creado con éxito'),
      errorMessage: 'Error al crear producto',
      fallback: {} as Product,
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

  async editProduct(id: string, body: ProductWId): Promise<Product> {
    return this.handleRequest<Product>({
      request: () => apiClient.put(`bp/products/${id}`, body),
      onSuccess: () =>
        this.popupService.showSuccess('Producto editado con éxito'),
      errorMessage: 'Error al editar productos',
      fallback: {} as Product,
    });
  }

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
  private productoParaEditar: Product | null = null;
  private productoSubject = new BehaviorSubject<Product | null>(null);

  setProducto(producto: Product): void {
    this.productoParaEditar = producto;
  }

  getProducto(): Product | null {
    return this.productoParaEditar;
  }

  clearProducto(): void {
    this.productoParaEditar = null;
  }

  setDelProducto(producto: Product): void {
    this.productoSubject.next(producto);
  }

  getDelProducto(): Product | null {
    return this.productoSubject.value;
  }

  getProductoObservable() {
    return this.productoSubject.asObservable();
  }

  clearDelProducto(): void {
    this.productoSubject.next(null);
  }
}
