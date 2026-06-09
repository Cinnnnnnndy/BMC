/**
 * CatalogBrowser — hardware model library browser panel
 *
 * Shows all parts in the hardware-library catalog, grouped by category.
 * Supports text search, category filter, and chassis template switching.
 * Click a part to see full specs in the detail pane.
 */
import { useState, useMemo } from 'react';
import {
  ALL_CATALOG_PARTS,
  ALL_CHASSIS_TEMPLATES,
  filterParts,
  findCompatibleSlots,
  partSpecSummary,
  hasPartModel,
  expectedModelFilename,
  MODELS_DIR,
  type CatalogPart,
  type ChassisTemplate,
  type PartCategory,
} from './hardware-library';
import { PartPreview3D } from './PartPreview3D';

// ─── Category metadata ────────────────────────────────────────────────────────

const CATEGORY_META: Record<PartCategory, { icon: string; label: string; labelCN: string; color: string }> = {
  'cpu':                    { icon: '⚡', label: 'CPU',          labelCN: '处理器',     color: '#a78bfa' },
  'memory-module':          { icon: '🧩', label: 'Memory',       labelCN: '内存模块',   color: '#60a5fa' },
  'storage-nvme':           { icon: '💾', label: 'NVMe',         labelCN: 'NVMe 存储',  color: '#fb923c' },
  'storage-ssd':            { icon: '💽', label: 'SSD',          labelCN: 'SATA SSD',   color: '#fbbf24' },
  'storage-hdd':            { icon: '🗄', label: 'HDD',          labelCN: 'HDD 磁盘',   color: '#f97316' },
  'storage-backplane':      { icon: '🔲', label: 'Backplane',    labelCN: '背板',       color: '#94a3b8' },
  'psu':                    { icon: '🔋', label: 'PSU',          labelCN: '电源模块',   color: '#f5c842' },
  'fan-module':             { icon: '🌀', label: 'Fan',          labelCN: '风扇模组',   color: '#22d3ee' },
  'heatsink':               { icon: '❄', label: 'Heatsink',     labelCN: '散热片',     color: '#7dd3fc' },
  'liquid-cooling-block':   { icon: '💧', label: 'Liquid Cool',  labelCN: '水冷',       color: '#38bdf8' },
  'motherboard':            { icon: '🖥', label: 'Motherboard',  labelCN: '主板',       color: '#34d399' },
  'riser-card':             { icon: '↕', label: 'Riser',        labelCN: '转接卡',     color: '#c084fc' },
  'expansion-card':         { icon: '🃏', label: 'PCIe Card',    labelCN: 'PCIe 扩展卡', color: '#818cf8' },
  'gpu':                    { icon: '🎮', label: 'GPU',          labelCN: '图形加速卡', color: '#e879f9' },
  'nic':                    { icon: '🌐', label: 'NIC',          labelCN: '网卡',       color: '#4ade80' },
  'bmc-module':             { icon: '🔐', label: 'BMC',          labelCN: 'BMC 管理卡', color: '#5b9cf6' },
  'chassis-frame':          { icon: '📦', label: 'Chassis',      labelCN: '机箱框架',   color: '#94a3b8' },
  'chassis-rail':           { icon: '⬛', label: 'Rail',         labelCN: '导轨',       color: '#64748b' },
  'io-panel':               { icon: '🔌', label: 'I/O Panel',    labelCN: 'I/O 面板',   color: '#94a3b8' },
  'cable':                  { icon: '🔗', label: 'Cable',        labelCN: '线缆',       color: '#6b7280' },
  'backplane':              { icon: '🔲', label: 'Backplane',    labelCN: '背板',       color: '#94a3b8' },
};

// ─── Part Card ────────────────────────────────────────────────────────────────

function PartCard({
  part,
  isSelected,
  compatibleSlots,
  onClick,
}: {
  part: CatalogPart;
  isSelected: boolean;
  compatibleSlots: number;
  onClick: () => void;
}) {
  const meta = CATEGORY_META[part.category];
  const color = meta?.color ?? '#94a3b8';

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 8,
        border: `1px solid ${isSelected ? color + '55' : 'rgba(255,255,255,0.07)'}`,
        background: isSelected ? `${color}0f` : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.14s',
      }}
    >
      {/* Color swatch */}
      <span style={{
        flexShrink: 0,
        width: 28, height: 28,
        borderRadius: 6,
        background: `${color}20`,
        border: `1px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13,
      }}>
        {meta?.icon}
      </span>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(200,215,255,0.9)', marginBottom: 2, lineHeight: 1.3 }}>
          {part.labelEn}
        </div>
        <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.4)', lineHeight: 1.4 }}>
          {partSpecSummary(part)}
        </div>
      </div>

      {/* Slot badge */}
      {compatibleSlots > 0 && (
        <span style={{
          flexShrink: 0,
          fontSize: 9, fontWeight: 700,
          padding: '2px 5px',
          borderRadius: 4,
          background: `${color}22`,
          color,
          border: `1px solid ${color}44`,
        }}>
          {compatibleSlots} 槽
        </span>
      )}
    </button>
  );
}

// ─── Model swap identifier ────────────────────────────────────────────────────

function ModelSwapPanel({ part }: { part: CatalogPart }) {
  const installed = hasPartModel(part.id);
  const filename = expectedModelFilename(part.id);
  const accent = installed ? '#34d399' : '#fbbf24';

  const copyName = () => { navigator.clipboard?.writeText(filename); };

  return (
    <div style={{
      margin: '8px 14px 0',
      padding: '8px 10px',
      borderRadius: 8,
      background: installed ? 'rgba(52,211,153,0.06)' : 'rgba(251,191,36,0.06)',
      border: `1px solid ${accent}33`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: accent, boxShadow: `0 0 6px ${accent}` }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: accent }}>
          {installed ? '已接入开源模型' : '待接入 — 一键替换'}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 8.5, color: 'rgba(200,215,255,0.3)' }}>
          模型 ID
        </span>
      </div>

      {/* The exact filename to drop in */}
      <button
        onClick={copyName}
        title="点击复制文件名"
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 10,
          color: 'rgba(220,230,255,0.85)',
          background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 5, padding: '4px 7px',
        }}
      >
        {filename} <span style={{ float: 'right', opacity: 0.4 }}>⧉</span>
      </button>

      <div style={{ fontSize: 8.5, color: 'rgba(200,215,255,0.35)', marginTop: 5, lineHeight: 1.5 }}>
        放入 <code style={{ color: 'rgba(200,215,255,0.55)' }}>{MODELS_DIR}/</code>，
        命名为上方文件名即自动加载（无需改代码）。
        {!installed && ' 当前显示为程序化几何占位。'}
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function PartDetail({ part, chassis }: { part: CatalogPart; chassis: ChassisTemplate | null }) {
  const meta = CATEGORY_META[part.category];
  const color = meta?.color ?? '#94a3b8';
  const slots = chassis ? findCompatibleSlots(chassis, part) : [];
  const { width, height, depth } = part.dimensionsMM;

  const row = (label: string, value: string, valueColor?: string) => (
    <div key={label} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 8,
    }}>
      <span style={{ fontSize: 10, color: 'rgba(200,215,255,0.38)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 10, color: valueColor ?? 'rgba(200,215,255,0.82)', fontFamily: 'monospace', textAlign: 'right', wordBreak: 'break-all' }}>
        {value}
      </span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${color}20`, border: `1px solid ${color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>{meta?.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(200,215,255,0.92)' }}>{part.labelEn}</div>
            <div style={{ fontSize: 10, color: 'rgba(200,215,255,0.38)' }}>{part.labelZh}</div>
          </div>
          <span style={{
            marginLeft: 'auto', fontSize: 9, padding: '2px 7px', borderRadius: 999,
            background: `${color}18`, color, border: `1px solid ${color}35`,
          }}>
            {meta?.labelCN}
          </span>
        </div>
      </div>

      {/* 3D preview — exercises the GLB-first / procedural-fallback pipeline */}
      <PartPreview3D part={part} height={200} />

      {/* One-click model swap identifier */}
      <ModelSwapPanel part={part} />

      {/* Specs */}
      <div style={{ padding: '6px 14px' }}>
        {part.vendor && row('制造商', part.vendor)}
        {part.partNumber && row('型号', part.partNumber)}
        {row('尺寸', `${width}×${height}×${depth} mm (W×H×D)`)}
        {part.ratedPowerWatts != null && row('额定功耗', `${part.ratedPowerWatts} W`, '#f5c842')}
        {part.massGrams != null && row('质量', `${part.massGrams} g`)}
        {part.thermal?.tdpWatts && row('TDP', `${part.thermal.tdpWatts} W`, '#ef4444')}
        {part.thermal?.maxJunctionTempC && row('最高结温', `${part.thermal.maxJunctionTempC} °C`)}
        {part.standards.length > 0 && row('标准', part.standards.join(', '))}
      </div>

      {/* Connectors */}
      {part.connectors.length > 0 && (
        <div style={{ padding: '6px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            接口 ({part.connectors.length})
          </div>
          {part.connectors.map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'rgba(200,215,255,0.65)', flex: 1 }}>{c.type}</span>
              <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', fontFamily: 'monospace' }}>{c.face}</span>
            </div>
          ))}
        </div>
      )}

      {/* Compatible slots in current chassis */}
      {chassis && (
        <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            当前机箱可用槽位 ({slots.length})
          </div>
          {slots.length === 0 ? (
            <div style={{ fontSize: 10, color: 'rgba(200,215,255,0.3)' }}>与当前机箱不兼容</div>
          ) : slots.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
              <span style={{ width: 5, height: 5, borderRadius: 1, background: s.highlightColor ?? color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'rgba(200,215,255,0.72)', flex: 1 }}>{s.nameCN}</span>
              {s.hotSwappable && (
                <span style={{ fontSize: 8, color: '#4ade80', border: '1px solid #4ade8040', borderRadius: 3, padding: '1px 4px' }}>热插拔</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ margin: 0, fontSize: 10, color: 'rgba(200,215,255,0.38)', lineHeight: 1.6 }}>
          {part.description}
        </p>
      </div>

      {/* Source reference */}
      {part.sourceReference && (
        <div style={{ padding: '6px 14px 10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.25)', letterSpacing: '0.04em' }}>
            开源参考 · {part.sourceReference.replace('https://', '').split('/').slice(0, 2).join('/')}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main CatalogBrowser ──────────────────────────────────────────────────────

export function CatalogBrowser({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PartCategory | null>(null);
  const [selectedPart, setSelectedPart] = useState<CatalogPart | null>(null);
  const [chassisId, setChassisId] = useState(ALL_CHASSIS_TEMPLATES[0].id);

  const activeChassis = useMemo(
    () => ALL_CHASSIS_TEMPLATES.find((c) => c.id === chassisId) ?? null,
    [chassisId],
  );

  const filteredParts = useMemo(
    () => filterParts({ category: activeCategory, query }),
    [activeCategory, query],
  );

  // All categories that appear in the filtered results (for dynamic filter chips)
  const availableCategories = useMemo(
    () => [...new Set(ALL_CATALOG_PARTS.map((p) => p.category))],
    [],
  );

  return (
    <div style={{
      width: selectedPart ? 560 : 280,
      height: '100%',
      display: 'flex',
      background: '#0d1017',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
    }}>

      {/* ── Left column: search + list ── */}
      <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%', borderRight: selectedPart ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>

        {/* Header */}
        <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>🗂</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(200,215,255,0.92)' }}>硬件模型库</span>
            {onClose && (
              <button onClick={onClose} style={{
                marginLeft: 'auto', padding: '2px 8px', fontSize: 10, borderRadius: 4,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(200,215,255,0.6)', cursor: 'pointer',
              }}>
                ✕
              </button>
            )}
          </div>

          {/* Chassis selector */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              目标机箱模板
            </div>
            <select
              value={chassisId}
              onChange={(e) => setChassisId(e.target.value)}
              style={{
                width: '100%', padding: '5px 8px', fontSize: 10,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6, color: 'rgba(200,215,255,0.82)', outline: 'none', cursor: 'pointer',
              }}
            >
              {ALL_CHASSIS_TEMPLATES.map((c) => (
                <option key={c.id} value={c.id}>{c.nameCN}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索型号、品牌、规格…"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '6px 10px', fontSize: 10, borderRadius: 6,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(200,215,255,0.82)', outline: 'none',
            }}
          />
        </div>

        {/* Category chips */}
        <div style={{
          padding: '6px 10px', display: 'flex', flexWrap: 'wrap', gap: 4,
          borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
        }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              fontSize: 9, padding: '3px 8px', borderRadius: 999, cursor: 'pointer',
              background: activeCategory == null ? 'rgba(255,255,255,0.12)' : 'transparent',
              border: `1px solid ${activeCategory == null ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
              color: activeCategory == null ? 'rgba(200,215,255,0.9)' : 'rgba(200,215,255,0.4)',
            }}
          >
            全部 ({ALL_CATALOG_PARTS.length})
          </button>
          {availableCategories.map((cat) => {
            const m = CATEGORY_META[cat];
            const count = ALL_CATALOG_PARTS.filter((p) => p.category === cat).length;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(active ? null : cat)}
                style={{
                  fontSize: 9, padding: '3px 8px', borderRadius: 999, cursor: 'pointer',
                  background: active ? `${m.color}22` : 'transparent',
                  border: `1px solid ${active ? m.color + '55' : 'rgba(255,255,255,0.08)'}`,
                  color: active ? m.color : 'rgba(200,215,255,0.4)',
                }}
              >
                {m.icon} {m.labelCN} {count}
              </button>
            );
          })}
        </div>

        {/* Part list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filteredParts.length === 0 ? (
            <div style={{ padding: 20, fontSize: 11, color: 'rgba(200,215,255,0.3)', textAlign: 'center' }}>
              未找到匹配的零件
            </div>
          ) : filteredParts.map((part) => {
            const compatCount = activeChassis ? findCompatibleSlots(activeChassis, part).length : 0;
            return (
              <PartCard
                key={part.id}
                part={part}
                isSelected={selectedPart?.id === part.id}
                compatibleSlots={compatCount}
                onClick={() => setSelectedPart(selectedPart?.id === part.id ? null : part)}
              />
            );
          })}
        </div>

        {/* Footer summary */}
        <div style={{
          padding: '6px 14px', borderTop: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0, fontSize: 9, color: 'rgba(200,215,255,0.3)',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>{filteredParts.length} 个零件</span>
          {activeChassis && (
            <span>{activeChassis.slots.length} 个槽位可用</span>
          )}
        </div>
      </div>

      {/* ── Right column: detail pane ── */}
      {selectedPart && (
        <div style={{ flex: 1, overflowY: 'auto', color: 'rgba(200,215,255,0.9)' }}>
          <PartDetail part={selectedPart} chassis={activeChassis} />
        </div>
      )}
    </div>
  );
}
