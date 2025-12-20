import React, { useContext } from "react";
import Loading from "../components/layouts/Loading";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "./AuthContext";

/*  JWT EXPIRY CHECK (NO LIB)  */
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

const PrivateRoute = ({ children }) => {
  const { user, loading, logOut } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Loading />;

  //  AUTO LOGOUT if token expired
  if (isTokenExpired()) {
    logOut();
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
