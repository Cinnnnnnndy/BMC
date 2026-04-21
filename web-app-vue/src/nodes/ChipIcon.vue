<script setup lang="ts">
defineProps<{ size?: number }>();
</script>

<template>
  <svg
    :width="size ?? 24"
    :height="size ?? 24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <!-- Body outline -->
    <rect
      x="5" y="5" width="14" height="14" rx="2.5"
      fill="var(--chip-icon-body)"
      stroke="var(--chip-icon-pin)"
      stroke-width="1.2"
    />
    <!-- Inner die -->
    <rect
      x="8.5" y="8.5" width="7" height="7" rx="1"
      fill="none"
      stroke="var(--chip-icon-pin)"
      stroke-width="0.9"
    />
    <!-- Top / bottom pins -->
    <template v-for="x in [9, 12, 15]" :key="`v${x}`">
      <line :x1="x" y1="5" :x2="x" y2="2.5" stroke="var(--chip-icon-pin)" stroke-width="1.4" stroke-linecap="round" />
      <line :x1="x" y1="19" :x2="x" y2="21.5" stroke="var(--chip-icon-pin)" stroke-width="1.4" stroke-linecap="round" />
    </template>
    <!-- Side pins -->
    <template v-for="y in [9, 15]" :key="`h${y}`">
      <line x1="5" :y1="y" x2="2.5" :y2="y" stroke="var(--chip-icon-pin)" stroke-width="1.4" stroke-linecap="round" />
      <line x1="19" :y1="y" x2="21.5" :y2="y" stroke="var(--chip-icon-pin)" stroke-width="1.4" stroke-linecap="round" />
    </template>
  </svg>
</template>
