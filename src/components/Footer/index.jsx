import React from "react";
import styles from "./Footer.module.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import { Box, IconButton, Link, Typography } from "@mui/material";

function Footer() {
  return (
    <Box className={styles.footer}>
      <IconButton
        sx={{ color: "var(--secondary-color)" }}
        component="a"
        href="mailto:dhanrajaayush123@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <EmailIcon fontSize="small" />
      </IconButton>
      <Typography variant="subtitle1">
        <Link
          href="https://3d-portfolio-demo-delta.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          underline="hover"
        >
          Ayush Dhanraj
        </Link>
      </Typography>
      <IconButton
        sx={{ color: "var(--secondary-color)" }}
        component="a"
        href="https://github.com/Ayush-2001-Dhanraj"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default Footer;
