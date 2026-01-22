import { createSlice } from "@reduxjs/toolkit";

interface SettingsState {
  unit: "C" | "F";
}

const initialState: SettingsState = {
  unit: (localStorage.getItem("unit") as "C" | "F") || "C",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === "C" ? "F" : "C";
      localStorage.setItem("unit", state.unit);
    },
  },
});

export const { toggleUnit } = settingsSlice.actions;
export default settingsSlice.reducer;
