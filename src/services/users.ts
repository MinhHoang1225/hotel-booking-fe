import { api } from "./api";

export async function listUsers() {
  const { data } = await api.get<{ success: boolean; data: any[] }>("/users");
  return data.data;
}

export async function updateUserRole(id: string, role: string) {
  const { data } = await api.patch<{ success: boolean; data: any }>(
    `/users/${id}/role`,
    { role },
  );
  return data.data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete<{ success: boolean; data: any }>(
    `/users/${id}`,
  );
  return data.data;
}
