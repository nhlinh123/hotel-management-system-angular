import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  
  constructor(protected http: HttpClient) {}

  protected get<T>(url: string, options?: any): Observable<T> {
    return this.http.get<T>(url, options) as Observable<T>;
  }

  protected post<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http.post<T>(url, body, options) as Observable<T>;
  }

  protected put<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http.put<T>(url, body, options) as Observable<T>;
  }

  protected patch<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http.patch<T>(url, body, options) as Observable<T>;
  }

  protected delete<T>(url: string, options?: any): Observable<T> {
    return this.http.delete<T>(url, options) as Observable<T>;
  }

  protected getWithParams<T>(url: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.get<T>(url, { params: httpParams });
  }
}
