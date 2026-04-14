import React from 'react';
import type { BoardDevice } from '../types';

function deviceMiniKind(name: string, type: BoardDevice['type']): 'smc' | 'pcie' | 'lm75' | 'other' {
  const u = name.toUpperCase();
  if (u.includes('SMC') || type === 'Chip') return 'smc';
  if (u.includes('PCIE') || type === 'Component') return 'pcie';
  if (u.includes('LM75') || type === 'ThresholdSensor') return 'lm75';
  return 'other';
}

function deviceMiniStyle(kind: 'smc' | 'pcie' | 'lm75' | 'other') {
  if (kind === 'smc') return { stroke: '#40a0ff', fill: 'rgba(64,160,255,0.20)' };
  if (kind === 'pcie') return { stroke: '#7c4dff', fill: 'rgba(124,77,255,0.20)' };
  if (kind === 'lm75') return { stroke: '#f48fb1', fill: 'rgba(244,143,177,0.20)' };
  return { stroke: 'rgba(144,164,174,0.9)', fill: 'rgba(144,164,174,0.12)' };
}

function deviceShortName(name: string) {
  // 让方块里更紧凑：例如 "SMC_1"、"LM75_2" 之类
  const s = name.replace(/\s+/g, '');
  return s.length > 8 ? `${s.slice(0, 6)}…` : s;
}

function renderDeviceMiniSlots(devices: BoardDevice[] | undefined, emptyStroke: string) {
  const list = devices ?? [];
  const grouped: Record<'smc' | 'pcie' | 'lm75' | 'other', BoardDevice[]> = { smc: [], pcie: [], lm75: [], other: [] };
  for (const d of list) grouped[deviceMiniKind(d.name, d.type)].push(d);

  const ordered: BoardDevice[] = [...grouped.smc, ...grouped.pcie, ...grouped.lm75, ...grouped.other];
  const shown = ordered.slice(0, 4);

  // BCU 内部“中区”槽位：复用原先 4 个 slot rect 的尺寸/位置
  const slot = (idx: number) => ({
    x: 20 + idx * 27,
    y: 33,
    w: 18,
    h: 10,
  });

  return [0, 1, 2, 3].map((idx) => {
    const s = slot(idx);
    const d = shown[idx];
    if (!d) {
      return <rect key={`slot-empty-${idx}`} x={s.x} y={s.y} width={s.w} height={s.h} fill="var(--taishan-node-fill-muted)" stroke={emptyStroke} strokeWidth="1" />;
    }
    const kind = deviceMiniKind(d.name, d.type);
    const { stroke, fill } = deviceMiniStyle(kind);
    return (
      <g key={`slot-dev-${d.name}-${idx}`}>
        <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="2" fill={fill} stroke={stroke} strokeWidth="1" />
        <text x={s.x + s.w / 2} y={s.y + s.h - 2} textAnchor="middle" fontSize="8" fill="var(--taishan-node-text)">
          {deviceShortName(d.name)}
        </text>
      </g>
    );
  });
}

export function boardShape(kind: string, label: string, code: string, selected: boolean, devices?: BoardDevice[]) {
  const stroke = selected ? 'var(--taishan-node-stroke-selected)' : 'var(--taishan-node-stroke)';
  const textColor = 'var(--taishan-node-text)';
  const commonText = (
    <>
      <text x="70" y="40" textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: textColor }}>
        {label}
      </text>
      <text x="70" y="66" textAnchor="middle" style={{ fontSize: 16, fill: textColor }}>
        {code}
      </text>
    </>
  );

  if (kind === 'Root') {
    return (
      <svg width={140} height={84}>
        <rect x="22" y="14" width="96" height="56" rx="6" fill="var(--taishan-node-fill)" stroke={stroke} strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => <rect key={`l-${i}`} x={14} y={20 + i * 12} width={8} height={4} fill={stroke} />)}
        {[0, 1, 2, 3].map((i) => <rect key={`r-${i}`} x={118} y={20 + i * 12} width={8} height={4} fill={stroke} />)}
        {commonText}
      </svg>
    );
  }
  if (kind === 'BCU') {
    const deviceSlots = renderDeviceMiniSlots(devices, stroke);
    return (
      <svg width={140} height={84}>
        <rect x="6" y="10" width="128" height="64" rx="4" fill="var(--taishan-node-fill)" stroke={stroke} strokeWidth="2" />
        <rect x="14" y="18" width="112" height="8" fill="var(--taishan-node-fill-muted)" stroke={stroke} strokeWidth="1" />
        <rect x="14" y="58" width="112" height="8" fill="var(--taishan-node-fill-muted)" stroke={stroke} strokeWidth="1" />
        {deviceSlots}
        {commonText}
      </svg>
    );
  }
  if (kind === 'EXU' || kind === 'Riser' || kind === 'NIC' || kind === 'SDI') {
    return (
      <svg width={140} height={84}>
        <rect x="8" y="12" width="120" height="60" rx="4" fill="var(--taishan-node-fill)" stroke={stroke} strokeWidth="2" />
        <rect x="128" y="32" width="8" height="20" fill="var(--taishan-node-fill-accent)" stroke={stroke} strokeWidth="1" />
        {[0, 1, 2, 3].map((i) => <rect key={`pin-${i}`} x={129} y={34 + i * 4.5} width={6} height={2.5} fill="var(--taishan-node-fill-accent)" />)}
        {commonText}
      </svg>
    );
  }
  if (kind === 'CLU') {
    return (
      <svg width={140} height={84}>
        <rect x="8" y="10" width="124" height="64" rx="4" fill="var(--taishan-node-fill)" stroke={stroke} strokeWidth="2" />
        <circle cx="34" cy="42" r="9" fill="var(--taishan-node-fill-muted)" stroke={stroke} strokeWidth="1" />
        <circle cx="58" cy="42" r="9" fill="var(--taishan-node-fill-muted)" stroke={stroke} strokeWidth="1" />
        <circle cx="82" cy="42" r="9" fill="var(--taishan-node-fill-muted)" stroke={stroke} strokeWidth="1" />
        <circle cx="106" cy="42" r="9" fill="var(--taishan-node-fill-muted)" stroke={stroke} strokeWidth="1" />
        {commonText}
      </svg>
    );
  }
  if (kind === 'SEU') {
    return (
      <svg width={140} height={84}>
        <rect x="8" y="10" width="124" height="64" rx="4" fill="var(--taishan-node-fill)" stroke={stroke} strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => <rect key={`bay-${i}`} x={18 + i * 27} y={26} width={20} height={20} fill="var(--taishan-node-fill-muted)" stroke={stroke} strokeWidth="1" />)}
        {commonText}
      </svg>
    );
  }
  return (
    <svg width={140} height={84}>
      <rect x="8" y="10" width="124" height="64" rx="4" fill="var(--taishan-node-fill)" stroke={stroke} strokeWidth="2" />
      {commonText}
    </svg>
  );
}

