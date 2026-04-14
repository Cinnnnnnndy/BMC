import React from 'react';
import type { HardwareProject } from '../data/projects';
import '../styles/project-list.css';

interface Props {
  projects: HardwareProject[];
  onSelect: (project: HardwareProject) => void;
  onUpload?: () => void;
  onOpenView?: (viewId: string) => void;
}

/* ─── View entry definitions ─── */
interface ViewEntry {
  id: string;
  name: string;
  desc: string;
  accent: string;
  bg: string;
  thumb: React.ReactNode;
}

function TopologyThumb() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="160" height="100" fill="#0d1829" />
      {/* Central node */}
      <circle cx="80" cy="22" r="9" fill="#3b82f6" opacity="0.9" />
      <text x="80" y="26" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="monospace">ROOT</text>
      {/* Lines to children */}
      <line x1="80" y1="31" x2="30" y2="56" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="80" y1="31" x2="80" y2="56" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="80" y1="31" x2="130" y2="56" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />
      {/* Child nodes */}
      <circle cx="30" cy="64" r="7" fill="#1d4ed8" opacity="0.85" />
      <circle cx="80" cy="64" r="7" fill="#1d4ed8" opacity="0.85" />
      <circle cx="130" cy="64" r="7" fill="#1d4ed8" opacity="0.85" />
      {/* Grandchild lines */}
      <line x1="30" y1="71" x2="18" y2="88" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="30" y1="71" x2="42" y2="88" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="80" y1="71" x2="68" y2="88" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="80" y1="71" x2="92" y2="88" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="130" y1="71" x2="118" y2="88" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="130" y1="71" x2="142" y2="88" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.4" />
      {/* Grandchild nodes */}
      {[18, 42, 68, 92, 118, 142].map((cx, i) => (
        <circle key={i} cx={cx} cy="92" r="4.5" fill="#2563eb" opacity="0.7" />
      ))}
    </svg>
  );
}

function AssociationThumb() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="160" height="100" fill="#130d26" />
      {/* Left column header */}
      <rect x="8" y="8" width="58" height="12" rx="2" fill="#4c1d95" opacity="0.9" />
      <text x="37" y="18" textAnchor="middle" fontSize="7" fill="#a78bfa" fontFamily="sans-serif">硬件层</text>
      {/* Right column header */}
      <rect x="94" y="8" width="58" height="12" rx="2" fill="#1e3a5f" opacity="0.9" />
      <text x="123" y="18" textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="sans-serif">软件层</text>
      {/* Left blocks */}
      {[28, 44, 60, 76].map((y, i) => (
        <rect key={i} x="8" y={y} width="58" height="10" rx="1.5" fill="#2e1065" opacity={0.7 + i * 0.05} />
      ))}
      {/* Right blocks */}
      {[28, 38, 50, 62, 74].map((y, i) => (
        <rect key={i} x="94" y={y} width="58" height="8" rx="1.5" fill="#0f2541" opacity={0.7 + i * 0.05} />
      ))}
      {/* Connecting lines */}
      <line x1="66" y1="33" x2="94" y2="32" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2 2" />
      <line x1="66" y1="49" x2="94" y2="42" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2 2" />
      <line x1="66" y1="65" x2="94" y2="54" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2 2" />
      <line x1="66" y1="65" x2="94" y2="66" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 2" />
      <line x1="66" y1="81" x2="94" y2="78" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 2" />
      {/* Node dots on lines */}
      {[[66, 33], [66, 49], [66, 65], [66, 81]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#7c3aed" />
      ))}
      {[[94, 32], [94, 42], [94, 54], [94, 66], [94, 78]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#3b82f6" />
      ))}
    </svg>
  );
}

function EventThumb() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="160" height="100" fill="#1a0f0a" />
      {/* Header bar */}
      <rect x="8" y="8" width="144" height="14" rx="2" fill="#431407" opacity="0.9" />
      <text x="16" y="19" fontSize="7" fill="#fb923c" fontFamily="sans-serif">事件列表</text>
      <rect x="118" y="11" width="30" height="8" rx="1" fill="#ea580c" opacity="0.7" />
      <text x="133" y="18" textAnchor="middle" fontSize="6" fill="#fff" fontFamily="sans-serif">+ 添加</text>
      {/* Event rows */}
      {[
        { y: 26, color: '#ef4444', tag: 'CRIT', label: 'MemoryFault_0x01' },
        { y: 39, color: '#f97316', tag: 'WARN', label: 'TempThreshold_CPU' },
        { y: 52, color: '#3b82f6', tag: 'INFO', label: 'PowerOn_Event' },
        { y: 65, color: '#f97316', tag: 'WARN', label: 'FanSpeed_Low' },
        { y: 78, color: '#3b82f6', tag: 'INFO', label: 'LinkStatus_NIC' },
      ].map(({ y, color, tag, label }, i) => (
        <g key={i}>
          <rect x="8" y={y} width="144" height="11" rx="1.5" fill="#1f1008" opacity="0.8" />
          <rect x="10" y={y + 2} width="22" height="7" rx="1" fill={color} opacity="0.85" />
          <text x="21" y={y + 8} textAnchor="middle" fontSize="5.5" fill="#fff" fontFamily="monospace">{tag}</text>
          <text x="36" y={y + 8.5} fontSize="6" fill="#d1d5db" fontFamily="monospace">{label}</text>
          <circle cx="148" cy={y + 5.5} r="2.5" fill={color} opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

function SensorThumb() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="160" height="100" fill="#0a1a0f" />
      {/* Title */}
      <text x="8" y="17" fontSize="7" fill="#4ade80" fontFamily="sans-serif" opacity="0.9">传感器监控</text>
      {/* Sensor rows with bar charts */}
      {[
        { y: 22, label: 'CPU Temp', val: 72, max: 100, color: '#f97316', unit: '°C' },
        { y: 42, label: 'Fan 1',    val: 3200, max: 6000, color: '#22d3ee', unit: 'RPM' },
        { y: 62, label: 'Voltage',  val: 11.9, max: 12.5, color: '#4ade80', unit: 'V' },
        { y: 82, label: 'Power',    val: 185, max: 300, color: '#a78bfa', unit: 'W' },
      ].map(({ y, label, val, max, color, unit }, i) => {
        const pct = (val / max) * 100;
        return (
          <g key={i}>
            <text x="8" y={y + 9} fontSize="6" fill="#94a3b8" fontFamily="sans-serif">{label}</text>
            <text x="152" y={y + 9} textAnchor="end" fontSize="6" fill={color} fontFamily="monospace">{unit}</text>
            <rect x="8" y={y + 12} width="144" height="6" rx="3" fill="#0f2a0f" />
            <rect x="8" y={y + 12} width={144 * pct / 100} height="6" rx="3" fill={color} opacity="0.85" />
          </g>
        );
      })}
    </svg>
  );
}

function SimulatorThumb() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="160" height="100" fill="#050d18" />
      {/* Terminal window frame */}
      <rect x="6" y="6" width="148" height="88" rx="4" fill="#0a1526" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.4" />
      {/* Traffic lights */}
      <circle cx="16" cy="14" r="3" fill="#ef4444" opacity="0.8" />
      <circle cx="25" cy="14" r="3" fill="#f59e0b" opacity="0.8" />
      <circle cx="34" cy="14" r="3" fill="#22c55e" opacity="0.8" />
      <text x="50" y="17" fontSize="6" fill="#64748b" fontFamily="monospace">UBMC Simulator v1.0</text>
      <line x1="6" y1="22" x2="154" y2="22" stroke="#0ea5e9" strokeWidth="0.4" strokeOpacity="0.3" />
      {/* Code lines */}
      {[
        { y: 30, prefix: '$ ', text: 'ipmi chassis status', col1: '#22d3ee', col2: '#94a3b8' },
        { y: 40, prefix: '> ', text: 'System Power : On', col1: '#4ade80', col2: '#86efac' },
        { y: 50, prefix: '> ', text: 'Power Overload: No', col1: '#4ade80', col2: '#86efac' },
        { y: 60, prefix: '$ ', text: 'ipmitool sdr list', col1: '#22d3ee', col2: '#94a3b8' },
        { y: 70, prefix: '> ', text: 'CPU_Temp | 72 | ok', col1: '#f97316', col2: '#fdba74' },
        { y: 80, prefix: '▌ ', text: '', col1: '#22d3ee', col2: '#22d3ee' },
      ].map(({ y, prefix, text, col1, col2 }, i) => (
        <g key={i}>
          <text x="12" y={y} fontSize="6.5" fill={col1} fontFamily="monospace">{prefix}</text>
          <text x="22" y={y} fontSize="6.5" fill={col2} fontFamily="monospace">{text}</text>
        </g>
      ))}
    </svg>
  );
}

function HwTopologyThumb() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="160" height="100" fill="#080f1a" />
      {/* Board cards arranged in a grid */}
      {[
        { x: 8,   y: 10, w: 40, h: 22, color: '#16a34a', label: 'BCU' },
        { x: 56,  y: 10, w: 40, h: 22, color: '#0ea5e9', label: 'IEU' },
        { x: 104, y: 10, w: 48, h: 22, color: '#7c3aed', label: 'PSR' },
        { x: 8,   y: 40, w: 32, h: 22, color: '#0ea5e9', label: 'IEU' },
        { x: 48,  y: 40, w: 32, h: 22, color: '#0ea5e9', label: 'IEU' },
        { x: 88,  y: 40, w: 32, h: 22, color: '#0ea5e9', label: 'IEU' },
        { x: 128, y: 40, w: 24, h: 22, color: '#f97316', label: 'SEU' },
        { x: 8,   y: 70, w: 64, h: 22, color: '#6366f1', label: 'CLU Cluster' },
        { x: 80,  y: 70, w: 72, h: 22, color: '#6366f1', label: 'CLU Cluster' },
      ].map(({ x, y, w, h, color, label }, i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} rx="2" fill={color} opacity="0.2" stroke={color} strokeWidth="0.8" strokeOpacity="0.7" />
          <text x={x + w / 2} y={y + h / 2 + 2.5} textAnchor="middle" fontSize="6" fill={color} fontFamily="monospace" opacity="0.95">{label}</text>
        </g>
      ))}
      {/* Connection lines */}
      <line x1="28" y1="32" x2="28" y2="40" stroke="#16a34a" strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="76" y1="32" x2="64" y2="40" stroke="#0ea5e9" strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="76" y1="32" x2="104" y2="40" stroke="#0ea5e9" strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="64" y1="62" x2="40" y2="70" stroke="#6366f1" strokeWidth="0.7" strokeOpacity="0.4" />
      <line x1="104" y1="62" x2="116" y2="70" stroke="#6366f1" strokeWidth="0.7" strokeOpacity="0.4" />
    </svg>
  );
}

function ServerAssocThumb() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="160" height="100" fill="#0d0d1f" />
      {/* Central server rack */}
      <rect x="60" y="10" width="40" height="80" rx="3" fill="#1e1b4b" stroke="#6366f1" strokeWidth="0.8" strokeOpacity="0.6" />
      {[15, 25, 35, 45, 55, 65, 75].map((y, i) => (
        <rect key={i} x="64" y={y} width="32" height="7" rx="1" fill="#312e81" opacity={0.6 + i * 0.04} />
      ))}
      <text x="80" y="95" textAnchor="middle" fontSize="5.5" fill="#818cf8" fontFamily="sans-serif">Server</text>
      {/* Left services */}
      {[20, 42, 64].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="38" height="14" rx="2" fill="#1e0f3d" stroke="#7c3aed" strokeWidth="0.6" strokeOpacity="0.7" />
          <text x="27" y={y + 9} textAnchor="middle" fontSize="5.5" fill="#a78bfa" fontFamily="sans-serif">BMC·{i + 1}</text>
          <line x1="46" y1={y + 7} x2="60" y2={50} stroke="#7c3aed" strokeWidth="0.7" strokeOpacity="0.5" strokeDasharray="3 2" />
        </g>
      ))}
      {/* Right services */}
      {[20, 42, 64].map((y, i) => (
        <g key={i}>
          <rect x="114" y={y} width="38" height="14" rx="2" fill="#0c1f3d" stroke="#0ea5e9" strokeWidth="0.6" strokeOpacity="0.7" />
          <text x="133" y={y + 9} textAnchor="middle" fontSize="5.5" fill="#38bdf8" fontFamily="sans-serif">SVC·{i + 1}</text>
          <line x1="114" y1={y + 7} x2="100" y2={50} stroke="#0ea5e9" strokeWidth="0.7" strokeOpacity="0.5" strokeDasharray="3 2" />
        </g>
      ))}
    </svg>
  );
}

const VIEW_ENTRIES: ViewEntry[] = [
  {
    id: 'topology',
    name: '拓扑视图',
    desc: 'CSR 管理拓扑可视化浏览',
    accent: '#3b82f6',
    bg: '#0d1829',
    thumb: <TopologyThumb />,
  },
  {
    id: 'hwTopology',
    name: '硬件拓扑视图',
    desc: 'AI 增强的硬件板卡无限画布',
    accent: '#4ade80',
    bg: '#080f1a',
    thumb: <HwTopologyThumb />,
  },
  {
    id: 'simulator',
    name: '仿真调试',
    desc: 'IPMI 命令模拟与在线调试',
    accent: '#22d3ee',
    bg: '#050d18',
    thumb: <SimulatorThumb />,
  },
  {
    id: 'serverView',
    name: '软硬件关联拓扑',
    desc: '服务器软硬件多层关联全图',
    accent: '#818cf8',
    bg: '#0d0d1f',
    thumb: <ServerAssocThumb />,
  },
  {
    id: 'association',
    name: '软硬件关联列表',
    desc: '软件对象与硬件资源映射关系',
    accent: '#a78bfa',
    bg: '#130d26',
    thumb: <AssociationThumb />,
  },
  {
    id: 'sensor',
    name: '传感器配置',
    desc: '传感器类型、阈值与 SDR 记录',
    accent: '#4ade80',
    bg: '#0a1a0f',
    thumb: <SensorThumb />,
  },
  {
    id: 'event',
    name: '事件配置',
    desc: 'IPMI/Redfish 事件定义与编辑',
    accent: '#f97316',
    bg: '#1a0f0a',
    thumb: <EventThumb />,
  },
];

export function ProjectList({ projects, onSelect, onUpload, onOpenView }: Props) {
  return (
    <div className="project-list-page">
      <div className="project-list-container">
        <h1 className="project-list-title">openUBMC CSR 拓扑编辑器</h1>
        <p className="project-list-subtitle">选择整机项目开始编辑，或按视图类型快速进入</p>

        {/* ── Section 1: 按视图 ── */}
        <div className="section-header">
          <span className="section-label">按视图快速入口</span>
          <div className="section-divider" />
        </div>

        <div className="view-entry-grid" style={{ marginBottom: 48 }}>
          {VIEW_ENTRIES.map((v) => (
            <div
              key={v.id}
              className="view-entry-card"
              style={{ '--view-accent': v.accent } as React.CSSProperties}
              onClick={() => onOpenView?.(v.id)}
            >
              <div className="view-entry-thumb">
                {v.thumb}
              </div>
              <div className="view-entry-body">
                <div className="view-entry-name">{v.name}</div>
                <div className="view-entry-desc">{v.desc}</div>
              </div>
              <div className="view-entry-arrow">→</div>
            </div>
          ))}
        </div>

        {/* ── Section 2: 按项目 ── */}
        <div className="section-header">
          <span className="section-label">按项目浏览</span>
          <div className="section-divider" />
        </div>

        <div className="project-list-grid">
          {projects.map((p) => (
            <div key={p.id} onClick={() => onSelect(p)} className="project-card">
              <div className="project-card-media">
                <img src={p.image} alt={p.model} />
              </div>
              <div className="project-card-body">
                <div className="project-vendor">{p.manufacturer}</div>
                <div className="project-model">{p.model}</div>
                <div className="project-version">版本：{p.version}</div>

                {typeof p.progressPercent === 'number' && (
                  <div className="project-progress-wrap">
                    <div className="project-progress-row">
                      <span>项目进度</span>
                      <span>{p.progressPercent}%</span>
                    </div>
                    <div className="project-progress-track">
                      <div className="project-progress-bar" style={{ width: `${Math.max(0, Math.min(100, p.progressPercent))}%` }} />
                    </div>
                    {p.progressText && (
                      <div className="project-progress-text">{p.progressText}</div>
                    )}
                  </div>
                )}

                {p.highlights?.length ? (
                  <ul className="project-highlights">
                    {p.highlights.slice(0, 4).map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}

          {onUpload && (
            <div onClick={onUpload} className="project-upload">
              <div className="project-upload-plus">+</div>
              <div className="project-upload-title">上传自定义</div>
              <div className="project-upload-sub">.sr / .json</div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
