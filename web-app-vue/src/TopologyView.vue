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
import {
  STATE_LABEL,
  STATE_COLOR,
  type BoardGroup,
  type BoardRecord,
  type ResolutionState,
} from './data/boards';

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
/** Groups plucked into the sidebar list only (state='unclassified'). */
const unclassifiedGroups = ref<BoardGroup[]>([]);
/** Id of the unclassified group currently being assigned (shows a popover). */
const assigningId = ref<string | null>(null);

function handleSelect(groupId: string, boardId: string) {
  selectedByGroup.value = { ...selectedByGroup.value, [groupId]: boardId };
  nodes.value = nodes.value.map((n) =>
    n.id === groupId ? { ...n, data: { ...n.data, selectedId: boardId } } : n,
  );
}

const built = buildMindmap(handleSelect, selectedByGroup.value);
const nodes = ref<AnyNode[]>(built.nodes);
const edges = ref<AnyEdge[]>(built.edges);
unclassifiedGroups.value = built.unclassifiedGroups;

onMounted(() => setTimeout(() => fitView({ padding: 0.10 }), 80));

// ── Sidebar sections: group by state ───────────────────────────────────
const canvasGroups = computed<BoardGroup[]>(() =>
  built.groups.filter((g) => g.state !== 'unclassified'),
);
const groupsByState = computed<Record<ResolutionState, BoardGroup[]>>(() => {
  const acc: Record<ResolutionState, BoardGroup[]> = {
    'resolved': [],
    'multi-match': [],
    'type-placeholder': [],
    'missing': [],
    'unclassified': unclassifiedGroups.value,
  };
  for (const g of canvasGroups.value) acc[g.state].push(g);
  return acc;
});

/** Bottom-line summary counts (like the "检查" panel in 图一). */
const stateCounts = computed(() => ({
  'resolved':         groupsByState.value.resolved.length,
  'multi-match':      groupsByState.value['multi-match'].length,
  'type-placeholder': groupsByState.value['type-placeholder'].length,
  'missing':          groupsByState.value.missing.length,
  'unclassified':     groupsByState.value.unclassified.length,
}));

/** Order in which state sections are listed in the sidebar. */
const STATE_SECTION_ORDER: ResolutionState[] = [
  'missing', 'multi-match', 'type-placeholder', 'resolved',
];

// ── Left-to-right sync ─────────────────────────────────────────────────
function focusGroupInCanvas(groupId: string) {
  // Highlight the matching canvas node and center on it.
  activeNode.value = nodes.value.find((n) => n.id === groupId) ?? null;
  const n = nodes.value.find((n) => n.id === groupId);
  if (n) {
    // Nudge VueFlow to keep the selected node visible. A real impl would
    // use setCenter(n.position.x, n.position.y, { zoom: 1 }); for now we
    // refit the view to include everything.
    setTimeout(() => fitView({ padding: 0.10, nodes: [n.id] }), 30);
  }
}

// ── Assign an unclassified group to a pending slot ─────────────────────
/** Pending slots = groups on canvas that still need user selection. */
const pendingSlots = computed<BoardGroup[]>(() =>
  canvasGroups.value.filter(
    (g) => g.state === 'type-placeholder' || g.state === 'missing',
  ),
);

function toggleAssign(uid: string) {
  assigningId.value = assigningId.value === uid ? null : uid;
}
function assignTo(unclassifiedId: string, slotId: string) {
  // Demo-only: remove from the unclassified list and flash the target slot.
  unclassifiedGroups.value = unclassifiedGroups.value.filter((g) => g.id !== unclassifiedId);
  assigningId.value = null;
  focusGroupInCanvas(slotId);
  // Real implementation would: rewrite the slot's state to 'resolved', bind
  // its Connector to the newly classified board, and re-emit the edge.
}

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
  for (const g of built.groups) {
    // Placeholder/missing groups may have empty boards arrays — skip them.
    if (g.boards[0]) reset[g.id] = g.boards[0].id;
  }
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
  if (!g || !g.boards.length) return null;
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
      <div class="palette-section-title">硬件管理器</div>

      <div class="pp-field">
        <div class="pp-field-label">数据源</div>
        <div class="pp-field-value">openUBMC（{{ totalBoards }} 张物理板）</div>
      </div>

      <!-- ── Check summary (mini 检查 panel) ─────────────────────── -->
      <div class="check-summary">
        <button
          class="chk-chip chk-ok"
          :title="STATE_LABEL.resolved"
        >✓ {{ stateCounts.resolved }}</button>
        <button
          class="chk-chip chk-warn"
          :title="STATE_LABEL['multi-match'] + ' / ' + STATE_LABEL['type-placeholder']"
        >⚠ {{ stateCounts['multi-match'] + stateCounts['type-placeholder'] }}</button>
        <button
          class="chk-chip chk-err"
          :title="STATE_LABEL.missing"
        >⛔ {{ stateCounts.missing }}</button>
        <button
          class="chk-chip chk-grey"
          :title="STATE_LABEL.unclassified"
        >◌ {{ stateCounts.unclassified }}</button>
      </div>

      <!-- ── Canvas groups, sectioned by state ────────────────────── -->
      <template v-for="s in STATE_SECTION_ORDER" :key="s">
        <div
          v-if="groupsByState[s].length"
          class="state-section"
          :style="{ '--state-accent': STATE_COLOR[s] } as any"
        >
          <div class="state-section-title">
            <span class="sec-dot" :style="{ background: STATE_COLOR[s] }" />
            {{ STATE_LABEL[s] }}
            <span class="sec-count">{{ groupsByState[s].length }}</span>
          </div>
          <ul class="grp-summary">
            <li
              v-for="g in groupsByState[s]"
              :key="g.id"
              class="grp-item"
              :class="{ 'is-active': activeNode?.id === g.id }"
              @click="focusGroupInCanvas(g.id)"
            >
              <span
                class="grp-s-badge"
                :style="{ background: (TYPE_COLOR[g.type] ?? '#6b7280') + '28', color: TYPE_COLOR[g.type] ?? '#6b7280' }"
              >{{ g.shortLabel }}</span>
              <span class="grp-s-name">{{ g.name }}</span>
              <span class="grp-s-count" v-if="g.boards.length">× {{ g.boards.length }}</span>
            </li>
          </ul>
        </div>
      </template>

      <!-- ── 未分类 section (list-only, not on canvas) ────────────── -->
      <div v-if="groupsByState.unclassified.length" class="state-section state-section-unclassified">
        <div class="state-section-title">
          <span class="sec-dot" :style="{ background: STATE_COLOR.unclassified }" />
          未分类 <span class="sec-sub">（仅列表，未在画布）</span>
          <span class="sec-count">{{ groupsByState.unclassified.length }}</span>
        </div>
        <ul class="grp-summary">
          <li
            v-for="g in groupsByState.unclassified"
            :key="g.id"
            class="grp-item grp-item-unclassified"
          >
            <div class="unc-row">
              <span class="grp-s-badge unc-badge">未分类</span>
              <span class="grp-s-name">{{ g.name }}</span>
              <button
                class="unc-assign-btn"
                :disabled="pendingSlots.length === 0"
                @click.stop="toggleAssign(g.id)"
              >指派到…</button>
            </div>
            <div v-if="g.connectorRef" class="unc-meta">
              来源 Connector：<code>{{ g.connectorRef.parentGroupId }} / {{ g.connectorRef.connectorName }}</code>
            </div>
            <!-- Slot chooser popover -->
            <div v-if="assigningId === g.id" class="unc-popover">
              <div v-if="pendingSlots.length === 0" class="unc-empty">暂无空槽位可指派</div>
              <button
                v-for="slot in pendingSlots"
                :key="slot.id"
                class="unc-slot"
                @click.stop="assignTo(g.id, slot.id)"
              >
                <span class="unc-slot-type">{{ slot.type }}</span>
                <span class="unc-slot-name">{{ slot.name }}</span>
                <span class="unc-slot-state" :style="{ color: STATE_COLOR[slot.state] }">
                  {{ STATE_LABEL[slot.state] }}
                </span>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- ── Layout actions ───────────────────────────────────────── -->
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
    <div v-if="activeGroup" class="topo-property-panel" @click.stop>
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
          <div class="pp-field-label">解析状态</div>
          <div
            class="pp-field-value"
            :style="{ color: STATE_COLOR[activeGroup.state] }"
          >
            {{ STATE_LABEL[activeGroup.state] }}
          </div>
        </div>
        <div v-if="activeGroup.connectorRef" class="pp-field">
          <div class="pp-field-label">来源 Connector</div>
          <div class="pp-field-value mono">
            {{ activeGroup.connectorRef.parentGroupId }} / {{ activeGroup.connectorRef.connectorName }}
          </div>
        </div>
        <div v-if="activeGroup.connectorRef?.identifyMode !== undefined" class="pp-field">
          <div class="pp-field-label">IdentifyMode</div>
          <div class="pp-field-value mono">{{ activeGroup.connectorRef.identifyMode }}</div>
        </div>
        <div v-if="activeGroup.missingFile" class="pp-field">
          <div class="pp-field-label">缺失文件</div>
          <div class="pp-field-value mono" style="color:#fca5a5">{{ activeGroup.missingFile }}</div>
        </div>
        <template v-if="activeBoard">
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
        </template>
        <div v-else class="pp-field">
          <div class="pp-field-label">状态说明</div>
          <div class="pp-field-value" style="font-size:11px;line-height:1.5">
            该板卡处于「{{ STATE_LABEL[activeGroup.state] }}」态，尚未选择具体板卡实例。
            请在卡片头部下拉中完成选择。
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

/* ── Check summary (mini 检查 panel) ── */
.check-summary {
  display: flex;
  gap: 6px;
  margin: 6px 0 10px 0;
  flex-wrap: wrap;
}
.chk-chip {
  all: unset;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  cursor: help;
  border: 1px solid transparent;
}
.chk-ok   { background: rgba(34,197,94,0.14);  color: #86efac; border-color: rgba(34,197,94,0.35); }
.chk-warn { background: rgba(245,158,11,0.14); color: #fcd34d; border-color: rgba(245,158,11,0.35); }
.chk-err  { background: rgba(239,68,68,0.14);  color: #fca5a5; border-color: rgba(239,68,68,0.35); }
.chk-grey { background: rgba(107,114,128,0.18); color: #cbd5e1; border-color: rgba(107,114,128,0.4); }

/* ── State sections in the sidebar ── */
.state-section {
  margin-top: 10px;
  padding: 6px 6px 8px;
  border: 1px solid rgba(255,255,255,0.06);
  border-left: 2px solid var(--state-accent, #6b7280);
  border-radius: 6px;
  background: rgba(255,255,255,0.02);
}
.state-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: var(--text-primary, #e6e8ef);
  padding-bottom: 4px;
}
.sec-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.sec-count {
  margin-left: auto;
  font-size: 10px;
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}
.sec-sub {
  font-size: 9.5px;
  font-weight: 500;
  opacity: 0.6;
  margin-left: -2px;
}

/* ── Clickable list items with sync-highlight ── */
.grp-item {
  padding: 4px 6px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.12s;
}
.grp-item:hover       { background: rgba(255,255,255,0.04); }
.grp-item.is-active   { background: rgba(79,110,247,0.22); }

/* ── Unclassified list rows ── */
.grp-item-unclassified { cursor: default; }
.grp-item-unclassified:hover { background: transparent; }
.unc-row { display: flex; align-items: center; gap: 6px; }
.unc-badge {
  background: rgba(107,114,128,0.3) !important;
  color: #cbd5e1 !important;
}
.unc-assign-btn {
  all: unset;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  background: rgba(79,110,247,0.18);
  color: #c7d2fe;
  cursor: pointer;
  flex-shrink: 0;
}
.unc-assign-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.unc-assign-btn:hover:not(:disabled) { background: rgba(79,110,247,0.3); }
.unc-meta {
  margin-top: 3px;
  padding-left: 4px;
  font-size: 10px;
  color: var(--text-secondary, #98a0b8);
  opacity: 0.75;
}
.unc-meta code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9.5px;
  background: rgba(255,255,255,0.04);
  padding: 0 4px;
  border-radius: 3px;
}
.unc-popover {
  margin-top: 6px;
  padding: 4px;
  border-radius: 6px;
  background: rgba(79,110,247,0.08);
  border: 1px solid rgba(79,110,247,0.3);
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.unc-slot {
  all: unset;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10.5px;
}
.unc-slot:hover { background: rgba(255,255,255,0.06); }
.unc-slot-type {
  font-weight: 700;
  color: var(--text-primary, #e6e8ef);
  font-size: 10px;
}
.unc-slot-name { flex: 1; color: var(--text-secondary, #98a0b8); }
.unc-slot-state { font-size: 9.5px; font-weight: 700; }
.unc-empty {
  padding: 8px;
  text-align: center;
  font-size: 10.5px;
  color: var(--text-secondary, #98a0b8);
}
</style>
