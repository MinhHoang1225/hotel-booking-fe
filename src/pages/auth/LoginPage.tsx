import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ErrorState } from "../../components/common/ErrorState";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { GoogleLogin } from "@react-oauth/google";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const loginGoogle = useAuthStore((state) => state.loginGoogle);
  async function submit(values: FormValues) {
    setError("");
    try {
      await login(values.email, values.password, values.rememberMe);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await loginGoogle(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Hero Section */}
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
            alt="Velora Hotel"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />

          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <div>
              <h1 className="text-5xl font-bold tracking-tight">Velora</h1>

              <p className="mt-3 text-lg text-white/90">
                Kỳ nghỉ đẳng cấp. Đặt phòng dễ dàng.
              </p>
            </div>

            <div>
              <h2 className="max-w-lg text-4xl font-bold leading-tight">
                Tìm kiếm nơi lưu trú hoàn hảo cho chuyến đi của bạn
              </h2>

              <p className="mt-4 max-w-md text-white/80">
                Khám phá những khách sạn chất lượng, ưu đãi hấp dẫn và trải
                nghiệm du lịch đáng nhớ cùng Velora.
              </p>

              <div className="mt-8 flex gap-8">
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-white/80">Khách sạn</p>
                </div>

                <div>
                  <p className="text-3xl font-bold">150+</p>
                  <p className="text-white/80">Thành phố</p>
                </div>

                <div>
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-white/80">Khách hàng</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="relative flex items-center justify-center px-6 py-12">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />

          <div className="relative w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 text-center">
              {/* Thay bằng logo Cloudinary nếu có */}
              {/* <img
              src={LOGO_URL}
              alt="Velora"
              className="mx-auto mb-4 h-20 w-auto"
            /> */}



              <h2 className="text-3xl font-bold text-slate-900">
                Chào mừng trở lại
              </h2>

              <p className="mt-2 text-slate-600">
                Đăng nhập để tiếp tục hành trình cùng Velora
              </p>
            </div>

            <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              {error && (
                <div className="mb-4">
                  <ErrorState message={error} />
                </div>
              )}

              <form onSubmit={handleSubmit(submit)} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Địa chỉ Email
                  </label>

                  <Input
                    placeholder="Nhập địa chỉ email"
                    {...register("email")}
                    className="h-12 rounded-xl border-slate-200"
                  />

                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Mật khẩu
                  </label>

                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    {...register("password")}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register("rememberMe")}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-slate-700"
                  >
                    Nhớ đăng nhập trên thiết bị này
                  </label>
                </div>

                <Button
                  disabled={loading}
                  className="h-12 w-full rounded-xl text-base font-semibold"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>

              <div className="my-6 flex items-center">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="px-4 text-sm text-slate-500">HOẶC</span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Đăng nhập Google thất bại")}
                />
              </div>

              <p className="mt-8 text-center text-sm text-slate-600">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-primary hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
