import { api } from "./api";
import type { Hotel } from "../types/api";

export async function toggleWishlist(
  hotelId: string,
): Promise<{ status: "added" | "removed" }> {
  const res = await api.post(`/hotels/wishlists/toggle`, { hotelId });
  return res.data;
}

export async function getMyWishlist(): Promise<Hotel[]> {
  const res = await api.get("/hotels/wishlists");
  return res.data.data || res.data;
}
