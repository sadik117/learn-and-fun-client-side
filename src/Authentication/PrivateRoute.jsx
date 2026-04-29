import React, { useContext } from "react";
import Loading from "../components/layouts/Loading";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";


const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Loading />;


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
