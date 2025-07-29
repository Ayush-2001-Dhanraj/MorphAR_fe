import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import ScrollContainer from "./ScrollContainer";
import SkyScene from "./SkyScene";
import { Box } from "@mui/material";

const MainCanvas = () => {
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
        <Environment files={"images/sky.jpg"} />
        <ScrollContainer />
        {/* <OrbitControls /> */}
        <SkyScene />
      </Canvas>
    </Box>
  );
};

export default MainCanvas;
