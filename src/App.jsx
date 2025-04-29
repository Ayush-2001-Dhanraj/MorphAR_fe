// App.jsx
import React from "react";
import Footer from "./components/Footer";
import Main from "./components/Main";
import { Box } from "@mui/material";
import SideBar from "./components/Sidebar";
import styles from "./App.module.css";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Tripo from "./components/Tripo";

// Layout Component that wraps all pages
const Layout = () => (
  <>
    <Box className={styles.mainContainer}>
      <SideBar />
      <Box className={styles.main} pr={2} pl={2}>
        <Header />
        <Outlet /> {/* This renders child routes */}
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
