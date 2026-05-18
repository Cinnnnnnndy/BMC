<script setup lang="ts">
// SMC 偏移量计算器 — standalone web port
// Core encode/decode logic ported from sr-smc-offset-decoder.ts
// VSCode API calls replaced: "Apply" copies to clipboard, "Cancel" resets form.

import { ref, onMounted } from 'vue';

const hexResult = ref('0x00000000');
const decResult = ref('0');
const resultOk   = ref(true);

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

// ── SMC encode/decode (ported from sr-smc-offset-decoder.ts) ────────────
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
  let v = rawVal.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, fieldCfg[field].maxLen);
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
  if (!raw) { decErr.value = '请输入10进制偏移量'; return; }
  let num: number;
  if (/^0[xX]/.test(raw)) {
    num = parseInt(raw, 16);
  } else if (/^[0-9A-Fa-f]+$/.test(raw) && /[A-Fa-f]/.test(raw)) {
    num = parseInt(raw, 16);
  } else {
    num = parseInt(raw, 10);
  }
  if (isNaN(num) || num < 0) { decErr.value = '无效的10进制偏移量'; return; }
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
  await navigator.clipboard.writeText(`${hexResult.value} (${decResult.value})`);
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

onMounted(updateResult);
</script>

<template>
  <div class="smc-root">
    <div class="container">
      <div class="title">🧮 SMC 偏移量计算器</div>

      <div class="info-box">
        <strong>SMC 命令字格式：</strong><br>
        功能码(6位) | 命令码(16位) | 读取方式(1位) | 读写方向(1位) | 参数(8位)
      </div>

      <!-- Real-time result -->
      <div class="section result-section">
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

      <!-- Decimal input -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">10进制偏移量</div>
        </div>
        <div class="section-content">
          <div class="offset-input-group">
            <input
              type="text"
              class="offset-input"
              placeholder="如: 809893888"
              v-model="decInput"
              @keydown.enter="parseDecimal"
            />
            <button class="btn btn-secondary btn-small" @click="parseDecimal">↓ 解析到组成字段</button>
          </div>
          <div class="error-message">{{ decErr }}</div>
          <div class="warning-message" v-if="decWarn">{{ decWarn }}</div>
        </div>
      </div>

      <div class="arrow-indicator">⇅</div>

      <!-- Component fields -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">组成字段 (16进制)</div>
        </div>
        <div class="fields-grid">
          <!-- Function -->
          <div class="field-item">
            <label class="field-label">
              功能码(Function)
              <span class="field-bits">6-bit</span>
              <span class="help-icon" title="范围 0x00–0x3F (0–63)">❓</span>
            </label>
            <div class="hex-input-wrapper" :class="{ 'has-error': fnErr }">
              <span class="hex-prefix">0x</span>
              <input type="text" class="hex-input" maxlength="2" placeholder="00"
                :value="fnVal"
                @input="onHexInput('function', ($event.target as HTMLInputElement).value, v => fnVal = v)"
                @blur="blurField('function', fnVal, e => fnErr = e)"
              />
            </div>
            <div class="error-message">{{ fnErr }}</div>
          </div>

          <!-- MS -->
          <div class="field-item">
            <label class="field-label">
              读取方式(MS)
              <span class="field-bits">1-bit</span>
              <span class="help-icon" title="0x0=多读, 0x1=单读">❓</span>
            </label>
            <div class="hex-input-wrapper" :class="{ 'has-error': msErr }">
              <span class="hex-prefix">0x</span>
              <input type="text" class="hex-input" maxlength="1" placeholder="0"
                :value="msVal"
                @input="onHexInput('ms', ($event.target as HTMLInputElement).value, v => msVal = v)"
                @blur="blurField('ms', msVal, e => msErr = e)"
              />
            </div>
            <div class="error-message">{{ msErr }}</div>
          </div>

          <!-- Command (wide) -->
          <div class="field-item wide">
            <label class="field-label">
              命令码(Command)
              <span class="field-bits">16-bit</span>
              <span class="help-icon" title="范围 0x0000–0xFFFF (0–65535)">❓</span>
            </label>
            <div class="hex-input-wrapper" :class="{ 'has-error': cmdErr }">
              <span class="hex-prefix">0x</span>
              <input type="text" class="hex-input" maxlength="4" placeholder="0000"
                :value="cmdVal"
                @input="onHexInput('command', ($event.target as HTMLInputElement).value, v => cmdVal = v)"
                @blur="blurField('command', cmdVal, e => cmdErr = e)"
              />
            </div>
            <div class="error-message">{{ cmdErr }}</div>
          </div>

          <!-- RW -->
          <div class="field-item">
            <label class="field-label">
              读写方向(RW)
              <span class="field-bits">1-bit</span>
              <span class="help-icon" title="0x0=写, 0x1=读">❓</span>
            </label>
            <div class="hex-input-wrapper" :class="{ 'has-error': rwErr }">
              <span class="hex-prefix">0x</span>
              <input type="text" class="hex-input" maxlength="1" placeholder="0"
                :value="rwVal"
                @input="onHexInput('rw', ($event.target as HTMLInputElement).value, v => rwVal = v)"
                @blur="blurField('rw', rwVal, e => rwErr = e)"
              />
            </div>
            <div class="error-message">{{ rwErr }}</div>
          </div>

          <!-- Parameter -->
          <div class="field-item">
            <label class="field-label">
              参数(Parameter)
              <span class="field-bits">8-bit</span>
              <span class="help-icon" title="范围 0x00–0xFF (0–255)">❓</span>
            </label>
            <div class="hex-input-wrapper" :class="{ 'has-error': paramErr }">
              <span class="hex-prefix">0x</span>
              <input type="text" class="hex-input" maxlength="2" placeholder="00"
                :value="paramVal"
                @input="onHexInput('parameter', ($event.target as HTMLInputElement).value, v => paramVal = v)"
                @blur="blurField('parameter', paramVal, e => paramErr = e)"
              />
            </div>
            <div class="error-message">{{ paramErr }}</div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="button-row">
        <button class="btn btn-primary" :disabled="!resultOk" @click="copyResult">
          {{ copied ? '✅ 已复制' : '📋 复制结果' }}
        </button>
        <button class="btn btn-secondary" @click="resetForm">✕ 重置</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── CSS variable bridge: map VSCode tokens to the app's dark palette ── */
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

.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 18px;
  color: var(--accent);
}

.info-box {
  padding: 12px 16px;
  background: var(--quote-bg);
  border-left: 4px solid var(--accent);
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--fg);
}

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

.section-content { display: flex; flex-direction: column; gap: 10px; }

/* Result section */
.result-section {
  background: linear-gradient(135deg, var(--quote-bg) 0%, var(--sel-bg) 100%);
  border: 2px solid var(--accent2);
  border-radius: 10px;
  padding: 22px;
  text-align: center;
}
.result-section .section-title::before { content: '⚡'; }

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
  font-size: 14px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--fg);
  border-radius: 6px;
  outline: none;
}
.offset-input:focus { border-color: var(--accent2); }

/* Fields grid */
.fields-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.field-item { display: flex; flex-direction: column; gap: 5px; }
.field-item.wide { grid-column: span 2; }

.field-label {
  font-size: 12px;
  color: var(--fg);
  display: flex;
  align-items: center;
  gap: 5px;
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
}
.hex-input::placeholder { color: var(--desc); text-transform: none; }

/* Messages */
.error-message { color: var(--error); font-size: 11px; min-height: 15px; }
.warning-message { color: var(--warn); font-size: 11px; margin-top: 4px; }

/* Arrow */
.arrow-indicator {
  text-align: center;
  color: var(--desc);
  font-size: 20px;
  margin: -6px 0;
}

/* Buttons */
.button-row { display: flex; gap: 12px; margin-top: 22px; }
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
.btn-small { padding: 6px 13px; font-size: 12px; }
</style>
