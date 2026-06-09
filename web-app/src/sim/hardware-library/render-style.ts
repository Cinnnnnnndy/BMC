// ─────────────────────────────────────────────────────────────────────────────
// Render Style Resolver
//
// Translates the data-driven `RenderStyle` (material preset + overrides) into
// concrete PBR material props for three.js `<meshStandardMaterial>` /
// `<meshPhysicalMaterial>`. This is the single place that defines "what a
// preset looks like" — tweak here to restyle every part using that preset.
// ─────────────────────────────────────────────────────────────────────────────

import type { CatalogPart, MaterialPreset, OutlineStyle, RenderStyle } from './types';

export interface ResolvedMaterial {
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  opacity: number;
  transparent: boolean;
  emissive: string;
  emissiveIntensity: number;
}

export interface ResolvedOutline {
  enabled: boolean;
  color: string;
  thickness: number;
  opacity: number;
  edgeThresholdDeg: number;
}

export interface ResolvedStyle {
  material: ResolvedMaterial;
  outline: ResolvedOutline;
  scale: number;
  castShadow: boolean;
  receiveShadow: boolean;
}

// ─── Material preset table ────────────────────────────────────────────────────
// Each preset = default color + PBR params. Override via RenderStyle.fillColor etc.

const PRESETS: Record<MaterialPreset, Omit<ResolvedMaterial, 'opacity' | 'transparent' | 'emissive' | 'emissiveIntensity'>> = {
  'matte-plastic':  { color: '#1a1c20', metalness: 0.05, roughness: 0.85, clearcoat: 0.0 },
  'brushed-metal':  { color: '#8a8d94', metalness: 0.85, roughness: 0.34, clearcoat: 0.0 },
  'polished-metal': { color: '#d4a85a', metalness: 0.95, roughness: 0.10, clearcoat: 0.0 },
  'pcb-green':      { color: '#152015', metalness: 0.10, roughness: 0.82, clearcoat: 0.15 },
  'pcb-blue':       { color: '#112036', metalness: 0.15, roughness: 0.78, clearcoat: 0.20 },
  'pcb-dark':       { color: '#0e1116', metalness: 0.12, roughness: 0.80, clearcoat: 0.10 },
  'anodized-dark':  { color: '#282c35', metalness: 0.65, roughness: 0.40, clearcoat: 0.0 },
  'glass':          { color: '#a8c4e0', metalness: 0.0,  roughness: 0.05, clearcoat: 1.0 },
  'rubber':         { color: '#101013', metalness: 0.0,  roughness: 0.95, clearcoat: 0.0 },
  'ceramic':        { color: '#0c0e12', metalness: 0.12, roughness: 0.55, clearcoat: 0.0 },
};

// Categories whose "natural" preset we infer when none is specified
const DEFAULT_OUTLINE: ResolvedOutline = {
  enabled: true,
  color: '#0b0e14',
  thickness: 1.2,
  opacity: 0.9,
  edgeThresholdDeg: 18,
};

// ─── Resolution ───────────────────────────────────────────────────────────────

function resolveOutline(o?: OutlineStyle): ResolvedOutline {
  if (!o) return { ...DEFAULT_OUTLINE };
  return {
    enabled: o.enabled,
    color: o.color ?? DEFAULT_OUTLINE.color,
    thickness: o.thickness ?? DEFAULT_OUTLINE.thickness,
    opacity: o.opacity ?? DEFAULT_OUTLINE.opacity,
    edgeThresholdDeg: o.edgeThresholdDeg ?? DEFAULT_OUTLINE.edgeThresholdDeg,
  };
}

/**
 * Resolve the final concrete style for a part.
 * Precedence (highest → lowest):
 *   renderStyle explicit overrides → preset defaults → flat legacy fields → hard defaults
 */
export function resolveStyle(part: CatalogPart): ResolvedStyle {
  const rs: RenderStyle = part.renderStyle ?? {};

  // Base from preset (if any)
  const preset = rs.material ? PRESETS[rs.material] : null;

  const color =
    rs.fillColor ??
    preset?.color ??
    part.baseColor ??
    '#3a3f4a';

  const metalness =
    rs.metalness ??
    preset?.metalness ??
    part.metalness ??
    0.4;

  const roughness =
    rs.roughness ??
    preset?.roughness ??
    part.roughness ??
    0.6;

  const clearcoat = rs.clearcoat ?? preset?.clearcoat ?? 0.0;
  const opacity = rs.opacity ?? 1.0;

  const material: ResolvedMaterial = {
    color,
    metalness,
    roughness,
    clearcoat,
    opacity,
    transparent: opacity < 1.0,
    emissive: rs.emissiveColor ?? '#000000',
    emissiveIntensity: rs.emissiveIntensity ?? 0.0,
  };

  return {
    material,
    outline: resolveOutline(rs.outline),
    scale: rs.scale ?? 1.0,
    castShadow: rs.castShadow ?? true,
    receiveShadow: rs.receiveShadow ?? true,
  };
}

/** Apply a status (warning/error/offline) on top of a resolved style */
export function applyStatusToStyle(
  style: ResolvedStyle,
  status?: 'normal' | 'warning' | 'error' | 'offline',
): ResolvedStyle {
  if (!status || status === 'normal') return style;
  const m = { ...style.material };
  let outline = { ...style.outline };
  switch (status) {
    case 'warning':
      m.emissive = '#F59E0B';
      m.emissiveIntensity = 0.25;
      outline = { ...outline, color: '#F59E0B', thickness: Math.max(outline.thickness, 2) };
      break;
    case 'error':
      m.emissive = '#EF4444';
      m.emissiveIntensity = 0.4;
      outline = { ...outline, color: '#EF4444', thickness: Math.max(outline.thickness, 2.5) };
      break;
    case 'offline':
      m.opacity = 0.35;
      m.transparent = true;
      break;
  }
  return { ...style, material: m, outline };
}
