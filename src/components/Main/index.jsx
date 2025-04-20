import React from "react";
import styles from "./Main.module.css";
import {
  Box,
  Container,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

const DrawerHeader = styled("Box")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function Main() {
  return (
    <Box className={styles.main} pr={2} pl={2}>
      <DrawerHeader sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" className={styles.gradient_txt}>
          Ayush
        </Typography>
        <Box className={styles.avatar_placeholder}></Box>
      </DrawerHeader>

      <Container
        maxWidth="md"
        sx={{ marginTop: 4, height: "calc(100vh - 220px)", overflow: "scroll" }}
      >
        <Typography variant="h4" align="center">
          <span className={styles.gradient_txt}>Hello, Dev</span>
        </Typography>
      </Container>

      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: "var(--primary-color)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            gap: 1,
          }}
          p={2}
        >
          <TextField
            variant="standard"
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: {
                color: "var(--secondary-color)",
              },
            }}
          />
          <IconButton>
            <ImageIcon sx={{ color: "var(--secondary-color)" }} />
          </IconButton>
          <IconButton>
            <MicIcon sx={{ color: "var(--secondary-color)" }} />
          </IconButton>
          <IconButton>
            <SendIcon sx={{ color: "var(--secondary-color)" }} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

export default Main;
