<script setup lang="ts">
// SMC 偏移量计算器 — standalone web port
// Core encode/decode logic ported from sr-smc-offset-decoder.ts

import { ref, computed, onMounted } from 'vue';

// ── Core state ────────────────────────────────────────────────────────────────
const hexResult = ref('0x00000000');
const decResult = ref('0');
const resultOk  = ref(true);

const fnVal    = ref('');
const cmdVal   = ref('');
const msVal    = ref('');
const rwVal    = ref('');
const paramVal = ref('');
const decInput = ref('');

const fnErr    = ref('');
const cmdErr   = ref('');
const msErr    = ref('');
const rwErr    = ref('');
const paramErr = ref('');
const decErr   = ref('');
const decWarn  = ref('');

const copied = ref(false);

// ── History state ────────────────────────────────────────────────────────────
interface HistoryEntry {
  hex: string;
  dec: string;
  fn: string;
  cmd: string;
  ms: string;
  rw: string;
  param: string;
  ts: number;
}
const history      = ref<HistoryEntry[]>([]);
const showHistory  = ref(false);
const HISTORY_KEY  = 'smc-offset-history';

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) history.value = JSON.parse(raw);
  } catch { history.value = []; }
}
function saveHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value));
}
function pushHistory() {
  if (!resultOk.value) return;
  const entry: HistoryEntry = {
    hex:   hexResult.value,
    dec:   decResult.value,
    fn:    fnVal.value,
    cmd:   cmdVal.value,
    ms:    msVal.value,
    rw:    rwVal.value,
    param: paramVal.value,
    ts:    Date.now(),
  };
  // Avoid duplicate consecutive entries
  if (history.value.length > 0) {
    const last = history.value[0];
    if (last.hex === entry.hex && last.fn === entry.fn && last.cmd === entry.cmd) return;
  }
  history.value.unshift(entry);
  if (history.value.length > 10) history.value = history.value.slice(0, 10);
  saveHistory();
}
function restoreHistory(entry: HistoryEntry) {
  fnVal.value    = entry.fn;
  cmdVal.value   = entry.cmd;
  msVal.value    = entry.ms;
  rwVal.value    = entry.rw;
  paramVal.value = entry.param;
  fnErr.value = cmdErr.value = msErr.value = rwErr.value = paramErr.value = '';
  updateResult();
  showHistory.value = false;
}
function clearHistory() {
  history.value = [];
  localStorage.removeItem(HISTORY_KEY);
}
function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60)   return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return `${Math.floor(diff / 86400)}天前`;
}

// ── Copy format state ────────────────────────────────────────────────────────
type CopyFormat = 'hex+dec' | 'hex' | 'dec';
const copyFormat     = ref<CopyFormat>('hex+dec');
const showFormatMenu = ref(false);
const FORMAT_KEY     = 'smc-copy-format';
const formatLabels: Record<CopyFormat, string> = {
  'hex+dec': '📋 复制 Hex+Dec',
  'hex':     '📋 复制 Hex',
  'dec':     '📋 复制 Dec',
};
const formatOptions: { key: CopyFormat; label: string }[] = [
  { key: 'hex+dec', label: 'Hex + Dec（默认）' },
  { key: 'hex',     label: '仅十六进制' },
  { key: 'dec',     label: '仅十进制' },
];
function loadCopyFormat() {
  const saved = localStorage.getItem(FORMAT_KEY) as CopyFormat | null;
  if (saved && saved in formatLabels) copyFormat.value = saved;
}
function selectFormat(f: CopyFormat) {
  copyFormat.value = f;
  localStorage.setItem(FORMAT_KEY, f);
  showFormatMenu.value = false;
}
function copyText(): string {
  if (copyFormat.value === 'hex') return hexResult.value;
  if (copyFormat.value === 'dec') return decResult.value;
  return `${hexResult.value} (${decResult.value})`;
}

// ── SMC encode/decode (ported from sr-smc-offset-decoder.ts) ─────────────────
function encode(fn: number, cmd: number, ms: number, rw: number, param: number): number {
  return (((fn << 26) | (cmd << 10) | (ms << 9) | (rw << 8) | param) >>> 0);
}
function decode(offset: number) {
  const o = offset >>> 0;
  return {
    function:  (o >>> 26) & 0x3F,
    command:   (o >>> 10) & 0xFFFF,
    ms:        (o >>>  9) & 0x1,
    rw:        (o >>>  8) & 0x1,
    parameter:  o         & 0xFF,
  };
}
function parseHex(s: string): number {
  const t = s.trim();
  if (!t) return NaN;
  if (/^[0-9A-Fa-f]+$/.test(t)) return parseInt(t, 16);
  return NaN;
}
function fmtHex(v: number, digits: number): string {
  return v.toString(16).toUpperCase().padStart(digits, '0');
}

const fieldCfg: Record<string, { maxLen: number; max: number }> = {
  function:  { maxLen: 2, max: 0x3F   },
  command:   { maxLen: 4, max: 0xFFFF },
  ms:        { maxLen: 1, max: 0x1    },
  rw:        { maxLen: 1, max: 0x1    },
  parameter: { maxLen: 2, max: 0xFF   },
};
function isValid(field: string, v: number) {
  return !isNaN(v) && v >= 0 && v <= fieldCfg[field].max;
}

function updateResult() {
  const fn  = parseHex(fnVal.value);
  const cmd = parseHex(cmdVal.value);
  const ms  = parseHex(msVal.value);
  const rw  = parseHex(rwVal.value);
  const par = parseHex(paramVal.value);
  const ok  = isValid('function', fn) && isValid('command', cmd) &&
              isValid('ms', ms) && isValid('rw', rw) && isValid('parameter', par);
  resultOk.value = ok;
  if (ok) {
    const off = encode(fn, cmd, ms, rw, par);
    hexResult.value = '0x' + fmtHex(off, 8);
    decResult.value = String(off);
  } else {
    hexResult.value = '0x--------';
    decResult.value = '-';
  }
}

function onHexInput(field: string, rawVal: string, setter: (v: string) => void) {
  const v = rawVal.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, fieldCfg[field].maxLen);
  setter(v);
  updateResult();
}

function blurField(field: string, rawVal: string, errSetter: (e: string) => void) {
  const v = parseHex(rawVal);
  errSetter(isValid(field, v) ? '' : '超出范围');
}

function parseDecimal() {
  decErr.value  = '';
  decWarn.value = '';
  const raw = decInput.value.trim();
  if (!raw) { decErr.value = '请输入偏移量'; return; }
  let num: number;
  if (/^0[xX]/.test(raw)) {
    num = parseInt(raw, 16);
  } else if (/^[0-9A-Fa-f]+$/.test(raw) && /[A-Fa-f]/.test(raw)) {
    num = parseInt(raw, 16);
  } else {
    num = parseInt(raw, 10);
  }
  if (isNaN(num) || num < 0) { decErr.value = '无效的偏移量'; return; }
  const MAX32 = 0xFFFFFFFF;
  if (num > MAX32) {
    const bits = Math.floor(Math.log2(num)) + 1;
    decWarn.value = `⚠️ 输入值 ${num} 超过 32 位范围 (${bits} 位)，将使用低 32 位`;
  }
  const d = decode(num);
  fnVal.value    = fmtHex(d.function,  2);
  cmdVal.value   = fmtHex(d.command,   4);
  msVal.value    = fmtHex(d.ms,        1);
  rwVal.value    = fmtHex(d.rw,        1);
  paramVal.value = fmtHex(d.parameter, 2);
  fnErr.value = cmdErr.value = msErr.value = rwErr.value = paramErr.value = '';
  updateResult();
}

async function copyResult() {
  if (!resultOk.value) return;
  await navigator.clipboard.writeText(copyText());
  pushHistory();
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}

function resetForm() {
  fnVal.value = cmdVal.value = msVal.value = rwVal.value = paramVal.value = '';
  decInput.value = '';
  fnErr.value = cmdErr.value = msErr.value = rwErr.value = paramErr.value = '';
  decErr.value = decWarn.value = '';
  updateResult();
}

// ── Bit-map visualizer ────────────────────────────────────────────────────────
// Fields: fn[31:26]=6, cmd[25:10]=16, ms[9:9]=1, rw[8:8]=1, param[7:0]=8  Total=32
const TOTAL_BITS = 32;
interface BitField {
  key:    string;
  label:  string;
  bits:   number;
  range:  string;
  color:  string;
  valRef: () => string;
}
const bitFields: BitField[] = [
  { key: 'fn',    label: 'fn',    bits: 6,  range: '[31:26]', color: '#7c8cf8', valRef: () => fnVal.value    },
  { key: 'cmd',   label: 'cmd',   bits: 16, range: '[25:10]', color: '#4f9ef7', valRef: () => cmdVal.value   },
  { key: 'ms',    label: 'ms',    bits: 1,  range: '[9]',     color: '#f7a24f', valRef: () => msVal.value    },
  { key: 'rw',    label: 'rw',    bits: 1,  range: '[8]',     color: '#4fd97a', valRef: () => rwVal.value    },
  { key: 'param', label: 'param', bits: 8,  range: '[7:0]',   color: '#e879a4', valRef: () => paramVal.value },
];

const bitSegments = computed(() => {
  return bitFields.map(f => {
    const raw = f.valRef().trim();
    const v   = raw ? parseInt(raw, 16) : NaN;
    const hasVal = raw !== '' && !isNaN(v);
    return {
      ...f,
      flexBasis:    `${(f.bits / TOTAL_BITS) * 100}%`,
      displayVal:   hasVal ? '0x' + v.toString(16).toUpperCase().padStart(f.bits <= 4 ? 1 : f.bits <= 8 ? 2 : 4, '0') : '--',
      hasVal,
    };
  });
});

// Ruler boundary positions (percent from left)
// Boundaries are at bit indices: 31(right edge of fn) = 6/32 from left ... etc.
// We show labels at bit positions: 31, 25, 9, 8, 7, 0
// Position from left = (32 - bitPos - 1) / 32 * 100
const rulerMarks = [
  { bit: 31, pct: (1  / 32) * 100 },   // left edge of fn segment (bit 31)
  { bit: 26, pct: (6  / 32) * 100 },   // boundary fn | cmd
  { bit: 25, pct: (7  / 32) * 100 },   // first bit of cmd (for clarity we skip and use 25)
  { bit: 10, pct: (22 / 32) * 100 },   // boundary cmd | ms
  { bit: 9,  pct: (23 / 32) * 100 },   // ms bit
  { bit: 8,  pct: (24 / 32) * 100 },   // rw bit
  { bit: 7,  pct: (25 / 32) * 100 },   // boundary rw | param
  { bit: 0,  pct: (32 / 32) * 100 - 0.5 },  // right edge (bit 0)
];

// Accessible aria-label for the 32-bit bitmap
const bitmapAriaLabel = computed(() => {
  const segs = bitFields.map(f => {
    const raw = f.valRef().trim();
    return `${f.label}=${raw ? '0x' + raw.toUpperCase() : '--'}`;
  });
  return `32位命令字可视化：${segs.join('，')}`;
});

onMounted(() => {
  loadHistory();
  loadCopyFormat();
  updateResult();
});
</script>

<template>
  <div class="smc-root" @click.self="showFormatMenu = false">
    <div class="container">

      <!-- ── Header row ─────────────────────────────────────────────────── -->
      <div class="header-row">
        <div class="title">🧮 SMC 偏移量计算器</div>
        <button
          class="btn btn-ghost history-btn"
          :class="{ active: showHistory }"
          :aria-expanded="showHistory"
          aria-controls="history-panel"
          @click="showHistory = !showHistory"
        >
          🕐 历史
          <span class="history-count" v-if="history.length > 0">{{ history.length }}</span>
        </button>
      </div>

      <!-- ── History panel ──────────────────────────────────────────────── -->
      <div class="history-panel" id="history-panel" v-if="showHistory">
        <div v-if="history.length === 0" class="history-empty">暂无历史记录</div>
        <div v-else>
          <div
            class="history-row"
            v-for="(entry, i) in history"
            :key="i"
          >
            <div class="history-hex">{{ entry.hex }}</div>
            <div class="history-dec">{{ entry.dec }}</div>
            <div class="history-time">{{ relativeTime(entry.ts) }}</div>
            <button class="btn btn-ghost btn-tiny" @click="restoreHistory(entry)">回填</button>
          </div>
          <div class="history-footer">
            <button type="button" class="clear-history-link" @click="clearHistory">清空历史</button>
          </div>
        </div>
      </div>

      <!-- ── Info box ───────────────────────────────────────────────────── -->
      <div class="info-box">
        <strong>SMC 命令字</strong>是一个 32 位整数，拆分为 5 个字段，颜色区块对应位图中的各段。
      </div>

      <!-- ── A. 32-bit bitmap visualizer ───────────────────────────────── -->
      <div class="bitmap-wrap" role="img" :aria-label="bitmapAriaLabel">
        <div class="bitmap-bar">
          <div
            v-for="seg in bitSegments"
            :key="seg.key"
            class="bitmap-seg"
            :class="{ 'has-val': seg.hasVal }"
            :style="{ flex: `0 0 ${seg.flexBasis}`, background: seg.color }"
          >
            <span class="seg-label">{{ seg.label }}</span>
            <span class="seg-val">{{ seg.displayVal }}</span>
            <span class="seg-range">{{ seg.range }}</span>
          </div>
        </div>
        <div class="bit-ruler">
          <div
            v-for="mark in rulerMarks"
            :key="mark.bit"
            class="ruler-mark"
            :style="{ left: mark.pct + '%' }"
          >
            <span class="ruler-tick">|</span>
            <span class="ruler-label">{{ mark.bit }}</span>
          </div>
        </div>
      </div>

      <!-- ── B. Decode entry (above arrow) ──────────────────────────────── -->
      <div class="section decode-section">
        <div class="section-header">
          <div class="section-title">🔍 反查偏移量</div>
        </div>
        <div class="decode-subtitle">从日志或代码中粘贴偏移量，自动解析各字段</div>
        <div class="section-content">
          <div class="offset-input-group">
            <input
              type="text"
              class="offset-input"
              aria-label="输入偏移量，支持十进制如 809893888 或十六进制如 0x30440100"
              placeholder="十进制 如: 809893888  或十六进制 如: 0x30440100"
              v-model="decInput"
              @keydown.enter="parseDecimal"
            />
            <button class="btn btn-secondary btn-small" @click="parseDecimal">↓ 解析</button>
          </div>
          <div class="error-message">{{ decErr }}</div>
          <div class="warning-message" v-if="decWarn">{{ decWarn }}</div>
        </div>
      </div>

      <div class="direction-bridge">
        <div class="bridge-hint bridge-up">← 反查：粘贴偏移量，自动填入各字段</div>
        <div class="bridge-symbol">⇅</div>
        <div class="bridge-hint bridge-down">编码：填写各字段，自动生成偏移量 →</div>
      </div>

      <!-- ── Real-time result ───────────────────────────────────────────── -->
      <div class="section result-section" aria-live="polite" aria-atomic="true">
        <div class="section-title">⚡ 实时计算结果</div>
        <div class="result-display">
          <div class="result-row">
            <span class="result-label">16进制</span>
            <span class="result-value" :class="{ invalid: !resultOk }">{{ hexResult }}</span>
          </div>
          <div class="result-row">
            <span class="result-label">10进制</span>
            <span class="result-value secondary">{{ decResult }}</span>
          </div>
        </div>
      </div>

      <!-- ── F. Reorganized fields ──────────────────────────────────────── -->
      <div class="section fields-section">
        <div class="section-header">
          <div class="section-title">组成字段 (16进制)</div>
        </div>

        <!-- Row divider: primary -->
        <div class="row-divider">主要字段</div>

        <!-- Row 1: fn (1/3) + cmd (2/3) -->
        <div class="fields-row primary-row">
          <!-- Function 1/3 -->
          <div class="field-item fn-field">
            <label class="field-label" for="input-fn">
              功能码(Function)
              <span class="field-bits">6-bit</span>
              <span class="help-icon" title="范围 0x00–0x3F (0–63)">❓</span>
            </label>
            <div class="hex-input-wrapper" :class="{ 'has-error': fnErr }">
              <span class="hex-prefix">0x</span>
              <input type="text" class="hex-input" id="input-fn" maxlength="2" placeholder="00"
                :value="fnVal"
                @input="onHexInput('function', ($event.target as HTMLInputElement).value, v => fnVal = v)"
                @blur="blurField('function', fnVal, e => fnErr = e)"
              />
            </div>
            <div class="error-message">{{ fnErr }}</div>
          </div>

          <!-- Command 2/3 -->
          <div class="field-item cmd-field">
            <label class="field-label" for="input-cmd">
              命令码(Command)
              <span class="field-bits">16-bit</span>
              <span class="help-icon" title="范围 0x0000–0xFFFF (0–65535)">❓</span>
            </label>
            <div class="hex-input-wrapper" :class="{ 'has-error': cmdErr }">
              <span class="hex-prefix">0x</span>
              <input type="text" class="hex-input" id="input-cmd" maxlength="4" placeholder="0000"
                :value="cmdVal"
                @input="onHexInput('command', ($event.target as HTMLInputElement).value, v => cmdVal = v)"
                @blur="blurField('command', cmdVal, e => cmdErr = e)"
              />
            </div>
            <div class="error-message">{{ cmdErr }}</div>
          </div>
        </div>

        <!-- Row divider: control bits -->
        <div class="row-divider">控制位</div>

        <!-- Row 2: ms + rw + param (3 equal columns) -->
        <div class="fields-row control-row">
          <!-- MS -->
          <div class="field-item">
            <label class="field-label" for="input-ms">
              读取方式(MS)
              <span class="field-bits">1-bit</span>
              <span class="help-icon" title="0x0=多读, 0x1=单读">❓</span>
            </label>
            <div class="hex-input-wrapper" :class="{ 'has-error': msErr }">
              <span class="hex-prefix">0x</span>
              <input type="text" class="hex-input" id="input-ms" maxlength="1" placeholder="0"
                :value="msVal"
                @input="onHexInput('ms', ($event.target as HTMLInputElement).value, v => msVal = v)"
                @blur="blurField('ms', msVal, e => msErr = e)"
              />
            </div>
            <div class="error-message">{{ msErr }}</div>
          </div>

          <!-- RW -->
          <div class="field-item">
            <label class="field-label" for="input-rw">
              读写方向(RW)
              <span class="field-bits">1-bit</span>
              <span class="help-icon" title="0x0=写, 0x1=读">❓</span>
            </label>
            <div class="hex-input-wrapper" :class="{ 'has-error': rwErr }">
              <span class="hex-prefix">0x</span>
              <input type="text" class="hex-input" id="input-rw" maxlength="1" placeholder="0"
                :value="rwVal"
                @input="onHexInput('rw', ($event.target as HTMLInputElement).value, v => rwVal = v)"
                @blur="blurField('rw', rwVal, e => rwErr = e)"
              />
            </div>
            <div class="error-message">{{ rwErr }}</div>
          </div>

          <!-- Parameter -->
          <div class="field-item">
            <label class="field-label" for="input-param">
              参数(Parameter)
              <span class="field-bits">8-bit</span>
              <span class="help-icon" title="范围 0x00–0xFF (0–255)">❓</span>
            </label>
            <div class="hex-input-wrapper" :class="{ 'has-error': paramErr }">
              <span class="hex-prefix">0x</span>
              <input type="text" class="hex-input" id="input-param" maxlength="2" placeholder="00"
                :value="paramVal"
                @input="onHexInput('parameter', ($event.target as HTMLInputElement).value, v => paramVal = v)"
                @blur="blurField('parameter', paramVal, e => paramErr = e)"
              />
            </div>
            <div class="error-message">{{ paramErr }}</div>
          </div>
        </div>
      </div>

      <!-- ── D. Copy format + action buttons ───────────────────────────── -->
      <div class="button-row">
        <!-- Copy button with format dropdown -->
        <div class="copy-btn-wrap" v-click-outside="() => showFormatMenu = false">
          <button
            class="btn btn-primary copy-main"
            :disabled="!resultOk"
            @click="copyResult"
          >
            {{ copied ? '✅ 已复制' : formatLabels[copyFormat] }}
          </button>
          <button
            class="btn btn-primary copy-chevron"
            :disabled="!resultOk"
            @click.stop="showFormatMenu = !showFormatMenu"
            title="选择复制格式"
            aria-label="选择复制格式"
          >▾</button>
          <div class="format-menu" v-if="showFormatMenu && resultOk">
            <div
              v-for="opt in formatOptions"
              :key="opt.key"
              class="format-option"
              :class="{ selected: copyFormat === opt.key }"
              @click="selectFormat(opt.key)"
            >{{ opt.label }}</div>
          </div>
        </div>

        <button class="btn btn-secondary" @click="resetForm">✕ 重置</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Custom directive: v-click-outside
export default {
  directives: {
    clickOutside: {
      mounted(el: HTMLElement, binding: { value: () => void }) {
        (el as any).__clickOutsideHandler__ = (e: MouseEvent) => {
          if (!el.contains(e.target as Node)) binding.value();
        };
        document.addEventListener('click', (el as any).__clickOutsideHandler__);
      },
      unmounted(el: HTMLElement) {
        document.removeEventListener('click', (el as any).__clickOutsideHandler__);
      },
    },
  },
};
</script>

<style scoped>
/* ── CSS variable bridge ──────────────────────────────────────────────────── */
.smc-root {
  --fg:        #e6e8ef;
  --bg:        #0e1117;
  --bg-input:  #161b2b;
  --border:    #2a3050;
  --accent:    #7c8cf8;
  --accent2:   #4f6ef7;
  --desc:      #98a0b8;
  --quote-bg:  #131826;
  --sel-bg:    #1f2a4a;
  --error:     #f87171;
  --warn:      #fbbf24;
  --btn-bg:    #4f6ef7;
  --btn-fg:    #fff;
  --btn-hover: #6b87ff;
  --btn2-bg:   #1e2540;
  --btn2-fg:   #98a0b8;
  --mono:      ui-monospace, SFMono-Regular, Menlo, monospace;

  min-height: 100%;
  padding: 24px 16px;
  color: var(--fg);
  background: var(--bg);
  font-family: system-ui, -apple-system, sans-serif;
}

.container {
  max-width: 660px;
  margin: 0 auto;
}

/* ── Header row ─────────────────────────────────────────────────────────── */
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
}

.history-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--desc);
  background: var(--btn2-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.history-btn:hover,
.history-btn.active {
  color: var(--accent);
  border-color: var(--accent);
}
.history-count {
  background: var(--accent2);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 99px;
  padding: 1px 6px;
  min-width: 16px;
  text-align: center;
}

/* ── History panel ──────────────────────────────────────────────────────── */
.history-panel {
  background: var(--quote-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  animation: slide-down 0.15s ease;
}
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.history-empty {
  color: var(--desc);
  font-size: 13px;
  text-align: center;
  padding: 8px 0;
}
.history-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.history-row:last-of-type { border-bottom: none; }
.history-hex {
  font-family: var(--mono);
  color: var(--accent);
  font-size: 13px;
  min-width: 100px;
}
.history-dec {
  font-family: var(--mono);
  color: var(--desc);
  font-size: 12px;
  flex: 1;
}
.history-time {
  color: var(--desc);
  font-size: 11px;
  white-space: nowrap;
}
.history-footer {
  text-align: right;
  padding-top: 8px;
}
.clear-history-link {
  font-size: 12px;
  color: var(--desc);
  cursor: pointer;
  text-decoration: underline;
  opacity: 0.7;
  transition: opacity 0.15s;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
}
.clear-history-link:hover { opacity: 1; color: var(--error); }

/* ── Info box ───────────────────────────────────────────────────────────── */
.info-box {
  padding: 9px 14px;
  background: var(--quote-bg);
  border-left: 3px solid rgba(124, 140, 248, 0.5);
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--desc);
}

/* ── A. Bitmap visualizer ───────────────────────────────────────────────── */
.bitmap-wrap {
  margin-bottom: 20px;
  user-select: none;
}

.bitmap-bar {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  height: 64px;
  gap: 1px;
}

.bitmap-seg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: default;
  transition: filter 0.15s, outline 0.15s;
  outline: 2px solid transparent;
  outline-offset: -2px;
  border-radius: 2px;
  padding: 2px 0;
  overflow: hidden;
}
.bitmap-seg.has-val {
  filter: brightness(1.25);
  outline-color: rgba(255, 255, 255, 0.55);
}

.seg-label {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
}
.seg-val {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
}
.seg-range {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1;
}

/* Bit ruler */
.bit-ruler {
  position: relative;
  height: 22px;
  margin-top: 2px;
}
.ruler-mark {
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.ruler-tick {
  font-size: 9px;
  color: var(--desc);
  line-height: 1;
}
.ruler-label {
  font-size: 9px;
  font-family: var(--mono);
  color: var(--desc);
  line-height: 1;
}

/* ── Sections ───────────────────────────────────────────────────────────── */
.section {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 6px;
}
.section-title::before { content: '◆'; font-size: 11px; }
/* Override for sections that start with emoji */
.decode-section .section-title::before,
.result-section .section-title::before { content: ''; }

.section-content { display: flex; flex-direction: column; gap: 10px; }

/* B. Decode section */
.decode-section {
  border-left: 4px solid #4f9ef7;
}
.decode-subtitle {
  font-size: 12px;
  color: var(--desc);
  margin-top: -6px;
  margin-bottom: 12px;
  line-height: 1.5;
}

/* Result section */
.result-section {
  background: linear-gradient(135deg, var(--quote-bg) 0%, var(--sel-bg) 100%);
  border: 2px solid var(--accent2);
  border-radius: 10px;
  padding: 22px;
  text-align: center;
}

.result-display { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.result-row { display: flex; align-items: baseline; gap: 10px; }
.result-label {
  font-size: 11px;
  color: var(--desc);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.result-value {
  font-size: 26px;
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent);
  transition: color 0.2s;
}
.result-value.invalid { color: var(--error); }
.result-value.secondary { font-size: 15px; font-weight: 500; color: var(--fg); }

/* Offset input */
.offset-input-group { display: flex; align-items: center; gap: 8px; }
.offset-input {
  flex: 1;
  padding: 8px 12px;
  font-family: var(--mono);
  font-size: 13px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--fg);
  border-radius: 6px;
  outline: none;
}
.offset-input:focus { border-color: var(--accent2); }

/* ── F. Fields layout ───────────────────────────────────────────────────── */
.fields-section { }

.row-divider {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--desc);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 10px;
  opacity: 0.7;
}
.row-divider:first-of-type { margin-top: 0; }
.row-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* Primary row: fn (1/3) + cmd (2/3) */
.fields-row { display: flex; gap: 14px; }

.fn-field  { flex: 1 1 0; }
.cmd-field { flex: 2 1 0; }

/* Control row: 3 equal columns */
.control-row .field-item { flex: 1 1 0; }

/* Shared field styles */
.field-item { display: flex; flex-direction: column; gap: 5px; }

.field-label {
  font-size: 12px;
  color: var(--fg);
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.field-bits {
  font-size: 10px;
  color: var(--desc);
  background: var(--quote-bg);
  padding: 1px 5px;
  border-radius: 3px;
}
.help-icon { cursor: help; opacity: 0.55; font-size: 11px; }
.help-icon:hover { opacity: 1; }

.hex-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-input);
  transition: border-color 0.2s;
}
.hex-input-wrapper:focus-within { border-color: var(--accent2); }
.hex-input-wrapper.has-error { border-color: var(--error); }

.hex-prefix {
  padding: 7px 8px 7px 12px;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--desc);
  border-right: 1px solid var(--border);
  user-select: none;
}
.hex-input {
  flex: 1;
  padding: 7px 12px;
  font-family: var(--mono);
  font-size: 13px;
  background: transparent;
  border: none;
  color: var(--fg);
  outline: none;
  text-transform: uppercase;
  min-width: 0;
}
.hex-input::placeholder { color: var(--desc); text-transform: none; }

/* Messages */
.error-message { color: var(--error); font-size: 11px; min-height: 15px; }
.warning-message { color: var(--warn); font-size: 11px; margin-top: 4px; }

/* Bidirectional bridge */
.direction-bridge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 6px 0;
  margin: -2px 0;
}
.bridge-hint {
  font-size: 11px;
  color: var(--desc);
  letter-spacing: 0.25px;
  opacity: 0.85;
  font-style: italic;
}
.bridge-symbol {
  font-size: 20px;
  color: var(--desc);
  line-height: 1.1;
}

/* ── D. Button row with copy dropdown ───────────────────────────────────── */
.button-row { display: flex; gap: 12px; margin-top: 22px; align-items: center; }
.copy-btn-wrap { flex: 1; }
.copy-main { width: 100%; justify-content: center; }

.copy-btn-wrap {
  position: relative;
  display: flex;
  align-items: stretch;
}

.copy-main {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  padding-right: 14px;
}
.copy-chevron {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  padding: 10px 10px;
  border-left: 1px solid rgba(255,255,255,0.15) !important;
  font-size: 12px;
}

.format-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 160px;
  background: #1a2035;
  border: 1px solid var(--border);
  border-radius: 7px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  overflow: hidden;
  z-index: 100;
  animation: fade-in 0.1s ease;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.format-option {
  padding: 9px 14px;
  font-size: 13px;
  color: var(--fg);
  cursor: pointer;
  transition: background 0.1s;
}
.format-option:hover { background: var(--sel-bg); }
.format-option.selected {
  color: var(--accent);
  background: rgba(124,140,248,0.1);
}
.format-option.selected::after {
  content: ' ✓';
  opacity: 0.7;
}

/* Shared button styles */
.btn {
  padding: 10px 22px;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  transition: background 0.15s;
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary  { background: var(--btn-bg);  color: var(--btn-fg); }
.btn-primary:not(:disabled):hover  { background: var(--btn-hover); }
.btn-secondary { background: var(--btn2-bg); color: var(--btn2-fg); }
.btn-secondary:hover { background: #252c48; }
.btn-ghost { background: transparent; border: none; }
.btn-small { padding: 6px 13px; font-size: 12px; }
.btn-tiny  { padding: 3px 9px;  font-size: 11px; border-radius: 4px; background: var(--btn2-bg); color: var(--btn2-fg); }
.btn-tiny:hover { background: var(--accent2); color: #fff; }
</style>
