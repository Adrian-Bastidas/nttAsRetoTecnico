import { Injectable } from '@angular/core';
import { ShortPopUpService } from '../popup.service';
import {
  CreateCuenta,
  CuentaResponseVo,
  CuentasPaginationResult,
} from '../../interfaces/cuentas';
import apiClient from '../../interceptors/axios.interceptor';
import { PageResponse } from '../../interfaces/clientes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CuentasService {
  constructor(private popupService: ShortPopUpService) {}
  async loadPaginatedCuentas(
    page: number,
    size: number,
  ): Promise<CuentasPaginationResult> {
    return this.handleRequest<CuentasPaginationResult>({
      request: () =>
        apiClient.get<PageResponse<CuentaResponseVo>>(
          environment.API_BASE_URL_2 + '/cuentas/pageable',
          {
            params: { page, size },
          },
        ),

      successData: (pageResponse) => ({
        cuentas: pageResponse.content ?? [],
        totalElements: pageResponse.totalElements ?? 0,
        totalPages: pageResponse.totalPages ?? 0,
      }),

      errorMessage: 'Error al cargar los cuentas',
      fallback: {
        cuentas: [],
        totalElements: 0,
        totalPages: 0,
      },
    });
  }

  async loadPaginatedCuentasById(
    identificacion: string,
    page: number,
    size: number,
  ): Promise<CuentasPaginationResult> {
    return this.handleRequest<CuentasPaginationResult>({
      request: () =>
        apiClient.get<PageResponse<CuentaResponseVo>>(
          environment.API_BASE_URL_2 +
            `/cuentas/pageable/cedula/${identificacion}`,
          {
            params: { page, size },
          },
        ),

      successData: (pageResponse) => ({
        cuentas: pageResponse.content ?? [],
        totalElements: pageResponse.totalElements ?? 0,
        totalPages: pageResponse.totalPages ?? 0,
      }),

      errorMessage: 'Error al cargar los cuentas',
      fallback: {
        cuentas: [],
        totalElements: 0,
        totalPages: 0,
      },
    });
  }

  async createCuentas(body: CreateCuenta): Promise<CuentaResponseVo> {
    return this.handleRequest<CuentaResponseVo>({
      request: () =>
        apiClient.post(environment.API_BASE_URL_2 + '/cuentas', body),
      onSuccess: () => this.popupService.showSuccess('Cuenta creada con éxito'),
      errorMessage: 'Error al crear cuenta',
      fallback: {} as CuentaResponseVo,
    });
  }

  async editCuenta(id: string, body: CreateCuenta): Promise<CuentaResponseVo> {
    return this.handleRequest<CuentaResponseVo>({
      request: () =>
        apiClient.put(environment.API_BASE_URL_2 + `/cuentas/${id}`, body),
      onSuccess: () =>
        this.popupService.showSuccess('Cuenta editada con éxito'),
      errorMessage: 'Error al editar cuenta',
      fallback: {} as CuentaResponseVo,
    });
  }

  async deleteCuenta(id: string): Promise<string> {
    return this.handleRequest<string>({
      request: () =>
        apiClient.delete(environment.API_BASE_URL_2 + `/cuentas/${id}`),
      successData: (data) => {
        const message = data?.message ?? 'Cuenta eliminada con éxito';
        this.popupService.showSuccess(message);
        return message;
      },
      errorMessage: 'Error al eliminar cuenta',
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
