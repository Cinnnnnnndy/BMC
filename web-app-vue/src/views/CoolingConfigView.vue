<script setup lang="ts">
import { computed } from 'vue';

const base = import.meta.env.BASE_URL;

const coolingUrl = computed(() => {
  return base.endsWith('/') ? base + 'cooling-config/index.html'
                            : base + '/cooling-config/index.html';
});
</script>

<template>
  <div class="cooling-root">
    <iframe
      :src="coolingUrl"
      class="cooling-frame"
      title="能效调速配置编辑器"
      sandbox="allow-scripts allow-same-origin allow-downloads allow-modals allow-popups"
    />
  </div>
</template>

<style scoped>
.cooling-root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--background);
}
.cooling-frame {
  flex: 1;
  width: 100%;
  border: none;
}
</style>
