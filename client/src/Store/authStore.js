import { create } from "zustand";
import { login, register, logout } from "../Services/authService";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  alert: null,
  setUser: (user, token) => set({ user, token, isAuthenticated: true }),
  clearUser: () => set({ user: null, token: null, isAuthenticated: false }),

  // Login action
  loginUser: async (email, password) => {
    set({ isLoading: true, alert: null });
    try {
      const data = await login(email, password);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        alert: { type: "success", message: "Login successful!" },
      });
    } catch (err) {
      set({
        alert: {
          type: "error",
          message: err.response?.data?.message || "Login failed!",
        },
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Register action
  registerUser: async (userData) => {
    set({ isLoading: true, alert: null });
    try {
      const data = await register(userData);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        alert: { type: "success", message: "Registration successful!" },
      });
    } catch (err) {
      set({
        alert: {
          type: "error",
          message: err.response?.data?.message || "Registration failed!",
        },
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Logout action
  logoutUser: async () => {
    set({ isLoading: true });
    try {
      await logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        alert: { type: "success", message: "Logged out successfully!" },
      });
    } catch (err) {
      set({ alert: { type: "error", message: "Logout failed!" } });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
