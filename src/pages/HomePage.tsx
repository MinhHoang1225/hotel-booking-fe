import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listHotels } from "../services/hotels";
import type { Hotel } from "../types/api";
import { HotelCard } from "../components/common/HotelCard";

export function HomePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    q: "",
    capacity: "",
  });

  const fetchHotels = async (params = {}) => {
    setLoading(true);
    try {
      const res = await listHotels(params);
      setHotels(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách sạn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels(); 
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== ""),
    );
    const queryString = new URLSearchParams(cleanedParams as any).toString();
    navigate(`/hotels?${queryString}`); 
  };

  return (
    <div className="w-full">
      <section className="relative bg-foreground text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d27448d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Tìm nơi dừng chân hoàn hảo cho chuyến đi của bạn
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            Hàng ngàn khách sạn cao cấp, villa và resort đang chờ đón bạn khám
            phá với mức giá cực kỳ ưu đãi.
          </p>

          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-md text-slate-900 p-3 rounded-3xl md:rounded-full flex flex-col md:flex-row items-center gap-3 shadow-2xl max-w-4xl mx-auto border border-white/20"
          >
            <div className="flex-1 w-full md:w-auto px-6 py-2 border-b md:border-b-0 md:border-r border-slate-200/50">
              <label className="block text-xs font-bold text-slate-500 uppercase text-left mb-1">
                Địa điểm
              </label>
              <input
                type="text"
                placeholder="Bạn muốn đi đâu?"
                className="w-full outline-none text-sm font-medium bg-transparent placeholder-slate-400"
                value={searchParams.q}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, q: e.target.value })
                }
              />
            </div>
            <div className="flex-1 w-full md:w-auto px-4 py-2">
              <label className="block text-xs font-bold text-slate-500 uppercase text-left mb-1">
                Khách
              </label>
              <input
                type="number"
                min="1"
                placeholder="Số người?"
                className="w-full outline-none text-sm font-medium bg-transparent placeholder-slate-400"
                value={searchParams.capacity}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, capacity: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 md:py-4 px-8 rounded-2xl md:rounded-full transition-colors mt-2 md:mt-0"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Điểm đến thịnh hành
          </h2>
          <p className="text-gray-500 mt-2">
            Các lựa chọn được yêu thích nhất từ du khách.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[350px] bg-muted rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
