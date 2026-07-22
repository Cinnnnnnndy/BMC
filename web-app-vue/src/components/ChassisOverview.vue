<script setup lang="ts">
// 整机（Chassis）告警总览：跨板聚合 + 机箱级传感器 + 一致性检查（不做逐条编辑）
import { computed, onMounted } from 'vue';
import { boardAlarm } from '../alarm/alarmStore';
import { chassisSensors, thresholdInconsistencies } from '../alarm/chassisAggregate';
import { seedCfgsForBoard } from '../alarm/srSeed';

const props = defineProps<{ boards: { name: string; type: string }[] }>();
defineEmits<{ close: [] }>();

// 打开总览时，为每块有匹配 .sr 的板播种（使各板覆盖数真实）
onMounted(() => {
  for (const b of props.boards) {
    const st = boardAlarm(b.name);
    if (!st.loaded) { st.loaded = true; const s = seedCfgsForBoard(b.name); if (s.cfgs.length) st.cfgs.push(...s.cfgs); }
  }
});

const chassis = computed(() => chassisSensors());
const incons = computed(() => thresholdInconsistencies());
const boardRows = computed(() => props.boards.map((b) => {
  const cfgs = boardAlarm(b.name).cfgs;
  const alarms = cfgs.reduce((n, c) => n + c.events.filter((e) => e.enabled).length, 0);
  return { name: b.name, type: b.type, sensors: cfgs.length, alarms };
}));
const totalSensors = computed(() => boardRows.value.reduce((n, r) => n + r.sensors, 0));
const totalAlarms = computed(() => boardRows.value.reduce((n, r) => n + r.alarms, 0));
const configured = computed(() => boardRows.value.filter((r) => r.sensors > 0).length);
</script>

<template>
  <div class="chassis-panel" @click.stop>
    <div class="cp-header">
      <span>整机 · 告警总览</span>
      <button class="cp-close" aria-label="关闭" @click="$emit('close')">✕</button>
    </div>

    <div class="cp-body">
      <!-- 概览统计 -->
      <div class="cp-stats">
        <div class="stat"><span class="stat-n">{{ configured }}/{{ boardRows.length }}</span><span class="stat-l">板卡已配置</span></div>
        <div class="stat"><span class="stat-n">{{ totalSensors }}</span><span class="stat-l">传感器</span></div>
        <div class="stat"><span class="stat-n">{{ totalAlarms }}</span><span class="stat-l">告警</span></div>
        <div class="stat"><span class="stat-n">{{ chassis.length }}</span><span class="stat-l">机箱级</span></div>
      </div>

      <!-- 一致性检查 -->
      <div v-if="incons.length" class="cp-card cp-warn">
        <div class="cp-cap">跨板一致性 · {{ incons.length }} 项待核对</div>
        <div v-for="(it, i) in incons" :key="i" class="incon-row">
          <span class="incon-name">{{ it.name }}.{{ it.field }}</span>
          <span class="incon-vals"><span v-for="v in it.values" :key="v.board" class="incon-v">{{ v.board }}={{ v.value }}</span></span>
        </div>
      </div>

      <!-- 机箱级传感器 -->
      <div class="cp-card">
        <div class="cp-cap">机箱级传感器（Chassis.* · 跨板）</div>
        <div v-if="!chassis.length" class="cp-empty">暂无机箱级传感器</div>
        <div v-for="(s, i) in chassis" :key="i" class="chs-row">
          <div class="chs-head">
            <span class="chs-name">{{ s.name }}</span>
            <span class="chs-kind">{{ s.kind === 'threshold' ? '门限' : '状态' }}</span>
            <span class="chs-board">{{ s.board }}</span>
          </div>
          <div class="chs-events">
            <span v-for="(e, j) in s.events" :key="j" class="chs-ev" :title="e.eventKeyId">
              <i class="chs-dot" :class="/Fail|Nonrecoverable/i.test(e.eventKeyId) ? 'crit' : (/Major/i.test(e.eventKeyId) ? 'maj' : 'min')"></i>
              {{ e.eventKeyId.split('.').pop() }}
            </span>
          </div>
        </div>
      </div>

      <!-- 各板告警覆盖 -->
      <div class="cp-card">
        <div class="cp-cap">各板告警覆盖</div>
        <div class="cov-head"><span>板卡</span><span>类型</span><span>传感器</span><span>告警</span></div>
        <div v-for="r in boardRows" :key="r.name" class="cov-row" :class="{ off: !r.sensors }">
          <span class="cov-name">{{ r.name }}</span>
          <span class="cov-type">{{ r.type }}</span>
          <span class="cov-n">{{ r.sensors || '—' }}</span>
          <span class="cov-n">{{ r.alarms || '—' }}</span>
        </div>
      </div>

      <div class="cp-note">整机层只做总览 + 机箱级 + 一致性；逐条编辑请到板卡 / 器件配置面板。</div>
    </div>
  </div>
</template>

<style scoped>
.chassis-panel {
  position: absolute; right: 8px; top: 8px; bottom: 8px; width: 460px;
  z-index: 210; display: flex; flex-direction: column; overflow: hidden;
  background: var(--panel-shell-bg); border: 1px solid var(--panel-shell-border);
  border-radius: var(--panel-shell-radius); box-shadow: var(--panel-shell-shadow);
  color: var(--foreground);
}
.cp-header { display: flex; align-items: center; padding: 12px 14px; font-size: 13px; font-weight: 600; }
.cp-close { margin-left: auto; all: unset; cursor: pointer; color: var(--foreground-muted); font-size: 16px; padding: 2px 4px; border-radius: var(--radius-sm); }
.cp-close:hover { background: var(--state-hover); color: var(--foreground); }
.cp-body { flex: 1; min-height: 0; overflow-y: auto; padding: 0 12px 12px; display: flex; flex-direction: column; gap: 10px; }

.cp-stats { display: flex; gap: 8px; }
.stat { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: var(--radius-lg); background: var(--surface-1); }
.stat-n { font-size: 18px; font-weight: 700; }
.stat-l { font-size: 11px; color: var(--foreground-muted); }

.cp-card { padding: 12px; border-radius: var(--radius-lg); background: var(--surface-1); display: flex; flex-direction: column; gap: 8px; }
.cp-cap { font-size: 11px; color: var(--foreground-secondary); }
.cp-empty { font-size: 11px; color: var(--foreground-muted); }
.cp-warn { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--warning) 40%, transparent); }

.incon-row { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.incon-name { font-family: var(--font-mono, monospace); color: var(--foreground); }
.incon-vals { margin-left: auto; display: flex; gap: 6px; }
.incon-v { color: var(--warning); }

.chs-row { display: flex; flex-direction: column; gap: 5px; padding: 8px; border-radius: var(--radius-md); background: var(--surface-2); }
.chs-head { display: flex; align-items: center; gap: 8px; }
.chs-name { font-size: 12px; font-weight: 600; }
.chs-kind { font-size: 11px; color: var(--foreground-muted); padding: 1px 7px; border-radius: var(--radius-pill); background: var(--surface-1); }
.chs-board { margin-left: auto; font-size: 11px; color: var(--foreground-muted); }
.chs-events { display: flex; flex-wrap: wrap; gap: 4px; }
.chs-ev { display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: var(--radius-pill); background: var(--surface-1); font-size: 11px; color: var(--foreground-secondary); }
.chs-dot { width: 6px; height: 6px; border-radius: var(--radius-pill); background: var(--warning); }
.chs-dot.min { background: var(--warning); }
.chs-dot.maj { background: color-mix(in srgb, var(--warning) 55%, var(--danger)); }
.chs-dot.crit { background: var(--danger); }

.cov-head, .cov-row { display: grid; grid-template-columns: 1.4fr 0.9fr 0.6fr 0.6fr; align-items: center; gap: 6px; font-size: 11px; }
.cov-head { color: var(--foreground-muted); padding: 2px 4px; }
.cov-row { padding: 6px 4px; border-radius: var(--radius-sm); }
.cov-row:not(.off):hover { background: var(--state-hover); }
.cov-row.off { color: var(--foreground-muted); }
.cov-name { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cov-n { text-align: right; }

.cp-note { font-size: 11px; color: var(--foreground-muted); padding: 2px 2px; }
</style>
