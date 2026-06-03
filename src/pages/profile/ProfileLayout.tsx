import { Heart, User, Clock, LogOut } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

export function ProfileLayout() {
  const location = useLocation();

  const menuItems = [
    {
      path: "/profile",
      icon: User,
      label: "Thông tin cá nhân",
      desc: "Quản lý thông tin của bạn",
    },
    {
      path: "/profile/wishlist",
      icon: Heart,
      label: "Khách sạn yêu thích",
      desc: "Xem lại các khách sạn đã lưu",
    },
    {
      path: "/profile/bookings",
      icon: Clock,
      label: "Lịch sử đặt phòng",
      desc: "Quản lý các chuyến đi",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 grid lg:grid-cols-[300px_1fr] gap-8 items-start">
      {/* Thanh Menu điều hướng bên trái */}
      <aside className="bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24 space-y-2">
        <h2 className="text-xl font-bold text-slate-900 px-4 mb-4 pt-2">
          Tài khoản
        </h2>

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                isActive
                  ? "bg-slate-50 border-slate-100 shadow-sm"
                  : "border-transparent hover:bg-slate-50 hover:border-slate-100"
              }`}
            >
              <div
                className={`p-3 rounded-xl shrink-0 transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${item.path === "/profile/wishlist" ? "fill-red-500 text-red-500 bg-transparent" : ""}`}
                />
              </div>
              <div>
                <h3
                  className={`font-bold ${isActive ? "text-primary" : "text-slate-900"}`}
                >
                  {item.label}
                </h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </Link>
          );
        })}

        <button className="w-full flex items-center gap-4 p-4 mt-4 hover:bg-red-50 rounded-2xl transition-colors border border-transparent hover:border-red-100 group">
          <div className="p-3 bg-slate-100 text-slate-500 rounded-xl shrink-0 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">
              Đăng xuất
            </h3>
            <p className="text-sm text-slate-500">Thoát khỏi hệ thống</p>
          </div>
        </button>
      </aside>

      {/* Nội dung chính bên phải (sẽ render WishlistPage, ProfilePage... tùy route) */}
      <main className="min-h-[500px]">
        <Outlet />
      </main>
    </div>
  );
}
