<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useLinkage } from '../composables/useLinkage';
import {
  QUANTITIES, OPERATORS, PERIOD_CATEGORIES, recommendedPeriod,
  devicesForBoardType, isVoltageDomain, voltageRailsForBoard, railThresholds,
  DATA_SOURCE_NOTES, type BoardDevice, type VoltageRail,
} from '../alarm/alarmKnowledge';
import {
  generateAlarmObjects, configId, type AlarmSpec, type GeneratedSensor,
} from '../alarm/alarmObjectGenerator';

const { state: link } = useLinkage();
const inbound = computed(() => link.inbound.alarm);
const boardType = computed(() => inbound.value?.boardType || 'Unknown');
const boardName = computed(() => inbound.value?.boardName || '当前板卡');
const source = computed(() => inbound.value?.source || '');
const devices = computed<BoardDevice[]>(() => devicesForBoardType(boardType.value));

/* ── 每个传感器配置（一条监控量 / 一条电压轨 = 一个传感器）───────────── */
interface SensorCfg {
  id: string; deviceKey: string; deviceLabel: string; quantityKey: string;
  railKey?: string; railLabel?: string;
  dsMode: 'device-field' | 'scanner';
  dsChip: string; dsOffset: number; dsMask: number; dsSize: number; periodMs: number;
  thresholds: Record<string, number>;
  hysteresis: number; condition: number; eventKeyId: string;
  eventKeyOverrides: Record<string, string>;
  enabled: boolean; expanded: boolean;
}
const cfgs = reactive<SensorCfg[]>([]);
// 板级总览（focusedId=null 全部平铺）↔ 点单条聚焦高亮（其余淡出）
const focusedId = ref<string | null>(null);
function toggleFocus(id: string): void { focusedId.value = focusedId.value === id ? null : id; }
watch(boardType, () => { cfgs.splice(0, cfgs.length); focusedId.value = null; });

const selDeviceKey = ref('');
const selDevice = computed<BoardDevice | null>(() =>
  devices.value.find((d) => d.key === selDeviceKey.value) || devices.value[0] || null);
watch(devices, (d) => { if (d.length && !d.some((x) => x.key === selDeviceKey.value)) selDeviceKey.value = d[0].key; }, { immediate: true });

/* ── 可添加项：电压域→电压轨；其它→监控量 ─────────────────────────── */
const isVolt = computed(() => selDevice.value ? isVoltageDomain(selDevice.value.key) : false);
const railPalette = computed<VoltageRail[]>(() => voltageRailsForBoard(boardType.value));
function railAdded(railKey: string): boolean {
  return cfgs.some((c) => c.deviceKey === selDevice.value?.key && c.railKey === railKey);
}
function quantityAdded(qKey: string): boolean {
  return cfgs.some((c) => c.deviceKey === selDevice.value?.key && c.quantityKey === qKey && !c.railKey);
}
const customRail = ref('');

function baseCfg(deviceKey: string, deviceLabel: string, quantityKey: string, railKey?: string, railLabel?: string, nominal?: number): SensorCfg {
  const q = QUANTITIES[quantityKey];
  const thresholds = q.kind === 'threshold'
    ? (nominal != null ? railThresholds(nominal) : { ...(q.recommend.thresholds || {}) })
    : {};
  return {
    id: configId(deviceKey, quantityKey, railKey), deviceKey, deviceLabel, quantityKey, railKey, railLabel,
    dsMode: 'device-field', dsChip: '', dsOffset: 0, dsMask: 255, dsSize: 1,
    periodMs: recommendedPeriod(q.recommend.periodKey).periodMs,
    thresholds, hysteresis: q.recommend.hysteresis ?? 0,
    condition: q.recommend.condition ?? 1, eventKeyId: q.recommend.eventKeyIds[0] || '',
    eventKeyOverrides: {}, enabled: true, expanded: false,
  };
}
function addRail(r: VoltageRail): void {
  if (!selDevice.value || railAdded(r.key)) return;
  cfgs.push(baseCfg(selDevice.value.key, selDevice.value.typeLabel, 'voltage', r.key, r.label, r.nominal));
}
function addAllRails(): void { for (const r of railPalette.value) if (!railAdded(r.key)) addRail(r); }
function addCustomRail(): void {
  const name = customRail.value.trim();
  if (!name || !selDevice.value) return;
  cfgs.push(baseCfg(selDevice.value.key, selDevice.value.typeLabel, 'voltage', name, name, 12));
  customRail.value = '';
}
function addQuantity(qKey: string): void {
  if (!selDevice.value || quantityAdded(qKey)) return;
  cfgs.push(baseCfg(selDevice.value.key, selDevice.value.typeLabel, qKey));
}
function removeCfg(id: string): void {
  const i = cfgs.findIndex((c) => c.id === id);
  if (i >= 0) cfgs.splice(i, 1);
  if (focusedId.value === id) focusedId.value = null;
}

/* ── 生成：折叠所有配置 → CSR 对象（Entity/Component 跨轨复用）+ 传感器关系卡 ── */
function toSpec(c: SensorCfg): AlarmSpec {
  const q = QUANTITIES[c.quantityKey];
  const thresholds = q.kind === 'threshold' ? { ...c.thresholds } : undefined;
  const events = q.kind === 'threshold'
    ? (q.recommend.events || []).map((ev) => ({ ...ev, eventKeyId: c.eventKeyOverrides[ev.suffix] || ev.eventKeyId }))
    : undefined;
  return {
    boardName: boardName.value, deviceKey: c.deviceKey, deviceLabel: c.deviceLabel, quantityKey: c.quantityKey,
    railKey: c.railKey, railLabel: c.railLabel, enabled: c.enabled,
    operatorId: q.kind === 'discrete' ? q.recommend.operatorId : 4,
    thresholds, events, hysteresis: q.kind === 'threshold' ? c.hysteresis : undefined,
    condition: q.kind === 'discrete' ? c.condition : undefined,
    eventKeyId: q.kind === 'discrete' ? c.eventKeyId : undefined,
    dataSource: c.dsMode === 'scanner'
      ? { mode: 'scanner', scanner: { chip: c.dsChip, offset: c.dsOffset, size: c.dsSize, mask: c.dsMask, periodMs: c.periodMs } }
      : { mode: 'device-field', field: q.readingField },
  };
}
const generated = computed(() => {
  const acc: Record<string, unknown> = {};
  const cards: { cfg: SensorCfg; sensor: GeneratedSensor; warnings: string[] }[] = [];
  for (const c of cfgs) {
    const res = generateAlarmObjects({ Objects: acc }, toSpec(c));
    Object.assign(acc, res.objects);
    if (res.sensor) cards.push({ cfg: c, sensor: res.sensor, warnings: res.warnings });
  }
  return { objects: acc, cards };
});
const boardObjects = computed(() => generated.value.objects);
const objectsJson = computed(() => JSON.stringify(boardObjects.value, null, 2));
const eventCount = computed(() => Object.keys(boardObjects.value).filter((k) => k.startsWith('Event_')).length);
const sensorCount = computed(() => generated.value.cards.length);

/* 门限档次序（渲染用） */
const THRESHOLD_ORDER = ['UpperNonrecoverable', 'UpperCritical', 'UpperNoncritical', 'LowerNoncritical', 'LowerCritical'];
const ZH: Record<string, string> = {
  UpperNoncritical: '预警(上)', UpperCritical: '严重(上)', UpperNonrecoverable: '不可恢复(上)',
  LowerNoncritical: '预警(下)', LowerCritical: '严重(下)',
};
function activeThresholdKeys(c: SensorCfg): string[] {
  return THRESHOLD_ORDER.filter((k) => c.thresholds[k] != null);
}
function isThreshold(c: SensorCfg): boolean { return QUANTITIES[c.quantityKey].kind === 'threshold'; }
function unitOf(c: SensorCfg): string { return QUANTITIES[c.quantityKey].unitLabel || ''; }
function recoThreshold(c: SensorCfg, k: string): number | undefined {
  return (QUANTITIES[c.quantityKey].recommend.thresholds as Record<string, number> | undefined)?.[k];
}
function operatorDesc(id: number): string { return OPERATORS.find((o) => o.id === id)?.desc || ''; }

// 数据源已接（器件读数默认已接；寄存器读需填 Chip 才算接上）
function dsResolved(c: SensorCfg): boolean { return c.dsMode === 'device-field' || !!c.dsChip.trim(); }
// 同一监控对象下挂了几个传感器（表达「一个对象 → 多个传感器」的真实 1:N）
function sensorsOnObject(componentKey: string): number {
  return generated.value.cards.filter((e) => e.sensor.componentKey === componentKey).length;
}

const copied = ref(false);
function copyAll(): void {
  navigator.clipboard?.writeText(objectsJson.value).then(() => {
    copied.value = true; window.setTimeout(() => { copied.value = false; }, 1500);
  });
}
const showJson = ref(false);
</script>

<template>
  <div class="alarm-view">
    <div class="ctx-banner">
      <span class="ctx-tag">来自拓扑</span>
      <span class="ctx-src">{{ source || boardName }}</span>
      <span class="ctx-sub">配一条链路只需：选监控对象 → 定门限；数据源 / 扫描 / 掩码自动生成并隐藏</span>
    </div>

    <!-- 关系说明：可见只有三段，读取器概念收进「数据源」 -->
    <div class="rel-legend">
      <span class="rl-node">监控对象<i>CPU / 内存…（Entity + Component）</i></span>
      <span class="rl-arrow">→</span>
      <span class="rl-node">传感器<i>量 + 门限（Threshold / Discrete）</i></span>
      <span class="rl-arrow">→</span>
      <span class="rl-node">事件<i>告警（Event · 可多条）</i></span>
      <span class="rl-sep">·</span>
      <span class="rl-hide">「数据源」一行已包住 Scanner / Accessor，默认不用管</span>
    </div>

    <!-- 监控对象（器件） -->
    <div class="dev-row">
      <button
        v-for="d in devices" :key="d.key"
        class="dev-chip" :class="{ active: selDevice?.key === d.key }"
        @click="selDeviceKey = d.key"
      >
        <span class="dev-type">{{ d.typeLabel }}</span>
        <span class="dev-key">{{ d.key }}</span>
      </button>
    </div>

    <!-- 添加区：电压域→电压轨；其它→监控量 -->
    <div v-if="selDevice" class="add-panel">
      <div class="add-title">
        为 <b>{{ selDevice.key }}</b> 添加传感器
        <span class="i" :title="isVolt ? '一个电压域含多条电压轨，每条轨=一个电压传感器，各自产出过压/欠压多条告警。' : '一个监控量=一个传感器；门限量按档位产出多条告警。'">i</span>
      </div>

      <template v-if="isVolt">
        <div class="rail-palette">
          <button v-for="r in railPalette" :key="r.key" class="add-chip" :class="{ used: railAdded(r.key) }" :disabled="railAdded(r.key)" @click="addRail(r)">
            <span>{{ r.label }}</span><span class="rail-nom">{{ r.nominal }}V</span>
          </button>
          <button class="add-chip all" @click="addAllRails">＋ 全部添加</button>
        </div>
        <div class="rail-custom">
          <input v-model="customRail" class="num wide" placeholder="自定义轨名，如 PVDDQ_ABCD" @keyup.enter="addCustomRail" />
          <button class="btn-ghost" @click="addCustomRail">添加</button>
        </div>
      </template>

      <div v-else class="rail-palette">
        <button v-for="qk in selDevice.quantities" :key="qk" class="add-chip" :class="{ used: quantityAdded(qk) }" :disabled="quantityAdded(qk)" @click="addQuantity(qk)">
          <span>{{ QUANTITIES[qk].label }}</span>
          <span class="rail-nom">{{ QUANTITIES[qk].kind === 'threshold' ? '门限量' : '状态量' }}</span>
        </button>
      </div>
    </div>

    <!-- 流水线：监控对象 ▸ 传感器（含数据源）▸ 事件 -->
    <div class="flow-list">
      <div v-if="!generated.cards.length" class="empty">还没有告警链路。上方选监控对象、点电压轨 / 监控量即可添加一条。</div>

      <div
        v-for="entry in generated.cards" :key="entry.sensor.configId"
        class="flow-row"
        :class="[entry.sensor.kind, { focused: focusedId === entry.sensor.configId, dimmed: focusedId !== null && focusedId !== entry.sensor.configId }]"
      >
        <!-- ① 监控对象（点击聚焦本条链路 / 再点取消） -->
        <div class="fnode obj clickable" role="button" tabindex="0"
             :title="focusedId === entry.sensor.configId ? '取消聚焦，显示全部链路' : '聚焦这一条链路，其余淡出'"
             @click="toggleFocus(entry.sensor.configId)" @keyup.enter="toggleFocus(entry.sensor.configId)">
          <div class="fn-cap">监控对象<span v-if="focusedId === entry.sensor.configId" class="fn-focus-dot">● 聚焦</span></div>
          <div class="fn-card">
            <div class="fn-r1">
              <svg class="fn-ic" viewBox="0 0 24 24"><path d="M9 3h6v2h3a1 1 0 0 1 1 1v3h2v2h-2v2h2v2h-2v3a1 1 0 0 1-1 1h-3v2H9v-2H6a1 1 0 0 1-1-1v-3H3v-2h2v-2H3V9h2V6a1 1 0 0 1 1-1h3V3zm0 5v8h6V8H9z"/></svg>
              <span class="fn-title">{{ entry.sensor.entityName }}</span>
            </div>
            <div class="fn-sub">Component · Entity #{{ entry.sensor.entityId }}</div>
            <div v-if="sensorsOnObject(entry.sensor.componentKey) > 1" class="fn-sub reuse">该对象下 {{ sensorsOnObject(entry.sensor.componentKey) }} 个传感器</div>
          </div>
        </div>

        <div class="fconn"><svg viewBox="0 0 40 12"><path d="M0 6h34M30 2l6 4-6 4"/></svg></div>

        <!-- ② 传感器（重点：量 + 门限 + 数据源徽章） -->
        <div class="fnode sensor">
          <div class="fn-cap">
            传感器 · {{ entry.sensor.kind === 'threshold' ? '门限' : '状态' }}
            <button class="fn-del" title="删除该链路及其告警" @click="removeCfg(entry.cfg.id)">✕</button>
          </div>
          <div class="fn-card accent">
            <div class="fn-r1">
              <svg class="fn-ic" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
              <span class="fn-title">{{ entry.cfg.railLabel || QUANTITIES[entry.cfg.quantityKey].label }}</span>
              <span class="fn-tag">{{ entry.sensor.kind === 'threshold' ? 'ThresholdSensor' : 'DiscreteSensor' }}</span>
            </div>

            <!-- 门限量：内联门限档（每档 → 一条告警） -->
            <div v-if="isThreshold(entry.cfg)" class="fn-thr">
              <div v-for="k in THRESHOLD_ORDER" :key="k" class="thr-pill" :class="{ off: entry.cfg.thresholds[k] == null }" :title="ZH[k] + ' 门限，设值即生成对应告警，Event 触发值引用此档'">
                <span class="thr-l">{{ ZH[k] }}</span>
                <input v-model.number="entry.cfg.thresholds[k]" type="number" class="thr-in" :placeholder="recoThreshold(entry.cfg, k) != null ? '关' : '—'" />
                <span v-if="recoThreshold(entry.cfg, k) != null" class="thr-reco">荐{{ recoThreshold(entry.cfg, k) }}</span>
              </div>
              <span class="thr-unit">{{ unitOf(entry.cfg) }}</span>
            </div>
            <!-- 离散量：方向（只读）+ 触发值 + 告警项 -->
            <div v-else class="fn-disc">
              <span class="disc-dir" title="读数与触发值的比较方式（自动，无需配置）">{{ operatorDesc(QUANTITIES[entry.cfg.quantityKey].recommend.operatorId) }}</span>
              <label class="disc-f"><span>触发值</span><input v-model.number="entry.cfg.condition" type="number" class="thr-in" /><i class="thr-reco">荐{{ QUANTITIES[entry.cfg.quantityKey].recommend.condition ?? 1 }}</i></label>
              <label class="disc-f"><span>告警项</span>
                <select v-model="entry.cfg.eventKeyId" class="disc-sel">
                  <option v-for="o in QUANTITIES[entry.cfg.quantityKey].recommend.eventKeyIds" :key="o" :value="o">{{ o }}{{ QUANTITIES[entry.cfg.quantityKey].recommend.eventKeyIds[0] === o ? '（推荐）' : '' }}</option>
                </select>
              </label>
            </div>

            <!-- 数据源徽章：Scanner / Accessor 折进这一行 -->
            <div class="fn-ds" :class="{ warn: !dsResolved(entry.cfg) }">
              <span class="ds-k">数据源</span>
              <span class="ds-v">{{ entry.sensor.dataSource.label }}</span>
              <span class="ds-state" :class="dsResolved(entry.cfg) ? 'ok' : 'warn'">{{ dsResolved(entry.cfg) ? '已接' : '未接' }}</span>
              <button class="ds-more" @click="entry.cfg.expanded = !entry.cfg.expanded">{{ entry.cfg.expanded ? '收起' : '展开更多配置' }}</button>
            </div>
            <div class="fn-ds-hint">扫描周期 / 单位 / 掩码由数据源自动生成，读取器概念已隐藏</div>

            <!-- 展开更多配置：原始读法 / 采集周期 / 迟滞（默认折叠） -->
            <div v-if="entry.cfg.expanded" class="fn-more">
              <div class="mf">
                <label>读法</label>
                <select v-model="entry.cfg.dsMode" class="disc-sel wide">
                  <option value="device-field">器件读数 · {{ entry.cfg.deviceKey }}.{{ QUANTITIES[entry.cfg.quantityKey].readingField }}（推荐 · 已接）</option>
                  <option value="scanner">从寄存器周期读（高级 · 需选硬件信号）</option>
                </select>
              </div>
              <div class="mf-desc">{{ entry.cfg.dsMode === 'scanner' ? DATA_SOURCE_NOTES.scanner : DATA_SOURCE_NOTES.deviceField }}</div>
              <template v-if="entry.cfg.dsMode === 'scanner'">
                <div class="scan-grid">
                  <label>硬件信号(Chip)<input v-model="entry.cfg.dsChip" class="thr-in w" placeholder="Smc_..." /></label>
                  <label>偏移(Offset)<input v-model.number="entry.cfg.dsOffset" type="number" class="thr-in w" /></label>
                  <label>字节(Size)<input v-model.number="entry.cfg.dsSize" type="number" class="thr-in w" /></label>
                  <label>掩码(Mask)<input v-model.number="entry.cfg.dsMask" type="number" class="thr-in w" /></label>
                </div>
                <div class="mf">
                  <label>采集周期</label>
                  <select v-model.number="entry.cfg.periodMs" class="disc-sel wide" title="来自 README §6 扫描周期分类，选类别自动带出周期">
                    <option v-for="ct in PERIOD_CATEGORIES" :key="ct.periodMs + ct.label" :value="ct.periodMs">{{ ct.label }} · {{ ct.periodMs }}ms{{ recommendedPeriod(QUANTITIES[entry.cfg.quantityKey].recommend.periodKey).periodMs === ct.periodMs ? '（推荐）' : '' }}</option>
                  </select>
                </div>
              </template>
              <div v-if="isThreshold(entry.cfg)" class="mf">
                <label>迟滞</label>
                <input v-model.number="entry.cfg.hysteresis" type="number" class="thr-in w" />
                <span class="mf-desc">推荐 {{ QUANTITIES[entry.cfg.quantityKey].recommend.hysteresis ?? 2 }} · 回差防门限抖动反复告警</span>
              </div>
            </div>

            <div v-for="w in entry.warnings" :key="w" class="fn-warn">{{ w }}</div>
          </div>
        </div>

        <div class="fconn"><svg viewBox="0 0 40 12"><path d="M0 6h34M30 2l6 4-6 4"/></svg></div>

        <!-- ③ 事件（一个传感器可多条告警） -->
        <div class="fnode events">
          <div class="fn-cap">事件 · {{ entry.sensor.events.length }} 条</div>
          <div class="ev-stack">
            <div v-if="!entry.sensor.events.length" class="ev-empty">未设门限 · 暂无告警</div>
            <div v-for="ev in entry.sensor.events" :key="ev.key" class="ev-chip" :class="ev.severity">
              <svg class="fn-ic sm" viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6c0 4-1.5 5.5-2.5 6.5A1 1 0 0 0 4 16h16a1 1 0 0 0 .7-1.7C19.5 13.5 18 12 18 8a6 6 0 0 0-6-6zm0 20a3 3 0 0 0 2.8-2H9.2a3 3 0 0 0 2.8 2z"/></svg>
              <span class="ev-l">{{ ev.label }}</span>
              <span class="ev-cond">{{ ev.operator }} {{ ev.conditionLabel }}</span>
              <span class="ev-key" :title="'告警字典条目 EventKeyId'">{{ ev.eventKeyId }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 板卡级汇总 -->
    <div v-if="sensorCount" class="board-summary">
      <div class="bs-head">
        <span>{{ sensorCount }} 个传感器 · {{ eventCount }} 条告警 → 将写入 <b>{{ boardName }}.sr</b></span>
        <div class="bs-actions">
          <button v-if="focusedId" class="btn-ghost focus-clear" @click="focusedId = null">← 显示全部链路</button>
          <button class="btn-ghost" @click="showJson = !showJson">{{ showJson ? '隐藏' : '查看' }} CSR 对象</button>
          <button class="btn-ghost" @click="copyAll">{{ copied ? '已复制' : '复制全部' }}</button>
        </div>
      </div>
      <pre v-if="showJson" class="bs-json">{{ objectsJson }}</pre>
    </div>
  </div>
</template>

<style scoped>
.alarm-view { padding: 12px 14px; color: var(--foreground); font-size: 13px; }

.ctx-banner {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 8px 10px; margin-bottom: 10px; border-radius: 8px;
  background: color-mix(in srgb, var(--warning, #f59e0b) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--warning, #f59e0b) 30%, transparent);
}
.ctx-tag { font-size: 11px; padding: 1px 8px; border-radius: 999px; background: var(--warning, #f59e0b); color: #1a1a1a; }
.ctx-src { font-weight: 600; }
.ctx-sub { font-size: 11px; color: var(--foreground-secondary); }

.rel-legend { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 8px 10px; margin-bottom: 12px; border-radius: 8px; background: var(--surface-1, #12141c); border: 1px solid var(--border-subtle, #23263a); font-size: 11px; }
.rl-node { display: inline-flex; flex-direction: column; line-height: 1.25; padding: 3px 8px; border-radius: 6px; background: var(--surface-3, #1c1f2a); color: var(--foreground); }
.rl-node.ds { background: color-mix(in srgb, var(--primary) 16%, transparent); }
.rl-node i { font-style: normal; font-size: 9px; color: var(--foreground-muted); }
.rl-arrow { color: var(--foreground-muted); }
.rl-sep { color: var(--border-subtle, #23263a); padding: 0 2px; }

.dev-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.dev-chip { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: var(--surface-2, #16181f); border: 1px solid var(--border-subtle, #23263a); }
.dev-chip.active { border-color: color-mix(in srgb, var(--primary) 55%, transparent); background: color-mix(in srgb, var(--primary) 12%, transparent); }
.dev-type { font-size: 10px; color: var(--foreground-muted); }
.dev-key { font-size: 12px; }

.add-panel { padding: 10px; margin-bottom: 12px; border-radius: 10px; background: var(--surface-1, #12141c); border: 1px solid var(--border-subtle, #23263a); }
.add-title { font-size: 12px; color: var(--foreground-secondary); margin-bottom: 8px; }
.rail-palette { display: flex; flex-wrap: wrap; gap: 8px; }
.add-chip { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 999px; background: var(--surface-3, #1c1f2a); border: 1px solid var(--border-subtle, #23263a); font-size: 12px; }
.add-chip.all { color: var(--primary); border-color: color-mix(in srgb, var(--primary) 40%, transparent); }
.add-chip.used { opacity: 0.4; cursor: default; }
.rail-nom { font-size: 10px; color: var(--foreground-muted); }
.rail-custom { display: flex; gap: 8px; margin-top: 10px; }

.sensor-list { display: flex; flex-direction: column; gap: 10px; }
.empty { padding: 24px; text-align: center; color: var(--foreground-muted); font-size: 12px; border: 1px dashed var(--border-subtle, #23263a); border-radius: 10px; }

.sensor-card { border: 1px solid var(--border-subtle, #23263a); border-radius: 10px; background: var(--surface-1, #12141c); overflow: hidden; }
.sc-head { display: flex; align-items: center; gap: 8px; padding: 9px 12px; cursor: pointer; }
.sc-kind { font-size: 10px; padding: 1px 7px; border-radius: 999px; }
.sc-kind.threshold { background: color-mix(in srgb, var(--primary) 20%, transparent); color: var(--primary); }
.sc-kind.discrete { background: color-mix(in srgb, var(--warning, #f59e0b) 20%, transparent); color: var(--warning, #f59e0b); }
.sc-name { font-weight: 600; }
.sc-entity { font-size: 11px; color: var(--foreground-secondary); padding: 1px 7px; border-radius: 999px; background: var(--surface-3, #1c1f2a); }
.sc-evn { font-size: 11px; color: var(--success, #34d399); }
.sc-del { all: unset; cursor: pointer; margin-left: auto; color: var(--foreground-muted); font-size: 12px; padding: 0 4px; }
.sc-del:hover { color: var(--danger, #f87171); }
.sc-fold { font-size: 11px; color: var(--primary); }

.sc-chain { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 0 12px 8px; font-size: 10px; color: var(--foreground-muted); font-family: ui-monospace, monospace; }
.ch-item { padding: 2px 6px; border-radius: 5px; background: var(--surface-2, #16181f); }
.ch-item.ds.scanner { color: var(--primary); }
.ch-item b { font-weight: 600; }
.ch-arrow { color: var(--border-subtle, #35384a); }

.ev-rows { display: flex; flex-direction: column; gap: 4px; padding: 0 12px 10px; }
.ev-row { display: flex; align-items: center; gap: 8px; font-size: 11px; padding: 4px 8px; border-radius: 6px; background: var(--surface-2, #16181f); }
.ev-sev { padding: 1px 7px; border-radius: 999px; font-size: 10px; }
.ev-sev.Minor { background: color-mix(in srgb, var(--warning, #f59e0b) 18%, transparent); color: var(--warning, #f59e0b); }
.ev-sev.Major { background: color-mix(in srgb, #fb923c 20%, transparent); color: #fb923c; }
.ev-sev.Critical { background: color-mix(in srgb, var(--danger, #f87171) 22%, transparent); color: var(--danger, #f87171); }
.ev-op { color: var(--foreground-secondary); }
.ev-key { margin-left: auto; font-family: ui-monospace, monospace; color: var(--foreground-muted); }

.gen-warn { font-size: 11px; color: var(--warning, #f59e0b); padding: 0 12px 8px; }

.sc-body { padding: 8px 12px 14px; border-top: 1px solid var(--border-subtle, #23263a); }
.fld { display: flex; gap: 10px; margin-bottom: 11px; align-items: flex-start; }
.fld.inline { margin-top: 8px; margin-bottom: 0; }
.fld > label { width: 74px; flex-shrink: 0; font-size: 12px; color: var(--foreground-secondary); padding-top: 6px; display: flex; gap: 4px; align-items: center; }
.fld-ctl { flex: 1; min-width: 0; }
.sel { width: 100%; padding: 6px 8px; background: var(--surface-1, #12141c); border: 1px solid var(--border-subtle, #23263a); color: var(--foreground); border-radius: 6px; }
.sel-desc { font-size: 11px; color: var(--foreground-muted); margin-top: 4px; }
.accessor-note { color: var(--foreground-secondary); }
.num { padding: 5px 8px; background: var(--surface-1, #12141c); border: 1px solid var(--border-subtle, #23263a); color: var(--foreground); border-radius: 6px; width: 100px; }
.num.wide { width: 220px; }
.i { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; border-radius: 999px; background: var(--surface-3, #1c1f2a); color: var(--foreground-muted); font-size: 10px; font-style: italic; cursor: help; }

.scan-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.scan-grid label { display: flex; flex-direction: column; gap: 3px; font-size: 11px; color: var(--foreground-muted); }
.scan-grid .num { width: 84px; }

.thresholds { display: flex; gap: 10px; flex-wrap: wrap; }
.th-item { display: flex; flex-direction: column; gap: 3px; }
.th-item.off { opacity: 0.5; }
.th-lbl { font-size: 11px; color: var(--foreground-muted); }
.th-reco { font-size: 10px; color: var(--foreground-muted); }

.btn-ghost { all: unset; cursor: pointer; padding: 6px 12px; border-radius: 999px; background: var(--surface-3, #1c1f2a); color: var(--foreground-secondary); font-size: 12px; }

.board-summary { margin-top: 14px; border-top: 1px solid var(--border-subtle, #23263a); padding-top: 12px; }
.bs-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 12px; color: var(--foreground-secondary); margin-bottom: 8px; }
.bs-actions { display: flex; gap: 8px; }
.bs-json { max-height: 260px; overflow: auto; font-size: 11px; background: var(--surface-1, #12141c); border: 1px solid var(--border-subtle, #23263a); border-radius: 8px; padding: 10px; margin: 0; }

/* ── 关系说明补充 ── */
.rl-hide { font-size: 10px; color: var(--foreground-muted); }

/* ── 流水线：监控对象 ▸ 传感器 ▸ 事件 ── */
.flow-list { display: flex; flex-direction: column; gap: 14px; }
.flow-row { display: flex; align-items: stretch; gap: 4px; flex-wrap: wrap; padding: 10px; border-radius: 12px; background: var(--surface-1, #12141c); border: 1px solid var(--border-subtle, #23263a); transition: opacity .15s, border-color .15s, box-shadow .15s; }
.flow-row.focused { border-color: color-mix(in srgb, var(--primary) 60%, transparent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary) 45%, transparent); }
.flow-row.dimmed { opacity: .42; }
.flow-row.dimmed:hover { opacity: .7; }

.fnode.obj.clickable { cursor: pointer; border-radius: 12px; }
.fnode.obj.clickable:hover .fn-card { border-color: color-mix(in srgb, var(--primary) 45%, transparent); }
.fn-focus-dot { margin-left: 6px; color: var(--primary); font-size: 9px; }

.fnode { display: flex; flex-direction: column; gap: 5px; min-width: 148px; }
.fnode.sensor { flex: 1; min-width: 244px; }
.fnode.events { min-width: 186px; }
.fn-cap { display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--foreground-muted); letter-spacing: .02em; }
.fn-del { all: unset; cursor: pointer; margin-left: auto; color: var(--foreground-muted); font-size: 11px; padding: 0 4px; }
.fn-del:hover { color: var(--danger, #f87171); }

.fn-card { flex: 1; display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 10px; background: var(--surface-2, #16181f); border: 1px solid var(--border-subtle, #23263a); }
.fn-card.accent { border-color: color-mix(in srgb, var(--primary) 55%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary) 26%, transparent); }
.flow-row.discrete .fn-card.accent { border-color: color-mix(in srgb, var(--warning, #f59e0b) 55%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--warning, #f59e0b) 24%, transparent); }

.fn-r1 { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.fn-ic { width: 16px; height: 16px; flex: none; fill: currentColor; }
.fn-ic.sm { width: 13px; height: 13px; }
.fnode.obj .fn-ic { color: var(--foreground-secondary); }
.fnode.sensor .fn-ic { color: var(--primary); }
.flow-row.discrete .fnode.sensor .fn-ic { color: var(--warning, #f59e0b); }
.fn-title { font-size: 13px; font-weight: 600; }
.fn-sub { font-size: 11px; color: var(--foreground-muted); }
.fn-sub.reuse { color: var(--foreground-secondary); }
.fn-tag { font-size: 9px; color: var(--foreground-muted); border: 1px solid var(--border-subtle, #23263a); border-radius: 999px; padding: 1px 7px; }

.fn-thr { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.thr-pill { display: flex; align-items: center; gap: 4px; padding: 3px 6px; border-radius: 7px; background: var(--surface-1, #12141c); border: 1px solid var(--border-subtle, #23263a); }
.thr-pill.off { opacity: .5; }
.thr-l { font-size: 10px; color: var(--foreground-muted); }
.thr-in { all: unset; width: 40px; text-align: center; font-size: 12px; color: var(--foreground); border-bottom: 1px solid var(--border-subtle, #23263a); }
.thr-in.w { width: 76px; text-align: left; padding: 4px 6px; border: 1px solid var(--border-subtle, #23263a); border-radius: 6px; }
.thr-reco { font-size: 9px; color: var(--primary); font-style: normal; }
.thr-unit { font-size: 11px; color: var(--foreground-muted); }

.fn-disc { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.disc-dir { font-size: 11px; color: var(--foreground-secondary); }
.disc-f { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--foreground-secondary); }
.disc-sel { padding: 4px 6px; border-radius: 6px; font-size: 11px; color: var(--foreground); background: var(--surface-1, #12141c); border: 1px solid var(--border-subtle, #23263a); }
.disc-sel.wide { flex: 1; min-width: 0; }

.fn-ds { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 6px 9px; border-radius: 8px; background: var(--surface-1, #12141c); }
.fn-ds.warn { background: color-mix(in srgb, var(--warning, #f59e0b) 12%, transparent); }
.ds-k { font-size: 10px; color: var(--foreground-muted); }
.ds-v { font-size: 12px; font-weight: 600; }
.ds-state { font-size: 9px; padding: 0 7px; border-radius: 999px; }
.ds-state.ok { color: var(--success, #34d399); border: 1px solid color-mix(in srgb, var(--success, #34d399) 40%, transparent); }
.ds-state.warn { color: var(--warning, #f59e0b); border: 1px solid color-mix(in srgb, var(--warning, #f59e0b) 40%, transparent); }
.ds-more { all: unset; cursor: pointer; margin-left: auto; font-size: 10px; color: var(--primary); }
.fn-ds-hint { font-size: 10px; color: var(--foreground-muted); }

.fn-more { display: flex; flex-direction: column; gap: 8px; padding: 8px 10px; border-radius: 8px; background: var(--surface-1, #12141c); border: 1px dashed var(--border-subtle, #23263a); }
.mf { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.mf > label { flex: none; width: 52px; font-size: 11px; color: var(--foreground-secondary); }
.mf-desc { font-size: 10px; color: var(--foreground-muted); }
.fn-warn { font-size: 11px; color: var(--warning, #f59e0b); }

.fconn { display: flex; align-items: center; padding: 0 2px; }
.fconn svg { width: 34px; height: 12px; overflow: visible; }
.fconn path { fill: none; stroke: color-mix(in srgb, var(--primary) 55%, transparent); stroke-width: 1.5; }

.ev-stack { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.ev-empty { font-size: 11px; color: var(--foreground-muted); padding: 8px; border: 1px dashed var(--border-subtle, #23263a); border-radius: 8px; }
.ev-chip { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 6px 9px; border-radius: 8px; background: var(--surface-2, #16181f); border: 1px solid var(--border-subtle, #23263a); }
.ev-chip .fn-ic { color: var(--foreground-muted); }
.ev-l { font-size: 11px; font-weight: 600; }
.ev-chip.Minor { border-color: color-mix(in srgb, var(--warning, #f59e0b) 35%, transparent); }
.ev-chip.Minor .fn-ic { color: var(--warning, #f59e0b); }
.ev-chip.Major { border-color: color-mix(in srgb, #fb923c 40%, transparent); }
.ev-chip.Major .fn-ic { color: #fb923c; }
.ev-chip.Critical { border-color: color-mix(in srgb, var(--danger, #f87171) 45%, transparent); }
.ev-chip.Critical .fn-ic { color: var(--danger, #f87171); }
.ev-cond { font-size: 10px; color: var(--foreground-secondary); }
.ev-key { width: 100%; font-size: 9px; color: var(--foreground-muted); font-family: ui-monospace, monospace; }
</style>
