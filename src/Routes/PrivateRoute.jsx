import React, { use } from "react";
import { AuthContexts } from "../contexts/AuthContexts";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = use(AuthContexts);

  const location = useLocation();
  console.log(location);

  if (loading) {
    return <span className="loading loading-spinner text-success"></span>;
  }
  if (user) {
    return children;
  }
  return <Navigate state={location?.pathname} to="{/login}"></Navigate>;
};

export default PrivateRoute;
