import axios from "axios";
import Cookies from "js-cookie"; // Ensure you install the js-cookie library: `npm install js-cookie`

const axiosSecure = axios.create({
  baseURL: "http://frameandsash.great-site.net/api", // Base URL for your API
});

axiosSecure.interceptors.request.use(
  (config) => {
    // Get the token from the cookie
    const token = Cookies.get("next-auth.session-token"); // Fetch the token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - invalid or expired token.");
      // Optionally redirect to login or refresh the token
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;
