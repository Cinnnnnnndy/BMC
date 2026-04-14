/**
 * IsoCanvas — Three.js 3D renderer with detailed per-type materials.
 * Uses @react-three/fiber + @react-three/drei.
 */
import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useSimStore } from './simStore';
import {
  HARDWARE_COMPONENTS,
  BUS_REGISTRY,
  BUS_COLORS,
  getComponentsOnBus,
  type HardwareComponent,
  type BusDef,
} from './serverData';

// ─── Grid → world coordinate transform ───────────────────────────────────
// Scene spans x: -7.5→30.5, y: 0→17.3  →  center ≈ (11.5, 8.7)
// CX/CZ shift the whole scene so that center lands at world origin (0,0,0).
const CX = -11;  // center offset X  (was -8 for old 11×8 board)
const CZ = -9;   // center offset Z  (was -6 for old 11×8 board)
const g2wx = (gx: number) => gx + CX;
const g2wy = (gz: number) => gz;
const g2wz = (gy: number) => gy + CZ;

// ─── Seeded RNG ───────────────────────────────────────────────────────────
function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ─── Canvas texture: PCB top face ─────────────────────────────────────────
function createPCBTexture(seed: number): THREE.CanvasTexture {
  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = S; cv.height = S;
  const ctx = cv.getContext('2d')!;
  const rng = seededRng(seed);

  // Base PCB green
  ctx.fillStyle = '#1a2a1a';
  ctx.fillRect(0, 0, S, S);

  // Fine grid (circuit traces)
  ctx.strokeStyle = '#2a3f2a';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < S; x += 16) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, S); ctx.stroke();
  }
  for (let y = 0; y < S; y += 16) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke();
  }

  // Longer circuit traces (horizontal + vertical routing)
  ctx.strokeStyle = '#2f4a2f';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 18; i++) {
    const x1 = rng() * S, y1 = rng() * S;
    // L-shaped trace
    const xm = rng() * S, ym = rng() * S;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(xm, y1);   // horizontal
    ctx.lineTo(xm, ym);   // vertical
    ctx.stroke();
  }

  // Copper pads (SMD components)
  ctx.fillStyle = '#B87333';
  for (let i = 0; i < 30; i++) {
    const x = rng() * S, y = rng() * S;
    const w = 5 + rng() * 6, h = 3 + rng() * 4;
    // Rounded pad
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 1);
    ctx.fill();
  }
  // DIP/QFP pads grid
  for (let row = 0; row < 2; row++) {
    const bx = rng() * (S - 80) + 20, by = rng() * (S - 60) + 20;
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(bx + i * 9 - 2, by + row * 40 - 1.5, 4, 3);
    }
  }

  // Via holes
  ctx.fillStyle = '#8a8a8a';
  for (let i = 0; i < 35; i++) {
    const x = rng() * S, y = rng() * S;
    ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#555'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.stroke();
  }

  // Silkscreen: component reference designators
  ctx.fillStyle = 'rgba(255,255,255,0.62)';
  ctx.font = '9px monospace';
  const refs = ['U1','C2','R5','U3','J1','L2','C4','R12','U7','IC1','D1','Q3','C8','R7','U5','JP1','Y1'];
  for (let i = 0; i < 14; i++) {
    ctx.fillText(refs[i % refs.length], rng() * (S - 30), rng() * (S - 12) + 12);
  }

  // Silkscreen: component outlines (small rectangles)
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 8; i++) {
    const x = rng() * (S - 30), y = rng() * (S - 30);
    const w = 15 + rng() * 20, h = 10 + rng() * 15;
    ctx.strokeRect(x, y, w, h);
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ─── Canvas texture: HDD label sticker ───────────────────────────────────
function createHDDLabelTexture(model: string): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 128;
  const ctx = cv.getContext('2d')!;

  // Label background gradient
  const grad = ctx.createLinearGradient(0, 0, 256, 128);
  grad.addColorStop(0, '#ede5d5');
  grad.addColorStop(1, '#cec8b8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  // Subtle inner shadow border
  ctx.strokeStyle = '#b8b0a0';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 252, 124);

  // Company logo area (colored stripe)
  ctx.fillStyle = '#c8442a';
  ctx.fillRect(0, 0, 10, 128);

  // Model text
  ctx.fillStyle = '#111';
  ctx.font = 'bold 15px Arial';
  ctx.fillText(model.length > 8 ? model.substring(0, 8) : model, 18, 25);

  ctx.font = '10px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('4TB  SATA 6Gb/s  7200RPM', 18, 44);
  ctx.fillText('S/N: XK2P9A3B-00142', 18, 58);
  ctx.fillText('P/N: MB4000GEFNA', 18, 72);
  ctx.fillText('MFG: 2024-06  DC: 2425', 18, 86);

  // Barcode
  ctx.fillStyle = '#111';
  for (let i = 0; i < 38; i++) {
    const x = 18 + i * 5;
    const barH = 10 + (i % 4 === 0 ? 4 : 0);
    ctx.fillRect(x, 98, i % 3 === 0 ? 3 : 2, barH);
  }

  return new THREE.CanvasTexture(cv);
}

// ─── Canvas texture: PSU vent honeycomb ───────────────────────────────────
function createHoneycombTexture(): THREE.CanvasTexture {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = S; cv.height = S;
  const ctx = cv.getContext('2d')!;

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, S, S);

  const r = 9;
  const hexW = r * Math.sqrt(3);
  const hexH = r * 2;

  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 1.2;

  for (let row = -1; row < S / (hexH * 0.75) + 2; row++) {
    for (let col = -1; col < S / hexW + 2; col++) {
      const cx = col * hexW + (row % 2 === 0 ? 0 : hexW / 2);
      const cy = row * hexH * 0.75;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx + (r - 1) * Math.cos(a);
        const py = cy + (r - 1) * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  return new THREE.CanvasTexture(cv);
}

// ─── Status helpers ───────────────────────────────────────────────────────
function statusEmissive(status: string) {
  switch (status) {
    case 'error':   return { color: '#EF4444' as const, intensity: 0.35 };
    case 'warning': return { color: '#F59E0B' as const, intensity: 0.25 };
    default:        return { color: '#000000' as const, intensity: 0.0  };
  }
}

// Shared outline color
function outlineColor(isSelected: boolean, status: string) {
  if (isSelected) return '#5b9cf6';
  if (status === 'error') return '#EF4444';
  if (status === 'warning') return '#F59E0B';
  return '#5b9cf6';
}

// ─── Selection outline ────────────────────────────────────────────────────
function StatusOutline({
  w, dh, d, isSelected, effStatus,
}: { w: number; dh: number; d: number; isSelected: boolean; effStatus: string }) {
  const show = isSelected || effStatus === 'error' || effStatus === 'warning';
  const outRef = useRef<THREE.LineSegments>(null);
  const geo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(w + 0.07, dh + 0.07, d + 0.07)),
    [w, dh, d],
  );
  useFrame(({ clock }) => {
    if (!outRef.current) return;
    const mat = outRef.current.material as THREE.LineBasicMaterial;
    if (isSelected) mat.opacity = 0.55 + 0.45 * Math.abs(Math.sin(clock.getElapsedTime() * 2));
    else if (effStatus === 'error') mat.opacity = 0.4 + 0.5 * Math.abs(Math.sin(clock.getElapsedTime() * Math.PI * 2));
  });
  if (!show) return null;
  return (
    <lineSegments ref={outRef} geometry={geo}>
      <lineBasicMaterial color={outlineColor(isSelected, effStatus)} transparent opacity={0.85} />
    </lineSegments>
  );
}

// ─── PCB mesh (BASE_BOARD / EXT_BOARD / RISER) ───────────────────────────
interface SpecProps {
  comp: HardwareComponent;
  isSelected: boolean;
  effStatus: string;
}

// Per-type PCB color config — all in the #1a1a1a–#404040 dark-grey band
const PCB_MAT: Record<string, { color: string; roughness: number; metalness: number }> = {
  BASE_BOARD: { color: '#1a2416', roughness: 0.85, metalness: 0.10 },
  EXT_BOARD:  { color: '#1e2820', roughness: 0.80, metalness: 0.15 },
  RISER:      { color: '#2a2f3a', roughness: 0.75, metalness: 0.35 },
};

function PCBMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh = Math.max(h, 0.1);
  const em = statusEmissive(effStatus);
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = PCB_MAT[comp.type] ?? PCB_MAT.BASE_BOARD;

  const pcbTex = useMemo(() => createPCBTexture(hashStr(comp.id)), [comp.id]);
  useEffect(() => () => pcbTex.dispose(), [pcbTex]);

  useFrame(({ clock }) => {
    if (meshRef.current && effStatus === 'error') {
      const m = meshRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.1 + 0.2 * Math.abs(Math.sin(clock.getElapsedTime() * Math.PI * 2));
    }
  });

  return (
    <>
      {/* PCB body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[w, dh, d]} />
        <meshStandardMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
          envMapIntensity={0.5}
          emissive={new THREE.Color(em.color)}
          emissiveIntensity={em.intensity}
          opacity={effStatus === 'offline' ? 0.38 : 1}
          transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Top face: PCB texture overlay */}
      <mesh position={[0, dh / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w - 0.04, d - 0.04]} />
        <meshStandardMaterial
          map={pcbTex}
          roughness={0.78}
          metalness={0.06}
          transparent
          opacity={effStatus === 'offline' ? 0.25 : 0.94}
        />
      </mesh>

      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </>
  );
}

// ─── CPU heatsink mesh ────────────────────────────────────────────────────
function CPUMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh = Math.max(h, 0.1);
  const em = statusEmissive(effStatus);
  const meshRef = useRef<THREE.Mesh>(null);

  // Heatsink geometry — base + fins
  const NUM_FINS  = 22;
  const baseH     = dh * 0.28;
  const finH      = dh * 0.75;
  const finDepth  = d * 0.92;
  const finThick  = 0.044;
  const spacing   = w / (NUM_FINS + 1);

  const finPositions = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < NUM_FINS; i++) arr.push(-w / 2 + (i + 1) * spacing);
    return arr;
  }, [w, spacing]);

  const baseY = -dh / 2 + baseH / 2;
  const finY  = -dh / 2 + baseH + finH / 2;

  useFrame(({ clock }) => {
    if (meshRef.current && effStatus === 'error') {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.1 + 0.25 * Math.abs(Math.sin(clock.getElapsedTime() * Math.PI * 2));
    }
  });

  // Aluminium heatsink — mid-grey, high metalness
  const heatsinkColor = '#3a3a3a';

  return (
    <>
      {/* Heatsink base plate */}
      <mesh ref={meshRef} castShadow position={[0, baseY, 0]}>
        <boxGeometry args={[w, baseH, d]} />
        <meshStandardMaterial
          color={heatsinkColor} roughness={0.55} metalness={0.75}
          emissive={new THREE.Color(em.color)} emissiveIntensity={em.intensity}
          opacity={effStatus === 'offline' ? 0.38 : 1} transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Cooling fins */}
      {finPositions.map((x, i) => (
        <mesh key={i} castShadow position={[x, finY, 0]}>
          <boxGeometry args={[finThick, finH, finDepth]} />
          <meshStandardMaterial color={heatsinkColor} roughness={0.55} metalness={0.75} />
        </mesh>
      ))}

      {/* CPU substrate (bottom — dark-green PCB ceramic) */}
      <mesh position={[0, -dh / 2 - 0.03, 0]}>
        <boxGeometry args={[w * 0.88, 0.06, d * 0.88]} />
        <meshStandardMaterial color="#1a2416" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* LGA pin area on bottom */}
      <mesh position={[0, -dh / 2 - 0.02, 0]}>
        <boxGeometry args={[w * 0.76, 0.015, d * 0.76]} />
        <meshStandardMaterial color="#B8860B" metalness={0.95} roughness={0.1} />
      </mesh>

      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </>
  );
}

// ─── Fan blade geometry (cached) ─────────────────────────────────────────
const _fanBladeGeoCache = new Map<string, THREE.ExtrudeGeometry>();

function getFanBladeGeo(r: number): THREE.ExtrudeGeometry {
  const key = r.toFixed(3);
  if (_fanBladeGeoCache.has(key)) return _fanBladeGeoCache.get(key)!;

  const innerR = r * 0.24;
  const shape  = new THREE.Shape();
  shape.moveTo(innerR, -0.05);
  shape.bezierCurveTo(r * 0.44, -0.12, r * 0.72, r * 0.22, r * 0.60, r * 0.52);
  shape.lineTo(r * 0.50, r * 0.58);
  shape.bezierCurveTo(r * 0.42, r * 0.28, r * 0.18, -0.02, innerR, 0.05);
  shape.closePath();

  const bladeThick = r * 0.065;
  const geo = new THREE.ExtrudeGeometry(shape, { depth: bladeThick, bevelEnabled: false });
  // Rotate to XZ plane (blades lie horizontal)
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, bladeThick / 2, 0);

  _fanBladeGeoCache.set(key, geo);
  return geo;
}

// ─── Fan mesh ─────────────────────────────────────────────────────────────
function FANMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh   = Math.max(h, 0.1);
  const r    = Math.min(w, d) / 2 * 0.82;
  const bladeGroupRef = useRef<THREE.Group>(null);

  const bladeGeo = useMemo(() => getFanBladeGeo(r), [r]);

  useFrame(() => {
    if (!bladeGroupRef.current) return;
    const speed = effStatus === 'offline' ? 0 : effStatus === 'error' ? 0.008 : 0.055;
    bladeGroupRef.current.rotation.y += speed;
  });

  // Fan sits at top of the frame
  const discY = dh / 2 - r * 0.04;

  return (
    <>
      {/* Frame body — deep blue-grey, non-metallic plastic/aluminium */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, dh, d]} />
        <meshStandardMaterial
          color="#252830" metalness={0.4} roughness={0.7}
          emissive={effStatus === 'warning' ? '#F59E0B' : '#000'} emissiveIntensity={effStatus === 'warning' ? 0.15 : 0}
          opacity={effStatus === 'offline' ? 0.38 : 1} transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Fan shroud disc */}
      <mesh position={[0, discY, 0]}>
        <cylinderGeometry args={[r, r, 0.06, 32]} />
        <meshStandardMaterial color="#1a1c20" metalness={0.35} roughness={0.75} />
      </mesh>

      {/* Rotating blade group */}
      {effStatus !== 'offline' && (
        <group ref={bladeGroupRef} position={[0, discY + 0.01, 0]}>
          {/* Hub */}
          <mesh>
            <cylinderGeometry args={[r * 0.22, r * 0.22, 0.1, 16]} />
            <meshStandardMaterial color="#20222a" metalness={0.45} roughness={0.65} />
          </mesh>
          {/* 5 blades — dark blue-grey, low metalness */}
          {Array.from({ length: 5 }, (_, i) => (
            <mesh key={i} geometry={bladeGeo} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
              <meshStandardMaterial color="#1a1c20" metalness={0.3} roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {/* Corner screw holes */}
      {[[-w / 2 + 0.12, -d / 2 + 0.12], [w / 2 - 0.12, -d / 2 + 0.12],
        [-w / 2 + 0.12, d / 2 - 0.12], [w / 2 - 0.12,  d / 2 - 0.12]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx as number, dh / 2 + 0.005, sz as number]}>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 8]} />
          <meshStandardMaterial color="#555" metalness={0.9} />
        </mesh>
      ))}

      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </>
  );
}

// ─── HDD mesh ─────────────────────────────────────────────────────────────
function HDDMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh = Math.max(h, 0.1);
  const em = statusEmissive(effStatus);
  const meshRef = useRef<THREE.Mesh>(null);

  const labelTex = useMemo(() => createHDDLabelTexture(comp.labelEn), [comp.labelEn]);
  useEffect(() => () => labelTex.dispose(), [labelTex]);

  useFrame(({ clock }) => {
    if (meshRef.current && effStatus === 'error') {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.12 + 0.22 * Math.abs(Math.sin(clock.getElapsedTime() * Math.PI * 2));
    }
  });

  return (
    <>
      {/* Main shell — dark blue-grey aluminium body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[w, dh, d]} />
        <meshStandardMaterial
          color="#282c35" metalness={0.65} roughness={0.4}
          emissive={new THREE.Color(em.color)} emissiveIntensity={em.intensity}
          opacity={effStatus === 'offline' ? 0.38 : 1} transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Label sticker (top face) */}
      <mesh position={[0, dh / 2 + 0.002, d * 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.88, d * 0.75]} />
        <meshStandardMaterial
          map={labelTex} roughness={0.92} metalness={0}
          transparent opacity={effStatus === 'offline' ? 0.25 : 0.97}
        />
      </mesh>

      {/* Connector interface (gold, back face) */}
      <mesh position={[w * 0.28, 0, d / 2 - 0.03]}>
        <boxGeometry args={[w * 0.45, dh * 0.55, 0.06]} />
        <meshStandardMaterial color="#B8860B" metalness={0.95} roughness={0.08} />
      </mesh>
      {/* Power connector (gold) */}
      <mesh position={[-w * 0.28, 0, d / 2 - 0.03]}>
        <boxGeometry args={[w * 0.2, dh * 0.5, 0.06]} />
        <meshStandardMaterial color="#B8860B" metalness={0.95} roughness={0.08} />
      </mesh>

      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </>
  );
}

// ─── PSU ventilation holes (InstancedMesh on right face) ─────────────────
function PSUVentHoles({ w, dh, d }: { w: number; dh: number; d: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const COLS = 8, ROWS = 20;
  const count = COLS * ROWS;

  const holeR = Math.min(d / (COLS * 2.5), dh / (ROWS * 2.5));
  const geo = useMemo(() => new THREE.CircleGeometry(holeR, 8), [holeR]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#050505', side: THREE.DoubleSide }), []);
  useEffect(() => { return () => { geo.dispose(); mat.dispose(); }; }, [geo, mat]);

  useEffect(() => {
    const im = meshRef.current;
    if (!im) return;
    const dummy  = new THREE.Object3D();
    const spacingZ = d  / (COLS + 1);
    const spacingY = dh / (ROWS + 1);
    let idx = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        dummy.position.set(
          w / 2 + 0.002,
          -dh / 2 + (r + 1) * spacingY,
          -d  / 2 + (c + 1) * spacingZ,
        );
        dummy.rotation.set(0, -Math.PI / 2, 0); // face outward (+X)
        dummy.updateMatrix();
        im.setMatrixAt(idx++, dummy.matrix);
      }
    }
    im.instanceMatrix.needsUpdate = true;
  }, [w, dh, d]);

  return <instancedMesh ref={meshRef} args={[geo, mat, count]} />;
}

// ─── PSU mesh ─────────────────────────────────────────────────────────────
function PSUMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh = Math.max(h, 0.1);
  const em = statusEmissive(effStatus);

  const honeycombTex = useMemo(() => createHoneycombTexture(), []);
  useEffect(() => () => honeycombTex.dispose(), [honeycombTex]);

  // Fan grille radius on front face
  const fgR = Math.min(w, dh) / 2 * 0.72;

  return (
    <>
      {/* Main shell — deep grey chassis body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, dh, d]} />
        <meshStandardMaterial
          color="#1e2026" metalness={0.6} roughness={0.6}
          emissive={new THREE.Color(em.color)} emissiveIntensity={em.intensity}
          opacity={effStatus === 'offline' ? 0.38 : 1} transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Ventilation holes: right side face (InstancedMesh 8×20) */}
      <PSUVentHoles w={w} dh={dh} d={d} />

      {/* Honeycomb texture on left side face */}
      <mesh position={[-w / 2 - 0.001, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[d * 0.88, dh * 0.82]} />
        <meshStandardMaterial map={honeycombTex} transparent opacity={0.85} />
      </mesh>

      {/* Fan grille on front face (-Z) — concentric rings */}
      {[0.35, 0.55, 0.75, 0.95].map((t, i) => (
        <mesh key={i} position={[0, 0, -d / 2 - 0.002]}>
          <ringGeometry args={[fgR * t - 0.02, fgR * t, 32]} />
          <meshStandardMaterial color="#252830" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Fan grille spokes (4 spokes) */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={`sp-${i}`} position={[0, 0, -d / 2 - 0.002]}
          rotation={[0, 0, (i * Math.PI) / 4]}>
          <planeGeometry args={[0.045, fgR * 2.1]} />
          <meshStandardMaterial color="#252830" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Power output connectors (back face, gold) */}
      {[-0.35, 0.0, 0.35].map((offset, i) => (
        <mesh key={i} position={[offset * w, dh * 0.1, d / 2 + 0.025]}>
          <boxGeometry args={[w * 0.18, dh * 0.3, 0.05]} />
          <meshStandardMaterial color="#B8860B" metalness={0.95} roughness={0.08} />
        </mesh>
      ))}

      {/* Status indicator LED on front */}
      <mesh position={[-w / 2 + 0.15, dh / 2 - 0.18, -d / 2 - 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
        <meshStandardMaterial
          color={effStatus === 'error' ? '#EF4444' : effStatus === 'warning' ? '#F59E0B' : '#4ADE80'}
          emissive={effStatus === 'error' ? '#EF4444' : effStatus === 'warning' ? '#F59E0B' : '#4ADE80'}
          emissiveIntensity={0.9}
        />
      </mesh>

      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </>
  );
}

// ─── IO Panel mesh ────────────────────────────────────────────────────────
function IOPanelMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh = Math.max(h, 0.1);
  const em = statusEmissive(effStatus);

  // Port definitions (x offset, w, h, label)
  const ports = [
    { x: -w * 0.35, pw: w * 0.13, ph: dh * 0.35 },  // USB-A ×2
    { x: -w * 0.15, pw: w * 0.13, ph: dh * 0.35 },
    { x:  w * 0.05, pw: w * 0.18, ph: dh * 0.50 },  // RJ45
    { x:  w * 0.30, pw: w * 0.12, ph: dh * 0.28 },  // VGA
  ];

  return (
    <>
      {/* Panel body — near-black panel with slight blue-grey tint */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, dh, d]} />
        <meshStandardMaterial
          color="#20232a" metalness={0.5} roughness={0.7}
          emissive={new THREE.Color(em.color)} emissiveIntensity={em.intensity}
          opacity={effStatus === 'offline' ? 0.38 : 1} transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Port cutouts / connectors (front face, dark gold) */}
      {ports.map((p, i) => (
        <mesh key={i} position={[p.x, 0, -d / 2 - 0.008]}>
          <boxGeometry args={[p.pw, p.ph, 0.015]} />
          <meshStandardMaterial color="#B8860B" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </>
  );
}

// ─── Generic mesh (fallback for EEPROM, etc.) ─────────────────────────────
// All entries must stay within the #1a1a1a–#404040 dark-grey band
const GENERIC_COLORS: Record<string, { color: string; roughness: number; metalness: number }> = {
  EEPROM:  { color: '#1a1a1a', roughness: 0.9, metalness: 0.10 },
  I2C_BUS: { color: '#1e2028', roughness: 0.8, metalness: 0.20 },
};
const GENERIC_FALLBACK = { color: '#2a2f3a', roughness: 0.7, metalness: 0.30 };

function GenericMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh = Math.max(h, 0.1);
  const em = statusEmissive(effStatus);
  const mat = GENERIC_COLORS[comp.type] ?? GENERIC_FALLBACK;

  return (
    <>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, dh, d]} />
        <meshStandardMaterial
          color={mat.color} roughness={mat.roughness} metalness={mat.metalness}
          emissive={new THREE.Color(em.color)} emissiveIntensity={em.intensity}
          opacity={effStatus === 'offline' ? 0.38 : 1} transparent={effStatus === 'offline'}
        />
      </mesh>
      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </>
  );
}

// ─── Tooltip overlay ──────────────────────────────────────────────────────
interface TooltipInfo { x: number; y: number; comp: HardwareComponent }

const S_LABELS: Record<string, string> = {
  normal: '正常', warning: '告警', error: '故障', offline: '离线', selected: '已选',
};
const S_COLORS: Record<string, string> = {
  normal: '#4ade80', warning: '#fbbf24', error: '#f87171', offline: '#6b7280', selected: '#5b9cf6',
};

function TooltipOverlay({ info }: { info: TooltipInfo | null }) {
  const statusOverrides = useSimStore(s => s.statusOverrides);
  if (!info) return null;
  const effStatus = statusOverrides[info.comp.id] ?? info.comp.status;
  const sc = S_COLORS[effStatus] ?? '#888';
  const m  = info.comp.metrics;

  return (
    <div style={{
      position: 'fixed', left: info.x + 14, top: info.y - 10,
      background: 'rgba(10,12,22,0.96)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8, padding: '9px 13px', color: 'rgba(200,215,255,0.85)',
      fontSize: 11, lineHeight: 1.55, minWidth: 160, maxWidth: 230,
      backdropFilter: 'blur(6px)', boxShadow: '0 8px 28px rgba(0,0,0,0.55)',
      pointerEvents: 'none', zIndex: 200,
    }}>
      <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{info.comp.label}</div>
      <div style={{ color: 'rgba(200,215,255,0.38)', fontSize: 10, marginBottom: 5, fontFamily: 'monospace' }}>
        {info.comp.id}
      </div>
      <div style={{ marginBottom: m ? 6 : 0 }}>
        <span style={{ color: sc, fontSize: 10, background: `${sc}22`, border: `1px solid ${sc}44`, borderRadius: 10, padding: '1px 7px' }}>
          {S_LABELS[effStatus] ?? effStatus}
        </span>
      </div>
      {m && (
        <div style={{ fontSize: 10, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {m.temperature !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'rgba(200,215,255,0.45)' }}>温度</span>
            <span style={{ color: m.temperature > 80 ? '#f87171' : 'rgba(200,215,255,0.85)', fontWeight: 600 }}>{m.temperature}°C</span>
          </div>}
          {m.powerWatts !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'rgba(200,215,255,0.45)' }}>功耗</span>
            <span style={{ fontWeight: 600 }}>{m.powerWatts}W</span>
          </div>}
          {m.voltage !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'rgba(200,215,255,0.45)' }}>电压</span>
            <span style={{ fontWeight: 600 }}>{m.voltage.toFixed(2)}V</span>
          </div>}
          {m.utilization !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'rgba(200,215,255,0.45)' }}>利用率</span>
            <span style={{ color: m.utilization > 90 ? '#f87171' : m.utilization > 70 ? '#fbbf24' : '#4ade80', fontWeight: 600 }}>
              {m.utilization.toFixed(0)}%
            </span>
          </div>}
        </div>
      )}
    </div>
  );
}

// ─── ComponentMesh — dispatcher + pointer events + label ─────────────────
interface ComponentMeshProps {
  comp: HardwareComponent;
  onTooltip: (info: TooltipInfo | null) => void;
}

function ComponentMesh({ comp, onTooltip }: ComponentMeshProps) {
  const selectedId      = useSimStore(s => s.selectedId);
  const statusOverrides = useSimStore(s => s.statusOverrides);
  const selectComponent = useSimStore(s => s.selectComponent);
  const selectBus       = useSimStore(s => s.selectBus);

  if (comp.type === 'I2C_BUS') return null;

  const effStatus  = statusOverrides[comp.id] ?? comp.status;
  const isSelected = selectedId === comp.id;
  const { x: gx, y: gy, z: gz } = comp.grid;
  const { w, d, h } = comp.size;
  const dh = Math.max(h, 0.1);

  // World-space center
  const wx = g2wx(gx + w / 2);
  const wy = g2wy(gz + dh / 2);
  const wz = g2wz(gy + d / 2);

  const handleClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    selectComponent(comp.id);
    selectBus(null);
  }, [comp.id, selectComponent, selectBus]);

  const handleDblClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('sim:detail', { detail: { id: comp.id } }));
  }, [comp.id]);

  const handleContextMenu = useCallback((e: { nativeEvent?: MouseEvent; stopPropagation: () => void }) => {
    e.stopPropagation();
    e.nativeEvent?.preventDefault();
    window.dispatchEvent(new CustomEvent('sim:contextmenu', {
      detail: { x: e.nativeEvent?.clientX ?? 0, y: e.nativeEvent?.clientY ?? 0, targetId: comp.id },
    }));
  }, [comp.id]);

  const specProps: SpecProps = { comp, isSelected, effStatus };

  return (
    <group
      position={[wx, wy, wz]}
      onClick={handleClick}
      onDoubleClick={handleDblClick}
      onContextMenu={handleContextMenu as unknown as () => void}
      onPointerOver={(e) => { e.stopPropagation(); onTooltip({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY, comp }); }}
      onPointerMove={(e) => { onTooltip({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY, comp }); }}
      onPointerOut={() => onTooltip(null)}
    >
      {/* Specialized mesh per component type */}
      {(comp.type === 'BASE_BOARD' || comp.type === 'EXT_BOARD' || comp.type === 'RISER')
        && <PCBMesh    {...specProps} />}
      {comp.type === 'CPU'      && <CPUMesh    {...specProps} />}
      {comp.type === 'FAN'      && <FANMesh    {...specProps} />}
      {comp.type === 'HDD'      && <HDDMesh    {...specProps} />}
      {comp.type === 'PSU'      && <PSUMesh    {...specProps} />}
      {comp.type === 'IO_PANEL' && <IOPanelMesh {...specProps} />}
      {comp.type === 'EEPROM'   && <GenericMesh {...specProps} />}

      {/* Always-on thin dark silhouette outline — gives the "product photo" edge */}
      <lineSegments renderOrder={-1}>
        <edgesGeometry args={[new THREE.BoxGeometry(w + 0.025, dh + 0.025, d + 0.025)]} />
        <lineBasicMaterial color="#000000" opacity={0.55} transparent />
      </lineSegments>

      {/* Label pill badge — matches reference image style */}
      <Html
        position={[0, dh / 2 + 0.32, 0]}
        center
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        zIndexRange={[0, 0]}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 3,
          fontSize: 9,
          color: isSelected ? '#90c4ff' : 'rgba(185,205,240,0.88)',
          background: isSelected ? 'rgba(30,55,100,0.82)' : 'rgba(8,10,20,0.78)',
          border: `1px solid ${isSelected ? 'rgba(91,156,246,0.55)' : 'rgba(255,255,255,0.10)'}`,
          borderRadius: 3,
          padding: '1px 5px 1px 4px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          whiteSpace: 'nowrap',
          fontWeight: isSelected ? 600 : 400,
          backdropFilter: 'blur(3px)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.75)',
          letterSpacing: '0.03em',
          lineHeight: 1.4,
        }}>
          {/* Status dot */}
          <span style={{
            width: 4, height: 4, borderRadius: '50%', flexShrink: 0,
            background: effStatus === 'error' ? '#ef4444'
              : effStatus === 'warning' ? '#f59e0b'
              : effStatus === 'offline' ? '#6b7280'
              : '#4ade80',
            boxShadow: effStatus === 'error' ? '0 0 4px #ef4444'
              : effStatus === 'warning' ? '0 0 4px #f59e0b'
              : 'none',
          }} />
          {comp.labelEn}
        </div>
      </Html>
    </group>
  );
}

// ─── Bus routing — obstacle-aware, board-hugging traces ───────────────────
// Layer 0  Y = WIRE_BOARD_Y      : horizontal trace hugging the PCB surface
// Layer 1  Y = obstacle.top + gap: local lift over a blocking component
// All route Y values are ≤ tallest component (PSU 2.8) + gap ≈ 3.0
const BOARD_TOP_Y   = 0.3;   // main-board top surface
const WIRE_BOARD_Y  = 0.35;  // default trace height — 0.05 above board
const WIRE_LIFT_GAP = 0.15;  // clearance above any obstacle the wire must jump

/** World-space XZ footprint + topY for AABB obstacle checks */
function getCompBBox(c: HardwareComponent) {
  const { x: gx, y: gy, z: gz } = c.grid;
  const { w, d, h } = c.size;
  return {
    minX: g2wx(gx),      maxX: g2wx(gx + w),
    minZ: g2wz(gy),      maxZ: g2wz(gy + d),
    topY: g2wy(gz) + Math.max(h, 0.1),
  };
}

/**
 * Returns the max top-Y of every component whose XZ footprint overlaps
 * the axis-aligned segment [x0,z0]→[x1,z1], excluding endpoint components.
 */
function segObstacleY(
  x0: number, z0: number,
  x1: number, z1: number,
  exclude: Set<string>,
): number {
  const PAD  = 0.05;
  const minX = Math.min(x0, x1) - PAD, maxX = Math.max(x0, x1) + PAD;
  const minZ = Math.min(z0, z1) - PAD, maxZ = Math.max(z0, z1) + PAD;
  let maxY = WIRE_BOARD_Y;
  for (const c of HARDWARE_COMPONENTS) {
    if (exclude.has(c.id)) continue;
    const b = getCompBBox(c);
    if (b.maxX > minX && b.minX < maxX && b.maxZ > minZ && b.minZ < maxZ)
      maxY = Math.max(maxY, b.topY);
  }
  return maxY;
}

/**
 * Connector anchor on the component's SIDE FACE at mid-height.
 * Wires exit/enter through the side, never the rooftop.
 */
function getConnectorPt3(comp: HardwareComponent, busId: string): THREE.Vector3 {
  const bc = comp.busConnections.find(b => b.busId === busId);
  const { x: gx, y: gy, z: gz } = comp.grid;
  const { w, d, h } = comp.size;
  const dh   = Math.max(h, 0.1);
  const midY = g2wy(gz) + dh * 0.5;   // mid-height in world Y
  const midX = g2wx(gx + w / 2);
  const midZ = g2wz(gy + d / 2);
  if (!bc) return new THREE.Vector3(midX, midY, midZ);
  switch (bc.connectorPos) {
    case 'top':    return new THREE.Vector3(midX,          midY, g2wz(gy));
    case 'bottom': return new THREE.Vector3(midX,          midY, g2wz(gy + d));
    case 'left':   return new THREE.Vector3(g2wx(gx),      midY, midZ);
    case 'right':  return new THREE.Vector3(g2wx(gx + w),  midY, midZ);
    default:       return new THREE.Vector3(midX,          midY, midZ);
  }
}

/**
 * L-shaped route with per-leg obstacle-aware height.
 * Leg A travels in X, Leg B travels in Z.
 * Each leg independently lifts only as high as the tallest obstacle beneath it.
 * Maximum route Y ≤ tallest component + WIRE_LIFT_GAP (~3.0).
 */
function computeRoute3(
  from: THREE.Vector3, to: THREE.Vector3,
  fromId: string, toId: string,
  idx: number,
): THREE.Vector3[] {
  const zOff    = idx * 0.14;
  const exclude = new Set([fromId, toId]);

  // L-turn: travel X first, then Z (with parallel-line Z offset)
  const fx = from.x, fz = from.z + zOff;
  const tx = to.x,   tz = to.z   + zOff;

  // Per-leg obstacle heights
  const hA = segObstacleY(fx, fz, tx, fz, exclude);
  const hB = segObstacleY(tx, fz, tx, tz, exclude);
  const yA = hA > WIRE_BOARD_Y ? hA + WIRE_LIFT_GAP : WIRE_BOARD_Y;
  const yB = hB > WIRE_BOARD_Y ? hB + WIRE_LIFT_GAP : WIRE_BOARD_Y;

  const pts: THREE.Vector3[] = [];
  const push = (p: THREE.Vector3) => {
    if (!pts.length || p.distanceTo(pts[pts.length - 1]) > 0.02) pts.push(p);
  };

  push(from.clone());

  // Descend/ascend from connector to Leg-A height
  if (Math.abs(from.y - yA) > 0.04) push(new THREE.Vector3(fx, yA, from.z));
  // Apply parallel-line Z offset at from.x
  if (Math.abs(from.z - fz)  > 0.02) push(new THREE.Vector3(fx, yA, fz));

  // Leg A — move in X
  if (Math.abs(fx - tx)      > 0.04) push(new THREE.Vector3(tx, yA, fz));

  // Transition between leg heights at the corner
  if (Math.abs(yA - yB)      > 0.04) push(new THREE.Vector3(tx, yB, fz));

  // Leg B — move in Z
  if (Math.abs(fz - tz)      > 0.04) push(new THREE.Vector3(tx, yB, tz));

  // Remove Z offset back to exact destination Z
  if (Math.abs(tz - to.z)    > 0.02) push(new THREE.Vector3(tx, yB, to.z));

  // Ascend/descend from Leg-B height to connector
  if (Math.abs(to.y - yB)    > 0.04) push(new THREE.Vector3(to.x, yB, to.z));

  push(to.clone());
  return pts;
}

// ─── Dashed-tube shaders ─────────────────────────────────────────────────
// uv.x spans 0→1 along the tube length; we use it to tile dash/gap pattern.
const DASH_VERT = /* glsl */`
  varying float vArcLen;
  void main() {
    vArcLen = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const DASH_FRAG = /* glsl */`
  uniform vec3  uColor;
  uniform float uDashSize;
  uniform float uGapSize;
  uniform float uTotalLen;
  uniform float uOffset;
  uniform float uOpacity;
  varying float vArcLen;
  void main() {
    float period = uDashSize + uGapSize;
    float t      = fract(vArcLen * uTotalLen / period + uOffset);
    if (t > uDashSize / period) discard;
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;

// ─── Bus route: dashed tube + glowing endpoint cubes (matches figure 3) ───
function BusRouteLine({
  points, color, isTrunk, isActive, isError, isIdle, alpha, onClickBus,
}: {
  points: THREE.Vector3[]; color: string; isTrunk: boolean;
  isActive: boolean; isError: boolean; isIdle: boolean; alpha: number;
  onClickBus: () => void;
}) {
  if (points.length < 2) return null;

  const effColor  = isError ? '#EF4444' : color;
  const tubeR     = isTrunk ? 0.032 : 0.022;
  const DASH_SIZE = 0.35;
  const GAP_SIZE  = 0.20;

  // CurvePath of straight LineCurve3 segments → exact right-angle corners, no smoothing
  const { curvePath, totalLen } = useMemo(() => {
    const cp = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 0; i < points.length - 1; i++)
      cp.add(new THREE.LineCurve3(points[i].clone(), points[i + 1].clone()));
    return { curvePath: cp, totalLen: Math.max(cp.getLength(), 0.01) };
  }, [points]);

  // TubeGeometry — 10 divisions per segment keeps UV tiling accurate
  const tubeGeo = useMemo(
    () => new THREE.TubeGeometry(curvePath, (points.length - 1) * 10, tubeR, 5, false),
    [curvePath, points.length, tubeR],
  );
  useEffect(() => () => tubeGeo.dispose(), [tubeGeo]);

  // ShaderMaterial — created once, uniforms updated reactively below
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   DASH_VERT,
    fragmentShader: DASH_FRAG,
    uniforms: {
      uColor:    { value: new THREE.Color(effColor) },
      uDashSize: { value: DASH_SIZE  },
      uGapSize:  { value: GAP_SIZE   },
      uTotalLen: { value: totalLen   },
      uOffset:   { value: 0          },
      uOpacity:  { value: alpha      },
    },
    transparent: true,
    depthWrite:  false,
    side: THREE.DoubleSide,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);
  useEffect(() => () => mat.dispose(), [mat]);

  // Keep color + length uniforms in sync
  useEffect(() => {
    mat.uniforms.uColor.value.set(effColor);
    mat.uniforms.uTotalLen.value = totalLen;
  }, [effColor, totalLen, mat]);

  // Per-frame: scroll dashes + pulse opacity on error
  useFrame(({ clock }) => {
    if (isActive) mat.uniforms.uOffset.value -= 0.018;
    mat.uniforms.uOpacity.value = isError
      ? 0.25 + 0.65 * Math.abs(Math.sin(clock.getElapsedTime() * Math.PI * 2))
      : alpha;
  });

  const first = points[0];
  const last  = points[points.length - 1];
  const cs    = isTrunk ? 0.13 : 0.09; // connector cube side length

  return (
    <group onClick={(e: { stopPropagation: () => void }) => { e.stopPropagation(); onClickBus(); }}>
      {/* Dashed tube body */}
      <mesh geometry={tubeGeo} material={mat} />

      {/* Endpoint connector cubes — small glowing blocks as in figure 3 */}
      {[first, last].map((pt, i) => (
        <mesh key={i} position={[pt.x, pt.y, pt.z]}>
          <boxGeometry args={[cs, cs, cs]} />
          <meshStandardMaterial
            color={effColor}
            emissive={new THREE.Color(effColor)}
            emissiveIntensity={0.65}
            roughness={0.3}
            metalness={0.2}
            transparent
            opacity={Math.min(alpha * 1.3, 1)}
          />
        </mesh>
      ))}
    </group>
  );
}

function BusLines({ bus, members }: { bus: BusDef; members: HardwareComponent[] }) {
  const selectedBusId          = useSimStore(s => s.selectedBusId);
  const highlightedConnections = useSimStore(s => s.highlightedConnections);
  const selectBus              = useSimStore(s => s.selectBus);
  const highlightConnections   = useSimStore(s => s.highlightConnections);

  const isSelected = selectedBusId === bus.id;
  const highlighted = highlightedConnections.length === 0 || highlightedConnections.includes(bus.id);
  const alpha    = isSelected ? 1.0 : highlighted ? 0.72 : 0.22;
  const isError  = bus.busStatus === 'error';
  const isIdle   = bus.busStatus === 'idle';
  const isActive = !isError && !isIdle;
  const busColor = BUS_COLORS[bus.type];
  const lineColor = `#${busColor.hex.toString(16).padStart(6, '0')}`;

  const master = members.find(c => c.busConnections.some(b => b.busId === bus.id && b.role === 'master')) ?? members[0];
  const masterPt = getConnectorPt3(master, bus.id);
  const slaves  = members.filter(c => c.id !== master.id);

  const routes = useMemo(() =>
    slaves.map((slave, idx) => ({
      points: computeRoute3(
        masterPt, getConnectorPt3(slave, bus.id),
        master.id, slave.id,
        idx,
      ),
      isTrunk: idx === 0,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleClickBus = useCallback(() => {
    isSelected ? selectBus(null) : (selectBus(bus.id), highlightConnections([bus.id]));
  }, [isSelected, bus.id, selectBus, highlightConnections]);

  return (
    <group>
      {routes.map((r, ri) => (
        <BusRouteLine
          key={`${bus.id}-${ri}`}
          points={r.points}
          color={lineColor}
          isTrunk={r.isTrunk}
          isActive={isActive} isError={isError} isIdle={isIdle}
          alpha={alpha}
          onClickBus={handleClickBus}
        />
      ))}
    </group>
  );
}

// ─── Camera reset handler ─────────────────────────────────────────────────
function CameraResetHandler() {
  const { camera } = useThree();
  useEffect(() => {
    const handle = () => { camera.position.set(18, 14, 18); };
    window.addEventListener('sim:resetCamera', handle);
    return () => window.removeEventListener('sim:resetCamera', handle);
  }, [camera]);
  return null;
}

// ─── Scene lights ─────────────────────────────────────────────────────────
// ─── Scene lights (spec-accurate) ────────────────────────────────────────
function SceneLights() {
  return (
    <>
      {/* 1. Ambient — machine room diffuse base */}
      <ambientLight intensity={0.35} color="#a8bcd8" />

      {/* 2. Main key light — strong overhead, crisp shadows on fins */}
      <directionalLight
        position={[15, 28, 12]}
        intensity={1.4}
        color="#f0f4ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={90}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.001}
      />

      {/* 3. Cool fill — left-back bounce, softens shadow edges */}
      <directionalLight
        position={[-12, 8, -10]}
        intensity={0.38}
        color="#3858a0"
      />

      {/* 4. Warm rim — front-low to lift component bases off the floor */}
      <directionalLight
        position={[0, 2, 20]}
        intensity={0.18}
        color="#5070a0"
      />

      {/* 5. Floor bounce */}
      <pointLight position={[0, -2, 0]} intensity={0.15} color="#1a2840" />
    </>
  );
}

// ─── Bus glow point lights ────────────────────────────────────────────────
// Each active bus emits a faint coloured point light at its route midpoint.
function BusGlowLights() {
  const lights = useMemo(() => {
    const result: { key: string; pos: [number, number, number]; color: string }[] = [];

    for (const bus of BUS_REGISTRY) {
      if (bus.busStatus !== 'active') continue;
      const members = getComponentsOnBus(bus.id);
      if (members.length < 2) continue;

      const master = members.find(c =>
        c.busConnections.some(b => b.busId === bus.id && b.role === 'master'),
      ) ?? members[0];
      const masterPt = getConnectorPt3(master, bus.id);
      const busColor = BUS_COLORS[bus.type];
      const colorStr = `#${busColor.hex.toString(16).padStart(6, '0')}`;

      // Glow light at the midpoint between master and each slave.
      // Y = WIRE_BOARD_Y + 0.3 so the light hovers just above the traces.
      const slaves = members.filter(c => c.id !== master.id);
      slaves.forEach((slave, idx) => {
        if (idx > 1) return; // cap at 2 lights per bus
        const slavePt = getConnectorPt3(slave, bus.id);
        result.push({
          key: `${bus.id}-glow-${idx}`,
          pos: [
            (masterPt.x + slavePt.x) / 2,
            WIRE_BOARD_Y + 0.3,
            (masterPt.z + slavePt.z) / 2,
          ],
          color: colorStr,
        });
      });
    }
    return result;
  }, []);

  return (
    <>
      {lights.map(l => (
        <pointLight
          key={l.key}
          position={l.pos}
          intensity={0.3}
          color={l.color}
          distance={5}
          decay={2}
        />
      ))}
    </>
  );
}

// ─── Main scene ───────────────────────────────────────────────────────────
function Scene({ onTooltip }: { onTooltip: (info: TooltipInfo | null) => void }) {
  const snapshotTimer = useRef(0);
  const tAcc          = useRef(0);

  useFrame((_, delta) => {
    const store = useSimStore.getState();
    store.advanceTick(delta);
    snapshotTimer.current += delta;
    if (snapshotTimer.current >= 1) {
      snapshotTimer.current = 0;
      tAcc.current += 1;
      const t = tAcc.current;
      store.pushHistorySnapshot({
        simTime: store.simTick,
        metrics: Object.fromEntries(
          HARDWARE_COMPONENTS.filter(c => c.metrics && c.type !== 'I2C_BUS').map(c => {
            const b = c.metrics!;
            const ph = (c.grid.x + c.grid.y) % (Math.PI * 2);
            const m: Record<string, number> = {};
            if (b.temperature !== undefined) m.temperature = Math.max(10, Math.min(99, b.temperature + 4 * Math.sin(t * 0.7 + ph) + (Math.random() - 0.5) * 1.4));
            if (b.powerWatts  !== undefined) m.powerWatts  = Math.max(1, b.powerWatts + b.powerWatts * 0.08 * Math.sin(t * 0.5 + ph + 1));
            if (b.utilization !== undefined) m.utilization = Math.max(0, Math.min(100, b.utilization + 12 * Math.sin(t * 0.9 + ph + 2)));
            if (b.voltage     !== undefined) m.voltage     = b.voltage + b.voltage * 0.025 * Math.sin(t * 1.2 + ph + 0.5);
            return [c.id, m];
          }),
        ),
      });
    }
  });

  const busEntries = useMemo(() =>
    BUS_REGISTRY.map(bus => ({ bus, members: getComponentsOnBus(bus.id) }))
      .filter(e => e.members.length >= 2),
    [],
  );

  return (
    <>
      {/* ── Lighting ──────────────────────────────────────── */}
      <SceneLights />
      <BusGlowLights />

      {/* ── Environment map: warehouse HDR for metal reflections ── */}
      <Environment preset="warehouse" />

      {/* ── Ground — subtle grid matching reference dark style ── */}
      <gridHelper args={[80, 80, '#12151f', '#0e1018']} position={[0, -0.02, 0]} />
      {/* Shadow-receiving floor plane (invisible, only catches shadows) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial transparent opacity={0.38} />
      </mesh>

      {/* ── Components ────────────────────────────────────── */}
      {HARDWARE_COMPONENTS.map(comp => (
        <ComponentMesh key={comp.id} comp={comp} onTooltip={onTooltip} />
      ))}

      {/* ── Bus routes ────────────────────────────────────── */}
      {busEntries.map(({ bus, members }) => (
        <BusLines key={bus.id} bus={bus} members={members} />
      ))}

      <CameraResetHandler />
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────
export function IsoCanvas() {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const handleTooltip = useCallback((info: TooltipInfo | null) => setTooltip(info), []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [18, 14, 18], fov: 45 }}
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        dpr={[1, 2]}
        style={{ background: '#0b0d14' }}
        onCreated={({ gl }) => {
          // PCFSoftShadowMap produces smooth, realistic shadow edges
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        onPointerMissed={() => useSimStore.getState().deselectAll()}
      >
        <color attach="background" args={['#0b0d14']} />
        <fog attach="fog" color="#0b0d14" near={50} far={90} />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={6}
          maxDistance={65}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0.8, 0]}
        />

        <Scene onTooltip={handleTooltip} />
      </Canvas>

      <TooltipOverlay info={tooltip} />
    </div>
  );
}
