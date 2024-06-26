import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

const Scene = () => {
  const { camera, scene } = useThree();

  useEffect(() => {
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);
  }, [scene]);

  const firstWallTexture = useTexture('https://images.photowall.com/products/62526/in-the-forest-1.jpg?h=699&q=85');
  const secondWallTexture = useTexture('https://static.vecteezy.com/system/resources/previews/028/050/819/non_2x/deer-look-at-camera-high-quality-3d-render-free-png.png');
  const thirdWallTexture = useTexture('https://cdn.pixabay.com/photo/2017/09/01/00/16/png-2702697_1280.png');

  const createWall = (texture: THREE.Texture, positionZ: number, scaleFactor: number) => {
    const geometry = new THREE.PlaneGeometry(16 / scaleFactor, 9 / scaleFactor);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 4.5, positionZ);
    return mesh;
  };

  const firstWall = createWall(firstWallTexture, 0, 1);
  const secondWall = createWall(secondWallTexture, 3, camera.position.z / (camera.position.z - 3));
  const thirdWall = createWall(thirdWallTexture, 7, camera.position.z / (camera.position.z - 7));

  useEffect(() => {
    scene.add(firstWall, secondWall, thirdWall);
  }, [scene, firstWall, secondWall, thirdWall]);
};

const ThreeScene: React.FC = () => {
  return (
    <div className="test-section">
      <Canvas camera={{ position: [0, 3, 18], fov: 75 }}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default ThreeScene;