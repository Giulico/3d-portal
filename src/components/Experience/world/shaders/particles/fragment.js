const fragment = /* glsl */ `
uniform float uStrength;

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = uStrength / distanceToCenter - uStrength * 2.0;
  gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}
`;
export default fragment;
