import { api } from "./api";
import type { Room } from "../types/api";

export async function createRoom(payload: Partial<Room>) {
  const { data } = await api.post<{ success: boolean; data: Room }>(
    "/rooms",
    payload,
  );
  return data.data;
}

export async function deleteRoom(roomId: string) {
  const { data } = await api.delete<{ success: boolean; data: Room }>(
    `/rooms/${roomId}`,
  );
  return data.data;
}

export async function updateRoom(roomId: string, payload: Partial<Room>) {
  const { data } = await api.patch<{ success: boolean; data: Room }>(
    `/rooms/${roomId}`,
    payload,
  );
  return data.data;
}
