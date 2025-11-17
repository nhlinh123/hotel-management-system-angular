export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  checkInDate: string;
  checkOutDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  totalPrice: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export interface CreateBookingRequest {
  roomId: number;
  userId: number;
  checkInDate: string;
  checkOutDate: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export interface UpdateBookingRequest {
  checkInDate?: string;
  checkOutDate?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}
