import { Injectable } from '@angular/core';
import { ShortPopUpService } from '../popup.service';
import {
  Cliente,
  ClientePaginationResult,
  PageResponse,
} from '../../interfaces/clientes';
import apiClient from '../../interceptors/axios.interceptor';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

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
        apiClient.get<PageResponse<Cliente>>(
          environment.API_BASE_URL + '/clientes/paginated',
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

  async loadPaginatedClientesById(
    identificacion: string,
    page: number,
    size: number,
  ): Promise<ClientePaginationResult> {
    return this.handleRequest<ClientePaginationResult>({
      request: () =>
        apiClient.get<PageResponse<Cliente>>(
          environment.API_BASE_URL + `/clientes/paginated/${identificacion}`,
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

  async createClients(body: Cliente): Promise<Cliente> {
    return this.handleRequest<Cliente>({
      request: () =>
        apiClient.post(environment.API_BASE_URL + '/clientes', body),
      onSuccess: () =>
        this.popupService.showSuccess('Cliente creado con éxito'),
      errorMessage: 'Error al crear cliente',
      fallback: {} as Cliente,
    });
  }

  async editClient(id: string, body: Cliente): Promise<Cliente> {
    return this.handleRequest<Cliente>({
      request: () =>
        apiClient.put(environment.API_BASE_URL + `/clientes/${id}`, body),
      onSuccess: () =>
        this.popupService.showSuccess('Cliente editado con éxito'),
      errorMessage: 'Error al editar clientes',
      fallback: {} as Cliente,
    });
  }

  async deleteClient(id: string): Promise<string> {
    return this.handleRequest<string>({
      request: () =>
        apiClient.delete(environment.API_BASE_URL + `/clientes/${id}`),
      successData: (data) => {
        const message = data?.message ?? 'Cliente eliminado con éxito';
        this.popupService.showSuccess(message);
        return message;
      },
      errorMessage: 'Error al eliminar cliente',
      fallback: '',
    });
  }

  async loadClientesById(identificacion: string): Promise<Cliente> {
    return this.handleRequest<Cliente>({
      request: () =>
        apiClient.get<Cliente>(
          environment.API_BASE_URL + `/clientes/cedula/${identificacion}`,
        ),

      successData: (cliente) => cliente,

      errorMessage: 'Error al cargar los clientes',
      fallback: {} as Cliente,
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
    } catch (error: any) {
      console.error(` ${errorMessage}:`, error);

      const serverMessage =
        error?.response?.data?.message || error?.response?.data?.error || null;

      this.popupService.showError(serverMessage ?? errorMessage);

      return fallback;
    }
  }
}
