import React, { useState, useMemo } from 'react';
import { HW_BOARDS, HwBoard, TopoNode } from '../data/hardwareTopologyData';

/* ─────────────────────────────────────────────
   Types & constants
───────────────────────────────────────────── */
const TYPE_ORDER = ['PSR', 'BCU', 'CLU', 'EXU', 'IEU', 'SEU', 'NICCard', 'BMC'];
const TYPE_COLOR: Record<string, string> = {
  PSR: '#7c3aed', BCU: '#0891b2', CLU: '#059669', EXU: '#d97706',
  IEU: '#2563eb', SEU: '#dc2626', NICCard: '#db2777', BMC: '#4b5563',
};
const NODE_COLOR: Record<string, string> = {
  anchor: '#6b7280', hisport: '#0891b2', i2c_bus: '#0284c7', i2c_mux: '#7c3aed',
  eeprom: '#d97706', connector: '#16a34a', smc: '#ec4899', cpld: '#f59e0b',
  chip: '#64748b', jtag: '#94a3b8',
};
const NODE_LABEL: Record<string, string> = {
  anchor: 'Anchor', hisport: 'HiSport', i2c_bus: 'I²C', i2c_mux: 'MUX',
  eeprom: 'EEPROM', connector: 'Slot', smc: 'SMC', cpld: 'CPLD',
  chip: 'Chip', jtag: 'JTAG',
};

/* ─────────────────────────────────────────────
   I2C Tree helpers
───────────────────────────────────────────── */
interface TreeNode {
  node: TopoNode;
  children: TreeNode[];
}

function buildTree(nodes: TopoNode[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  nodes.forEach(n => map.set(n.id, { node: n, children: [] }));
  const roots: TreeNode[] = [];
  nodes.forEach(n => {
    const tn = map.get(n.id)!;
    if (!n.parent) { roots.push(tn); return; }
    const par = map.get(n.parent);
    if (par) par.children.push(tn);
    else roots.push(tn);
  });
  return roots;
}

/* ─────────────────────────────────────────────
   Mini preview chip icons for board card
───────────────────────────────────────────── */
function BoardMiniPreview({ board }: { board: HwBoard }) {
  const chips = board.topoNodes.filter(n =>
    ['smc', 'eeprom', 'chip', 'cpld'].includes(n.type)
  ).slice(0, 8);
  const connectors = board.topoNodes.filter(n => n.type === 'connector').slice(0, 4);
  const ups = board.businessConnectors.filter(b => b.direction === 'Upstream');
  const downs = board.businessConnectors.filter(b => b.direction === 'Downstream');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '6px 0' }}>
      {/* Chips row */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {chips.map(c => (
          <div key={c.id} title={c.id + (c.address != null ? ` (0x${c.address.toString(16).toUpperCase()})` : '')}
            style={{ width: 20, height: 20, borderRadius: 3, background: NODE_COLOR[c.type] ?? '#555', opacity: 0.85 }} />
        ))}
        {connectors.slice(0, 4).map(c => (
          <div key={c.id} title={c.id}
            style={{ width: 20, height: 20, borderRadius: 2, background: NODE_COLOR.connector, border: '1px solid #22c55e', opacity: 0.75 }} />
        ))}
      </div>
      {/* PCIe summary */}
      <div style={{ display: 'flex', gap: 6, fontSize: 10, color: '#888' }}>
        {ups.length > 0 && <span style={{ color: '#60a5fa' }}>↑ {ups.length} UP</span>}
        {downs.length > 0 && <span style={{ color: '#4ade80' }}>↓ {downs.length} DOWN</span>}
        {board.soft.eventCount > 0 && <span style={{ color: '#fbbf24' }}>{board.soft.eventCount}evt</span>}
        {board.soft.sensorCount > 0 && <span style={{ color: '#a78bfa' }}>{board.soft.sensorCount}snsr</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TreeNodeRow – single row in I2C tree
───────────────────────────────────────────── */
function TreeNodeRow({
  tn, depth, showSoft, scannerChips, fruChips, selId, onSel,
}: {
  tn: TreeNode; depth: number; showSoft: boolean;
  scannerChips: Record<string, string[]>; fruChips: Set<string>;
  selId: string | null; onSel: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(true);
  const n = tn.node;
  const color = NODE_COLOR[n.type] ?? '#6b7280';
  const scanners = scannerChips[n.id] ?? [];
  const hasFru = fruChips.has(n.id);
  const isSelected = selId === n.id;
  const hasChildren = tn.children.length > 0;

  const label = n.id
    .replace(/^I2cMux_/, '')
    .replace(/^Connector_/, '')
    .replace(/^Smc_/, '')
    .replace(/^Chip_/, '')
    .replace(/^Eeprom_/, '');

  return (
    <>
      <div
        onClick={() => onSel(isSelected ? null : n.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          paddingLeft: depth * 18 + 6, paddingRight: 8,
          paddingTop: 3, paddingBottom: 3,
          cursor: 'pointer', borderRadius: 4,
          background: isSelected ? '#1e3a5f' : 'transparent',
          borderLeft: isSelected ? '2px solid #60a5fa' : '2px solid transparent',
          marginLeft: 2,
        }}
        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#1a1a2e'; }}
        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        {/* Expand/collapse for nodes with children */}
        <span
          onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
          style={{ width: 14, fontSize: 10, color: '#666', cursor: hasChildren ? 'pointer' : 'default', userSelect: 'none' }}
        >
          {hasChildren ? (open ? '▾' : '▸') : ''}
        </span>
        {/* Type badge */}
        <span style={{
          fontSize: 9, padding: '1px 4px', borderRadius: 3,
          background: color + '33', color, border: `1px solid ${color}55`,
          minWidth: 36, textAlign: 'center', fontFamily: 'monospace',
        }}>
          {NODE_LABEL[n.type] ?? n.type}
        </span>
        {/* Node name */}
        <span style={{ fontSize: 12, color: '#ddd', flex: 1 }}>{label}</span>
        {/* I2C address */}
        {n.address != null && (
          <span style={{ fontSize: 10, color: '#6b7280', fontFamily: 'monospace' }}>
            0x{n.address.toString(16).toUpperCase().padStart(2, '0')}
          </span>
        )}
        {/* Channel */}
        {n.channel != null && (
          <span style={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>ch{n.channel}</span>
        )}
        {/* Software overlay badges */}
        {showSoft && scanners.length > 0 && (
          <span style={{ fontSize: 9, padding: '1px 4px', borderRadius: 10, background: '#16a34a33', color: '#4ade80', border: '1px solid #16a34a55' }}>
            {scanners.length} scan
          </span>
        )}
        {showSoft && hasFru && (
          <span style={{ fontSize: 9, padding: '1px 4px', borderRadius: 10, background: '#d9770633', color: '#fbbf24', border: '1px solid #d9770655' }}>
            FRU
          </span>
        )}
      </div>
      {open && tn.children.map(child => (
        <TreeNodeRow
          key={child.node.id}
          tn={child} depth={depth + 1}
          showSoft={showSoft} scannerChips={scannerChips} fruChips={fruChips}
          selId={selId} onSel={onSel}
        />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   BoardDetailPanel – I2C tree + PCIe connectors
───────────────────────────────────────────── */
function BoardDetailPanel({
  board, showSoft, onClose,
}: {
  board: HwBoard; showSoft: boolean; onClose: () => void;
}) {
  const [selId, setSelId] = useState<string | null>(null);
  const tree = useMemo(() => buildTree(board.topoNodes), [board]);

  const scannerChips = board.soft.scannerChips;
  const fruChips = useMemo(
    () => new Set(board.soft.fruData.map(f => f.chip)),
    [board.soft.fruData]
  );

  const upBCs = board.businessConnectors.filter(bc => bc.direction === 'Upstream');
  const downBCs = board.businessConnectors.filter(bc => bc.direction === 'Downstream');

  const typeColor = TYPE_COLOR[board.type] ?? '#6b7280';
  const selNode = board.topoNodes.find(n => n.id === selId);

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: 'min(65vw, 860px)', background: '#0d1117',
      borderLeft: '1px solid #1e2d3d', display: 'flex', flexDirection: 'column',
      zIndex: 100, boxShadow: '-8px 0 32px #0009',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 16px', borderBottom: '1px solid #1e2d3d',
        display: 'flex', alignItems: 'center', gap: 10, background: '#0a0f1a',
      }}>
        <span style={{
          fontSize: 11, padding: '2px 8px', borderRadius: 4,
          background: typeColor + '22', color: typeColor, border: `1px solid ${typeColor}44`,
        }}>
          {board.type}
        </span>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>{board.name}</span>
        {board.desc && <span style={{ fontSize: 12, color: '#64748b' }}>{board.desc}</span>}
        <div style={{ flex: 1 }} />
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '3px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
        >
          ✕ 关闭
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {/* Left: tree */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 4px' }}>
          {/* Section: I2C topology */}
          <div style={{ padding: '4px 10px 6px', fontSize: 11, color: '#4b6080', fontWeight: 600, letterSpacing: 1 }}>
            I²C 管理拓扑
          </div>
          {tree.map(root => (
            <TreeNodeRow
              key={root.node.id}
              tn={root} depth={0}
              showSoft={showSoft} scannerChips={scannerChips} fruChips={fruChips}
              selId={selId} onSel={setSelId}
            />
          ))}

          {/* Section: PCIe BusinessConnectors */}
          {board.businessConnectors.length > 0 && (
            <>
              <div style={{ padding: '12px 10px 6px', fontSize: 11, color: '#4b6080', fontWeight: 600, letterSpacing: 1, borderTop: '1px solid #1a2030', marginTop: 8 }}>
                PCIe 连接器
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 8px' }}>
                {/* Upstream first */}
                {upBCs.map(bc => (
                  <div key={bc.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 10px', borderRadius: 5,
                    background: '#0a1628', border: '1px solid #1e3a5f',
                  }}>
                    <span style={{ fontSize: 11, color: '#60a5fa', fontFamily: 'monospace', minWidth: 14 }}>↑</span>
                    <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 3, background: '#1e3a5f', color: '#60a5fa' }}>Upstream</span>
                    <span style={{ fontSize: 12, color: '#e2e8f0', flex: 1 }}>{bc.name}</span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>{bc.linkWidth}</span>
                    <span style={{ fontSize: 10, color: '#475569' }}>{bc.connType}</span>
                    <span style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>{bc.maxRate}</span>
                  </div>
                ))}
                {/* Downstream */}
                {downBCs.map(bc => (
                  <div key={bc.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 10px', borderRadius: 5,
                    background: '#0a1a12', border: '1px solid #14532d',
                  }}>
                    <span style={{ fontSize: 11, color: '#4ade80', fontFamily: 'monospace', minWidth: 14 }}>↓</span>
                    <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 3, background: '#14532d', color: '#4ade80' }}>Downstream</span>
                    <span style={{ fontSize: 12, color: '#e2e8f0', flex: 1 }}>{bc.name}</span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>{bc.linkWidth}</span>
                    <span style={{ fontSize: 10, color: '#475569' }}>{bc.connType}</span>
                    {bc.refConnector && (
                      <span style={{ fontSize: 10, color: '#22c55e', fontFamily: 'monospace' }}>{bc.refConnector}</span>
                    )}
                    <span style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>{bc.maxRate}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Software overlay summary */}
          {showSoft && (
            <>
              <div style={{ padding: '12px 10px 6px', fontSize: 11, color: '#4b6080', fontWeight: 600, letterSpacing: 1, borderTop: '1px solid #1a2030', marginTop: 8 }}>
                软件层叠加
              </div>
              <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {board.soft.fruData.length > 0 && (
                  <div style={{ fontSize: 12, color: '#fbbf24' }}>
                    FRU 绑定: {board.soft.fruData.map(f => `${f.id} → ${f.chip}`).join(', ')}
                  </div>
                )}
                {board.soft.components.length > 0 && (
                  <div style={{ fontSize: 12, color: '#a78bfa' }}>
                    组件: {board.soft.components.map(c => c.id.replace('Component_', '')).join(', ')}
                  </div>
                )}
                {Object.keys(scannerChips).length > 0 && (
                  <div style={{ fontSize: 12, color: '#4ade80' }}>
                    Scanner 引用芯片: {Object.entries(scannerChips).map(([chip, scs]) => `${chip}×${scs.length}`).join(', ')}
                  </div>
                )}
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  事件定义: {board.soft.eventCount} 个 &nbsp;|&nbsp; 传感器: {board.soft.sensorCount} 个
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: selected node detail */}
        {selNode && (
          <div style={{
            width: 220, borderLeft: '1px solid #1e2d3d', padding: 14,
            overflowY: 'auto', background: '#080d14',
          }}>
            <div style={{ fontSize: 11, color: '#4b6080', fontWeight: 600, marginBottom: 10 }}>节点详情</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Kv k="ID" v={selNode.id} mono />
              <Kv k="类型" v={NODE_LABEL[selNode.type] ?? selNode.type} />
              {selNode.address != null && (
                <Kv k="I²C 地址" v={`0x${selNode.address.toString(16).toUpperCase()} (${selNode.address})`} mono />
              )}
              {selNode.channel != null && <Kv k="MUX 通道" v={`${selNode.channel}`} mono />}
              {selNode.parent && <Kv k="父节点" v={selNode.parent} mono />}
              {/* Software details */}
              {showSoft && (() => {
                const scs = scannerChips[selNode.id] ?? [];
                const fruBind = board.soft.fruData.filter(f => f.chip === selNode.id);
                return (
                  <>
                    {scs.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, color: '#4ade80', marginBottom: 4 }}>Scanner 引用 ({scs.length})</div>
                        {scs.map(s => <div key={s} style={{ fontSize: 10, color: '#86efac', fontFamily: 'monospace' }}>{s}</div>)}
                      </div>
                    )}
                    {fruBind.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, color: '#fbbf24', marginBottom: 4 }}>FRU 绑定</div>
                        {fruBind.map(f => <div key={f.id} style={{ fontSize: 10, color: '#fde68a', fontFamily: 'monospace' }}>{f.id}</div>)}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Kv({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#4b6080', marginBottom: 2 }}>{k}</div>
      <div style={{ fontSize: 11, color: '#cbd5e1', fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{v}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Board Card
───────────────────────────────────────────── */
function BoardCard({ board, onSelect }: { board: HwBoard; onSelect: () => void }) {
  const typeColor = TYPE_COLOR[board.type] ?? '#6b7280';
  return (
    <div
      onClick={onSelect}
      style={{
        background: '#0d1117', border: '1px solid #1e2d3d', borderRadius: 8,
        padding: '10px 12px', cursor: 'pointer', transition: 'border-color 0.15s',
        minWidth: 180,
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = typeColor + '88'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#1e2d3d'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{
          fontSize: 9, padding: '1px 5px', borderRadius: 3,
          background: typeColor + '22', color: typeColor, border: `1px solid ${typeColor}44`,
        }}>
          {board.type}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{board.name}</span>
      </div>
      {board.desc && (
        <div style={{ fontSize: 10, color: '#475569', marginBottom: 6 }}>{board.desc}</div>
      )}
      <BoardMiniPreview board={board} />
      <div style={{ fontSize: 10, color: '#334155', marginTop: 4, fontFamily: 'monospace' }}>
        {board.topoNodes.length} 节点 · {board.businessConnectors.length} PCIe
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main View
───────────────────────────────────────────── */
export function HardwareTopologyView() {
  const [selected, setSelected] = useState<HwBoard | null>(null);
  const [showSoft, setShowSoft] = useState(false);
  const [filter, setFilter] = useState('');

  const grouped = useMemo(() => {
    const map = new Map<string, HwBoard[]>();
    for (const board of HW_BOARDS) {
      const t = board.type;
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(board);
    }
    return TYPE_ORDER.map(t => ({ type: t, boards: map.get(t) ?? [] })).filter(g => g.boards.length > 0);
  }, []);

  const filtered = useMemo(() => {
    if (!filter.trim()) return grouped;
    const q = filter.toLowerCase();
    return grouped.map(g => ({
      ...g,
      boards: g.boards.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.desc.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q)
      ),
    })).filter(g => g.boards.length > 0);
  }, [grouped, filter]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#070b10' }}>
      {/* Toolbar */}
      <div style={{
        padding: '8px 16px', borderBottom: '1px solid #1e2d3d',
        display: 'flex', alignItems: 'center', gap: 12, background: '#0a0f1a',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>硬件拓扑视图</span>
        <span style={{ fontSize: 11, color: '#334155' }}>{HW_BOARDS.length} 个板卡</span>
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="搜索板卡名称..."
          style={{
            background: '#0d1117', border: '1px solid #1e2d3d', borderRadius: 4,
            padding: '4px 10px', fontSize: 12, color: '#cbd5e1', width: 180,
            outline: 'none',
          }}
        />
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setShowSoft(v => !v)}
          style={{
            padding: '4px 12px', fontSize: 12, borderRadius: 4, cursor: 'pointer',
            background: showSoft ? '#1e3a5f' : 'transparent',
            border: `1px solid ${showSoft ? '#3b82f6' : '#1e2d3d'}`,
            color: showSoft ? '#60a5fa' : '#64748b',
            transition: 'all 0.15s',
          }}
        >
          {showSoft ? '● 软件叠加 ON' : '○ 软件叠加 OFF'}
        </button>
      </div>

      {/* Legend */}
      <div style={{
        padding: '5px 16px', borderBottom: '1px solid #111',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        background: '#080d14', flexShrink: 0,
      }}>
        {Object.entries(NODE_COLOR).slice(0, 7).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#475569' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            {NODE_LABEL[type]}
          </div>
        ))}
        {showSoft && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#4ade80' }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: '#16a34a33', border: '1px solid #4ade80' }} />
              Scanner引用
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#fbbf24' }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: '#d9770633', border: '1px solid #fbbf24' }} />
              FRU绑定
            </div>
          </>
        )}
      </div>

      {/* Board grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {filtered.map(({ type, boards }) => (
          <div key={type} style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            }}>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 4,
                background: (TYPE_COLOR[type] ?? '#666') + '22',
                color: TYPE_COLOR[type] ?? '#888',
                border: `1px solid ${(TYPE_COLOR[type] ?? '#666')}44`,
                fontWeight: 600,
              }}>
                {type}
              </span>
              <span style={{ fontSize: 11, color: '#334155' }}>{boards.length} 个</span>
              <div style={{ flex: 1, height: 1, background: '#1a2030' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {boards.map(board => (
                <BoardCard
                  key={board.uid}
                  board={board}
                  onSelect={() => setSelected(board)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel overlay */}
      {selected && (
        <>
          <div
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed', inset: 0, background: '#0007', zIndex: 99,
            }}
          />
          <BoardDetailPanel
            board={selected}
            showSoft={showSoft}
            onClose={() => setSelected(null)}
          />
        </>
      )}
    </div>
  );
}
