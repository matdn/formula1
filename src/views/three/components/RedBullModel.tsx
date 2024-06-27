import React, { useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

gsap.registerPlugin(ScrollTrigger);
enum GSAP_DIRECTION {
  X = "x",
  Y = "y",
  Z = "z",
}
const animateGsap = (
  element: any,
  translate: number,
  direction: GSAP_DIRECTION
) => {
  direction === GSAP_DIRECTION.X &&
    gsap.to(element, {
      x: translate,
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".split",
        scrub: true,
        start: "top bottom",
        end: "bottom top",
      },
    });
  direction === GSAP_DIRECTION.Y &&
    gsap.to(element, {
      y: translate,
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".split",
        scrub: true,
        start: "top bottom",
        end: "bottom top",
      },
    });
  direction === GSAP_DIRECTION.Z &&
    gsap.to(element, {
      z: translate,
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".split",
        scrub: true,
        start: "top top",
        end: "bottom top",
      },
    });
};

const RedbullModel = ({ url }: { url: string }) => {
  const redbullRef = useRef<THREE.Object3D | null>(null);
  const gltf = useLoader(GLTFLoader, url);

  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Object3D && child.name === "Redbull") {
      redbullRef.current = child;
      redbullRef.current.position.set(1900, 300, -400);
      redbullRef.current.rotation.set(
        Math.PI / 8,
        (-Math.PI / 2) * 0.75,
        Math.PI / 200
      );

      // Initial animation with GSAP
      gsap.to(redbullRef.current.position, {
        x: 100,
        y: 0,
        duration: 2,
        onUpdate: () => {
          if (
            redbullRef.current &&
            redbullRef.current.position.x <= 100 &&
            redbullRef.current.position.y <= 0
          ) {
            gsap.killTweensOf(redbullRef.current.position); // Stop the animation
          }
        },
        onComplete: () => {
          if (redbullRef.current) {
            // Set up ScrollTrigger
            gsap.to(redbullRef.current.rotation, {
              scrollTrigger: {
                trigger: ".history",
                scrub: true,
                start: "top bottom",
                end: "top top",
              },
              x: "+=1.18*Math.PI", // Rotate 540 degrees on X axis
              y: "+=1.18*Math.PI", // Rotate 558 degrees on Y axis
            });

            gsap.to(redbullRef.current.position, {
              scrollTrigger: {
                trigger: ".history",
                scrub: true,
                start: "top bottom",
                end: "bottom top",
              },
              x: redbullRef.current.position.x - 150, // Slight move to the left
            });

            gsap.to(redbullRef.current.scale, {
              scrollTrigger: {
                trigger: ".history",
                scrub: true,
                start: "top bottom",
                end: "bottom top",
              },
              x: redbullRef.current.scale.x * 0.6, // Slight scale down
              y: redbullRef.current.scale.y * 0.6,
              z: redbullRef.current.scale.z * 0.6,
              onComplete: () => {
                
              },
            });
          }
        },
      });
    }
    // FRAGEMENT CAR
    // WHEELS
    child.name === "R_RimFront" &&
      animateGsap(child.position, 4, GSAP_DIRECTION.X);
    child.name === "R_RimBack" &&
      animateGsap(child.position, 4, GSAP_DIRECTION.X);
    child.name === "L_RimFront_Instance" &&
      animateGsap(child.position, -4, GSAP_DIRECTION.X);
    child.name === "L_RimBack_Instance" &&
      animateGsap(child.position, -4, GSAP_DIRECTION.X);

    // WHEEL FRONT LEFT
    child.name === "L_Bujon_Front_Wheel" &&
      animateGsap(child.position, -0.5, GSAP_DIRECTION.X);
    child.name === "L_Inside_Rim_Front" &&
      animateGsap(child.position, -1, GSAP_DIRECTION.X);
    child.name === "L_Rim_Front" &&
      animateGsap(child.position, -1.5, GSAP_DIRECTION.X);
    child.name === "Fender" &&
      animateGsap(child.position, -2, GSAP_DIRECTION.X);
    child.name === "Tires_Lid_Front" &&
      animateGsap(child.position, -2.5, GSAP_DIRECTION.X);
    child.name === "Front_Disk" &&
      animateGsap(child.position, -3, GSAP_DIRECTION.X);

    // WHEEL FRONT RIGHT
    child.name === "R_Bujon_Front_Wheel" &&
      animateGsap(child.position, -0.5, GSAP_DIRECTION.X);
    child.name === "R_Inside_Rim_Front" &&
      animateGsap(child.position, -1, GSAP_DIRECTION.X);
    child.name === "R_Rim_Front" &&
      animateGsap(child.position, -1.5, GSAP_DIRECTION.X);
    child.name === "R_Fender" &&
      animateGsap(child.position, -2, GSAP_DIRECTION.X);
    child.name === "R_Tires_Lid_Front" &&
      animateGsap(child.position, -2.5, GSAP_DIRECTION.X);
    child.name === "R_Front_Disk" &&
      animateGsap(child.position, -3, GSAP_DIRECTION.X);

    // WHEEL BACK LEFT
    child.name === "L_Bujon_Back_Whell" &&
      animateGsap(child.position, -0.5, GSAP_DIRECTION.X);
    child.name === "L_Inside_Rim_Back" &&
      animateGsap(child.position, -1, GSAP_DIRECTION.X);
    child.name === "L_Rim_Bck" &&
      animateGsap(child.position, -1.5, GSAP_DIRECTION.X);
    child.name === "L_Back_Tires" &&
      animateGsap(child.position, -2, GSAP_DIRECTION.X);
    child.name === "L_Tires_Lid_Back" &&
      animateGsap(child.position, -2.5, GSAP_DIRECTION.X);

    // WHEEL BACK RIGHT
    child.name === "R_Bujon_Back_Whell" &&
      animateGsap(child.position, -0.5, GSAP_DIRECTION.X);
    child.name === "R_Inside_Rim_Back" &&
      animateGsap(child.position, -1, GSAP_DIRECTION.X);
    child.name === "R_Rim_Bck" &&
      animateGsap(child.position, -1.5, GSAP_DIRECTION.X);
    child.name === "R_Back_Tires" &&
      animateGsap(child.position, -2, GSAP_DIRECTION.X);
    child.name === "Tires_Lid_Back" &&
      animateGsap(child.position, -2.5, GSAP_DIRECTION.X);

    // SUSP FRONT RIGHT
    child.name === "SuspFront_Instance" &&
      animateGsap(child.position, -1, GSAP_DIRECTION.X);
    child.name === "4" && animateGsap(child.position, 0.5, GSAP_DIRECTION.Y);
    child.name === "5" && animateGsap(child.position, -0.5, GSAP_DIRECTION.Y);

    // SUSP FRONT LEFT
    child.name === "SuspFront" &&
      animateGsap(child.position, 1, GSAP_DIRECTION.X);
    child.name === "4_1" && animateGsap(child.position, 0.5, GSAP_DIRECTION.Y);
    child.name === "5_1" && animateGsap(child.position, -0.5, GSAP_DIRECTION.Y);

    // SUSP BACK RIGHT
    child.name === "SuspBack_Instance" &&
      animateGsap(child.position, -1.5, GSAP_DIRECTION.X);
    child.name === "1" && animateGsap(child.position, 0.5, GSAP_DIRECTION.Y);
    child.name === "2" && animateGsap(child.position, 0, GSAP_DIRECTION.Y);
    child.name === "7" && animateGsap(child.position, -0.5, GSAP_DIRECTION.Y);
    child.name === "6" && animateGsap(child.position, -1, GSAP_DIRECTION.Y);

    // SUSP BACK LEFT
    child.name === "SuspBack" &&
      animateGsap(child.position, 1.5, GSAP_DIRECTION.X);
    child.name === "1_1" && animateGsap(child.position, 0.5, GSAP_DIRECTION.Y);
    child.name === "2_1" && animateGsap(child.position, 0, GSAP_DIRECTION.Y);
    child.name === "7_1" && animateGsap(child.position, -0.5, GSAP_DIRECTION.Y);
    child.name === "6_1" && animateGsap(child.position, -1, GSAP_DIRECTION.Y);

    // SPOILER FRONT
    child.name === "SpoilerFront" &&
      animateGsap(child.position, 6.5, GSAP_DIRECTION.Z);
    child.name === "Front_Spoiler_Holder" &&
      animateGsap(child.position, 1, GSAP_DIRECTION.Y);
    child.name === "Canard_1" &&
      animateGsap(child.position, 0.4, GSAP_DIRECTION.X);
    child.name === "Canard001" &&
      animateGsap(child.position, -0.4, GSAP_DIRECTION.X);
    child.name === "Horizontal_Radar_wing_2_Instance_2" &&
      animateGsap(child.position, -1, GSAP_DIRECTION.X);
    child.name === "Horizontal_Radar_wing_2_Instance_1" &&
      animateGsap(child.position, 1, GSAP_DIRECTION.X);

    // SPOILER BACK
    child.name === "SpoilerBack" &&
      animateGsap(child.position, -5, GSAP_DIRECTION.Z);
    child.name === "Spoiler" &&
      animateGsap(child.position, 0.5, GSAP_DIRECTION.Y);
    child.name === "Spoiler_Small" &&
      animateGsap(child.position, -0.5, GSAP_DIRECTION.Y);
    child.name === "Spoiler_Big" &&
      animateGsap(child.position, -1, GSAP_DIRECTION.Y);
    child.name === "swan" &&
      animateGsap(child.position, -1.5, GSAP_DIRECTION.Z);

    // CABINE
    child.name === "Control" &&
      animateGsap(child.position, 1, GSAP_DIRECTION.Y);
    child.name === "Mirror" && animateGsap(child.position, 1, GSAP_DIRECTION.Y);

    // RADAR
    child.name === "Horizontal_Radar_wing_2_Instance_3" &&
      animateGsap(child.position, 1, GSAP_DIRECTION.Y);
    child.name === "Horizontal_Radar_wing_2_Instance" &&
      animateGsap(child.position, 0.7, GSAP_DIRECTION.Y);
    child.name === "Horizontal_Radar_wing_2_Instance" &&
      animateGsap(child.position, -0.7, GSAP_DIRECTION.X);
    child.name === "Horizontal_Radar_wing_2_4" &&
      animateGsap(child.position, 0.7, GSAP_DIRECTION.Y);
    child.name === "Horizontal_Radar_wing_2_4" &&
      animateGsap(child.position, 0.7, GSAP_DIRECTION.X);

    // CANARD LEFT
    child.name === "DOWN_CANARD_Instance" &&
      animateGsap(child.position, -1, GSAP_DIRECTION.Y);
    child.name === "DOWN_CANARD_Instance" &&
      animateGsap(child.position, -2, GSAP_DIRECTION.X);

    // CANARD RIGHT
    child.name === "DOWN_CANARD_1" &&
      animateGsap(child.position, -1, GSAP_DIRECTION.Y);
    child.name === "DOWN_CANARD_1" &&
      animateGsap(child.position, 2, GSAP_DIRECTION.X);

    // Apply materials
    if (child instanceof THREE.Mesh) {
      if (child.name.includes("Wheel") || child.name.includes("Tire")) {
        // Apply black material to wheels/tires
        const blackMaterial = new THREE.MeshStandardMaterial({
          metalness: 0,
          roughness: 0.5,
          color: new THREE.Color(0x111111),
        });
        child.material = blackMaterial;
      } else {
        // Apply chrome material to the rest of the car
        const chromeMaterial = new THREE.MeshStandardMaterial({
          metalness: 1,
          roughness: 0.5,
          color: new THREE.Color(0xcccccc),
        });
        child.material = chromeMaterial;
      }
    }
  });

  return <primitive object={gltf.scene} />;
};

export default RedbullModel;
