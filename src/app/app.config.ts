import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { OAuthStorage, provideOAuthClient } from 'angular-oauth2-oidc';

export function storageFactory(): OAuthStorage {
  return localStorage;
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    importProvidersFrom(HttpClientModule),
  ],
};
