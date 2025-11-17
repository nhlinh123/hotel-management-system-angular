import { Observable } from 'rxjs';

export interface DashboardStats {
  totalHotels: number;
  totalRooms: number;
  bookedRooms: number;
  availableRooms: number;
  hotelStats: HotelStat[];
}

export interface HotelStat {
  hotel: any;
  totalRooms: number;
  bookedRooms: number;
  availableRooms: number;
}

export interface IDashboardService {
  getDashboardStats(): Observable<DashboardStats>;
}
