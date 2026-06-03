import { Link } from "react-router-dom";
import type { Hotel } from "../../types/api";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const defaultImage =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  const image =
    hotel.images && hotel.images.length > 0 ? hotel.images[0] : defaultImage;

  return (
    <div className="group flex flex-col bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hotel.min_price && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary shadow-sm">
            Từ ${hotel.min_price}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 bg-accent/10 px-2 py-0.5 rounded text-accent text-sm font-medium">
            <span>★</span>
            <span>{hotel.avgRating || "Mới"}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          <span className="inline-block mr-1">📍</span> {hotel.address}
        </p>

        <Link
          to={`/hotels/${hotel.id}`}
          className="block w-full text-center bg-muted text-foreground font-medium py-2.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
