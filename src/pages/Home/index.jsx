import { Environment, ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Box } from "@mui/material";
import { useRef } from "react";
import MainScene from "./MainScene";
import { useLoader } from "@react-three/fiber";
import { TextureLoader, DoubleSide } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function Home() {
  const skyRef = useRef();
  const texture = useLoader(TextureLoader, "textures/2k_stars_milky_way.jpg");

  return (
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
  );
}

export default Home;
