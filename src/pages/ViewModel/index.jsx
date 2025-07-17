import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import GradientTxt from "../../components/GradientTxt";
import { useSelector } from "react-redux";
import { getModelLink } from "../../redux/features/app/appSlice";

function Model({ modelUrl }) {
  const gltf = useGLTF(modelUrl);
  return (
    <primitive
      object={gltf.scene}
      scale={2}
      rotation={[Math.PI / 4, Math.PI / 2, 0]}
    />
  );
}

export function ModelViewer({ modelUrl }) {
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 2,
        flex: 1,
        overflow: "hidden",
        backgroundColor: "var(--primary-color)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense
          fallback={
            <Html>
              <div>Loading...</div>
            </Html>
          }
        >
          {modelUrl && <Model modelUrl={modelUrl} />}
          <Environment preset="studio" />
          <OrbitControls enableZoom enableRotate enablePan />
        </Suspense>
      </Canvas>
    </Box>
  );
}

const ViewModel = ({ isOpen, handleClose }) => {
  const [localModel, setLocalModel] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [modelSource, setModelSource] = useState(null);
  const fileInputRef = useRef();

  const modelLink = useSelector(getModelLink);

  const isValidModelUrl = (url) => {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname.toLowerCase();
      return (
        parsed.protocol.startsWith("http") &&
        (pathname.endsWith(".glb") || pathname.endsWith(".gltf"))
      );
    } catch {
      return false;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
      const url = URL.createObjectURL(file);
      setLocalModel(file.name);
      setModelSource(url);
      setUrlInput("");
      setUrlError("");
    } else {
      setUrlError("Please select a valid .glb or .gltf file");
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput) return;
    if (!isValidModelUrl(urlInput)) {
      setUrlError("Invalid model URL (must end with .glb or .gltf)");
      return;
    }

    setModelSource(urlInput);
    setLocalModel(null);
    setUrlError("");
  };

  useEffect(() => {
    if (modelLink) {
      setUrlInput(modelLink);
      setTimeout(() => {
        handleUrlSubmit();
      }, 0);
    }
  }, [modelLink]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 3,
        flex: 1,
        boxSizing: "content-box",
        p: 2,
      }}
    >
      <ModelViewer modelUrl={modelSource} />

      <Stack
        direction="column"
        spacing={4}
        alignItems="center"
        sx={{
          backgroundColor: "var(--primary-color)",
          p: 2,
          borderRadius: 2,
          width: "30%",
          justifyContent: "center",
        }}
      >
        {/* Upload Button */}
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current.click()}
          sx={{ textTransform: "none" }}
        >
          {localModel ? "Model Selected ✔" : "Choose Local Model"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileChange}
          hidden
        />

        {/* OR Separator */}
        <Typography variant="body2" sx={{ color: "#aaa" }}>
          — OR —
        </Typography>

        {/* URL Input */}
        <TextField
          label="Model URL (.glb / .gltf)"
          variant="outlined"
          fullWidth
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
        />
        <Button
          variant="contained"
          onClick={handleUrlSubmit}
          disabled={!urlInput}
        >
          Load from URL
        </Button>

        {/* Error Message */}
        {urlError && <Alert severity="error">{urlError}</Alert>}

        <Typography align="center">
          <GradientTxt txt={"Select your Model or paste its URL"} />
        </Typography>
      </Stack>
    </Box>
  );
};

export default ViewModel;
