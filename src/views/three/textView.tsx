// src/FormulaView.tsx
import { Canvas } from "@react-three/fiber";
import Text3DModel from "./components/Text3DModel";

const TextView = () => {
  return (
    <Canvas style={{ width: "100%", height: "100%" }} gl={{ alpha: true }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Text3DModel url="glbs/text.glb" textureUrl="textures/fuelTexture.jpg" />
    </Canvas>
  );
};

export default TextView;
