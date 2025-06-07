import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./features/chat/chatSlice";
import userSlice from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    chat: chatSlice,
    user: userSlice,
  },
});
