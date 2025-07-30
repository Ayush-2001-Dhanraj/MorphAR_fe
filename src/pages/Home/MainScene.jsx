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

      {/* Object 2: appears at section 1 */}
      {section === 0 && <IntroSection />}

      {/* Object 3: appears at section 2 */}
      {section === 1 && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      )}

      {/* Object 4: appears at section 3 */}
      {section === 2 && (
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="green" />
        </mesh>
      )}

      {/* Object 5: appears at section 4 */}
      {section === 3 && (
        <mesh>
          <torusGeometry args={[0.5, 0.2, 16, 100]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      )}
      {section === 4 && (
        <mesh>
          <torusGeometry args={[0.5, 0.2, 16, 100]} />
          <meshStandardMaterial color="pink" />
        </mesh>
      )}
    </>
  );
}

export default MainScene;
