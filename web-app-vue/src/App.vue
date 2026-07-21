<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import TopologyView      from './TopologyView.vue';
import CodeView          from './CodeView.vue';
import SmcOffsetView     from './views/SmcOffsetView.vue';
import ExprCalcView      from './views/ExprCalcView.vue';
import CoolingConfigView from './views/CoolingConfigView.vue';
import AlarmConfigView   from './views/AlarmConfigView.vue';
import { useLinkage, type ToolId } from './composables/useLinkage';

const { state: link, setAnchor, closeDock } = useLinkage();

const toolMeta: Record<ToolId, { label: string; icon: string }> = {
  smc:     { label: 'SMC 偏移量计算器', icon: '🧮' },
  expr:    { label: '批量表达式计算器', icon: '⚙' },
  cooling: { label: '能效调速配置模板', icon: '❄' },
  alarm:   { label: '板卡告警配置', icon: '◈' },
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
watch(() => [link.dockTool, dockWidth.value, dockHeight.value], () => {
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
            <span class="dock-title">{{ toolMeta[link.dockTool].icon }} {{ toolMeta[link.dockTool].label }}</span>
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

/* ── Bottom dock（告警横向流水线：宽而矮，从底部升起）── */
.view-area.bottom { flex-direction: column; }
.view-area.bottom .pane-main { height: auto; flex: 1; min-height: 0; }
.view-area.bottom .pane-dock {
  width: 100% !important;
  border-left: none;
  border-top: 1px solid var(--border-subtle, #1e2240);
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

</style>
