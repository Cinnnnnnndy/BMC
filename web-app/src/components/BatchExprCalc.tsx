/**
 * BatchExprCalc — 批量表达式计算器
 *
 * Evaluates multiple JS-compatible expressions in batch with shared variable bindings.
 * Designed for BMC/IPMI sensor commissioning: quickly validate a set of sensor
 * raw→physical formulas against multiple raw readings.
 */
import { useState, useCallback } from 'react';

const CARD: React.CSSProperties = {
  background: '#0f1622', border: '1px solid #1e2d3d', borderRadius: 8,
  padding: '16px 18px',
};
const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
};
const TEXTAREA: React.CSSProperties = {
  width: '100%', background: '#0a1018', border: '1px solid #1e2d3d', borderRadius: 5,
  color: '#cbd5e1', fontSize: 12.5, padding: '10px 12px', boxSizing: 'border-box' as const,
  outline: 'none', resize: 'vertical', lineHeight: 1.6,
  ...{fontFamily: "'JetBrains Mono', Consolas, monospace"},
};

const DEFAULT_VARS = `// 变量定义（每行 name = value）
raw   = 125
M     = 1
B     = 0
K1    = 0
K2    = -2
Vref  = 3.3`;

const DEFAULT_EXPRS = `// 表达式（每行一个）
(M * raw + B * Math.pow(10,K1)) * Math.pow(10,K2)
raw * Vref / 255
(raw - 40) * 0.5
Math.round(raw / 256 * 100) + "%"
raw.toString(16).toUpperCase().padStart(2,"0")`;

interface EvalRow {
  expr: string;
  result: string;
  type: string;
  error: boolean;
}

function safeEval(expr: string, scope: Record<string, unknown>): { result: string; type: string; error: boolean } {
  try {
    const keys = Object.keys(scope);
    const vals = Object.values(scope);
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(...keys, `"use strict"; return (${expr});`);
    const result = fn(...vals);
    const type = Array.isArray(result) ? 'array' : typeof result;
    return { result: type === 'object' ? JSON.stringify(result) : String(result), type, error: false };
  } catch (e) {
    return { result: String(e instanceof Error ? e.message : e), type: 'error', error: true };
  }
}

function parseVars(text: string): { scope: Record<string, unknown>; errors: string[] } {
  const scope: Record<string, unknown> = { Math };
  const errors: string[] = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) { errors.push(`无效行: ${trimmed}`); continue; }
    const name = trimmed.slice(0, eq).trim();
    const valStr = trimmed.slice(eq + 1).trim();
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) { errors.push(`无效名称: ${name}`); continue; }
    try {
      const keys = Object.keys(scope);
      const vals = Object.values(scope);
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      scope[name] = new Function(...keys, `"use strict"; return (${valStr});`)(...vals);
    } catch (e) {
      errors.push(`${name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return { scope, errors };
}

const TYPE_COLOR: Record<string, string> = {
  number: '#5eead4',
  string: '#a5f3fc',
  boolean: '#f472b6',
  object: '#fb923c',
  array: '#fb923c',
  error: '#f87171',
};

export function BatchExprCalc() {
  const [vars, setVars]   = useState(DEFAULT_VARS);
  const [exprs, setExprs] = useState(DEFAULT_EXPRS);
  const [rows, setRows]   = useState<EvalRow[]>([]);
  const [varErrors, setVarErrors] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const run = useCallback(() => {
    const t0 = performance.now();
    const { scope, errors } = parseVars(vars);
    setVarErrors(errors);

    const result: EvalRow[] = [];
    for (const line of exprs.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) continue;
      const { result: res, type, error } = safeEval(trimmed, scope);
      result.push({ expr: trimmed, result: res, type, error });
    }
    setRows(result);
    setElapsed(performance.now() - t0);
  }, [vars, exprs]);

  const clearAll = () => { setRows([]); setVarErrors([]); setElapsed(null); };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#0a1018', color: '#cbd5e1', padding: '24px 28px' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#5eead4', margin: 0 }}>批量表达式计算器</h2>
          <span style={{ fontSize: 11.5, color: '#4a6070' }}>支持 JS 表达式 · Math 内置 · 变量复用</span>
        </div>
        <p style={{ fontSize: 12.5, color: '#4a6070', marginBottom: 24 }}>
          定义变量后批量求值，可用于 IPMI 传感器公式验证、批量寄存器计算等场景。
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Variables pane */}
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>变量定义</span>
              <span style={{ fontSize: 10.5, color: '#3d4f5f' }}>支持引用前面已定义的变量</span>
            </div>
            <textarea
              value={vars}
              onChange={(e) => setVars(e.target.value)}
              rows={12}
              style={TEXTAREA}
              spellCheck={false}
            />
            {varErrors.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 11, color: '#f87171' }}>
                {varErrors.map((e, i) => <div key={i}>⚠ {e}</div>)}
              </div>
            )}
          </div>

          {/* Expressions pane */}
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>表达式</span>
              <span style={{ fontSize: 10.5, color: '#3d4f5f' }}>每行一个，// 开头为注释</span>
            </div>
            <textarea
              value={exprs}
              onChange={(e) => setExprs(e.target.value)}
              rows={12}
              style={TEXTAREA}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Action bar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
          <button
            onClick={run}
            style={{ padding: '8px 24px', background: '#0e7490', border: 'none', borderRadius: 5, color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
          >
            ▶ 运行全部
          </button>
          <button
            onClick={clearAll}
            style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #1e2d3d', borderRadius: 5, color: '#7c8a99', fontSize: 13, cursor: 'pointer' }}
          >
            清空结果
          </button>
          {elapsed !== null && (
            <span style={{ fontSize: 11, color: '#3d4f5f' }}>耗时 {elapsed.toFixed(2)} ms · {rows.length} 行</span>
          )}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: '#3d4f5f' }}>Ctrl+Enter 快捷运行（需聚焦）</span>
        </div>

        {/* Results */}
        {rows.length > 0 && (
          <div style={CARD}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>结果</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', ...MONO, fontSize: 12 }}>
              <thead>
                <tr style={{ color: '#4a5a6a', borderBottom: '1px solid #1e2d3d' }}>
                  <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500, width: 30 }}>#</th>
                  <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500, width: '50%' }}>表达式</th>
                  <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500 }}>结果</th>
                  <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500, width: 64 }}>类型</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #0f1622' }}>
                    <td style={{ padding: '5px 10px', color: '#3d4f5f' }}>{i + 1}</td>
                    <td style={{ padding: '5px 10px', color: '#7c8a99', wordBreak: 'break-all' }}>{r.expr}</td>
                    <td style={{ padding: '5px 10px', color: TYPE_COLOR[r.type] ?? '#cbd5e1', wordBreak: 'break-all' }}>
                      {r.result}
                    </td>
                    <td style={{ padding: '5px 10px', color: '#3d4f5f', fontSize: 10.5 }}>{r.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Help */}
        <div style={{ ...CARD, marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>可用内置</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              ['Math.pow(x,n)', '幂运算'],
              ['Math.log(x)', '自然对数'],
              ['Math.floor/ceil/round', '取整'],
              ['Math.min/max(a,b,...)', '极值'],
              ['x.toString(16)', '转十六进制'],
              ['x.toFixed(n)', '定小数位'],
              ['(x>>>0)', '转无符号32位'],
            ].map(([fn, desc]) => (
              <div key={fn as string} style={{ fontSize: 11, color: '#5a6b7c' }}>
                <code style={{ color: '#7dd3fc' }}>{fn as string}</code>
                <span style={{ marginLeft: 4, color: '#3d4f5f' }}>— {desc as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
