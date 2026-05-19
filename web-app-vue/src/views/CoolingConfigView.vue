<script setup lang="ts">
// 能效调速统一配置模板 — rendered via iframe from static files
// The cooling-config directory lives in web-app-vue/public/cooling-config/
// and is served at BASE_URL + cooling-config/ after build.
const base = import.meta.env.BASE_URL; // e.g. "/BMC/vue-topo/" in prod, "/" in dev
const coolingUrl = base.endsWith('/') ? base + 'cooling-config/index.html' : base + '/cooling-config/index.html';
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
  min-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  background: #0a100e;
}
.cooling-frame {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 48px);
  border: none;
}
</style>
