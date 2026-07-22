<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useLinkage } from '../composables/useLinkage';
import {
  QUANTITIES, OPERATORS, PERIOD_CATEGORIES, recommendedPeriod,
  devicesForBoardType, isVoltageDomain, voltageRailsForBoard, railThresholds,
  DATA_SOURCE_NOTES, type BoardDevice, type VoltageRail,
} from '../alarm/alarmKnowledge';
import {
  generateAlarmObjects, configId, type AlarmSpec, type GeneratedSensor, type NormalizedEvent,
} from '../alarm/alarmObjectGenerator';
// 共享 per-board store（板卡级/器件级同源）+ 真实 .sr 播种
import { boardAlarm, nextUid, nextEvSeq, type ThrKey, type EvItem, type SensorCfg } from '../alarm/alarmStore';
import { seedCfgsForBoard } from '../alarm/srSeed';

const { state: link, openCodeDoc } = useLinkage();
// scopeDeviceKey：器件级告警时锁定到单个监控器件（隐藏器件切换、流只显示该器件的传感器）
const props = defineProps<{ scopeDeviceKey?: string }>();
const inbound = computed(() => link.inbound.alarm);
const boardType = computed(() => inbound.value?.boardType || 'Unknown');
const boardName = computed(() => inbound.value?.boardName || '当前板卡');
const source = computed(() => inbound.value?.source || '');
const devices = computed<BoardDevice[]>(() => devicesForBoardType(boardType.value));

// 每块板一份 cfgs（存 store）；uid/evSeq 计数器也随板走
const boardKey = computed(() => boardName.value);
const uid = (): string => nextUid(boardKey.value);
const cfgs = computed(() => boardAlarm(boardKey.value).cfgs);
// 器件级 scope：只取该器件的链路（板卡级则全取）
const scopedCfgs = computed(() => props.scopeDeviceKey ? cfgs.value.filter((c) => c.deviceKey === props.scopeDeviceKey) : cfgs.value);

/* 默认折叠，只看流的全貌；点传感器卡展开它的配置（单展开）*/
const expandedId = ref<string | null>(null);
function toggleExpand(id: string): void { expandedId.value = expandedId.value === id ? null : id; }
// 换板卡：各板 cfgs 独立存于 store（不清空）；首次进入用真实 .sr 播种
watch(boardKey, (key) => {
  expandedId.value = null;
  const st = boardAlarm(key);
  if (!st.loaded) {
    st.loaded = true;
    const seed = seedCfgsForBoard(key);
    if (seed.cfgs.length) st.cfgs.push(...seed.cfgs);
  }
}, { immediate: true });

const selDeviceKey = ref('');
const selDevice = computed<BoardDevice | null>(() =>
  devices.value.find((d) => d.key === selDeviceKey.value) || devices.value[0] || null);
watch(devices, (d) => { if (d.length && !d.some((x) => x.key === selDeviceKey.value)) selDeviceKey.value = d[0].key; }, { immediate: true });
watch(() => props.scopeDeviceKey, (k) => { if (k) selDeviceKey.value = k; }, { immediate: true });

const isVolt = computed(() => selDevice.value ? isVoltageDomain(selDevice.value.key) : false);
const railPalette = computed<VoltageRail[]>(() => voltageRailsForBoard(boardType.value));
function railAdded(railKey: string): boolean {
  return cfgs.value.some((c) => c.deviceKey === selDevice.value?.key && c.railKey === railKey);
}
function quantityAdded(qKey: string): boolean {
  return cfgs.value.some((c) => c.deviceKey === selDevice.value?.key && c.quantityKey === qKey && !c.railKey);
}
const customRail = ref('');

const THRESHOLD_ORDER: ThrKey[] = ['UpperNonrecoverable', 'UpperCritical', 'UpperNoncritical', 'LowerNoncritical', 'LowerCritical'];
const ZH: Record<string, string> = {
  UpperNoncritical: '预警(上)', UpperCritical: '严重(上)', UpperNonrecoverable: '不可恢复(上)',
  LowerNoncritical: '预警(下)', LowerCritical: '严重(下)',
};
const SEVERITIES: { v: EvItem['severity']; label: string; desc: string }[] = [
  { v: 'Minor', label: '预警 Minor', desc: '需要关注，业务未中断。' },
  { v: 'Major', label: '严重 Major', desc: '影响业务，需尽快处理。' },
  { v: 'Critical', label: '致命 Critical', desc: '业务中断或硬件损坏风险。' },
];

function initEvents(quantityKey: string): EvItem[] {
  const q = QUANTITIES[quantityKey];
  if (q.kind === 'threshold') {
    return (q.recommend.events || []).map((t) => ({
      id: uid(), suffix: t.suffix, label: t.label, severity: t.severity,
      operatorId: t.operatorId, levelField: t.levelField, condition: 1,
      eventKeyId: t.eventKeyId, enabled: true,
    }));
  }
  return [{
    id: uid(), suffix: '', label: '状态命中', severity: 'Major',
    operatorId: q.recommend.operatorId, condition: q.recommend.condition ?? 1,
    eventKeyId: q.recommend.eventKeyIds[0] || '', enabled: true,
  }];
}
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
    events: initEvents(quantityKey), enabled: true,
  };
}
function addRail(r: VoltageRail): void {
  if (!selDevice.value || railAdded(r.key)) return;
  cfgs.value.push(baseCfg(selDevice.value.key, selDevice.value.typeLabel, 'voltage', r.key, r.label, r.nominal));
}
function addAllRails(): void { for (const r of railPalette.value) if (!railAdded(r.key)) addRail(r); }
function addCustomRail(): void {
  const name = customRail.value.trim();
  if (!name || !selDevice.value) return;
  cfgs.value.push(baseCfg(selDevice.value.key, selDevice.value.typeLabel, 'voltage', name, name, 12));
  customRail.value = '';
}
function addQuantity(qKey: string): void {
  if (!selDevice.value || quantityAdded(qKey)) return;
  const c = baseCfg(selDevice.value.key, selDevice.value.typeLabel, qKey);
  cfgs.value.push(c);
  expandedId.value = c.id;
}
function removeCfg(id: string): void {
  const i = cfgs.value.findIndex((c) => c.id === id);
  if (i >= 0) cfgs.value.splice(i, 1);
  if (expandedId.value === id) expandedId.value = null;
}

/* 事件增删（一个器件挂多条事件）*/
function addEvent(c: SensorCfg): void {
  const q = QUANTITIES[c.quantityKey];
  if (q.kind === 'threshold') {
    const used = new Set(c.events.map((e) => e.levelField));
    const lf = THRESHOLD_ORDER.find((k) => c.thresholds[k] != null && !used.has(k))
      || THRESHOLD_ORDER.find((k) => !used.has(k)) || 'UpperCritical';
    c.events.push({
      id: uid(), suffix: `X${nextEvSeq(boardKey.value)}`, label: ZH[lf], severity: 'Major',
      operatorId: lf.startsWith('Upper') ? 4 : 1, levelField: lf, condition: 1,
      eventKeyId: keyOptions(c)[0] || '', enabled: true,
    });
  } else {
    c.events.push({
      id: uid(), suffix: `X${nextEvSeq(boardKey.value)}`, label: '状态命中', severity: 'Major',
      operatorId: q.recommend.operatorId, condition: q.recommend.condition ?? 1,
      eventKeyId: keyOptions(c)[0] || '', enabled: true,
    });
  }
}
function removeEvent(c: SensorCfg, id: string): void {
  const i = c.events.findIndex((e) => e.id === id);
  if (i >= 0) c.events.splice(i, 1);
}
function syncThrEvent(ev: EvItem): void {
  if (!ev.levelField) return;
  ev.operatorId = ev.levelField.startsWith('Upper') ? 4 : 1;
  ev.label = ZH[ev.levelField];
}
function keyOptions(c: SensorCfg): string[] {
  const q = QUANTITIES[c.quantityKey];
  const set = new Set<string>(q.recommend.eventKeyIds);
  (q.recommend.events || []).forEach((t) => set.add(t.eventKeyId));
  c.events.forEach((e) => { if (e.eventKeyId) set.add(e.eventKeyId); });
  return [...set];
}
function ensureThreshold(c: SensorCfg, lf: ThrKey): void {
  const reco = (QUANTITIES[c.quantityKey].recommend.thresholds as Record<string, number> | undefined)?.[lf];
  c.thresholds[lf] = reco != null ? reco : 0;
}

/* 生成 CSR 对象 */
function toSpec(c: SensorCfg): AlarmSpec {
  const q = QUANTITIES[c.quantityKey];
  const thresholds = q.kind === 'threshold' ? { ...c.thresholds } : undefined;
  const eventList: NormalizedEvent[] = c.events.filter((e) => e.enabled).map((e) => ({
    suffix: e.suffix, eventKeyId: e.eventKeyId, operatorId: e.operatorId,
    label: e.label, severity: e.severity, levelField: e.levelField,
    condition: e.levelField ? undefined : e.condition,
  }));
  return {
    boardName: boardName.value, deviceKey: c.deviceKey, deviceLabel: c.deviceLabel, quantityKey: c.quantityKey,
    railKey: c.railKey, railLabel: c.railLabel, enabled: c.enabled,
    operatorId: q.recommend.operatorId, thresholds, eventList,
    hysteresis: q.kind === 'threshold' ? c.hysteresis : undefined,
    dataSource: c.dsMode === 'scanner'
      ? { mode: 'scanner', scanner: { chip: c.dsChip, offset: c.dsOffset, size: c.dsSize, mask: c.dsMask, periodMs: c.periodMs } }
      : { mode: 'device-field', field: q.readingField },
  };
}
interface Entry { cfg: SensorCfg; sensor: GeneratedSensor; warnings: string[]; }
const generated = computed(() => {
  const acc: Record<string, unknown> = {};
  const cards: Entry[] = [];
  for (const c of scopedCfgs.value) {
    const res = generateAlarmObjects({ Objects: acc }, toSpec(c));
    Object.assign(acc, res.objects);
    if (res.sensor) cards.push({ cfg: c, sensor: res.sensor, warnings: res.warnings });
  }
  return { objects: acc, cards };
});

/* 按监控对象(Component) 归组 → 一个对象节点扇出多条传感器分支，不再重复对象 */
interface ObjGroup { componentKey: string; entityName: string; entityId: number; sensors: Entry[]; }
const objGroups = computed<ObjGroup[]>(() => {
  const map = new Map<string, ObjGroup>();
  for (const e of generated.value.cards) {
    let g = map.get(e.sensor.componentKey);
    if (!g) { g = { componentKey: e.sensor.componentKey, entityName: e.sensor.entityName, entityId: e.sensor.entityId, sensors: [] }; map.set(e.sensor.componentKey, g); }
    g.sensors.push(e);
  }
  return [...map.values()];
});

const boardObjects = computed(() => generated.value.objects);
const objectsJson = computed(() => JSON.stringify(boardObjects.value, null, 2));
const eventCount = computed(() => Object.keys(boardObjects.value).filter((k) => k.startsWith('Event_')).length);
const sensorCount = computed(() => generated.value.cards.length);

const openEntry = computed<Entry | null>(() => generated.value.cards.find((e) => e.sensor.configId === expandedId.value) || null);
const openCfg = computed<SensorCfg | null>(() => openEntry.value?.cfg || null);

function isThreshold(c: SensorCfg): boolean { return QUANTITIES[c.quantityKey].kind === 'threshold'; }
function unitOf(c: SensorCfg): string { return QUANTITIES[c.quantityKey].unitLabel || ''; }
function recoThreshold(c: SensorCfg, k: string): number | undefined {
  return (QUANTITIES[c.quantityKey].recommend.thresholds as Record<string, number> | undefined)?.[k];
}
function operatorSym(id: number): string { return OPERATORS.find((o) => o.id === id)?.symbol || ''; }
function operatorDesc(id: number): string { return OPERATORS.find((o) => o.id === id)?.desc || ''; }
function dsResolved(c: SensorCfg): boolean { return c.dsMode === 'device-field' || !!c.dsChip.trim(); }
function sensorLabel(e: Entry): string { return e.cfg.railLabel || QUANTITIES[e.cfg.quantityKey].label; }
function thrValue(c: SensorCfg, lf?: ThrKey): number | undefined { return lf ? c.thresholds[lf] : undefined; }
function objTip(g: ObjGroup): string {
  return `自动创建 Entity_${g.entityName}(Id #${g.entityId}) 与 Component_${g.entityName}；`
    + `Component.Instance⟵器件.SlotID、Component.Name⟵器件.DeviceName、Sensor.EntityId⟵Entity.Id、Event.Component⟶Component，均自动引用。`;
}

const copied = ref(false);
function copyAll(): void {
  navigator.clipboard?.writeText(objectsJson.value).then(() => {
    copied.value = true; window.setTimeout(() => { copied.value = false; }, 1500);
  });
}
const showJson = ref(false);
// 在右侧代码分屏打开本板对应的 .sr（当前用生成的 CSR 对象作内容）
function openInCode(): void { openCodeDoc(`${boardName.value}.sr`, objectsJson.value); }

/* 快速新增：把「监控对象 + 添加区」收进「＋ 新增」浮窗（teleport 到 body，避开面板 overflow 裁剪）*/
const showAdd = ref(false);
const addBtnRef = ref<HTMLElement | null>(null);
const addPopStyle = ref<Record<string, string>>({});
function toggleAdd(): void {
  showAdd.value = !showAdd.value;
  if (showAdd.value) nextTick(() => {
    const r = addBtnRef.value?.getBoundingClientRect();
    if (r) addPopStyle.value = { top: `${r.bottom + 6}px`, right: `${Math.max(8, window.innerWidth - r.right)}px` };
  });
}

/* ── 上下游连线（监控对象 → 传感器 → 事件）+ hover 高亮整条链路 ──
   连线用实测节点位置画 SVG 贝塞尔，随布局/展开/缩放重算；hover 传感器点亮其上下游。*/
const blockEls = new Map<string, HTMLElement>();
function setBlockRef(key: string, el: unknown): void {
  if (el) blockEls.set(key, el as HTMLElement); else blockEls.delete(key);
}
interface Conn { id: string; d: string; sensorId: string; }
const connByBlock = reactive<Record<string, Conn[]>>({});
const hoverSensor = ref<string | null>(null);

// 自适应连线：按两节点相对位置选「水平(右→左)」或「竖直(下→上)」锚点，横/竖布局都成立
function linkPath(a: DOMRect, b: DOMRect, R0: DOMRect): string {
  const ax = a.left - R0.left, ay = a.top - R0.top, acx = ax + a.width / 2, acy = ay + a.height / 2;
  const bx = b.left - R0.left, by = b.top - R0.top, bcx = bx + b.width / 2, bcy = by + b.height / 2;
  if (Math.abs(bcx - acx) >= Math.abs(bcy - acy)) {
    const x1 = bcx >= acx ? ax + a.width : ax;
    const x2 = bcx >= acx ? bx : bx + b.width;
    const dx = (x2 - x1) * 0.5;
    return `M${x1.toFixed(1)},${acy.toFixed(1)} C${(x1 + dx).toFixed(1)},${acy.toFixed(1)} ${(x2 - dx).toFixed(1)},${bcy.toFixed(1)} ${x2.toFixed(1)},${bcy.toFixed(1)}`;
  }
  const y1 = bcy >= acy ? ay + a.height : ay;
  const y2 = bcy >= acy ? by : by + b.height;
  const dy = (y2 - y1) * 0.5;
  return `M${acx.toFixed(1)},${y1.toFixed(1)} C${acx.toFixed(1)},${(y1 + dy).toFixed(1)} ${bcx.toFixed(1)},${(y2 - dy).toFixed(1)} ${bcx.toFixed(1)},${y2.toFixed(1)}`;
}
function recomputeConnectors(): void {
  for (const g of objGroups.value) {
    const block = blockEls.get(g.componentKey);
    if (!block) { connByBlock[g.componentKey] = []; continue; }
    const R0 = block.getBoundingClientRect();
    const conns: Conn[] = [];
    const objEl = block.querySelector('[data-role="obj"]') as HTMLElement | null;
    const Ro = objEl?.getBoundingClientRect();
    const evAll = Array.from(block.querySelectorAll('[data-event-of]')) as HTMLElement[];
    block.querySelectorAll('[data-sensor-card]').forEach((sEl) => {
      const s = sEl as HTMLElement;
      const sid = s.getAttribute('data-sensor-card') || '';
      const Rs = s.getBoundingClientRect();
      if (Ro) conns.push({ id: `os-${sid}`, sensorId: sid, d: linkPath(Ro, Rs, R0) });
      evAll.filter((e) => e.getAttribute('data-event-of') === sid).forEach((eEl, i) => {
        conns.push({ id: `se-${sid}-${i}`, sensorId: sid, d: linkPath(Rs, eEl.getBoundingClientRect(), R0) });
      });
    });
    connByBlock[g.componentKey] = conns;
  }
}
let connRO: ResizeObserver | null = null;
onMounted(() => {
  nextTick(recomputeConnectors);
  connRO = new ResizeObserver(() => recomputeConnectors());
  const fl = document.querySelector('.flow-list');
  if (fl) connRO.observe(fl);
  window.addEventListener('resize', recomputeConnectors);
});
onBeforeUnmount(() => {
  connRO?.disconnect();
  window.removeEventListener('resize', recomputeConnectors);
});
watch([objGroups, expandedId], () => nextTick(recomputeConnectors));
</script>

<template>
  <div class="alarm-view">
    <!-- 顶部工具条：上下文 + 快速新增（原「监控对象 + 添加区」收进浮窗） -->
    <div class="alarm-toolbar">
      <span class="tb-tag">来自拓扑</span>
      <span class="tb-src">{{ source || boardName }}</span>
      <button ref="addBtnRef" class="btn-solid add-open" :class="{ on: showAdd }" @click="toggleAdd">＋ 新增传感器</button>
    </div>

    <!-- 快速新增浮窗（teleport 到 body，避开面板 overflow 裁剪） -->
    <teleport to="body">
      <div v-if="showAdd" class="add-backdrop" @click="showAdd = false"></div>
      <div v-if="showAdd" class="add-pop" :style="addPopStyle" @click.stop>
        <template v-if="!scopeDeviceKey">
          <div class="ap-title">选监控对象</div>
          <div class="dev-row">
            <button v-for="d in devices" :key="d.key" class="dev-chip" :class="{ active: selDevice?.key === d.key }" @click="selDeviceKey = d.key">
              <span class="dev-type">{{ d.typeLabel }}</span>
              <span class="dev-key">{{ d.key }}</span>
            </button>
          </div>
        </template>
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
              <button class="btn" @click="addCustomRail">添加</button>
            </div>
          </template>
          <div v-else class="rail-palette">
            <button v-for="qk in selDevice.quantities" :key="qk" class="add-chip" :class="{ used: quantityAdded(qk) }" :disabled="quantityAdded(qk)" @click="addQuantity(qk)">
              <span>{{ QUANTITIES[qk].label }}</span>
              <span class="rail-nom">{{ QUANTITIES[qk].kind === 'threshold' ? '门限量' : '状态量' }}</span>
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 流：监控对象 → 扇出传感器 → 事件 -->
    <div class="flow-list">
      <div v-if="!objGroups.length" class="empty">还没有告警链路。上方选监控对象、点电压轨 / 监控量即可添加一条。</div>

      <div v-for="g in objGroups" :key="g.componentKey" class="obj-block" :ref="(el) => setBlockRef(g.componentKey, el)">
        <!-- 上下游连线层（对象→传感器→事件，随布局重算，hover 高亮链路） -->
        <svg class="conn-layer" preserveAspectRatio="none" aria-hidden="true">
          <path v-for="c in (connByBlock[g.componentKey] || [])" :key="c.id" :d="c.d" class="conn"
                :class="{ active: hoverSensor === c.sensorId, dim: hoverSensor && hoverSensor !== c.sensorId }" />
        </svg>
        <!-- 监控对象节点（同一对象只画一次） -->
        <div class="obj-node" data-role="obj" :title="objTip(g)">
          <span class="on-ic"><svg viewBox="0 0 24 24"><path d="M9 3h6v2h3a1 1 0 0 1 1 1v3h2v2h-2v2h2v2h-2v3a1 1 0 0 1-1 1h-3v2H9v-2H6a1 1 0 0 1-1-1v-3H3v-2h2v-2H3V9h2V6a1 1 0 0 1 1-1h3V3zm0 5v8h6V8H9z"/></svg></span>
          <span class="on-txt">
            <span class="on-title">{{ g.entityName }}</span>
            <span class="on-sub">Entity #{{ g.entityId }} · {{ g.sensors.length }} 传感器</span>
          </span>
        </div>

        <!-- 分支：每条传感器从对象扇出 -->
        <div class="branches">
          <div v-for="entry in g.sensors" :key="entry.sensor.configId" class="branch"
               :class="[entry.sensor.kind, { open: expandedId === entry.sensor.configId, hot: hoverSensor === entry.sensor.configId }]"
               @mouseenter="hoverSensor = entry.sensor.configId" @mouseleave="hoverSensor = null">
            <!-- 一条链路：传感器节点卡 —实线→ 事件节点卡扇出（hover 高亮整条链路） -->
            <div class="chain">
              <div class="chain-head">
                <button class="sensor-card" :data-sensor-card="entry.sensor.configId" @click="toggleExpand(entry.sensor.configId)">
                  <span class="sc-ic"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg></span>
                  <span class="sc-name" :title="sensorLabel(entry)">{{ sensorLabel(entry) }}</span>
                  <span class="sc-kind">{{ entry.sensor.kind === 'threshold' ? '门限' : '状态' }}</span>
                  <i class="dot sc-dsdot" :class="dsResolved(entry.cfg) ? 'ok' : 'warn'" :title="dsResolved(entry.cfg) ? '数据源已接' : '数据源未接'"></i>
                  <span class="sc-chev" :class="{ open: expandedId === entry.sensor.configId }"><svg viewBox="0 0 24 24"><path d="M8.5 5l7 7-7 7z"/></svg></span>
                </button>
                <button class="branch-del" title="删除该链路及其告警" @click.stop="removeCfg(entry.cfg.id)">✕</button>
              </div>

              <!-- 事件节点卡：每条告警一张小卡，在传感器下方换行扇出；铃铛图标按严重度着色 -->
              <div class="event-fan">
                <div v-if="!entry.sensor.events.length" class="event-node none">未设门限 · 暂无告警</div>
                <div v-for="ev in entry.sensor.events" :key="ev.key" class="event-node" :class="ev.severity" :data-event-of="entry.sensor.configId" :title="ev.eventKeyId + ' · ' + ev.operator + ' ' + ev.conditionLabel">
                  <span class="en-ic"><svg viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"/></svg></span>
                  <span class="en-label">{{ ev.label }}</span>
                </div>
              </div>
            </div>

            <!-- 展开的配置（圆角卡，默认折叠）-->
            <div v-if="expandedId === entry.sensor.configId && openCfg && openEntry" class="sensor-config">
              <div class="sc-sec-cap">传感器 · {{ sensorLabel(entry) }}<span class="sc-explain">{{ QUANTITIES[openCfg.quantityKey].explain }}</span></div>

              <!-- 门限档 -->
              <div v-if="isThreshold(openCfg)" class="fn-thr">
                <div v-for="k in THRESHOLD_ORDER" :key="k" class="thr-pill" :class="{ off: openCfg.thresholds[k] == null }" :title="ZH[k] + ' 门限'">
                  <span class="thr-l">{{ ZH[k] }}</span>
                  <input v-model.number="openCfg.thresholds[k]" type="number" class="thr-in" :placeholder="recoThreshold(openCfg, k) != null ? '关' : '—'" />
                  <span v-if="recoThreshold(openCfg, k) != null" class="thr-reco">荐{{ recoThreshold(openCfg, k) }}</span>
                </div>
                <span class="thr-unit">{{ unitOf(openCfg) }}</span>
              </div>
              <div v-else class="disc-note">离散状态量：无门限，触发值与告警在下方「事件」配置。</div>

              <!-- 数据源 -->
              <div class="mf">
                <label>数据源</label>
                <select v-model="openCfg.dsMode" class="disc-sel wide">
                  <option value="device-field">器件读数 · {{ openCfg.deviceKey }}.{{ QUANTITIES[openCfg.quantityKey].readingField }}（推荐 · 已接）</option>
                  <option value="scanner">从寄存器周期读（高级 · 需选硬件信号）</option>
                </select>
              </div>
              <div class="mf-desc">{{ openCfg.dsMode === 'scanner' ? DATA_SOURCE_NOTES.scanner : DATA_SOURCE_NOTES.deviceField }}</div>
              <template v-if="openCfg.dsMode === 'scanner'">
                <div class="scan-grid">
                  <label>硬件信号(Chip)<input v-model="openCfg.dsChip" class="thr-in w" placeholder="Smc_..." /></label>
                  <label>偏移(Offset)<input v-model.number="openCfg.dsOffset" type="number" class="thr-in w" /></label>
                  <label>字节(Size)<input v-model.number="openCfg.dsSize" type="number" class="thr-in w" /></label>
                  <label>掩码(Mask)<input v-model.number="openCfg.dsMask" type="number" class="thr-in w" /></label>
                </div>
                <div class="mf">
                  <label>采集周期</label>
                  <select v-model.number="openCfg.periodMs" class="disc-sel wide" title="来自 README §6 扫描周期分类">
                    <option v-for="ct in PERIOD_CATEGORIES" :key="ct.periodMs + ct.label" :value="ct.periodMs">{{ ct.label }} · {{ ct.periodMs }}ms{{ recommendedPeriod(QUANTITIES[openCfg.quantityKey].recommend.periodKey).periodMs === ct.periodMs ? '（推荐）' : '' }}</option>
                  </select>
                </div>
              </template>
              <div v-if="isThreshold(openCfg)" class="mf">
                <label>迟滞</label>
                <input v-model.number="openCfg.hysteresis" type="number" class="thr-in w" />
                <span class="mf-desc">推荐 {{ QUANTITIES[openCfg.quantityKey].recommend.hysteresis ?? 2 }} · 回差防抖</span>
              </div>

              <!-- 事件编辑（一个传感器多条事件）-->
              <div class="sc-sec-cap">事件 · 已配置 {{ openCfg.events.length }} · 生效 {{ openEntry.sensor.events.length }}
                <button class="ev-add" @click="addEvent(openCfg)">＋ 添加事件</button>
              </div>
              <template v-if="isThreshold(openCfg)">
                <div v-for="ev in openCfg.events" :key="ev.id" class="ev-edit" :class="{ inactive: thrValue(openCfg, ev.levelField) == null || !ev.enabled }">
                  <label class="ev-en" title="是否产出该事件"><input type="checkbox" v-model="ev.enabled" /></label>
                  <label class="ef">
                    <span class="ef-k">档位<i class="i" title="事件监视哪一档门限；触发值自动引用该档，改门限只改一处。">i</i></span>
                    <select v-model="ev.levelField" class="disc-sel" @change="syncThrEvent(ev)">
                      <option v-for="k in THRESHOLD_ORDER" :key="k" :value="k">{{ ZH[k] }}{{ openCfg.thresholds[k] != null ? ' = ' + openCfg.thresholds[k] : '（未设）' }}</option>
                    </select>
                  </label>
                  <span class="ef ef-ro"><span class="ef-k">方向</span><span class="ef-dir" :title="operatorDesc(ev.operatorId)">{{ operatorSym(ev.operatorId) }} 门限</span></span>
                  <label class="ef"><span class="ef-k">分级</span>
                    <select v-model="ev.severity" class="disc-sel">
                      <option v-for="s in SEVERITIES" :key="s.v" :value="s.v">{{ s.label }}</option>
                    </select>
                  </label>
                  <label class="ef ef-grow"><span class="ef-k">告警字典条目<i class="i" title="EventKeyId：决定告警在字典中的文案与等级映射。首项为推荐。">i</i></span>
                    <select v-model="ev.eventKeyId" class="disc-sel wide">
                      <option v-for="(o, oi) in keyOptions(openCfg)" :key="o" :value="o">{{ o }}{{ oi === 0 ? '（推荐）' : '' }}</option>
                    </select>
                  </label>
                  <span class="ef-ref" v-if="ev.levelField">
                    <template v-if="thrValue(openCfg, ev.levelField) != null"><code>{{ openEntry.sensor.sensorKey }}.{{ ev.levelField }}</code> = {{ thrValue(openCfg, ev.levelField) }}</template>
                    <button v-else class="ev-fix" @click="ensureThreshold(openCfg, ev.levelField)">该档未设 · 设推荐</button>
                  </span>
                  <button class="ev-del" title="删除该事件" @click="removeEvent(openCfg, ev.id)">✕</button>
                </div>
              </template>
              <template v-else>
                <div v-for="ev in openCfg.events" :key="ev.id" class="ev-edit" :class="{ inactive: !ev.enabled }">
                  <label class="ev-en"><input type="checkbox" v-model="ev.enabled" /></label>
                  <label class="ef"><span class="ef-k">触发值<i class="i" title="读数=触发值即命中；离散量一般 1=置位/故障，0=不在位。">i</i></span>
                    <input v-model.number="ev.condition" type="number" class="thr-in w" /><i class="thr-reco">荐{{ QUANTITIES[openCfg.quantityKey].recommend.condition ?? 1 }}</i>
                  </label>
                  <label class="ef"><span class="ef-k">方向</span>
                    <select v-model.number="ev.operatorId" class="disc-sel">
                      <option v-for="o in OPERATORS" :key="o.id" :value="o.id">{{ o.symbol }} {{ o.label }}{{ o.id === QUANTITIES[openCfg.quantityKey].recommend.operatorId ? '（推荐）' : '' }}</option>
                    </select>
                  </label>
                  <label class="ef"><span class="ef-k">分级</span>
                    <select v-model="ev.severity" class="disc-sel">
                      <option v-for="s in SEVERITIES" :key="s.v" :value="s.v">{{ s.label }}</option>
                    </select>
                  </label>
                  <label class="ef ef-grow"><span class="ef-k">告警字典条目<i class="i" title="EventKeyId：决定告警在字典中的文案与等级映射。首项为推荐。">i</i></span>
                    <select v-model="ev.eventKeyId" class="disc-sel wide">
                      <option v-for="(o, oi) in keyOptions(openCfg)" :key="o" :value="o">{{ o }}{{ oi === 0 ? '（推荐）' : '' }}</option>
                    </select>
                  </label>
                  <button class="ev-del" title="删除该事件" @click="removeEvent(openCfg, ev.id)">✕</button>
                </div>
              </template>
              <div v-for="w in openEntry.warnings" :key="w" class="fn-warn">{{ w }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 板卡级汇总 -->
    <div v-if="sensorCount" class="board-summary">
      <div class="bs-head">
        <span>{{ objGroups.length }} 个监控对象 · {{ sensorCount }} 个传感器 · {{ eventCount }} 条告警 → 将写入 <b>{{ boardName }}.sr</b></span>
        <div class="bs-actions">
          <button class="btn" @click="openInCode" title="在右侧分屏打开对应代码文件">
            <svg class="btn-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z"/></svg>代码
          </button>
          <button v-if="expandedId" class="btn" @click="expandedId = null">收起全部</button>
          <button class="btn" @click="showJson = !showJson">{{ showJson ? '隐藏' : '查看' }} CSR 对象</button>
          <button class="btn-solid" @click="copyAll">{{ copied ? '已复制' : '复制全部' }}</button>
        </div>
      </div>
      <pre v-if="showJson" class="bs-json">{{ objectsJson }}</pre>
    </div>
  </div>
</template>

<style scoped>
.alarm-view { padding: 12px 14px; color: var(--foreground); font-size: 13px; }

/* 顶部工具条 + 快速新增浮窗 */
.alarm-toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.tb-tag { flex: none; font-size: 11px; padding: 1px 9px; border-radius: var(--radius-pill); background: var(--surface-2); color: var(--foreground-secondary); }
.tb-src { min-width: 0; font-size: 12px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.add-open { margin-left: auto; flex: none; }
.add-open.on { box-shadow: 0 0 0 2px var(--focus-ring); }

.add-backdrop { position: fixed; inset: 0; z-index: 299; }
.add-pop { position: fixed; z-index: 300; width: min(440px, 92vw); max-height: 72vh; overflow: auto; padding: 12px; border-radius: var(--radius-lg); background: var(--background-elevated); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-lg); display: flex; flex-direction: column; gap: 10px; }
.ap-title { font-size: 11px; color: var(--foreground-muted); }
.add-pop .dev-row { margin-bottom: 0; }
.add-pop .add-panel { margin-bottom: 0; padding: 0; background: transparent; }

.dev-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.dev-chip { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: var(--radius-pill); background: var(--surface-2); }
.dev-chip:hover { background: var(--surface-3); }
.dev-chip.active { background: var(--surface-3); box-shadow: inset 0 0 0 1px var(--primary); }
.dev-chip.active .dev-key { color: var(--primary); }
.dev-type { font-size: 11px; color: var(--foreground-muted); }
.dev-key { font-size: 12px; }

.add-panel { padding: 11px; margin-bottom: 12px; border-radius: 12px; background: var(--surface-1); }
.add-title { font-size: 12px; color: var(--foreground-secondary); margin-bottom: 8px; }
.rail-palette { display: flex; flex-wrap: wrap; gap: 8px; }
.add-chip { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: var(--surface-3); font-size: 12px; }
.add-chip:hover { background: var(--surface-4); }
.add-chip.all { background: var(--surface-3); color: var(--primary); }
.add-chip.all:hover { background: var(--surface-4); }
.add-chip.used { opacity: 0.4; cursor: default; }
.rail-nom { font-size: 11px; color: var(--foreground-muted); }
.rail-custom { display: flex; gap: 8px; margin-top: 10px; }
.num { padding: 6px 9px; background: var(--surface-1); border: 1px solid var(--border-default); color: var(--foreground); border-radius: var(--radius-md); width: 100px; }
.num.wide { width: 220px; }
.i { display: inline-flex; align-items: center; justify-content: center; width: 13px; height: 13px; border-radius: 999px; background: var(--surface-3); color: var(--foreground-muted); font-size: 11px; font-style: italic; cursor: help; margin-left: 3px; }
/* PTO 三级按钮体系（solid=白底深字·唯一 / btn=次级填充 / ghost=透明行内） */
.btn, .btn-solid, .btn-ghost { all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 28px; padding: 0 12px; border-radius: var(--radius-lg); font: 500 12px/1 var(--font-sans); transition: background var(--duration-fast) var(--easing-default), color var(--duration-fast) var(--easing-default); }
.btn { background: var(--button-secondary-bg); color: var(--foreground); }
.btn:hover { background: var(--surface-3); }
.btn-solid { background: var(--button-solid-bg); color: var(--button-solid-fg); }
.btn-solid:hover { background: var(--button-solid-bg-hover); }
.btn-ghost { background: transparent; color: var(--foreground-secondary); padding: 0 10px; }
.btn-ghost:hover { background: var(--state-hover); color: var(--foreground); }

.empty { padding: 24px; text-align: center; color: var(--foreground-muted); font-size: 12px; border-radius: 12px; background: var(--surface-1); }

/* ── 流：对象块 = 圆角卡；对象节点(左) —实线→ 传感器节点 —实线→ 事件节点扇出 ── */
.flow-list { display: flex; flex-direction: column; gap: 10px; }
.obj-block { position: relative; display: flex; align-items: stretch; gap: 20px; padding: 12px; border-radius: var(--radius-xl); background: var(--surface-1); }

/* 连线层：绝对铺满对象块，画在节点之下 */
.conn-layer { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 0; }
.conn { fill: none; stroke: color-mix(in srgb, var(--foreground-muted) 42%, transparent); stroke-width: 1.5; transition: stroke .12s, stroke-width .12s, opacity .12s; }
.conn.active { stroke: var(--primary); stroke-width: 2; }
.conn.dim { opacity: .22; }

.obj-node { position: relative; z-index: 1; flex: none; width: 140px; align-self: center; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-lg); background: var(--surface-3); }
.on-ic { display: inline-flex; }
.on-ic svg { width: 20px; height: 20px; fill: var(--foreground-secondary); }
.on-txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.on-title { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.on-sub { font-size: 11px; color: var(--foreground-muted); }

/* 链路竖排；每条 = 传感器节点 —实线→ 事件节点竖向扇出 */
.branches { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.branch { display: flex; flex-direction: column; gap: 6px; padding: 8px; border-radius: var(--radius-lg); background: var(--surface-2); transition: box-shadow var(--duration-fast) var(--easing-default), background var(--duration-fast) var(--easing-default); }
.branch.open { box-shadow: inset 0 0 0 1px var(--primary); }
.branch.hot { background: var(--surface-3); }

/* 竖向一条链路：传感器头(卡+删除) 在上，事件在下换行扇出（适配窄面板） */
.chain { display: flex; flex-direction: column; gap: 8px; }
.chain-head { display: flex; align-items: center; gap: 6px; }
.sensor-card { all: unset; cursor: pointer; box-sizing: border-box; flex: 1; min-width: 0; display: flex; align-items: center; gap: 7px; padding: 7px 9px; border-radius: var(--radius-md); background: var(--surface-3); transition: background var(--duration-fast) var(--easing-default), box-shadow var(--duration-fast) var(--easing-default); }
.sensor-card:hover { background: var(--surface-4); }
.branch.hot .sensor-card, .branch.open .sensor-card { box-shadow: inset 0 0 0 1px var(--primary); }
.sc-ic { display: inline-flex; flex: none; }
.sc-ic svg { width: 15px; height: 15px; fill: var(--primary); }
.branch.discrete .sc-ic svg { fill: var(--warning); }
.sc-name { flex: 1; min-width: 0; font-size: 12px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sc-kind { flex: none; font-size: 11px; color: var(--foreground-muted); padding: 1px 7px; border-radius: var(--radius-pill); background: var(--surface-1); }
.sc-dsdot { flex: none; }
.sc-chev { flex: none; display: inline-flex; }
.sc-chev svg { width: 12px; height: 12px; fill: var(--foreground-muted); transition: transform .15s; }
.sc-chev.open svg { transform: rotate(90deg); }
.dot { width: 6px; height: 6px; border-radius: var(--radius-pill); flex: none; background: var(--foreground-muted); }
.dot.ok { background: var(--success); }
.dot.warn { background: var(--warning); }
.dot.Minor { background: var(--warning); }
.dot.Major { background: color-mix(in srgb, var(--warning) 55%, var(--danger)); }
.dot.Critical { background: var(--danger); }

/* 事件节点卡：传感器下方换行扇出，铃铛图标按严重度着色 */
.event-fan { display: flex; flex-direction: row; flex-wrap: wrap; align-items: flex-start; gap: 6px; padding-left: 4px; }
.event-node { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 5px 10px; border-radius: var(--radius-md); background: var(--surface-1); font-size: 11px; color: var(--foreground-secondary); }
.event-node.none { color: var(--foreground-muted); }
.en-ic { display: inline-flex; flex: none; color: var(--foreground-muted); }
.en-ic svg { width: 12px; height: 12px; fill: currentColor; }
.en-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.event-node.Minor .en-ic { color: var(--warning); }
.event-node.Major .en-ic { color: color-mix(in srgb, var(--warning) 55%, var(--danger)); }
.event-node.Critical .en-ic { color: var(--danger); }

.branch-del { all: unset; cursor: pointer; flex: none; align-self: center; color: var(--foreground-muted); font-size: 12px; padding: 2px 6px; border-radius: var(--radius-sm); }
.branch-del:hover { color: var(--danger); background: var(--state-hover); }

/* 展开配置：圆角卡（嵌在展开的节点卡内） */
.sensor-config { display: flex; flex-direction: column; gap: 10px; padding: 12px; margin: 2px 0 0; border-radius: var(--radius-md); background: var(--surface-1); }
.sc-sec-cap { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--foreground-secondary); }
.sc-explain { font-size: 11px; color: var(--foreground-muted); font-weight: 400; }

.fn-thr { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.thr-pill { display: flex; align-items: center; gap: 4px; padding: 4px 7px; border-radius: 8px; background: var(--surface-3); }
.thr-pill.off { opacity: .5; }
.thr-l { font-size: 11px; color: var(--foreground-muted); }
.thr-in { all: unset; box-sizing: border-box; width: 46px; text-align: center; font-size: 12px; color: var(--foreground); background: var(--surface-1); box-shadow: inset 0 0 0 1px var(--border-subtle); border-radius: var(--radius-sm); padding: 3px 4px; }
.thr-in.w { width: 78px; text-align: left; padding: 5px 7px; }
.thr-reco { font-size: 11px; color: var(--foreground-muted); font-style: normal; }
.thr-unit { font-size: 11px; color: var(--foreground-muted); }
.disc-note { font-size: 11px; color: var(--foreground-muted); }

.mf { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.mf > label { flex: none; width: 52px; font-size: 11px; color: var(--foreground-secondary); }
.mf-desc { font-size: 11px; color: var(--foreground-muted); }
.disc-sel { padding: 5px 26px 5px 8px; border-radius: var(--radius-md); font-size: 11px; color: var(--foreground); background-color: var(--surface-1); border: 1px solid var(--border-default); cursor: pointer; -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3Cpath%20d='M7%2010l5%205%205-5z'%20fill='%23808080'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; background-size: 12px; }
.disc-sel.wide { flex: 1; min-width: 120px; }
.scan-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.scan-grid label { display: flex; flex-direction: column; gap: 3px; font-size: 11px; color: var(--foreground-muted); }
.fn-warn { font-size: 11px; color: var(--warning); }

/* 事件编辑 */
.ev-add { all: unset; cursor: pointer; margin-left: auto; font-size: 11px; color: var(--foreground-secondary); padding: 3px 10px; border-radius: 999px; background: var(--surface-3); }
.ev-edit { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 8px 10px; border-radius: var(--radius-md); background: var(--surface-2); }
.ev-edit.inactive { opacity: .55; }
.ev-en { display: flex; align-items: center; }
.ef { display: flex; flex-direction: column; gap: 3px; font-size: 11px; color: var(--foreground-muted); }
.ef-grow { flex: 1; min-width: 160px; }
.ef-k { display: flex; align-items: center; }
.ef.ef-ro, .ef-ref { flex-direction: row; align-items: center; gap: 6px; font-size: 11px; color: var(--foreground-muted); }
.ef-dir { font-size: 11px; color: var(--foreground-secondary); }
.ef-ref { display: flex; flex-wrap: wrap; }
.ef-ref code { font-family: ui-monospace, monospace; color: var(--foreground-secondary); background: var(--surface-3); padding: 1px 6px; border-radius: var(--radius-sm); }
.ev-fix { all: unset; cursor: pointer; font-size: 11px; color: var(--warning); }
.ev-del { all: unset; cursor: pointer; margin-left: auto; color: var(--foreground-muted); font-size: 12px; padding: 0 4px; }
.ev-del:hover { color: var(--danger); }

.board-summary { margin-top: 14px; padding-top: 12px; }
.bs-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 12px; color: var(--foreground-secondary); margin-bottom: 8px; }
.bs-actions { display: flex; gap: 8px; }
.btn-ic { width: 13px; height: 13px; fill: currentColor; }
.bs-json { max-height: 260px; overflow: auto; font-size: 11px; background: var(--surface-1); border-radius: var(--radius-md); padding: 10px; margin: 0; }

/* ── 焦点可见（键盘导航）· 所有 all:unset 的交互件显式补回焦点环 ── */
.dev-chip:focus-visible,
.add-chip:focus-visible,
.sensor-card:focus-visible,
.branch-del:focus-visible,
.ev-add:focus-visible,
.ev-del:focus-visible,
.ev-fix:focus-visible,
.btn:focus-visible,
.btn-solid:focus-visible,
.btn-ghost:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--focus-ring); }
.num:focus-visible,
.disc-sel:focus-visible { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px var(--focus-ring); }
.thr-in:focus-visible { outline: none; box-shadow: inset 0 0 0 1px var(--primary), 0 0 0 2px var(--focus-ring); }

/* 复选框归主色 */
input[type="checkbox"] { accent-color: var(--primary); }
input[type="checkbox"]:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 1px; }
</style>
