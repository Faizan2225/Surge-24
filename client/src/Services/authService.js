import apiClient from "./apiClient";

// Login function
export const login = async (email, password) => {
  const response = await apiClient.post("/login", { email, password });
  return response.data;
};

// Register function
export const register = async (userData) => {
  const response = await apiClient.post("/register", userData);
  return response.data;
};

// Logout function
export const logout = async () => {
  const response = await apiClient.post("/logout");
  return response.data;
};

// Verify Email function
export const verifyEmail = async (otp) => {
  const response = await apiClient.post("/verify-email", { otp });
  return response.data;
};
