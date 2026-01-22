import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import CityCard from "../components/Dashboard/CityCard";
import { fetchWeather } from "../features/weather/weatherSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const favorites = useSelector((s: RootState) =>
    user ? s.favorites[user.uid] : [],
  );

  useEffect(() => {
    if (!favorites.length) return;

    favorites.forEach((city) => dispatch(fetchWeather(city)));
  }, [favorites, dispatch]);

  if (!favorites.length) {
    return (
      <p className="p-6 text-slate-500 bg-slate-100 rounded">
        No favorites yet{" "}
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-blue-50 hover:text-blue-600 mb-2"
        >
          ← Back
        </button>
      </p>
    );
  }

  return (
    <div className="p-6 bg-slate-100 min-h-screen rounded">
      <button
        onClick={() => navigate(-1)}
        className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-blue-50 hover:text-blue-600 mb-2"
      >
        ← Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favorites.map((city) => (
          <CityCard key={city} city={city} />
        ))}
      </div>
    </div>
  );
}
