#!/usr/bin/env node
/**
 * gen-psu-glb.mjs — parametrically generate a server PSU (CRPS form factor) GLB.
 *
 * This is the "vibecoding / CadQuery-style" path: when no openly-licensed GLB is
 * downloadable, we GENERATE a real glTF binary from code. The output is a true
 * .glb that loads through the same useGLTF pipeline as a downloaded model, and
 * can be swapped for a real one later (just replace the file).
 *
 * Geometry models a CRPS 1U redundant PSU: ~73.5 × 40 × 185 mm
 * (matches catalog part `psu-delta-dps800-800w`).
 *
 * Run:  node scripts/gen-psu-glb.mjs
 * Out:  public/3d-viewer/models/psu-server-crps.glb
 */
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Node polyfills GLTFExporter expects in a browser ──────────────────────────
class FileReaderPolyfill {
  constructor() { this._listeners = {}; }
  addEventListener(type, fn) { (this._listeners[type] ||= []).push(fn); }
  _emit(type, ev) {
    this[`on${type}`]?.(ev);
    (this._listeners[type] || []).forEach((fn) => fn(ev));
  }
  readAsArrayBuffer(blob) {
    Promise.resolve(blob.arrayBuffer()).then((buf) => {
      this.result = buf;
      const ev = { target: this };
      this._emit('load', ev);
      this._emit('loadend', ev);
    }).catch((error) => {
      this.error = error;
      this._emit('error', { target: this });
    });
  }
  readAsDataURL(blob) {
    Promise.resolve(blob.arrayBuffer()).then((buf) => {
      this.result = 'data:application/octet-stream;base64,' + Buffer.from(buf).toString('base64');
      const ev = { target: this };
      this._emit('load', ev);
      this._emit('loadend', ev);
    });
  }
}
globalThis.FileReader = globalThis.FileReader ?? FileReaderPolyfill;

const __dirname = dirname(fileURLToPath(import.meta.url));
// Output named by part id so the model-registry auto-detects it (one-click swap).
const OUT = resolve(__dirname, '../src/sim/hardware-library/models/psu-delta-dps800ab-800w.glb');

// 1 scene unit = 20 mm (matches src/sim/hardware-library/types.ts MM_PER_SCENE_UNIT)
const U = (mm) => mm / 20;

// ── Dimensions (mm) ───────────────────────────────────────────────────────────
const W = 73.5, H = 40, D = 185;

// ── Materials ─────────────────────────────────────────────────────────────────
const matBody    = new THREE.MeshStandardMaterial({ color: 0x24272e, metalness: 0.45, roughness: 0.62 });
const matDark    = new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.5,  roughness: 0.6 });
const matGrille  = new THREE.MeshStandardMaterial({ color: 0x05060a, metalness: 0.3,  roughness: 0.8 });
const matHandle  = new THREE.MeshStandardMaterial({ color: 0x9aa0ab, metalness: 0.6,  roughness: 0.45 });
const matLabel   = new THREE.MeshStandardMaterial({ color: 0x9097a3, metalness: 0.2,  roughness: 0.75 });
const matGold    = new THREE.MeshStandardMaterial({ color: 0xc9a13b, metalness: 0.95, roughness: 0.18 });
const matConn    = new THREE.MeshStandardMaterial({ color: 0x0c0d10, metalness: 0.2,  roughness: 0.8 });
const matLED     = new THREE.MeshStandardMaterial({ color: 0x16ff9c, emissive: 0x16ff9c, emissiveIntensity: 1.4, roughness: 0.4 });

const root = new THREE.Group();
root.name = 'PSU_CRPS';
const add = (geo, mat, pos, rot) => {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  m.castShadow = true; m.receiveShadow = true;
  root.add(m);
  return m;
};

// ── Main housing ──────────────────────────────────────────────────────────────
add(new THREE.BoxGeometry(U(W), U(H), U(D)), matBody);

// Top label (small spec sticker, not a full-lid plate)
add(new THREE.BoxGeometry(U(W * 0.42), U(0.5), U(D * 0.28)), matLabel, [U(8), U(H / 2) + U(0.2), U(20)]);

// ── Front face (+Z): fan intake + handle + LED ────────────────────────────────
const frontZ = U(D / 2);

// Recessed fan bore
add(new THREE.CylinderGeometry(U(17), U(17), U(2), 32), matGrille,
    [U(-12), 0, frontZ - U(1)], [Math.PI / 2, 0, 0]);
// Fan hub
add(new THREE.CylinderGeometry(U(5), U(5), U(3), 20), matDark,
    [U(-12), 0, frontZ - U(0.5)], [Math.PI / 2, 0, 0]);
// Grille spokes (radial bars)
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI;
  add(new THREE.BoxGeometry(U(33), U(0.8), U(1)), matBody,
      [U(-12), 0, frontZ - U(0.3)], [0, 0, a]);
}
// Grille rim
add(new THREE.TorusGeometry(U(17), U(1.2), 12, 36), matBody,
    [U(-12), 0, frontZ - U(0.3)]);

// Pull handle (vertical bar on right side of front)
add(new THREE.BoxGeometry(U(3), U(H * 0.7), U(2.5)), matHandle, [U(22), 0, frontZ + U(1.2)]);
add(new THREE.BoxGeometry(U(3), U(3), U(5)), matHandle, [U(22), U(13), frontZ - U(1.5)]);
add(new THREE.BoxGeometry(U(3), U(3), U(5)), matHandle, [U(22), U(-13), frontZ - U(1.5)]);

// Status LED
add(new THREE.BoxGeometry(U(2), U(2), U(1)), matLED, [U(8), U(13), frontZ + U(0.4)]);
// AC inlet (IEC) — black recess with prongs
add(new THREE.BoxGeometry(U(14), U(11), U(3)), matConn, [U(8), U(-8), frontZ - U(1)]);

// ── Rear face (-Z): gold power blade connector ────────────────────────────────
const rearZ = -U(D / 2);
add(new THREE.BoxGeometry(U(W * 0.85), U(H * 0.6), U(4)), matConn, [0, 0, rearZ + U(2)]);
// Gold blades
for (let i = 0; i < 6; i++) {
  add(new THREE.BoxGeometry(U(7), U(H * 0.5), U(1)), matGold,
      [U(-26 + i * 10.5), 0, rearZ + U(0.5)]);
}

// ── Side ventilation slots ────────────────────────────────────────────────────
for (let i = 0; i < 10; i++) {
  add(new THREE.BoxGeometry(U(0.6), U(H * 0.6), U(6)), matGrille,
      [U(W / 2) - U(0.2), 0, U(-60 + i * 12)], [0, 0, 0]);
}

// ── Export ────────────────────────────────────────────────────────────────────
mkdirSync(dirname(OUT), { recursive: true });
const exporter = new GLTFExporter();

try {
  const result = await exporter.parseAsync(root, { binary: true });
  if (!(result instanceof ArrayBuffer)) {
    throw new Error('expected ArrayBuffer (binary), got ' + typeof result);
  }
  const buf = Buffer.from(result);
  writeFileSync(OUT, buf);
  console.log(`✓ 生成: ${OUT}  (${(buf.length / 1024).toFixed(1)} KB)`);
  console.log(`\n文件名 = part id「psu-delta-dps800ab-800w」，model-registry 自动加载，无需改代码。`);
} catch (err) {
  console.error('✗ 导出失败:', err);
  process.exit(1);
}
