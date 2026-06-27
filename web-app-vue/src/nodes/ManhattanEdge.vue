<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { Ref } from 'vue';
import type { EdgeProps } from '@vue-flow/core';

const props = defineProps<EdgeProps>();

const BG = '#151528'; // canvas background colour for crossing masks

function manhattanPath(
  sx: number, sy: number,
  laneX: number,
  tx: number, ty: number,
  r = 12,
): string {
  const dir  = sy < ty ? 1 : -1;
  const absY = Math.abs(ty - sy);
  if (absY < 2) return `M ${sx} ${sy} L ${tx} ${ty}`;
  const rY  = Math.min(r, absY / 2);
  const rX1 = Math.min(r, Math.abs(laneX - sx) / 2);
  const rX2 = Math.min(r, Math.abs(tx - laneX) / 2);
  return (
    `M ${sx} ${sy} ` +
    `L ${laneX - rX1} ${sy} Q ${laneX} ${sy}, ${laneX} ${sy + dir * rY} ` +
    `L ${laneX} ${ty - dir * rY} Q ${laneX} ${ty}, ${laneX + rX2} ${ty} ` +
    `L ${tx} ${ty}`
  );
}

// Receive the single active edge id from TopologyView.
// When another edge is selected, this one dims. Trunk (smoothstep) is unaffected.
const activeEdgeId = inject<Ref<string | null>>('activeEdgeId', ref(null));
const isHighlighted = computed(() =>
  !activeEdgeId.value || props.id === activeEdgeId.value,
);

const sw        = computed(() => (props.style?.strokeWidth as number) ?? 1.5);
const baseOpacity = computed(() => (props.style?.opacity as number) ?? 0.88);
const dasharray = computed(() => props.style?.strokeDasharray as string | undefined);
const color     = computed(() => (props.style?.stroke as string) ?? '#818cf8');

// Dim non-highlighted edges; transition for smooth feel.
const displayOpacity = computed(() => isHighlighted.value ? baseOpacity.value : 0.1);

// yOffAtTarget spreads parallel buses at the board card.
// Same offset applied to laneX so vertical sections also separate cleanly.
const yOff  = computed(() => (props.data?.yOffAtTarget as number) ?? 0);
const laneX = computed(() => props.sourceX + (props.data?.laneOffset as number ?? 80) + yOff.value);
const ty    = computed(() => props.targetY + yOff.value);

const path = computed(() =>
  manhattanPath(props.sourceX, props.sourceY, laneX.value, props.targetX, ty.value),
);
</script>

<template>
  <!-- Mask path: background-coloured, slightly wider — punches through earlier
       edges at crossings so each line reads cleanly without hover. -->
  <path
    :d="path"
    :stroke="BG"
    :stroke-width="sw + 3.5"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    style="pointer-events:none;transition:opacity 0.18s"
    :style="{ opacity: displayOpacity }"
  />
  <path
    :d="path"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-dasharray="dasharray"
    class="vue-flow__edge-path"
    style="transition:opacity 0.18s,stroke-width 0.18s"
    :style="{
      stroke: color,
      strokeWidth: (isHighlighted ? sw + 0.5 : sw) + 'px',
      opacity: displayOpacity,
    }"
  />
</template>
