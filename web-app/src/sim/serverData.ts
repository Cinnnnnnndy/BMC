// ─── Type definitions ─────────────────────────────────────────────────────

export type ComponentType =
  | 'CPU'
  | 'EEPROM'
  | 'FAN'
  | 'HDD'
  | 'PSU'
  | 'I2C_BUS'
  | 'RISER'
  | 'IO_PANEL'
  | 'BASE_BOARD'
  | 'EXT_BOARD';

export type BusType = 'POWER' | 'I2C' | 'PCIE' | 'SATA' | 'USB';
export type ComponentStatus = 'normal' | 'warning' | 'error' | 'offline' | 'selected';

export interface BusConnection {
  busId: string;
  busType: BusType;
  role: 'master' | 'slave' | 'peer';
  connectorPos: 'top' | 'bottom' | 'left' | 'right';
}

export interface HardwareComponent {
  id: string;
  type: ComponentType;
  label: string;
  labelEn: string;
  grid: { x: number; y: number; z: number };
  size: { w: number; d: number; h: number };
  status: ComponentStatus;
  busConnections: BusConnection[];
  metrics?: {
    temperature?: number;   // °C
    powerWatts?: number;
    utilization?: number;   // 0–100
    voltage?: number;
  };
  children?: string[];
  description: string;
}

// ─── Bus color mapping ─────────────────────────────────────────────────────
export const BUS_COLORS: Record<BusType, { hex: number; css: string; width: number }> = {
  POWER: { hex: 0xF5C842, css: '#F5C842', width: 2.5 },
  I2C:   { hex: 0x5B9CF6, css: '#5B9CF6', width: 1.8 },
  PCIE:  { hex: 0xC084FC, css: '#C084FC', width: 2.2 },
  SATA:  { hex: 0xF97316, css: '#F97316', width: 2.0 },
  USB:   { hex: 0x34D399, css: '#34D399', width: 1.6 },
};

// ─── Bus label mapping ─────────────────────────────────────────────────────
export const BUS_LABELS: Record<BusType, string> = {
  POWER: '电源总线',
  I2C:   'I2C 数据总线',
  PCIE:  'PCIe 总线',
  SATA:  'SATA 总线',
  USB:   'USB 总线',
};

// ─── TaiShan 200 2U hardware component definitions ─────────────────────────
// Layout reference: Main Board = 20.0 × 14.0 × 0.3, MAX_COMPONENT_HEIGHT = 3.0
// Grid coords are bottom-left-front corner of each component in scene space.
// Board spans x:1→21, y:2→16.  Scale from old (11×8): x×1.818, y×1.75
export const HARDWARE_COMPONENTS: HardwareComponent[] = [
  // ── Base Board (main PCB) ────────────────────────────────────────────────
  {
    id: 'base_board',
    type: 'BASE_BOARD',
    label: 'Base Board 主板',
    labelEn: 'Main Board',
    grid: { x: 1, y: 2, z: 0 },
    size: { w: 20.0, d: 14.0, h: 0.3 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main',  busType: 'I2C',   role: 'master', connectorPos: 'top'    },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave',  connectorPos: 'right'  },
      { busId: 'pcie_main', busType: 'PCIE',  role: 'master', connectorPos: 'bottom' },
    ],
    metrics: { temperature: 42, powerWatts: 320, voltage: 12.1 },
    children: ['cpu_0', 'cpu_1'],
    description: '主板，集成 BMC 控制器，连接所有核心组件。TaiShan 200 2U 标准机架设计。',
  },

  // ── Extension Board (PCIe) — left of main board, centered vertically ────
  {
    id: 'ext_board',
    type: 'EXT_BOARD',
    label: '扩展板 PCIe ×16',
    labelEn: 'Ext.Board',
    grid: { x: -7.5, y: 7, z: 0 },
    size: { w: 6.0, d: 4.0, h: 0.35 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE', role: 'slave', connectorPos: 'right' },
    ],
    metrics: { temperature: 58, powerWatts: 220, utilization: 68 },
    description: 'PCIe x16 扩展板，已安装 GPU 加速卡，PCIe Gen4 接入主板。',
  },

  // ── CPU 0 (Kunpeng 920) — left half of board ─────────────────────────────
  {
    id: 'cpu_0',
    type: 'CPU',
    label: 'Kunpeng 920 #0',
    labelEn: 'CPU 0',
    grid: { x: 2.8, y: 3.8, z: 0.3 },
    size: { w: 3.5, d: 3.5, h: 1.8 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'top' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'top' },
    ],
    metrics: { temperature: 58, powerWatts: 120, utilization: 34 },
    description: '鲲鹏 920 处理器 #0，64 核心，2.6 GHz，ARM 架构，Socket 0。',
  },

  // ── CPU 1 (Kunpeng 920) — right half of board ────────────────────────────
  {
    id: 'cpu_1',
    type: 'CPU',
    label: 'Kunpeng 920 #1',
    labelEn: 'CPU 1',
    grid: { x: 10.1, y: 3.8, z: 0.3 },
    size: { w: 3.5, d: 3.5, h: 1.8 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'top' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'top' },
    ],
    metrics: { temperature: 55, powerWatts: 115, utilization: 28 },
    description: '鲲鹏 920 处理器 #1，64 核心，2.6 GHz，ARM 架构，Socket 1。',
  },

  // ── Fan 0 — right side bank, slot 0 ──────────────────────────────────────
  {
    id: 'fan_0',
    type: 'FAN',
    label: '系统风扇 #0',
    labelEn: 'Fan 0',
    grid: { x: 22, y: 2.0, z: 0 },
    size: { w: 3.2, d: 3.2, h: 1.4 },
    status: 'warning',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'left' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'left' },
    ],
    metrics: { temperature: 64, powerWatts: 14, utilization: 112 },
    description: '系统风扇 #0，当前转速 8400 RPM，高于目标 7500 RPM，热告警。',
  },

  // ── Fan 1 — right side bank, slot 1 ──────────────────────────────────────
  {
    id: 'fan_1',
    type: 'FAN',
    label: '系统风扇 #1',
    labelEn: 'Fan 1',
    grid: { x: 22, y: 5.6, z: 0 },
    size: { w: 3.2, d: 3.2, h: 1.4 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'left' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'left' },
    ],
    metrics: { temperature: 52, powerWatts: 12, utilization: 78 },
    description: '系统风扇 #1，转速 7500 RPM，运行正常。',
  },

  // ── Fan 2 — right side bank, slot 2 ──────────────────────────────────────
  {
    id: 'fan_2',
    type: 'FAN',
    label: '系统风扇 #2',
    labelEn: 'Fan 2',
    grid: { x: 22, y: 9.2, z: 0 },
    size: { w: 3.2, d: 3.2, h: 1.4 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'left' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'left' },
    ],
    metrics: { temperature: 50, powerWatts: 11, utilization: 75 },
    description: '系统风扇 #2，转速 7400 RPM，运行正常。',
  },

  // ── Fan 3 — right side bank, slot 3 ──────────────────────────────────────
  {
    id: 'fan_3',
    type: 'FAN',
    label: '系统风扇 #3',
    labelEn: 'Fan 3',
    grid: { x: 22, y: 12.8, z: 0 },
    size: { w: 3.2, d: 3.2, h: 1.4 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'left' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'left' },
    ],
    metrics: { temperature: 48, powerWatts: 11, utilization: 72 },
    description: '系统风扇 #3，转速 7300 RPM，运行正常。',
  },

  // ── HDD 0 — front bay, bottom slot (z=0) ─────────────────────────────────
  {
    id: 'hdd_0',
    type: 'HDD',
    label: '硬盘 #0  4TB',
    labelEn: 'HDD 0',
    grid: { x: 3.7, y: 0, z: 0 },
    size: { w: 4.0, d: 1.8, h: 0.8 },
    status: 'error',

    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE',  role: 'slave', connectorPos: 'bottom' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'top'    },
    ],
    metrics: { temperature: 62, powerWatts: 8 },
    description: '故障硬盘 #0：SMART 读取错误率超限，已重新分配扇区数 12，建议立即更换。',
  },

  // ── HDD 1 — front bay, top slot (z = h + gap) ────────────────────────────
  {
    id: 'hdd_1',
    type: 'HDD',
    label: '硬盘 #1  4TB',
    labelEn: 'HDD 1',
    grid: { x: 3.7, y: 0, z: 0.95 },
    size: { w: 4.0, d: 1.8, h: 0.8 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE',  role: 'slave', connectorPos: 'bottom' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'top'    },
    ],
    metrics: { temperature: 42, powerWatts: 7 },
    description: '在线硬盘 #1，4TB NVMe SSD，运行正常，SMART 自检通过。',
  },

  // ── PSU — far right, spanning fan bank height ─────────────────────────────
  {
    id: 'psu',
    type: 'PSU',
    label: 'PSU 800W',
    labelEn: 'PSU',
    grid: { x: 25.5, y: 5, z: 0 },
    size: { w: 5.0, d: 8.0, h: 2.8 },
    status: 'normal',
    busConnections: [
      { busId: 'pwr_main', busType: 'POWER', role: 'master', connectorPos: 'left' },
    ],
    metrics: { temperature: 48, powerWatts: 420, voltage: 12.05, utilization: 53 },
    description: '电源模块，额定 800W，效率 94%，AC 220V 输入，DC 12V 输出。',
  },

  // ── Riser 0 — rear of board, left slot ───────────────────────────────────
  {
    id: 'riser_0',
    type: 'RISER',
    label: 'PCIe Riser #0',
    labelEn: 'Riser 0',
    grid: { x: 2.8, y: 17, z: 0 },
    size: { w: 4.5, d: 0.3, h: 0.35 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE', role: 'slave', connectorPos: 'top' },
    ],
    metrics: { temperature: 44, powerWatts: 35 },
    description: 'PCIe Riser 卡 #0，x16 插槽，支持全高半长扩展卡。',
  },

  // ── Riser 1 — rear of board, right slot ──────────────────────────────────
  {
    id: 'riser_1',
    type: 'RISER',
    label: 'PCIe Riser #1',
    labelEn: 'Riser 1',
    grid: { x: 12.8, y: 17, z: 0 },
    size: { w: 4.5, d: 0.3, h: 0.35 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE', role: 'slave', connectorPos: 'top' },
    ],
    metrics: { temperature: 43, powerWatts: 30 },
    description: 'PCIe Riser 卡 #1，x8 插槽，当前未插卡，槽位空闲。',
  },

  // ── I/O Panel 0 — left side of board, front ──────────────────────────────
  {
    id: 'io_panel_0',
    type: 'IO_PANEL',
    label: 'I/O 前面板 #0',
    labelEn: 'Front I/O 0',
    grid: { x: -1.5, y: 3.5, z: 0 },
    size: { w: 2.5, d: 0.8, h: 0.35 },
    status: 'normal',
    busConnections: [
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'right' },
    ],
    metrics: { temperature: 35, powerWatts: 5, voltage: 5.0 },
    description: '前面板 I/O #0：USB3.0 × 2，电源按钮，状态 LED，BMC 管理口。',
  },

  // ── I/O Panel 1 — left side of board, rear ───────────────────────────────
  {
    id: 'io_panel_1',
    type: 'IO_PANEL',
    label: 'I/O 前面板 #1',
    labelEn: 'Front I/O 1',
    grid: { x: -1.5, y: 13.0, z: 0 },
    size: { w: 2.5, d: 0.8, h: 0.35 },
    status: 'normal',
    busConnections: [
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'right' },
    ],
    metrics: { temperature: 34, powerWatts: 4, voltage: 5.0 },
    description: '前面板 I/O #1：VGA 显示输出，诊断码显示，NMI 按钮。',
  },
];

// ─── Bus registry ──────────────────────────────────────────────────────────
export interface BusDef {
  id: string;
  type: BusType;
  label: string;
  bandwidth: string;
  frequency: string;
  busStatus: 'active' | 'idle' | 'error';
}

export const BUS_REGISTRY: BusDef[] = [
  {
    id: 'i2c_main',
    type: 'I2C',
    label: '板级 I2C 总线',
    bandwidth: '400 kbps',
    frequency: '400 kHz',
    busStatus: 'active',
  },
  {
    id: 'pwr_main',
    type: 'POWER',
    label: '主电源总线',
    bandwidth: '2000 W',
    frequency: 'DC 12V',
    busStatus: 'active',
  },
  {
    id: 'pcie_main',
    type: 'PCIE',
    label: 'PCIe Gen4 ×16',
    bandwidth: '32 GT/s',
    frequency: '16 GHz',
    busStatus: 'active',
  },
];

// ─── Helper: get components sharing a bus ─────────────────────────────────
export function getComponentsOnBus(busId: string): HardwareComponent[] {
  return HARDWARE_COMPONENTS.filter((c) =>
    c.busConnections.some((b) => b.busId === busId),
  );
}

// ─── Helper: get all bus definitions for a component ──────────────────────
export function getConnectedBuses(compId: string): BusDef[] {
  const comp = HARDWARE_COMPONENTS.find((c) => c.id === compId);
  if (!comp) return [];
  const busIds = new Set(comp.busConnections.map((b) => b.busId));
  return BUS_REGISTRY.filter((b) => busIds.has(b.id));
}
