// Browser replay of the MuJoCo model (Excalibur V2.1 MJCF). The body tree, joint frames and
// meshes are baked from robot_mujoco_free.xml by scripts/prepare-meshes.mjs; here each body is a
// nested group (pos, quat, then a hinge about local z) exactly as MuJoCo composes them, so
// setting J1/J2 reproduces the paper's MuJoCo visualisation. Solid finger = motion-capture
// ground truth, translucent orange ghost = model prediction.
import { Canvas, useFrame } from "@react-three/fiber";
// Deep imports: the full drei barrel pre-bundles to a ~4 MB file in dev that antivirus
// (Norton) quarantines, which 504s the import and blanks the page.
import { ContactShadows } from "@react-three/drei/core/ContactShadows.js";
import { OrbitControls } from "@react-three/drei/core/OrbitControls.js";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { asset } from "../lib/data";

type Body = {
  parent: string | null;
  pos: number[];
  quat: number[]; // MuJoCo order: w x y z
  joint: { name: string; range: number[] } | null;
};
type Group = { body: string; material: string; positions: [number, number]; indices: [number, number] };
type Manifest = { bodies: Record<string, Body>; groups: Group[] };
type Model = { manifest: Manifest; meshes: { body: string; material: string; geometry: THREE.BufferGeometry }[] };

export type FingerState = {
  j1: number; // ground-truth angles, degrees
  j2: number;
  j1p: number; // predicted angles, degrees
  j2p: number;
  force: number; // predicted contact force, N
  contact: number; // predicted P(contact)
  showTruth: boolean;
  showPred: boolean;
};

let modelPromise: Promise<Model> | null = null;
function loadModel(): Promise<Model> {
  modelPromise ??= Promise.all([
    fetch(asset("/models/finger.json")).then((r) => r.json() as Promise<Manifest>),
    fetch(asset("/models/finger.bin")).then((r) => r.arrayBuffer()),
  ]).then(([manifest, bin]) => ({
    manifest,
    meshes: manifest.groups.map((g) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(bin, g.positions[0], g.positions[1]), 3));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(bin, g.indices[0], g.indices[1]), 1));
      geometry.computeVertexNormals();
      return { body: g.body, material: g.material, geometry };
    }),
  }));
  return modelPromise;
}

const MATERIALS: Record<string, THREE.Material> = {
  housing: new THREE.MeshStandardMaterial({ color: "#4a4a52", roughness: 0.7, metalness: 0.05 }),
  accent: new THREE.MeshStandardMaterial({ color: "#3a3a40", roughness: 0.6 }),
  metal: new THREE.MeshStandardMaterial({ color: "#b8b8bd", roughness: 0.35, metalness: 0.7 }),
  loadcell: new THREE.MeshStandardMaterial({ color: "#8c8f96", roughness: 0.3, metalness: 0.8 }),
  finger: new THREE.MeshStandardMaterial({ color: "#ece9e2", roughness: 0.85 }),
  truth: new THREE.MeshStandardMaterial({ color: "#c9d8f3", roughness: 0.8 }),
  ghost: new THREE.MeshStandardMaterial({
    color: "#e8650a",
    transparent: true,
    opacity: 0.45,
    roughness: 0.6,
    depthWrite: false,
  }),
};

const q = (b: Body) => new THREE.Quaternion(b.quat[1], b.quat[2], b.quat[3], b.quat[0]);
const D2R = Math.PI / 180;

function Finger({
  model,
  material,
  angles,
  stateRef,
}: {
  model: Model;
  material: THREE.Material;
  angles: (s: FingerState) => [number, number];
  stateRef: MutableRefObject<FingerState>;
}) {
  const { bodies } = model.manifest;
  const prox = bodies.middle_proximal;
  const dist = bodies.middle_distal;
  const j1 = useRef<THREE.Group>(null);
  const j2 = useRef<THREE.Group>(null);
  const tip = useRef<THREE.Mesh>(null);
  const isGhost = material === MATERIALS.ghost;

  useFrame(() => {
    const s = stateRef.current;
    const [a1, a2] = angles(s);
    if (j1.current) j1.current.rotation.z = a1 * D2R;
    if (j2.current) j2.current.rotation.z = a2 * D2R;
    if (tip.current) {
      const visible = isGhost && s.showPred && s.contact > 0.5;
      tip.current.visible = visible;
      const r = 0.6 + Math.min(s.force, 5) * 0.35;
      tip.current.scale.setScalar(r);
    }
  });

  const meshes = (body: string) =>
    model.meshes.filter((m) => m.body === body).map((m, i) => <mesh key={i} geometry={m.geometry} material={material} castShadow />);

  return (
    <group position={prox.pos as [number, number, number]} quaternion={q(prox)}>
      <group ref={j1}>
        {meshes("middle_proximal")}
        <group position={dist.pos as [number, number, number]} quaternion={q(dist)}>
          <group ref={j2}>
            {meshes("middle_distal")}
            <mesh ref={tip} position={[0, 0.028, 0.006]} visible={false}>
              <sphereGeometry args={[0.004, 24, 16]} />
              <meshStandardMaterial color="#e8650a" emissive="#e8650a" emissiveIntensity={0.6} transparent opacity={0.8} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function Robot({ stateRef }: { stateRef: MutableRefObject<FingerState> }) {
  const [model, setModel] = useState<Model | null>(null);
  useEffect(() => {
    loadModel().then(setModel);
  }, []);
  const truthGroup = useRef<THREE.Group>(null);
  const predGroup = useRef<THREE.Group>(null);
  useFrame(() => {
    if (truthGroup.current) truthGroup.current.visible = stateRef.current.showTruth;
    if (predGroup.current) predGroup.current.visible = stateRef.current.showPred;
  });
  const wrist = useMemo(
    () =>
      model?.meshes
        .filter((m) => m.body === "wrist_asm")
        .map((m, i) => <mesh key={i} geometry={m.geometry} material={MATERIALS[m.material]} castShadow receiveShadow />),
    [model],
  );
  if (!model) return null;
  return (
    // MuJoCo is z-up; three.js is y-up. Scale metres up so the camera numbers are friendly.
    <group rotation={[-Math.PI / 2, 0, 0]} scale={10} position={[0, 1.36, 0]}>
      {wrist}
      <group ref={truthGroup}>
        <Finger model={model} material={MATERIALS.truth} angles={(s) => [s.j1, s.j2]} stateRef={stateRef} />
      </group>
      <group ref={predGroup}>
        <Finger model={model} material={MATERIALS.ghost} angles={(s) => [s.j1p, s.j2p]} stateRef={stateRef} />
      </group>
    </group>
  );
}

export default function FingerScene({
  stateRef,
  className = "",
}: {
  stateRef: MutableRefObject<FingerState>;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [2.7, 2.45, 1.15], fov: 36 }}>
        <color attach="background" args={["#f3f1ec"]} />
        <hemisphereLight args={["#ffffff", "#d8d2c4", 0.9]} />
        <directionalLight position={[2, 4, 3]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} />
        <Robot stateRef={stateRef} />
        <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={4} blur={2.4} far={2} />
        <OrbitControls target={[0, 1.82, 0]} enablePan={false} minDistance={0.8} maxDistance={5} />
      </Canvas>
    </div>
  );
}
