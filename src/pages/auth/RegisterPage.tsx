import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ErrorState } from "../../components/common/ErrorState";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useAuthStore } from "../../store/authStore";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["USER", "HOTEL_OWNER"]),
});
type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const registerAccount = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "USER" },
  });

  async function submit(values: FormValues) {
    setError("");
    try {
      await registerAccount(values);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070"
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
                Bắt đầu hành trình khám phá cùng Velora
              </h2>

              <p className="mt-4 max-w-md text-white/80">
                Tạo tài khoản để tìm kiếm khách sạn, nhận ưu đãi hấp dẫn và quản
                lý đặt phòng của bạn một cách dễ dàng.
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

        <div className="relative flex items-center justify-center px-6 py-12">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />

          <div className="relative w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lg">
                V
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Tạo tài khoản mới
              </h2>

              <p className="mt-2 text-slate-600">
                Tham gia cộng đồng du lịch cùng Velora
              </p>
            </div>

            <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              {error && (
                <div className="mb-4">
                  <ErrorState message={error} />
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit(submit)}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Họ và tên
                  </label>

                  <Input
                    placeholder="Nhập họ và tên"
                    {...register("fullName")}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Địa chỉ Email
                  </label>

                  <Input
                    placeholder="Nhập địa chỉ email"
                    {...register("email")}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Mật khẩu
                  </label>

                  <Input
                    type="password"
                    placeholder="Tối thiểu 8 ký tự"
                    {...register("password")}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700">
                    Bạn muốn đăng ký với vai trò nào?
                  </label>

                  <div className="space-y-3">
                    <label
                      className={`block cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                        watch("role") === "USER"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        value="USER"
                        {...register("role")}
                        className="hidden"
                      />

                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            watch("role") === "USER"
                              ? "bg-primary text-white"
                              : "bg-blue-100"
                          }`}
                        >
                          👤
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-900">
                              Khách hàng
                            </h4>

                            {watch("role") === "USER" && (
                              <div className="h-5 w-5 rounded-full bg-primary" />
                            )}
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            Tìm kiếm khách sạn, đặt phòng, theo dõi lịch sử đặt
                            chỗ và nhận các ưu đãi hấp dẫn.
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`block cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                        watch("role") === "HOTEL_OWNER"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        value="HOTEL_OWNER"
                        {...register("role")}
                        className="hidden"
                      />

                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            watch("role") === "HOTEL_OWNER"
                              ? "bg-primary text-white"
                              : "bg-amber-100"
                          }`}
                        >
                          🏨
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-900">
                              Chủ khách sạn
                            </h4>

                            {watch("role") === "HOTEL_OWNER" && (
                              <div className="h-5 w-5 rounded-full bg-primary" />
                            )}
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            Đăng tải khách sạn, quản lý phòng, theo dõi đơn đặt
                            phòng và doanh thu trên Velora.
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {Object.values(errors)[0] && (
                  <p className="text-sm text-red-500">
                    {Object.values(errors)[0]?.message}
                  </p>
                )}

                <Button
                  disabled={loading}
                  className="h-12 w-full rounded-xl text-base font-semibold"
                >
                  {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
