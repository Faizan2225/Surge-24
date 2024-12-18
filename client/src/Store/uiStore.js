import { create } from "zustand";

const useUIStore = create((set) => ({
  isLoading: false,
  alert: null,

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set alert
  setAlert: (alert) => set({ alert }),
}));

export default useUIStore;
