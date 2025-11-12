export interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
}

export interface CreateHotelRequest {
  name: string;
  address: string;
  city: string;
  country: string;
}

export interface UpdateHotelRequest {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
}
