import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import { createCardTextures, createStrapTexture } from "./badgeTextures";

extend({ MeshLineGeometry, MeshLineMaterial });

// meshline finds a strap end by comparing projected points exactly; rounding
// makes that miss, so the end vertex took a random direction and the strap's
// tip twisted into a point. Compare with a tolerance instead.
const fixStrapEnds = (shader) => {
  shader.vertexShader = shader.vertexShader
    .replace("if (nextP == currentP)", "if (distance(nextP, currentP) < 1e-5)")
    .replace("else if (prevP == currentP)", "else if (distance(prevP, currentP) < 1e-5)");
};

const CARD_W = 1.6;
const CARD_H = 2.25;

/** A rounded-rectangle face with 0..1 UVs across its bounds. */
function cardFace() {
  const r = 0.09;
  const w = CARD_W;
  const h = CARD_H;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const face = new THREE.ShapeGeometry(s, 8);
  const pos = face.attributes.position;
  const uv = face.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  const edge = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: false, curveSegments: 8 });
  edge.translate(0, 0, -0.01);
  return { face, edge };
}

function Badge({ textures, strap, paused }) {
  const band = useRef(null);
  const fixed = useRef(null);
  const j1 = useRef(null);
  const j2 = useRef(null);
  const j3 = useRef(null);
  const card = useRef(null);
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const { width, height } = useThree((s) => s.size);
  const geo = useMemo(cardFace, []);
  const clip = useMemo(() => new THREE.BoxGeometry(0.42, 0.18, 0.06), []);

  const v = useMemo(
    () => ({
      vec: new THREE.Vector3(),
      ang: new THREE.Vector3(),
      rot: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      clip: new THREE.Vector3(),
      quat: new THREE.Quaternion(),
    }),
    []
  );
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  curve.curveType = "chordal";

  const segment = { type: "dynamic", canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, CARD_H / 2 + 0.3, 0]]);

  useEffect(() => {
    if (!hovered) return undefined;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (paused) return;
    const { vec, ang, rot, dir } = v;
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (!fixed.current) return;
    // Ease the rope's inner points so the strap doesn't jitter.
    [j1, j2].forEach((r) => {
      if (!r.current.lerped) r.current.lerped = new THREE.Vector3().copy(r.current.translation());
      const d = Math.max(0.1, Math.min(1, r.current.lerped.distanceTo(r.current.translation())));
      r.current.lerped.lerp(r.current.translation(), delta * (10 + d * 40));
    });
    // The strap ends inside the clip (which is drawn over it), following the
    // card's tilt, so its end never shows as a folded, pointed tip.
    const q = card.current.rotation();
    v.clip.set(0, CARD_H / 2 + 0.02, 0).applyQuaternion(v.quat.set(q.x, q.y, q.z, q.w)).add(card.current.translation());
    curve.points[0].copy(v.clip);
    curve.points[1].copy(j3.current.translation());
    curve.points[2].copy(j2.current.lerped);
    curve.points[3].copy(j1.current.lerped);
    curve.points[4].copy(fixed.current.translation());
    // Drop points that bunch up; a near-zero step makes a spike in the band.
    const pts = curve.getPoints(40).filter((p, i, a) => i === 0 || p.distanceToSquared(a[i - 1]) > 1e-5);
    band.current.geometry.setPoints(pts);
    // Keep it facing forward: damp spin around the vertical axis.
    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
  });

  return (
    <>
      <group position={[0, 4.2, 0]}>
        <RigidBody ref={fixed} {...segment} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segment} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.01]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(v.vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={geo.edge}>
              <meshStandardMaterial color="#0e0d0c" roughness={0.6} />
            </mesh>
            <mesh geometry={geo.face} position={[0, 0, 0.011]}>
              <meshStandardMaterial map={textures.front} roughness={0.55} metalness={0} />
            </mesh>
            <mesh geometry={geo.face} position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
              <meshStandardMaterial map={textures.back} roughness={0.7} />
            </mesh>
            <mesh geometry={clip} position={[0, CARD_H / 2 + 0.02, 0]} renderOrder={2}>
              <meshStandardMaterial color="#b9b4aa" metalness={0.9} roughness={0.28} depthTest={false} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} renderOrder={1}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={strap}
          repeat={[-4, 1]}
          lineWidth={0.95}
          onBeforeCompile={fixStrapEnds}
        />
      </mesh>
    </>
  );
}

export default function Lanyard({ active, person }) {
  const [textures, setTextures] = useState(null);
  const strap = useMemo(createStrapTexture, []);

  useEffect(() => {
    let alive = true;
    createCardTextures(person).then((t) => alive && setTextures(t));
    return () => {
      alive = false;
    };
  }, [person]);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 13], fov: 25 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[-4, 6, 8]} intensity={2.2} />
      <directionalLight position={[6, -2, 4]} intensity={0.6} />
      {textures && (
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!active}>
          <Badge textures={textures} strap={strap} paused={!active} />
        </Physics>
      )}
    </Canvas>
  );
}
