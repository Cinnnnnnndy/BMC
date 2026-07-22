<script setup lang="ts">
// 整机（Chassis）告警总览：跨板明细（真实 .sr）+ 机箱级事件 + 一致性检查（不做逐条编辑）
import { computed, onMounted } from 'vue';
import { boardAlarm } from '../alarm/alarmStore';
import { boardRollup, chassisEvents, thresholdInconsistencies } from '../alarm/chassisAggregate';
import { seedCfgsForBoard } from '../alarm/srSeed';

const props = defineProps<{ boards: { name: string; type: string }[] }>();
defineEmits<{ close: [] }>();

// 打开总览时，为每块有匹配 .sr 的画布板播种（使板卡/器件面板与总览同源）
onMounted(() => {
  for (const b of props.boards) {
    const st = boardAlarm(b.name);
    if (!st.loaded) { st.loaded = true; const s = seedCfgsForBoard(b.name); if (s.cfgs.length) st.cfgs.push(...s.cfgs); }
  }
});

const rows = computed(() => boardRollup());
const cEvents = computed(() => chassisEvents());
const incons = computed(() => thresholdInconsistencies());
const totalSensors = computed(() => rows.value.reduce((n, r) => n + r.thresholdSensors + r.discreteSensors, 0));
const totalChips = computed(() => rows.value.reduce((n, r) => n + r.chips, 0));
const totalEvents = computed(() => rows.value.reduce((n, r) => n + r.events, 0));
</script>

<template>
  <div class="chassis-panel" @click.stop>
    <div class="cp-header">
      <span>整机 · 告警总览</span>
      <span class="cp-sub">多板演示集（真实 .sr）· EXU 机箱主板 + CLU / SEU / PSU</span>
      <button class="cp-close" aria-label="关闭" @click="$emit('close')">✕</button>
    </div>

    <div class="cp-body">
      <!-- 概览统计 -->
      <div class="cp-stats">
        <div class="stat"><span class="stat-n">{{ rows.length }}</span><span class="stat-l">样例板卡</span></div>
        <div class="stat"><span class="stat-n">{{ totalChips }}</span><span class="stat-l">物理器件</span></div>
        <div class="stat"><span class="stat-n">{{ totalSensors }}</span><span class="stat-l">传感器</span></div>
        <div class="stat"><span class="stat-n">{{ totalEvents }}</span><span class="stat-l">事件/告警</span></div>
        <div class="stat"><span class="stat-n">{{ cEvents.length }}</span><span class="stat-l">机箱级</span></div>
      </div>

      <!-- 各板明细（真实 .sr 直读）-->
      <div class="cp-card">
        <div class="cp-cap">各板明细 · 来自真实 .sr（硬件 + 软件合并）</div>
        <div class="rt-head"><span>板卡</span><span>器件</span><span>门限</span><span>状态</span><span>事件</span><span>机箱</span></div>
        <div v-for="r in rows" :key="r.name" class="rt-row">
          <span class="rt-name">
            <span class="rt-nm">{{ r.name }}</span>
            <span class="rt-src">{{ r.type }} · {{ r.sourceModel }}</span>
          </span>
          <span class="rt-n">{{ r.chips }}</span>
          <span class="rt-n">{{ r.thresholdSensors }}</span>
          <span class="rt-n">{{ r.discreteSensors }}</span>
          <span class="rt-n">{{ r.events }}</span>
          <span class="rt-n" :class="{ hot: r.chassisEvents }">{{ r.chassisEvents || '—' }}</span>
        </div>
      </div>

      <!-- 一致性检查 -->
      <div v-if="incons.length" class="cp-card cp-warn">
        <div class="cp-cap">跨板一致性 · {{ incons.length }} 项待核对</div>
        <div v-for="(it, i) in incons" :key="i" class="incon-row">
          <span class="incon-name">{{ it.name }}.{{ it.field }}</span>
          <span class="incon-vals"><span v-for="v in it.values" :key="v.board" class="incon-v">{{ v.board }}={{ v.value }}</span></span>
        </div>
      </div>

      <!-- 机箱级事件（Chassis.* · 由机箱主板 EXU 承载）-->
      <div class="cp-card">
        <div class="cp-cap">机箱级事件（Chassis.* · 跨板归属机箱）</div>
        <div v-if="!cEvents.length" class="cp-empty">暂无机箱级事件</div>
        <div class="chs-grid">
          <span v-for="(e, i) in cEvents" :key="i" class="chs-ev" :title="e.board + ' · ' + e.keyId">
            <i class="chs-dot" :class="e.severity"></i>{{ e.name }}
          </span>
        </div>
      </div>

      <div class="cp-note">整机层只做总览 + 机箱级 + 一致性；逐条编辑请到板卡 / 器件配置面板。</div>
    </div>
  </div>
</template>

<style scoped>
.chassis-panel {
  position: absolute; right: 8px; top: 8px; bottom: 8px; width: 480px;
  z-index: 210; display: flex; flex-direction: column; overflow: hidden;
  background: var(--panel-shell-bg); border: 1px solid var(--panel-shell-border);
  border-radius: var(--panel-shell-radius); box-shadow: var(--panel-shell-shadow);
  color: var(--foreground);
}
.cp-header { display: flex; align-items: center; gap: 10px; padding: 12px 14px; font-size: 13px; font-weight: 600; }
.cp-sub { font-size: 11px; font-weight: 400; color: var(--foreground-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cp-close { margin-left: auto; all: unset; cursor: pointer; color: var(--foreground-muted); font-size: 16px; padding: 2px 4px; border-radius: var(--radius-sm); flex: none; }
.cp-close:hover { background: var(--state-hover); color: var(--foreground); }
.cp-body { flex: 1; min-height: 0; overflow-y: auto; padding: 0 12px 12px; display: flex; flex-direction: column; gap: 10px; }

.cp-stats { display: flex; gap: 8px; }
.stat { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 10px 8px; border-radius: var(--radius-lg); background: var(--surface-1); }
.stat-n { font-size: 16px; font-weight: 700; }
.stat-l { font-size: 10px; color: var(--foreground-muted); }

.cp-card { padding: 12px; border-radius: var(--radius-lg); background: var(--surface-1); display: flex; flex-direction: column; gap: 8px; }
.cp-cap { font-size: 11px; color: var(--foreground-secondary); }
.cp-empty { font-size: 11px; color: var(--foreground-muted); }
.cp-warn { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--warning) 40%, transparent); }

/* 各板明细表：板卡(含来源模型) | 器件 | 门限 | 状态 | 事件 | 机箱 */
.rt-head, .rt-row { display: grid; grid-template-columns: 1.7fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr; align-items: center; gap: 6px; font-size: 11px; }
.rt-head { color: var(--foreground-muted); padding: 2px 6px; }
.rt-head span:not(:first-child), .rt-row .rt-n { text-align: right; }
.rt-row { padding: 7px 6px; border-radius: var(--radius-md); background: var(--surface-2); }
.rt-name { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.rt-nm { font-size: 12px; font-weight: 600; font-family: ui-monospace, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rt-src { font-size: 10px; color: var(--foreground-muted); }
.rt-n { color: var(--foreground-secondary); }
.rt-n.hot { color: var(--warning); font-weight: 700; }

.incon-row { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.incon-name { font-family: ui-monospace, monospace; color: var(--foreground); }
.incon-vals { margin-left: auto; display: flex; gap: 6px; }
.incon-v { color: var(--warning); }

.chs-grid { display: flex; flex-wrap: wrap; gap: 5px; }
.chs-ev { display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px; border-radius: var(--radius-pill); background: var(--surface-2); font-size: 11px; color: var(--foreground-secondary); }
.chs-dot { width: 6px; height: 6px; border-radius: var(--radius-pill); background: var(--warning); flex: none; }
.chs-dot.min { background: var(--warning); }
.chs-dot.maj { background: color-mix(in srgb, var(--warning) 55%, var(--danger)); }
.chs-dot.crit { background: var(--danger); }

.cp-note { font-size: 11px; color: var(--foreground-muted); padding: 2px 2px; }
</style>
