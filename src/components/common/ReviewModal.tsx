import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { Button } from "../ui/Button";
import type { Review } from "../../types/api";
import { createReview, updateReview } from "../../services/reviews";
import toast from "react-hot-toast";

interface ReviewModalProps {
  bookingId: string;
  existingReview?: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({
  bookingId,
  existingReview,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || "");
    } else {
      setRating(5);
      setComment("");
    }
  }, [existingReview, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (existingReview) {
        await updateReview(existingReview.id, { rating, comment });
        toast.success("Cập nhật đánh giá thành công!");
      } else {
        await createReview({ bookingId, rating, comment });
        toast.success("Gửi đánh giá thành công!");
      }
      onSuccess(); // Refresh list booking
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-slate-900">
          {existingReview ? "Sửa đánh giá" : "Đánh giá Khách sạn"}
        </h2>

        {existingReview?.reply && (
          <div className="mb-6 p-4 bg-sky-50 border border-sky-100 rounded-xl text-sm">
            <p className="font-bold text-sky-800 mb-1">
              Chủ khách sạn đã phản hồi:
            </p>
            <p className="text-sky-700 italic">"{existingReview.reply}"</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Chất lượng dịch vụ
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nhận xét (Tùy chọn)
            </label>
            <textarea
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-primary focus:border-primary outline-none resize-none"
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về khách sạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
