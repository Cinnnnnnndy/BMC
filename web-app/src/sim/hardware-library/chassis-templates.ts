// ─────────────────────────────────────────────────────────────────────────────
// Chassis Templates
//
// All slot positions are in mm from the chassis interior origin:
//   (0, 0, 0) = bottom-left-front corner of the internal cavity
//   X+ = right   Y+ = up   Z+ = toward front panel
//
// Reference standards:
//   EIA-310-D: 1U = 44.45mm, rack width 482.6mm (19"), internal ≈ 430mm
//   OCP ORV3:  21" open rack, 50mm pitch
// ─────────────────────────────────────────────────────────────────────────────

import type { ChassisTemplate, ChassisSlot } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// Helper — generate an array of identical slots at uniform spacing
// ═══════════════════════════════════════════════════════════════════════════
function repeatedSlots(
  idPrefix: string,
  namePrefix: string,
  nameCNPrefix: string,
  count: number,
  base: Omit<ChassisSlot, 'id' | 'name' | 'nameCN'>,
  stepX = 0,
  stepY = 0,
  stepZ = 0,
): ChassisSlot[] {
  return Array.from({ length: count }, (_, i) => ({
    ...base,
    id: `${idPrefix}-${i}`,
    name: `${namePrefix} ${i}`,
    nameCN: `${nameCNPrefix} ${i}`,
    positionMM: {
      x: base.positionMM.x + i * stepX,
      y: base.positionMM.y + i * stepY,
      z: base.positionMM.z + i * stepZ,
    },
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// TaiShan 200 2280 — 2U OCP-inspired server
// ═══════════════════════════════════════════════════════════════════════════
//
// Layout (top view, front = Z+):
//
//  ┌──────────────────────────────────────────────────────────┐
//  │  [BMC Card]  [Ext.Board]  [Base Board: CPU×2+DIMM×16]   │
//  │                            [Fan Bank ×4]                 │
//  │  [Front IO]  [NVMe ×6 / HDD ×2 front bays]              │
//  │                                         [PSU ×2 rear]   │
//  │              [PCIe Riser ×2 rear]                        │
//  │                                    [OCP NIC rear]        │
//  └──────────────────────────────────────────────────────────┘
//
// External: 447 × 88 × 700 mm  (W × H × D, lid closed)
// Internal: 430 × 80 × 660 mm

export const TAISHAN_200_2280: ChassisTemplate = {
  id: 'taishan-200-2280',
  name: 'Huawei TaiShan 200 2280 (2U)',
  nameCN: '华为 TaiShan 200 2280 2U 服务器',
  formFactor: '2U',
  rackUnits: 2,
  externalDimensionsMM: { width: 447, height: 88, depth: 700 },
  internalDimensionsMM: { width: 430, height: 80, depth: 660 },
  airflowDirection: 'front-to-rear',
  maxPowerWatts: 2200,
  sheetMetalColor: '#2c2e33',
  standards: ['EIA-310-D', 'custom'],
  description: '华为 TaiShan 200 系列 2280 机型，双路 Kunpeng 920，最高 32× DDR4 RDIMM，6× NVMe + 2× SATA，4× 热插拔风扇，2× 900W 冗余电源。',

  slots: [
    // ── Main Board ──────────────────────────────────────────────────────
    {
      id: 'main-board',
      name: 'Main Board',
      nameCN: '主板',
      acceptsCategories: ['motherboard'],
      positionMM: { x: 20, y: 0, z: 40 },
      maxDimensionsMM: { width: 280, height: 10, depth: 280 },
      required: true,
      hotSwappable: false,
      highlightColor: '#3b82f6',
    },

    // ── CPU Sockets (2×) ────────────────────────────────────────────────
    ...repeatedSlots(
      'cpu-socket', 'CPU Socket', 'CPU 插槽',
      2,
      {
        acceptsCategories: ['cpu'],
        positionMM: { x: 95, y: 0, z: 60 },  // Socket 0 position
        maxDimensionsMM: { width: 85, height: 15, depth: 85 },
        required: true,
        hotSwappable: false,
        highlightColor: '#a78bfa',
      },
      0, 0, 160  // Socket 1 is 160mm deeper (Z direction)
    ),

    // ── DIMM Slots (16×, 8 per CPU) ─────────────────────────────────────
    // Group A (CPU 0): positions left of CPU 0
    ...Array.from({ length: 8 }, (_, i): ChassisSlot => ({
      id: `dimm-a${i}`,
      name: `DIMM A${i}`,
      nameCN: `内存槽 A${i}`,
      acceptsCategories: ['memory-module'],
      requiresStandards: ['JEDEC'],
      positionMM: {
        x: 25 + i * 18,    // 8 slots spaced 18mm apart
        y: 0,
        z: 48,
      },
      rotationDeg: { x: 0, y: 90, z: 0 },  // DIMMs stand vertically
      maxDimensionsMM: { width: 135, height: 36, depth: 5 },
      required: false,
      hotSwappable: false,
    })),
    // Group B (CPU 1): deeper Z position
    ...Array.from({ length: 8 }, (_, i): ChassisSlot => ({
      id: `dimm-b${i}`,
      name: `DIMM B${i}`,
      nameCN: `内存槽 B${i}`,
      acceptsCategories: ['memory-module'],
      requiresStandards: ['JEDEC'],
      positionMM: {
        x: 25 + i * 18,
        y: 0,
        z: 220,
      },
      rotationDeg: { x: 0, y: 90, z: 0 },
      maxDimensionsMM: { width: 135, height: 36, depth: 5 },
      required: false,
      hotSwappable: false,
    })),

    // ── Front Storage Bays: NVMe (6×) ────────────────────────────────────
    ...repeatedSlots(
      'nvme-bay', 'NVMe Bay', 'NVMe 仓位',
      6,
      {
        acceptsCategories: ['storage-nvme', 'storage-ssd', 'storage-hdd'],
        requiresStandards: ['SFF-8639'],
        positionMM: { x: 165, y: 0, z: 640 },  // front bay, top row
        maxDimensionsMM: { width: 72, height: 20, depth: 102 },
        required: false,
        hotSwappable: true,
        highlightColor: '#f97316',
      },
      40, 0, 0   // 6 bays spaced 40mm apart left-to-right
    ),

    // ── Front Storage Bays: SATA HDD (2×) ───────────────────────────────
    ...repeatedSlots(
      'hdd-bay', 'HDD Bay', 'HDD 仓位',
      2,
      {
        acceptsCategories: ['storage-hdd', 'storage-ssd'],
        positionMM: { x: 50, y: 0, z: 640 },
        maxDimensionsMM: { width: 72, height: 20, depth: 102 },
        required: false,
        hotSwappable: true,
        highlightColor: '#f97316',
      },
      80, 0, 0
    ),

    // ── Fan Bank (4× hot-swap dual-rotor modules) ────────────────────────
    ...repeatedSlots(
      'fan-bay', 'Fan Bay', '风扇仓',
      4,
      {
        acceptsCategories: ['fan-module'],
        positionMM: { x: 300, y: 10, z: 40 },
        maxDimensionsMM: { width: 68, height: 70, depth: 85 },
        required: true,
        hotSwappable: true,
        highlightColor: '#22d3ee',
      },
      0, 0, 95   // 4 fan modules stacked front-to-rear, 95mm pitch
    ),

    // ── PSU Bays (2× hot-swap, rear-loading) ─────────────────────────────
    {
      id: 'psu-bay-0',
      name: 'PSU Bay 0',
      nameCN: '电源仓 0',
      acceptsCategories: ['psu'],
      positionMM: { x: 370, y: 0, z: 90 },
      maxDimensionsMM: { width: 75, height: 45, depth: 200 },
      required: true,
      hotSwappable: true,
      highlightColor: '#f5c842',
    },
    {
      id: 'psu-bay-1',
      name: 'PSU Bay 1 (Redundant)',
      nameCN: '电源仓 1（冗余）',
      acceptsCategories: ['psu'],
      positionMM: { x: 370, y: 0, z: 300 },
      maxDimensionsMM: { width: 75, height: 45, depth: 200 },
      required: false,
      hotSwappable: true,
      highlightColor: '#f5c842',
    },

    // ── PCIe Riser Slots (2× rear, full-height) ──────────────────────────
    {
      id: 'pcie-riser-0',
      name: 'PCIe Riser 0 (×16)',
      nameCN: 'PCIe 转接槽 0 (×16)',
      acceptsCategories: ['riser-card', 'expansion-card', 'gpu', 'nic'],
      requiresStandards: ['PCIe-FH-HL'],
      positionMM: { x: 55, y: 0, z: 15 },
      maxDimensionsMM: { width: 115, height: 80, depth: 200 },
      required: false,
      hotSwappable: false,
      highlightColor: '#c084fc',
    },
    {
      id: 'pcie-riser-1',
      name: 'PCIe Riser 1 (×8)',
      nameCN: 'PCIe 转接槽 1 (×8)',
      acceptsCategories: ['riser-card', 'expansion-card'],
      requiresStandards: ['PCIe-FH-HL'],
      positionMM: { x: 200, y: 0, z: 15 },
      maxDimensionsMM: { width: 115, height: 80, depth: 200 },
      required: false,
      hotSwappable: false,
      highlightColor: '#c084fc',
    },

    // ── OCP NIC Slot (rear) ──────────────────────────────────────────────
    {
      id: 'ocp-nic-slot',
      name: 'OCP NIC Slot',
      nameCN: 'OCP NIC 槽位',
      acceptsCategories: ['nic'],
      requiresStandards: ['OCP-3.0'],
      positionMM: { x: 330, y: 8, z: 15 },
      maxDimensionsMM: { width: 115, height: 45, depth: 70 },
      required: false,
      hotSwappable: false,
      highlightColor: '#34d399',
    },

    // ── BMC Card Slot (left wing) ────────────────────────────────────────
    {
      id: 'bmc-card-slot',
      name: 'BMC Card Slot',
      nameCN: 'BMC 管理卡槽',
      acceptsCategories: ['bmc-module'],
      positionMM: { x: 5, y: 0, z: 60 },
      maxDimensionsMM: { width: 115, height: 12, depth: 245 },
      required: true,
      hotSwappable: false,
      highlightColor: '#5b9cf6',
    },

    // ── Extension Board Slot (between BMC card and main board) ───────────
    {
      id: 'ext-board-slot',
      name: 'Extension Board',
      nameCN: '扩展背板',
      acceptsCategories: ['backplane'],
      positionMM: { x: 125, y: 0, z: 50 },
      maxDimensionsMM: { width: 130, height: 10, depth: 270 },
      required: false,
      hotSwappable: false,
    },

    // ── Front I/O Panel ──────────────────────────────────────────────────
    {
      id: 'front-io',
      name: 'Front I/O Panel',
      nameCN: '前面板 I/O',
      acceptsCategories: ['io-panel'],
      positionMM: { x: 10, y: 5, z: 655 },
      maxDimensionsMM: { width: 60, height: 40, depth: 15 },
      required: false,
      hotSwappable: false,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// Generic 1U OCP Server
// ═══════════════════════════════════════════════════════════════════════════
// Inspired by OCP Yosemite v3 / Tioga Pass single-node design
// External: 482.6 × 44.45 × 650 mm  (1U EIA-310-D)
// Internal: 430 × 38 × 620 mm

export const GENERIC_1U_OCP: ChassisTemplate = {
  id: 'generic-1u-ocp',
  name: 'Generic 1U OCP Single-Node',
  nameCN: '通用 1U OCP 单节点服务器',
  formFactor: '1U',
  rackUnits: 1,
  externalDimensionsMM: { width: 482.6, height: 44.45, depth: 650 },
  internalDimensionsMM: { width: 430, height: 38, depth: 620 },
  airflowDirection: 'front-to-rear',
  maxPowerWatts: 1000,
  sheetMetalColor: '#1e2228',
  standards: ['EIA-310-D', 'OCP-3.0'],
  description: '通用 1U OCP 单节点，双路 LGA4677/SP5，16× DDR5，10× 2.5" NVMe 前置，2× 热插拔 1U 电源，OCP 3.0 NIC 槽位。',

  slots: [
    // Main board
    {
      id: 'main-board',
      name: 'Main Board (SSI-EEB)',
      nameCN: '主板 (SSI-EEB)',
      acceptsCategories: ['motherboard'],
      positionMM: { x: 15, y: 0, z: 20 },
      maxDimensionsMM: { width: 305, height: 8, depth: 330 },
      required: true,
      hotSwappable: false,
    },

    // CPUs
    ...repeatedSlots(
      'cpu-socket', 'CPU Socket', 'CPU 插槽',
      2,
      {
        acceptsCategories: ['cpu'],
        positionMM: { x: 80, y: 0, z: 30 },
        maxDimensionsMM: { width: 80, height: 12, depth: 80 },
        required: true,
        hotSwappable: false,
        highlightColor: '#a78bfa',
      },
      150, 0, 0
    ),

    // 16× DIMM
    ...Array.from({ length: 16 }, (_, i): ChassisSlot => ({
      id: `dimm-${i}`,
      name: `DIMM ${i}`,
      nameCN: `内存槽 ${i}`,
      acceptsCategories: ['memory-module'],
      positionMM: {
        x: 15 + i * 25,
        y: 0,
        z: 22,
      },
      rotationDeg: { x: 0, y: 90, z: 0 },
      maxDimensionsMM: { width: 135, height: 36, depth: 5 },
      required: false,
      hotSwappable: false,
    })),

    // 10× 2.5" front NVMe bays
    ...repeatedSlots(
      'nvme-bay', 'NVMe Bay', 'NVMe 仓位',
      10,
      {
        acceptsCategories: ['storage-nvme', 'storage-ssd'],
        requiresStandards: ['SFF-8639'],
        positionMM: { x: 20, y: 0, z: 580 },
        maxDimensionsMM: { width: 72, height: 18, depth: 102 },
        required: false,
        hotSwappable: true,
        highlightColor: '#f97316',
      },
      40, 0, 0
    ),

    // OCP NIC
    {
      id: 'ocp-nic-slot',
      name: 'OCP 3.0 NIC',
      nameCN: 'OCP 3.0 网卡槽',
      acceptsCategories: ['nic'],
      requiresStandards: ['OCP-3.0'],
      positionMM: { x: 330, y: 5, z: 15 },
      maxDimensionsMM: { width: 115, height: 32, depth: 70 },
      required: false,
      hotSwappable: false,
      highlightColor: '#34d399',
    },

    // 2× PSU rear
    ...repeatedSlots(
      'psu-bay', 'PSU Bay', '电源仓',
      2,
      {
        acceptsCategories: ['psu'],
        positionMM: { x: 356, y: 0, z: 50 },
        maxDimensionsMM: { width: 75, height: 40, depth: 195 },
        required: true,
        hotSwappable: true,
        highlightColor: '#f5c842',
      },
      0, 0, 220
    ),

    // Fan modules (3× 60mm high-perf)
    ...repeatedSlots(
      'fan-bay', 'Fan Bay', '风扇仓',
      3,
      {
        acceptsCategories: ['fan-module'],
        positionMM: { x: 330, y: 5, z: 100 },
        maxDimensionsMM: { width: 65, height: 40, depth: 65 },
        required: true,
        hotSwappable: true,
        highlightColor: '#22d3ee',
      },
      0, 0, 140
    ),
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// Generic 2U ATX Tower Server
// ═══════════════════════════════════════════════════════════════════════════
// Standard 2U rackmount with ATX/E-ATX compatibility
// External: 482.6 × 88.9 × 700 mm
// Internal: 430 × 82 × 660 mm

export const GENERIC_2U_ATX: ChassisTemplate = {
  id: 'generic-2u-atx',
  name: 'Generic 2U ATX Rackmount',
  nameCN: '通用 2U ATX 机架服务器',
  formFactor: '2U',
  rackUnits: 2,
  externalDimensionsMM: { width: 482.6, height: 88.9, depth: 700 },
  internalDimensionsMM: { width: 430, height: 82, depth: 660 },
  airflowDirection: 'front-to-rear',
  maxPowerWatts: 1600,
  sheetMetalColor: '#252830',
  standards: ['EIA-310-D', 'ATX', 'E-ATX'],
  description: '通用 2U ATX/E-ATX 机架，单路 LGA4677，8× DDR5，4× 3.5" + 4× 2.5" 存储，3× PCIe 扩展，2× 1U PSU。',

  slots: [
    {
      id: 'main-board',
      name: 'Main Board (E-ATX)',
      nameCN: '主板 (E-ATX)',
      acceptsCategories: ['motherboard'],
      positionMM: { x: 20, y: 0, z: 30 },
      maxDimensionsMM: { width: 305, height: 12, depth: 330 },
      required: true,
      hotSwappable: false,
    },

    // Single CPU
    {
      id: 'cpu-socket-0',
      name: 'CPU Socket 0',
      nameCN: 'CPU 插槽 0',
      acceptsCategories: ['cpu'],
      positionMM: { x: 120, y: 0, z: 80 },
      maxDimensionsMM: { width: 85, height: 15, depth: 85 },
      required: true,
      hotSwappable: false,
      highlightColor: '#a78bfa',
    },

    // 8× DIMM
    ...Array.from({ length: 8 }, (_, i): ChassisSlot => ({
      id: `dimm-${i}`,
      name: `DIMM ${i}`,
      nameCN: `内存槽 ${i}`,
      acceptsCategories: ['memory-module'],
      positionMM: {
        x: 20 + i * 18,
        y: 0,
        z: 35,
      },
      rotationDeg: { x: 0, y: 90, z: 0 },
      maxDimensionsMM: { width: 135, height: 36, depth: 5 },
      required: false,
      hotSwappable: false,
    })),

    // 4× 3.5" HDD front bays
    ...repeatedSlots(
      'hdd35-bay', 'HDD 3.5" Bay', '3.5" HDD 仓',
      4,
      {
        acceptsCategories: ['storage-hdd'],
        positionMM: { x: 20, y: 0, z: 570 },
        maxDimensionsMM: { width: 105, height: 30, depth: 150 },
        required: false,
        hotSwappable: true,
        highlightColor: '#f97316',
      },
      105, 0, 0
    ),

    // 4× 2.5" NVMe bays (upper row)
    ...repeatedSlots(
      'nvme25-bay', 'NVMe 2.5" Bay', '2.5" NVMe 仓',
      4,
      {
        acceptsCategories: ['storage-nvme', 'storage-ssd'],
        positionMM: { x: 20, y: 20, z: 570 },
        maxDimensionsMM: { width: 72, height: 20, depth: 102 },
        required: false,
        hotSwappable: true,
        highlightColor: '#fb923c',
      },
      75, 0, 0
    ),

    // 3× PCIe full-height (rear)
    ...Array.from({ length: 3 }, (_, i): ChassisSlot => ({
      id: `pcie-slot-${i}`,
      name: `PCIe Slot ${i}`,
      nameCN: `PCIe 扩展槽 ${i}`,
      acceptsCategories: ['expansion-card', 'nic', 'gpu', 'riser-card'],
      positionMM: {
        x: 20 + i * 30,
        y: 0,
        z: 15,
      },
      maxDimensionsMM: { width: 25, height: 82, depth: 200 },
      required: false,
      hotSwappable: false,
      highlightColor: '#c084fc',
    })),

    // 2× PSU
    ...repeatedSlots(
      'psu-bay', 'PSU Bay', '电源仓',
      2,
      {
        acceptsCategories: ['psu'],
        positionMM: { x: 355, y: 0, z: 60 },
        maxDimensionsMM: { width: 75, height: 45, depth: 200 },
        required: true,
        hotSwappable: true,
        highlightColor: '#f5c842',
      },
      0, 0, 240
    ),

    // 4× 80mm fans
    ...repeatedSlots(
      'fan-bay', 'Fan Bay', '风扇仓',
      4,
      {
        acceptsCategories: ['fan-module'],
        positionMM: { x: 330, y: 5, z: 100 },
        maxDimensionsMM: { width: 90, height: 75, depth: 85 },
        required: true,
        hotSwappable: true,
        highlightColor: '#22d3ee',
      },
      0, 0, 130
    ),
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// All templates
// ═══════════════════════════════════════════════════════════════════════════

export const ALL_CHASSIS_TEMPLATES: ChassisTemplate[] = [
  TAISHAN_200_2280,
  GENERIC_1U_OCP,
  GENERIC_2U_ATX,
];
