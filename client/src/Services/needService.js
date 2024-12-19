import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

export const reportNeed = async (data, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${API_BASE_URL}/needs/create`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};
