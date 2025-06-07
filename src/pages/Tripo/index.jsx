import { Box, Button, Container, Typography } from "@mui/material";
import { useState } from "react";
import GradientTxt from "../../components/GradientTxt";
import styles from "./Tripo.module.css";
import clsx from "clsx";
import Step1 from "./Step1";

function Tripo({ greetMsg }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState(null);
  const [bgRemovedImage, setBgRemovedImage] = useState(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false); // Optional loading indicator
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
      title: "Generate 3D Model in Queue",
      description:
        "Modelling is done in queue check Queue to see the actual status.",
    },
  ];

  const handleNextStep = async () => {
    if (currentStep === 1 && image) {
      const result = await removeBackground(image, setIsRemovingBg);
      if (result) {
        setBgRemovedImage(result);
      }
    }

    if (currentStep === 2 && bgRemovedImage) {
      const file = await fetch(bgRemovedImage).then((res) => res.blob());

      const imageToken = await uploadToTripo(file);
      const taskId = await trigger3DGeneration(imageToken);

      console.log("Model task submitted:", taskId);
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const removeBackground = async (imageFile, setIsLoading) => {
    const formData = new FormData();
    formData.append("image_file", imageFile);
    formData.append("size", "auto");

    setIsLoading(true);
    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": import.meta.env.VITE_REMOVE_BG,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Background removal failed");
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadToTripo = async (file) => {
    console.log("File", file);
    const formData = new FormData();
    formData.append("file", file, "image.png");

    const response = await fetch(
      "https://api.tripo3d.ai/v2/openapi/upload/sts",
      {
        mode: "no-cors",
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TRIPO_API_KEY}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    return data.data.image_token;
  };

  const trigger3DGeneration = async (imageToken) => {
    const payload = {
      type: "image_to_model",
      file_token: imageToken,
      model_version: "v2.5-20250123", // or "Turbo-v1.0-20250506"
      orientation: "align_image",
      texture: true,
      pbr: true,
      style: "object:steampunk", // Optional
    };

    const response = await fetch("https://api.tripo3d.ai/v2/openapi/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TRIPO_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data.task_id;
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
            {step.number == 1 && (
              <Step1
                image={image}
                setCurrentStep={setCurrentStep}
                setImage={setImage}
              />
            )}
            {step.number === 2 && (
              <>
                {isRemovingBg ? (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "var(--text-color)",
                    }}
                  >
                    <Typography variant="body2">
                      Removing background...
                    </Typography>
                  </Box>
                ) : (
                  bgRemovedImage && (
                    <img
                      src={bgRemovedImage}
                      alt="Background removed"
                      className={styles.selectedImage}
                    />
                  )
                )}
              </>
            )}
            {step.number === 3 && currentStep === 3 && (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "var(--text-color)",
                }}
              >
                <Typography variant="body2">Model added to Queue...</Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          onClick={handleNextStep}
          borderRadius={2}
          pl={2}
          pr={2}
          sx={{ visibility: !image ? "hidden" : "visible" }}
        >
          <Typography>Next</Typography>
        </Button>

        <Typography align="center" variant="h5" gutterBottom>
          <GradientTxt txt={steps[currentStep - 1].title} />
        </Typography>
      </Box>

      <Typography align="center" variant="body1" color="var(--text-color)">
        {steps[currentStep - 1].description}
      </Typography>
    </Container>
  );
}

export default Tripo;
