import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  greetMsg: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setGreetMsg: (state, action) => {
      state.greetMsg = action.payload;
    },
  },
});

export const { setIsLoading, setGreetMsg } = appSlice.actions;

export const getIsLoading = (state) => state.app.isLoading;
export const getGreetMsg = (state) => state.app.greetMsg;

export default appSlice.reducer;
