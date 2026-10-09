import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
}

/** Only same-origin paths, so `?path=` cannot be used as an open redirect. */
const safePath = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : null;

/**
 * Guards the auth pages: it bounces a visitor who *already* has a session.
 *
 * The sign-in form also navigates on success, and storing the token re-renders
 * this component — so the two race to redirect. Honouring `?path=` here means
 * the visitor lands where they were headed whichever one wins.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo }) => {
  const { token } = useAuthStore();
  const { search } = useLocation();

  if (token) {
    const requested = safePath(new URLSearchParams(search).get("path"));
    return <Navigate to={requested ?? redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
