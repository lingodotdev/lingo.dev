import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import weatherReducer from "../features/weather/weatherSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import settingsReducer from "../features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.DEV,
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
