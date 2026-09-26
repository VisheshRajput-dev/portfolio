import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { makeEngrave, sharedUniforms } from "./engraveMaterial";
import { hexToVec3 } from "./color";
import { createScreen } from "./screenTexture";

/* ------------------------------------------------------------------ */
/* Materials                                                            */
/* ------------------------------------------------------------------ */

// Silhouette lines: the same mesh pushed out along its normals and drawn
// back-faces only. Grey pencil while sketching, ink once the plate is inked.
const outlineVertex = /* glsl */ `
  uniform float uWidth;
  void main() {
    vec3 p = position + normal * uWidth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const outlineFragment = /* glsl */ `
  uniform float uInk;
  uniform vec3 uInkColor;
  uniform vec3 uPencil;
  void main() {
    gl_FragColor = vec4(mix(uPencil, uInkColor, smoothstep(0.0, 1.0, uInk)), 1.0);
  }
`;

function makeOutline(width = 0.018) {
  return new THREE.ShaderMaterial({
    vertexShader: outlineVertex,
    fragmentShader: outlineFragment,
    side: THREE.BackSide,
    uniforms: {
      uInk: sharedUniforms.uInk,
      uInkColor: sharedUniforms.uInkColor,
      uPencil: { value: hexToVec3("#8d887f") },
      uWidth: { value: width },
    },
  });
}

/** A mesh drawn as an engraving with an inked silhouette. */
function Inked({ geometry, angle, tone, tint, outline = 0.018, ...props }) {
  const fill = useMemo(() => makeEngrave({ angle, tone, tint }), [angle, tone, tint]);
  const line = useMemo(() => makeOutline(outline), [outline]);
  useEffect(() => () => { fill.dispose(); line.dispose(); }, [fill, line]);
  return (
    <group {...props}>
      <mesh geometry={geometry} material={fill} />
      <mesh geometry={geometry} material={line} />
    </group>
  );
}

const box = (w, h, d, r = 0.04, s = 4) => new RoundedBoxGeometry(w, h, d, s, r);

/* ------------------------------------------------------------------ */
/* Props on the desk                                                   */
/* ------------------------------------------------------------------ */

function Laptop({ screenMat }) {
  const g = useMemo(
    () => ({
      base: box(3.0, 0.12, 2.05, 0.05),
      keys: box(2.6, 0.02, 1.0, 0.01, 2),
      pad: box(0.95, 0.012, 0.56, 0.01, 2),
      lid: box(3.0, 2.0, 0.07, 0.05),
      screen: new THREE.PlaneGeometry(2.74, 1.71),
    }),
    []
  );
  return (
    <group position={[0.7, 0, -0.35]} rotation={[0, -0.22, 0]}>
      <Inked geometry={g.base} position={[0, 0.06, 0]} angle={0.5} />
      <Inked geometry={g.keys} position={[0, 0.125, -0.28]} angle={0.5} tone={1.5} outline={0.006} />
      <Inked geometry={g.pad} position={[0, 0.125, 0.58]} angle={0.5} tone={1.15} outline={0.006} />
      <group position={[0, 0.12, -1.0]} rotation={[-0.24, 0, 0]}>
        <Inked geometry={g.lid} position={[0, 1.0, 0]} angle={-0.6} tone={1.2} />
        <mesh geometry={g.screen} material={screenMat} position={[0, 1.02, 0.041]} />
      </group>
    </group>
  );
}

function Mug() {
  const g = useMemo(() => {
    const pts = [
      [0.0, 0.0], [0.4, 0.0], [0.45, 0.04], [0.47, 0.5], [0.48, 0.92], [0.44, 0.93], [0.43, 0.12], [0.0, 0.1],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const body = new THREE.LatheGeometry(pts, 48);
    const handle = new THREE.TorusGeometry(0.22, 0.055, 14, 32, Math.PI * 1.15);
    return { body, handle };
  }, []);
  return (
    <group position={[-2.55, 0, 0.5]} rotation={[0, 0.5, 0]}>
      <Inked geometry={g.body} angle={1.1} />
      <Inked geometry={g.handle} angle={1.1} position={[0.47, 0.47, 0]} rotation={[0, 0, -Math.PI * 0.57]} />
    </group>
  );
}

function Phone() {
  const g = useMemo(() => box(0.74, 0.07, 1.48, 0.07, 6), []);
  return <Inked geometry={g} position={[-1.25, 0.035, 1.45]} rotation={[0, 0.42, 0]} angle={-0.3} tone={1.9} />;
}

function Notebook() {
  const g = useMemo(
    () => ({
      book: box(1.7, 0.1, 2.2, 0.03),
      pencil: new THREE.CylinderGeometry(0.035, 0.035, 1.5, 6),
      tip: new THREE.ConeGeometry(0.035, 0.14, 6),
    }),
    []
  );
  return (
    <group position={[-2.3, 0, -1.25]} rotation={[0, 0.35, 0]}>
      <Inked geometry={g.book} position={[0, 0.05, 0]} angle={0.9} />
      <group position={[0.15, 0.14, 0.1]} rotation={[0, 0.6, Math.PI / 2]}>
        <Inked geometry={g.pencil} angle={0.2} tone={1.25} outline={0.01} />
        <Inked geometry={g.tip} position={[0, 0.82, 0]} angle={0.2} tone={1.6} outline={0.008} />
      </group>
    </group>
  );
}

function Books() {
  const g = useMemo(() => box(1.9, 0.28, 1.35, 0.03), []);
  return (
    <group position={[3.55, 0, -1.3]} rotation={[0, -0.35, 0]}>
      <Inked geometry={g} position={[0, 0.14, 0]} angle={0.3} tone={1.05} />
      <Inked geometry={g} position={[0.08, 0.42, 0.04]} rotation={[0, 0.12, 0]} angle={0.3} tone={1.45} />
      <Inked geometry={g} position={[-0.05, 0.7, -0.02]} rotation={[0, -0.08, 0]} angle={0.3} tone={1.0} />
    </group>
  );
}

function paperPlaneGeometry() {
  const N = [0, 0, -0.8], L = [-0.46, 0.06, 0.5], R = [0.46, 0.06, 0.5], K = [0, -0.2, 0.5], C = [0, 0.02, 0.5];
  const tris = [N, C, L, N, R, C, N, K, C];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(tris.flat(), 3));
  geo.computeVertexNormals();
  return geo;
}

// Rest on the desk, then take off towards the top right of the frame.
const FLIGHT = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.75, 0.22, 1.35),
  new THREE.Vector3(-0.35, 1.2, 1.9),
  new THREE.Vector3(1.0, 2.2, 1.7),
  new THREE.Vector3(2.8, 3.1, 0.6),
  new THREE.Vector3(6.5, 5.2, -2.5),
]);

function PaperPlane({ story }) {
  const ref = useRef(null);
  const geo = useMemo(paperPlaneGeometry, []);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const { stage, t } = story.current;
    const fly = stage === 3 ? THREE.MathUtils.smoothstep(t, 0.08, 1.0) : 0;
    const obj = ref.current;
    if (!obj) return;
    FLIGHT.getPointAt(Math.min(fly, 0.999), obj.position);
    if (fly > 0.001) {
      FLIGHT.getPointAt(Math.min(fly + 0.01, 1), ahead);
      obj.lookAt(ahead);
      obj.rotateY(Math.PI);
      obj.rotateZ(Math.sin(state.clock.elapsedTime * 3) * 0.12 - fly * 0.5);
    } else {
      obj.rotation.set(0, 0.7, 0);
    }
  });
  return (
    <group ref={ref}>
      <Inked geometry={geo} tint="#d2372c" tone={0.8} angle={1.2} outline={0.012} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Camera + story                                                      */
/* ------------------------------------------------------------------ */

const SHOTS = {
  pos: [
    [-6.4, 6.4, 8.6],
    [6.2, 3.8, 7.0],
    [2.2, 2.5, 4.6],
    [-3.8, 2.0, 6.4],
  ],
  look: [
    [0.3, 0.3, -0.2],
    [0.4, 0.7, -0.3],
    [0.75, 1.15, -1.0],
    [0.9, 1.8, -0.8],
  ],
};

function Story({ progress, screen }) {
  const { camera, size, gl } = useThree();
  const story = useRef({ stage: 0, t: 0 });
  const smooth = useRef(0);
  const pointer = useRef(new THREE.Vector2());
  const curves = useMemo(
    () => ({
      pos: new THREE.CatmullRomCurve3(SHOTS.pos.map((v) => new THREE.Vector3(...v)), false, "centripetal"),
      look: new THREE.CatmullRomCurve3(SHOTS.look.map((v) => new THREE.Vector3(...v)), false, "centripetal"),
    }),
    []
  );
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), l: new THREE.Vector3() }), []);
  const narrow = size.width < 800;
  const deskTop = useMemo(() => box(9.5, 0.26, 5.2, 0.06), []);

  const screenMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: screen.texture, toneMapped: false }),
    [screen]
  );

  useEffect(() => {
    sharedUniforms.uPixelRatio.value = gl.getPixelRatio();
    const onMove = (e) => pointer.current.set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  // Frame the desk right of centre on wide screens, leaving the left third
  // to the chapter copy.
  useEffect(() => {
    if (narrow) camera.clearViewOffset();
    else camera.setViewOffset(size.width, size.height, -size.width * 0.16, 0, size.width, size.height);
    camera.updateProjectionMatrix();
  }, [camera, size, narrow]);

  useFrame((state, dt) => {
    smooth.current += (progress.current - smooth.current) * (1 - Math.pow(0.0015, dt));
    const p = smooth.current;

    const stage = Math.min(3, Math.floor(p * 4));
    const t = p * 4 - stage;
    story.current.stage = stage;
    story.current.t = t;

    sharedUniforms.uInk.value = THREE.MathUtils.smoothstep(p, 0.1, 0.4);

    curves.pos.getPoint(p, tmp.p);
    curves.look.getPoint(p, tmp.l);
    if (narrow) tmp.p.multiplyScalar(1.28);
    tmp.p.x += pointer.current.x * 0.5;
    tmp.p.y -= pointer.current.y * 0.3;
    camera.position.copy(tmp.p);
    camera.lookAt(tmp.l);

    if (stage === 3) {
      if (screenMat.map !== screen.videoTexture) {
        screenMat.map = screen.videoTexture;
        screenMat.needsUpdate = true;
        screen.play();
      }
    } else {
      if (screenMat.map !== screen.texture) {
        screenMat.map = screen.texture;
        screenMat.needsUpdate = true;
        screen.pause();
      }
      screen.draw(stage, t, state.clock.elapsedTime);
    }
  });

  return (
    <group>
      <Inked geometry={deskTop} position={[0, -0.13, 0]} angle={0.12} tone={0.78} />
      <Laptop screenMat={screenMat} />
      <Mug />
      <Phone />
      <Notebook />
      <Books />
      <PaperPlane story={story} />
    </group>
  );
}

/**
 * @param {{ progress: React.MutableRefObject<number>, active: boolean, video: string }} props
 */
export default function DeskScene({ progress, active, video }) {
  const screen = useMemo(() => createScreen(video), [video]);
  useEffect(() => () => screen.dispose(), [screen]);
  useEffect(() => {
    if (!active) screen.pause();
  }, [active, screen]);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 30, near: 0.1, far: 80, position: SHOTS.pos[0] }}
    >
      <Story progress={progress} screen={screen} />
    </Canvas>
  );
}
