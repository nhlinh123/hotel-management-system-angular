import {Injectable} from '@angular/core';
import {IAuthentication} from '../interfaces/authentication.interface';
import {Router} from '@angular/router';
import {AuthApiService} from '../api-proxy';
import {Observable} from 'rxjs';
import {AuthenticationRequest, AuthenticationResponse} from '../models';
import { TokenStorageService } from '../api-proxy/token-storage.service';
import { NAVIGATION_ROUTES } from '../config/navigation.config';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements IAuthentication {
  constructor(
    private router: Router,
    private authApiService: AuthApiService,
    private tokenStorage: TokenStorageService
  ) {
  }

  login(credentials: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.authApiService.login(credentials);
  }

  logout(): void {
    this.authApiService.logout();
    this.router.navigate([NAVIGATION_ROUTES.LOGIN]);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authApiService.isAuthenticated();
  }

  isAuthenticatedSync(): boolean {
    return this.authApiService.isAuthenticatedSync();
  }

  getCurrentUser(): any {
    return this.tokenStorage.getUser();
  }

  getCurrentUserObservable(): Observable<any> {
    return this.authApiService.getCurrentUser();
  }

  setCurrentUser(user: any): void {
    this.authApiService.setCurrentUser(user);
  }

  getToken(): string | null {
    return this.authApiService.getToken();
  }
}
