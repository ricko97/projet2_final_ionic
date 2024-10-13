import axios, {AxiosResponse} from "axios";
import {
  AddTripResponse,
  GetTripsResponse,
  LoginRequest,
  LoginResponse,
  MsgResponse, Position,
  SharedTripResponse,
  SignupRequest,
  SignupResponse
} from "./models";

const API_URL = "https://server-1-t93s.onrender.com/api/tp";

export const loginAction = async ({
  email,
  password,
}: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
  return await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
};

export const signupAction = async ({
  firstName,
  lastName,
  email,
  password,
}: SignupRequest): Promise<AxiosResponse<SignupResponse>> => {
  return await axios.post(`${API_URL}/signup`, {
    firstName,
    lastName,
    email,
    password,
  });
};

export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<string> => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.display_name || "Unknown address";
  } catch (error) {
    console.error("Error with reverse geocoding:", error);
    return "Unable to retrieve address";
  }
};

export const updateUser = async (
    userId: string,
    firstName: string,
    lastName: string
): Promise<AxiosResponse> => {
  return await axios.put(`${API_URL}/update-user`, {
    userId,
    firstName,
    lastName,
  });
};

export const changePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string
): Promise<AxiosResponse<MsgResponse>> => {
  return await axios.post(`${API_URL}/change-password`, {
    userId,
    oldPassword,
    newPassword,
  });
};


export const getTripsByUserId = async (
    userId: string
): Promise<GetTripsResponse> => {
  return await axios.get(`${API_URL}/get-trips/${userId}`);
};


export const addTrip = async (
    pathName: string,
    userId: string,
    trips: any[]
): Promise<AxiosResponse<AddTripResponse>> => {
  return await axios.post(`${API_URL}/add-trip`, {
    pathName,
    userId,
    trips,
  });
};


export const shareTrip = async (
    tripId: string,
    email: string
): Promise<AxiosResponse<SharedTripResponse>> => {
  return await axios.post(`${API_URL}/share-trip`, {
    tripId,
    email,
  });
};


export const deleteTrip = async (
    userId: string,
    tripId: string
): Promise<AxiosResponse<MsgResponse>> => {
  return await axios.delete(`${API_URL}/delete-trip`, {
    data: {userId, tripId},
  });
};


export const saveTrip = async (
    userId: string,
    pathName: string,
    locations: Position[]
): Promise<AxiosResponse<AddTripResponse>> => {
  return await axios.post(`${API_URL}/add-trip`, {
    userId,
    pathName,
    locations,
  });
};

