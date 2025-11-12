export interface Room {
  id: number;
  roomNumber: string;
  type: string;
  price: number;
  available: boolean;
  hotelId: number;
}

export interface CreateRoomRequest {
  roomNumber: string;
  type: string;
  price: number;
  available: boolean;
  hotelId: number;
}

export interface UpdateRoomRequest {
  roomNumber?: string;
  type?: string;
  price?: number;
  available?: boolean;
  hotelId?: number;
}
