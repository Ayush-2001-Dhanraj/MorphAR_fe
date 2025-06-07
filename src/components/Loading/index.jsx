import React from "react";
import styles from "./Loading.module.css";
import { Box } from "@mui/material";

function Loader() {
  return (
    <Box
      sx={{
        alignSelf: "flex-end",
        background: "var(--primary-color)",
        color: "var(--text-color)",
        borderRadius: 4,
        maxWidth: "80%",
        padding: 1,
        paddingRight: 2,
        paddingLeft: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <span className={styles.typing_dot}></span>
      <span className={styles.typing_dot}></span>
      <span className={styles.typing_dot}></span>
    </Box>
  );
}

export default Loader;
