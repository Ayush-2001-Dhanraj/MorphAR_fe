import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  greetMsg: "",
  modelLink: "",
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
    setModelLink: (state, action) => {
      state.modelLink = action.payload;
    },
  },
});

export const { setIsLoading, setGreetMsg, setModelLink } = appSlice.actions;

export const getIsLoading = (state) => state.app.isLoading;
export const getGreetMsg = (state) => state.app.greetMsg;
export const getModelLink = (state) => state.app.modelLink;

export default appSlice.reducer;
