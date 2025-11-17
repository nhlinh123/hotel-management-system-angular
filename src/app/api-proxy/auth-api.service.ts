import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { ApiConfigService } from './api-config.service';
import { 
  AuthenticationRequest, 
  AuthenticationResponse, 
  RegisterRequest
} from '../models';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  
  private readonly endpoint = 'auth';
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private currentUser$ = new BehaviorSubject<any>(null);
  private baseApi: BaseApiService;

  constructor(
    http: HttpClient,
    private apiConfig: ApiConfigService,
    private tokenStorage: TokenStorageService
  ) {
    this.baseApi = new BaseApiService(http);
    this.checkAuthentication();
  }

  login(credentials: AuthenticationRequest): Observable<AuthenticationResponse> {
    const url = this.apiConfig.buildUrl(`${this.endpoint}/login`);
    return this.baseApi['post'](url, credentials).pipe(
      tap((response: any) => {
        console.log('AuthApiService - Login response:', response);
        
        // Extract token from response
        let token: string | null = null;
        
        if (response?.data?.jwt) {
          token = response.data.jwt;
        } else if (response?.jwt) {
          token = response.jwt;
        } else if (response?.token) {
          token = response.token;
        }
        
        console.log('AuthApiService - Extracted token:', !!token);
        
        if (token) {
          this.tokenStorage.saveToken(token);
          console.log('AuthApiService - Token saved to storage');
          this.isAuthenticated$.next(true);
        } else {
          console.warn('AuthApiService - No token found in response');
        }
      }),
      map((response: any) => response.data || response)
    );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    const url = this.apiConfig.buildUrl(`${this.endpoint}/register`);
    return this.baseApi['post'](url, registerRequest).pipe(
      map((response: any) => response.data || response)
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.isAuthenticated$.next(false);
    this.currentUser$.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  isAuthenticatedSync(): boolean {
    return this.isAuthenticated$.value;
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser$.asObservable();
  }

  setCurrentUser(user: any): void {
    console.log('AuthApiService - Setting current user:', user);
    this.currentUser$.next(user);
    this.tokenStorage.saveUser(user);
  }

  private checkAuthentication(): void {
    if (this.tokenStorage.hasToken()) {
      console.log('AuthApiService - Token found in storage, marking as authenticated');
      this.isAuthenticated$.next(true);
      const user = this.tokenStorage.getUser();
      if (user) {
        this.currentUser$.next(user);
      }
    }
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }
}
