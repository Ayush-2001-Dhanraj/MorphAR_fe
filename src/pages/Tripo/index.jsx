import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import GradientTxt from "../../components/GradientTxt";
import styles from "./Tripo.module.css";
import clsx from "clsx";
import Step1 from "./Step1";
import TripoService from "../../services/tripoServices";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setModelLink } from "../../redux/features/app/appSlice";
import { toast } from "react-toastify";

function Tripo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState(null);
  const [bgRemovedImage, setBgRemovedImage] = useState(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [modelUrls, setModelUrls] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        setTaskStatus(data.task.status);

        if (data.task.status === "success") {
          setModelUrls(data.task.output);
          clearInterval(interval);
        }

        if (["failed", "cancelled", "unknown"].includes(data.task.status)) {
          clearInterval(interval);
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 4000); // poll every 4 seconds

    setDisabled(false);
    return () => clearInterval(interval); // cleanup on unmount
  }, [taskId]);

  const handleNextStep = async () => {
    setDisabled(true);
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

  const handleDownloadModel = () => {
    const link = document.createElement("a");
    link.href = modelUrls.pbr_model;
    link.download = "3d-model.glb"; // adjust extension if needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Model send for download!");
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
                !image ||
                isRemovingBg ||
                disabled ||
                currentStep === steps.length
                  ? "hidden"
                  : "visible",
            }}
          >
            <Typography>Next</Typography>
          </Button>

          {currentStep === steps.length && (
            <Button onClick={handleReset} borderRadius={2} pl={2} pr={2}>
              <Typography>Reset</Typography>
            </Button>
          )}

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
