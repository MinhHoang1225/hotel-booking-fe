import dayjs from "dayjs";
import { BedDouble, CalendarDays, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ErrorState } from "../../components/common/ErrorState";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { createBooking } from "../../services/bookings";
import { api } from "../../services/api";
import type { Room } from "../../types/api";
import { formatMoney } from "../../utils/money";

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get("roomId") || "";
  const [room, setRoom] = useState<Room | null>(null);
  const [form, setForm] = useState({
    checkIn:
      searchParams.get("checkIn") || dayjs().add(1, "day").format("YYYY-MM-DD"),
    checkOut:
      searchParams.get("checkOut") ||
      dayjs().add(2, "day").format("YYYY-MM-DD"),
    guests: Number(searchParams.get("guests") || 2),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get<{ success: boolean; data: Room }>(`/rooms/${roomId}`)
      .then((res) => setRoom(res.data.data))
      .catch((err) => setError(err.message));
  }, [roomId]);

  const nights = Math.max(
    dayjs(form.checkOut).diff(dayjs(form.checkIn), "day"),
    0,
  );
  const total = useMemo(
    () => Number(room?.price || 0) * nights,
    [room, nights],
  );

  async function submit() {
    setLoading(true);
    setError("");
    try {
      if (!room) throw new Error("Room is not ready");
      if (nights <= 0) throw new Error("Check-out must be after check-in");
      const booking = await createBooking({
        roomId,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
      });
      navigate(`/payment/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Xác nhận đặt phòng
      </h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Cột trái: Form nhập thông tin */}
        <div className="space-y-6">
          <Card className="p-8 rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Thông tin chuyến đi
            </h2>

            {error && (
              <div className="mb-6">
                <ErrorState message={error} />
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Ngày nhận phòng
                </label>
                <Input
                  type="date"
                  className="rounded-xl bg-slate-50 border-transparent focus:bg-white"
                  value={form.checkIn}
                  onChange={(e) =>
                    setForm({ ...form, checkIn: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Ngày trả phòng
                </label>
                <Input
                  type="date"
                  className="rounded-xl bg-slate-50 border-transparent focus:bg-white"
                  value={form.checkOut}
                  onChange={(e) =>
                    setForm({ ...form, checkOut: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Số lượng khách
                </label>
                <Input
                  type="number"
                  min={1}
                  className="rounded-xl bg-slate-50 border-transparent focus:bg-white"
                  value={form.guests}
                  onChange={(e) =>
                    setForm({ ...form, guests: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Cột phải: Hóa đơn tính tiền */}
        <div className="relative">
          <Card className="p-8 rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <BedDouble className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900 line-clamp-2">
                  {room?.hotel?.name || "Khách sạn"}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {room?.name || "Đang tải thông tin phòng..."}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-slate-900">Chi tiết giá</h3>
              <div className="flex justify-between text-slate-600">
                <span>
                  {formatMoney(room?.price || 0)} x {nights} đêm
                </span>
                <span className="font-medium">{formatMoney(total)}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mb-8 flex justify-between items-end">
              <div>
                <span className="block text-sm font-medium text-slate-500 mb-1">
                  Tổng thanh toán
                </span>
                <span className="text-sm text-slate-500">
                  (Đã bao gồm thuế và phí)
                </span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatMoney(total)}
              </div>
            </div>

            <Button
              className="w-full py-4 text-lg rounded-xl shadow-md"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Tiếp tục thanh toán"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
