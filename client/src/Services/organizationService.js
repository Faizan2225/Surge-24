import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

const registerOrganization = async (orgData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure token is added here
      },
    };
    const response = await axios.post(
      `${API_BASE_URL}/organization/register`,
      orgData,
      config
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export { registerOrganization };
