import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState, createContext } from "react";
import { auth } from "../Firbase/firebase.config";

const AuthContext = createContext();
export { AuthContext };

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  if (loading) {
    return (
      <span className="loading loading-bars flex justify-center items-center loading-lg"></span>
    );
  }

  const updateUserProfile = (name, email, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      email: email,
      photoURL: photo,
    });
  };

  const authInfo = {
    user,
    loading,
    loginUser,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
