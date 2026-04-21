#!/usr/bin/env node
/*
 * Regenerate src/data/boards.ts from an openUBMC .sr folder.
 *
 * Usage:
 *   OPENUBMC_DIR=/absolute/path/to/openUBMC node scripts/gen-boards.mjs
 *
 * Default path (when env not set):
 *   ../../vpd-main/vendor/openUBMC  (relative to this repo)
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Default path: repo lives at .../BMC-02/BMC-01-main/web-app-vue, vpd-main
// is a sibling under BMC-02. Override with OPENUBMC_DIR when shared elsewhere.
const defaultDir = resolve(__dirname, '../../../vpd-main/vendor/openUBMC');
const srcDir = process.env.OPENUBMC_DIR || defaultDir;
const outFile = resolve(__dirname, '../src/data/boards.ts');

console.log(`Scanning: ${srcDir}`);
const files = readdirSync(srcDir).filter((f) => f.endsWith('.sr')).sort();
const byKey = new Map();
for (const fn of files) {
  const base = fn.slice(0, -3);
  const isSoft = base.endsWith('_soft');
  const key = isSoft ? base.slice(0, -5) : base;
  const [partNumber, ...rest] = key.split('_');
  const sn = rest.join('_');
  let unit = null;
  try {
    const d = JSON.parse(readFileSync(join(srcDir, fn), 'utf8'));
    unit = d?.Unit ?? null;
  } catch {}
  const rec = byKey.get(key) ?? { id: key, partNumber, sn, type: null, name: null, files: [] };
  rec.files.push(fn);
  if (unit?.Type && !rec.type) rec.type = unit.Type;
  if (unit?.Name && !rec.name) rec.name = unit.Name;
  byKey.set(key, rec);
}

const boards = [...byKey.values()].map((r) => ({
  ...r,
  type: r.type || 'Unknown',
  name: r.name || 'Unknown',
  files: r.files.slice().sort(),
}));
boards.sort((a, b) => a.id.localeCompare(b.id));

const rows = boards.map((b) => {
  const files = b.files.map((f) => JSON.stringify(f)).join(',');
  return `  { id: '${b.id}', partNumber: '${b.partNumber}', sn: '${b.sn}', type: '${b.type}', name: '${b.name}', files: [${files}] },`;
}).join('\n');

// Only rewrite the BOARDS array; preserve the rest of boards.ts.
const current = readFileSync(outFile, 'utf8');
const marker = /export const BOARDS: BoardRecord\[\] = \[[\s\S]*?\];\n/;
if (!marker.test(current)) {
  console.error('Could not find BOARDS array in boards.ts — aborting.');
  process.exit(1);
}
const next = current.replace(marker, `export const BOARDS: BoardRecord[] = [\n${rows}\n];\n`);
writeFileSync(outFile, next);
console.log(`Wrote ${boards.length} boards to ${outFile}`);
