import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const user = useSelector((s: RootState) => s.auth.user);
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
