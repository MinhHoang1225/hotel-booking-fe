import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, User, Mail, Phone, Info } from "lucide-react";
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

  // Local state cho thông tin người đặt (Có thể chỉnh sửa để in hóa đơn)
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

    // Khởi tạo giá trị mặc định từ Profile người dùng
    if (user) {
      setGuestName(user.fullName || "");
      setGuestEmail(user.email || "");
      setGuestPhone((user as any).phone || "");
    }
  }, [roomId, navigate]);

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

  // --- TÍNH TOÁN NGÀY THÁNG VÀ GIÁ TIỀN ---
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
        guestName, // Truyền thêm để sau này Backend có thể lấy in ra hóa đơn
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
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Kiểm tra & Xác nhận Đặt phòng
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LƯỚI TRÁI: THÔNG TIN KHÁCH HÀNG & NÚT ĐẶT */}
        <div className="lg:col-span-2 space-y-8">
          {/* Guest Information */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" /> Thông tin người
              đặt phòng
            </h2>

            <div className="mb-6 flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 text-sm text-blue-800">
              <Info className="w-5 h-5 shrink-0 text-blue-500 mt-0.5" />
              <p>
                Thông tin bên dưới được sử dụng để liên hệ và in hóa đơn thanh
                toán. Bạn có thể thay đổi tùy ý mà <b>không làm ảnh hưởng</b>{" "}
                đến hồ sơ tài khoản gốc của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" /> Họ và tên{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="VD: Nguyen Van A"
                  className="bg-white border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" /> Email nhận hóa đơn{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="bg-white border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" /> Số điện thoại{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Nhập số điện thoại liên hệ"
                  className="bg-white border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Box Nút đặt phòng */}
          <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <p className="text-sm text-slate-700">
              Bằng việc bấm xác nhận, bạn đồng ý với các Điều khoản & Chính sách
              đặt phòng của chúng tôi.
            </p>
            <Button
              onClick={submit}
              disabled={submitting}
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
            </Button>
          </div>
        </div>

        {/* LƯỚI PHẢI: CHI TIẾT TỔNG QUAN (READONLY SUMMARY) */}
        <div className="space-y-6 sticky top-8 h-fit">
          {/* Hotel Information & Room Information */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Thông tin lưu trú
            </h3>
            <img
              src={
                (room as any).hotel?.images?.[0] ||
                room.images?.[0] ||
                "https://via.placeholder.com/400"
              }
              alt="Hotel"
              className="w-full h-40 object-cover rounded-2xl mb-5 shadow-sm"
            />

            <div className="space-y-3 mb-6 text-sm">
              <p className="flex justify-between">
                <span className="text-slate-500">Khách sạn:</span>
                <span className="font-semibold text-slate-900 text-right">
                  {(room as any).hotel?.name || "Velora Hotel"}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Địa chỉ:</span>
                <span className="font-semibold text-slate-900 text-right max-w-[60%]">
                  {(room as any).hotel?.address || "System Address"}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Tên phòng:</span>{" "}
                <span className="font-semibold text-slate-900">
                  {room.name}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Loại phòng:</span>{" "}
                <span className="font-semibold text-slate-900">
                  {room.capacity >= 4 ? "Phòng Gia đình" : "Phòng Tiêu chuẩn"}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Số khách tối đa:</span>{" "}
                <span className="font-semibold text-slate-900">
                  {room.capacity} Người
                </span>
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-5">
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Nhận phòng:</span>{" "}
                <span className="font-bold text-slate-900">
                  {checkInDate.toLocaleDateString("vi-VN")}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Trả phòng:</span>{" "}
                <span className="font-bold text-slate-900">
                  {checkOutDate.toLocaleDateString("vi-VN")}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Thời gian lưu trú:</span>{" "}
                <span className="font-semibold text-slate-900">{nights}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Số lượng khách:</span>{" "}
                <span className="font-semibold text-slate-900">{guests}</span>
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            {/* Decoration line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary"></div>

            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Chi tiết thanh toán
            </h3>

            <div className="space-y-3 text-sm text-slate-600 mb-4">
              <p className="flex items-center justify-between">
                <span className="text-slate-500">
                  Tiền phòng ({nights} đêm)
                </span>
                <span className="font-semibold text-slate-900">
                  {formatMoney(roomPriceTotal)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Thuế GTGT</span>
                <span className="font-semibold text-emerald-600">Bao gồm</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Phí dịch vụ</span>
                <span className="font-semibold text-emerald-600">Bao gồm</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Giảm giá</span>
                <span className="font-semibold text-slate-900">0 đ</span>
              </p>
            </div>

            <div className="h-px border-t border-dashed border-slate-200 my-4" />

            <div className="flex items-end justify-between">
              <div>
                <p className="font-bold text-slate-900 uppercase">Tổng cộng</p>
              </div>
              <p className="text-2xl font-black text-primary">
                {formatMoney(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
