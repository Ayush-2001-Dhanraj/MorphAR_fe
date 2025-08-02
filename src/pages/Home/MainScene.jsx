import { MotionPathControls, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import IntroSection from "./Sections/IntroSection";
import gsap from "gsap";
import Bubble from "./Sections/Bubble";

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
  setHelperText,
  sectionRefs,
}) {
  const scroll = useScroll();

  useFrame((state, delta) => {
    const section = Math.floor(scroll.offset * 5);
    setSection(section);

    if (section == 0) {
      setHelperText("");
    }

    if (section === 1 || section === 2) {
      setHelperText("Vase Creation");

      let value = scroll.offset; // Example input
      let oldMin = 0.2;
      let oldMax = 0.6;
      let newMin = 0;
      let newMax = 1;

      let mappedValue =
        ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
      const n = 3;
      const part = Math.min(Math.floor(mappedValue * n), n - 1);

      switch (part) {
        case 0:
          sectionRefs.section1A.current.visible = true;
          sectionRefs.section1B.current.visible = false;
          sectionRefs.section1C.current.visible = false;
          break;
        case 1:
          sectionRefs.section1A.current.visible = true;
          sectionRefs.section1B.current.visible = true;
          sectionRefs.section1C.current.visible = false;
          break;
        case 2:
          sectionRefs.section1A.current.visible = true;
          sectionRefs.section1B.current.visible = true;
          sectionRefs.section1C.current.visible = true;
          break;

        default:
          break;
      }

      const animateY = (ref, visible, delay = 0) => {
        if (ref?.current) {
          gsap.to(ref.current.position, {
            y: visible ? 0.3 : -0.3,
            duration: 0.6,
            ease: "power2.out",
            delay,
          });
        }
      };

      animateY(sectionRefs.section1A, part >= 0);
      animateY(sectionRefs.section1B, part >= 1);
      animateY(sectionRefs.section1C, part >= 2);
    }

    if (section === 3) {
      setHelperText("A vase needs flowers and a Stand");
    }

    if (section === 4 || section === 5) {
      setHelperText("Putting it all Together");
    }

    if (taskSectionRef1.current && section === 0) {
      taskSectionRef1.current.position.y = scroll.offset * 13.8 - 2;
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
  const [helperText, setHelperText] = useState("");

  const introSectionRef = useRef();
  const taskSectionRef1 = useRef();
  const section1A = useRef();
  const section1B = useRef();
  const section1C = useRef();

  const gltf = useGLTF("models/red_flower.glb");

  const randomBubbles = useMemo(() => {
    const bubbles = [];
    const count = 25;
    for (let i = 0; i < count; i++) {
      const radius = THREE.MathUtils.randFloat(0.5, 1.2); // Increased radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const delay = 1.5 + Math.random() * 0.8;
      const size = THREE.MathUtils.randFloat(0.1, 0.2);

      bubbles.push({ position: [x, y, z], delay, size });
    }
    return bubbles;
  }, []);

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
          setHelperText={setHelperText}
          sectionRefs={{ section1A, section1B, section1C }}
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
        helperText={helperText}
        section={section}
        sectionRefs={{ section1A, section1B, section1C }}
      />

      {randomBubbles.map((bubble, index) => (
        <Bubble
          key={index}
          position={bubble.position}
          delay={bubble.delay}
          size={bubble.size}
          section={section}
        />
      ))}
    </>
  );
}

export default MainScene;
