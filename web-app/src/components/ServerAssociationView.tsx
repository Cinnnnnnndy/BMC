import React, { useState, useMemo } from 'react';
import { SERVER_BOARDS } from '../data/serverBoardsData';
import type { ServerBoard } from '../data/serverBoardsData';

/* ─── colour tokens ─────────────────────────────────────────── */
const TYPE_COLOR: Record<string, string> = {
  PSR: '#a78bfa', EXU: '#60a5fa', BCU: '#34d399',
  CLU: '#fbbf24', IEU: '#fb923c', SEU: '#f472b6', NICCard: '#22d3ee',
};
const HW_COLOR = { chip: '#3b82f6', connector: '#8b5cf6', mux: '#06b6d4' };
const SW_COLOR = { component: '#10b981', event: '#ef4444', sensor: '#f97316', fru: '#84cc16', other: '#6b7280' };

function typeColor(t: string) { return TYPE_COLOR[t] ?? '#888'; }

/* ─── mini graph (overview card) ─────────────────────────────── */
function MiniGraph({ board }: { board: ServerBoard }) {
  const hw = [
    ...board.chips.map(c => ({ id: c.id, cat: 'chip' as const })),
    ...board.connectors.map(c => ({ id: c.id, cat: 'connector' as const })),
    ...board.i2cMuxes.map(c => ({ id: c.id, cat: 'mux' as const })),
  ];
  const sw = [
    ...board.components.map(c => ({ id: c.id, cat: 'component' as const })),
    ...board.events.map(c => ({ id: c.id, cat: 'event' as const })),
    ...board.sensors.map(c => ({ id: c.id, cat: 'sensor' as const })),
    ...board.fruItems.map(c => ({ id: c.id, cat: 'fru' as const })),
  ];

  const maxItems = Math.max(hw.length, sw.length, 4);
  const W = 130, H = Math.min(maxItems * 8 + 8, 120);
  const hwIndex = new Map(hw.map((h, i) => [h.id, i]));
  const swIndex = new Map(sw.map((s, i) => [s.id, i]));
  const yOf = (i: number, total: number) => H / 2 + (i - (total - 1) / 2) * (H / Math.max(total, 1));
  const xHw = 14, xSw = W - 14;

  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      {board.links.map((lk, i) => {
        const hi = hwIndex.get(lk.hwId), si = swIndex.get(lk.swId);
        if (hi === undefined || si === undefined) return null;
        return <line key={`hw${i}`} x1={xHw} y1={yOf(hi, hw.length)} x2={xSw} y2={yOf(si, sw.length)}
          stroke="rgba(255,255,255,0.10)" strokeWidth={0.8} />;
      })}
      {board.swLinks.map((lk, i) => {
        const fi = swIndex.get(lk.fromId), ti = swIndex.get(lk.toId);
        if (fi === undefined || ti === undefined) return null;
        const y1 = yOf(fi, sw.length), y2 = yOf(ti, sw.length);
        const cx = xSw + 10 + Math.abs(fi - ti) * 1.5;
        return <path key={`sw${i}`} d={`M ${xSw} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${xSw} ${y2}`}
          fill="none" stroke="rgba(16,185,129,0.18)" strokeWidth={0.7} strokeDasharray="2,1" />;
      })}
      {hw.map((h, i) => (
        <circle key={h.id} cx={xHw} cy={yOf(i, hw.length)} r={2.5} fill={HW_COLOR[h.cat] ?? '#888'} />
      ))}
      {sw.map((s, i) => (
        <circle key={s.id} cx={xSw} cy={yOf(i, sw.length)} r={2.5} fill={SW_COLOR[s.cat] ?? '#888'} />
      ))}
    </svg>
  );
}

type MapItem = { id: string; cat: string; detail: string };

/* ─── connection map (detail panel visualization) ────────────── */
function ConnectionMap({ board, hwItems, swItems, selId, onSelect }: {
  board: ServerBoard;
  hwItems: MapItem[];
  swItems: MapItem[];
  selId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const hw = hwItems;
  const sw = swItems;

  const ITEM_H = 20;
  const PAD = 12;
  const HW_LABEL_W = 170;
  const SW_LABEL_W = 200;
  const MID_W = 80;
  // Extra right margin for sw↔sw arcs; scales with sw count
  const SW_ARC_W = board.swLinks.length > 0 ? Math.min(8 + sw.length * 1.2, 60) : 0;
  const DOT_R = 4;
  const TOTAL_H = Math.max(hw.length, sw.length) * ITEM_H + PAD * 2;
  const TOTAL_W = HW_LABEL_W + MID_W + SW_LABEL_W + SW_ARC_W;

  const hwX = HW_LABEL_W;
  const swX = HW_LABEL_W + MID_W;

  const hwY = (i: number) => PAD + i * ITEM_H + ITEM_H / 2;
  const swY = (i: number) => PAD + i * ITEM_H + ITEM_H / 2;

  const hwIndex = new Map(hw.map((h, i) => [h.id, i]));
  const swIndex = new Map(sw.map((s, i) => [s.id, i]));

  // Highlight sets based on selection
  const hlHw = new Set<string>();
  const hlSw = new Set<string>();
  const hlSwSw = new Set<string>(); // sw↔sw peers
  if (selId) {
    if (hwIndex.has(selId)) {
      hlHw.add(selId);
      board.links.filter(lk => lk.hwId === selId).forEach(lk => hlSw.add(lk.swId));
    } else if (swIndex.has(selId)) {
      hlSw.add(selId);
      board.links.filter(lk => lk.swId === selId).forEach(lk => hlHw.add(lk.hwId));
      board.swLinks.filter(lk => lk.fromId === selId).forEach(lk => hlSwSw.add(lk.toId));
      board.swLinks.filter(lk => lk.toId === selId).forEach(lk => hlSwSw.add(lk.fromId));
    }
  }

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 340, border: '1px solid #1e1e1e', borderRadius: 6, background: '#0a0a0a' }}>
      <svg width={TOTAL_W} height={TOTAL_H} style={{ display: 'block', minWidth: TOTAL_W }}>
        <defs>
          {/* arrowhead for hw→sw (white, points right toward sw dot) */}
          <marker id="arr-hw" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,1 L7,4 L0,7 Z" fill="rgba(255,255,255,0.35)" />
          </marker>
          <marker id="arr-hw-active" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,1 L7,4 L0,7 Z" fill="rgba(255,255,255,0.85)" />
          </marker>
          {/* arrowhead for sw→sw (green, points toward toId) */}
          <marker id="arr-sw" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,1 L7,4 L0,7 Z" fill="rgba(16,185,129,0.35)" />
          </marker>
          <marker id="arr-sw-active" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,1 L7,4 L0,7 Z" fill="rgba(16,185,129,0.9)" />
          </marker>
        </defs>

        {/* column headers */}
        <text x={hwX - DOT_R - 8} y={10} textAnchor="end" fontSize={9} fill="#2a5f8a" fontWeight={600}>硬件层</text>
        <text x={swX + DOT_R + 8} y={10} textAnchor="start" fontSize={9} fill="#0f5c3a" fontWeight={600}>
          软件层（→白线 hw→sw · →绿弧 fromId→toId）
        </text>

        {/* hw→sw lines: arrow tip stops at sw dot edge (swX - DOT_R - 1) */}
        {board.links.map((lk, i) => {
          const hi = hwIndex.get(lk.hwId), si = swIndex.get(lk.swId);
          if (hi === undefined || si === undefined) return null;
          const active = selId ? (selId === lk.hwId || selId === lk.swId) : false;
          const y1 = hwY(hi), y2 = swY(si);
          const endX = swX - DOT_R - 1;
          const cx = hwX + (endX - hwX) / 2;
          return (
            <path key={`hw${i}`}
              d={`M ${hwX} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${endX} ${y2}`}
              fill="none"
              stroke={active ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.07)'}
              strokeWidth={active ? 1.5 : 0.8}
              markerEnd={active ? 'url(#arr-hw-active)' : 'url(#arr-hw)'}
            />
          );
        })}

        {/* sw→sw arcs: fromId→toId, arrow tip stops at sw dot edge (swX + DOT_R + 1) */}
        {board.swLinks.map((lk, i) => {
          const fi = swIndex.get(lk.fromId), ti = swIndex.get(lk.toId);
          if (fi === undefined || ti === undefined) return null;
          const active = selId ? (selId === lk.fromId || selId === lk.toId) : false;
          const y1 = swY(fi), y2 = swY(ti);
          const startX = swX + DOT_R + 1;
          const bulge = startX + 5 + Math.abs(fi - ti) * 1.8;
          return (
            <path key={`sw${i}`}
              d={`M ${startX} ${y1} C ${bulge} ${y1}, ${bulge} ${y2}, ${startX} ${y2}`}
              fill="none"
              stroke={active ? 'rgba(16,185,129,0.8)' : 'rgba(16,185,129,0.15)'}
              strokeWidth={active ? 1.2 : 0.7}
              strokeDasharray={active ? '0' : '2,2'}
              markerEnd={active ? 'url(#arr-sw-active)' : 'url(#arr-sw)'}
            />
          );
        })}

        {/* hw items */}
        {hw.map((h, i) => {
          const col = HW_COLOR[h.cat] ?? '#888';
          const isSelected = selId === h.id;
          const isLinked = hlHw.has(h.id);
          const dimmed = selId !== null && !isSelected && !isLinked;
          const label = h.id.length > 22 ? h.id.slice(0, 22) + '…' : h.id;
          // category separator: draw a faint line before first item of each cat
          const prevCat = i > 0 ? hw[i - 1].cat : null;
          const showSep = i > 0 && prevCat !== h.cat;
          return (
            <g key={h.id}>
              {showSep && (
                <line x1={2} y1={hwY(i) - ITEM_H / 2} x2={hwX - 2} y2={hwY(i) - ITEM_H / 2}
                  stroke="#1e1e1e" strokeWidth={1} />
              )}
              <g style={{ cursor: 'pointer' }} onClick={() => onSelect(isSelected ? null : h.id)}>
                {(isSelected || isLinked) && (
                  <rect x={2} y={hwY(i) - ITEM_H / 2 + 1} width={HW_LABEL_W - 4} height={ITEM_H - 2}
                    fill={`${col}22`} rx={3} />
                )}
                <text x={hwX - DOT_R - 7} y={hwY(i) + 4}
                  textAnchor="end" fontSize={10} fill={isSelected ? '#fff' : dimmed ? '#333' : '#888'}>
                  {label}
                  {h.detail ? <tspan fontSize={8} fill={dimmed ? '#1e1e1e' : '#444'}>{' ' + h.detail}</tspan> : null}
                </text>
                <circle cx={hwX} cy={hwY(i)} r={isSelected ? DOT_R + 1 : DOT_R}
                  fill={col} opacity={dimmed ? 0.2 : 1} />
              </g>
            </g>
          );
        })}

        {/* sw items */}
        {sw.map((s, i) => {
          const col = SW_COLOR[s.cat] ?? '#888';
          const isSelected = selId === s.id;
          const isHwLinked = hlSw.has(s.id);
          const isSwLinked = hlSwSw.has(s.id);
          const isLinked = isHwLinked || isSwLinked;
          const dimmed = selId !== null && !isSelected && !isLinked;
          const label = s.id.length > 26 ? s.id.slice(0, 26) + '…' : s.id;
          const prevCat = i > 0 ? sw[i - 1].cat : null;
          const showSep = i > 0 && prevCat !== s.cat;
          return (
            <g key={s.id}>
              {showSep && (
                <line x1={swX + 2} y1={swY(i) - ITEM_H / 2} x2={swX + SW_LABEL_W - 2} y2={swY(i) - ITEM_H / 2}
                  stroke="#1e1e1e" strokeWidth={1} />
              )}
              <g style={{ cursor: 'pointer' }} onClick={() => onSelect(isSelected ? null : s.id)}>
                {(isSelected || isLinked) && (
                  <rect x={swX + 2} y={swY(i) - ITEM_H / 2 + 1} width={SW_LABEL_W - 4} height={ITEM_H - 2}
                    fill={isSwLinked && !isHwLinked ? 'rgba(16,185,129,0.12)' : `${col}22`} rx={3} />
                )}
                <circle cx={swX} cy={swY(i)} r={isSelected ? DOT_R + 1 : DOT_R}
                  fill={col} opacity={dimmed ? 0.2 : 1} />
                <text x={swX + DOT_R + 7} y={swY(i) + 4}
                  textAnchor="start" fontSize={10} fill={isSelected ? '#fff' : dimmed ? '#333' : '#888'}>
                  {label}
                  {s.detail ? <tspan fontSize={8} fill={dimmed ? '#1e1e1e' : '#444'}>{' ' + s.detail}</tspan> : null}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── stat badge ─────────────────────────────────────────────── */
function StatBadge({ value, label, color }: { value: number; label: string; color: string }) {
  if (!value) return null;
  return (
    <span style={{ fontSize: 10, color, marginRight: 6 }}>
      <b>{value}</b><span style={{ color: '#555', marginLeft: 2 }}>{label}</span>
    </span>
  );
}

/* ─── board card (overview grid) ─────────────────────────────── */
function BoardCard({ board, selected, connectedUids, onClick }: {
  board: ServerBoard; selected: boolean; connectedUids: Set<string>; onClick: () => void;
}) {
  const hwCount = board.chips.length + board.connectors.length + board.i2cMuxes.length;
  const swCount = board.components.length + board.events.length + board.sensors.length + board.fruItems.length;
  const tc = typeColor(board.unitType);
  const isConnected = connectedUids.has(board.uid);

  return (
    <div onClick={onClick} style={{
      padding: '10px 12px', borderRadius: 8,
      border: `1px solid ${selected ? tc : isConnected ? `${tc}66` : 'rgba(255,255,255,0.07)'}`,
      background: selected ? `${tc}18` : isConnected ? `${tc}08` : 'rgba(255,255,255,0.03)',
      cursor: 'pointer', transition: 'all 0.15s', display: 'flex', gap: 10,
      alignItems: 'flex-start', position: 'relative',
    }}>
      {isConnected && !selected && (
        <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 9, color: tc, opacity: 0.7 }}>⟷ 关联</span>
      )}
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <MiniGraph board={board} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {board.name || board.unitName}
          </span>
          <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: `${tc}22`, color: tc, flexShrink: 0 }}>
            {board.unitType}
          </span>
        </div>
        {board.description && (
          <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {board.description}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <StatBadge value={board.chips.length} label="芯片" color={HW_COLOR.chip} />
          <StatBadge value={board.connectors.length} label="连接器" color={HW_COLOR.connector} />
          <StatBadge value={board.events.length} label="事件" color={SW_COLOR.event} />
          <StatBadge value={board.sensors.length} label="传感器" color={SW_COLOR.sensor} />
        </div>
        <div style={{ fontSize: 9, color: '#374151', marginTop: 2 }}>
          {hwCount} 硬件 · {swCount} 软件 · {board.links.length} hw关联 · {board.swLinks.length} sw关联
          {board.boardLinks.length > 0 && <span style={{ color: tc }}> · {board.boardLinks.length} 板间关联</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── board detail modal (drill-down overlay) ────────────────── */
function BoardDetailModal({ board, onClose }: { board: ServerBoard; onClose: () => void }) {
  const tc = typeColor(board.unitType);
  const [selId, setSelId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'hw-sw' | 'sw-sw' | 'board'>('hw-sw');

  const hwItems = useMemo(() => [
    ...board.chips.map(c => ({ id: c.id, cat: 'chip' as const, detail: c.address ? `0x${c.address.toString(16).toUpperCase()}` : '' })),
    ...board.connectors.map(c => ({ id: c.id, cat: 'connector' as const, detail: c.connType + (c.direction ? ` ${c.direction}` : '') })),
    ...board.i2cMuxes.map(c => ({ id: c.id, cat: 'mux' as const, detail: c.channelId !== undefined ? `ch${c.channelId}` : '' })),
  ], [board]);

  const swItems = useMemo(() => [
    ...board.components.map(c => ({ id: c.id, cat: 'component' as const, detail: c.instance !== undefined ? `inst ${c.instance}` : '' })),
    ...board.events.map(c => ({ id: c.id, cat: 'event' as const, detail: c.eventKeyId ?? '' })),
    ...board.sensors.map(c => ({ id: c.id, cat: 'sensor' as const, detail: c.chip ?? '' })),
    ...board.fruItems.map(c => ({ id: c.id, cat: 'fru' as const, detail: c.fruId !== undefined ? `FRU ${c.fruId}` : '' })),
  ], [board]);

  return (
    <>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200,
      }} />

      {/* side panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(72%, 920px)',
        background: '#0c0c0c', borderLeft: `2px solid ${tc}55`,
        zIndex: 201, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.6)',
      }}>

        {/* ── header ── */}
        <div style={{
          padding: '12px 16px', borderBottom: `1px solid ${tc}33`,
          background: `${tc}0a`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #333', borderRadius: 4,
            color: '#888', cursor: 'pointer', padding: '3px 8px', fontSize: 11,
          }}>← 返回</button>
          <span style={{ fontSize: 14, fontWeight: 700, color: tc }}>{board.name || board.unitName}</span>
          <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: `${tc}22`, color: tc }}>{board.unitType}</span>
          {board.description && <span style={{ fontSize: 11, color: '#555' }}>{board.description}</span>}
          <span style={{ fontSize: 9, color: '#333', marginLeft: 4 }}>{board.uid}</span>
          {selId && (
            <button onClick={() => setSelId(null)} style={{
              marginLeft: 'auto', fontSize: 10, padding: '2px 8px',
              background: '#222', border: '1px solid #444', borderRadius: 3, color: '#aaa', cursor: 'pointer',
            }}>清除选择</button>
          )}
        </div>

        {/* ── sub-tabs ── */}
        <div style={{
          padding: '6px 16px', borderBottom: '1px solid #161616', display: 'flex', gap: 2,
          background: '#0a0a0a', flexShrink: 0,
        }}>
          {([
            ['hw-sw', `硬件↔软件 (${board.links.length})`],
            ['sw-sw', `软件↔软件 (${board.swLinks.length})`],
            ['board', `板卡间 (${board.boardLinks.length})`],
          ] as const).map(([id, label]) => (
            <button key={id} onClick={() => setDetailTab(id)} style={{
              fontSize: 11, padding: '4px 12px', borderRadius: 4, cursor: 'pointer',
              background: detailTab === id ? `${tc}33` : 'transparent',
              border: `1px solid ${detailTab === id ? tc : 'transparent'}`,
              color: detailTab === id ? tc : '#555',
            }}>{label}</button>
          ))}
        </div>

        {/* ── tab content ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px' }}>

          {/* ── hw↔sw tab ── */}
          {detailTab === 'hw-sw' && (
            <div>
              <div style={{ fontSize: 10, color: '#444', marginBottom: 6 }}>
                点击节点高亮关联路径
              </div>
              <ConnectionMap board={board} hwItems={hwItems} swItems={swItems} selId={selId} onSelect={setSelId} />
            </div>
          )}

          {/* ── sw↔sw tab ── */}
          {detailTab === 'sw-sw' && (
            <div>
              {board.swLinks.length === 0 ? (
                <div style={{ fontSize: 11, color: '#333' }}>该板卡无软件层内部关联</div>
              ) : (
                <div>
                  <div style={{ fontSize: 10, color: '#555', marginBottom: 10 }}>
                    软件对象间的引用关系（事件→组件、FRU→FruData 等）
                  </div>
                  {(['Event', 'Fru', 'DftEeprom', 'DftEepromWp', 'Scanner', 'ThresholdSensor'] as const).map(prefix => {
                    const links = board.swLinks.filter(lk => lk.fromId.startsWith(prefix));
                    if (!links.length) return null;
                    const fromCatOf = (id: string) => id.startsWith('Event_') ? 'event' : id.startsWith('Scanner_') ? 'sensor' : 'fru';
                    const toCatOf = (id: string) => id.startsWith('Component_') ? 'component' : id.startsWith('FruData_') ? 'fru' : 'sensor';
                    return (
                      <div key={prefix} style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 9, color: '#444', marginBottom: 5 }}>
                          {prefix === 'Event' ? '事件引用' : prefix === 'Fru' ? 'FRU→FruData' : prefix + ' 引用'} ({links.length})
                        </div>
                        {links.slice(0, 30).map((lk, i) => {
                          const fc = SW_COLOR[fromCatOf(lk.fromId)] ?? '#888';
                          const tc2 = SW_COLOR[toCatOf(lk.toId)] ?? '#888';
                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 6px', marginBottom: 1 }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: fc, flexShrink: 0 }} />
                              <span style={{ fontSize: 10, color: '#aaa', flex: 1 }}>{lk.fromId}</span>
                              <span style={{ fontSize: 9, color: '#10b981' }}>──▶</span>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: tc2, flexShrink: 0 }} />
                              <span style={{ fontSize: 10, color: '#888' }}>{lk.toId}</span>
                            </div>
                          );
                        })}
                        {links.length > 30 && (
                          <div style={{ fontSize: 9, color: '#444', paddingLeft: 12 }}>…还有 {links.length - 30} 条</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── board-level tab ── */}
          {detailTab === 'board' && (
            <div>
              {board.boardLinks.length === 0 ? (
                <div style={{ fontSize: 11, color: '#333' }}>该板卡无跨板关联</div>
              ) : (
                <div>
                  <div style={{ fontSize: 10, color: '#555', marginBottom: 10 }}>
                    本板卡软件对象引用的其他板卡 UID
                  </div>
                  {board.boardLinks.map((bl, i) => {
                    const target = SERVER_BOARDS.find(b => b.uid === bl.targetUid);
                    const tCol = typeColor(target?.unitType ?? '');
                    return (
                      <div key={i} style={{ padding: '8px 12px', borderRadius: 5, border: `1px solid ${tCol}33`, background: `${tCol}08`, marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: `${tCol}22`, color: tCol }}>
                            {target?.unitType ?? '?'}
                          </span>
                          <span style={{ fontSize: 12, color: '#ddd', fontWeight: 600 }}>{target?.name ?? bl.targetUid.slice(0, 12) + '...'}</span>
                        </div>
                        <div style={{ fontSize: 9, color: '#555' }}>经由对象: <span style={{ color: '#888' }}>{bl.viaObj}</span></div>
                        <div style={{ fontSize: 9, color: '#666' }}>{bl.label}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── server summary ─────────────────────────────────────────── */
function ServerSummary({ boards }: { boards: ServerBoard[] }) {
  const totalHw = boards.reduce((s, b) => s + b.chips.length + b.connectors.length + b.i2cMuxes.length, 0);
  const totalSw = boards.reduce((s, b) => s + b.components.length + b.events.length + b.sensors.length + b.fruItems.length, 0);
  const totalHwSw = boards.reduce((s, b) => s + b.links.length, 0);
  const totalSwSw = boards.reduce((s, b) => s + b.swLinks.length, 0);
  const totalBoard = boards.reduce((s, b) => s + b.boardLinks.length, 0);
  const byType = Object.fromEntries(['PSR','EXU','BCU','CLU','NICCard','IEU','SEU'].map(t => [t, boards.filter(b => b.unitType === t).length]));
  return (
    <div style={{ padding: '10px 20px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>服务器软硬件关联网络</span>
      <span style={{ fontSize: 11, color: '#444' }}>|</span>
      <span style={{ fontSize: 11, color: '#888' }}>{boards.length} 板卡</span>
      <span style={{ fontSize: 11, color: '#3b82f6' }}>{totalHw} 硬件</span>
      <span style={{ fontSize: 11, color: '#10b981' }}>{totalSw} 软件</span>
      <span style={{ fontSize: 11, color: '#fff' }}>{totalHwSw} 硬件↔软件</span>
      <span style={{ fontSize: 11, color: '#a78bfa' }}>{totalSwSw} 软件↔软件</span>
      <span style={{ fontSize: 11, color: '#f59e0b' }}>{totalBoard} 板间关联</span>
      <div style={{ display: 'flex', gap: 5, marginLeft: 4, flexWrap: 'wrap' }}>
        {['PSR','EXU','BCU','CLU','NICCard','IEU','SEU'].filter(t => byType[t]).map(t => (
          <span key={t} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: `${typeColor(t)}22`, color: typeColor(t) }}>
            {t}×{byType[t]}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── type groups ────────────────────────────────────────────── */
const TYPE_ORDER = ['PSR', 'EXU', 'BCU', 'CLU', 'NICCard', 'IEU', 'SEU'];
const TYPE_LABEL: Record<string, string> = {
  PSR: '平台服务资源 (PSR)', EXU: '扩展单元 (EXU)', BCU: 'CPU 板 (BCU)',
  CLU: '风扇板 (CLU)', NICCard: '网卡 (NIC)', IEU: 'PCIe 扩展单元 (IEU)',
  SEU: '存储扩展单元 (SEU)',
};

/* ─── main view ──────────────────────────────────────────────── */
export function ServerAssociationView() {
  const [selectedBoard, setSelectedBoard] = useState<ServerBoard | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(TYPE_ORDER));
  const [search, setSearch] = useState('');
  const allTypes = useMemo(() => [...new Set(SERVER_BOARDS.map(b => b.unitType))], []);

  const connectedUids = useMemo(() => {
    if (!selectedBoard) return new Set<string>();
    const result = new Set<string>();
    selectedBoard.boardLinks.forEach(bl => result.add(bl.targetUid));
    SERVER_BOARDS.forEach(b => {
      if (b.boardLinks.some(bl => bl.targetUid === selectedBoard.uid)) result.add(b.uid);
    });
    return result;
  }, [selectedBoard]);

  const filtered = useMemo(() =>
    SERVER_BOARDS.filter(b =>
      activeTypes.has(b.unitType) &&
      (!search || b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()))
    ), [activeTypes, search]);

  const groups = useMemo(() => {
    const g: Record<string, ServerBoard[]> = {};
    for (const t of TYPE_ORDER) {
      const boards = filtered.filter(b => b.unitType === t);
      if (boards.length) g[t] = boards;
    }
    return g;
  }, [filtered]);

  function toggleType(t: string) {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(t)) { if (next.size > 1) next.delete(t); } else next.add(t);
      return next;
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#111', color: '#ccc', fontFamily: 'monospace', overflow: 'hidden' }}>
      <ServerSummary boards={SERVER_BOARDS} />

      {/* filter + search */}
      <div style={{ padding: '6px 16px', borderBottom: '1px solid #181818', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, color: '#555' }}>板卡类型</span>
        {TYPE_ORDER.filter(t => allTypes.includes(t)).map(t => (
          <button key={t} onClick={() => toggleType(t)} style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 3, cursor: 'pointer',
            background: activeTypes.has(t) ? `${typeColor(t)}22` : 'transparent',
            border: `1px solid ${activeTypes.has(t) ? typeColor(t) : '#333'}`,
            color: activeTypes.has(t) ? typeColor(t) : '#444',
          }}>{t}</button>
        ))}
        <div style={{ display: 'flex', gap: 10, marginLeft: 12, fontSize: 9, color: '#444' }}>
          <span>● 蓝=芯片 ● 紫=连接器 ● 红=事件 ● 橙=传感器 ● 绿=组件</span>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索板卡…"
          style={{ marginLeft: 'auto', fontSize: 11, padding: '3px 8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#ccc', outline: 'none', width: 140 }} />
      </div>

      {/* board grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
        {Object.entries(groups).map(([type, boards]) => (
          <div key={type} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 3, height: 14, background: typeColor(type), borderRadius: 2, display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: typeColor(type) }}>{TYPE_LABEL[type] ?? type}</span>
              <span style={{ fontSize: 10, color: '#444' }}>({boards.length})</span>
              <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 8 }}>
              {boards.map(board => (
                <BoardCard
                  key={board.uid}
                  board={board}
                  selected={selectedBoard?.uid === board.uid}
                  connectedUids={connectedUids}
                  onClick={() => setSelectedBoard(board)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* drill-down overlay */}
      {selectedBoard && (
        <BoardDetailModal
          board={selectedBoard}
          onClose={() => setSelectedBoard(null)}
        />
      )}
    </div>
  );
}
