import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);
