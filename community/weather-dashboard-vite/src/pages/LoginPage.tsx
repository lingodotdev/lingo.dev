import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import GoogleLoginButton from "../components/Auth/GoogleLoginButton";

export default function LoginPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <GoogleLoginButton />
      </div>
    </div>
  );
}
