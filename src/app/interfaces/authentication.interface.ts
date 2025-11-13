import {Observable} from 'rxjs';
import {AuthenticationRequest, AuthenticationResponse} from '../models';
import {Injector} from '@angular/core';
import {Router} from '@angular/router';
import {AuthApiService} from '../api-proxy';
import {AuthenticationService} from '../services/authentication.service';

export const authenticationFactory = (injector: Injector) => {
  const router = injector.get(Router);
  const authApiService = injector.get(AuthApiService);
  return new AuthenticationService(
    router,
    authApiService
  )
}

export interface IAuthentication {
  login(credentials: AuthenticationRequest): Observable<AuthenticationResponse>;
  logout(): void;
  isAuthenticated(): Observable<boolean>;
  isAuthenticatedSync(): boolean;
  getCurrentUser(): Observable<any>;
  setCurrentUser(user: any): void;
  getToken(): string | null;
}
