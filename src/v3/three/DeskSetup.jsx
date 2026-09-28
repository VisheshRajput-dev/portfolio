import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Billboard, ContactShadows, Environment, Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { createLaptopScreen, createMarkTexture, createPhoneScreen } from "./screens";
import { person } from "../data";

/**
 * A late-evening desk, shot like a luxury product film. A closed laptop and
 * a phone lie on smoked walnut and black leather under a warm lamp. As the
 * section scrolls: the phone lights up with a new project request, the lid
 * opens and the screen's glow spills onto the desk, then the camera pushes
 * into the display, where this page gets made (screens.js paints both
 * screens straight onto the 3D glass).
 *
 * `beats` is a ref shared with the section: { p, notify, open, power, story }.
 */

const TEX = "/process/tex/";
const L = { w: 3.1, d: 2.16, t: 0.08, lidT: 0.045, dispW: 2.86, dispH: 1.7875, openDeg: 108 };
const PAD = 0.024;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep01 = (v) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// How much of the frame the display fills at the end of the push-in.
const FILL = 0.66;

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */

function useMaps(name, repeat) {
  const [map, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
    `${TEX}${name}_diff.jpg`,
    `${TEX}${name}_nor.jpg`,
    `${TEX}${name}_rough.jpg`,
  ]);
  const { gl } = useThree();
  useLayoutEffect(() => {
    [map, normalMap, roughnessMap].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat[0], repeat[1]);
      t.anisotropy = gl.capabilities.getMaxAnisotropy();
      t.needsUpdate = true;
    });
    map.colorSpace = THREE.SRGBColorSpace;
  }, [map, normalMap, roughnessMap, gl, repeat]);
  return { map, normalMap, roughnessMap };
}

/**
 * A thin slab with big rounded corners in plan and a small bevel on its
 * edges (a laptop deck, a lid, a phone). Centred; thickness along +z,
 * starting at z = 0. RoundedBox can't do this: its one radius is capped by
 * the thinnest side.
 */
function slab(w, h, t, r, bevel) {
  const x = w / 2 - bevel, y = h / 2 - bevel, rr = Math.max(0.001, r - bevel);
  const s = new THREE.Shape();
  s.moveTo(-x + rr, -y);
  s.lineTo(x - rr, -y);
  s.quadraticCurveTo(x, -y, x, -y + rr);
  s.lineTo(x, y - rr);
  s.quadraticCurveTo(x, y, x - rr, y);
  s.lineTo(-x + rr, y);
  s.quadraticCurveTo(-x, y, -x, y - rr);
  s.lineTo(-x, -y + rr);
  s.quadraticCurveTo(-x, -y, -x + rr, -y);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: t - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 5,
    curveSegments: 16,
  });
  g.translate(0, 0, bevel);
  g.computeVertexNormals();
  return g;
}

const metal = (color, rough = 0.3) =>
  new THREE.MeshPhysicalMaterial({ color, metalness: 0.92, roughness: rough, clearcoat: 0.15, clearcoatRoughness: 0.35 });

/* ------------------------------------------------------------------ */
/* Desk                                                                 */
/* ------------------------------------------------------------------ */

const WOOD_REPEAT = [3, 1.5];
const LEATHER_REPEAT = [3, 1.6];

function Desk() {
  const wood = useMaps("walnut", WOOD_REPEAT);
  const leather = useMaps("leather", LEATHER_REPEAT);
  const stitch = useMemo(() => {
    const w = 6.6 / 2 - 0.14, d = 3.5 / 2 - 0.14;
    return [[-w, 0, -d], [w, 0, -d], [w, 0, d], [-w, 0, d], [-w, 0, -d]];
  }, []);
  return (
    <group>
      {/* Walnut top with a soft front edge. */}
      <RoundedBox args={[16, 0.34, 8]} radius={0.06} smoothness={4} position={[0, -0.17, -0.6]} receiveShadow>
        <meshPhysicalMaterial {...wood} color="#b89a82" roughness={0.55} clearcoat={0.35} clearcoatRoughness={0.3} />
      </RoundedBox>
      {/* Black leather desk pad with a stitched border. */}
      <group position={[-0.3, 0, 0.55]}>
        <RoundedBox args={[6.6, PAD, 3.5]} radius={PAD / 2} smoothness={2} position={[0, PAD / 2, 0]} receiveShadow castShadow>
          <meshStandardMaterial {...leather} color="#26211e" roughness={0.7} normalScale={[0.6, 0.6]} />
        </RoundedBox>
        <Line points={stitch} position={[0, PAD + 0.002, 0]} color="#8c7a68" lineWidth={1} dashed dashSize={0.045} gapSize={0.035} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Laptop                                                               */
/* ------------------------------------------------------------------ */

function Keys() {
  const ref = useRef(null);
  const layout = useMemo(() => {
    const keys = [];
    const kw = 0.168, gap = 0.03, cols = 14;
    const totalW = cols * kw + (cols - 1) * gap;
    for (let r = 0; r < 6; r++) {
      if (r === 5) {
        let x = -totalW / 2;
        [1, 1, 1, 1.25, 5.3, 1.25, 1, 1].forEach((u) => {
          const w = kw * u + gap * (u - 1);
          keys.push([x + w / 2, r, w, kw]);
          x += w + gap;
        });
        continue;
      }
      for (let c = 0; c < cols; c++) keys.push([-totalW / 2 + kw / 2 + c * (kw + gap), r, kw, r === 0 ? 0.09 : kw]);
    }
    return keys;
  }, []);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    layout.forEach(([x, r, w, h], i) => {
      m.compose(new THREE.Vector3(x, 0, -0.66 + r * 0.2 - (r === 0 ? 0.04 : 0)), new THREE.Quaternion(), new THREE.Vector3(w, 1, h));
      ref.current.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [layout]);
  return (
    <instancedMesh ref={ref} args={[null, null, layout.length]} position={[0, L.t + 0.008, 0]} castShadow frustumCulled={false}>
      <boxGeometry args={[1, 0.016, 1]} />
      <meshPhysicalMaterial color="#0d0d0f" roughness={0.45} clearcoat={0.3} />
    </instancedMesh>
  );
}

function Laptop({ beats, screen }) {
  const lid = useRef(null);
  const glow = useRef(null);
  const body = useMemo(() => metal("#3a3b3f", 0.38), []);
  const geo = useMemo(() => {
    // Deck lies flat (thickness up); lid stands in its own plane.
    const deck = slab(L.w, L.d, L.t, 0.12, 0.018);
    deck.rotateX(-Math.PI / 2);
    const lid = slab(L.w, L.d - 0.02, L.lidT, 0.12, 0.012);
    lid.translate(0, (L.d - 0.02) / 2, -L.lidT);
    return { deck, lid };
  }, []);
  const { gl } = useThree();
  const screenTex = useMemo(() => createLaptopScreen(gl), [gl]);
  const content = useRef(null);
  const [mark, setMark] = useState(null);
  useEffect(() => {
    let alive = true;
    createMarkTexture().then((t) => alive && setMark(t));
    return () => {
      alive = false;
      screenTex.dispose();
    };
  }, [screenTex]);
  const closed = Math.PI / 2 + 0.012;
  const open = -THREE.MathUtils.degToRad(L.openDeg - 90);

  useFrame(() => {
    const b = beats.current;
    if (lid.current) lid.current.rotation.x = THREE.MathUtils.lerp(closed, open, b.open);
    if (glow.current) glow.current.intensity = b.power * 4.5;
    // The display: painted only while it's on, dimmed with the power.
    if (content.current) {
      const on = b.power * b.power * (3 - 2 * b.power);
      content.current.visible = on > 0.001;
      content.current.material.color.setScalar(on);
      if (on > 0.001) screenTex.draw(b.story);
    }
  });

  return (
    <group position={[0, PAD, 0.25]} rotation={[0, -0.06, 0]}>
      <mesh geometry={geo.deck} material={body} castShadow receiveShadow />
      {/* Keyboard well, speaker grilles, trackpad */}
      <mesh position={[0, L.t + 0.001, -0.16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.84, 1.24]} />
        <meshStandardMaterial color="#141417" roughness={0.8} />
      </mesh>
      {[-1, 1].map((k) => (
        <mesh key={k} position={[k * 1.47, L.t + 0.001, -0.16]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.07, 1.24]} />
          <meshStandardMaterial color="#1a1a1d" roughness={0.9} />
        </mesh>
      ))}
      <Keys />
      <RoundedBox args={[1.3, 0.004, 0.8]} radius={0.002} smoothness={2} position={[0, L.t + 0.001, 0.62]}>
        <meshPhysicalMaterial color="#2f3034" metalness={0.6} roughness={0.2} clearcoat={0.8} />
      </RoundedBox>

      {/* Lid, hinged at the back edge; it opens with the story. */}
      <group ref={lid} position={[0, L.t, -L.d / 2 + 0.02]} rotation={[closed, 0, 0]}>
        <mesh geometry={geo.lid} material={body} castShadow />
        {/* A polished VR® mark on the back of the lid. */}
        {mark && (
          <mesh position={[0, (L.d - 0.02) / 2, -L.lidT - 0.0008]} rotation={[0, Math.PI, Math.PI]}>
            <planeGeometry args={[0.44, 0.22]} />
            <meshPhysicalMaterial color="#a4a5aa" metalness={1} roughness={0.14} clearcoat={1} alphaMap={mark} transparent />
          </mesh>
        )}
        <mesh position={[0, (L.d - 0.02) / 2, 0.0015]}>
          <planeGeometry args={[L.w - 0.07, L.d - 0.09]} />
          <meshPhysicalMaterial color="#050506" roughness={0.06} clearcoat={1} clearcoatRoughness={0.04} />
        </mesh>
        <mesh position={[0, L.d - 0.085, 0.003]}>
          <planeGeometry args={[0.36, 0.05]} />
          <meshBasicMaterial color="#050506" />
        </mesh>
        <group ref={screen} position={[0, (L.d - 0.02) / 2 - 0.03, 0.004]}>
          <mesh ref={content} visible={false}>
            <planeGeometry args={[L.dispW, L.dispH]} />
            <meshBasicMaterial map={screenTex.texture} toneMapped={false} color="#000" />
          </mesh>
          {/* The display lights the desk once it wakes. */}
          <pointLight ref={glow} position={[0, 0, 0.9]} color="#f2eee6" intensity={0} distance={6} decay={2} />
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Phone                                                                */
/* ------------------------------------------------------------------ */

const PHONE = { w: 0.78, l: 1.6, t: 0.064, dispW: 0.72 };

function Phone({ beats }) {
  const glow = useRef(null);
  const body = useRef(null);
  const titanium = useMemo(() => metal("#8b8781", 0.24), []);
  const geo = useMemo(() => {
    const g = slab(PHONE.w, PHONE.l, PHONE.t, 0.115, 0.012);
    g.rotateX(-Math.PI / 2);
    const glass = slab(PHONE.w - 0.028, PHONE.l - 0.028, 0.006, 0.1, 0.002);
    glass.rotateX(-Math.PI / 2);
    return { body: g, glass };
  }, []);
  const { gl } = useThree();
  const lock = useMemo(() => createPhoneScreen(gl, person.timezone), [gl]);
  useEffect(() => () => lock.dispose(), [lock]);
  // One timed buzz each time the message arrives — never tied to scroll.
  const buzz = useRef({ armed: true, start: -1 });
  useFrame((state) => {
    const n = beats.current.notify;
    const t = state.clock.elapsedTime;
    if (glow.current) glow.current.intensity = n * 1.6;
    lock.draw(n);
    const bz = buzz.current;
    if (bz.armed && n > 0.5) {
      bz.armed = false;
      bz.start = t;
    }
    if (n < 0.15) bz.armed = true;
    if (body.current) {
      const k = bz.start < 0 ? 0 : clamp01(1 - (t - bz.start) / 0.5);
      const amp = k * k;
      body.current.rotation.y = -0.32 + Math.sin(t * 90) * 0.01 * amp;
      body.current.position.x = 3.95 + Math.sin(t * 75 + 1) * 0.004 * amp;
    }
  });
  return (
    <group ref={body} position={[3.95, 0, 1.05]} rotation={[0, -0.32, 0]}>
      <mesh geometry={geo.body} material={titanium} castShadow receiveShadow />
      {/* Glass front, slightly inset from the titanium band */}
      <mesh geometry={geo.glass} position={[0, PHONE.t - 0.004, 0]}>
        <meshPhysicalMaterial color="#040405" roughness={0.05} clearcoat={1} clearcoatRoughness={0.03} />
      </mesh>
      {/* The lock screen, painted onto the glass. */}
      <mesh position={[0, PHONE.t + 0.0035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PHONE.w - 0.046, (PHONE.w - 0.046) * (834 / 390)]} />
        <meshBasicMaterial map={lock.texture} toneMapped={false} transparent />
      </mesh>
      <pointLight ref={glow} position={[0, 0.5, 0]} color="#dfe6f2" intensity={0} distance={2.5} decay={2} />
    </group>
  );
}

function Earbuds() {
  return (
    <group position={[4.7, 0, -0.35]} rotation={[0, 0.5, 0]}>
      <RoundedBox args={[0.52, 0.22, 0.4]} radius={0.1} smoothness={8} position={[0, 0.11, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#f4f2ee" roughness={0.18} clearcoat={1} clearcoatRoughness={0.08} />
      </RoundedBox>
      <mesh position={[0, 0.16, 0.201]}>
        <planeGeometry args={[0.5, 0.004]} />
        <meshBasicMaterial color="#b9b5ad" />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Objects                                                              */
/* ------------------------------------------------------------------ */

const steamVertex = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const steamFragment = /* glsl */ `
  varying vec2 vUv; uniform float uTime;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
  void main(){
    vec2 uv = vUv;
    float t = uTime * 0.35;
    float x = uv.x - 0.5 + (n(vec2(uv.y * 3.0 - t, 1.3)) - 0.5) * 0.45 * uv.y;
    float wisp = n(vec2(x * 7.0, uv.y * 3.0 - t * 2.0)) * n(vec2(x * 3.0 + 4.0, uv.y * 1.6 - t));
    float a = smoothstep(0.18, 0.55, wisp) * smoothstep(0.5, 0.05, abs(x)) * smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.45, uv.y);
    gl_FragColor = vec4(vec3(0.95), a * 0.22);
  }`;

function Mug() {
  const steam = useRef(null);
  const geo = useMemo(() => {
    const p = [new THREE.Vector2(0, 0), new THREE.Vector2(0.28, 0), new THREE.Vector2(0.3, 0.02)];
    for (let i = 1; i <= 12; i++) p.push(new THREE.Vector2(0.305 + i * 0.002, 0.02 + i * 0.047));
    p.push(new THREE.Vector2(0.33, 0.6), new THREE.Vector2(0.3, 0.6), new THREE.Vector2(0.285, 0.08), new THREE.Vector2(0, 0.08));
    return new THREE.LatheGeometry(p, 72);
  }, []);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
  });
  return (
    <group position={[-4.35, 0, -0.35]} rotation={[0, 2.4, 0]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshPhysicalMaterial color="#efebe4" roughness={0.22} clearcoat={1} clearcoatRoughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.29, 48]} />
        <meshPhysicalMaterial color="#1f130c" roughness={0.08} clearcoat={1} />
      </mesh>
      <mesh position={[0.34, 0.31, 0]} castShadow>
        <torusGeometry args={[0.14, 0.032, 16, 40, Math.PI * 1.1]} />
        <meshPhysicalMaterial color="#efebe4" roughness={0.22} clearcoat={1} />
      </mesh>
      <Billboard position={[0, 1.15, 0]}>
        <mesh ref={steam}>
          <planeGeometry args={[0.7, 1.2]} />
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={steamVertex}
            fragmentShader={steamFragment}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

function Notebook() {
  const pencil = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const x = Math.cos(a) * 0.034, y = Math.sin(a) * 0.034;
      i ? shape.lineTo(x, y) : shape.moveTo(x, y);
    }
    return new THREE.ExtrudeGeometry(shape, { depth: 1.45, bevelEnabled: false });
  }, []);
  return (
    <group position={[-2.35, PAD, 0.95]} rotation={[0, 0.22, 0]}>
      <RoundedBox args={[1.3, 0.09, 1.85]} radius={0.035} smoothness={4} position={[0, 0.045, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#141416" roughness={0.6} sheen={0.4} sheenColor="#444" />
      </RoundedBox>
      <mesh position={[0.48, 0.092, 0]}>
        <boxGeometry args={[0.03, 0.004, 1.87]} />
        <meshStandardMaterial color="#0a0a0b" roughness={0.4} />
      </mesh>
      <group position={[-0.08, 0.128, -0.72]} rotation={[0, 0.16, 0]}>
        <mesh geometry={pencil} rotation={[0, 0, Math.PI / 6]} castShadow>
          <meshPhysicalMaterial color="#d2372c" roughness={0.3} clearcoat={0.9} />
        </mesh>
        <mesh position={[0, 0, 1.53]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.034, 0.15, 6]} />
          <meshStandardMaterial color="#d9c3a0" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 1.595]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.011, 0.038, 12]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function Lamp() {
  const black = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0f0f11", roughness: 0.42, metalness: 0.5 }), []);
  const brass = useMemo(() => metal("#b08d57", 0.28), []);
  const rod = (a, b, r = 0.022) => {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
    return {
      position: va.clone().lerp(vb, 0.5).toArray(),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize()).toArray(),
      args: [r, r, va.distanceTo(vb), 16],
    };
  };
  const pole = rod([0, 0.06, 0], [0, 2.7, 0]);
  const arm = rod([0, 2.7, 0], [1.7, 2.45, 0], 0.018);
  const spot = useRef(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    if (spot.current) spot.current.target = target;
  }, [target]);
  return (
    <group position={[-3.7, 0, -2.1]} rotation={[0, -0.55, 0]}>
      <mesh position={[0, 0.03, 0]} material={black} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.45, 0.06, 64]} />
      </mesh>
      <mesh position={pole.position} quaternion={pole.quaternion} material={black} castShadow>
        <cylinderGeometry args={pole.args} />
      </mesh>
      <mesh position={[0, 2.7, 0]} material={brass} castShadow>
        <sphereGeometry args={[0.05, 20, 14]} />
      </mesh>
      <mesh position={arm.position} quaternion={arm.quaternion} material={black} castShadow>
        <cylinderGeometry args={arm.args} />
      </mesh>
      <group position={[1.77, 2.26, 0]} rotation={[0, 0, 0.2]}>
        <mesh material={black} castShadow>
          <cylinderGeometry args={[0.07, 0.32, 0.44, 64, 1, true]} />
        </mesh>
        <mesh position={[0, 0.23, 0]} material={brass}>
          <cylinderGeometry args={[0.075, 0.075, 0.04, 32]} />
        </mesh>
        <mesh position={[0, -0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.29, 40]} />
          <meshBasicMaterial color="#fff1d6" side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>
      <primitive object={target} position={[2.3, 0, 0.6]} />
      <spotLight
        ref={spot}
        position={[1.8, 2.0, 0]}
        angle={0.85}
        penumbra={0.9}
        intensity={38}
        decay={2}
        distance={10}
        color="#ffdcae"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
      />
    </group>
  );
}

function Vase() {
  const vase = useMemo(() => {
    // A stoneware bottle: a wide foot, a round belly, a narrow neck.
    const p = [new THREE.Vector2(0, 0), new THREE.Vector2(0.24, 0)];
    for (let i = 1; i <= 28; i++) {
      const t = i / 28;
      const belly = Math.sin(Math.min(1, t / 0.72) * Math.PI) * 0.1;
      const neck = t > 0.72 ? 0.2 * smoothstep01((t - 0.72) / 0.18) : 0;
      p.push(new THREE.Vector2(Math.max(0.055, 0.24 + belly - neck), t * 0.95));
    }
    p.push(new THREE.Vector2(0.045, 0.95));
    return new THREE.LatheGeometry(p, 64);
  }, []);
  const stems = useMemo(
    () =>
      [[-0.3, 0.2, 2.1], [0.25, -0.1, 2.5], [0.05, 0.3, 1.8], [-0.12, -0.25, 2.3], [0.35, 0.15, 1.6]].map(([dx, dz, h]) =>
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.85, 0),
            new THREE.Vector3(dx * 0.4, 0.85 + h * 0.45, dz * 0.4),
            new THREE.Vector3(dx, 0.85 + h, dz),
          ]),
          24,
          0.011,
          6
        )
      ),
    []
  );
  return (
    <group position={[4.9, 0, -2.3]}>
      <mesh geometry={vase} castShadow receiveShadow>
        <meshPhysicalMaterial color="#d6cfc3" roughness={0.7} clearcoat={0.2} />
      </mesh>
      {stems.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          <meshStandardMaterial color="#b9a88d" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Camera                                                               */
/* ------------------------------------------------------------------ */

const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Keyframes along the section: [progress, camera, look-at]. The close-up
// is computed each frame from the display so it's always square on.
const SHOTS = [
  [0.0, V(-1.6, 5.2, 11.5), V(0.4, 0.1, 0.2)],
  [0.12, V(-0.4, 4.0, 9.2), V(0.9, 0.2, 0.4)],
  [0.22, V(5.0, 2.7, 3.7), V(3.95, 0.05, 1.0)],
  [0.31, V(4.75, 2.45, 3.3), V(3.95, 0.05, 1.0)],
  // Three-quarter on the laptop; it holds while the lid comes up.
  [0.38, V(-3.3, 2.7, 6.8), V(0.1, 0.5, -0.1)],
  [0.47, V(-2.4, 2.3, 6.1), V(0.05, 0.75, -0.2)],
];
const CLOSE_AT = 0.64;

function Rig({ beats, screen }) {
  const { camera, size } = useThree();
  const t = useMemo(
    () => ({
      p: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      n: new THREE.Vector3(),
      up: new THREE.Vector3(),
      end: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      mouse: new THREE.Vector2(),
    }),
    []
  );
  const smooth = useRef(0);

  useFrame((state, dt) => {
    const s = screen.current;
    if (!s) return;
    smooth.current += (beats.current.p - smooth.current) * (1 - Math.exp(-dt * 5));
    const p = smooth.current;
    t.mouse.lerp(state.pointer, 1 - Math.exp(-dt * 2.5));

    s.getWorldPosition(t.p);
    s.getWorldQuaternion(t.q);
    t.n.set(0, 0, 1).applyQuaternion(t.q);
    t.up.set(0, 1, 0).applyQuaternion(t.q);

    const aspect = size.width / size.height;
    const narrow = aspect < 0.9;
    const half = THREE.MathUtils.degToRad(camera.fov / 2);
    const fill = narrow ? 0.94 : FILL;
    const dist = Math.max(L.dispH / 2 / Math.tan(half), L.dispW / 2 / (Math.tan(half) * aspect)) / fill;
    t.end.copy(t.p).addScaledVector(t.n, dist);

    const keys = [...SHOTS, [CLOSE_AT, t.end, t.p], [1, t.end, t.p]];
    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
    const [p0, c0, l0] = keys[i];
    const [p1, c1, l1] = keys[i + 1];
    const u = ease(clamp01((p - p0) / (p1 - p0 || 1)));
    t.pos.copy(c0).lerp(c1, u);
    t.look.copy(l0).lerp(l1, u);

    // On a phone, wide shots pull back so the desk still fits.
    const close = ease(clamp01((p - 0.47) / (CLOSE_AT - 0.47)));
    if (narrow) {
      const back = 1 + 0.55 * (1 - close);
      t.pos.sub(t.look).multiplyScalar(back).add(t.look);
    }

    // A gentle hand-held drift until we're on the screen.
    t.pos.x += t.mouse.x * 0.3 * (1 - close);
    t.pos.y += t.mouse.y * 0.15 * (1 - close);

    camera.position.copy(t.pos);
    camera.up.set(0, 1, 0).lerp(t.up, close).normalize();
    camera.lookAt(t.look);
  });
  return null;
}

/* ------------------------------------------------------------------ */

export default function DeskSetup({ beats, active = true }) {
  const screen = useRef(null);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [-1.6, 5.2, 11.5], fov: 30, near: 0.05, far: 80 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
    >
      <color attach="background" args={["#0c0b0a"]} />
      <fog attach="fog" args={["#0c0b0a", 16, 34]} />
      <Environment files={`${TEX}studio.hdr`} environmentIntensity={0.42} />
      <ambientLight intensity={0.06} />
      {/* Cool rim from behind the desk, for silhouettes. */}
      <directionalLight position={[4, 6, -8]} intensity={0.9} color="#c9d4e6" />
      {/* Soft key from the upper left. */}
      <directionalLight
        position={[-6, 9, 5]}
        intensity={0.55}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      <Desk />
      <Laptop beats={beats} screen={screen} />
      <Phone beats={beats} />
      <Earbuds />
      <Mug />
      <Notebook />
      <Lamp />
      <Vase />
      <ContactShadows position={[0, 0.002, 0]} scale={18} blur={1.6} far={1.6} opacity={0.75} resolution={1024} color="#000" />

      <Rig beats={beats} screen={screen} />
    </Canvas>
  );
}
