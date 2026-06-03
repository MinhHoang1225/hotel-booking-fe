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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Trải nghiệm dịch vụ đặt phòng tốt nhất
          </p>
        </div>

        {error && <ErrorState message={error} />}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(submit)}>
          <div className="space-y-4">
            <Input
              placeholder="Họ và tên"
              {...register("fullName")}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border-slate-200 focus:bg-white"
            />
            <Input
              placeholder="Địa chỉ Email"
              {...register("email")}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border-slate-200 focus:bg-white"
            />
            <Input
              placeholder="Mật khẩu (tối thiểu 8 ký tự)"
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border-slate-200 focus:bg-white"
            />
            <Select
              {...register("role")}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border-slate-200 focus:bg-white"
            >
              <option value="USER">Khách hàng (User)</option>
              <option value="HOTEL_OWNER">Chủ khách sạn (Hotel Owner)</option>
            </Select>
            {Object.values(errors)[0] && (
              <p className="mt-1 text-sm text-red-600">
                {Object.values(errors)[0]?.message}
              </p>
            )}
          </div>

          <Button
            className="w-full py-3 text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
            disabled={loading}
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Đã có tài khoản?{" "}
          <Link
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
            to="/login"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
