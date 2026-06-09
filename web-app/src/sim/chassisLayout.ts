// ─────────────────────────────────────────────────────────────────────────────
// Chassis Layout — catalog-driven sizing + typical 2U server topology.
//
// Single source of truth for:
//   1. SCALE          — one uniform mm→unit factor (K = MM_PER_UNIT) so every
//                       part is physically proportional to every other part.
//   2. SIZE           — derived from the linked CatalogPart.dimensionsMM, with a
//                       per-part orientation (how W/H/D map to world X/Y/Z) and
//                       optional height override (e.g. CPU + heatsink assembly).
//   3. POSITION       — a clean 2U topology: front drive bays → fan wall →
//                       compute (mainboard + CPUs) → rear (PSU + risers + I/O).
//   4. CATALOG LINK   — sets component.catalogId so IsoCanvas can render the
//                       installed GLB (model-registry) instead of procedural mesh.
//
// World axes (see IsoCanvas g2w*):  X = lateral, Y = up, Z = depth (front→rear).
// grid = front-left-bottom CORNER of the component (renderer adds size/2).
// ─────────────────────────────────────────────────────────────────────────────

import type { HardwareComponent } from './serverData';
import { getPartById } from './hardware-library';

/** Millimetres per scene unit. Matches catalog MM_PER_SCENE_UNIT so a GLB
 *  authored at mm/20 drops into the main view at the correct size. */
export const MM_PER_UNIT = 20;
const K = MM_PER_UNIT;

/** Which catalog axis feeds each world axis. */
interface Orient {
  /** world X (width)  ← catalog … */ x: 'width' | 'height' | 'depth';
  /** world Y (height) ← catalog … */ y: 'width' | 'height' | 'depth';
  /** world Z (depth)  ← catalog … */ z: 'width' | 'height' | 'depth';
}
const DEFAULT_ORIENT: Orient = { x: 'width', y: 'height', z: 'depth' };

interface LinkSpec {
  catalogId?: string;
  orient?: Orient;
  /** Override world-Y height in UNITS (for assemblies taller than the bare part, e.g. CPU heatsink). */
  heightUnits?: number;
  /** Explicit size in UNITS for non-catalog parts (boards, I/O panels). */
  sizeUnits?: { w: number; d: number; h: number };
  /** New 2U-topology position: front-left-bottom corner, in UNITS. */
  grid: { x: number; y: number; z: number };
}

// ─── The layout table ─────────────────────────────────────────────────────────
// Coordinates are authored in a front(0)→rear(+) depth frame; IsoCanvas
// re-centers via computed CX/CZ so absolute origin doesn't matter.
const FAN: Orient = { x: 'width', y: 'depth', z: 'height' };   // 60 wide, 60 tall, 38 thick
const NVME_STAND: Orient = { x: 'height', y: 'width', z: 'depth' }; // 15 thick, 70 tall, 100 deep

const LAYOUT: Record<string, LinkSpec> = {
  // ── ZONE 1: front 12×3.5" HDD bay (4 cols × 3 rows, y ≈ 0.5) ─────────────
  // HDD lies flat: w 5.08 (101.6mm) × d 7.35 (147mm) × h 1.3 (26mm). Column
  // pitch 5.2u, row pitch (height) 1.4u. 4×3 = 12 drives fill the front face.
  hdd_0:  { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 0.5,  y: 0.5, z: 0   } },
  hdd_1:  { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 5.7,  y: 0.5, z: 0   } },
  hdd_2:  { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 10.9, y: 0.5, z: 0   } },
  hdd_3:  { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 16.1, y: 0.5, z: 0   } },
  hdd_4:  { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 0.5,  y: 0.5, z: 1.4 } },
  hdd_5:  { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 5.7,  y: 0.5, z: 1.4 } },
  hdd_6:  { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 10.9, y: 0.5, z: 1.4 } },
  hdd_7:  { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 16.1, y: 0.5, z: 1.4 } },
  hdd_8:  { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 0.5,  y: 0.5, z: 2.8 } },
  hdd_9:  { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 5.7,  y: 0.5, z: 2.8 } },
  hdd_10: { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 10.9, y: 0.5, z: 2.8 } },
  hdd_11: { catalogId: 'hdd-seagate-exos-x16-4tb-sata', grid: { x: 16.1, y: 0.5, z: 2.8 } },
  // Rear 4×2.5" U.2 NVMe (standing) — rear-left drive cage, clear of risers,
  // spaced out so the real U.2 model reads clearly.
  nvme_0: { catalogId: 'nvme-samsung-pm9a3-1920gb-u2', orient: NVME_STAND, grid: { x: -7.5, y: 30, z: 0 } },
  nvme_1: { catalogId: 'nvme-samsung-pm9a3-1920gb-u2', orient: NVME_STAND, grid: { x: -6.3, y: 30, z: 0 } },
  nvme_2: { catalogId: 'nvme-samsung-pm9a3-1920gb-u2', orient: NVME_STAND, grid: { x: -5.1, y: 30, z: 0 } },
  nvme_3: { catalogId: 'nvme-samsung-pm9a3-1920gb-u2', orient: NVME_STAND, grid: { x: -3.9, y: 30, z: 0 } },

  // ── ZONE 2: fan wall (y ≈ 9) ────────────────────────────────────────────
  fan_0:  { catalogId: 'fan-60mm-1u-high-perf', orient: FAN, grid: { x: 2.0,  y: 9.0, z: 0 } },
  fan_1:  { catalogId: 'fan-60mm-1u-high-perf', orient: FAN, grid: { x: 5.6,  y: 9.0, z: 0 } },
  fan_2:  { catalogId: 'fan-60mm-1u-high-perf', orient: FAN, grid: { x: 9.2,  y: 9.0, z: 0 } },
  fan_3:  { catalogId: 'fan-60mm-1u-high-perf', orient: FAN, grid: { x: 12.8, y: 9.0, z: 0 } },

  // ── ZONE 3: compute (y ≈ 10 → 28) ──────────────────────────────────────
  // Mainboard: PORTRAIT board matching the real product photo (deeper than
  // wide). w 11 (≈220mm) × d 18 (≈360mm). Board centre → world (x9, z19).
  base_board: { sizeUnits: { w: 11, d: 18, h: 0.3 },  grid: { x: 3.5,  y: 10.0, z: 0 } },
  // 2× Kunpeng (916/920), stacked along DEPTH, centred on the board width.
  // CPU footprint 3.87×3.01 (77.4×60.2mm). grid.x 7 → world centre 8.935 ≈
  // board centre x9. Board centre z = 10+9 = 19, so:
  //   cpu_0 grid.y 13.5 → world z 15.0 → board-local z −4.0
  //   cpu_1 grid.y 21.5 → world z 23.0 → board-local z +4.0  (matches dimmSlots)
  cpu_0: { catalogId: 'cpu-kunpeng920-hi1620', grid: { x: 7.0, y: 13.5, z: 0.3 } },
  cpu_1: { catalogId: 'cpu-kunpeng920-hi1620', grid: { x: 7.0, y: 21.5, z: 0.3 } },

  // management boards on the left flank — side by side, NOT stacked (they have
  // near-identical footprints, so overlapping them reads as one merged block).
  // Ext (I/O) board: PORTRAIT, left of and ≈half the width of the mainboard,
  // tops roughly aligned (matches the product photo). w 5 (≈100mm) × d 16.5.
  ext_board: { sizeUnits: { w: 5, d: 16.5, h: 0.35 }, grid: { x: -2.5, y: 10.5, z: 0 } },
  bmc_card:  { catalogId: 'bmc-huawei-hi1711-card', grid: { x: -9.5, y: 12.0, z: 0 } },

  // ── ZONE 4: rear (y ≈ 28 → 38) ──────────────────────────────────────────
  // PSUs: long bricks at rear-right
  psu_0: { catalogId: 'psu-huawei-900w-hot-swap', grid: { x: 10.8, y: 28.5, z: 0 } },
  psu_1: { catalogId: 'psu-huawei-900w-hot-swap', grid: { x: 14.8, y: 28.5, z: 0 } },
  // PCIe risers (vertical cards) + OCP NIC at rear-left
  riser_0: { catalogId: 'riser-pcie4-x16-fhhl', grid: { x: 0.5, y: 29.5, z: 0 } },
  riser_1: { catalogId: 'riser-pcie4-x16-fhhl', grid: { x: 6.0, y: 29.5, z: 0 } },
  ocp_nic: { catalogId: 'nic-mellanox-mcx512a-ocp3-2x25g', grid: { x: 0.5, y: 31.5, z: 0 } },
  // rear + front I/O panels
  io_panel_0: { sizeUnits: { w: 2.5, d: 0.8, h: 0.55 }, grid: { x: -2.0, y: 0.5,  z: 0 } },
  io_panel_1: { sizeUnits: { w: 2.5, d: 0.5, h: 1.6 },  grid: { x: -2.0, y: 31.0, z: 0 } },
};

// ─── Size derivation ──────────────────────────────────────────────────────────

function dimByAxis(part: { dimensionsMM: { width: number; height: number; depth: number } }, axis: Orient['x']): number {
  return part.dimensionsMM[axis];
}

/** Compute a component's size {w,d,h} in scene units from its layout spec. */
function sizeFor(spec: LinkSpec): { w: number; d: number; h: number } | null {
  if (spec.sizeUnits) return { ...spec.sizeUnits };
  if (!spec.catalogId) return null;
  const part = getPartById(spec.catalogId);
  if (!part) {
    if (typeof console !== 'undefined') console.warn(`[chassisLayout] catalog part not found: ${spec.catalogId}`);
    return null;
  }
  const o = spec.orient ?? DEFAULT_ORIENT;
  const w = dimByAxis(part, o.x) / K;
  const h = spec.heightUnits ?? dimByAxis(part, o.y) / K;
  const d = dimByAxis(part, o.z) / K;
  return { w, d, h };
}

// ─── Public: apply layout in place ──────────────────────────────────────────────

/**
 * Mutate the component list: set catalogId, size (real mm @ K), and 2U grid
 * position from the LAYOUT table. Components not in the table are left untouched.
 */
export function applyChassisLayout(components: HardwareComponent[]): void {
  for (const comp of components) {
    const spec = LAYOUT[comp.id];
    if (!spec) continue;
    if (spec.catalogId) comp.catalogId = spec.catalogId;
    const size = sizeFor(spec);
    if (size) comp.size = size;
    comp.grid = { ...spec.grid };
  }
}

/** Bounds over all components (grid + size), for auto-centering the camera. */
export function computeSceneBounds(components: HardwareComponent[]) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const c of components) {
    minX = Math.min(minX, c.grid.x);
    maxX = Math.max(maxX, c.grid.x + c.size.w);
    minZ = Math.min(minZ, c.grid.y);
    maxZ = Math.max(maxZ, c.grid.y + c.size.d);
  }
  return {
    minX, maxX, minZ, maxZ,
    centerX: (minX + maxX) / 2,
    centerZ: (minZ + maxZ) / 2,
  };
}
