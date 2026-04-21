// Static I2C / SMBus / JTAG topology per board type.
// Data model separates direct-bus chips from mux-downstream chips so the
// renderer can draw the correct wire topology.
//
// TODO: Replace with live-parsed .sr ManagementTopology when parser is ready.

import { C } from './palette';

export interface ChipItem {
  label: string;
  chipType: string;   // Eeprom | CPU | Lm75 | Smc | Cpld | VRD | bigchip
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
  };
}

export interface BoardTopologyDef {
  boardLabel: string;
  buses: BusRow[];
}

// ── helpers ───────────────────────────────────────────────────────────
const chip  = (chipType: string, label?: string): ChipItem =>
  ({ chipType, label: label ?? chipType });
const mux   = (channels: number, chips: ChipItem[], label = 'PCA9545') =>
  ({ label, channels, chips });

function I2C(label: string, chips: ChipItem[],
    opts: Partial<BusRow> & { mux?: BusRow['mux'] } = {}): BusRow {
  return { id: label, label, busType: 'i2c', color: C.pink, chips, ...opts };
}
function SMBUS(label: string, chips: ChipItem[], opts: Partial<BusRow> = {}): BusRow {
  return { id: label, label, busType: 'smbus', color: C.green, chips, ...opts };
}
function JTAG(label: string, chips: ChipItem[], opts: Partial<BusRow> = {}): BusRow {
  return { id: label, label, busType: 'jtag', color: C.green, chips, ...opts };
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
    I2C('i2cbus_1', [chip('Smc', 'SMC')]),
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
      [chip('Eeprom'), chip('Smc', 'SMC'), chip('Cpld', 'CPLD')],
      { mux: mux(4, [chip('Lm75', 'LM75')]) },
    ),
    I2C('I2c_2',
      [],
      { mux: mux(4, [chip('Cpld', 'CPLD'), chip('Cpld', 'CPLD'), chip('Cpld', 'CPLD'), chip('Cpld', 'CPLD')]) },
    ),
    I2C('I2c_3',
      [],
      { mux: mux(4, []) },
    ),
    JTAG('JTAG_1',          [chip('Cpld', 'CPLD')]),
    HSP('JtagOverLocalBus', { label: 'JtagOverLocalBus' }),
    I2C('I2c_5',            []),
    I2C('I2c_6',
      [chip('Eeprom'), chip('Smc', 'SMC'), chip('Lm75', 'LM75')],
      { mux: mux(4, []) },
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
      [chip('Eeprom')],
      { mux: mux(6, [chip('CPU'), chip('CPU'), chip('CPU'), chip('CPU'), chip('Eeprom'), chip('Eeprom')]) },
    ),
    SMBUS('I2c_2', [chip('Smc', 'SMC'), chip('Smc', 'SMC')]),
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
    I2C('I2c_1', [chip('CPU'), chip('Eeprom')]),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// IEU — Riser Card
// ─────────────────────────────────────────────────────────────────────
export const IEU_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'IEU · RiserCard',
  buses: [
    I2C('I2c_1', [chip('Eeprom'), chip('Eeprom')]),
    I2C('I2c_3', [chip('Eeprom'), chip('Eeprom')]),
    I2C('I2c_r', [chip('CPU'), chip('Eeprom')]),
    HSP('HiSport'),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// SEU — HDD Backplane
// ─────────────────────────────────────────────────────────────────────
export const SEU_HDD_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'SEU · HddBackplane',
  buses: [
    I2C('I2c_1', [chip('CPU'), chip('CPU'), chip('CPU')]),
    I2C('I2c_2', [chip('Smc', 'SMC'), chip('Smc', 'SMC')]),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// SEU — M2 Transfer Card
// ─────────────────────────────────────────────────────────────────────
export const SEU_M2_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'SEU · M2TransferCard',
  buses: [
    I2C('I2c_1', [chip('Eeprom'), chip('CPU')]),
  ],
};

// ─────────────────────────────────────────────────────────────────────
// NICCard — Network Interface Card
// ─────────────────────────────────────────────────────────────────────
export const NICCARD_TOPOLOGY: BoardTopologyDef = {
  boardLabel: 'NICCard · BoardNICCard',
  buses: [
    I2C('I2c_1', [chip('CPU'), chip('CPU'), chip('CPU')]),
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
