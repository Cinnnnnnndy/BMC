<script setup lang="ts">
// Unified topology view.
// Layout: BMC → EXU → board groups (left → right, mind-map style).
// Each card shows inline: header + SN/PN dropdown + I2C bus / mux / chip tree.
import { computed, markRaw, onMounted, ref } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';

import BmcNode        from './nodes/BmcNode.vue';
import BoardGroupNode  from './nodes/BoardGroupNode.vue';

import { buildMindmap } from './data/mindmap';
import type { BoardGroup, BoardRecord } from './data/boards';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNode = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEdge = any;

// ── Node types ─────────────────────────────────────────────────────────
const nodeTypes = {
  bmc:        markRaw(BmcNode),
  boardgroup: markRaw(BoardGroupNode),
};

const { fitView } = useVueFlow();

// ── State ──────────────────────────────────────────────────────────────
const selectedByGroup = ref<Record<string, string>>({});
const activeNode      = ref<AnyNode | null>(null);

function handleSelect(groupId: string, boardId: string) {
  selectedByGroup.value = { ...selectedByGroup.value, [groupId]: boardId };
  nodes.value = nodes.value.map((n) =>
    n.id === groupId ? { ...n, data: { ...n.data, selectedId: boardId } } : n,
  );
}

const built = buildMindmap(handleSelect, selectedByGroup.value);
const nodes = ref<AnyNode[]>(built.nodes);
const edges = ref<AnyEdge[]>(built.edges);

onMounted(() => setTimeout(() => fitView({ padding: 0.10 }), 80));

// ── Interactions ───────────────────────────────────────────────────────
function onNodeClick(ev: { node: AnyNode }) {
  activeNode.value = ev.node;
}
function onPaneClick() {
  activeNode.value = null;
}
function handleResetLayout() {
  const next = buildMindmap(handleSelect, selectedByGroup.value);
  nodes.value = next.nodes;
  edges.value = next.edges;
  setTimeout(() => fitView({ padding: 0.10 }), 80);
}
function handleFit() {
  fitView({ padding: 0.10 });
}
function handleResetSelections() {
  const reset: Record<string, string> = {};
  for (const g of built.groups) reset[g.id] = g.boards[0].id;
  selectedByGroup.value = reset;
  nodes.value = nodes.value.map((n) =>
    n.type === 'boardgroup' && reset[n.id]
      ? { ...n, data: { ...n.data, selectedId: reset[n.id] } }
      : n,
  );
}

// ── Property panel ─────────────────────────────────────────────────────
const activeGroup = computed<BoardGroup | null>(() => {
  const n = activeNode.value;
  if (!n || n.type !== 'boardgroup') return null;
  return n.data.group as BoardGroup;
});
const activeBoard = computed<BoardRecord | null>(() => {
  const g = activeGroup.value;
  if (!g) return null;
  const id = selectedByGroup.value[g.id] ?? g.boards[0].id;
  return g.boards.find((b) => b.id === id) ?? g.boards[0];
});

// ── MiniMap colours ────────────────────────────────────────────────────
const TYPE_COLOR: Record<string, string> = {
  BCU: '#22c55e', CLU: '#f59e0b', EXU: '#a855f7',
  IEU: '#06b6d4', SEU: '#ec4899', NICCard: '#3b82f6',
  Unknown: '#6b7280',
};
function miniColor(n: AnyNode) {
  if (n.type === 'bmc') return '#4f6ef7';
  const g = n.data?.group as BoardGroup | undefined;
  return TYPE_COLOR[g?.type ?? 'Unknown'] ?? '#6b7280';
}

const totalBoards = computed(() => built.groups.reduce((s, g) => s + g.boards.length, 0));
</script>

<template>
  <div class="topo-root">
    <!-- ── Left panel ────────────────────────────────────────────── -->
    <aside class="topo-palette open">
      <div class="palette-section-title">拓扑视图 Vue</div>

      <div class="pp-field">
        <div class="pp-field-label">布局</div>
        <div class="pp-field-value">思维导图（BMC → EXU → 板组）</div>
      </div>
      <div class="pp-field">
        <div class="pp-field-label">数据源</div>
        <div class="pp-field-value">openUBMC（{{ totalBoards }} 张物理板）</div>
      </div>
      <div class="pp-field">
        <div class="pp-field-label">I2C 数据</div>
        <div class="pp-field-value">模拟数据（待 .sr 解析打通）</div>
      </div>

      <div class="palette-section-title" style="margin-top:16px;">分组</div>
      <ul class="grp-summary">
        <li v-for="g in built.groups" :key="g.id">
          <span class="grp-s-badge" :style="{ background: (TYPE_COLOR[g.type] ?? '#6b7280') + '28', color: TYPE_COLOR[g.type] ?? '#6b7280' }">
            {{ g.shortLabel }}
          </span>
          <span class="grp-s-name">{{ g.name }}</span>
          <span class="grp-s-count">× {{ g.boards.length }}</span>
        </li>
      </ul>

      <div class="palette-section-title" style="margin-top:16px;">操作</div>
      <button class="palette-action primary" @click="handleResetLayout">重置布局</button>
      <button class="palette-action" @click="handleFit">适应画布</button>
      <button class="palette-action" @click="handleResetSelections">全部重置为首张</button>
    </aside>

    <!-- ── Canvas ────────────────────────────────────────────────── -->
    <div class="topo-canvas-wrap">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :fit-view-on-init="true"
        :default-viewport="{ x: 0, y: 0, zoom: 1 }"
        :min-zoom="0.1"
        :max-zoom="2.5"
        :nodes-draggable="true"
        :nodes-connectable="false"
        :elements-selectable="true"
        :pan-on-drag="true"
        @node-click="onNodeClick"
        @pane-click="onPaneClick"
      >
        <Background pattern-color="#151528" :gap="24" :size="0.9" />
        <Controls />
        <MiniMap
          :node-color="miniColor"
          mask-color="rgba(8,8,18,0.65)"
          :style="{ background:'#141420', border:'1px solid #2e2e4e', borderRadius:'8px' }"
        />
      </VueFlow>
    </div>

    <!-- ── Property panel ────────────────────────────────────────── -->
    <div v-if="activeGroup && activeBoard" class="topo-property-panel" @click.stop>
      <div class="pp-header">
        <span>板卡详情</span>
        <button class="pp-close" @click="activeNode = null">✕</button>
      </div>
      <div class="pp-body">
        <div class="pp-field">
          <div class="pp-field-label">类型</div>
          <div class="pp-field-value">{{ activeGroup.label }}</div>
        </div>
        <div class="pp-field">
          <div class="pp-field-label">同类板数量</div>
          <div class="pp-field-value">{{ activeGroup.boards.length }}</div>
        </div>
        <div class="pp-field">
          <div class="pp-field-label">当前 SN</div>
          <div class="pp-field-value mono">{{ activeBoard.sn }}</div>
        </div>
        <div class="pp-field">
          <div class="pp-field-label">Part Number</div>
          <div class="pp-field-value mono">{{ activeBoard.partNumber }}</div>
        </div>
        <div class="pp-field">
          <div class="pp-field-label">源文件</div>
          <div class="pp-field-value mono pp-files">
            <div v-for="f in activeBoard.files" :key="f">{{ f }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grp-summary {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.grp-summary li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary, #98a0b8);
}
.grp-s-badge {
  display: inline-block;
  min-width: 44px;
  padding: 1px 5px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 10px;
  text-align: center;
}
.grp-s-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.grp-s-count { opacity: 0.6; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
.pp-files { display: flex; flex-direction: column; gap: 2px; word-break: break-all; }
</style>
