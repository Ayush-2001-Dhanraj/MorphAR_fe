import React, { useRef, useLayoutEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Float, useScroll } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function Bubble({ position, delay = 0, radius = 0.5, size = 0.4 }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const { camera, mouse } = useThree();
  const originalPos = useRef(new THREE.Vector3(...position));
  const [hovered, setHovered] = useState(false);

  const scroll = useScroll();

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.set(0, 0, 0);
    gsap.to(meshRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      delay,
      duration: 1,
      ease: "back.out(1.7)",
    });
  }, [delay]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const pos = meshRef.current.position;

    if (hovered) {
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = (originalPos.current.z - camera.position.z) / dir.z;
      const mouseWorld = camera.position
        .clone()
        .add(dir.multiplyScalar(distance));

      // Simple repulsion
      const repulse = pos
        .clone()
        .sub(mouseWorld)
        .normalize()
        .multiplyScalar(0.05);
      pos.add(repulse);
    } else {
      // Ease back to original position
      pos.lerp(originalPos.current, 0.05);
    }

    const baseAngle = Math.atan2(originalPos.current.z, originalPos.current.x);
    const baseRadius = originalPos.current.length();
    const scrollFactor = scroll.offset; // between 0 and 1

    const dynamicRadius = baseRadius + scrollFactor * 10; // Change 2.5 as needed

    const angle = baseAngle + scrollFactor * Math.PI * 2;

    const x = dynamicRadius * Math.cos(angle);
    const z = dynamicRadius * Math.sin(angle);
    const y = originalPos.current.y;

    meshRef.current.position.set(x, y, z);
  });

  useLayoutEffect(() => {
    if (!materialRef.current || !hovered) return;

    const mat = materialRef.current;
    mat.sheen = 1;
    mat.sheenColor = new THREE.Color("#ffffff");
    mat.sheenRoughness = 0.25;

    gsap.fromTo(
      mat,
      { sheenRoughness: 1 },
      {
        sheenRoughness: 0.1,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(mat, {
            sheenRoughness: 0.5,
            duration: 0.5,
            ease: "sine.out",
          });
        },
      }
    );

    // Small shake
    gsap.fromTo(
      meshRef.current.rotation,
      { x: 0, y: 0 },
      {
        x: 0.1,
        y: -0.1,
        duration: 0.2,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut",
      }
    );
  }, [hovered]);

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#a2d2ff"
          roughness={0}
          metalness={0}
          transparent
          opacity={0.15}
          depthWrite={false}
          thickness={0.5}
          transmission={1}
          ior={1.4}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          sheen={1}
          sheenColor={"white"}
          sheenRoughness={0.5}
        />
      </mesh>
    </Float>
  );
}

export default Bubble;
