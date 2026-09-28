import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { hexToVec3 } from "./color";

/**
 * The portrait as a line engraving. Horizontal burin lines bend with the
 * image's tone and swell where it is dark; the deepest shadows pick up a
 * cross-hatch. `reveal` draws the lines in, and the cursor is a loupe that
 * shows the photograph underneath.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uReveal;
  uniform float uLines;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uLens;
  uniform float uAspect;
  uniform vec3 uInk;
  uniform vec3 uPaper;
  uniform float uPhoto;

  float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  // One family of engraved lines. Returns ink coverage 0..1.
  float engrave(float coord, float weight) {
    float d = abs(fract(coord) - 0.5) * 2.0;          // 0 on the line, 1 between
    float aa = fwidth(coord) * 1.6;
    return 1.0 - smoothstep(weight - aa, weight + aa, d);
  }

  void main() {
    vec4 tex = texture2D(uTex, vUv);
    if (tex.a < 0.02) discard;

    // Lift the midtones so faces keep their features under the lines.
    float tone = smoothstep(0.02, 0.78, pow(luma(tex.rgb), 0.72));
    float dark = 1.0 - tone;

    // Main burin lines: bent by tone so they follow the form.
    float coord = vUv.y * uLines + tone * 1.35 + sin(vUv.x * 9.0 + vUv.y * 4.0) * 0.18;
    float weight = clamp(dark * 1.02, 0.035, 0.97);
    float ink = engrave(coord, weight);

    // Cross-hatch only in the deep shadows.
    vec2 r = vec2(vUv.x * uAspect, vUv.y);
    float cross = (r.x * 0.82 + r.y * 0.57) * uLines * 0.9;
    ink = max(ink, engrave(cross, clamp((dark - 0.62) * 1.9, 0.0, 0.8)));

    // Lines draw in left to right, each with its own delay.
    float lineId = floor(coord);
    float delay = hash(lineId) * 0.35;
    float drawn = smoothstep(0.0, 0.04, uReveal * 1.45 - delay - vUv.x);

    // Loupe: the photograph shows through around the cursor.
    vec2 m = vec2((vUv.x - uMouse.x) * uAspect, vUv.y - uMouse.y);
    float dist = length(m);
    float radius = 0.16 * uLens;
    float lens = 1.0 - smoothstep(radius - 0.004, radius, dist);
    float ring = smoothstep(radius - 0.006, radius - 0.002, dist) * lens;

    vec3 engraved = mix(uPaper, uInk, ink * drawn);
    vec3 photo = vec3(luma(tex.rgb));
    photo = mix(photo, tex.rgb, 0.35);
    // Scroll: the photo develops through the plate, line by line from the top.
    float develop = smoothstep(0.0, 0.1, uPhoto * 1.6 - hash(lineId + 3.0) * 0.2 - (1.0 - vUv.y) * 1.15);
    vec3 col = mix(engraved, photo, max(lens, develop));
    col = mix(col, uInk, ring);

    gl_FragColor = vec4(col, tex.a * smoothstep(0.0, 0.08, uReveal));
  }
`;

function Plane({ src, state }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const { viewport, size, gl } = useThree();
  const mat = useRef(null);
  const aspect = tex.image ? tex.image.width / tex.image.height : 1;

  // Colours stay in raw sRGB end to end: the texture is not decoded and the
  // shader writes straight to the canvas, so ivory matches the page exactly.
  useEffect(() => {
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
  }, [tex, gl]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uReveal: { value: 0 },
      uLines: { value: 120 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uLens: { value: 0 },
      uAspect: { value: aspect },
      uInk: { value: hexToVec3("#0e0d0c") },
      uPaper: { value: hexToVec3("#eeeae2") },
      uPhoto: { value: 0 },
    }),
    [tex, aspect]
  );

  // Fit the plane inside the canvas, anchored to the bottom.
  const planeH = Math.min(viewport.height, viewport.width / aspect);
  const planeW = planeH * aspect;

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += dt;
    u.uReveal.value = state.current.reveal;
    u.uPhoto.value = state.current.photo;
    // Line density follows the rendered height so strokes stay ~3.5px apart.
    u.uLines.value = Math.max(70, (size.height * (planeH / viewport.height)) / 3.6);
    u.uMouse.value.lerp(state.current.mouse, 1 - Math.pow(0.0008, dt));
    u.uLens.value += (state.current.lens - u.uLens.value) * (1 - Math.pow(0.002, dt));
  });

  return (
    <mesh position={[0, -viewport.height / 2 + planeH / 2, 0]}>
      <planeGeometry args={[planeW, planeH]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
      />
    </mesh>
  );
}

/**
 * `state` is a ref shared with the parent: { reveal, mouse: Vector2, lens }.
 * The parent animates reveal with GSAP and feeds pointer data in.
 */
export default function EngravedPortrait({ src, state, className }) {
  return (
    <div className={className}>
      <Canvas
        orthographic={false}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
        camera={{ position: [0, 0, 5], fov: 30 }}
        style={{ pointerEvents: "none" }}
      >
        <Plane src={src} state={state} />
      </Canvas>
    </div>
  );
}

export const createPortraitState = () => ({
  reveal: 0,
  photo: 0,
  lens: 0,
  mouse: new THREE.Vector2(0.5, 0.6),
});
