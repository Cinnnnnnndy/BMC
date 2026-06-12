/**
 * SmcCalculator — IPMI SDR sensor formula calculator
 *
 * Converts raw ADC readings to physical values using the IPMI sensor linearization formula:
 *   y = (M × x + B × 10^K1) × 10^K2
 * Typical use: validating SMC chip sensor configurations before flashing.
 */
import { useState, useCallback } from 'react';

interface SensorRow {
  raw: string;
  result: string;
  error?: boolean;
}

const CARD: React.CSSProperties = {
  background: '#0f1622', border: '1px solid #1e2d3d', borderRadius: 8,
  padding: '16px 18px',
};
const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 11, color: '#5a6b7c', marginBottom: 5, letterSpacing: '0.05em',
};
const INPUT: React.CSSProperties = {
  width: '100%', background: '#0a1018', border: '1px solid #1e2d3d', borderRadius: 5,
  color: '#cbd5e1', fontSize: 13, padding: '6px 10px', boxSizing: 'border-box' as const,
  outline: 'none',
};
const BTN: React.CSSProperties = {
  padding: '7px 20px', background: '#0e7490', border: 'none', borderRadius: 5,
  color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600,
};

function calcIpmi(m: number, b: number, k1: number, k2: number, raw: number): number {
  return (m * raw + b * Math.pow(10, k1)) * Math.pow(10, k2);
}

export function SmcCalculator() {
  const [M, setM]   = useState('1');
  const [B, setB]   = useState('0');
  const [K1, setK1] = useState('0');
  const [K2, setK2] = useState('-2');
  const [rawText, setRawText] = useState('0\n64\n128\n192\n255');
  const [rows, setRows]       = useState<SensorRow[]>([]);
  const [sensorType, setSensorType] = useState('temperature');

  const SENSOR_PRESETS: Record<string, { M: string; B: string; K1: string; K2: string; label: string }> = {
    temperature: { M: '1',    B: '0',   K1: '0', K2: '-2', label: '温度 (°C)' },
    voltage12v:  { M: '6250', B: '0',   K1: '0', K2: '-4', label: '电压 12V' },
    voltage5v:   { M: '2500', B: '0',   K1: '0', K2: '-4', label: '电压 5V'  },
    fan:         { M: '10',   B: '0',   K1: '0', K2: '0',  label: '风扇 (RPM×10)' },
    power:       { M: '2',    B: '0',   K1: '0', K2: '0',  label: '功率 (W)' },
  };

  const applyPreset = (key: string) => {
    const p = SENSOR_PRESETS[key];
    setM(p.M); setB(p.B); setK1(p.K1); setK2(p.K2);
    setSensorType(key);
  };

  const calculate = useCallback(() => {
    const m = parseFloat(M), b = parseFloat(B), k1 = parseFloat(K1), k2 = parseFloat(K2);
    if ([m, b, k1, k2].some(isNaN)) { setRows([{ raw: '-', result: '参数有误', error: true }]); return; }
    const result: SensorRow[] = rawText.split('\n').map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      const x = parseFloat(trimmed);
      if (isNaN(x)) return { raw: trimmed, result: '非数字', error: true };
      const y = calcIpmi(m, b, k1, k2, x);
      return { raw: trimmed, result: Number.isInteger(y) ? String(y) : y.toFixed(4) };
    }).filter(Boolean) as SensorRow[];
    setRows(result);
  }, [M, B, K1, K2, rawText]);

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#0a1018', color: '#cbd5e1', padding: '24px 28px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#5eead4', marginBottom: 4 }}>SMC 传感器计算器</h2>
        <p style={{ fontSize: 12.5, color: '#4a6070', marginBottom: 24 }}>
          IPMI SDR 线性化公式：<code style={{ color: '#7dd3fc' }}>y = (M × x + B × 10^K1) × 10^K2</code>
        </p>

        {/* Presets */}
        <div style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#4a6070', alignSelf: 'center' }}>快速预设：</span>
          {Object.entries(SENSOR_PRESETS).map(([k, v]) => (
            <button key={k} onClick={() => applyPreset(k)} style={{
              padding: '4px 12px', fontSize: 11.5, borderRadius: 4, cursor: 'pointer',
              border: `1px solid ${sensorType === k ? '#0e7490' : '#1e2d3d'}`,
              background: sensorType === k ? 'rgba(14,116,144,0.2)' : 'transparent',
              color: sensorType === k ? '#5eead4' : '#7c8a99',
            }}>{v.label}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Coefficients */}
          <div style={CARD}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 14 }}>系数参数</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['M（灵敏度）', M, setM], ['B（偏置）', B, setB], ['K1（B 指数）', K1, setK1], ['K2（结果指数）', K2, setK2]].map(
                ([label, val, setter]) => (
                  <div key={label as string}>
                    <label style={LABEL}>{label as string}</label>
                    <input
                      type="number"
                      value={val as string}
                      onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                      style={INPUT}
                    />
                  </div>
                )
              )}
            </div>
            <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(14,116,144,0.1)', borderRadius: 5, fontSize: 11.5, color: '#7dd3fc' }}>
              示例（raw=100）：{(() => {
                const m = parseFloat(M), b = parseFloat(B), k1 = parseFloat(K1), k2 = parseFloat(K2);
                if ([m, b, k1, k2].some(isNaN)) return '—';
                const y = calcIpmi(m, b, k1, k2, 100);
                return Number.isInteger(y) ? String(y) : y.toFixed(4);
              })()}
            </div>
          </div>

          {/* Raw input */}
          <div style={CARD}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 14 }}>原始值（每行一个）</div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={6}
              style={{ ...INPUT, resize: 'vertical', fontFamily: 'monospace' }}
            />
            <button onClick={calculate} style={{ ...BTN, marginTop: 12, width: '100%' }}>批量计算</button>
          </div>
        </div>

        {/* Results */}
        {rows.length > 0 && (
          <div style={{ ...CARD, marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>计算结果</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: 'monospace' }}>
              <thead>
                <tr style={{ color: '#5a6b7c', borderBottom: '1px solid #1e2d3d' }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>原始值 (x)</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>物理值 (y)</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>十六进制</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #111e28' }}>
                    <td style={{ padding: '5px 8px', color: '#94a3b8' }}>{r.raw}</td>
                    <td style={{ padding: '5px 8px', color: r.error ? '#f87171' : '#5eead4' }}>{r.result}</td>
                    <td style={{ padding: '5px 8px', color: '#4a6070' }}>
                      {!r.error && !isNaN(parseInt(r.raw)) ? `0x${parseInt(r.raw).toString(16).toUpperCase().padStart(2, '0')}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Threshold helper */}
        <div style={{ ...CARD, marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>阈值参考表</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, color: '#7c8a99' }}>
            <thead>
              <tr style={{ color: '#5a6b7c', borderBottom: '1px solid #1e2d3d' }}>
                {['阈值类型', 'SDR 字段', '典型 raw', '说明'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['LNR', 'lower_non_recoverable', '0x01', '不可恢复下限'],
                ['LCR', 'lower_critical',        '0x0A', '严重下限'],
                ['LNC', 'lower_non_critical',    '0x14', '非严重下限'],
                ['UNC', 'upper_non_critical',    '0xD0', '非严重上限'],
                ['UCR', 'upper_critical',        '0xE0', '严重上限'],
                ['UNR', 'upper_non_recoverable', '0xF0', '不可恢复上限'],
              ].map(([t, f, raw, desc]) => (
                <tr key={t} style={{ borderBottom: '1px solid #0f1622' }}>
                  <td style={{ padding: '4px 8px', color: '#5eead4', fontFamily: 'monospace' }}>{t}</td>
                  <td style={{ padding: '4px 8px', fontFamily: 'monospace', fontSize: 11 }}>{f}</td>
                  <td style={{ padding: '4px 8px', fontFamily: 'monospace' }}>{raw}</td>
                  <td style={{ padding: '4px 8px' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
