import { CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export function BookingSuccessPage() {
  const { id } = useParams();
  return (
    <div className="mx-auto max-w-lg py-16 px-4">
      <Card className="flex flex-col items-center text-center p-10 rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-sm border-4 border-white">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Đặt phòng thành công!
        </h1>
        <p className="text-slate-500 text-lg mb-8">
          Mã đặt phòng:{" "}
          <span className="font-semibold text-slate-900">{id}</span>
        </p>
        <Link to="/profile" className="w-full">
          <Button className="w-full py-4 text-lg rounded-xl shadow-md">
            Xem chuyến đi của tôi
          </Button>
        </Link>
        <Link
          to="/"
          className="mt-6 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
        >
          Trở về trang chủ
        </Link>
      </Card>
    </div>
  );
}
