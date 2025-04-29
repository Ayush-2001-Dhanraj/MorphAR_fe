import { Box, Button, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import GradientTxt from "../GradientTxt";
import styles from "./Tripo.module.css";
import clsx from "clsx";

function Tripo({ greetMsg }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState(null);
  const [bgRemovedImage, setBgRemovedImage] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);

  const steps = [
    {
      number: 1,
      title: "Choose an Image",
      description:
        "Upload or select an image to start the 3D modeling process.",
    },
    {
      number: 2,
      title: "Remove Background",
      description:
        "We remove the background to isolate the subject for 3D modeling.",
    },
    {
      number: 3,
      title: "Generate 3D Model",
      description: "We use AI to create a 3D model from your image.",
    },
  ];

  // --- Simulated Handlers for Each Step ---
  const handleNextStep = async () => {
    if (currentStep === 1 && !image) return;

    if (currentStep === 2) {
      // Simulate background removal API
      const removed = await simulateBgRemoval(image);
      setBgRemovedImage(removed);
    }

    if (currentStep === 3) {
      // Simulate model generation
      const model = await simulateModelGeneration(bgRemovedImage || image);
      setModelUrl(model);
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const simulateBgRemoval = async (img) => {
    return new Promise((res) =>
      setTimeout(() => res(`${img}_bg_removed.png`), 1000)
    );
  };

  const simulateModelGeneration = async (img) => {
    return new Promise((res) =>
      setTimeout(
        () => res(`https://fake-3d-model.com/model.glb?img=${img}`),
        1500
      )
    );
  };

  // --- Rendered Content Per Step ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Box>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
            />
            {image && (
              <img
                src={image}
                alt="Selected"
                style={{ marginTop: 10, maxHeight: 200 }}
              />
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="body1">Removing background...</Typography>
            {bgRemovedImage && (
              <img
                src={bgRemovedImage}
                alt="BG Removed"
                style={{ marginTop: 10, maxHeight: 200 }}
              />
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="body1">Generating 3D Model...</Typography>
            {modelUrl && (
              <a href={modelUrl} target="_blank" rel="noopener noreferrer">
                View 3D Model
              </a>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        marginBottom: 4,
      }}
    >
      <Typography align="center" variant="h6" gutterBottom>
        <GradientTxt txt={greetMsg} />
      </Typography>

      <Box className={styles.workflow_container}>
        {steps.map((step) => (
          <Box
            key={step.number}
            className={clsx(
              styles.workflow_box,
              currentStep === step.number && styles.gradient_border
            )}
          >
            <Typography
              variant="h6"
              className={clsx(
                styles.stepNumber,
                currentStep === step.number && styles.gradient_border
              )}
            >
              {step.number}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography align="center" variant="h5" gutterBottom>
        <GradientTxt txt={steps[currentStep - 1].title} />
      </Typography>

      <Typography align="center" variant="body1" gutterBottom>
        {steps[currentStep - 1].description}
      </Typography>

      <Box mt={2}>{renderStepContent()}</Box>

      {currentStep < steps.length && (
        <Box mt={3} display="flex" justifyContent="center">
          <Button variant="contained" onClick={handleNextStep}>
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default Tripo;
