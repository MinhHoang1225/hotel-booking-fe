import { api } from "./api";

export async function createReview(payload: {
  bookingId: string;
  rating: number;
  comment: string;
}) {
  const res = await api.post("/reviews", payload);
  return res.data;
}

export async function updateReview(
  id: string,
  payload: { rating: number; comment: string },
) {
  const res = await api.patch(`/reviews/${id}`, payload);
  return res.data;
}

export async function listMyHotelReviews() {
  const { data } = await api.get("/reviews/my-hotels");
  return data.data;
}

export async function replyToReview(reviewId: string, reply: string) {
  const { data } = await api.patch(`/reviews/${reviewId}/reply`, { reply });
  return data.data;
}
