import { api } from "./api";

export async function updateProfile(data: {
  fullName?: string;
  avatar?: string;
}) {
  const res = await api.patch("/auth/me", data);
  return res.data;
}
