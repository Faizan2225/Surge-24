import { create } from "zustand";

export const useNeedStore = create((set) => ({
  categories: ["Health", "Education", "Environment", "Food"],
  urgencyLevels: ["Low", "Medium", "High"],
}));
