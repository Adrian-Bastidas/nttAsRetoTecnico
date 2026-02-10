import { Injectable } from '@angular/core';
import { ShortPopUpService } from '../popup.service';
import {
  MovimientoResponse,
  Movimientos,
  MovimientosPaginationResult,
} from '../../interfaces/movimientos';
import { PageResponse } from '../../interfaces/clientes';
import { environment } from 'src/environments/environment';
import apiClient from '../../interceptors/axios.interceptor';

@Injectable({
  providedIn: 'root',
})
export class MovimientosService {
  constructor(private popupService: ShortPopUpService) {}
  async loadPaginatedCuentas(
    page: number,
    size: number,
  ): Promise<MovimientosPaginationResult> {
    return this.handleRequest<MovimientosPaginationResult>({
      request: () =>
        apiClient.get<PageResponse<Movimientos>>(
          environment.API_BASE_URL_2 + '/movimientos/paginated',
          {
            params: { page, size },
          },
        ),

      successData: (pageResponse) => ({
        movimientos: pageResponse.content ?? [],
        totalElements: pageResponse.totalElements ?? 0,
        totalPages: pageResponse.totalPages ?? 0,
      }),

      errorMessage: 'Error al cargar los cuentas',
      fallback: {
        movimientos: [],
        totalElements: 0,
        totalPages: 0,
      },
    });
  }

  async loadPaginatedMovimientosById(
    identificacion: string,
    page: number,
    size: number,
  ): Promise<MovimientosPaginationResult> {
    return this.handleRequest<MovimientosPaginationResult>({
      request: () =>
        apiClient.get<PageResponse<Movimientos>>(
          environment.API_BASE_URL_2 +
            `/movimientos/cuenta/paginate/${identificacion}`,
          {
            params: { page, size },
          },
        ),

      successData: (pageResponse) => ({
        movimientos: pageResponse.content ?? [],
        totalElements: pageResponse.totalElements ?? 0,
        totalPages: pageResponse.totalPages ?? 0,
      }),

      errorMessage: 'Error al cargar los cuentas',
      fallback: {
        movimientos: [],
        totalElements: 0,
        totalPages: 0,
      },
    });
  }

  async createMovimiento(body: MovimientoResponse): Promise<Movimientos> {
    return this.handleRequest<Movimientos>({
      request: () =>
        apiClient.post(environment.API_BASE_URL_2 + '/movimientos', body),
      onSuccess: () =>
        this.popupService.showSuccess('Movimiento creado con éxito'),
      errorMessage: 'Error al crear el movimiento',
      fallback: {} as Movimientos,
    });
  }

  async editMovimiento(
    id: string,
    body: MovimientoResponse,
  ): Promise<MovimientoResponse> {
    return this.handleRequest<MovimientoResponse>({
      request: () =>
        apiClient.put(environment.API_BASE_URL_2 + `/movimientos/${id}`, body),
      onSuccess: () =>
        this.popupService.showSuccess('Movimiento editado con éxito'),
      errorMessage: 'Error al editar movimiento',
      fallback: {} as MovimientoResponse,
    });
  }

  async deleteMovimiento(id: string): Promise<string> {
    return this.handleRequest<string>({
      request: () =>
        apiClient.delete(environment.API_BASE_URL_2 + `/movimientos/${id}`),
      successData: (data) => {
        const message = data?.message ?? 'Movimiento eliminado con éxito';
        this.popupService.showSuccess(message);
        return message;
      },
      errorMessage: 'Error al eliminar movimiento',
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
    } catch (error: any) {
      console.error(` ${errorMessage}:`, error);

      const serverMessage =
        error?.response?.data?.message || error?.response?.data?.error || null;

      this.popupService.showError(serverMessage ?? errorMessage);

      return fallback;
    }
  }
}
