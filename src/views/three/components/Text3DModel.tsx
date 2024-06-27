import React, { useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const Text3DModel = ({
  url,
  textureUrl,
}: {
  url: string;
  textureUrl: string;
}) => {
  const textRef = useRef<THREE.Object3D | null>(null);
  const gltf = useLoader(GLTFLoader, url);
  const glassTexture = useLoader(THREE.TextureLoader, textureUrl);

  gltf.scene.traverse((child) => {
    console.log(child.name);
    if (child.name === "Shape") {
      textRef.current = child;
      textRef.current.position.set(-500, 0, 0); // Position your text as needed
      textRef.current.scale.set(0.5, 0.5, 0.5); // Scale your text as needed

      // Apply material if needed
      const glassMaterial = new THREE.MeshStandardMaterial({
        map: glassTexture,
        metalness: 1.2,
        roughness: 0.4,
        // transparent: true,
        // opacity: 0.9,
        color: new THREE.Color(0xffffff),
      });
      (child as THREE.Mesh).material = glassMaterial;
    }
  });

  return <primitive object={gltf.scene} />;
};

export default Text3DModel;
