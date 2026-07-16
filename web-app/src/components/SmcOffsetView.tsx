/**
 * SmcOffsetView — 32-bit SMC 命令字编码/解码器
 *
 * 位字段布局（高→低）:
 *   31-26: Function  (6 bit)
 *   25-10: Command   (16 bit)
 *      9:  MS        (1 bit)
 *      8:  RW        (1 bit)
 *    7-0:  Param     (8 bit)
 */
import { useState, useCallback } from 'react';

const BG   = '#0a0d18';
const CARD: React.CSSProperties = {
  background: '#0f1420', border: '1px solid #1e2a40', borderRadius: 8, padding: '16px 18px',
};
const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono','Fira Code',Consolas,monospace",
};

// ── 位字段定义 ──────────────────────────────────────────────────────────────
const FIELDS = [
  { key: 'fn',  label: 'Function',  bits: 6,  shift: 26, color: '#f59e6b', desc: '31–26' },
  { key: 'cmd', label: 'Command',   bits: 16, shift: 10, color: '#4f6ef7', desc: '25–10' },
  { key: 'ms',  label: 'MS',        bits: 1,  shift:  9, color: '#a78bfa', desc: '9'     },
  { key: 'rw',  label: 'RW',        bits: 1,  shift:  8, color: '#34d399', desc: '8'     },
  { key: 'param',label: 'Param',    bits: 8,  shift:  0, color: '#f5b454', desc: '7–0'   },
] as const;

type FieldKey = typeof FIELDS[number]['key'];

function mask(bits: number) { return (1 << bits) - 1; }

// 解析用户输入（支持 0x 十六进制 / 0o 八进制 / 十进制）
function parseNum(s: string): number | null {
  const t = s.trim().toLowerCase();
  if (!t) return null;
  const n = t.startsWith('0x') ? parseInt(t, 16)
          : t.startsWith('0o') ? parseInt(t.slice(2), 8)
          : parseInt(t, 10);
  return isNaN(n) ? null : n;
}

function toHex(n: number) { return '0x' + (n >>> 0).toString(16).toUpperCase().padStart(8, '0'); }
function fieldHex(n: number, bits: number) { return '0x' + n.toString(16).toUpperCase().padStart(Math.ceil(bits / 4), '0'); }

// ── BitBar 可视化 ──────────────────────────────────────────────────────────
function BitBar({ value }: { value: number }) {
  const bits = Array.from({ length: 32 }, (_, i) => {
    const b = 31 - i;
    const on = (value >>> b) & 1;
    const f = FIELDS.find((f) => b >= f.shift && b < f.shift + f.bits);
    return { b, on, color: f?.color ?? '#2a3550' };
  });
  return (
    <div style={{ display: 'flex', gap: 2, height: 20, marginTop: 10 }}>
      {bits.map(({ b, on, color }) => (
        <div
          key={b}
          title={`bit ${b}`}
          style={{
            flex: 1, borderRadius: 2,
            background: on ? color : '#0f1622',
            border: `1px solid ${on ? color : '#1a2438'}`,
            opacity: on ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

export function SmcOffsetView() {
  // 统一 32-bit 源值
  const [hexInput, setHexInput] = useState('0x0C020101');
  const [fieldInputs, setFieldInputs] = useState<Record<FieldKey, string>>({
    fn: '0x0C', cmd: '0x0080', ms: '0x0', rw: '0x1', param: '0x01',
  });
  // 方向: 'from32' 从整数解字段 | 'to32' 从字段合成整数
  const [mode, setMode] = useState<'from32' | 'to32'>('from32');
  const [error, setError] = useState<string | null>(null);

  // 当前有效 32-bit 值
  const get32 = useCallback((): number | null => {
    if (mode === 'from32') {
      return parseNum(hexInput);
    } else {
      let v = 0;
      for (const f of FIELDS) {
        const n = parseNum(fieldInputs[f.key as FieldKey]);
        if (n === null || n < 0 || n > mask(f.bits)) return null;
        v |= (n & mask(f.bits)) << f.shift;
      }
      return v >>> 0;
    }
  }, [mode, hexInput, fieldInputs]);

  const value32 = get32() ?? 0;

  // 从 32-bit 解码各字段
  const decoded: Record<FieldKey, number> = Object.fromEntries(
    FIELDS.map((f) => [f.key, (value32 >>> f.shift) & mask(f.bits)])
  ) as Record<FieldKey, number>;

  // 从 32-bit 解码 → 填入字段输入框
  const handleDecode = useCallback(() => {
    const n = parseNum(hexInput);
    if (n === null) { setError('无效输入，支持 0x 十六进制、0o 八进制、十进制'); return; }
    setError(null);
    const next = Object.fromEntries(
      FIELDS.map((f) => {
        const v = (n >>> f.shift) & mask(f.bits);
        return [f.key, fieldHex(v, f.bits)];
      })
    ) as Record<FieldKey, string>;
    setFieldInputs(next);
    setMode('from32');
  }, [hexInput]);

  // 从字段合成 → 填入 32-bit 输入框
  const handleEncode = useCallback(() => {
    let v = 0;
    for (const f of FIELDS) {
      const n = parseNum(fieldInputs[f.key as FieldKey]);
      if (n === null) { setError(`${f.label} 输入无效`); return; }
      if (n < 0 || n > mask(f.bits)) { setError(`${f.label} 超出范围（最大 ${mask(f.bits)}）`); return; }
      v |= (n & mask(f.bits)) << f.shift;
    }
    setError(null);
    setHexInput(toHex(v >>> 0));
    setMode('to32');
  }, [fieldInputs]);

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: BG, color: '#c8d0e0', padding: '28px 32px', ...MONO }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* 标题 */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#7c8cf8', margin: '0 0 4px' }}>SMC 偏移量计算器</h2>
          <p style={{ fontSize: 12.5, color: '#4a5a7a', margin: 0 }}>
            32-bit SMC 命令字编解码 · 功能码 / 命令码 / 参数字段 · 支持十进制 / 十六进制 / 八进制
          </p>
        </div>

        {/* 32-bit 主输入 */}
        <div style={CARD}>
          <div style={{ fontSize: 11, color: '#4a5a7a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            32-bit 偏移量
          </div>
          <input
            value={hexInput}
            onChange={(e) => { setHexInput(e.target.value); setMode('from32'); }}
            placeholder="0x0C020101"
            style={{
              width: '100%', background: '#080d1a', border: '1px solid #4f6ef7',
              borderRadius: 6, color: '#7c8cf8', fontSize: 22, fontWeight: 700,
              padding: '10px 14px', boxSizing: 'border-box', outline: 'none',
              ...MONO, textAlign: 'center', letterSpacing: '0.05em',
            }}
          />
          <BitBar value={value32} />
          {error && (
            <div style={{ marginTop: 8, fontSize: 11.5, color: '#f87171' }}>⚠ {error}</div>
          )}
        </div>

        {/* 方向按钮 */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '14px 0' }}>
          <button onClick={handleDecode} style={{
            padding: '7px 22px', background: '#0f1a3a', border: '1px solid #4f6ef7',
            borderRadius: 6, color: '#7c8cf8', fontSize: 13, cursor: 'pointer', fontWeight: 600,
          }}>
            ↓ 解码到字段
          </button>
          <button onClick={handleEncode} style={{
            padding: '7px 22px', background: '#0f1a3a', border: '1px solid #34d399',
            borderRadius: 6, color: '#34d399', fontSize: 13, cursor: 'pointer', fontWeight: 600,
          }}>
            ↑ 从字段编码
          </button>
        </div>

        {/* 字段区 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
          {FIELDS.map((f) => {
            const dv = decoded[f.key as FieldKey];
            return (
              <div key={f.key} style={{ ...CARD, borderColor: f.color + '60', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: f.color, fontWeight: 600, letterSpacing: '0.05em' }}>
                    {f.label}
                  </span>
                  <span style={{ fontSize: 10, color: '#3a4a60' }}>bit {f.desc} · {f.bits}b</span>
                </div>
                <input
                  value={fieldInputs[f.key as FieldKey]}
                  onChange={(e) => {
                    setFieldInputs((prev) => ({ ...prev, [f.key]: e.target.value }));
                    setMode('to32');
                  }}
                  placeholder={fieldHex(0, f.bits)}
                  style={{
                    width: '100%', background: '#080d1a',
                    border: `1px solid ${f.color}50`,
                    borderRadius: 4, color: f.color, fontSize: 13, fontWeight: 600,
                    padding: '5px 8px', boxSizing: 'border-box', outline: 'none', ...MONO,
                  }}
                />
                <div style={{ marginTop: 5, fontSize: 11, color: '#3a4a60' }}>
                  dec <span style={{ color: '#5a6b80' }}>{dv}</span>
                  &nbsp;·&nbsp; hex <span style={{ color: f.color + 'cc' }}>{fieldHex(dv, f.bits)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 帮助 */}
        <div style={{ ...CARD, fontSize: 11.5, color: '#3a4a60', lineHeight: 1.8 }}>
          <span style={{ color: '#4a5a7a', fontWeight: 600 }}>格式支持：</span>
          &nbsp;十进制 <code style={{ color: '#7c8cf8' }}>12</code>
          &nbsp;· 十六进制 <code style={{ color: '#7c8cf8' }}>0x0C</code>
          &nbsp;· 八进制 <code style={{ color: '#7c8cf8' }}>0o14</code>
          <br />
          <span style={{ color: '#4a5a7a', fontWeight: 600 }}>输入后</span> 点击「解码到字段」或「从字段编码」刷新结果。
        </div>
      </div>
    </div>
  );
}
