import {
  MotionPathControls,
  useMotion,
  useScroll,
  useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

const generateCirclePoints = (numPoints = 100, radius = 50) => {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = 0;
    const z = radius * Math.sin(angle);
    points.push(new THREE.Vector3(x, y, z)); // ✅ Fixed
  }
  return points;
};

function AutoMoveObject() {
  const motion = useMotion();

  useFrame((state, delta) => {
    motion.current += delta * 0.001;
  });

  return null;
}

function MainScene() {
  const boxRef = useRef();

  const gltf = useGLTF("models/red_flower.glb");

  const { curve } = useMemo(() => {
    const curvePoints = generateCirclePoints(15, 2);
    const curve = new THREE.CatmullRomCurve3(curvePoints, true);

    return { curve };
  }, []);

  return (
    <>
      <MotionPathControls curves={[curve]} focus={boxRef}>
        <AutoMoveObject />
      </MotionPathControls>

      <group ref={boxRef}>
        <primitive
          object={gltf.scene}
          rotation={[0, 0, -Math.PI / 2]}
          position={[0, 0.7, 0]}
          scale={3}
        />
      </group>
    </>
  );
}

export default MainScene;
