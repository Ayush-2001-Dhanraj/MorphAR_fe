import React from "react";
import MainScene from "./MainScene";
import { ScrollControls } from "@react-three/drei";

function ScrollContainer() {
  return (
    <>
      <ScrollControls pages={6} damping={0.5}>
        <MainScene />
      </ScrollControls>
    </>
  );
}

export default ScrollContainer;
