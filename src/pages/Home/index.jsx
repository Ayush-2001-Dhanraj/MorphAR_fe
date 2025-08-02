import {
  Environment,
  Preload,
  ScrollControls,
  useProgress,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import MainScene from "./MainScene";
import { useLoader } from "@react-three/fiber";
import { TextureLoader, DoubleSide } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const introOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "#000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  opacity: 1,
  animation: "fadeOut 1s ease-out forwards",
  animationDelay: "4s",
};

const glowTextStyle = {
  fontSize: "4rem",
  color: "#fff",
  textShadow: `
    0 0 10px #ccc,
    0 0 20px #ccc,
    0 0 40px #ccc,
    0 0 80px #ccc
  `,
  animation:
    "fadeInText 4s ease-out forwards, pulseGlow 4s ease-in-out infinite",
  animationDelay: "0.5s, 0.5s",
  fontFamily: "Orbitron, sans-serif",
  opacity: 0,
};

const styles = `
@keyframes fadeOut {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes fadeInText {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    text-shadow: 
      0 0 10px #ccc,
      0 0 20px #ccc,
      0 0 40px #ccc;
  }
  50% {
    text-shadow: 
      0 0 20px #ccc,
      0 0 40px #ccc,
      0 0 60px #ccc;
  }
}
`;

function LoaderOverlay() {
  const { progress } = useProgress();

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        fontFamily: "Orbitron, sans-serif",
        fontSize: "1.5rem",
      }}
    >
      <CircularProgress color="var(--text-color)" />

      <Box sx={{ position: "absolute", bottom: "10px" }}>
        <Typography sx={{ color: "var(--text-color)" }}>
          Hang on!! Good things take time ❤
        </Typography>
      </Box>
    </Box>
  );
}

function Home() {
  const skyRef = useRef();
  const texture = useLoader(TextureLoader, "textures/2k_stars_milky_way.jpg");

  const [playIntro, setPlayIntro] = useState(false);
  const [ready, setReady] = useState(false);

  const { progress } = useProgress();
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (progress === 100 && !hasLoadedOnce.current) {
      hasLoadedOnce.current = true;
      setPlayIntro(true);
      setTimeout(() => {
        setReady(true);
        setTimeout(() => setPlayIntro(false), 5000);
      }, 300);
    }
  }, [progress]);

  return (
    <>
      <style>{styles}</style>

      {!ready && <LoaderOverlay />}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: "0",
        }}
      >
        <Canvas shadows dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 8] }}>
          <Preload all />
          <Environment
            files={"images/sky.jpg"}
            background={false}
            blur={0.8}
            resolution={256}
          />
          <ScrollControls pages={10} damping={0.5}>
            <MainScene skyRef={skyRef} />
            <mesh ref={skyRef}>
              <sphereGeometry args={[15, 32, 16]} />
              <meshStandardMaterial map={texture} side={DoubleSide} />
            </mesh>
          </ScrollControls>
          <EffectComposer>
            <Bloom
              intensity={1.2}
              radius={0.6}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Canvas>
      </Box>

      {playIntro && ready && (
        <div style={introOverlayStyle}>
          <div style={glowTextStyle}>MorphAI</div>
        </div>
      )}
    </>
  );
}

export default Home;
