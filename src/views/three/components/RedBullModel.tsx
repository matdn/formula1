// src/RedbullModel.tsx
import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const RedbullModel = ({ url }: { url: string }) => {
  const redbullRef = useRef<THREE.Object3D | null>(null);
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Object3D && child.name === "Redbull") {
        redbullRef.current = child;
        
        redbullRef.current.rotation.z = Math.PI / 200;
        redbullRef.current.rotation.x = Math.PI / 8;
        redbullRef.current.rotation.y = (-Math.PI / 2)*0.7;
      }
    });
  }, [gltf]);

  useFrame(() => {
    if (redbullRef.current) {
    //   redbullRef.current.position.y -= 1;
    }
  });

  return <primitive object={gltf.scene} />;
};

export default RedbullModel;
