// components/LoadingOverlay.jsx
import React from "react";
import { CircularProgress, Paper, Box } from "@mui/material";

const LoadingOverlay = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2000,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Paper>
  );
};

export default LoadingOverlay;
