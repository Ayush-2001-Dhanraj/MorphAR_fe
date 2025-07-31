import React, { useRef, useLayoutEffect, useMemo, useEffect } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import Bubble from "./Bubble";

function IntroSection() {
  const groupRef = useRef();

  const randomBubbles = useMemo(() => {
    const bubbles = [];
    const count = 25;
    for (let i = 0; i < count; i++) {
      const radius = THREE.MathUtils.randFloat(1, 3); // Increased radius
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
    if (groupRef.current) {
      groupRef.current.position.set(0, -8, 0); // push back in Z space
      gsap.to(groupRef.current.position, {
        y: 0,
        duration: 1.5,
        ease: "power2.out",
      });
    }
  }, []);

  return (
    <group ref={groupRef} scale={0.5} rotation={[0, Math.PI / 2, 0]}>
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
  );
}

export default IntroSection;
