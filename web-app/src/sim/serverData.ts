// ─── Type definitions ─────────────────────────────────────────────────────

export type ComponentType =
  | 'CPU'
  | 'EEPROM'
  | 'FAN'
  | 'HDD'
  | 'NVME'
  | 'PSU'
  | 'I2C_BUS'
  | 'NIC_CARD'
  | 'BMC_CARD'
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

// ─── TaiShan 200 2280 BMC-controlled component definitions ────────────────
// Reference: Huawei TaiShan 200 2280 exploded view (EDOC1100088652)
// Board spans x:1→21, y:2→16.  Front bay y:-3→2.  Rear y:17→18.
// Fan bank x:22→26 (right side).  PSU x:25.5 (far right, hot-swap).
// z = height above motherboard surface (0 = board level, 0.3 = board top).
export const HARDWARE_COMPONENTS: HardwareComponent[] = [
  // ── Base Board (main PCB) ────────────────────────────────────────────────
  // Narrower footprint (w:14) to better match the rotated (portrait) compute layout.
  // Left edge anchored at x:1; right edge moves from x:21 → x:15.
  {
    id: 'base_board',
    type: 'BASE_BOARD',
    label: 'Base Board 主板',
    labelEn: 'Main Board',
    grid: { x: 1, y: 2, z: 0 },
    size: { w: 14.0, d: 14.0, h: 0.3 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main',  busType: 'I2C',   role: 'master', connectorPos: 'top'    },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave',  connectorPos: 'right'  },
      { busId: 'pcie_main', busType: 'PCIE',  role: 'master', connectorPos: 'bottom' },
    ],
    metrics: { temperature: 42, powerWatts: 320, voltage: 12.1 },
    children: ['cpu_0', 'cpu_1'],
    description: '主板（方向旋转 90°，两颗 CPU 沿 Y 轴堆叠，DIMM 组沿 X 轴水平排布），集成 BMC 控制器。TaiShan 200 2U 标准机架设计。',
  },

  // ── Extension Board — left of main board, full server depth (image 5 layout)
  // Wide elongated board: BMC/CPLD cluster at front end, connector rows along body
  {
    id: 'ext_board',
    type: 'EXT_BOARD',
    label: '扩展背板',
    labelEn: 'Ext.Board',
    grid: { x: -6.0, y: 2.5, z: 0 },
    size: { w: 6.0, d: 13.0, h: 0.35 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE',  role: 'slave',  connectorPos: 'right' },
      { busId: 'i2c_main',  busType: 'I2C',   role: 'slave',  connectorPos: 'right' },
    ],
    metrics: { temperature: 42, powerWatts: 35, utilization: 22 },
    description: '2280 扩展背板，含 BMC 辅控芯片、CPLD、Riser1/FlexIO1 PCIe 连接器阵列，全机箱深度布局。',
  },

  // ── BMC Card — plug-in management card, left of ext_board (new) ─────────
  // Standalone hot-pluggable BMC module with SoC/DDR/Flash/MGMT port cluster.
  {
    id: 'bmc_card',
    type: 'BMC_CARD',
    label: 'BMC 管理插卡',
    labelEn: 'BMC Card',
    grid: { x: -12.2, y: 3.0, z: 0.15 },
    size: { w: 5.2, d: 12.0, h: 0.35 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'master', connectorPos: 'right' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave',  connectorPos: 'right' },
      { busId: 'usb_main', busType: 'USB',   role: 'slave',  connectorPos: 'right' },
    ],
    metrics: { temperature: 46, powerWatts: 12, voltage: 12.0, utilization: 28 },
    description: 'BMC 独立管理插卡（Huawei Hi1711/等效 SoC）：搭载 ARM Cortex-A9 BMC 芯片、DDR4 内存、SPI Flash、千兆 MGMT 网口、VGA 输出与串口调试，通过金手指插入扩展背板。',
  },

  // ── CPU 0 (Kunpeng 920) — NORTH socket (board rotated 90°, CPUs now stacked)
  // Board-local: centered on X, at upper-Z. Bare die — no heatsink.
  {
    id: 'cpu_0',
    type: 'CPU',
    label: 'Kunpeng 920 #0',
    labelEn: 'CPU 0',
    grid: { x: 5.6, y: 2.6, z: 0.3 },
    size: { w: 4.8, d: 4.8, h: 0.55 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'top' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'top' },
    ],
    metrics: { temperature: 58, powerWatts: 120, utilization: 34 },
    description: '鲲鹏 920 处理器 #0，64 核心，2.6 GHz，ARM 架构，Socket 0（裸片模式，无散热片）。',
  },

  // ── CPU 1 (Kunpeng 920) — SOUTH socket (stacked below CPU 0 on rotated board)
  {
    id: 'cpu_1',
    type: 'CPU',
    label: 'Kunpeng 920 #1',
    labelEn: 'CPU 1',
    grid: { x: 5.6, y: 10.6, z: 0.3 },
    size: { w: 4.8, d: 4.8, h: 0.55 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'top' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'top' },
    ],
    metrics: { temperature: 55, powerWatts: 115, utilization: 28 },
    description: '鲲鹏 920 处理器 #1，64 核心，2.6 GHz，ARM 架构，Socket 1（裸片模式，无散热片）。',
  },

  // ── Fan Module 0 — dual-rotor hot-swap module, slot 0 ────────────────────
  // 2280: each fan module houses 2×80mm counter-rotating fans (PWM, I2C-monitored)
  {
    id: 'fan_0',
    type: 'FAN',
    label: '双转子风扇模组 #0',
    labelEn: 'Fan Mod 0',
    grid: { x: 16.0, y: 2.0, z: 0 },
    size: { w: 3.2, d: 4.0, h: 2.4 },
    status: 'warning',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'left' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'left' },
    ],
    metrics: { temperature: 64, powerWatts: 28, utilization: 112 },
    description: '2280 双转子热插拔风扇模组 #0，内含 2×80mm 风扇，当前转速 8400 RPM，超目标，热告警。',
  },

  // ── Fan Module 1 — dual-rotor, slot 1 ────────────────────────────────────
  {
    id: 'fan_1',
    type: 'FAN',
    label: '双转子风扇模组 #1',
    labelEn: 'Fan Mod 1',
    grid: { x: 16.0, y: 6.2, z: 0 },
    size: { w: 3.2, d: 4.0, h: 2.4 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'left' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'left' },
    ],
    metrics: { temperature: 52, powerWatts: 24, utilization: 78 },
    description: '2280 双转子热插拔风扇模组 #1，转速 7500 RPM，运行正常。',
  },

  // ── Fan Module 2 — dual-rotor, slot 2 ────────────────────────────────────
  {
    id: 'fan_2',
    type: 'FAN',
    label: '双转子风扇模组 #2',
    labelEn: 'Fan Mod 2',
    grid: { x: 16.0, y: 10.4, z: 0 },
    size: { w: 3.2, d: 4.0, h: 2.4 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'left' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'left' },
    ],
    metrics: { temperature: 50, powerWatts: 22, utilization: 75 },
    description: '2280 双转子热插拔风扇模组 #2，转速 7400 RPM，运行正常。',
  },

  // ── Fan Module 3 — dual-rotor, slot 3 ────────────────────────────────────
  {
    id: 'fan_3',
    type: 'FAN',
    label: '双转子风扇模组 #3',
    labelEn: 'Fan Mod 3',
    grid: { x: 16.0, y: 14.6, z: 0 },
    size: { w: 3.2, d: 4.0, h: 2.4 },
    status: 'normal',
    busConnections: [
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave', connectorPos: 'left' },
      { busId: 'pwr_main', busType: 'POWER', role: 'slave', connectorPos: 'left' },
    ],
    metrics: { temperature: 48, powerWatts: 22, utilization: 72 },
    description: '2280 双转子热插拔风扇模组 #3，转速 7300 RPM，运行正常。',
  },

  // ── HDD 0 — front SATA bay, slot 0 (3.5" SATA, bottom) ──────────────────
  {
    id: 'hdd_0',
    type: 'HDD',
    label: '硬盘 #0  4TB SATA',
    labelEn: 'HDD 0',
    grid: { x: 3.2, y: 0, z: 0 },
    size: { w: 4.0, d: 1.8, h: 0.8 },
    status: 'error',
    busConnections: [
      { busId: 'sata_main', busType: 'SATA',  role: 'slave', connectorPos: 'bottom' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'top'    },
    ],
    metrics: { temperature: 62, powerWatts: 8 },
    description: '故障 SATA 硬盘 #0：SMART 读取错误率超限，已重新分配扇区 12 个，建议立即更换。',
  },

  // ── HDD 1 — front SATA bay, slot 1 (top) ─────────────────────────────────
  {
    id: 'hdd_1',
    type: 'HDD',
    label: '硬盘 #1  4TB SATA',
    labelEn: 'HDD 1',
    grid: { x: 3.2, y: 0, z: 0.95 },
    size: { w: 4.0, d: 1.8, h: 0.8 },
    status: 'normal',
    busConnections: [
      { busId: 'sata_main', busType: 'SATA',  role: 'slave', connectorPos: 'bottom' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'top'    },
    ],
    metrics: { temperature: 42, powerWatts: 7 },
    description: '在线 SATA 硬盘 #1，4TB，SMART 自检通过，运行正常。',
  },

  // ── NVMe 0-5 — front U.2 NVMe bay (2 rows × 3, PCIe Gen4) ───────────────
  {
    id: 'nvme_0',
    type: 'NVME',
    label: 'NVMe #0  1.92TB',
    labelEn: 'NVMe 0',
    grid: { x: 8.2, y: 0, z: 0 },
    size: { w: 3.2, d: 1.8, h: 0.8 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE',  role: 'slave', connectorPos: 'bottom' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'top'    },
    ],
    metrics: { temperature: 38, powerWatts: 10, utilization: 42 },
    description: 'U.2 NVMe SSD #0，1.92TB，PCIe Gen4 ×4，延迟 < 100 μs，SMART 正常。',
  },
  {
    id: 'nvme_1',
    type: 'NVME',
    label: 'NVMe #1  1.92TB',
    labelEn: 'NVMe 1',
    grid: { x: 11.8, y: 0, z: 0 },
    size: { w: 3.2, d: 1.8, h: 0.8 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE',  role: 'slave', connectorPos: 'bottom' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'top'    },
    ],
    metrics: { temperature: 40, powerWatts: 11, utilization: 55 },
    description: 'U.2 NVMe SSD #1，1.92TB，PCIe Gen4 ×4，运行正常。',
  },
  {
    id: 'nvme_2',
    type: 'NVME',
    label: 'NVMe #2  1.92TB',
    labelEn: 'NVMe 2',
    grid: { x: 15.4, y: 0, z: 0 },
    size: { w: 3.2, d: 1.8, h: 0.8 },
    status: 'warning',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE',  role: 'slave', connectorPos: 'bottom' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'top'    },
    ],
    metrics: { temperature: 71, powerWatts: 12, utilization: 88 },
    description: 'U.2 NVMe SSD #2，温度偏高（71°C），建议检查散热通道。',
  },
  {
    id: 'nvme_3',
    type: 'NVME',
    label: 'NVMe #3  1.92TB',
    labelEn: 'NVMe 3',
    grid: { x: 8.2, y: 0, z: 0.95 },
    size: { w: 3.2, d: 1.8, h: 0.8 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE',  role: 'slave', connectorPos: 'bottom' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'top'    },
    ],
    metrics: { temperature: 36, powerWatts: 9, utilization: 31 },
    description: 'U.2 NVMe SSD #3，1.92TB，PCIe Gen4 ×4，运行正常。',
  },
  {
    id: 'nvme_4',
    type: 'NVME',
    label: 'NVMe #4  1.92TB',
    labelEn: 'NVMe 4',
    grid: { x: 11.8, y: 0, z: 0.95 },
    size: { w: 3.2, d: 1.8, h: 0.8 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE',  role: 'slave', connectorPos: 'bottom' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'top'    },
    ],
    metrics: { temperature: 37, powerWatts: 9, utilization: 28 },
    description: 'U.2 NVMe SSD #4，1.92TB，PCIe Gen4 ×4，运行正常。',
  },
  {
    id: 'nvme_5',
    type: 'NVME',
    label: 'NVMe #5  offline',
    labelEn: 'NVMe 5',
    grid: { x: 15.4, y: 0, z: 0.95 },
    size: { w: 3.2, d: 1.8, h: 0.8 },
    status: 'offline',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE',  role: 'slave', connectorPos: 'bottom' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'top'    },
    ],
    metrics: { temperature: 0, powerWatts: 0 },
    description: 'U.2 NVMe 槽位 #5，当前空闲/未安装驱动器。',
  },

  // ── PSU 0 — hot-swap, slot 0 (2280: 2×900W redundant) ────────────────────
  {
    id: 'psu_0',
    type: 'PSU',
    label: 'PSU #0  900W',
    labelEn: 'PSU 0',
    grid: { x: 20.2, y: 4.5, z: 0 },
    size: { w: 5.0, d: 7.5, h: 2.8 },
    status: 'normal',
    busConnections: [
      { busId: 'pwr_main', busType: 'POWER', role: 'master', connectorPos: 'left' },
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave',  connectorPos: 'left' },
    ],
    metrics: { temperature: 48, powerWatts: 430, voltage: 12.05, utilization: 48 },
    description: '热插拔电源模组 #0，额定 900W，效率 96%，AC 220V 输入，DC 12V 输出，I2C PMBus 监控。',
  },

  // ── PSU 1 — hot-swap, slot 1 (redundant) ─────────────────────────────────
  {
    id: 'psu_1',
    type: 'PSU',
    label: 'PSU #1  900W',
    labelEn: 'PSU 1',
    grid: { x: 20.2, y: 12.8, z: 0 },
    size: { w: 5.0, d: 7.5, h: 2.8 },
    status: 'normal',
    busConnections: [
      { busId: 'pwr_main', busType: 'POWER', role: 'master', connectorPos: 'left' },
      { busId: 'i2c_main', busType: 'I2C',   role: 'slave',  connectorPos: 'left' },
    ],
    metrics: { temperature: 46, powerWatts: 390, voltage: 12.02, utilization: 43 },
    description: '热插拔电源模组 #1（冗余），额定 900W，支持 1+1 冗余，AC 220V 输入。',
  },

  // ── Riser 0 — rear PCIe x16 slot (2280: full-height half-length) ─────────
  {
    id: 'riser_0',
    type: 'RISER',
    label: 'PCIe Riser #0  x16',
    labelEn: 'Riser 0',
    grid: { x: 2.8, y: 17, z: 0 },
    size: { w: 5.0, d: 0.35, h: 2.0 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE', role: 'slave', connectorPos: 'top' },
    ],
    metrics: { temperature: 44, powerWatts: 35 },
    description: '2280 PCIe Riser #0，x16 Gen4 插槽，当前安装加速卡，满载运行。',
  },

  // ── Riser 1 — rear PCIe x8 slot ──────────────────────────────────────────
  {
    id: 'riser_1',
    type: 'RISER',
    label: 'PCIe Riser #1  x8',
    labelEn: 'Riser 1',
    grid: { x: 10.0, y: 17, z: 0 },
    size: { w: 5.0, d: 0.35, h: 2.0 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE', role: 'slave', connectorPos: 'top' },
    ],
    metrics: { temperature: 43, powerWatts: 30 },
    description: '2280 PCIe Riser #1，x8 Gen4 插槽，当前空载。',
  },

  // ── OCP NIC — rear OCP 3.0 slot, 4×25GbE (BMC-monitored) ────────────────
  {
    id: 'ocp_nic',
    type: 'NIC_CARD',
    label: 'OCP NIC  4×25GbE',
    labelEn: 'OCP NIC',
    grid: { x: 16.5, y: 17.1, z: 0.4 },
    size: { w: 5.5, d: 0.5, h: 2.1 },
    status: 'normal',
    busConnections: [
      { busId: 'pcie_main', busType: 'PCIE', role: 'slave', connectorPos: 'top'  },
      { busId: 'i2c_main',  busType: 'I2C',  role: 'slave', connectorPos: 'left' },
    ],
    metrics: { temperature: 52, powerWatts: 18, utilization: 34 },
    description: '2280 OCP 3.0 网卡，4×25GbE SFP28，BMC 通过 I2C/NC-SI 监控链路状态与功耗。',
  },

  // ── I/O Panel 0 — front panel: power btn, LEDs, USB, BMC debug port ───────
  {
    id: 'io_panel_0',
    type: 'IO_PANEL',
    label: 'I/O 前面板',
    labelEn: 'Front I/O',
    grid: { x: -1.5, y: 3.5, z: 0 },
    size: { w: 2.5, d: 0.8, h: 0.55 },
    status: 'normal',
    busConnections: [
      { busId: 'usb_main',  busType: 'USB',   role: 'slave', connectorPos: 'right' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'right' },
    ],
    metrics: { temperature: 35, powerWatts: 5, voltage: 5.0 },
    description: '2280 前面板：电源键/重置键、健康 LED×4、USB3.0×1、VGA、BMC 串口调试口。',
  },

  // ── I/O Panel 1 — rear management panel (BMC MGMT port, VGA) ────────────
  {
    id: 'io_panel_1',
    type: 'IO_PANEL',
    label: '后面板 I/O',
    labelEn: 'Rear I/O',
    grid: { x: -1.5, y: 17.1, z: 0 },
    size: { w: 2.5, d: 0.5, h: 1.6 },
    status: 'normal',
    busConnections: [
      { busId: 'usb_main',  busType: 'USB',   role: 'slave', connectorPos: 'right' },
      { busId: 'pwr_main',  busType: 'POWER', role: 'slave', connectorPos: 'right' },
    ],
    metrics: { temperature: 34, powerWatts: 4, voltage: 5.0 },
    description: '2280 后面板：BMC 独立管理口（GbE）、VGA、USB2.0×2、诊断码显示。',
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
  {
    id: 'sata_main',
    type: 'SATA',
    label: 'SATA III 总线',
    bandwidth: '6 Gb/s',
    frequency: '6 GHz',
    busStatus: 'active',
  },
  {
    id: 'usb_main',
    type: 'USB',
    label: 'USB 3.0 总线',
    bandwidth: '5 Gb/s',
    frequency: '5 GHz',
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
