import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChat: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateChat: (state, action) => {
      state.currentChat = action.payload;
    },
  },
});

export const { updateChat } = chatSlice.actions;

export default chatSlice.reducer;
