import { useState, useRef, useEffect } from 'react';
import { useSimStore, type FaultType, type ActiveFault } from './simStore';
import {
  HARDWARE_COMPONENTS,
  BUS_REGISTRY,
  BUS_COLORS,
  BUS_LABELS,
  getComponentsOnBus,
  type HardwareComponent,
} from './serverData';
import { useSimulatedMetrics, useSimulatedLog, type LogEntry } from './useSimulation';

// ─── Status config ─────────────────────────────────────────────────────────
const STATUS_CFG: Record<HardwareComponent['status'], { color: string; label: string }> = {
  normal:   { color: '#4ade80', label: '正常' },
  warning:  { color: '#fbbf24', label: '告警' },
  error:    { color: '#f87171', label: '故障' },
  offline:  { color: '#6b7280', label: '离线' },
  selected: { color: '#5b9cf6', label: '已选' },
};

// ─── SVG Arc Gauge (temperature) ──────────────────────────────────────────
function ArcGauge({ value, max = 100, warn = 80, label, unit }: { value: number; max?: number; warn?: number; label: string; unit: string }) {
  const pct     = Math.min(value / max, 1);
  const color   = value > warn ? '#EF4444' : value > warn * 0.8 ? '#F59E0B' : '#4ADE80';
  const R = 34, cx = 44, cy = 44, sweepDeg = 240;
  const startRad = ((-90 - sweepDeg / 2) * Math.PI) / 180;
  const endRad   = startRad + (sweepDeg * pct * Math.PI) / 180;
  const full     = startRad + (sweepDeg * Math.PI) / 180;

  function arc(angle: number) {
    return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
  }
  const trackS = arc(startRad), trackE = arc(full);
  const fillS  = arc(startRad), fillE  = arc(endRad);
  const flagFull   = sweepDeg > 180 ? 1 : 0;
  const flagFilled = sweepDeg * pct > 180 ? 1 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg width={88} height={72} style={{ overflow: 'visible' }}>
        {/* track */}
        <path
          d={`M${trackS.x},${trackS.y} A${R},${R} 0 ${flagFull},1 ${trackE.x},${trackE.y}`}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} strokeLinecap="round"
        />
        {/* fill */}
        {pct > 0.01 && (
          <path
            d={`M${fillS.x},${fillS.y} A${R},${R} 0 ${flagFilled},1 ${fillE.x},${fillE.y}`}
            fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
          />
        )}
        {/* center text */}
        <text x={cx} y={cy - 3} textAnchor="middle" fill={color} fontSize={15} fontWeight={700} fontFamily="monospace">
          {value.toFixed(0)}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(200,215,255,0.4)" fontSize={9}>
          {unit}
        </text>
      </svg>
      <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

// ─── Horizontal bar metric ─────────────────────────────────────────────────
function BarMetric({ label, value, max, unit, warn }: { label: string; value: number; max: number; unit: string; warn?: number }) {
  const pct   = Math.min(value / max, 1);
  const color = warn && value > warn ? '#F59E0B' : value > max * 0.9 ? '#EF4444' : '#4ADE80';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '6px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
        <span style={{ color: 'rgba(200,215,255,0.5)' }}>{label}</span>
        <span style={{ color, fontWeight: 600, fontFamily: 'monospace' }}>{value.toFixed(1)}<span style={{ color: 'rgba(200,215,255,0.35)', fontWeight: 400 }}> {unit}</span></span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.4s', boxShadow: `0 0 6px ${color}66` }} />
      </div>
    </div>
  );
}

// ─── Circular utilization dial ─────────────────────────────────────────────
function UtilDial({ value }: { value: number }) {
  const pct   = Math.min(value / 100, 1);
  const color = value > 90 ? '#EF4444' : value > 70 ? '#F59E0B' : '#4ADE80';
  const R = 26, cx = 32, cy = 32;
  const circ = 2 * Math.PI * R;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg width={64} height={64}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
        <circle
          cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
          strokeDashoffset={circ * 0.25}
          style={{ transition: 'stroke-dasharray 0.4s', filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
        <text x={cx} y={cy + 4} textAnchor="middle" fill={color} fontSize={11} fontWeight={700} fontFamily="monospace">
          {value.toFixed(0)}%
        </text>
      </svg>
      <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>利用率</span>
    </div>
  );
}

// ─── Voltage display ──────────────────────────────────────────────────────
function VoltageDisplay({ value, nominal }: { value: number; nominal: number }) {
  const pct   = Math.abs(value - nominal) / nominal * 100;
  const color = pct > 5 ? '#EF4444' : pct > 3 ? '#F59E0B' : '#4ADE80';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '6px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, border: `1px solid ${color}28` }}>
      <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>电压</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color, fontFamily: 'monospace', lineHeight: 1 }}>{value.toFixed(3)}</span>
        <span style={{ fontSize: 10, color: 'rgba(200,215,255,0.4)' }}>V</span>
        <span style={{ fontSize: 9, color: color, marginLeft: 'auto' }}>{pct > 0.01 ? `±${pct.toFixed(1)}%` : 'nominal'}</span>
      </div>
    </div>
  );
}

// ─── 属性 Tab ─────────────────────────────────────────────────────────────
function AttrTab({ comp }: { comp: HardwareComponent }) {
  const { highlightConnections, clearHighlights } = useSimStore();

  const SLOT_MAP: Record<string, string> = {
    cpu_0: 'CPU 槽位 0 (Socket 0)', cpu_1: 'CPU 槽位 1 (Socket 1)',
    psu_0: 'PSU 槽位 0',           psu_1: 'PSU 槽位 1 (冗余)',
    fan_module: '风扇托架 (×4)',    base_board: '主板槽位',
    hdd_0: 'HDD Bay 0',            hdd_1: 'HDD Bay 1',
    hdd_2: 'HDD Bay 2',            hdd_riser: '存储笼框架',
    io_panel: '前面板 I/O',        ext_board: 'PCIe 扩展槽 0',
    nic: 'OCP 3.0 网卡槽位',
  };
  const FW_MAP: Record<string, string> = {
    cpu_0: 'Kunpeng v5.10.0', cpu_1: 'Kunpeng v5.10.0',
    psu_0: 'PSU FW 2.4.1', psu_1: 'PSU FW 2.4.1',
    base_board: 'BIOS 3.16.0 / BMC 2.9.5',
    fan_module: 'FanCtrl v1.3',
    hdd_riser: 'Expander FW 2.14.1',
    eeprom_0: 'EEPROM v1', eeprom_1: 'EEPROM v1', eeprom_2: 'CPLD v3.2',
    nic: 'NIC FW 5.6.0 / ROM 26.30.1',
    ext_board: 'GPU VBIOS 94.02.5C.40',
  };

  const row = (label: string, val: string) => (
    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ color: 'rgba(200,215,255,0.4)' }}>{label}</span>
      <span style={{ color: 'rgba(200,215,255,0.82)', fontFamily: 'monospace', textAlign: 'right', maxWidth: 160, wordBreak: 'break-all' }}>{val}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '0 14px 10px' }}>
      {/* Static info */}
      <div style={{ marginBottom: 8 }}>
        {row('型号 / 规格', comp.labelEn)}
        {SLOT_MAP[comp.id] && row('物理位置', SLOT_MAP[comp.id])}
        {FW_MAP[comp.id]   && row('固件版本', FW_MAP[comp.id])}
        {row('网格坐标', `(${comp.grid.x}, ${comp.grid.y}, ${comp.grid.z})`)}
        {row('尺寸 (w×d×h)', `${comp.size.w}×${comp.size.d}×${comp.size.h} U`)}
      </div>

      {/* Bus connections */}
      {comp.busConnections.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.07)' }}>总线连接</div>
          {comp.busConnections.map(bc => {
            const busColor = BUS_COLORS[bc.busType];
            const busDef   = BUS_REGISTRY.find(b => b.id === bc.busId);
            return (
              <div key={bc.busId}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 5, marginBottom: 3, background: `${busColor.css}12`, border: `1px solid ${busColor.css}28`, cursor: 'pointer' }}
                onClick={() => highlightConnections([bc.busId])}
                onMouseLeave={() => clearHighlights()}
                title={`点击高亮 ${BUS_LABELS[bc.busType]}`}
              >
                <span style={{ width: 8, height: 8, borderRadius: 2, background: busColor.css, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: busColor.css, fontWeight: 600, flex: 1 }}>{BUS_LABELS[bc.busType]}</span>
                <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.4)' }}>{bc.role}</span>
                <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.25)', fontFamily: 'monospace' }}>{busDef?.bandwidth ?? ''}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Children tree */}
      {comp.children && comp.children.length > 0 && (
        <div>
          <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.07)' }}>子组件</div>
          {comp.children.map(childId => {
            const child = HARDWARE_COMPONENTS.find(c => c.id === childId);
            if (!child) return null;
            const cfg = STATUS_CFG[child.status];
            return (
              <div key={childId} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 8px', borderRadius: 4, marginBottom: 2, background: 'rgba(255,255,255,0.03)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: 'rgba(200,215,255,0.7)', flex: 1 }}>{child.label}</span>
                <span style={{ fontSize: 9, color: cfg.color }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Description */}
      <p style={{ margin: '8px 0 0', fontSize: 10, color: 'rgba(200,215,255,0.35)', lineHeight: 1.6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {comp.description}
      </p>
    </div>
  );
}

// ─── 指标 Tab ─────────────────────────────────────────────────────────────
function MetricsTab({ comp }: { comp: HardwareComponent }) {
  const sim = useSimulatedMetrics(comp.id);
  const base = comp.metrics;

  if (!base) {
    return <div style={{ padding: 20, fontSize: 11, color: 'rgba(200,215,255,0.3)', textAlign: 'center' }}>该组件无实时指标数据</div>;
  }

  const m = sim ?? base;

  return (
    <div style={{ padding: '8px 14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Top row: arc gauges */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '4px 0 8px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {m.temperature != null && <ArcGauge value={m.temperature as number}  max={100} warn={80} label="温度"  unit="°C" />}
        {m.utilization != null && <UtilDial value={m.utilization as number} />}
      </div>
      {/* Power bar */}
      {m.powerWatts != null && base.powerWatts && (
        <BarMetric label="功耗" value={m.powerWatts as number} max={base.powerWatts * 1.3} unit="W" warn={base.powerWatts * 1.1} />
      )}
      {/* Voltage */}
      {m.voltage != null && base.voltage && (
        <VoltageDisplay value={m.voltage as number} nominal={base.voltage} />
      )}
      {/* Refresh indicator */}
      <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.22)', textAlign: 'right', marginTop: -4 }}>
        ↻ 每 500ms 刷新
      </div>
    </div>
  );
}

// ─── 日志 Tab ─────────────────────────────────────────────────────────────
const LOG_COLORS: Record<LogEntry['level'], string> = {
  INFO:  '#6B7280',
  WARN:  '#F59E0B',
  ERROR: '#EF4444',
};

function LogTab({ comp }: { comp: HardwareComponent }) {
  const log         = useSimulatedLog(comp.id, 100);
  const [filter, setFilter] = useState<Set<LogEntry['level']>>(new Set(['INFO','WARN','ERROR']));
  const [search, setSearch] = useState('');
  const bottomRef   = useRef<HTMLDivElement>(null);

  const visible = log.filter(e =>
    filter.has(e.level) &&
    (search === '' || e.message.toLowerCase().includes(search.toLowerCase())),
  );

  // Auto-scroll to bottom for new entries
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log.length]);

  function toggleFilter(level: LogEntry['level']) {
    setFilter(prev => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Filters + search */}
      <div style={{ padding: '6px 14px 5px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          {(['INFO','WARN','ERROR'] as LogEntry['level'][]).map(lvl => (
            <button key={lvl} onClick={() => toggleFilter(lvl)} style={{
              fontSize: 9, padding: '2px 8px', borderRadius: 10, cursor: 'pointer',
              background: filter.has(lvl) ? `${LOG_COLORS[lvl]}22` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filter.has(lvl) ? LOG_COLORS[lvl] + '55' : 'rgba(255,255,255,0.1)'}`,
              color: filter.has(lvl) ? LOG_COLORS[lvl] : 'rgba(200,215,255,0.35)',
              transition: 'all 0.15s',
            }}>
              {lvl}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索日志…"
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 5, padding: '4px 8px', fontSize: 10,
            color: 'rgba(200,215,255,0.8)', outline: 'none',
          }}
        />
      </div>
      {/* Log list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {visible.length === 0 && (
          <div style={{ padding: 16, fontSize: 10, color: 'rgba(200,215,255,0.3)', textAlign: 'center' }}>无匹配日志</div>
        )}
        {visible.map(e => (
          <div key={e.id} style={{ padding: '4px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', fontFamily: 'monospace', flexShrink: 0, paddingTop: 1 }}>{e.ts}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: LOG_COLORS[e.level], flexShrink: 0, paddingTop: 1, minWidth: 32 }}>{e.level}</span>
            <span style={{ fontSize: 10, color: 'rgba(200,215,255,0.72)', lineHeight: 1.5 }}>{e.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Bus topology panel ────────────────────────────────────────────────────
function BusPanel({ busId }: { busId: string }) {
  const { selectComponent, selectBus } = useSimStore();
  const bus     = BUS_REGISTRY.find(b => b.id === busId);
  const members = getComponentsOnBus(busId);
  if (!bus) return null;
  const busColor = BUS_COLORS[bus.type];
  const statusCfgEntry = bus.busStatus === 'error' ? { color: '#EF4444', label: '故障' }
    : bus.busStatus === 'idle' ? { color: '#6B7280', label: '空闲' }
    : { color: '#4ADE80', label: '活跃' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1, overflow: 'hidden' }}>
      {/* Bus header */}
      <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: busColor.css, boxShadow: `0 0 6px ${busColor.css}88`, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(200,215,255,0.92)' }}>{bus.label}</span>
          <span style={{ marginLeft: 'auto', fontSize: 9, padding: '2px 7px', borderRadius: 999, background: `${statusCfgEntry.color}22`, color: statusCfgEntry.color, border: `1px solid ${statusCfgEntry.color}44` }}>{statusCfgEntry.label}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
          <span><span style={{ color: 'rgba(200,215,255,0.4)' }}>带宽 </span><span style={{ color: busColor.css, fontWeight: 600 }}>{bus.bandwidth}</span></span>
          <span><span style={{ color: 'rgba(200,215,255,0.4)' }}>频率 </span><span style={{ color: busColor.css, fontWeight: 600 }}>{bus.frequency}</span></span>
        </div>
      </div>

      {/* Device list */}
      <div style={{ padding: '8px 0', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '0 14px 5px', fontSize: 9, color: 'rgba(200,215,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          挂载设备 ({members.length})
        </div>
        {members.map(comp => {
          const bc  = comp.busConnections.find(b => b.busId === busId)!;
          const cfg = STATUS_CFG[comp.status];
          return (
            <div key={comp.id} onClick={() => { selectComponent(comp.id); selectBus(null); }}
              style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', borderLeft: `2px solid ${bc.role === 'master' ? busColor.css : 'transparent'}` }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'rgba(200,215,255,0.82)', flex: 1 }}>{comp.label}</span>
              <span style={{ fontSize: 9, color: busColor.css, background: `${busColor.css}18`, border: `1px solid ${busColor.css}30`, borderRadius: 3, padding: '1px 5px' }}>{bc.role}</span>
              <span style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', fontFamily: 'monospace' }}>{bc.connectorPos}</span>
            </div>
          );
        })}
      </div>

      {/* Close */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <button onClick={() => selectBus(null)} style={{ width: '100%', padding: '5px 0', fontSize: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, color: 'rgba(200,215,255,0.7)', cursor: 'pointer' }}>
          ✕ 关闭总线视图
        </button>
      </div>
    </div>
  );
}

// ─── 故障注入 Tab ──────────────────────────────────────────────────────────
const FAULT_TYPES: { type: FaultType; label: string; icon: string; desc: string; color: string }[] = [
  { type: 'overheat',       label: '过热告警',   icon: '🌡', desc: '温度超限，触发热保护降频',       color: '#F59E0B' },
  { type: 'bus_timeout',    label: '总线超时',   icon: '⚡', desc: '总线无响应，链路中断',           color: '#EF4444' },
  { type: 'power_fail',     label: '电源故障',   icon: '🔌', desc: '电源失效，组件进入离线状态',     color: '#EF4444' },
  { type: 'voltage_anomaly',label: '电压异常',   icon: '⚠', desc: '电压偏差超过 ±5% 告警阈值',    color: '#F59E0B' },
];

function FaultTab({ comp }: { comp: HardwareComponent }) {
  const { activeFaults, injectFault, clearFault, clearAllFaults, statusOverrides } = useSimStore();

  // Faults targeting this component
  const myFaults = activeFaults.filter(f => f.targetId === comp.id);
  const effStatus = statusOverrides[comp.id] ?? comp.status;

  const statusCfg = {
    normal:  { color: '#4ade80', label: '正常' },
    warning: { color: '#fbbf24', label: '告警' },
    error:   { color: '#f87171', label: '故障' },
    offline: { color: '#6b7280', label: '离线' },
    selected:{ color: '#5b9cf6', label: '已选' },
  };
  const sc = statusCfg[effStatus] ?? statusCfg.normal;

  function elapsed(injectedAt: number) {
    const s = Math.floor((Date.now() - injectedAt) / 1000);
    return s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
  }

  return (
    <div style={{ padding: '8px 14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Current effective status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: `${sc.color}10`, border: `1px solid ${sc.color}30`, borderRadius: 7 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: sc.color, boxShadow: `0 0 5px ${sc.color}` }} />
        <span style={{ fontSize: 11, color: 'rgba(200,215,255,0.8)', flex: 1 }}>当前状态</span>
        <span style={{ fontSize: 10, color: sc.color, fontWeight: 700 }}>{sc.label}</span>
      </div>

      {/* Inject fault buttons */}
      <div>
        <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>注入故障</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {FAULT_TYPES.map(ft => {
            const alreadyActive = myFaults.some(f => f.type === ft.type);
            return (
              <button
                key={ft.type}
                onClick={() => !alreadyActive && injectFault(ft.type, comp.id)}
                disabled={alreadyActive}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px', borderRadius: 6, cursor: alreadyActive ? 'default' : 'pointer',
                  background: alreadyActive ? `${ft.color}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${alreadyActive ? ft.color + '50' : 'rgba(255,255,255,0.1)'}`,
                  opacity: alreadyActive ? 0.7 : 1,
                  transition: 'all 0.15s',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{ft.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: alreadyActive ? ft.color : 'rgba(200,215,255,0.82)', fontWeight: 600, marginBottom: 2 }}>
                    {ft.label}
                    {alreadyActive && <span style={{ marginLeft: 6, fontSize: 9, color: ft.color, fontWeight: 400 }}>● 活跃</span>}
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.38)', lineHeight: 1.4 }}>{ft.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active faults list */}
      {myFaults.length > 0 && (
        <div>
          <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            活跃故障 ({myFaults.length})
          </div>
          {myFaults.map((f: ActiveFault) => {
            const ft = FAULT_TYPES.find(x => x.type === f.type);
            return (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 5, marginBottom: 3, background: `${ft?.color ?? '#EF4444'}10`, border: `1px solid ${ft?.color ?? '#EF4444'}30` }}>
                <span style={{ fontSize: 12 }}>{ft?.icon ?? '⚠'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: ft?.color ?? '#EF4444', fontWeight: 600 }}>{ft?.label ?? f.type}</div>
                  <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.3)', fontFamily: 'monospace' }}>+{elapsed(f.injectedAt)}</div>
                </div>
                <button
                  onClick={() => clearFault(f.id)}
                  title="清除此故障"
                  style={{ padding: '2px 8px', fontSize: 9, borderRadius: 4, cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(200,215,255,0.6)' }}
                >
                  清除
                </button>
              </div>
            );
          })}
          <button
            onClick={() => clearAllFaults()}
            style={{ width: '100%', marginTop: 4, padding: '5px 0', fontSize: 10, borderRadius: 5, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}
          >
            清除全部故障
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Component detail (4-tab) ──────────────────────────────────────────────
const TABS = ['属性', '指标', '日志', '故障'] as const;
type Tab = typeof TABS[number];

function ComponentDetail({ comp }: { comp: HardwareComponent }) {
  const [tab, setTab] = useState<Tab>('属性');
  const cfg = STATUS_CFG[comp.status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Component header */}
      <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(200,215,255,0.92)', marginBottom: 2 }}>{comp.label}</div>
            <div style={{ fontSize: 9, color: 'rgba(200,215,255,0.35)', fontFamily: 'monospace' }}>{comp.id} · {comp.type}</div>
          </div>
          <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 999, background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44`, flexShrink: 0 }}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '7px 0', fontSize: 11, cursor: 'pointer', border: 'none', userSelect: 'none',
            background: 'transparent', color: tab === t ? 'rgba(200,215,255,0.9)' : 'rgba(200,215,255,0.38)',
            borderBottom: `2px solid ${tab === t ? '#5b9cf6' : 'transparent'}`,
            transition: 'color 0.15s, border-color 0.15s',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === '属性' && <AttrTab comp={comp} />}
        {tab === '指标' && <MetricsTab comp={comp} />}
        {tab === '日志' && <LogTab comp={comp} />}
        {tab === '故障' && <FaultTab comp={comp} />}
      </div>
    </div>
  );
}

// ─── Main SimPanel ─────────────────────────────────────────────────────────
export function SimPanel() {
  const { selectedId, selectedBusId } = useSimStore();
  const comp   = HARDWARE_COMPONENTS.find(c => c.id === selectedId) ?? null;
  const isOpen = !!(comp || selectedBusId);

  return (
    <aside style={{
      width: isOpen ? 280 : 0,
      flexShrink: 0,
      background: '#111420',
      borderLeft: isOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
      transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {isOpen && (
        selectedBusId
          ? <BusPanel busId={selectedBusId} />
          : comp
            ? <ComponentDetail comp={comp} />
            : null
      )}
    </aside>
  );
}
