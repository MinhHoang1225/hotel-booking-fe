import { api } from "./api";
import type { Review } from "../types/api";

// Đây là kiểu dữ liệu trả về từ API /reviews/top
export interface TopReview extends Review {
  user: {
    fullName: string;
    avatarUrl?: string | null;
  };
  hotel: {
    name: string;
  };
}

/**
 * Lấy danh sách các đánh giá nổi bật cho trang chủ
 */
export async function getTopReviews(): Promise<TopReview[]> {
  const res = await api.get("/reviews/top");
  return res.data.data;
}

export async function createReview(payload: {
  bookingId: string;
  rating: number;
  comment?: string;
}) {
  const { data } = await api.post<{ success: boolean; data: Review }>("/reviews", payload);
  return data.data;
}

export async function updateReview(id: string, payload: { rating: number; comment?: string }) {
  const { data } = await api.patch<{ success: boolean; data: Review }>(`/reviews/${id}`, payload);
  return data.data;
}

export async function deleteReview(id: string) {
  const { data } = await api.delete<{ success: boolean }>(`/reviews/${id}`);
  return data.data;
}

export async function replyToReview(reviewId: string, replyText: string) {
  const { data } = await api.patch<{ success: boolean; data: Review }>(`/reviews/${reviewId}/reply`, { replyText });
  return data.data;
}

export async function listMyHotelReviews() {
  const { data } = await api.get<{ success: boolean; data: Review[] }>("/reviews/mine");
  return data.data;
}
