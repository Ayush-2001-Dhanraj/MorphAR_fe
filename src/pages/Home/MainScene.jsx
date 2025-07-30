import { MotionPathControls, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import IntroSection from "./Sections/IntroSection";

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

function AutoMoveObject({ targetRef, skyRef, setSection }) {
  const scroll = useScroll();

  useFrame((state, delta) => {
    const section = Math.floor(scroll.offset * 5);
    setSection(section);

    if (skyRef.current) {
      skyRef.current.rotation.y += delta * 0.05;
    }

    if (targetRef.current) {
      targetRef.current.rotation.x = scroll.offset * 2 * Math.PI;
    }
  });

  return null;
}

function MainScene({ skyRef }) {
  const boxRef = useRef();
  const flowerRef = useRef();
  const [section, setSection] = useState(0);

  const gltf = useGLTF("models/red_flower.glb");

  const { curve } = useMemo(() => {
    const curvePoints = generateCirclePoints(15, 2);
    const curve = new THREE.CatmullRomCurve3(curvePoints, true);

    return { curve };
  }, []);

  useEffect(() => {
    if (gltf.scene) {
      const targetMesh = gltf.scene.children[0];
      if (targetMesh) {
        flowerRef.current = targetMesh;
      }
    }
  }, [gltf]);

  return (
    <>
      <MotionPathControls curves={[curve]} focus={boxRef}>
        <AutoMoveObject
          targetRef={flowerRef}
          skyRef={skyRef}
          setSection={setSection}
        />
      </MotionPathControls>

      <group ref={boxRef}>
        <primitive
          object={gltf.scene}
          rotation={[0, 0, -Math.PI / 2]}
          position={[0, 2, 0]}
          scale={3}
        />
      </group>

      <IntroSection />
    </>
  );
}

export default MainScene;
