import { Box, styled, Typography } from "@mui/material";
import styles from "./Header.module.css";
import React from "react";
import GradientTxt from "../GradientTxt";

const DrawerHeader = styled("Box")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function Header() {
  return (
    <DrawerHeader sx={{ justifyContent: "space-between" }}>
      <Typography variant="h6">
        <GradientTxt txt="Ayush" />
      </Typography>
      <Box className={styles.avatar_placeholder}></Box>
    </DrawerHeader>
  );
}

export default Header;
