<script setup lang="ts">
// BigChip — visually identical to ChipNode in the current layout.
// Kept as a separate type to allow future style divergence.
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import ChipIcon from './ChipIcon.vue';
import { C } from '../data/palette';

interface BigChipData { chipType: string }
const props = defineProps<NodeProps<BigChipData>>();

const typeColor = computed(() => C.chipColor[props.data.chipType] ?? '#6b7280');
</script>

<template>
  <div
    class="bigchip-node"
    :class="{ 'is-selected': props.selected }"
  >
    <Handle
      type="target" :position="Position.Top" id="t"
      :style="{ width: '5px', height: '5px', background: 'rgba(128,128,180,0.5)', border: 'none', top: '-2.5px' }"
    />
    <div class="bigchip-icon-area">
      <ChipIcon :size="28" />
    </div>
    <div class="bigchip-label" :style="{ background: typeColor + '28', color: typeColor }">
      {{ props.data.chipType }}
    </div>
  </div>
</template>

<style scoped>
.bigchip-node {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: var(--node-bg);
  border: 1px solid var(--surface-border-subtle);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  cursor: grab;
  outline: none;
}
.bigchip-node.is-selected {
  border: 1.5px solid rgba(100, 140, 255, 0.70);
  box-shadow: 0 0 0 2px rgba(79, 110, 247, 0.25);
}
.bigchip-icon-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bigchip-label {
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
  font-weight: 500;
}
</style>
