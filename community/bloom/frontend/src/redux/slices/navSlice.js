import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginScreen: false,
  user: null,
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    toggleLoginScreen: (state) => {
      state.loginScreen = !state.loginScreen;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      console.log("User set in navSlice:", state.user);
    },
  },
});

export const { toggleLoginScreen, setUser } = navSlice.actions;

export default navSlice.reducer;
