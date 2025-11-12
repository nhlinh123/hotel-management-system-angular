export interface Asset {
  id: number;
  name: string;
  description: string;
  type: string;
  roomId: number;
}

export interface CreateAssetRequest {
  name: string;
  description: string;
  type: string;
  roomId: number;
}

export interface UpdateAssetRequest {
  name?: string;
  description?: string;
  type?: string;
  roomId?: number;
}
