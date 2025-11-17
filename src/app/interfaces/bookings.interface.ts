import { Observable } from 'rxjs';
import { Booking, CreateBookingRequest, UpdateBookingRequest } from '../models';

export interface IBookingsService {
  getBookings(): Observable<Booking[]>;
  getBookingById(id: number): Observable<Booking>;
  getBookingsByRoomId(roomId: number): Observable<Booking[]>;
  createBooking(booking: CreateBookingRequest): Observable<Booking>;
  updateBooking(id: number, booking: UpdateBookingRequest): Observable<Booking>;
  deleteBooking(id: number): Observable<void>;
}
