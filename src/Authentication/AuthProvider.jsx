import React, { createContext, useEffect, useState } from "react";
import app from "./firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";

const auth = getAuth(app);
export const AuthContext = createContext(null);

/* ================= JWT EXPIRY CHECK (NO LIB) ================= */
const isTokenExpired = () => {
  const token = localStorage.getItem("access-token");
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*  AUTH METHODS  */
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const forgotPass = (user, newPassword) => {
    return updatePassword(user, newPassword);
  };

  /*  LOGOUT  */
  const logOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("access-token");
      setUser(null);
      toast.success("Signout successful!");
    } catch (error) {
      toast.error("Signout failed: " + error.message);
    }
  };

  // AUTH STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (isTokenExpired()) {
        await signOut(auth);
        localStorage.removeItem("access-token");
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authData = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signIn,
    logOut,
    updateUserProfile,
    forgotPass,
  };

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
