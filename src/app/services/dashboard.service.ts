import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { HotelApiService } from '../api-proxy/hotel-api.service';
import { RoomApiService } from '../api-proxy/room-api.service';
import { IDashboardService, DashboardStats, HotelStat } from '../interfaces/dashboard.interface';
import { Hotel, Room } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements IDashboardService {
  constructor(
    private hotelApi: HotelApiService,
    private roomApi: RoomApiService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return combineLatest([
      this.hotelApi.getAll(),
      this.roomApi.getAll()
    ]).pipe(
      map(([hotels, rooms]) => this.calculateStats(hotels, rooms))
    );
  }

  private calculateStats(hotels: Hotel[], rooms: Room[]): DashboardStats {
    const totalHotels = hotels.length;
    const totalRooms = rooms.length;
    const bookedRooms = rooms.filter(r => !r.available).length;
    const availableRooms = rooms.filter(r => r.available).length;

    const hotelStats: HotelStat[] = hotels.map(hotel => {
      const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
      return {
        hotel,
        totalRooms: hotelRooms.length,
        bookedRooms: hotelRooms.filter(r => !r.available).length,
        availableRooms: hotelRooms.filter(r => r.available).length
      };
    });

    return {
      totalHotels,
      totalRooms,
      bookedRooms,
      availableRooms,
      hotelStats
    };
  }
}
