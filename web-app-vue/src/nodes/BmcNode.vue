<script setup lang="ts">
// Root node: BMC. Shows its own management bus + SMC chip inline.
import { Handle, Position } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import { BMC_TOPOLOGY } from '../data/boardTopologies';
import MiniTopology from './MiniTopology.vue';

interface BmcData { label?: string; subtitle?: string }
const props = defineProps<NodeProps<BmcData>>();

const topo = BMC_TOPOLOGY;
</script>

<template>
  <div class="bmc-node" :class="{ 'is-selected': props.selected }">
    <div class="bmc-title">{{ props.data.label ?? 'BMC' }}</div>
    <div class="bmc-sub">{{ props.data.subtitle ?? '根节点 · openUBMC' }}</div>

    <div class="bmc-topo-section">
      <div class="bmc-topo-label">I2C 拓扑</div>
      <MiniTopology :buses="topo.buses" />
    </div>

    <Handle
      type="source" :position="Position.Right" id="r"
      :style="{ width: '8px', height: '8px', background: '#4f6ef7', border: '2px solid #0b0d12', right: '-5px' }"
    />
  </div>
</template>

<style scoped>
.bmc-node {
  width: 240px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--board-bg, rgba(255,255,255,0.02));
  border: 1px dashed var(--board-border, rgba(255,255,255,0.14));
  color: var(--text-primary, #e6e8ef);
  user-select: none;
  cursor: grab;
  position: relative;
}
.bmc-node.is-selected {
  border-color: rgba(255,255,255,0.32);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.12);
}
.bmc-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: rgba(255,255,255,0.85);
}
.bmc-sub {
  margin-top: 2px;
  font-size: 9.5px;
  color: rgba(255,255,255,0.38);
  margin-bottom: 10px;
}
.bmc-topo-section {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 7px;
}
.bmc-topo-label {
  font-size: 9px;
  font-weight: 700;
  color: rgba(129,140,248,0.75);
  margin-bottom: 4px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
</style>
