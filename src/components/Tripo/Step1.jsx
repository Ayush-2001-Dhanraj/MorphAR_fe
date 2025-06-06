import { Box, Button } from "@mui/material";
import React from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import styles from "./Tripo.module.css";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function Step1({ image, setImage, setCurrentStep }) {
  return (
    <>
      {image ? (
        <>
          <img
            src={URL.createObjectURL(image)}
            alt="Selected Image"
            className={styles.selectedImage}
          />
          <Box
            p={2}
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              left: 0,
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              variant="contained"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                backgroundColor: "var(--primary-color)",
                color: "var(--text-color)",
              }}
            >
              Choose Another
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    setImage(file); // ✅ Save the File object, not the preview URL
                    setCurrentStep(1);
                  }
                }}
              />
            </Button>
          </Box>
        </>
      ) : (
        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <FileUploadIcon fontSize="small" />
          <VisuallyHiddenInput
            type="file"
            accept="images/*"
            onChange={(event) => {
              const file = event.target.files[0];
              if (file) {
                setImage(file);
                setCurrentStep(1);
              }
            }}
          />
        </Button>
      )}
    </>
  );
}

export default Step1;
