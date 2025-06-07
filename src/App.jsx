// App.jsx
import React, { useEffect } from "react";
import Footer from "./components/Footer";
import Main from "./pages/Main";
import { Box } from "@mui/material";
import SideBar from "./components/Sidebar";
import styles from "./App.module.css";
import Tripo from "./pages/Tripo";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";
import { useUser } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { updateUser } from "./redux/features/user/userSlice";
import UserService from "./services/userServices";

// Layout Component that wraps all pages
const Layout = () => (
  <>
    <Box className={styles.mainContainer}>
      <SideBar />
      <Box className={styles.main} pr={2} pl={2}>
        <Header />
        <Outlet />
      </Box>
    </Box>

    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Main greetMsg="Hello, Dev" />,
      },
      {
        path: "tripo",
        element: (
          <Tripo greetMsg="Hello, 3D Dev let's create a 3D model in minutes." />
        ),
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

  const updateUserData = async (clerkUser) => {
    const formattedEvent = {
      email: clerkUser.primaryEmailAddress.emailAddress,
      clerk_id: clerkUser.id,
      name: clerkUser.fullName,
    };
    const result = await UserService.registerUser(formattedEvent);
    dispatch(updateUser(result));
  };

  useEffect(() => {
    if (clerkUser) {
      updateUserData(clerkUser);
    }
  }, [clerkUser]);
  return <RouterProvider router={router} />;
}

export default App;
