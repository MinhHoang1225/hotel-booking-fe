import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Users, Star } from "lucide-react";
import api from "../services/api";
import { Button } from "../components/ui/Button";
import { formatMoney } from "../utils/money";
import toast from "react-hot-toast";
import { RoomMatrix } from "../components/hotel/RoomMatrix";

export function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // States cho tính năng Ma trận phòng
  const [checkIn, setCheckIn] = useState<string>(
    searchParams.get("checkIn") || "",
  );
  const [checkOut, setCheckOut] = useState<string>(
    searchParams.get("checkOut") || "",
  );
  const [guests, setGuests] = useState<number>(
    Number(searchParams.get("guests")) || 2,
  );
  const [matrixData, setMatrixData] = useState<any>(null);
  const [loadingMatrix, setLoadingMatrix] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Chỉ cần gọi 1 API duy nhất, vì backend đã trả về đủ thông tin
    api
      .get(`/hotels/${id}`)
      .then((res) => {
        const hotelData = res.data?.data || res.data;
        setHotel(hotelData);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Lỗi khi tải chi tiết khách sạn",
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Hàm gọi API lấy dữ liệu ma trận
  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Vui lòng chọn đầy đủ ngày nhận và trả phòng");
      return;
    }
    setLoadingMatrix(true);
    try {
      // Đảm bảo endpoint API trùng khớp với route bạn đã tạo ở Backend
      const res = await api.get(
        `/hotels/${id}/compare-rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
      );
      setMatrixData(res.data?.data || res.data); // Tùy thuộc vào cấu trúc trả về của API
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải ma trận phòng");
    } finally {
      setLoadingMatrix(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Đang tải dữ liệu khách sạn...
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Không tìm thấy thông tin khách sạn.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
      {/* --- PHẦN 1: THÔNG TIN KHÁCH SẠN --- */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {hotel.name}
            </h1>
            <p className="flex items-center gap-2 text-slate-500 mb-6">
              <MapPin className="w-5 h-5 text-primary" /> {hotel.address}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-amber-700">5.0</span>
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed max-w-4xl">
          {hotel.description}
        </p>

        {hotel.images && hotel.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {hotel.images.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`${hotel.name} ${idx + 1}`}
                className="w-full h-48 object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-300"
              />
            ))}
          </div>
        )}
      </div>

      {/* --- TÍNH NĂNG MỚI: BỘ LỌC TÌM KIẾM & MA TRẬN PHÒNG --- */}
      <div
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
        id="room-selection"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Kiểm tra phòng trống và Giá các tùy chọn
        </h2>

        <div className="flex flex-wrap gap-4 items-end mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ngày nhận phòng
            </label>
            <input
              id="checkInPicker"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-primary focus:border-primary"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ngày trả phòng
            </label>
            <input
              type="date"
              min={checkIn || new Date().toISOString().split("T")[0]}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-primary focus:border-primary"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Số khách
            </label>
            <input
              type="number"
              min="1"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-primary focus:border-primary"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>
          <Button
            onClick={handleCheckAvailability}
            disabled={loadingMatrix}
            className="h-12 px-8 rounded-xl font-bold shadow-md"
          >
            {loadingMatrix ? "Đang tải..." : "Cập nhật giá"}
          </Button>
        </div>

        <RoomMatrix
          rooms={matrixData?.rooms || hotel.rooms}
          nights={matrixData?.nights || 1}
          onBook={(roomId) => {
            if (!matrixData) {
              toast.error(
                "Vui lòng chọn ngày nhận và trả phòng trước khi đặt!",
              );
              document.getElementById("checkInPicker")?.focus();
              return;
            }
            navigate(
              `/book/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
            );
          }}
        />
      </div>
    </div>
  );
}
