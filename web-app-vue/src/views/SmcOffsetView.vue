<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// ── Field definitions ────────────────────────────────────────────────────────
const FIELDS = [
  { key: 'fn',    label: '功能码',   eng: 'Function',  bits: 6,  msb: 31, lsb: 26, max: 0x3F,   maxLen: 2, placeholder: '00', color: '#7c8cf8', hint: '0x00–0x3F (0–63)' },
  { key: 'cmd',   label: '命令码',   eng: 'Command',   bits: 16, msb: 25, lsb: 10, max: 0xFFFF, maxLen: 4, placeholder: '0000', color: '#4f9ef7', hint: '0x0000–0xFFFF (0–65535)' },
  { key: 'ms',    label: '读取方式', eng: 'MS',        bits: 1,  msb: 9,  lsb: 9,  max: 0x1,    maxLen: 1, placeholder: '0', color: '#f7a24f', hint: '0=多读, 1=单读' },
  { key: 'rw',    label: '读写方向', eng: 'RW',        bits: 1,  msb: 8,  lsb: 8,  max: 0x1,    maxLen: 1, placeholder: '0', color: '#4fd97a', hint: '0=写, 1=读' },
  { key: 'param', label: '参数',     eng: 'Parameter', bits: 8,  msb: 7,  lsb: 0,  max: 0xFF,   maxLen: 2, placeholder: '00', color: '#e879a4', hint: '0x00–0xFF (0–255)' },
] as const;
type FieldKey = typeof FIELDS[number]['key'];

// ── Core state ───────────────────────────────────────────────────────────────
const hexInput  = ref('00000000');   // 8 hex digits, no prefix
const decInput  = ref('0');
const fieldVals = ref<Record<FieldKey, string>>({ fn: '', cmd: '', ms: '', rw: '', param: '' });
const fieldErrs = ref<Record<FieldKey, string>>({ fn: '', cmd: '', ms: '', rw: '', param: '' });
const resultOk  = ref(false);
const copied    = ref<'all-hex' | 'all-dec' | FieldKey | null>(null);

// prevent feedback loops
let _syncing = false;

// ── Encode / decode ──────────────────────────────────────────────────────────
function encode(fn: number, cmd: number, ms: number, rw: number, param: number): number {
  return (((fn << 26) | (cmd << 10) | (ms << 9) | (rw << 8) | param) >>> 0);
}
function decode(offset: number) {
  const o = offset >>> 0;
  return {
    fn:    (o >>> 26) & 0x3F,
    cmd:   (o >>> 10) & 0xFFFF,
    ms:    (o >>>  9) & 0x1,
    rw:    (o >>>  8) & 0x1,
    param:  o         & 0xFF,
  };
}
function fmtHex(v: number, digits: number): string {
  return v.toString(16).toUpperCase().padStart(digits, '0');
}
function parseHex(s: string): number {
  const t = s.trim();
  if (!t) return NaN;
  return parseInt(t, 16);
}

// ── Syncing top offset ↔ fields ──────────────────────────────────────────────
function onHexChange(raw: string) {
  if (_syncing) return;
  const clean = raw.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 8);
  hexInput.value = clean;
  const num = clean ? parseInt(clean, 16) : NaN;
  if (isNaN(num)) return;
  _syncing = true;
  decInput.value = String(num >>> 0);
  applyDecodeToFields(num >>> 0);
  _syncing = false;
}

function onDecChange(raw: string) {
  if (_syncing) return;
  const clean = raw.replace(/\D/g, '');
  decInput.value = clean;
  const num = clean ? parseInt(clean, 10) : NaN;
  if (isNaN(num) || num < 0) return;
  _syncing = true;
  hexInput.value = (num >>> 0).toString(16).toUpperCase().padStart(8, '0');
  applyDecodeToFields(num >>> 0);
  _syncing = false;
}

function applyDecodeToFields(offset: number) {
  const d = decode(offset);
  const fld = fieldVals.value;
  fld.fn    = fmtHex(d.fn,    2);
  fld.cmd   = fmtHex(d.cmd,   4);
  fld.ms    = fmtHex(d.ms,    1);
  fld.rw    = fmtHex(d.rw,    1);
  fld.param = fmtHex(d.param, 2);
  for (const k of Object.keys(fieldErrs.value) as FieldKey[]) fieldErrs.value[k] = '';
  resultOk.value = true;
}

function onFieldInput(key: FieldKey, raw: string) {
  const f = FIELDS.find(f => f.key === key)!;
  const clean = raw.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, f.maxLen);
  fieldVals.value[key] = clean;
  recomputeOffset();
}

function onFieldBlur(key: FieldKey) {
  const f = FIELDS.find(f => f.key === key)!;
  const v = parseHex(fieldVals.value[key]);
  fieldErrs.value[key] = (!isNaN(v) && v >= 0 && v <= f.max) ? '' : '超出范围';
}

function recomputeOffset() {
  if (_syncing) return;
  const vals = fieldVals.value;
  const fn    = parseHex(vals.fn);
  const cmd   = parseHex(vals.cmd);
  const ms    = parseHex(vals.ms);
  const rw    = parseHex(vals.rw);
  const param = parseHex(vals.param);
  const f = FIELDS;
  const ok = !isNaN(fn)    && fn    >= 0 && fn    <= f[0].max &&
             !isNaN(cmd)   && cmd   >= 0 && cmd   <= f[1].max &&
             !isNaN(ms)    && ms    >= 0 && ms    <= f[2].max &&
             !isNaN(rw)    && rw    >= 0 && rw    <= f[3].max &&
             !isNaN(param) && param >= 0 && param <= f[4].max;
  resultOk.value = ok;
  if (ok) {
    const off = encode(fn, cmd, ms, rw, param);
    _syncing = true;
    hexInput.value = off.toString(16).toUpperCase().padStart(8, '0');
    decInput.value = String(off);
    _syncing = false;
  }
}

// ── Computed: 32 bit cells ───────────────────────────────────────────────────
const bitCells = computed(() => {
  const hex = hexInput.value;
  const num  = hex ? parseInt(hex, 16) : NaN;
  const hasVal = resultOk.value && !isNaN(num);
  return Array.from({ length: 32 }, (_, i) => {
    const bitPos = 31 - i;
    let color: string, fkey: FieldKey;
    if (bitPos >= 26)      { color = '#7c8cf8'; fkey = 'fn';    }
    else if (bitPos >= 10) { color = '#4f9ef7'; fkey = 'cmd';   }
    else if (bitPos === 9) { color = '#f7a24f'; fkey = 'ms';    }
    else if (bitPos === 8) { color = '#4fd97a'; fkey = 'rw';    }
    else                   { color = '#e879a4'; fkey = 'param'; }
    const bitVal = hasVal ? ((num >>> bitPos) & 1) : null;
    return { bitPos, fkey, color, bitVal, hasVal };
  });
});

// ── Computed: per-field decimal display ──────────────────────────────────────
const fieldDec = computed<Record<FieldKey, string>>(() => {
  const out = {} as Record<FieldKey, string>;
  for (const f of FIELDS) {
    const v = parseHex(fieldVals.value[f.key]);
    out[f.key] = isNaN(v) ? '--' : String(v);
  }
  return out;
});

// ── Copy helpers ─────────────────────────────────────────────────────────────
async function doCopy(text: string, id: 'all-hex' | 'all-dec' | FieldKey) {
  await navigator.clipboard.writeText(text);
  copied.value = id;
  setTimeout(() => { if (copied.value === id) copied.value = null; }, 1500);
}
function copyAllHex() {
  if (!resultOk.value) return;
  doCopy('0x' + hexInput.value, 'all-hex');
}
function copyAllDec() {
  if (!resultOk.value) return;
  doCopy(decInput.value, 'all-dec');
}
function copyField(key: FieldKey) {
  const hex = fieldVals.value[key];
  if (!hex) return;
  const dec = fieldDec.value[key];
  doCopy(`0x${hex.toUpperCase()} (${dec})`, key);
}

// ── Reset ────────────────────────────────────────────────────────────────────
function reset() {
  for (const k of Object.keys(fieldVals.value) as FieldKey[]) {
    fieldVals.value[k] = '';
    fieldErrs.value[k] = '';
  }
  hexInput.value  = '00000000';
  decInput.value  = '0';
  resultOk.value  = false;
  copied.value    = null;
}

// ── History ──────────────────────────────────────────────────────────────────
interface Entry { hex: string; dec: string; fn: string; cmd: string; ms: string; rw: string; param: string; ts: number; }
const history     = ref<Entry[]>([]);
const showHistory = ref(false);
const HIST_KEY    = 'smc-offset-history';

function loadHistory() {
  try { const r = localStorage.getItem(HIST_KEY); if (r) history.value = JSON.parse(r); } catch { history.value = []; }
}
function pushHistory() {
  if (!resultOk.value) return;
  const e: Entry = { hex: '0x' + hexInput.value, dec: decInput.value, ...fieldVals.value as any, ts: Date.now() };
  if (history.value[0]?.hex === e.hex) return;
  history.value.unshift(e);
  if (history.value.length > 10) history.value = history.value.slice(0, 10);
  localStorage.setItem(HIST_KEY, JSON.stringify(history.value));
}
function restoreEntry(e: Entry) {
  applyDecodeToFields(parseInt(e.hex.replace(/^0x/, ''), 16));
  hexInput.value = e.hex.replace(/^0x/, '').toUpperCase().padStart(8, '0');
  decInput.value = e.dec;
  resultOk.value = true;
  showHistory.value = false;
}
function clearHistory() { history.value = []; localStorage.removeItem(HIST_KEY); }
function relTime(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 60) return `${d}秒前`;
  if (d < 3600) return `${Math.floor(d/60)}分钟前`;
  return `${Math.floor(d/3600)}小时前`;
}

onMounted(() => { loadHistory(); });
</script>

<template>
  <div class="root">
    <div class="container">

      <!-- ── Header ─────────────────────────────────────────────────────── -->
      <div class="hdr">
        <div class="title">🧮 SMC 偏移量计算器</div>
        <button class="btn-ghost" :class="{ active: showHistory }" @click="showHistory = !showHistory"
          :aria-expanded="showHistory" aria-controls="hist-panel">
          🕐 历史<span class="badge" v-if="history.length">{{ history.length }}</span>
        </button>
      </div>

      <!-- ── History panel ──────────────────────────────────────────────── -->
      <div id="hist-panel" class="hist-panel" v-if="showHistory">
        <div v-if="!history.length" class="hist-empty">暂无历史记录</div>
        <template v-else>
          <div class="hist-row" v-for="(e, i) in history" :key="i">
            <span class="hist-hex">{{ e.hex }}</span>
            <span class="hist-dec">{{ e.dec }}</span>
            <span class="hist-time">{{ relTime(e.ts) }}</span>
            <button class="btn-mini" @click="restoreEntry(e); pushHistory()">回填</button>
          </div>
          <div class="hist-foot">
            <button class="link-btn" @click="clearHistory">清空历史</button>
          </div>
        </template>
      </div>

      <!-- ── TOP: Unified offset input ─────────────────────────────────── -->
      <div class="offset-card">
        <div class="offset-title">偏移量</div>
        <div class="offset-rows">
          <!-- Hex row -->
          <div class="offset-row">
            <span class="fmt-tag hex-tag">HEX</span>
            <div class="offset-input-wrap">
              <span class="prefix">0x</span>
              <input
                class="offset-input mono"
                aria-label="十六进制偏移量"
                :value="hexInput"
                maxlength="8"
                placeholder="00000000"
                @input="onHexChange(($event.target as HTMLInputElement).value)"
              />
            </div>
            <button class="copy-chip" :class="{ ok: copied === 'all-hex' }"
              :disabled="!resultOk" @click="copyAllHex(); pushHistory()">
              {{ copied === 'all-hex' ? '✅' : '⎘' }}
            </button>
          </div>
          <!-- Dec row -->
          <div class="offset-row">
            <span class="fmt-tag dec-tag">DEC</span>
            <div class="offset-input-wrap">
              <input
                class="offset-input mono"
                aria-label="十进制偏移量"
                :value="decInput"
                placeholder="0"
                inputmode="numeric"
                @input="onDecChange(($event.target as HTMLInputElement).value)"
              />
            </div>
            <button class="copy-chip" :class="{ ok: copied === 'all-dec' }"
              :disabled="!resultOk" @click="copyAllDec(); pushHistory()">
              {{ copied === 'all-dec' ? '✅' : '⎘' }}
            </button>
          </div>
        </div>
        <div class="offset-hint">编辑任意一行，另一行自动转换；同时解析到下方各字段。</div>
      </div>

      <!-- ── 32-bit grid ────────────────────────────────────────────────── -->
      <div class="bits-wrap" role="img" :aria-label="`32位命令字：${FIELDS.map(f => f.label + '=0x' + (fieldVals[f.key] || '--')).join('，')}`">
        <!-- Cells -->
        <div class="bits-row">
          <div
            v-for="cell in bitCells"
            :key="cell.bitPos"
            class="bit-cell"
            :style="{ background: cell.color, opacity: cell.hasVal ? (cell.bitVal === 1 ? 1 : 0.25) : 0.45 }"
          >
            <span class="bit-val">{{ cell.hasVal ? cell.bitVal : '' }}</span>
          </div>
        </div>
        <!-- Bit numbers -->
        <div class="bits-row bit-nums">
          <div v-for="cell in bitCells" :key="cell.bitPos" class="bit-num-cell">
            <span v-if="[31,26,25,10,9,8,7,0].includes(cell.bitPos)" class="bit-num-label">{{ cell.bitPos }}</span>
          </div>
        </div>
        <!-- Field labels spanning under groups -->
        <div class="field-spans">
          <div v-for="f in FIELDS" :key="f.key" class="field-span"
            :style="{ flex: `0 0 ${(f.bits / 32) * 100}%`, borderTop: `3px solid ${f.color}` }">
            <span class="fspan-label" :style="{ color: f.color }">{{ f.key.toUpperCase() }} [{{ f.msb }}:{{ f.lsb }}]</span>
          </div>
        </div>
      </div>

      <!-- ── Fields ─────────────────────────────────────────────────────── -->
      <div class="fields-card">
        <div class="fields-title">组成字段</div>
        <div class="field-list">
          <div v-for="f in FIELDS" :key="f.key" class="field-row">
            <!-- Color swatch -->
            <div class="field-swatch" :style="{ background: f.color }"></div>
            <!-- Labels -->
            <div class="field-meta">
              <div class="field-name">{{ f.label }}<span class="field-eng">{{ f.eng }}</span></div>
              <div class="field-hint">{{ f.hint }}</div>
            </div>
            <!-- Input group -->
            <div class="field-input-group">
              <div class="hex-wrap" :class="{ err: fieldErrs[f.key] }">
                <span class="hex-pfx">0x</span>
                <input
                  class="hex-inp mono"
                  :id="`fld-${f.key}`"
                  :maxlength="f.maxLen"
                  :placeholder="f.placeholder"
                  :value="fieldVals[f.key]"
                  :aria-label="`${f.label} 十六进制输入`"
                  @input="onFieldInput(f.key, ($event.target as HTMLInputElement).value)"
                  @blur="onFieldBlur(f.key)"
                />
              </div>
              <div class="field-dec-row">
                <span class="field-dec-val">= {{ fieldDec[f.key] }}</span>
                <span class="field-err" v-if="fieldErrs[f.key]">{{ fieldErrs[f.key] }}</span>
              </div>
            </div>
            <!-- Per-field copy -->
            <button class="copy-chip field-copy" :class="{ ok: copied === f.key }"
              :disabled="!fieldVals[f.key]"
              :aria-label="`复制${f.label}字段值`"
              @click="copyField(f.key)">
              {{ copied === f.key ? '✅' : '⎘' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Bottom actions ─────────────────────────────────────────────── -->
      <div class="actions">
        <button class="btn-reset" @click="reset">✕ 重置</button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'SmcOffsetView' };
</script>

<style scoped>
/* ── Variables ────────────────────────────────────────────────────────────── */
.root {
  --fg:     #e6e8ef;
  --bg:     #0e1117;
  --card:   #131826;
  --input:  #161b2b;
  --border: #2a3050;
  --desc:   #98a0b8;
  --accent: #7c8cf8;
  --accent2:#4f6ef7;
  --error:  #f87171;
  --mono:   ui-monospace, SFMono-Regular, Menlo, monospace;

  min-height: 100%;
  padding: 24px 16px 40px;
  color: var(--fg);
  background: var(--bg);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 13px;
}
.container { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }

/* ── Header ─────────────────────────────────────────────────────────────── */
.hdr { display: flex; align-items: center; justify-content: space-between; }
.title { font-size: 19px; font-weight: 700; color: var(--accent); }
.btn-ghost {
  display: flex; align-items: center; gap: 6px;
  background: #1e2540; border: 1px solid var(--border);
  color: var(--desc); border-radius: 6px; padding: 6px 12px;
  cursor: pointer; font-size: 12px; transition: color .15s, border-color .15s;
}
.btn-ghost:hover, .btn-ghost.active { color: var(--accent); border-color: var(--accent); }
.badge {
  background: var(--accent2); color: #fff; font-size: 10px; font-weight: 700;
  border-radius: 99px; padding: 1px 6px; min-width: 16px; text-align: center;
}

/* ── History ─────────────────────────────────────────────────────────────── */
.hist-panel {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 8px; padding: 12px 16px;
  animation: slide-down 0.15s ease;
}
@keyframes slide-down { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
.hist-empty { color: var(--desc); text-align: center; padding: 8px 0; }
.hist-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid var(--border); font-size: 12px; }
.hist-row:last-of-type { border-bottom: none; }
.hist-hex { font-family: var(--mono); color: var(--accent); min-width: 110px; }
.hist-dec { font-family: var(--mono); color: var(--desc); flex: 1; }
.hist-time { color: var(--desc); white-space: nowrap; }
.hist-foot { text-align: right; padding-top: 8px; }
.btn-mini {
  font-size: 11px; padding: 2px 8px; border-radius: 4px;
  background: #1e2540; color: var(--desc); border: 1px solid var(--border); cursor: pointer;
}
.btn-mini:hover { background: var(--accent2); color: #fff; border-color: var(--accent2); }
.link-btn { font-size: 12px; color: var(--desc); text-decoration: underline; cursor: pointer; background: none; border: none; }
.link-btn:hover { color: var(--error); }

/* ── Offset card ─────────────────────────────────────────────────────────── */
.offset-card {
  background: var(--card); border: 2px solid var(--accent2);
  border-radius: 10px; padding: 18px 20px;
}
.offset-title { font-weight: 700; font-size: 13px; color: var(--accent); margin-bottom: 14px; }
.offset-rows { display: flex; flex-direction: column; gap: 10px; }
.offset-row { display: flex; align-items: center; gap: 10px; }
.fmt-tag {
  font-size: 10px; font-weight: 700; letter-spacing: 0.5px; border-radius: 4px;
  padding: 3px 7px; width: 36px; text-align: center; flex-shrink: 0;
}
.hex-tag { background: rgba(124,140,248,0.18); color: #7c8cf8; }
.dec-tag { background: rgba(79,110,247,0.18);  color: #4f9ef7; }
.offset-input-wrap {
  flex: 1; display: flex; align-items: center;
  background: var(--input); border: 1px solid var(--border); border-radius: 6px;
  transition: border-color .2s;
}
.offset-input-wrap:focus-within { border-color: var(--accent2); }
.prefix {
  padding: 9px 8px 9px 12px; font-family: var(--mono); font-size: 14px;
  color: var(--desc); border-right: 1px solid var(--border); user-select: none;
}
.offset-input {
  flex: 1; padding: 9px 12px; background: transparent; border: none;
  font-size: 16px; font-weight: 600; color: var(--fg); outline: none;
}
.offset-hint { margin-top: 12px; font-size: 11px; color: var(--desc); line-height: 1.5; }

/* ── Copy chip ───────────────────────────────────────────────────────────── */
.copy-chip {
  width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border);
  background: var(--input); color: var(--desc); cursor: pointer; font-size: 14px;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s, border-color .15s;
}
.copy-chip:not(:disabled):hover { background: var(--accent2); color: #fff; border-color: var(--accent2); }
.copy-chip.ok { background: #1a3828; color: #4ade80; border-color: #4ade80; }
.copy-chip:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── 32-bit grid ─────────────────────────────────────────────────────────── */
.bits-wrap { user-select: none; }
.bits-row { display: flex; gap: 1px; }
.bit-cell {
  flex: 1 1 0; min-width: 0; height: 34px;
  border-radius: 2px; display: flex; align-items: center; justify-content: center;
  transition: opacity .25s;
}
.bit-val { font-family: var(--mono); font-size: 11px; font-weight: 700; color: rgba(255,255,255,.95); line-height: 1; }

/* Bit number row */
.bit-nums { margin-top: 2px; height: 18px; gap: 1px; }
.bit-num-cell { flex: 1 1 0; min-width: 0; height: 18px; position: relative; }
.bit-num-label {
  position: absolute; left: 50%; transform: translateX(-50%);
  font-size: 9px; font-family: var(--mono); color: var(--desc); white-space: nowrap; line-height: 1;
}

/* Field spans row */
.field-spans { display: flex; margin-top: 6px; gap: 1px; }
.field-span { display: flex; align-items: flex-start; justify-content: center; padding-top: 4px; min-width: 0; overflow: hidden; }
.fspan-label { font-size: 10px; font-weight: 700; letter-spacing: 0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* ── Fields card ─────────────────────────────────────────────────────────── */
.fields-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 18px 20px;
}
.fields-title { font-weight: 700; font-size: 13px; color: var(--accent); margin-bottom: 14px; }
.field-list { display: flex; flex-direction: column; gap: 14px; }

.field-row { display: flex; align-items: flex-start; gap: 12px; }
.field-swatch { width: 4px; border-radius: 2px; flex-shrink: 0; align-self: stretch; margin-top: 2px; }
.field-meta { width: 140px; flex-shrink: 0; }
.field-name { font-weight: 600; font-size: 13px; color: var(--fg); }
.field-eng { font-size: 11px; color: var(--desc); margin-left: 6px; font-weight: 400; }
.field-hint { font-size: 11px; color: var(--desc); margin-top: 2px; line-height: 1.4; }

.field-input-group { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.hex-wrap {
  display: flex; align-items: center;
  background: var(--input); border: 1px solid var(--border); border-radius: 6px;
  transition: border-color .2s;
}
.hex-wrap:focus-within { border-color: var(--accent2); }
.hex-wrap.err { border-color: var(--error); }
.hex-pfx { padding: 7px 6px 7px 10px; font-family: var(--mono); font-size: 13px; color: var(--desc); border-right: 1px solid var(--border); user-select: none; }
.hex-inp { flex: 1; padding: 7px 10px; background: transparent; border: none; font-family: var(--mono); font-size: 13px; color: var(--fg); outline: none; text-transform: uppercase; min-width: 0; }
.hex-inp::placeholder { color: var(--desc); text-transform: none; }

.field-dec-row { display: flex; align-items: center; gap: 8px; min-height: 16px; }
.field-dec-val { font-size: 11px; color: var(--desc); font-family: var(--mono); }
.field-err { font-size: 11px; color: var(--error); }

.field-copy { margin-top: 3px; }

/* ── Actions ─────────────────────────────────────────────────────────────── */
.actions { display: flex; justify-content: flex-end; }
.btn-reset {
  padding: 9px 20px; font-size: 13px; font-weight: 600; border-radius: 6px; cursor: pointer;
  background: #1e2540; border: 1px solid var(--border); color: var(--desc);
  transition: background .15s, color .15s;
}
.btn-reset:hover { background: #2a1020; color: var(--error); border-color: var(--error); }

/* ── Utilities ───────────────────────────────────────────────────────────── */
.mono { font-family: var(--mono); }
</style>
