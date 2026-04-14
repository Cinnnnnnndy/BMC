import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow, Background, BackgroundVariant, Controls, MiniMap,
  Handle, Position, useNodesState, useEdgesState, useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import type { Node, Edge, NodeProps, NodeChange } from '@xyflow/react';
// @ts-ignore
import ELK from 'elkjs/lib/elk.bundled.js';
import { useTheme } from '../hooks/useTheme';

// ── Color palette ──────────────────────────────────────────────────────
const C = {
  pink:   '#e879a0',
  purple: '#a855f7',   // I2C bus
  green:  '#4ade80',   // SMBus
  orange: '#f97316',   // Power bus
  blue:   '#60a5fa',   // (legacy, cross-board)
  cyan:   '#06b6d4',
  chipColor: {
    Eeprom: '#6b7280',
    CPU:    '#22c55e',
    Lm75:   '#8b5cf6',
    Smc:    '#f59e0b',
    Cpld:   '#06b6d4',
  } as Record<string, string>,
};

// ── IC chip SVG icon — outline/lineart style ───────────────────────────
function ChipIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Body outline — no fill */}
      <rect x="5" y="5" width="14" height="14" rx="2.5"
        fill="var(--chip-icon-body)" stroke="var(--chip-icon-pin)" strokeWidth="1.2" />
      {/* Inner die — outline only */}
      <rect x="8.5" y="8.5" width="7" height="7" rx="1"
        fill="none" stroke="var(--chip-icon-pin)" strokeWidth="0.9" strokeDasharray="0" />
      {/* Top/bottom pins */}
      {[9, 12, 15].map((x) => (
        <React.Fragment key={x}>
          <line x1={x} y1="5"  x2={x} y2="2.5"  stroke="var(--chip-icon-pin)" strokeWidth="1.4" strokeLinecap="round" />
          <line x1={x} y1="19" x2={x} y2="21.5" stroke="var(--chip-icon-pin)" strokeWidth="1.4" strokeLinecap="round" />
        </React.Fragment>
      ))}
      {/* Side pins */}
      {[9, 15].map((y) => (
        <React.Fragment key={y}>
          <line x1="5"  y1={y} x2="2.5"  y2={y} stroke="var(--chip-icon-pin)" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="19" y1={y} x2="21.5" y2={y} stroke="var(--chip-icon-pin)" strokeWidth="1.4" strokeLinecap="round" />
        </React.Fragment>
      ))}
    </svg>
  );
}

// ── GroupNode ──────────────────────────────────────────────────────────
function GroupNode({ data }: NodeProps) {
  const d = data as { label?: string; dashed?: boolean; subGroup?: boolean };
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 8, position: 'relative',
      background: 'var(--board-bg)',
      border: d.subGroup ? '1.5px dashed var(--board-border)' : 'none',
      pointerEvents: 'none', overflow: 'visible',
    }}>
      {d.label && (
        <span style={{
          position: 'absolute', top: 6, left: 8, fontSize: 10, fontWeight: 600,
          color: 'var(--board-label)', letterSpacing: '0.05em',
          fontFamily: 'monospace', pointerEvents: 'none', userSelect: 'none',
        }}>
          {d.label}
        </span>
      )}
    </div>
  );
}

// ── BusNode ────────────────────────────────────────────────────────────
function BusNode({ data, selected }: NodeProps) {
  const d = data as { label: string; dashed?: boolean; color?: string; nodeWidth?: number };
  const bg = d.color ?? C.pink;
  return (
    <div style={{
      width: d.nodeWidth ?? 80, height: 22, borderRadius: 11,
      background: d.dashed ? 'transparent' : bg,
      border: d.dashed ? `1.5px dashed ${bg}` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 600, color: d.dashed ? bg : '#fff',
      position: 'relative', cursor: 'grab', whiteSpace: 'nowrap',
      boxShadow: selected ? `0 0 0 2px rgba(79,110,247,0.6), 0 0 12px rgba(79,110,247,0.3)` : 'none',
      outline: 'none',
    }}>
      <Handle type="target" position={Position.Left}  id="l"
        style={{ width: 8, height: 8, background: '#4a9eff', border: 'none', left: -4 }} />
      {d.label}
      <Handle type="source" position={Position.Right} id="r"
        style={{ width: 6, height: 6, background: 'rgba(255,255,255,0.3)', border: 'none', right: -3 }} />
    </div>
  );
}

// ── SMBusNode ──────────────────────────────────────────────────────────
function SMBusNode({ data, selected }: NodeProps) {
  const d = data as { label: string; color?: string };
  const bg = d.color ?? C.green;
  const darkText = bg === C.green;
  return (
    <div style={{
      height: 22, borderRadius: 11, background: bg, padding: '0 10px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 600, color: darkText ? '#0c1e14' : '#fff',
      position: 'relative', cursor: 'grab', whiteSpace: 'nowrap',
      boxShadow: selected ? `0 0 0 2px rgba(79,110,247,0.6)` : 'none',
      outline: 'none',
    }}>
      <Handle type="target" position={Position.Left}  id="l"
        style={{ width: 8, height: 8, background: '#4a9eff', border: 'none', left: -4 }} />
      {d.label}
      <Handle type="source" position={Position.Right} id="r"
        style={{ width: 6, height: 6, background: 'rgba(255,255,255,0.3)', border: 'none', right: -3 }} />
    </div>
  );
}

// ── MuxNode ────────────────────────────────────────────────────────────
// Invisible container spans the chip row (for correct handle alignment).
// A 48×48 card is rendered centered inside — visually identical to ChipNode.
// Bottom handles use handlePercents so lines drop straight to each chip.
function MuxNode({ data, selected }: NodeProps) {
  const d = data as { label?: string; handleCount?: number };
  const n = Math.max(1, d.handleCount ?? 4);
  // Evenly distribute N handles within the 48px card
  const percents = Array.from({ length: n }, (_, i) => `${(((i + 0.5) / n) * 100).toFixed(1)}%`);
  const muxColor = '#a855f7';
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 10, background: 'var(--node-bg)',
      border: selected ? '1.5px solid rgba(100,140,255,0.70)' : '1px solid var(--surface-border-subtle)',
      boxShadow: selected ? `0 0 0 2px rgba(167,139,250,0.25)` : 'none',
      display: 'flex', flexDirection: 'column', overflow: 'visible',
      position: 'relative', cursor: 'grab',
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChipIcon size={26} />
      </div>
      <div style={{
        height: 14, background: muxColor + '28', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 10, color: muxColor,
        flexShrink: 0, userSelect: 'none', borderRadius: '0 0 10px 10px',
        fontWeight: 500,
      }}>
        {d.label ?? 'Pca9545'}
      </div>
      <Handle type="target" position={Position.Top} id="t"
        style={{ width: 6, height: 6, background: '#a855f7', border: 'none',
          left: '50%', top: -3, transform: 'translateX(-50%)' }} />
      {percents.map((left, i) => (
        <Handle key={i} type="source" position={Position.Bottom} id={`b${i}`}
          style={{ width: 5, height: 5, background: 'rgba(167,139,250,0.9)', border: 'none',
            bottom: -2.5, left, transform: 'translateX(-50%)' }} />
      ))}
    </div>
  );
}

// ── ChipNode ───────────────────────────────────────────────────────────
// Border removed — type color expressed as label strip background tint.
// Layout: icon fills upper area, label at bottom (10px font).
function ChipNode({ data, selected }: NodeProps) {
  const d = data as { chipType: string };
  const typeColor = C.chipColor[d.chipType] ?? '#6b7280';
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 10, background: 'var(--node-bg)',
      border: selected ? '1.5px solid rgba(100,140,255,0.70)' : '1px solid var(--surface-border-subtle)',
      boxShadow: selected ? `0 0 0 2px rgba(79,110,247,0.25)` : 'none',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative', cursor: 'grab', outline: 'none',
    }}>
      <Handle type="target" position={Position.Top} id="t"
        style={{ width: 5, height: 5, background: 'rgba(128,128,180,0.5)', border: 'none', top: -2.5 }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChipIcon size={28} />
      </div>
      <div style={{
        height: 14, background: typeColor + '28', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 10, color: typeColor, flexShrink: 0,
        fontWeight: 500,
      }}>
        {d.chipType}
      </div>
    </div>
  );
}

// ── BigChipNode ────────────────────────────────────────────────────────
function BigChipNode({ data, selected }: NodeProps) {
  const d = data as { chipType: string };
  const typeColor = C.chipColor[d.chipType] ?? '#6b7280';
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 10, background: 'var(--node-bg)',
      border: selected ? '1.5px solid rgba(100,140,255,0.70)' : '1px solid var(--surface-border-subtle)',
      boxShadow: selected ? '0 0 0 2px rgba(79,110,247,0.25)' : 'none',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative', cursor: 'grab', outline: 'none',
    }}>
      <Handle type="target" position={Position.Top} id="t"
        style={{ width: 5, height: 5, background: 'rgba(128,128,180,0.5)', border: 'none', top: -2.5 }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChipIcon size={28} />
      </div>
      <div style={{
        height: 14, background: typeColor + '28', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 10, color: typeColor, flexShrink: 0,
        fontWeight: 500,
      }}>
        {d.chipType}
      </div>
    </div>
  );
}

// ── nodeTypes ──────────────────────────────────────────────────────────
const nodeTypes = {
  group:   GroupNode,
  bus:     BusNode,
  smbus:   SMBusNode,
  mux:     MuxNode,
  chip:    ChipNode,
  bigchip: BigChipNode,
};

// ── Node builder helpers ───────────────────────────────────────────────
type GrpOpts = { dashed?: boolean; subGroup?: boolean; parentId?: string };
const N = {
  grp: (id: string, label: string, x: number, y: number, w: number, h: number,
    opts: GrpOpts = {}): Node => ({
    id, type: 'group', position: { x, y },
    data: { label, dashed: opts.dashed, subGroup: opts.subGroup },
    style: { width: w, height: h },
    ...(opts.parentId ? { parentId: opts.parentId, extent: 'parent' as const } : {}),
    selectable: false, draggable: true, zIndex: 0,
  }),
  bus: (id: string, label: string, x: number, y: number, parentId: string,
    opts: { dashed?: boolean; color?: string; nodeWidth?: number } = {}): Node => ({
    id, type: 'bus', position: { x, y }, data: { label, ...opts },
    parentId, extent: 'parent' as const,
    selectable: true, draggable: true, zIndex: 10,
  }),
  smbus: (id: string, label: string, x: number, y: number, parentId: string,
    opts: { color?: string } = {}): Node => ({
    id, type: 'smbus', position: { x, y }, data: { label, ...opts },
    parentId, extent: 'parent' as const,
    selectable: true, draggable: true, zIndex: 10,
  }),
  mux: (id: string, x: number, y: number, parentId: string, label?: string, handleCount = 4): Node => ({
    id, type: 'mux', position: { x, y }, data: { label: label ?? 'Pca9545', handleCount },
    style: { width: 48, height: 48 },
    parentId, extent: 'parent' as const,
    selectable: true, draggable: true, zIndex: 10,
  }),
  chip: (id: string, chipType: string, x: number, y: number, parentId: string): Node => ({
    id, type: 'chip', position: { x, y }, data: { chipType },
    parentId, extent: 'parent' as const,
    selectable: true, draggable: true, zIndex: 10,
  }),
  big: (id: string, chipType: string, x: number, y: number, parentId: string): Node => ({
    id, type: 'bigchip', position: { x, y }, data: { chipType },
    parentId, extent: 'parent' as const,
    selectable: true, draggable: true, zIndex: 10,
  }),
};

// ── Edge builder helper ────────────────────────────────────────────────
function E(
  id: string, src: string, tgt: string,
  opts: { color?: string; dashed?: boolean; label?: string; sh?: string; th?: string } = {},
): Edge {
  const color = opts.color ?? C.purple;
  return {
    id, source: src, target: tgt, type: 'smoothstep',
    ...(opts.sh ? { sourceHandle: opts.sh } : {}),
    ...(opts.th ? { targetHandle: opts.th } : {}),
    style: {
      stroke: color, strokeWidth: 1.5,
      ...(opts.dashed ? { strokeDasharray: '4 4' } : {}),
    },
    ...(opts.label ? {
      label: opts.label,
      labelStyle: { fill: '#fff', fontSize: 10, fontWeight: 600 },
      labelBgStyle: { fill: '#1a1a2e' },
      labelBgPadding: [4, 3] as [number, number],
      labelBgBorderRadius: 4,
    } : {}),
  };
}

// ── Initial nodes — clean spacing layout ───────────────────────────────
// Chip: 52×64  Bus: ~80×22  Mux: 72×22  BigChip: 58×72
// Min gap between siblings: 12px horizontal, 16px vertical
function buildInitialNodes(): Node[] {
  const { grp, bus, smbus, mux, chip, big } = N;
  return [
    // ── Board groups (absolute positions) ────────────────────────────
    //   g_i0/smc/i2: stacked left, 20px vertical gap
    //   g_lst: large center board, aligned top with g_i0
    //   g_base: right of g_lst, 30px gap
    //   g_fan / g_nf: far right, 20px gap between
    //   g_riser / g_fgb: bottom row
    grp('g_i0',   'I_0',        100,  60,  210, 148),
    grp('g_smc',  'SMC',        100, 228,  210, 148),
    grp('g_i2',   'I_2',        100, 396,  210, 148),
    grp('g_lst',  'LST_Board',  340,  60,  330, 670),
    grp('g_base', 'Base_Board', 700,  60,  430, 490),
    grp('g_fan',  'Base_Fan',  1060, 100,  175, 140),
    grp('g_nf',   'Base_NF',   1255, 100,  210, 140),
    grp('g_riser','Riser',       80, 640,  240, 140),
    // g_fgb placed below g_base (x=700,y=560) to avoid overlap with g_lst (x=340-670)
    grp('g_fgb',  'FGB',        700, 560,  250, 140),

    // MCU sub-group — placed right of the 4-chip mux row (x=20+228+12=260)

    // ── I_0 board ── bus centered, 2 chips below side by side ─────────
    bus('bus_i0',       'i2cbus_1',  65, 22, 'g_i0'),
    chip('chip_i0_e1',  'Eeprom',    43, 62, 'g_i0'),
    chip('chip_i0_e2',  'Eeprom',   111, 62, 'g_i0'),
    // i0: bus right(145) ← 65+80; chips: 43→95, 111→163; gap=16 ✓; h:62+64=126<148 ✓

    // ── SMC board ── bus centered, single chip below center ───────────
    bus('bus_smc',      'i2cbus_2',  65, 22, 'g_smc'),
    chip('chip_smc',    'Smc',       79, 62, 'g_smc'),
    // smc: chip 79→131; centered (210/2-26=79) ✓; h:62+64=126<148 ✓

    // ── I_2 board ── same layout as I_0 ──────────────────────────────
    bus('bus_i2',       'i2cbus_3',  65, 22, 'g_i2'),
    chip('chip_i2_e1',  'Eeprom',    43, 62, 'g_i2'),
    chip('chip_i2_e2',  'Eeprom',   111, 62, 'g_i2'),

    // ── LST_Board ── 3 rows: bus→mux→chips, SMBus, dashed reserves ───
    // Row 1 (y=20)
    bus('bus_lst1',         'i2cbus_4',   18, 20, 'g_lst'),
    mux('mux_lst1',                      222, 20, 'g_lst', 'Pca9545', 5),
    chip('chip_lst1_e1',    'Eeprom',     18, 60, 'g_lst'),
    chip('chip_lst1_cpu',   'CPU',        82, 60, 'g_lst'),
    chip('chip_lst1_lm1',   'Lm75',      146, 60, 'g_lst'),
    chip('chip_lst1_e2',    'Eeprom',    210, 60, 'g_lst'),
    chip('chip_lst1_lm2',   'Lm75',      146,144, 'g_lst'),
    // row1: 4 chips at x:18,82,146,210; gap=12 ✓; chip_lst1_lm2 below lm1: 60+64+20=144 ✓

    // Row 2 (below row1 lm2: 144+64+26=234)
    bus('bus_lst2',         'i2cbus_5',   18,234, 'g_lst'),
    mux('mux_lst2',                      222,234, 'g_lst'),
    chip('chip_lst2_lm1',   'Lm75',       18,274, 'g_lst'),
    chip('chip_lst2_lm2',   'Lm75',       82,274, 'g_lst'),
    chip('chip_lst2_lm3',   'Lm75',      146,274, 'g_lst'),
    chip('chip_lst2_lm4',   'Lm75',      210,274, 'g_lst'),
    // row2 chips bottom: 274+64=338

    // SMBus + Cpld (338+30=368)
    smbus('bus_smbus',      'smbus_0',    18,370, 'g_lst'),
    chip('chip_cpld',       'Cpld',      232,363, 'g_lst'),

    // ComponentFuncGroup (370+22+18=410)
    smbus('bus_cfg', 'ComponentFuncGroup_0', 18, 416, 'g_lst', { color: C.cyan }),

    // Row 3 (416+22+20=458)
    bus('bus_lst3',         'i2cbus_6',   18,458, 'g_lst'),
    mux('mux_lst3',                      222,458, 'g_lst'),
    chip('chip_lst3_e1',    'Eeprom',     18,498, 'g_lst'),
    chip('chip_lst3_cpu',   'CPU',        82,498, 'g_lst'),
    chip('chip_lst3_lm',    'Lm75',      146,498, 'g_lst'),
    chip('chip_lst3_e2',    'Eeprom',    210,498, 'g_lst'),
    // row3 chips bottom: 498+64=562

    // Dashed reserves (562+28=590)
    bus('bus_lst_d1',       'i2cbus_7',   18,592, 'g_lst', { dashed: true }),
    bus('bus_lst_d2',       'i2cbus_8',   18,626, 'g_lst', { dashed: true }),
    // g_lst height 670: 626+22+22=670 ✓

    // ── Base_Board ────────────────────────────────────────────────────
    bus('bus_base1',        'i2cbus_9',   18, 22, 'g_base'),
    chip('chip_base_e0',    'Eeprom',    232, 17, 'g_base'),

    // Mux + 6 chips
    mux('mux_base',                       55, 65, 'g_base', 'Pca9545', 6),
    chip('chip_base_c1',    'CPU',        18,105, 'g_base'),
    chip('chip_base_c2',    'CPU',        82,105, 'g_base'),
    chip('chip_base_c3',    'CPU',        18,185, 'g_base'),
    chip('chip_base_c4',    'CPU',        82,185, 'g_base'),
    chip('chip_base_ep1',   'Eeprom',     18,265, 'g_base'),
    chip('chip_base_ep2',   'Eeprom',     82,265, 'g_base'),

    // Bottom buses
    bus('bus_base2',        'i2cbus_10',  18,358, 'g_base'),
    chip('chip_base_smc1',  'Smc',       180,352, 'g_base'),
    chip('chip_base_smc2',  'Smc',       256,352, 'g_base'),
    // smc1 x:180→232, smc2 x:256→308 < 330 ✓; bus left column x:18→98 no overlap ✓
    bus('bus_base3',        'i2cbus_11',  18,445, 'g_base'),
    // g_base height 490: 445+22+23=490 ✓

    // ── Base_Fan ── bus + 2 chips ─────────────────────────────────────
    bus('bus_fan',          'i2cbus_f',   20, 28, 'g_fan'),
    chip('chip_fan_cpu',    'CPU',        18, 66, 'g_fan'),
    chip('chip_fan_e',      'Eeprom',    100, 66, 'g_fan'),
    // fan: x:18→70, 100→152 < 175 ✓; h:66+64=130 < 140 ✓

    // ── Base_NF ── bus + 3 chips ──────────────────────────────────────
    bus('bus_nf',           'i2cbus_nf',  20, 28, 'g_nf'),
    chip('chip_nf_c1',      'CPU',        18, 66, 'g_nf'),
    chip('chip_nf_c2',      'CPU',        82, 66, 'g_nf'),
    chip('chip_nf_c3',      'CPU',       146, 66, 'g_nf'),
    // nf: x:146→198 < 210 ✓; h:66+64=130 < 140 ✓

    // ── Riser ── bus + 2 chips ────────────────────────────────────────
    bus('bus_riser',        'i2cbus_r',   20, 28, 'g_riser'),
    chip('chip_riser_cpu',  'CPU',        62, 66, 'g_riser'),
    chip('chip_riser_e',    'Eeprom',    150, 66, 'g_riser'),
    // riser: x:150→202 < 240 ✓; h:66+64=130 < 140 ✓

    // ── FGB ── bus + 2 big chips ──────────────────────────────────────
    bus('bus_fgb',          'i2cbus_fgb', 20, 28, 'g_fgb'),
    big('chip_fgb_1',       'CPU',        74, 58, 'g_fgb'),
    big('chip_fgb_2',       'CPU',       152, 58, 'g_fgb'),
    // fgb: x:152→210 < 250 ✓; h:58+72=130 < 140 ✓
  ];
}

// ── Initial edges ──────────────────────────────────────────────────────
function buildInitialEdges(): Edge[] {
  return [
    // I_0 internal
    E('e_i0_1',  'bus_i0',  'chip_i0_e1',  { sh: 'r', th: 't' }),
    E('e_i0_2',  'bus_i0',  'chip_i0_e2',  { sh: 'r', th: 't' }),

    // SMC internal
    E('e_smc_1', 'bus_smc', 'chip_smc',    { sh: 'r', th: 't' }),

    // I_2 internal
    E('e_i2_1',  'bus_i2',  'chip_i2_e1',  { sh: 'r', th: 't' }),
    E('e_i2_2',  'bus_i2',  'chip_i2_e2',  { sh: 'r', th: 't' }),

    // ── I2C cross-board: left boards → LST_Board ─────────────────────
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
    E('e_lst2_mx', 'bus_lst2', 'mux_lst2',       { color: C.green, sh: 'r', th: 't' }),
    E('e_lst2_c1', 'mux_lst2', 'chip_lst2_lm1',  { color: C.green, sh: 'b0', th: 't' }),
    E('e_lst2_c2', 'mux_lst2', 'chip_lst2_lm2',  { color: C.green, sh: 'b1', th: 't' }),
    E('e_lst2_c3', 'mux_lst2', 'chip_lst2_lm3',  { color: C.green, sh: 'b2', th: 't' }),
    E('e_lst2_c4', 'mux_lst2', 'chip_lst2_lm4',  { color: C.green, sh: 'b3', th: 't' }),

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

    // Cross-board: LST → Base (I2C purple, SMBus green, numbered)
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

    // Cross: Base → Base_Fan / Base_NF
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

// ── Auto-layout ────────────────────────────────────────────────────────
// Layout rules:
//   • Each board: label area reserved at top, then bus → mux → chips stacked vertically
//   • Mux spans exactly the chip row width; handles align over each chip center
//   • Board auto-resizes to tightly fit all content + uniform padding on all sides
function computeAutoLayout(nodes: Node[], edges: Edge[]): Node[] {
  const edgeMap = new Map<string, string[]>();
  for (const e of edges) {
    if (!edgeMap.has(e.source)) edgeMap.set(e.source, []);
    edgeMap.get(e.source)!.push(e.target);
  }

  // Group non-group direct-children by their parentId (board)
  const byBoard = new Map<string, Node[]>();
  for (const n of nodes) {
    if (n.type === 'group') continue;
    const pid = n.parentId ?? '__root__';
    if (!byBoard.has(pid)) byBoard.set(pid, []);
    byBoard.get(pid)!.push(n);
  }

  const nodeUpdates = new Map<string, Partial<Node>>();

  // ── Constants ──────────────────────────────────────────────────────────
  const CHIP_W = 48, CHIP_H = 48;
  const BIG_W  = 48, BIG_H  = 48;
  const MUX_H  = 48, BUS_H  = 22;
  const PAD       = 40;   // uniform board padding (all sides)
  const LABEL_H   = 24;   // space reserved for board title label at top
  const H_GAP     = 14;   // horizontal gap between sibling chips
  const V_GAP     = 60;   // vertical gap — enough for bezier fans to spread without crossing
  const BUS_MUX_V = 12;   // extra gap between bus and mux rows
  const COLS      = 8;    // max chips per row

  for (const [boardId, boardNodes] of byBoard) {
    const boardNode = nodes.find((n) => n.id === boardId);

    // Skip sub-group boards (e.g. g_mcu inside g_base) — they keep their
    // manually-set internal layout; only include them in the parent's bounds.
    if (boardNode?.parentId) continue;

    const buses  = boardNodes.filter((n) => n.type === 'bus' || n.type === 'smbus');
    const muxes  = boardNodes.filter((n) => n.type === 'mux');
    const chips  = boardNodes.filter((n) => n.type === 'chip' || n.type === 'bigchip');

    const placed = new Set<string>();
    // ── Content starts below the label area ────────────────────────────
    let currentY = PAD + LABEL_H;

    // Track bounding box of all placed content (for board auto-sizing)
    let maxRight  = 0;
    let maxBottom = 0;
    const track = (x: number, y: number, w: number, h: number) => {
      maxRight  = Math.max(maxRight,  x + w);
      maxBottom = Math.max(maxBottom, y + h);
    };

    // ── Also include existing sub-group nodes in board bounds ───────────
    // (e.g. g_mcu inside g_base — their positions are not touched by this pass)
    for (const n of nodes) {
      if (n.type !== 'group' || n.parentId !== boardId) continue;
      const nw = (n.style?.width  as number) ?? 100;
      const nh = (n.style?.height as number) ?? 60;
      track(n.position.x, n.position.y, nw, nh);
    }

    for (const bus of buses) {
      const busChildren = edgeMap.get(bus.id) ?? [];
      const connectedMux = muxes.find((m) => busChildren.includes(m.id) && !placed.has(m.id));
      const muxChildren  = connectedMux ? (edgeMap.get(connectedMux.id) ?? []) : [];

      const rowChips = chips.filter(
        (c) => (busChildren.includes(c.id) || muxChildren.includes(c.id)) && !placed.has(c.id),
      );

      const hasBig = rowChips.some((c) => c.type === 'bigchip');
      const cw = hasBig ? BIG_W : CHIP_W;
      const ch = hasBig ? BIG_H : CHIP_H;

      // Split chips into rows of COLS
      const chipRows: Node[][] = [];
      for (let i = 0; i < rowChips.length; i += COLS) chipRows.push(rowChips.slice(i, i + COLS));
      if (chipRows.length === 0) chipRows.push([]);

      const maxRowLen = Math.max(1, ...chipRows.map((r) => r.length));
      // Width of the widest chip row = mux width
      const chipsW = maxRowLen * cw + Math.max(0, maxRowLen - 1) * H_GAP;
      // Chips start at left pad; board will be sized to fit
      const chipsX0 = PAD;

      // ── Bus: left-aligned, own row ────────────────────────────────────
      nodeUpdates.set(bus.id, { position: { x: PAD, y: currentY } });
      placed.add(bus.id);
      const busW = (bus.data as { nodeWidth?: number }).nodeWidth ?? 80;
      track(PAD, currentY, busW, BUS_H);

      // ── Mux: 48×48 centered over chip row ───────────────────────────
      const muxY = currentY + BUS_H + BUS_MUX_V;
      if (connectedMux) {
        const handleCount = chipRows[0]?.length ?? 4;
        const muxX = chipsX0 + Math.max(0, chipsW / 2 - MUX_H / 2);
        nodeUpdates.set(connectedMux.id, {
          position: { x: muxX, y: muxY },
          style: { ...(connectedMux.style ?? {}), width: MUX_H, height: MUX_H },
          data: { ...(connectedMux.data as object), handleCount },
        });
        placed.add(connectedMux.id);
        track(muxX, muxY, MUX_H, MUX_H);
      }

      // ── Chips: stacked rows below mux ────────────────────────────────
      const afterMuxY = connectedMux ? muxY + MUX_H : currentY + BUS_H;
      let chipsY = afterMuxY + V_GAP;
      for (const row of chipRows) {
        if (row.length === 0) continue;
        const rowCH = row.some((c) => c.type === 'bigchip') ? BIG_H : CHIP_H;
        row.forEach((chip, i) => {
          const cx = chipsX0 + i * (cw + H_GAP);
          nodeUpdates.set(chip.id, { position: { x: cx, y: chipsY } });
          placed.add(chip.id);
          track(cx, chipsY, cw, ch);
        });
        chipsY += rowCH + V_GAP;
      }
      currentY = chipsY;
    }

    // ── Remaining unplaced nodes (isolated buses, chips not in a mux tree) ──
    let rx = PAD;
    for (const n of boardNodes) {
      if (placed.has(n.id)) continue;
      const nw = n.type === 'mux' ? 72 : n.type === 'bigchip' ? BIG_W : CHIP_W;
      const nh = n.type === 'mux' ? MUX_H : n.type === 'bigchip' ? BIG_H
               : (n.type === 'chip' ? CHIP_H : BUS_H);
      nodeUpdates.set(n.id, { position: { x: rx, y: currentY } });
      track(rx, currentY, nw, nh);
      rx += nw + H_GAP;
    }

    // ── Auto-resize the board to exactly fit all content ─────────────────
    if (boardNode) {
      nodeUpdates.set(boardId, {
        style: {
          ...(boardNode.style ?? {}),
          width:  maxRight  + PAD,
          height: maxBottom + PAD,
        },
      });
    }
  }

  return nodes.map((n) => {
    const upd = nodeUpdates.get(n.id);
    return upd ? { ...n, ...upd } : n;
  });
}

// ── ELK board layout ───────────────────────────────────────────────────
async function runBoardLayout(nodes: Node[], edges: Edge[]): Promise<Node[]> {
  // Find board (group) nodes at root level (no parentId)
  const boards = nodes.filter(n => n.type === 'group' && !n.parentId);

  // For cross-board edges: find which board each endpoint belongs to
  const nodeBoard = new Map<string, string>(); // nodeId -> boardId
  for (const n of nodes) {
    if (n.parentId) nodeBoard.set(n.id, n.parentId);
  }

  // Deduplicate board-to-board edges
  const boardEdges = new Map<string, { source: string; target: string }>();
  for (const e of edges) {
    const sb = nodeBoard.get(e.source);
    const tb = nodeBoard.get(e.target);
    if (sb && tb && sb !== tb) {
      const key = `${sb}->${tb}`;
      if (!boardEdges.has(key)) boardEdges.set(key, { source: sb, target: tb });
    }
  }

  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '80',
      'elk.layered.spacing.nodeNodeBetweenLayers': '60',
      'elk.edgeRouting': 'ORTHOGONAL',
    },
    children: boards.map(b => ({
      id: b.id,
      width: (b.style?.width as number) ?? 200,
      height: (b.style?.height as number) ?? 150,
    })),
    edges: Array.from(boardEdges.entries()).map(([key, e]) => ({
      id: `board_edge_${key}`,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  // @ts-ignore
  const elk = new ELK();
  const result = await elk.layout(elkGraph);

  const posMap = new Map<string, { x: number; y: number }>();
  for (const child of (result.children ?? [])) {
    posMap.set(child.id, { x: child.x ?? 0, y: child.y ?? 0 });
  }

  return nodes.map(n => {
    const pos = posMap.get(n.id);
    if (!pos) return n;
    return { ...n, position: pos };
  });
}

// ── Combined auto-layout (inner + board-level ELK) ─────────────────────
async function runAutoLayout(nodes: Node[], edges: Edge[], lockedIds: Set<string>): Promise<Node[]> {
  // Step 1: inner layout (custom, mux-aware)
  const afterInner = computeAutoLayout(nodes, edges);

  // Step 2: board positioning with ELK (skip locked boards)
  const withUnlockedBoards = afterInner.map(n =>
    (n.type === 'group' && !n.parentId && lockedIds.has(n.id))
      ? nodes.find(orig => orig.id === n.id) ?? n  // restore locked board's original position
      : n
  );

  const afterBoardLayout = await runBoardLayout(withUnlockedBoards, edges);

  // Restore locked board positions
  return afterBoardLayout.map(n => {
    if (n.type === 'group' && !n.parentId && lockedIds.has(n.id)) {
      const orig = nodes.find(o => o.id === n.id);
      return orig ? { ...n, position: orig.position } : n;
    }
    return n;
  });
}

// ── PropertyPanel ─────────────────────────────────────────────────────
interface PropertyPanelProps {
  node: Node | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function PropertyPanel({ node, onClose, onDelete }: PropertyPanelProps) {
  if (!node) return null;
  const d = node.data as Record<string, unknown>;
  const typeLabel: Record<string, string> = {
    group: '板卡容器', bus: 'I2C 总线', smbus: 'SMBus', mux: 'Pca9545 复用器',
    chip: '芯片', bigchip: '芯片（大）',
  };

  return (
    <div
      style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 240,
        background: 'var(--panel-bg-strong)', borderLeft: '1px solid var(--panel-border)',
        zIndex: 200, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.4)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '1px solid var(--panel-border)',
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>
          节点属性
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'transparent', border: 'none', color: 'var(--text-dim)',
            cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '2px 4px',
          }}
        >✕</button>
      </div>

      <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
        {[
          ['节点 ID', node.id],
          ['类型', typeLabel[node.type ?? ''] ?? node.type ?? '—'],
          ['名称 / 标签', String(d.label ?? d.chipType ?? '—')],
          ['所属板卡', String(node.parentId ?? '（顶层）')],
          ['位置 X', String(Math.round(node.position.x))],
          ['位置 Y', String(Math.round(node.position.y))],
        ].map(([k, v]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 3 }}>{k}</div>
            <div style={{
              fontSize: 12, color: 'var(--text-sub)',
              background: 'var(--surface-subtle)', borderRadius: 4,
              padding: '5px 8px', wordBreak: 'break-all',
            }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--panel-border)',
      }}>
        <button
          onClick={() => { onDelete(node.id); onClose(); }}
          style={{
            width: '100%', height: 30, borderRadius: 6,
            border: '1px solid rgba(220,60,60,0.4)',
            background: 'rgba(220,60,60,0.12)', color: '#f87171',
            fontSize: 12, cursor: 'pointer',
          }}
        >删除节点</button>
      </div>
    </div>
  );
}

// ── ContextMenu ───────────────────────────────────────────────────────
interface ContextMenuState { x: number; y: number; nodeId: string }
interface ContextMenuProps {
  menu: ContextMenuState | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onShowPanel: (id: string) => void;
}

function ContextMenu({ menu, onClose, onDelete, onShowPanel }: ContextMenuProps) {
  useEffect(() => {
    if (!menu) return;
    const handler = () => onClose();
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menu, onClose]);

  if (!menu) return null;

  const items = [
    { label: '编辑属性', action: () => { onShowPanel(menu.nodeId); onClose(); } },
    { label: '删除节点', action: () => { onDelete(menu.nodeId); onClose(); }, danger: true },
    { label: '复制节点', action: () => onClose() },
  ];

  return (
    <div
      style={{
        position: 'fixed', top: menu.y, left: menu.x, zIndex: 9999,
        background: 'var(--panel-bg-strong)', border: '1px solid var(--panel-border-strong)',
        borderRadius: 8, padding: 4, minWidth: 140,
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          style={{
            display: 'block', width: '100%', padding: '7px 12px',
            background: 'transparent', border: 'none', borderRadius: 6,
            color: item.danger ? '#f87171' : 'var(--text-sub)',
            fontSize: 13, textAlign: 'left', cursor: 'pointer',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-base)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ── Palette item ──────────────────────────────────────────────────────
function PaletteItem({ type, label, color, collapsed }: { type: string; label: string; color: string; collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div
        draggable
        onDragStart={(e) => e.dataTransfer.setData('node-type', type)}
        title={label}
        style={{
          width: 28, height: 28, borderRadius: 6, cursor: 'grab', marginBottom: 4,
          alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--surface-border-subtle)',
          background: 'var(--surface-subtle)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-base)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-subtle)'; }}
      >
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
      </div>
    );
  }
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('node-type', type)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        borderRadius: 6, cursor: 'grab', border: '1px solid var(--surface-border-subtle)',
        background: 'var(--surface-subtle)', marginBottom: 6,
        color: 'var(--text-sub)', fontSize: 12,
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-base)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-subtle)'; }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {label}
    </div>
  );
}

// ── Edit overlay ──────────────────────────────────────────────────────
interface EditingNode { id: string; x: number; y: number; value: string }

// ── Inner component (needs ReactFlow context) ─────────────────────────
function TaishanInner() {
  const theme = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(buildInitialNodes());
  const [edges, , onEdgesChange] = useEdgesState(buildInitialEdges());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [layoutReady, setLayoutReady] = useState(false);
  const [lockedNodes, setLockedNodes] = useState<Set<string>>(new Set());
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<EditingNode | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const { getViewport, fitView } = useReactFlow();

  // ── Initial layout on mount ──────────────────────────────────────────
  useEffect(() => {
    runAutoLayout(buildInitialNodes(), buildInitialEdges(), new Set())
      .then(laidOut => {
        setNodes(laidOut);
        setLayoutReady(true);
        setTimeout(() => fitView({ padding: 0.08 }), 50);
      })
      .catch(() => {
        // Fallback: use sync inner layout only
        setNodes(computeAutoLayout(buildInitialNodes(), buildInitialEdges()));
        setLayoutReady(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Focus edit input when editingNode is set ─────────────────────────
  useEffect(() => {
    if (editingNode) {
      setTimeout(() => editInputRef.current?.focus(), 0);
    }
  }, [editingNode]);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);

    // Track locked nodes: any node that was manually dragged
    setLockedNodes(prev => {
      const next = new Set(prev);
      for (const c of changes) {
        if (c.type === 'position' && (c as NodeChange & { dragging?: boolean }).dragging === false) {
          next.add(c.id);
        }
      }
      return next;
    });

    setSelectedNode((prev) => {
      if (!prev) return prev;
      const posChange = changes.find(
        (c) => c.type === 'position' && c.id === prev.id && (c as { position?: { x: number; y: number } }).position,
      ) as (NodeChange & { position?: { x: number; y: number } }) | undefined;
      if (posChange?.position) return { ...prev, position: posChange.position };
      return prev;
    });
  }, [onNodesChange]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setContextMenu(null);
  }, []);

  const handleNodeContextMenu = useCallback((e: React.MouseEvent, node: Node) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId: node.id });
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setContextMenu(null);
    setEditingNode(null);
  }, []);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setSelectedNode((prev) => (prev?.id === nodeId ? null : prev));
    setContextMenu(null);
  }, [setNodes]);

  const handleShowPanel = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const found = nds.find((n) => n.id === nodeId);
      if (found) setSelectedNode(found);
      return nds;
    });
  }, [setNodes]);

  // ── Double-click to edit label ────────────────────────────────────────
  const handleNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    const d = node.data as Record<string, unknown>;
    const value = String(d.label ?? d.chipType ?? '');
    // positionAbsolute is available on the node during render; use position as fallback
    const pos = (node as Node & { positionAbsolute?: { x: number; y: number } }).positionAbsolute ?? node.position;
    setEditingNode({ id: node.id, x: pos.x, y: pos.y, value });
  }, []);

  const commitEdit = useCallback(() => {
    if (!editingNode) return;
    setNodes(nds => nds.map(n => {
      if (n.id !== editingNode.id) return n;
      const d = n.data as Record<string, unknown>;
      if ('chipType' in d) {
        return { ...n, data: { ...d, chipType: editingNode.value } };
      }
      return { ...n, data: { ...d, label: editingNode.value } };
    }));
    setEditingNode(null);
  }, [editingNode, setNodes]);

  // ── Auto-layout handlers ─────────────────────────────────────────────
  const handleAutoLayout = useCallback(() => {
    setLayoutReady(false);
    setNodes(nds => {
      const currentEdges = edges;
      runAutoLayout(nds, currentEdges, new Set())
        .then(laidOut => {
          setNodes(laidOut);
          setLayoutReady(true);
          setTimeout(() => fitView({ padding: 0.08 }), 50);
        })
        .catch(() => {
          setNodes(computeAutoLayout(nds, currentEdges));
          setLayoutReady(true);
        });
      return nds; // return unchanged while async runs
    });
  }, [edges, setNodes, fitView]);

  const handleClearLocked = useCallback(() => {
    setLockedNodes(new Set());
    setLayoutReady(false);
    setNodes(nds => {
      const currentEdges = edges;
      runAutoLayout(nds, currentEdges, new Set())
        .then(laidOut => {
          setNodes(laidOut);
          setLayoutReady(true);
          setTimeout(() => fitView({ padding: 0.08 }), 50);
        })
        .catch(() => {
          setNodes(computeAutoLayout(nds, currentEdges));
          setLayoutReady(true);
        });
      return nds;
    });
  }, [edges, setNodes, fitView]);

  const handleReLayout = useCallback(() => {
    setLayoutReady(false);
    setNodes(nds => {
      const currentEdges = edges;
      const locked = lockedNodes;
      runAutoLayout(nds, currentEdges, locked)
        .then(laidOut => {
          setNodes(laidOut);
          setLayoutReady(true);
          setTimeout(() => fitView({ padding: 0.08 }), 50);
        })
        .catch(() => {
          setNodes(computeAutoLayout(nds, currentEdges));
          setLayoutReady(true);
        });
      return nds;
    });
  }, [edges, setNodes, fitView, lockedNodes]);

  // ── Export handlers ──────────────────────────────────────────────────
  const handleExportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'topology.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleExportSVG = useCallback(() => {
    const rfEl = document.querySelector('.react-flow');
    if (!rfEl) return;
    const serializer = new XMLSerializer();
    const svgContent = serializer.serializeToString(rfEl);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'topology.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // ── Drag-and-drop from palette ────────────────────────────────────────
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('node-type');
    if (!type) return;

    const reactFlowBounds = e.currentTarget.getBoundingClientRect();
    const { x, y, zoom } = getViewport();
    const position = {
      x: (e.clientX - reactFlowBounds.left - x) / zoom,
      y: (e.clientY - reactFlowBounds.top - y) / zoom,
    };

    const id = `new_${type}_${Date.now()}`;
    let newNode: Node;

    if (type === 'bus') {
      newNode = { id, type: 'bus', position, data: { label: 'i2cbus_new' }, selectable: true, draggable: true };
    } else if (type === 'smbus') {
      newNode = { id, type: 'smbus', position, data: { label: 'smbus_new' }, selectable: true, draggable: true };
    } else if (type === 'mux') {
      newNode = { id, type: 'mux', position, data: { label: 'Pca9545' }, style: { width: 48, height: 48 }, selectable: true, draggable: true };
    } else if (type === 'board') {
      newNode = { id, type: 'group', position, data: { label: 'New_Board' }, style: { width: 200, height: 150 }, selectable: false, draggable: true };
    } else {
      // chip types: Eeprom, CPU, Lm75, Smc
      newNode = { id, type: 'chip', position, data: { chipType: type }, selectable: true, draggable: true };
    }

    setNodes(nds => nds.concat(newNode));
  }, [getViewport, setNodes]);

  // ── Compute edit overlay position from viewport ───────────────────────
  const getEditOverlayStyle = (): React.CSSProperties => {
    if (!editingNode) return {};
    const { x: vx, y: vy, zoom } = getViewport();
    return {
      position: 'absolute',
      left: editingNode.x * zoom + vx,
      top: editingNode.y * zoom + vy,
      zIndex: 1000,
    };
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
      {/* ── Left panel ──────────────────────────────────────────────── */}
      <div style={{
        width: panelOpen ? 200 : 36, flexShrink: 0,
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid var(--panel-border)',
        padding: panelOpen ? 12 : '8px 4px',
        overflowY: panelOpen ? 'auto' : 'hidden',
        overflowX: 'hidden',
        zIndex: 50, transition: 'width 0.2s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Toggle button */}
        <button onClick={() => setPanelOpen(v => !v)} style={{
          alignSelf: panelOpen ? 'flex-end' : 'center',
          width: 24, height: 24, borderRadius: 4, border: '1px solid var(--panel-border-strong)',
          background: 'var(--surface-base)', color: 'var(--text-sub)',
          cursor: 'pointer', fontSize: 12, lineHeight: 1, marginBottom: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {panelOpen ? '←' : '☰'}
        </button>
        {panelOpen && <><div style={{
          fontSize: 11, fontWeight: 600, color: 'var(--text-dim)',
          letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase',
        }}>
          图元面板
        </div>
        <PaletteItem type="bus"    label="I2C Bus"  color={C.pink}   />
        <PaletteItem type="smbus"  label="SMBus"    color={C.green}  />
        <PaletteItem type="mux"    label="Pca9545"  color={C.purple} />
        <PaletteItem type="Eeprom" label="Eeprom"   color={C.chipColor.Eeprom} />
        <PaletteItem type="CPU"    label="CPU"      color={C.chipColor.CPU}    />
        <PaletteItem type="Lm75"   label="Lm75"     color={C.chipColor.Lm75}   />
        <PaletteItem type="Smc"    label="Smc"      color={C.chipColor.Smc}    />
        <PaletteItem type="board"  label="Board"    color="var(--text-dim)" />

        {lockedNodes.size > 0 && (
          <div style={{
            marginTop: 16, padding: '6px 10px', borderRadius: 6,
            background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
            fontSize: 11, color: 'rgba(251,191,36,0.75)',
          }}>
            {lockedNodes.size} 个节点已锁定
          </div>
        )}

        {/* Action buttons */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)',
            letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' }}>
            操作
          </div>
          {[
            { label: '自动布局', onClick: handleAutoLayout, primary: true },
            { label: '重新布局', onClick: handleReLayout },
            { label: '清除锁定', onClick: handleClearLocked },
            { label: '导出 JSON', onClick: handleExportJSON },
            { label: '导出 SVG',  onClick: handleExportSVG },
          ].map(({ label, onClick, primary }) => (
            <button key={label} onClick={onClick} style={{
              display: 'block', width: '100%', height: 30, marginBottom: 6,
              borderRadius: 6, border: primary ? '1px solid rgba(120,150,255,0.4)' : '1px solid rgba(255,255,255,0.10)',
              background: primary ? 'rgba(79,110,247,0.8)' : 'rgba(255,255,255,0.04)',
              color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              transition: 'background 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = primary ? 'rgba(99,130,255,0.9)' : 'rgba(255,255,255,0.09)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = primary ? 'rgba(79,110,247,0.8)' : 'rgba(255,255,255,0.04)'; }}
            >
              {label}
            </button>
          ))}
        </div>
        </>}
      </div>

      {/* ── Canvas area ──────────────────────────────────────────────── */}
      <div
        style={{ flex: 1, position: 'relative' }}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Loading overlay */}
        {!layoutReady && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: theme === 'light' ? 'rgba(240,240,235,0.75)' : 'rgba(15,15,23,0.7)', zIndex: 999,
          }}>
            <span style={{ color: 'var(--text-sub)', fontSize: 14 }}>布局计算中...</span>
          </div>
        )}

<style>{`
          .react-flow__node:focus,
          .react-flow__node:focus-visible { outline: none !important; }
          .react-flow__node.selected > div { outline: none !important; }
          .react-flow__node-group {
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
            background: transparent !important;
          }
        `}</style>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onNodeContextMenu={handleNodeContextMenu}
          onPaneClick={handlePaneClick}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          nodesDraggable
          nodesConnectable={true}
          connectOnClick={false}
          elementsSelectable
          panOnDrag
          minZoom={0.1}
          maxZoom={2.5}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          {theme === 'light' ? (
            <Background
              variant={BackgroundVariant.Lines}
              color="rgba(0,0,0,0.06)"
              gap={24}
              lineWidth={0.5}
            />
          ) : (
            <Background variant={BackgroundVariant.Dots} color="#2a2a3a" gap={20} size={1.2} />
          )}
          <Controls />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'bus')   return C.pink;
              if (n.type === 'smbus') return C.green;
              if (n.type === 'mux')   return C.purple;
              if (n.type === 'chip' || n.type === 'bigchip') return theme === 'light' ? '#b0b0c4' : '#3a3a5a';
              return 'transparent';
            }}
            maskColor={theme === 'light' ? 'rgba(200,198,194,0.55)' : 'rgba(8,8,18,0.65)'}
            style={{
              background: theme === 'light' ? '#f4f3f1' : '#141420',
              border: `1px solid ${theme === 'light' ? '#d0cec8' : '#2e2e4e'}`,
              borderRadius: 8,
            }}
          />
        </ReactFlow>

        {/* Edit overlay */}
        {editingNode && (
          <div style={getEditOverlayStyle()}>
            <input
              ref={editInputRef}
              value={editingNode.value}
              onChange={e => setEditingNode(prev => prev ? { ...prev, value: e.target.value } : null)}
              onBlur={commitEdit}
              onKeyDown={e => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') setEditingNode(null);
              }}
              style={{
                background: 'rgba(26,26,40,0.95)',
                border: '1px solid rgba(79,110,247,0.7)',
                borderRadius: 4, color: '#fff', fontSize: 12,
                padding: '3px 8px', outline: 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                minWidth: 100,
              }}
            />
          </div>
        )}
      </div>

      {/* Property panel (outside canvas, absolute to outer container) */}
      <PropertyPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onDelete={handleDeleteNode}
      />
      <ContextMenu
        menu={contextMenu}
        onClose={() => setContextMenu(null)}
        onDelete={handleDeleteNode}
        onShowPanel={handleShowPanel}
      />
    </div>
  );
}

// ── Main component (wraps with ReactFlowProvider) ─────────────────────
export function TaishanStaticVectorTopologyView() {
  return (
    <div className="flow-wrap" style={{ background: 'var(--canvas-bg)', position: 'relative', width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <TaishanInner />
      </ReactFlowProvider>
    </div>
  );
}
