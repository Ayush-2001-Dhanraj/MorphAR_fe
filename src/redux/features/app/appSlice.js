import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = appSlice.actions;

export const getIsLoading = (state) => state.app.isLoading;

export default appSlice.reducer;
