// src/types/GLTFResult.d.ts
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
};
