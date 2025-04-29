import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    chat: chatSlice,
  },
});
