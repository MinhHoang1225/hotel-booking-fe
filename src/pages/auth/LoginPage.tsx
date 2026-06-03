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
      await login(values.email, values.password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await loginGoogle(credentialResponse.credential); // credential chính là idToken
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Đăng nhập
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Chào mừng bạn quay trở lại với hệ thống
          </p>
        </div>

        {error && <ErrorState message={error} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submit)}>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Địa chỉ Email"
                {...register("email")}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border-slate-200 focus:bg-white"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                placeholder="Mật khẩu"
                type="password"
                {...register("password")}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
          </div>

          <Button
            className="w-full py-3 text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-200 after:mt-0.5 after:flex-1 after:border-t after:border-slate-200">
          <p className="mx-4 mb-0 text-center text-sm font-medium text-slate-500">
            HOẶC
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
          />
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Chưa có tài khoản?{" "}
          <Link
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
            to="/register"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
