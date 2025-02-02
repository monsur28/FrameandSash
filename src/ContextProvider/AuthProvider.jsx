import { createContext, useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"; // Added updateProfile
import { auth } from "../Firbase/firebase.config";
import axiosSecure from "../Hooks/AsiosSecure";
import Loader from "../Shared/Loader";

const AES_SECRET_KEY =
  "e3d4c5e8a7e84c2c915c6acdf3c6789f908eb3ac9d63490e6af4064586205ed2";

function encryptData(data) {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    AES_SECRET_KEY
  ).toString();
  return ciphertext;
}

function decryptData(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, AES_SECRET_KEY);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedStr);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

const AuthContext = createContext();
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Checks if a token is valid (expiration check).
   */
  const validateToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  /**
   * On component mount, checks for a Firebase user.
   * If none, checks sessionStorage for both a valid token and stored user object.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch full user data from Firebase
        const fullFirebaseUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email,
          photoURL: firebaseUser.photoURL || null,
          // Add more fields as needed
        };
        setUser(fullFirebaseUser);
      } else {
        const token = sessionStorage.getItem("jwtToken");
        const encryptedUser = sessionStorage.getItem("appData");

        if (token && validateToken(token) && encryptedUser) {
          const decryptedUser = decryptData(encryptedUser);
          if (decryptedUser) {
            setUser(decryptedUser);
          } else {
            // If decryption fails, clear session
            sessionStorage.removeItem("jwtToken");
            sessionStorage.removeItem("appData");
            setUser(null);
          }
        } else {
          sessionStorage.removeItem("jwtToken");
          sessionStorage.removeItem("appData");
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Attempts Firebase login first; if it fails, tries the “/api/login” endpoint.
   */
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      // 1) Attempt Firebase login
      const firebaseUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Fetch full user data from Firebase
      const fullFirebaseUser = {
        uid: firebaseUser.user.uid,
        email: firebaseUser.user.email,
        name: firebaseUser.user.displayName || firebaseUser.user.email,
        photoURL: firebaseUser.user.photoURL || null,
        // Add more fields as needed
      };

      // Store the user data in sessionStorage (encrypted)
      sessionStorage.setItem("appData", encryptData(fullFirebaseUser));
      setUser(fullFirebaseUser);
      return fullFirebaseUser;
    } catch {
      // 2) If Firebase login fails, attempt custom API login
      console.warn("Firebase login failed. Trying database login...");
      try {
        const response = await axiosSecure.post("/api/login", {
          user_email: email,
          password,
        });

        if (response.data.status === "success") {
          const { token, user: apiUser } = response.data;
          // Store the token for session validity
          sessionStorage.setItem("jwtToken", token);
          // Encrypt and store the user object for data retrieval
          sessionStorage.setItem("appData", encryptData(apiUser));
          // Update state with the unencrypted user object
          setUser(apiUser);
          return apiUser;
        } else {
          throw new Error("Invalid response from API login");
        }
      } catch (apiError) {
        console.error("Custom API login failed:", apiError);
        throw new Error("Invalid login credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates user data in Firebase and the database.
   */
  const updateUserData = async (updatedData) => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Update Firebase profile
        await updateProfile(currentUser, {
          displayName: updatedData.name,
          photoURL: updatedData.photoURL,
        });

        // Update the database
        const response = await axiosSecure.put("/api/updateUser", {
          uid: currentUser.uid,
          ...updatedData,
        });

        if (response.data.status === "success") {
          // Update local state and sessionStorage
          const updatedUser = { ...user, ...updatedData };
          setUser(updatedUser);
          sessionStorage.setItem("appData", encryptData(updatedUser));
          return updatedUser;
        } else {
          throw new Error("Failed to update user in the database");
        }
      } else {
        throw new Error("No authenticated user found");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out from Firebase (if applicable), removes session data,
   * sets user to null, redirects.
   */
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (firebaseSignOutError) {
      console.warn("Error logging out of Firebase:", firebaseSignOutError);
    }

    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("appData");
    setUser(null);
    window.location.href = "/login";
  };

  const authInfo = {
    user,
    loading,
    loginUser,
    logOut,
    updateUserData, // Expose the update function
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {!loading ? children : <Loader />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
