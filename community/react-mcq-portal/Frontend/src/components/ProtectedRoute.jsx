// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  // 1. Get the authentication state from our custom hook
  const { isLoggedIn } = useAuth();

  // 2. Check if the user is logged in
  if (!isLoggedIn) {
    // If not logged in, redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  // 3. If they are logged in, render the child page
  // The <Outlet /> component renders the actual page we are protecting (e.g., Dashboard)
  return <Outlet />;
}

export default ProtectedRoute;