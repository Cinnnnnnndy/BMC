<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import TopologyView      from './TopologyView.vue';
import CodeView          from './CodeView.vue';
import SmcOffsetView     from './views/SmcOffsetView.vue';
import ExprCalcView      from './views/ExprCalcView.vue';
import CoolingConfigView from './views/CoolingConfigView.vue';
import { useLinkage, type ToolId } from './composables/useLinkage';

const { state: link, setAnchor, closeDock } = useLinkage();

const toolMeta: Record<ToolId, { label: string; icon: string }> = {
  smc:     { label: 'SMC 偏移量计算器', icon: '🧮' },
  expr:    { label: '批量表达式计算器', icon: '⚙' },
  cooling: { label: '能效调速配置模板', icon: '❄' },
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

// ── Split-pane resizer ───────────────────────────────────────────────────
const dockWidth = ref(46); // dock pane width, % of viewport
let dragging = false;
function startDrag(e: MouseEvent) {
  dragging = true;
  e.preventDefault();
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
}
function onDrag(e: MouseEvent) {
  if (!dragging) return;
  const pct = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
  dockWidth.value = Math.min(70, Math.max(26, pct));
}
function stopDrag() {
  dragging = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
}

// Nudge the topology canvas (VueFlow) to re-measure when the split changes.
watch(() => [link.dockTool, dockWidth.value], () => {
  nextTick(() => window.dispatchEvent(new Event('resize')));
});
</script>

<template>
  <div class="app-root">
    <!-- Toolbar: only shown in normal (non-solo) mode -->
    <nav v-if="!soloMode" class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: link.anchor === 'topology' }"
        @click="setAnchor('topology')"
      >
        <span class="tab-icon">🗺</span>
        <span class="tab-label">CSR 拓扑</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: link.anchor === 'code' }"
        @click="setAnchor('code')"
      >
        <span class="tab-icon">{ }</span>
        <span class="tab-label">代码</span>
      </button>
    </nav>

    <!-- View area: anchor (left) + optional docked tool (right) -->
    <div class="view-area" :class="{ split: link.dockTool && !soloMode }">
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
          :style="soloMode ? {} : { width: dockWidth + '%' }"
        >
          <div v-if="!soloMode" class="dock-head">
            <span class="dock-title">{{ toolMeta[link.dockTool].icon }} {{ toolMeta[link.dockTool].label }}</span>
            <span class="dock-hint">分屏联动 · 与拓扑实时同步</span>
            <button class="dock-close" aria-label="关闭分屏" @click="closeDock">✕</button>
          </div>
          <div class="dock-body">
            <SmcOffsetView     v-if="link.dockTool === 'smc'" />
            <ExprCalcView      v-else-if="link.dockTool === 'expr'" />
            <CoolingConfigView v-else-if="link.dockTool === 'cooling'" />
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

/* ── Toolbar ── */
.tab-bar {
  display: flex;
  align-items: stretch;
  height: var(--comp-toolbar-height, 44px);
  background: var(--surface-1);
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
  gap: 2px;
  padding: 0 var(--space-2);
}
.tab-flex { flex: 1; }
.tab-group-label {
  display: flex;
  align-items: center;
  padding: 0 10px 0 4px;
  font-size: 11px;
  color: var(--foreground-secondary, #6b7498);
  opacity: 0.8;
  white-space: nowrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 var(--space-4, 14px);
  background: transparent;
  color: var(--foreground-secondary, #6b7498);
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.2px;
  white-space: nowrap;
  transition: color 0.18s, border-color 0.18s, background 0.18s;
  border-radius: var(--radius-sm, 5px) var(--radius-sm, 5px) 0 0;
}
.tab-btn:hover:not(.active) {
  color: var(--foreground, #e6e8ef);
  background: var(--state-hover, rgba(255,255,255,0.05));
}
.tab-btn.active {
  color: var(--foreground, #e6e8ef);
  border-bottom-color: var(--primary, #4f6ef7);
  background: var(--state-selected, rgba(79,110,247,0.14));
}
/* Tool toggles read as pills so they're distinct from the anchor tab */
.tool-toggle {
  font-size: 12px;
  padding: 0 11px;
  margin: 6px 0;
  border-radius: 6px;
  border-bottom: none;
  border: 1px solid transparent;
}
.tool-toggle.active {
  border-bottom: none;
  border-color: rgba(79,110,247,0.5);
  background: rgba(79,110,247,0.16);
}
.tab-icon { font-size: 14px; line-height: 1; }

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
  border-left: 1px solid var(--border-subtle, #1e2240);
  background: var(--background, #0a0d18);
}

.splitter {
  width: 6px;
  flex-shrink: 0;
  cursor: col-resize;
  background: var(--border-subtle, #1e2240);
  transition: background 0.15s;
}
.splitter:hover { background: var(--primary, #4f6ef7); }

.dock-head {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  flex-shrink: 0;
  padding: 0 10px;
  background: var(--surface-1, #0e1017);
  border-bottom: 1px solid var(--border-subtle, #1e2240);
}
.dock-title { font-size: 13px; font-weight: 600; color: var(--foreground, #e6e8ef); white-space: nowrap; }
.dock-hint  { font-size: 11px; color: #34d399; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dock-close {
  all: unset;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  color: var(--foreground-secondary, #98a0b8);
  cursor: pointer;
  flex-shrink: 0;
}
.dock-close:hover { background: rgba(255,255,255,0.08); color: var(--foreground, #e6e8ef); }

.dock-body { flex: 1; min-height: 0; overflow-y: auto; }

@media (max-width: 760px) {
  .tab-group-label { display: none; }
  .tool-toggle .tab-label { display: none; }
}
</style>
