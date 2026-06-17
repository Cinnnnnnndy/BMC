#!/usr/bin/env node
/*
 * Regenerate src/data/boards.ts from an openUBMC .sr folder.
 *
 * Usage:
 *   OPENUBMC_DIR=/absolute/path/to/openUBMC node scripts/gen-boards.mjs
 *
 * Default path (when env not set):
 *   ../../vpd-main/vendor/openUBMC  (relative to this repo)
 *
 * Added (v2): extracts downstream Connector objects from each hardware .sr
 * file and stores them as `connectors` + `topoKey` on each BoardRecord.
 * This powers the topology-variant picker in the Vue topology view.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDir = resolve(__dirname, '../../../vpd-main/vendor/openUBMC');
const srcDir = process.env.OPENUBMC_DIR || defaultDir;
const outFile = resolve(__dirname, '../src/data/boards.ts');

// ── Connector extraction helpers ─────────────────────────────────────────
/**
 * A Bom value is a "real" hardware part number when it consists entirely of
 * digits and is at least 8 characters long (e.g. "14100513", "14140130").
 * This filters out logical identifiers like "memory", "UbcConfig", "PsEvent".
 */
function isRealBom(bom) {
  return typeof bom === 'string' && /^\d{8,}$/.test(bom);
}

/**
 * Return a human-readable label for a set of connectors.
 * Groups by inferred type and formats as "N×TypeLabel".
 */
function connectorSetLabel(connectors) {
  if (!connectors.length) return '无下游连接器';
  const counts = {};
  for (const c of connectors) {
    const t = c.type || inferConnType(c.name);
    counts[t] = (counts[t] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([t, n]) => (n > 1 ? `${n}×${t}` : t))
    .join(' + ');
}

function inferConnType(name) {
  if (/PCIE|PCIe/i.test(name)) return 'PCIe';
  if (/SEU|Disk|HDD/i.test(name)) return 'SEU';
  if (/BCU|CPU/i.test(name)) return 'BCU';
  if (/CLU|Fan/i.test(name)) return 'CLU';
  if (/NIC|LOM|OCP/i.test(name)) return 'NIC';
  return name.replace(/^Connector_/, '');
}

// ── Main scan ─────────────────────────────────────────────────────────────
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
  let connectors = [];
  try {
    const d = JSON.parse(readFileSync(join(srcDir, fn), 'utf8'));
    unit = d?.Unit ?? null;

    // Extract downstream connectors from hardware (non-soft) file only.
    // Only keep connectors whose Bom is a real part number.
    if (!isSoft && d?.Objects) {
      connectors = Object.entries(d.Objects)
        .filter(([k]) => k.startsWith('Connector_'))
        .map(([name, c]) => ({
          name,
          type: c?.Type ?? '',
          bom: String(c?.Bom ?? ''),
        }))
        .filter((c) => isRealBom(c.bom))
        .map(({ name, type }) => ({ name, type }));
    }
  } catch {}

  const rec = byKey.get(key) ?? {
    id: key, partNumber, sn, type: null, name: null, files: [], connectors: [],
  };
  rec.files.push(fn);
  if (unit?.Type && !rec.type) rec.type = unit.Type;
  if (unit?.Name && !rec.name) rec.name = unit.Name;
  // Only set connectors from the hardware file (connectors will be empty for soft files)
  if (connectors.length && !rec.connectors.length) rec.connectors = connectors;
  byKey.set(key, rec);
}

const boards = [...byKey.values()].map((r) => ({
  ...r,
  type: r.type || 'Unknown',
  name: r.name || 'Unknown',
  files: r.files.slice().sort(),
  connectors: r.connectors,
  topoKey: r.connectors.map((c) => c.name).sort().join('|'),
  topoLabel: connectorSetLabel(r.connectors),
}));
boards.sort((a, b) => a.id.localeCompare(b.id));

// ── Serialise ─────────────────────────────────────────────────────────────
const rows = boards.map((b) => {
  const files  = b.files.map((f) => JSON.stringify(f)).join(',');
  const conns  = b.connectors
    .map((c) => `{name:${JSON.stringify(c.name)},type:${JSON.stringify(c.type)}}`)
    .join(',');
  return (
    `  { id: '${b.id}', partNumber: '${b.partNumber}', sn: '${b.sn}', ` +
    `type: '${b.type}', name: '${b.name}', files: [${files}], ` +
    `connectors: [${conns}], topoKey: '${b.topoKey}', topoLabel: '${b.topoLabel}' },`
  );
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
