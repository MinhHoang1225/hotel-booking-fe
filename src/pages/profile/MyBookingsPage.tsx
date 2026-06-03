import { useEffect, useState } from "react";
import { formatMoney } from "../../utils/money";
import { ReviewModal } from "../../components/common/ReviewModal";
import type { Booking, Review } from "../../types/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Star } from "lucide-react";
import { listBookings } from "../../services/bookings";

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await listBookings("mine");
      setBookings(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách booking", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openReviewModal = (bookingId: string, review?: Review | null) => {
    setSelectedBookingId(bookingId);
    setSelectedReview(review || null);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedBookingId(null);
    setSelectedReview(null);
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">
        Đang tải danh sách đặt phòng...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">
        Chuyến đi của tôi
      </h1>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            Bạn chưa có chuyến đi nào.
          </div>
        ) : (
          bookings.map((booking) => (
            <Card
              key={booking.id}
              className="p-6 flex flex-col gap-4 rounded-3xl border-slate-100 shadow-sm"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">
                    {booking.room?.hotel?.name || "Khách sạn"}
                  </h3>
                  <p className="text-slate-600 font-medium">
                    {booking.room?.name}
                  </p>
                  <div className="mt-3 text-sm text-slate-500 space-y-1">
                    <p>
                      Check-in:{" "}
                      {new Date(booking.checkIn).toLocaleDateString("vi-VN")}
                    </p>
                    <p>
                      Check-out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
                    </p>
                    <p>Khách: {booking.guests} người</p>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                  <div className="text-left md:text-right w-full mb-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-2 ${booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}
                    >
                      {booking.status}
                    </span>
                    <div className="font-bold text-primary text-2xl">
                      {formatMoney(Number(booking.totalPrice))}
                    </div>
                  </div>

                  {booking.status === "CONFIRMED" &&
                    (booking.review ? (
                      <Button
                        variant="outline"
                        className="w-full md:w-auto"
                        onClick={() =>
                          openReviewModal(booking.id, booking.review)
                        }
                      >
                        <Star className="w-4 h-4 mr-2 fill-amber-400 text-amber-400" />{" "}
                        Sửa đánh giá
                      </Button>
                    ) : (
                      <Button
                        className="w-full md:w-auto"
                        onClick={() => openReviewModal(booking.id)}
                      >
                        <Star className="w-4 h-4 mr-2" /> Đánh giá khách sạn
                      </Button>
                    ))}
                </div>
              </div>

              {booking.review && (
                <div className="mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-bold text-slate-700 mr-2">
                      Đánh giá của bạn:
                    </span>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < booking.review!.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  {booking.review.comment && (
                    <p className="text-sm text-slate-600 italic">
                      "{booking.review.comment}"
                    </p>
                  )}
                  {booking.review.reply && (
                    <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200 relative ml-4 shadow-sm">
                      <div className="absolute w-3 h-3 bg-white border-l border-t border-slate-200 rotate-45 -top-1.5 left-4"></div>
                      <p className="text-xs font-bold text-primary mb-1 relative z-10">
                        Khách sạn phản hồi:
                      </p>
                      <p className="text-sm text-slate-700 relative z-10">
                        {booking.review.reply}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {selectedBookingId && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          bookingId={selectedBookingId}
          existingReview={selectedReview}
          onClose={closeReviewModal}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
}
