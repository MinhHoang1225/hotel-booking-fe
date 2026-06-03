import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/common/AppLayout";
import { RequireAuth, RequireRole } from "./components/common/RoleGate";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { BookingPage } from "./pages/booking/BookingPage";
import { BookingSuccessPage } from "./pages/booking/BookingSuccessPage";
import { PaymentPage } from "./pages/booking/PaymentPage";
import { AdminDashboardPage } from "./pages/dashboard/AdminDashboardPage";
import { ApproveHotelsPage } from "./pages/dashboard/ApproveHotelsPage";
import { BookingManagementPage } from "./pages/dashboard/BookingManagementPage";
import { ManageHotelsPage } from "./pages/dashboard/ManageHotelsPage";
import { ManageRoomsPage } from "./pages/dashboard/ManageRoomsPage";
import { ManageUsersPage } from "./pages/dashboard/ManageUsersPage";
import { OwnerDashboardPage } from "./pages/dashboard/OwnerDashboardPage";
import { HomePage } from "./pages/HomePage";
import { HotelDetailPage } from "./pages/hotels/HotelDetailPage";
import { HotelListingPage } from "./pages/hotels/HotelListingPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { WishlistPage } from "./pages/profile/WishlistPage";
import { ManageReviewsPage } from "./pages/dashboard/ManageReviewsPage";

export function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelListingPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/booking"
            element={
              <RequireRole roles={["USER"]}>
                <BookingPage />
              </RequireRole>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <RequireRole roles={["USER"]}>
                <PaymentPage />
              </RequireRole>
            }
          />
          <Route
            path="/booking-success/:id"
            element={
              <RequireRole roles={["USER"]}>
                <BookingSuccessPage />
              </RequireRole>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/wishlist"
            element={
              <RequireRole roles={["USER"]}>
                <WishlistPage />
              </RequireRole>
            }
          />

          <Route
            path="/owner"
            element={
              <RequireRole roles={["HOTEL_OWNER"]}>
                <OwnerDashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/owner/hotels"
            element={
              <RequireRole roles={["HOTEL_OWNER"]}>
                <ManageHotelsPage />
              </RequireRole>
            }
          />
          <Route
            path="/owner/rooms"
            element={
              <RequireRole roles={["HOTEL_OWNER"]}>
                <ManageRoomsPage />
              </RequireRole>
            }
          />
          <Route
            path="/owner/reviews"
            element={
              <RequireRole roles={["HOTEL_OWNER"]}>
                <ManageReviewsPage />
              </RequireRole>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <RequireRole roles={["HOTEL_OWNER"]}>
                <BookingManagementPage />
              </RequireRole>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireRole roles={["ADMIN"]}>
                <AdminDashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireRole roles={["ADMIN"]}>
                <ManageUsersPage />
              </RequireRole>
            }
          />
          <Route
            path="/admin/approve-hotels"
            element={
              <RequireRole roles={["ADMIN"]}>
                <ApproveHotelsPage />
              </RequireRole>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <RequireRole roles={["ADMIN"]}>
                <BookingManagementPage />
              </RequireRole>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
