// TaiShan 200 2180 — Isometric Simulation View
import { useState } from 'react';

// ─── Isometric projection ─────────────────────────────────────────────────
// x→right-down  y→left-down  z→up
// Visible faces: top(z=max), right(x=max), left(y=max)
const OX = 560, OY = 280, TW = 30, TH = 15, TZ = 26;

function iso(x: number, y: number, z = 0): [number, number] {
  return [OX + (x - y) * TW, OY + (x + y) * TH - z * TZ];
}
function pp(x: number, y: number, z = 0) {
  const [sx, sy] = iso(x, y, z);
  return `${sx.toFixed(1)},${sy.toFixed(1)} `;
}
function isoCenter(x: number, y: number, z: number, w: number, d: number): [number, number] {
  return iso(x + w / 2, y + d / 2, z);
}

// ─── Box primitive ────────────────────────────────────────────────────────
function Box({
  x, y, z = 0, w, d, h,
  topC, rightC, leftC,
  stroke = '#1a1c26', sw = 0.7,
  selected = false, onClick,
}: {
  x: number; y: number; z?: number; w: number; d: number; h: number;
  topC: string; rightC: string; leftC: string;
  stroke?: string; sw?: number; selected?: boolean; onClick?: () => void;
}) {
  const s = selected ? '#5b9cf6' : stroke;
  const lw = selected ? 1.6 : sw;
  const topPts = `${pp(x,y,z+h)}${pp(x+w,y,z+h)}${pp(x+w,y+d,z+h)}${pp(x,y+d,z+h)}`;
  const rightPts = `${pp(x+w,y,z+h)}${pp(x+w,y+d,z+h)}${pp(x+w,y+d,z)}${pp(x+w,y,z)}`;
  const leftPts = `${pp(x,y+d,z+h)}${pp(x+w,y+d,z+h)}${pp(x+w,y+d,z)}${pp(x,y+d,z)}`;
  return (
    <g onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      <polygon points={leftPts}  fill={leftC}  stroke={s} strokeWidth={lw} />
      <polygon points={rightPts} fill={rightC} stroke={s} strokeWidth={lw} />
      <polygon points={topPts}   fill={topC}   stroke={s} strokeWidth={lw} />
      {selected && <polygon points={topPts} fill="rgba(91,156,246,0.22)" stroke="#5b9cf6" strokeWidth={1.6} />}
    </g>
  );
}

// ─── Fin stack (heatsink) ─────────────────────────────────────────────────
function Heatsink({ x, y, z = 0, w, d, h, selected, onClick }: {
  x: number; y: number; z?: number; w: number; d: number; h: number;
  selected?: boolean; onClick?: () => void;
}) {
  const fins = 6;
  const finH = h / fins;
  return (
    <g onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      {Array.from({ length: fins }).map((_, i) => (
        <Box key={i} x={x} y={y} z={z + i * finH} w={w} d={d} h={finH * 0.7}
          topC={i % 2 === 0 ? '#6a7080' : '#787e8e'}
          rightC="#484e5e" leftC="#3c4252"
          stroke={selected ? '#5b9cf6' : '#23252e'} sw={0.4}
        />
      ))}
      {selected && (
        <polygon fill="rgba(91,156,246,0.18)" stroke="#5b9cf6" strokeWidth={1.4}
          points={`${pp(x,y,z+h)}${pp(x+w,y,z+h)}${pp(x+w,y+d,z+h)}${pp(x,y+d,z+h)}`} />
      )}
    </g>
  );
}

// ─── Fan (round-ish square) ───────────────────────────────────────────────
function Fan({ x, y, z = 0, selected, onClick }: {
  x: number; y: number; z?: number; selected?: boolean; onClick?: () => void;
}) {
  return (
    <g onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      <Box x={x} y={y} z={z} w={2.2} d={2.2} h={2.8}
        topC="#2a3050" rightC="#1e2440" leftC="#181c34"
        stroke={selected ? '#5b9cf6' : '#2a2c3a'} sw={0.7} />
      {/* fan blade hint on top */}
      <polygon fill="rgba(60,80,160,0.4)"
        points={`${pp(x+0.6,y+1.1,z+2.8)}${pp(x+1.1,y+0.6,z+2.8)}${pp(x+1.6,y+1.1,z+2.8)}${pp(x+1.1,y+1.6,z+2.8)}`} />
    </g>
  );
}

// ─── HDD slab ─────────────────────────────────────────────────────────────
function HddStack({ x, y, z = 0, count, selected, onClick }: {
  x: number; y: number; z?: number; count: number;
  selected?: boolean; onClick?: () => void;
}) {
  return (
    <g onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} x={x} y={y + i * 0.9} z={z} w={4.5} d={0.75} h={0.5}
          topC={i % 2 === 0 ? '#22242e' : '#1e2028'}
          rightC="#18191e" leftC="#141520"
          stroke="#2e3040" sw={0.5} />
      ))}
      {selected && (
        <polygon fill="rgba(91,156,246,0.15)" stroke="#5b9cf6" strokeWidth={1.4}
          points={`${pp(x,y,z+0.5)}${pp(x+4.5,y,z+0.5)}${pp(x+4.5,y+count*0.9,z+0.5)}${pp(x,y+count*0.9,z+0.5)}`} />
      )}
    </g>
  );
}

// ─── DIMM stick ───────────────────────────────────────────────────────────
function Dimm({ x, y, z = 0 }: { x: number; y: number; z?: number }) {
  return (
    <Box x={x} y={y} z={z} w={0.3} d={4.5} h={2.2}
      topC="#1a4030" rightC="#123020" leftC="#0e2418"
      stroke="#1e3828" sw={0.5} />
  );
}

// ─── Cable path helper ────────────────────────────────────────────────────
function Cable({ from, to, color, opacity = 0.75 }: {
  from: [number,number]; to: [number,number]; color: string; opacity?: number;
}) {
  const [x1, y1] = from, [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  return (
    <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
      fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
      opacity={opacity} />
  );
}

// ─── Status types ─────────────────────────────────────────────────────────
type Status = 'ok' | 'warn' | 'error';
interface CompInfo {
  id: string; name: string; status: Status;
  metrics: Array<{ label: string; value: string }>;
}

const COMPONENTS: CompInfo[] = [
  { id: 'chassis', name: '服务器机箱', status: 'ok',
    metrics: [{ label: '型号', value: 'TaiShan 200 2180' }, { label: '规格', value: '2U' }, { label: '温度', value: '32°C' }] },
  { id: 'baseboard', name: 'Base Board 主板', status: 'ok',
    metrics: [{ label: '状态', value: 'Running' }, { label: 'BMC版本', value: '3.12.1' }, { label: '温度', value: '41°C' }] },
  { id: 'cpu1', name: 'Kunpeng 920 #1', status: 'ok',
    metrics: [{ label: '核心', value: '64C' }, { label: '主频', value: '2.6 GHz' }, { label: '温度', value: '58°C' }, { label: '利用率', value: '34%' }] },
  { id: 'cpu2', name: 'Kunpeng 920 #2', status: 'ok',
    metrics: [{ label: '核心', value: '64C' }, { label: '主频', value: '2.6 GHz' }, { label: '温度', value: '55°C' }, { label: '利用率', value: '28%' }] },
  { id: 'dimm', name: 'DDR4 DIMM ×16', status: 'ok',
    metrics: [{ label: '总容量', value: '256 GB' }, { label: '频率', value: '2933 MHz' }, { label: 'ECC', value: 'ON' }, { label: '温度', value: '44°C' }] },
  { id: 'fan', name: '系统风扇组', status: 'warn',
    metrics: [{ label: '数量', value: '4 组' }, { label: '转速', value: '8 200 RPM' }, { label: '目标', value: '7 500 RPM' }, { label: '状态', value: '超速运行' }] },
  { id: 'psu', name: '电源模块 ×2', status: 'ok',
    metrics: [{ label: '规格', value: '800W × 2' }, { label: '输入', value: 'AC 220V' }, { label: '效率', value: '94%' }, { label: '温度', value: '48°C' }] },
  { id: 'hdd', name: 'HDD/SSD 存储', status: 'error',
    metrics: [{ label: '插槽', value: '14 × 3.5"' }, { label: '故障盘', value: '1 块' }, { label: '在线', value: '13 块' }, { label: 'RAID', value: 'RAID5 降级' }] },
  { id: 'nic', name: '网卡 NIC', status: 'ok',
    metrics: [{ label: '端口', value: '2 × 25GbE' }, { label: '状态', value: 'Link UP' }, { label: '速率', value: '25 Gb/s' }] },
  { id: 'ext', name: '扩展板 Ext.Board', status: 'ok',
    metrics: [{ label: '插槽', value: 'PCIe x16' }, { label: '设备', value: 'GPU 加速卡' }, { label: '温度', value: '62°C' }] },
  { id: 'io', name: 'I/O 前面板', status: 'ok',
    metrics: [{ label: '接口', value: 'USB3 × 2, VGA' }, { label: 'BMC口', value: '已连接' }, { label: '状态', value: 'Normal' }] },
];

const STATUS_COLOR: Record<Status, string> = {
  ok: '#4ade80', warn: '#fbbf24', error: '#f87171',
};
const STATUS_LABEL: Record<Status, string> = {
  ok: '正常', warn: '告警', error: '故障',
};

// ─── Main component ───────────────────────────────────────────────────────
export function TaishanIsoView() {
  const [sel, setSel] = useState<string | null>(null);
  const selInfo = COMPONENTS.find(c => c.id === sel) ?? null;

  function click(id: string) {
    setSel(prev => prev === id ? null : id);
  }
  function s(id: string) { return sel === id; }

  // cable endpoints (screen coords)
  const psuMid = iso(18.5, 9, 2.5);
  const bbMid  = iso(9.5, 9, 2);
  const fanMid = iso(13.5, 7.5, 3);
  const hddMid = iso(20, 5.5, 5);
  const nicMid = iso(4, 14, 2.5);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0d0f18', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }}>
      {/* ── SVG Canvas ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden' }}
        onClick={() => setSel(null)}>

        {/* Title overlay */}
        <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 10, pointerEvents: 'none' }}>
          <div style={{ fontSize: 11, color: 'rgba(200,210,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
            仿真调试 · TaiShan 200 2180
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: '正常', count: COMPONENTS.filter(c=>c.status==='ok').length, color: '#4ade80' },
              { label: '告警', count: COMPONENTS.filter(c=>c.status==='warn').length, color: '#fbbf24' },
              { label: '故障', count: COMPONENTS.filter(c=>c.status==='error').length, color: '#f87171' },
            ].map(({ label, count, color }) => (
              <span key={label} style={{ fontSize: 12, color, fontVariantNumeric: 'tabular-nums' }}>
                {label} <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>

        <svg viewBox="0 0 1160 720" width="100%" height="100%"
          style={{ display: 'block' }}
          onClick={e => e.stopPropagation()}>

          {/* ── Background grid ─────────────────────────────────── */}
          <defs>
            <pattern id="igrid" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M60,0 L30,15 L0,0" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.5" />
              <path d="M0,0 L30,15 L60,30" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <rect width="1160" height="720" fill="#0d0f18" />
          <rect width="1160" height="720" fill="url(#igrid)" />

          {/* ── Cables / connections ─────────────────────────────── */}
          <g opacity="0.6">
            {/* Yellow power: PSU → Base Board */}
            <Cable from={psuMid} to={bbMid} color="#f59e0b" />
            {/* Orange power rail on board */}
            <Cable from={[iso(3,13,2)[0], iso(3,13,2)[1]]} to={[iso(11,13,2)[0], iso(11,13,2)[1]]} color="#fb923c" opacity={0.5} />
            {/* Purple I2C: board → fans */}
            <Cable from={bbMid} to={fanMid} color="#a78bfa" />
            {/* Blue PCIe: board → HDD */}
            {/* data-viz-exempt: 跨板连线色 */}
            <Cable from={bbMid} to={hddMid} color="#60a5fa" />
            {/* Teal: board → NIC */}
            <Cable from={bbMid} to={nicMid} color="#2dd4bf" />
            {/* Pink HDD interconnect */}
            <Cable from={hddMid} to={[iso(22, 5, 5)[0], iso(22, 5, 5)[1]]} color="#f472b6" opacity={0.5} />
          </g>

          {/* ── Server chassis base ──────────────────────────────── */}
          <Box x={1} y={2} z={0} w={13} d={12} h={1}
            topC="#1c1e2a" rightC="#151720" leftC="#11131c"
            stroke="#252838" sw={0.8}
            selected={s('chassis')} onClick={() => click('chassis')} />

          {/* ── Base Board (PCB) ─────────────────────────────────── */}
          <Box x={1.3} y={2.3} z={1} w={12.4} d={11.4} h={0.4}
            topC="#0d2820" rightC="#0a2018" leftC="#071812"
            stroke="#1a3826" sw={0.6}
            selected={s('baseboard')} onClick={() => click('baseboard')} />

          {/* ── DIMM sticks (left bank) ──────────────────────────── */}
          <g onClick={() => click('dimm')} style={{ cursor: 'pointer' }}>
            {[0,1,2,3].map(i => <Dimm key={i} x={2 + i * 0.5} y={3} z={1.4} />)}
            {[0,1,2,3].map(i => <Dimm key={i+4} x={2 + i * 0.5} y={9} z={1.4} />)}
          </g>

          {/* ── CPU Heatsink #1 ──────────────────────────────────── */}
          <Heatsink x={3} y={4} z={1.4} w={3.5} d={3.5} h={5}
            selected={s('cpu1')} onClick={() => click('cpu1')} />

          {/* ── CPU Heatsink #2 ──────────────────────────────────── */}
          <Heatsink x={7.5} y={4} z={1.4} w={3.5} d={3.5} h={5}
            selected={s('cpu2')} onClick={() => click('cpu2')} />

          {/* ── NIC card ─────────────────────────────────────────── */}
          <Box x={2} y={14} z={1} w={6} d={1} h={0.8}
            topC="#142840" rightC="#0e1e30" leftC="#0a1828"
            selected={s('nic')} onClick={() => click('nic')} />

          {/* ── Ext board ────────────────────────────────────────── */}
          <Box x={0} y={5} z={0} w={1.2} d={6} h={1.5}
            topC="#1a2a18" rightC="#121e10" leftC="#0e180c"
            selected={s('ext')} onClick={() => click('ext')} />

          {/* ── I/O Panel ────────────────────────────────────────── */}
          <Box x={0} y={2} z={0} w={1.2} d={3} h={3}
            topC="#1e2030" rightC="#161822" leftC="#12141c"
            selected={s('io')} onClick={() => click('io')} />

          {/* ── Fans (4×) ────────────────────────────────────────── */}
          <g onClick={() => click('fan')} style={{ cursor: 'pointer' }}>
            <Fan x={13.5} y={3}   z={1} selected={s('fan')} />
            <Fan x={13.5} y={5.5} z={1} selected={s('fan')} />
            <Fan x={13.5} y={8}   z={1} selected={s('fan')} />
            <Fan x={13.5} y={10.5} z={1} selected={s('fan')} />
          </g>

          {/* ── PSU units ────────────────────────────────────────── */}
          <g onClick={() => click('psu')} style={{ cursor: 'pointer' }}>
            <Box x={17} y={2} z={0} w={4} d={5} h={2.5}
              topC="#1e2030" rightC="#161822" leftC="#12141c"
              stroke={s('psu') ? '#5b9cf6' : '#252838'} sw={0.8} selected={s('psu')} />
            <Box x={17} y={8} z={0} w={4} d={5} h={2.5}
              topC="#1e2030" rightC="#161822" leftC="#12141c"
              stroke={s('psu') ? '#5b9cf6' : '#252838'} sw={0.8} selected={s('psu')} />
          </g>

          {/* ── HDD cage (floating upper right) ─────────────────── */}
          <g onClick={() => click('hdd')} style={{ cursor: 'pointer' }}>
            {/* cage frame */}
            <Box x={17} y={0} z={3} w={5} d={10} h={0.5}
              topC="#1a1c24" rightC="#141620" leftC="#10121a"
              stroke={s('hdd') ? '#5b9cf6' : '#252838'} sw={0.8} />
            {/* HDD slabs - two columns */}
            <HddStack x={17.2} y={0.2} z={3.5} count={7} selected={s('hdd')} />
            <HddStack x={22}   y={0.2} z={3.5} count={7} selected={s('hdd')} />
            {/* cage label bar */}
            <Box x={17} y={0} z={7.5} w={10} d={0.4} h={0.3}
              topC="#2a3040" rightC="#1e2430" leftC="#181e28"
              stroke="#303548" sw={0.6} />
          </g>

          {/* ── Labels ──────────────────────────────────────────── */}
          {[
            { id: 'chassis',   pos: isoCenter(1,2,1,13,12),    label: '机箱 Chassis' },
            { id: 'baseboard', pos: isoCenter(1.3,2.3,1.4,12.4,11.4), label: 'Base Board' },
            { id: 'cpu1',      pos: isoCenter(3,4,6.4,3.5,3.5), label: 'CPU 1' },
            { id: 'cpu2',      pos: isoCenter(7.5,4,6.4,3.5,3.5), label: 'CPU 2' },
            { id: 'fan',       pos: isoCenter(13.5,3,4,2.2,10), label: 'Fan' },
            { id: 'psu',       pos: isoCenter(17,2,2.5,4,11),   label: 'PSU' },
            { id: 'hdd',       pos: isoCenter(17,0,8,10,10),    label: 'Hard Disk' },
            { id: 'nic',       pos: isoCenter(2,14,1.8,6,1),    label: 'NIC' },
            { id: 'ext',       pos: isoCenter(0,5,1.5,1.2,6),   label: 'Ext.Board' },
            { id: 'io',        pos: isoCenter(0,2,3,1.2,3),     label: 'I/O' },
          ].map(({ id, pos, label }) => {
            const comp = COMPONENTS.find(c => c.id === id)!;
            const color = STATUS_COLOR[comp.status];
            return (
              <g key={id} onClick={e => { e.stopPropagation(); click(id); }} style={{ cursor: 'pointer' }}>
                <circle cx={pos[0]} cy={pos[1]} r={3} fill={color} filter="url(#glow)" />
                <text x={pos[0] + 6} y={pos[1] + 4}
                  fontSize="10" fill="rgba(200,215,255,0.75)"
                  fontFamily="monospace" letterSpacing="0.04em">
                  {label}
                </text>
              </g>
            );
          })}

          {/* ── Click-to-deselect background ─────────────────────── */}
          <rect width="1160" height="720" fill="transparent"
            style={{ pointerEvents: 'none' }} />

        </svg>
      </div>

      {/* ── Status Panel ─────────────────────────────────────────────── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: '#131520', borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 16px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          fontSize: 12, fontWeight: 700, color: 'rgba(200,215,255,0.85)',
          letterSpacing: '0.06em',
        }}>
          组件状态
        </div>

        {/* Component list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {COMPONENTS.map(comp => (
            <div key={comp.id}
              onClick={() => click(comp.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 16px', cursor: 'pointer',
                background: sel === comp.id ? 'rgba(91,156,246,0.1)' : 'transparent',
                borderLeft: sel === comp.id ? '2px solid #5b9cf6' : '2px solid transparent',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (sel !== comp.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (sel !== comp.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[comp.status], flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(200,215,255,0.8)', flex: 1 }}>{comp.name}</span>
              <span style={{
                fontSize: 10, padding: '1px 6px', borderRadius: 999,
                background: `${STATUS_COLOR[comp.status]}22`,
                color: STATUS_COLOR[comp.status],
                border: `1px solid ${STATUS_COLOR[comp.status]}44`,
              }}>
                {STATUS_LABEL[comp.status]}
              </span>
            </div>
          ))}
        </div>

        {/* Selected detail */}
        {selInfo && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(200,215,255,0.9)' }}>
                {selInfo.name}
              </span>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 999,
                background: `${STATUS_COLOR[selInfo.status]}22`,
                color: STATUS_COLOR[selInfo.status],
                border: `1px solid ${STATUS_COLOR[selInfo.status]}44`,
              }}>
                {STATUS_LABEL[selInfo.status]}
              </span>
            </div>
            {selInfo.metrics.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', fontSize: 11,
                padding: '6px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{ color: 'rgba(200,215,255,0.55)' }}>{m.label}</span>
                <span style={{ color: 'rgba(200,215,255,0.9)', fontWeight: 600 }}>{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {!selInfo && (
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontSize: 11, color: 'rgba(200,215,255,0.4)', margin: 0, lineHeight: 1.5 }}>
              点击场景中的组件或左侧列表查看详细状态与仿真数据
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
