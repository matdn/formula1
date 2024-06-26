import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
// import { Mesh } from "three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const Vehicle = () => {
  const vehicleRef = useRef<any>(null);
  const { camera } = useThree();

  const loader = new GLTFLoader();
  loader.load("./glbs/formula1.glb", (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.02, 0.02, 0.02); // Ajustez l'échelle du modèle selon vos besoins
    model.position.set(-0.01, -0.1, 4.6);
    model.rotation.y = (Math.PI / 180) * -145; // Position initiale du modèle
    if (vehicleRef.current) {
      vehicleRef.current.add(model);
    }
  });

  // Animation du véhicule (avancement)
  useFrame(() => {
    if (vehicleRef.current) {
      vehicleRef.current.position.z -= 0.1; // Vitesse de déplacement du véhicule
      camera.position.z = vehicleRef.current.position.z + 5; // Position de la caméra pour suivre le véhicule
      camera.lookAt(
        vehicleRef.current.position.x,
        vehicleRef.current.position.y,
        vehicleRef.current.position.z
      ); // Oriente la caméra vers le véhicule
    }
  });

  return <group ref={vehicleRef} />;
};

const Circuit = () => {
  const planeRef = useRef<THREE.Mesh>(null);
  const [planeSize, setPlaneSize] = useState({ width: 10, height: 150 });

  const planeTexture = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Définir la taille du canvas

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Dessiner le circuit avec des voies vertes et des pointillés
    ctx.fillStyle = "#A39193"; // Couleur de fond (noir)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner les voies vertes
    ctx.strokeStyle = "#00FF00"; // Couleur des voies (vert fluo)
    ctx.lineWidth = 10; // Largeur des voies
    ctx.setLineDash([20, 30]); // Pointillés (20 pixels pleins, 10 pixels vides)
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Créer la texture Three.js à partir du canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10); // Répétition de la texture sur le plan

    return texture;
  };

  useFrame(() => {
    if (planeRef.current) {
      planeRef.current.position.z += 0.01;
    }
  });

  useEffect(() => {
    console.log(planeRef);
  }, [planeRef.current]);
  return (
    <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[planeSize.width, planeSize.height]} />
      <meshStandardMaterial map={planeTexture()} />
    </mesh>
  );
};

const RaceScene = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <OrbitControls />
      <Circuit />
      <Vehicle />
    </Canvas>
  );
};

export default RaceScene;
