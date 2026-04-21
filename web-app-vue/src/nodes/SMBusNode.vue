<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import { C } from '../data/palette';

interface SMBusData { label: string; color?: string }
const props = defineProps<NodeProps<SMBusData>>();

const bg = computed(() => props.data.color ?? C.green);
const darkText = computed(() => bg.value === C.green);
</script>

<template>
  <div
    class="smbus-node"
    :class="{ 'is-selected': props.selected }"
    :style="{
      background: bg,
      color: darkText ? '#0c1e14' : '#fff',
    }"
  >
    <Handle type="target" :position="Position.Left" id="l"
      :style="{ width: '8px', height: '8px', background: '#4a9eff', border: 'none', left: '-4px' }" />
    {{ props.data.label }}
    <Handle type="source" :position="Position.Right" id="r"
      :style="{ width: '6px', height: '6px', background: 'rgba(255,255,255,0.3)', border: 'none', right: '-3px' }" />
  </div>
</template>

<style scoped>
.smbus-node {
  height: 22px;
  border-radius: 11px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  position: relative;
  cursor: grab;
  white-space: nowrap;
  outline: none;
}
.smbus-node.is-selected {
  box-shadow: 0 0 0 2px rgba(79, 110, 247, 0.6);
}
</style>
