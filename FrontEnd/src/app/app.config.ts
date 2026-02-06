import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { setupAxiosInterceptors } from './core/interceptors/axios.interceptor';
import { ShortPopUpService } from './core/services/popup.service';

export function initializeAxiosInterceptors() {
  return () => {
    setupAxiosInterceptors();
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    ShortPopUpService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAxiosInterceptors,
      deps: [ShortPopUpService],
      multi: true,
    },
  ],
};
