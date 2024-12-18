import apiClient from "./apiClient";

// Fetch user profile
export const fetchUserProfile = async (token) => {
  const response = await apiClient.get("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData, token) => {
  const response = await apiClient.put("/profile/update", profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
