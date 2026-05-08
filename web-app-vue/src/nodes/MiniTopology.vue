<script setup lang="ts">
/**
 * MiniTopology — draggable I2C topology canvas (Vue version)
 *
 * Each element (bus pill, chip card, mux card) is absolutely positioned
 * inside a relative container. An SVG layer draws the connecting wires
 * between elements based on their current positions, so wires follow
 * when nodes are dragged.
 *
 * Drag system mirrors the React project:
 *   mousedown → capture (stopPropagation so VueFlow node-drag is blocked)
 *   mousemove on document → update position
 *   mouseup on document  → release
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ChipIcon from './ChipIcon.vue';
import type { BusRow } from '../data/boardTopologies';

const props = defineProps<{ buses: BusRow[] }>();

// ─── Chip colours ────────────────────────────────────────────────────────
const CHIP_COLOR: Record<string, string> = {
  Eeprom:  '#93c5fd',
  CPU:     '#86efac',
  Lm75:    '#fcd34d',
  Smc:     '#fdba74',
  Cpld:    '#d8b4fe',
  VRD:     '#67e8f9',
  bigchip: '#f9a8d4',
};
const cc = (t: string) => CHIP_COLOR[t] ?? '#9ca3af';

const BUS_ABBR: Record<string, string> = {
  i2c: 'I2C', smbus: 'SMB', hisport: 'HSP', jtag: 'JTAG',
};
const busAbbr = (b: BusRow) => BUS_ABBR[b.busType] ?? b.busType;

// ─── Layout constants (px) ───────────────────────────────────────────────
const PILL_W   = 118   // bus pill width (approximate, accounts for font variability)
const PILL_H   = 22    // bus pill height
const CHIP_W   = 60    // chip card width
const CHIP_H   = 58    // chip card height (icon + label + padding)
const MUX_W    = 72    // mux card width
const MUX_H    = 68    // mux card height (icon + label + handles + padding)
const ITEM_GAP = 8     // gap between chips / mux on same bus
const CHIPS_X0 = PILL_W + 8  // first chip column start x (after pill + small gap)
const WIRE_OFS = PILL_H / 2  // wire is at vertical centre of pill
const STEM_H   = 14          // length of vertical stem from wire down to chip top
const FAN_WIRE_H = 10        // vertical from mux bottom to fanout horizontal wire
const BUS_PAD  = 16          // vertical gap between consecutive bus sections

// ─── Key helpers (no id field on ChipItem, use bus-id + index) ──────────
const bk  = (busId: string)                   => `bus:${busId}`;
const ck  = (busId: string, ci: number)       => `chip:${busId}:${ci}`;
const mk  = (busId: string)                   => `mux:${busId}`;
const fck = (busId: string, ci: number)       => `fchip:${busId}:${ci}`;

// ─── Initial position computation ────────────────────────────────────────
interface Pos { x: number; y: number }
type PosMap = Record<string, Pos>

function computeLayout(buses: BusRow[]): PosMap {
  const pos: PosMap = {};
  let y = 0;

  for (const bus of buses) {
    // Bus pill (its centre = the wire y)
    pos[bk(bus.id)] = { x: 0, y };
    const wireY = y + WIRE_OFS;

    // Section height (accumulate before moving y)
    let chipRowH = CHIP_H;  // height of the direct-chip row

    // Direct chips
    bus.chips.forEach((_, ci) => {
      pos[ck(bus.id, ci)] = {
        x: CHIPS_X0 + ci * (CHIP_W + ITEM_GAP),
        y: wireY + STEM_H,
      };
    });

    // Mux card + its fanout chips
    if (bus.mux) {
      const muxX = CHIPS_X0 + bus.chips.length * (CHIP_W + ITEM_GAP);
      pos[mk(bus.id)] = { x: muxX, y: wireY + STEM_H };

      if (bus.mux.chips.length > 0) {
        const fanWireY = wireY + STEM_H + MUX_H + FAN_WIRE_H;
        bus.mux.chips.forEach((_, fi) => {
          pos[fck(bus.id, fi)] = {
            x: muxX + fi * (CHIP_W + ITEM_GAP),
            y: fanWireY + STEM_H,
          };
        });
        chipRowH = MUX_H + FAN_WIRE_H + STEM_H + CHIP_H;
      } else {
        chipRowH = MUX_H;
      }
    } else if (bus.chips.length === 0) {
      chipRowH = 0;
    }

    y += WIRE_OFS + STEM_H + chipRowH + BUS_PAD;
  }

  return pos;
}

// Reactive position map
const positions = ref<PosMap>({});
watch(
  () => props.buses,
  (buses) => { positions.value = computeLayout(buses); },
  { immediate: true },
);

// ─── Container height ────────────────────────────────────────────────────
const containerH = computed(() => {
  let max = 100;
  for (const [k, p] of Object.entries(positions.value)) {
    const itemH = k.startsWith('bus:') ? PILL_H
                : k.startsWith('mux:') ? MUX_H
                : CHIP_H;
    max = Math.max(max, p.y + itemH);
  }
  return max + 20;
});

// Horizontal span needed (determines SVG / container width)
const containerW = computed(() => {
  let max = 200;
  for (const [k, p] of Object.entries(positions.value)) {
    const itemW = k.startsWith('mux:') ? MUX_W : (k.startsWith('bus:') ? PILL_W : CHIP_W);
    max = Math.max(max, p.x + itemW);
  }
  return max + 20;
});

// ─── SVG wire paths ──────────────────────────────────────────────────────
interface WireLine { d: string; color: string }

const wireLines = computed<WireLine[]>(() => {
  const lines: WireLine[] = [];

  for (const bus of props.buses) {
    const pillPos = positions.value[bk(bus.id)];
    if (!pillPos) continue;

    const wireY   = pillPos.y + WIRE_OFS;
    const wireX0  = pillPos.x + PILL_W;

    // Collect direct items (chips + optional mux)
    const directItems: { key: string; w: number }[] = [
      ...bus.chips.map((_c, ci) => ({ key: ck(bus.id, ci), w: CHIP_W })),
      ...(bus.mux ? [{ key: mk(bus.id), w: MUX_W }] : []),
    ];

    if (directItems.length > 0) {
      const itemPs = directItems.map(it => positions.value[it.key]);
      const cxs    = itemPs.map((p, i) => p ? p.x + directItems[i].w / 2 : wireX0);
      const maxX   = Math.max(wireX0, ...cxs);

      // Horizontal bus wire
      lines.push({ d: `M ${wireX0} ${wireY} L ${maxX} ${wireY}`, color: bus.color });

      // Vertical stems to each item
      directItems.forEach((it, i) => {
        const p = itemPs[i];
        if (!p) return;
        const cx = p.x + it.w / 2;
        lines.push({ d: `M ${cx} ${wireY} L ${cx} ${p.y}`, color: bus.color });
      });
    }

    // Mux fanout wires
    if (bus.mux && bus.mux.chips.length > 0) {
      const muxPos = positions.value[mk(bus.id)];
      if (!muxPos) continue;

      const muxCx   = muxPos.x + MUX_W / 2;
      const muxBotY = muxPos.y + MUX_H;

      const fanItems = bus.mux.chips.map((_c, fi) => ({ key: fck(bus.id, fi), w: CHIP_W }));
      const fanPs    = fanItems.map(it => positions.value[it.key]);
      const fanCxs   = fanPs.map((p, i) => p ? p.x + fanItems[i].w / 2 : muxCx);
      const fanWireY = Math.min(...fanPs.filter(Boolean).map(p => p!.y)) - STEM_H;

      if (fanPs.some(Boolean)) {
        const minFX = Math.min(...fanCxs);
        const maxFX = Math.max(...fanCxs);

        // Vertical drop from mux bottom
        lines.push({ d: `M ${muxCx} ${muxBotY} L ${muxCx} ${fanWireY}`, color: '#a855f7' });
        // Horizontal fanout wire
        lines.push({ d: `M ${minFX} ${fanWireY} L ${maxFX} ${fanWireY}`, color: '#a855f7' });

        // Stems to each fanout chip
        fanItems.forEach((it, i) => {
          const p = fanPs[i];
          if (!p) return;
          const cx = p.x + it.w / 2;
          lines.push({ d: `M ${cx} ${fanWireY} L ${cx} ${p.y}`, color: '#a855f7' });
        });
      }
    }
  }

  return lines;
});

// ─── Drag system ─────────────────────────────────────────────────────────
interface DragState {
  key: string;
  startX: number; startY: number;
  origX: number;  origY: number;
}

const drag    = ref<DragState | null>(null);
const hotKey  = ref<string | null>(null);  // key of element being dragged (for z-index / cursor)

function onItemDown(key: string, e: MouseEvent) {
  // Stop VueFlow from treating this as a node-drag start
  e.stopPropagation();
  e.preventDefault();

  const p = positions.value[key];
  if (!p) return;

  drag.value  = { key, startX: e.clientX, startY: e.clientY, origX: p.x, origY: p.y };
  hotKey.value = key;
}

function onDocMove(e: MouseEvent) {
  const d = drag.value;
  if (!d) return;
  positions.value = {
    ...positions.value,
    [d.key]: {
      x: d.origX + e.clientX - d.startX,
      y: d.origY + e.clientY - d.startY,
    },
  };
}

function onDocUp() {
  drag.value   = null;
  hotKey.value = null;
}

onMounted(() => {
  document.addEventListener('mousemove', onDocMove);
  document.addEventListener('mouseup',   onDocUp);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDocMove);
  document.removeEventListener('mouseup',   onDocUp);
});

// ─── Reset layout ────────────────────────────────────────────────────────
function resetLayout() {
  positions.value = computeLayout(props.buses);
}
</script>

<template>
  <div
    class="mt-root"
    :class="{ 'is-dragging': !!drag }"
    :style="{ height: containerH + 'px', minWidth: containerW + 'px' }"
  >
    <!-- ── SVG wire layer (pointer-events:none, sits below chips) ── -->
    <svg
      class="wire-svg"
      :width="containerW"
      :height="containerH"
    >
      <path
        v-for="(line, i) in wireLines"
        :key="i"
        :d="line.d"
        :stroke="line.color + 'cc'"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
      />
    </svg>

    <!-- ── Bus pills ─────────────────────────────────────────────── -->
    <template v-for="bus in buses" :key="bus.id">
      <div
        class="bus-pill draggable-item"
        :class="{ 'item-hot': hotKey === bk(bus.id), 'bus-dashed': bus.dashed }"
        :style="{
          left:        (positions[bk(bus.id)]?.x ?? 0) + 'px',
          top:         (positions[bk(bus.id)]?.y ?? 0) + 'px',
          borderColor: bus.color + 'cc',
          background:  bus.color + '18',
          color:       bus.color,
        }"
        @mousedown="(e) => onItemDown(bk(bus.id), e)"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" style="flex-shrink:0">
          <circle cx="6.5" cy="6.5" r="5.5" :stroke="bus.color" stroke-width="1.5" fill="none" />
          <circle cx="6.5" cy="6.5" r="2.5"  :fill="bus.color"  opacity="0.8" />
        </svg>
        <span class="bus-abbr">{{ busAbbr(bus) }}</span>
        <span class="bus-name">{{ bus.label }}</span>
      </div>

      <!-- ── Direct chips ──────────────────────────────────────── -->
      <div
        v-for="(chip, ci) in bus.chips"
        :key="ck(bus.id, ci)"
        class="chip-card draggable-item"
        :class="{ 'item-hot': hotKey === ck(bus.id, ci), 'bus-dashed': bus.dashed }"
        :style="{
          left: (positions[ck(bus.id, ci)]?.x ?? 0) + 'px',
          top:  (positions[ck(bus.id, ci)]?.y ?? 0) + 'px',
          '--cc': cc(chip.chipType),
        }"
        @mousedown="(e) => onItemDown(ck(bus.id, ci), e)"
      >
        <div class="chip-icon-box"><ChipIcon :size="26" /></div>
        <div class="chip-lbl">{{ chip.label }}</div>
      </div>

      <!-- ── Mux card ───────────────────────────────────────────── -->
      <template v-if="bus.mux">
        <div
          class="mux-card draggable-item"
          :class="{ 'item-hot': hotKey === mk(bus.id) }"
          :style="{
            left: (positions[mk(bus.id)]?.x ?? 0) + 'px',
            top:  (positions[mk(bus.id)]?.y ?? 0) + 'px',
          }"
          @mousedown="(e) => onItemDown(mk(bus.id), e)"
        >
          <div class="mux-icon-box"><ChipIcon :size="26" /></div>
          <div class="mux-lbl">{{ bus.mux.label }}</div>
          <div class="mux-handles">
            <span
              v-for="n in Math.min(bus.mux.channels, 6)"
              :key="n"
              class="mux-handle"
            >{{ n - 1 }}</span>
            <span v-if="bus.mux.channels > 6" class="mux-handle mux-more">…</span>
          </div>
        </div>

        <!-- Fanout chips -->
        <div
          v-for="(chip, fi) in bus.mux.chips"
          :key="fck(bus.id, fi)"
          class="chip-card draggable-item"
          :class="{ 'item-hot': hotKey === fck(bus.id, fi) }"
          :style="{
            left: (positions[fck(bus.id, fi)]?.x ?? 0) + 'px',
            top:  (positions[fck(bus.id, fi)]?.y ?? 0) + 'px',
            '--cc': cc(chip.chipType),
          }"
          @mousedown="(e) => onItemDown(fck(bus.id, fi), e)"
        >
          <div class="chip-icon-box"><ChipIcon :size="22" /></div>
          <div class="chip-lbl">{{ chip.label }}</div>
        </div>
      </template>
    </template>

    <!-- ── Reset button ───────────────────────────────────────── -->
    <button
      class="reset-btn"
      title="重置元素位置"
      @mousedown.stop
      @click="resetLayout"
    >↺ 重置</button>
  </div>
</template>

<style scoped>
/* ─── Root container ─── */
.mt-root {
  position: relative;
  overflow: visible;
  /* let the card clip it with overflow:hidden if needed */
}
.mt-root.is-dragging {
  cursor: grabbing !important;
}
.mt-root.is-dragging * {
  user-select: none;
}

/* ─── SVG wire layer ─── */
.wire-svg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
  overflow: visible;
}

/* ─── Shared draggable positioning ─── */
.draggable-item {
  position: absolute;
  cursor: grab;
  z-index: 1;
  transition: box-shadow 0.12s, opacity 0.12s;
}
.draggable-item.item-hot {
  cursor: grabbing;
  z-index: 10;
  box-shadow: 0 0 0 1.5px rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.5) !important;
}
.draggable-item.bus-dashed {
  opacity: 0.38;
}

/* ─── Bus pill ─── */
.bus-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px 2px 5px;
  border: 1px solid;
  border-radius: 20px;
  font-size: 10px;
  white-space: nowrap;
  width: 118px;
  height: 22px;
  box-sizing: border-box;
}
.bus-pill:hover:not(.item-hot) { filter: brightness(1.2); }
.bus-abbr {
  font-size: 8px;
  font-weight: 800;
  opacity: 0.65;
  letter-spacing: 0.2px;
}
.bus-name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

/* ─── Chip card ─── */
.chip-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 60px;
  padding: 5px 3px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 7px;
  box-sizing: border-box;
}
.chip-card:hover:not(.item-hot) { background: rgba(255,255,255,0.06); }
.chip-icon-box {
  --chip-icon-body: rgba(0,0,0,0.30);
  --chip-icon-pin:  rgba(255,255,255,0.50);
  display: flex;
  align-items: center;
  justify-content: center;
}
.chip-lbl {
  font-size: 9px;
  font-weight: 600;
  color: var(--cc, rgba(255,255,255,0.60));
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
  max-width: 54px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Mux card ─── */
.mux-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 72px;
  padding: 5px 3px 4px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(168,85,247,0.40);
  border-radius: 7px;
  box-sizing: border-box;
}
.mux-card:hover:not(.item-hot) { background: rgba(168,85,247,0.06); }
.mux-icon-box {
  --chip-icon-body: rgba(0,0,0,0.30);
  --chip-icon-pin:  rgba(168,85,247,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mux-lbl {
  font-size: 9px;
  font-weight: 700;
  color: rgba(192,132,252,0.90);
  white-space: nowrap;
}
.mux-handles {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
}
.mux-handle {
  min-width: 13px;
  height: 13px;
  border-radius: 3px;
  background: rgba(168,85,247,0.2);
  border: 1px solid rgba(168,85,247,0.55);
  font-size: 7.5px;
  font-weight: 700;
  color: #c084fc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
}
.mux-more { opacity: 0.6; }

/* ─── Reset button ─── */
.reset-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 2px 6px;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 5px;
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.35);
  font-size: 9px;
  cursor: pointer;
  z-index: 20;
  transition: background 0.12s, color 0.12s;
  user-select: none;
}
.reset-btn:hover {
  background: rgba(255,255,255,0.09);
  color: rgba(255,255,255,0.70);
}
</style>
