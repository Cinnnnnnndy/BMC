import { useState } from 'react';
import { useSimStore } from './simStore';
import type { SimSpeed } from './simStore';
import { HARDWARE_COMPONENTS, BUS_REGISTRY, BUS_COLORS } from './serverData';

const STATUS_COLOR = { normal: '#4ade80', warning: '#fbbf24', error: '#f87171' };

// ─── Button primitives ────────────────────────────────────────────────────
const BASE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(200,215,255,0.75)', borderRadius: 5, padding: '3px 10px',
  fontSize: 11, cursor: 'pointer', userSelect: 'none', transition: 'background 0.12s, border-color 0.12s',
  flexShrink: 0,
};
const ICON_BTN: React.CSSProperties = { ...BASE, padding: '3px 7px', minWidth: 26, fontSize: 13 };
const ACTIVE: React.CSSProperties = {
  background: 'rgba(91,156,246,0.18)',
  border: '1px solid rgba(91,156,246,0.45)',
  color: '#5b9cf6',
};
const DIVIDER = (
  <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', flexShrink: 0, margin: '0 2px' }} />
);

// ─── Tool definitions ─────────────────────────────────────────────────────
const TOOLS = [
  { id: 'select',   icon: '□', label: '框选模式' },
  { id: 'add',      icon: '⊕', label: '添加组件' },
  { id: 'toggle3d', icon: '⊡', label: '切换 2D/3D' },
  { id: 'route',    icon: '═', label: '走线模式' },
] as const;

const ACTIONS = [
  { id: 'undo',   icon: '↩', label: '撤销'  },
  { id: 'redo',   icon: '↪', label: '重做'  },
  { id: 'center', icon: '✥', label: '居中视图' },
  { id: 'snap',   icon: '⬡', label: '对齐网格' },
] as const;

const VIEWS = [
  { id: 'screenshot', icon: '□', label: '截图导出' },
  { id: 'record',     icon: '○', label: '录制回放' },
  { id: 'camera',     icon: '👁', label: '视角'    },
  { id: 'focus',      icon: '◎', label: '聚焦选中' },
] as const;

const SPEEDS: SimSpeed[] = [1, 2, 5, 10];

export function SimToolbar() {
  const {
    clearHighlights,
    selectedBusId, selectedId,
    isPlaying, speed, togglePlay, setSpeed,
    history, historyPlayhead, setHistoryPlayhead,
  } = useSimStore();

  const [activeTool, setActiveTool]   = useState<string>('select');
  const [snapEnabled, setSnapEnabled] = useState(false);

  // Dynamic status counts (using statusOverrides)
  const { statusOverrides } = useSimStore();
  const normalCount = HARDWARE_COMPONENTS.filter(c => (statusOverrides[c.id] ?? c.status) === 'normal').length;
  const warnCount   = HARDWARE_COMPONENTS.filter(c => (statusOverrides[c.id] ?? c.status) === 'warning').length;
  const errorCount  = HARDWARE_COMPONENTS.filter(c => (statusOverrides[c.id] ?? c.status) === 'error').length;

  // Selected bus info
  const selBus      = selectedBusId ? BUS_REGISTRY.find(b => b.id === selectedBusId) : null;
  const selBusColor = selBus ? BUS_COLORS[selBus.type] : null;

  function handleCenter() {
    window.dispatchEvent(new CustomEvent('sim:resetCamera'));
    clearHighlights();
  }

  function handleAction(id: string) {
    if (id === 'center') handleCenter();
    if (id === 'snap')   setSnapEnabled(v => !v);
  }

  function handleTool(id: string) {
    setActiveTool(id === activeTool ? 'select' : id);
  }

  const histLen = history.length;
  const playheadVal = historyPlayhead ?? histLen - 1;

  return (
    <div style={{
      flex: 1, background: '#0f1120',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center',
      padding: '0 12px', gap: 6,
      overflow: 'hidden', flexWrap: 'nowrap',
      minHeight: 44,
    }}>
      {/* ── Status chips ─────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {([['正常', normalCount, STATUS_COLOR.normal], ['告警', warnCount, STATUS_COLOR.warning], ['故障', errorCount, STATUS_COLOR.error]] as const).map(([label, count, color]) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color, background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 10, padding: '2px 7px', flexShrink: 0 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
            {label} {count}
          </span>
        ))}
      </div>

      {DIVIDER}

      {/* ── Simulation play/pause + speed ────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          style={{ ...ICON_BTN, ...(isPlaying ? ACTIVE : {}), fontSize: 14, minWidth: 28 }}
          title={isPlaying ? '暂停仿真' : '继续仿真'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        {/* Speed buttons */}
        {SPEEDS.map(s => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            style={{ ...BASE, padding: '3px 7px', fontSize: 10, fontFamily: 'monospace', ...(speed === s ? ACTIVE : {}) }}
            title={`${s}× 倍速`}
          >
            {s}×
          </button>
        ))}
      </div>

      {DIVIDER}

      {/* ── Tool buttons ─────────────────────────────────── */}
      {TOOLS.map(t => (
        <button key={t.id} title={t.label} onClick={() => handleTool(t.id)}
          style={{ ...ICON_BTN, ...(activeTool === t.id ? ACTIVE : {}) }}>
          {t.icon}
        </button>
      ))}

      {DIVIDER}

      {/* ── Action buttons ───────────────────────────────── */}
      {ACTIONS.map(a => (
        <button key={a.id} title={a.label} onClick={() => handleAction(a.id)}
          style={{ ...ICON_BTN, ...(a.id === 'snap' && snapEnabled ? ACTIVE : {}) }}>
          {a.icon}
        </button>
      ))}

      {DIVIDER}

      {/* ── View buttons ─────────────────────────────────── */}
      {VIEWS.map(v => (
        <button key={v.id} title={v.label}
          style={{ ...ICON_BTN, ...(v.id === 'focus' && selectedId ? ACTIVE : {}) }}>
          {v.icon}
        </button>
      ))}

      {/* ── Bus metrics (shown when a bus is selected) ────── */}
      {selBus && selBusColor && (
        <>
          {DIVIDER}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, flexShrink: 0, padding: '2px 10px', background: `${selBusColor.css}12`, border: `1px solid ${selBusColor.css}30`, borderRadius: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: selBusColor.css, boxShadow: `0 0 5px ${selBusColor.css}` }} />
            <span style={{ color: selBusColor.css, fontWeight: 600 }}>{selBus.label}</span>
            <span style={{ color: 'rgba(200,215,255,0.35)' }}>|</span>
            <span><span style={{ color: 'rgba(200,215,255,0.45)' }}>带宽 </span><span style={{ color: selBusColor.css }}>{selBus.bandwidth}</span></span>
            <span style={{ color: 'rgba(200,215,255,0.35)' }}>|</span>
            <span><span style={{ color: 'rgba(200,215,255,0.45)' }}>频率 </span><span style={{ color: selBusColor.css }}>{selBus.frequency}</span></span>
            <span style={{ marginLeft: 2, fontSize: 9, padding: '1px 6px', borderRadius: 10,
              background: selBus.busStatus === 'error' ? '#EF444422' : selBus.busStatus === 'idle' ? '#6B728022' : '#4ADE8022',
              color: selBus.busStatus === 'error' ? '#EF4444' : selBus.busStatus === 'idle' ? '#9CA3AF' : '#4ADE80',
              border: `1px solid ${selBus.busStatus === 'error' ? '#EF444444' : selBus.busStatus === 'idle' ? '#6B728044' : '#4ADE8044'}`,
            }}>
              {selBus.busStatus === 'error' ? '故障' : selBus.busStatus === 'idle' ? '空闲' : '活跃'}
            </span>
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* ── History playback slider ───────────────────────── */}
      {histLen > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, maxWidth: 160 }}>
          <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.35)', whiteSpace: 'nowrap' }}>历史</span>
          <input
            type="range"
            min={0}
            max={histLen - 1}
            value={playheadVal}
            onChange={e => setHistoryPlayhead(Number(e.target.value) === histLen - 1 ? null : Number(e.target.value))}
            style={{ width: 90, accentColor: '#5b9cf6', cursor: 'pointer' }}
            title={`历史回放 ${playheadVal + 1}/${histLen}`}
          />
          <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.35)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
            {historyPlayhead === null ? '实时' : `T-${histLen - 1 - playheadVal}s`}
          </span>
        </div>
      )}

      {DIVIDER}

      {/* ── 3D view hint ─────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', userSelect: 'none' }}>
          3D · 滚轮缩放 · 拖动旋转 · 右键平移
        </span>
      </div>
    </div>
  );
}
