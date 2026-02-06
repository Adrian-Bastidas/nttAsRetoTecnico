// src/app/services/short-pop-up.service.ts
import { Injectable, signal } from '@angular/core';

export type PopupType = 'success' | 'error';

export interface PopupState {
  show: boolean;
  type: PopupType;
  message: string;
  showAcceptButton: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ShortPopUpService {
  // Estado del popup que será consumido por el componente contenedor
  popupState = signal<PopupState>({
    show: false,
    type: 'success',
    message: '',
    showAcceptButton: true,
  });

  // Método para mostrar mensajes de error
  showError(message: string, showAcceptButton = true): void {
    this.popupState.set({
      show: true,
      type: 'error',
      message,
      showAcceptButton,
    });

    // Opcional: cerrar automáticamente después de un tiempo
    if (!showAcceptButton) {
      setTimeout(() => {
        this.hide();
      }, 3000);
    }
  }

  // Método para mostrar mensajes de éxito
  showSuccess(message: string, showAcceptButton = true): void {
    this.popupState.set({
      show: true,
      type: 'success',
      message,
      showAcceptButton,
    });

    // Los mensajes de éxito generalmente se cierran automáticamente
    if (!showAcceptButton) {
      setTimeout(() => {
        this.hide();
      }, 3000);
    }
  }

  // Método para ocultar el popup
  hide(): void {
    this.popupState.update((state) => ({
      ...state,
      show: false,
    }));
  }
}
