<script setup lang="ts">
// 能效调速统一配置模板 — rendered via iframe from static files
// The cooling-config directory is served from /cooling-config/ by Vite's public folder.
</script>

<template>
  <div class="cooling-root">
    <iframe
      src="/cooling-config/index.html"
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
  background: #fff;
}
.cooling-frame {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 48px);
  border: none;
}
</style>
