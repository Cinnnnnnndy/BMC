<script setup lang="ts">
// Thin wrapper — the whole app is the topology view for now.
// Matches the behavior of the React app where TopologyView is the active tab.
import TopologyView from './TopologyView.vue';
</script>

<template>
  <div class="app-root">
    <TopologyView />
  </div>
</template>

<style scoped>
.app-root {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: var(--canvas-bg, #0b0d12);
  color: var(--text-primary, #e6e8ef);
}
</style>
