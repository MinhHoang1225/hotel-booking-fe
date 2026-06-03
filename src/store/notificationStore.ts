import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { api, SOCKET_URL } from "../services/api";
import { useAuthStore } from "./authStore";
import toast from "react-hot-toast";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  socket: Socket | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  socket: null,

  fetchNotifications: async () => {
    try {
      const { data } = await api.get("/notifications");
      set({
        notifications: data.data,
        unreadCount: data.data.filter((n: any) => !n.isRead).length,
      });
    } catch (error) {
      console.error("Lỗi lấy thông báo", error);
    }
  },

  markAsRead: async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  connectSocket: () => {
    const token = useAuthStore.getState().token;
    if (!token || get().socket) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socket.on("notification", (newNotif) => {
      set((state) => ({
        notifications: [newNotif, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
      
      // Hiển thị Pop-up Toast góc màn hình để người dùng dễ nhận biết
      toast(newNotif.title, { icon: "🔔", duration: 4000 });
      
    });
    set({ socket });
  },

  disconnectSocket: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },
}));
