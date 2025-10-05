import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  role?: string; // opcional: exigir rol
};

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { isAuthenticated, hasRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && !hasRole(role)) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
