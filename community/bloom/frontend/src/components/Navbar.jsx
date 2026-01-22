import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, toggleLoginScreen } from "../redux/slices/navSlice";
import { handleLogout } from "../services/authService";
import { LanguageSwitcher } from "./LanguageSwitcher";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useNavigate();
  const user = useSelector((state) => state.nav.user);
  console.log("Navbar user:", user);

  return (
    <nav className="py-2 px-2 flex gap-4 items-center justify-between bg-gradient-to-bl from-emerald-100 via-white to-emerald-50 h-24">
      {/* Left Logo */}
      <Link to="/" className="flex gap-4 items-center ml-5">
        <h1 className="text-3xl font-bold text-green-600">🌱 Bloom</h1>
      </Link>

      {/* Right Buttons */}
      <div className="flex items-center justify-center gap-4 mr-5">
        <LanguageSwitcher/>
        {user ? (
          <button
            onClick={() => {
              handleLogout(user.uid).then(() => {
                dispatch(setUser(null));
                router("/");
              });
            }}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              dispatch(toggleLoginScreen());
            }}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Login
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;

