#!/usr/bin/env node
/**
 * step-to-glb.mjs — convert a STEP file to an optimized GLB, fully headless.
 *
 * Uses occt-import-js (OpenCASCADE WASM) to tessellate the STEP solids, then
 * three.js GLTFExporter to write a binary GLB. No FreeCAD / Blender needed.
 *
 * Usage:
 *   node scripts/step-to-glb.mjs <input.step> <part-id>
 *
 * Output: src/sim/hardware-library/models/<part-id>.glb
 *         → auto-detected by model-registry (one-click swap, no code edits).
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const require = createRequire(import.meta.url);
const occtimportjs = require('occt-import-js');

// ── GLTFExporter needs a browser FileReader for its binary path ───────────────
class FileReaderPolyfill {
  constructor() { this._l = {}; }
  addEventListener(t, fn) { (this._l[t] ||= []).push(fn); }
  _emit(t, ev) { this[`on${t}`]?.(ev); (this._l[t] || []).forEach((fn) => fn(ev)); }
  readAsArrayBuffer(blob) {
    Promise.resolve(blob.arrayBuffer()).then((buf) => {
      this.result = buf; const ev = { target: this }; this._emit('load', ev); this._emit('loadend', ev);
    }).catch((error) => { this.error = error; this._emit('error', { target: this }); });
  }
  readAsDataURL(blob) {
    Promise.resolve(blob.arrayBuffer()).then((buf) => {
      this.result = 'data:application/octet-stream;base64,' + Buffer.from(buf).toString('base64');
      const ev = { target: this }; this._emit('load', ev); this._emit('loadend', ev);
    });
  }
}
globalThis.FileReader = globalThis.FileReader ?? FileReaderPolyfill;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../src/sim/hardware-library/models');

const [, , inArg, partId] = process.argv;
if (!inArg || !partId) {
  console.error('用法: node scripts/step-to-glb.mjs <input.step> <part-id>');
  process.exit(1);
}
const input = resolve(process.cwd(), inArg);
const out = resolve(OUT_DIR, `${partId}.glb`);

const main = async () => {
  const occt = await occtimportjs();
  const buf = readFileSync(input);
  const result = occt.ReadStepFile(new Uint8Array(buf), null);
  if (!result || !result.success) throw new Error('occt failed to read STEP');

  const root = new THREE.Group();
  root.name = partId;
  let triCount = 0;

  for (const mesh of result.meshes) {
    const geom = new THREE.BufferGeometry();
    const pos = mesh.attributes?.position?.array;
    if (!pos) continue;
    geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    if (mesh.attributes?.normal?.array)
      geom.setAttribute('normal', new THREE.Float32BufferAttribute(mesh.attributes.normal.array, 3));
    if (mesh.index?.array) geom.setIndex(Array.from(mesh.index.array));
    if (!mesh.attributes?.normal?.array) geom.computeVertexNormals();
    triCount += (mesh.index?.array?.length ?? pos.length / 3) / 3;

    const c = mesh.color; // [r,g,b] 0..1 if present
    const mat = new THREE.MeshStandardMaterial({
      color: c ? new THREE.Color(c[0], c[1], c[2]) : new THREE.Color('#9aa0ab'),
      metalness: 0.55, roughness: 0.5,
    });
    const m = new THREE.Mesh(geom, mat);
    m.name = mesh.name || 'solid';
    m.castShadow = m.receiveShadow = true;
    root.add(m);
  }

  if (root.children.length === 0) throw new Error('no meshes produced from STEP');

  // Center the model at origin (the app re-centers anyway, but keeps it clean).
  const box = new THREE.Box3().setFromObject(root);
  const center = new THREE.Vector3(); box.getCenter(center);
  root.position.sub(center);

  mkdirSync(OUT_DIR, { recursive: true });
  const exporter = new GLTFExporter();
  const gltf = await exporter.parseAsync(root, { binary: true });
  writeFileSync(out, Buffer.from(gltf));

  const size = new THREE.Vector3(); box.getSize(size);
  console.log(`✓ ${out}`);
  console.log(`  solids: ${root.children.length}  ·  triangles: ${Math.round(triCount)}  ·  ` +
    `bbox: ${size.x.toFixed(1)}×${size.y.toFixed(1)}×${size.z.toFixed(1)} (STEP units)`);
  console.log(`  文件名 = part id「${partId}」→ 刷新页面自动加载（尺寸自动适配，无需改代码）。`);
};

main().catch((e) => { console.error('✗ 转换失败:', e.message); process.exit(1); });
