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

export const AuthContext = createContext();

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Updated to match the Register component: accepts an object
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };


  const logOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("Signout successful!");
      })
      .catch((error) => {
        toast.error("Signout failed: " + error.message);
      });
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const forgotPass = (user, newPassword) => {
    return updatePassword(user, newPassword);
  };

  const authData = {
    user,
    setUser,
    createUser,
    signIn,
    logOut,
    loading,
    setLoading,
    updateUserProfile,
    forgotPass,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;