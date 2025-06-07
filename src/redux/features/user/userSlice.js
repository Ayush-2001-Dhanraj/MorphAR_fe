import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const chatSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { updateUser } = chatSlice.actions;

export const getUser = (state) => state.user.user;

export default chatSlice.reducer;
