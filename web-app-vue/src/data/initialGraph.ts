// Initial nodes + edges — ported verbatim from
// web-app/src/components/TaishanStaticVectorTopologyView.tsx
// These positions already produce the layout shown in the reference screenshot.

import type { Node, Edge } from '@vue-flow/core';
import { C } from './palette';

type GrpOpts = { dashed?: boolean; subGroup?: boolean; parentId?: string };

// ── Node builder helpers ───────────────────────────────────────
const N = {
  grp(id: string, label: string, x: number, y: number, w: number, h: number,
      opts: GrpOpts = {}): Node {
    return {
      id, type: 'group', position: { x, y },
      data: { label, dashed: opts.dashed, subGroup: opts.subGroup },
      style: { width: `${w}px`, height: `${h}px` },
      ...(opts.parentId ? { parentNode: opts.parentId, extent: 'parent' } : {}),
      selectable: false,
      draggable: true,
      zIndex: 0,
    } as Node;
  },
  bus(id: string, label: string, x: number, y: number, parentId: string,
      opts: { dashed?: boolean; color?: string; nodeWidth?: number } = {}): Node {
    return {
      id, type: 'bus', position: { x, y },
      data: { label, ...opts },
      parentNode: parentId,
      extent: 'parent',
      selectable: true,
      draggable: true,
      zIndex: 10,
    } as Node;
  },
  smbus(id: string, label: string, x: number, y: number, parentId: string,
        opts: { color?: string } = {}): Node {
    return {
      id, type: 'smbus', position: { x, y },
      data: { label, ...opts },
      parentNode: parentId,
      extent: 'parent',
      selectable: true,
      draggable: true,
      zIndex: 10,
    } as Node;
  },
  mux(id: string, x: number, y: number, parentId: string,
      label?: string, handleCount = 4): Node {
    return {
      id, type: 'mux', position: { x, y },
      data: { label: label ?? 'Pca9545', handleCount },
      style: { width: '48px', height: '48px' },
      parentNode: parentId,
      extent: 'parent',
      selectable: true,
      draggable: true,
      zIndex: 10,
    } as Node;
  },
  chip(id: string, chipType: string, x: number, y: number, parentId: string): Node {
    return {
      id, type: 'chip', position: { x, y },
      data: { chipType },
      parentNode: parentId,
      extent: 'parent',
      selectable: true,
      draggable: true,
      zIndex: 10,
    } as Node;
  },
  big(id: string, chipType: string, x: number, y: number, parentId: string): Node {
    return {
      id, type: 'bigchip', position: { x, y },
      data: { chipType },
      parentNode: parentId,
      extent: 'parent',
      selectable: true,
      draggable: true,
      zIndex: 10,
    } as Node;
  },
};

function E(
  id: string, source: string, target: string,
  opts: { color?: string; dashed?: boolean; label?: string; sh?: string; th?: string } = {},
): Edge {
  const color = opts.color ?? C.blue;
  return {
    id,
    source,
    target,
    type: 'smoothstep',
    ...(opts.sh ? { sourceHandle: opts.sh } : {}),
    ...(opts.th ? { targetHandle: opts.th } : {}),
    style: {
      stroke: color,
      strokeWidth: 1.5,
      ...(opts.dashed ? { strokeDasharray: '4 4' } : {}),
    },
    ...(opts.label ? {
      label: opts.label,
      labelStyle: { fill: '#fff', fontSize: '10px', fontWeight: 600 },
      labelBgStyle: { fill: '#1a1a2e' },
      labelBgPadding: [4, 3],
      labelBgBorderRadius: 4,
    } : {}),
  } as Edge;
}

export function buildInitialNodes(): Node[] {
  const { grp, bus, smbus, mux, chip, big } = N;
  return [
    // ── Board groups ─────────────────────────────────────────
    grp('g_i0',    'I_0',         100,  60,  210, 148),
    grp('g_smc',   'SMC',         100, 228,  210, 148),
    grp('g_i2',    'I_2',         100, 396,  210, 148),
    grp('g_lst',   'LST_Board',   340,  60,  330, 670),
    grp('g_base',  'Base_Board',  700,  60,  430, 490),
    grp('g_fan',   'Base_Fan',   1060, 100,  175, 140),
    grp('g_nf',    'Base_NF',    1255, 100,  210, 140),
    grp('g_riser', 'Riser',        80, 640,  240, 140),
    grp('g_fgb',   'FGB',         700, 560,  250, 140),

    // ── I_0 board ──
    bus('bus_i0',       'i2cbus_1',  65, 22, 'g_i0'),
    chip('chip_i0_e1',  'Eeprom',    43, 62, 'g_i0'),
    chip('chip_i0_e2',  'Eeprom',   111, 62, 'g_i0'),

    // ── SMC board ──
    bus('bus_smc',      'i2cbus_2',  65, 22, 'g_smc'),
    chip('chip_smc',    'Smc',       79, 62, 'g_smc'),

    // ── I_2 board ──
    bus('bus_i2',       'i2cbus_3',  65, 22, 'g_i2'),
    chip('chip_i2_e1',  'Eeprom',    43, 62, 'g_i2'),
    chip('chip_i2_e2',  'Eeprom',   111, 62, 'g_i2'),

    // ── LST_Board row 1 ──
    bus('bus_lst1',         'i2cbus_4',   18, 20, 'g_lst'),
    mux('mux_lst1',                       222, 20, 'g_lst', 'Pca9545', 5),
    chip('chip_lst1_e1',    'Eeprom',     18, 60, 'g_lst'),
    chip('chip_lst1_cpu',   'CPU',        82, 60, 'g_lst'),
    chip('chip_lst1_lm1',   'Lm75',      146, 60, 'g_lst'),
    chip('chip_lst1_e2',    'Eeprom',    210, 60, 'g_lst'),
    chip('chip_lst1_lm2',   'Lm75',      146, 144, 'g_lst'),

    // ── LST_Board row 2 ──
    bus('bus_lst2',         'i2cbus_5',   18, 234, 'g_lst'),
    mux('mux_lst2',                       222, 234, 'g_lst'),
    chip('chip_lst2_lm1',   'Lm75',       18, 274, 'g_lst'),
    chip('chip_lst2_lm2',   'Lm75',       82, 274, 'g_lst'),
    chip('chip_lst2_lm3',   'Lm75',      146, 274, 'g_lst'),
    chip('chip_lst2_lm4',   'Lm75',      210, 274, 'g_lst'),

    // ── SMBus + Cpld ──
    smbus('bus_smbus',      'smbus_0',    18, 370, 'g_lst'),
    chip('chip_cpld',       'Cpld',      232, 363, 'g_lst'),

    // ── ComponentFuncGroup ──
    smbus('bus_cfg', 'ComponentFuncGroup_0', 18, 416, 'g_lst', { color: C.cyan }),

    // ── LST_Board row 3 ──
    bus('bus_lst3',         'i2cbus_6',   18, 458, 'g_lst'),
    mux('mux_lst3',                       222, 458, 'g_lst'),
    chip('chip_lst3_e1',    'Eeprom',     18, 498, 'g_lst'),
    chip('chip_lst3_cpu',   'CPU',        82, 498, 'g_lst'),
    chip('chip_lst3_lm',    'Lm75',      146, 498, 'g_lst'),
    chip('chip_lst3_e2',    'Eeprom',    210, 498, 'g_lst'),

    // ── Dashed reserves ──
    bus('bus_lst_d1',       'i2cbus_7',   18, 592, 'g_lst', { dashed: true }),
    bus('bus_lst_d2',       'i2cbus_8',   18, 626, 'g_lst', { dashed: true }),

    // ── Base_Board ──
    bus('bus_base1',        'i2cbus_9',   18, 22, 'g_base'),
    chip('chip_base_e0',    'Eeprom',    232, 17, 'g_base'),
    mux('mux_base',                       55, 65, 'g_base', 'Pca9545', 6),
    chip('chip_base_c1',    'CPU',        18, 105, 'g_base'),
    chip('chip_base_c2',    'CPU',        82, 105, 'g_base'),
    chip('chip_base_c3',    'CPU',        18, 185, 'g_base'),
    chip('chip_base_c4',    'CPU',        82, 185, 'g_base'),
    chip('chip_base_ep1',   'Eeprom',     18, 265, 'g_base'),
    chip('chip_base_ep2',   'Eeprom',     82, 265, 'g_base'),
    bus('bus_base2',        'i2cbus_10',  18, 358, 'g_base'),
    chip('chip_base_smc1',  'Smc',       180, 352, 'g_base'),
    chip('chip_base_smc2',  'Smc',       256, 352, 'g_base'),
    bus('bus_base3',        'i2cbus_11',  18, 445, 'g_base'),

    // ── Base_Fan ──
    bus('bus_fan',          'i2cbus_f',   20, 28, 'g_fan'),
    chip('chip_fan_cpu',    'CPU',        18, 66, 'g_fan'),
    chip('chip_fan_e',      'Eeprom',    100, 66, 'g_fan'),

    // ── Base_NF ──
    bus('bus_nf',           'i2cbus_nf',  20, 28, 'g_nf'),
    chip('chip_nf_c1',      'CPU',        18, 66, 'g_nf'),
    chip('chip_nf_c2',      'CPU',        82, 66, 'g_nf'),
    chip('chip_nf_c3',      'CPU',       146, 66, 'g_nf'),

    // ── Riser ──
    bus('bus_riser',        'i2cbus_r',   20, 28, 'g_riser'),
    chip('chip_riser_cpu',  'CPU',        62, 66, 'g_riser'),
    chip('chip_riser_e',    'Eeprom',    150, 66, 'g_riser'),

    // ── FGB ──
    bus('bus_fgb',          'i2cbus_fgb', 20, 28, 'g_fgb'),
    big('chip_fgb_1',       'CPU',        74, 58, 'g_fgb'),
    big('chip_fgb_2',       'CPU',       152, 58, 'g_fgb'),
  ];
}

export function buildInitialEdges(): Edge[] {
  return [
    // I_0 internal
    E('e_i0_1',  'bus_i0',  'chip_i0_e1',  { sh: 'r', th: 't' }),
    E('e_i0_2',  'bus_i0',  'chip_i0_e2',  { sh: 'r', th: 't' }),

    // SMC internal
    E('e_smc_1', 'bus_smc', 'chip_smc',    { sh: 'r', th: 't' }),

    // I_2 internal
    E('e_i2_1',  'bus_i2',  'chip_i2_e1',  { sh: 'r', th: 't' }),
    E('e_i2_2',  'bus_i2',  'chip_i2_e2',  { sh: 'r', th: 't' }),

    // Left boards → LST_Board
    E('e_cx_i0',  'bus_i0',  'bus_lst1', { sh: 'r', th: 'l', label: '1' }),
    E('e_cx_smc', 'bus_smc', 'bus_lst2', { color: C.green, sh: 'r', th: 'l', label: '2' }),
    E('e_cx_i2',  'bus_i2',  'bus_lst3', { sh: 'r', th: 'l', label: '3' }),

    // LST row 1
    E('e_lst1_mx', 'bus_lst1', 'mux_lst1',      { sh: 'r', th: 't' }),
    E('e_lst1_c1', 'mux_lst1', 'chip_lst1_e1',  { sh: 'b0', th: 't' }),
    E('e_lst1_c2', 'mux_lst1', 'chip_lst1_cpu', { sh: 'b1', th: 't' }),
    E('e_lst1_c3', 'mux_lst1', 'chip_lst1_lm1', { sh: 'b2', th: 't' }),
    E('e_lst1_c4', 'mux_lst1', 'chip_lst1_e2',  { sh: 'b3', th: 't' }),
    E('e_lst1_c5', 'mux_lst1', 'chip_lst1_lm2', { sh: 'b4', th: 't' }),

    // LST row 2
    E('e_lst2_mx', 'bus_lst2', 'mux_lst2',      { color: C.green, sh: 'r', th: 't' }),
    E('e_lst2_c1', 'mux_lst2', 'chip_lst2_lm1', { color: C.green, sh: 'b0', th: 't' }),
    E('e_lst2_c2', 'mux_lst2', 'chip_lst2_lm2', { color: C.green, sh: 'b1', th: 't' }),
    E('e_lst2_c3', 'mux_lst2', 'chip_lst2_lm3', { color: C.green, sh: 'b2', th: 't' }),
    E('e_lst2_c4', 'mux_lst2', 'chip_lst2_lm4', { color: C.green, sh: 'b3', th: 't' }),

    // LST SMBus → Cpld
    E('e_smb_cpld', 'bus_smbus', 'chip_cpld', { color: C.green, sh: 'r', th: 't' }),

    // LST row 3
    E('e_lst3_mx', 'bus_lst3', 'mux_lst3',     { sh: 'r', th: 't' }),
    E('e_lst3_c1', 'mux_lst3', 'chip_lst3_e1', { sh: 'b0', th: 't' }),
    E('e_lst3_c2', 'mux_lst3', 'chip_lst3_cpu',{ sh: 'b1', th: 't' }),
    E('e_lst3_c3', 'mux_lst3', 'chip_lst3_lm', { sh: 'b2', th: 't' }),
    E('e_lst3_c4', 'mux_lst3', 'chip_lst3_e2', { sh: 'b3', th: 't' }),

    // Dashed reserve
    E('e_dash1', 'bus_lst_d1', 'bus_base3', { color: '#fff', dashed: true, sh: 'r', th: 'l' }),

    // LST → Base
    E('e_x11', 'bus_lst1',  'bus_base1', { sh: 'r', th: 'l', label: '11' }),
    E('e_x12', 'bus_lst2',  'bus_base2', { color: C.green, sh: 'r', th: 'l', label: '12' }),
    E('e_x13', 'bus_smbus', 'bus_base3', { color: C.green, sh: 'r', th: 'l', label: '13' }),

    // Base_Board internal
    E('e_b_e0',  'bus_base1', 'chip_base_e0',  { sh: 'r', th: 't' }),
    E('e_b_mx',  'bus_base1', 'mux_base',       { sh: 'r', th: 't' }),
    E('e_b_c1',  'mux_base',  'chip_base_c1',   { sh: 'b0', th: 't' }),
    E('e_b_c2',  'mux_base',  'chip_base_c2',   { sh: 'b1', th: 't' }),
    E('e_b_c3',  'mux_base',  'chip_base_c3',   { sh: 'b2', th: 't' }),
    E('e_b_c4',  'mux_base',  'chip_base_c4',   { sh: 'b3', th: 't' }),
    E('e_b_ep1', 'mux_base',  'chip_base_ep1',  { sh: 'b4', th: 't' }),
    E('e_b_ep2', 'mux_base',  'chip_base_ep2',  { sh: 'b5', th: 't' }),
    E('e_b_s1',  'bus_base2', 'chip_base_smc1', { sh: 'r', th: 't' }),
    E('e_b_s2',  'bus_base2', 'chip_base_smc2', { sh: 'r', th: 't' }),

    // Base → Fan / NF
    E('e_x14', 'bus_base2', 'bus_fan', { sh: 'r', th: 'l', label: '14' }),
    E('e_x15', 'bus_base3', 'bus_nf',  { color: C.green, sh: 'r', th: 'l', label: '15' }),

    // Base_Fan internal
    E('e_fan1', 'bus_fan', 'chip_fan_cpu', { sh: 'r', th: 't' }),
    E('e_fan2', 'bus_fan', 'chip_fan_e',   { sh: 'r', th: 't' }),

    // Base_NF internal
    E('e_nf1', 'bus_nf', 'chip_nf_c1', { sh: 'r', th: 't' }),
    E('e_nf2', 'bus_nf', 'chip_nf_c2', { sh: 'r', th: 't' }),
    E('e_nf3', 'bus_nf', 'chip_nf_c3', { sh: 'r', th: 't' }),

    // Riser internal
    E('e_rs1', 'bus_riser', 'chip_riser_cpu', { sh: 'r', th: 't' }),
    E('e_rs2', 'bus_riser', 'chip_riser_e',   { sh: 'r', th: 't' }),

    // FGB internal
    E('e_fg1', 'bus_fgb', 'chip_fgb_1', { sh: 'r', th: 't' }),
    E('e_fg2', 'bus_fgb', 'chip_fgb_2', { sh: 'r', th: 't' }),
  ];
}
