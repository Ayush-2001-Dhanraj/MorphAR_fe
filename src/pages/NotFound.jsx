// components/NotFound.jsx
import { Box, Typography } from "@mui/material";
import React from "react";

const NotFound = () => {
  return (
    <Box style={{ textAlign: "center", padding: "2rem" }}>
      <Typography variant="h5" color="var(--text-color)">
        404 - Page Not Found
      </Typography>
      <Typography color="var(--accent-color)">
        The page you are looking for doesn't exist.
      </Typography>
    </Box>
  );
};

export default NotFound;
