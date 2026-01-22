// src/components/RoleBasedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component takes an array of allowed roles as a prop
function RoleBasedRoute({ allowedRoles }) {
  const { user } = useAuth();

  // If the user's role is in the allowedRoles array, show the page.
  // Otherwise, redirect them to the student dashboard.
  return allowedRoles.includes(user?.role) ? <Outlet /> : <Navigate to="/" replace />;
}

export default RoleBasedRoute;