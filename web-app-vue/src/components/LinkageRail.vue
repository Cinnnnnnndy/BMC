<script setup lang="ts">
// Left/right linkage rail mounted at the top of each tool view.
//   左段：来自拓扑的 inbound 上下文（点 ✕ 解除联动）
//   右段：写回代码视图的 outbound 按钮
import { computed, ref } from 'vue';
import { useLinkage, type ToolId } from '../composables/useLinkage';

const props = defineProps<{
  tool: ToolId;
  /** Label describing what the writeback snippet is. */
  codeLabel: string;
  /** Returns the current snippet to push to the code view, or null if none. */
  getCode: () => string | null;
}>();

const { state, clearInbound, writeBack } = useLinkage();
const inbound = computed(() => state.inbound[props.tool]);

const toast = ref('');
let toastTimer: ReturnType<typeof setTimeout>;
function flash(msg: string) {
  toast.value = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = ''), 1900);
}

async function doWriteback() {
  const code = props.getCode();
  if (!code) {
    flash('暂无可写回的内容，先完成计算');
    return;
  }
  writeBack(props.tool, props.codeLabel, code);
  try {
    await navigator.clipboard.writeText(code);
    flash('已写回代码视图 · 片段已复制到剪贴板');
  } catch {
    flash('已写回代码视图');
  }
}
</script>

<template>
  <div class="link-rail">
    <!-- ── 左联动：来自拓扑 ── -->
    <div class="rail-side rail-left" :class="{ filled: inbound }">
      <span class="rail-dir" aria-hidden="true">←</span>
      <template v-if="inbound">
        <div class="rail-text">
          <span class="rail-label">来自拓扑</span>
          <span class="rail-src">{{ inbound.source }}</span>
          <span v-if="inbound.detail" class="rail-detail">{{ inbound.detail }}</span>
        </div>
        <div v-if="inbound.fans?.length || inbound.tempZones?.length || inbound.expression || inbound.func" class="rail-chips">
          <span v-if="inbound.func" class="chip">func {{ inbound.func }}</span>
          <span v-for="f in inbound.fans" :key="'f'+f" class="chip">{{ f }}</span>
          <span v-for="z in inbound.tempZones" :key="'z'+z" class="chip chip-temp">{{ z }}</span>
          <span v-if="inbound.expression" class="chip chip-expr">{{ inbound.expression }}</span>
        </div>
        <button class="rail-x" title="解除联动" aria-label="解除联动" @click="clearInbound(tool)">✕</button>
      </template>
      <span v-else class="rail-empty">未联动 · 可从拓扑「板卡详情」唤醒并带入上下文</span>
    </div>

    <!-- ── 右联动：写回代码 ── -->
    <div class="rail-side rail-right">
      <span class="rail-code-label">{{ codeLabel }}</span>
      <button class="rail-writeback" @click="doWriteback">写回代码 →</button>
    </div>

    <transition name="rail-toast">
      <div v-if="toast" class="rail-toast">{{ toast }}</div>
    </transition>
  </div>
</template>

<style scoped>
.link-rail {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 8px;
  margin: 0 0 14px 0;
  font-size: 12px;
}
.rail-side {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  border-radius: var(--radius-md);
  background: var(--surface-2);
}
.rail-left { flex: 1; min-width: 0; }
.rail-left.filled { background: var(--surface-3); }
.rail-dir { font-size: 15px; color: var(--success); flex-shrink: 0; }
.rail-left:not(.filled) .rail-dir { color: var(--foreground-muted); }
.rail-text { display: flex; align-items: baseline; gap: 7px; min-width: 0; }
.rail-label {
  font-weight: 600;
  color: var(--success);
  flex-shrink: 0;
}
.rail-src { color: var(--foreground); font-weight: 500; white-space: nowrap; }
.rail-detail {
  color: var(--foreground-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rail-chips { display: flex; gap: 5px; flex-wrap: wrap; min-width: 0; }
.chip {
  padding: 1px 7px;
  border-radius: var(--radius-pill);
  font-size: 10.5px;
  font-family: var(--font-mono);
  background: var(--surface-4);
  color: var(--foreground-secondary);
  white-space: nowrap;
}
.chip-temp { color: var(--warning); }
.chip-expr { color: var(--accent); }
.rail-empty { color: var(--foreground-muted); font-style: italic; }
.rail-x {
  all: unset;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border-radius: var(--radius-sm);
  color: var(--foreground-muted);
  cursor: pointer;
  flex-shrink: 0;
}
.rail-x:hover { background: var(--state-hover); color: var(--foreground); }

.rail-right { flex-shrink: 0; }
.rail-code-label { color: var(--foreground-secondary); font-size: 11px; white-space: nowrap; }
.rail-writeback {
  all: unset;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  border-radius: var(--radius-md);
  background: var(--surface-3);
  color: var(--foreground-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--duration-fast) var(--easing-default),
              color var(--duration-fast) var(--easing-default);
}
.rail-writeback:hover { background: var(--surface-4); color: var(--foreground); }

.rail-toast {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  background: var(--surface-3);
  color: var(--foreground);
  font-size: 11.5px;
  z-index: 20;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
}
.rail-toast-enter-active, .rail-toast-leave-active { transition: opacity 0.18s; }
.rail-toast-enter-from, .rail-toast-leave-to { opacity: 0; }

@media (max-width: 720px) {
  .link-rail { flex-direction: column; }
  .rail-right { justify-content: space-between; }
}
</style>
