<script setup lang="ts">
// Renders the bus topology exactly like the React view screenshot:
//
//   [Bus pill] ──────────────────────────── [wire]
//                   │          │          │
//               [Eeprom]    [CPLD]    [PCA9545]
//                                     [0][1][2][3]
//                                         │
//                                       [LM75]
//
// Each chip is an icon card (ChipIcon SVG + label), not a text pill.
// Mux fan-out children hang below the mux card with their own stems.

import ChipIcon from './ChipIcon.vue';
import type { BusRow, ChipItem } from '../data/boardTopologies';

defineProps<{
  buses: BusRow[];
}>();

// ── visual config ─────────────────────────────────────────────────────
// Pastel label colours per chip type — icons are always white (via CSS var).
const CHIP_COLOR: Record<string, string> = {
  Eeprom:  '#93c5fd',  // blue-300
  CPU:     '#86efac',  // green-300
  Lm75:    '#fcd34d',  // amber-300
  Smc:     '#fdba74',  // orange-300
  Cpld:    '#d8b4fe',  // purple-300
  VRD:     '#67e8f9',  // cyan-300
  bigchip: '#f9a8d4',  // pink-300
};
function cc(chipType: string) { return CHIP_COLOR[chipType] ?? '#9ca3af'; }

const BUS_TYPE_ABBR: Record<string, string> = {
  i2c:     'I2C',
  smbus:   'SMB',
  hisport: 'HSP',
  jtag:    'JTAG',
};
function busAbbr(b: BusRow) { return BUS_TYPE_ABBR[b.busType] ?? b.busType; }

// All "top-row" items: direct chips + optional mux as last item
function topItems(b: BusRow): Array<{ kind: 'chip'; item: ChipItem } | { kind: 'mux'; bus: BusRow }> {
  const out: ReturnType<typeof topItems> = b.chips.map((item) => ({ kind: 'chip' as const, item }));
  if (b.mux) out.push({ kind: 'mux' as const, bus: b });
  return out;
}
</script>

<template>
  <div class="mt-root">
    <div
      v-for="bus in buses"
      :key="bus.id"
      class="bus-block"
      :class="{ dashed: bus.dashed }"
    >
      <!-- ── Bus row: pill + wire + chip stems ──────────────────── -->
      <div class="bus-row">
        <!-- Bus pill -->
        <div
          class="bus-pill"
          :style="{
            borderColor: bus.color + 'cc',
            background:  bus.color + '18',
            color:       bus.color,
          }"
        >
          <!-- circle icon matching React style -->
          <svg width="13" height="13" viewBox="0 0 13 13">
            <circle cx="6.5" cy="6.5" r="5.5" :stroke="bus.color" stroke-width="1.5" fill="none" />
            <circle cx="6.5" cy="6.5" r="2.5" :fill="bus.color" opacity="0.8" />
          </svg>
          <span class="bus-abbr">{{ busAbbr(bus) }}</span>
          <span class="bus-name">{{ bus.label }}</span>
        </div>

        <!-- Nothing to the right for hisport or empty buses -->
        <template v-if="topItems(bus).length > 0">
          <!-- Short connector from pill to wire -->
          <div class="h-connector" :style="{ background: bus.color + 'cc' }" />

          <!-- Chip columns hang below the wire -->
          <div class="chips-on-wire" :style="{ borderTopColor: bus.color + 'cc' }">
            <div
              v-for="(ti, idx) in topItems(bus)"
              :key="idx"
              class="chip-col"
            >
              <!-- Vertical stem from wire down to card -->
              <div class="v-stem" :style="{ background: bus.color + 'cc' }" />

              <!-- Chip card -->
              <template v-if="ti.kind === 'chip'">
                <div
                  class="chip-card"
                  :style="{ '--cc': cc(ti.item.chipType) }"
                >
                  <div class="chip-icon-box">
                    <ChipIcon :size="26" />
                  </div>
                  <div class="chip-lbl">{{ ti.item.label }}</div>
                </div>
              </template>

              <!-- Mux card -->
              <template v-else>
                <div class="mux-card">
                  <div class="mux-icon-box">
                    <ChipIcon :size="26" />
                  </div>
                  <div class="mux-lbl">{{ ti.bus.mux!.label }}</div>
                  <!-- Numbered handles row -->
                  <div class="mux-handles">
                    <span
                      v-for="n in Math.min(ti.bus.mux!.channels, 6)"
                      :key="n"
                      class="mux-handle"
                    >{{ n - 1 }}</span>
                    <span v-if="ti.bus.mux!.channels > 6" class="mux-handle mux-more">…</span>
                  </div>
                </div>

                <!-- Fan-out: mux downstream chips below -->
                <template v-if="ti.bus.mux!.chips.length > 0">
                  <div class="mux-fanout-wire" :style="{ background: '#a855f7' + 'aa' }" />
                  <div class="mux-fanout-row">
                    <div
                      v-for="(c, ci) in ti.bus.mux!.chips"
                      :key="ci"
                      class="chip-col fanout-item"
                    >
                      <div class="v-stem" style="background: #a855f7aa" />
                      <div
                        class="chip-card"
                        :style="{ '--cc': cc(c.chipType) }"
                      >
                        <div class="chip-icon-box">
                          <ChipIcon :size="22" />
                        </div>
                        <div class="chip-lbl">{{ c.label }}</div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ChipIcon CSS vars — white translucent pins to match reference style */
.chip-icon-box {
  --chip-icon-body: rgba(0, 0, 0, 0.30);
  --chip-icon-pin:  rgba(255, 255, 255, 0.50);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mux-icon-box {
  --chip-icon-body: rgba(0, 0, 0, 0.30);
  --chip-icon-pin:  rgba(168, 85, 247, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Root ── */
.mt-root {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 6px 0 4px;
}

/* ── Bus block ── */
.bus-block { display: flex; flex-direction: column; }
.bus-block.dashed { opacity: 0.38; }

/* ── Bus row: pill + wire + chips ── */
.bus-row {
  display: flex;
  align-items: flex-start;
  gap: 0;
}

/* ── Bus pill ── */
.bus-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: 2px 7px 2px 5px;
  border: 1px solid;       /* thinner border, reference style */
  border-radius: 20px;
  font-size: 10px;
  white-space: nowrap;
  height: 20px;
  box-sizing: border-box;
  /* vertically align with wire */
  margin-top: 15px;        /* adjusted for 20px height: (20/2)+5 ≈ 15 */
}
.bus-abbr {
  font-size: 8px;
  font-weight: 800;
  opacity: 0.65;
  letter-spacing: 0.2px;
}
.bus-name {
  font-weight: 600;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Short horizontal connector pill → wire ── */
.h-connector {
  width: 6px;
  height: 2px;
  flex-shrink: 0;
  /* pill: margin-top 15px, height 20px → centre at 25px */
  margin-top: 24px;
}

/* ── Chip columns area; border-top IS the bus wire ── */
.chips-on-wire {
  display: flex;
  gap: 6px;
  border-top: 2px solid;   /* the horizontal bus wire */
  padding-top: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  /* Shift wire down to meet the vertical centre of the bus pill.
     Pill: margin-top 14px, height 22px → centre at y ≈ 25 px.
     h-connector already has margin-top 24px (same centre). */
  margin-top: 24px;
}

/* ── Individual chip column ── */
.chip-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

/* ── Vertical stem from wire to card ── */
.v-stem {
  width: 2px;
  height: 14px;
  flex-shrink: 0;
}

/* ── Chip card — uniform white border (reference style) ── */
.chip-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 56px;
  padding: 5px 3px 5px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 7px;
  cursor: default;
  transition: background 0.12s;
}
.chip-card:hover { background: rgba(255,255,255,0.06); }
.chip-lbl {
  font-size: 9px;
  font-weight: 600;
  color: var(--cc, rgba(255,255,255,0.60));
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
}

/* ── Mux card — same card baseline as chip-card, purple accent ── */
.mux-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 68px;
  padding: 5px 3px 4px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(168, 85, 247, 0.40);
  border-radius: 7px;
  cursor: default;
}
.mux-lbl {
  font-size: 9px;
  font-weight: 700;
  color: rgba(192, 132, 252, 0.90);
  white-space: nowrap;
}
.mux-handles {
  display: flex;
  gap: 2px;
  margin-top: 1px;
  flex-wrap: wrap;
  justify-content: center;
}
.mux-handle {
  min-width: 13px;
  height: 13px;
  border-radius: 3px;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.55);
  font-size: 7.5px;
  font-weight: 700;
  color: #c084fc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
}
.mux-more { opacity: 0.6; }

/* ── Mux fan-out ── */
.mux-fanout-wire {
  width: 2px;
  height: 10px;
  flex-shrink: 0;
}
.mux-fanout-row {
  display: flex;
  gap: 5px;
  border-top: 1.5px solid rgba(168, 85, 247, 0.55);
}
.fanout-item { flex-shrink: 0; }
</style>
