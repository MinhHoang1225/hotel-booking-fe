import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../services/api";
import { useAuthStore } from "../store/authStore";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
};

export function useNotifications() {
  const token = useAuthStore((state) => state.token);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socket.on("notification", (notification: Notification) => {
      setNotifications((current) => [notification, ...current].slice(0, 6));
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return notifications;
}
