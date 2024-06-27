import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleSystemProps {
  position: THREE.Vector3;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ position }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 1000; // Nombre de particules
  const lifeTime = 2; // Durée de vie des particules en secondes

  const particlesData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position.x + (Math.random() * 0.2 - 0.1);
      positions[i * 3 + 1] = position.y + (Math.random() * 0.2 - 0.1);
      positions[i * 3 + 2] = position.z;
      lifetimes[i] = Math.random() * lifeTime;
    }
    return { positions, lifetimes };
  }, [position]);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlesData.positions, 3)
    );
    geometry.setAttribute(
      "lifetime",
      new THREE.BufferAttribute(particlesData.lifetimes, 1)
    );
    return geometry;
  }, [particlesData]);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const lifetimes = particlesRef.current.geometry.attributes.lifetime.array;

      for (let i = 0; i < particleCount; i++) {
        lifetimes[i] -= delta;
        if (lifetimes[i] <= 0) {
          // Réinitialiser la particule
          positions[i * 3] = position.x + (Math.random() * 0.2 - 0.1);
          positions[i * 3 + 1] = position.y + (Math.random() * 0.2 - 0.1);
          positions[i * 3 + 2] = position.z;
          lifetimes[i] = lifeTime;
        } else {
          // Déplacer la particule sur l'axe Z
          positions[i * 3 + 2] += 0.1;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.lifetime.needsUpdate = true;
    }
  });

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 0.05,
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry" {...particleGeometry} />
      <pointsMaterial
        attach="material"
        color={particleMaterial.color}
        size={particleMaterial.size}
      />
    </points>
  );
};

export default ParticleSystem;
