<script setup lang="ts">
// 批量表达式计算器 — standalone web port
// Implements a self-contained pipe expression evaluator in vanilla JS.
// Pipe format: $1 | funcName arg1 arg2 | ...
// $1..$N refer to user inputs; $0 refers to the current pipeline value.
// Supported functions: expr, string.format, string.upper, string.lower,
//   string.sub, string.gsub, string.cmp, toHex, toBin, toOct, toInt,
//   add, sub, mul, div, mod, and, or, xor, shl, shr, not

import { ref, computed, nextTick } from 'vue';

// ── Types ────────────────────────────────────────────────────────────────
type PipeValue = number | string | boolean | null;

interface StageResult {
  expr: string;
  output: PipeValue;
  error?: string;
}

interface HistoryEntry {
  expr: string;
  timestamp: number;
}

type DiffChar = { char: string; type: 'match' | 'extra' | 'missing' };

// ── State ────────────────────────────────────────────────────────────────
const exprText   = ref('');
const inputCount = ref(1);
const inputVals  = ref<string[]>(['']);

// debug panel outputs
const stageResults = ref<StageResult[]>([]);
const finalResult  = ref<PipeValue | null>(null);
const evalError    = ref('');

// test-case panel (always visible, collapsible)
const testPanelCollapsed = ref(false);
const testCaseText       = ref('');
const testCaseError      = ref('');
const testCases          = ref<{ inputs: string[]; expected: string }[]>([]);
const batchResults       = ref<{ inputs: string[]; expected: string; actual: string; ok: boolean | null }[]>([]);
const batchSummary       = ref<{ total: number; matched: number; mismatched: number } | null>(null);
const validRowCount      = ref(0);

// function reference panel
const funcRefCollapsed = ref(true);

// history
const historyOpen  = ref(false);
const historyList  = ref<HistoryEntry[]>([]);

// export dropdown
const exportDropOpen = ref(false);

// ── History helpers ───────────────────────────────────────────────────────
const HISTORY_KEY = 'expr-calc-history';
const HISTORY_MAX = 20;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    historyList.value = raw ? JSON.parse(raw) : [];
  } catch {
    historyList.value = [];
  }
}

function saveToHistory(expr: string) {
  if (!expr.trim()) return;
  loadHistory();
  // remove duplicates
  const list = historyList.value.filter(h => h.expr !== expr);
  list.unshift({ expr, timestamp: Date.now() });
  if (list.length > HISTORY_MAX) list.splice(HISTORY_MAX);
  historyList.value = list;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

function useHistoryEntry(entry: HistoryEntry) {
  exprText.value = entry.expr;
  historyOpen.value = false;
  runEval();
}

function formatHistoryTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mo}-${dd} ${hh}:${mm}`;
}

loadHistory();

// ── Expression parsing ───────────────────────────────────────────────────
function parsePipe(raw: string): string[] {
  const stages: string[] = [];
  let cur = '';
  let inStr = false;
  let strChar = '';
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) {
      cur += ch;
      if (ch === strChar && raw[i - 1] !== '\\') inStr = false;
    } else if ((ch === '"' || ch === "'")) {
      inStr = true; strChar = ch; cur += ch;
    } else if (ch === '|' && raw[i - 1] === ' ' && raw[i + 1] === ' ') {
      stages.push(cur.trimEnd());
      cur = '';
      i++;
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) stages.push(cur.trim());
  return stages;
}

function substituteInputs(exprStr: string, inputs: string[], pipeVal: PipeValue): string {
  let s = exprStr;
  s = s.replace(/\$0\b/g, JSON.stringify(pipeVal));
  for (let i = inputs.length; i >= 1; i--) {
    const v = inputs[i - 1];
    const num = Number(v);
    const rep = isNaN(num) ? JSON.stringify(v) : String(v);
    s = s.replace(new RegExp(`\\$${i}\\b`, 'g'), rep);
  }
  return s;
}

function evalStage(stageExpr: string, inputs: string[], pipeVal: PipeValue): PipeValue {
  const trimmed = stageExpr.trim();
  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return pipeVal;

  const fn = tokens[0];
  const args = tokens.slice(1);

  switch (fn) {
    case 'expr': {
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
      const sub = substituteInputs(trimmed, inputs, pipeVal);
      return safeEval(sub);
    }
  }
}

function evalExpression(raw: string, inputs: string[]): { stages: StageResult[]; final: PipeValue; error: string } {
  const stages = parsePipe(raw);
  if (stages.length === 0) return { stages: [], final: null, error: '表达式为空' };

  const results: StageResult[] = [];
  let pipeVal: PipeValue = null;
  let errorMsg = '';

  try {
    const base = substituteInputs(stages[0], inputs, null as unknown as PipeValue);
    pipeVal = safeEval(base);
    results.push({ expr: stages[0], output: pipeVal });
  } catch (e) {
    errorMsg = String(e);
    results.push({ expr: stages[0], output: null, error: errorMsg });
    return { stages: results, final: null, error: errorMsg };
  }

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
  let js = code
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g,  '||')
    .replace(/~=/g, '!==')
    .replace(/\/\//g, 'Math.floor(');
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${js});`)();
    return result as PipeValue;
  } catch {
    throw new Error(`无法求值: ${code}`);
  }
}

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

// ── Char-level diff ───────────────────────────────────────────────────────
function charDiff(expected: string, actual: string): { expected: DiffChar[]; actual: DiffChar[] } {
  // Simple LCS-based character diff
  const a = expected.split('');
  const b = actual.split('');
  const m = a.length, n = b.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Traceback
  const expOut: DiffChar[] = [];
  const actOut: DiffChar[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      expOut.unshift({ char: a[i - 1], type: 'match' });
      actOut.unshift({ char: b[j - 1], type: 'match' });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      actOut.unshift({ char: b[j - 1], type: 'extra' });
      j--;
    } else {
      expOut.unshift({ char: a[i - 1], type: 'missing' });
      i--;
    }
  }
  return { expected: expOut, actual: actOut };
}

// ── Debug mode ───────────────────────────────────────────────────────────
function runEval() {
  evalError.value = '';
  stageResults.value = [];
  finalResult.value = null;
  const inputs = inputVals.value.slice(0, inputCount.value);
  const raw = exprText.value.trim();
  if (!raw) return;
  const r = evalExpression(raw, inputs);
  stageResults.value = r.stages;
  finalResult.value = r.error ? null : r.final;
  evalError.value = r.error;
  saveToHistory(raw);
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

// Fill debug inputs from a failing batch row and run eval
function debugBatchRow(inputs: string[]) {
  // extend inputVals/inputCount to fit
  inputCount.value = inputs.length;
  inputVals.value = [...inputs];
  runEval();
  // scroll to top
  nextTick(() => {
    document.querySelector('.debug-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ── Test-case mode ───────────────────────────────────────────────────────
function parseTestCaseLines(text: string): { cases: { inputs: string[]; expected: string }[]; error: string; count: number } {
  const lines = text.trim().split('\n');
  const cases: { inputs: string[]; expected: string }[] = [];
  let count = 0;
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li].trim();
    if (!line) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 2) {
      return { cases: [], error: `第 ${li + 1} 行格式错误：列数为 ${parts.length}，预期至少 2 列（输入值 + 预期输出）`, count: 0 };
    }
    const expected = parts[parts.length - 1];
    const inputs   = parts.slice(0, parts.length - 1);
    cases.push({ inputs, expected });
    count++;
  }
  return { cases, error: '', count };
}

// Reactive valid row count for badge
function updateValidRowCount() {
  const { count } = parseTestCaseLines(testCaseText.value);
  validRowCount.value = count;
}

function loadTestCases() {
  testCaseError.value = '';
  batchResults.value = [];
  batchSummary.value = null;
  const { cases, error } = parseTestCaseLines(testCaseText.value);
  if (error) { testCaseError.value = error; return; }
  testCases.value = cases;
  batchResults.value = cases.map(c => ({ ...c, actual: '', ok: null }));
}

function executeBatch() {
  const raw = exprText.value.trim();
  let matched = 0, mismatched = 0;
  batchResults.value = testCases.value.map(tc => {
    const r = evalExpression(raw, tc.inputs);
    const actual = r.error ? `[错误] ${r.error}` : String(r.final);
    const ok = !r.error && actual === tc.expected;
    if (ok) matched++; else mismatched++;
    return { inputs: tc.inputs, expected: tc.expected, actual, ok };
  });
  batchSummary.value = { total: testCases.value.length, matched, mismatched };
}

// ── Export ────────────────────────────────────────────────────────────────
function exportAs(format: 'tsv' | 'markdown' | 'json') {
  exportDropOpen.value = false;
  let text = '';
  if (format === 'tsv') {
    text = ['输入\t预期\t实际\t状态',
      ...batchResults.value.map(r =>
        `${r.inputs.join(' ')}\t${r.expected}\t${r.actual}\t${r.ok === null ? '-' : r.ok ? '✓' : '✗'}`)
    ].join('\n');
  } else if (format === 'markdown') {
    text = '| 输入 | 预期 | 实际 | 状态 |\n|------|------|------|------|\n' +
      batchResults.value.map(r =>
        `| ${r.inputs.join(' ')} | ${r.expected} | ${r.actual} | ${r.ok === null ? '-' : r.ok ? '✓' : '✗'} |`
      ).join('\n');
  } else {
    text = JSON.stringify(batchResults.value.map(r => ({
      inputs: r.inputs,
      expected: r.expected,
      actual: r.actual,
      ok: r.ok
    })), null, 2);
  }
  navigator.clipboard.writeText(text);
}

const hasResults = computed(() => batchResults.value.some(r => r.ok !== null));

// ── Function reference data ───────────────────────────────────────────────
const funcCategories = [
  {
    name: '算术运算',
    funcs: [
      { name: 'add', sig: 'add <数值>', ex: '$1 | add $2' },
      { name: 'sub', sig: 'sub <数值>', ex: '$1 | sub 10' },
      { name: 'mul', sig: 'mul <数值>', ex: '$1 | mul 2' },
      { name: 'div', sig: 'div <数值>', ex: '$1 | div 4' },
      { name: 'mod', sig: 'mod <数值>', ex: '$1 | mod 16' },
    ]
  },
  {
    name: '位运算',
    funcs: [
      { name: 'and', sig: 'and <数值>', ex: '$1 | and 0xFF' },
      { name: 'or',  sig: 'or <数值>',  ex: '$1 | or 0x80' },
      { name: 'xor', sig: 'xor <数值>', ex: '$1 | xor 0xAA' },
      { name: 'shl', sig: 'shl <位数>', ex: '$1 | shl 4' },
      { name: 'shr', sig: 'shr <位数>', ex: '$1 | shr 2' },
      { name: 'not', sig: 'not',        ex: '$1 | not' },
    ]
  },
  {
    name: '格式转换',
    funcs: [
      { name: 'toHex', sig: 'toHex [位数]', ex: '$1 | toHex 8' },
      { name: 'toBin', sig: 'toBin',         ex: '$1 | toBin' },
      { name: 'toOct', sig: 'toOct',         ex: '$1 | toOct' },
      { name: 'toInt', sig: 'toInt',         ex: '$1 | toInt' },
    ]
  },
  {
    name: '字符串',
    funcs: [
      { name: 'string.format', sig: 'string.format <格式串>', ex: "$1 | string.format '%08X'" },
      { name: 'string.upper',  sig: 'string.upper',           ex: '$1 | string.upper' },
      { name: 'string.lower',  sig: 'string.lower',           ex: '$1 | string.lower' },
      { name: 'string.sub',    sig: 'string.sub <i> [j]',     ex: '$1 | string.sub 1 4' },
      { name: 'string.gsub',   sig: 'string.gsub <模式> <替换>', ex: "$1 | string.gsub '0x' ''" },
      { name: 'string.cmp',    sig: 'string.cmp <对比值>',    ex: "$1 | string.cmp 'OK'" },
    ]
  },
  {
    name: '表达式',
    funcs: [
      { name: 'expr', sig: 'expr(<JS表达式>)', ex: '$1 | expr($0 * 2 + 1)' },
    ]
  },
];

function insertFunc(funcName: string) {
  const insert = ` | ${funcName}`;
  exprText.value = exprText.value + insert;
  funcRefCollapsed.value = true;
}
</script>

<template>
  <div class="expr-root" @click.self="exportDropOpen = false; historyOpen = false">

    <!-- ══ SHARED EXPRESSION EDITOR ══ -->
    <div class="section expr-editor-section debug-panel">
      <div class="section-header">
        <div class="section-title">📝 管道表达式</div>
        <div class="header-actions">
          <!-- History button -->
          <div class="history-wrap">
            <button class="icon-btn" title="历史记录" @click.stop="historyOpen = !historyOpen; loadHistory()">
              🕐
            </button>
            <div v-if="historyOpen" class="history-dropdown" @click.stop>
              <div class="history-header">最近表达式</div>
              <div v-if="historyList.length === 0" class="history-empty">暂无历史</div>
              <div
                v-for="(entry, i) in historyList"
                :key="i"
                class="history-item"
                @click="useHistoryEntry(entry)"
              >
                <span class="history-expr">{{ entry.expr.slice(0, 60) }}{{ entry.expr.length > 60 ? '…' : '' }}</span>
                <span class="history-time">{{ formatHistoryTime(entry.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <textarea
        class="expr-textarea"
        v-model="exprText"
        placeholder="示例: $1 | toHex 4&#10;示例: $1 | add $2 | toHex 8&#10;示例: $1 | string.format '%X'"
        spellcheck="false"
        @input="runEval"
      />
      <div class="expr-hint">
        支持: <code>$1 $2...</code> 输入 &nbsp;|&nbsp;
        <code>add sub mul div mod and or xor shl shr not toHex toBin toInt</code> &nbsp;|&nbsp;
        <code>string.format upper lower sub gsub cmp</code> &nbsp;|&nbsp;
        <code>expr(...)</code> JS表达式
      </div>

      <!-- Function reference (collapsible) -->
      <div class="func-ref-wrap">
        <button class="collapse-toggle" @click="funcRefCollapsed = !funcRefCollapsed">
          <span class="toggle-arrow" :class="{ open: !funcRefCollapsed }">▸</span>
          📖 函数参考
        </button>
        <div v-if="!funcRefCollapsed" class="func-ref-grid">
          <div v-for="cat in funcCategories" :key="cat.name" class="func-cat">
            <div class="func-cat-name">{{ cat.name }}</div>
            <div v-for="fn in cat.funcs" :key="fn.name" class="func-card">
              <div class="func-sig">{{ fn.sig }}</div>
              <div class="func-ex">{{ fn.ex }}</div>
              <button class="insert-btn" @click="insertFunc(fn.name)">插入</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ DEBUG PANEL ══ -->
    <div class="section">
      <!-- Inputs -->
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

      <!-- Pipeline stages -->
      <div v-if="stageResults.length" style="margin-top:16px">
        <div class="section-title">🔀 管道处理</div>
        <div class="stage-list">
          <template v-for="(sr, idx) in stageResults" :key="idx">
            <div class="stage-arrow" v-if="idx > 0">→</div>
            <div
              class="stage-item"
              :class="{ 'stage-error': sr.error }"
            >
              <div class="stage-badge">阶段 {{ idx + 1 }}</div>
              <div class="stage-expr">{{ sr.expr }}</div>
              <div class="stage-output" v-if="!sr.error">→ {{ formatVal(sr.output) }}</div>
              <div class="stage-output error" v-else>⚠ {{ sr.error }}</div>
            </div>
          </template>
        </div>
      </div>

      <!-- Final result -->
      <div class="result-box" v-if="!evalError && finalResult !== null" style="margin-top:16px">
        <div class="section-title">✨ 最终结果</div>
        <div class="final-value">{{ formatVal(finalResult) }}</div>
        <button class="copy-btn" @click="navigator.clipboard.writeText(String(finalResult))">📋 复制</button>
      </div>
      <div class="error-box" v-if="evalError" style="margin-top:16px">
        <div class="section-title">⚠ 错误</div>
        <div class="error-text">{{ evalError }}</div>
      </div>
      <div class="placeholder-box" v-if="!exprText.trim()" style="margin-top:16px">
        <div class="placeholder-text">在上方输入管道表达式后，实时显示计算结果</div>
      </div>
    </div>

    <!-- ══ BATCH TEST CASE PANEL ══ -->
    <div class="section">
      <button class="collapse-toggle panel-toggle" @click="testPanelCollapsed = !testPanelCollapsed">
        <span class="toggle-arrow" :class="{ open: !testPanelCollapsed }">▾</span>
        批量测试用例
      </button>

      <div v-if="!testPanelCollapsed" class="test-panel-body">
        <!-- Format instructions -->
        <div class="format-hint">
          <div class="format-hint-title">格式说明</div>
          <pre class="format-hint-code">格式：每行一个用例，空格分隔，最后一列为预期输出
例：100 50 0X00000096
    200 30 0X000000E6</pre>
        </div>

        <textarea
          class="expr-textarea"
          v-model="testCaseText"
          style="min-height:140px; margin-top:10px"
          placeholder="每行格式: 输入1 [输入2 ...] 预期输出&#10;示例:&#10;5 000B&#10;10 0016&#10;255 00FF"
          spellcheck="false"
          @input="updateValidRowCount"
        />
        <div v-if="testCaseError" class="error-text" style="margin-top:6px">{{ testCaseError }}</div>

        <div class="action-bar">
          <div class="load-wrap">
            <button class="action-btn" @click="loadTestCases">
              📥 加载用例
            </button>
            <span v-if="validRowCount > 0" class="row-badge">{{ validRowCount }} 行</span>
          </div>
          <button class="action-btn" :disabled="!testCases.length" @click="executeBatch">▶ 批量执行</button>

          <!-- Export dropdown -->
          <div class="export-wrap" v-if="hasResults">
            <button class="action-btn secondary" @click.stop="exportDropOpen = !exportDropOpen">
              💾 导出 ▾
            </button>
            <div v-if="exportDropOpen" class="export-dropdown" @click.stop>
              <div class="export-item" @click="exportAs('tsv')">TSV（制表符分隔）</div>
              <div class="export-item" @click="exportAs('markdown')">Markdown 表格</div>
              <div class="export-item" @click="exportAs('json')">JSON 数组</div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div v-if="batchSummary" style="margin-top:14px">
          <div class="section-title">📊 统计</div>
          <div class="summary-row">
            <div class="stat-chip">共 <strong>{{ batchSummary.total }}</strong></div>
            <div class="stat-chip ok">通过 <strong>{{ batchSummary.matched }}</strong></div>
            <div class="stat-chip fail">失败 <strong>{{ batchSummary.mismatched }}</strong></div>
          </div>
        </div>

        <!-- Results table -->
        <div v-if="batchResults.length" style="margin-top:14px">
          <div class="section-title">结果明细</div>
          <div class="results-scroll">
            <table class="results-table">
              <thead>
                <tr><th>#</th><th>输入</th><th>预期</th><th>实际</th><th>状态</th><th></th></tr>
              </thead>
              <tbody>
                <tr
                  v-for="(r, idx) in batchResults"
                  :key="idx"
                  :class="r.ok === true ? 'row-ok' : r.ok === false ? 'row-fail' : ''"
                >
                  <td>{{ idx + 1 }}</td>
                  <td><code>{{ r.inputs.join(' ') }}</code></td>
                  <td>
                    <code v-if="r.ok !== false">{{ r.expected }}</code>
                    <span v-else class="diff-text">
                      <span
                        v-for="(dc, ci) in charDiff(r.expected, r.actual).expected"
                        :key="ci"
                        :class="dc.type === 'match' ? 'diff-match' : 'diff-exp-miss'"
                      >{{ dc.type === 'missing' ? '␣' : dc.char }}</span>
                    </span>
                  </td>
                  <td>
                    <code v-if="r.ok !== false">{{ r.actual || '—' }}</code>
                    <span v-else class="diff-text">
                      <span
                        v-for="(dc, ci) in charDiff(r.expected, r.actual).actual"
                        :key="ci"
                        :class="dc.type === 'match' ? 'diff-match' : 'diff-act-extra'"
                      >{{ dc.char }}</span>
                    </span>
                  </td>
                  <td class="status-cell">
                    <span v-if="r.ok === true">✅</span>
                    <span v-else-if="r.ok === false">❌</span>
                    <span v-else>—</span>
                  </td>
                  <td>
                    <button
                      v-if="r.ok === false"
                      class="debug-row-btn"
                      @click="debugBatchRow(r.inputs)"
                      title="在调试区打开此用例"
                    >↑ 在调试区打开</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

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
  max-width: 960px;
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
  margin-bottom: 10px;
}
.section-header .section-title { margin-bottom: 0; }

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Expression editor */
.expr-editor-section { margin-bottom: 0; }

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

/* History */
.history-wrap {
  position: relative;
}
.icon-btn {
  background: #1e2a4a;
  border: 1px solid var(--border);
  border-radius: 5px;
  color: var(--fg);
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  line-height: 1;
}
.icon-btn:hover { background: #253260; }

.history-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: 100;
  background: #1a2240;
  border: 1px solid var(--border);
  border-radius: 8px;
  min-width: 340px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}
.history-header {
  padding: 10px 14px 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  border-bottom: 1px solid var(--border);
}
.history-empty { padding: 12px 14px; font-size: 12px; color: var(--desc); }
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  cursor: pointer;
  border-bottom: 1px solid rgba(42,48,80,0.5);
  transition: background 0.1s;
}
.history-item:last-child { border-bottom: none; }
.history-item:hover { background: rgba(79,110,247,0.12); }
.history-expr {
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--fg);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.history-time {
  font-size: 10.5px;
  color: var(--desc);
  flex-shrink: 0;
}

/* Function reference */
.func-ref-wrap {
  margin-top: 12px;
  border-top: 1px solid var(--border);
  padding-top: 10px;
}

.collapse-toggle {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.collapse-toggle:hover { color: #a5b0ff; }

.panel-toggle {
  font-size: 14px;
  margin-bottom: 0;
}

.toggle-arrow {
  display: inline-block;
  transition: transform 0.15s;
  font-size: 11px;
  color: var(--desc);
}
.toggle-arrow.open { transform: rotate(90deg); }

.func-ref-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.func-cat { }
.func-cat-name {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--desc);
  margin-bottom: 6px;
}
.func-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 6px;
  position: relative;
}
.func-sig {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 3px;
}
.func-ex {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--desc);
  margin-bottom: 6px;
}
.insert-btn {
  font-size: 10.5px;
  padding: 2px 8px;
  background: #253260;
  color: var(--accent);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
}
.insert-btn:hover { background: #2e3e78; color: #fff; }

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
.stage-list { display: flex; flex-direction: column; gap: 0; }
.stage-arrow {
  text-align: center;
  color: var(--desc);
  font-size: 16px;
  margin: 2px 0;
  line-height: 1;
}
.stage-item {
  padding: 10px 14px;
  background: var(--bg2);
  border-left: 3px solid var(--accent2);
  border-radius: 0 6px 6px 0;
  position: relative;
}
.stage-item.stage-error { border-left-color: var(--error); }
.stage-badge {
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 10px;
  font-weight: 700;
  color: var(--desc);
  background: #1e2a4a;
  border-radius: 4px;
  padding: 1px 6px;
}
.stage-expr { font-family: var(--mono); font-size: 12px; color: var(--desc); margin-bottom: 4px; }
.stage-output { font-size: 14px; font-weight: 500; color: var(--fg); }
.stage-output.error { color: var(--error); font-size: 12px; }

/* Final result */
.result-box {
  background: linear-gradient(135deg, var(--bg2) 0%, #1a2240 100%);
  border: 1px solid var(--accent2);
  border-radius: 8px;
  padding: 16px;
}
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

.error-box {
  border: 1px solid var(--error);
  border-radius: 8px;
  padding: 12px 16px;
}
.error-text { color: var(--error); font-size: 13px; }

.placeholder-box {
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 20px;
}
.placeholder-text { color: var(--desc); font-size: 13px; font-style: italic; }

/* Test panel */
.test-panel-body { margin-top: 14px; }

/* Format hint */
.format-hint {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 14px;
}
.format-hint-title {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 6px;
}
.format-hint-code {
  margin: 0;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--desc);
  white-space: pre;
  line-height: 1.7;
}

/* Batch actions */
.action-bar { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; align-items: center; }
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

.load-wrap { display: flex; align-items: center; gap: 6px; }
.row-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(124,140,248,0.15);
  color: var(--accent);
  font-weight: 600;
}

/* Export dropdown */
.export-wrap { position: relative; }
.export-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 50;
  background: #1a2240;
  border: 1px solid var(--border);
  border-radius: 7px;
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  overflow: hidden;
}
.export-item {
  padding: 9px 14px;
  font-size: 12px;
  color: var(--fg);
  cursor: pointer;
  border-bottom: 1px solid rgba(42,48,80,0.5);
}
.export-item:last-child { border-bottom: none; }
.export-item:hover { background: rgba(79,110,247,0.15); }

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

/* Char diff */
.diff-text { font-family: var(--mono); font-size: 11.5px; }
.diff-match { }
.diff-exp-miss {
  background: rgba(74,222,128,0.25);
  color: var(--ok);
  border-radius: 2px;
  padding: 0 1px;
}
.diff-act-extra {
  background: rgba(248,113,113,0.3);
  color: var(--error);
  border-radius: 2px;
  padding: 0 1px;
}

/* Debug row button */
.debug-row-btn {
  font-size: 10.5px;
  padding: 3px 8px;
  background: #1e2a4a;
  color: var(--accent);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.debug-row-btn:hover { background: #253260; color: #fff; }
</style>
