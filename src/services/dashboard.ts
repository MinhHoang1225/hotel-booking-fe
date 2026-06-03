import { api } from "./api";

export async function ownerDashboard() {
  const { data } = await api.get<{ success: boolean; data: Record<string, number> }>("/dashboard/owner");
  return data.data;
}

export async function adminDashboard() {
  const { data } = await api.get<{ success: boolean; data: Record<string, number> }>("/dashboard/admin");
  return data.data;
}
