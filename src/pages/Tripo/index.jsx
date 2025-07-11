import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import GradientTxt from "../../components/GradientTxt";
import styles from "./Tripo.module.css";
import clsx from "clsx";
import Step1 from "./Step1";
import TripoService from "../../services/tripoServices";

function Tripo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState(null);
  const [bgRemovedImage, setBgRemovedImage] = useState(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [modelUrls, setModelUrls] = useState(null);

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

  useEffect(() => {
    if (!taskId) return;

    setDisabled(true);
    const interval = setInterval(async () => {
      try {
        const data = await TripoService.getTaskStatus(taskId);
        console.log("Task status:", data.task.status);
        setTaskStatus(data.task.status);

        if (data.task.status === "success") {
          setModelUrls(data.task.output);
          console.log("Final output:", data.output);
          clearInterval(interval);
        }

        if (["failed", "cancelled", "unknown"].includes(data.task.status)) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling failed:", err);
        clearInterval(interval);
      }
    }, 4000); // poll every 4 seconds

    setDisabled(false);
    return () => clearInterval(interval); // cleanup on unmount
  }, [taskId]);

  const handleNextStep = async () => {
    if (currentStep === 1 && image) {
      const result = await removeBackground(image, setIsRemovingBg);
      if (result) {
        setBgRemovedImage(result);
      }
    }

    if (currentStep === 2 && bgRemovedImage) {
      if (currentStep === 2 && bgRemovedImage) {
        const file = await fetch(bgRemovedImage).then((res) => res.blob());
        try {
          const data = await TripoService.createTask(file);
          const taskId = data.task_id;
          setTaskId(taskId);
          console.log("Model task submitted:", taskId);
        } catch (err) {
          console.error("Failed to create 3D task:", err);
        }
      }
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

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        className={styles.tripoContainer}
      >
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
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    color: "var(--text-color)",
                  }}
                >
                  <Typography variant="body2">
                    {taskStatus
                      ? `Status: ${taskStatus}`
                      : "Model is queued... Please wait."}
                  </Typography>

                  {modelUrls && (
                    <>
                      <img
                        src={modelUrls.rendered_image}
                        alt="3D Preview"
                        style={{ width: "200px", borderRadius: 8 }}
                      />
                      <a
                        href={modelUrls.pbr_model}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#7db3ff" }}
                      >
                        Download 3D Model
                      </a>
                    </>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Container>

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            sx={{
              visibility:
                !image || isRemovingBg || disabled ? "hidden" : "visible",
            }}
          >
            <Typography>Next</Typography>
          </Button>

          <Typography align="center" variant="h5">
            <GradientTxt txt={steps[currentStep - 1]?.title} />
          </Typography>
        </Box>

        <Typography align="center" variant="body1" color="var(--text-color)">
          {steps[currentStep - 1].description}
        </Typography>
      </Container>
    </>
  );
}

export default Tripo;
