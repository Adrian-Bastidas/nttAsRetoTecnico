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
  popupState = signal<PopupState>({
    show: false,
    type: 'success',
    message: '',
    showAcceptButton: true,
  });

  showError(message: string, showAcceptButton = true): void {
    this.popupState.set({
      show: true,
      type: 'error',
      message,
      showAcceptButton,
    });

    if (!showAcceptButton) {
      setTimeout(() => {
        this.hide();
      }, 3000);
    }
  }

  showSuccess(message: string, showAcceptButton = true): void {
    this.popupState.set({
      show: true,
      type: 'success',
      message,
      showAcceptButton,
    });

    if (!showAcceptButton) {
      setTimeout(() => {
        this.hide();
      }, 3000);
    }
  }

  hide(): void {
    this.popupState.update((state) => ({
      ...state,
      show: false,
    }));
  }
}
