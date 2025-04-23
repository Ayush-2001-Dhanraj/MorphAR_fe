import React from "react";
import styles from "./ImageViewer.module.css";
import { Box, Container, Modal, Typography, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "var(--background-color)",
  border: "2px solid var(--accent-color)",
  color: "var(--text-color)",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  borderRadius: 4,
};

function ImageViewer({ open, handleClose, data }) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = data;
    link.download = "downloaded_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Container maxWidth="md" sx={style}>
        <Box>
          <img
            src={data}
            alt="Generated"
            style={{
              borderRadius: 8,
              maxHeight: 500,
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Button
          variant="contained"
          onClick={handleDownload}
          sx={{ mt: 2, bgcolor: "var(--accent-color)", color: "#fff" }}
        >
          Download Image
        </Button>
      </Container>
    </Modal>
  );
}

export default ImageViewer;
