import { useLayoutEffect, useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import Bubble from "./Bubble";

function IntroSection({ introGroupRef, taskSectionRef1 }) {
  const randomBubbles = useMemo(() => {
    const bubbles = [];
    const count = 25;
    for (let i = 0; i < count; i++) {
      const radius = THREE.MathUtils.randFloat(1, 1.5); // Increased radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const delay = 1.5 + Math.random() * 0.8;
      const size = THREE.MathUtils.randFloat(0.25, 0.5);

      bubbles.push({ position: [x, y, z], delay, size });
    }
    return bubbles;
  }, []);

  useLayoutEffect(() => {
    if (introGroupRef.current) {
      introGroupRef.current.position.set(0, -8, 0);
      gsap.to(introGroupRef.current.position, {
        y: 0,
        duration: 1.5,
        ease: "power2.out",
      });
    }
  }, []);

  return (
    <>
      <group ref={introGroupRef} scale={0.5} rotation={[0, Math.PI / 2, 0]}>
        {/* Heading */}
        <Text
          position={[0, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          MorphAI
        </Text>
        <Text
          position={[0, 0, -0.01]} // slightly behind
          fontSize={0.3}
          color="#8ec5fc" // glow color
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
        >
          MorphAI
        </Text>

        {/* Subtext */}
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.1}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          Create 3D Objects from Different Inputs
        </Text>

        {randomBubbles.map((bubble, index) => (
          <Bubble
            key={index}
            position={bubble.position}
            delay={bubble.delay}
            size={bubble.size}
          />
        ))}
      </group>
      <group
        ref={taskSectionRef1}
        rotation={[0, Math.PI / 2, 0]}
        position={[0, -0.5, 0]}
      >
        <Text
          position={[0, 0, 0]}
          fontSize={0.05}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Lets create a simple vase scene in 4 Steps
        </Text>
        <Text
          position={[0, 0, -0.01]}
          fontSize={0.0505}
          anchorX="center"
          anchorY="middle"
          color="#8ec5fc"
          material-toneMapped={false}
        >
          Lets create a simple vase scene in 4 Steps
        </Text>
      </group>
    </>
  );
}

export default IntroSection;
