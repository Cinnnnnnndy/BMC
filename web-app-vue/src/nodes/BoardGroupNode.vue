<script setup lang="ts">
// Board group node — mind-map card that shows:
//   • Header: type badge + label + variant count
//   • Searchable dropdown to switch between board variants (by SN/PN)
//   • Inline I2C topology (buses → muxes → chips), collapsible
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import type { BoardGroup, BoardRecord } from '../data/boards';
import { getTopology } from '../data/boardTopologies';
import MiniTopology from './MiniTopology.vue';

/** One coloured dot on the right edge of the node (fan-out handle). */
interface SourceHandle { id: string; pct: number; color: string }

interface GroupData {
  group: BoardGroup;
  selectedId?: string;
  onSelect?: (groupId: string, boardId: string) => void;
  /** When set, replaces the single 'r' handle with multiple distributed handles. */
  sourceHandles?: SourceHandle[];
}

const props = defineProps<NodeProps<GroupData>>();

const group   = computed<BoardGroup>(() => props.data.group);
const variants = computed<BoardRecord[]>(() => group.value.boards);
const topo    = computed(() => getTopology(group.value.type, group.value.name));

const selected = computed<BoardRecord>(() => {
  const id = props.data.selectedId;
  return variants.value.find((b) => b.id === id) ?? variants.value[0];
});

// ── Inline topology collapse toggle ──────────────────────────────────
const topoCollapsed = ref(false);

// ── Combobox state ────────────────────────────────────────────────────
const open = ref(false);
const query = ref('');
const rootEl = ref<HTMLDivElement | null>(null);

const filtered = computed<BoardRecord[]>(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return variants.value;
  return variants.value.filter((b) =>
    b.id.toLowerCase().includes(q) ||
    b.sn.toLowerCase().includes(q) ||
    b.partNumber.toLowerCase().includes(q),
  );
});

function toggleOpen(ev: Event) {
  ev.stopPropagation();
  open.value = !open.value;
  if (open.value) query.value = '';
}
function pick(b: BoardRecord, ev: Event) {
  ev.stopPropagation();
  open.value = false;
  props.data.onSelect?.(group.value.id, b.id);
}
function onDocClick(ev: MouseEvent) {
  if (!rootEl.value) return;
  if (!rootEl.value.contains(ev.target as Node)) open.value = false;
}
watch(open, (v) => {
  if (v) document.addEventListener('mousedown', onDocClick);
  else   document.removeEventListener('mousedown', onDocClick);
});
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick));

// ── Visual accent per type ────────────────────────────────────────────
const palette: Record<string, string> = {
  BCU:     '#22c55e',
  CLU:     '#f59e0b',
  EXU:     '#a855f7',
  IEU:     '#06b6d4',
  SEU:     '#ec4899',
  NICCard: '#3b82f6',
  Unknown: '#6b7280',
};
const accent = computed(() => palette[group.value.type] ?? '#6b7280');
</script>

<template>
  <div
    ref="rootEl"
    class="group-node"
    :class="{ 'is-selected': props.selected, 'is-unknown': group.category === 'unknown' }"
  >
    <Handle
      type="target" :position="Position.Left" id="l"
      :style="{ width: '8px', height: '8px', background: accent, border: '2px solid #0b0d12', left: '-5px' }"
    />

    <!-- ── Header ────────────────────────────────────────────────── -->
    <div class="group-header">
      <span class="group-badge" :style="{ background: accent + '33', color: accent }">
        {{ group.shortLabel }}
      </span>
      <span class="group-title">{{ group.label }}</span>
      <span class="group-count">× {{ variants.length }}</span>
    </div>

    <!-- ── Variant selector ──────────────────────────────────────── -->
    <div class="combo-wrap">
      <button class="group-combo-btn" @mousedown.stop @click="toggleOpen">
        <span class="combo-sn">{{ selected?.sn || '—' }}</span>
        <span class="combo-pn">PN {{ selected?.partNumber || '' }}</span>
        <span class="combo-caret" :class="{ open }">▾</span>
      </button>

    <div v-if="open" class="combo-dropdown" @mousedown.stop>
      <input
        v-model="query"
        class="combo-search"
        type="text"
        placeholder="搜索 SN / PN…"
        autocomplete="off"
        @keydown.stop
      />
      <div class="combo-list">
        <div
          v-for="b in filtered"
          :key="b.id"
          class="combo-item"
          :class="{ 'is-active': b.id === selected?.id }"
          @click="(e) => pick(b, e)"
        >
          <span class="item-sn">{{ b.sn }}</span>
          <span class="item-pn">PN {{ b.partNumber }}</span>
        </div>
        <div v-if="filtered.length === 0" class="combo-empty">无匹配</div>
      </div>
    </div>
    </div><!-- /combo-wrap -->

    <!-- ── I2C topology ──────────────────────────────────────────── -->
    <div class="topo-section">
      <div class="topo-header" @click.stop="topoCollapsed = !topoCollapsed">
        <span class="topo-header-label" :style="{ color: accent }">I2C 拓扑</span>
        <span class="topo-toggle">{{ topoCollapsed ? '▶' : '▼' }}</span>
      </div>
      <MiniTopology
        v-if="!topoCollapsed"
        :buses="topo.buses"
      />
    </div>

    <!-- ── Source handles: distributed fan-out or single fallback ──── -->
    <template v-if="props.data.sourceHandles?.length">
      <template v-for="(h, idx) in props.data.sourceHandles" :key="h.id">
        <!-- Port number label just inside the right edge -->
        <span
          class="port-num"
          :style="{ top: (h.pct * 100) + '%', color: h.color }"
        >{{ String(idx + 1).padStart(2, '0') }}</span>
        <Handle
          type="source"
          :position="Position.Right"
          :id="h.id"
          :style="{
            position: 'absolute',
            width: '7px',
            height: '7px',
            background: h.color,
            border: '2px solid #09090e',
            right: '-5px',
            top: (h.pct * 100) + '%',
            transform: 'translateY(-50%)',
          }"
        />
      </template>
    </template>
    <Handle
      v-else
      type="source" :position="Position.Right" id="r"
      :style="{ width: '8px', height: '8px', background: accent, border: '2px solid #0b0d12', right: '-5px' }"
    />
  </div>
</template>

<style scoped>
.group-node {
  width: 360px;
  padding: 10px 12px 12px;
  border-radius: 10px;
  background: var(--board-bg, rgba(255,255,255,0.02));
  border: 1px dashed var(--board-border, rgba(255,255,255,0.14));
  color: var(--text-primary, #e6e8ef);
  user-select: none;
  cursor: grab;
  position: relative;
}
.group-node.is-selected {
  border-color: rgba(255,255,255,0.32);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.12);
}
.group-node.is-unknown { opacity: 0.65; }

/* ── Header ── */
.group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.group-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  opacity: 0.85;
}
.group-title {
  flex: 1;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.80);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.group-count {
  font-size: 9px;
  color: rgba(255,255,255,0.35);
  flex-shrink: 0;
}

/* ── Port number label (beside distributed source handles) ── */
.port-num {
  position: absolute;
  right: 18px;
  transform: translateY(-50%);
  font-size: 8px;
  font-weight: 700;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  opacity: 0.55;
  pointer-events: none;
  user-select: none;
  letter-spacing: 0.5px;
}

/* ── Variant combo ── */
.combo-wrap {
  position: relative;   /* dropdown is positioned relative to this wrapper */
}
.group-combo-btn {
  all: unset;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 5px 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(120,130,170,0.22);
  border-radius: 7px;
  cursor: pointer;
  font-size: 10.5px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  box-sizing: border-box;
}
.group-combo-btn:hover { background: rgba(255,255,255,0.07); }
.combo-sn { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.combo-pn { color: var(--text-secondary, #98a0b8); font-size: 9.5px; }
.combo-caret { color: var(--text-secondary, #98a0b8); transition: transform .15s; font-size: 9px; }
.combo-caret.open { transform: rotate(180deg); }

.combo-dropdown {
  position: absolute;
  top: calc(100% + 4px);   /* 4 px gap below the button */
  left: 0;
  right: 0;
  background: var(--panel-bg, #10131c);
  border: 1px solid rgba(120,130,170,0.4);
  border-radius: 9px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.45);
  padding: 6px;
  z-index: 40;
}
.combo-search {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid rgba(120,130,170,0.3);
  background: rgba(255,255,255,0.05);
  color: var(--text-primary, #e6e8ef);
  font-size: 11px;
  outline: none;
  margin-bottom: 5px;
}
.combo-search:focus { border-color: rgba(100,140,255,0.7); }
.combo-list { max-height: 160px; overflow-y: auto; }
.combo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10.5px;
}
.combo-item:hover { background: rgba(255,255,255,0.05); }
.combo-item.is-active { background: rgba(79,110,247,0.18); }
.item-sn { overflow: hidden; text-overflow: ellipsis; }
.item-pn { color: var(--text-secondary, #98a0b8); font-size: 9.5px; flex-shrink: 0; }
.combo-empty { padding: 8px; text-align: center; font-size: 10.5px; color: var(--text-secondary, #98a0b8); }

/* ── I2C topo section ── */
.topo-section {
  margin-top: 10px;
  border-top: 1px solid rgba(120,130,170,0.15);
  padding-top: 6px;
}
.topo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 2px 0 4px 0;
  user-select: none;
}
.topo-header:hover .topo-toggle { opacity: 1; }
.topo-header-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
}
.topo-toggle {
  font-size: 9px;
  opacity: 0.5;
  transition: opacity .15s;
}
</style>
