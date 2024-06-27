import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

const CubesBackground = () => {
  const mouse = useRef([0, 0]);
  const { size, viewport } = useThree();

  const handleMouseMove = (event: MouseEvent) => {
    mouse.current = [
      (event.clientX / size.width) * 2 - 1,
      -(event.clientY / size.height) * 2 + 1
    ];
  };

  useFrame(() => {
    // Mise à jour des positions des cubes avec la souris
  });

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size]);

  const cubeSize = 0.1; // Taille de chaque cube
  const depth = -5; // Profondeur à laquelle les cubes seront placés

  const cubes = useMemo(() => {
    const positions: [number, number, number][] = [];
    const numCubesX = (Math.ceil(viewport.width / cubeSize) + 2)*2; // Nombre de cubes en largeur
    const numCubesY = (Math.ceil(viewport.height / cubeSize) + 2)*2; // Nombre de cubes en hauteur

    for (let i = -numCubesX / 2; i < numCubesX / 2; i++) {
      for (let j = -numCubesY / 2; j < numCubesY / 2; j++) {
        const x = i * cubeSize;
        const y = j * cubeSize;
        positions.push([x, y, depth]);
      }
    }
    return positions;
  }, [viewport.width, viewport.height, cubeSize]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      {cubes.map((pos, index) => (
        <mesh key={index} position={new THREE.Vector3(...pos)}>
          <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
          <meshStandardMaterial
            metalness={1}
            roughness={0.5}
            color={new THREE.Color(0xCCCCCC)}
            onBeforeCompile={(shader) => {
              shader.uniforms.mouse = { value: new THREE.Vector2(mouse.current[0], mouse.current[1]) };
              shader.uniforms.resolution = { value: new THREE.Vector2(size.width, size.height) };
              shader.fragmentShader = `
                uniform vec2 mouse;
                uniform vec2 resolution;
                ${shader.fragmentShader}
              `.replace(
                `void main() {`,
                `void main() {
                  vec2 st = gl_FragCoord.xy / resolution.xy;
                  float dist = distance(st, mouse);
                  float intensity = step(0.05, 1.0 - dist);
                  if (intensity < 0.5) discard;
                `
              );
            }}
          />
        </mesh>
      ))}
    </group>
  );
};

export default CubesBackground;
