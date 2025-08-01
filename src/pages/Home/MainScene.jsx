import { MotionPathControls, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import IntroSection from "./Sections/IntroSection";
import PlatformSection from "./Sections/PlatformSection";
import gsap from "gsap";

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

function AutoMoveObject({
  scrollControllerRef,
  skyRef,
  setSection,
  introRef,
  taskSectionRef1,
  taskSectionRef2,
  platform1,
  platform2,
  platform3,
  platform4,
}) {
  const scroll = useScroll();

  useFrame((state, delta) => {
    const section = Math.floor(scroll.offset * 5);
    setSection(section);

    if (taskSectionRef1.current && section === 0) {
      taskSectionRef1.current.position.y = scroll.offset * 13.8 - 2;
      taskSectionRef2.current.position.y = scroll.offset * 13.8 - 2.5;
      platform1.current.children[1].rotation.y += delta * 2;
      platform2.current.children[1].rotation.y += delta * 1.5;
      platform3.current.children[1].rotation.y += delta * 2;
      platform4.current.children[1].rotation.y += delta * 1.2;
    }

    if (section === 1) {
      platform1.current.children[1].rotation.y += delta * 2;
      gsap.to(platform1.current.position, {
        z: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: 1,
      });
      gsap.to(platform2.current.position, {
        z: 0.2,
        duration: 1.5,
        ease: "power2.out",
        delay: 1,
      });
      gsap.to(platform3.current.position, {
        z: 0.2,
        duration: 1.5,
        ease: "power2.out",
        delay: 1,
      });
      gsap.to(platform4.current.position, {
        z: -0.2,
        duration: 1.5,
        ease: "power2.out",
        delay: 1,
      });
    }

    if (introRef.current) {
      introRef.current.position.x = scroll.offset * 5;
      introRef.current.position.y = scroll.offset * 5;
    }

    if (skyRef.current) {
      skyRef.current.rotation.y += delta * 0.05;
    }

    if (scrollControllerRef.current) {
      scrollControllerRef.current.rotation.x = scroll.offset * 2 * Math.PI;
    }
  });

  return null;
}

function MainScene({ skyRef }) {
  const boxRef = useRef();
  const flowerRef = useRef();
  const [section, setSection] = useState(0);

  const introSectionRef = useRef();
  const taskSectionRef1 = useRef();
  const taskSectionRef2 = useRef();
  const taskSectionRef3 = useRef();

  const platform1 = useRef();
  const platform2 = useRef();
  const platform3 = useRef();
  const platform4 = useRef();

  const gltf = useGLTF("models/red_flower.glb");

  const { curve } = useMemo(() => {
    const curvePoints = generateCirclePoints(15, 2);
    const curve = new THREE.CatmullRomCurve3(curvePoints, true);

    return { curve };
  }, []);

  useEffect(() => {
    console.log("section", section);
  }, [section]);

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
          scrollControllerRef={flowerRef}
          skyRef={skyRef}
          setSection={setSection}
          introRef={introSectionRef}
          taskSectionRef1={taskSectionRef1}
          taskSectionRef2={taskSectionRef2}
          platform1={platform1}
          platform2={platform2}
          platform3={platform3}
          platform4={platform4}
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

      <IntroSection
        introGroupRef={introSectionRef}
        taskSectionRef1={taskSectionRef1}
      />

      <PlatformSection
        taskSectionRef2={taskSectionRef2}
        platform1={platform1}
        platform2={platform2}
        platform3={platform3}
        platform4={platform4}
      />
    </>
  );
}

export default MainScene;
