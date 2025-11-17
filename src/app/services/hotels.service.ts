import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HotelApiService } from '../api-proxy/hotel-api.service';
import { IHotelsService } from '../interfaces/hotels.interface';
import { Hotel, CreateHotelRequest, UpdateHotelRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HotelsService implements IHotelsService {
  constructor(private hotelApi: HotelApiService) {}

  getHotels(): Observable<Hotel[]> {
    return this.hotelApi.getAll();
  }

  getHotelById(id: number): Observable<Hotel> {
    return this.hotelApi.getById(id);
  }

  createHotel(hotel: CreateHotelRequest): Observable<Hotel> {
    return this.hotelApi.create(hotel);
  }

  updateHotel(id: number, hotel: UpdateHotelRequest): Observable<Hotel> {
    return this.hotelApi.update(id, hotel);
  }

  deleteHotel(id: number): Observable<void> {
    return this.hotelApi.delete(id);
  }
}
