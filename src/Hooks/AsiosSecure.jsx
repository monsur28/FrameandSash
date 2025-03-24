import axios from "axios";

const axiosSecure = axios.create({
  // baseURL: "http://127.0.0.1:8000/api", // Adjust for your local or production URL
  baseURL: "https://api.frame.twintechsoft.com/api", // Adjust for your local or production URL
});

axiosSecure.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jwtToken"); // Use localStorage for persistent login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token in Authorization header
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
      window.location.href = "/register"; // Redirect to login
    } else if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    } else if (error.response?.status === 403) {
      console.error("Forbidden - you don't have permission.");
    } else if (error.response?.status === 404) {
      console.error("Resource not found:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;
