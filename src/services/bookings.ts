import { api } from "./api";
import type { Booking, Payment } from "../types/api";

export async function createBooking(payload: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  const { data } = await api.post<{ success: boolean; data: Booking }>(
    "/bookings",
    payload,
  );
  return data.data;
}

export async function listBookings(type?: string) {
  const { data } = await api.get<{ success: boolean; data: Booking[] }>(
    "/bookings",
    {
      params: type ? { type } : undefined,
    },
  );
  return data.data;
}

export async function payBooking(bookingId: string, currency = "usd") {
  const { data } = await api.post<{
    success: boolean;
    data: { payment: Payment; booking: Booking; provider: "mock" };
  }>("/payments", { bookingId, currency });
  return data.data;
}

export async function cancelBooking(id: string, reason?: string) {
  const { data } = await api.patch<{ success: boolean; data: Booking }>(
    `/bookings/${id}/cancel`,
    { reason },
  );
  return data.data;
}
