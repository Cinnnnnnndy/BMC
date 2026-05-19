<script setup lang="ts">
import { ref } from 'vue';
import TopologyView    from './TopologyView.vue';
import SmcOffsetView   from './views/SmcOffsetView.vue';
import ExprCalcView    from './views/ExprCalcView.vue';
import CoolingConfigView from './views/CoolingConfigView.vue';

type TabId = 'topology' | 'smc' | 'expr' | 'cooling';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'topology', label: 'CSR 拓扑',         icon: '🗺' },
  { id: 'smc',      label: 'SMC 偏移量计算器',  icon: '🧮' },
  { id: 'expr',     label: '批量表达式计算器',   icon: '⚙' },
  { id: 'cooling',  label: '能效调速配置模板',   icon: '❄' },
];

// Hash-based initial tab: allow ?tab=smc / #smc from the main app
function initialTab(): TabId {
  const valid: TabId[] = ['topology', 'smc', 'expr', 'cooling'];
  const hash = location.hash.replace('#', '');
  const param = new URLSearchParams(location.search).get('tab');
  const candidate = (hash || param || '') as TabId;
  return valid.includes(candidate) ? candidate : 'topology';
}

const activeTab = ref<TabId>(initialTab());
</script>

<template>
  <div class="app-root">
    <!-- Tab bar -->
    <nav class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </nav>

    <!-- View area -->
    <div class="view-area">
      <TopologyView    v-show="activeTab === 'topology'" />
      <SmcOffsetView   v-if="activeTab === 'smc'"     />
      <ExprCalcView    v-if="activeTab === 'expr'"    />
      <CoolingConfigView v-if="activeTab === 'cooling'" />
    </div>
  </div>
</template>

<style scoped>
.app-root {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--canvas-bg, #0b0d12);
  color: var(--text-primary, #e6e8ef);
  overflow: hidden;
}

/* ── Tab bar ── */
.tab-bar {
  display: flex;
  align-items: stretch;
  height: 44px;
  background: #0e1017;
  border-bottom: 1px solid #1e2240;
  flex-shrink: 0;
  gap: 2px;
  padding: 0 6px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 16px;
  background: transparent;
  color: #6b7498;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.2px;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  border-radius: 4px 4px 0 0;
}

.tab-btn:hover:not(.active) {
  color: #c4c9e0;
  background: rgba(255, 255, 255, 0.04);
}

.tab-btn.active {
  color: #e6e8ef;
  border-bottom-color: #4f6ef7;
  background: rgba(79, 110, 247, 0.09);
}

.tab-icon { font-size: 15px; line-height: 1; }

/* ── View area ── */
.view-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* Topology fills 100% via its own root; scroll views need overflow-y auto */
.view-area > * {
  width: 100%;
  height: 100%;
}
</style>

<style>
/* Non-topology tool views need vertical scroll within view-area */
.view-area > div { overflow-y: auto; height: 100%; }
</style>
