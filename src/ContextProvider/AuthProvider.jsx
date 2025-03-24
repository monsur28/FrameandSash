import { createContext, useState, useEffect, useCallback } from "react";
import {
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../Firbase/firebase.config";
import axiosSecure from "../Hooks/AsiosSecure";

const AuthContext = createContext();
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Memoize verifyTokenWithAPI using useCallback
  const verifyTokenWithAPI = useCallback(async (token) => {
    try {
      const response = await axiosSecure.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Token verification failed:", error);
      setLoading(false);
      logOut(); // Ensure the user logs out if token verification fails
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      setLoading(false);
      return;
    }

    verifyTokenWithAPI(token); // ✅ Only verify, do not refresh page
  }, [verifyTokenWithAPI]);

  const registerUser = async (email, password, userName) => {
    setLoading(true);
    try {
      const response = await axiosSecure.post("/register", {
        user_name: userName,
        email,
        password,
      });

      const { token, user } = response.data;
      sessionStorage.setItem("jwtToken", token);
      setUser(user);

      return user;
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axiosSecure.post("/login", {
        email,
        password,
      });
      const { token, user } = response.data;

      sessionStorage.setItem("jwtToken", token);
      setUser(user);

      return user;
    } catch (error) {
      throw new Error(
        console.error("Login failed:", error.response.data) ||
          error.response?.data?.message ||
          "Incorrect email or password. Please try again."
      );
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        user_name: user.displayName || user.email.split("@")[0], // Required
        email: user.email, // Required
        password: user.uid, // Dummy password since Google handles auth
        user_image: user.photoURL || null, // Ensure this field is included
      };

      const response = await axiosSecure.post("/register", userData);
      const { token } = response.data;

      sessionStorage.setItem("jwtToken", token);
      await verifyTokenWithAPI(token);

      return user;
    } catch (error) {
      console.error("Google login failed:", error);
      throw new Error(error.response?.data?.message || "Google login failed");
    }
  };

  const facebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        user_name: user.displayName || user.email.split("@")[0], // Use a fallback if displayName is missing
        photoURL: user.photoURL,
        provider: "facebook",
      };

      const response = await axiosSecure.post("/register", userData);
      const { token } = response.data;

      sessionStorage.setItem("jwtToken", token);
      await verifyTokenWithAPI(token);

      return user;
    } catch (error) {
      console.error("Facebook login failed:", error);
      throw new Error("Facebook login failed");
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn("Error logging out:", error);
    }

    sessionStorage.removeItem("jwtToken");
    setUser(null);
    window.location.href = "/";
  };

  const authInfo = {
    user,
    loading,
    registerUser, // ✅ Now uses API only
    loginUser, // ✅ Now uses API only
    googleLogin, // ✅ Uses Firebase
    facebookLogin, // ✅ Uses Firebase
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
