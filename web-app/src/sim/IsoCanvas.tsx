/**
 * IsoCanvas — Three.js 3D renderer with detailed per-type materials.
 * Uses @react-three/fiber + @react-three/drei.
 */
import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment, RoundedBox, Text, Edges } from '@react-three/drei';
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
import { computeSceneBounds } from './chassisLayout';
import { getPartById, hasPartModel } from './hardware-library';
import { CatalogPartModel } from './CatalogPartModel';

// ─── Grid → world coordinate transform ───────────────────────────────────
// CX/CZ shift the whole scene so its bounding-box center lands at world origin.
// Computed from the (catalog-driven) layout so it always stays framed.
const _sceneBounds = computeSceneBounds(HARDWARE_COMPONENTS);
const CX = -_sceneBounds.centerX; // center offset X
const CZ = -_sceneBounds.centerZ; // center offset Z

// ─── Auto-frame camera to the (catalog-driven) scene size ──────────────────
// The realistic 2U layout is long/deep; derive camera distance so it always fits.
const _sceneW = _sceneBounds.maxX - _sceneBounds.minX;
const _sceneD = _sceneBounds.maxZ - _sceneBounds.minZ;
const _sceneRadius = 0.5 * Math.hypot(_sceneW, _sceneD);
const _camDist = Math.max(30, (_sceneRadius / Math.tan((45 / 2) * Math.PI / 180)) * 1.12);
const _camU = 1 / Math.hypot(1, 0.75, 1);
const CAM_POS: [number, number, number] = [
  _camDist * _camU, _camDist * 0.75 * _camU, _camDist * _camU,
];
const CAM_TARGET: [number, number, number] = [0, 1, 0];
const FOG_NEAR = _camDist * 0.85;
const FOG_FAR = _camDist * 2.0;
const SHADOW_EXTENT = _sceneRadius * 1.1;
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

  // Copper ground pour areas (faint, gives "plane fill" look)
  ctx.fillStyle = 'rgba(176, 115, 50, 0.09)';
  for (let i = 0; i < 3; i++) {
    const px = (rng() * 0.5 + 0.12) * S, py = (rng() * 0.5 + 0.12) * S;
    const pw = (rng() * 0.22 + 0.14) * S, ph = (rng() * 0.18 + 0.10) * S;
    ctx.fillRect(px - pw / 2, py - ph / 2, pw, ph);
  }

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
  // Per-model box outline removed entirely (user request) — no wireframe box
  // around any component in any state. Selection/status still drive the side
  // panel + status counters.
  const show = false;
  const outRef = useRef<THREE.LineSegments>(null);
  const geo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(w + 0.07, dh + 0.07, d + 0.07)),
    [w, dh, d],
  );
  useFrame(({ clock }) => {
    if (!outRef.current) return;
    const mat = outRef.current.material as THREE.LineBasicMaterial;
    if (isSelected) {
      mat.opacity = 0.55 + 0.45 * Math.abs(Math.sin(clock.getElapsedTime() * 2));
    } else if (effStatus === 'error') {
      mat.opacity = 0.4 + 0.5 * Math.abs(Math.sin(clock.getElapsedTime() * Math.PI * 2));
    }
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
  BMC_CARD:   { color: '#112036', roughness: 0.78, metalness: 0.22 },
};

function PCBMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh = Math.max(h, 0.1);
  const em = statusEmissive(effStatus);
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = PCB_MAT[comp.type] ?? PCB_MAT.BASE_BOARD;

  const pcbTex = useMemo(() => createPCBTexture(hashStr(comp.id)), [comp.id]);
  useEffect(() => () => pcbTex.dispose(), [pcbTex]);

  const chipPackages = useMemo(() => {
    const rng = seededRng(hashStr(comp.id) + 999);
    return Array.from({ length: 12 }, () => ({
      x: (rng() - 0.5) * w * 0.80,
      z: (rng() - 0.5) * d * 0.78,
      cw: 0.12 + rng() * 0.20,
      cd: 0.09 + rng() * 0.15,
    }));
  }, [comp.id, w, d]);

  // ── DIMM layout: TaiShan 2280 (this config) has 16 DDR4 DIMMs = 8 per CPU.
  //    Per the product photo, the DIMM slots are HORIZONTAL bars (long axis
  //    along X) arranged in 4 banks — one above and one below each CPU (in
  //    depth/Z), 4 sticks per bank. CPUs are at board-local Z ±4 (see
  //    chassisLayout cpu_0/cpu_1); banks straddle them.
  const dimmSlots = useMemo(() => {
    if (comp.type !== 'BASE_BOARD') return [];
    // Rotated 90°: CPUs are side by side along X (board-local x ±4); the 4 DIMM
    // banks flank them along X, sticks run along DEPTH (Z). Each DIMM group is
    // also rotated 90° (about Y) so its long axis points along Z.
    const bankX = [-7.0, -1.0, 1.0, 7.0]; // outer/inner of CPU1 (left), inner/outer of CPU0 (right)
    const pitch = 0.42;                    // stick-to-stick spacing within a bank (along X)
    const dimmCenterZ = 0;                 // centred in depth (board centre)
    const out: { x: number; z: number }[] = [];
    for (const bx of bankX)
      for (let i = 0; i < 4; i++)
        out.push({ x: bx + (i - 1.5) * pitch, z: dimmCenterZ });
    return out; // 4 banks × 4 = 16
  }, [comp.type, w, d]);

  // ── PCIe / expansion connectors along rear edge (image 3, items 1–12) ────
  const pcieEdgeSlots = useMemo(() => {
    if (comp.type !== 'BASE_BOARD') return [];
    return Array.from({ length: 12 }, (_, i) => ({
      x: -w * 0.43 + i * (w * 0.82 / 11),
      z: d / 2 - 0.08,
    }));
  }, [comp.type, w, d]);

  // ── EXT_BOARD: BMC/CPLD cluster + connector rows (image 5 layout) ─────────
  const extBoardFeatures = useMemo(() => {
    if (comp.type !== 'EXT_BOARD') return null;
    // Mirrored in X: chips on the RIGHT (grip side), connector rows on the LEFT.
    return {
      bmcChip:  { x: w * 0.28, z: -d * 0.38 },
      cpldChip: { x: w * 0.28, z: -d * 0.20 },
      phyChip:  { x: w * 0.28, z: -d * 0.04 },
      heatFin:  { x: w * 0.28, z: -d * 0.38 },
      connRows: Array.from({ length: 9 }, (_, i) => ({
        z: -d * 0.44 + i * (d * 0.86 / 8),
        xBase: -w * 0.28,
      })),
    };
  }, [comp.type, w, d]);

  useFrame(({ clock }) => {
    if (meshRef.current && effStatus === 'error') {
      const m = meshRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.1 + 0.2 * Math.abs(Math.sin(clock.getElapsedTime() * Math.PI * 2));
    }
  });

  // EXT_BOARD is modelled as an L-shape ("pistol"): a full-width bar at the
  // rear (barrel) + a front-left column (grip, where the red/black power
  // block sits), with the front-right corner cut away. All other PCBs are a
  // single rectangular plate.
  const plates = comp.type === 'EXT_BOARD'
    ? [
        { cx: 0,        cz:  d * 0.25, bw: w,        bd: d * 0.50 }, // barrel — rear, full width
        { cx: w * 0.29, cz: -d * 0.25, bw: w * 0.42, bd: d * 0.50 }, // grip — front-RIGHT column (mirrored)
      ]
    : [{ cx: 0, cz: 0, bw: w, bd: d }];
  // Drop scattered chips that would float over the cut-away corner (EXT only;
  // mirrored → the cut is now front-LEFT).
  const inCutCorner = (x: number, z: number) =>
    comp.type === 'EXT_BOARD' && x < w * 0.08 && z < 0;

  // EXT_BOARD is flipped 180° about Y so its straight full-width edge (barrel)
  // faces the mainboard when the board sits behind it (rear placement).
  const boardRotY = comp.type === 'EXT_BOARD' ? Math.PI : 0;

  return (
    <group rotation={[0, boardRotY, 0]}>
      {/* PCB body (one plate, or two forming an L for EXT_BOARD) */}
      {plates.map((p, pi) => (
        <mesh key={`body-${pi}`} ref={pi === 0 ? meshRef : undefined} position={[p.cx, 0, p.cz]} castShadow receiveShadow>
          <boxGeometry args={[p.bw, dh, p.bd]} />
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
      ))}

      {/* Top face: PCB texture overlay (per plate) */}
      {plates.map((p, pi) => (
        <mesh key={`tex-${pi}`} position={[p.cx, dh / 2 + 0.002, p.cz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[p.bw - 0.04, p.bd - 0.04]} />
          <meshStandardMaterial
            map={pcbTex}
            roughness={0.78}
            metalness={0.06}
            transparent
            opacity={effStatus === 'offline' ? 0.25 : 0.94}
          />
        </mesh>
      ))}

      {/* SMD chip packages scattered on PCB surface */}
      {chipPackages.filter((chip) => !inCutCorner(chip.x, chip.z)).map((chip, i) => (
        <mesh key={`chip-${i}`} position={[chip.x, dh / 2 + 0.04, chip.z]}>
          <boxGeometry args={[chip.cw, 0.07, chip.cd]} />
          <meshStandardMaterial color="#111118" roughness={0.55} metalness={0.22} />
        </mesh>
      ))}

      {/* ── DDR5 DIMM sticks (BASE_BOARD, rotated 90°): 4 groups × 4 ── */}
      {/* Refined style: PCB + gold fingers with DDR5 off-center notch,            */}
      {/*                DRAM chips front+back, ejection latches, label sticker.    */}
      {dimmSlots.map((pos, i) => {
        const stickLen    = 5.00;   // along X (long axis) — DDR4 RDIMM ≈ 100–133mm
        const stickHeight = 0.94;   // along Y (vertical)
        const stickThick  = 0.085;  // along Z (thin profile)
        const fingerH     = 0.09;
        const notchX      = 0.22;   // DDR4 notch offset from center along X
        const notchW      = 0.12;
        const hasError    = effStatus === 'error' && (i % 5 === 0);
        // 8 DRAM chip positions spread along the full stick length (both faces)
        const chipXs = Array.from({ length: 8 }, (_, ci) => -stickLen / 2 + 0.3 + ci * ((stickLen - 0.6) / 7));
        return (
          <group key={`dimm-${i}`} position={[pos.x, dh / 2 + stickHeight / 2 + 0.04, pos.z]} rotation={[0, Math.PI / 2, 0]}>
            {/* DIMM PCB body (two halves with notch gap in middle-bottom) */}
            {([-1, +1] as const).map((sign) => (
              <mesh key={`pcb-${sign}`} position={[sign * ((stickLen / 2 - notchW / 2) / 2 + notchX / 4), 0, 0]}>
                <boxGeometry args={[(stickLen - notchW) / 2 - notchX / 2, stickHeight, stickThick]} />
                <meshStandardMaterial color="#152015" roughness={0.82} metalness={0.10} />
              </mesh>
            ))}
            {/* Upper band connecting the two halves (above the notch) */}
            <mesh position={[0, stickHeight * 0.18, 0]}>
              <boxGeometry args={[stickLen * 0.92, stickHeight * 0.58, stickThick]} />
              <meshStandardMaterial color="#152015" roughness={0.82} metalness={0.10} />
            </mesh>

            {/* Gold edge-contact fingers — split by the DDR5 notch (off-center) */}
            {([-1, +1] as const).map((sign) => {
              const segLen = sign < 0
                ? (stickLen / 2 - notchX + notchW / 2) - 0.04
                : (stickLen / 2 + notchX - notchW / 2) - 0.04;
              const segCx = sign < 0
                ? -(stickLen / 2) + segLen / 2 + 0.02
                :  (stickLen / 2) - segLen / 2 - 0.02;
              return (
                <mesh key={`fg-${sign}`} position={[segCx, -stickHeight / 2 + fingerH / 2, 0]}>
                  <boxGeometry args={[segLen, fingerH, stickThick + 0.002]} />
                  <meshStandardMaterial color="#d4a85a" metalness={0.95} roughness={0.08} envMapIntensity={1.6} />
                </mesh>
              );
            })}

            {/* DDR5 off-center keying notch (dark gap) */}
            <mesh position={[notchX, -stickHeight / 2 + fingerH / 2, 0]}>
              <boxGeometry args={[notchW, fingerH + 0.005, stickThick + 0.01]} />
              <meshStandardMaterial color="#05070a" roughness={0.95} metalness={0.02} />
            </mesh>

            {/* DRAM chips — front face (8× SDRAM packages) */}
            {chipXs.map((cx, ci) => (
              <mesh key={`cf-${ci}`} position={[cx, 0.04, stickThick / 2 + 0.022]}>
                <boxGeometry args={[0.30, 0.30, 0.045]} />
                <meshStandardMaterial
                  color={hasError && ci === 3 ? '#4a2420' : '#121316'}
                  roughness={0.58} metalness={0.20}
                  emissive={hasError && ci === 3 ? '#ff4030' : '#000'}
                  emissiveIntensity={hasError && ci === 3 ? 0.4 : 0}
                />
              </mesh>
            ))}
            {/* DRAM chips — back face */}
            {chipXs.map((cx, ci) => (
              <mesh key={`cb-${ci}`} position={[cx, 0.04, -stickThick / 2 - 0.022]}>
                <boxGeometry args={[0.30, 0.30, 0.045]} />
                <meshStandardMaterial color="#121316" roughness={0.58} metalness={0.20} />
              </mesh>
            ))}

            {/* Center heat-spreader label strip (small white sticker, upper area) */}
            <mesh position={[0, stickHeight * 0.36, stickThick / 2 + 0.05]}>
              <boxGeometry args={[stickLen * 0.30, 0.14, 0.004]} />
              <meshStandardMaterial color="#ececec" roughness={0.90} metalness={0.02} />
            </mesh>

            {/* Socket ejection latches at both X-ends (white plastic) */}
            {([-1, +1] as const).map((sign) => (
              <group key={`lat-${sign}`} position={[sign * (stickLen / 2 + 0.10), -stickHeight / 2 + 0.14, 0]}>
                <mesh>
                  <boxGeometry args={[0.16, 0.40, 0.12]} />
                  <meshStandardMaterial color="#d8dce2" roughness={0.55} metalness={0.10} />
                </mesh>
                {/* latch lever */}
                <mesh position={[sign * 0.05, 0.22, 0]}>
                  <boxGeometry args={[0.08, 0.14, 0.09]} />
                  <meshStandardMaterial color="#b4b8be" roughness={0.50} metalness={0.15} />
                </mesh>
              </group>
            ))}

            {/* Socket body (black plastic strip running along the stick length) */}
            <mesh position={[0, -stickHeight / 2 - 0.06, 0]}>
              <boxGeometry args={[stickLen + 0.22, 0.12, 0.22]} />
              <meshStandardMaterial color="#0a0a0c" roughness={0.92} metalness={0.04} />
            </mesh>
          </group>
        );
      })}

      {/* ── PCIe / expansion connectors along rear edge (BASE_BOARD, image 3) ── */}
      {pcieEdgeSlots.map((slot, i) => (
        <group key={`pcie-${i}`} position={[slot.x, dh / 2 + 0.27, slot.z]}>
          {/* Connector housing — dark resin body */}
          <mesh>
            <boxGeometry args={[0.52, 0.52, 0.13]} />
            <meshStandardMaterial color="#1a1d24" metalness={0.42} roughness={0.68} />
          </mesh>
          {/* Gold contact strip */}
          <mesh position={[0, -0.29, 0]}>
            <boxGeometry args={[0.42, 0.045, 0.09]} />
            <meshStandardMaterial color="#c8a040" metalness={0.90} roughness={0.10} />
          </mesh>
          {/* Slot opening recess */}
          <mesh position={[0, 0.05, -0.065]}>
            <boxGeometry args={[0.38, 0.32, 0.005]} />
            <meshStandardMaterial color="#050608" roughness={0.95} metalness={0.05} />
          </mesh>
        </group>
      ))}

      {/* ── BASE_BOARD: front-edge electrolytic capacitors + CMOS battery ─── */}
      {comp.type === 'BASE_BOARD' && (
        <>
          {/* Row of cylindrical electrolytic capacitors along the front edge */}
          {Array.from({ length: 11 }, (_, i) => {
            const cx = -w * 0.38 + i * (w * 0.76 / 10);
            const ch = 0.28 + (i % 3) * 0.06;
            return (
              <mesh key={`ecap-${i}`} position={[cx, dh / 2 + ch / 2, -d * 0.41]} castShadow>
                <cylinderGeometry args={[0.10, 0.10, ch, 16]} />
                <meshStandardMaterial color="#1c1e24" metalness={0.45} roughness={0.5} />
              </mesh>
            );
          })}
          {/* CMOS coin battery */}
          <mesh position={[w * 0.20, dh / 2 + 0.035, d * 0.30]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.06, 24]} />
            <meshStandardMaterial color="#c6cad0" metalness={0.85} roughness={0.26} />
          </mesh>
        </>
      )}

      {/* ── EXT_BOARD: BMC/CPLD cluster + connector rows (image 5 layout) ─── */}
      {comp.type === 'EXT_BOARD' && extBoardFeatures && (
        <>
          {/* BMC chip with aluminium heat spreader (item 3-4 in image 5) */}
          <group position={[extBoardFeatures.bmcChip.x, dh / 2, extBoardFeatures.bmcChip.z]}>
            <mesh position={[0, 0.14, 0]}>
              <boxGeometry args={[0.80, 0.28, 0.80]} />
              <meshStandardMaterial color="#28282e" metalness={0.62} roughness={0.38} />
            </mesh>
            {/* Heat spreader lid */}
            <mesh position={[0, 0.30, 0]}>
              <boxGeometry args={[0.70, 0.06, 0.70]} />
              <meshStandardMaterial color="#4a4a52" metalness={0.80} roughness={0.28} />
            </mesh>
            {/* Spreader fins */}
            {Array.from({ length: 4 }, (_, fi) => (
              <mesh key={fi} position={[-0.25 + fi * 0.17, 0.34, 0]}>
                <boxGeometry args={[0.03, 0.08, 0.62]} />
                <meshStandardMaterial color="#3a3a42" metalness={0.75} roughness={0.32} />
              </mesh>
            ))}
          </group>

          {/* ── Red/black hot-swap power connector block (mirrored to grip, right) ── */}
          <group position={[w * 0.30, dh / 2, -d * 0.30]}>
            {/* Black housing */}
            <mesh position={[0, 0.26, 0]} castShadow>
              <boxGeometry args={[1.25, 0.52, 0.66]} />
              <meshStandardMaterial color="#111216" metalness={0.32} roughness={0.6} />
            </mesh>
            {/* Red latch/insert */}
            <mesh position={[0.10, 0.34, 0]} castShadow>
              <boxGeometry args={[0.52, 0.40, 0.52]} />
              <meshStandardMaterial color="#b41f24" metalness={0.25} roughness={0.45} />
            </mesh>
            {/* Two silver fixation screws on top */}
            {([-0.42, 0.46] as number[]).map((sx, si) => (
              <mesh key={si} position={[sx, 0.54, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.11, 0.11, 0.08, 16]} />
                <meshStandardMaterial color="#b9bdc6" metalness={0.9} roughness={0.25} />
              </mesh>
            ))}
          </group>

          {/* CPLD chip (item 5 in image 5) */}
          <mesh position={[extBoardFeatures.cpldChip.x, dh / 2 + 0.07, extBoardFeatures.cpldChip.z]}>
            <boxGeometry args={[0.52, 0.13, 0.52]} />
            <meshStandardMaterial color="#0e1012" metalness={0.28} roughness={0.75} />
          </mesh>

          {/* PHY / voltage regulator chip */}
          <mesh position={[extBoardFeatures.phyChip.x, dh / 2 + 0.06, extBoardFeatures.phyChip.z]}>
            <boxGeometry args={[0.42, 0.11, 0.42]} />
            <meshStandardMaterial color="#111318" metalness={0.25} roughness={0.80} />
          </mesh>

          {/* Small power connector pair near front (items 1-2 in image 5) */}
          {([-0.22, 0.22] as number[]).map((xOff, pi) => (
            <mesh key={pi} position={[w * 0.40 + xOff, dh / 2 + 0.10, -d * 0.44]}>
              <boxGeometry args={[0.30, 0.20, 0.18]} />
              <meshStandardMaterial color="#c8a040" metalness={0.88} roughness={0.14} />
            </mesh>
          ))}

          {/* Connector rows along right edge (skip any over the cut-away corner) */}
          {extBoardFeatures.connRows.filter((row) => !inCutCorner(row.xBase, row.z)).map((row, ri) => (
            <group key={`erow-${ri}`} position={[row.xBase, dh / 2 + 0.09, row.z]}>
              {/* 5 connector pins per row */}
              {Array.from({ length: 5 }, (_, pi) => (
                <mesh key={pi} position={[pi * 0.20, 0, 0]}>
                  <boxGeometry args={[0.13, 0.18, 0.10]} />
                  <meshStandardMaterial color="#c0a830" metalness={0.88} roughness={0.14} />
                </mesh>
              ))}
              {/* Connector housing strip */}
              <mesh position={[0.40, -0.02, 0]}>
                <boxGeometry args={[1.10, 0.14, 0.10]} />
                <meshStandardMaterial color="#1a1d24" metalness={0.38} roughness={0.72} />
              </mesh>
            </group>
          ))}
        </>
      )}

      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </group>
  );
}

// ─── BMC Card mesh — plug-in management card with SoC/DDR/Flash/MGMT port ─
// Uses @react-three/drei <RoundedBox> & <Text> (open-source library resources)
function BmcCardMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh = Math.max(h, 0.1);
  const em = statusEmissive(effStatus);

  const pcbTex = useMemo(() => createPCBTexture(hashStr(comp.id)), [comp.id]);
  useEffect(() => () => pcbTex.dispose(), [pcbTex]);

  // Blinking heartbeat LED for BMC status
  const ledRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ledRef.current) return;
    const m = ledRef.current.material as THREE.MeshStandardMaterial;
    const t = clock.getElapsedTime();
    // Double-beat pattern characteristic of BMC status LEDs
    const beat = (Math.sin(t * Math.PI * 2) * 0.5 + 0.5) *
                 (Math.sin(t * Math.PI * 8) * 0.5 + 0.5);
    m.emissiveIntensity = 0.35 + 1.25 * beat;
  });

  // Chip/feature layout: board spans w:5.2, d:12.0 → center at (0,0)
  return (
    <>
      {/* PCB body — dark solder mask (BMC SoM reference is near-black) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, dh, d]} />
        <meshStandardMaterial
          color="#0c1410"
          roughness={0.82}
          metalness={0.16}
          envMapIntensity={0.4}
          emissive={new THREE.Color(em.color)}
          emissiveIntensity={em.intensity}
          opacity={effStatus === 'offline' ? 0.38 : 1}
          transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Top-face PCB texture overlay (subtle, keeps board dark) */}
      <mesh position={[0, dh / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w - 0.06, d - 0.06]} />
        <meshStandardMaterial
          map={pcbTex}
          roughness={0.8}
          metalness={0.12}
          transparent
          opacity={effStatus === 'offline' ? 0.18 : 0.42}
        />
      </mesh>

      {/* ─ BMC SoC (Hi1711-class) — centered, with aluminium IHS and fine fins ─ */}
      <group position={[0, dh / 2, -d * 0.28]}>
        {/* Substrate */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.40, 0.05, 1.40]} />
          <meshStandardMaterial color="#0c0e12" roughness={0.82} metalness={0.12} />
        </mesh>
        {/* SoC die package */}
        <mesh position={[0, 0.10, 0]}>
          <boxGeometry args={[1.05, 0.12, 1.05]} />
          <meshStandardMaterial color="#1a1a22" roughness={0.45} metalness={0.35} />
        </mesh>
        {/* Polished metal IHS lid — bright silver, central (matches reference) */}
        <RoundedBox position={[0, 0.26, 0]} args={[1.30, 0.18, 1.30]} radius={0.05} smoothness={4} castShadow>
          <meshStandardMaterial color="#c4c8d0" metalness={0.9} roughness={0.22} envMapIntensity={1.2} />
        </RoundedBox>
        {/* Recessed top face (the dished IHS look) */}
        <mesh position={[0, 0.355, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.92, 0.92]} />
          <meshStandardMaterial color="#aeb2bb" metalness={0.92} roughness={0.18} />
        </mesh>
      </group>

      {/* ─ DDR / memory packages — large black BGA packages flanking the SoC ─ */}
      {/* Left: two stacked; Right: one tall (matches BMC SoM reference layout). */}
      {([
        [-w * 0.34,  d * 0.16, 0.62, 0.78],
        [-w * 0.34, -d * 0.16, 0.62, 0.78],
        [ w * 0.34,  d * 0.0,  0.66, 1.30],
      ] as [number, number, number, number][]).map(([px, pz, pw, pd], i) => (
        <mesh key={`ddr-${i}`} position={[px, dh / 2 + 0.06, pz]} castShadow>
          <boxGeometry args={[pw, 0.12, pd]} />
          <meshStandardMaterial color="#0e0f13" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      {/* ─ Gold/copper crystals (oscillators) — top corner, reference detail ─ */}
      {([[-w * 0.04, -d * 0.40], [w * 0.10, -d * 0.40]] as [number, number][]).map(([px, pz], i) => (
        <mesh key={`xtal-${i}`} position={[px, dh / 2 + 0.05, pz]} castShadow>
          <boxGeometry args={[0.30, 0.10, 0.22]} />
          <meshStandardMaterial color="#caa14a" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}

      {/* ─ SPI Flash ROM (BMC firmware) ─ */}
      <mesh position={[0, dh / 2 + 0.045, d * 0.02]}>
        <boxGeometry args={[0.34, 0.08, 0.54]} />
        <meshStandardMaterial color="#0f1115" roughness={0.72} metalness={0.12} />
      </mesh>
      <Text
        position={[0, dh / 2 + 0.092, d * 0.02]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.065}
        color="#c8ccd4"
        anchorX="center"
        anchorY="middle"
      >
        FLASH
      </Text>

      {/* ─ MGMT RJ45 GbE port (front-facing) ─ */}
      <group position={[0, dh / 2 + 0.22, d * 0.36]}>
        <mesh>
          <boxGeometry args={[1.00, 0.50, 0.85]} />
          <meshStandardMaterial color="#1a1d24" metalness={0.35} roughness={0.75} />
        </mesh>
        {/* Jack opening */}
        <mesh position={[0, 0.04, 0.43]}>
          <boxGeometry args={[0.75, 0.35, 0.02]} />
          <meshStandardMaterial color="#04060a" roughness={0.9} metalness={0.05} />
        </mesh>
        {/* Link + ACT LEDs (green / amber) */}
        <mesh ref={ledRef} position={[-0.26, 0.18, 0.44]}>
          <boxGeometry args={[0.10, 0.06, 0.012]} />
          <meshStandardMaterial color="#50ffa0" emissive="#20ffb0" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.26, 0.18, 0.44]}>
          <boxGeometry args={[0.10, 0.06, 0.012]} />
          <meshStandardMaterial color="#ffb050" emissive="#ffa830" emissiveIntensity={0.55} />
        </mesh>
      </group>

      {/* ─ VGA (DE-15) debug output, blue shell ─ */}
      <group position={[0, dh / 2 + 0.20, d * 0.18]}>
        <mesh>
          <boxGeometry args={[1.25, 0.42, 0.42]} />
          <meshStandardMaterial color="#1f3a6a" metalness={0.30} roughness={0.68} />
        </mesh>
        {/* Metal shield */}
        <mesh position={[0, 0, 0.21]}>
          <boxGeometry args={[1.20, 0.34, 0.04]} />
          <meshStandardMaterial color="#a8adb3" metalness={0.88} roughness={0.25} />
        </mesh>
      </group>

      {/* ─ Serial/debug header pin row (2×5) ─ */}
      <group position={[-w * 0.30, dh / 2 + 0.035, -d * 0.05]}>
        {Array.from({ length: 10 }, (_, pi) => {
          const col = pi % 2, row = Math.floor(pi / 2);
          return (
            <mesh key={pi} position={[col * 0.09, 0.05, -0.18 + row * 0.09]}>
              <boxGeometry args={[0.05, 0.10, 0.05]} />
              <meshStandardMaterial color="#c8a040" metalness={0.90} roughness={0.14} />
            </mesh>
          );
        })}
        {/* Header base */}
        <mesh position={[0.045, 0.015, -0.09]}>
          <boxGeometry args={[0.20, 0.04, 0.52]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.92} metalness={0.05} />
        </mesh>
      </group>

      {/* ─ Small status LEDs row (heartbeat, error, activity) ─ */}
      {([0, 1, 2] as number[]).map((li) => (
        <mesh key={`sled-${li}`} position={[w * 0.30 - li * 0.22, dh / 2 + 0.04, -d * 0.44]}>
          <boxGeometry args={[0.14, 0.05, 0.08]} />
          <meshStandardMaterial
            color={li === 0 ? '#30ff80' : li === 1 ? '#ff7030' : '#60a8ff'}
            emissive={li === 0 ? '#20ff80' : li === 1 ? '#ff6020' : '#4090ff'}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}

      {/* ─ Card-edge gold fingers (along right edge, facing ext_board) ─ */}
      <mesh position={[w / 2 - 0.02, -dh / 2 + 0.08, 0]}>
        <boxGeometry args={[0.08, 0.14, d * 0.88]} />
        <meshStandardMaterial color="#d4a85a" metalness={0.95} roughness={0.08} envMapIntensity={1.6} />
      </mesh>
      {/* Edge-notch (keying slot) */}
      <mesh position={[w / 2 - 0.02, -dh / 2 + 0.08, 0]}>
        <boxGeometry args={[0.10, 0.16, 0.20]} />
        <meshStandardMaterial color="#05070a" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* ─ "BMC" product silk-screen label on top-left corner ─ */}
      <Text
        position={[-w * 0.32, dh / 2 + 0.005, d * 0.44]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.18}
        color="#c9d6ea"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.006}
        outlineColor="#0b1222"
      >
        BMC
      </Text>

      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </>
  );
}

// ─── CPU bare-die mesh (no heatsink) ─────────────────────────────────────
// Shows the Kunpeng 920 with its Integrated Heat Spreader (IHS) visible.
function CPUMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh = Math.max(h, 0.1);
  const em = statusEmissive(effStatus);
  const meshRef = useRef<THREE.Mesh>(null);

  // Layer heights (bottom→top): LGA pins, substrate PCB, die+IHS, optional label
  const pinH       = 0.03;
  const substrateH = 0.08;
  const ihsH       = dh - pinH - substrateH;          // remaining height for IHS+die stack

  // IHS is slightly smaller than substrate (real CPU look — PCB rim visible)
  const ihsW = w * 0.78;
  const ihsD = d * 0.78;

  useFrame(({ clock }) => {
    if (meshRef.current && effStatus === 'error') {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.1 + 0.25 * Math.abs(Math.sin(clock.getElapsedTime() * Math.PI * 2));
    }
  });

  const baseY     = -dh / 2;
  const pinY      = baseY + pinH / 2;
  const substrateY = baseY + pinH + substrateH / 2;
  const ihsY      = baseY + pinH + substrateH + ihsH / 2;

  return (
    <>
      {/* ── LGA gold contact pad (bottom) ── */}
      <mesh position={[0, pinY, 0]}>
        <boxGeometry args={[w * 0.94, pinH, d * 0.94]} />
        <meshStandardMaterial color="#b8860b" metalness={0.95} roughness={0.12} />
      </mesh>

      {/* ── Substrate PCB (dark green FR-4 with visible rim) ── */}
      <mesh position={[0, substrateY, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, substrateH, d]} />
        <meshStandardMaterial
          color="#14231a" roughness={0.86} metalness={0.08}
          opacity={effStatus === 'offline' ? 0.38 : 1} transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Tiny SMD capacitors on substrate (black, around IHS perimeter) */}
      {([
        [-w * 0.42, -d * 0.32], [-w * 0.42, d * 0.32],
        [w * 0.42, -d * 0.32], [w * 0.42, d * 0.32],
        [-w * 0.32, -d * 0.42], [w * 0.32, d * 0.42],
      ] as [number, number][]).map(([cx, cz], i) => (
        <mesh key={`cap-${i}`} position={[cx, substrateY + substrateH / 2 + 0.015, cz]}>
          <boxGeometry args={[0.10, 0.03, 0.06]} />
          <meshStandardMaterial color="#222" roughness={0.70} metalness={0.20} />
        </mesh>
      ))}

      {/* ── Integrated Heat Spreader (IHS) — brushed nickel-plated copper ── */}
      <RoundedBox
        ref={meshRef as unknown as React.Ref<THREE.Mesh>}
        position={[0, ihsY, 0]}
        args={[ihsW, ihsH, ihsD]}
        radius={0.04}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial
          color="#c4c6cc" metalness={0.92} roughness={0.34}
          emissive={new THREE.Color(em.color)} emissiveIntensity={em.intensity}
          envMapIntensity={1.3}
          opacity={effStatus === 'offline' ? 0.38 : 1} transparent={effStatus === 'offline'}
        />
      </RoundedBox>

      {/* ── Bare silver IHS top (product photos show no heatsink on the board) ─ */}
      {/* Beveled edge accent (slight darker inner rim) */}
      <mesh position={[0, ihsY + ihsH / 2 + 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.min(ihsW, ihsD) * 0.38, Math.min(ihsW, ihsD) * 0.47, 64]} />
        <meshBasicMaterial color="#8a8d93" transparent opacity={0.30} />
      </mesh>
      {/* Laser-etched CPU identification on the IHS top face */}
      <Text
        position={[0, ihsY + ihsH / 2 + 0.002, -d * 0.12]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.30} color="#2a2e34" anchorX="center" anchorY="middle" fontWeight="bold"
      >
        Kunpeng 920
      </Text>
      <Text
        position={[0, ihsY + ihsH / 2 + 0.002, d * 0.10]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.12} color="#454a52" anchorX="center" anchorY="middle"
      >
        {comp.id === 'cpu_0' ? 'SOCKET 0 · 2.6 GHz' : 'SOCKET 1 · 2.6 GHz'}
      </Text>
      {/* Triangle orientation marker on IHS corner */}
      <mesh position={[-ihsW / 2 + 0.16, ihsY + ihsH / 2 + 0.003, -ihsD / 2 + 0.16]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 3]} />
        <meshBasicMaterial color="#2a2e34" />
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

// ─── Fan mesh — TaiShan 200 2280 dual-rotor hot-swap module ───────────────
// Each module houses 2×80mm counter-rotating fans side-by-side (X axis split)
function FANMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;
  const dh    = Math.max(h, 0.1);
  const fanR  = Math.min(w * 0.40, d * 0.42);   // radius for each rotor
  const offX  = w * 0.26;                         // X offset: left fan / right fan
  const blade0Ref = useRef<THREE.Group>(null);
  const blade1Ref = useRef<THREE.Group>(null);

  const bladeGeo = useMemo(() => getFanBladeGeo(fanR), [fanR]);

  const discY = dh / 2 - fanR * 0.05;

  useFrame(() => {
    const spd = effStatus === 'offline' ? 0 : effStatus === 'error' ? 0.008 : 0.055;
    if (blade0Ref.current) blade0Ref.current.rotation.y += spd;
    if (blade1Ref.current) blade1Ref.current.rotation.y -= spd;   // counter-rotate
  });

  return (
    <>
      {/* Module housing — extruded aluminium, dark charcoal */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, dh, d]} />
        <meshStandardMaterial
          color="#252830" metalness={0.42} roughness={0.68}
          emissive={effStatus === 'warning' ? '#F59E0B' : '#000'}
          emissiveIntensity={effStatus === 'warning' ? 0.14 : 0}
          opacity={effStatus === 'offline' ? 0.38 : 1}
          transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Centre divider rib between the two rotors */}
      <mesh position={[0, dh * 0.1, 0]}>
        <boxGeometry args={[0.07, dh * 0.88, d * 0.94]} />
        <meshStandardMaterial color="#30333e" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* ── Left rotor (index 0) ── */}
      <group position={[-offX, 0, 0]}>
        {/* Shroud disc */}
        <mesh position={[0, discY, 0]}>
          <cylinderGeometry args={[fanR, fanR, 0.06, 32]} />
          <meshStandardMaterial color="#1a1c20" metalness={0.35} roughness={0.75} />
        </mesh>
        {/* Guard rings */}
        {[0.44, 0.72, 0.97].map((t, i) => (
          <mesh key={`gl-${i}`} position={[0, discY + 0.05, 0]}>
            <ringGeometry args={[fanR * t - 0.018, fanR * t, 24]} />
            <meshStandardMaterial color="#22252e" side={THREE.DoubleSide} metalness={0.55} roughness={0.45} />
          </mesh>
        ))}
        {/* Guard spokes */}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={`sl-${i}`} position={[0, discY + 0.05, 0]} rotation={[0, (i * Math.PI) / 4, 0]}>
            <planeGeometry args={[0.026, fanR * 2.0]} />
            <meshStandardMaterial color="#22252e" side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* Rotating blade group — CW */}
        {effStatus !== 'offline' && (
          <group ref={blade0Ref} position={[0, discY + 0.01, 0]}>
            <mesh>
              <cylinderGeometry args={[fanR * 0.22, fanR * 0.22, 0.10, 16]} />
              <meshStandardMaterial color="#20222a" metalness={0.45} roughness={0.65} />
            </mesh>
            {Array.from({ length: 5 }, (_, i) => (
              <mesh key={i} geometry={bladeGeo} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
                <meshStandardMaterial color="#1a1c20" metalness={0.3} roughness={0.8} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* ── Right rotor (index 1, counter-rotating) ── */}
      <group position={[+offX, 0, 0]}>
        <mesh position={[0, discY, 0]}>
          <cylinderGeometry args={[fanR, fanR, 0.06, 32]} />
          <meshStandardMaterial color="#1a1c20" metalness={0.35} roughness={0.75} />
        </mesh>
        {[0.44, 0.72, 0.97].map((t, i) => (
          <mesh key={`gr-${i}`} position={[0, discY + 0.05, 0]}>
            <ringGeometry args={[fanR * t - 0.018, fanR * t, 24]} />
            <meshStandardMaterial color="#22252e" side={THREE.DoubleSide} metalness={0.55} roughness={0.45} />
          </mesh>
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={`sr-${i}`} position={[0, discY + 0.05, 0]} rotation={[0, (i * Math.PI) / 4, 0]}>
            <planeGeometry args={[0.026, fanR * 2.0]} />
            <meshStandardMaterial color="#22252e" side={THREE.DoubleSide} />
          </mesh>
        ))}
        {effStatus !== 'offline' && (
          <group ref={blade1Ref} position={[0, discY + 0.01, 0]}>
            <mesh>
              <cylinderGeometry args={[fanR * 0.22, fanR * 0.22, 0.10, 16]} />
              <meshStandardMaterial color="#20222a" metalness={0.45} roughness={0.65} />
            </mesh>
            {Array.from({ length: 5 }, (_, i) => (
              <mesh key={i} geometry={bladeGeo} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
                <meshStandardMaterial color="#1a1c20" metalness={0.3} roughness={0.8} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* Hot-swap handle strip — front face bottom edge */}
      <mesh position={[0, -dh / 2 + 0.07, -d / 2 + 0.04]}>
        <boxGeometry args={[w * 0.88, 0.14, 0.09]} />
        <meshStandardMaterial color="#3a3d4a" metalness={0.60} roughness={0.50} />
      </mesh>

      {/* Status LED on handle */}
      <mesh position={[w * 0.36, -dh / 2 + 0.07, -d / 2 + 0.09]}>
        <boxGeometry args={[0.08, 0.08, 0.015]} />
        <meshStandardMaterial
          color={effStatus === 'error' ? '#ff3333' : effStatus === 'warning' ? '#ff9900' : '#00dd55'}
          emissive={effStatus === 'error' ? '#ff3333' : effStatus === 'warning' ? '#ff9900' : '#00dd55'}
          emissiveIntensity={effStatus === 'offline' ? 0 : 0.85}
        />
      </mesh>

      {/* Corner retention screws */}
      {[[-w / 2 + 0.12, -d / 2 + 0.12], [w / 2 - 0.12, -d / 2 + 0.12],
        [-w / 2 + 0.12,  d / 2 - 0.12], [w / 2 - 0.12,  d / 2 - 0.12]].map(([sx, sz], i) => (
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
  const ledRef  = useRef<THREE.Mesh>(null);

  const labelTex = useMemo(() => createHDDLabelTexture(comp.labelEn), [comp.labelEn]);
  useEffect(() => () => labelTex.dispose(), [labelTex]);

  useFrame(({ clock }) => {
    if (meshRef.current && effStatus === 'error') {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.12 + 0.22 * Math.abs(Math.sin(clock.getElapsedTime() * Math.PI * 2));
    }
    if (ledRef.current && effStatus !== 'offline') {
      const ledMat = ledRef.current.material as THREE.MeshStandardMaterial;
      ledMat.emissiveIntensity = effStatus === 'error'
        ? 0.95
        : 0.28 + 0.67 * (Math.sin(clock.getElapsedTime() * 7.5) > 0 ? 1 : 0);
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

      {/* Activity LED — front face, blinks blue (or red on error) */}
      <mesh ref={ledRef} position={[w * 0.43, dh * 0.32, -d / 2 - 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 0.012, 8]} />
        <meshStandardMaterial
          color={effStatus === 'error' ? '#ef4444' : '#3b82f6'}
          emissive={effStatus === 'error' ? '#ef4444' : '#3b82f6'}
          emissiveIntensity={0.85}
        />
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

      {/* Model label plate — brushed silver badge on front face */}
      <mesh position={[w * 0.22, dh * 0.36, -d / 2 - 0.009]}>
        <boxGeometry args={[w * 0.38, dh * 0.14, 0.009]} />
        <meshStandardMaterial color="#c0c4cc" metalness={0.82} roughness={0.22} />
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

  // Port definitions — each with its own realistic color
  const ports = [
    { x: -w * 0.35, pw: w * 0.13, ph: dh * 0.35, color: '#1435c8' },  // USB-A #1 blue
    { x: -w * 0.15, pw: w * 0.13, ph: dh * 0.35, color: '#1435c8' },  // USB-A #2 blue
    { x:  w * 0.05, pw: w * 0.18, ph: dh * 0.50, color: '#1a1e25' },  // RJ45 near-black
    { x:  w * 0.30, pw: w * 0.12, ph: dh * 0.28, color: '#162065' },  // VGA dark blue
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

      {/* Port cutouts / connectors (front face, color-coded by type) */}
      {ports.map((p, i) => (
        <mesh key={i} position={[p.x, 0, -d / 2 - 0.008]}>
          <boxGeometry args={[p.pw, p.ph, 0.015]} />
          <meshStandardMaterial color={p.color} metalness={0.30} roughness={0.55} />
        </mesh>
      ))}

      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </>
  );
}

// ─── NVMe mesh — U.2 NVMe SSD (PCIe Gen4 ×4) ─────────────────────────────
function NVMEMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;   // w:3.2 d:1.8 h:0.8 → box [3.2, 0.8, 1.8]
  const dh  = Math.max(h, 0.1);
  const em  = statusEmissive(effStatus);
  const ledRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ledRef.current || effStatus === 'offline') return;
    const t   = clock.getElapsedTime();
    const mat = ledRef.current.material as THREE.MeshStandardMaterial;
    const hz  = effStatus === 'warning' ? 2.0 : 4.5;
    const blink = 0.25 + 0.75 * Math.abs(Math.sin(t * Math.PI * hz));
    const col = effStatus === 'error' ? '#ff2200'
      : effStatus === 'warning' ? '#ffaa00' : '#1155ff';
    mat.color.set(col);
    mat.emissive.set(col);
    mat.emissiveIntensity = blink * 0.9;
  });

  return (
    <>
      {/* Heat-spreader body — brushed dark aluminium */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, dh, d]} />
        <meshStandardMaterial
          color="#292e3a" metalness={0.72} roughness={0.26}
          emissive={new THREE.Color(em.color)} emissiveIntensity={em.intensity}
          opacity={effStatus === 'offline' ? 0.38 : 1} transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Top label plate */}
      <mesh position={[0, dh / 2 + 0.001, d * 0.05]}>
        <planeGeometry args={[w * 0.86, d * 0.70]} />
        <meshStandardMaterial color="#1c1f2b" metalness={0.15} roughness={0.88} />
      </mesh>

      {/* PCIe NVMe brand stripe */}
      <mesh position={[0, dh / 2 + 0.002, d * 0.28]}>
        <planeGeometry args={[w * 0.65, 0.055]} />
        <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.38} />
      </mesh>
      <mesh position={[0, dh / 2 + 0.002, d * 0.35]}>
        <planeGeometry args={[w * 0.65, 0.028]} />
        <meshStandardMaterial color="#7a5aaa" emissive="#7a5aaa" emissiveIntensity={0.18} />
      </mesh>

      {/* U.2 connector strip — rear face */}
      <mesh position={[0, -dh / 2 + 0.065, d / 2 - 0.008]}>
        <boxGeometry args={[w * 0.80, 0.13, 0.022]} />
        <meshStandardMaterial color="#c8a040" metalness={0.92} roughness={0.13} />
      </mesh>
      {/* Connector teeth */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[-w * 0.36 + i * (w * 0.72 / 12), -dh / 2 + 0.065, d / 2 - 0.005]}>
          <boxGeometry args={[0.022, 0.10, 0.016]} />
          <meshStandardMaterial color="#b08830" metalness={0.95} roughness={0.08} />
        </mesh>
      ))}

      {/* Activity LED — front face top-right corner */}
      <mesh ref={ledRef} position={[w * 0.41, dh / 2 - 0.09, -d / 2 + 0.008]}>
        <boxGeometry args={[0.07, 0.07, 0.012]} />
        <meshStandardMaterial color="#1155ff" emissive="#1155ff" emissiveIntensity={0.65} roughness={0.1} />
      </mesh>

      {/* Side heat-fin grooves (pairs of thin ridges) */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, dh / 2 + 0.001, -d * 0.42 + i * (d * 0.84 / 4)]}>
          <boxGeometry args={[w + 0.002, 0.012, 0.018]} />
          <meshStandardMaterial color="#333848" metalness={0.65} roughness={0.38} />
        </mesh>
      ))}

      <StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />
    </>
  );
}

// ─── NIC card mesh — OCP 3.0 NIC (4×25GbE SFP28) ─────────────────────────
function NicCardMesh({ comp, isSelected, effStatus }: SpecProps) {
  const { w, d, h } = comp.size;   // w:5.5 d:0.5 h:2.1
  const dh = Math.max(h, 0.1);
  const em = statusEmissive(effStatus);

  // 4 SFP28 cages, evenly spaced along the card face
  const sfpW = 0.38, sfpH = 0.30, sfpD = 0.06;
  const sfpSpacing = w / 5.0;
  const sfpXBase   = -w * 0.30;

  return (
    <>
      {/* PCB card body — dark FR4 green */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, dh, d]} />
        <meshStandardMaterial
          color="#192018" metalness={0.22} roughness={0.72}
          emissive={new THREE.Color(em.color)} emissiveIntensity={em.intensity}
          opacity={effStatus === 'offline' ? 0.38 : 1} transparent={effStatus === 'offline'}
        />
      </mesh>

      {/* Faceplate — brushed silver aluminium bracket */}
      <mesh position={[0, 0, -d / 2 + 0.012]}>
        <boxGeometry args={[w, dh * 0.92, 0.024]} />
        <meshStandardMaterial color="#2c3040" metalness={0.68} roughness={0.32} />
      </mesh>

      {/* 4× SFP28 cage openings */}
      {Array.from({ length: 4 }, (_, i) => (
        <group key={i} position={[sfpXBase + i * sfpSpacing, dh * 0.10, -d / 2 + 0.015]}>
          {/* Cage shell */}
          <mesh>
            <boxGeometry args={[sfpW, sfpH, sfpD]} />
            <meshStandardMaterial color="#101418" metalness={0.52} roughness={0.58} />
          </mesh>
          {/* Dark port recess */}
          <mesh position={[0, 0, -sfpD / 2 - 0.001]}>
            <boxGeometry args={[sfpW * 0.70, sfpH * 0.60, 0.008]} />
            <meshStandardMaterial color="#040507" roughness={0.92} metalness={0.08} />
          </mesh>
          {/* Link/activity LED — top-right of cage */}
          <mesh position={[sfpW * 0.28, sfpH * 0.54, 0]}>
            <boxGeometry args={[0.045, 0.045, sfpD + 0.004]} />
            <meshStandardMaterial
              color={effStatus === 'normal' ? '#00cc44' : effStatus === 'warning' ? '#ffaa00' : '#222'}
              emissive={effStatus === 'normal' ? '#00cc44' : effStatus === 'warning' ? '#ffaa00' : '#000'}
              emissiveIntensity={effStatus === 'offline' ? 0 : 0.72}
            />
          </mesh>
        </group>
      ))}

      {/* PCIe gold edge connector */}
      <mesh position={[0, -dh / 2 + 0.065, 0]}>
        <boxGeometry args={[w * 0.84, 0.13, d * 0.82]} />
        <meshStandardMaterial color="#c8a040" metalness={0.93} roughness={0.11} />
      </mesh>
      {/* Connector finger teeth */}
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} position={[-w * 0.40 + i * (w * 0.80 / 16), -dh / 2 + 0.065, 0]}>
          <boxGeometry args={[0.022, 0.135, d * 0.68]} />
          <meshStandardMaterial color="#b09030" metalness={0.96} roughness={0.07} />
        </mesh>
      ))}

      {/* Small PCB SMD components on face */}
      {[[-w * 0.38, dh * 0.38], [w * 0.22, dh * 0.38],
        [-w * 0.10, -dh * 0.15], [w * 0.38, -dh * 0.20]].map(([cx, cy], i) => (
        <mesh key={i} position={[cx, cy, d / 2 + 0.001]}>
          <boxGeometry args={[0.14, 0.12, 0.02]} />
          <meshStandardMaterial color="#0a0c10" roughness={0.85} metalness={0.15} />
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

  // Catalog-linked real model: render the installed GLB instead of procedural
  // mesh when one is present (model-registry auto-detects by part id).
  const catalogPart = comp.catalogId ? getPartById(comp.catalogId) : undefined;
  const useGLB = !!(catalogPart && hasPartModel(catalogPart.id));
  const glbStatus =
    effStatus === 'warning' || effStatus === 'error' || effStatus === 'offline'
      ? effStatus : 'normal';

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
      {/* Real open-source GLB model (catalog-driven), else procedural per-type mesh */}
      {useGLB ? (
        <CatalogPartModel part={catalogPart!} status={glbStatus} />
      ) : (
        <>
          {(comp.type === 'BASE_BOARD' || comp.type === 'EXT_BOARD' || comp.type === 'RISER')
            && <PCBMesh    {...specProps} />}
          {comp.type === 'BMC_CARD' && <BmcCardMesh  {...specProps} />}
          {comp.type === 'CPU'      && <CPUMesh      {...specProps} />}
          {comp.type === 'FAN'      && <FANMesh      {...specProps} />}
          {comp.type === 'HDD'      && <HDDMesh      {...specProps} />}
          {comp.type === 'NVME'     && <NVMEMesh     {...specProps} />}
          {comp.type === 'PSU'      && <PSUMesh      {...specProps} />}
          {comp.type === 'NIC_CARD' && <NicCardMesh  {...specProps} />}
          {comp.type === 'IO_PANEL' && <IOPanelMesh  {...specProps} />}
          {comp.type === 'EEPROM'   && <GenericMesh  {...specProps} />}
        </>
      )}

      {/* Selection highlight: blue stroke + translucent blue fill (spec §8).
          keepMaterial so the unified-material traverse leaves it blue. */}
      {isSelected && (
        <group userData={{ keepMaterial: true }}>
          <mesh>
            <boxGeometry args={[w + 0.14, dh + 0.14, d + 0.14]} />
            <meshBasicMaterial color="#2F6BFF" transparent opacity={0.12} depthWrite={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(w + 0.14, dh + 0.14, d + 0.14)]} />
            <lineBasicMaterial color="#2F6BFF" transparent opacity={0.95} />
          </lineSegments>
        </group>
      )}

      {/* Label — a TRUE surface-attached 3D label (drei <Text> + plane pill):
          lies flat on the top face, runs parallel to the part's left edge, and
          rotates with the scene (never billboards to the camera). Pinned at the
          lower-left top corner. Black #1A1B1F / white text (spec §3.4/§7).
          keepMaterial → excluded from the unified-material + edge-outline pass. */}
      {(() => {
        const fs   = 0.46;
        const lw   = 0.6 + comp.labelEn.length * fs * 0.6; // pill width
        const lh   = 0.74;
        const dotC = effStatus === 'error' ? '#ef4444'
          : effStatus === 'warning' ? '#f59e0b'
          : effStatus === 'offline' ? '#6b7280' : '#4ade80';
        return (
          <group position={[-w / 2, dh / 2 + 0.02, d / 2]} rotation={[0, Math.PI / 2, 0]}>
            {/* flatten onto the top face; label runs along this group's +X */}
            <group rotation={[-Math.PI / 2, 0, 0]} userData={{ keepMaterial: true }}>
              {/* pill background (anchored from left edge at x=0) */}
              <mesh position={[lw / 2, 0, -0.01]}>
                <planeGeometry args={[lw, lh]} />
                <meshBasicMaterial color={isSelected ? '#1f3a66' : '#1A1B1F'} transparent opacity={0.92} />
              </mesh>
              {/* status dot */}
              <mesh position={[0.32, 0, 0.01]}>
                <circleGeometry args={[0.11, 18]} />
                <meshBasicMaterial color={dotC} />
              </mesh>
              <Text
                position={[0.58, 0, 0.01]}
                fontSize={fs}
                color="#ffffff"
                anchorX="left"
                anchorY="middle"
              >
                {comp.labelEn}
              </Text>
            </group>
          </group>
        );
      })()}
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
  uniform float uTotalLen;
  uniform float uOffset;
  uniform float uOpacity;
  uniform float uActive;
  varying float vArcLen;
  void main() {
    // Solid colored line (reference style) + a moving "comet" highlight when active.
    vec3 col = uColor;
    float pos  = fract(vArcLen * uTotalLen * 0.45 - uOffset);
    float band = smoothstep(0.0, 0.03, pos) * (1.0 - smoothstep(0.03, 0.13, pos));
    col = mix(col, vec3(1.0), band * uActive * 0.55);
    gl_FragColor = vec4(col, uOpacity);
  }
`;

// Build a CurvePath that keeps straight (manhattan) segments but rounds every
// interior corner with a quadratic fillet — the clean piped look of the ref.
function roundedCurve3(pts: THREE.Vector3[], radius: number): THREE.CurvePath<THREE.Vector3> {
  const cp = new THREE.CurvePath<THREE.Vector3>();
  if (pts.length < 2) return cp;
  if (pts.length === 2) { cp.add(new THREE.LineCurve3(pts[0].clone(), pts[1].clone())); return cp; }
  let from = pts[0].clone();
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const dIn  = p.clone().sub(pts[i - 1]); const lIn  = dIn.length() || 1;  dIn.normalize();
    const dOut = pts[i + 1].clone().sub(p); const lOut = dOut.length() || 1; dOut.normalize();
    const r = Math.min(radius, lIn * 0.5, lOut * 0.5);
    const cStart = p.clone().addScaledVector(dIn, -r);
    const cEnd   = p.clone().addScaledVector(dOut, r);
    cp.add(new THREE.LineCurve3(from.clone(), cStart));
    cp.add(new THREE.QuadraticBezierCurve3(cStart, p.clone(), cEnd));
    from = cEnd;
  }
  cp.add(new THREE.LineCurve3(from.clone(), pts[pts.length - 1].clone()));
  return cp;
}

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
  const tubeR     = isTrunk ? 0.05 : 0.038;

  // Manhattan path with rounded fillet corners (clean piped look).
  const { curvePath, totalLen, divisions } = useMemo(() => {
    const cp = roundedCurve3(points, isTrunk ? 0.24 : 0.18);
    return {
      curvePath: cp,
      totalLen:  Math.max(cp.getLength(), 0.01),
      divisions: Math.max(points.length * 16, 48),
    };
  }, [points, isTrunk]);

  // TubeGeometry, radial 7 for a smooth round tube
  const tubeGeo = useMemo(
    () => new THREE.TubeGeometry(curvePath, divisions, tubeR, 7, false),
    [curvePath, divisions, tubeR],
  );
  useEffect(() => () => tubeGeo.dispose(), [tubeGeo]);

  // ShaderMaterial — solid line + optional moving highlight
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   DASH_VERT,
    fragmentShader: DASH_FRAG,
    uniforms: {
      uColor:    { value: new THREE.Color(effColor) },
      uTotalLen: { value: totalLen },
      uOffset:   { value: 0 },
      uOpacity:  { value: alpha },
      uActive:   { value: isActive ? 1 : 0 },
    },
    transparent: true,
    depthWrite:  false,
    side: THREE.DoubleSide,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);
  useEffect(() => () => mat.dispose(), [mat]);

  // Keep color/length/active uniforms in sync
  useEffect(() => {
    mat.uniforms.uColor.value.set(effColor);
    mat.uniforms.uTotalLen.value = totalLen;
    mat.uniforms.uActive.value = isActive ? 1 : 0;
  }, [effColor, totalLen, isActive, mat]);

  // Per-frame: scroll the highlight + smoothly ease opacity toward the target
  // (so the hover→solid / unhover→transparent transition is gentle).
  useFrame(({ clock }) => {
    if (isActive) mat.uniforms.uOffset.value -= 0.012;
    const target = isError
      ? 0.45 + 0.5 * Math.abs(Math.sin(clock.getElapsedTime() * Math.PI * 2))
      : alpha;
    const u = mat.uniforms.uOpacity;
    u.value += (target - u.value) * 0.18;
  });

  const first = points[0];
  const last  = points[points.length - 1];
  const padW  = isTrunk ? 0.5 : 0.4;   // endpoint pad size
  const padH  = isTrunk ? 0.34 : 0.28;
  const dotR  = isTrunk ? 0.075 : 0.055;
  const padOpacity = Math.min(alpha * 0.7 + 0.12, 0.6);

  return (
    <group
      userData={{ keepMaterial: true }}
      onClick={(e: { stopPropagation: () => void }) => { e.stopPropagation(); onClickBus(); }}
    >
      {/* Solid tube body */}
      <mesh geometry={tubeGeo} material={mat} />

      {/* Endpoint connection pads — flat rounded pads in the line's own color */}
      {[first, last].map((pt, i) => (
        <group key={i} position={[pt.x, pt.y + 0.012, pt.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <planeGeometry args={[padW, padH]} />
            <meshBasicMaterial color={effColor} transparent opacity={padOpacity} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0, 0.004]}>
            <circleGeometry args={[dotR, 18]} />
            <meshBasicMaterial color={effColor} transparent opacity={Math.min(alpha + 0.25, 1)} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BusLines({ bus, members }: { bus: BusDef; members: HardwareComponent[] }) {
  const selectedBusId          = useSimStore(s => s.selectedBusId);
  const highlightedConnections = useSimStore(s => s.highlightedConnections);
  const selectBus              = useSimStore(s => s.selectBus);
  const highlightConnections   = useSimStore(s => s.highlightConnections);

  const selectedCompId = useSimStore(s => s.selectedId);
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedBusId === bus.id;
  const highlighted = highlightedConnections.length === 0 || highlightedConnections.includes(bus.id);
  // Connection highlight (spec §8): when a component is selected, only the
  // buses it connects to stay lit; everything else dims hard.
  const compSelected   = !!selectedCompId;
  const busHasSelected = !!selectedCompId && members.some(m => m.id === selectedCompId);
  const baseAlpha =
      isSelected      ? 1.0
    : busHasSelected  ? 0.95
    : compSelected    ? 0.06            // a component is selected, this bus is unrelated
    : highlighted     ? 0.30            // default resting transparency
    :                   0.13;
  const alpha = hovered ? 1.0 : baseAlpha;
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
    <group
      onPointerOver={(e: { stopPropagation: () => void }) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
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
    const handle = () => { camera.position.set(...CAM_POS); };
    window.addEventListener('sim:resetCamera', handle);
    return () => window.removeEventListener('sim:resetCamera', handle);
  }, [camera]);
  return null;
}

// ─── Scene lights (flat-isometric: hemisphere + 1 soft key) ──────────────
function SceneLights() {
  return (
    <>
      {/* Hemisphere — bright white sky, light-grey ground; gives a natural
          top-near-white / side-greyer gradient on the white parts. */}
      <hemisphereLight args={['#ffffff', '#ccd0db', 1.45]} />

      {/* Single soft key light from upper-left, ~45° — defines top vs side.
          Casts a gentle contact shadow only (no hard projection look). */}
      <directionalLight
        position={[-14, 24, 10]}
        intensity={0.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={FOG_FAR + 40}
        shadow-camera-left={-SHADOW_EXTENT}
        shadow-camera-right={SHADOW_EXTENT}
        shadow-camera-top={SHADOW_EXTENT}
        shadow-camera-bottom={-SHADOW_EXTENT}
        shadow-bias={-0.0015}
      />

      {/* Tiny ambient top-up so the lightest faces read near-white. */}
      <ambientLight intensity={0.25} color="#ffffff" />
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

// ─── Server chassis wireframe outline ────────────────────────────────────
// Wraps the full component envelope at real 2U proportions:
// TaiShan 2280 = 86.1mm (H, 2U) × 447mm (W) × 748mm (D).
// Width/depth come from the live scene bounds (_sceneW/_sceneD, already
// centered at origin); height is the true 2U = 86.1/20 ≈ 4.3 scene units.
const CHASSIS_H = 86.1 / 20;
function ServerChassis() {
  const geo = useMemo(
    () => new THREE.EdgesGeometry(
      new THREE.BoxGeometry(_sceneW + 1.2, CHASSIS_H, _sceneD + 1.2),
    ),
    [],
  );
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <group position={[0, CHASSIS_H / 2 - 0.2, 0]}>
      <lineSegments geometry={geo}>
        <lineBasicMaterial color="#7a9abe" opacity={0.40} transparent />
      </lineSegments>
    </group>
  );
}

// ─── Unified material ─────────────────────────────────────────────────────
// Every component mesh (procedural OR open-source GLB) renders in this single
// neutral material — matching the clean monochrome look of the 3D仿真 boards
// viewer — so the imported models no longer clash with each other.
const UNIFIED_MAT = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#ffffff'),   // pure white; top/side shading comes from lighting
  metalness: 0.0,                       // flat — no metallic reflection
  roughness: 1.0,
  emissive: new THREE.Color('#000000'),
  envMapIntensity: 0.0,
});

// Thin light-grey edge outline (spec §3.2 --part-outline #C7CAD6) — added to
// every part mesh so white parts/sub-parts keep crisp boundaries on white bg.
const OUTLINE_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#B9BDCC'),
  transparent: true,
  opacity: 0.9,
});

// ─── Main scene ───────────────────────────────────────────────────────────
function Scene({ onTooltip }: { onTooltip: (info: TooltipInfo | null) => void }) {
  const snapshotTimer = useRef(0);
  const tAcc          = useRef(0);

  useFrame((state, delta) => {
    // Unify every component mesh to one neutral material. Skips: lines (grid,
    // outlines — not meshes), the shadow-catcher plane, the bus dashed tubes
    // (ShaderMaterial) and anything under a group flagged keepMaterial (the
    // I2C/PCIe/SATA bus routes + their connector cubes keep their colored,
    // flowing style).
    const toOutline: THREE.Mesh[] = [];
    state.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as (THREE.Material & { isShadowMaterial?: boolean; isShaderMaterial?: boolean }) | undefined;
      if (!mat || mat.isShadowMaterial || mat.isShaderMaterial) return;
      for (let p: THREE.Object3D | null = o; p; p = p.parent) {
        if (p.userData && p.userData.keepMaterial) return;
      }
      if (m.material !== UNIFIED_MAT) m.material = UNIFIED_MAT;
      if (!m.userData.__outlined && m.geometry) toOutline.push(m);
    });
    // One-time: give each part mesh a crisp light-grey edge outline (down to
    // sub-parts). Done after traversal so we don't mutate during iteration.
    for (const m of toOutline) {
      m.userData.__outlined = true;
      try {
        const eg = new THREE.EdgesGeometry(m.geometry as THREE.BufferGeometry, 35);
        const ls = new THREE.LineSegments(eg, OUTLINE_MAT);
        ls.userData.isOutline = true;
        ls.renderOrder = 2;
        m.add(ls);
      } catch { /* geometry without index/position — skip */ }
    }

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
      {/* BusGlowLights removed — parts stay pure monochrome (color only on wires). */}

      {/* No environment map — flat stylized look (no metallic reflections). */}

      {/* Chassis wireframe removed — clean monochrome look, no outer box. */}

      {/* ── Flat-isometric floor grid (light spec colors) ── */}
      <gridHelper args={[600, 300, '#D5D8E4', '#E0E2EC']} position={[0, -0.02, 0]} />
      {/* Soft contact shadow only (no hard projection) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
        <planeGeometry args={[120, 120]} />
        <shadowMaterial transparent opacity={0.12} />
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
        orthographic
        camera={{ position: CAM_POS, zoom: 12, near: -2000, far: 4000 }}
        shadows
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
        dpr={[1, 2]}
        style={{ background: '#F3F4F8' }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        onPointerMissed={() => useSimStore.getState().deselectAll()}
      >
        <color attach="background" args={['#F3F4F8']} />
        {/* Subtle fade so the grid dissolves at the edges (flat-iso look) */}
        <fog attach="fog" color="#F3F4F8" near={FOG_FAR * 2.0} far={FOG_FAR * 5.0} />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={8}
          maxDistance={_camDist * 2.2}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2.1}
          target={CAM_TARGET}
        />

        <Scene onTooltip={handleTooltip} />
      </Canvas>

      <TooltipOverlay info={tooltip} />
    </div>
  );
}
