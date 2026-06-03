import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { HotelCard } from "../../components/common/HotelCard";
import { getMyWishlist } from "../../services/wishlist";
import type { Hotel } from "../../types/api";

export function WishlistPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyWishlist()
      .then(setHotels)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Khách sạn yêu thích
      </h1>
      <p className="text-slate-500 mb-8">
        Danh sách các khách sạn bạn đã lưu lại để xem sau.
      </p>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Đang tải dữ liệu...
        </div>
      ) : hotels.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 shadow-none bg-slate-50 rounded-3xl">
          <p className="text-slate-500">Bạn chưa lưu khách sạn nào.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}
