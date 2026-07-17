<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';

/* ─── Field definitions ─────────────────────────────────────────────────── */
type FieldKey = 'func' | 'cmd' | 'ms' | 'rw' | 'param';
interface FieldDef { hi: number; lo: number; width: number; hexDigits: number; shortLabel: string; }
const FIELDS: Record<FieldKey, FieldDef> = {
  func:  { hi: 31, lo: 26, width: 6,  hexDigits: 2, shortLabel: 'Function' },
  cmd:   { hi: 25, lo: 10, width: 16, hexDigits: 4, shortLabel: 'Command'  },
  ms:    { hi: 9,  lo: 9,  width: 1,  hexDigits: 1, shortLabel: 'MS'       },
  rw:    { hi: 8,  lo: 8,  width: 1,  hexDigits: 1, shortLabel: 'RW'       },
  param: { hi: 7,  lo: 0,  width: 8,  hexDigits: 2, shortLabel: 'Param'    },
};
const FIELD_ORDER: FieldKey[] = ['func','cmd','ms','rw','param'];
const FUNC_LOOKUP: Record<number, string> = {
  0x01:'系统管理 System', 0x02:'电源管理 Power', 0x03:'风扇控制 Fan',
  0x0C:'温度管理 Thermal', 0x10:'存储 Storage', 0x20:'网络 Network',
};
const MS_LABEL: Record<number, string> = { 0:'多读 Multi-read', 1:'单读 Single-read' };
const RW_LABEL: Record<number, string> = { 0:'写 Write', 1:'读 Read' };

// Known SMC Function codes → subsystem (used for the Function dropdown suggestions).
const FUNC_OPTIONS: { hex: string; label: string }[] = Object.entries(FUNC_LOOKUP)
  .map(([code, label]) => ({ hex: '0x' + Number(code).toString(16).toUpperCase().padStart(2, '0'), label }));

// Per-field hover tip (the old legend, now shown on bitmap hover).
const FIELD_TIP: Record<FieldKey, string> = {
  func:  '功能码 Function · [31:26] · 6 bit',
  cmd:   '命令码 Command · [25:10] · 16 bit',
  ms:    '读取方式 MS · [9] · 1 bit',
  rw:    '读写方向 RW · [8] · 1 bit',
  param: '参数 Param · [7:0] · 8 bit',
};

const HUE_COLOR: Record<FieldKey, string> = {
  func: '#f59e6b', cmd: '#4f6ef7', ms: '#a78bfa', rw: '#34d399', param: '#f5b454'
};

/* ─── State ─────────────────────────────────────────────────────────────── */
const fieldVals  = reactive<Record<FieldKey, number | null>>({ func:null, cmd:null, ms:null, rw:null, param:null });
const fieldTexts = reactive<Record<FieldKey, string>>({ func:'', cmd:'', ms:'', rw:'', param:'' });
const fieldErrs  = reactive<Record<FieldKey, string>>({ func:'', cmd:'', ms:'', rw:'', param:'' });
const hexVal = ref('');
const decVal = ref('');
const hexErr = ref('');
const decErr = ref('');
const copyFmt    = ref<'hex'|'dec'|'both'|'c'|'json'>('hex');
const fmtOpen    = ref(false);
const funcMenuOpen = ref(false);
const copiedFld  = ref<FieldKey | null>(null);
const copiedAll  = ref(false);
const toastMsg   = ref('');
let   toastTimer: ReturnType<typeof setTimeout>;

interface HistEntry { word: number; parts: Record<string, number>; ts: number; }
const history = ref<HistEntry[]>([]);
const HIST_KEY = 'ubmc.smc.history.v2';

/* ─── Math ──────────────────────────────────────────────────────────────── */
function pad(s: string, n: number): string { return s.length >= n ? s : '0'.repeat(n - s.length) + s; }
function composeWord(): number {
  let w = 0;
  for (const k of FIELD_ORDER) { const v = fieldVals[k]; if (v !== null) w = (w | ((v << FIELDS[k].lo) >>> 0)) >>> 0; }
  return w >>> 0;
}
function decomposeWord(w: number): Record<FieldKey, number> {
  const out = {} as Record<FieldKey, number>;
  for (const k of FIELD_ORDER) { const mask = (1 << FIELDS[k].width) - 1; out[k] = (w >>> FIELDS[k].lo) & mask; }
  return out;
}
function anySet(): boolean { return FIELD_ORDER.some(k => fieldVals[k] !== null); }
function fmtHex(w: number): string { return '0x' + pad(w.toString(16).toUpperCase(), 8); }

/* ─── Parse ─────────────────────────────────────────────────────────────── */
function parseLoose(raw: string, maxBits: number, hexOnly = false): { ok: boolean; value: number | null; err?: string } {
  const s = raw.trim();
  if (!s) return { ok:true, value:null };
  let n: number;
  if (hexOnly) {
    // Field inputs show a fixed "0x" prefix — always parse as hex, strip prefix if accidentally typed.
    const digits = s.replace(/^0x/i, '');
    if (!/^[0-9a-f]+$/i.test(digits)) return { ok:false, value:null, err:'请输入十六进制数字' };
    n = parseInt(digits, 16);
  } else if (/^0x/i.test(s)) {
    if (!/^0x[0-9a-f]+$/i.test(s)) return { ok:false, value:null, err:'不是合法的十六进制' };
    n = parseInt(s.slice(2), 16);
  } else if (/^[0-9a-f]+$/i.test(s) && /[a-f]/i.test(s)) {
    n = parseInt(s, 16);
  } else if (/^-?[0-9]+$/.test(s)) {
    n = parseInt(s, 10);
  } else return { ok:false, value:null, err:'只接受 dec 或 0x hex' };
  if (!Number.isFinite(n) || n < 0) return { ok:false, value:null, err:'非法数字' };
  const max = maxBits === 32 ? 0xFFFFFFFF : ((1 << maxBits) - 1);
  if (n > max) return { ok:false, value:null, err:`超出 ${maxBits}-bit 范围` };
  return { ok:true, value: n >>> 0 };
}

/* ─── Input handlers ────────────────────────────────────────────────────── */
function syncFromWord(w: number, skip: 'hex'|'dec'|'') {
  if (skip !== 'hex') hexVal.value = fmtHex(w);
  if (skip !== 'dec') decVal.value = String(w);
  hexErr.value = ''; decErr.value = '';
  const parts = decomposeWord(w);
  FIELD_ORDER.forEach(k => {
    fieldVals[k]  = parts[k];
    fieldTexts[k] = pad(parts[k].toString(16).toUpperCase(), FIELDS[k].hexDigits);
    fieldErrs[k]  = '';
  });
}
function onTopInput(src: 'hex'|'dec') {
  const raw = src === 'hex' ? hexVal.value : decVal.value;
  hexErr.value = ''; decErr.value = '';
  if (!raw.trim()) {
    FIELD_ORDER.forEach(k => { fieldVals[k]=null; fieldTexts[k]=''; fieldErrs[k]=''; });
    if (src==='hex') decVal.value=''; else hexVal.value=''; return;
  }
  const r = parseLoose(raw, 32);
  if (!r.ok) { if (src==='hex') hexErr.value=r.err||''; else decErr.value=r.err||''; return; }
  syncFromWord(r.value!, src);
}
function onFieldInput(k: FieldKey) {
  fieldErrs[k] = '';
  const r = parseLoose(fieldTexts[k], FIELDS[k].width, true);
  if (!r.ok) { fieldErrs[k]=r.err||''; return; }
  fieldVals[k] = r.value;
  if (anySet()) { const w = composeWord(); hexVal.value=fmtHex(w); decVal.value=String(w); hexErr.value=''; decErr.value=''; }
}
function onFieldBlur(k: FieldKey) {
  const v = fieldVals[k];
  if (v !== null) fieldTexts[k] = pad(v.toString(16).toUpperCase(), FIELDS[k].hexDigits);
}
// Dropdown setter for single-bit fields (MS / RW) — keeps the offset in sync.
function setBit(k: FieldKey, raw: string) { fieldTexts[k] = raw; onFieldInput(k); }

/* ─── Computed ──────────────────────────────────────────────────────────── */
const bitCells = computed(() => {
  const w = composeWord(); const set = anySet();
  return Array.from({length:32}, (_,col) => {
    const bitIdx = 31 - col;
    let hue: FieldKey;
    if (bitIdx >= 26) hue='func'; else if (bitIdx >= 10) hue='cmd';
    else if (bitIdx === 9) hue='ms'; else if (bitIdx === 8) hue='rw'; else hue='param';
    return { bitIdx, hue, on: set && ((w >>> bitIdx) & 1)===1, set,
      isBoundary: [5,21,22,23].includes(col),
      isPosBound: [31,26,25,10,9,8,7,0].includes(bitIdx) };
  });
});

function fDec(k: FieldKey): string { const v=fieldVals[k]; return v===null?'—':String(v); }
function fHex(k: FieldKey): string { const v=fieldVals[k]; return v===null?'—':'0x'+pad(v.toString(16).toUpperCase(),FIELDS[k].hexDigits); }
function fSem(k: FieldKey): string {
  const v=fieldVals[k]; if (v===null) return '';
  if (k==='func') return FUNC_LOOKUP[v] ? '· '+FUNC_LOOKUP[v] : '';
  if (k==='ms')   return '· '+(MS_LABEL[v]||'');
  if (k==='rw')   return '· '+(RW_LABEL[v]||'');
  return '';
}

/* ─── Copy ──────────────────────────────────────────────────────────────── */
function formattedCopy(fmt: string): string {
  const w=composeWord(), hex=fmtHex(w), dec=String(w);
  switch (fmt) {
    case 'dec':  return dec;
    case 'both': return `${hex} (${dec})`;
    case 'c':    return hex+'u';
    case 'json': {
      const p=decomposeWord(w);
      return JSON.stringify({ offset:hex, func:'0x'+pad(p.func.toString(16).toUpperCase(),2),
        cmd:'0x'+pad(p.cmd.toString(16).toUpperCase(),4), ms:p.ms, rw:p.rw,
        param:'0x'+pad(p.param.toString(16).toUpperCase(),2) });
    }
    default: return hex;
  }
}
function preview(fmt: string): string {
  if (!anySet()) return fmt==='hex'?'0x00000000':'—';
  const s=formattedCopy(fmt); return s.length>28?s.slice(0,26)+'…':s;
}
function copyAll() {
  if (!anySet()) return;
  const txt=formattedCopy(copyFmt.value);
  navigator.clipboard?.writeText(txt);
  showToast('已复制 '+(txt.length>36?txt.slice(0,34)+'…':txt));
  saveToHistory(); copiedAll.value=true; setTimeout(()=>copiedAll.value=false,1200);
}
function doFmt(fmt: 'hex'|'dec'|'both'|'c'|'json') { copyFmt.value=fmt; fmtOpen.value=false; copyAll(); }
function copyFldBtn(k: FieldKey) {
  const v=fieldVals[k]; if (v===null) return;
  const txt='0x'+pad(v.toString(16).toUpperCase(),FIELDS[k].hexDigits);
  navigator.clipboard?.writeText(txt);
  showToast(`已复制 ${FIELDS[k].shortLabel}: ${txt}`);
  copiedFld.value=k; setTimeout(()=>copiedFld.value=null,1200);
}

/* ─── Reset / Sample ────────────────────────────────────────────────────── */
function reset() {
  FIELD_ORDER.forEach(k=>{ fieldVals[k]=null; fieldTexts[k]=''; fieldErrs[k]=''; });
  hexVal.value=''; decVal.value=''; hexErr.value=''; decErr.value='';
}
function loadSample() { hexVal.value='0x30004500'; onTopInput('hex'); }

/* ─── History ───────────────────────────────────────────────────────────── */
function saveToHistory() {
  if (!anySet()) return;
  const snap:HistEntry = { word:composeWord(), parts:Object.fromEntries(FIELD_ORDER.map(k=>[k,fieldVals[k]??0])), ts:Date.now() };
  if (history.value[0]?.word === snap.word) return;
  history.value.unshift(snap); if (history.value.length>10) history.value.length=10;
  try { localStorage.setItem(HIST_KEY, JSON.stringify(history.value)); } catch {}
}
function loadHistory() {
  try { const s=localStorage.getItem(HIST_KEY); if (s) history.value=JSON.parse(s)||[]; } catch {}
}
function restoreHist(i: number) {
  const it=history.value[i]; if (!it) return;
  FIELD_ORDER.forEach(k=>{ fieldVals[k]=it.parts[k]??0; fieldTexts[k]=pad((it.parts[k]??0).toString(16).toUpperCase(),FIELDS[k].hexDigits); fieldErrs[k]=''; });
  hexVal.value=fmtHex(it.word); decVal.value=String(it.word); hexErr.value=''; decErr.value='';
  showToast('已回填 '+fmtHex(it.word));
}
function clearHistory() { history.value=[]; try { localStorage.removeItem(HIST_KEY); } catch {} }
function histTs(ts: number): string { const t=new Date(ts); return String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0'); }

/* ─── Toast ─────────────────────────────────────────────────────────────── */
function showToast(msg: string) { toastMsg.value=msg; clearTimeout(toastTimer); toastTimer=setTimeout(()=>toastMsg.value='',1600); }

/* ─── Lifecycle ─────────────────────────────────────────────────────────── */
function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s') { e.preventDefault(); saveToHistory(); showToast('已保存当前结果'); }
}
function closeFmt(e: Event) {
  const t = e.target as HTMLElement;
  if (!t.closest?.('.split-btn'))  fmtOpen.value = false;
  if (!t.closest?.('.func-picker')) funcMenuOpen.value = false;
}
// Pick a known Function code from the dropdown.
function pickFunc(hex: string) {
  fieldTexts.func = hex.replace(/^0x/i, '').toUpperCase().padStart(FIELDS.func.hexDigits, '0');
  onFieldInput('func');
  funcMenuOpen.value = false;
}
onMounted(() => {
  loadHistory();
  window.addEventListener('keydown',onKeydown);
  document.addEventListener('click',closeFmt);
});
onUnmounted(() => { window.removeEventListener('keydown',onKeydown); document.removeEventListener('click',closeFmt); clearTimeout(toastTimer); });
</script>

<template>
  <div class="root">

    <!-- Page header -->
    <div class="page-head">
      <div class="page-head-info">
        <div class="page-head-line">
          <h1 class="page-title">SMC 偏移量计算器</h1>
          <span class="page-badge">32-bit · 双向</span>
        </div>
        <div class="page-sub">一句话:把 SMC 寄存器访问的 32 位偏移量,在「整字 ⇄ 功能码 / 命令码 / MS / RW / 参数」之间双向实时编解码,十进制与十六进制随时互转。</div>
      </div>
      <div class="head-actions">
        <button class="btn btn-ghost" @click="reset">重置</button>
        <button class="btn btn-secondary" @click="loadSample">示例</button>
      </div>
    </div>


    <!-- ① Offset bar -->
    <div class="offset-bar">
      <div class="section-h">
        <span class="sec-title">偏移量 · 32-bit Offset</span>
        <span class="sec-hint">输入十六进制或十进制，两边自动联动；下方字段同时刷新</span>
      </div>
      <div class="off-row">
        <div class="offset-input-wrap" :class="{ invalid: hexErr, synced: anySet() && !hexErr }">
          <div class="oiw-tag"><span>HEX</span><span class="sync">●</span></div>
          <div class="hex-input-row">
            <span class="oiw-pfx">0x</span>
            <input
              :value="hexVal.replace(/^0x/i, '')"
              @input="(e) => { hexVal = '0x' + (e.target as HTMLInputElement).value; onTopInput('hex'); }"
              placeholder="00000000" autocomplete="off" spellcheck="false" />
          </div>
        </div>
        <div class="offset-input-wrap" :class="{ invalid: decErr, synced: anySet() && !decErr }">
          <div class="oiw-tag"><span>DEC · 0 – 4 294 967 295</span><span class="sync">●</span></div>
          <input v-model="decVal" @input="onTopInput('dec')" placeholder="0" autocomplete="off" spellcheck="false" inputmode="numeric" />
        </div>
        <div class="offset-actions">
          <div class="split-btn" @click.stop>
            <button class="btn btn-primary btn-copy" :disabled="!anySet()" @click="copyAll">
              {{ copiedAll ? '已复制 ✓' : '复制偏移量' }}
            </button>
            <button class="btn btn-primary btn-fmt-arr" :disabled="!anySet()" @click="fmtOpen = !fmtOpen">▾</button>
            <div class="fmt-menu" :class="{ open: fmtOpen }">
              <div class="fmt-item" :class="{ active: copyFmt === 'hex' }"  @click="doFmt('hex')">  <span>仅 HEX</span><span class="fp">{{ preview('hex') }}</span></div>
              <div class="fmt-item" :class="{ active: copyFmt === 'dec' }"  @click="doFmt('dec')">  <span>仅 DEC</span><span class="fp">{{ preview('dec') }}</span></div>
              <div class="fmt-item" :class="{ active: copyFmt === 'both' }" @click="doFmt('both')"> <span>HEX + DEC</span><span class="fp">{{ preview('both') }}</span></div>
              <div class="fmt-item" :class="{ active: copyFmt === 'c' }"    @click="doFmt('c')">    <span>C 字面量</span><span class="fp">{{ preview('c') }}</span></div>
              <div class="fmt-item" :class="{ active: copyFmt === 'json' }" @click="doFmt('json')"> <span>JSON 字段</span><span class="fp fp-sm">{ "func": …}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="offset-err">{{ hexErr || decErr }}</div>
    </div>

    <!-- ② Bitmap -->
    <div class="bitmap-card">
      <div class="section-h">
        <span class="sec-title">32-bit 位图</span>
        <span class="sec-hint">MSB → LSB · 每格 1 bit · 悬停色块或某一位查看字段含义</span>
      </div>
      <div class="bit-grid-scroll">
        <div class="bit-grid">
          <!-- Row 1: field bands (hover = legend tip) -->
          <div class="field-band hue-func"  style="grid-column: 1/7"  :title="FIELD_TIP.func">Function<span class="seg-info">[31:26]</span></div>
          <div class="field-band hue-cmd"   style="grid-column: 7/23" :title="FIELD_TIP.cmd">Command<span class="seg-info">[25:10]</span></div>
          <div class="field-band hue-ms"    style="grid-column: 23/24" :title="FIELD_TIP.ms">MS</div>
          <div class="field-band hue-rw"    style="grid-column: 24/25" :title="FIELD_TIP.rw">RW</div>
          <div class="field-band hue-param" style="grid-column: 25/33" :title="FIELD_TIP.param">Param<span class="seg-info">[7:0]</span></div>
          <!-- Row 2: bit cells (hover = field + bit index) -->
          <div v-for="c in bitCells" :key="c.bitIdx"
            class="bit-cell"
            :class="[`hue-${c.hue}`, { on: c.on, boundary: c.isBoundary }]"
            :title="`${FIELD_TIP[c.hue]} · 第 ${c.bitIdx} 位`">
            {{ c.set ? (c.on ? '1' : '0') : '0' }}
          </div>
          <!-- Row 3: position labels -->
          <div v-for="c in bitCells" :key="'p'+c.bitIdx" class="bit-pos" :class="{ boundary: c.isPosBound }">
            {{ c.isPosBound ? c.bitIdx : '' }}
          </div>
        </div>
      </div>
    </div>

    <!-- ③ Field cards -->
    <div class="fields-card">
      <div class="section-h">
        <span class="sec-title">字段拆解 · 双向编辑</span>
        <span class="sec-hint">输入 0x 开头即十六进制，否则按十进制解析</span>
      </div>
      <!-- Row 1: func + cmd (6fr / 16fr split) -->
      <div class="fields-row r1">
        <div class="field-card" :style="{ borderTopColor: HUE_COLOR.func }">
          <div class="field-head">
            <span class="field-label"><span class="swatch" :style="{ background: HUE_COLOR.func }"></span>功能码 · <i class="code-anno">Function</i></span>
            <span class="field-meta">[31:26] · 6b</span>
          </div>
          <div class="field-input-wrap" title="功能码：标识子系统（电源 / 风扇 / 温度…），可下拉选择已知代号或自由输入">
            <div class="func-picker">
              <div class="hex-pfx-wrap" :class="{ invalid: fieldErrs.func }">
                <span class="hex-pfx">0x</span>
                <input class="field-input" v-model="fieldTexts.func" @input="onFieldInput('func')" @blur="onFieldBlur('func')"
                  placeholder="00" autocomplete="off" spellcheck="false" />
                <button type="button" class="func-caret" :class="{ open: funcMenuOpen }" title="已知功能码" @click.stop="funcMenuOpen = !funcMenuOpen">▾</button>
              </div>
              <div class="func-menu" :class="{ open: funcMenuOpen }">
                <div class="func-menu-h">已知功能码</div>
                <div class="func-opt" v-for="o in FUNC_OPTIONS" :key="o.hex"
                  :class="{ active: fieldTexts.func.toUpperCase() === o.hex.replace(/^0x/i,'').toUpperCase() }" @click="pickFunc(o.hex)">
                  <span class="fo-hex">{{ o.hex }}</span>
                  <span class="fo-label">{{ o.label }}</span>
                </div>
                <div class="func-menu-note">其他值直接在左侧输入(00 – 3F)</div>
              </div>
            </div>
            <button class="field-copy" :class="{ copied: copiedFld==='func' }" :disabled="fieldVals.func===null" @click="copyFldBtn('func')">⧉</button>
          </div>
          <div class="field-foot">
            <span class="pair">
              <span :class="{ muted: fieldVals.func===null }"><span class="k">DEC </span><span class="v">{{ fDec('func') }}</span></span>
              <span :class="{ muted: fieldVals.func===null }"><span class="k">HEX </span><span class="v">{{ fHex('func') }}</span></span>
            </span>
            <span class="semantic" :class="{ ferr: fieldErrs.func }">{{ fieldErrs.func || fSem('func') }}</span>
          </div>
        </div>
        <div class="field-card" :style="{ borderTopColor: HUE_COLOR.cmd }">
          <div class="field-head">
            <span class="field-label"><span class="swatch" :style="{ background: HUE_COLOR.cmd }"></span>命令码 · <i class="code-anno">Command</i></span>
            <span class="field-meta">[25:10] · 16b · 0–0xFFFF</span>
          </div>
          <div class="field-input-wrap" title="命令码：在功能码下的具体操作编号">
            <div class="hex-pfx-wrap" :class="{ invalid: fieldErrs.cmd }">
              <span class="hex-pfx">0x</span>
              <input class="field-input" v-model="fieldTexts.cmd" @input="onFieldInput('cmd')" @blur="onFieldBlur('cmd')"
                placeholder="0000" autocomplete="off" spellcheck="false" />
            </div>
            <button class="field-copy" :class="{ copied: copiedFld==='cmd' }" :disabled="fieldVals.cmd===null" @click="copyFldBtn('cmd')">⧉</button>
          </div>
          <div class="field-foot">
            <span class="pair">
              <span :class="{ muted: fieldVals.cmd===null }"><span class="k">DEC </span><span class="v">{{ fDec('cmd') }}</span></span>
              <span :class="{ muted: fieldVals.cmd===null }"><span class="k">HEX </span><span class="v">{{ fHex('cmd') }}</span></span>
            </span>
            <span class="semantic" :class="{ ferr: fieldErrs.cmd }">{{ fieldErrs.cmd }}</span>
          </div>
        </div>
      </div>
      <!-- Row 2: ms + rw + param -->
      <div class="fields-row r2">
        <div v-for="k in (['ms','rw','param'] as FieldKey[])" :key="k"
          class="field-card" :style="{ borderTopColor: HUE_COLOR[k] }">
          <div class="field-head">
            <span class="field-label"><span class="swatch" :style="{ background: HUE_COLOR[k] }"></span>
              {{ k==='ms' ? '读取方式 · ' : k==='rw' ? '读写方向 · ' : '参数 · ' }}<i class="code-anno">{{ k==='ms' ? 'MS' : k==='rw' ? 'RW' : 'Param' }}</i>
            </span>
            <span class="field-meta">{{ k==='ms' ? '[9] · 1b' : k==='rw' ? '[8] · 1b' : '[7:0] · 8b · 0–0xFF' }}</span>
          </div>
          <div class="field-input-wrap"
            :title="k==='ms' ? '读取方式：多读=连续读取多个值，单读=单次读取' : k==='rw' ? '读写方向：0=写入，1=读取' : '参数：命令附带的 8 位参数'">
            <!-- MS / RW are single-bit enums → segmented pills; Param stays free input -->
            <div v-if="k==='ms' || k==='rw'" class="smc-pillset">
              <button type="button" class="smc-pill p-write" :class="{ on: fieldVals[k]===0 }" @click="setBit(k,'0')">
                <b>0</b> {{ k==='ms' ? '多读' : '写' }}
              </button>
              <button type="button" class="smc-pill p-read" :class="{ on: fieldVals[k]===1 }" @click="setBit(k,'1')">
                <b>1</b> {{ k==='ms' ? '单读' : '读' }}
              </button>
            </div>
            <div v-else class="hex-pfx-wrap" :class="{ invalid: fieldErrs[k] }">
              <span class="hex-pfx">0x</span>
              <input class="field-input" v-model="fieldTexts[k]" @input="onFieldInput(k)" @blur="onFieldBlur(k)"
                placeholder="00" autocomplete="off" spellcheck="false" />
            </div>
            <button class="field-copy" :class="{ copied: copiedFld===k }" :disabled="fieldVals[k]===null" @click="copyFldBtn(k)">⧉</button>
          </div>
          <div class="field-foot">
            <span class="pair">
              <span :class="{ muted: fieldVals[k]===null }"><span class="k">DEC </span><span class="v">{{ fDec(k) }}</span></span>
              <span v-if="k==='param'" :class="{ muted: fieldVals[k]===null }"><span class="k">HEX </span><span class="v">{{ fHex(k) }}</span></span>
            </span>
            <span class="semantic" :class="{ ferr: fieldErrs[k] }">{{ fieldErrs[k] || fSem(k) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ④ History -->
    <div class="history-card">
      <div class="section-h" style="margin:0;">
        <span class="sec-title">最近 10 次计算</span>
        <span class="hist-actions">
          <span class="sec-hint">Ctrl+S 收集 · 点击回填</span>
          <button class="btn btn-ghost btn-xs" @click="clearHistory">清空</button>
        </span>
      </div>
      <ul class="history-list">
        <li v-if="!history.length" class="history-empty" style="grid-column:1/-1;">尚无历史记录 · 复制即自动收藏</li>
        <li v-for="(it,i) in history" :key="i" class="history-item" @click="restoreHist(i)">
          <span class="idx">{{ String(i+1).padStart(2,' ') }}</span>
          <span class="hval">{{ fmtHex(it.word) }}</span>
          <span class="hts">{{ histTs(it.ts) }}</span>
        </li>
      </ul>
    </div>

    <!-- Toast -->
    <div class="toast" :class="{ show: toastMsg }">{{ toastMsg }}</div>

  </div>
</template>

<script lang="ts">
export default { name: 'SmcOffsetView' };
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
  --err:         var(--danger);
  --radius:      var(--radius-sm);
  /* --radius-lg, --font-mono, --font-sans resolve from global PTO tokens */

  /* ── Data-viz-exempt: SMC field segment colors ─────────────────────────── */
  --hue-func:    #f59e6b;
  --hue-cmd:     #4f6ef7;
  --hue-ms:      #a78bfa;
  --hue-rw:      #34d399;
  --hue-param:   #f5b454;

  min-height: 100%;
  padding: 20px 28px 48px;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.5;
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

/* ── Page header (unified style) ───────────────────────────────────────── */
.page-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding-bottom:14px; border-bottom:1px solid var(--border); }
.page-head-info { min-width:0; }
.page-head-line { display:flex; align-items:center; gap:10px; margin-bottom:4px; flex-wrap:wrap; }
.page-title { font-size:16px; font-weight:600; margin:0; letter-spacing:.01em; color:var(--text); }
.page-badge { font-size:10.5px; font-family:var(--font-mono); background:var(--accent-soft); color:var(--accent); border:1px solid rgba(79,110,247,.3); border-radius:4px; padding:2px 8px; white-space:nowrap; }
.page-sub { font-size:12px; color:var(--text-dim); line-height:1.6; }
.head-actions { display:flex; gap:8px; flex-shrink:0; align-items:flex-start; }
@media (max-width:640px) {
  .page-head { flex-direction:column; gap:10px; }
  .head-actions { width:100%; }
  .fields-row.r1 { grid-template-columns: 1fr; }
  .fields-row.r2 { grid-template-columns: 1fr 1fr; }
  .off-row { grid-template-columns: 1fr; }
  .history-list { grid-template-columns: 1fr; }
}

/* ── Shared buttons ────────────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 30px; padding: 0 12px;
  border-radius: var(--radius); border: 1px solid transparent;
  font-size: 12.5px; font-family: inherit; cursor: pointer;
  transition: background .12s, color .12s, border-color .12s; user-select: none;
}
.btn:active:not(:disabled) { transform: translateY(1px); }
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover:not(:disabled) { background: var(--accent-hi); }
.btn-primary:disabled { background: #2a3050; color: var(--text-dim); cursor: not-allowed; }
.btn-secondary { background: var(--surface-2); color: var(--text-mute); border-color: var(--border); }
.btn-secondary:hover { color: var(--text); background: var(--surface-3); }
.btn-ghost { background: transparent; color: var(--text-mute); border-color: var(--border); }
.btn-ghost:hover { color: var(--text); border-color: var(--border-s); }
.btn-xs { height: 22px; padding: 0 8px; font-size: 11px; }

/* ── Section heading ───────────────────────────────────────────────────── */
.section-h { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; gap: 12px; }
.sec-title {
  font-size: 13px; font-weight: 600; color: var(--text);
}
.sec-hint { font-size: 11.5px; color: var(--text-dim); font-family: var(--font-mono); }

/* ── Offset bar ────────────────────────────────────────────────────────── */
.offset-bar { background: var(--bg-elev-1); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px 18px; }
.off-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; align-items: stretch; }

.offset-input-wrap {
  background: var(--bg-elev-2); border: none; border-radius: var(--radius);
  padding: 8px 12px; display: flex; flex-direction: column; gap: 4px;
  transition: background .12s, box-shadow .12s;
}
.offset-input-wrap:focus-within { background: var(--bg-elev-3); box-shadow: 0 0 0 2px var(--accent); }
.offset-input-wrap.invalid { box-shadow: 0 0 0 2px var(--err); }
.offset-input-wrap.synced { box-shadow: 0 0 0 1px rgba(79,110,247,.5); }
.oiw-tag { display:flex; align-items:center; justify-content:space-between; font-size:10.5px; color:var(--text-dim); font-family:var(--font-mono); text-transform:uppercase; letter-spacing:.08em; }
.sync { font-size: 10px; color: var(--text-dim); }
.offset-input-wrap.synced .sync { color: var(--accent); }
.offset-input-wrap input { background:transparent; border:0; color:var(--text); font-family:var(--font-mono); font-size:19px; font-weight:600; padding:0; outline:none; width:100%; letter-spacing:.02em; }
.offset-input-wrap input::placeholder { color: var(--placeholder); font-weight: 500; }
.hex-input-row { display:flex; align-items:center; gap:0; }
.oiw-pfx { font-family:var(--font-mono); font-size:19px; font-weight:600; color:var(--text-dim); user-select:none; pointer-events:none; flex-shrink:0; }
.hex-input-row input { flex:1; min-width:0; }

.offset-actions { display: flex; align-items: stretch; }
.split-btn { position: relative; display: flex; }
.btn-copy { border-top-right-radius: 0; border-bottom-right-radius: 0; }
.btn-fmt-arr { border-left: 1px solid rgba(255,255,255,.18); border-top-left-radius:0; border-bottom-left-radius:0; padding: 0 9px; }
.fmt-menu { position:absolute; top:calc(100% + 4px); right:0; background:var(--bg-elev-2); border:1px solid var(--border-s); border-radius:var(--radius); padding:4px; box-shadow:0 10px 30px rgba(0,0,0,.55); min-width:220px; z-index:10; display:none; }
.fmt-menu.open { display: block; }
.fmt-item { padding:7px 10px; border-radius:4px; color:var(--text); font-size:12px; display:flex; align-items:center; justify-content:space-between; gap:10px; cursor:pointer; }
.fmt-item:hover { background: var(--bg-elev-3); }
.fmt-item.active::after { content:"✓"; color:var(--accent); margin-left:6px; }
.fp { font-family:var(--font-mono); font-size:11px; color:var(--text-dim); }
.fp-sm { font-family:var(--font-mono); font-size:11px; color:var(--text-dim); }

.offset-err { margin-top: 8px; min-height: 14px; font-size: 11.5px; color: var(--err); font-family: var(--font-mono); }

/* ── Bitmap card ───────────────────────────────────────────────────────── */
.bitmap-card { background: var(--bg-elev-1); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px; }
.bit-grid-scroll { overflow-x: auto; }
.bit-grid {
  display: grid;
  grid-template-columns: repeat(32, minmax(20px, 1fr));
  grid-template-rows: auto auto auto;
  gap: 0; min-width: 680px;
}
.field-band {
  padding: 4px 0; text-align: center; font-size: 10.5px; font-weight: 700; letter-spacing: .02em;
  background: var(--hue-func); color: #07120c; border-radius: 4px 4px 0 0; margin-right: 2px;
  line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.field-band:last-of-type { margin-right: 0; }
.field-band.hue-func   { background: var(--hue-func); color: #07120c; }
.field-band.hue-cmd    { background: var(--hue-cmd);  color: #fff; }
.field-band.hue-ms     { background: var(--hue-ms);   color: #fff; font-size: 9px; padding: 4px 0; }
.field-band.hue-rw     { background: var(--hue-rw);   color: #07120c; font-size: 9px; padding: 4px 0; }
.field-band.hue-param  { background: var(--hue-param); color: #07120c; }
.seg-info { font-family:var(--font-mono); font-size:9.5px; opacity:.7; margin-left:6px; }

.bit-cell {
  height: 28px; border: 1px solid var(--border); background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--text-dim);
  border-right: 0; transition: background .15s, color .15s, border-color .15s;
}
.bit-cell.boundary { border-right: 1px solid var(--border-s); }
.bit-cell:last-child { border-right: 1px solid var(--border); }
.bit-cell.hue-func.on  { background: rgba(245,158,107,.22); border-color: rgba(245,158,107,.5); color: #ffd0ad; }
.bit-cell.hue-cmd.on   { background: rgba(79,110,247,.22);  border-color: rgba(79,110,247,.5);  color: #b9c8ff; }
.bit-cell.hue-ms.on    { background: rgba(167,139,250,.22); border-color: rgba(167,139,250,.5); color: #d8caff; }
.bit-cell.hue-rw.on    { background: rgba(52,211,153,.22);  border-color: rgba(52,211,153,.5);  color: #9bf0c8; }
.bit-cell.hue-param.on { background: rgba(245,180,84,.22);  border-color: rgba(245,180,84,.5);  color: #ffd99e; }

.bit-pos { text-align:center; font-family:var(--font-mono); font-size:9.5px; color:var(--text-dim); padding-top:5px; }
.bit-pos.boundary { color: var(--text-mute); font-weight: 700; }

.legend { display:flex; flex-wrap:wrap; gap:14px; margin-top:10px; font-size:11px; color:var(--text-mute); font-family:var(--font-mono); }
.lchip { display:inline-flex; align-items:center; gap:6px; }
.sw { width:10px; height:10px; border-radius:2px; display:inline-block; }
.sw-func  { background: var(--hue-func); }
.sw-cmd   { background: var(--hue-cmd); }
.sw-ms    { background: var(--hue-ms); }
.sw-rw    { background: var(--hue-rw); }
.sw-param { background: var(--hue-param); }

/* ── Field cards ───────────────────────────────────────────────────────── */
.fields-card { background: var(--bg-elev-1); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px; }
.fields-row { display: grid; gap: 12px; margin-bottom: 12px; }
.fields-row:last-child { margin-bottom: 0; }
.fields-row.r1 { grid-template-columns: 6fr 16fr; }
.fields-row.r2 { grid-template-columns: 1fr 1fr 2fr; }

.field-card {
  background: var(--bg-elev-2); border: 1px solid var(--border); border-top: 2px solid transparent;
  border-radius: var(--radius); padding: 12px 12px 10px;
  transition: border-color .12s, background .12s; position: relative; min-width: 0;
}
.field-head { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:8px; gap:8px; }
.field-label { font-size:12.5px; font-weight:600; color:var(--text); display:inline-flex; align-items:center; gap:6px; }
.code-anno { font-style:normal; font-weight:400; font-size:11px; color:var(--text-dim); font-family:var(--font-mono); opacity:.8; }
.swatch { width:8px; height:8px; border-radius:2px; flex-shrink:0; }
.field-meta { font-size:10.5px; color:var(--text-dim); font-family:var(--font-mono); white-space:nowrap; }

.field-input-wrap { display:flex; gap:6px; }
.field-input {
  flex:1; background:var(--bg-elev-3); border:none; border-radius:var(--radius);
  color:var(--text); font-family:var(--font-mono); font-size:14px; font-weight:600;
  padding:7px 10px; outline:none; transition:background .12s, box-shadow .12s; min-width:0;
}
.field-input:focus { background:var(--bg-elev-3); box-shadow:0 0 0 2px var(--accent); }
.field-input.invalid { box-shadow:0 0 0 2px var(--err); }
.field-input::placeholder { color: var(--placeholder); }
/* Hex prefix wrapper — field inputs with fixed "0x" prefix */
.hex-pfx-wrap {
  display:flex; align-items:center; background:var(--bg-elev-3);
  border:none; border-radius:var(--radius);
  overflow:hidden; flex:1; position:relative;
  transition:background .12s, box-shadow .12s;
}
.hex-pfx-wrap:focus-within { background:var(--bg-elev-3); box-shadow:0 0 0 2px var(--accent); }
.hex-pfx-wrap.invalid { box-shadow:0 0 0 2px var(--err); }
.hex-pfx {
  padding:7px 2px 7px 10px; font-family:var(--font-mono); font-size:14px; font-weight:600;
  color:var(--text-dim); user-select:none; pointer-events:none; flex-shrink:0;
}
.hex-pfx-wrap .field-input { border:none !important; box-shadow:none !important; background:transparent; padding-left:2px; }
.hex-pfx-wrap .field-input:focus { border:none !important; box-shadow:none !important; }

/* Function code dropdown picker (known codes + meanings) */
.func-picker { position:relative; flex:1; display:flex; flex-direction:column; min-width:0; }
.func-picker .hex-pfx-wrap { flex-direction:row; }
.func-picker .field-input { padding-right:26px; }
.func-caret {
  position:absolute; right:1px; top:1px; bottom:1px; width:24px;
  display:inline-flex; align-items:center; justify-content:center;
  background:transparent; border:none; cursor:pointer; color:var(--text-dim);
  font-size:11px; border-radius:0 var(--radius) var(--radius) 0;
}
.func-caret:hover, .func-caret.open { color:var(--accent); background:var(--accent-soft); }
.func-menu {
  position:absolute; top:calc(100% + 4px); left:0; right:0; z-index:30;
  background:var(--bg); border:1px solid var(--border-s); border-radius:var(--radius);
  box-shadow:0 8px 24px rgba(0,0,0,.4); padding:4px; display:none;
}
.func-menu.open { display:block; }
.func-menu-h { font-size:10px; color:var(--text-dim); padding:4px 8px 2px; letter-spacing:.04em; }
.func-opt {
  display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; cursor:pointer;
}
.func-opt:hover { background:var(--accent-soft); }
.func-opt.active { background:var(--accent-soft); }
.fo-hex { font-family:var(--font-mono); font-size:12px; font-weight:700; color:var(--accent); min-width:42px; }
.fo-label { font-size:12px; color:var(--text); }
.func-menu-note { font-size:10px; color:var(--text-dim); padding:4px 8px 2px; border-top:1px solid var(--border); margin-top:2px; }

/* Segmented pill selector for single-bit fields (MS / RW) */
.smc-pillset { flex:1; display:flex; gap:6px; min-width:0; }
.smc-pill {
  flex:1; display:inline-flex; align-items:center; justify-content:center; gap:5px;
  padding:7px 6px; border-radius:var(--radius); cursor:pointer;
  background:var(--bg-elev-2); border:none; color:var(--text-dim);
  font-family:inherit; font-size:12.5px; font-weight:500; transition:all .12s; white-space:nowrap;
}
.smc-pill b { font-family:var(--font-mono); font-weight:700; opacity:.85; }
.smc-pill:hover { color:var(--text); border-color:var(--accent); }
.smc-pill.on { color:#fff; border-color:transparent; }
.smc-pill.p-write.on { background:#34d399; color:#06281d; }
.smc-pill.p-read.on  { background:#4f6ef7; }
.field-copy {
  width:30px; height:32px; padding:0; border-radius:var(--radius);
  background:transparent; border:1px solid var(--border); color:var(--text-dim);
  cursor:pointer; display:inline-flex; align-items:center; justify-content:center;
  transition:all .12s; font-family:inherit; font-size:14px;
}
.field-copy:hover:not(:disabled) { color:var(--text); border-color:var(--accent); background:var(--bg-elev-3); }
.field-copy:disabled { opacity:.4; cursor:not-allowed; }
.field-copy.copied { color: var(--ok); border-color: var(--ok); }

.field-foot { display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-family:var(--font-mono); font-size:10.5px; color:var(--text-dim); min-height:14px; }
.pair { display:inline-flex; gap:8px; }
.pair span { display:inline-flex; }
.pair span.muted .v, .pair span.muted .k { color: var(--placeholder); }
.k { color:var(--text-dim); margin-right:2px; }
.v { color:var(--text); }
.semantic { color:var(--text-mute); font-style:italic; }
.semantic.ferr { color:var(--err); font-style:normal; }

/* ── History card ──────────────────────────────────────────────────────── */
.history-card { background:var(--bg-elev-1); border:1px solid var(--border); border-radius:var(--radius-lg); padding:14px 18px; }
.hist-actions { display:flex; align-items:center; gap:8px; }
.history-list { list-style:none; padding:0; margin:8px 0 0; display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:6px; }
.history-empty { padding:16px 12px; text-align:center; color:var(--text-dim); font-size:12px; }
.history-item {
  display:grid; grid-template-columns:18px 1fr auto; gap:8px; align-items:center;
  padding:6px 10px; background:var(--bg); border:1px solid var(--border);
  border-radius:var(--radius); cursor:pointer; transition:all .1s;
}
.history-item:hover { border-color:var(--accent); background:var(--bg-elev-2); }
.idx { font-family:var(--font-mono); font-size:10px; color:var(--text-dim); text-align:right; }
.hval { font-family:var(--font-mono); font-size:12px; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hts { font-size:10px; color:var(--text-dim); font-family:var(--font-mono); }

/* ── Toast ─────────────────────────────────────────────────────────────── */
.toast {
  position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(20px);
  background:var(--background); border:1px solid var(--border-s); color:var(--text);
  padding:8px 14px; border-radius:6px; font-size:12px;
  opacity:0; pointer-events:none; transition:opacity .18s, transform .18s; z-index:30;
  box-shadow:0 10px 30px rgba(0,0,0,.55);
}
.toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

::-webkit-scrollbar { width:6px; height:6px; }
::-webkit-scrollbar-thumb { background:var(--border-s); border-radius:3px; }
::-webkit-scrollbar-track { background:transparent; }
</style>
