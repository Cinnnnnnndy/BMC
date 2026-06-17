<script setup lang="ts">
import { computed } from 'vue';
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

const sw       = computed(() => (props.style?.strokeWidth as number) ?? 1.5);
const opacity  = computed(() => (props.style?.opacity as number) ?? 0.88);
const dasharray = computed(() => props.style?.strokeDasharray as string | undefined);
const color    = computed(() => (props.style?.stroke as string) ?? '#818cf8');

// yOffAtTarget spreads parallel buses arriving at the same board card.
// Slight laneX offset (×0.5) prevents total overlap on the vertical section.
const yOff  = computed(() => (props.data?.yOffAtTarget as number) ?? 0);
const laneX = computed(() => props.sourceX + (props.data?.laneOffset as number ?? 80) + yOff.value * 0.5);
const ty    = computed(() => props.targetY + yOff.value);

const path = computed(() =>
  manhattanPath(props.sourceX, props.sourceY, laneX.value, props.targetX, ty.value),
);
</script>

<template>
  <!-- Mask path first: background-coloured, slightly wider — punches through
       earlier edges at crossings. Later edges in SVG order naturally appear on top. -->
  <path
    :d="path"
    :stroke="BG"
    :stroke-width="sw + 3.5"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    style="pointer-events:none"
  />
  <path
    :d="path"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-dasharray="dasharray"
    class="vue-flow__edge-path"
    :style="{ stroke: color, strokeWidth: sw + 'px', opacity }"
  />
</template>
