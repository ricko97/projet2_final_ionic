export interface User{
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SignupResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Position{
  latitude: number;
  longitude: number;
}

export interface Trip{
  pathName: string,
  locations: Position[],
  date: string,
  tripId: string,
}

export interface MsgResponse {
  message: string;
}

export interface AddTripResponse {
  message: string;
  tripId: string;
}

export interface SharedTripResponse {
  message: string;
  sharedTripId: string;
}

export interface GetTripsResponse{
  userId: string;
  trips: Trip[]
  shareTripId: Trip[];
}
