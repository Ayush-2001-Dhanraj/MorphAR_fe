import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./features/chat/chatSlice";
import userSlice from "./features/user/userSlice";
import appSlice from "./features/app/appSlice";

export const store = configureStore({
  reducer: {
    chat: chatSlice,
    user: userSlice,
    app: appSlice,
  },
});
