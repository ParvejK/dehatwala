import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo }) => {
  const { token } = useAuthStore();

  if (token) {
    // Redirect to the specified route if the user is not authenticated
    return <Navigate to={redirectTo} />;
  }

  // Render the children (protected content) if the user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
