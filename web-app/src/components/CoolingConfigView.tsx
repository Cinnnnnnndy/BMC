/**
 * CoolingConfigView — 能效调速配置模板编辑器
 *
 * 可视化编辑 cooling_config / cooling_req 结构，
 * 实时生成 YAML 片段，可复制到 CSR Objects 中使用。
 */
import React, { useState, useMemo } from 'react';

const BG   = '#0a100e';
const CARD: React.CSSProperties = {
  background: '#0d1a16', border: '1px solid #1a2f26', borderRadius: 8, padding: '16px 18px',
};
const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono','Fira Code',Consolas,monospace",
};
const INPUT: React.CSSProperties = {
  width: '100%', background: '#060e0b', border: '1px solid #1a2f26',
  borderRadius: 4, color: '#a7d9c2', fontSize: 13, padding: '6px 10px',
  boxSizing: 'border-box', outline: 'none', ...MONO,
};
const SELECT: React.CSSProperties = {
  ...INPUT, cursor: 'pointer', appearance: 'none',
};

// ── 类型 ──────────────────────────────────────────────────────────────────
interface TempPoint { id: number; temp: number; fan_rpm: number }
interface FanZone   { id: number; fan_ids: string; min_rpm: number; max_rpm: number }

const COOLING_MODES = ['EnergySaving', 'FullSpeed', 'PerformancePriority', 'Custom'];

// ── YAML 生成器 ───────────────────────────────────────────────────────────
function generateYaml(cfg: ReturnType<typeof defaultCfg>): string {
  const lines: string[] = [];
  lines.push('cooling_config:');
  lines.push(`  smart_cooling: ${cfg.smartCooling}`);
  lines.push(`  fan_board: ${cfg.fanBoard}`);
  lines.push(`  slot_id: ${cfg.slotId}`);
  lines.push(`  cooling_mode: ${cfg.coolingMode}`);
  lines.push(`  initial_rpm_pct: ${cfg.initialRpmPct}`);
  lines.push('');
  if (cfg.tempPoints.length > 0) {
    lines.push('cooling_req:');
    for (const tp of cfg.tempPoints) {
      lines.push(`  - id: ${tp.id}`);
      lines.push(`    temp: ${tp.temp}`);
      lines.push(`    fan_rpm: ${tp.fan_rpm}`);
    }
    lines.push('');
  }
  if (cfg.fanZones.length > 0) {
    lines.push('fan_zone:');
    for (const fz of cfg.fanZones) {
      lines.push(`  - id: ${fz.id}`);
      lines.push(`    fan_ids: [${fz.fan_ids}]`);
      lines.push(`    min_rpm: ${fz.min_rpm}`);
      lines.push(`    max_rpm: ${fz.max_rpm}`);
    }
  }
  return lines.join('\n');
}

function defaultCfg() {
  return {
    slotId: 1,
    coolingMode: 'EnergySaving' as string,
    fanBoard: 1,
    initialRpmPct: 100,
    smartCooling: 'Enabled' as string,
    tempPoints: [
      { id: 1, temp: 35, fan_rpm: 2000 },
      { id: 2, temp: 55, fan_rpm: 4000 },
      { id: 3, temp: 75, fan_rpm: 6000 },
    ] as TempPoint[],
    fanZones: [
      { id: 1, fan_ids: '1,2,3', min_rpm: 1000, max_rpm: 8000 },
    ] as FanZone[],
  };
}

// ── 步骤标签 ──────────────────────────────────────────────────────────────
const STEPS = ['全局配置', '温度点', '调速风扇', '调速策略', '绑定区域'];

// ── 小标签 ────────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: '#4a7a62', marginBottom: 4, letterSpacing: '0.04em' }}>
      {children}
    </div>
  );
}

export function CoolingConfigView() {
  const [cfg, setCfg] = useState(defaultCfg);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const yaml = useMemo(() => generateYaml(cfg), [cfg]);

  const set = <K extends keyof ReturnType<typeof defaultCfg>>(
    key: K,
    val: ReturnType<typeof defaultCfg>[K]
  ) => setCfg((c) => ({ ...c, [key]: val }));

  const updateTp = (i: number, field: keyof TempPoint, val: number) =>
    setCfg((c) => {
      const pts = [...c.tempPoints];
      pts[i] = { ...pts[i], [field]: val };
      return { ...c, tempPoints: pts };
    });

  const addTp = () =>
    setCfg((c) => ({
      ...c,
      tempPoints: [
        ...c.tempPoints,
        { id: c.tempPoints.length + 1, temp: 65, fan_rpm: 5000 },
      ],
    }));

  const removeTp = (i: number) =>
    setCfg((c) => ({
      ...c,
      tempPoints: c.tempPoints.filter((_, j) => j !== i).map((tp, j) => ({ ...tp, id: j + 1 })),
    }));

  const copyYaml = () => {
    navigator.clipboard?.writeText(yaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: BG, color: '#c8d8cc', overflow: 'hidden' }}>

      {/* ── 左：YAML 预览 ── */}
      <div style={{
        width: 260, flexShrink: 0, background: '#080e0b',
        borderRight: '1px solid #1a2f26', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid #1a2f26',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399', letterSpacing: '0.04em' }}>
            能效调速配置编辑器
          </span>
          <button onClick={copyYaml} style={{
            padding: '2px 8px', fontSize: 10.5, borderRadius: 3, cursor: 'pointer',
            border: '1px solid #1a3028', background: copied ? 'rgba(52,211,153,.15)' : 'transparent',
            color: copied ? '#34d399' : '#4a7a62',
          }}>
            {copied ? '已复制' : '复制'}
          </button>
        </div>
        <pre style={{
          flex: 1, overflowY: 'auto', margin: 0,
          padding: '12px 14px', fontSize: 11.5, lineHeight: 1.75,
          color: '#6b8a78', ...MONO, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        }}>
          {yaml.split('\n').map((line, i) => {
            const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
            const isKey = line.trim().endsWith(':');
            const isValue = line.includes(':') && !isKey;
            const color = indent === 0 ? '#34d399'
              : indent === 2 && isKey ? '#4a8a6a'
              : indent === 2 && isValue ? '#a7d9c2'
              : '#6b8a78';
            return <div key={i} style={{ color }}>{line || ' '}</div>;
          })}
        </pre>
      </div>

      {/* ── 右：表单 ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* 步骤条 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          padding: '8px 20px', borderBottom: '1px solid #1a2f26',
          background: '#080e0b', flexShrink: 0,
        }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => setStep(i)}
                style={{
                  padding: '4px 10px', fontSize: 11.5, borderRadius: 4, cursor: 'pointer',
                  border: 'none', fontWeight: step === i ? 700 : 400,
                  background: step === i ? 'rgba(52,211,153,0.12)' : 'transparent',
                  color: step === i ? '#34d399' : '#4a7a62',
                }}
              >
                {String.fromCodePoint(9312 + i)}{s}
              </button>
              {i < STEPS.length - 1 && (
                <span style={{ color: '#1a2f26', fontSize: 11, padding: '0 2px' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* ① 全局配置 */}
          {step === 0 && (
            <div style={{ maxWidth: 500 }}>
              <div style={{ ...CARD, marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399', marginBottom: 14 }}>全局配置</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <Label>槽位号 (slot_id)</Label>
                    <input type="number" value={cfg.slotId} min={1}
                      onChange={(e) => set('slotId', parseInt(e.target.value) || 1)}
                      style={INPUT} />
                  </div>
                  <div>
                    <Label>风扇板数 (fan_board)</Label>
                    <input type="number" value={cfg.fanBoard} min={1}
                      onChange={(e) => set('fanBoard', parseInt(e.target.value) || 1)}
                      style={INPUT} />
                  </div>
                  <div>
                    <Label>智能调速 (smart_cooling)</Label>
                    <select value={cfg.smartCooling}
                      onChange={(e) => set('smartCooling', e.target.value)}
                      style={SELECT}>
                      <option>Enabled</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                  <div>
                    <Label>调速模式 (cooling_mode)</Label>
                    <select value={cfg.coolingMode}
                      onChange={(e) => set('coolingMode', e.target.value)}
                      style={SELECT}>
                      {COOLING_MODES.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label>初始转速 % (initial_rpm_pct)</Label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input type="range" min={10} max={100} value={cfg.initialRpmPct}
                        onChange={(e) => set('initialRpmPct', parseInt(e.target.value))}
                        style={{ flex: 1, accentColor: '#34d399' }} />
                      <span style={{ ...MONO, fontSize: 13, color: '#34d399', minWidth: 36 }}>
                        {cfg.initialRpmPct}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ② 温度点 */}
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#34d399' }}>温度-转速映射点</span>
                <button onClick={addTp} style={{
                  padding: '4px 12px', fontSize: 11.5, borderRadius: 4, cursor: 'pointer',
                  border: '1px solid #1a3028', background: 'rgba(52,211,153,0.1)', color: '#34d399',
                }}>+ 添加</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cfg.tempPoints.map((tp, i) => (
                  <div key={i} style={{ ...CARD, display: 'flex', gap: 14, alignItems: 'center' }}>
                    <span style={{ ...MONO, fontSize: 12, color: '#4a7a62', minWidth: 20 }}>#{tp.id}</span>
                    <div style={{ flex: 1 }}>
                      <Label>温度 (°C)</Label>
                      <input type="number" value={tp.temp}
                        onChange={(e) => updateTp(i, 'temp', parseInt(e.target.value) || 0)}
                        style={INPUT} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Label>风扇转速 (RPM)</Label>
                      <input type="number" value={tp.fan_rpm}
                        onChange={(e) => updateTp(i, 'fan_rpm', parseInt(e.target.value) || 0)}
                        style={INPUT} />
                    </div>
                    <button onClick={() => removeTp(i)} style={{
                      padding: '4px 8px', fontSize: 11, borderRadius: 3, cursor: 'pointer',
                      border: '1px solid #2a1a1a', background: 'transparent', color: '#7a4040',
                    }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ③ 调速风扇 */}
          {step === 2 && (
            <div style={{ maxWidth: 500 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399', marginBottom: 14 }}>风扇区域配置</div>
              {cfg.fanZones.map((fz, i) => (
                <div key={i} style={{ ...CARD, marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: '#4a7a62', marginBottom: 12 }}>区域 #{fz.id}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Label>风扇 ID 列表 (fan_ids)</Label>
                      <input value={fz.fan_ids}
                        onChange={(e) => setCfg((c) => {
                          const zs = [...c.fanZones];
                          zs[i] = { ...zs[i], fan_ids: e.target.value };
                          return { ...c, fanZones: zs };
                        })}
                        placeholder="1,2,3"
                        style={INPUT} />
                    </div>
                    <div>
                      <Label>最低转速 (RPM)</Label>
                      <input type="number" value={fz.min_rpm}
                        onChange={(e) => setCfg((c) => {
                          const zs = [...c.fanZones]; zs[i] = { ...zs[i], min_rpm: parseInt(e.target.value) || 0 };
                          return { ...c, fanZones: zs };
                        })}
                        style={INPUT} />
                    </div>
                    <div>
                      <Label>最高转速 (RPM)</Label>
                      <input type="number" value={fz.max_rpm}
                        onChange={(e) => setCfg((c) => {
                          const zs = [...c.fanZones]; zs[i] = { ...zs[i], max_rpm: parseInt(e.target.value) || 0 };
                          return { ...c, fanZones: zs };
                        })}
                        style={INPUT} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ④⑤ 占位步骤 */}
          {(step === 3 || step === 4) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{step === 3 ? '📋' : '🔗'}</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#4a7a62' }}>
                {STEPS[step]}
              </div>
              <div style={{ fontSize: 12.5, color: '#2a4a38', textAlign: 'center', maxWidth: 300 }}>
                此阶段配置依赖 CSR 项目模型，将在后续版本中与拓扑编辑器集成
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
