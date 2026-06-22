import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, User, Mail, Phone } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { createBooking } from "../../services/bookings";
import { api } from "../../services/api";
import type { Room } from "../../types/api";
import { formatMoney } from "../../utils/money";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const roomId = searchParams.get("roomId") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "2";

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  useEffect(() => {
    if (!roomId) {
      toast.error("Không tìm thấy mã phòng");
      navigate("/");
      return;
    }

    api
      .get<{ success: boolean; data: Room }>(`/rooms/${roomId}`)
      .then((res) => setRoom(res.data.data))
      .catch(() => toast.error("Lỗi tải thông tin phòng"))
      .finally(() => setLoading(false));

    if (user) {
      setGuestName(user.fullName || "");
      setGuestEmail(user.email || "");
      setGuestPhone((user as any).phone || "");
    }
  }, [roomId, navigate, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Đang tải thông tin thanh toán...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Không tìm thấy thông tin phòng.
      </div>
    );
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.max(
    Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24),
    ),
    0,
  );

  const roomPriceTotal = Number(room.price || 0) * nights;
  const totalAmount = roomPriceTotal;

  async function submit() {
    if (!guestName || !guestEmail || !guestPhone) {
      toast.error("Vui lòng điền đầy đủ thông tin người đặt phòng.");
      return;
    }
    setSubmitting(true);
    try {
      if (nights <= 0) throw new Error("Check-out must be after check-in");

      const booking = await createBooking({
        roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: Number(guests),
        guestName,
        guestEmail,
        guestPhone,
      });
      navigate(`/payment/${booking.id}`);
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // Thay h-[calc(100vh-4rem)] bằng min-h-screen để trang giãn theo nội dung thay vì ép layout cố định chiều cao
    <div className="max-w-6xl mx-auto py-6 px-4 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Kiểm tra & Xác nhận Đặt phòng
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LƯỚI TRÁI: THÔNG TIN KHÁCH HÀNG & NÚT ĐẶT */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Guest Information - Bỏ flex-1 và overflow-y-auto để ôm sát nội dung input */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Thông tin người đặt phòng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" /> Họ và tên{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="VD: Nguyen Van A"
                  className="bg-white border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" /> Email{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="bg-white border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all h-11"
                />
              </div> 
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" /> Số điện thoại{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Nhập số điện thoại liên hệ"
                  className="bg-white border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all h-11"
                />
              </div>
            </div>
          </div>

          {/* Box Nút đặt phòng */}
          <div className="bg-gradient-to-r from-slate-50 to-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <p className="text-xs text-slate-600 flex-1">
              Bằng việc bấm xác nhận, bạn đồng ý với các Điều khoản & Chính sách đặt phòng của chúng tôi.
            </p>
            <Button
              onClick={submit}
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
            </Button>
          </div>
        </div>

        {/* LƯỚI PHẢI: CHI TIẾT TỔNG QUAN */}
        <div className="flex flex-col gap-6">
          {/* Hotel Information & Room Information - Bỏ flex-1 và overflow-y-auto */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2 text-base">
              Thông tin lưu trú
            </h3>
            <div className="flex gap-4 mb-4">
              <img
                src={
                  (room as any).hotel?.images?.[0] ||
                  room.images?.[0] ||
                  "https://via.placeholder.com/400"
                }
                alt="Hotel"
                className="w-24 h-24 object-cover rounded-xl shadow-sm shrink-0"
              />
              <div className="space-y-1.5 text-sm flex-1">
                <p className="font-semibold text-slate-900 line-clamp-1">
                  {(room as any).hotel?.name || "Velora Hotel"}
                </p>
                <p className="text-slate-500 text-xs line-clamp-2">
                  {(room as any).hotel?.address || "System Address"}
                </p>
                <p className="text-xs font-medium text-primary bg-primary/10 w-fit px-2 py-0.5 rounded mt-1">
                  {room.name}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-3">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl mb-2">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Nhận phòng</p>
                  <p className="font-bold text-slate-900">{checkInDate.toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Trả phòng</p>
                  <p className="font-bold text-slate-900">{checkOutDate.toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
              <p className="flex items-center justify-between px-1">
                <span className="text-slate-500">Thời gian lưu trú:</span>{" "}
                <span className="font-semibold text-slate-900">{nights} đêm</span>
              </p>
              <p className="flex items-center justify-between px-1">
                <span className="text-slate-500">Số lượng khách:</span>{" "}
                <span className="font-semibold text-slate-900">{guests} Người</span>
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary"></div>

            <h3 className="font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2 text-base">
              Chi tiết thanh toán
            </h3>

            <div className="space-y-2 text-sm text-slate-600 mb-3">
              <p className="flex items-center justify-between">
                <span className="text-slate-500">
                  Tiền phòng ({nights} đêm)
                </span>
                <span className="font-semibold text-slate-900">
                  {formatMoney(roomPriceTotal)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Thuế & Phí dịch vụ</span>
                <span className="font-semibold text-emerald-600">Bao gồm</span>
              </p>
            </div>

            <div className="h-px border-t border-dashed border-slate-200 my-3" />

            <div className="flex items-end justify-between">
              <div>
                <p className="font-bold text-slate-900 uppercase text-sm">Tổng cộng</p>
              </div>
              <p className="text-xl font-black text-primary">
                {formatMoney(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}