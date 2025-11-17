import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomApiService } from '../api-proxy/room-api.service';
import { IRoomsService } from '../interfaces/rooms.interface';
import { Room, CreateRoomRequest, UpdateRoomRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoomsService implements IRoomsService {
  constructor(private roomApi: RoomApiService) {}

  getRooms(): Observable<Room[]> {
    return this.roomApi.getAll();
  }

  getRoomById(id: number): Observable<Room> {
    return this.roomApi.getById(id);
  }

  getRoomsByHotelId(hotelId: number): Observable<Room[]> {
    return this.roomApi.getAll().pipe(
      map(rooms => rooms.filter(r => r.hotelId === hotelId))
    );
  }

  createRoom(room: CreateRoomRequest): Observable<Room> {
    return this.roomApi.create(room);
  }

  updateRoom(id: number, room: UpdateRoomRequest): Observable<Room> {
    return this.roomApi.update(id, room);
  }

  deleteRoom(id: number): Observable<void> {
    return this.roomApi.delete(id);
  }
}
