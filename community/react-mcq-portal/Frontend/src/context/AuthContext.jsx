import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig'; // for explicit logout requests

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Use sessionStorage (per-tab). Initialize state from sessionStorage.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error);
      return null;
    }
  });

  const [token, setToken] = useState(() => sessionStorage.getItem('token'));

  useEffect(() => {
    if (token) sessionStorage.setItem('token', token);
    else sessionStorage.removeItem('token');

    if (user) sessionStorage.setItem('user', JSON.stringify(user));
    else sessionStorage.removeItem('user');
  }, [token, user]);

  // login: store token+user in sessionStorage + state
  const login = useCallback((userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
  }, []);

  // explicit logout: call protected endpoint to clear server-side session,
  // then clear client state and navigate to login using window.location
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('Logout request failed or returned error', err?.response?.data || err);
    } finally {
      setUser(null);
      setToken(null);
      // Use full reload navigation to avoid dependency on router context
      window.location.href = '/login';
    }
  }, []);

  // logoutBeacon: called on unload (uses navigator.sendBeacon, no headers)
  const logoutBeacon = useCallback(() => {
    const tokenStr = sessionStorage.getItem('token');
    if (!tokenStr) return;

    const base = import.meta.env.VITE_API_BASE_URL || '';
    // send to base + '/api/auth/logout-beacon' (match axios base)
    const url = (base || '') + '/auth/logout-beacon';
    const payload = JSON.stringify({ token: tokenStr });

    try {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
    } catch (err) {
      console.warn('sendBeacon failed', err);
    }
  }, []);

  const value = { user, token, isLoggedIn: !!token, login, logout, logoutBeacon };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
