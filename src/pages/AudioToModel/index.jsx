import React, { useEffect, useState } from "react";
import TripoService from "../../services/tripoServices";
import styles from "./AudioToModel.module.css";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import clsx from "clsx";
import GradientTxt from "../../components/GradientTxt";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import ListeningIndicator from "../../components/ListeningIndicator";
import models from "../../models";

function AudioToModel() {
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState(null);
  const [bgRemovedImage, setBgRemovedImage] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [modelUrls, setModelUrls] = useState(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const [editableTranscript, setEditableTranscript] = useState("");
  const { text, isListening, startListening, stopListening } =
    useSpeechRecognition();

  useEffect(() => {
    if (text.trim() !== "") {
      setEditableTranscript((prev) => (prev + " " + text).trim());
    }
  }, [text]);

  const steps = [
    {
      number: 1,
      title: "Prompt Generation",
      description: "Describe the 3D model you want to create.",
    },
    {
      number: 2,
      title: "2D Verification",
      description: "Verify the model's 2D representation",
    },
    {
      number: 3,
      title: "Remove Background",
      description:
        "We remove the background to isolate the subject for 3D modeling.",
    },
    {
      number: 4,
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

  const handleClickListeningIndicator = () => {
    if (!isListening) startListening();
    else stopListening();
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const imagePrompt = `"${editableTranscript}"Generate a realistic image of the described object in 300x300 pixels, with a plain white background. The image must not include any text, watermark, or label. Do not provide any description or response—only return the image.`;

      const history = [];
      const response = await models.text(history, imagePrompt, true);
      console.log("text history", history);
      console.log(
        "text history",
        history[1].parts[history[1].parts.length - 1]
      );
      setImage(history[1].parts[history[1].parts.length - 1].inlineData);
    }

    if (currentStep === 2 && image) {
      let imageBlob;

      if (typeof image === "object" && image.data) {
        // base64 to Blob
        const byteString = atob(image.data);
        const mimeType = image.mimeType || "image/png";
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
        imageBlob = new Blob([arrayBuffer], { type: mimeType });
      } else {
        imageBlob = image; // if it's already a Blob or File
      }

      const result = await removeBackground(imageBlob, setIsRemovingBg);
      if (result) {
        setBgRemovedImage(result);
      }
    }

    if (currentStep === 3 && bgRemovedImage) {
      if (currentStep === 3 && bgRemovedImage) {
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

  useEffect(() => {
    console.log(image);
  }, [image]);

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
          {steps.map((step) => {
            return (
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
                {step.number === 1 && (
                  <>
                    <Box
                      sx={{ display: "flex", justifyContent: "center" }}
                      mt={4}
                    >
                      <Button
                        sx={{
                          display: "flex",
                        }}
                        disabled={currentStep !== 1}
                        onClick={handleClickListeningIndicator}
                      >
                        <ListeningIndicator isListening={isListening} />
                      </Button>
                    </Box>
                    {currentStep !== 1 ? (
                      <Typography
                        sx={{
                          paddingLeft: 2,
                          paddingRight: 2,
                          marginTop: 2,
                          color: "var(--text-color)",
                        }}
                        align="center"
                      >
                        {editableTranscript}
                      </Typography>
                    ) : (
                      <TextField
                        multiline
                        fullWidth
                        minRows={4}
                        value={editableTranscript}
                        onChange={(e) => setEditableTranscript(e.target.value)}
                        sx={{
                          "& .MuiInputBase-root": {
                            color: "var(--text-color)",
                            border: "1px solid",
                          },
                          marginTop: 2,
                          paddingLeft: 2,
                          paddingRight: 2,
                        }}
                        InputProps={{
                          inputProps: {
                            style: { textAlign: "center" },
                          },
                        }}
                      />
                    )}
                  </>
                )}
                {step.number === 2 && image && (
                  <img
                    src={`data:${image.mimeType};base64,${image.data}`}
                    alt="Selected Image"
                    className={styles.selectedImage}
                  />
                )}
                {step.number === 3 && (
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
                {step.number === 4 && currentStep === 4 && (
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
            );
          })}
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
              visibility: isRemovingBg || disabled ? "hidden" : "visible",
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

export default AudioToModel;
