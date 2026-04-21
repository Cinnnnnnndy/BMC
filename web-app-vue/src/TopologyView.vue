<script setup lang="ts">
import { computed, markRaw, onMounted, ref } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import type { Node, Edge, NodeDragEvent, NodeMouseEvent } from '@vue-flow/core';

import { buildInitialNodes, buildInitialEdges } from './data/initialGraph';
import { computeAutoLayout } from './composables/useAutoLayout';
import { C } from './data/palette';

import GroupNode from './nodes/GroupNode.vue';
import BusNode from './nodes/BusNode.vue';
import SMBusNode from './nodes/SMBusNode.vue';
import MuxNode from './nodes/MuxNode.vue';
import ChipNode from './nodes/ChipNode.vue';
import BigChipNode from './nodes/BigChipNode.vue';

// VueFlow's Node type is deeply generic (GraphNode) — using `any` at the
// ref boundary avoids TS2589 "excessively deep" errors while keeping runtime
// behavior identical. Individual callbacks still narrow when useful.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNode = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEdge = any;

// ── State ──────────────────────────────────────────────────────────────
const nodes = ref<AnyNode[]>(buildInitialNodes() as AnyNode[]);
const edges = ref<AnyEdge[]>(buildInitialEdges() as AnyEdge[]);
const layoutReady = ref(false);
const selectedNode = ref<AnyNode | null>(null);
const lockedNodes = ref<Set<string>>(new Set());
const panelOpen = ref(true);

interface ContextMenuState { x: number; y: number; nodeId: string }
const contextMenu = ref<ContextMenuState | null>(null);

interface EditingNode { id: string; x: number; y: number; value: string }
const editingNode = ref<EditingNode | null>(null);

const { fitView, onNodeDragStop, vueFlowRef, viewport, project } = useVueFlow();

// ── Node types (must be markRaw to skip Vue reactivity on component defs) ──
const nodeTypes = {
  group:   markRaw(GroupNode),
  bus:     markRaw(BusNode),
  smbus:   markRaw(SMBusNode),
  mux:     markRaw(MuxNode),
  chip:    markRaw(ChipNode),
  bigchip: markRaw(BigChipNode),
};

// ── Mount: run inner auto-layout and fit view ──────────────────────────
onMounted(() => {
  // next tick — allow VueFlow to register nodes
  queueMicrotask(() => {
    nodes.value = computeAutoLayout(buildInitialNodes(), buildInitialEdges());
    layoutReady.value = true;
    setTimeout(() => fitView({ padding: 0.08 }), 60);
  });
});

// ── Track locked nodes after drag ──────────────────────────────────────
onNodeDragStop((event: NodeDragEvent) => {
  const targets = event.nodes ?? (event.node ? [event.node] : []);
  const next = new Set(lockedNodes.value);
  for (const n of targets) next.add(n.id);
  lockedNodes.value = next;
});

// ── Interactions ───────────────────────────────────────────────────────
function onNodeClick(ev: NodeMouseEvent) {
  selectedNode.value = ev.node;
  contextMenu.value = null;
}

function onNodeContextMenu(ev: NodeMouseEvent) {
  (ev.event as MouseEvent).preventDefault();
  const me = ev.event as MouseEvent;
  contextMenu.value = { x: me.clientX, y: me.clientY, nodeId: ev.node.id };
}

function onPaneClick() {
  selectedNode.value = null;
  contextMenu.value = null;
  editingNode.value = null;
}

function onNodeDoubleClick(ev: NodeMouseEvent) {
  const n = ev.node;
  const d = n.data as Record<string, unknown>;
  const value = String(d.label ?? d.chipType ?? '');
  editingNode.value = { id: n.id, x: n.position.x, y: n.position.y, value };
}

function commitEdit() {
  const e = editingNode.value;
  if (!e) return;
  nodes.value = nodes.value.map((n) => {
    if (n.id !== e.id) return n;
    const d = (n.data ?? {}) as Record<string, unknown>;
    const newData = 'chipType' in d
      ? { ...d, chipType: e.value }
      : { ...d, label: e.value };
    return { ...n, data: newData };
  });
  editingNode.value = null;
}

function handleDelete(nodeId: string) {
  nodes.value = nodes.value.filter((n) => n.id !== nodeId);
  edges.value = edges.value.filter((e) => e.source !== nodeId && e.target !== nodeId);
  if (selectedNode.value?.id === nodeId) selectedNode.value = null;
  contextMenu.value = null;
}

function handleShowPanel(nodeId: string) {
  const n = nodes.value.find((x) => x.id === nodeId);
  if (n) selectedNode.value = n;
}

// ── Auto-layout actions ────────────────────────────────────────────────
function handleAutoLayout() {
  layoutReady.value = false;
  queueMicrotask(() => {
    nodes.value = computeAutoLayout(nodes.value, edges.value);
    layoutReady.value = true;
    setTimeout(() => fitView({ padding: 0.08 }), 50);
  });
}

function handleClearLocked() {
  lockedNodes.value = new Set();
  handleAutoLayout();
}

// ── Export ─────────────────────────────────────────────────────────────
function handleExportJSON() {
  const blob = new Blob([JSON.stringify({ nodes: nodes.value, edges: edges.value }, null, 2)],
    { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'topology.json';
  a.click();
  URL.revokeObjectURL(url);
}

function handleExportSVG() {
  const el = vueFlowRef.value?.querySelector('.vue-flow') ?? vueFlowRef.value;
  if (!el) return;
  const xml = new XMLSerializer().serializeToString(el);
  const blob = new Blob([xml], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'topology.svg';
  a.click();
  URL.revokeObjectURL(url);
}

// ── Palette drag & drop ────────────────────────────────────────────────
function onDragStart(e: DragEvent, type: string) {
  e.dataTransfer?.setData('node-type', type);
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  const type = e.dataTransfer?.getData('node-type');
  if (!type) return;
  const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const position = project({
    x: e.clientX - bounds.left,
    y: e.clientY - bounds.top,
  });

  const id = `new_${type}_${Date.now()}`;
  let newNode: Node;
  if (type === 'bus') {
    newNode = { id, type: 'bus', position, data: { label: 'i2cbus_new' } } as Node;
  } else if (type === 'smbus') {
    newNode = { id, type: 'smbus', position, data: { label: 'smbus_new' } } as Node;
  } else if (type === 'mux') {
    newNode = { id, type: 'mux', position, data: { label: 'Pca9545' },
      style: { width: '48px', height: '48px' } } as Node;
  } else if (type === 'board') {
    newNode = { id, type: 'group', position, data: { label: 'New_Board' },
      style: { width: '200px', height: '150px' }, selectable: false } as Node;
  } else {
    newNode = { id, type: 'chip', position, data: { chipType: type } } as Node;
  }
  nodes.value = [...nodes.value, newNode];
}

// ── MiniMap node color ─────────────────────────────────────────────────
function miniColor(n: Node): string {
  if (n.type === 'bus')   return C.pink;
  if (n.type === 'smbus') return C.green;
  if (n.type === 'mux')   return C.purple;
  if (n.type === 'chip' || n.type === 'bigchip') return '#3a3a5a';
  return 'transparent';
}

// ── Edit overlay position (world → screen) ─────────────────────────────
const editOverlayStyle = computed(() => {
  const e = editingNode.value;
  if (!e) return {};
  const vp = viewport.value;
  return {
    left: `${e.x * vp.zoom + vp.x}px`,
    top: `${e.y * vp.zoom + vp.y}px`,
  };
});

// ── Close context menu on any outside click ────────────────────────────
function closeContextMenu() { contextMenu.value = null; }

// ── Property panel helpers ─────────────────────────────────────────────
const typeLabel: Record<string, string> = {
  group: '板卡容器', bus: 'I2C 总线', smbus: 'SMBus',
  mux: 'Pca9545 复用器', chip: '芯片', bigchip: '芯片（大）',
};

function getFieldValue(n: Node) {
  const d = n.data as Record<string, unknown>;
  return String(d.label ?? d.chipType ?? '—');
}
</script>

<template>
  <div class="topo-root">
    <!-- ── Left palette ──────────────────────────────────────────── -->
    <aside :class="['topo-palette', panelOpen ? 'open' : 'closed']">
      <button
        class="palette-toggle"
        :style="{ alignSelf: panelOpen ? 'flex-end' : 'center' }"
        @click="panelOpen = !panelOpen"
      >{{ panelOpen ? '←' : '☰' }}</button>

      <template v-if="panelOpen">
        <div class="palette-section-title">图元面板</div>

        <div
          class="palette-item"
          draggable="true"
          @dragstart="(e) => onDragStart(e, 'bus')"
        >
          <span class="palette-item-dot" :style="{ background: C.pink }" /> I2C Bus
        </div>
        <div
          class="palette-item"
          draggable="true"
          @dragstart="(e) => onDragStart(e, 'smbus')"
        >
          <span class="palette-item-dot" :style="{ background: C.green }" /> SMBus
        </div>
        <div
          class="palette-item"
          draggable="true"
          @dragstart="(e) => onDragStart(e, 'mux')"
        >
          <span class="palette-item-dot" :style="{ background: C.purple }" /> Pca9545
        </div>
        <div
          class="palette-item"
          draggable="true"
          @dragstart="(e) => onDragStart(e, 'Eeprom')"
        >
          <span class="palette-item-dot" :style="{ background: C.chipColor.Eeprom }" /> Eeprom
        </div>
        <div
          class="palette-item"
          draggable="true"
          @dragstart="(e) => onDragStart(e, 'CPU')"
        >
          <span class="palette-item-dot" :style="{ background: C.chipColor.CPU }" /> CPU
        </div>
        <div
          class="palette-item"
          draggable="true"
          @dragstart="(e) => onDragStart(e, 'Lm75')"
        >
          <span class="palette-item-dot" :style="{ background: C.chipColor.Lm75 }" /> Lm75
        </div>
        <div
          class="palette-item"
          draggable="true"
          @dragstart="(e) => onDragStart(e, 'Smc')"
        >
          <span class="palette-item-dot" :style="{ background: C.chipColor.Smc }" /> Smc
        </div>
        <div
          class="palette-item"
          draggable="true"
          @dragstart="(e) => onDragStart(e, 'board')"
        >
          <span class="palette-item-dot" :style="{ background: 'var(--text-dim)' }" /> Board
        </div>

        <div v-if="lockedNodes.size > 0" class="palette-lock-hint">
          {{ lockedNodes.size }} 个节点已锁定
        </div>

        <div style="margin-top: 24px;">
          <div class="palette-section-title">操作</div>
          <button class="palette-action primary" @click="handleAutoLayout">自动布局</button>
          <button class="palette-action" @click="handleAutoLayout">重新布局</button>
          <button class="palette-action" @click="handleClearLocked">清除锁定</button>
          <button class="palette-action" @click="handleExportJSON">导出 JSON</button>
          <button class="palette-action" @click="handleExportSVG">导出 SVG</button>
        </div>
      </template>
    </aside>

    <!-- ── Canvas ────────────────────────────────────────────────── -->
    <div
      class="topo-canvas-wrap"
      @dragover.prevent
      @drop="onDrop"
    >
      <div v-if="!layoutReady" class="topo-loading">布局计算中...</div>

      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :fit-view-on-init="true"
        :default-viewport="{ x: 0, y: 0, zoom: 1 }"
        :min-zoom="0.1"
        :max-zoom="2.5"
        :nodes-draggable="true"
        :nodes-connectable="true"
        :connect-on-click="false"
        :elements-selectable="true"
        :pan-on-drag="true"
        @node-click="onNodeClick"
        @node-double-click="onNodeDoubleClick"
        @node-context-menu="onNodeContextMenu"
        @pane-click="onPaneClick"
      >
        <Background pattern-color="#2a2a3a" :gap="20" :size="1.2" />
        <Controls />
        <MiniMap
          :node-color="miniColor"
          mask-color="rgba(8,8,18,0.65)"
          :style="{ background: '#141420', border: '1px solid #2e2e4e', borderRadius: '8px' }"
        />
      </VueFlow>

      <!-- Edit overlay -->
      <div
        v-if="editingNode"
        class="topo-edit-overlay"
        :style="editOverlayStyle"
      >
        <input
          v-model="editingNode.value"
          @blur="commitEdit"
          @keydown.enter="commitEdit"
          @keydown.escape="editingNode = null"
          autofocus
        />
      </div>
    </div>

    <!-- ── Property panel ────────────────────────────────────────── -->
    <div v-if="selectedNode" class="topo-property-panel" @click.stop>
      <div class="pp-header">
        <span>节点属性</span>
        <button class="pp-close" @click="selectedNode = null">✕</button>
      </div>
      <div class="pp-body">
        <div class="pp-field">
          <div class="pp-field-label">节点 ID</div>
          <div class="pp-field-value">{{ selectedNode.id }}</div>
        </div>
        <div class="pp-field">
          <div class="pp-field-label">类型</div>
          <div class="pp-field-value">{{ typeLabel[selectedNode.type ?? ''] ?? selectedNode.type ?? '—' }}</div>
        </div>
        <div class="pp-field">
          <div class="pp-field-label">名称 / 标签</div>
          <div class="pp-field-value">{{ getFieldValue(selectedNode) }}</div>
        </div>
        <div class="pp-field">
          <div class="pp-field-label">所属板卡</div>
          <div class="pp-field-value">{{ (selectedNode as any).parentNode ?? '（顶层）' }}</div>
        </div>
        <div class="pp-field">
          <div class="pp-field-label">位置 X</div>
          <div class="pp-field-value">{{ Math.round(selectedNode.position.x) }}</div>
        </div>
        <div class="pp-field">
          <div class="pp-field-label">位置 Y</div>
          <div class="pp-field-value">{{ Math.round(selectedNode.position.y) }}</div>
        </div>
      </div>
      <div class="pp-footer">
        <button class="pp-delete" @click="handleDelete(selectedNode!.id)">删除节点</button>
      </div>
    </div>

    <!-- ── Context menu ──────────────────────────────────────────── -->
    <div
      v-if="contextMenu"
      class="topo-context-menu"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      @click.stop
    >
      <button @click="handleShowPanel(contextMenu!.nodeId); closeContextMenu()">编辑属性</button>
      <button class="danger" @click="handleDelete(contextMenu!.nodeId)">删除节点</button>
      <button @click="closeContextMenu">复制节点</button>
    </div>
  </div>
</template>
