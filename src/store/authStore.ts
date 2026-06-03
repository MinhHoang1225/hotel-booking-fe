import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "../types/api";
import { loginApi, meApi, registerApi, loginGoogleApi } from "../services/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: (idToken: string, role?: Role) => Promise<void>;
  register: (payload: { email: string; password: string; fullName: string; role: Exclude<Role, "ADMIN"> }) => Promise<void>;
  refreshMe: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      async login(email, password) {
        set({ loading: true });
        try {
          const result = await loginApi(email, password);
          set({ user: result.user, token: result.token });
        } finally {
          set({ loading: false });
        }
      },
      async register(payload) {
        set({ loading: true });
        try {
          const result = await registerApi(payload);
          set({ user: result.user, token: result.token });
        } finally {
          set({ loading: false });
        }
      },
      async refreshMe() {
        if (!get().token) return;
        const user = await meApi();
        set({ user });
      },
      logout() {
        set({ user: null, token: null });
      },
      async loginGoogle(idToken, role = "USER") {
        set({ loading: true });
        try {
          const result = await loginGoogleApi(idToken, role);
          set({ user: result.user, token: result.token });
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: "hotel-booking-auth" }
  )
);
