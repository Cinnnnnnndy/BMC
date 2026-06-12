/**
 * EnergyView — 能效分析视图
 *
 * Server and datacenter energy efficiency: PUE calculator, per-server power breakdown,
 * and performance-per-watt analysis. Data is user-editable; no backend required.
 */
import { useState, useMemo } from 'react';

const CARD: React.CSSProperties = {
  background: '#0f1622', border: '1px solid #1e2d3d', borderRadius: 8, padding: '16px 18px',
};
const LABEL: React.CSSProperties = { display: 'block', fontSize: 11, color: '#5a6b7c', marginBottom: 4 };
const NUM_INPUT: React.CSSProperties = {
  width: '100%', background: '#0a1018', border: '1px solid #1e2d3d', borderRadius: 5,
  color: '#cbd5e1', fontSize: 13, padding: '6px 10px', boxSizing: 'border-box' as const, outline: 'none',
};

function GaugeBar({ label, value, max, color, unit }: { label: string; value: number; max: number; color: string; unit?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#7c8a99' }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color }}>
          {Number.isInteger(value) ? value : value.toFixed(2)}{unit ? ` ${unit}` : ''}
        </span>
      </div>
      <div style={{ height: 6, background: '#0a1018', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, sub, color }: { label: string; value: string; unit?: string; sub?: string; color?: string }) {
  return (
    <div style={{ ...CARD, flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 11, color: '#5a6b7c', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color ?? '#5eead4', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
        {value}
        {unit && <span style={{ fontSize: 13, marginLeft: 4, color: '#7c8a99' }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 10.5, color: '#3d4f5f', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

interface ServerRow {
  name: string;
  cpu: number;
  mem: number;
  psu: number;
  io: number;
  tflops: number;
}

const DEFAULT_SERVERS: ServerRow[] = [
  { name: '昇腾 910C节点',  cpu: 350,  mem: 120, psu: 80,  io: 20,  tflops: 752  },
  { name: '鲲鹏 920 服务器', cpu: 280,  mem: 80,  psu: 60,  io: 15,  tflops: 8    },
  { name: 'x86 参考服务器',  cpu: 400,  mem: 100, psu: 70,  io: 30,  tflops: 12   },
];

export function EnergyView() {
  const [itLoad,    setItLoad]    = useState(500);
  const [totalFac,  setTotalFac]  = useState(620);
  const [servers,   setServers]   = useState<ServerRow[]>(DEFAULT_SERVERS);
  const [editIdx,   setEditIdx]   = useState<number | null>(null);

  const pue = totalFac > 0 ? (totalFac / itLoad) : 0;
  const pueColor = pue <= 1.2 ? '#4ade80' : pue <= 1.5 ? '#facc15' : '#f87171';

  const totalPower = useMemo(() => servers.reduce((s, r) => s + r.cpu + r.mem + r.psu + r.io, 0), [servers]);
  const totalTflops = useMemo(() => servers.reduce((s, r) => s + r.tflops, 0), [servers]);
  const avgPPW = totalPower > 0 ? totalTflops / totalPower : 0;

  const updateServer = (idx: number, field: keyof ServerRow, val: string) => {
    setServers((prev) => prev.map((r, i) => {
      if (i !== idx) return r;
      return { ...r, [field]: field === 'name' ? val : Number(val) || 0 };
    }));
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#0a1018', color: '#cbd5e1', padding: '24px 28px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>能效分析</h2>
        <p style={{ fontSize: 12.5, color: '#4a6070', marginBottom: 24 }}>
          数据中心 PUE 计算、服务器功耗分解及 FLOPS/W 性能密度分析
        </p>

        {/* PUE section */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#7c8a99', letterSpacing: '0.05em', marginBottom: 12 }}>
            PUE 计算器
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            <div style={CARD}>
              <label style={LABEL}>IT 负载功耗 (kW)</label>
              <input type="number" value={itLoad} onChange={(e) => setItLoad(Number(e.target.value))} style={NUM_INPUT} min={1} />
            </div>
            <div style={CARD}>
              <label style={LABEL}>设施总功耗 (kW)</label>
              <input type="number" value={totalFac} onChange={(e) => setTotalFac(Number(e.target.value))} style={NUM_INPUT} min={1} />
            </div>
            <StatCard
              label="PUE"
              value={pue.toFixed(3)}
              sub={pue <= 1.2 ? '优秀（绿色）' : pue <= 1.5 ? '良好' : '待改善'}
              color={pueColor}
            />
            <StatCard
              label="制冷/基础设施开销"
              value={Math.round(totalFac - itLoad).toString()}
              unit="kW"
              sub={`占总功耗 ${totalFac > 0 ? ((totalFac - itLoad) / totalFac * 100).toFixed(1) : 0}%`}
              color="#fb923c"
            />
          </div>
          <div style={{ marginTop: 14 }}>
            <GaugeBar label="IT 负载" value={itLoad} max={totalFac} color="#4ade80" unit="kW" />
            <GaugeBar label="设施总功耗" value={totalFac} max={Math.max(totalFac * 1.2, 1)} color="#fb923c" unit="kW" />
          </div>
          <div style={{ fontSize: 11, color: '#3d4f5f', marginTop: 6 }}>
            PUE 等级：≤1.2 卓越 · ≤1.4 高效 · ≤1.6 良好 · &gt;1.6 待改善（TIA-942 参考）
          </div>
        </div>

        {/* Server power breakdown */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#7c8a99', letterSpacing: '0.05em' }}>
              服务器功耗分解
            </span>
            <button
              onClick={() => setServers((p) => [...p, { name: '新服务器', cpu: 200, mem: 80, psu: 50, io: 20, tflops: 10 }])}
              style={{ padding: '3px 10px', fontSize: 11, background: 'transparent', border: '1px solid #1e2d3d', borderRadius: 4, color: '#7c8a99', cursor: 'pointer' }}
            >
              + 添加
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ color: '#4a5a6a', borderBottom: '1px solid #1e2d3d' }}>
                  {['机型', 'CPU (W)', '内存 (W)', '电源 (W)', 'IO (W)', '合计 (W)', 'TFLOPS', 'TFLOPS/W', ''].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {servers.map((r, i) => {
                  const total = r.cpu + r.mem + r.psu + r.io;
                  const ppw = total > 0 ? r.tflops / total : 0;
                  return editIdx === i ? (
                    <tr key={i} style={{ background: 'rgba(14,116,144,0.06)', borderBottom: '1px solid #1e2d3d' }}>
                      <td style={{ padding: '4px 6px' }}>
                        <input value={r.name} onChange={(e) => updateServer(i, 'name', e.target.value)}
                          style={{ ...NUM_INPUT, fontSize: 12, padding: '3px 6px' }} />
                      </td>
                      {(['cpu', 'mem', 'psu', 'io'] as const).map((f) => (
                        <td key={f} style={{ padding: '4px 6px' }}>
                          <input type="number" value={r[f]} onChange={(e) => updateServer(i, f, e.target.value)}
                            style={{ ...NUM_INPUT, fontSize: 12, padding: '3px 6px', width: 70 }} />
                        </td>
                      ))}
                      <td style={{ padding: '4px 10px', color: '#facc15', fontFamily: 'monospace' }}>{total}</td>
                      <td style={{ padding: '4px 6px' }}>
                        <input type="number" value={r.tflops} onChange={(e) => updateServer(i, 'tflops', e.target.value)}
                          style={{ ...NUM_INPUT, fontSize: 12, padding: '3px 6px', width: 80 }} />
                      </td>
                      <td style={{ padding: '4px 10px', color: '#4ade80', fontFamily: 'monospace' }}>{ppw.toFixed(3)}</td>
                      <td style={{ padding: '4px 6px' }}>
                        <button onClick={() => setEditIdx(null)} style={{ fontSize: 11, background: '#0e7490', border: 'none', borderRadius: 3, color: '#fff', cursor: 'pointer', padding: '2px 8px' }}>✓</button>
                        <button onClick={() => { setServers((p) => p.filter((_, j) => j !== i)); setEditIdx(null); }}
                          style={{ marginLeft: 4, fontSize: 11, background: 'transparent', border: '1px solid #3d1a1a', borderRadius: 3, color: '#f87171', cursor: 'pointer', padding: '2px 8px' }}>删</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={i} style={{ borderBottom: '1px solid #0f1622', cursor: 'pointer' }} onClick={() => setEditIdx(i)}>
                      <td style={{ padding: '5px 10px', color: '#94a3b8' }}>{r.name}</td>
                      <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: '#7c8a99' }}>{r.cpu}</td>
                      <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: '#7c8a99' }}>{r.mem}</td>
                      <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: '#7c8a99' }}>{r.psu}</td>
                      <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: '#7c8a99' }}>{r.io}</td>
                      <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: '#facc15' }}>{total}</td>
                      <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: '#7c8a99' }}>{r.tflops}</td>
                      <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: '#4ade80' }}>{ppw.toFixed(3)}</td>
                      <td style={{ padding: '5px 10px', fontSize: 10.5, color: '#3d4f5f' }}>编辑</td>
                    </tr>
                  );
                })}
                <tr style={{ borderTop: '1px solid #1e2d3d', fontWeight: 600 }}>
                  <td style={{ padding: '6px 10px', color: '#5a6b7c', fontSize: 11 }}>合计</td>
                  <td colSpan={4} />
                  <td style={{ padding: '6px 10px', fontFamily: 'monospace', color: '#facc15' }}>{totalPower}</td>
                  <td style={{ padding: '6px 10px', fontFamily: 'monospace', color: '#7c8a99' }}>{totalTflops}</td>
                  <td style={{ padding: '6px 10px', fontFamily: 'monospace', color: '#4ade80' }}>{avgPPW.toFixed(3)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: '#3d4f5f', marginTop: 6 }}>点击行可编辑</div>
        </div>

        {/* Summary stat cards */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <StatCard label="总 IT 算力" value={totalTflops.toFixed(1)} unit="TFLOPS" sub="FP16 峰值" color="#5eead4" />
          <StatCard label="总功耗" value={totalPower.toString()} unit="W" sub="服务器侧合计" color="#facc15" />
          <StatCard label="算力功耗比" value={avgPPW.toFixed(3)} unit="TFLOPS/W" sub="越高越省电" color="#4ade80" />
          <StatCard label="PUE 修正算力密度" value={(avgPPW / (pue || 1)).toFixed(3)} unit="TFLOPS/W" sub="含机房基础设施损耗" color="#a78bfa" />
        </div>

        <div style={{ marginTop: 20, padding: '12px 14px', background: '#0f1a0f', border: '1px solid #1e3d20', borderRadius: 8, fontSize: 11.5, color: '#4a7050', lineHeight: 1.7 }}>
          <strong style={{ color: '#4ade80' }}>参考目标</strong>：超节点 CM384 整机 559 kW / 384× 910C · 每节点 1.46 kW（按 16.2kW/8NPU 风冷基线）·
          算力密度 ≈ {(752 * 384 / 559000).toFixed(3)} TFLOPS/W（FP16）。
          绿色数据中心 PUE 目标 ≤ 1.3，液冷方案可达 1.1–1.2。
        </div>
      </div>
    </div>
  );
}
