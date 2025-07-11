import { Box, Button, Modal, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ColorSwatch, Group } from "@mantine/core";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "90%",
  color: "var(--text-color)",
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  backgroundColor: "var(--primary-color)",
};

const SWATCHES = [
  "#000000",
  "#ffffff",
  "#ee3333",
  "#e64980",
  "#be4bdb",
  "#893200",
  "#228be6",
  "#3333ee",
  "#40c057",
  "#00aa00",
  "#fab005",
  "#fd7e14",
];

function DrawingBoard({ open, handleClose, save }) {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [reset, setReset] = useState(false);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (canvas && container) {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
      }
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const stopDrawing = () => setIsDrawing(false);

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => resizeCanvas(), 100); // small delay to ensure modal is rendered
    }
  }, [open]);

  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setReset(false);
    }
  }, [reset]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} borderRadius={4}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button onClick={handleClose}>
            <Typography color="var(--text-color)">Cancel</Typography>
          </Button>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Group>
              {SWATCHES.map((swatchColor) => (
                <ColorSwatch
                  key={swatchColor}
                  color={swatchColor}
                  onClick={() => setColor(swatchColor)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Group>
          </Box>
          <Button onClick={resetCanvas}>
            <Typography color="var(--text-color)">Reset</Typography>
          </Button>
          <Button onClick={() => save(canvasRef.current)}>
            <Typography color="var(--text-color)">Save</Typography>
          </Button>
        </Box>

        <Box
          ref={canvasContainerRef}
          sx={{
            flex: 1,
            overflow: "hidden",
            mt: 2,
            borderRadius: 2,
            backgroundColor: "black",
            position: "relative",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              cursor: "crosshair",
            }}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
          />
        </Box>
      </Box>
    </Modal>
  );
}

export default DrawingBoard;
