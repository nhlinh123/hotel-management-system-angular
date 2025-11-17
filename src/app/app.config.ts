import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './api-proxy';
import { routes } from './app.routes';
import { SERVICE_PROVIDERS } from './injection-tokens/service-providers';
import { AUTHENTICATION_SERVICE_TOKEN } from './injection-tokens/injection-token';
import { AuthenticationService } from './services/authentication.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: AUTHENTICATION_SERVICE_TOKEN,
      useClass: AuthenticationService
    },
    ...SERVICE_PROVIDERS
  ]
};
