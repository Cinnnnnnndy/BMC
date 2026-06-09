// ─────────────────────────────────────────────────────────────────────────────
// Catalog Registry — Query / Search API
//
// This module provides the "API layer" from the three-tier architecture:
//   Tier 1: Metadata (types.ts)
//   Tier 2: Parametric specs (parts-catalog.ts, chassis-templates.ts)
//   Tier 3: Query layer (this file) ← you are here
// ─────────────────────────────────────────────────────────────────────────────

import { ALL_CATALOG_PARTS } from './parts-catalog';
import { ALL_CHASSIS_TEMPLATES } from './chassis-templates';
import { toScene } from './types';
import type {
  CatalogPart,
  ChassisTemplate,
  PartCategory,
  HardwareStandard,
  ChassisSlot,
  SizeMM,
} from './types';

export { toScene };

// ─── Part queries ─────────────────────────────────────────────────────────────

/** Look up a part by ID. Returns undefined if not found. */
export function getPartById(id: string): CatalogPart | undefined {
  return ALL_CATALOG_PARTS.find((p) => p.id === id);
}

/** Filter parts by category */
export function getPartsByCategory(category: PartCategory): CatalogPart[] {
  return ALL_CATALOG_PARTS.filter((p) => p.category === category);
}

/** Filter parts that comply with a hardware standard */
export function getPartsByStandard(standard: HardwareStandard): CatalogPart[] {
  return ALL_CATALOG_PARTS.filter((p) => p.standards.includes(standard));
}

/** Full-text search across name, labelEn, labelZh, description, vendor */
export function searchParts(query: string): CatalogPart[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_CATALOG_PARTS;
  return ALL_CATALOG_PARTS.filter((p) => {
    const text = [p.name, p.labelEn, p.labelZh, p.description, p.vendor ?? '', p.partNumber ?? '']
      .join(' ')
      .toLowerCase();
    return text.includes(q);
  });
}

/**
 * Multi-filter: combine category, standard, and text search.
 * Pass null/undefined to skip a filter.
 */
export function filterParts(opts: {
  category?: PartCategory | null;
  standard?: HardwareStandard | null;
  query?: string | null;
}): CatalogPart[] {
  let results = ALL_CATALOG_PARTS;
  if (opts.category) results = results.filter((p) => p.category === opts.category);
  if (opts.standard) results = results.filter((p) => p.standards.includes(opts.standard!));
  if (opts.query) {
    const q = opts.query.toLowerCase();
    results = results.filter((p) =>
      [p.name, p.labelEn, p.labelZh, p.description, p.vendor ?? ''].join(' ').toLowerCase().includes(q),
    );
  }
  return results;
}

// ─── Chassis queries ──────────────────────────────────────────────────────────

/** Look up a chassis template by ID */
export function getChassisById(id: string): ChassisTemplate | undefined {
  return ALL_CHASSIS_TEMPLATES.find((c) => c.id === id);
}

/** Get all chassis templates */
export function getAllChassis(): ChassisTemplate[] {
  return ALL_CHASSIS_TEMPLATES;
}

/**
 * Given a chassis template and a slot ID, return the slots that
 * can accept a particular part (dimension + category check).
 */
export function findCompatibleSlots(
  chassis: ChassisTemplate,
  part: CatalogPart,
): ChassisSlot[] {
  return chassis.slots.filter((slot) => {
    // Category match
    if (!slot.acceptsCategories.includes(part.category)) return false;
    // Standard match (if required)
    if (slot.requiresStandards && slot.requiresStandards.length > 0) {
      const hasStd = part.standards.some((s) => slot.requiresStandards!.includes(s));
      if (!hasStd) return false;
    }
    // Dimension fit (part must not exceed slot max in any axis)
    const d = part.dimensionsMM;
    const m = slot.maxDimensionsMM;
    if (d.width > m.width || d.height > m.height || d.depth > m.depth) return false;
    return true;
  });
}

// ─── Dimension helpers ────────────────────────────────────────────────────────

/** Convert a SizeMM to scene-unit {w, d, h} object (matches IsoCanvas/serverData shape) */
export function sizeToScene(mm: SizeMM): { w: number; d: number; h: number } {
  return {
    w: toScene(mm.width),
    d: toScene(mm.depth),
    h: toScene(mm.height),
  };
}

/** Get part volume in cm³ */
export function partVolumeCM3(part: CatalogPart): number {
  const { width, height, depth } = part.dimensionsMM;
  return (width * height * depth) / 1000;
}

/** Check if two parts physically overlap given their positions (axis-aligned) */
export function hasCollision(
  posA: { x: number; y: number; z: number },
  sizeA: SizeMM,
  posB: { x: number; y: number; z: number },
  sizeB: SizeMM,
  padding = 1, // mm gap between parts
): boolean {
  const gap = padding;
  const overlapX = posA.x < posB.x + sizeB.width + gap && posA.x + sizeA.width + gap > posB.x;
  const overlapY = posA.y < posB.y + sizeB.height + gap && posA.y + sizeA.height + gap > posB.y;
  const overlapZ = posA.z < posB.z + sizeB.depth + gap && posA.z + sizeA.depth + gap > posB.z;
  return overlapX && overlapY && overlapZ;
}

// ─── Summary helpers ──────────────────────────────────────────────────────────

/** Get unique categories present in the full catalog */
export function getAllCategories(): PartCategory[] {
  return [...new Set(ALL_CATALOG_PARTS.map((p) => p.category))];
}

/** Total power for a set of part IDs */
export function estimateTotalPowerW(partIds: string[]): number {
  return partIds.reduce((sum, id) => {
    const p = getPartById(id);
    return sum + (p?.ratedPowerWatts ?? 0);
  }, 0);
}

/** Return a short spec summary string for a part */
export function partSpecSummary(part: CatalogPart): string {
  const dim = part.dimensionsMM;
  const dimStr = `${dim.width}×${dim.height}×${dim.depth} mm`;
  const pwrStr = part.ratedPowerWatts != null ? `${part.ratedPowerWatts}W` : '';
  const massStr = part.massGrams != null ? `${part.massGrams}g` : '';
  return [dimStr, pwrStr, massStr].filter(Boolean).join(' · ');
}
