import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { ICrudApiService } from './crud-api.service';
import { ApiConfigService } from './api-config.service';
import { Booking, CreateBookingRequest, UpdateBookingRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BookingApiService implements ICrudApiService<Booking, number> {
  
  private readonly endpoint = 'bookings';
  private baseApi: BaseApiService;

  constructor(
    http: HttpClient,
    private apiConfig: ApiConfigService
  ) {
    this.baseApi = new BaseApiService(http);
  }

  getAll(): Observable<Booking[]> {
    const url = this.apiConfig.buildUrl(this.endpoint);
    return this.baseApi['get'](url).pipe(
      map((response: any) => response.data || response)
    );
  }

  getById(id: number): Observable<Booking> {
    const url = this.apiConfig.buildUrl(`${this.endpoint}/${id}`);
    return this.baseApi['get'](url).pipe(
      map((response: any) => response.data || response)
    );
  }

  create(entity: CreateBookingRequest): Observable<Booking> {
    const url = this.apiConfig.buildUrl(this.endpoint);
    return this.baseApi['post'](url, entity).pipe(
      map((response: any) => response.data || response)
    );
  }

  update(id: number, entity: UpdateBookingRequest): Observable<Booking> {
    const url = this.apiConfig.buildUrl(`${this.endpoint}/${id}`);
    return this.baseApi['put'](url, entity).pipe(
      map((response: any) => response.data || response)
    );
  }

  delete(id: number): Observable<void> {
    const url = this.apiConfig.buildUrl(`${this.endpoint}/${id}`);
    return this.baseApi['delete'](url).pipe(
      map(() => undefined)
    );
  }
}
