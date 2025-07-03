import { Box, Modal, IconButton, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useVoiceToText } from "react-speakup";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import Loader from "../Loading";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "var(--background-color)",
  border: "2px solid var(--accent-color)",
  color: "var(--text-color)",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

function SpeechToText({ open, handleClose, save }) {
  const [editableTranscript, setEditableTranscript] = useState("");
  const { text, isListening, startListening, stopListening } =
    useSpeechRecognition();

  useEffect(() => {
    if (open) startListening();
  }, [open]);

  useEffect(() => {
    if (text.trim() !== "") {
      setEditableTranscript((prev) => (prev + " " + text).trim());
    }
  }, [text]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} borderRadius={4}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            visibility: isListening ? "visible" : "hidden",
          }}
        >
          <Loader />
        </Box>

        <TextField
          multiline
          fullWidth
          minRows={4}
          value={editableTranscript}
          onChange={(e) => setEditableTranscript(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiInputBase-root": {
              color: "var(--text-color)",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--accent-color)",
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => {
              stopListening();
              handleClose();
            }}
            sx={{
              "&:hover": { backgroundColor: "var(--accent-color)" },
            }}
          >
            <CloseIcon sx={{ color: "var(--text-color)" }} />
          </IconButton>
          <IconButton
            onClick={isListening ? stopListening : startListening}
            sx={{
              "&:hover": { backgroundColor: "var(--accent-color)" },
            }}
          >
            {isListening ? (
              <MicOffIcon sx={{ color: "var(--text-color)" }} />
            ) : (
              <MicIcon sx={{ color: "var(--text-color)" }} />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              save(editableTranscript);
            }}
            sx={{
              "&:hover": { backgroundColor: "var(--accent-color)" },
            }}
          >
            <DoneIcon sx={{ color: "var(--text-color)" }} />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
}

export default SpeechToText;
