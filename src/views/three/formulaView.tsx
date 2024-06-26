// src/FormulaView.tsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RedbullModel from './components/RedBullModel';

const FormulaView = () => {
  return (
    <Canvas style={{ width: '100%', height: '100%' }} gl={{ alpha: true }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <RedbullModel url="glbs/formula1.glb" />
      <OrbitControls />
    </Canvas>
  );
};

export default FormulaView;
