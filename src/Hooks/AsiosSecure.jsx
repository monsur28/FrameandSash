import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://frame.twintechsoft.com",
  // baseURL: "https://frame.twintechsoft.com", // Adjust for your local or production URL
});

// Intercepting all requests to add Authorization header with token
axiosSecure.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jwtToken"); // Get token from sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token in Authorization header
    }
    return config; // Return the config to continue the request
  },
  (error) => Promise.reject(error) // If any error in request, reject the promise
);

// Handling responses, especially unauthorized or server errors
axiosSecure.interceptors.response.use(
  (response) => response, // Simply return the response if successful
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access - invalid or expired token.");
      // Redirect to login page or trigger token refresh logic
      window.location.href = "/login";
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }
    return Promise.reject(error); // Reject the error to handle it elsewhere
  }
);

export default axiosSecure;
