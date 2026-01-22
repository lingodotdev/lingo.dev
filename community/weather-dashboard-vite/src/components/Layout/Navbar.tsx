import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store";
import { toggleUnit } from "../../features/settings/settingsSlice";
import CitySearchBar from "../Search/CitySearchBar";
import { LanguageSwitcher } from "./LanguageSwitcher";

export default function Navbar() {
  const user = useSelector((s: RootState) => s.auth.user);
  const unit = useSelector((s: RootState) => s.settings.unit);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:justify-between p-4 border-b border-slate-200 bg-slate-100 gap-3 md:gap-0">
      <Link to="/" className="text-xl font-bold text-blue-700">
        🌤 Weather Dashboard
      </Link>

      <div className="w-full md:w-1/2">
        <CitySearchBar onSelect={(city) => navigate(`/?city=${city}`)} />
      </div>

      <div className="flex flex-col sm:flex-row bg-slate-100 items-start sm:items-center gap-2 sm:gap-4 mt-2 md:mt-0">
        <Link
          to="/favorites"
          className="text-blue-600 bg-slate-50 p-2 border rounded-2xl hover:text-blue-700"
        >
          ⭐ Favorites
        </Link>

        <button
          onClick={() => dispatch(toggleUnit())}
          className="px-4 py-1.5 rounded-full border border-slate-300 text-sm font-semibold
                     bg-white/80 backdrop-blur
                     hover:bg-blue-50 hover:border-blue-300
                     active:scale-95 transition-all text-blue-700"
        >
          {unit === "C" ? "°C" : "°F"}
        </button>
        <LanguageSwitcher />
        {user && (
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
