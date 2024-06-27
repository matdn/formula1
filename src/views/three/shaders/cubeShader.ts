export const vertexShader = `
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  varying vec3 vPosition;
  uniform vec2 mouse;

  void main() {
    float dist = distance(vPosition.xy, mouse);
    float intensity = step(0.5, 1.0 - dist);
    vec3 color = vec3(0.3, 0.6, 0.9) * intensity;
    gl_FragColor = vec4(color, 1.0);
  }
`;
