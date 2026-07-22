<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import TopologyView      from './TopologyView.vue';
import CodeView          from './CodeView.vue';
import SmcOffsetView     from './views/SmcOffsetView.vue';
import ExprCalcView      from './views/ExprCalcView.vue';
import CoolingConfigView from './views/CoolingConfigView.vue';
import AlarmConfigView   from './views/AlarmConfigView.vue';
import { useLinkage, type ToolId } from './composables/useLinkage';

const { state: link, setAnchor, closeDock, closeCodeDoc } = useLinkage();

// 右侧「代码」分屏（IDE 风格只读代码视图）
const codeWidth = ref(42); // % of viewport
const codeLines = computed(() => (link.codeDoc?.content || '').split('\n'));
let codeDragging = false;
function startCodeDrag(e: MouseEvent) {
  codeDragging = true; e.preventDefault();
  window.addEventListener('mousemove', onCodeDrag);
  window.addEventListener('mouseup', stopCodeDrag);
}
function onCodeDrag(e: MouseEvent) {
  if (!codeDragging) return;
  const pct = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
  codeWidth.value = Math.min(70, Math.max(24, pct));
}
function stopCodeDrag() {
  codeDragging = false;
  window.removeEventListener('mousemove', onCodeDrag);
  window.removeEventListener('mouseup', stopCodeDrag);
}

// icon = 单色面型 SVG path（去 emoji，与联动工具、链路配置节点图标语言统一）
const toolMeta: Record<ToolId, { label: string; icon: string }> = {
  smc:     { label: 'SMC 偏移量计算器', icon: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 4v3h10V6H7zm1 5h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z' },
  expr:    { label: '批量表达式计算器', icon: 'M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z' },
  cooling: { label: '能效调速配置模板', icon: 'M12 3a3 3 0 0 0-3 3v7.1a5 5 0 1 0 6 0V6a3 3 0 0 0-3-3zm0 2a1 1 0 0 1 1 1v8.02l.5.36a3 3 0 1 1-3 0l.5-.36V6a1 1 0 0 1 1-1z' },
  alarm:   { label: '板卡告警配置', icon: 'M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z' },
};

// Hash / query entry (#smc, ?tab=expr …): dock that tool beside topology.
(function initFromHash() {
  const hash  = location.hash.replace('#', '');
  const param = new URLSearchParams(location.search).get('tab');
  const c = (hash || param || '') as string;
  if (c === 'smc' || c === 'expr' || c === 'cooling') link.dockTool = c as ToolId;
})();

// Solo mode: show only the tool panel, no topology canvas, no toolbar.
// Activated via ?solo=true (used when embedded in the IDE rail as standalone views).
const soloMode = new URLSearchParams(location.search).get('solo') === 'true';

// 告警配置是横向流水线 → 停靠在「底部」（宽而矮）；其余工具停靠在右侧（窄而高）。
const bottomDock = computed(() => link.dockTool === 'alarm');

// ── Split-pane resizer（右侧按宽度、底部按高度）─────────────────────────────
const dockWidth  = ref(46); // right dock width, % of viewport
const dockHeight = ref(50); // bottom dock height, % of viewport
let dragging = false;
function startDrag(e: MouseEvent) {
  dragging = true;
  e.preventDefault();
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
}
function onDrag(e: MouseEvent) {
  if (!dragging) return;
  if (bottomDock.value) {
    const pct = ((window.innerHeight - e.clientY) / window.innerHeight) * 100;
    dockHeight.value = Math.min(78, Math.max(22, pct));
  } else {
    const pct = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
    dockWidth.value = Math.min(70, Math.max(26, pct));
  }
}
function stopDrag() {
  dragging = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
}

// Nudge the topology canvas (VueFlow) to re-measure when the split changes.
watch(() => [link.dockTool, dockWidth.value, dockHeight.value, link.codeDoc, codeWidth.value], () => {
  nextTick(() => window.dispatchEvent(new Event('resize')));
});
</script>

<template>
  <div class="app-root">
    <!-- View area: anchor (left) + optional docked tool (right) -->
    <div class="view-area" :class="{ split: link.dockTool && !soloMode, bottom: bottomDock && !soloMode }">
      <!-- Topology / code pane — hidden in solo mode -->
      <div v-if="!soloMode" class="pane pane-main">
        <TopologyView v-show="link.anchor === 'topology'" />
        <CodeView v-if="link.anchor === 'code'" />
      </div>

      <template v-if="link.dockTool">
        <div v-if="!soloMode" class="splitter" @mousedown="startDrag" title="拖动调整分屏宽度" />
        <div
          class="pane pane-dock"
          :class="{ 'pane-solo': soloMode }"
          :style="soloMode ? {} : (bottomDock ? { height: dockHeight + '%' } : { width: dockWidth + '%' })"
        >
          <div v-if="!soloMode" class="dock-head">
            <span class="dock-title"><svg class="dock-title-ic" viewBox="0 0 24 24" aria-hidden="true"><path :d="toolMeta[link.dockTool].icon" /></svg>{{ toolMeta[link.dockTool].label }}</span>
            <span class="dock-hint">{{ bottomDock ? '底部停靠 · 与拓扑实时同步' : '分屏联动 · 与拓扑实时同步' }}</span>
            <button class="dock-close" aria-label="关闭分屏" @click="closeDock">✕</button>
          </div>
          <div class="dock-body">
            <SmcOffsetView     v-if="link.dockTool === 'smc'" />
            <ExprCalcView      v-else-if="link.dockTool === 'expr'" />
            <CoolingConfigView v-else-if="link.dockTool === 'cooling'" />
            <AlarmConfigView   v-else-if="link.dockTool === 'alarm'" />
          </div>
        </div>
      </template>

      <!-- 右侧「代码」分屏（IDE 风格只读代码视图；从告警配置「代码」按钮打开对应 .sr） -->
      <template v-if="link.codeDoc && !soloMode">
        <div class="splitter" @mousedown="startCodeDrag" title="拖动调整代码分屏宽度" />
        <div class="pane pane-code" :style="{ width: codeWidth + '%' }">
          <div class="code-head">
            <span class="code-file"><svg class="code-file-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5L13 3.5z"/></svg>{{ link.codeDoc.file }}</span>
            <span class="code-hint">告警配置 → CSR 对象（只读预览）</span>
            <button class="dock-close" aria-label="关闭代码" @click="closeCodeDoc">✕</button>
          </div>
          <div class="code-body">
            <div v-for="(ln, i) in codeLines" :key="i" class="code-line"><span class="ln">{{ i + 1 }}</span><span class="lc">{{ ln }}</span></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.app-root {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background);
  color: var(--foreground);
  overflow: hidden;
}

/* ── Split view ── */
.view-area {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
.pane { height: 100%; min-width: 0; position: relative; }
.pane-main { flex: 1; }
.pane-solo { flex: 1; width: 100% !important; }
.pane-dock {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-subtle);
  background: var(--background);
}

.splitter {
  width: 6px;
  flex-shrink: 0;
  cursor: col-resize;
  background: var(--border-subtle);
  transition: background 0.15s;
}
.splitter:hover { background: var(--primary); }

/* ── Bottom dock（告警横向流水线：宽而矮，从底部升起）── */
.view-area.bottom { flex-direction: column; }
.view-area.bottom .pane-main { height: auto; flex: 1; min-height: 0; }
.view-area.bottom .pane-dock {
  width: 100% !important;
  border-left: none;
  border-top: 1px solid var(--border-subtle);
}
.view-area.bottom .splitter {
  width: 100%;
  height: 6px;
  cursor: row-resize;
}

.dock-head {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  flex-shrink: 0;
  padding: 0 10px;
  background: var(--surface-1);
  border-bottom: 1px solid var(--border-subtle);
}
.dock-title { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--foreground); white-space: nowrap; }
.dock-title-ic { width: 14px; height: 14px; fill: currentColor; flex-shrink: 0; }
.dock-hint  { font-size: 11px; color: var(--success); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dock-close {
  all: unset;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  color: var(--foreground-secondary);
  cursor: pointer;
  flex-shrink: 0;
}
.dock-close:hover { background: rgba(255,255,255,0.08); color: var(--foreground); }

.dock-body { flex: 1; min-height: 0; overflow-y: auto; }

/* ── 右侧「代码」分屏（IDE 风格）── */
.pane-code {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-subtle);
  background: var(--background);
  min-width: 0;
}
.code-head {
  display: flex; align-items: center; gap: 10px; height: 38px; flex-shrink: 0;
  padding: 0 10px; background: var(--surface-1); border-bottom: 1px solid var(--border-subtle);
}
.code-file { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--foreground); white-space: nowrap; }
.code-file-ic { width: 14px; height: 14px; fill: var(--foreground-secondary); flex-shrink: 0; }
.code-hint { font-size: 11px; color: var(--foreground-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.code-body { flex: 1; min-height: 0; overflow: auto; padding: 8px 0; font: 500 12px/1.6 var(--font-mono, ui-monospace, monospace); }
.code-line { display: flex; }
.code-line .ln { flex: none; width: 46px; text-align: right; padding-right: 12px; color: var(--foreground-muted); user-select: none; }
.code-line .lc { flex: 1; white-space: pre; padding-right: 16px; color: var(--foreground); }
.code-line:hover { background: var(--state-hover); }

</style>
