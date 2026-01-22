import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useState } from "react";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (
        err.code !== "auth/popup-closed-by-user" &&
        err.code !== "auth/cancelled-popup-request"
      ) {
        console.error("Login error:", err);
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="px-4 py-2 border rounded bg-blue-700 text-white hover:bg-blue-900 hover:cursor-pointer"
    >
      {loading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
}
