import React from "react";
import Footer from "./components/Footer";
import Main from "./components/Main";
import { Box } from "@mui/material";
import SideBar from "./components/Sidebar";
import styles from "./App.module.css";

function App() {
  return (
    <>
      <Box className={styles.mainContainer}>
        <SideBar />
        <Main />
      </Box>
      <Footer />
    </>
  );
}

export default App;
