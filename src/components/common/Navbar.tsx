import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { notifications, unreadCount, fetchNotifications, markAsRead, connectSocket, disconnectSocket } = useNotificationStore();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
            H
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            Booking<span className="text-primary">System</span>
          </span>
        </Link>

        {/* Main Menu Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/hotels"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Khách sạn
          </Link>

        </nav>

        {/* Navigation & Auth */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* IN-APP NOTIFICATION BELL */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative p-2 text-slate-500 hover:text-primary transition-colors focus:outline-none"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900">Thông báo</h3>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-500">Chưa có thông báo nào.</div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} onClick={() => !notif.isRead && markAsRead(notif.id)} className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!notif.isRead ? "bg-blue-50/30" : ""}`}>
                            <div className="flex justify-between items-start mb-1">
                              <p className={`text-sm ${!notif.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>{notif.title}</p>
                              {!notif.isRead && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></span>}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-sm font-medium text-foreground hidden sm:block">
                Xin chào, {user.fullName}
              </span>
              {user.role === "HOTEL_OWNER" && (
                <>
                  <Link
                    to="/owner/hotels"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Quản lý Hotel
                  </Link>
                  <Link
                    to="/owner/rooms"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Quản lý Phòng
                  </Link>
                  <Link
                    to="/owner/reviews"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Quản lý Đánh giá
                  </Link>
                </>
              )}
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary font-bold hover:bg-primary hover:text-white transition-colors ml-2"
                title="Hồ sơ"
              >
                {user.fullName.charAt(0).toUpperCase()}
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
