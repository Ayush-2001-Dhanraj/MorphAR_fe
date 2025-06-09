import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Container,
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
import GradientTxt from "../../components/GradientTxt";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/features/user/userSlice";
import {
  getCurrentChat,
  updateAllChats,
  updateChat,
} from "../../redux/features/chat/chatSlice";
import ChatService from "../../services/chatServices";
import { setIsLoading } from "../../redux/features/app/appSlice";

function Main({ greetMsg }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector(getUser);
  const currentChat = useSelector(getCurrentChat);

  const dispatch = useDispatch();

  const [openSpeech, setOpenSpeech] = useState(false);
  const handleCloseSpeech = () => setOpenSpeech(false);
  const handleSaveTranscript = (transcript) => {
    setInput(transcript);
    handleCloseSpeech();
    handleSend(transcript);
  };

  const [openImage, setOpenImage] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const closeOpenImage = () => {
    setOpenImage(false);
    setSelectedImage("");
  };

  const handleClickImage = (data) => {
    setSelectedImage(data);
    setOpenImage(true);
  };

  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async (customInput = "") => {
    const prompt = customInput || input;

    setLoading(true);

    const response = await models.text(history, prompt);

    const formattedData = {
      id: currentChat,
      user_id: user.id,
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
  };

  const getAllChats = async () => {
    const response = await ChatService.getChats({ clerk_id: user.clerk_id });
    dispatch(updateAllChats(response));
  };

  const getChatHistory = async (chat_id) => {
    const result = await ChatService.getChat(chat_id);
    setHistory(result.chat_history);
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
      getChatHistory(currentChat);
    } else {
      setHistory([]);
    }
  }, [currentChat]);

  const renderHistory = useMemo(() => {
    return history.length === 0 ? (
      <Typography variant="h6" align="center">
        <GradientTxt txt={greetMsg} />
      </Typography>
    ) : (
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
        maxWidth="md"
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
