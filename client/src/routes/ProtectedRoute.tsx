import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = sessionStorage.getItem("token");
  if (!isAuth) {
    alert("Invalid session logging out...");
    // console.log("Invalid session logging out...");
  }
  return isAuth ? children : <Navigate to="/login" />;
}
