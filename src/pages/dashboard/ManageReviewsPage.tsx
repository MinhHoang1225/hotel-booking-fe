import { useEffect, useState } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import { listMyHotelReviews, replyToReview } from "../../services/reviews";
import type { Review, User } from "../../types/api";
import { Button } from "../../components/ui/Button";
import toast from "react-hot-toast";

interface ReviewWithDetails extends Review {
  hotel: { name: string };
  user: Pick<User, "id" | "fullName" | "avatarUrl">;
  booking: { room: { name: string } };
}

export function ManageReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await listMyHotelReviews();
      setReviews(data);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải danh sách đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) {
      return toast.error("Nội dung phản hồi không được để trống.");
    }
    try {
      await replyToReview(reviewId, replyText);
      toast.success("Gửi phản hồi thành công!");
      setReplyingTo(null);
      setReplyText("");
      fetchReviews(); // Tải lại danh sách để hiển thị phản hồi mới
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi gửi phản hồi.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          Quản lý Đánh giá
        </h1>
        <p className="text-slate-500 mt-2">
          Xem và phản hồi các đánh giá từ khách hàng cho khách sạn của bạn.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Đang tải dữ liệu...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 shadow-none text-center">
          <p className="text-slate-500">
            Chưa có đánh giá nào cho khách sạn của bạn.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
            >
              <div className="flex items-start gap-4">
                {review.user.avatarUrl ? (
                  <img
                    src={review.user.avatarUrl}
                    alt={review.user.fullName}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                    {review.user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">
                        {review.user.fullName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Đã đánh giá cho phòng{" "}
                    <span className="font-semibold text-slate-700">
                      {review.booking.room.name}
                    </span>{" "}
                    tại{" "}
                    <span className="font-semibold text-slate-700">
                      {review.hotel.name}
                    </span>
                  </p>
                </div>
              </div>

              {review.comment && (
                <p className="text-slate-700 mt-4 pl-16 italic border-l-4 border-slate-100 ml-6">
                  "{review.comment}"
                </p>
              )}

              {review.reply ? (
                <div className="mt-4 ml-16 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="font-bold text-sm text-slate-800">
                    Phản hồi của bạn:
                  </p>
                  <p className="text-slate-700 text-sm mt-1">{review.reply}</p>
                </div>
              ) : (
                <div className="mt-4 ml-16">
                  {replyingTo === review.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReplySubmit(review.id);
                      }}
                      className="space-y-2"
                    >
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Viết phản hồi của bạn..."
                        className="w-full border border-slate-200 rounded-xl p-3 focus:ring-primary focus:border-primary outline-none resize-none text-sm"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText("");
                          }}
                        >
                          Hủy
                        </Button>
                        <Button type="submit" size="sm">
                          <Send className="w-3 h-3 mr-2" /> Gửi phản hồi
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(review.id);
                        setReplyText("");
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" /> Phản hồi
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
