import { useEffect, useState } from "react";
import { listHotels } from "../../services/hotels";
import type { Hotel } from "../../types/api";
import { HotelCard } from "../../components/common/HotelCard";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useSearchParams } from "react-router-dom";

export function HotelListingPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParamsUrl, setSearchParamsUrl] = useSearchParams();

  // State cho bộ lọc, ưu tiên lấy từ URL nếu có
  const [searchQuery, setSearchQuery] = useState(
    searchParamsUrl.get("q") || "",
  );
  const [minPrice, setMinPrice] = useState(
    searchParamsUrl.get("minPrice") || "",
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParamsUrl.get("maxPrice") || "",
  );
  const [capacity, setCapacity] = useState(
    searchParamsUrl.get("capacity") || "",
  );

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await listHotels({
        q: searchQuery || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        capacity: capacity || undefined,
      });
      setHotels(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (capacity) params.capacity = capacity;

    setSearchParamsUrl(params); // Cập nhật URL để chia sẻ được
    fetchHotels();
  };

  useEffect(() => {
    fetchHotels();
  }, []); // Tải lần đầu

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Bộ lọc */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-foreground">
              Bộ lọc tìm kiếm
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tìm tên hoặc địa điểm
                </label>
                <Input
                  placeholder="Vd: Hà Nội, Da Nang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Khoảng giá ($)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Số khách
                </label>
                <Input
                  type="number"
                  placeholder="Vd: 2"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={applyFilter}>
                Áp dụng bộ lọc
              </Button>
            </div>
          </div>
        </aside>

        {/* Danh sách Khách sạn */}
        <main className="w-full md:w-3/4">
          <h1 className="text-2xl font-bold mb-6 text-foreground">
            {hotels.length > 0
              ? `Tìm thấy ${hotels.length} khách sạn phù hợp`
              : "Không tìm thấy khách sạn nào"}
          </h1>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[350px] bg-muted rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
