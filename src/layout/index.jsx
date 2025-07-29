import { useSelector } from "react-redux";
import { getGreetMsg } from "../redux/features/app/appSlice";
import { getCurrentChat } from "../redux/features/chat/chatSlice";
import styles from "./layout.module.css";
import SideBar from "../components/Sidebar";
import Header from "../components/Header";
import GradientTxt from "../components/GradientTxt";
import { Box, Typography } from "@mui/material";
import { Outlet, useLocation } from "react-router";
import Footer from "../components/Footer";

// Layout Component that wraps all pages
const Layout = () => {
  const greetMsg = useSelector(getGreetMsg);
  const currentChat = useSelector(getCurrentChat);
  const location = useLocation();

  if (location.pathname === "/") {
    return (
      <>
        <Box className={styles.mainContainer}>
          <Box className={styles.main} pr={2} pl={2}>
            <Header />
            <Outlet />
          </Box>
        </Box>
      </>
    );
  }

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

export default Layout;
