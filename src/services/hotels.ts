import { api } from "./api";
import type { Hotel, Paginated, Review, Room } from "../types/api";

export type HotelSearchParams = {
  q?: string;
  latitude?: string;
  longitude?: string;
  radiusKm?: string;
  minPrice?: string;
  maxPrice?: string;
  capacity?: string;
  sort?: string;
  page?: number;
};

export async function listHotels(params: HotelSearchParams) {
  const { data } = await api.get<Paginated<Hotel> & { success: boolean }>(
    "/hotels",
    { params },
  );
  return data;
}

export async function getHotel(id: string) {
  const { data } = await api.get<{ success: boolean; data: Hotel }>(
    `/hotels/${id}`,
  );
  return data.data;
}

export const listHotelRooms = async (
  hotelId: string,
  checkIn?: string,
  checkOut?: string,
) => {
  let url = `/rooms/hotel/${hotelId}`;

  if (checkIn && checkOut) {
    url += `?checkIn=${checkIn}&checkOut=${checkOut}`;
  }

  const res = await api.get(url);
  return res.data.data;
};

export async function listHotelReviews(hotelId: string) {
  const { data } = await api.get<{ success: boolean; data: Review[] }>(
    `/reviews/hotel/${hotelId}`,
  );
  return data.data;
}

export async function createHotel(payload: Partial<Hotel>) {
  const { data } = await api.post<{ success: boolean; data: Hotel }>(
    "/hotels",
    payload,
  );
  return data.data;
}

export async function updateHotel(id: string, payload: Partial<Hotel>) {
  const { data } = await api.patch<{ success: boolean; data: Hotel }>(
    `/hotels/${id}`,
    payload,
  );
  return data.data;
}

export async function approveHotel(
  id: string,
  status: "APPROVED" | "REJECTED",
) {
  const { data } = await api.patch<{ success: boolean; data: Hotel }>(
    `/hotels/${id}/approval`,
    { status },
  );
  return data.data;
}

export async function myHotels(params?: { status?: string }) {
  const { data } = await api.get<{ success: boolean; data: Hotel[] }>(
    "/hotels/mine",
    { params },
  );
  return data.data;
}
