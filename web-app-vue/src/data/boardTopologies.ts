// Static I2C / SMBus / JTAG topology per board type.
// Data model separates direct-bus chips from mux-downstream chips so the
// renderer can draw the correct wire topology.
//
// TODO: Replace with live-parsed .sr ManagementTopology when parser is ready.

import { C } from './palette';

export interface ChipItem {
  label: string;
  chipType: string;   // Eeprom | CPU | Lm75 | Smc | Cpld | VRD | bigchip
  /**
   * 器件地址：I2C 8bit 写地址的十六进制写法，对齐 .sr 里 Objects[*].Address
   * （真实 .sr 存十进制，如 Smc 96 = 0x60、Pca9545 224 = 0xE0）。
   * JTAG / Hisport 链路上的器件没有 I2C 地址，此字段留空。
   */
  addr?: string;
}

export interface BusRow {
  id: string;
  label: string;
  busType: 'i2c' | 'smbus' | 'hisport' | 'jtag';
  color: string;
  dashed?: boolean;
  /** Chips wired directly on this bus (shown in the top row) */
  chips: ChipItem[];
  /** Optional mux at the end of the bus; its downstream chips hang below */
  mux?: {
    label: string;
    channels: number;
    chips: ChipItem[];   // chips reachable through the mux
    addr?: string;       // mux 自身的 I2C 地址（Pca9545 实测 0xE0 / 0xE2）
  };
}

export interface BoardTopologyDef {
  boardLabel: string;
  buses: BusRow[];
}

// ── helpers ───────────────────────────────────────────────────────────
/**
 * 各类器件的缺省 I2C 地址。取值参照 public/sr-samples 里真实 .sr 的
 * Objects[*].Address（8bit 写地址）：Smc 恒为 0x60，Lm75 落在 0x90/0x92/0x94，
 * Eeprom 常见 0xA0~0xBA，Pca9545 为 0xE0/0xE2，通用 Chip 见 0x24/0x42/0x8E…
 * 同一条总线上挂多颗同型器件时，在下面各板卡定义里显式写地址避免重复。
 * 注：Cpld 在样例库里只出现在 JTAG 链路、没有 Address 字段，挂 I2C 时的
 * 0xC0 段属于本演示数据的占位取值。
 */
const DEFAULT_ADDR: Record<string, string> = {
  Eeprom: '0xAE',
  Smc:    '0x60',
  Lm75:   '0x90',
  CPU:    '0x42',
  Cpld:   '0xC0',
  VRD:    '0xB0',
};

const chip  = (chipType: string, label?: string, addr?: string): ChipItem =>
  ({ chipType, label: label ?? chipType, addr: addr ?? DEFAULT_ADDR[chipType] });
const mux   = (channels: number, chips: ChipItem[], label = 'PCA9545', addr = '0xE0') =>
  ({ label, channels, chips, addr });

function I2C(label: string, chips: ChipItem[],
    opts: Partial<BusRow> & { mux?: BusRow['mux'] } = {}): BusRow {
  return { id: label, label, busType: 'i2c', color: C.pink, chips, ...opts };
}
function SMBUS(label: string, chips: ChipItem[], opts: Partial<BusRow> = {}): BusRow {
  return { id: label, label, busType: 'smbus', color: C.green, chips, ...opts };
}
function JTAG(label: string, chips: ChipItem[], opts: Partial<BusRow> = {}): BusRow {
  // JTAG 链路上的器件没有 I2C 地址（样例库里 Cpld_1 也确实不带 Address 字段），
  // 统一清空，渲染时显示为「—」
  return {
    id: label, label, busType: 'jtag', color: C.amber,
    chips: chips.map(c => ({ ...c, addr: undefined })),
    ...opts,
  };
}
function HSP(label: string, opts: Partial<BusRow> = {}): BusRow {
  return { id: label, label, busType: 'hisport', color: C.cyan, chips: [], ...opts };
}

// ─────────────────────────────────────────────────────────────────────
// BMC root
// ─────────────────────────────────────────────────────────────────────
export const BMC_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'BMC',
  buses: [
    I2C('i2cbus_1', [chip('Smc', 'SMC', '0x60')]),
    HSP('Hisport_0'),
    HSP('Hisport_1'),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// EXU — Extension board (matches the React screenshot)
//   I2c_1: Eeprom, SMC, CPLD directly on bus + PCA9545 mux → LM75
//   I2c_2: PCA9545 mux → CPLD × 4
//   I2c_3: PCA9545 mux (cross-board, no local chips)
//   JTAG_1: CPLD
//   JtagOverLocalBus: port
//   I2c_5: empty
//   I2c_6: Eeprom, SMC, LM75, PCA9545
//   I2c_8-16: reserved
//   JTAG_2-8: reserved
// ─────────────────────────────────────────────────────────────────────
export const EXU_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'EXU · ExpBoard',
  buses: [
    I2C('I2c_1',
      [chip('Eeprom', undefined, '0xAE'), chip('Smc', 'SMC', '0x60'), chip('Cpld', 'CPLD', '0xC0')],
      { mux: mux(4, [chip('Lm75', 'LM75', '0x90')], 'PCA9545', '0xE0') },
    ),
    I2C('I2c_2',
      [],
      { mux: mux(4, [
        chip('Cpld', 'CPLD', '0xC0'), chip('Cpld', 'CPLD', '0xC2'),
        chip('Cpld', 'CPLD', '0xC4'), chip('Cpld', 'CPLD', '0xC6'),
      ], 'PCA9545', '0xE2') },
    ),
    I2C('I2c_3',
      [],
      { mux: mux(4, [], 'PCA9545', '0xE4') },
    ),
    JTAG('JTAG_1',          [chip('Cpld', 'CPLD')]),
    HSP('JtagOverLocalBus', { label: 'JtagOverLocalBus' }),
    I2C('I2c_5',            []),
    I2C('I2c_6',
      [chip('Eeprom', undefined, '0xB6'), chip('Smc', 'SMC', '0x60'), chip('Lm75', 'LM75', '0x92')],
      { mux: mux(4, [], 'PCA9545', '0xE6') },
    ),
    I2C('I2c_8-16',         [], { dashed: true }),
    JTAG('JTAG_2-8',        [], { dashed: true }),
    HSP('Hisport × 22',     { label: 'Hisport × 22' }),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// BCU — CPU Board (Baseboard)
// ─────────────────────────────────────────────────────────────────────
export const BCU_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'BCU · CpuBoard',
  buses: [
    I2C('I2c_1',
      [chip('Eeprom', undefined, '0xAE')],
      { mux: mux(6, [
        chip('CPU', undefined, '0x42'), chip('CPU', undefined, '0x44'),
        chip('CPU', undefined, '0x46'), chip('CPU', undefined, '0x48'),
        chip('Eeprom', undefined, '0xA0'), chip('Eeprom', undefined, '0xA4'),
      ], 'PCA9545', '0xE0') },
    ),
    SMBUS('I2c_2', [chip('Smc', 'SMC', '0x60'), chip('Smc', 'SMC', '0x62')]),
    I2C('I2c_3',   [], { dashed: true }),
    HSP('HiSport_1'),
    HSP('HiSport_2'),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// CLU — Fan Board
// ─────────────────────────────────────────────────────────────────────
export const CLU_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'CLU · FanBoard',
  buses: [
    I2C('I2c_1', [chip('CPU', undefined, '0x42'), chip('Eeprom', undefined, '0xAE')]),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// IEU — Riser Card
// ─────────────────────────────────────────────────────────────────────
export const IEU_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'IEU · RiserCard',
  buses: [
    I2C('I2c_1', [chip('Eeprom', undefined, '0xA0'), chip('Eeprom', undefined, '0xA4')]),
    I2C('I2c_3', [chip('Eeprom', undefined, '0xA8'), chip('Eeprom', undefined, '0xAC')]),
    I2C('I2c_r', [chip('CPU', undefined, '0x42'), chip('Eeprom', undefined, '0xAE')]),
    HSP('HiSport'),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// SEU — HDD Backplane
// ─────────────────────────────────────────────────────────────────────
export const SEU_HDD_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'SEU · HddBackplane',
  buses: [
    I2C('I2c_1', [chip('CPU', undefined, '0x42'), chip('CPU', undefined, '0x44'), chip('CPU', undefined, '0x46')]),
    I2C('I2c_2', [chip('Smc', 'SMC', '0x60'), chip('Smc', 'SMC', '0x62')]),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// SEU — M2 Transfer Card
// ─────────────────────────────────────────────────────────────────────
export const SEU_M2_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'SEU · M2TransferCard',
  buses: [
    I2C('I2c_1', [chip('Eeprom', undefined, '0xAE'), chip('CPU', undefined, '0x42')]),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// NICCard — Network Interface Card
// ─────────────────────────────────────────────────────────────────────
export const NICCARD_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'NICCard · BoardNICCard',
  buses: [
    I2C('I2c_1', [chip('CPU', undefined, '0x42'), chip('CPU', undefined, '0x44'), chip('CPU', undefined, '0x46')]),
    HSP('HiSport'),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// Unknown
// ─────────────────────────────────────────────────────────────────────
export const UNKNOWN_TOPOLOGY: BoardTopologyDef = {
  boardLabel: '未分类板卡',
  buses: [],
};

// ── Lookup ────────────────────────────────────────────────────────────
export function getTopology(type: string, name: string): BoardTopologyDef {
  if (type === 'BMC')     return BMC_TOPOLOGY;
  if (type === 'EXU')     return EXU_TOPOLOGY;
  if (type === 'BCU')     return BCU_TOPOLOGY;
  if (type === 'CLU')     return CLU_TOPOLOGY;
  if (type === 'IEU')     return IEU_TOPOLOGY;
  if (type === 'SEU' && name.startsWith('M2')) return SEU_M2_TOPOLOGY;
  if (type === 'SEU')     return SEU_HDD_TOPOLOGY;
  if (type === 'NICCard') return NICCARD_TOPOLOGY;
  return UNKNOWN_TOPOLOGY;
}
