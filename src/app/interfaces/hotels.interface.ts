import { Observable } from 'rxjs';
import { Hotel, CreateHotelRequest, UpdateHotelRequest } from '../models';

export interface IHotelsService {
  getHotels(): Observable<Hotel[]>;
  getHotelById(id: number): Observable<Hotel>;
  createHotel(hotel: CreateHotelRequest): Observable<Hotel>;
  updateHotel(id: number, hotel: UpdateHotelRequest): Observable<Hotel>;
  deleteHotel(id: number): Observable<void>;
}
