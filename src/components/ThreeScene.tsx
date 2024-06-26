import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

const Scene = () => {
  const { camera, scene, viewport } = useThree();
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const firstWallTexture = useTexture('https://images.photowall.com/products/62526/in-the-forest-1.jpg?h=699&q=85') as THREE.Texture;
  const secondWallTexture = useTexture('https://static.vecteezy.com/system/resources/previews/028/050/819/non_2x/deer-look-at-camera-high-quality-3d-render-free-png.png') as THREE.Texture;
  const thirdWallTexture = useTexture('https://cdn.pixabay.com/photo/2017/09/01/00/16/png-2702697_1280.png') as THREE.Texture;

  const firstWall = useRef<THREE.Mesh>(null);
  const secondWall = useRef<THREE.Mesh>(null);
  const thirdWall = useRef<THREE.Mesh>(null);

  // Update mouse position
  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    setMousePosition({
      x: (clientX / viewport.width) * 2 - 1,
      y: -(clientY / viewport.height) * 2 + 1,
    });
  };

  // Register event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [viewport.width, viewport.height]);

  // Update wall positions based on mouse position
  useFrame(() => {
    if (secondWall.current && thirdWall.current) {
      secondWall.current.position.x = mousePosition.x * 3;
      thirdWall.current.position.x = mousePosition.x * 6;
    }
  });

  // Create walls and add to scene
  useEffect(() => {
    const createWall = (texture: THREE.Texture, positionZ: number, scaleFactor: number): THREE.Mesh => {
      const geometry = new THREE.PlaneGeometry(16 / scaleFactor, 9 / scaleFactor);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 4.5, positionZ);
      return mesh;
    };

    const firstWallMesh = createWall(firstWallTexture, 0, 1);
    const secondWallMesh = createWall(secondWallTexture, 3, camera.position.z / (camera.position.z - 3));
    const thirdWallMesh = createWall(thirdWallTexture, 7, camera.position.z / (camera.position.z - 7));

    if (firstWall.current && secondWall.current && thirdWall.current) {
      scene.add(firstWallMesh, secondWallMesh, thirdWallMesh);
      console.log(firstWall)
      firstWall.current = firstWallMesh;
      secondWall.current = secondWallMesh;
      thirdWall.current = thirdWallMesh;

      return () => {
        scene.remove(firstWallMesh, secondWallMesh, thirdWallMesh);
      };
    }
  }, [scene, firstWallTexture, secondWallTexture, thirdWallTexture, camera.position.z]);

  return null; // Scene component does not render anything directly
};

const ThreeScene = () => {
  return (
    <div className="test-section">
      <Canvas camera={{ position: [0, 3, 18], fov: 75 }}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
