import { useLayoutEffect, useMemo, useRef } from "react";
import { Float, Image, Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function IntroSection({
  introGroupRef,
  taskSectionRef1,
  helperText,
  section,
  sectionRefs,
}) {
  const flamingo = useGLTF("models/flamingo.glb");
  const vase = useGLTF("models/vase.glb");
  const flower = useGLTF("models/yellow_rose.glb");
  const { section1A, section1B, section1C } = sectionRefs;

  useLayoutEffect(() => {
    if (introGroupRef.current) {
      introGroupRef.current.position.set(0, -8, 0);
      gsap.to(introGroupRef.current.position, {
        y: 0,
        duration: 1.5,
        ease: "power2.out",
      });
    }

    if (section1A.current) section1A.current.visible = false;
    if (section1B.current) section1B.current.visible = false;
    if (section1C.current) section1C.current.visible = false;
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
      </group>

      <group
        ref={taskSectionRef1}
        rotation={[0, Math.PI / 2, 0]}
        position={[0, -0.5, 0]}
      >
        <Text
          position={[0, 0, 0]}
          fontSize={0.07}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          How MorphAI works?
        </Text>
        <Text
          position={[0, 0, -0.01]}
          fontSize={0.0705}
          anchorX="center"
          anchorY="middle"
          color="#8ec5fc"
          material-toneMapped={false}
        >
          How MorphAI works?
        </Text>
        {section !== 0 && (
          <>
            <Text
              position={[0, -0.08, 0]}
              fontSize={0.04}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              Lets create a simple scene of a beautiful vase
            </Text>
            <Text
              position={[0, -0.13, 0]}
              fontSize={0.04}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              with flowers.
            </Text>
          </>
        )}
      </group>

      <group rotation={[0, Math.PI / 2, 0]} position={[0, -0.8, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.04}
          anchorX="center"
          anchorY="middle"
          color="#ffffff"
          material-toneMapped={false}
        >
          {helperText}
        </Text>
      </group>

      {(section === 1 || section === 2) && (
        <group rotation={[0, Math.PI / 2, 0]}>
          <group position={[-1, 0.3, 0]} ref={section1A}>
            <Text
              fontSize={0.1}
              anchorX="center"
              anchorY="middle"
              color="#fff"
              material-toneMapped={false}
            >
              1
            </Text>
            <Text
              position={[0, -0.09, 0]}
              fontSize={0.04}
              anchorX="center"
              anchorY="middle"
              color="#ccc"
              material-toneMapped={false}
            >
              Describe your 3d vase
            </Text>
            <Text
              position={[0, -0.3, 0]}
              fontSize={0.04}
              anchorX="center"
              anchorY="middle"
              color="#fff"
              material-toneMapped={false}
            >
              " A red vase "
            </Text>
          </group>
          <group position={[0, 0.3, 0]} ref={section1B}>
            <Text
              fontSize={0.1}
              anchorX="center"
              anchorY="middle"
              color="#fff"
              material-toneMapped={false}
            >
              2
            </Text>
            <Text
              position={[0, -0.09, 0]}
              fontSize={0.04}
              anchorX="center"
              anchorY="middle"
              color="#ccc"
              material-toneMapped={false}
            >
              Verify 2D version of the model
            </Text>

            <Image
              url="images/vase.png"
              scale={0.5}
              position={[0, -0.4, -0.05]}
            />
          </group>
          <group position={[1, 0.3, 0]} ref={section1C}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.1}
              anchorX="center"
              anchorY="middle"
              color="#fff"
              material-toneMapped={false}
            >
              3
            </Text>
            <Text
              position={[0, -0.09, 0]}
              fontSize={0.04}
              anchorX="center"
              anchorY="middle"
              color="#ccc"
              material-toneMapped={false}
            >
              Download the model
            </Text>
            <Float speed={2} floatIntensity={1.8} rotationIntensity={1.5}>
              <primitive
                object={vase.scene}
                position={[0, -0.4, -0.05]}
                scale={0.5}
              />
            </Float>
          </group>
        </group>
      )}
    </>
  );
}

export default IntroSection;
