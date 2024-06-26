import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { GUI } from "lil-gui";

const CameraControls = () => {
  const { camera } = useThree();

  useEffect(() => {
    const gui = new GUI();
    gui.add(camera.position, "x", -10, 10).name("Camera X");
    gui.add(camera.position, "y", -10, 10).name("Camera Y");
    gui.add(camera.position, "z", -10, 10).name("Camera Z");

    return () => {
      gui.destroy();
    };
  }, [camera]);

  return null;
};

export default CameraControls;
