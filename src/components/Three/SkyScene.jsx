import React from "react";
import { DoubleSide, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

function SkyScene() {
  const texture = useLoader(TextureLoader, "textures/2k_stars_milky_way.jpg");

  return (
    <>
      <mesh>
        <sphereGeometry args={[15, 32, 16]} />
        <meshStandardMaterial map={texture} side={DoubleSide} />
      </mesh>
    </>
  );
}

export default SkyScene;
