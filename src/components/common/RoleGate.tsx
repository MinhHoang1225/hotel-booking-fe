import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import type { Role } from "../../types/api";
import { useAuthStore } from "../../store/authStore";

export function RequireAuth({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RequireRole({ roles, children }: PropsWithChildren<{ roles: Role[] }>) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
