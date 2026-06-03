import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  XCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myHotels, approveHotel } from "../../services/hotels";
import type { Hotel } from "../../types/api";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import toast from "react-hot-toast";

export function ApproveHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING,REJECTED");
  const navigate = useNavigate();

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await myHotels(filter === "ALL" ? {} : { status: filter });
      setHotels(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách sạn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [filter]);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await approveHotel(id, status);
      toast.success(
        status === "APPROVED" ? "Đã duyệt khách sạn!" : "Đã từ chối khách sạn!",
      );
      // Tải lại danh sách
      fetchHotels();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi thực hiện hành động!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Quay lại
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            Quản lý Khách sạn
          </h1>
          <p className="text-slate-500 mt-2">
            Xem danh sách và kiểm duyệt các khách sạn trên hệ thống.
          </p>
        </div>
        <div className="relative w-full sm:w-48 shrink-0">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl hover:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium cursor-pointer shadow-sm"
          >
            <option value="PENDING,REJECTED">Cần xử lý</option>
            <option value="APPROVED">Đã hoạt động</option>
            <option value="ALL">Tất cả</option>
          </Select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Đang tải dữ liệu...
        </div>
      ) : hotels.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 shadow-none text-center">
          <p className="text-slate-500">Không có khách sạn nào cần xử lý.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {hotels.map((hotel: any) => (
            <div
              key={hotel.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-xl text-slate-900">
                    {hotel.name}
                  </h3>
                  <span
                    className={`shrink-0 px-3 py-1 text-xs rounded-full font-bold ${
                      hotel.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-700"
                        : hotel.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {hotel.status === "APPROVED"
                      ? "Đã duyệt"
                      : hotel.status === "REJECTED"
                        ? "Bị từ chối"
                        : "Chờ duyệt"}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-2 flex items-start gap-1">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {hotel.address}
                </p>
                {hotel.owner && (
                  <div className="bg-slate-50 p-3 rounded-xl mt-4 border border-slate-100">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                      Thông tin chủ sở hữu
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {hotel.owner.fullName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {hotel.owner.email}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`/hotels/${hotel.id}`, "_blank")}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 rounded-xl py-2.5 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Chi tiết
                </Button>
                {hotel.status !== "APPROVED" && (
                  <Button
                    onClick={() => handleAction(hotel.id, "APPROVED")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Phê duyệt
                  </Button>
                )}
                {hotel.status !== "REJECTED" && (
                  <Button
                    onClick={() => handleAction(hotel.id, "REJECTED")}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl py-2.5 shadow-none"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Từ chối
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
