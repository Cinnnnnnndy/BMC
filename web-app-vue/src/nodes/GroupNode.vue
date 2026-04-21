<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core';

interface GroupData { label?: string; dashed?: boolean; subGroup?: boolean }
const props = defineProps<NodeProps<GroupData>>();
</script>

<template>
  <div
    class="grp-node"
    :class="{ 'is-sub': props.data.subGroup }"
  >
    <span v-if="props.data.label" class="grp-node-label">{{ props.data.label }}</span>
  </div>
</template>

<style scoped>
.grp-node {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  position: relative;
  background: var(--board-bg);
  pointer-events: none;
  overflow: visible;
}
.grp-node.is-sub {
  border: 1.5px dashed var(--board-border);
}
.grp-node-label {
  position: absolute;
  top: 6px;
  left: 8px;
  font-size: 10px;
  font-weight: 600;
  color: var(--board-label);
  letter-spacing: 0.05em;
  font-family: monospace;
  pointer-events: none;
  user-select: none;
}
</style>
