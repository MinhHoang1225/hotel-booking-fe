import {
  CalendarDays,
  Camera,
  Mail,
  User as UserIcon,
  Star,
  Heart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { updateProfile } from "../../services/profile";
import { listBookings, cancelBooking } from "../../services/bookings";
import type { Booking, Review } from "../../types/api";
import { formatMoney } from "../../utils/money";
import { ReviewModal } from "../../components/common/ReviewModal";
import toast from "react-hot-toast";
import { WishlistPage } from "./WishlistPage";

export function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    avatar: user?.avatarUrl || "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "bookings" | "wishlist">(
    "info",
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  if (!user) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
            Quản trị viên
          </span>
        );
      case "HOTEL_OWNER":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            Chủ khách sạn
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
            Khách hàng
          </span>
        );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = await updateProfile(formData);

      useAuthStore.setState({ user: data.data });

      setIsEditing(false);
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi lưu thay đổi",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      setBookings(await listBookings("mine"));
    } catch (error) {
      console.error("Lỗi tải bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (activeTab === "bookings") loadBookings();
  }, [activeTab]);

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đặt phòng này?")) return;
    try {
      await cancelBooking(id, "Hủy bởi người dùng");
      await loadBookings();
      toast.success("Đã hủy đặt phòng thành công");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi hủy");
    }
  };

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

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Hồ sơ cá nhân</h1>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        <Card className="p-8 flex flex-col items-center text-center h-fit border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl sticky top-24">
          <div className="relative mb-5">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 text-primary flex items-center justify-center text-5xl font-bold border-4 border-white shadow-lg">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg border border-slate-100 text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{user.fullName}</h2>
          <p className="text-slate-500 text-sm mb-4">{user.email}</p>
          {getRoleBadge(user.role)}

          <div className="mt-8 flex flex-col w-full gap-2 border-t border-slate-100 pt-6">
            <Button
              variant={activeTab === "info" ? "primary" : "ghost"}
              className={`justify-start font-medium rounded-xl py-3 ${activeTab === "info" ? "shadow-sm" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              <UserIcon className="w-4 h-4 mr-3" />
              Thông tin cá nhân
            </Button>
            <Button
              variant={activeTab === "wishlist" ? "primary" : "ghost"}
              className={`justify-start font-medium rounded-xl py-3 ${activeTab === "wishlist" ? "shadow-sm" : ""}`}
              onClick={() => setActiveTab("wishlist")}
            >
              <Heart className="w-4 h-4 mr-3" />
              Khách sạn yêu thích
            </Button>
            <Button
              variant={activeTab === "bookings" ? "primary" : "ghost"}
              className={`justify-start font-medium rounded-xl py-3 ${activeTab === "bookings" ? "shadow-sm" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              <CalendarDays className="w-4 h-4 mr-3" />
              Lịch sử đặt phòng
            </Button>
          </div>
        </Card>

        {activeTab === "info" ? (
          <Card className="p-8 border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl h-fit">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Thông tin chi tiết
              </h3>
              <Button
                variant={isEditing ? "secondary" : "primary"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </Button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  Họ và tên
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`rounded-xl ${
                    !isEditing
                      ? "bg-slate-50 text-slate-700 font-medium"
                      : "font-medium"
                  }`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Địa chỉ Email
                </label>
                <Input
                  value={user.email}
                  disabled
                  className="bg-slate-50 text-slate-500 cursor-not-allowed rounded-xl"
                  title="Không thể thay đổi email"
                />
              </div>

              {isEditing && (
                <div className="pt-4 mt-6">
                  <Button
                    className="w-full md:w-auto px-8"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : activeTab === "wishlist" ? (
          <div className="space-y-6">
            <WishlistPage />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-slate-900">
                Lịch sử đặt phòng của bạn
              </h3>
            </div>

            {loadingBookings ? (
              <div className="text-center py-10 text-slate-500">
                Đang tải dữ liệu...
              </div>
            ) : bookings.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2 shadow-none bg-slate-50 rounded-3xl">
                <p className="text-slate-500">
                  Bạn chưa có chuyến đi nào. Đặt phòng ngay để trải nghiệm!
                </p>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="p-6 border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all rounded-3xl"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-xl text-slate-900">
                        {booking.room?.hotel?.name || "Khách sạn"}
                      </h4>
                      <p className="text-sm font-medium text-slate-600 mt-1 flex items-center gap-2">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                          {booking.room?.name || "Phòng"}
                        </span>
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                          booking.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-700"
                            : booking.status === "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : booking.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl mb-4 text-sm border border-slate-100">
                    <div>
                      <p className="text-slate-500 text-xs mb-1 uppercase font-semibold">
                        Nhận phòng
                      </p>
                      <p className="font-medium text-slate-900 text-base">
                        {new Date(booking.checkIn).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1 uppercase font-semibold">
                        Trả phòng
                      </p>
                      <p className="font-medium text-slate-900 text-base">
                        {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-slate-600">
                      Số khách:{" "}
                      <span className="font-medium text-slate-900">
                        {booking.guests}
                      </span>{" "}
                      người
                    </p>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-0.5">
                        Tổng thanh toán
                      </p>
                      <p className="text-xl font-bold text-primary">
                        {formatMoney(booking.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {booking.review && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
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
                        <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200 relative ml-4">
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

                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-3">
                    {booking.status === "PENDING" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Hủy đặt phòng
                      </Button>
                    )}
                    {booking.status === "CONFIRMED" &&
                      (booking.review ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openReviewModal(booking.id, booking.review)
                          }
                        >
                          <Star className="w-4 h-4 mr-2 fill-amber-400 text-amber-400" />{" "}
                          Sửa đánh giá
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => openReviewModal(booking.id)}
                        >
                          <Star className="w-4 h-4 mr-2" /> Đánh giá khách sạn
                        </Button>
                      ))}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {selectedBookingId && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          bookingId={selectedBookingId}
          existingReview={selectedReview}
          onClose={closeReviewModal}
          onSuccess={loadBookings}
        />
      )}
    </div>
  );
}
