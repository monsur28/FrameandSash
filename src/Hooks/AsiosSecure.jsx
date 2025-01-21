import axios from "axios";
import Cookies from "js-cookie";

const axiosSecure = axios.create({
  baseURL: "https://frame.twintechsoft.com", // Base URL for your API
  headers: { "Content-Type": "application/json" },
});

axiosSecure.interceptors.request.use(
  (config) => {
    const token = Cookies.get("next-auth.session-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access - invalid or expired token.");
      // Add token refresh logic or redirect here
      window.location.href = "/login";
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;
