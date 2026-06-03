export type Role = "USER" | "HOTEL_OWNER" | "ADMIN";
export type HotelStatus = "PENDING" | "APPROVED" | "REJECTED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type User = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  role: Role;
};

export type Hotel = {
  id: string;
  ownerId: string;
  name: string;
  description?: string | null;
  address: string;
  latitude: string | number;
  longitude: string | number;
  status: HotelStatus;
  images: string[];
  avgRating?: number;
  min_price?: number;
  review_count?: number;
  rooms?: Room[];
};

export type Room = {
  id: string;
  hotelId: string;
  name: string;
  description?: string | null;
  price: string | number;
  capacity: number;
  amenities: string[];
  images: string[];
  status: "AVAILABLE" | "UNAVAILABLE" | "MAINTENANCE";
  hotel?: Hotel;
};

export type Booking = {
  id: string;
  userId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: string | number;
  status: BookingStatus;
  room?: Room;
  payment?: Payment | null;
  review?: Review | null;
};

export type Payment = {
  id: string;
  bookingId: string;
  amount: string | number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
  provider: string;
};

export type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  reply?: string | null;
  user?: Pick<User, "id" | "fullName" | "avatarUrl">;
  createdAt: string;
};

export type Paginated<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
