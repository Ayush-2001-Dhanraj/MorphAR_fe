import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import models from "../../models";
import ReactMarkdown from "react-markdown";
import Loader from "../../components/Loading";
import SpeechToText from "../../components/SpeechToText";
import ImageViewer from "../../components/ImageViewer";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/features/user/userSlice";
import {
  getCurrentChat,
  updateAllChats,
  updateChat,
} from "../../redux/features/chat/chatSlice";
import ChatService from "../../services/chatServices";
import { isImagePrompt } from "../../models/text_model";
import { useClerk } from "@clerk/clerk-react";
import { setIsLoading } from "../../redux/features/app/appSlice";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import GestureIcon from "@mui/icons-material/Gesture";
import styles from "./Main.module.css";
import GradientTxt from "../../components/GradientTxt";
import { useNavigate } from "react-router";

function Main() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSpeech, setOpenSpeech] = useState(false);
  const [openImage, setOpenImage] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const user = useSelector(getUser);
  const currentChat = useSelector(getCurrentChat);

  const { openSignIn } = useClerk();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const features = [
    {
      icon: <GestureIcon sx={{ fontSize: 40, color: "var(--text-color)" }} />,
      title: "Sketch to 3D Model",
      description: "Draw a sketch and instantly generate a 3D model using AI.",
      to: "/sketch",
    },
    {
      icon: (
        <AudiotrackIcon sx={{ fontSize: 40, color: "var(--text-color)" }} />
      ),
      title: "Audio Prompt to 3D",
      description:
        "Describe your idea in voice and let AI build your 3D scene.",
      to: "/text",
    },
    {
      icon: <ViewInArIcon sx={{ fontSize: 40, color: "var(--text-color)" }} />,
      title: "XR Visualization",
      description: "View your model in Virtual Reality using the XR Viewer.",
      to: "/view",
    },
  ];

  const handleCloseSpeech = () => {
    setOpenSpeech(false);
  };

  const handleSaveTranscript = (transcript) => {
    setInput(transcript);
    handleCloseSpeech();
    handleSend(transcript);
  };

  const closeOpenImage = () => {
    setOpenImage(false);
    setSelectedImage("");
  };

  const handleClickImage = (data) => {
    setSelectedImage(data);
    setOpenImage(true);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async (customInput = "") => {
    const prompt = customInput || input;
    setLoading(true);

    const useImageModel = isImagePrompt(history, prompt);
    if (!user) {
      openSignIn();
      setLoading(false);
      setInput("");
    } else {
      const response = await models.text(history, prompt, useImageModel);
      const formattedData = {
        id: currentChat,
        user_id: user?.id,
        chat_history: JSON.stringify([...history]),
      };
      const result = await ChatService.createChat(formattedData);
      if (!currentChat) {
        dispatch(updateChat(result.id));
        getAllChats();
      }
      getChatHistory(result.id);
      setLoading(false);
      setInput("");
    }
  };

  const getAllChats = async () => {
    const response = await ChatService.getChats({ clerk_id: user.clerk_id });
    dispatch(updateAllChats(response));
  };

  const getChatHistory = async (chat_id, reload = false) => {
    if (reload) dispatch(setIsLoading(true));
    const result = await ChatService.getChat(chat_id);
    setHistory(result.chat_history);
    dispatch(setIsLoading(false));
  };

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (!container) return;

    const start = container.scrollTop;
    const end = container.scrollHeight - container.clientHeight;
    const duration = 400;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeInOut = 0.5 * (1 - Math.cos(Math.PI * progress));

      container.scrollTop = start + (end - start) * easeInOut;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleMicClick = () => {
    setOpenSpeech((preV) => !preV);
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  useEffect(() => {
    if (currentChat) {
      getChatHistory(currentChat, true);
    } else {
      setHistory([]);
    }
  }, [currentChat]);

  const renderHistory = useMemo(() => {
    return (
      history.length !== 0 &&
      history.map((entry, index) => (
        <Box
          key={index}
          sx={{
            alignSelf: entry.role === "user" ? "flex-end" : "flex-start",
            background: "var(--primary-color)",
            color:
              entry.role === "user"
                ? "var(--secondary-color)"
                : "var(--text-color)",
            borderRadius: 4,
            maxWidth: "80%",
            padding: 2,
            paddingRight: 4,
            paddingLeft: 4,
          }}
        >
          {entry.parts.map((part, i) => {
            return (
              <>
                {Object.keys(part).includes("text") ? (
                  <ReactMarkdown
                    key={i}
                    children={part.text}
                    components={{
                      p: ({ node, ...props }) => (
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.2,
                            marginBottom: 2,
                            "&:last-of-type": {
                              marginBottom: 0,
                            },
                          }}
                          {...props}
                        />
                      ),
                      h1: ({ children }) => (
                        <Typography variant="h4">{children}</Typography>
                      ),
                      h2: ({ children }) => (
                        <Typography variant="h5">{children}</Typography>
                      ),
                      h3: ({ children }) => (
                        <Typography variant="h6">{children}</Typography>
                      ),
                      ul: ({ children }) => (
                        <Box
                          component="ul"
                          sx={{ paddingLeft: 3, marginBottom: 2 }}
                        >
                          {children}
                        </Box>
                      ),
                      ol: ({ children }) => (
                        <Box
                          component="ol"
                          sx={{ paddingLeft: 3, marginBottom: 2 }}
                        >
                          {children}
                        </Box>
                      ),
                      li: ({ children }) => (
                        <li>
                          <Typography variant="body2">{children}</Typography>
                        </li>
                      ),
                      strong: ({ children }) => <strong>{children}</strong>,
                      em: ({ children }) => <em>{children}</em>,
                      code: ({ children }) => (
                        <Box
                          component="pre"
                          sx={{
                            backgroundColor: "var(--background-color)",
                            color: "var(--text-color)",
                            padding: 3,
                            borderRadius: 2,
                            fontSize: "0.95rem",
                            overflowX: "auto",
                            width: "100%",
                            whiteSpace: "pre-wrap",
                            marginTop: 2,
                            marginBottom: 2,
                          }}
                        >
                          <code>{children}</code>
                        </Box>
                      ),
                    }}
                  />
                ) : (
                  <img
                    key={i}
                    onClick={() =>
                      handleClickImage(
                        `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
                      )
                    }
                    src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`}
                    alt="Generated"
                    style={{ maxWidth: "100%", marginTop: 12, borderRadius: 8 }}
                  />
                )}
              </>
            );
          })}
        </Box>
      ))
    );
  }, [history]);

  return (
    <>
      <Container
        maxWidth="lg"
        ref={containerRef}
        sx={{
          height: "calc(100vh - 180px)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 2.5,
        }}
      >
        {renderHistory}

        {loading && <Loader />}
        <div ref={bottomRef} />
      </Container>

      <Container maxWidth="lg">
        {!currentChat && !history.length && (
          <Box sx={{ overflowX: "auto", whiteSpace: "nowrap", px: 2, mb: 2 }}>
            <Grid
              container
              spacing={2}
              wrap="nowrap"
              sx={{
                display: "flex",
                flexWrap: "nowrap",
              }}
            >
              {features.map((feature, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  sx={{ minWidth: 300, cursor: "pointer" }}
                  onClick={() => navigate(feature.to)}
                >
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "var(--primary-color)",
                    }}
                    className={styles.gradient_border}
                  >
                    <Box display="flex" justifyContent="center" mb={2}>
                      {feature.icon}
                    </Box>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "var(--text-color)", fontWeight: "bold" }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "var(--text-color)",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h5" align="center" sx={{ marginTop: 2 }}>
              <GradientTxt txt="AI-powered 3D model generation from sketches and speech, with XR previews." />
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            backgroundColor: "var(--primary-color)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            gap: 1,
            marginBottom: 2.5,
          }}
          pl={2}
          pr={2}
        >
          <TextField
            variant="standard"
            value={input}
            onChange={handleInputChange}
            fullWidth
            disabled={loading}
            InputProps={{
              disableUnderline: true,
              sx: {
                color: "var(--secondary-color)",
              },
            }}
          />
          <IconButton disabled={loading} onClick={handleMicClick}>
            <MicIcon
              sx={{ color: "var(--secondary-color)" }}
              fontSize="small"
            />
          </IconButton>
          <IconButton onClick={() => handleSend()} disabled={loading}>
            <SendIcon
              sx={{
                color:
                  input.trim().length && !loading
                    ? "var(--text-color)"
                    : "var(--secondary-color)",
              }}
              fontSize="small"
            />
          </IconButton>
        </Box>
      </Container>

      <SpeechToText
        open={openSpeech}
        handleClose={handleCloseSpeech}
        save={handleSaveTranscript}
      />

      <ImageViewer
        open={openImage && selectedImage.length}
        handleClose={closeOpenImage}
        data={selectedImage}
      />
    </>
  );
}

export default Main;
