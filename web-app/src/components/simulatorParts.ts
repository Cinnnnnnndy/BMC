/** 无限画布场景尺寸（与物理排布一致，避免板卡重叠） */
export const SCENE_WIDTH = 3200;
export const SCENE_HEIGHT = 2400;

/** 参考机架爆炸图：绿 PCB / 银金属 / 黑塑料 / 风扇 */
export type BoardMaterial = 'pcb' | 'metal' | 'plastic' | 'fan';

/** 无限画布上的板卡/模块 */
export interface ServerPart {
  id: string;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
  /** 爆炸高度 translateZ（px） */
  z: number;
  /** 体块厚度（建筑轴侧挤出） */
  depth: number;
  material: BoardMaterial;
  /** 水平爆炸偏移（px，模拟前后拉出） */
  explodeX?: number;
  /** 竖直爆炸偏移（px，模拟上下抬起） */
  explodeY?: number;
}

/**
 * 物理顺序 + 爆炸位移：风扇/导风罩偏上抬起，硬盘列偏前拉出，电源偏左，等轴测中更易读
 */
export const SERVER_PARTS: ServerPart[] = [
  { id: 'chassis', label: '机箱托盘', left: 260, top: 1760, width: 2680, height: 440, z: 0, depth: 36, material: 'metal' },
  { id: 'midplane', label: '中板/供电接口', left: 700, top: 1580, width: 960, height: 100, z: 52, depth: 12, material: 'pcb', explodeY: -28 },
  { id: 'psu', label: '电源模组', left: 40, top: 1120, width: 580, height: 320, z: 88, depth: 28, material: 'metal', explodeX: -24 },
  { id: 'slot', label: '扩展槽位', left: 60, top: 640, width: 240, height: 260, z: 140, depth: 14, material: 'pcb' },
  { id: 'riser', label: 'Riser 卡', left: 60, top: 940, width: 240, height: 180, z: 158, depth: 12, material: 'pcb' },
  { id: 'pcie', label: 'PCIe 设备', left: 60, top: 1160, width: 240, height: 220, z: 168, depth: 14, material: 'pcb' },
  { id: 'io', label: 'IO 扩展', left: 60, top: 1420, width: 240, height: 160, z: 152, depth: 12, material: 'pcb' },
  { id: 'mainboard', label: '主板', left: 700, top: 780, width: 1160, height: 600, z: 118, depth: 18, material: 'pcb', explodeY: -16 },
  { id: 'chipset', label: '芯片组区域', left: 1920, top: 780, width: 240, height: 260, z: 188, depth: 12, material: 'pcb' },
  { id: 'bmc', label: 'BMC', left: 1920, top: 1080, width: 240, height: 180, z: 220, depth: 12, material: 'pcb' },
  { id: 'fpga', label: 'FPGA/CPLD', left: 2200, top: 780, width: 240, height: 200, z: 198, depth: 12, material: 'pcb' },
  { id: 'debug', label: '调试接口', left: 2200, top: 1020, width: 220, height: 140, z: 205, depth: 10, material: 'pcb' },
  { id: 'fan', label: '风扇模组', left: 700, top: 40, width: 960, height: 200, z: 360, depth: 36, material: 'fan', explodeY: -100 },
  { id: 'shroud', label: '导风罩', left: 660, top: 280, width: 1040, height: 260, z: 300, depth: 28, material: 'plastic', explodeY: -56 },
  { id: 'disk', label: '硬盘背板', left: 2480, top: 80, width: 460, height: 760, z: 268, depth: 16, material: 'pcb', explodeX: 40 },
  { id: 'storage', label: '存储仓', left: 2480, top: 880, width: 460, height: 400, z: 248, depth: 22, material: 'metal' },
  { id: 'nic', label: '网络接口', left: 2480, top: 1320, width: 460, height: 140, z: 212, depth: 12, material: 'pcb' },
  { id: 'mgmt', label: '管理口', left: 2480, top: 1500, width: 400, height: 100, z: 200, depth: 10, material: 'pcb' },
  { id: 'front-io', label: '前置 IO', left: 2480, top: 1640, width: 440, height: 120, z: 190, depth: 10, material: 'pcb' },
];

export function inferPartByName(id: string): string {
  const n = id.toUpperCase();
  if (n.includes('BMC')) return 'bmc';
  if (n.includes('FAN')) return 'fan';
  if (n.includes('PSU') || n.includes('POWER')) return 'psu';
  if (n.includes('NIC') || n.includes('LAN') || n.includes('ETH')) return 'nic';
  if (n.includes('CPU') || n.includes('KUNPENG')) return 'mainboard';
  if (n.includes('MEM') || n.includes('DIMM')) return 'mainboard';
  if (n.includes('DISK') || n.includes('SATA') || n.includes('NVME') || n.includes('SSD')) return 'disk';
  if (n.includes('PCIE') || n.includes('RSC')) return 'pcie';
  if (n.includes('RISER')) return 'riser';
  if (n.includes('FPGA') || n.includes('CPLD')) return 'fpga';
  if (n.includes('DEBUG') || n.includes('UART')) return 'debug';
  if (n.includes('MAIN') || n.includes('BCU') || n.includes('BOARD')) return 'mainboard';
  if (n.includes('STORAGE')) return 'storage';
  if (n.includes('MGT') || n.includes('MGMT')) return 'mgmt';
  if (n.includes('SHROUD') || n.includes('AIR')) return 'shroud';
  if (n.includes('CHASSIS') || n.includes('TRAY')) return 'chassis';
  if (n.includes('IO')) return 'io';
  return 'mainboard';
}
