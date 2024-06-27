// src/FormulaView.tsx
import { Canvas } from '@react-three/fiber';
import RedbullModel from './components/RedBullModel';
// import CubesBackground from './components/CubesBackground';

const FormulaView = () => {
  return (
    <Canvas style={{ width: '100%', height: '100%', position: 'fixed' }} gl={{ alpha: true }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <RedbullModel url="glbs/formula1.glb" />
    
    </Canvas>
  );
};

export default FormulaView;
