import { ArrowLeft, CalendarDays, Mail, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { listBookings } from "../../services/bookings";
import type { Booking } from "../../types/api";
import { formatMoney } from "../../utils/money";
import { useAuthStore } from "../../store/authStore";

export function BookingManagementPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    listBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Quay lại
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Quản lý Đặt phòng</h1>
        <p className="text-slate-500 mt-2">
          {user?.role === "ADMIN"
            ? "Theo dõi và quản lý toàn bộ danh sách đặt phòng & doanh thu trên hệ thống."
            : "Theo dõi và quản lý danh sách khách hàng đặt phòng tại các khách sạn của bạn."}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Đang tải dữ liệu...
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-slate-500">
          Hiện tại chưa có khách hàng nào đặt phòng tại khách sạn của bạn.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="p-6 border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all rounded-3xl flex flex-col"
            >
              {/* Thông tin Trạng thái & Khách sạn */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                    {booking.room?.hotel?.name || "Khách sạn"}
                  </h3>
                  <p className="text-sm font-medium text-primary mt-1 bg-primary/10 w-fit px-2 py-0.5 rounded-md">
                    {booking.room?.name || "Phòng"}
                  </p>
                </div>
                <span
                  className={`shrink-0 px-3 py-1 text-xs rounded-full font-bold ${
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

              {/* Thông tin Khách hàng */}
              <div className="bg-slate-50 p-4 rounded-2xl mb-4 space-y-2 border border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  {(booking as any).user?.fullName || "Khách hàng"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {(booking as any).user?.email || "Không có email"}
                </div>
              </div>

              {/* Ngày tháng đặt phòng */}
              <div className="grid grid-cols-2 gap-4 mb-4 flex-1">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Nhận phòng
                  </p>
                  <p className="font-medium text-slate-900">
                    {new Date(booking.checkIn).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Trả phòng
                  </p>
                  <p className="font-medium text-slate-900">
                    {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Giá và Số lượng khách */}
              <div className="flex justify-between items-end pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600">
                  Số khách:{" "}
                  <span className="font-semibold text-slate-900">
                    {booking.guests}
                  </span>
                </p>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">
                    Tổng tiền thanh toán
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatMoney(booking.totalPrice)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
