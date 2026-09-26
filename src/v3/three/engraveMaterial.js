import * as THREE from "three";
import { hexToVec3 } from "./color";

/**
 * Engraving (non-photoreal) shading for real 3D geometry.
 *
 * Diffuse light is turned into screen-space burin lines: one family of
 * parallel lines swells with shadow, a second family crosses it in the
 * mid-tones and a third in the deepest shadow. `uInk` runs 0 → 1 from a
 * faint pencil sketch to a fully inked plate.
 *
 * All colours are raw sRGB and the shader writes straight to the canvas,
 * so the scene matches the page's ivory exactly.
 */

const vertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vWorld;

  uniform vec3 uLight;
  uniform float uInk;
  uniform float uSpacing;
  uniform float uAngle;
  uniform float uTone;
  uniform float uPixelRatio;
  uniform vec3 uInkColor;
  uniform vec3 uTint;

  float engrave(float coord, float weight) {
    float d = abs(fract(coord) - 0.5) * 2.0;
    float aa = fwidth(coord) * 1.5;
    return 1.0 - smoothstep(weight - aa, weight + aa, d);
  }

  vec2 rot(vec2 p, float a) {
    float c = cos(a), s = sin(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    float diff = max(dot(n, normalize(uLight)), 0.0);
    float rim = pow(1.0 - abs(n.y), 3.0) * 0.12;
    float light = clamp(0.16 + 0.84 * diff + rim, 0.0, 1.0);
    float dark = clamp((1.0 - light) * uTone + (uTone - 1.0) * 0.35, 0.0, 1.0);

    vec2 px = gl_FragCoord.xy / (uSpacing * uPixelRatio);
    // Lines wobble a little with the surface, like a hand-cut plate.
    float wob = sin(vWorld.x * 2.3 + vWorld.z * 1.7) * 0.22 + sin(vWorld.y * 3.1) * 0.12;

    vec2 a = rot(px, uAngle);
    vec2 b = rot(px, uAngle + 1.5708);
    vec2 c = rot(px, uAngle + 0.7854);

    float ink = engrave(a.y + wob, clamp(dark * 1.05, 0.0, 0.94));
    ink = max(ink, engrave(b.y + wob, clamp((dark - 0.42) * 1.5, 0.0, 0.8)));
    ink = max(ink, engrave(c.y * 1.3 + wob, clamp((dark - 0.7) * 2.0, 0.0, 0.7)));
    ink *= smoothstep(0.0, 1.0, uInk);

    // Before the ink goes down: loose pencil hatching in the shadows.
    float jitter = hash(floor(px * 0.08)) * 0.6;
    float pencil = engrave(a.y * 0.5 + jitter, 0.07) * step(0.35, dark) * 0.28;
    pencil *= 1.0 - smoothstep(0.0, 0.8, uInk);

    // uTint is this surface's "paper": ivory for most, red for the plane.
    gl_FragColor = vec4(mix(uTint, uInkColor, max(ink, pencil)), 1.0);
  }
`;

export const INK = "#0e0d0c";
export const PAPER = "#eeeae2";

/** Shared uniforms so one GSAP tween / frame update drives every surface. */
export const sharedUniforms = {
  uLight: { value: new THREE.Vector3(-0.55, 0.9, 0.45).normalize() },
  uInk: { value: 0 },
  uSpacing: { value: 4.2 },
  uPixelRatio: { value: 1 },
  uInkColor: { value: hexToVec3(INK) },
};

/**
 * @param {object} o
 * @param {number} [o.angle] hatch angle in radians
 * @param {number} [o.tone] >1 darkens the surface (e.g. black objects)
 * @param {string} [o.tint] paper colour for this surface (e.g. red plane)
 */
export function makeEngrave({ angle = 0.55, tone = 1, tint = PAPER } = {}) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    uniforms: {
      ...sharedUniforms,
      uAngle: { value: angle },
      uTone: { value: tone },
      uTint: { value: hexToVec3(tint) },
    },
  });
}
