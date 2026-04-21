<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import ChipIcon from './ChipIcon.vue';

interface MuxData { label?: string; handleCount?: number }
const props = defineProps<NodeProps<MuxData>>();

const muxColor = '#a855f7';

const percents = computed(() => {
  const n = Math.max(1, props.data.handleCount ?? 4);
  return Array.from({ length: n }, (_, i) => `${(((i + 0.5) / n) * 100).toFixed(1)}%`);
});
</script>

<template>
  <div
    class="mux-node"
    :class="{ 'is-selected': props.selected }"
  >
    <div class="mux-icon-area">
      <ChipIcon :size="26" />
    </div>
    <div class="mux-label" :style="{ background: muxColor + '28', color: muxColor }">
      {{ props.data.label ?? 'Pca9545' }}
    </div>
    <Handle
      type="target" :position="Position.Top" id="t"
      :style="{
        width: '6px', height: '6px', background: muxColor, border: 'none',
        left: '50%', top: '-3px', transform: 'translateX(-50%)',
      }"
    />
    <Handle
      v-for="(left, i) in percents"
      :key="i"
      type="source"
      :position="Position.Bottom"
      :id="`b${i}`"
      :style="{
        width: '5px', height: '5px',
        background: 'rgba(167,139,250,0.9)',
        border: 'none',
        bottom: '-2.5px',
        left,
        transform: 'translateX(-50%)',
      }"
    />
  </div>
</template>

<style scoped>
.mux-node {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: var(--node-bg);
  border: 1px solid var(--surface-border-subtle);
  display: flex;
  flex-direction: column;
  overflow: visible;
  position: relative;
  cursor: grab;
}
.mux-node.is-selected {
  border: 1.5px solid rgba(100, 140, 255, 0.70);
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.25);
}
.mux-icon-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mux-label {
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
  user-select: none;
  border-radius: 0 0 10px 10px;
  font-weight: 500;
}
</style>
