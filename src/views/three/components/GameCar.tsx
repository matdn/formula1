import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

interface RedbullModelProps {
  url: string;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
}

const GameCar: React.FC<RedbullModelProps> = ({ url, rotationX = Math.PI / 8, rotationY = (-Math.PI / 2) * 0.7, rotationZ = Math.PI / 200 }) => {
  const redbullRef = useRef<THREE.Object3D | null>(null);
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Object3D && child.name === "Redbull") {
        redbullRef.current = child;
        
        redbullRef.current.rotation.x = rotationX ? rotationX :  Math.PI / 200;
        redbullRef.current.rotation.y = rotationY ? rotationY : Math.PI / 8;
        redbullRef.current.rotation.z = rotationZ ? rotationZ : (-Math.PI / 2)*0.7;
      }
    });
  }, [gltf, rotationX, rotationY, rotationZ]);

  useFrame(() => {
    if (redbullRef.current) {
    //   redbullRef.current.position.y -= 1;
  }
  });

  return <primitive object={gltf.scene} />;
};

export default GameCar;
