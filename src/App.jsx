// App.jsx
import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Main from "./pages/Main";
import { Box, Typography } from "@mui/material";
import SideBar from "./components/Sidebar";
import styles from "./App.module.css";
import Tripo from "./pages/Tripo";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from "./redux/features/user/userSlice";
import UserService from "./services/userServices";
import ChatService from "./services/chatServices";
import {
  getCurrentChat,
  updateAllChats,
} from "./redux/features/chat/chatSlice";
import {
  getGreetMsg,
  getIsLoading,
  setGreetMsg,
  setIsLoading,
} from "./redux/features/app/appSlice";
import LoadingOverlay from "./components/LoadingOverlay";
import { ToastContainer, toast } from "react-toastify";
import GradientTxt from "./components/GradientTxt";

// Layout Component that wraps all pages
const Layout = () => {
  const greetMsg = useSelector(getGreetMsg);
  const currentChat = useSelector(getCurrentChat);
  return (
    <>
      <Box className={styles.mainContainer}>
        <SideBar />
        <Box className={styles.main} pr={2} pl={2}>
          <Header />
          {!currentChat && (
            <Typography variant="h6" align="center">
              <GradientTxt txt={greetMsg} />
            </Typography>
          )}

          <Outlet />
        </Box>
      </Box>

      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Main />,
      },
      {
        path: "tripo",
        element: <Tripo />,
      },
      {
        path: "*", // Catch-all route for 404
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  const { user: clerkUser } = useUser();
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const isLoading = useSelector(getIsLoading);

  const updateUserData = async (clerkUser) => {
    dispatch(setIsLoading(true));
    const formattedEvent = {
      email: clerkUser.primaryEmailAddress.emailAddress,
      clerk_id: clerkUser.id,
      name: clerkUser.fullName,
    };
    const result = await UserService.registerUser(formattedEvent);
    dispatch(updateUser(result));
    dispatch(setIsLoading(false));
  };

  const getAllChats = async (user) => {
    dispatch(setIsLoading(true));
    const response = await ChatService.getChats({ clerk_id: user.clerk_id });
    dispatch(updateAllChats(response));
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    if (clerkUser) {
      updateUserData(clerkUser);
    }
  }, [clerkUser]);

  useEffect(() => {
    if (user) {
      toast(`Welcome ${user.name}!`);
      getAllChats(user);
    }
  }, [user]);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
