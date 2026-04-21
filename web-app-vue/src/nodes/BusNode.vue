<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import { C } from '../data/palette';

interface BusData { label: string; dashed?: boolean; color?: string; nodeWidth?: number }
const props = defineProps<NodeProps<BusData>>();
</script>

<template>
  <div
    class="bus-node"
    :class="{ 'is-selected': props.selected, 'is-dashed': props.data.dashed }"
    :style="{
      width: ((props.data.nodeWidth ?? 80) + 'px'),
      background: props.data.dashed ? 'transparent' : (props.data.color ?? C.pink),
      border: props.data.dashed ? `1.5px dashed ${props.data.color ?? C.pink}` : 'none',
      color: props.data.dashed ? (props.data.color ?? C.pink) : '#fff',
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
.bus-node {
  height: 22px;
  border-radius: 11px;
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
.bus-node.is-selected {
  box-shadow: 0 0 0 2px rgba(79, 110, 247, 0.6), 0 0 12px rgba(79, 110, 247, 0.3);
}
</style>
