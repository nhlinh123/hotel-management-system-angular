import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { ICrudApiService } from './crud-api.service';
import { ApiConfigService } from './api-config.service';
import { Hotel, CreateHotelRequest, UpdateHotelRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HotelApiService implements ICrudApiService<Hotel, number> {
  
  private readonly endpoint = 'hotels';
  private baseApi: BaseApiService;

  constructor(
    http: HttpClient,
    private apiConfig: ApiConfigService
  ) {
    this.baseApi = new BaseApiService(http);
  }

  getAll(): Observable<Hotel[]> {
    const url = this.apiConfig.buildUrl(this.endpoint);
    return this.baseApi['get'](url).pipe(
      map((response: any) => response.data || response)
    );
  }

  getById(id: number): Observable<Hotel> {
    const url = this.apiConfig.buildUrl(`${this.endpoint}/${id}`);
    return this.baseApi['get'](url).pipe(
      map((response: any) => response.data || response)
    );
  }

  create(entity: CreateHotelRequest): Observable<Hotel> {
    const url = this.apiConfig.buildUrl(this.endpoint);
    return this.baseApi['post'](url, entity).pipe(
      map((response: any) => response.data || response)
    );
  }

  update(id: number, entity: UpdateHotelRequest): Observable<Hotel> {
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
