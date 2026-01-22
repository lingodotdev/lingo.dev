"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const AUTH_STORAGE_KEY = "saas-dashboard-auth";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
  } | null;
}

interface UseAuthMockReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthState["user"];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export function useAuthMock(): UseAuthMockReturn {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuthState(parsed);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (email && password) {
        const newState: AuthState = {
          isAuthenticated: true,
          user: {
            email,
            name: email.split("@")[0].replace(/[._]/g, " "),
          },
        };
        setAuthState(newState);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setAuthState({ isAuthenticated: false, user: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push("/login");
  }, [router]);

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    user: authState.user,
    login,
    logout,
  };
}
