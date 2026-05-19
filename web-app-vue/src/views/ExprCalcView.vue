<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

// ── Types ─────────────────────────────────────────────────────────────────────
type PipeValue = number | string | boolean | null;
interface StageResult { expr: string; output: PipeValue; error?: string; }
interface HistoryEntry { expr: string; timestamp: number; }
type DiffChar = { char: string; type: 'match' | 'extra' | 'missing' };

// ── Chip catalogue ────────────────────────────────────────────────────────────
// tip uses \n; CSS renders with white-space: pre
const CHIP_GROUPS = [
  {
    label: '参数',
    color: '#7c8cf8',
    chips: [
      { text: '$1',        ins: '$1',                      tip: '$1\n第 1 个输入参数\n例: $1 | toHex 8' },
      { text: '$2',        ins: '$2',                      tip: '$2\n第 2 个输入参数\n例: $1 | add $2' },
      { text: '$0',        ins: '$0',                      tip: '$0\n当前管道值（上一段输出）\n例: $1 | expr($0 * 2)' },
    ]
  },
  {
    label: '算术',
    color: '#4f9ef7',
    chips: [
      { text: 'add', ins: ' | add ',   tip: 'add <数值>\n加法: 当前值 + 数值\n例: $1 | add $2' },
      { text: 'sub', ins: ' | sub ',   tip: 'sub <数值>\n减法: 当前值 − 数值\n例: $1 | sub 10' },
      { text: 'mul', ins: ' | mul ',   tip: 'mul <数值>\n乘法: 当前值 × 数值\n例: $1 | mul 2' },
      { text: 'div', ins: ' | div ',   tip: 'div <数值>\n除法: 当前值 ÷ 数值\n例: $1 | div 4' },
      { text: 'mod', ins: ' | mod ',   tip: 'mod <数值>\n取余: 当前值 mod 数值\n例: $1 | mod 16' },
    ]
  },
  {
    label: '位运算',
    color: '#f7a24f',
    chips: [
      { text: 'and', ins: ' | and ',  tip: 'and <数值>\n按位与\n例: $1 | and 0xFF' },
      { text: 'or',  ins: ' | or ',   tip: 'or <数值>\n按位或\n例: $1 | or 0x80' },
      { text: 'xor', ins: ' | xor ',  tip: 'xor <数值>\n按位异或\n例: $1 | xor 0xAA' },
      { text: 'shl', ins: ' | shl ',  tip: 'shl <位数>\n左移 N 位\n例: $1 | shl 4' },
      { text: 'shr', ins: ' | shr ',  tip: 'shr <位数>\n右移 N 位（无符号）\n例: $1 | shr 2' },
      { text: 'not', ins: ' | not',   tip: 'not\n按位取反（32位）\n例: $1 | not' },
    ]
  },
  {
    label: '格式',
    color: '#4fd97a',
    chips: [
      { text: 'toHex', ins: ' | toHex 8',  tip: 'toHex [位数]\n转十六进制，可补零到指定位数\n例: $1 | toHex 8  →  0x0000001A' },
      { text: 'toBin', ins: ' | toBin',     tip: 'toBin\n转二进制字符串\n例: $1 | toBin  →  0b00001010' },
      { text: 'toOct', ins: ' | toOct',     tip: 'toOct\n转八进制字符串\n例: $1 | toOct  →  0o12' },
      { text: 'toInt', ins: ' | toInt',     tip: 'toInt\n截断为 32 位有符号整数\n例: $1 | toInt' },
    ]
  },
  {
    label: '字符串',
    color: '#e879a4',
    chips: [
      { text: 'string.format', ins: " | string.format '%08X'", tip: "string.format <格式串>\n支持 %s %d %x %X %f %o %b\n例: $1 | string.format '%08X'  →  0000001A" },
      { text: 'string.upper',  ins: ' | string.upper',          tip: 'string.upper\n转大写\n例: $1 | string.upper  →  HELLO' },
      { text: 'string.lower',  ins: ' | string.lower',          tip: 'string.lower\n转小写\n例: $1 | string.lower  →  hello' },
      { text: 'string.sub',    ins: ' | string.sub 1 4',        tip: 'string.sub <i> [j]\n截取子串，索引从 1 开始\n例: $1 | string.sub 1 3  (从第1位取3个字符)' },
      { text: 'string.gsub',   ins: " | string.gsub '0x' ''",   tip: "string.gsub <模式> <替换>\n全局替换子串\n例: $1 | string.gsub '0x' ''" },
      { text: 'string.cmp',    ins: " | string.cmp 'OK'",       tip: "string.cmp <对比值>\n字符串比较: 0=相等 -1=小于 1=大于\n例: $1 | string.cmp 'OK'" },
    ]
  },
  {
    label: 'JS',
    color: '#c084fc',
    chips: [
      { text: 'expr(...)', ins: ' | expr($0 * 2)', tip: 'expr(<JS表达式>)\n嵌入任意 JS 运算，$0 代表当前管道值\n例: $1 | expr($0 * 2 + 1)' },
    ]
  },
];

// ── Core state ────────────────────────────────────────────────────────────────
const exprText    = ref('');
const inputVals   = ref<string[]>([]);
const stageResults = ref<StageResult[]>([]);
const finalResult  = ref<PipeValue | null>(null);
const copied       = ref(false);

const textareaEl = ref<HTMLTextAreaElement | null>(null);

// History
const historyOpen = ref(false);
const historyList = ref<HistoryEntry[]>([]);
const HIST_KEY    = 'expr-calc-history';

// Batch
const batchOpen    = ref(false);
const testCaseText = ref('');
const testCaseErr  = ref('');
const testCases    = ref<{ inputs: string[]; expected: string }[]>([]);
const batchResults = ref<{ inputs: string[]; expected: string; actual: string; ok: boolean | null }[]>([]);
const batchSummary = ref<{ total: number; passed: number; failed: number } | null>(null);
const exportDropOpen = ref(false);
const validRowCount  = ref(0);

// ── Auto-detect parameters from expression ────────────────────────────────────
const paramCount = computed(() => {
  const nums = (exprText.value.match(/\$([1-9]\d*)/g) || []).map(m => parseInt(m.slice(1)));
  return nums.length ? Math.max(...nums) : 0;
});

watch(paramCount, (n) => {
  while (inputVals.value.length < n) inputVals.value.push('');
}, { immediate: true });

const missingIdx = computed<number[]>(() => {
  if (!exprText.value.trim()) return [];
  const missing: number[] = [];
  for (let i = 0; i < paramCount.value; i++) {
    if (!(inputVals.value[i] ?? '').trim()) missing.push(i);
  }
  return missing;
});
const hasMissing = computed(() => missingIdx.value.length > 0);

// ── Chip insert at cursor ─────────────────────────────────────────────────────
function insertChip(ins: string) {
  const el = textareaEl.value;
  if (!el) { exprText.value += ins; runEval(); return; }
  const s = el.selectionStart ?? exprText.value.length;
  const e = el.selectionEnd ?? s;
  exprText.value = exprText.value.slice(0, s) + ins + exprText.value.slice(e);
  nextTick(() => {
    const pos = s + ins.length;
    el.setSelectionRange(pos, pos);
    el.focus();
  });
  runEval();
}

// ── Pipe evaluator ────────────────────────────────────────────────────────────
function parsePipe(raw: string): string[] {
  const stages: string[] = [];
  let cur = '', inStr = false, strChar = '';
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) { cur += ch; if (ch === strChar && raw[i-1] !== '\\') inStr = false; }
    else if (ch === '"' || ch === "'") { inStr = true; strChar = ch; cur += ch; }
    else if (ch === '|' && raw[i-1] === ' ' && raw[i+1] === ' ') { stages.push(cur.trimEnd()); cur = ''; i++; }
    else cur += ch;
  }
  if (cur.trim()) stages.push(cur.trim());
  return stages;
}

function tokenize(s: string): string[] {
  const tokens: string[] = [];
  let cur = '', inStr = false, strCh = '';
  for (const ch of s) {
    if (inStr) { cur += ch; if (ch === strCh) { inStr = false; tokens.push(cur); cur = ''; } }
    else if (ch === '"' || ch === "'") { inStr = true; strCh = ch; cur += ch; }
    else if (ch === ' ' || ch === '\t') { if (cur) { tokens.push(cur); cur = ''; } }
    else cur += ch;
  }
  if (cur) tokens.push(cur);
  return tokens;
}
function unquote(s: string) {
  return (s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")) ? s.slice(1,-1) : s;
}
function toNum(v: PipeValue): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (v === null) return 0;
  const s = String(v).trim();
  if (/^0[xX]/.test(s)) return parseInt(s, 16);
  if (/^0[bB]/.test(s)) return parseInt(s.slice(2), 2);
  if (/^0[oO]/.test(s)) return parseInt(s.slice(2), 8);
  const n = Number(s); return isNaN(n) ? 0 : n;
}
function safeEval(code: string): PipeValue {
  const js = code.replace(/\band\b/g,'&&').replace(/\bor\b/g,'||').replace(/~=/g,'!==');
  try { return new Function(`"use strict"; return (${js});`)() as PipeValue; }
  catch { throw new Error(`无法求值: ${code}`); }
}
function substituteInputs(expr: string, inputs: string[], pipe: PipeValue): string {
  let s = expr.replace(/\$0\b/g, JSON.stringify(pipe));
  for (let i = inputs.length; i >= 1; i--) {
    const v = inputs[i-1], n = Number(v);
    s = s.replace(new RegExp(`\\$${i}\\b`, 'g'), isNaN(n) ? JSON.stringify(v) : v);
  }
  return s;
}
function sprintfSimple(fmt: string, args: PipeValue[]): string {
  let ai = 0;
  return fmt.replace(/%([0-9]*)([sdxXfob])/g, (_, w, spec) => {
    const val = args[ai++]; const n = toNum(val); const pad = w ? parseInt(w) : 0;
    let s = '';
    switch (spec) {
      case 's': s = String(val ?? ''); break; case 'd': s = Math.trunc(n).toString(); break;
      case 'f': s = n.toFixed(6); break; case 'x': s = (n>>>0).toString(16); break;
      case 'X': s = (n>>>0).toString(16).toUpperCase(); break;
      case 'o': s = (n>>>0).toString(8); break; case 'b': s = (n>>>0).toString(2); break;
    }
    return pad ? s.padStart(pad) : s;
  });
}

function evalStage(stage: string, inputs: string[], pipe: PipeValue): PipeValue {
  const tok = tokenize(stage.trim()); if (!tok.length) return pipe;
  const fn = tok[0], args = tok.slice(1);
  switch (fn) {
    case 'expr': { const j = args.join(' '); return safeEval(substituteInputs(j || String(pipe), inputs, pipe)); }
    case 'string.format': { const fmt = unquote(args[0]??''); const fa = args.slice(1).map(a => safeEval(substituteInputs(a,inputs,pipe))); return sprintfSimple(fmt,[pipe,...fa]); }
    case 'string.upper': return String(pipe).toUpperCase();
    case 'string.lower': return String(pipe).toLowerCase();
    case 'string.sub': { const s=String(pipe),i=Number(args[0]??1),j=args[1]!=null?Number(args[1]):s.length; return s.slice(i-1,j); }
    case 'string.gsub': { const s=String(pipe),p=unquote(args[0]??''),r=unquote(args[1]??''); return s.split(p).join(r); }
    case 'string.cmp': { const o=substituteInputs(unquote(args[0]??''),inputs,pipe); return String(pipe)===o?0:String(pipe)<o?-1:1; }
    case 'toHex': { const v=toNum(pipe),pad=args[0]?Number(args[0]):0; return '0x'+(v>>>0).toString(16).toUpperCase().padStart(pad,'0'); }
    case 'toBin': return '0b'+(toNum(pipe)>>>0).toString(2);
    case 'toOct': return '0o'+(toNum(pipe)>>>0).toString(8);
    case 'toInt': return toNum(pipe)|0;
    case 'add': return toNum(pipe)+toNum(safeEval(substituteInputs(args.join(' '),inputs,pipe)));
    case 'sub': return toNum(pipe)-toNum(safeEval(substituteInputs(args.join(' '),inputs,pipe)));
    case 'mul': return toNum(pipe)*toNum(safeEval(substituteInputs(args.join(' '),inputs,pipe)));
    case 'div': return toNum(pipe)/toNum(safeEval(substituteInputs(args.join(' '),inputs,pipe)));
    case 'mod': return toNum(pipe)%toNum(safeEval(substituteInputs(args.join(' '),inputs,pipe)));
    case 'and': return (toNum(pipe)&toNum(safeEval(substituteInputs(args.join(' '),inputs,pipe))))>>>0;
    case 'or':  return (toNum(pipe)|toNum(safeEval(substituteInputs(args.join(' '),inputs,pipe))))>>>0;
    case 'xor': return (toNum(pipe)^toNum(safeEval(substituteInputs(args.join(' '),inputs,pipe))))>>>0;
    case 'shl': return (toNum(pipe)<<toNum(args[0]??'0'))>>>0;
    case 'shr': return (toNum(pipe)>>>toNum(args[0]??'0'));
    case 'not': return (~toNum(pipe))>>>0;
    default: return safeEval(substituteInputs(stage.trim(),inputs,pipe));
  }
}

function evalExpression(raw: string, inputs: string[]): { stages: StageResult[]; final: PipeValue; error: string } {
  const stages = parsePipe(raw);
  if (!stages.length) return { stages: [], final: null, error: '表达式为空' };
  const results: StageResult[] = [];
  let pipe: PipeValue = null, err = '';
  try {
    pipe = safeEval(substituteInputs(stages[0], inputs, null as any));
    results.push({ expr: stages[0], output: pipe });
  } catch(e) { err = String(e); results.push({ expr: stages[0], output: null, error: err }); return { stages: results, final: null, error: err }; }
  for (let i = 1; i < stages.length; i++) {
    try { pipe = evalStage(stages[i], inputs, pipe); results.push({ expr: stages[i], output: pipe }); }
    catch(e) { err = String(e); results.push({ expr: stages[i], output: null, error: err }); break; }
  }
  return { stages: results, final: pipe, error: err };
}

function formatVal(v: PipeValue): string {
  if (v === null) return 'null';
  if (typeof v === 'string') return `"${v}"`;
  return String(v);
}

// ── Run eval ──────────────────────────────────────────────────────────────────
function runEval() {
  stageResults.value = [];
  finalResult.value = null;
  if (!exprText.value.trim() || hasMissing.value) return;
  const inputs = inputVals.value.slice(0, paramCount.value);
  const r = evalExpression(exprText.value.trim(), inputs);
  stageResults.value = r.stages;
  finalResult.value = r.error ? null : r.final;
  if (!r.error) saveToHistory(exprText.value.trim());
}

// ── History ───────────────────────────────────────────────────────────────────
function loadHistory() {
  try { historyList.value = JSON.parse(localStorage.getItem(HIST_KEY) ?? '[]'); } catch { historyList.value = []; }
}
function saveToHistory(expr: string) {
  loadHistory();
  const list = historyList.value.filter(h => h.expr !== expr);
  list.unshift({ expr, timestamp: Date.now() });
  historyList.value = list.slice(0, 20);
  localStorage.setItem(HIST_KEY, JSON.stringify(historyList.value));
}
function useHistory(e: HistoryEntry) { exprText.value = e.expr; historyOpen.value = false; runEval(); }
function fmtTime(ts: number) {
  const d = new Date(ts);
  return `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
loadHistory();

// ── Quick-fill ────────────────────────────────────────────────────────────────
function quickFill(expr: string) { exprText.value = expr; runEval(); }

// ── Batch test ────────────────────────────────────────────────────────────────
function parseCaseLines(text: string) {
  const cases: { inputs: string[]; expected: string }[] = [];
  let error = '', count = 0;
  for (const [li, line] of text.trim().split('\n').entries()) {
    const parts = line.trim().split(/\s+/);
    if (!line.trim()) continue;
    if (parts.length < 2) { error = `第 ${li+1} 行格式错误：至少需要 2 列（输入值 + 预期输出）`; return { cases: [], error, count: 0 }; }
    cases.push({ inputs: parts.slice(0,-1), expected: parts[parts.length-1] });
    count++;
  }
  return { cases, error, count };
}
function updateRowCount() { validRowCount.value = parseCaseLines(testCaseText.value).count; }
function executeBatch() {
  const { cases, error } = parseCaseLines(testCaseText.value);
  if (error) { testCaseErr.value = error; return; }
  testCaseErr.value = ''; testCases.value = cases;
  let passed = 0, failed = 0;
  batchResults.value = cases.map(tc => {
    const r = evalExpression(exprText.value.trim(), tc.inputs);
    const actual = r.error ? `[错误] ${r.error}` : String(r.final);
    const ok = !r.error && actual === tc.expected;
    ok ? passed++ : failed++;
    return { ...tc, actual, ok };
  });
  batchSummary.value = { total: cases.length, passed, failed };
}
const hasResults = computed(() => batchResults.value.some(r => r.ok !== null));

function charDiff(expected: string, actual: string): { expected: DiffChar[]; actual: DiffChar[] } {
  const a = expected.split(''), b = actual.split(''), m = a.length, n = b.length;
  const dp = Array.from({length:m+1}, () => new Array(n+1).fill(0));
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++)
    dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j],dp[i][j-1]);
  const expOut: DiffChar[] = [], actOut: DiffChar[] = [];
  let i=m, j=n;
  while (i>0||j>0) {
    if (i>0&&j>0&&a[i-1]===b[j-1]) { expOut.unshift({char:a[i-1],type:'match'}); actOut.unshift({char:b[j-1],type:'match'}); i--;j--; }
    else if (j>0&&(i===0||dp[i][j-1]>=dp[i-1][j])) { actOut.unshift({char:b[j-1],type:'extra'}); j--; }
    else { expOut.unshift({char:a[i-1],type:'missing'}); i--; }
  }
  return { expected: expOut, actual: actOut };
}

function exportAs(fmt: 'tsv'|'markdown'|'json') {
  exportDropOpen.value = false;
  let text = '';
  if (fmt==='tsv') text = ['输入\t预期\t实际\t状态', ...batchResults.value.map(r => `${r.inputs.join(' ')}\t${r.expected}\t${r.actual}\t${r.ok===null?'-':r.ok?'✓':'✗'}`)].join('\n');
  else if (fmt==='markdown') text = '| 输入 | 预期 | 实际 | 状态 |\n|---|---|---|---|\n' + batchResults.value.map(r=>`| ${r.inputs.join(' ')} | ${r.expected} | ${r.actual} | ${r.ok===null?'-':r.ok?'✓':'✗'} |`).join('\n');
  else text = JSON.stringify(batchResults.value, null, 2);
  navigator.clipboard.writeText(text);
}
</script>

<template>
  <div class="root" @click="historyOpen = false; exportDropOpen = false">

    <!-- ══ STAGE 1: 管道表达式 ══════════════════════════════════════════════ -->
    <div class="card stage-card">
      <div class="stage-hdr">
        <div class="stage-num">①</div>
        <div class="stage-label">管道表达式</div>
        <div style="flex:1"></div>
        <!-- History -->
        <div class="history-wrap" @click.stop>
          <button class="ghost-btn" :aria-expanded="historyOpen" @click="historyOpen = !historyOpen; loadHistory()">🕐 历史</button>
          <div v-if="historyOpen" class="hist-drop">
            <div class="hist-hdr">最近表达式</div>
            <div v-if="!historyList.length" class="hist-empty">暂无历史</div>
            <button v-for="(e,i) in historyList" :key="i" class="hist-item" @click="useHistory(e)">
              <span class="hist-expr">{{ e.expr.slice(0,60) }}{{ e.expr.length>60?'…':'' }}</span>
              <span class="hist-time">{{ fmtTime(e.timestamp) }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Textarea -->
      <textarea
        ref="textareaEl"
        class="expr-ta"
        v-model="exprText"
        placeholder="示例: $1 | toHex 8&#10;示例: $1 | add $2 | toHex 8&#10;示例: $1 | string.format '%08X'"
        spellcheck="false"
        @input="runEval"
      />

      <!-- Quick-start (empty state) -->
      <div v-if="!exprText.trim()" class="qs-wrap">
        <div class="qs-title">快速开始</div>
        <div class="qs-grid">
          <button class="qs-card" @click="quickFill('$1 | toHex 8')"><code>$1 | toHex 8</code><span>数字 → 8位十六进制</span></button>
          <button class="qs-card" @click="quickFill('$1 | shr 8 | and 0xFF')"><code>$1 | shr 8 | and 0xFF</code><span>提取第 2 字节</span></button>
          <button class="qs-card" @click="quickFill('$1 | add $2 | toHex 8')"><code>$1 | add $2 | toHex 8</code><span>两数相加转十六进制</span></button>
          <button class="qs-card" @click="quickFill(`$1 | string.format '%08X'`)"><code>$1 | string.format '%08X'</code><span>格式化大写十六进制</span></button>
        </div>
      </div>

      <!-- Chip bar -->
      <div class="chip-bar">
        <div v-for="grp in CHIP_GROUPS" :key="grp.label" class="chip-group">
          <span class="chip-grp-label" :style="{ color: grp.color }">{{ grp.label }}</span>
          <button
            v-for="chip in grp.chips"
            :key="chip.text"
            class="chip"
            :style="{ '--chip-color': grp.color }"
            :data-tip="chip.tip"
            @click="insertChip(chip.ins)"
          >{{ chip.text }}</button>
        </div>
      </div>
    </div>

    <!-- ══ STAGE 2: 输入参数 ════════════════════════════════════════════════ -->
    <div class="card stage-card">
      <div class="stage-hdr">
        <div class="stage-num">②</div>
        <div class="stage-label">输入参数</div>
        <span v-if="paramCount" class="stage-badge">{{ paramCount }} 个</span>
      </div>

      <!-- No params in expression -->
      <div v-if="!exprText.trim()" class="empty-state">请先在上方输入管道表达式</div>
      <div v-else-if="paramCount === 0" class="empty-state">当前表达式无参数 <code>$1</code> <code>$2</code>…，不需要输入值</div>

      <!-- Param inputs -->
      <div v-else class="param-list">
        <div v-for="i in paramCount" :key="i" class="param-row">
          <label class="param-badge" :class="{ 'missing': missingIdx.includes(i-1) }" :for="'inp-'+i">${{ i }}</label>
          <input
            :id="'inp-'+i"
            class="param-input"
            :class="{ 'input-err': missingIdx.includes(i-1) }"
            :placeholder="`输入 $${i} 的值`"
            v-model="inputVals[i-1]"
            @input="runEval"
          />
          <span class="inline-err" v-if="missingIdx.includes(i-1)">未输入 ${{ i }} 值，无法进行管道处理</span>
        </div>
      </div>
    </div>

    <!-- ══ STAGE 3: 管道处理 ════════════════════════════════════════════════ -->
    <div class="card stage-card">
      <div class="stage-hdr">
        <div class="stage-num">③</div>
        <div class="stage-label">管道处理</div>
      </div>

      <!-- Empty states -->
      <div v-if="!exprText.trim()" class="empty-state">请先输入管道表达式</div>
      <div v-else-if="hasMissing" class="empty-state muted">
        请先填写所有输入参数，管道处理将在此显示
      </div>

      <!-- Pipeline flow -->
      <template v-else>
        <div class="pipe-flow">
          <div v-for="(sr, idx) in stageResults" :key="idx" class="pipe-stage">
            <!-- Arrow connector between stages -->
            <div v-if="idx > 0" class="pipe-connector">
              <div class="pipe-line"></div>
              <div class="pipe-arrow">↓</div>
            </div>
            <div class="pipe-box" :class="{ 'pipe-err': sr.error, 'pipe-first': idx === 0 }">
              <div class="pipe-step">
                <span class="pipe-step-num">{{ idx === 0 ? '输入' : `步骤 ${idx}` }}</span>
                <code class="pipe-step-expr">{{ sr.expr }}</code>
              </div>
              <div class="pipe-out" v-if="!sr.error">
                <span class="pipe-arrow-r">→</span>
                <span class="pipe-val">{{ formatVal(sr.output) }}</span>
              </div>
              <div class="pipe-out err" v-else>
                <span class="pipe-arrow-r">→</span>
                <span class="pipe-err-msg">{{ sr.error }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Final result -->
        <div class="result-box" v-if="finalResult !== null && stageResults.every(s => !s.error)">
          <div class="result-label">最终结果</div>
          <div class="result-val">
            {{ String(finalResult) }}
            <span v-if="typeof finalResult === 'string'" class="type-badge">字符串</span>
          </div>
          <button class="copy-btn" @click="navigator.clipboard.writeText(String(finalResult)); copied = true; setTimeout(() => copied = false, 1500)">
            {{ copied ? '✅ 已复制' : '⎘ 复制结果' }}
          </button>
        </div>
        <div class="no-result" v-else-if="!stageResults.length">请填写表达式并输入参数</div>
      </template>
    </div>

    <!-- ══ BATCH TEST ════════════════════════════════════════════════════════ -->
    <div class="card">
      <button class="batch-toggle" @click="batchOpen = !batchOpen" :aria-expanded="batchOpen">
        <span class="toggle-arrow" :class="{ open: batchOpen }">▸</span>
        批量测试
        <span class="batch-sub">——对当前表达式测试多组输入</span>
        <span v-if="batchSummary" class="batch-badge" :class="batchSummary.failed ? 'badge-fail' : 'badge-ok'">
          {{ batchSummary.passed }}/{{ batchSummary.total }} 通过
        </span>
      </button>

      <div v-if="batchOpen" class="batch-body">
        <!-- Current expression reference -->
        <div class="batch-ctx" v-if="exprText.trim()">
          <span class="batch-ctx-label">当前表达式：</span>
          <code class="batch-ctx-expr">{{ exprText }}</code>
        </div>
        <div class="batch-ctx warn" v-else>请先在上方输入管道表达式，再进行批量测试</div>

        <!-- Format guide -->
        <div class="fmt-guide">
          <div class="fmt-guide-title">格式说明</div>
          <div class="fmt-guide-body">每行一个测试用例，列之间用空格分隔，<strong>最后一列</strong>为预期输出，前面各列依次对应 <code>$1</code> <code>$2</code>…</div>
          <pre class="fmt-guide-ex">示例（表达式: $1 | add $2 | toHex 8）:
10 20 0x0000001E
100 200 0x0000012C
255 1  0x00000100</pre>
        </div>

        <textarea
          class="expr-ta"
          v-model="testCaseText"
          style="min-height:130px; margin-top:12px"
          placeholder="每行: $1值 [$2值 ...] 预期输出"
          spellcheck="false"
          @input="updateRowCount"
        />
        <div class="test-err" v-if="testCaseErr">{{ testCaseErr }}</div>

        <div class="batch-actions">
          <button class="action-btn" :disabled="!testCaseText.trim() || !exprText.trim()" @click="executeBatch">
            ▶ 批量执行
            <span v-if="validRowCount" class="row-badge">{{ validRowCount }} 行</span>
          </button>
          <div class="export-wrap" v-if="hasResults" @click.stop>
            <button class="action-btn secondary" @click="exportDropOpen = !exportDropOpen">💾 导出 ▾</button>
            <div v-if="exportDropOpen" class="export-drop">
              <button class="exp-item" @click="exportAs('tsv')">TSV（制表符分隔）</button>
              <button class="exp-item" @click="exportAs('markdown')">Markdown 表格</button>
              <button class="exp-item" @click="exportAs('json')">JSON 数组</button>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="summary-row" v-if="batchSummary">
          <div class="stat-chip">共 <strong>{{ batchSummary.total }}</strong></div>
          <div class="stat-chip ok">通过 <strong>{{ batchSummary.passed }}</strong></div>
          <div class="stat-chip fail">失败 <strong>{{ batchSummary.failed }}</strong></div>
        </div>

        <!-- Results table -->
        <div v-if="batchResults.length" class="result-scroll">
          <table class="result-tbl">
            <thead>
              <tr><th>#</th><th>输入值</th><th>预期输出</th><th>实际输出</th><th>状态</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="(r,i) in batchResults" :key="i" :class="r.ok===true?'row-ok':r.ok===false?'row-fail':''">
                <td>{{ i+1 }}</td>
                <td><code>{{ r.inputs.join(' ') }}</code></td>
                <td>
                  <code v-if="r.ok!==false">{{ r.expected }}</code>
                  <span v-else class="diff-text">
                    <span v-for="(dc,ci) in charDiff(r.expected,r.actual).expected" :key="ci" :class="dc.type==='match'?'dm':'de'">{{ dc.type==='missing'?'·':dc.char }}</span>
                  </span>
                </td>
                <td>
                  <code v-if="r.ok!==false">{{ r.actual||'—' }}</code>
                  <span v-else class="diff-text">
                    <span v-for="(dc,ci) in charDiff(r.expected,r.actual).actual" :key="ci" :class="dc.type==='match'?'dm':'da'">{{ dc.char }}</span>
                  </span>
                </td>
                <td class="tc">{{ r.ok===true?'✅':r.ok===false?'❌':'—' }}</td>
                <td><button v-if="r.ok===false" class="dbg-btn" @click="inputVals = [...r.inputs]; runEval(); batchOpen = false">↑ 调试</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Variables ───────────────────────────────────────────────────────────── */
.root {
  --fg:     #e6e8ef;
  --bg:     #0e1117;
  --card:   #131826;
  --input:  #161b2b;
  --border: #2a3050;
  --accent: #7c8cf8;
  --accent2:#4f6ef7;
  --desc:   #98a0b8;
  --error:  #f87171;
  --ok:     #4ade80;
  --mono:   ui-monospace, SFMono-Regular, Menlo, monospace;

  padding: 20px 16px 40px;
  color: var(--fg);
  background: var(--bg);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 13px;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Card / section ──────────────────────────────────────────────────────── */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
}

/* ── Stage header ────────────────────────────────────────────────────────── */
.stage-card { border-left: 3px solid var(--accent2); }
.stage-hdr { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.stage-num {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--accent2); color: #fff;
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stage-label { font-size: 14px; font-weight: 700; color: var(--fg); }
.stage-badge { font-size: 11px; background: rgba(124,140,248,.15); color: var(--accent); border-radius: 9px; padding: 2px 8px; font-weight: 600; }

/* ── History ─────────────────────────────────────────────────────────────── */
.history-wrap { position: relative; }
.ghost-btn { background: #1e2540; border: 1px solid var(--border); border-radius: 6px; color: var(--desc); cursor: pointer; font-size: 12px; padding: 5px 10px; }
.ghost-btn:hover { color: var(--accent); border-color: var(--accent); }
.hist-drop {
  position: absolute; right: 0; top: calc(100% + 6px); z-index: 200;
  background: #1a2240; border: 1px solid var(--border); border-radius: 8px;
  min-width: 340px; max-height: 280px; overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}
.hist-hdr { padding: 10px 14px 7px; font-size: 12px; font-weight: 600; color: var(--accent); border-bottom: 1px solid var(--border); }
.hist-empty { padding: 12px 14px; font-size: 12px; color: var(--desc); }
.hist-item { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 9px 14px; cursor: pointer; border-bottom: 1px solid rgba(42,48,80,.5); background: none; border-left: none; border-right: none; border-top: none; width: 100%; text-align: left; font-family: inherit; color: inherit; }
.hist-item:hover { background: rgba(79,110,247,.12); }
.hist-expr { font-family: var(--mono); font-size: 11.5px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hist-time { font-size: 10.5px; color: var(--desc); flex-shrink: 0; }

/* ── Textarea ────────────────────────────────────────────────────────────── */
.expr-ta {
  width: 100%; min-height: 76px; padding: 11px 13px;
  font-family: var(--mono); font-size: 13px; line-height: 1.55;
  background: var(--input); border: 1px solid var(--border); color: var(--fg);
  border-radius: 7px; resize: vertical; outline: none; box-sizing: border-box;
}
.expr-ta:focus { border-color: var(--accent2); }

/* ── Quick-start ─────────────────────────────────────────────────────────── */
.qs-wrap { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
.qs-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--desc); margin-bottom: 8px; }
.qs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
.qs-card {
  display: flex; flex-direction: column; gap: 4px; padding: 10px 12px;
  background: var(--input); border: 1px solid var(--border); border-radius: 7px;
  cursor: pointer; text-align: left; transition: border-color .15s;
  font-family: inherit;
}
.qs-card:hover { border-color: var(--accent2); background: rgba(79,110,247,.08); }
.qs-card code { font-family: var(--mono); font-size: 11.5px; color: var(--accent); font-weight: 600; }
.qs-card span { font-size: 11px; color: var(--desc); }

/* ── Chip bar ────────────────────────────────────────────────────────────── */
.chip-bar { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px 16px; padding-top: 12px; border-top: 1px solid var(--border); }
.chip-group { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; }
.chip-grp-label { font-size: 10px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; opacity: .75; margin-right: 2px; }

.chip {
  position: relative;
  padding: 3px 9px;
  font-family: var(--mono); font-size: 12px; font-weight: 600;
  color: var(--chip-color, var(--accent));
  background: rgba(124,140,248,.08);
  border: 1px solid rgba(124,140,248,.2);
  border-color: color-mix(in srgb, var(--chip-color, var(--accent)) 30%, transparent);
  border-radius: 5px; cursor: pointer; line-height: 1.5;
  transition: background .12s, border-color .12s;
}
.chip:hover { background: color-mix(in srgb, var(--chip-color, var(--accent)) 18%, transparent); border-color: var(--chip-color, var(--accent)); }

/* CSS tooltip */
.chip::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1a2240;
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 8px 12px;
  font-size: 11.5px;
  font-weight: 400;
  color: var(--fg);
  font-family: system-ui, -apple-system, sans-serif;
  white-space: pre;
  pointer-events: none;
  z-index: 300;
  box-shadow: 0 6px 20px rgba(0,0,0,.6);
  opacity: 0;
  transition: opacity .1s;
  line-height: 1.6;
  min-width: 180px;
  max-width: 280px;
  text-align: left;
}
.chip:hover::after { opacity: 1; }

/* ── Inputs ──────────────────────────────────────────────────────────────── */
.empty-state { color: var(--desc); font-size: 13px; padding: 6px 0; font-style: italic; }
.empty-state.muted { opacity: .65; }
.empty-state code { font-family: var(--mono); background: var(--input); padding: 1px 4px; border-radius: 3px; color: var(--accent); font-style: normal; }

.param-list { display: flex; flex-direction: column; gap: 10px; }
.param-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.param-badge {
  min-width: 36px; text-align: center; padding: 6px 0;
  background: #1e2a4a; color: var(--accent); font-family: var(--mono);
  font-size: 12px; font-weight: 700; border-radius: 5px; flex-shrink: 0;
}
.param-badge.missing { background: rgba(248,113,113,.15); color: var(--error); }
.param-input {
  flex: 1; min-width: 140px; max-width: 300px; padding: 7px 11px;
  font-family: var(--mono); font-size: 13px;
  background: var(--input); border: 1px solid var(--border); color: var(--fg);
  border-radius: 6px; outline: none;
}
.param-input:focus { border-color: var(--accent2); }
.param-input.input-err { border-color: var(--error) !important; background: rgba(248,113,113,.07) !important; }
.inline-err { font-size: 12px; color: var(--error); }

/* ── Pipeline flow ───────────────────────────────────────────────────────── */
.pipe-flow { display: flex; flex-direction: column; gap: 0; }
.pipe-stage { display: flex; flex-direction: column; align-items: flex-start; }
.pipe-connector { display: flex; flex-direction: column; align-items: flex-start; padding-left: 16px; gap: 0; }
.pipe-line { width: 2px; height: 12px; background: var(--border); margin-left: 10px; }
.pipe-arrow { color: var(--desc); font-size: 14px; margin-left: 4px; line-height: 1; }

.pipe-box {
  width: 100%; padding: 11px 15px;
  background: var(--input); border: 1px solid var(--border);
  border-left: 3px solid var(--accent2); border-radius: 0 7px 7px 0;
}
.pipe-box.pipe-first { border-left-color: #7c8cf8; }
.pipe-box.pipe-err { border-left-color: var(--error); }

.pipe-step { display: flex; align-items: baseline; gap: 10px; margin-bottom: 5px; }
.pipe-step-num { font-size: 10px; font-weight: 700; color: var(--desc); text-transform: uppercase; letter-spacing: .05em; flex-shrink: 0; }
.pipe-step-expr { font-family: var(--mono); font-size: 12.5px; color: var(--desc); }
.pipe-out { display: flex; align-items: baseline; gap: 8px; }
.pipe-arrow-r { color: var(--desc); flex-shrink: 0; }
.pipe-val { font-family: var(--mono); font-size: 15px; font-weight: 600; color: var(--fg); }
.pipe-err-msg { font-size: 12px; color: var(--error); }
.pipe-out.err .pipe-arrow-r { color: var(--error); }

/* Final result */
.result-box {
  margin-top: 16px; padding: 18px;
  background: linear-gradient(135deg, var(--input) 0%, #1a2240 100%);
  border: 1px solid var(--accent2); border-radius: 9px; text-align: center;
}
.result-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--desc); margin-bottom: 8px; }
.result-val { font-family: var(--mono); font-size: 28px; font-weight: 700; color: var(--accent); padding: 8px 0; }
.type-badge { font-size: 10px; color: var(--desc); background: rgba(255,255,255,.06); border: 1px solid var(--border); border-radius: 3px; padding: 1px 6px; margin-left: 8px; vertical-align: middle; font-family: inherit; }
.copy-btn { margin: 8px auto 0; display: block; padding: 7px 18px; background: var(--accent2); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; }
.copy-btn:hover { background: #6b87ff; }
.no-result { color: var(--desc); font-size: 13px; font-style: italic; margin-top: 8px; }

/* ── Batch test ──────────────────────────────────────────────────────────── */
.batch-toggle {
  display: flex; align-items: center; gap: 8px; width: 100%;
  background: none; border: none; color: var(--accent); font-size: 14px; font-weight: 700;
  cursor: pointer; padding: 0; text-align: left;
}
.batch-toggle:hover { color: #a5b0ff; }
.batch-sub { font-size: 12px; font-weight: 400; color: var(--desc); }
.batch-badge { font-size: 11px; border-radius: 9px; padding: 2px 8px; font-weight: 600; margin-left: auto; }
.badge-ok { background: rgba(74,222,128,.15); color: var(--ok); }
.badge-fail { background: rgba(248,113,113,.15); color: var(--error); }
.toggle-arrow { font-size: 11px; color: var(--desc); display: inline-block; transition: transform .15s; }
.toggle-arrow.open { transform: rotate(90deg); }

.batch-body { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
.batch-ctx { padding: 9px 13px; background: var(--input); border: 1px solid var(--border); border-radius: 6px; font-size: 12px; display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.batch-ctx.warn { color: var(--desc); font-style: italic; }
.batch-ctx-label { color: var(--desc); flex-shrink: 0; }
.batch-ctx-expr { font-family: var(--mono); font-size: 12px; color: var(--accent); }

.fmt-guide { background: var(--input); border: 1px solid var(--border); border-radius: 6px; padding: 12px 14px; }
.fmt-guide-title { font-size: 11.5px; font-weight: 600; color: var(--accent); margin-bottom: 6px; }
.fmt-guide-body { font-size: 12px; color: var(--desc); margin-bottom: 8px; line-height: 1.6; }
.fmt-guide-body code { font-family: var(--mono); background: #1a2240; padding: 1px 4px; border-radius: 3px; color: var(--accent); }
.fmt-guide-ex { margin: 0; font-family: var(--mono); font-size: 11.5px; color: var(--desc); white-space: pre; line-height: 1.7; border-top: 1px solid var(--border); padding-top: 8px; }

.test-err { color: var(--error); font-size: 12px; }
.batch-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.action-btn { padding: 7px 14px; background: var(--accent2); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.action-btn:hover { background: #6b87ff; }
.action-btn:disabled { opacity: .4; cursor: not-allowed; }
.action-btn.secondary { background: #1e2540; color: var(--desc); }
.action-btn.secondary:hover { background: #253260; color: var(--fg); }
.row-badge { font-size: 11px; background: rgba(255,255,255,.12); border-radius: 9px; padding: 1px 7px; }

.export-wrap { position: relative; }
.export-drop { position: absolute; top: calc(100% + 4px); right: 0; z-index: 50; background: #1a2240; border: 1px solid var(--border); border-radius: 7px; min-width: 160px; box-shadow: 0 8px 24px rgba(0,0,0,.5); overflow: hidden; }
.exp-item { display: block; width: 100%; padding: 9px 14px; font-size: 12px; color: var(--fg); cursor: pointer; background: none; border: none; border-bottom: 1px solid rgba(42,48,80,.5); text-align: left; font-family: inherit; }
.exp-item:last-child { border-bottom: none; }
.exp-item:hover { background: rgba(79,110,247,.15); }

.summary-row { display: flex; gap: 8px; }
.stat-chip { padding: 5px 14px; border-radius: 20px; font-size: 12px; background: rgba(255,255,255,.06); color: var(--fg); }
.stat-chip.ok { background: rgba(74,222,128,.12); color: var(--ok); }
.stat-chip.fail { background: rgba(248,113,113,.12); color: var(--error); }

.result-scroll { max-height: 380px; overflow-y: auto; border: 1px solid var(--border); border-radius: 7px; }
.result-tbl { width: 100%; border-collapse: collapse; font-size: 12px; }
.result-tbl th { padding: 8px 10px; text-align: left; background: var(--input); color: var(--desc); font-weight: 600; position: sticky; top: 0; z-index: 1; border-bottom: 1px solid var(--border); }
.result-tbl td { padding: 7px 10px; border-bottom: 1px solid var(--border); color: var(--fg); }
.result-tbl code { font-family: var(--mono); font-size: 11.5px; }
.row-ok td { background: rgba(74,222,128,.05); }
.row-fail td { background: rgba(248,113,113,.05); }
.tc { text-align: center; }
.diff-text { font-family: var(--mono); font-size: 11.5px; }
.dm {}
.de { background: rgba(74,222,128,.22); color: var(--ok); border-radius: 2px; text-decoration: underline; }
.da { background: rgba(248,113,113,.28); color: var(--error); border-radius: 2px; text-decoration: line-through; }
.dbg-btn { font-size: 10.5px; padding: 3px 8px; background: #1e2a4a; color: var(--accent); border: 1px solid var(--border); border-radius: 4px; cursor: pointer; white-space: nowrap; }
.dbg-btn:hover { background: #253260; color: #fff; }
</style>
