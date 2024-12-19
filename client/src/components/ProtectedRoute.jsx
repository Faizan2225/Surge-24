import React from "react";
import { Route, Navigate } from "react-router-dom";
import useAuthStore from "../Store/authStore";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Navigate to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
