<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

/* ─── Types ─────────────────────────────────────────────────────────────── */
type PipeValue = number | string | boolean | null;
interface StageResult { expr: string; output: PipeValue; error?: string; }
type DiffChar = { char: string; type: 'match' | 'extra' | 'missing' };

/* ─── Operator catalogue ─────────────────────────────────────────────────
   Each op has: cat, sig, desc, example for the chip-pop tooltip           */
interface OpDef { cat: string; sig: string; desc: string; example: string; }
const OPS: Record<string, OpDef> = {
  add:  { cat:'arith',  sig:'add N',          desc:'加法 · a + b',             example:'10 | add 5  →  15' },
  sub:  { cat:'arith',  sig:'sub N',          desc:'减法 · a − b',             example:'10 | sub 3  →  7' },
  mul:  { cat:'arith',  sig:'mul N',          desc:'乘法 · a × b',             example:'5 | mul 3   →  15' },
  div:  { cat:'arith',  sig:'div N',          desc:'除法 · a ÷ b',             example:'10 | div 4  →  2.5' },
  mod:  { cat:'arith',  sig:'mod N',          desc:'取余 · a % b',             example:'10 | mod 3  →  1' },
  and:  { cat:'arith',  sig:'and N',          desc:'按位与 · a & b',           example:'0xFF | and 0x0F  →  15' },
  or:   { cat:'arith',  sig:'or N',           desc:'按位或 · a | b',           example:'0xF0 | or 0x0F   →  255' },
  xor:  { cat:'arith',  sig:'xor N',          desc:'按位异或 · a ^ b',         example:'0xFF | xor 0x0F  →  240' },
  shl:  { cat:'arith',  sig:'shl N',          desc:'左移 · a << b',            example:'1 | shl 4   →  16' },
  shr:  { cat:'arith',  sig:'shr N',          desc:'右移 · a >>> b',           example:'256 | shr 4 →  16' },
  not:  { cat:'arith',  sig:'not',            desc:'按位取反（32-bit）· ~a',    example:'0 | not  →  4294967295' },
  toHex:{ cat:'cast',   sig:'toHex [W]',      desc:'转十六进制（可补 W 位零）', example:'255 | toHex 4   →  "0x00ff"' },
  toBin:{ cat:'cast',   sig:'toBin [W]',      desc:'转二进制字符串',            example:'5 | toBin 8     →  "0b00000101"' },
  toOct:{ cat:'cast',   sig:'toOct',          desc:'转八进制字符串',            example:'8 | toOct       →  "0o10"' },
  toInt:{ cat:'cast',   sig:'toInt [R]',      desc:'转整数（可指定基 R）',      example:'"0xFF" | toInt  →  255' },
  'string.format':{ cat:'string', sig:'string.format "F"', desc:'printf 风格格式化（%d %.Nf %s %x %X）', example:'41.875 | string.format "%.1f°C"  →  "41.9°C"' },
  'string.upper': { cat:'string', sig:'string.upper',      desc:'转大写',        example:'"hi" | string.upper  →  "HI"' },
  'string.lower': { cat:'string', sig:'string.lower',      desc:'转小写',        example:'"HI" | string.lower  →  "hi"' },
  'string.sub':   { cat:'string', sig:'string.sub S [L]',  desc:'子串（起 S 长 L，1-based）', example:'"abcdef" | string.sub 2 3  →  "bcd"' },
  'string.gsub':  { cat:'string', sig:'string.gsub "F" "T"',desc:'全局替换 F → T', example:'"a-b-c" | string.gsub "-" "_"  →  "a_b_c"' },
  'string.cmp':   { cat:'string', sig:'string.cmp "S"',    desc:'字典序比较，返回 -1 / 0 / 1', example:'"abc" | string.cmp "abd"  →  -1' },
  expr: { cat:'custom', sig:'expr( <JS> )',   desc:'内联 JS 表达式；x = 上一步结果，可引用 $N', example:'10 | expr(x*x + $1)  →  110 (if $1=10)' },
};
const CAT_ORDER = ['arith','cast','string','custom'];
const CAT_LABELS: Record<string, string> = { arith:'算术', cast:'转换', string:'字符串', custom:'自定义' };
const CAT_COLOR: Record<string, string>  = { arith:'#4f6ef7', cast:'#f5b454', string:'#34d399', custom:'#a78bfa', vars:'#4f6ef7' };

/* ─── State ─────────────────────────────────────────────────────────────── */
const exprText   = ref('');
const inputVals  = ref<string[]>([]);
const inputLabels= ref<string[]>([]);
const stageResults = ref<StageResult[]>([]);
const finalResult  = ref<PipeValue | null>(null);
const copied       = ref(false);
const toastMsg     = ref('');
let   toastTimer: ReturnType<typeof setTimeout>;

const textareaEl = ref<HTMLTextAreaElement | null>(null);

/* History */
const historyList = ref<{ expr: string; timestamp: number }[]>([]);
const HIST_KEY = 'expr-calc-history';

/* Test cases – Phase 4 */
interface TestCase { vals: string[]; expected: string; _actual?: string; _pass?: boolean | null; }
const testcases = ref<TestCase[]>([]);
const tcMode    = ref<'table'|'csv'>('table');
const csvText   = ref('');
const tcRunDone = ref(false);

/* ─── Param detection ────────────────────────────────────────────────────── */
const paramCount = computed(() => {
  const nums = (exprText.value.match(/\$([1-9]\d*)/g)||[]).map(m=>parseInt(m.slice(1)));
  return nums.length ? Math.max(...nums) : 0;
});
watch(paramCount, n => {
  while (inputVals.value.length  < n) inputVals.value.push('');
  while (inputLabels.value.length < n) inputLabels.value.push('');
}, { immediate: true });

const missingIdx = computed<number[]>(() => {
  if (!exprText.value.trim()) return [];
  return Array.from({length: paramCount.value}, (_,i) => i).filter(i => !(inputVals.value[i]||'').trim());
});
const hasMissing = computed(() => missingIdx.value.length > 0);

/* Detected vars for ops panel */
const detectedVars = computed(() => {
  const set = new Set<string>();
  const re = /\$(\d+)/g; let m;
  while ((m = re.exec(exprText.value)) !== null) set.add('$'+m[1]);
  return [...set].sort((a,b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
});

/* ─── Chip insert ────────────────────────────────────────────────────────── */
function insertToken(name: string, cat: string) {
  const el = textareaEl.value;
  const cur = exprText.value;
  let insert: string;
  if (cat === 'vars') {
    insert = cur.trim().length === 0 ? name : ` | ${name}`;
  } else if (name === 'expr') {
    insert = cur.trim().length === 0 ? '$1 | expr( )' : ' | expr( )';
  } else {
    const needsArg = OPS[name]?.sig.includes(' ');
    insert = cur.trim().length === 0 ? `$1 | ${name}${needsArg?' ':''}` : ` | ${name}${needsArg?' ':''}`;
  }
  if (el) {
    const s = el.selectionStart ?? cur.length;
    exprText.value = cur.slice(0, s) + insert + cur.slice(s);
    nextTick(() => { const p = s + insert.length; el.setSelectionRange(p,p); el.focus(); });
  } else {
    exprText.value = cur + insert;
  }
  runEval();
}

/* ─── Pipeline evaluator ─────────────────────────────────────────────────── */
function parsePipe(raw: string): string[] {
  const stages: string[] = []; let cur='', inStr=false, strChar='';
  for (let i=0; i<raw.length; i++) {
    const ch=raw[i];
    if (inStr) { cur+=ch; if (ch===strChar&&raw[i-1]!=='\\') inStr=false; }
    else if (ch==='"'||ch==="'") { inStr=true; strChar=ch; cur+=ch; }
    else if (ch==='|'&&raw[i-1]===' '&&raw[i+1]===' ') { stages.push(cur.trimEnd()); cur=''; i++; }
    else cur+=ch;
  }
  if (cur.trim()) stages.push(cur.trim());
  return stages;
}
function tokenize(s: string): string[] {
  const toks: string[]=[]; let cur='', inStr=false, strCh='';
  for (const ch of s) {
    if (inStr) { cur+=ch; if (ch===strCh){inStr=false;toks.push(cur);cur='';} }
    else if (ch==='"'||ch==="'") { inStr=true; strCh=ch; cur+=ch; }
    else if (ch===' '||ch==='\t') { if (cur){toks.push(cur);cur='';} }
    else cur+=ch;
  }
  if (cur) toks.push(cur);
  return toks;
}
function unquote(s: string): string {
  return (s.startsWith('"')&&s.endsWith('"'))||(s.startsWith("'")&&s.endsWith("'")) ? s.slice(1,-1) : s;
}
function toNum(v: PipeValue): number {
  if (typeof v==='number') return v;
  if (typeof v==='boolean') return v?1:0;
  if (v===null) return 0;
  const s=String(v).trim();
  if (/^0[xX]/.test(s)) return parseInt(s,16);
  if (/^0[bB]/.test(s)) return parseInt(s.slice(2),2);
  if (/^0[oO]/.test(s)) return parseInt(s.slice(2),8);
  const n=Number(s); return isNaN(n)?0:n;
}
function safeEval(code: string): PipeValue {
  const js=code.replace(/\band\b/g,'&&').replace(/\bor\b/g,'||').replace(/~=/g,'!==');
  try { return new Function(`"use strict"; return (${js});`)() as PipeValue; }
  catch { throw new Error(`无法求值: ${code}`); }
}
function subInputs(expr: string, inputs: string[], pipe: PipeValue): string {
  let s = expr.replace(/\$0\b/g, JSON.stringify(pipe));
  for (let i=inputs.length; i>=1; i--) {
    const v=inputs[i-1], n=Number(v);
    s = s.replace(new RegExp(`\\$${i}\\b`,'g'), isNaN(n)?JSON.stringify(v):v);
  }
  return s;
}
function sprintfSimple(fmt: string, args: PipeValue[]): string {
  let ai=0;
  return fmt.replace(/%([0-9]*)([sdxXfob])/g, (_,w,spec) => {
    const val=args[ai++]; const n=toNum(val); const pad=w?parseInt(w):0;
    let s='';
    switch(spec){
      case 's':s=String(val??'');break; case 'd':s=Math.trunc(n).toString();break;
      case 'f':s=n.toFixed(6);break; case 'x':s=(n>>>0).toString(16);break;
      case 'X':s=(n>>>0).toString(16).toUpperCase();break;
      case 'o':s=(n>>>0).toString(8);break; case 'b':s=(n>>>0).toString(2);break;
    }
    return pad?s.padStart(pad):s;
  });
}
function evalStage(stage: string, inputs: string[], pipe: PipeValue): PipeValue {
  const tok=tokenize(stage.trim()); if (!tok.length) return pipe;
  const fn=tok[0], args=tok.slice(1);
  switch(fn) {
    case 'expr': { const j=args.join(' '); return safeEval(subInputs(j||String(pipe),inputs,pipe)); }
    case 'string.format': { const fmt=unquote(args[0]??''); const fa=args.slice(1).map(a=>safeEval(subInputs(a,inputs,pipe))); return sprintfSimple(fmt,[pipe,...fa]); }
    case 'string.upper': return String(pipe).toUpperCase();
    case 'string.lower': return String(pipe).toLowerCase();
    case 'string.sub': { const s=String(pipe),i=Number(args[0]??1),j=args[1]!=null?Number(args[1]):s.length; return s.slice(i-1,j); }
    case 'string.gsub': { const s=String(pipe),p=unquote(args[0]??''),r=unquote(args[1]??''); return s.split(p).join(r); }
    case 'string.cmp': { const o=subInputs(unquote(args[0]??''),inputs,pipe); return String(pipe)===o?0:String(pipe)<o?-1:1; }
    case 'toHex': { const v=toNum(pipe),pad=args[0]?Number(args[0]):0; return '0x'+(v>>>0).toString(16).padStart(pad,'0'); }
    case 'toBin': { const v=toNum(pipe),pad=args[0]?Number(args[0]):0; return '0b'+(v>>>0).toString(2).padStart(pad,'0'); }
    case 'toOct': return '0o'+(toNum(pipe)>>>0).toString(8);
    case 'toInt': return toNum(pipe)|0;
    case 'add': return toNum(pipe)+toNum(safeEval(subInputs(args.join(' '),inputs,pipe)));
    case 'sub': return toNum(pipe)-toNum(safeEval(subInputs(args.join(' '),inputs,pipe)));
    case 'mul': return toNum(pipe)*toNum(safeEval(subInputs(args.join(' '),inputs,pipe)));
    case 'div': return toNum(pipe)/toNum(safeEval(subInputs(args.join(' '),inputs,pipe)));
    case 'mod': return toNum(pipe)%toNum(safeEval(subInputs(args.join(' '),inputs,pipe)));
    case 'and': return (toNum(pipe)&toNum(safeEval(subInputs(args.join(' '),inputs,pipe))))>>>0;
    case 'or':  return (toNum(pipe)|toNum(safeEval(subInputs(args.join(' '),inputs,pipe))))>>>0;
    case 'xor': return (toNum(pipe)^toNum(safeEval(subInputs(args.join(' '),inputs,pipe))))>>>0;
    case 'shl': return (toNum(pipe)<<toNum(args[0]??'0'))>>>0;
    case 'shr': return (toNum(pipe)>>>toNum(args[0]??'0'));
    case 'not': return (~toNum(pipe))>>>0;
    default:    return safeEval(subInputs(stage.trim(),inputs,pipe));
  }
}
function evalExpression(raw: string, inputs: string[]): { stages: StageResult[]; final: PipeValue; error: string } {
  const stages=parsePipe(raw);
  if (!stages.length) return { stages:[], final:null, error:'表达式为空' };
  const results: StageResult[]=[]; let pipe: PipeValue=null, err='';
  try {
    pipe=safeEval(subInputs(stages[0],inputs,null as any));
    results.push({ expr:stages[0], output:pipe });
  } catch(e) { err=String(e); results.push({expr:stages[0],output:null,error:err}); return {stages:results,final:null,error:err}; }
  for (let i=1; i<stages.length; i++) {
    try { pipe=evalStage(stages[i],inputs,pipe); results.push({expr:stages[i],output:pipe}); }
    catch(e) { err=String(e); results.push({expr:stages[i],output:null,error:err}); break; }
  }
  return { stages:results, final:pipe, error:err };
}
function inferType(v: PipeValue): string {
  if (v===null||v===undefined) return '—';
  if (typeof v==='number') return Number.isInteger(v)?'int':'num';
  if (typeof v==='string') return /^0x/i.test(v)?'hex':'str';
  return typeof v;
}
function formatVal(v: PipeValue): string {
  if (v===null||v===undefined) return '—';
  if (typeof v==='string') return v.length>60?v.slice(0,57)+'…':v;
  if (typeof v==='number') return Number.isInteger(v)?String(v):String(Math.round(v*1e6)/1e6);
  return String(v);
}

/* ─── Run eval ───────────────────────────────────────────────────────────── */
function runEval() {
  stageResults.value=[]; finalResult.value=null;
  if (!exprText.value.trim()||hasMissing.value) return;
  const inputs=inputVals.value.slice(0,paramCount.value);
  const r=evalExpression(exprText.value.trim(),inputs);
  stageResults.value=r.stages;
  finalResult.value=r.error?null:r.final;
  if (!r.error) saveToHistory(exprText.value.trim());
}

/* ─── History ────────────────────────────────────────────────────────────── */
function loadHistory() {
  try { historyList.value=JSON.parse(localStorage.getItem(HIST_KEY)??'[]'); } catch { historyList.value=[]; }
}
function saveToHistory(expr: string) {
  loadHistory();
  const list=historyList.value.filter(h=>h.expr!==expr);
  list.unshift({expr,timestamp:Date.now()});
  historyList.value=list.slice(0,20);
  localStorage.setItem(HIST_KEY,JSON.stringify(historyList.value));
}
function useHistory(e: {expr:string}) { exprText.value=e.expr; runEval(); }
function fmtTime(ts: number) {
  const d=new Date(ts);
  return `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
loadHistory();

/* ─── Quick fill ─────────────────────────────────────────────────────────── */
function quickFill(expr: string) { exprText.value=expr; runEval(); }

/* ─── Reset / Load sample ────────────────────────────────────────────────── */
function reset() {
  exprText.value = '';
  inputVals.value = [];
  inputLabels.value = [];
  stageResults.value = [];
  finalResult.value = null;
  testcases.value = [];
  csvText.value = '';
  tcRunDone.value = false;
}
function loadSample() {
  reset();
  exprText.value = '$1 | add $2 | mul 2 | toHex 4';
  inputVals.value  = ['100', '28'];
  inputLabels.value = ['温度基值', '偏移量'];
  testcases.value = [
    { vals: ['100', '28'], expected: '0x00a0' },
    { vals: ['200', '56'], expected: '0x0200' },
    { vals: ['0',   '0'],  expected: '0x0000' },
  ];
  runEval();
}

/* ─── Phase 1 status ─────────────────────────────────────────────────────── */
const ph1Status = computed(() => {
  const s=parsePipe(exprText.value); if (!s.length) return '空';
  return `${s.length} 阶段 · ${detectedVars.value.length} 变量`;
});
const ph2Status = computed(() => {
  if (!exprText.value.trim()||!paramCount.value) return '—';
  const m=missingIdx.value.length;
  return m===0 ? `${paramCount.value} 个变量 · 全部就绪` : `${paramCount.value} 个变量 · ${m} 个未填`;
});
const ph3Status = computed(() => {
  if (!exprText.value.trim()) return '空';
  if (hasMissing.value) return `等待 ${missingIdx.value.map(i=>'$'+(i+1)).join(' / ')}`;
  const hasErr = stageResults.value.some(s=>s.error);
  return hasErr ? `✗ 失败` : (stageResults.value.length ? `✓ ${stageResults.value.length} 阶段` : '—');
});
const ph3Done  = computed(() => !!finalResult.value);
const ph3Error = computed(() => stageResults.value.some(s=>s.error));

/* ─── Test cases (Phase 4) ───────────────────────────────────────────────── */
const tcPassed = computed(() => testcases.value.filter(tc=>tc._pass===true).length);
const tcTotal  = computed(() => testcases.value.length);
const tcPct    = computed(() => tcTotal.value ? Math.round((tcPassed.value/tcTotal.value)*100) : 0);

function runAllTc() {
  const vars=detectedVars.value;
  testcases.value.forEach(tc => {
    if (!exprText.value.trim()||vars.length===0) { tc._actual='—'; tc._pass=null; return; }
    const inputs=vars.map((_,i)=>tc.vals[i]??'');
    if (inputs.some(v=>!v)) { tc._actual='缺少输入'; tc._pass=null; return; }
    const r=evalExpression(exprText.value.trim(),inputs);
    tc._actual=r.error?'⚠ '+r.error:String(r.final);
    tc._pass=!r.error&&tc._actual===tc.expected;
  });
  tcRunDone.value=true;
}
function addTc() {
  const vars=detectedVars.value;
  testcases.value.push({ vals:vars.map((_,i)=>inputVals.value[i]||''), expected:'', _pass:null });
}
function delTc(i: number) { testcases.value.splice(i,1); }
function importCsv() {
  const lines=csvText.value.split('\n').map(l=>l.trim()).filter(l=>l&&!l.startsWith('#'));
  if (!lines.length) return;
  const vars=detectedVars.value;
  if (!vars.length) { showToast('请先填写表达式'); return; }
  lines.forEach(line => {
    const cols=line.split(/[\s,]+/).filter(Boolean);
    const expected=cols.pop()??'';
    testcases.value.push({ vals:vars.map((_,i)=>cols[i]??''), expected, _pass:null });
  });
  tcMode.value='table'; showToast(`已导入 ${lines.length} 个用例`);
}
function charDiff(actual: string, expected: string): { a: DiffChar[]; e: DiffChar[] } {
  const a=actual.split(''), b=expected.split(''), m=a.length, n=b.length;
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
  const ar:DiffChar[]=[], er:DiffChar[]=[];
  let i=m, j=n;
  while(i>0||j>0){
    if (i>0&&j>0&&a[i-1]===b[j-1]) { ar.unshift({char:a[i-1],type:'match'}); er.unshift({char:b[j-1],type:'match'}); i--;j--; }
    else if (j>0&&(i===0||dp[i][j-1]>=dp[i-1][j])) { ar.unshift({char:b[j-1],type:'extra'}); j--; }
    else { er.unshift({char:a[i-1],type:'missing'}); i--; }
  }
  return {a:ar,e:er};
}

/* ─── Copy / Toast ───────────────────────────────────────────────────────── */
function copyFinal() {
  if (finalResult.value===null) return;
  navigator.clipboard?.writeText(String(finalResult.value));
  copied.value=true; setTimeout(()=>copied.value=false,1500);
  showToast('已复制 '+String(finalResult.value));
}
function showToast(msg: string) { toastMsg.value=msg; clearTimeout(toastTimer); toastTimer=setTimeout(()=>toastMsg.value='',1600); }

/* ─── History UI state ───────────────────────────────────────────────────── */
const histOpen = ref(false);
</script>

<template>
  <div class="root" @click="histOpen=false">

    <!-- Page header -->
    <div class="page-head">
      <div class="page-head-info">
        <div class="page-head-line">
          <h1 class="page-title">批量表达式计算器</h1>
          <span class="page-badge">管道 · 调试 · 验证</span>
        </div>
        <div class="page-sub">管道表达式实时调试，$N 参数绑定，第 4 阶段支持批量用例 CSV 导入对比</div>
      </div>
      <div class="head-actions">
        <button class="btn btn-ghost" @click="reset">重置</button>
        <button class="btn btn-secondary" @click="loadSample">载入示例</button>
      </div>
    </div>


    <!-- ══ Phase 1: 管道表达式 ══════════════════════════════════════════════ -->
    <div class="phase">
      <div class="phase-head">
        <span class="phase-num">1</span>
        <div class="phase-head-body">
          <div class="phase-title">管道表达式</div>
          <div class="phase-sub">由输入变量 $N 和 | 分隔的操作符组成。在下方面板点击任意操作符追加到当前光标位置。</div>
        </div>
        <span v-if="ph1Status && ph1Status !== '空'" class="phase-status">{{ ph1Status }}</span>
        <!-- History -->
        <div class="hist-wrap" @click.stop>
          <button class="btn btn-ghost btn-hist" @click="histOpen=!histOpen; loadHistory()">
            历史
          </button>
          <div v-if="histOpen" class="hist-drop">
            <div class="hist-hdr">最近表达式</div>
            <div v-if="!historyList.length" class="hist-empty">暂无历史</div>
            <button v-for="(e,i) in historyList" :key="i" class="hist-item" @click="useHistory(e)">
              <span class="hist-expr">{{ e.expr.slice(0,60) }}{{ e.expr.length>60?'…':'' }}</span>
              <span class="hist-time">{{ fmtTime(e.timestamp) }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Expression input + clear -->
      <div class="expr-row">
        <textarea ref="textareaEl" class="expr-input" v-model="exprText"
          placeholder="$1 | add $2 | toHex 8" spellcheck="false" @input="runEval" />
        <button class="btn-ghost-sm" @click="exprText=''; runEval()">清空</button>
      </div>

      <!-- Quick-start -->
      <div v-if="!exprText.trim()" class="qs-wrap">
        <div class="qs-title">快速开始</div>
        <div class="qs-grid">
          <button class="qs-card" @click="quickFill('$1 | toHex 8')"><code>$1 | toHex 8</code><span>数字 → 8位十六进制</span></button>
          <button class="qs-card" @click="quickFill('$1 | shr 8 | and 0xFF')"><code>$1 | shr 8 | and 0xFF</code><span>提取第 2 字节</span></button>
          <button class="qs-card" @click="quickFill('$1 | add $2 | toHex 8')"><code>$1 | add $2 | toHex 8</code><span>两数相加转十六进制</span></button>
          <button class="qs-card" @click="quickFill(`$1 | string.format '%.1f°C'`)"><code>string.format '%.1f°C'</code><span>格式化温度字符串</span></button>
        </div>
      </div>

      <!-- Ops panel -->
      <div class="ops-panel">
        <div class="ops-head">操作符面板 · 悬停看签名说明 · 点击插入到光标处</div>
        <!-- Variables row (auto-derived) -->
        <div class="op-cat-row" data-cat="vars">
          <span class="op-cat-name" :style="{ '--cat-color': CAT_COLOR.vars }">输入</span>
          <div class="op-chips">
            <button v-for="v in (detectedVars.length ? detectedVars : ['$1'])" :key="v"
              class="op-chip" data-cat="vars" @click="insertToken(v, 'vars')">
              {{ v }}
              <span class="chip-pop">
                <div class="cp-sig">{{ v }}</div>
                <div class="cp-desc">引用第 {{ v.slice(1) }} 个输入参数，从「② 输入参数」获取对应值</div>
                <div class="cp-ex">{{ v }} | add 5  →  (在 {{ v }} 的值上加 5)</div>
              </span>
            </button>
          </div>
        </div>
        <!-- Op category rows -->
        <div v-for="cat in CAT_ORDER" :key="cat" class="op-cat-row" :data-cat="cat">
          <span class="op-cat-name" :style="{ '--cat-color': CAT_COLOR[cat] }">{{ CAT_LABELS[cat] }}</span>
          <div class="op-chips">
            <button v-for="[name, op] in Object.entries(OPS).filter(([,o]) => o.cat===cat)" :key="name"
              class="op-chip" :data-cat="cat" @click="insertToken(name, cat)">
              {{ name }}<span v-if="op.sig.includes(' ')" class="op-arg"> {{ op.sig.slice(name.length).trim() }}</span>
              <span class="chip-pop">
                <div class="cp-sig">{{ op.sig }}</div>
                <div class="cp-desc">{{ op.desc }}</div>
                <div class="cp-ex">{{ op.example }}</div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Phase 2: 输入参数 ════════════════════════════════════════════════ -->
    <div class="phase" :class="{ dim: !exprText.trim() }">
      <div class="phase-head">
        <span class="phase-num">2</span>
        <div>
          <div class="phase-title">输入参数</div>
          <div class="phase-sub">表达式中引用的 $N 会自动出现在这里。每个变量可填写值和备注（如 "CPU 温度"）。</div>
        </div>
        <span v-if="ph2Status && ph2Status !== '—'" class="phase-status" :style="{ color: missingIdx.length ? 'var(--warn)' : 'var(--ok)' }">{{ ph2Status }}</span>
      </div>

      <div v-if="!exprText.trim()" class="no-vars-hint">① 中尚未引用任何 $N，下方将随表达式自动填充输入框</div>
      <div v-else-if="paramCount===0" class="no-vars-hint">当前表达式无参数，不需要输入值</div>
      <div v-else class="inputs-list">
        <div v-for="i in paramCount" :key="i" class="input-row" :class="{ 'has-error': missingIdx.includes(i-1) }">
          <span class="var-tag" :class="{ error: missingIdx.includes(i-1) }">${{ i }}</span>
          <div class="input-with-msg">
            <input :class="{ invalid: missingIdx.includes(i-1) }"
              v-model="inputVals[i-1]" @input="runEval"
              :placeholder="`值（数字、字符串、0x... 均可）`" autocomplete="off" />
            <span class="err-msg" v-if="missingIdx.includes(i-1)">⚠ 未输入 ${{ i }} 值，无法进行管道处理</span>
          </div>
          <input class="lbl-input" v-model="inputLabels[i-1]" placeholder="备注（可选）" />
        </div>
      </div>
    </div>

    <!-- ══ Phase 3: 管道处理 ════════════════════════════════════════════════ -->
    <div class="phase" :class="{ done: ph3Done, 'phase-error': ph3Error }">
      <div class="phase-head">
        <span class="phase-num" :class="{ done: ph3Done, 'num-error': ph3Error }">3</span>
        <div>
          <div class="phase-title">管道处理</div>
          <div class="phase-sub">实时展开每个阶段的输入、操作和输出，标注数据类型。最后一行给出最终结果。</div>
        </div>
        <span v-if="ph3Status && ph3Status !== '空'" class="phase-status" :style="{ color: ph3Error ? 'var(--err)' : ph3Done ? 'var(--ok)' : '' }">{{ ph3Status }}</span>
      </div>

      <!-- Empty states -->
      <div v-if="!exprText.trim()" class="pipe-empty">
        <div class="pipe-ico">$ · |</div>
        <div>等待表达式 …</div>
        <div class="pipe-reason">在 <b>①</b> 填入表达式后，每个阶段会在这里展开</div>
      </div>
      <div v-else-if="hasMissing" class="pipe-empty">
        <div class="pipe-ico">… ⏳ …</div>
        <div>等待输入参数</div>
        <div class="pipe-reason">还需填写 {{ missingIdx.map(i=>'$'+(i+1)).join(', ') }} 才能开始计算</div>
      </div>

      <!-- Pipeline flow -->
      <template v-else>
        <div class="pipeline">
          <template v-for="(sr, idx) in stageResults" :key="idx">
            <div class="stage" :class="{ 'input-stage': idx===0, 'stage-error': sr.error }">
              <div class="stage-num" :class="{ 'sn-input': idx===0 }">{{ idx===0 ? '$' : idx }}</div>
              <div class="stage-body">
                <div class="op-text">
                  <template v-if="idx===0">
                    <span class="var-ref">{{ sr.expr }}</span>
                  </template>
                  <template v-else>
                    <span class="op-name" :class="'cat-'+(OPS[sr.expr.split(' ')[0]]?.cat||'arith')">{{ sr.expr.split(' ')[0] }}</span>
                    <span class="arg-lit" v-if="sr.expr.includes(' ')"> {{ sr.expr.split(' ').slice(1).join(' ') }}</span>
                  </template>
                </div>
                <div class="stage-desc">{{ OPS[sr.expr.split(' ')[0]]?.desc || (idx===0 ? '输入值' : '') }}</div>
              </div>
              <div class="stage-val" :class="{ 'val-err': sr.error }">
                <span v-if="!sr.error" class="val-type">{{ inferType(sr.output) }}</span>
                {{ sr.error ? '⚠ '+sr.error : formatVal(sr.output) }}
              </div>
            </div>
            <div v-if="idx < stageResults.length-1" class="stage-connector"></div>
          </template>
        </div>

        <!-- Final result -->
        <div class="final-result" v-if="finalResult!==null && !ph3Error">
          <div>
            <div class="final-lab">最终结果 · {{ inferType(finalResult) }}</div>
            <div class="final-val">{{ String(finalResult) }}</div>
          </div>
          <button class="btn-copy-final" @click="copyFinal">{{ copied ? '✓ 已复制' : '复制' }}</button>
        </div>
      </template>
    </div>

    <!-- ══ Phase 4: 批量用例 ════════════════════════════════════════════════ -->
    <div class="phase">
      <div class="phase-head">
        <span class="phase-num">4</span>
        <div>
          <div class="phase-title">批量用例 <span class="ph4-sub">· 复用 ① 的表达式</span></div>
          <div class="phase-sub">用一组真实「输入 → 预期值」数据，验证 ① 的表达式是否对每一组都得到正确结果。</div>
        </div>
        <span v-if="tcTotal > 0" class="phase-status" :style="{ color: tcPassed===tcTotal ? 'var(--ok)' : tcPassed===0 ? 'var(--err)' : 'var(--warn)' }">
          {{ `${tcPassed} / ${tcTotal} 通过` }}
        </span>
      </div>

      <!-- Current expression context -->
      <div class="tc-context">
        <span class="tc-ctx-lbl">当前表达式</span>
        <span class="tc-ctx-expr" :class="{ empty: !exprText.trim() }">
          {{ exprText.trim() || '（未填写表达式 · 请先在 ① 输入）' }}
        </span>
      </div>

      <!-- Toolbar -->
      <div class="tc-toolbar">
        <button class="btn btn-primary" @click="runAllTc">▶ 运行全部</button>
        <button class="btn btn-secondary" @click="addTc">+ 新增用例</button>
        <div class="seg">
          <button :class="{ active: tcMode==='table' }" @click="tcMode='table'">表格</button>
          <button :class="{ active: tcMode==='csv' }"   @click="tcMode='csv'">CSV 粘贴</button>
        </div>
        <button class="btn btn-ghost" @click="testcases=[]">清空</button>
        <div style="flex:1"></div>
        <div class="tc-stats" v-if="tcTotal && tcRunDone">
          <span class="pill" :class="tcPassed===tcTotal ? 'pill-ok' : tcPassed===0 ? 'pill-err' : 'pill-warn'">{{ tcPassed }} / {{ tcTotal }} 通过</span>
          <div class="pct-bar"><div class="pct-fill" :style="{ width: tcPct+'%', background: tcPassed===tcTotal?'var(--ok)':tcPassed===0?'var(--err)':'var(--warn)' }"></div></div>
          <span class="pct-label">{{ tcPct }}%</span>
        </div>
      </div>

      <!-- CSV import panel -->
      <div class="csv-area" :class="{ open: tcMode==='csv' }">
        <div class="csv-hint">每行一个用例 · 列分隔可用逗号或空格 · 最后一列为预期值</div>
        <textarea v-model="csvText" spellcheck="false"
          placeholder="100, 50, 0x00000096&#10;200, 30, 0x000000e6&#10;0, 0, 0x00000000" />
        <div class="csv-foot">
          <button class="btn btn-secondary" @click="importCsv">导入到表格</button>
          <button class="btn btn-ghost" @click="tcMode='table'; csvText=''">取消</button>
        </div>
      </div>

      <!-- Test cases table -->
      <div v-if="!testcases.length" class="tc-empty">
        <div class="tc-empty-ico">— · — · — · —</div>
        <div>尚无用例 · 点击 <b>+ 新增用例</b> 添加，或切到 CSV 粘贴模式批量导入</div>
      </div>
      <div v-else class="tc-table-wrap">
        <table class="tc-table">
          <thead>
            <tr>
              <th class="num-cell">#</th>
              <th v-for="v in detectedVars" :key="v">{{ v }}</th>
              <th>预期</th>
              <th>实际</th>
              <th class="status-cell">状态</th>
              <th class="action-cell"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tc, i) in testcases" :key="i" :class="tc._pass===true?'row-pass':tc._pass===false?'row-fail':''">
              <td class="num-cell">{{ i+1 }}</td>
              <td v-for="(v, vi) in detectedVars" :key="v">
                <input class="tc-input" v-model="tc.vals[vi]" placeholder="—" />
              </td>
              <td><input class="tc-input" v-model="tc.expected" placeholder="—" /></td>
              <td>
                <template v-if="tc._pass===true"><span class="diff-good">{{ tc._actual }}</span></template>
                <template v-else-if="tc._actual">
                  <span class="diff-text">
                    <span v-for="(dc,ci) in charDiff(tc._actual||'', tc.expected||'').a" :key="ci"
                      :class="dc.type==='match'?'dm':dc.type==='extra'?'da':'de'">{{ dc.char }}</span>
                  </span>
                </template>
                <template v-else><span style="color:var(--text-dim)">—</span></template>
              </td>
              <td class="status-cell">
                <span v-if="tc._pass===null||tc._pass===undefined" class="pill">—</span>
                <span v-else-if="tc._pass" class="pill pill-ok">✓ PASS</span>
                <span v-else class="pill pill-err">✗ FAIL</span>
              </td>
              <td class="action-cell"><button class="del-btn" @click="delTc(i)">✕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast" :class="{ show: toastMsg }">{{ toastMsg }}</div>

  </div>
</template>

<script lang="ts">
export default { name: 'ExprCalcView' };
</script>

<style scoped>
/* ── Bridge: private vars → PTO design tokens ──────────────────────────── */
.root {
  --bg:          var(--background);
  --bg-elev-1:   var(--background-elevated);
  --bg-elev-2:   var(--surface-1);
  --bg-elev-3:   var(--surface-2);
  --border:      var(--border-subtle);
  --border-s:    var(--border-default);
  --text:        var(--foreground);
  --text-mute:   var(--foreground-secondary);
  --text-dim:    var(--foreground-muted);
  --placeholder: var(--foreground-disabled);
  --accent:      var(--primary);
  --accent-hi:   var(--primary-hover);
  --accent-soft: var(--state-selected);
  --ok:          var(--success);
  --warn:        var(--warning);
  --err:         var(--danger);
  --radius:      var(--radius-sm);
  /* --radius-lg, --font-mono, --font-sans resolve from global PTO tokens */

  min-height: 100%;
  padding: 20px 28px 48px;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 13px; line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  display: flex; flex-direction: column; gap: 14px;
  max-width: 960px; margin: 0 auto; width: 100%; box-sizing: border-box;
}
@media (max-width: 800px) {
  .root { padding: 14px 16px 48px; }
}
@media (max-width: 520px) {
  .root { padding: 12px 12px 48px; }
}

/* ── Buttons ───────────────────────────────────────────────────────────── */
.btn {
  display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 12px;
  border-radius:var(--radius); border:1px solid transparent;
  font-size:12.5px; font-family:inherit; cursor:pointer;
  transition:background .12s, color .12s, border-color .12s; user-select:none;
}
.btn:active:not(:disabled) { transform: translateY(1px); }
.btn-primary { background:var(--accent); color:#fff; }
.btn-primary:hover:not(:disabled) { background:var(--accent-hi); }
.btn-secondary { background:var(--surface-2); color:var(--text-mute); border-color:var(--border); }
.btn-secondary:hover { color:var(--text); background:var(--surface-3); }
.btn-ghost { background:transparent; color:var(--text-mute); border-color:var(--border); border-radius:var(--radius); padding:5px 10px; cursor:pointer; font-size:12px; font-family:inherit; }
.btn-ghost:hover { color:var(--text); border-color:var(--border-s); }
.btn-ghost-sm { background:transparent; color:var(--text-dim); border:1px solid var(--border); border-radius:var(--radius); padding:0 10px; cursor:pointer; font-size:12px; font-family:inherit; height:38px; white-space:nowrap; }
.btn-ghost-sm:hover { color:var(--text); border-color:var(--border-s); }

/* ── Page header ───────────────────────────────────────────────────────── */
.page-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding-bottom:14px; border-bottom:1px solid var(--border); }
.page-head-info { min-width:0; }
.page-head-line { display:flex; align-items:center; gap:10px; margin-bottom:4px; flex-wrap:wrap; }
.page-title { font-size:16px; font-weight:600; margin:0; letter-spacing:.01em; color:var(--text); }
.page-badge { font-size:10.5px; font-family:var(--font-mono); background:var(--accent-soft); color:var(--accent); border:1px solid rgba(79,110,247,.3); border-radius:4px; padding:2px 8px; white-space:nowrap; }
.page-sub { font-size:12px; color:var(--text-dim); line-height:1.6; }
.head-actions { display:flex; gap:8px; flex-shrink:0; align-items:flex-start; }

/* ── Phase frame ───────────────────────────────────────────────────────── */
.phase {
  background:var(--bg-elev-1); border:1px solid var(--border); border-radius:var(--radius-lg);
  padding:16px 18px; position:relative;
}
.phase.dim { opacity:.55; pointer-events:none; }
.phase.done { border-color: rgba(52,211,153,.25); }
.phase.phase-error { border-color: rgba(240,101,112,.25); }

/* ← KEY FIX: flex not grid — ensures hist-wrap never falls into a narrow column */
.phase-head {
  display:flex; align-items:center; gap:10px; margin-bottom:12px; flex-wrap:wrap;
}
.phase-head-body { flex:1; min-width:0; }

.phase-num {
  width:22px; height:22px; border-radius:5px; flex-shrink:0;
  background:var(--bg-elev-3); color:var(--text-mute); border:none;
  display:flex; align-items:center; justify-content:center;
  font-family:var(--font-mono); font-size:12px; font-weight:700;
}
.phase-num.done { background:rgba(52,211,153,.15); color:var(--ok); }
.phase-num.num-error { background:rgba(240,101,112,.12); color:var(--err); }

.phase-title { font-size:13.5px; font-weight:600; color:var(--text); }
.phase-sub { font-size:11.5px; color:var(--text-dim); margin-top:1px; }
.phase-status { font-size:11px; color:var(--text-dim); font-family:var(--font-mono); margin-left:auto; white-space:nowrap; }
.ph4-sub { font-size:11.5px; color:var(--text-dim); font-weight:400; }

/* history button compact */
.btn-hist { white-space:nowrap; }

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width:640px) {
  .phase { padding:12px 14px; }
  .page-head { flex-direction:column; gap:8px; }
  .head-actions { width:100%; }
  .input-row { grid-template-columns:44px 1fr; }
  .input-row .lbl-input { grid-column:1/-1; width:100%; }
  .tc-toolbar { flex-wrap:wrap; }
  .off-row { grid-template-columns:1fr; }
}

/* ── Expression input ──────────────────────────────────────────────────── */
.expr-row { display:grid; grid-template-columns:1fr auto; gap:8px; margin-bottom:14px; }
.expr-input {
  background:var(--bg-elev-2); border:none; border-radius:var(--radius);
  color:var(--text); font-family:var(--font-mono); font-size:15px;
  padding:10px 12px; outline:none; resize:vertical; min-height:44px;
  transition:background .12s, box-shadow .12s;
}
.expr-input:focus { background:var(--bg-elev-3); box-shadow:0 0 0 2px var(--accent); }
.expr-input::placeholder { color:var(--placeholder); }

/* ── Quick-start ───────────────────────────────────────────────────────── */
.qs-wrap { margin-top:6px; padding-top:12px; border-top:1px solid var(--border); }
.qs-title { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--text-dim); margin-bottom:8px; }
.qs-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:8px; }
.qs-card { display:flex; flex-direction:column; gap:4px; padding:10px 12px; background:var(--bg-elev-2); border:none; border-radius:var(--radius); cursor:pointer; text-align:left; transition:background .15s; font-family:inherit; }
.qs-card:hover { background:rgba(79,110,247,.10); }
.qs-card code { font-family:var(--font-mono); font-size:11.5px; color:var(--text); font-weight:600; }
.qs-card span { font-size:11px; color:var(--text-dim); }

/* ── Ops panel ─────────────────────────────────────────────────────────── */
.ops-panel { padding:12px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); }
.ops-head { font-size:10.5px; color:var(--text-dim); margin-bottom:8px; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:.05em; }
.op-cat-row { display:grid; grid-template-columns:60px 1fr; gap:10px; padding:4px 0; align-items:start; }
.op-cat-row + .op-cat-row { border-top:1px dashed var(--border); padding-top:8px; margin-top:4px; }
.op-cat-name {
  font-size:11.5px; color:var(--text-mute); font-weight:600; padding-top:4px;
  display:inline-flex; align-items:center; gap:6px;
}
.op-cat-name::before { content:""; width:6px; height:6px; border-radius:50%; background:var(--cat-color, var(--accent)); }
.op-chips { display:flex; flex-wrap:wrap; gap:5px; }
.op-chip {
  position:relative; background:var(--bg-elev-2); border:none;
  border-radius:4px; padding:4px 8px; font-family:var(--font-mono); font-size:11.5px;
  color:var(--text); cursor:pointer; transition:all .1s; user-select:none; line-height:1.4;
}
.op-chip:hover { background:var(--bg-elev-3); border-color:var(--accent); transform:translateY(-1px); }
.op-chip[data-cat="vars"] { background:var(--bg-elev-3); color:var(--text); font-weight:600; }
.op-chip[data-cat="vars"]:hover { background:var(--bg-elev-3); filter:brightness(1.2); }
.op-arg { color:var(--text-dim); margin-left:4px; font-size:10.5px; }

/* Chip popup tooltip */
.chip-pop {
  position:absolute; bottom:calc(100% + 6px); left:50%;
  transform:translateX(-50%) translateY(4px);
  background:var(--background); border:1px solid var(--border-s); border-radius:6px;
  padding:8px 10px; width:240px; z-index:30;
  box-shadow:0 10px 30px rgba(0,0,0,.6);
  opacity:0; pointer-events:none; transition:opacity .15s, transform .15s; text-align:left;
}
.op-chip:hover .chip-pop { opacity:1; transform:translateX(-50%) translateY(0); }
.cp-sig  { font-family:var(--font-mono); font-size:11.5px; color:var(--text); margin-bottom:4px; font-weight:600; }
.cp-desc { font-size:11px; color:var(--text-mute); line-height:1.5; margin-bottom:4px; }
.cp-ex   { font-family:var(--font-mono); font-size:10.5px; color:var(--text-dim); background:var(--bg-elev-2); padding:4px 6px; border-radius:3px; border:1px solid var(--border); }

/* ── Phase 2 inputs ────────────────────────────────────────────────────── */
.no-vars-hint { padding:14px; text-align:center; color:var(--text-dim); font-size:12px; border:1px dashed var(--border-s); border-radius:var(--radius); font-family:var(--font-mono); }
.inputs-list { display:flex; flex-direction:column; gap:8px; }
.input-row { display:grid; grid-template-columns:56px 1fr auto; gap:10px; align-items:center; }
.var-tag { font-family:var(--font-mono); font-size:13.5px; color:var(--accent); font-weight:600; background:var(--accent-soft); border:1px solid rgba(79,110,247,.3); padding:7px 0; border-radius:var(--radius); text-align:center; }
.var-tag.error { background:rgba(240,101,112,.10); color:var(--err); border-color:rgba(240,101,112,.4); }
.input-with-msg { display:flex; flex-direction:column; gap:3px; min-width:0; }
.input-with-msg input {
  background:var(--bg-elev-2); border:none; border-radius:var(--radius);
  color:var(--text); font-family:var(--font-mono); font-size:13px; padding:7px 10px; outline:none;
  transition:background .12s, box-shadow .12s;
}
.input-with-msg input:focus { background:var(--bg-elev-3); box-shadow:0 0 0 2px var(--accent); }
.input-with-msg input.invalid { box-shadow:0 0 0 2px var(--err); }
.err-msg { font-size:11px; color:var(--err); font-family:var(--font-mono); }
.lbl-input { background:transparent; border:0; border-bottom:1px dotted var(--border-s); color:var(--text-mute); font-size:12px; padding:5px 4px; outline:none; width:140px; transition:border-color .1s, color .1s; font-family:inherit; }
.lbl-input:focus { border-bottom-color:var(--accent); color:var(--text); }
.lbl-input::placeholder { color:var(--text-dim); font-style:italic; }

/* ── Phase 3 pipeline ──────────────────────────────────────────────────── */
.pipe-empty { padding:28px 16px; text-align:center; color:var(--text-dim); font-size:12px; border:1px dashed var(--border-s); border-radius:var(--radius); font-family:var(--font-mono); }
.pipe-ico { font-size:22px; color:var(--border-s); margin-bottom:6px; letter-spacing:.3em; }
.pipe-reason { margin-top:4px; font-family:var(--font-sans); font-size:12.5px; color:var(--text-mute); }

.pipeline { display:flex; flex-direction:column; gap:0; }
.stage { display:grid; grid-template-columns:32px 1fr auto; gap:12px; align-items:center; padding:10px 12px; background:var(--bg-elev-2); border:1px solid var(--border); border-radius:var(--radius); transition:border-color .12s; }
.stage:hover { border-color: var(--border-s); }
.stage.input-stage { border-color:rgba(79,110,247,.4); background:rgba(79,110,247,.05); }
.stage.stage-error { border-color:rgba(240,101,112,.5); background:rgba(240,101,112,.04); }

.stage-num { width:22px; height:22px; border-radius:4px; background:var(--bg-elev-2); border:none; color:var(--text-mute); display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:11px; }
.stage-num.sn-input { background:var(--bg-elev-3); color:var(--text); }
.stage-body { min-width:0; }
.op-text { font-family:var(--font-mono); font-size:13px; color:var(--text); }
.op-name { font-weight:600; }
.var-ref  { color:var(--text); font-weight:600; }
.arg-lit  { color:var(--text-mute); }
.stage-desc { margin-top:2px; font-size:11px; color:var(--text-dim); }
.stage-val { font-family:var(--font-mono); font-size:13.5px; color:var(--text); text-align:right; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:280px; }
.stage-val.val-err { color:var(--err); }
.val-type { font-size:10px; color:var(--text-dim); margin-right:6px; text-transform:uppercase; }

.stage-connector { width:1px; height:12px; background:var(--border-s); margin-left:28px; position:relative; }
.stage-connector::after { content:"▼"; position:absolute; left:-3px; bottom:-3px; font-size:7px; color:var(--text-dim); }

.final-result {
  margin-top:12px; padding:14px;
  background:linear-gradient(135deg, rgba(79,110,247,.10), rgba(167,139,250,.04));
  border:1px solid rgba(79,110,247,.35); border-radius:var(--radius);
  display:grid; grid-template-columns:1fr auto; gap:12px; align-items:center;
}
.final-lab { font-size:10.5px; color:var(--text-dim); margin-bottom:3px; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:.05em; }
.final-val { font-family:var(--font-mono); font-size:19px; font-weight:600; color:var(--text); word-break:break-all; }
.btn-copy-final { background:var(--surface-2); color:var(--text-mute); border:1px solid var(--border); border-radius:var(--radius); padding:6px 12px; cursor:pointer; font-size:12px; font-family:inherit; white-space:nowrap; transition:all .12s; }
.btn-copy-final:hover { color:var(--text); border-color:var(--border-s); }

/* ── Phase 4 test cases ────────────────────────────────────────────────── */
.tc-context { display:flex; align-items:center; gap:10px; padding:8px 12px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:10px; font-size:11.5px; color:var(--text-dim); font-family:var(--font-mono); }
.tc-ctx-lbl { color:var(--text-mute); flex-shrink:0; }
.tc-ctx-expr { color:var(--text); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tc-ctx-expr.empty { color:var(--placeholder); font-style:italic; }

.tc-toolbar { display:flex; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap; }
.tc-toolbar .seg { display:inline-flex; background:var(--bg); border:1px solid var(--border-s); border-radius:var(--radius); padding:2px; font-size:11.5px; }
.tc-toolbar .seg button { background:transparent; border:0; color:var(--text-mute); padding:4px 10px; border-radius:4px; cursor:pointer; font-family:inherit; line-height:1; }
.tc-toolbar .seg button.active { background:var(--bg-elev-3); color:var(--text); }
.tc-stats { display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-size:11px; }
.pct-bar { width:80px; height:4px; background:var(--bg-elev-3); border-radius:2px; overflow:hidden; }
.pct-fill { height:100%; transition:width .25s; }
.pct-label { color:var(--text-dim); }

.csv-area { display:none; margin-bottom:10px; padding:12px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); }
.csv-area.open { display:block; }
.csv-hint { font-size:11.5px; color:var(--text-dim); margin-bottom:6px; font-family:var(--font-mono); }
.csv-area textarea { width:100%; min-height:80px; background:var(--bg-elev-1); border:1px solid var(--border-s); border-radius:var(--radius); color:var(--text); font-family:var(--font-mono); font-size:12px; padding:8px 10px; outline:none; resize:vertical; box-sizing:border-box; }
.csv-area textarea:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
.csv-foot { display:flex; gap:8px; margin-top:8px; }

.tc-empty { padding:22px 18px; text-align:center; color:var(--text-dim); font-size:12px; }
.tc-empty-ico { font-family:var(--font-mono); color:var(--border-s); font-size:18px; margin-bottom:4px; }

.tc-table-wrap { border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
.tc-table { width:100%; border-collapse:collapse; table-layout:fixed; }
.tc-table thead th { padding:8px 12px; text-align:left; font-size:10.5px; font-weight:500; color:var(--text-dim); text-transform:uppercase; letter-spacing:.05em; border-bottom:1px solid var(--border); background:var(--bg-elev-2); white-space:nowrap; }
.tc-table tbody td { padding:6px 12px; border-bottom:1px solid var(--border); font-family:var(--font-mono); font-size:12px; color:var(--text); vertical-align:middle; overflow:hidden; text-overflow:ellipsis; }
.tc-table tbody tr:last-child td { border-bottom:0; }
.tc-table tbody tr:hover { background:var(--bg-elev-2); }
.row-pass td { background:rgba(52,211,153,.04); }
.row-fail td { background:rgba(240,101,112,.04); }
.row-fail:hover td { background:rgba(240,101,112,.08) !important; }
.num-cell { width:36px; color:var(--text-dim); font-size:11px; }
.status-cell { width:80px; }
.action-cell { width:44px; text-align:right; }
.tc-input { background:transparent; border:0; color:var(--text); font-family:var(--font-mono); font-size:12px; width:100%; padding:4px 0; outline:none; }
.tc-input:focus { background:var(--bg); padding:4px 6px; border-radius:3px; box-shadow:0 0 0 2px var(--accent-soft); }
.del-btn { background:transparent; border:0; color:var(--text-dim); cursor:pointer; font-size:14px; padding:2px 6px; border-radius:3px; line-height:1; }
.del-btn:hover { color:var(--err); background:rgba(240,101,112,.08); }

.diff-good { color:var(--ok); }
.diff-text { font-family:var(--font-mono); font-size:11.5px; }
.dm { /* match */ }
.de { background:rgba(52,211,153,.22); color:var(--ok); border-radius:2px; }
.da { background:rgba(240,101,112,.28); color:var(--err); border-radius:2px; text-decoration:line-through; }

/* ── Pills ─────────────────────────────────────────────────────────────── */
.pill { display:inline-flex; align-items:center; padding:2px 8px; border-radius:999px; font-size:11px; font-family:var(--font-mono); background:var(--bg-elev-2); border:1px solid var(--border); color:var(--text-mute); }
.pill-ok  { background:rgba(52,211,153,.08);  color:var(--ok);   border-color:rgba(52,211,153,.3); }
.pill-err { background:rgba(240,101,112,.08); color:var(--err);  border-color:rgba(240,101,112,.3); }
.pill-warn{ background:rgba(245,180,84,.08);  color:var(--warn); border-color:rgba(245,180,84,.3); }

/* ── History ───────────────────────────────────────────────────────────── */
.hist-wrap { position:relative; }
.hist-drop { position:absolute; right:0; top:calc(100% + 6px); z-index:200; background:var(--surface-1); border:1px solid var(--border); border-radius:8px; min-width:340px; max-height:280px; overflow-y:auto; box-shadow:0 8px 24px rgba(0,0,0,.5); }
.hist-hdr { padding:10px 14px 7px; font-size:12px; font-weight:600; color:var(--accent); border-bottom:1px solid var(--border); }
.hist-empty { padding:12px 14px; font-size:12px; color:var(--text-dim); }
.hist-item { display:flex; justify-content:space-between; align-items:center; gap:10px; padding:9px 14px; cursor:pointer; border-bottom:1px solid rgba(42,48,80,.5); background:none; border-left:none; border-right:none; border-top:none; width:100%; text-align:left; font-family:inherit; color:inherit; }
.hist-item:hover { background:rgba(79,110,247,.12); }
.hist-expr { font-family:var(--font-mono); font-size:11.5px; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.hist-time { font-size:10.5px; color:var(--text-dim); flex-shrink:0; }

/* ── Toast ─────────────────────────────────────────────────────────────── */
.toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(20px); background:var(--bg-elev-2); border:none; color:var(--text); padding:8px 14px; border-radius:6px; font-size:12px; opacity:0; pointer-events:none; transition:opacity .18s, transform .18s; z-index:30; box-shadow:0 10px 30px rgba(0,0,0,.55); }
.toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

::-webkit-scrollbar { width:6px; height:6px; }
::-webkit-scrollbar-thumb { background:var(--border-s); border-radius:3px; }
::-webkit-scrollbar-track { background:transparent; }
</style>
