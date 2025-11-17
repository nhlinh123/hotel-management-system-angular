import { Observable } from 'rxjs';
import { Room, CreateRoomRequest, UpdateRoomRequest } from '../models';

export interface IRoomsService {
  getRooms(): Observable<Room[]>;
  getRoomById(id: number): Observable<Room>;
  getRoomsByHotelId(hotelId: number): Observable<Room[]>;
  createRoom(room: CreateRoomRequest): Observable<Room>;
  updateRoom(id: number, room: UpdateRoomRequest): Observable<Room>;
  deleteRoom(id: number): Observable<void>;
}
