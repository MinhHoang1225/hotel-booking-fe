import {
  Building,
  CalendarDays,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ownerDashboard } from "../../services/dashboard";
import { StatGrid } from "./StatGrid";

export function OwnerDashboardPage() {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    ownerDashboard()
      .then(setStats)
      .catch(() => setStats({}));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Bảng điều khiển
          </h1>
          <p className="text-slate-500 mt-2">
            Tổng quan về hoạt động kinh doanh của bạn.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/owner/hotels">
            <Button
              variant="secondary"
              className="rounded-xl px-6 py-2.5 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700"
            >
              <Building className="w-4 h-4 mr-2" /> Khách sạn
            </Button>
          </Link>
          <Link to="/owner/bookings">
            <Button className="rounded-xl px-6 py-2.5 shadow-sm">
              <CalendarDays className="w-4 h-4 mr-2" /> Đặt phòng
            </Button>
          </Link>
          <Link to="/owner/reviews">
            <Button
              variant="secondary"
              className="rounded-xl px-6 py-2.5 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700"
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Đánh giá
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Thống kê tổng quan
        </h2>
        <StatGrid
          stats={stats}
          links={{
            totalHotels: "/owner/hotels",
            totalRooms: "/owner/rooms",
            totalBookings: "/owner/bookings",
            totalReviews: "/owner/reviews",
          }}
        />
      </div>
    </div>
  );
}
