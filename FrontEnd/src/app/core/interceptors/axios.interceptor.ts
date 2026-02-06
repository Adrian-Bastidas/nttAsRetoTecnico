import { environment } from '@envs/environment';
import axios, { AxiosError } from 'axios';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { ShortPopUpService } from '../services/popup.service';

const apiClient = axios.create({
  baseURL: environment.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

export function setupAxiosInterceptors() {
  const loaderService = new LoaderService();
  const router = inject(Router);
  const popupService = inject(ShortPopUpService);

  apiClient.interceptors.request.use(
    (config) => {
      loaderService.show();
      console.log(
        '🔄 Enviando request:',
        config.method?.toUpperCase(),
        config.url,
      );
      return config;
    },
    (error) => {
      debugger;
      loaderService.hide();
      console.error('❌ Error en request:', error);
      return Promise.reject(error);
    },
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.log('✅ Respuesta recibida:', response.status, response.data);
      loaderService.hide();
      return response;
    },
    (error) => {
      debugger;
      loaderService.hide();
      console.error('⚠️ Error capturado en interceptor:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data as any;

        const errorMessage = getErrorMessage(error);
        if (!error.response && error.code === 'ERR_NETWORK') {
          console.error('🌐 Posible error de CORS o red');
          popupService.showError(
            'No se pudo conectar con el servidor. Verifique su conexión o configuración de CORS.',
          );
          return;
        }

        switch (status) {
          case 401:
            console.warn('⚠️ No autorizado. Redirigiendo...');
            popupService.showError(
              'Sesión expirada o no válida. Por favor, inicie sesión nuevamente.',
            );
            router.navigate(['/login']);
            break;

          case 403:
            console.warn('⛔ Prohibido');
            popupService.showError(
              'No tiene permisos para realizar esta acción.',
            );
            break;

          case 404:
            console.error('⚠️ Recurso no encontrado');
            popupService.showError('El recurso solicitado no existe.');
            break;

          case 422:
            console.error('⚠️ Error de validación');
            const validationErrors = formatValidationErrors(errorData);
            popupService.showError(
              validationErrors || 'Error de validación en el formulario.',
            );
            break;

          case 500:
            console.error('💥 Error interno del servidor');
            popupService.showError(
              'Error interno del servidor. Por favor, intente más tarde.',
            );
            break;

          case 503:
            console.error('⚠️ Servicio no disponible');
            popupService.showError(
              'Servicio no disponible. Por favor, intente más tarde.',
            );
            break;

          default:
            if (!navigator.onLine) {
              console.error('⚠️ Sin conexión a Internet');
              popupService.showError(
                'Sin conexión a Internet. Verifique su conexión e intente nuevamente.',
              );
            } else {
              console.error('❗ Error desconocido', status);
              popupService.showError(
                errorMessage || 'Ha ocurrido un error inesperado.',
              );
            }
        }

        console.error('❌ Error detallado:', {
          status,
          url: error.config?.url,
          method: error.config?.method,
          message: errorMessage,
          data: error.response?.data,
        });
      } else {
        console.error('❌ Error no Axios:', error);
        popupService.showError('Error al procesar la solicitud.');
      }

      return Promise.reject(error);
    },
  );
}

function getErrorMessage(error: AxiosError): string {
  const data = error.response?.data as any;

  if (!data) return 'Error de conexión';

  if (typeof data === 'string') return data;
  if (data.message) return data.message;
  if (data.error)
    return typeof data.error === 'string'
      ? data.error
      : 'Error en la solicitud';
  if (data.errors && Array.isArray(data.errors)) return data.errors.join(', ');

  return 'Error en la solicitud';
}

function formatValidationErrors(errorData: any): string {
  if (!errorData) return '';

  if (errorData.errors && typeof errorData.errors === 'object') {
    const errorMessages: string[] = [];
    for (const field in errorData.errors) {
      if (Array.isArray(errorData.errors[field])) {
        errorMessages.push(errorData.errors[field].join(' '));
      }
    }
    return errorMessages.join('\n');
  }

  if (errorData.details && Array.isArray(errorData.details)) {
    return errorData.details.map((item: any) => item.message).join('\n');
  }

  return '';
}
