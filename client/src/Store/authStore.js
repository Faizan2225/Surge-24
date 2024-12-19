import { create } from "zustand";
import { login, register, logout, verifyEmail } from "../Services/authService";
import Cookies from "js-cookie";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  alert: null,

  // Initialize Zustand store with data from cookies
  initializeAuth: () => {
    const token = Cookies.get("auth_token");
    const user = Cookies.get("auth_user")
      ? JSON.parse(Cookies.get("auth_user"))
      : null;

    if (token && user) {
      set({
        user,
        token,
        isAuthenticated: true,
      });
    }
  },

  setUser: (user, token) => {
    Cookies.set("auth_token", token); // Store token in cookies
    Cookies.set("auth_user", JSON.stringify(user)); // Store user in cookies
    set({ user, token, isAuthenticated: true });
  },

  clearUser: () => {
    Cookies.remove("auth_token"); // Clear token from cookies
    Cookies.remove("auth_user"); // Clear user from cookies
    set({ user: null, token: null, isAuthenticated: false });
  },

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
      Cookies.set("auth_token", data.token); // Persist token
      Cookies.set("auth_user", JSON.stringify(data.user)); // Persist user
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
      Cookies.set("auth_token", data.token); // Persist token
      Cookies.set("auth_user", JSON.stringify(data.user)); // Persist user
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
      Cookies.remove("auth_token");
      Cookies.remove("auth_user");
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

  // Verify Email action
  verifyEmail: async (otp) => {
    set({ isLoading: true });
    try {
      await verifyEmail(otp);
      set({
        alert: { type: "success", message: "Email verified successfully!" },
      });
    } catch (err) {
      set({
        alert: {
          type: "error",
          message: err.response?.data?.message || "Email verification failed!",
        },
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Register Organization action
  registerOrganization: async (orgData) => {
    set({ isLoading: true, alert: null });
    try {
      const data = await registerOrganization(orgData);
      set({
        alert: {
          type: "success",
          message: "Organization registered successfully!",
        },
      });
    } catch (err) {
      set({
        alert: {
          type: "error",
          message:
            err.response?.data?.message || "Organization registration failed!",
        },
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
