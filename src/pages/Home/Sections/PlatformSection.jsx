import { Float, Text, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import {
  PLATFORM_1_POS,
  PLATFORM_2_POS,
  PLATFORM_3_POS,
  PLATFORM_4_POS,
} from "../../../utils/constants";

const PlatformSection = ({
  taskSectionRef2,
  platform1,
  platform2,
  platform3,
  platform4,
}) => {
  const { scene } = useGLTF("models/platform.glb");

  const platforms = useMemo(
    () => [
      {
        label: "1",
        position: PLATFORM_1_POS,
        speed: Math.floor(Math.random() * 2) + 1,
        rotationIntensity: Math.random(),
        floatIntensity: Math.floor(Math.random() * 2) + 1,
        ref: platform1,
      },
      {
        label: "2",
        position: PLATFORM_2_POS,
        speed: Math.floor(Math.random() * 2) + 1,
        rotationIntensity: Math.random(),
        floatIntensity: Math.floor(Math.random() * 2) + 1,
        ref: platform2,
      },
      {
        label: "3",
        position: PLATFORM_3_POS,
        speed: Math.floor(Math.random() * 2) + 1,
        rotationIntensity: Math.random(),
        floatIntensity: Math.floor(Math.random() * 2) + 1,
        ref: platform3,
      },
      {
        label: "4",
        position: PLATFORM_4_POS,
        speed: Math.floor(Math.random() * 2) + 1,
        rotationIntensity: Math.random(),
        floatIntensity: Math.floor(Math.random() * 2) + 1,
        ref: platform4,
      },
    ],
    []
  );

  return (
    <group ref={taskSectionRef2}>
      {platforms.map(
        (
          { label, position, speed, rotationIntensity, floatIntensity, ref },
          index
        ) => (
          <Float
            key={index}
            speed={speed}
            rotationIntensity={rotationIntensity}
            floatIntensity={floatIntensity}
          >
            <group rotation={[0, Math.PI / 2, 0]} position={position} ref={ref}>
              <Text
                fontSize={0.1}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                position={[0, 0.7, 0]}
                rotation={[0, Math.PI / 11, 0]}
              >
                {label}
              </Text>
              <primitive object={scene.clone(true)} scale={1} />
            </group>
          </Float>
        )
      )}
    </group>
  );
};

export default PlatformSection;
