<script setup lang="ts">
// 能效调速统一配置模板 — rendered via iframe from static files.
// The cooling-config directory lives in web-app-vue/public/cooling-config/
// and is served at BASE_URL + cooling-config/ after build.
import { computed } from 'vue';
import LinkageRail from '../components/LinkageRail.vue';
import { useLinkage } from '../composables/useLinkage';

const { state: link } = useLinkage();

const base = import.meta.env.BASE_URL; // e.g. "/BMC/vue-topo/" in prod, "/" in dev

// Left linkage: forward topology-resolved fans / temp zones into the editor as
// query params. The static editor can read them to pre-seed entities.
const coolingUrl = computed(() => {
  const path = base.endsWith('/') ? base + 'cooling-config/index.html'
                                  : base + '/cooling-config/index.html';
  const ib = link.inbound.cooling;
  if (!ib) return path;
  const q = new URLSearchParams();
  if (ib.fans?.length) q.set('fans', ib.fans.join(','));
  if (ib.tempZones?.length) q.set('zones', ib.tempZones.join(','));
  if (ib.source) q.set('src', ib.source);
  const s = q.toString();
  return s ? `${path}?${s}` : path;
});

// Right linkage: a starter CSR Objects fragment seeded from the topology
// selection. The authoritative YAML still comes from the editor's own export.
function linkCode(): string | null {
  const ib = link.inbound.cooling;
  if (!ib || (!ib.fans?.length && !ib.tempZones?.length)) return null;
  const fans = (ib.fans ?? []).map(f => `      - ${f}`).join('\n') || '      - <fan>';
  const zones = (ib.tempZones ?? []).map(z => `      - ${z}`).join('\n') || '      - <temp_sensor>';
  return [
    'cooling_config:',
    `  source_board: ${ib.source}`,
    '  fan_group:',
    fans,
    '  temp_zones:',
    zones,
    '  policy: pid   # TODO: 在编辑器内细化曲线后导出完整片段',
  ].join('\n');
}
</script>

<template>
  <div class="cooling-root">
    <!-- 左/右联动栏 -->
    <LinkageRail tool="cooling" code-label="CSR Objects 片段 → 代码视图" :get-code="linkCode" />

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
  padding: 14px 14px 0;
  box-sizing: border-box;
  background: var(--background);
}
.cooling-frame {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 120px);
  border: none;
  border-radius: 8px;
}
</style>
