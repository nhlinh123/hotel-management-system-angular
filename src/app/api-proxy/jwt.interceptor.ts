import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  
  constructor(private tokenStorage: TokenStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenStorage.getToken();
    
    console.log('[JwtInterceptor] URL:', req.url);
    console.log('[JwtInterceptor] Token:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('[JwtInterceptor] Is Auth Endpoint:', this.isAuthEndpoint(req.url));

    // Don't add token to auth endpoints
    if (this.isAuthEndpoint(req.url)) {
      console.log('[JwtInterceptor] Skipping token for auth endpoint');
      return next.handle(req);
    }

    // Add token to all other endpoints
    if (token) {
      console.log('[JwtInterceptor] Adding Bearer token to request');
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[JwtInterceptor] Headers after clone:', clonedReq.headers.get('Authorization'));
      return next.handle(clonedReq);
    } else {
      console.warn('[JwtInterceptor] No token available for protected endpoint:', req.url);
      return next.handle(req);
    }
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/logout');
  }
}
