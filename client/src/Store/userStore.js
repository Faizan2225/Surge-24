import { create } from "zustand";
import { fetchUserProfile, updateUserProfile } from "../Services/userService";

const useUserStore = create((set) => ({
  profile: null,
  isLoading: false,

  // Fetch user profile data
  fetchProfile: async (token) => {
    set({ isLoading: true });
    try {
      const profileData = await fetchUserProfile(token);
      set({ profile: profileData });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // Update user profile
  updateProfile: async (updatedProfile, token) => {
    set({ isLoading: true });
    try {
      const updatedData = await updateUserProfile(updatedProfile, token);
      set({ profile: updatedData });
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useUserStore;
