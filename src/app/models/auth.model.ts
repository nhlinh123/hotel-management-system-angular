export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  jwt: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  roles?: string;
}
