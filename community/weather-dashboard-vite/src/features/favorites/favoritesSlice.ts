import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  [userId: string]: string[];
}

const initialState: FavoritesState = JSON.parse(
  localStorage.getItem("favorites") || "{}"
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (
      state,
      action: PayloadAction<{ userId: string; city: string }>
    ) => {
      const { userId, city } = action.payload;
      state[userId] = state[userId] || [];
      if (!state[userId].includes(city)) {
        state[userId].push(city);
      }
      localStorage.setItem("favorites", JSON.stringify(state));
    },
    removeFavorite: (
      state,
      action: PayloadAction<{ userId: string; city: string }>
    ) => {
      const { userId, city } = action.payload;
      state[userId] = state[userId]?.filter((c) => c !== city);
      localStorage.setItem("favorites", JSON.stringify(state));
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
