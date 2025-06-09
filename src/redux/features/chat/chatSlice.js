import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChat: null,
  allChats: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateChat: (state, action) => {
      state.currentChat = action.payload;
    },
    updateAllChats: (state, action) => {
      state.allChats = action.payload;
    },
  },
});

export const getCurrentChat = (state) => state.chat.currentChat;
export const getAllChats = (state) => state.chat.allChats;

export const { updateChat, updateAllChats } = chatSlice.actions;

export default chatSlice.reducer;
