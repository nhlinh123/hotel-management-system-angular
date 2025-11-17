import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingApiService } from '../api-proxy/booking-api.service';
import { IBookingsService } from '../interfaces/bookings.interface';
import { Booking, CreateBookingRequest, UpdateBookingRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BookingsService implements IBookingsService {
  constructor(private bookingApi: BookingApiService) {}

  getBookings(): Observable<Booking[]> {
    return this.bookingApi.getAll();
  }

  getBookingById(id: number): Observable<Booking> {
    return this.bookingApi.getById(id);
  }

  getBookingsByRoomId(roomId: number): Observable<Booking[]> {
    return this.bookingApi.getAll().pipe(
      map(bookings => bookings.filter(b => b.roomId === roomId))
    );
  }

  createBooking(booking: CreateBookingRequest): Observable<Booking> {
    return this.bookingApi.create(booking);
  }

  updateBooking(id: number, booking: UpdateBookingRequest): Observable<Booking> {
    return this.bookingApi.update(id, booking);
  }

  deleteBooking(id: number): Observable<void> {
    return this.bookingApi.delete(id);
  }
}
