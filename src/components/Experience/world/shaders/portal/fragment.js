import perlinNoise from "../noise/perlinNoise";

const fragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

varying vec2 vUv;

${perlinNoise}

void main() {
  vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime * 0.1));

  // Perlin noise
  float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));

  // Outer glow
  float outerGlow = distance(vUv, vec2(0.5)) * 5.0 - 1.6;
  strength += outerGlow;

  // Apply cool step
  strength += step(-0.2, strength) * 0.8;
  strength = clamp(strength, 0.0, 1.0);

  // Adding colors
  vec3 color = mix(uColorStart, uColorEnd, strength);

  gl_FragColor = vec4(color, 1.0);
}
`;
export default fragment;
