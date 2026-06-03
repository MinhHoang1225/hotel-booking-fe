import { CalendarDays, MapPin, Star, Users, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import {
  getHotel,
  listHotelReviews,
  listHotelRooms,
} from "../../services/hotels";
import type { Hotel, Review, Room } from "../../types/api";
import { formatMoney } from "../../utils/money";
import { toggleWishlist, getMyWishlist } from "../../services/wishlist";
import toast from "react-hot-toast";

export function HotelDetailPage() {
  const { id = "" } = useParams();
  const [searchParams] = useSearchParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dates, setDates] = useState({
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("capacity") || "2",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    Promise.all([getHotel(id), listHotelReviews(id)])
      .then(([hotelData, reviewData]) => {
        setHotel(hotelData);
        setReviews(reviewData);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Cannot load hotel"),
      )
      .finally(() => setLoading(false));

    // Kiểm tra trạng thái yêu thích
    getMyWishlist()
      .then((wishlist) => {
        if (wishlist.some((h) => h.id === id)) {
          setIsFavorite(true);
        }
      })
      .catch(() => {});
  }, [id]);

  // Tự động tải lại danh sách phòng khi đổi ngày nhận/trả phòng
  useEffect(() => {
    listHotelRooms(id, dates.checkIn, dates.checkOut)
      .then(setRooms)
      .catch(console.error);
  }, [id, dates.checkIn, dates.checkOut]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!hotel) return null;

  const image =
    hotel.images?.[0] ||
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop";

  // Tính số đêm dựa trên ngày nhận và trả phòng
  const getStayDays = () => {
    if (!dates.checkIn || !dates.checkOut) return 1;
    const inDate = new Date(dates.checkIn);
    const outDate = new Date(dates.checkOut);
    const days = Math.ceil(
      (outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24),
    );
    return days > 0 ? days : 1;
  };
  const stayDays = getStayDays();

  const handleToggleFavorite = async () => {
    try {
      const res = await toggleWishlist(id);
      setIsFavorite(res.status === "added");
      toast.success(
        res.status === "added"
          ? "Đã lưu vào danh sách yêu thích!"
          : "Đã bỏ lưu khỏi danh sách yêu thích!",
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Vui lòng đăng nhập để lưu khách sạn!",
      );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 shadow-sm relative group">
          <img
            src={image}
            alt={hotel.name}
            className="h-[450px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <Card className="p-8 rounded-3xl border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">
              {hotel.name}
            </h1>
            <button
              onClick={handleToggleFavorite}
              className="p-3 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500 shrink-0"
            >
              <Heart
                className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
            </button>
          </div>
          <p className="mt-3 flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4" />
            {hotel.address}
          </p>
          <p className="mt-4 text-slate-700">
            {hotel.description || "A comfortable hotel ready for your stay."}
          </p>
          <div className="mt-5 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-amber-600">
              <Star className="h-4 w-4 fill-amber-500" />
              {Number(hotel.avgRating || 0).toFixed(1)}
            </span>
            <span className="text-slate-500">{reviews.length} đánh giá</span>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-inner">
            <iframe
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=16&output=embed`}
            ></iframe>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Danh sách phòng
          </h2>
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="grid gap-4 p-6 md:grid-cols-[1fr_auto] rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {room.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {room.description ||
                    "Comfortable room with essential amenities."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {room.capacity} guests
                  </span>
                  {room.amenities?.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex min-w-40 flex-col items-end justify-between gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatMoney(Number(room.price) * stayDays)}
                  </div>
                  <div className="text-sm text-slate-500">
                    cho {stayDays} đêm ({formatMoney(room.price)}/đêm)
                  </div>
                </div>
                {!dates.checkIn || !dates.checkOut ? (
                  <Button
                    disabled
                    variant="outline"
                    className="border-slate-200 text-slate-500 bg-slate-50 cursor-not-allowed opacity-100"
                  >
                    Chọn ngày để đặt
                  </Button>
                ) : (room as any).isBooked ? (
                  <Button
                    disabled
                    variant="secondary"
                    className="cursor-not-allowed opacity-100 bg-slate-200 text-slate-500"
                  >
                    Đã được đặt
                  </Button>
                ) : Number(dates.guests) > room.capacity ? (
                  <Button
                    disabled
                    variant="outline"
                    className="border-red-200 text-red-500 bg-red-50 cursor-not-allowed opacity-100"
                  >
                    Tối đa {room.capacity} khách
                  </Button>
                ) : (
                  <Link
                    to={`/booking?roomId=${room.id}&hotelId=${hotel.id}&checkIn=${dates.checkIn}&checkOut=${dates.checkOut}&guests=${dates.guests}`}
                  >
                    <Button>
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Book
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
          <h2 className="pt-8 text-2xl font-bold text-slate-900 mb-4">
            Đánh giá từ khách hàng
          </h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <Card
                key={review.id}
                className="p-5 rounded-2xl border-slate-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {review.user?.fullName || "Guest"}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    {review.rating}/5
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
              </Card>
            ))
          )}
        </div>
        <Card className="h-fit space-y-4 p-6 rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
          <h2 className="text-xl font-bold text-slate-900">
            Chọn ngày lưu trú
          </h2>
          <Input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={dates.checkIn}
            onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
          />
          <Input
            type="date"
            min={dates.checkIn || new Date().toISOString().split("T")[0]}
            value={dates.checkOut}
            onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
          />
        </Card>
      </section>
    </div>
  );
}
