// ─────────────────────────────────────────────────────────────────────────────
// Hardware Library — Type Definitions
//
// All physical dimensions are stored in **millimeters** (real world).
// Scene rendering converts via: sceneUnits = mm / MM_PER_SCENE_UNIT
//
// Coordinate convention (right-hand, Y-up, looking from front of chassis):
//   X+  →  right
//   Y+  →  up
//   Z+  →  toward viewer (front of chassis)
// ─────────────────────────────────────────────────────────────────────────────

/** 1 scene unit ≈ this many millimeters (matches existing IsoCanvas scale) */
export const MM_PER_SCENE_UNIT = 20;

/** Convert mm value to scene units */
export const toScene = (mm: number): number => mm / MM_PER_SCENE_UNIT;

/** Convert scene units back to mm */
export const toMM = (units: number): number => units * MM_PER_SCENE_UNIT;

// ─── Geometry primitives ─────────────────────────────────────────────────────

/** 3D dimensions in mm */
export interface SizeMM {
  width: number;   // X (left → right, looking from front)
  height: number;  // Y (bottom → top)
  depth: number;   // Z (front → rear)
}

/** 3D position in mm (relative to a defined origin) */
export interface PosMM {
  x: number;
  y: number;
  z: number;
}

/** Euler rotation in degrees (XYZ order) */
export interface RotDeg {
  x: number;
  y: number;
  z: number;
}

/** Face direction axis */
export type Axis = 'X+' | 'X-' | 'Y+' | 'Y-' | 'Z+' | 'Z-';

// ─── Connector types ──────────────────────────────────────────────────────────

export type ConnectorType =
  // PCIe
  | 'pcie-x1' | 'pcie-x4' | 'pcie-x8' | 'pcie-x16' | 'pcie-ocp3'
  // Memory
  | 'dimm-ddr4' | 'dimm-ddr5'
  // Storage
  | 'sata-data' | 'sata-power' | 'm2-m' | 'm2-b' | 'u2-sff8639' | 'e1s'
  // Power distribution
  | 'atx-24pin' | 'eps-8pin' | 'eps-4pin' | 'ocp-power'
  // High-speed networking
  | 'sfp28-25g' | 'sfp56-50g' | 'qsfp28-100g' | 'qsfp-dd-400g' | 'osfp-400g'
  | 'rj45-1g' | 'rj45-10g'
  // IO
  | 'usb-a-3' | 'usb-c-32' | 'vga' | 'hdmi' | 'displayport'
  // Management / Debug
  | 'ipmb' | 'i2c-smb' | 'jtag' | 'uart' | 'nc-si'
  // Cooling
  | 'fan-4pin-pwm' | 'fan-3pin'
  // CPU sockets
  | 'lga4677' | 'lga4189' | 'sp5' | 'tr4' | 'bga-hi1620';

export interface Connector {
  id: string;
  type: ConnectorType;
  /** Which face of the part this connector is on */
  face: Axis;
  /** Position in mm relative to part origin (bottom-left-front corner) */
  posMM: PosMM;
  gender: 'male' | 'female' | 'neutral';
  label?: string;
}

// ─── Mounting points ──────────────────────────────────────────────────────────

export type MountingType =
  | 'M3-screw' | 'M4-screw' | 'M6-screw'
  | 'quarter-turn-fastener'
  | 'tool-less-lever'
  | 'rail-slot'      // rack sliding rail engagement
  | 'pcb-standoff'   // threaded standoff for PCB
  | 'guide-pin';     // blind-mate guide pin

export interface MountingPoint {
  id: string;
  type: MountingType;
  posMM: PosMM;
  face: Axis;
}

// ─── Thermal specification ────────────────────────────────────────────────────

export interface ThermalSpec {
  tdpWatts: number;
  heatExhaustFace: Axis;
  requiresActiveCooling: boolean;
  minAirflowCFM?: number;
  maxInletTempC?: number;
  maxJunctionTempC?: number;
}

// ─── Standards ────────────────────────────────────────────────────────────────

export type HardwareStandard =
  | 'OCP-3.0'      // Open Compute Project NIC/Accelerator
  | 'OCP-ORV3'     // OCP Open Rack Version 3
  | 'OCP-MHS'      // OCP Modular Hardware System
  | 'OCP-DC-SCM'   // OCP Data Center Secure Control Module
  | 'ATX'
  | 'E-ATX'
  | 'SSI-EEB'      // SSI Entry-level Electronics Bay (server board)
  | 'SSI-CEB'      // SSI Compact Electronics Bay
  | 'EIA-310-D'    // Standard rack unit dimensions (1U = 44.45mm)
  | 'SFF-8639'     // U.2 connector spec
  | 'JEDEC'        // Memory module standards
  | 'PCIe-FH-HL'   // Full-height half-length add-in card
  | 'PCIe-FH-FL'   // Full-height full-length add-in card
  | 'PCIe-LP'      // Low-profile add-in card
  | 'custom';

// ─── Part categories ──────────────────────────────────────────────────────────

export type PartCategory =
  | 'cpu'
  | 'memory-module'
  | 'storage-hdd'
  | 'storage-ssd'
  | 'storage-nvme'
  | 'storage-backplane'
  | 'psu'
  | 'fan-module'
  | 'heatsink'
  | 'liquid-cooling-block'
  | 'motherboard'
  | 'riser-card'
  | 'expansion-card'
  | 'gpu'
  | 'nic'
  | 'bmc-module'
  | 'chassis-frame'
  | 'chassis-rail'
  | 'io-panel'
  | 'cable'
  | 'backplane';

// ─── Render Style (data-driven visual appearance) ─────────────────────────────
//
// These fields are the "knobs" you adjust via verbal description. The renderer
// reads them; no code changes are needed to restyle a part.

/** Named material presets — map to physically-based material configs */
export type MaterialPreset =
  | 'matte-plastic'    // diffuse, non-reflective (black connectors, fan housing)
  | 'brushed-metal'    // anisotropic metal (heatsinks, IHS)
  | 'polished-metal'   // mirror-like (gold fingers, contacts)
  | 'pcb-green'        // FR-4 board look
  | 'pcb-blue'         // blue solder mask
  | 'pcb-dark'         // dark/black solder mask
  | 'anodized-dark'    // anodized aluminium (chassis, drive shells)
  | 'glass'            // transparent (lid, light pipes)
  | 'rubber'           // soft matte black (grommets, feet)
  | 'ceramic';         // CPU substrate

export interface OutlineStyle {
  /** Show silhouette/edge outline */
  enabled: boolean;
  /** Outline color (CSS hex) */
  color?: string;
  /** Outline thickness in screen pixels */
  thickness?: number;
  /** Only draw outlines on hard edges above this angle (degrees) */
  edgeThresholdDeg?: number;
  /** Outline opacity 0–1 */
  opacity?: number;
}

export interface RenderStyle {
  /** Material preset (overrides flat metalness/roughness) */
  material?: MaterialPreset;

  /** Base fill color (CSS hex) — overrides preset's default color */
  fillColor?: string;

  /** Explicit PBR overrides (take precedence over preset) */
  metalness?: number;
  roughness?: number;
  /** 0–1, clearcoat layer strength (lacquered look) */
  clearcoat?: number;
  /** 0–1, surface transparency */
  opacity?: number;

  /** Emissive glow color (status LEDs, accents) */
  emissiveColor?: string;
  /** Emissive intensity 0–2 */
  emissiveIntensity?: number;

  /** Edge/silhouette outline configuration */
  outline?: OutlineStyle;

  /** Uniform scale multiplier applied to the loaded/generated geometry */
  scale?: number;

  /** Whether to cast/receive shadows */
  castShadow?: boolean;
  receiveShadow?: boolean;
}

// ─── Catalog Part (the canonical real-world spec for a piece of hardware) ─────

export interface CatalogPart {
  /** Globally unique catalog ID (e.g., "cpu-kunpeng920-hi1620") */
  id: string;

  /** Human-readable name */
  name: string;

  /** Short label for 3D HUD display */
  labelEn: string;

  /** Chinese label */
  labelZh: string;

  /** Part category */
  category: PartCategory;

  /** Applicable hardware standards */
  standards: HardwareStandard[];

  /** Manufacturer / vendor */
  vendor?: string;

  /** Official part number */
  partNumber?: string;

  /** Physical outer dimensions in mm */
  dimensionsMM: SizeMM;

  /** Mounting interfaces */
  mountingPoints: MountingPoint[];

  /** Electrical/mechanical connectors */
  connectors: Connector[];

  /** Thermal characteristics */
  thermal?: ThermalSpec;

  /** Rated power draw (typical operating, watts) */
  ratedPowerWatts?: number;

  /** Mass in grams */
  massGrams?: number;

  // ── Rendering hints (legacy flat fields — still honored) ─────────────────
  baseColor?: string;
  metalness?: number;
  roughness?: number;

  /**
   * Data-driven visual style. Controls outline / fill / material so the look
   * can be refined from a verbal description ("thicker outline, brushed metal")
   * WITHOUT touching rendering code. Overrides the flat baseColor/metalness/
   * roughness fields above when present.
   */
  renderStyle?: RenderStyle;

  /**
   * Correct a downloaded model's orientation. Euler XYZ degrees, applied to the
   * GLB before auto-fit/recenter. Use this one line to rotate a model that was
   * authored facing the wrong way (e.g., a fan modelled face-on instead of
   * standing). Convention: Y up, Z = chassis front→rear. Default: no rotation.
   */
  modelRotationDeg?: [number, number, number];

  /**
   * Path to GLB model file relative to /public.
   * When set, the 3D canvas loads this instead of generating procedural geometry.
   * Sources: OCP design files, KiCad kicad-packages3D, GrabCAD community uploads.
   */
  glbModelPath?: string;

  /**
   * Open-source reference link for this part.
   * E.g., OCP spec page, KiCad library entry, GrabCAD URL.
   */
  sourceReference?: string;

  /** Technical description */
  description: string;
}

// ─── Chassis Slot (where a part can be installed) ─────────────────────────────

export interface ChassisSlot {
  /** Unique slot ID within the chassis template (e.g., "cpu-socket-0") */
  id: string;

  name: string;
  nameCN: string;

  /** Part categories that can be placed in this slot */
  acceptsCategories: PartCategory[];

  /** If set, only parts matching these standards fit */
  requiresStandards?: HardwareStandard[];

  /**
   * Position of the slot origin (= part's local origin when installed)
   * in mm from the chassis interior bottom-left-front corner.
   */
  positionMM: PosMM;

  /** Part rotation when installed (Euler XYZ degrees). Default: no rotation. */
  rotationDeg?: RotDeg;

  /** Maximum part size that fits in this slot */
  maxDimensionsMM: SizeMM;

  /** Whether a part must be present for the system to be operational */
  required?: boolean;

  /** Whether a part can be replaced while the chassis is powered on */
  hotSwappable?: boolean;

  /** Visual color hint for the slot highlight in the 3D view */
  highlightColor?: string;
}

// ─── Chassis Template ─────────────────────────────────────────────────────────

export type FormFactor =
  | '1U' | '2U' | '4U' | '7U' | '10U'
  | 'ORV3'
  | 'tower-mid' | 'tower-full'
  | 'blade'
  | 'custom';

export interface ChassisTemplate {
  /** Unique template ID (e.g., "taishan-200-2280") */
  id: string;

  name: string;
  nameCN: string;

  formFactor: FormFactor;

  /** Number of rack units (0 for non-rack form factors) */
  rackUnits: number;

  /** Outer chassis dimensions in mm */
  externalDimensionsMM: SizeMM;

  /** Usable interior volume in mm */
  internalDimensionsMM: SizeMM;

  /** All defined installation slots */
  slots: ChassisSlot[];

  /** Primary cooling airflow direction */
  airflowDirection: 'front-to-rear' | 'rear-to-front' | 'bottom-to-top' | 'side-to-side';

  /** Maximum continuous power budget (watts) */
  maxPowerWatts?: number;

  /** Sheet metal color */
  sheetMetalColor?: string;

  /** Standards this chassis complies with */
  standards: HardwareStandard[];

  description: string;
}

// ─── Runtime Assembly (parts placed in a chassis) ─────────────────────────────

export interface PartPlacement {
  placementId: string;

  /** Slot ID in the chassis template */
  slotId: string;

  /** Catalog part ID */
  catalogPartId: string;

  /** Override slot position in mm (optional) */
  positionOverrideMM?: PosMM;

  /** Override rotation in deg (optional) */
  rotationOverrideDeg?: RotDeg;

  /** Operational status (drives 3D visual state) */
  status?: 'normal' | 'warning' | 'error' | 'offline';
}

export interface ChassisAssembly {
  id: string;
  name: string;
  chassisTemplateId: string;
  placements: PartPlacement[];
}
