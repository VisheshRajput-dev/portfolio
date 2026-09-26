import * as THREE from "three";

/** "#rrggbb" → raw sRGB Vector3 for shaders that write straight to the canvas. */
export function hexToVec3(hex) {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}
