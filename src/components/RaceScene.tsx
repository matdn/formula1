import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
// import { Mesh } from "three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const Vehicle = () => {
  const vehicleRef = useRef<any>(null);
  const { camera } = useThree();
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  var model = new THREE.Group<THREE.Object3DEventMap>();
  var containerRBack = new THREE.Group();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "./glbs/formula1.glb",
      (gltf) => {
        model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1); // Ajustez l'échelle du modèle selon vos besoins
        model.position.set(-0.08, -0.67, 2);
        model.rotation.y = (Math.PI / 180) * -145; // Position initiale du modèle

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // child.material = new THREE.MeshPhysicalMaterial({
            //   color: 0x696969,
            //   metalness: 1,
            //   roughness: 0.5,
            //   clearcoat: 0.2,
            //   clearcoatRoughness: 0.5,
            // });
            console.log(child);

            // model.remove(child);
            switch (child.name) {
              case "R_Back_Tires":
              case "L_Back_Tires":
              case "L_Front_Tires":
              case "R_Front_Tires":
              case "Seat":
              case "L_Inside_Rim_Front":
              case "R_Inside_Rim_Front":
              case "L_Inside_Rim_Back":
              case "Spoiler":
              case "Spoiler_Small":
              case "R_Inside_Rim_Back":
                child.material = new THREE.MeshPhysicalMaterial({
                  color: 0x696969,
                  metalness: 1,
                  roughness: 0.5,
                  clearcoat: 0.2,
                  clearcoatRoughness: 0.5,
                });
                // // if (containerRBack) {
                // // console.log(child);
                // console.log(model);
                // model.remove(child);
                // // containerRBack.add(child);
                // // child.geometry.dispose();
                // // child.material.dispose();
                // // wheelsRef.current.push(child);
                // // console.log(child);

                // // containerRBack.add(child); // Ajouter la roue au conteneur spécifique
                // // containerRBack.position.copy(child.position); // Ajuster la position du conteneur
                // // }
                break;
              default:
                child.material = new THREE.MeshPhysicalMaterial({
                  color: 0xffffff,
                  metalness: 0.8,
                  roughness: 0.4,
                  clearcoat: 0.2,
                  clearcoatRoughness: 0.5,
                });
                break;
            }
          }
        });

        if (vehicleRef.current) {
          vehicleRef.current.add(model);
          wheelsRef.current.forEach((wheel) => {
            vehicleRef.current.remove(wheel);
          });
        }
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF model:", error);
      }
    );
  }, []);

  // Animation du véhicule (avancement)
  useFrame(() => {
    if (vehicleRef.current) {
      vehicleRef.current.position.z -= 0.1; // Vitesse de déplacement du véhicule
      camera.position.z = vehicleRef.current.position.z + 5; // Position de la caméra pour suivre le véhicule

      // Smooth transition of camera position
      // const targetX = vehicleRef.current.position.x - 5;
      // const targetY = vehicleRef.current.position.y + 2;
      // const targetZ = vehicleRef.current.position.z + 5;
      // camera.position.x += (targetX - camera.position.x) * 0.05; // Adjust the smoothing factor (0.05) as needed
      // camera.position.y += (targetY - camera.position.y) * 0.05;
      // camera.position.z += (targetZ - camera.position.z) * 0.05;
      const radius = 5; // Adjust radius as needed
      const speed = 0.0005; // Adjust rotation speed as needed
      const angle = performance.now() * speed;

      camera.position.x =
        vehicleRef.current.position.x + radius * Math.cos(angle);
      // camera.position.y = vehicleRef.current.position.y + radius;  // Adjust height as needed
      camera.position.z =
        vehicleRef.current.position.z + radius * Math.sin(angle);

      // camera.lookAt(vehicleRef.current.position);
      camera.lookAt(vehicleRef.current.position); // Look at the vehicle
      // wheelsRef.current.forEach((wheel) => {
      //   // wheel.rotation.reorder("XYZ");
      //   wheel.rotation.x -= 0.1; // Ajustez la vitesse de rotation selon vos besoins
      // });
      containerRBack.position.y -= 0.5;
    }
  });

  return <group ref={vehicleRef} />;
};

const Circuit = () => {
  const planeRef = useRef<THREE.Mesh>(null);
  const [planeSize, setPlaneSize] = useState({ width: 10, height: 1500 });

  const planeTexture = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Définir la taille du canvas

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Dessiner le circuit avec des voies vertes et des pointillés
    ctx.fillStyle = "#1E1E1E"; // Couleur de fond (noir)
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

  // useEffect(() => {}, [planeRef.current]);
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
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      {/* <OrbitControls /> */}
      <Circuit />
      <Vehicle />
    </Canvas>
  );
};

export default RaceScene;
