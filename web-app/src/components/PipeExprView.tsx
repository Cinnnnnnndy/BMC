/**
 * PipeExprView — 管道表达式实时调试器
 *
 * 输入一条管道表达式（如 $1 | add $2 | toHex 8），
 * 逐步展示每个管道阶段的中间结果和最终输出。
 */
import { useState, useMemo } from 'react';

const BG   = '#0a0d18';
const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono','Fira Code',Consolas,monospace",
};
const CARD: React.CSSProperties = {
  background: '#0f1420', border: '1px solid #1e2a40', borderRadius: 8, padding: '16px 18px',
};

// ── 内置运算符 ──────────────────────────────────────────────────────────────
type StepResult = { op: string; value: unknown; type: string; error?: string };

function typeName(v: unknown): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
}

function applyOp(op: string, current: unknown, vars: Record<string, unknown>): unknown {
  const arg1 = op.trim();
  // 变量引用
  if (/^\$[a-zA-Z0-9_]+$/.test(arg1)) {
    const name = arg1.slice(1);
    if (!(name in vars)) throw new Error(`未定义变量 $${name}`);
    return vars[name];
  }
  // 带参数指令
  const [cmd, ...rest] = arg1.split(/\s+/);
  const argStr = rest.join(' ');
  const argNum = parseFloat(argStr);

  const resolveArg = (): unknown => {
    if (/^\$[a-zA-Z0-9_]+$/.test(argStr)) {
      const name = argStr.slice(1);
      if (!(name in vars)) throw new Error(`未定义变量 $${name}`);
      return vars[name];
    }
    return isNaN(argNum) ? argStr : argNum;
  };

  const cur = current as number;

  switch (cmd) {
    case 'add': return cur + (resolveArg() as number);
    case 'sub': return cur - (resolveArg() as number);
    case 'mul': return cur * (resolveArg() as number);
    case 'div': {
      const d = resolveArg() as number;
      if (d === 0) throw new Error('除以零');
      return cur / d;
    }
    case 'mod': return cur % (resolveArg() as number);
    case 'and': return (cur | 0) & ((resolveArg() as number) | 0);
    case 'or':  return (cur | 0) | ((resolveArg() as number) | 0);
    case 'xor': return (cur | 0) ^ ((resolveArg() as number) | 0);
    case 'shl': return (cur | 0) << ((resolveArg() as number) | 0);
    case 'shr': return (cur | 0) >> ((resolveArg() as number) | 0);
    case 'not': return ~(cur | 0);
    case 'toHex': {
      const w = parseInt(argStr, 10) || 8;
      return '0x' + (cur >>> 0).toString(16).toUpperCase().padStart(w, '0');
    }
    case 'toBin': {
      const w = parseInt(argStr, 10) || 8;
      return '0b' + (cur >>> 0).toString(2).padStart(w, '0');
    }
    case 'toOct': return '0o' + (cur >>> 0).toString(8);
    case 'toDec': return parseInt(String(current), 0);
    case 'toInt': return parseInt(String(current), 10);
    case 'toFloat': return parseFloat(String(current));
    case 'abs': return Math.abs(cur);
    case 'neg': return -cur;
    case 'round': return Math.round(cur);
    case 'floor': return Math.floor(cur);
    case 'ceil': return Math.ceil(cur);
    case 'pow':  return Math.pow(cur, resolveArg() as number);
    case 'log':  return Math.log(cur);
    case 'sqrt': return Math.sqrt(cur);
    case 'mask': {
      const bits = parseInt(argStr, 10) || 8;
      return (cur | 0) & ((1 << bits) - 1);
    }
    default:
      throw new Error(`未知运算符 "${cmd}"`);
  }
}

// ── 解析变量定义区 ────────────────────────────────────────────────────────
function parseVars(text: string): Record<string, unknown> {
  const scope: Record<string, unknown> = {};
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('//') || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 0) continue;
    const name = t.slice(0, eq).trim().replace(/^\$/, '');
    const val = t.slice(eq + 1).trim();
    const n = parseFloat(val);
    scope[name] = isNaN(n) ? val : n;
  }
  return scope;
}

// ── 执行管道 ──────────────────────────────────────────────────────────────
function runPipeline(expr: string, vars: Record<string, unknown>): StepResult[] {
  const stages = expr.split('|').map((s) => s.trim()).filter(Boolean);
  const results: StepResult[] = [];
  let current: unknown = undefined;

  for (const stage of stages) {
    try {
      current = applyOp(stage, current, vars);
      results.push({ op: stage, value: current, type: typeName(current) });
    } catch (e) {
      results.push({ op: stage, value: undefined, type: 'error', error: String(e instanceof Error ? e.message : e) });
      break;
    }
  }
  return results;
}

const TYPE_COLOR: Record<string, string> = {
  number: '#5eead4', string: '#a5f3fc', boolean: '#f472b6',
  null: '#94a3b8', array: '#fb923c', error: '#f87171',
};

const EXAMPLES = [
  { label: 'SMC 位域', expr: '$raw | and 0xFF | toHex 2', vars: '$raw = 16385' },
  { label: '传感器换算', expr: '$raw | mul $M | add $B | toFloat', vars: '$raw = 128\n$M = 1\n$B = -40' },
  { label: '十六进制格式', expr: '$val | toHex 8', vars: '$val = 255' },
  { label: '管道运算', expr: '$1 | add $2 | toHex 8', vars: '$1 = 255\n$2 = 16' },
];

export function PipeExprView() {
  const [expr, setExpr] = useState('$1 | add $2 | toHex 8');
  const [varText, setVarText] = useState('$1 = 255\n$2 = 16');

  const vars = useMemo(() => parseVars(varText), [varText]);
  const steps = useMemo(() => expr.trim() ? runPipeline(expr, vars) : [], [expr, vars]);
  const final = steps.length > 0 ? steps[steps.length - 1] : null;
  const hasError = steps.some((s) => s.type === 'error');

  const loadExample = (e: { expr: string; vars: string }) => {
    setExpr(e.expr);
    setVarText(e.vars);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: BG, color: '#c8d0e0', padding: '28px 32px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* 标题 */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#7c8cf8', margin: '0 0 4px', ...MONO }}>
            管道表达式计算器
          </h2>
          <p style={{ fontSize: 12.5, color: '#4a5a7a', margin: 0 }}>
            逐步调试管道表达式，实时显示每个阶段的中间结果
          </p>
        </div>

        {/* 快捷示例 */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          {EXAMPLES.map((ex) => (
            <button key={ex.label} onClick={() => loadExample(ex)} style={{
              padding: '4px 12px', fontSize: 11.5, borderRadius: 4, cursor: 'pointer',
              border: '1px solid #1e2a40', background: '#0f1420', color: '#5a6a8a',
              transition: 'color .15s, border-color .15s',
            }}
              onMouseOver={(e) => { (e.target as HTMLElement).style.color = '#7c8cf8'; }}
              onMouseOut={(e) => { (e.target as HTMLElement).style.color = '#5a6a8a'; }}
            >{ex.label}</button>
          ))}
        </div>

        {/* 输入区 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 18, alignItems: 'start' }}>
          <div style={CARD}>
            <div style={{ fontSize: 11, color: '#4a5a7a', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
              表达式 · 用 | 分隔各阶段
            </div>
            <input
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="$1 | add $2 | toHex 8"
              style={{
                width: '100%', background: '#080d1a', border: '1px solid #4f6ef7',
                borderRadius: 6, color: '#a5b4fc', fontSize: 15, fontWeight: 600,
                padding: '10px 14px', boxSizing: 'border-box', outline: 'none', ...MONO,
              }}
            />
          </div>
          <div style={{ ...CARD, minWidth: 200 }}>
            <div style={{ fontSize: 11, color: '#4a5a7a', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
              变量 · $name = value
            </div>
            <textarea
              value={varText}
              onChange={(e) => setVarText(e.target.value)}
              rows={4}
              style={{
                width: '100%', background: '#080d1a', border: '1px solid #1e2a40',
                borderRadius: 5, color: '#94a3b8', fontSize: 12.5,
                padding: '8px 10px', boxSizing: 'border-box', outline: 'none',
                resize: 'vertical', ...MONO,
              }}
              spellCheck={false}
            />
          </div>
        </div>

        {/* 步骤结果 */}
        {steps.length > 0 && (
          <div style={CARD}>
            <div style={{ fontSize: 11, color: '#4a5a7a', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
              执行步骤
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                const c = TYPE_COLOR[step.type] ?? '#c8d0e0';
                const displayVal = step.type === 'error'
                  ? step.error
                  : typeof step.value === 'string'
                    ? `"${step.value}"`
                    : String(step.value);
                return (
                  <div key={i}>
                    {i > 0 && (
                      <div style={{ width: 1, height: 12, background: '#1e2a40', margin: '0 0 0 16px' }} />
                    )}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      background: isLast && !hasError ? 'rgba(79,110,247,0.07)' : 'transparent',
                      border: isLast && !hasError ? '1px solid rgba(79,110,247,0.25)' : '1px solid transparent',
                      borderRadius: 6, padding: '10px 14px',
                    }}>
                      {/* 圆圈编号 */}
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: step.type === 'error' ? 'rgba(248,113,113,0.15)' : 'rgba(79,110,247,0.15)',
                        border: `1px solid ${step.type === 'error' ? '#f87171' : '#4f6ef7'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, color: step.type === 'error' ? '#f87171' : '#4f6ef7',
                        fontWeight: 700, flexShrink: 0, ...MONO,
                      }}>
                        {i + 1}
                      </div>
                      {/* 操作名 */}
                      <span style={{ fontSize: 13, color: '#7c8cf8', flex: '0 0 auto', minWidth: 160, ...MONO }}>
                        {step.op}
                      </span>
                      {/* 类型 */}
                      <span style={{ fontSize: 10.5, color: '#3a4a60', flex: '0 0 auto' }}>
                        {step.type}
                      </span>
                      {/* 结果值 */}
                      <span style={{ fontSize: 13, color: c, ...MONO, marginLeft: 'auto', wordBreak: 'break-all', textAlign: 'right' }}>
                        {displayVal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 最终结果 */}
        {final && !hasError && (
          <div style={{
            ...CARD, marginTop: 14,
            background: 'rgba(79,110,247,0.08)',
            border: '1px solid rgba(79,110,247,0.35)',
          }}>
            <div style={{ fontSize: 11, color: '#4f6ef7', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
              最终结果
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#c4cadc', ...MONO }}>
              {typeof final.value === 'string' ? `"${final.value}"` : String(final.value)}
            </div>
          </div>
        )}

        {/* 运算符参考 */}
        <div style={{ ...CARD, marginTop: 18 }}>
          <div style={{ fontSize: 11, color: '#4a5a7a', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
            支持的运算符
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 20px', fontSize: 11.5 }}>
            {[
              ['$name', '读取变量'],
              ['add N', '加法'],
              ['sub N', '减法'],
              ['mul N', '乘法'],
              ['div N', '除法'],
              ['mod N', '取模'],
              ['and N', '按位与'],
              ['or N',  '按位或'],
              ['xor N', '按位异或'],
              ['shl N', '左移'],
              ['shr N', '右移'],
              ['not',   '按位取反'],
              ['toHex N', '转十六进制 N 位'],
              ['toBin N', '转二进制 N 位'],
              ['toOct',   '转八进制'],
              ['toInt',   '转整数'],
              ['abs',     '绝对值'],
              ['round',   '四舍五入'],
              ['mask N',  '保留低 N 位'],
              ['pow N',   '幂运算'],
              ['sqrt',    '平方根'],
            ].map(([op, desc]) => (
              <div key={op as string} style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                <code style={{ color: '#7c8cf8', ...MONO, flexShrink: 0 }}>{op as string}</code>
                <span style={{ color: '#3a4a60' }}>{desc as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
