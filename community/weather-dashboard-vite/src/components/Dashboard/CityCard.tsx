import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store";
import {
  addFavorite,
  removeFavorite,
} from "../../features/favorites/favoritesSlice";
import { formatTemp } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Props {
  city: string;
}

export default function CityCard({ city }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const weather = useSelector((s: RootState) => s.weather.cache[city]);
  const user = useSelector((s: RootState) => s.auth.user);
  const unit = useSelector((s: RootState) => s.settings.unit);

  const favorites = useSelector((s: RootState) =>
    user ? s.favorites[user.uid] : [],
  );

  const isFavorite = favorites.includes(city);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  if (!weather) return <div className="text-slate-500">Loading...</div>;

  const { temp_c, condition, humidity, wind_kph } = weather.data;

  return (
    <div
      onClick={() => navigate(`/city/${city}`)}
      className="cursor-pointer border border-slate-200 bg-white p-4 rounded shadow-sm hover:shadow-md hover:scale-105 transition text-slate-800"
    >
      <h2 className="text-xl font-bold text-blue-700">{city}</h2>

      <img src={condition.icon} alt={condition.text} />

      <p className="text-lg text-blue-600">🌡 {formatTemp(temp_c, unit)}</p>
      <p>💧 {humidity}%</p>
      <p>💨 {wind_kph} km/h</p>

      {/* <p className="text-xs text-slate-500 mt-2">
        Last updated: {timeAgo(weather.timestamp)}
      </p> */}
      <p className="text-xs text-slate-500 mt-2">
        Next update in {60 - Math.floor((now - weather.timestamp) / 1000)}s
      </p>

      {user && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isFavorite) {
              dispatch(removeFavorite({ userId: user.uid, city }));
            } else {
              dispatch(addFavorite({ userId: user.uid, city }));
            }
          }}
          className={`mt-2 font-medium hover:cursor-pointer ${
            isFavorite
              ? "text-red-600 hover:text-red-700"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          {isFavorite ? "❌ Remove from Favorites" : "⭐ Add to Favorites"}
        </button>
      )}
    </div>
  );
}
