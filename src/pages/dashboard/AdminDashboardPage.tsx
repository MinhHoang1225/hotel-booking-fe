import { Building2, ShieldCheck, Users, Banknote } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { adminDashboard } from "../../services/dashboard";
import { StatGrid } from "./StatGrid";

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    adminDashboard()
      .then(setStats)
      .catch(() => setStats({}));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Bảng điều khiển Quản trị
          </h1>
          <p className="text-slate-500 mt-2">
            Tổng quan về hoạt động của toàn bộ hệ thống.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/approve-hotels">
            <Button
              variant="secondary"
              className="rounded-xl px-6 py-2.5 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700"
            >
              <Building2 className="w-4 h-4 mr-2" /> Khách sạn
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button className="rounded-xl px-6 py-2.5 shadow-sm">
              <Users className="w-4 h-4 mr-2" /> Người dùng
            </Button>
          </Link>
          <Link to="/admin/bookings">
            <Button
              variant="secondary"
              className="rounded-xl px-6 py-2.5 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700"
            >
              <Banknote className="w-4 h-4 mr-2" /> Doanh thu
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
            totalUsers: "/admin/users",
            pendingHotels: "/admin/approve-hotels",
            totalHotels: "/admin/approve-hotels",
            totalBookings: "/admin/bookings",
            totalRevenue: "/admin/bookings",
          }}
        />
      </div>
    </div>
  );
}
