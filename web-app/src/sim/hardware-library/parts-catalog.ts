// ─────────────────────────────────────────────────────────────────────────────
// Hardware Parts Catalog
//
// Real-world specifications sourced from:
//   - OCP (opencompute.org) design files
//   - JEDEC JESD79-5 DDR5 standard
//   - SFF-8639 (U.2) specification
//   - KiCad kicad-packages3D open library
//   - Vendor public datasheets
//
// Dimensions: width × height × depth in mm
// ─────────────────────────────────────────────────────────────────────────────

import type { CatalogPart } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// CPUs
// ═══════════════════════════════════════════════════════════════════════════

export const CPU_PARTS: CatalogPart[] = [
  {
    id: 'cpu-kunpeng920-hi1620',
    name: 'HiSilicon Kunpeng 920 (Hi1620)',
    labelEn: 'Kunpeng 920',
    labelZh: '鲲鹏 920',
    category: 'cpu',
    standards: ['custom'],
    vendor: 'HiSilicon (Huawei)',
    partNumber: 'Hi1620',
    // LGA-style socket: substrate 77.4 × 60.2 mm, package height ~4.7 mm bare die
    dimensionsMM: { width: 77.4, height: 4.7, depth: 60.2 },
    mountingPoints: [
      { id: 'lga-socket', type: 'guide-pin', posMM: { x: 38.7, y: 0, z: 30.1 }, face: 'Y-' },
    ],
    connectors: [
      { id: 'socket-0', type: 'bga-hi1620', face: 'Y-', posMM: { x: 38.7, y: 0, z: 30.1 }, gender: 'male' },
    ],
    thermal: {
      tdpWatts: 180,
      heatExhaustFace: 'Y+',
      requiresActiveCooling: true,
      minAirflowCFM: 25,
      maxJunctionTempC: 105,
    },
    ratedPowerWatts: 120,
    massGrams: 68,
    baseColor: '#c0c2c8',
    metalness: 0.88,
    roughness: 0.28,
    renderStyle: {
      material: 'brushed-metal',
      fillColor: '#c4c6cc',
      outline: { enabled: true, color: '#5b6270', thickness: 1.4, edgeThresholdDeg: 25 },
    },
    sourceReference: 'https://www.hisilicon.com/en/products/Kunpeng/Kunpeng-920',
    description: '鲲鹏 920，64 核 ARMv8.2-A，2.6 GHz，7nm，支持 PCIe 4.0 × 40、DDR4/LPDDR4x × 8 通道。',
  },
  {
    id: 'cpu-intel-xeon-8480plus',
    name: 'Intel Xeon Platinum 8480+',
    labelEn: 'Xeon 8480+',
    labelZh: 'Intel 至强铂金 8480+',
    category: 'cpu',
    standards: ['custom'],
    vendor: 'Intel',
    partNumber: 'BX807138480+',
    // LGA4677 package: 76.6 × 65.2 mm, height ~7.5 mm with IHS
    dimensionsMM: { width: 76.6, height: 7.5, depth: 65.2 },
    mountingPoints: [
      { id: 'lga4677-socket', type: 'guide-pin', posMM: { x: 38.3, y: 0, z: 32.6 }, face: 'Y-' },
    ],
    connectors: [
      { id: 'socket-lga4677', type: 'lga4677', face: 'Y-', posMM: { x: 38.3, y: 0, z: 32.6 }, gender: 'male' },
    ],
    thermal: {
      tdpWatts: 350,
      heatExhaustFace: 'Y+',
      requiresActiveCooling: true,
      minAirflowCFM: 35,
      maxJunctionTempC: 100,
    },
    ratedPowerWatts: 350,
    massGrams: 83,
    baseColor: '#c8cace',
    metalness: 0.90,
    roughness: 0.25,
    sourceReference: 'https://ark.intel.com/content/www/us/en/ark/products/229773',
    description: '60 核 Sapphire Rapids，第四代至强，LGA4677，60MB LLC，PCIe 5.0 × 80，HBM2e 可选。',
  },
  {
    id: 'cpu-amd-epyc-9654',
    name: 'AMD EPYC 9654 (Genoa)',
    labelEn: 'EPYC 9654',
    labelZh: 'AMD EPYC 9654',
    category: 'cpu',
    standards: ['custom'],
    vendor: 'AMD',
    partNumber: '100-000000789',
    // SP5 package: 72 × 75.4 mm, height ~6.2 mm with IHS
    dimensionsMM: { width: 72, height: 6.2, depth: 75.4 },
    mountingPoints: [
      { id: 'sp5-socket', type: 'guide-pin', posMM: { x: 36, y: 0, z: 37.7 }, face: 'Y-' },
    ],
    connectors: [
      { id: 'socket-sp5', type: 'sp5', face: 'Y-', posMM: { x: 36, y: 0, z: 37.7 }, gender: 'male' },
    ],
    thermal: {
      tdpWatts: 360,
      heatExhaustFace: 'Y+',
      requiresActiveCooling: true,
      minAirflowCFM: 38,
      maxJunctionTempC: 95,
    },
    ratedPowerWatts: 360,
    massGrams: 79,
    baseColor: '#b8bcca',
    metalness: 0.85,
    roughness: 0.30,
    sourceReference: 'https://www.amd.com/en/products/cpu/amd-epyc-9654',
    description: '96 核 Zen 4，第四代 EPYC，SP5 socket，384MB L3，PCIe 5.0 × 128，12 通道 DDR5。',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Memory Modules
// ═══════════════════════════════════════════════════════════════════════════

export const MEMORY_PARTS: CatalogPart[] = [
  {
    id: 'mem-ddr5-32gb-4800-rdimm',
    name: 'DDR5-4800 32GB RDIMM',
    labelEn: '32GB DDR5',
    labelZh: 'DDR5 32GB RDIMM',
    category: 'memory-module',
    standards: ['JEDEC'],
    vendor: 'Generic / Micron',
    // JEDEC: 133.35 mm × 31.25 mm × 4.5 mm (single rank, no heatspreader)
    dimensionsMM: { width: 133.35, height: 31.25, depth: 4.5 },
    mountingPoints: [],
    connectors: [
      { id: 'dimm-edge', type: 'dimm-ddr5', face: 'Y-', posMM: { x: 66.7, y: 0, z: 2.25 }, gender: 'male' },
    ],
    ratedPowerWatts: 5.5,
    massGrams: 14,
    baseColor: '#152015',
    metalness: 0.10,
    roughness: 0.82,
    renderStyle: {
      material: 'pcb-green',
      outline: { enabled: true, color: '#0b0e14', thickness: 1.0, edgeThresholdDeg: 20 },
    },
    sourceReference: 'https://github.com/KiCad/kicad-packages3D',
    description: '32GB DDR5-4800 ECC RDIMM，单双通道，CL40，支持 RAS 功能，ECC 纠错。',
  },
  {
    id: 'mem-ddr5-64gb-4800-rdimm',
    name: 'DDR5-4800 64GB RDIMM',
    labelEn: '64GB DDR5',
    labelZh: 'DDR5 64GB RDIMM',
    category: 'memory-module',
    standards: ['JEDEC'],
    vendor: 'Samsung / SK Hynix',
    dimensionsMM: { width: 133.35, height: 31.25, depth: 4.5 },
    mountingPoints: [],
    connectors: [
      { id: 'dimm-edge', type: 'dimm-ddr5', face: 'Y-', posMM: { x: 66.7, y: 0, z: 2.25 }, gender: 'male' },
    ],
    ratedPowerWatts: 7.8,
    massGrams: 18,
    baseColor: '#152015',
    metalness: 0.10,
    roughness: 0.82,
    description: '64GB DDR5-4800 ECC RDIMM，高密度 3DS 封装，适用于内存密集型工作负载。',
  },
  {
    id: 'mem-ddr4-32gb-3200-rdimm',
    name: 'DDR4-3200 32GB RDIMM',
    labelEn: '32GB DDR4',
    labelZh: 'DDR4 32GB RDIMM',
    category: 'memory-module',
    standards: ['JEDEC'],
    vendor: 'Samsung',
    partNumber: 'M393A4K40EB3-CWE',
    // Same form factor as DDR5 (JEDEC 288-pin)
    dimensionsMM: { width: 133.35, height: 31.25, depth: 3.8 },
    mountingPoints: [],
    connectors: [
      { id: 'dimm-edge', type: 'dimm-ddr4', face: 'Y-', posMM: { x: 66.7, y: 0, z: 1.9 }, gender: 'male' },
    ],
    ratedPowerWatts: 4.2,
    massGrams: 12,
    baseColor: '#152015',
    metalness: 0.08,
    roughness: 0.85,
    description: '32GB DDR4-3200 ECC RDIMM，单 rank，CAS 22，适配 Kunpeng 920 / Intel Ice Lake。',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Storage
// ═══════════════════════════════════════════════════════════════════════════

export const STORAGE_PARTS: CatalogPart[] = [
  {
    id: 'nvme-samsung-pm9a3-1920gb-u2',
    name: 'Samsung PM9A3 1.92TB U.2 NVMe',
    labelEn: 'PM9A3 1.92TB',
    labelZh: '三星 PM9A3 U.2',
    category: 'storage-nvme',
    standards: ['SFF-8639', 'EIA-310-D'],
    vendor: 'Samsung',
    partNumber: 'MZQL21T9HCJR-00A07',
    // 2.5" U.2 form factor: 69.85 × 100.4 × 15 mm
    dimensionsMM: { width: 69.85, height: 15, depth: 100.4 },
    mountingPoints: [
      { id: 'sff-8639-mount', type: 'M3-screw', posMM: { x: 34.925, y: 0, z: 95 }, face: 'Y-' },
    ],
    connectors: [
      { id: 'u2-rear', type: 'u2-sff8639', face: 'Z+', posMM: { x: 34.925, y: 7.5, z: 100.4 }, gender: 'male' },
    ],
    thermal: {
      tdpWatts: 25,
      heatExhaustFace: 'Y+',
      requiresActiveCooling: false,
      maxJunctionTempC: 70,
    },
    ratedPowerWatts: 14,
    massGrams: 170,
    baseColor: '#292e3a',
    metalness: 0.72,
    roughness: 0.26,
    renderStyle: {
      material: 'anodized-dark',
      fillColor: '#2b3140',
      outline: { enabled: true, color: '#7dd3fc', thickness: 2.0, edgeThresholdDeg: 15 },
    },
    sourceReference: 'https://semiconductor.samsung.com/us/consumer-storage/enterprise-ssd/pm9a3/',
    description: '1.92TB PCIe 4.0 × 4 U.2 NVMe，顺序读 6.9GB/s，延迟 ≤100μs，适用于 AI 推理和数据库场景。',
  },
  {
    id: 'nvme-seagate-nytro-xf1230-960gb-u2',
    name: 'Seagate Nytro XF1230 960GB U.2',
    labelEn: 'XF1230 960GB',
    labelZh: '希捷 Nytro U.2 SSD',
    category: 'storage-nvme',
    standards: ['SFF-8639'],
    vendor: 'Seagate',
    partNumber: 'XF1230-1A0960',
    dimensionsMM: { width: 69.85, height: 15, depth: 100.4 },
    mountingPoints: [
      { id: 'u2-mount', type: 'M3-screw', posMM: { x: 34.925, y: 0, z: 95 }, face: 'Y-' },
    ],
    connectors: [
      { id: 'u2-rear', type: 'u2-sff8639', face: 'Z+', posMM: { x: 34.925, y: 7.5, z: 100.4 }, gender: 'male' },
    ],
    thermal: { tdpWatts: 6, heatExhaustFace: 'Y+', requiresActiveCooling: false },
    ratedPowerWatts: 5.5,
    massGrams: 145,
    baseColor: '#282c35',
    metalness: 0.65,
    roughness: 0.40,
    description: '960GB SATA III 2.5" SSD，顺序读 560MB/s，企业级耐久性，5 年保修。',
  },
  {
    id: 'hdd-seagate-exos-x16-4tb-sata',
    name: 'Seagate Exos X16 4TB SATA 3.5"',
    labelEn: 'Exos X16 4TB',
    labelZh: '希捷 Exos X16 4TB',
    category: 'storage-hdd',
    standards: ['EIA-310-D'],
    vendor: 'Seagate',
    partNumber: 'ST4000NM001G',
    // 3.5" HDD: 101.6 × 26.1 × 146.99 mm
    dimensionsMM: { width: 101.6, height: 26.1, depth: 146.99 },
    mountingPoints: [
      { id: 'side-screw-fl', type: 'M3-screw', posMM: { x: 0, y: 6, z: 28.5 }, face: 'X-' },
      { id: 'side-screw-fr', type: 'M3-screw', posMM: { x: 0, y: 6, z: 71.5 }, face: 'X-' },
      { id: 'side-screw-rl', type: 'M3-screw', posMM: { x: 101.6, y: 6, z: 28.5 }, face: 'X+' },
      { id: 'side-screw-rr', type: 'M3-screw', posMM: { x: 101.6, y: 6, z: 71.5 }, face: 'X+' },
    ],
    connectors: [
      { id: 'sata-data', type: 'sata-data', face: 'Z+', posMM: { x: 80, y: 7, z: 147 }, gender: 'female' },
      { id: 'sata-pwr', type: 'sata-power', face: 'Z+', posMM: { x: 50, y: 7, z: 147 }, gender: 'female' },
    ],
    thermal: { tdpWatts: 9, heatExhaustFace: 'Y+', requiresActiveCooling: false },
    ratedPowerWatts: 7.5,
    massGrams: 630,
    baseColor: '#282c35',
    metalness: 0.65,
    roughness: 0.40,
    description: '4TB 企业级 SATA 3.5" HDD，7200 RPM，256MB 缓存，持续传输率 261MB/s，MTBF 250 万小时。',
  },
  {
    id: 'hdd-seagate-exos-4tb-sata-25',
    name: 'Seagate Exos 4TB SATA 2.5"',
    labelEn: 'Exos 4TB 2.5"',
    labelZh: '希捷 Exos 2.5" 4TB',
    category: 'storage-hdd',
    standards: ['EIA-310-D'],
    vendor: 'Seagate',
    partNumber: 'ST4000NX0363',
    // 2.5" 15mm HDD: 69.85 × 15 × 100.4 mm
    dimensionsMM: { width: 69.85, height: 15, depth: 100.4 },
    mountingPoints: [
      { id: 'bot-fl', type: 'M3-screw', posMM: { x: 14, y: 0, z: 0 }, face: 'Y-' },
      { id: 'bot-fr', type: 'M3-screw', posMM: { x: 55.5, y: 0, z: 0 }, face: 'Y-' },
    ],
    connectors: [
      { id: 'sata-data', type: 'sata-data', face: 'Z+', posMM: { x: 54, y: 7.5, z: 100.4 }, gender: 'female' },
      { id: 'sata-pwr', type: 'sata-power', face: 'Z+', posMM: { x: 32, y: 7.5, z: 100.4 }, gender: 'female' },
    ],
    thermal: { tdpWatts: 8, heatExhaustFace: 'Y+', requiresActiveCooling: false },
    ratedPowerWatts: 7,
    massGrams: 210,
    baseColor: '#282c35',
    metalness: 0.65,
    roughness: 0.42,
    description: '4TB 企业级 SATA 2.5" HDD，15mm 高度，7200 RPM，适用于高密度存储节点。',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Power Supply Units
// ═══════════════════════════════════════════════════════════════════════════

export const PSU_PARTS: CatalogPart[] = [
  {
    id: 'psu-huawei-900w-hot-swap',
    name: 'Huawei 900W Hot-Swap PSU',
    labelEn: 'PSU 900W',
    labelZh: '华为 900W 热插拔电源',
    category: 'psu',
    standards: ['custom'],
    vendor: 'Huawei',
    // Typical 1U hot-swap PSU: 73.5 × 40 × 185 mm
    dimensionsMM: { width: 73.5, height: 40, depth: 185 },
    mountingPoints: [
      { id: 'lever-latch', type: 'tool-less-lever', posMM: { x: 36.75, y: 20, z: 0 }, face: 'Z-' },
    ],
    connectors: [
      { id: 'dc-out', type: 'ocp-power', face: 'Z+', posMM: { x: 30, y: 20, z: 185 }, gender: 'male' },
      { id: 'pmbus', type: 'i2c-smb', face: 'Z+', posMM: { x: 60, y: 20, z: 185 }, gender: 'male' },
    ],
    thermal: { tdpWatts: 900, heatExhaustFace: 'Z-', requiresActiveCooling: true },
    ratedPowerWatts: 900,
    massGrams: 1200,
    baseColor: '#1e2026',
    metalness: 0.60,
    roughness: 0.60,
    // HP PSU STEP exports with its long axis along X (238mm); rotate 90° about Y
    // so the long axis runs front→back (Z) to seat correctly in the rear bay.
    modelRotationDeg: [0, 90, 0],
    description: '900W AC-DC，1+1 热插拔冗余，效率 96%（Titanium），PMBus I2C 监控，AC 100-240V 宽压。',
  },
  {
    id: 'psu-delta-dps800ab-800w',
    name: 'Delta DPS-800AB-4A 800W',
    labelEn: 'DPS-800 800W',
    labelZh: '台达 800W 1U PSU',
    category: 'psu',
    standards: ['custom'],
    vendor: 'Delta Electronics',
    partNumber: 'DPS-800AB-4A',
    dimensionsMM: { width: 73.5, height: 40, depth: 185 },
    mountingPoints: [
      { id: 'lever-latch', type: 'tool-less-lever', posMM: { x: 36.75, y: 20, z: 0 }, face: 'Z-' },
    ],
    connectors: [
      { id: 'dc-out', type: 'ocp-power', face: 'Z+', posMM: { x: 30, y: 20, z: 185 }, gender: 'male' },
      { id: 'pmbus', type: 'i2c-smb', face: 'Z+', posMM: { x: 60, y: 20, z: 185 }, gender: 'male' },
    ],
    thermal: { tdpWatts: 800, heatExhaustFace: 'Z-', requiresActiveCooling: true },
    ratedPowerWatts: 800,
    massGrams: 1100,
    baseColor: '#1a1e26',
    metalness: 0.62,
    roughness: 0.55,
    // 3D model auto-detected from models/psu-delta-dps800ab-800w.glb (by part id).
    renderStyle: {
      // Keep the authored GLB materials (no preset → no override), just style the outline
      outline: { enabled: true, color: '#0b0e14', thickness: 1.2, edgeThresholdDeg: 22 },
    },
    sourceReference: 'Parametric GLB generated via scripts/gen-psu-glb.mjs (CRPS 1U form factor) — swap by replacing models/psu-delta-dps800ab-800w.glb.',
    description: '800W 1+1 冗余热插拔电源，80 PLUS Platinum，12V 输出，PMBus v1.3 管理接口。',
  },
  {
    id: 'psu-delta-dps1300ab-1300w',
    name: 'Delta DPS-1300AB 1300W',
    labelEn: 'DPS-1300 1300W',
    labelZh: '台达 1300W PSU',
    category: 'psu',
    standards: ['custom'],
    vendor: 'Delta Electronics',
    partNumber: 'DPS-1300AB-6A',
    dimensionsMM: { width: 73.5, height: 40, depth: 212 },
    mountingPoints: [
      { id: 'lever-latch', type: 'tool-less-lever', posMM: { x: 36.75, y: 20, z: 0 }, face: 'Z-' },
    ],
    connectors: [
      { id: 'dc-out', type: 'ocp-power', face: 'Z+', posMM: { x: 30, y: 20, z: 212 }, gender: 'male' },
    ],
    thermal: { tdpWatts: 1300, heatExhaustFace: 'Z-', requiresActiveCooling: true },
    ratedPowerWatts: 1300,
    massGrams: 1450,
    baseColor: '#1a1e26',
    metalness: 0.62,
    roughness: 0.55,
    description: '1300W 高功率热插拔电源，适用于 GPU 加速服务器，80 PLUS Titanium。',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Cooling — Fan Modules
// ═══════════════════════════════════════════════════════════════════════════

export const COOLING_PARTS: CatalogPart[] = [
  {
    id: 'fan-dual80mm-counterrotating',
    name: 'Dual 80mm Counter-Rotating Fan Module',
    labelEn: 'Fan Module ×2',
    labelZh: '双转子风扇模组',
    category: 'fan-module',
    standards: ['custom'],
    vendor: 'Delta / Sanyo',
    // Two 80mm fans side-by-side in a carrier: 160 × 65 × 80 mm
    dimensionsMM: { width: 160, height: 65, depth: 80 },
    mountingPoints: [
      { id: 'hot-swap-guide', type: 'guide-pin', posMM: { x: 80, y: 65, z: 0 }, face: 'Z-' },
    ],
    connectors: [
      { id: 'fan-pwr-0', type: 'fan-4pin-pwm', face: 'Z+', posMM: { x: 40, y: 10, z: 80 }, gender: 'female' },
      { id: 'fan-pwr-1', type: 'fan-4pin-pwm', face: 'Z+', posMM: { x: 120, y: 10, z: 80 }, gender: 'female' },
    ],
    thermal: { tdpWatts: 50, heatExhaustFace: 'Z-', requiresActiveCooling: false },
    ratedPowerWatts: 28,
    massGrams: 380,
    baseColor: '#252830',
    metalness: 0.42,
    roughness: 0.68,
    description: '双 80mm 对旋热插拔风扇模组，最高转速 16000 RPM，最大风量 82 CFM，通过 I2C PWM 调速。',
  },
  {
    id: 'fan-60mm-1u-high-perf',
    name: '60mm 1U High-Performance Fan',
    labelEn: '60mm 1U Fan',
    labelZh: '60mm 1U 薄型风扇',
    category: 'fan-module',
    standards: ['custom'],
    vendor: 'Nidec / Sanyo',
    dimensionsMM: { width: 60, height: 38, depth: 60 },
    mountingPoints: [
      { id: 'corner-screw-fl', type: 'M4-screw', posMM: { x: 6, y: 0, z: 6 }, face: 'Y-' },
      { id: 'corner-screw-fr', type: 'M4-screw', posMM: { x: 54, y: 0, z: 6 }, face: 'Y-' },
      { id: 'corner-screw-rl', type: 'M4-screw', posMM: { x: 6, y: 0, z: 54 }, face: 'Y-' },
      { id: 'corner-screw-rr', type: 'M4-screw', posMM: { x: 54, y: 0, z: 54 }, face: 'Y-' },
    ],
    connectors: [
      { id: 'fan-pwr', type: 'fan-4pin-pwm', face: 'X+', posMM: { x: 60, y: 10, z: 30 }, gender: 'female' },
    ],
    thermal: { tdpWatts: 28, heatExhaustFace: 'Z-', requiresActiveCooling: false },
    ratedPowerWatts: 18,
    massGrams: 95,
    baseColor: '#1a1c20',
    metalness: 0.35,
    roughness: 0.75,
    description: '60mm 薄型 1U 机箱风扇，最高 18000 RPM，适用于高密度 1U 服务器散热区。',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Network Interface Cards
// ═══════════════════════════════════════════════════════════════════════════

export const NIC_PARTS: CatalogPart[] = [
  {
    id: 'nic-mellanox-mcx512a-ocp3-2x25g',
    name: 'Mellanox ConnectX-5 2×25GbE OCP 3.0',
    labelEn: 'MCX5 2×25G OCP3',
    labelZh: '迈络思 ConnectX-5 OCP3',
    category: 'nic',
    standards: ['OCP-3.0', 'PCIe-FH-HL'],
    vendor: 'NVIDIA Mellanox',
    partNumber: 'MCX512A-ACAT',
    // OCP 3.0 double-width: 110 × 28 × 64 mm (approx)
    dimensionsMM: { width: 110, height: 21.5, depth: 64 },
    mountingPoints: [],
    connectors: [
      { id: 'pcie-host', type: 'pcie-ocp3', face: 'Z+', posMM: { x: 55, y: 0, z: 64 }, gender: 'male' },
      { id: 'sfp28-0', type: 'sfp28-25g', face: 'Z-', posMM: { x: 20, y: 10, z: 0 }, gender: 'female' },
      { id: 'sfp28-1', type: 'sfp28-25g', face: 'Z-', posMM: { x: 60, y: 10, z: 0 }, gender: 'female' },
    ],
    thermal: { tdpWatts: 20, heatExhaustFace: 'Z-', requiresActiveCooling: false },
    ratedPowerWatts: 18,
    massGrams: 90,
    baseColor: '#192018',
    metalness: 0.25,
    roughness: 0.72,
    sourceReference: 'https://www.nvidia.com/en-us/networking/ethernet/connectx-5/',
    description: '2×25GbE SFP28，OCP 3.0，PCIe 4.0 × 8，RDMA/RoCEv2，硬件时间戳，SR-IOV 支持。',
  },
  {
    id: 'nic-intel-e810-ocp3-4x25g',
    name: 'Intel E810-XXVDA4 4×25GbE OCP 3.0',
    labelEn: 'E810 4×25G OCP3',
    labelZh: 'Intel E810 OCP3 网卡',
    category: 'nic',
    standards: ['OCP-3.0'],
    vendor: 'Intel',
    partNumber: 'E810-XXVDA4T',
    dimensionsMM: { width: 110, height: 21.5, depth: 64 },
    mountingPoints: [],
    connectors: [
      { id: 'pcie-host', type: 'pcie-ocp3', face: 'Z+', posMM: { x: 55, y: 0, z: 64 }, gender: 'male' },
      { id: 'sfp28-0', type: 'sfp28-25g', face: 'Z-', posMM: { x: 10, y: 10, z: 0 }, gender: 'female' },
      { id: 'sfp28-1', type: 'sfp28-25g', face: 'Z-', posMM: { x: 38, y: 10, z: 0 }, gender: 'female' },
      { id: 'sfp28-2', type: 'sfp28-25g', face: 'Z-', posMM: { x: 66, y: 10, z: 0 }, gender: 'female' },
      { id: 'sfp28-3', type: 'sfp28-25g', face: 'Z-', posMM: { x: 94, y: 10, z: 0 }, gender: 'female' },
    ],
    thermal: { tdpWatts: 30, heatExhaustFace: 'Z-', requiresActiveCooling: false },
    ratedPowerWatts: 25,
    massGrams: 105,
    baseColor: '#1c2022',
    metalness: 0.22,
    roughness: 0.75,
    description: '4×25GbE SFP28，OCP 3.0 双宽，PCIe 4.0 × 16，Intel Ethernet Flow Director，时间敏感网络 (TSN)。',
  },
  {
    id: 'nic-mellanox-cx6-2x100g-pcie',
    name: 'Mellanox ConnectX-6 2×100GbE PCIe',
    labelEn: 'CX6 2×100G',
    labelZh: '迈络思 ConnectX-6 100GbE',
    category: 'nic',
    standards: ['PCIe-FH-HL'],
    vendor: 'NVIDIA Mellanox',
    partNumber: 'MCX623106AN-CDAT',
    // PCIe FHHL: 167.65 × 111.15 × 17.5 mm (typical)
    dimensionsMM: { width: 167.65, height: 111.15, depth: 17.5 },
    mountingPoints: [
      { id: 'pcie-bracket', type: 'M3-screw', posMM: { x: 0, y: 50, z: 8.75 }, face: 'X-' },
    ],
    connectors: [
      { id: 'pcie-x16', type: 'pcie-x16', face: 'X+', posMM: { x: 167.65, y: 5, z: 8.75 }, gender: 'male' },
      { id: 'qsfp28-0', type: 'qsfp28-100g', face: 'X-', posMM: { x: 0, y: 60, z: 4 }, gender: 'female' },
      { id: 'qsfp28-1', type: 'qsfp28-100g', face: 'X-', posMM: { x: 0, y: 60, z: 13 }, gender: 'female' },
    ],
    thermal: { tdpWatts: 50, heatExhaustFace: 'X-', requiresActiveCooling: false },
    ratedPowerWatts: 42,
    massGrams: 165,
    baseColor: '#192018',
    metalness: 0.25,
    roughness: 0.70,
    description: '2×100GbE QSFP28，PCIe 4.0 × 16 FHHL，RDMA，GPUDirect，AI/ML 高性能网络场景。',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// BMC / Management Modules
// ═══════════════════════════════════════════════════════════════════════════

export const BMC_PARTS: CatalogPart[] = [
  {
    id: 'bmc-huawei-hi1711-card',
    name: 'Huawei Hi1711 BMC Management Card',
    labelEn: 'Hi1711 BMC',
    labelZh: '华为 Hi1711 BMC 管理插卡',
    category: 'bmc-module',
    standards: ['custom'],
    vendor: 'HiSilicon / Huawei',
    partNumber: 'Hi1711',
    // Estimated from TaiShan 200 2280 exploded view: ~105 × 7 × 240 mm
    dimensionsMM: { width: 105, height: 7, depth: 240 },
    mountingPoints: [
      { id: 'card-edge', type: 'guide-pin', posMM: { x: 105, y: 3.5, z: 120 }, face: 'X+' },
    ],
    connectors: [
      { id: 'card-edge-fingers', type: 'ipmb', face: 'X+', posMM: { x: 105, y: 0, z: 120 }, gender: 'male' },
      { id: 'mgmt-rj45', type: 'rj45-1g', face: 'Z+', posMM: { x: 20, y: 14, z: 240 }, gender: 'female' },
      { id: 'vga-out', type: 'vga', face: 'Z+', posMM: { x: 50, y: 12, z: 240 }, gender: 'female' },
      { id: 'uart-debug', type: 'uart', face: 'Z+', posMM: { x: 80, y: 10, z: 240 }, gender: 'female' },
    ],
    thermal: { tdpWatts: 15, heatExhaustFace: 'Z-', requiresActiveCooling: false },
    ratedPowerWatts: 12,
    massGrams: 120,
    baseColor: '#112036',
    metalness: 0.22,
    roughness: 0.78,
    description: 'BMC 独立管理插卡，搭载 Hi1711 ARM Cortex-A9，DDR4、SPI Flash，千兆 MGMT、VGA、串口，IPMI 2.0 / Redfish 兼容。',
  },
  {
    id: 'bmc-nuvoton-npcm750-module',
    name: 'Nuvoton NPCM750 BMC Module',
    labelEn: 'NPCM750 BMC',
    labelZh: 'Nuvoton NPCM750 BMC',
    category: 'bmc-module',
    standards: ['OCP-DC-SCM'],
    vendor: 'Nuvoton',
    partNumber: 'NPCM750',
    dimensionsMM: { width: 70, height: 6, depth: 180 },
    mountingPoints: [],
    connectors: [
      { id: 'i2c-ipmb', type: 'ipmb', face: 'X+', posMM: { x: 70, y: 3, z: 90 }, gender: 'male' },
      { id: 'mgmt-rj45', type: 'rj45-1g', face: 'Z+', posMM: { x: 15, y: 12, z: 180 }, gender: 'female' },
    ],
    thermal: { tdpWatts: 8, heatExhaustFace: 'Z-', requiresActiveCooling: false },
    ratedPowerWatts: 6,
    massGrams: 85,
    baseColor: '#112026',
    metalness: 0.20,
    roughness: 0.80,
    sourceReference: 'https://github.com/Nuvoton-Israel/npcm750-devkit',
    description: 'OpenBMC 参考平台，Cortex-A9 @ 1GHz，512MB DDR4，支持 IPMI 2.0 / Redfish / OpenBMC。',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Riser Cards / Expansion
// ═══════════════════════════════════════════════════════════════════════════

export const RISER_PARTS: CatalogPart[] = [
  {
    id: 'riser-pcie4-x16-fhhl',
    name: 'PCIe 4.0 ×16 Riser Card (FHHL)',
    labelEn: 'PCIe4 ×16 Riser',
    labelZh: 'PCIe 4.0 x16 转接卡',
    category: 'riser-card',
    standards: ['PCIe-FH-HL'],
    vendor: 'Generic OEM',
    // Riser PCB: 100 × 40 × 3.5 mm (vertical bracket not included in dimension)
    dimensionsMM: { width: 100, height: 40, depth: 7 },
    mountingPoints: [
      { id: 'bracket-screw', type: 'M3-screw', posMM: { x: 0, y: 20, z: 3.5 }, face: 'X-' },
    ],
    connectors: [
      { id: 'pcie-in', type: 'pcie-x16', face: 'Y-', posMM: { x: 50, y: 0, z: 3.5 }, gender: 'female' },
      { id: 'pcie-out', type: 'pcie-x16', face: 'X-', posMM: { x: 0, y: 20, z: 3.5 }, gender: 'female' },
    ],
    thermal: { tdpWatts: 75, heatExhaustFace: 'X-', requiresActiveCooling: false },
    ratedPowerWatts: 75,
    massGrams: 80,
    baseColor: '#2a2f3a',
    metalness: 0.35,
    roughness: 0.75,
    description: 'PCIe 4.0 × 16 垂直转接卡，适用于 2U 机箱全高半长扩展槽，支持 GPU/FPGA/加速卡。',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Consolidated export
// ═══════════════════════════════════════════════════════════════════════════

export const ALL_CATALOG_PARTS: CatalogPart[] = [
  ...CPU_PARTS,
  ...MEMORY_PARTS,
  ...STORAGE_PARTS,
  ...PSU_PARTS,
  ...COOLING_PARTS,
  ...NIC_PARTS,
  ...BMC_PARTS,
  ...RISER_PARTS,
];
