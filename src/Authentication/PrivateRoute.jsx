import React, { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Loading from "../components/layouts/Loading";
import jwtDecode from "jwt-decode";
import { Navigate, useLocation } from "react-router";

const isTokenExpired = () => {
  const token = localStorage.getItem("access-token");
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const PrivateRoute = ({ children }) => {
  const { user, loading, logout } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Loading />;

  // AUTO LOGOUT if token expired
  if (isTokenExpired()) {
    logout();
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (user?.email) return children;

  return (
    <Navigate
      to="/auth/login"
      state={{ from: location }}
      replace
    />
  );
};

export default PrivateRoute;
