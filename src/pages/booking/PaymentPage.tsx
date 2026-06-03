import { CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "../../components/common/ErrorState";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { payBooking } from "../../services/bookings";

export function PaymentPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setLoading(true);
    setError("");
    try {
      await payBooking(id);
      navigate(`/booking-success/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg py-16 px-4">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-sm border-4 border-white">
          <ShieldCheck className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Thanh toán an toàn
        </h1>
        <p className="text-slate-500 text-lg">
          Hoàn tất đặt phòng của bạn một cách nhanh chóng và bảo mật.
        </p>
      </div>

      <div className="space-y-5">
        {error && (
          <div className="mb-4">
            <ErrorState message={error} />
          </div>
        )}

        <Card className="flex flex-col items-center text-center p-10 rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white">
          <CreditCard className="w-16 h-16 text-slate-300 mb-6" />
          <p className="text-slate-600 mb-8 leading-relaxed">
            Dự án này sử dụng mô phỏng thanh toán trực tuyến. Nhấn nút bên dưới
            để xác nhận đặt phòng của bạn ngay lập tức!
          </p>
          <Button
            className="w-full py-4 text-lg rounded-xl shadow-md bg-emerald-600 hover:bg-emerald-700"
            onClick={pay}
            disabled={loading}
          >
            {loading
              ? "Đang xử lý thanh toán..."
              : "Xác nhận & Thanh toán ngay"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
