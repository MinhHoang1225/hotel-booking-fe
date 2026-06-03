import { api } from "./api";
import type { Role, User } from "../types/api";

type AuthResponse = {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
};

export async function loginApi(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data.data;
}

export async function registerApi(payload: {
  email: string;
  password: string;
  fullName: string;
  role: Exclude<Role, "ADMIN">;
}) {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data.data;
}

export async function meApi() {
  const { data } = await api.get<{ success: boolean; data: User }>("/auth/me");
  return data.data;
}

export async function loginGoogleApi(idToken: string, role: Role = "USER") {
  const { data } = await api.post<AuthResponse>("/auth/google", { 
    idToken, 
    role 
  });
  return data.data;
}