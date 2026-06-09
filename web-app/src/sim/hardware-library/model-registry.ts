/// <reference types="vite/client" />
// ─────────────────────────────────────────────────────────────────────────────
// Model Registry — one-click GLB swapping by filename convention.
//
// CONVENTION:  a part with id "psu-delta-dps800ab-800w" loads its 3D model from
//              src/sim/hardware-library/models/psu-delta-dps800ab-800w.glb
//
// Vite's import.meta.glob scans that folder at build time. To add / replace a
// model you ONLY drop a file named  <part.id>.glb  into the models/ folder —
// no code edits. HMR picks it up immediately. Delete the file → the part falls
// back to procedural geometry automatically.
// ─────────────────────────────────────────────────────────────────────────────

// Eagerly resolve every .glb in models/ to its emitted asset URL.
const modelUrls = import.meta.glob('./models/*.glb', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Build  partId -> url  map from the file basenames.
const urlByPartId: Record<string, string> = {};
for (const [path, url] of Object.entries(modelUrls)) {
  const file = path.split('/').pop() ?? '';
  const id = file.replace(/\.glb$/i, '');
  urlByPartId[id] = url;
}

/** The exact filename a part's model must have to be auto-detected. */
export function expectedModelFilename(partId: string): string {
  return `${partId}.glb`;
}

/** Folder (relative to web-app/) where models are dropped. */
export const MODELS_DIR = 'src/sim/hardware-library/models';

/** Resolve a part's GLB asset URL, or undefined if no model file is present. */
export function resolvePartModelUrl(partId: string): string | undefined {
  return urlByPartId[partId];
}

/** Whether a real GLB model is currently installed for this part. */
export function hasPartModel(partId: string): boolean {
  return partId in urlByPartId;
}

/** All part ids that currently have an installed GLB. */
export function installedModelIds(): string[] {
  return Object.keys(urlByPartId);
}
