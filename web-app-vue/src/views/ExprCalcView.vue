<script setup lang="ts">
// 批量表达式计算器 — standalone web port
// Implements a self-contained pipe expression evaluator in vanilla JS.
// Pipe format: $1 | funcName arg1 arg2 | ...
// $1..$N refer to user inputs; $0 refers to the current pipeline value.
// Supported functions: expr, string.format, string.upper, string.lower,
//   string.sub, string.gsub, string.cmp, toHex, toBin, toOct, toInt,
//   add, sub, mul, div, mod, and, or, xor, shl, shr, not

import { ref, computed } from 'vue';

// ── Types ────────────────────────────────────────────────────────────────
type PipeValue = number | string | boolean | null;

interface StageResult {
  expr: string;
  output: PipeValue;
  error?: string;
}

// ── State ────────────────────────────────────────────────────────────────
const exprText   = ref('');
const inputCount = ref(1);
const inputVals  = ref<string[]>(['']);
const mode       = ref<'debug' | 'testcase'>('debug');

// debug mode outputs
const stageResults = ref<StageResult[]>([]);
const finalResult  = ref<PipeValue | null>(null);
const evalError    = ref('');

// test-case mode
const testCaseText   = ref('');
const testCaseError  = ref('');
const testCases      = ref<{ inputs: string[]; expected: string }[]>([]);
const batchResults   = ref<{ inputs: string[]; expected: string; actual: string; ok: boolean | null }[]>([]);
const batchSummary   = ref<{ total: number; matched: number; mismatched: number } | null>(null);

// ── Expression parsing ───────────────────────────────────────────────────
function parsePipe(raw: string): string[] {
  // Split by ' | ' but not inside quotes
  const stages: string[] = [];
  let cur = '';
  let inStr = false;
  let strChar = '';
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) {
      cur += ch;
      if (ch === strChar && raw[i - 1] !== '\\') inStr = false;
    } else if ((ch === '"' || ch === "'") ) {
      inStr = true; strChar = ch; cur += ch;
    } else if (ch === '|' && raw[i - 1] === ' ' && raw[i + 1] === ' ') {
      stages.push(cur.trimEnd());
      cur = '';
      i++; // skip trailing space
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) stages.push(cur.trim());
  return stages;
}

// Replace $1..$N with actual input values, $0 with pipeline value
function substituteInputs(exprStr: string, inputs: string[], pipeVal: PipeValue): string {
  let s = exprStr;
  // $0 → current pipeline value
  s = s.replace(/\$0\b/g, JSON.stringify(pipeVal));
  // $N → input values (1-indexed)
  for (let i = inputs.length; i >= 1; i--) {
    const v = inputs[i - 1];
    const num = Number(v);
    const rep = isNaN(num) ? JSON.stringify(v) : String(v);
    s = s.replace(new RegExp(`\\$${i}\\b`, 'g'), rep);
  }
  return s;
}

// Evaluate a single pipe stage
function evalStage(stageExpr: string, inputs: string[], pipeVal: PipeValue): PipeValue {
  const trimmed = stageExpr.trim();
  // Tokenize: first token is function name, rest are args
  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return pipeVal;

  const fn = tokens[0];
  const args = tokens.slice(1);

  switch (fn) {
    case 'expr': {
      // expr(arbitrary expression) or expr arbitrary_tokens
      const joined = args.join(' ');
      const sub = substituteInputs(joined || String(pipeVal), inputs, pipeVal);
      return safeEval(sub);
    }
    case 'string.format': {
      const fmt = unquote(args[0] ?? '');
      const fmtArgs = args.slice(1).map(a => {
        const sub = substituteInputs(a, inputs, pipeVal);
        return safeEval(sub);
      });
      return sprintfSimple(fmt, [pipeVal, ...fmtArgs]);
    }
    case 'string.upper':  return String(pipeVal).toUpperCase();
    case 'string.lower':  return String(pipeVal).toLowerCase();
    case 'string.sub': {
      const s = String(pipeVal);
      const i = Number(args[0] ?? 1);
      const j = args[1] !== undefined ? Number(args[1]) : s.length;
      // Lua-style 1-indexed, inclusive
      return s.slice(i - 1, j);
    }
    case 'string.gsub': {
      const s    = String(pipeVal);
      const pat  = unquote(args[0] ?? '');
      const repl = unquote(args[1] ?? '');
      return s.split(pat).join(repl);
    }
    case 'string.cmp': {
      const other = substituteInputs(unquote(args[0] ?? ''), inputs, pipeVal);
      return String(pipeVal) === other ? 0 : String(pipeVal) < other ? -1 : 1;
    }
    case 'toHex': {
      const v = toNum(pipeVal);
      const pad = args[0] ? Number(args[0]) : 0;
      return '0x' + (v >>> 0).toString(16).toUpperCase().padStart(pad, '0');
    }
    case 'toBin': return '0b' + (toNum(pipeVal) >>> 0).toString(2);
    case 'toOct': return '0o' + (toNum(pipeVal) >>> 0).toString(8);
    case 'toInt': return toNum(pipeVal) | 0;
    case 'add':   return toNum(pipeVal) + toNum(safeEval(substituteInputs(args.join(' '), inputs, pipeVal)));
    case 'sub':   return toNum(pipeVal) - toNum(safeEval(substituteInputs(args.join(' '), inputs, pipeVal)));
    case 'mul':   return toNum(pipeVal) * toNum(safeEval(substituteInputs(args.join(' '), inputs, pipeVal)));
    case 'div':   return toNum(pipeVal) / toNum(safeEval(substituteInputs(args.join(' '), inputs, pipeVal)));
    case 'mod':   return toNum(pipeVal) % toNum(safeEval(substituteInputs(args.join(' '), inputs, pipeVal)));
    case 'and':   return (toNum(pipeVal) & toNum(safeEval(substituteInputs(args.join(' '), inputs, pipeVal)))) >>> 0;
    case 'or':    return (toNum(pipeVal) | toNum(safeEval(substituteInputs(args.join(' '), inputs, pipeVal)))) >>> 0;
    case 'xor':   return (toNum(pipeVal) ^ toNum(safeEval(substituteInputs(args.join(' '), inputs, pipeVal)))) >>> 0;
    case 'shl':   return (toNum(pipeVal) << toNum(args[0] ?? '0')) >>> 0;
    case 'shr':   return (toNum(pipeVal) >>> toNum(args[0] ?? '0'));
    case 'not':   return (~toNum(pipeVal)) >>> 0;
    default: {
      // Treat whole stage as an arithmetic expression
      const sub = substituteInputs(trimmed, inputs, pipeVal);
      return safeEval(sub);
    }
  }
}

// Evaluate the full pipe expression with given input values
function evalExpression(raw: string, inputs: string[]): { stages: StageResult[]; final: PipeValue; error: string } {
  const stages = parsePipe(raw);
  if (stages.length === 0) return { stages: [], final: null, error: '表达式为空' };

  const results: StageResult[] = [];
  let pipeVal: PipeValue = null;
  let errorMsg = '';

  // First stage: evaluate base value (may reference $1..$N directly)
  try {
    const base = substituteInputs(stages[0], inputs, null as unknown as PipeValue);
    pipeVal = safeEval(base);
    results.push({ expr: stages[0], output: pipeVal });
  } catch (e) {
    errorMsg = String(e);
    results.push({ expr: stages[0], output: null, error: errorMsg });
    return { stages: results, final: null, error: errorMsg };
  }

  // Subsequent stages
  for (let i = 1; i < stages.length; i++) {
    try {
      pipeVal = evalStage(stages[i], inputs, pipeVal);
      results.push({ expr: stages[i], output: pipeVal });
    } catch (e) {
      errorMsg = String(e);
      results.push({ expr: stages[i], output: null, error: errorMsg });
      break;
    }
  }

  return { stages: results, final: pipeVal, error: errorMsg };
}

// ── Helpers ──────────────────────────────────────────────────────────────
function tokenize(s: string): string[] {
  const tokens: string[] = [];
  let cur = '';
  let inStr = false;
  let strCh = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      cur += ch;
      if (ch === strCh) { inStr = false; tokens.push(cur); cur = ''; }
    } else if (ch === '"' || ch === "'") {
      inStr = true; strCh = ch; cur += ch;
    } else if (ch === ' ' || ch === '\t') {
      if (cur) { tokens.push(cur); cur = ''; }
    } else {
      cur += ch;
    }
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function unquote(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function toNum(v: PipeValue): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (v === null) return 0;
  const s = String(v).trim();
  if (s.startsWith('0x') || s.startsWith('0X')) return parseInt(s, 16);
  if (s.startsWith('0b') || s.startsWith('0B')) return parseInt(s.slice(2), 2);
  if (s.startsWith('0o') || s.startsWith('0O')) return parseInt(s.slice(2), 8);
  const n = Number(s);
  return isNaN(n) ? 0 : n;
}

function safeEval(code: string): PipeValue {
  // Replace Lua/C-style operators with JS equivalents
  let js = code
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g,  '||')
    .replace(/~=/g, '!==')
    .replace(/\/\//g, 'Math.floor(')  // Lua integer division — simplified
    ;
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${js});`)();
    return result as PipeValue;
  } catch {
    throw new Error(`无法求值: ${code}`);
  }
}

// Minimal printf-style formatter for %s %d %x %X %f %o %b
function sprintfSimple(fmt: string, args: PipeValue[]): string {
  let argIdx = 0;
  return fmt.replace(/%([0-9]*)([sdxXfob])/g, (_, width, spec) => {
    const val = args[argIdx++];
    const w   = width ? parseInt(width) : 0;
    let s = '';
    const n = toNum(val);
    switch (spec) {
      case 's': s = String(val ?? ''); break;
      case 'd': s = Math.trunc(n).toString(); break;
      case 'f': s = n.toFixed(6); break;
      case 'x': s = (n >>> 0).toString(16); break;
      case 'X': s = (n >>> 0).toString(16).toUpperCase(); break;
      case 'o': s = (n >>> 0).toString(8); break;
      case 'b': s = (n >>> 0).toString(2); break;
    }
    return w ? s.padStart(w) : s;
  });
}

function formatVal(v: PipeValue): string {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'string') return `"${v}"`;
  return String(v);
}

// ── Debug mode ───────────────────────────────────────────────────────────
function runEval() {
  evalError.value = '';
  stageResults.value = [];
  finalResult.value = null;
  const inputs = inputVals.value.slice(0, inputCount.value);
  const r = evalExpression(exprText.value.trim(), inputs);
  stageResults.value = r.stages;
  finalResult.value = r.error ? null : r.final;
  evalError.value = r.error;
}

function addInput() {
  inputCount.value++;
  inputVals.value.push('');
}
function removeInput() {
  if (inputCount.value > 1) {
    inputCount.value--;
    inputVals.value.pop();
  }
}

// ── Test-case mode ───────────────────────────────────────────────────────
function loadTestCases() {
  testCaseError.value = '';
  batchResults.value = [];
  batchSummary.value = null;
  const lines = testCaseText.value.trim().split('\n').filter(l => l.trim());
  const cases: typeof testCases.value = [];
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2) { testCaseError.value = `格式错误: "${line}" (需要至少 输入 + 预期输出)`; return; }
    const expected = parts[parts.length - 1];
    const inputs   = parts.slice(0, parts.length - 1);
    cases.push({ inputs, expected });
  }
  testCases.value = cases;
  batchResults.value = cases.map(c => ({ ...c, actual: '', ok: null }));
}

function executeBatch() {
  const raw = exprText.value.trim();
  let matched = 0, mismatched = 0;
  batchResults.value = testCases.value.map(tc => {
    const r = evalExpression(raw, tc.inputs);
    const actual = r.error ? `[错误] ${r.error}` : formatVal(r.final);
    const ok = !r.error && String(r.final) === tc.expected;
    if (ok) matched++; else mismatched++;
    return { inputs: tc.inputs, expected: tc.expected, actual, ok };
  });
  batchSummary.value = { total: testCases.value.length, matched, mismatched };
}

function exportResults() {
  const rows = ['# 输入\t预期\t实际\t状态',
    ...batchResults.value.map(r =>
      `${r.inputs.join(' ')}\t${r.expected}\t${r.actual}\t${r.ok === null ? '-' : r.ok ? '✓' : '✗'}`)
  ].join('\n');
  navigator.clipboard.writeText(rows);
}

const hasResults = computed(() => batchResults.value.some(r => r.ok !== null));
</script>

<template>
  <div class="expr-root">
    <!-- Expression editor -->
    <div class="expr-editor-section">
      <div class="section-title">📝 管道表达式</div>
      <textarea
        class="expr-textarea"
        v-model="exprText"
        placeholder="示例: $1 | toHex 4&#10;示例: $1 | add $2 | toHex 8&#10;示例: $1 | string.format '%X'"
        spellcheck="false"
        @input="mode === 'debug' && runEval()"
      />
      <div class="expr-hint">
        支持: <code>$1 $2...</code> 输入 &nbsp;|&nbsp;
        <code>add sub mul div mod and or xor shl shr not toHex toBin toInt</code> &nbsp;|&nbsp;
        <code>string.format upper lower sub gsub cmp</code> &nbsp;|&nbsp;
        <code>expr(...)</code> JS表达式
      </div>
    </div>

    <!-- Mode toggle -->
    <div class="mode-toggle">
      <button class="mode-btn" :class="{ active: mode === 'debug' }" @click="mode = 'debug'">🐛 调试模式</button>
      <button class="mode-btn" :class="{ active: mode === 'testcase' }" @click="mode = 'testcase'">📋 用例模式</button>
    </div>

    <!-- ── DEBUG MODE ── -->
    <template v-if="mode === 'debug'">
      <!-- Inputs -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">📥 输入参数</div>
          <div class="input-actions">
            <button class="tiny-btn" @click="addInput">+ 添加</button>
            <button class="tiny-btn" :disabled="inputCount <= 1" @click="removeInput">− 移除</button>
          </div>
        </div>
        <div class="input-list">
          <div v-for="i in inputCount" :key="i" class="input-row">
            <span class="input-badge">${{ i }}</span>
            <input
              type="text"
              class="input-field"
              :placeholder="`输入 $${i} 的值`"
              v-model="inputVals[i - 1]"
              @input="runEval"
            />
          </div>
        </div>
      </div>

      <!-- Pipeline stages -->
      <div class="section" v-if="stageResults.length">
        <div class="section-title">🔀 管道处理</div>
        <div class="stage-list">
          <div
            v-for="(sr, idx) in stageResults"
            :key="idx"
            class="stage-item"
            :class="{ 'stage-error': sr.error }"
          >
            <div class="stage-expr">{{ sr.expr }}</div>
            <div class="stage-output" v-if="!sr.error">→ {{ formatVal(sr.output) }}</div>
            <div class="stage-output error" v-else>⚠ {{ sr.error }}</div>
          </div>
        </div>
      </div>

      <!-- Final result -->
      <div class="section result-box" v-if="!evalError && finalResult !== null">
        <div class="section-title">✨ 最终结果</div>
        <div class="final-value">{{ formatVal(finalResult) }}</div>
        <button class="copy-btn" @click="navigator.clipboard.writeText(String(finalResult))">📋 复制</button>
      </div>
      <div class="section error-box" v-if="evalError">
        <div class="section-title">⚠ 错误</div>
        <div class="error-text">{{ evalError }}</div>
      </div>
      <div class="section placeholder-box" v-if="!exprText.trim()">
        <div class="placeholder-text">在上方输入管道表达式后，实时显示计算结果</div>
      </div>
    </template>

    <!-- ── TEST-CASE MODE ── -->
    <template v-if="mode === 'testcase'">
      <div class="section">
        <div class="section-title">📥 加载测试用例</div>
        <textarea
          class="expr-textarea"
          v-model="testCaseText"
          style="min-height:140px"
          placeholder="每行格式: 输入1 [输入2 ...] 预期输出&#10;示例:&#10;5 000B&#10;10 0016&#10;255 00FF"
          spellcheck="false"
        />
        <div v-if="testCaseError" class="error-text" style="margin-top:6px">{{ testCaseError }}</div>
        <div class="action-bar">
          <button class="action-btn" @click="loadTestCases">📥 加载用例</button>
          <button class="action-btn" :disabled="!testCases.length" @click="executeBatch">▶ 批量执行</button>
          <button class="action-btn secondary" v-if="hasResults" @click="exportResults">💾 复制结果</button>
        </div>
      </div>

      <!-- Summary -->
      <div class="section" v-if="batchSummary">
        <div class="section-title">📊 统计</div>
        <div class="summary-row">
          <div class="stat-chip">共 <strong>{{ batchSummary.total }}</strong></div>
          <div class="stat-chip ok">通过 <strong>{{ batchSummary.matched }}</strong></div>
          <div class="stat-chip fail">失败 <strong>{{ batchSummary.mismatched }}</strong></div>
        </div>
      </div>

      <!-- Results table -->
      <div class="section" v-if="batchResults.length">
        <div class="section-title">结果明细</div>
        <div class="results-scroll">
          <table class="results-table">
            <thead>
              <tr><th>#</th><th>输入</th><th>预期</th><th>实际</th><th>状态</th></tr>
            </thead>
            <tbody>
              <tr
                v-for="(r, idx) in batchResults"
                :key="idx"
                :class="r.ok === true ? 'row-ok' : r.ok === false ? 'row-fail' : ''"
              >
                <td>{{ idx + 1 }}</td>
                <td><code>{{ r.inputs.join(' ') }}</code></td>
                <td><code>{{ r.expected }}</code></td>
                <td><code>{{ r.actual || '—' }}</code></td>
                <td class="status-cell">
                  <span v-if="r.ok === true">✅</span>
                  <span v-else-if="r.ok === false">❌</span>
                  <span v-else>—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.expr-root {
  --fg:       #e6e8ef;
  --bg:       #0e1117;
  --bg2:      #131826;
  --border:   #2a3050;
  --accent:   #7c8cf8;
  --accent2:  #4f6ef7;
  --desc:     #98a0b8;
  --error:    #f87171;
  --ok:       #4ade80;
  --btn-bg:   #4f6ef7;
  --btn-fg:   #fff;
  --mono:     ui-monospace, SFMono-Regular, Menlo, monospace;

  padding: 24px 16px;
  color: var(--fg);
  background: var(--bg);
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100%;
}

.section {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: var(--bg);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.section-header .section-title { margin-bottom: 0; }

/* Expression editor */
.expr-editor-section { margin-bottom: 14px; }
.expr-editor-section .section-title { margin-bottom: 8px; }

.expr-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  font-family: var(--mono);
  font-size: 13px;
  background: var(--bg2);
  border: 1px solid var(--border);
  color: var(--fg);
  border-radius: 6px;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
}
.expr-textarea:focus { border-color: var(--accent2); }

.expr-hint {
  margin-top: 6px;
  font-size: 11.5px;
  color: var(--desc);
  line-height: 1.6;
}
.expr-hint code {
  background: var(--bg2);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: var(--mono);
  color: var(--accent);
}

/* Mode toggle */
.mode-toggle {
  display: flex;
  margin-bottom: 16px;
  background: var(--bg2);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid var(--border);
  gap: 4px;
}
.mode-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--desc);
  cursor: pointer;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}
.mode-btn.active {
  background: var(--btn-bg);
  color: var(--btn-fg);
}
.mode-btn:hover:not(.active) { background: rgba(255,255,255,0.06); color: var(--fg); }

/* Input list */
.input-list { display: flex; flex-direction: column; gap: 8px; }
.input-row { display: flex; align-items: center; gap: 8px; }
.input-badge {
  min-width: 36px;
  text-align: center;
  background: #1e2a4a;
  color: var(--accent);
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  padding: 5px 0;
  border-radius: 4px;
}
.input-field {
  flex: 1;
  padding: 7px 10px;
  font-family: var(--mono);
  font-size: 13px;
  background: var(--bg2);
  border: 1px solid var(--border);
  color: var(--fg);
  border-radius: 5px;
  outline: none;
}
.input-field:focus { border-color: var(--accent2); }

.input-actions { display: flex; gap: 6px; }
.tiny-btn {
  padding: 4px 10px;
  font-size: 12px;
  background: #1e2a4a;
  color: var(--accent);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
}
.tiny-btn:hover { background: #253260; }
.tiny-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* Stages */
.stage-list { display: flex; flex-direction: column; gap: 8px; }
.stage-item {
  padding: 10px 14px;
  background: var(--bg2);
  border-left: 3px solid var(--accent2);
  border-radius: 0 6px 6px 0;
}
.stage-item.stage-error { border-left-color: var(--error); }
.stage-expr { font-family: var(--mono); font-size: 12px; color: var(--desc); margin-bottom: 4px; }
.stage-output { font-size: 14px; font-weight: 500; color: var(--fg); }
.stage-output.error { color: var(--error); font-size: 12px; }

/* Final result */
.result-box { background: linear-gradient(135deg, var(--bg2) 0%, #1a2240 100%); border-color: var(--accent2); }
.final-value {
  font-size: 28px;
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent);
  text-align: center;
  padding: 12px 0;
}
.copy-btn {
  display: block;
  margin: 0 auto;
  padding: 6px 16px;
  background: var(--btn-bg);
  color: var(--btn-fg);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}
.copy-btn:hover { background: #6b87ff; }

.error-box { border-color: var(--error); }
.error-text { color: var(--error); font-size: 13px; }

.placeholder-box { text-align: center; border-style: dashed; }
.placeholder-text { color: var(--desc); font-size: 13px; font-style: italic; }

/* Batch actions */
.action-bar { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.action-btn {
  padding: 7px 14px;
  background: var(--btn-bg);
  color: var(--btn-fg);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.action-btn:hover { background: #6b87ff; }
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.action-btn.secondary { background: #1e2540; color: var(--desc); }
.action-btn.secondary:hover { background: #253260; color: var(--fg); }

/* Summary */
.summary-row { display: flex; gap: 10px; }
.stat-chip {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  background: rgba(255,255,255,0.06);
  color: var(--fg);
}
.stat-chip.ok  { background: rgba(74,222,128,0.15); color: var(--ok); }
.stat-chip.fail{ background: rgba(248,113,113,0.15); color: var(--error); }

/* Results table */
.results-scroll { max-height: 420px; overflow-y: auto; border: 1px solid var(--border); border-radius: 6px; }
.results-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.results-table th {
  padding: 8px 10px;
  text-align: left;
  background: var(--bg2);
  color: var(--desc);
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 1px solid var(--border);
}
.results-table td {
  padding: 7px 10px;
  border-bottom: 1px solid var(--border);
  color: var(--fg);
}
.results-table code { font-family: var(--mono); font-size: 11.5px; }
.row-ok  td { background: rgba(74,222,128,0.06); }
.row-fail td { background: rgba(248,113,113,0.06); }
.status-cell { text-align: center; }
</style>
