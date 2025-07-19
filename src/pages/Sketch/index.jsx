import React, { useEffect, useState } from "react";
import styles from "./Sketch.module.css";
import clsx from "clsx";
import TripoService from "../../services/tripoServices";
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import GradientTxt from "../../components/GradientTxt";
import GestureIcon from "@mui/icons-material/Gesture";
import DrawingBoard from "../../components/DrawingBoard";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import models from "../../models";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setModelLink } from "../../redux/features/app/appSlice";

function Sketch() {
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState(null);
  const [bgRemovedImage, setBgRemovedImage] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [modelUrls, setModelUrls] = useState(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [editableTranscript, setEditableTranscript] = useState("");
  const [openDrawingBoard, setOpenDrawingBoard] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch;

  const steps = [
    {
      number: 1,
      title: "Draw Your Modal",
      description: "Create a sketch of what you want to make a 3D modal of.",
    },
    {
      number: 2,
      title: "Object Verification",
      description: "Verify the object of interest based on your sketch.",
    },
    {
      number: 3,
      title: "2D Verification",
      description: "Verify the model's 2D representation",
    },
    {
      number: 4,
      title: "Remove Background",
      description:
        "We remove the background to isolate the subject for 3D modeling.",
    },
    {
      number: 5,
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
    setDisabled(true);
    if (currentStep === 2) {
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

    if (currentStep === 3 && image) {
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

    if (currentStep === 4 && bgRemovedImage) {
      if (currentStep === 4 && bgRemovedImage) {
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

    setDisabled(false);
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

  const saveCanvas = async (canvas) => {
    if (!canvas) return;
    const imageDataUrl = canvas.toDataURL("image/png");

    const base64 = imageDataUrl.replace(/^data:image\/png;base64,/, "");

    const prompt =
      'This is a user-drawn sketch. Describe what the user has drawn in 1 short phrase. Do not add any explanation, text, or context. Only return the object name or type (e.g. "a horse", "a rocket", "nothing"). If you cannot recognize the object, respond with "nothing".';

    const history = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType: "image/png",
            },
          },
          { text: prompt },
        ],
      },
    ];

    try {
      const response = await models.text(history, prompt, true);

      // Gemini will respond with a model message in history[1]
      const modelReply = history[2].parts
        .find((p) => typeof p.text === "string")
        ?.text?.trim();

      if (!modelReply) {
        console.warn("Gemini did not return any object.");
        return;
      }

      if (modelReply.toLowerCase() === "nothing") {
        setEditableTranscript("");
        alert("Gemini could not recognize any object in the sketch.");
        return;
      }

      // Set the transcript to what Gemini recognized
      setEditableTranscript(modelReply);

      setOpenDrawingBoard(false);
      setCurrentStep(2);
    } catch (err) {
      console.error("Failed to generate object description:", err);
    }
  };

  const handleDownloadModel = () => {
    const link = document.createElement("a");
    link.href = modelUrls.pbr_model;
    link.download = "3d-model.glb";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Model send for download!");
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = `data:${image.mimeType};base64,${image.data}`;
    link.download = "downloaded_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBgRemovedImage = () => {
    const link = document.createElement("a");
    link.href = bgRemovedImage;
    link.download = "downloaded_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(modelUrls.pbr_model);
    toast("Model Link Copied!");
  };

  const handleGotoViewModel = () => {
    toast("Redirecting to View Model!");
    navigator.clipboard.writeText(modelUrls.pbr_model);

    setTimeout(() => {
      dispatch(setModelLink(modelUrls.pbr_model));
      navigate("/view");
    }, 1000);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setImage(null);
    setBgRemovedImage(null);
    setIsRemovingBg(false);
    setDisabled(false);
    setTaskId(null);
    setTaskStatus(null);
    setModelUrls(null);
    setEditableTranscript("");
  };

  const handleBack = () => {
    setCurrentStep((preV) => preV - 1);
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
                  <Box
                    sx={{
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <IconButton
                      onClick={() => setOpenDrawingBoard(true)}
                      sx={{
                        backgroundColor: "var(--background-color)",
                        borderRadius: 50,
                        display: "inherit",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 60,
                        width: 60,
                        "&:hover": {
                          backgroundColor: "var(--background-color)",
                        },
                      }}
                    >
                      <GestureIcon sx={{ color: "var(--secondary-color)" }} />
                    </IconButton>
                  </Box>
                )}

                {step.number === 2 && !!editableTranscript && (
                  <>
                    {currentStep === 2 ? (
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
                    ) : (
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
                    )}
                  </>
                )}

                {step.number === 3 && image && (
                  <>
                    <img
                      src={`data:${image.mimeType};base64,${image.data}`}
                      alt="Selected Image"
                      className={styles.selectedImage}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        gap: 5,
                        mt: 2,
                        position: "absolute",
                        bottom: 10,
                        width: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <IconButton
                        onClick={handleDownloadImage}
                        sx={{
                          backgroundColor: "var(--background-color)",
                          borderRadius: 50,
                          display: "inherit",
                          justifyContent: "flex-start",
                          "&:hover": {
                            backgroundColor: "var(--background-color)",
                          },
                        }}
                      >
                        <DownloadIcon
                          fontSize="small"
                          sx={{ color: "var(--secondary-color)" }}
                        />
                      </IconButton>
                    </Box>
                  </>
                )}

                {step.number === 4 && (
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
                        <>
                          <img
                            src={bgRemovedImage}
                            alt="Background removed"
                            className={styles.selectedImage}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              gap: 5,
                              mt: 2,
                              position: "absolute",
                              bottom: 10,
                              width: "100%",
                              justifyContent: "center",
                            }}
                          >
                            <IconButton
                              onClick={handleDownloadBgRemovedImage}
                              sx={{
                                backgroundColor: "var(--background-color)",
                                borderRadius: 50,
                                display: "inherit",
                                justifyContent: "flex-start",
                                "&:hover": {
                                  backgroundColor: "var(--background-color)",
                                },
                              }}
                            >
                              <DownloadIcon
                                fontSize="small"
                                sx={{ color: "var(--secondary-color)" }}
                              />
                            </IconButton>
                          </Box>
                        </>
                      )
                    )}
                  </>
                )}

                {step.number === 5 && currentStep === 5 && (
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
                          src={modelUrls?.rendered_image}
                          alt="3D Preview"
                          style={{ width: "200px", borderRadius: 8 }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            gap: 5,
                            mt: 2,
                            position: "absolute",
                            bottom: 5,
                          }}
                        >
                          <IconButton
                            onClick={handleDownloadModel}
                            sx={{
                              backgroundColor: "var(--background-color)",
                              borderRadius: 50,
                              display: "inherit",
                              justifyContent: "flex-start",
                              "&:hover": {
                                backgroundColor: "var(--background-color)",
                              },
                            }}
                          >
                            <DownloadIcon
                              fontSize="small"
                              sx={{ color: "var(--secondary-color)" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={handleCopyToClipboard}
                            sx={{
                              backgroundColor: "var(--background-color)",
                              borderRadius: 50,
                              display: "inherit",
                              justifyContent: "flex-start",
                              "&:hover": {
                                backgroundColor: "var(--background-color)",
                              },
                            }}
                          >
                            <ContentCopyIcon
                              fontSize="small"
                              sx={{ color: "var(--secondary-color)" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={handleGotoViewModel}
                            sx={{
                              backgroundColor: "var(--background-color)",
                              borderRadius: 50,
                              display: "inherit",
                              justifyContent: "flex-start",
                              "&:hover": {
                                backgroundColor: "var(--background-color)",
                              },
                            }}
                          >
                            <ViewInArIcon
                              sx={{ color: "var(--secondary-color)" }}
                              fontSize="small"
                            />
                          </IconButton>
                        </Box>
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
          <Box
            sx={{
              display: "flex",
              visibility: isRemovingBg || disabled ? "hidden" : "visible",
              gap: 20,
            }}
          >
            {currentStep === steps.length && (
              <Button onClick={handleReset} borderRadius={2} pl={2} pr={2}>
                <Typography>Reset</Typography>
              </Button>
            )}

            {currentStep !== 1 && currentStep !== steps.length && (
              <Button onClick={handleBack} borderRadius={2} pl={2} pr={2}>
                <Typography>Back</Typography>
              </Button>
            )}

            {currentStep !== steps.length && currentStep !== 1 && (
              <Button onClick={handleNextStep} borderRadius={2} pl={2} pr={2}>
                <Typography>Next</Typography>
              </Button>
            )}
          </Box>

          <Typography align="center" variant="h5">
            <GradientTxt txt={steps[currentStep - 1]?.title} />
          </Typography>
        </Box>

        <Typography align="center" variant="body1" color="var(--text-color)">
          {steps[currentStep - 1].description}
        </Typography>
      </Container>

      <DrawingBoard
        open={openDrawingBoard}
        handleClose={() => setOpenDrawingBoard(false)}
        save={saveCanvas}
      />
    </>
  );
}

export default Sketch;
