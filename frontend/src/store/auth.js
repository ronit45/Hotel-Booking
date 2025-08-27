import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
  loginStart: () => set({ loading: true, error: null }),
  loginSuccess: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, loading: false, error: null });
  },
  loginFailure: (error) => set({ user: null, loading: false, error }),
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null, loading: false, error: null });
  },
}));
