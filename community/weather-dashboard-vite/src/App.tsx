import { StrictMode, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { getRedirectResult } from "firebase/auth";
import { auth } from "./firebase";
import { setUser, clearUser } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";
import type { AppDispatch } from "./app/store";
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    getRedirectResult(auth).catch(console.error);
  }, []);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photo: user.photoURL || "",
          }),
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsub();
  }, [dispatch]);

  return (
    <StrictMode>
      <LingoProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LingoProvider>
    </StrictMode>
  );
}
