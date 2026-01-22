import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Common/ProtectedRoute";
import ProtectedLayout from "../components/Layout/ProtectedLayout";
import DashboardPage from "../pages/DashboardPage";
import FavoritesPage from "../pages/FavoritesPage";
import CityDetailPage from "../pages/CityDetailPage";
import LoginPage from "../pages/LoginPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/city/:city" element={<CityDetailPage />} />
      </Route>
    </Routes>
  );
}
