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
import { boardAlarm, nextUid, nextEvSeq, type ThrKey, type EvItem, type SensorCfg, type LooseEvent } from '../alarm/alarmStore';
import { loadBoardOnce } from '../alarm/srSeed';
import { chipTypeLabel } from '../data/srParser';

const { state: link, openCodeDoc } = useLinkage();
// scopeChipKey：器件（物理芯片）级告警——只显示数据源=该芯片的传感器；'__firmware'=固件推送(无芯片)。
// scopeDeviceKey：按监控设备收窄（历史入口，保留）。
const props = defineProps<{ scopeDeviceKey?: string; scopeChipKey?: string }>();
const inbound = computed(() => link.inbound.alarm);
const boardType = computed(() => inbound.value?.boardType || 'Unknown');
const boardName = computed(() => inbound.value?.boardName || '当前板卡');
const source = computed(() => inbound.value?.source || '');
const devices = computed<BoardDevice[]>(() => devicesForBoardType(boardType.value));

// 每块板一份 cfgs（存 store）；uid/evSeq 计数器也随板走
const boardKey = computed(() => boardName.value);
const uid = (): string => nextUid(boardKey.value);
const cfgs = computed(() => boardAlarm(boardKey.value).cfgs);
// 器件级 scope：芯片优先（按真实数据源芯片过滤），否则按监控设备，否则全取
const scopedCfgs = computed(() => {
  if (props.scopeChipKey) {
    return props.scopeChipKey === '__firmware'
      ? cfgs.value.filter((c) => !c.dsChip)
      : cfgs.value.filter((c) => c.dsChip === props.scopeChipKey);
  }
  if (props.scopeDeviceKey) return cfgs.value.filter((c) => c.deviceKey === props.scopeDeviceKey);
  return cfgs.value;
});

/* 默认折叠，只看流的全貌；点传感器卡展开它的配置（单展开）*/
const expandedId = ref<string | null>(null);
// 换板卡：各板 cfgs 独立存于 store（不清空）；首次进入用真实 .sr 播种
watch(boardKey, (key) => {
  expandedId.value = null;
  loadBoardOnce(key);
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
// 单器件视图里新增的传感器绑到该数据源芯片（否则收窄视图看不到、也不知取数来源）
function bindScope(c: SensorCfg): SensorCfg {
  if (props.scopeChipKey && props.scopeChipKey !== '__firmware') { c.dsChip = props.scopeChipKey; c.dsMode = 'scanner'; }
  return c;
}
function addRail(r: VoltageRail): void {
  if (!selDevice.value || railAdded(r.key)) return;
  cfgs.value.push(bindScope(baseCfg(selDevice.value.key, selDevice.value.typeLabel, 'voltage', r.key, r.label, r.nominal)));
}
function addAllRails(): void { for (const r of railPalette.value) if (!railAdded(r.key)) addRail(r); }
function addCustomRail(): void {
  const name = customRail.value.trim();
  if (!name || !selDevice.value) return;
  cfgs.value.push(bindScope(baseCfg(selDevice.value.key, selDevice.value.typeLabel, 'voltage', name, name, 12)));
  customRail.value = '';
}
function addQuantity(qKey: string): void {
  if (!selDevice.value || quantityAdded(qKey)) return;
  const c = bindScope(baseCfg(selDevice.value.key, selDevice.value.typeLabel, qKey));
  cfgs.value.push(c);
  expandedId.value = c.id;
}
// 告警模板说明：该监控量模板会生成哪些档/事件（新增时按模板一键落成一条完整告警链）
function tplDesc(qKey: string): string {
  const q = QUANTITIES[qKey];
  if (q.kind === 'threshold') {
    const evs = q.recommend.events || [];
    return evs.length ? `门限模板 · ${evs.length} 档：${evs.map((e) => e.label).join(' / ')}` : '门限模板 · 越限告警';
  }
  return '状态模板 · 读数命中触发值即告警';
}
function railTplDesc(): string { return '电压模板 · 每条轨按过压/欠压四档各产一条告警'; }
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

/* 告警分类（独立事件按类归拢，去掉扁平堆叠）*/
const CAT_LABEL: Record<string, string> = {
  voltage: '电压', temp: '温度', presence: '在位', chassis: '机箱',
  power: '电源 / 时序', system: '系统状态', other: '其他',
};
function eventCategory(e: LooseEvent): string {
  const s = e.eventKeyId + ' ' + e.label;
  if (/Chassis/i.test(e.eventKeyId)) return 'chassis';
  if (/Temp/i.test(s)) return 'temp';
  if (/_V_|Voltage|OverVolt|UnderVolt|(^|[^A-Za-z0-9])\d+(\.\d+)?V([^A-Za-z]|$)/i.test(s)) return 'voltage';
  if (/Install|Removed|Present|Insert|Missing|Disconnect/i.test(s)) return 'presence';
  if (/ACPI|System/i.test(s)) return 'system';
  if (/Power|Reset|OnTime|Boot|StartUp|PSU|Ok|Drop/i.test(s)) return 'power';
  return 'other';
}
function chipTypeLabelOf(chipKey: string): string {
  return chipKey === '__fw' ? '非物理芯片 · 固件推送' : chipTypeLabel(chipKey.split('_')[0]);
}

const boardObjects = computed(() => generated.value.objects);
const objectsJson = computed(() => JSON.stringify(boardObjects.value, null, 2));
const eventCount = computed(() => Object.keys(boardObjects.value).filter((k) => k.startsWith('Event_')).length);
const sensorCount = computed(() => generated.value.cards.length);

const openEntry = computed<Entry | null>(() => generated.value.cards.find((e) => e.sensor.configId === expandedId.value) || null);
const openCfg = computed<SensorCfg | null>(() => openEntry.value?.cfg || null);

/* 配置改为「聚焦浮层卡」：点传感器/事件都弹一张实底卡（压暗泳道背景、卡内自滚动，
   配置项再多也不撑泳道）。点事件时高亮定位到该事件行，说明「事件属于该传感器」。 */
const focusEventKey = ref<string | null>(null);   // 点事件进入时，卡内高亮/滚动到该 EventKeyId 的事件行
const cfgCardEl = ref<HTMLElement | null>(null);
function scrollFocusEvent(): void {
  const box = cfgCardEl.value; if (!box) return;
  const hit = box.querySelector('.ev-edit.focused') as HTMLElement | null;
  if (hit) hit.scrollIntoView({ block: 'nearest' });
}
// 配置引导：把「数据源 → 门限/触发 → 事件」当作一条链路，逐步标出待配置项，点击跳到对应步。
const stepDsDone = computed<boolean>(() => !!openCfg.value && dsResolved(openCfg.value));
const stepThrDone = computed<boolean>(() => {
  const c = openCfg.value; if (!c) return true;
  if (!isThreshold(c)) return true;                              // 状态量无门限档，本步天然完成
  return THRESHOLD_ORDER.some((k) => c.thresholds[k] != null);   // 门限量：至少设一档
});
const stepEvDone = computed<boolean>(() => {
  const c = openCfg.value; if (!c) return false;
  return c.events.length > 0 && c.events.every((e) => !!e.eventKeyId);
});
interface StepTodo { key: string; label: string; }
const pendingSteps = computed<StepTodo[]>(() => {
  const out: StepTodo[] = [];
  if (!stepDsDone.value) out.push({ key: 'ds', label: '数据源未接' });
  if (!stepThrDone.value) out.push({ key: 'thr', label: '未设门限' });
  if (!stepEvDone.value) out.push({ key: 'ev', label: openCfg.value && openCfg.value.events.length ? '事件字典条目未选' : '未加事件' });
  return out;
});
function scrollToStep(key: string): void {
  nextTick(() => {
    const el = cfgCardEl.value?.querySelector(`[data-step="${key}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
}

/* 独立事件（不经传感器）——真实 .sr 里绝大多数事件属此类；按数据源器件分组、可逐条点击配置 */
const looseAll = computed<LooseEvent[]>(() => boardAlarm(boardKey.value).looseEvents);
const scopedLoose = computed<LooseEvent[]>(() => {
  if (props.scopeChipKey) {
    return props.scopeChipKey === '__firmware'
      ? looseAll.value.filter((e) => !e.dsChip)
      : looseAll.value.filter((e) => e.dsChip === props.scopeChipKey);
  }
  if (props.scopeDeviceKey) return [];
  return looseAll.value;
});
const looseCount = computed(() => scopedLoose.value.length);
const openLooseId = ref<string | null>(null);
const openLooseEvent = computed<LooseEvent | null>(() => scopedLoose.value.find((e) => e.id === openLooseId.value) || null);
function toggleLoose(id: string): void {
  const willOpen = openLooseId.value !== id;
  openLooseId.value = willOpen ? id : null;
  if (willOpen) { expandedId.value = null; focusEventKey.value = null; }
}
// 新增独立事件：不经传感器、直连器件数据源（真实 .sr 里大多数告警属此类）。新建空事件并打开其配置。
function addLooseEvent(): void {
  const st = boardAlarm(boardKey.value);
  const id = `le-m${nextEvSeq(boardKey.value)}`;
  const dsChip = props.scopeChipKey && props.scopeChipKey !== '__firmware' ? props.scopeChipKey : '';
  st.looseEvents.push({ id, eventKeyId: '', label: '新事件', condition: 1, operatorId: 5, severity: 'Major', dsChip, scope: 'board', enabled: true });
  expandedId.value = null;
  openLooseId.value = id;
  showAdd.value = false;
}
// .sr 播种的状态传感器常带空 events（生效值是对象生成器合成的默认「状态命中」）；
// 打开配置时把这条合成默认落成可编辑事件，避免出现「已配置 0」的空编辑区。
function ensureEditableEvents(c: SensorCfg): void {
  if (c.events.length === 0) c.events = initEvents(c.quantityKey);
}
// 点传感器卡：展开该传感器（不定位到某条事件）
function openSensor(id: string): void {
  const willOpen = expandedId.value !== id;
  expandedId.value = willOpen ? id : null;
  focusEventKey.value = null;
  if (willOpen) {
    openLooseId.value = null;
    if (openCfg.value) ensureEditableEvents(openCfg.value);
  }
}
// 点某条事件：展开其所属传感器，并高亮/滚动定位到该事件行
function openSensorEvent(sensorId: string, eventKeyId: string): void {
  expandedId.value = sensorId;
  openLooseId.value = null;
  const cfg = openCfg.value;
  if (cfg) {
    ensureEditableEvents(cfg);
    // 高亮定位：优先匹配被点事件的字典条目，匹配不到落到首条（合成默认可能字典条目不同）
    focusEventKey.value = cfg.events.some((e) => e.eventKeyId === eventKeyId)
      ? eventKeyId : (cfg.events[0]?.eventKeyId ?? eventKeyId);
  } else {
    focusEventKey.value = eventKeyId;
  }
  nextTick(scrollFocusEvent);
}
function closeFocus(): void { expandedId.value = null; openLooseId.value = null; focusEventKey.value = null; }
function onFocusKey(e: KeyboardEvent): void { if (e.key === 'Escape') closeFocus(); }
onMounted(() => window.addEventListener('keydown', onFocusKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onFocusKey));

/* 统一流：按数据源「器件(芯片)」归组 → 器件 → 传感器 → 事件；无传感器的事件按告警分类直接挂器件（不显示传感器）*/
interface CatRow { cat: string; label: string; events: LooseEvent[]; }
interface ChipFlow { chipKey: string; chipLabel: string; subLabel: string; sensors: Entry[]; cats: CatRow[]; sensorCount: number; eventCount: number; }
const chipFlows = computed<ChipFlow[]>(() => {
  const keyOf = (c: string) => c || '__fw';
  const map = new Map<string, { sensors: Entry[]; loose: LooseEvent[] }>();
  const bucket = (k: string) => { let b = map.get(k); if (!b) { b = { sensors: [], loose: [] }; map.set(k, b); } return b; };
  for (const e of generated.value.cards) bucket(keyOf(e.cfg.dsChip)).sensors.push(e);
  for (const le of scopedLoose.value) bucket(keyOf(le.dsChip)).loose.push(le);
  const flows: ChipFlow[] = [];
  for (const [k, v] of map) {
    const catMap = new Map<string, LooseEvent[]>();
    for (const le of v.loose) { const c = eventCategory(le); let a = catMap.get(c); if (!a) { a = []; catMap.set(c, a); } a.push(le); }
    const catOrder = Object.keys(CAT_LABEL);
    const cats: CatRow[] = [...catMap.entries()]
      .sort((a, b) => catOrder.indexOf(a[0]) - catOrder.indexOf(b[0]))
      .map(([cat, events]) => ({ cat, label: CAT_LABEL[cat] || cat, events }));
    flows.push({
      chipKey: k, chipLabel: k === '__fw' ? '固件 / BIOS 推送' : k, subLabel: chipTypeLabelOf(k),
      sensors: v.sensors, cats, sensorCount: v.sensors.length, eventCount: v.loose.length,
    });
  }
  return flows.sort((a, b) => (b.sensorCount * 1000 + b.eventCount) - (a.sensorCount * 1000 + a.eventCount));
});
const flowCount = computed(() => chipFlows.value.length);
// 单器件视图（已按芯片收窄）里「器件·数据源」列没意义 → 收起；有传感器时才显「传感器」列
const showChipLane = computed(() => !props.scopeChipKey);
const anySensors = computed(() => chipFlows.value.some((cf) => cf.sensors.length > 0));

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
function severityLabel(v: string): string { return SEVERITIES.find((s) => s.v === v)?.label || v; }
function severityDesc(v: string): string { return SEVERITIES.find((s) => s.v === v)?.desc || ''; }

/* 自绘 hover 卡（原生 title 太隐蔽、延迟长）——器件 / 传感器 / 事件 悬停即显要点 */
interface TipRow { k: string; v: string; }
const tip = reactive({ show: false, x: 0, y: 0, head: '', sub: '', rows: [] as TipRow[] });
function placeTip(e: MouseEvent): void {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  tip.x = Math.max(8, Math.min(r.left, window.innerWidth - 320));
  tip.y = r.bottom + 6;
}
function showChipTip(e: MouseEvent, cf: ChipFlow): void {
  placeTip(e);
  tip.head = cf.chipKey === '__fw' ? '固件 / BIOS 推送' : cf.chipLabel;
  tip.sub = cf.chipKey === '__fw' ? 'Reading=0 或无 Scanner，由固件直接上报' : `数据源器件${cf.subLabel ? ' · ' + cf.subLabel : ''}`;
  const rows: TipRow[] = [
    { k: '取数', v: cf.chipKey === '__fw' ? '固件直报，不经物理芯片' : `Reading ⟵ Scanner.Value ⟵ ${cf.chipLabel}` },
    { k: '规模', v: `${cf.sensorCount} 传感器 · ${cf.eventCount} 事件` },
  ];
  if (cf.sensors.length) rows.push({ k: '传感器', v: cf.sensors.map((s) => sensorLabel(s)).join('、') });
  tip.rows = rows; tip.show = true;
}
function showSensorTip(e: MouseEvent, en: Entry): void {
  placeTip(e);
  const q = QUANTITIES[en.cfg.quantityKey];
  tip.head = sensorLabel(en);
  tip.sub = `${en.sensor.kind === 'threshold' ? '门限传感器' : '状态传感器'} · ${q.label}${q.unitLabel ? ' ' + q.unitLabel : ''}`;
  const ds = en.cfg.dsMode === 'device-field'
    ? `器件读数 ${en.cfg.deviceKey}.${q.readingField}`
    : `寄存器周期读 ${en.cfg.dsChip || '(未选芯片)'} @${en.cfg.periodMs}ms`;
  const rows: TipRow[] = [
    { k: '键名', v: en.sensor.sensorKey },
    { k: '数据源', v: `${ds}（${dsResolved(en.cfg) ? '已接' : '未接'}）` },
  ];
  if (en.cfg.entityRef) rows.push({ k: '物理实体', v: en.cfg.entityRef });
  if (en.sensor.kind === 'threshold') {
    const set = THRESHOLD_ORDER.filter((k) => en.cfg.thresholds[k] != null).map((k) => `${ZH[k]}=${en.cfg.thresholds[k]}`);
    rows.push({ k: '门限', v: set.length ? set.join(' · ') + (q.unitLabel ? ' ' + q.unitLabel : '') : '未设' });
  }
  rows.push({ k: '事件', v: `${en.sensor.events.length} 条${en.sensor.events.length ? '（' + en.sensor.events.map((x) => x.label).join('、') + '）' : ''}` });
  tip.rows = rows; tip.show = true;
}
function showEventTip(e: MouseEvent, label: string, eventKeyId: string, trig: string, severity: string, owner: string): void {
  placeTip(e);
  tip.head = label;
  tip.sub = `事件 / 告警 · ${owner}`;
  tip.rows = [
    { k: '触发', v: trig },
    { k: '分级', v: severityLabel(severity) },
    { k: '字典条目', v: eventKeyId || '(未选)' },
  ];
  tip.show = true;
}
function hideTip(): void { tip.show = false; }

const copied = ref(false);
function copyAll(): void {
  navigator.clipboard?.writeText(objectsJson.value).then(() => {
    copied.value = true; window.setTimeout(() => { copied.value = false; }, 1500);
  });
}
// 「代码」：嵌入 IDE 时交给宿主在右侧编辑器分屏打开（而非本视图内部分屏）；独立运行则用内部分屏预览。
function openInCode(): void {
  const file = `${boardName.value}.sr`;
  const content = objectsJson.value;
  let embedded = false;
  try { embedded = window.self !== window.top; } catch { embedded = true; }
  if (embedded) {
    const msg = { type: 'open-code', source: 'hardware-alarm', file, language: 'jsonc', readOnly: true, content };
    try { window.parent.postMessage(msg, '*'); } catch { /* ignore */ }
    try { (window as unknown as { vscode?: { postMessage?: (m: unknown) => void } }).vscode?.postMessage?.(msg); } catch { /* ignore */ }
  } else {
    openCodeDoc(file, content);
  }
}

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
interface Conn { id: string; d: string; sensorId: string; dashed?: boolean; }
const connByBlock = reactive<Record<string, Conn[]>>({});
const hoverSensor = ref<string | null>(null);

// 三列严格左→右：从 a 右缘中点 贝塞尔到 b 左缘中点（器件→中间→事件都成立）
function linkPathH(a: DOMRect, b: DOMRect, R0: DOMRect): string {
  const x1 = a.right - R0.left, y1 = a.top - R0.top + a.height / 2;
  const x2 = b.left - R0.left, y2 = b.top - R0.top + b.height / 2;
  const dx = Math.max(18, (x2 - x1) * 0.45);
  return `M${x1.toFixed(1)},${y1.toFixed(1)} C${(x1 + dx).toFixed(1)},${y1.toFixed(1)} ${(x2 - dx).toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}
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
  for (const g of chipFlows.value) {
    const block = blockEls.get(g.chipKey);
    if (!block) { connByBlock[g.chipKey] = []; continue; }
    const R0 = block.getBoundingClientRect();
    const conns: Conn[] = [];
    const objEl = block.querySelector('[data-role="obj"]') as HTMLElement | null;
    const Ro = objEl?.getBoundingClientRect();
    const evAll = Array.from(block.querySelectorAll('[data-event-of]')) as HTMLElement[];
    // 三列流：器件 → 中间节点(传感器/分类) → 事件；hover 高亮整条链路
    block.querySelectorAll('[data-sensor-card]').forEach((sEl) => {
      const s = sEl as HTMLElement;
      const sid = s.getAttribute('data-sensor-card') || '';
      const Rs = s.getBoundingClientRect();
      if (Ro) conns.push({ id: `os-${sid}`, sensorId: sid, d: linkPathH(Ro, Rs, R0) });
      evAll.filter((e) => e.getAttribute('data-event-of') === sid).forEach((eEl, i) => {
        conns.push({ id: `se-${sid}-${i}`, sensorId: sid, d: linkPathH(Rs, eEl.getBoundingClientRect(), R0) });
      });
    });
    // 无传感器的独立事件：器件 → 分类组（虚线，一类一条），体现「直连数据源」
    if (Ro) block.querySelectorAll('[data-cat-head]').forEach((cEl) => {
      const cid = (cEl as HTMLElement).getAttribute('data-cat-head') || '';
      conns.push({ id: `oc-${cid}`, sensorId: cid, d: linkPathH(Ro, cEl.getBoundingClientRect(), R0), dashed: true });
    });
    connByBlock[g.chipKey] = conns;
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
watch([chipFlows, expandedId, openLooseId], () => nextTick(recomputeConnectors));
</script>

<template>
  <div class="alarm-view">
    <!-- 顶部工具条：上下文 + 快速新增（原「监控对象 + 添加区」收进浮窗） -->
    <div class="alarm-toolbar">
      <span class="tb-tag">{{ scopeChipKey ? '数据源器件' : '来自拓扑' }}</span>
      <span class="tb-src">{{ source || boardName }}</span>
      <button class="btn add-open2" title="新增一条不经传感器的独立事件（直连器件数据源）" @click="addLooseEvent">＋ 新增事件</button>
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
            为 <b>{{ selDevice.key }}</b> 选告警模板
            <span class="i" title="模板 = 一键落成一条完整告警链（传感器 + 推荐门限/触发值 + 分档事件），可再逐项微调。">i</span>
          </div>
          <template v-if="isVolt">
            <div class="tpl-hint">{{ railTplDesc() }}</div>
            <div class="tpl-list">
              <button v-for="r in railPalette" :key="r.key" class="tpl-card" :class="{ used: railAdded(r.key) }" :disabled="railAdded(r.key)" @click="addRail(r)">
                <span class="tpl-name">{{ r.label }} <span class="tpl-tag">{{ r.nominal }}V</span></span>
                <span class="tpl-desc">四档过压/欠压{{ railAdded(r.key) ? ' · 已添加' : '' }}</span>
              </button>
              <button class="tpl-card all" @click="addAllRails"><span class="tpl-name">＋ 全部电压轨</span><span class="tpl-desc">一次加齐本板所有轨</span></button>
            </div>
            <div class="rail-custom">
              <input v-model="customRail" class="num wide" placeholder="自定义轨名，如 PVDDQ_ABCD" @keyup.enter="addCustomRail" />
              <button class="btn" @click="addCustomRail">添加</button>
            </div>
          </template>
          <div v-else class="tpl-list">
            <button v-for="qk in selDevice.quantities" :key="qk" class="tpl-card" :class="{ used: quantityAdded(qk) }" :disabled="quantityAdded(qk)" @click="addQuantity(qk)">
              <span class="tpl-name">{{ QUANTITIES[qk].label }}<span class="tpl-tag">{{ QUANTITIES[qk].kind === 'threshold' ? '门限' : '状态' }}</span>{{ quantityAdded(qk) ? ' · 已添加' : '' }}</span>
              <span class="tpl-desc">{{ tplDesc(qk) }}</span>
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 横向泳道大图：器件(数据源) → 传感器 → 事件；每块 = 一个器件的横向带 -->
    <div class="flow-list">
      <!-- 泳道表头：仅对实际存在的泳道显示轻标签（不做成表格线，融进流图） -->
      <div class="lane-head" :class="{ 'no-chip': !showChipLane }">
        <div v-if="showChipLane" class="lh-chip">器件 · 数据源</div>
        <div class="lh-se">
          <div v-if="anySensors" class="lh-sensor">传感器</div>
          <div class="lh-event">事件 / 告警（按类）</div>
        </div>
      </div>
      <div v-if="!chipFlows.length" class="empty">{{ scopeChipKey === '__firmware' ? '该固件通道暂无离散状态传感器或事件。' : scopeChipKey ? '该器件仅参与拓扑/在位识别，未承载遥测传感器，也无独立事件。' : '还没有告警链路。上方选监控对象、点电压轨 / 监控量即可添加一条。' }}</div>

      <div v-for="cf in chipFlows" :key="cf.chipKey" class="obj-block" :class="{ 'no-chip': !showChipLane }" :ref="(el) => setBlockRef(cf.chipKey, el)">
        <!-- 上下游连线层（器件→中间节点→事件，随布局重算，hover 高亮链路） -->
        <svg class="conn-layer" preserveAspectRatio="none" aria-hidden="true">
          <path v-for="c in (connByBlock[cf.chipKey] || [])" :key="c.id" :d="c.d" class="conn"
                :class="{ active: hoverSensor === c.sensorId, dim: hoverSensor && hoverSensor !== c.sensorId, dashed: c.dashed }" />
        </svg>
        <!-- 第一列：数据源器件(芯片) 节点；单器件视图收起（已按该芯片收窄，无需再重复） -->
        <div v-if="showChipLane" class="chip-node" data-role="obj" @mouseenter="showChipTip($event, cf)" @mouseleave="hideTip">
          <span class="cn-ic" :class="{ fw: cf.chipKey === '__fw' }"><svg viewBox="0 0 24 24"><path d="M9 3h6v2h3a1 1 0 0 1 1 1v3h2v2h-2v2h2v2h-2v3a1 1 0 0 1-1 1h-3v2H9v-2H6a1 1 0 0 1-1-1v-3H3v-2h2v-2H3V9h2V6a1 1 0 0 1 1-1h3V3zm0 5v8h6V8H9z"/></svg></span>
          <span class="cn-name">{{ cf.chipLabel }}</span>
          <span class="cn-type">{{ cf.subLabel }}</span>
          <span class="cn-cnt">{{ cf.sensorCount ? cf.sensorCount + ' 传感器 · ' : '' }}{{ cf.eventCount }} 事件</span>
        </div>

        <!-- 泳道二：传感器 ⟶ 泳道三：事件 -->
        <div class="se-cols">
          <template v-for="entry in cf.sensors" :key="entry.sensor.configId">
            <div class="se-row"
                 :class="[entry.sensor.kind, { open: expandedId === entry.sensor.configId, hot: hoverSensor === entry.sensor.configId }]"
                 @mouseenter="hoverSensor = entry.sensor.configId" @mouseleave="hoverSensor = null">
              <!-- 左列：传感器节点卡 -->
              <div class="se-sensor">
                <button class="sensor-card" :data-sensor-card="entry.sensor.configId" @mouseenter="showSensorTip($event, entry)" @mouseleave="hideTip" @click="openSensor(entry.sensor.configId)">
                  <span class="sc-ic"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg></span>
                  <span class="sc-name">{{ sensorLabel(entry) }}</span>
                  <span class="sc-kind">{{ entry.sensor.kind === 'threshold' ? '门限' : '状态' }}</span>
                  <i class="dot sc-dsdot" :class="dsResolved(entry.cfg) ? 'ok' : 'warn'" :title="dsResolved(entry.cfg) ? '数据源已接' : '数据源未接'"></i>
                  <span class="sc-chev" :class="{ open: expandedId === entry.sensor.configId }"><svg viewBox="0 0 24 24"><path d="M8.5 5l7 7-7 7z"/></svg></span>
                </button>
                <button class="branch-del" title="删除该链路及其告警" @click.stop="removeCfg(entry.cfg.id)">✕</button>
              </div>
              <!-- 右列：事件节点卡扇出（铃铛按严重度着色；无门限时该列空态） -->
              <div class="se-events">
                <div v-if="!entry.sensor.events.length" class="event-node none">未设门限 · 暂无告警</div>
                <button v-for="ev in entry.sensor.events" :key="ev.key" class="event-node click" :class="ev.severity" :data-event-of="entry.sensor.configId" @mouseenter="showEventTip($event, ev.label, ev.eventKeyId, ev.operator + ' ' + ev.conditionLabel, ev.severity || 'Major', '属于 ' + sensorLabel(entry))" @mouseleave="hideTip" @click.stop="openSensorEvent(entry.sensor.configId, ev.eventKeyId)">
                  <span class="en-ic"><svg viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"/></svg></span>
                  <span class="en-label">{{ ev.label }}</span>
                </button>
              </div>
            </div>
          </template>

          <!-- 独立事件：有传感器时留空占位对齐；无传感器时直接去掉中间列，事件紧接器件（免误解） -->
          <div v-if="cf.cats.length" class="se-row loose-row" :class="{ 'no-sensor': !cf.sensors.length }">
            <div v-if="cf.sensors.length" class="se-sensor se-empty"></div>
            <div class="se-events loose-events">
              <div v-for="row in cf.cats" :key="cf.chipKey + ':' + row.cat" class="cat-grp" :class="row.cat">
                <div class="cat-head" :class="[row.cat, { hot: hoverSensor === cf.chipKey + ':' + row.cat }]" :data-cat-head="cf.chipKey + ':' + row.cat"
                     @mouseenter="hoverSensor = cf.chipKey + ':' + row.cat" @mouseleave="hoverSensor = null">
                  <span class="cat-dot"></span>
                  <span class="cat-name">{{ row.label }}</span>
                  <span class="cat-n">{{ row.events.length }}</span>
                </div>
                <div class="cat-chips">
                  <template v-for="e in row.events" :key="e.id">
                    <button class="event-node click" :class="[e.severity, { open: openLooseId === e.id, off: !e.enabled }]"
                            @mouseenter="showEventTip($event, e.label, e.eventKeyId, operatorSym(e.operatorId) + ' ' + e.condition, e.severity, '独立事件 · 直连器件')" @mouseleave="hideTip" @click.stop="toggleLoose(e.id)">
                      <span class="en-ic"><svg viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"/></svg></span>
                      <span class="en-label">{{ e.label }}</span>
                      <span class="en-op">{{ operatorSym(e.operatorId) }} {{ e.condition }}</span>
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 板卡级汇总 -->
    <div v-if="sensorCount || looseCount" class="cfg-actions-float">
      <div class="fa-group" :title="'将写入 ' + boardName + '.sr'">
        <button class="btn" @click="openInCode" title="在右侧分屏打开对应代码文件">
          <svg class="btn-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z"/></svg>代码
        </button>
        <button class="btn-solid" @click="copyAll" title="复制本板生成的全部 CSR 对象(JSON)到剪贴板，可粘贴进 .sr">{{ copied ? '已复制 CSR' : '复制 CSR' }}</button>
      </div>
    </div>

    <!-- ══ 配置：聚焦浮层卡（点传感器/事件都弹这张实底卡，压暗泳道，卡内自滚动）══ -->
    <div v-if="(expandedId && openCfg && openEntry) || (openLooseId && openLooseEvent)" class="cfg-backdrop" @click.self="closeFocus">
      <!-- ① 传感器（含其门限/数据源/多条事件）-->
      <div v-if="expandedId && openCfg && openEntry" ref="cfgCardEl" class="cfg-card">
        <div class="cfg-head">
          <span class="cfg-ic sensor"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg></span>
          <div class="cfg-tt">
            <span class="cfg-title">{{ sensorLabel(openEntry) }}<span class="cfg-badge">{{ isThreshold(openCfg) ? '门限传感器' : '状态传感器' }}</span></span>
            <span class="cfg-sub">{{ QUANTITIES[openCfg.quantityKey].explain }}</span>
          </div>
          <button class="cfg-x" title="关闭 (Esc)" @click="closeFocus">✕</button>
        </div>
        <div class="cfg-body">
          <!-- 配置引导：链路 数据源→门限/触发→事件；未配处高亮，点「待配置」跳到该步 -->
          <div v-if="pendingSteps.length" class="cfg-todo">
            <span class="todo-ic">!</span><span class="todo-t">还有 {{ pendingSteps.length }} 处待配置</span>
            <button v-for="s in pendingSteps" :key="s.key" class="todo-chip" @click="scrollToStep(s.key)">{{ s.label }}</button>
          </div>

          <!-- ① 数据源 -->
          <div class="chain-step" data-step="ds" :class="{ todo: !stepDsDone }">
            <span class="cs-n">1</span><span class="cs-t">数据源</span>
            <span class="cs-st" :class="{ ok: stepDsDone }">{{ stepDsDone ? '已接' : '待配置' }}</span>
          </div>
          <div class="mf">
            <label>取数方式</label>
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
            <div v-if="(openCfg.debounce && openCfg.debounce !== 'None') || openCfg.scanEnabled" class="mf-desc">
              <template v-if="openCfg.debounce && openCfg.debounce !== 'None'">去抖滤波 {{ openCfg.debounce }}（{{ /^MidAvg/.test(openCfg.debounce) ? '滑动均值' : /^ContBin/.test(openCfg.debounce) ? 'N 连续判定' : '滤波' }}）</template>
              <template v-if="openCfg.scanEnabled"> · 上电门控 {{ openCfg.scanEnabled }}（就绪才扫描）</template>
            </div>
          </template>

          <!-- ② 门限 / 触发 -->
          <div class="chain-step" data-step="thr" :class="{ todo: !stepThrDone }">
            <span class="cs-n">2</span><span class="cs-t">{{ isThreshold(openCfg) ? '门限' : '触发条件' }}</span>
            <span class="cs-st" :class="{ ok: stepThrDone }">{{ stepThrDone ? (isThreshold(openCfg) ? '已设' : '离散·无需门限') : '待配置' }}</span>
          </div>
          <div v-if="isThreshold(openCfg)" class="fn-thr">
            <div v-for="k in THRESHOLD_ORDER" :key="k" class="thr-pill" :class="{ off: openCfg.thresholds[k] == null }" :title="ZH[k] + ' 门限'">
              <span class="thr-l">{{ ZH[k] }}</span>
              <input v-model.number="openCfg.thresholds[k]" type="number" class="thr-in" :placeholder="recoThreshold(openCfg, k) != null ? '关' : '—'" />
              <span v-if="recoThreshold(openCfg, k) != null" class="thr-reco">荐{{ recoThreshold(openCfg, k) }}</span>
            </div>
            <span class="thr-unit">{{ unitOf(openCfg) }}</span>
          </div>
          <div v-else class="disc-note">离散状态量：无门限档，命中在下方每条事件的「触发值」判定。</div>
          <div v-if="isThreshold(openCfg)" class="mf">
            <label>迟滞</label>
            <input v-model.number="openCfg.hysteresis" type="number" class="thr-in w" />
            <span class="mf-desc">推荐 {{ QUANTITIES[openCfg.quantityKey].recommend.hysteresis ?? 2 }} · 回差防抖</span>
          </div>

          <!-- ③ 事件 / 告警（点事件进入时高亮定位到对应行）-->
          <div class="chain-step" data-step="ev" :class="{ todo: !stepEvDone }">
            <span class="cs-n">3</span><span class="cs-t">事件 / 告警</span>
            <span class="cs-st" :class="{ ok: stepEvDone }">{{ stepEvDone ? openCfg.events.length + ' 条' : (openCfg.events.length ? '字典条目待选' : '待加事件') }}</span>
            <span v-if="focusEventKey" class="sc-focus-hint">← 你点的事件属于本传感器</span>
            <button class="ev-add" @click="addEvent(openCfg)">＋ 添加事件</button>
          </div>
          <template v-if="isThreshold(openCfg)">
            <div v-for="ev in openCfg.events" :key="ev.id" class="ev-edit" :class="{ inactive: thrValue(openCfg, ev.levelField) == null || !ev.enabled, focused: focusEventKey === ev.eventKeyId }">
              <div class="ev-head">
                <label class="ev-en" title="是否产出该事件"><input type="checkbox" class="sw" v-model="ev.enabled" /><span class="ev-en-l">启用</span></label>
                <button class="ev-del" title="删除该事件" @click="removeEvent(openCfg, ev.id)">✕</button>
              </div>
              <div class="ev-fields">
                <label class="ef ev-nm"><span class="ef-k">名称</span><input v-model="ev.label" type="text" class="thr-in wnm" placeholder="事件名" /></label>
                <label class="ef ef-lv">
                  <span class="ef-k">档位<i class="i" :title="ev.levelField ? ('监视该档门限，触发值自动引用 ' + openEntry.sensor.sensorKey + '.' + ev.levelField + (thrValue(openCfg, ev.levelField) != null ? ' = ' + thrValue(openCfg, ev.levelField) : '（该档未设，可点“设推荐”）')) : '选择监视哪一档门限'">i</i></span>
                  <select v-model="ev.levelField" class="disc-sel" @change="syncThrEvent(ev)">
                    <option v-for="k in THRESHOLD_ORDER" :key="k" :value="k">{{ ZH[k] }}{{ openCfg.thresholds[k] != null ? ' = ' + openCfg.thresholds[k] : '（未设）' }}</option>
                  </select>
                </label>
                <span class="ef"><span class="ef-k">方向<i class="i" :title="operatorDesc(ev.operatorId)">i</i></span><span class="ef-dir">{{ operatorSym(ev.operatorId) }} 门限</span></span>
                <label class="ef"><span class="ef-k">分级<i class="i" :title="severityDesc(ev.severity)">i</i></span>
                  <select v-model="ev.severity" class="disc-sel">
                    <option v-for="s in SEVERITIES" :key="s.v" :value="s.v">{{ s.label }}</option>
                  </select>
                </label>
                <label v-if="ev.component != null" class="ef"><span class="ef-k">归属 FRU</span><input v-model="ev.component" class="ea-in" placeholder="Component_*" /></label>
                <label v-if="ev.evHysteresis != null" class="ef"><span class="ef-k">迟滞</span><input v-model.number="ev.evHysteresis" type="number" class="ea-in num" /></label>
                <label v-if="ev.ledFaultCode != null" class="ef"><span class="ef-k">面板故障码</span><input v-model="ev.ledFaultCode" class="ea-in num" placeholder="A00" /></label>
                <label v-if="ev.invalidReading != null" class="ef"><span class="ef-k">无效读数</span><input v-model.number="ev.invalidReading" type="number" class="ea-in num" /></label>
                <label class="ef ef-grow"><span class="ef-k">告警字典条目<i class="i" title="EventKeyId：决定告警在字典中的文案与等级映射，首项为推荐。">i</i></span>
                  <select v-model="ev.eventKeyId" class="disc-sel wide">
                    <option v-for="(o, oi) in keyOptions(openCfg)" :key="o" :value="o">{{ o }}{{ oi === 0 ? '（推荐）' : '' }}</option>
                  </select>
                </label>
                <button v-if="ev.levelField && thrValue(openCfg, ev.levelField) == null" class="ev-fix" @click="ensureThreshold(openCfg, ev.levelField)">该档未设 · 设推荐</button>
              </div>
            </div>
          </template>
          <template v-else>
            <div v-for="ev in openCfg.events" :key="ev.id" class="ev-edit" :class="{ inactive: !ev.enabled, focused: focusEventKey === ev.eventKeyId }">
              <div class="ev-head">
                <label class="ev-en" title="是否产出该事件"><input type="checkbox" class="sw" v-model="ev.enabled" /><span class="ev-en-l">启用</span></label>
                <button class="ev-del" title="删除该事件" @click="removeEvent(openCfg, ev.id)">✕</button>
              </div>
              <div class="ev-fields">
                <label class="ef ev-nm"><span class="ef-k">名称</span><input v-model="ev.label" type="text" class="thr-in wnm" placeholder="事件名" /></label>
                <label class="ef"><span class="ef-k">触发值<i class="i" title="读数命中该值即告警；离散量一般 1=置位/故障，0=不在位。">i</i></span>
                  <span class="ef-ctl"><input v-model.number="ev.condition" type="number" class="thr-in w" /><i class="thr-reco">荐{{ QUANTITIES[openCfg.quantityKey].recommend.condition ?? 1 }}</i></span>
                </label>
                <label class="ef"><span class="ef-k">方向<i class="i" :title="operatorDesc(ev.operatorId)">i</i></span>
                  <select v-model.number="ev.operatorId" class="disc-sel">
                    <option v-for="o in OPERATORS" :key="o.id" :value="o.id">{{ o.symbol }} {{ o.label }}{{ o.id === QUANTITIES[openCfg.quantityKey].recommend.operatorId ? '（推荐）' : '' }}</option>
                  </select>
                </label>
                <label class="ef"><span class="ef-k">分级<i class="i" :title="severityDesc(ev.severity)">i</i></span>
                  <select v-model="ev.severity" class="disc-sel">
                    <option v-for="s in SEVERITIES" :key="s.v" :value="s.v">{{ s.label }}</option>
                  </select>
                </label>
                <label v-if="ev.component != null" class="ef"><span class="ef-k">归属 FRU</span><input v-model="ev.component" class="ea-in" placeholder="Component_*" /></label>
                <label v-if="ev.evHysteresis != null" class="ef"><span class="ef-k">迟滞</span><input v-model.number="ev.evHysteresis" type="number" class="ea-in num" /></label>
                <label v-if="ev.ledFaultCode != null" class="ef"><span class="ef-k">面板故障码</span><input v-model="ev.ledFaultCode" class="ea-in num" placeholder="A00" /></label>
                <label v-if="ev.invalidReading != null" class="ef"><span class="ef-k">无效读数</span><input v-model.number="ev.invalidReading" type="number" class="ea-in num" /></label>
                <label class="ef ef-grow"><span class="ef-k">告警字典条目<i class="i" title="EventKeyId：决定告警在字典中的文案与等级映射，首项为推荐。">i</i></span>
                  <select v-model="ev.eventKeyId" class="disc-sel wide">
                    <option v-for="(o, oi) in keyOptions(openCfg)" :key="o" :value="o">{{ o }}{{ oi === 0 ? '（推荐）' : '' }}</option>
                  </select>
                </label>
              </div>
            </div>
          </template>
          <!-- DiscreteEvent_*：该离散传感器关联的 IPMI SEL 生成事件（来自 .sr，只读） -->
          <template v-if="!isThreshold(openCfg) && openCfg.selEvents && openCfg.selEvents.length">
            <div class="sc-sec-cap">SEL 事件<span class="sc-explain">IPMI 系统事件日志生成（DiscreteEvent，来自 .sr，只读）</span></div>
            <div class="sel-list">
              <div v-for="s in openCfg.selEvents" :key="s.name" class="sel-row"><code>{{ s.name }}</code><span class="sel-sum">{{ s.summary }}</span></div>
            </div>
          </template>
          <div v-for="w in openEntry.warnings" :key="w" class="fn-warn">{{ w }}</div>
        </div>
      </div>

      <!-- ② 独立事件（不经传感器，直连器件数据源）-->
      <div v-else-if="openLooseId && openLooseEvent" class="cfg-card cfg-card-sm">
        <div class="cfg-head">
          <span class="cfg-ic event"><svg viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"/></svg></span>
          <div class="cfg-tt">
            <span class="cfg-title">{{ openLooseEvent.label }}<span class="cfg-badge">独立事件</span></span>
            <span class="cfg-sub">{{ openLooseEvent.eventKeyId }} · 不经传感器，直连器件数据源</span>
          </div>
          <button class="cfg-x" title="关闭 (Esc)" @click="closeFocus">✕</button>
        </div>
        <div class="cfg-body">
          <div class="ev-edit">
            <div class="ev-head">
              <label class="ev-en" title="是否产出该事件"><input type="checkbox" class="sw" v-model="openLooseEvent.enabled" /><span class="ev-en-l">启用</span></label>
            </div>
            <div class="ev-fields">
              <label class="ef ev-nm"><span class="ef-k">名称</span><input v-model="openLooseEvent.label" type="text" class="thr-in wnm" placeholder="事件名" /></label>
              <label class="ef"><span class="ef-k">触发值<i class="i" title="读数命中该值即告警（电压限值 / PMBus 状态位 / 在位标志）。">i</i></span>
                <input v-model.number="openLooseEvent.condition" type="number" class="thr-in w" />
              </label>
              <label class="ef"><span class="ef-k">方向<i class="i" :title="operatorDesc(openLooseEvent.operatorId)">i</i></span>
                <select v-model.number="openLooseEvent.operatorId" class="disc-sel">
                  <option v-for="o in OPERATORS" :key="o.id" :value="o.id">{{ o.symbol }} {{ o.label }}</option>
                </select>
              </label>
              <label class="ef"><span class="ef-k">分级<i class="i" :title="severityDesc(openLooseEvent.severity)">i</i></span>
                <select v-model="openLooseEvent.severity" class="disc-sel">
                  <option v-for="s in SEVERITIES" :key="s.v" :value="s.v">{{ s.label }}</option>
                </select>
              </label>
              <label v-if="openLooseEvent.component != null" class="ef"><span class="ef-k">归属 FRU</span><input v-model="openLooseEvent.component" class="ea-in" placeholder="Component_*" /></label>
              <label v-if="openLooseEvent.evHysteresis != null" class="ef"><span class="ef-k">迟滞</span><input v-model.number="openLooseEvent.evHysteresis" type="number" class="ea-in num" /></label>
              <label v-if="openLooseEvent.ledFaultCode != null" class="ef"><span class="ef-k">面板故障码</span><input v-model="openLooseEvent.ledFaultCode" class="ea-in num" placeholder="A00" /></label>
              <label v-if="openLooseEvent.invalidReading != null" class="ef"><span class="ef-k">无效读数</span><input v-model.number="openLooseEvent.invalidReading" type="number" class="ea-in num" /></label>
              <label v-for="(a, ai) in openLooseEvent.descArgs" :key="ai" class="ef"><span class="ef-k">参数{{ ai + 1 }}</span><input v-model="openLooseEvent.descArgs![ai]" class="ea-in" /></label>
              <label class="ef ef-grow"><span class="ef-k">告警字典条目<i class="i" title="EventKeyId：决定告警在字典中的文案与等级映射，首项为推荐。">i</i></span><input v-model="openLooseEvent.eventKeyId" type="text" class="thr-in wkey" placeholder="Namespace.EventName" /></label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自绘 hover 卡：器件 / 传感器 / 事件 悬停要点（原生 title 太隐蔽） -->
    <div v-if="tip.show" class="hover-tip" :style="{ left: tip.x + 'px', top: tip.y + 'px' }">
      <div class="ht-head">{{ tip.head }}</div>
      <div v-if="tip.sub" class="ht-sub">{{ tip.sub }}</div>
      <div v-for="r in tip.rows" :key="r.k" class="ht-row"><span class="ht-k">{{ r.k }}</span><span class="ht-v">{{ r.v }}</span></div>
    </div>
  </div>
</template>

<style scoped>
.alarm-view { padding: 12px 14px; color: var(--foreground); font-size: 13px; }

/* 顶部工具条 + 快速新增浮窗 */
.alarm-toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.tb-tag { flex: none; font-size: 11px; padding: 1px 9px; border-radius: var(--radius-pill); background: var(--surface-2); color: var(--foreground-secondary); }
.tb-src { flex: none; font-size: 12px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tb-note { min-width: 0; font-size: 11px; color: var(--foreground-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.add-open2 { margin-left: auto; flex: none; }
.add-open { flex: none; }
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
/* 告警模板卡：一键落成完整告警链，卡上写明模板产出什么 */
.tpl-hint { font-size: 10.5px; color: var(--foreground-muted); margin-bottom: 8px; }
.tpl-list { display: flex; flex-direction: column; gap: 6px; }
.tpl-card { all: unset; box-sizing: border-box; cursor: pointer; display: flex; flex-direction: column; gap: 3px; padding: 8px 11px; border-radius: var(--radius-md); background: var(--surface-3); transition: background .12s; }
.tpl-card:hover { background: var(--surface-4); }
.tpl-card:focus-visible { box-shadow: 0 0 0 2px var(--focus-ring); }
.tpl-card.used { opacity: .45; cursor: default; }
.tpl-card.all { background: color-mix(in srgb, var(--primary) 14%, var(--surface-3)); }
.tpl-name { font-size: 12px; font-weight: 600; color: var(--foreground); display: flex; align-items: center; gap: 7px; }
.tpl-tag { font-size: 9px; font-weight: 500; padding: 1px 7px; border-radius: var(--radius-pill); background: var(--surface-1); color: var(--foreground-muted); }
.tpl-desc { font-size: 10.5px; color: var(--foreground-muted); }
.num { padding: 6px 9px; background: var(--surface-1); color: var(--foreground); border-radius: var(--radius-md); width: 100px; }
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

/* ── 横向泳道大图：器件(170) → 传感器(230) → 事件(flex)，连线关联 ── */
.flow-list { position: relative; display: flex; flex-direction: column; gap: 4px; }
/* 泳道标签：轻量、无表格线，只作方位提示，融进下方流图 */
.lane-head { position: sticky; top: 0; z-index: 3; display: flex; gap: 18px; padding: 2px 4px 6px; background: var(--background); }
.lane-head > *, .lh-sensor, .lh-event { font-size: 9.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--foreground-muted); }
.lh-chip { flex: none; width: 170px; }
.lh-se { flex: 1; display: flex; gap: 14px; min-width: 0; }
.lh-sensor { flex: none; width: 230px; padding-left: 12px; }
.lh-event { flex: 1; padding-left: 12px; }
.lane-head.no-chip .lh-se { gap: 14px; }
.obj-block { position: relative; display: flex; flex-direction: row; align-items: stretch; gap: 18px; padding: 14px 4px; }
.obj-block + .obj-block { border-top: 1px solid rgba(255,255,255,0.06); }

/* 连线层：绝对铺满对象块，画在节点之下 */
.conn-layer { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 0; }
.conn { fill: none; stroke: color-mix(in srgb, var(--foreground-muted) 42%, transparent); stroke-width: 1.5; transition: stroke .12s, stroke-width .12s, opacity .12s; }
.conn.active { stroke: var(--primary); stroke-width: 2; }
.conn.dim { opacity: .22; }
/* 器件→分类(独立事件)虚线：默认隐藏避免穿过传感器区显乱，hover 分类时才显 */
.conn.dashed { stroke-dasharray: 4 5; stroke: color-mix(in srgb, var(--foreground-muted) 30%, transparent); opacity: 0; }
.conn.dashed.active { opacity: 1; stroke: var(--primary); }

/* 泳道一：数据源器件(芯片) 节点，置于块顶，扇出到传感器/事件泳道 */
.chip-node { position: relative; z-index: 1; flex: none; width: 170px; align-self: flex-start; display: flex; flex-direction: column; gap: 3px; padding: 11px 12px; border-radius: var(--radius-lg); background: var(--surface-3); }
.cn-ic { display: inline-flex; }
.cn-ic svg { width: 20px; height: 20px; fill: var(--foreground-secondary); }
.cn-ic.fw svg { fill: var(--foreground-muted); }
.cn-name { font-size: 12px; font-weight: 600; font-family: ui-monospace, monospace; color: var(--foreground); word-break: break-all; line-height: 1.3; }
.cn-type { font-size: 10px; color: var(--foreground-muted); }
.cn-cnt { margin-top: 3px; align-self: flex-start; font-size: 10px; color: var(--foreground-secondary); padding: 1px 8px; border-radius: var(--radius-pill); background: var(--surface-1); }

/* ── 泳道二：传感器 ⟶ 泳道三：事件（不套行卡，节点间用连线关联） ── */
.se-cols { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.se-row { display: flex; align-items: center; gap: 14px; padding: 2px 0; }
.se-row.loose-row { align-items: flex-start; }

/* 泳道二：传感器节点卡（固定宽度，与表头对齐；与事件不共卡，靠连线关联） */
.se-sensor { flex: none; width: 230px; min-width: 0; display: flex; align-items: center; gap: 6px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.05); }
.se-sensor.se-empty { align-items: flex-start; }
.se-none { font-size: 11px; line-height: 1.5; color: var(--foreground-muted); }
.sensor-card { all: unset; cursor: pointer; box-sizing: border-box; flex: 1; min-width: 0; display: flex; align-items: center; gap: 7px; padding: 7px 9px; border-radius: var(--radius-md); background: var(--surface-3); transition: background var(--duration-fast) var(--easing-default), box-shadow var(--duration-fast) var(--easing-default); }
.sensor-card:hover { background: var(--surface-4); }
.se-row.hot .sensor-card, .se-row.open .sensor-card { box-shadow: inset 0 0 0 1px var(--primary); }
.sc-ic { display: inline-flex; flex: none; }
.sc-ic svg { width: 15px; height: 15px; fill: var(--primary); }
.se-row.discrete .sc-ic svg { fill: var(--warning); }
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

/* 泳道三：事件节点卡换行扇出，铃铛图标按严重度着色；左侧泳道分隔线 */
.se-events { flex: 1; min-width: 0; align-self: stretch; display: flex; flex-direction: row; flex-wrap: wrap; align-content: center; align-items: center; gap: 6px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.05); }
.event-node { display: inline-flex; align-items: center; gap: 5px; max-width: 100%; padding: 3px 8px; border-radius: var(--radius-md); background: var(--surface-2); font-size: 10.5px; color: var(--foreground); }
.event-node.none { color: var(--foreground-muted); }
.en-ic { display: inline-flex; flex: none; color: var(--foreground-muted); }
.en-ic svg { width: 12px; height: 12px; fill: currentColor; }
.en-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.event-node.Minor .en-ic { color: var(--warning); }
.event-node.Major .en-ic { color: color-mix(in srgb, var(--warning) 55%, var(--danger)); }
.event-node.Critical .en-ic { color: var(--danger); }
.event-node.open { background: var(--surface-3); box-shadow: inset 0 0 0 1px var(--primary); }
.event-node.off { opacity: .5; }
.en-op { flex: none; font-family: ui-monospace, monospace; font-size: 10.5px; color: var(--foreground-secondary); }

/* 配置：聚焦浮层卡（点传感器/事件都弹这张实底卡；复用 add-pop 的 fixed 浮层套路） */
.cfg-backdrop { position: fixed; inset: 0; z-index: 400; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(1.5px); }
.cfg-card { display: flex; flex-direction: column; width: min(660px, 100%); max-height: min(80vh, 720px); border-radius: var(--radius-lg); background: var(--background-elevated); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-lg); overflow: hidden; }
.cfg-card-sm { width: min(540px, 100%); }
.cfg-head { flex: none; display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.cfg-ic { flex: none; width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: var(--surface-2); }
.cfg-ic svg { width: 16px; height: 16px; }
.cfg-ic.sensor svg { fill: var(--primary); }
.cfg-ic.event svg { fill: var(--warning); }
.cfg-tt { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.cfg-title { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--foreground); font-family: ui-monospace, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cfg-badge { flex: none; font-family: var(--font-sans); font-weight: 500; font-size: 10px; padding: 1px 8px; border-radius: var(--radius-pill); background: var(--surface-3); color: var(--foreground-secondary); }
.cfg-sub { font-size: 11px; color: var(--foreground-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cfg-x { all: unset; flex: none; cursor: pointer; width: 26px; height: 26px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--foreground-muted); font-size: 14px; }
.cfg-x:hover { background: var(--state-hover); color: var(--foreground); }
.cfg-body { flex: 1; min-height: 0; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
/* 配置引导：待配置横幅 + 链路步骤头 */
.cfg-todo { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; padding: 8px 11px; border-radius: var(--radius-md); background: color-mix(in srgb, var(--warning) 14%, transparent); font-size: 11px; color: var(--foreground); }
.todo-ic { flex: none; width: 15px; height: 15px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; background: var(--warning); color: #1a1a1a; }
.todo-t { font-weight: 600; margin-right: 2px; }
.todo-chip { all: unset; cursor: pointer; font-size: 10.5px; padding: 2px 9px; border-radius: var(--radius-pill); background: color-mix(in srgb, var(--warning) 24%, transparent); color: var(--warning); }
.todo-chip:hover { background: color-mix(in srgb, var(--warning) 36%, transparent); }
.chain-step { display: flex; align-items: center; gap: 8px; margin-top: 4px; font-size: 12px; font-weight: 600; color: var(--foreground); scroll-margin-top: 8px; }
.cs-n { flex: none; width: 18px; height: 18px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 10px; background: var(--surface-3); color: var(--foreground-secondary); }
.chain-step.todo .cs-n { background: var(--warning); color: #1a1a1a; }
.cs-t { flex: 1; }
.cs-st { flex: none; font-size: 10px; font-weight: 500; padding: 1px 8px; border-radius: var(--radius-pill); background: var(--surface-3); color: var(--foreground-muted); }
.cs-st.ok { background: color-mix(in srgb, var(--success) 18%, transparent); color: var(--success); }
.chain-step.todo .cs-st { background: color-mix(in srgb, var(--warning) 20%, transparent); color: var(--warning); }
/* 点事件进入：仅滚动定位到对应事件行（不加发光框，反馈靠勾选态即可） */
.sc-focus-hint { font-size: 10px; color: var(--foreground-muted); }
.ev-edit.focused .ev-en .sw { outline: 2px solid color-mix(in srgb, var(--primary) 60%, transparent); outline-offset: 2px; }

/* 自绘 hover 卡（器件 / 传感器 / 事件）：跟随元素左下浮出，实底可读 */
.hover-tip { position: fixed; z-index: 500; width: max-content; max-width: 320px; padding: 9px 11px; border-radius: var(--radius-md); background: var(--background-elevated); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-lg); pointer-events: none; display: flex; flex-direction: column; gap: 3px; }
.ht-head { font-size: 12px; font-weight: 600; color: var(--foreground); font-family: ui-monospace, monospace; }
.ht-sub { font-size: 10.5px; color: var(--foreground-secondary); margin-bottom: 3px; }
.ht-row { display: flex; gap: 8px; font-size: 11px; line-height: 1.5; }
.ht-k { flex: none; width: 46px; color: var(--foreground-muted); }
.ht-v { flex: 1; color: var(--foreground-secondary); word-break: break-word; }

/* 独立事件区（无传感器）：事件泳道里按告警分类分色归拢——分类是事件的分组头，不作节点 */
.loose-events { flex-direction: column; align-items: stretch; gap: 12px; }
/* 无传感器块：中间列已去掉，事件区不再画左边分隔线/缩进，直接紧接（免误解） */
.se-row.loose-row.no-sensor .se-events { border-left: none; padding-left: 0; }
.cat-grp { display: flex; flex-direction: column; gap: 6px; padding-left: 10px; border-left: 2px solid var(--foreground-muted); }
.cat-grp.voltage  { border-left-color: var(--warning); }
.cat-grp.temp     { border-left-color: var(--danger); }
.cat-grp.presence { border-left-color: var(--primary); }
.cat-grp.chassis  { border-left-color: var(--success); }
.cat-grp.power    { border-left-color: var(--purple, #a78bfa); }
.cat-grp.system   { border-left-color: color-mix(in srgb, var(--primary) 60%, var(--success)); }
.cat-head { display: flex; align-items: center; gap: 7px; cursor: default; }
.cat-head.hot .cat-name { color: var(--primary); }
.cat-dot { flex: none; width: 8px; height: 8px; border-radius: var(--radius-pill); background: var(--foreground-muted); }
.cat-head.voltage  .cat-dot { background: var(--warning); }
.cat-head.temp     .cat-dot { background: var(--danger); }
.cat-head.presence .cat-dot { background: var(--primary); }
.cat-head.chassis  .cat-dot { background: var(--success); }
.cat-head.power    .cat-dot { background: var(--purple, #a78bfa); }
.cat-head.system   .cat-dot { background: color-mix(in srgb, var(--primary) 60%, var(--success)); }
.cat-name { flex: none; font-size: 12px; font-weight: 600; }
.cat-n { flex: none; font-size: 10px; font-weight: 600; padding: 0 7px; border-radius: var(--radius-pill); background: var(--surface-3); color: var(--foreground); }
.cat-chips { display: flex; flex-wrap: wrap; gap: 6px; }

.branch-del { all: unset; cursor: pointer; flex: none; align-self: center; color: var(--foreground-muted); font-size: 12px; padding: 2px 6px; border-radius: var(--radius-sm); opacity: 0; transition: opacity .12s, color .12s, background .12s; }
.se-row:hover .branch-del, .branch-del:focus-visible { opacity: 1; }
.branch-del:hover { color: var(--danger); background: var(--state-hover); }

/* 配置卡内小节标题 */
.sc-sec-cap { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--foreground-secondary); }
.sc-explain { font-size: 11px; color: var(--foreground-muted); font-weight: 400; }

.fn-thr { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.thr-pill { display: flex; align-items: center; gap: 4px; padding: 4px 7px; border-radius: 8px; background: var(--surface-3); }
.thr-pill.off { opacity: .5; }
.thr-l { font-size: 11px; color: var(--foreground-muted); }
.thr-in { all: unset; box-sizing: border-box; width: 46px; text-align: center; font-size: 12px; color: var(--foreground); background: var(--surface-1); border-radius: var(--radius-sm); padding: 4px; }
.thr-in:focus-visible { box-shadow: 0 0 0 2px var(--focus-ring); }
.thr-in.w { width: 78px; text-align: left; padding: 5px 7px; }
.thr-reco { font-size: 11px; color: var(--foreground-muted); font-style: normal; }
.thr-unit { font-size: 11px; color: var(--foreground-muted); }
.disc-note { font-size: 11px; color: var(--foreground-muted); }

.mf { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.mf > label { flex: none; width: 52px; font-size: 11px; color: var(--foreground-secondary); }
.mf-desc { font-size: 11px; color: var(--foreground-muted); }
.disc-sel { padding: 6px 26px 6px 9px; border-radius: var(--radius-md); font-size: 11px; color: var(--foreground); background-color: var(--surface-1); border: none; cursor: pointer; -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3Cpath%20d='M7%2010l5%205%205-5z'%20fill='%23808080'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; background-size: 12px; }
.disc-sel:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--focus-ring); }
.disc-sel.wide { flex: 1; min-width: 120px; }
.scan-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.scan-grid label { display: flex; flex-direction: column; gap: 3px; font-size: 11px; color: var(--foreground-muted); }
.fn-warn { font-size: 11px; color: var(--warning); }

/* 事件编辑 */
.ev-add { all: unset; cursor: pointer; margin-left: auto; font-size: 11px; color: var(--foreground-secondary); padding: 3px 10px; border-radius: 999px; background: var(--surface-3); }
/* 事件卡：启用单独一行(头部) + 字段行(标签+控件对齐) + .sr 关联行 */
.ev-edit { display: flex; flex-direction: column; gap: 9px; padding: 10px 12px; border-radius: var(--radius-md); background: var(--surface-2); }
.ev-edit.inactive { opacity: .55; }
.ev-head { display: flex; align-items: center; justify-content: space-between; }
.ev-fields { display: flex; align-items: flex-start; flex-wrap: wrap; gap: 8px 14px; }
.ef { display: flex; flex-direction: column; gap: 5px; font-size: 11px; color: var(--foreground-muted); }
.ef-grow { flex: 1; min-width: 180px; }
.ef-lv { min-width: 128px; }
.ef-k { display: flex; align-items: center; gap: 3px; height: 15px; line-height: 15px; white-space: nowrap; }
.ef-ctl { display: flex; align-items: center; gap: 6px; }
.ev-en { display: flex; flex-direction: row; align-items: center; gap: 8px; cursor: pointer; }
.ev-en-l { font-size: 11px; color: var(--foreground-secondary); }
.ev-nm { flex: 1 1 160px; }
/* 启用：统一为开关（原勾选框） */
.sw { all: unset; box-sizing: border-box; position: relative; width: 32px; height: 18px; border-radius: 999px; background: var(--surface-4, #3a3a3a); cursor: pointer; flex: none; transition: background .15s; }
.sw::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .15s; }
.sw:checked { background: var(--primary); }
.sw:checked::after { transform: translateX(14px); }
.sw:focus-visible { box-shadow: 0 0 0 2px var(--focus-ring); }
.ef-ref { display: flex; flex-wrap: wrap; flex-direction: row; align-items: center; gap: 6px; font-size: 11px; color: var(--foreground-muted); flex-basis: 100%; padding-left: 2px; }
.ef-dir { font-size: 12px; color: var(--foreground-secondary); padding: 6px 0; }
.ef-ref code { font-family: ui-monospace, monospace; color: var(--foreground-secondary); background: var(--surface-3); padding: 1px 6px; border-radius: var(--radius-sm); }
.ev-fix { all: unset; cursor: pointer; align-self: flex-end; font-size: 11px; color: var(--warning); padding-bottom: 5px; }
.ev-del { all: unset; cursor: pointer; color: var(--foreground-muted); font-size: 13px; padding: 2px 6px; border-radius: var(--radius-sm); }
.ev-del:hover { color: var(--danger); background: var(--state-hover); }
.thr-in.wnm { width: 100%; min-width: 0; text-align: left; padding: 5px 7px; }
.thr-in.wkey { width: 100%; text-align: left; padding: 5px 7px; font-family: ui-monospace, monospace; }
/* 就近提示行：铺在该事件行控件下方，解释各下拉含义 */
.ev-hint { flex-basis: 100%; display: flex; flex-wrap: wrap; gap: 3px 16px; margin-top: 4px; padding-top: 7px; border-top: 1px dashed rgba(255, 255, 255, 0.08); font-size: 10.5px; line-height: 1.5; color: var(--foreground-muted); }
.ev-hint code { font-family: ui-monospace, monospace; color: var(--foreground-secondary); background: var(--surface-3); padding: 0 5px; border-radius: var(--radius-sm); }
.ev-hint .ev-fix { margin-left: 6px; }
/* 来自 .sr 的真实关联/可调项（可编辑）：标题一行 + 字段区（与上面配置字段同款：标签在上，控件在下） */
/* .sr 导入的字段（FRU/迟滞/面板码/参数…）与其余配置一视同仁，混在同一字段区，无特殊底色/标题 */
.ea-in { all: unset; box-sizing: border-box; min-width: 72px; max-width: 220px; font-size: 11px; color: var(--foreground); background: var(--surface-1); border-radius: var(--radius-sm); padding: 5px 8px; font-family: ui-monospace, monospace; }
.ea-in.num { width: 72px; }
.ea-in:focus-visible { box-shadow: 0 0 0 2px var(--focus-ring); }
/* DiscreteEvent（SEL 生成）只读列表 */
.sel-list { display: flex; flex-direction: column; gap: 4px; }
.sel-row { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: var(--radius-md); background: var(--surface-2); font-size: 11px; }
.sel-row code { font-family: ui-monospace, monospace; color: var(--foreground); }
.sel-sum { color: var(--foreground-muted); }

/* 代码 / 复制CSR：固定在内容区右下角的浮层（吸底右对齐，滚动时常驻在上面） */
.cfg-actions-float { position: sticky; bottom: 6px; z-index: 6; display: flex; justify-content: flex-end; margin-top: 12px; pointer-events: none; }
.cfg-actions-float .fa-group { pointer-events: auto; display: flex; gap: 8px; padding: 7px; border-radius: var(--radius-lg); background: color-mix(in srgb, var(--background-elevated) 88%, transparent); box-shadow: var(--shadow-lg); backdrop-filter: blur(6px); }
.btn-ic { width: 13px; height: 13px; fill: currentColor; }

/* 事件节点卡可点击（展开其传感器配置） */
button.event-node { border: none; font: inherit; cursor: pointer; text-align: left; }
button.event-node:hover { background: var(--surface-2); }
button.event-node:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--focus-ring); }

/* ── 独立事件（不经传感器）：按数据源器件分组，逐条点击配置 ── */
.loose-wrap { margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 10px; }
.loose-head { display: flex; align-items: center; gap: 8px; }
.lh-t { flex: none; font-size: 12px; font-weight: 600; color: var(--foreground); }
.lh-sub { flex: 1; min-width: 0; font-size: 11px; color: var(--foreground-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lh-n { flex: none; font-size: 11px; padding: 1px 8px; border-radius: var(--radius-pill); background: var(--surface-3); color: var(--foreground-secondary); }
.loose-group { display: flex; flex-direction: column; gap: 6px; padding: 10px; border-radius: var(--radius-lg); background: var(--surface-1); }
.lg-cap { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--foreground-secondary); font-family: ui-monospace, monospace; }
.lg-n { font-size: 10px; padding: 0 6px; border-radius: var(--radius-pill); background: var(--surface-3); color: var(--foreground-muted); }
.lg-events { display: flex; flex-wrap: wrap; gap: 6px; }
.levt { all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: var(--radius-md); background: var(--surface-2); font-size: 11px; color: var(--foreground-secondary); transition: background var(--duration-fast) var(--easing-default), box-shadow var(--duration-fast) var(--easing-default); }
.levt:hover { background: var(--surface-3); }
.levt.open { background: var(--surface-3); box-shadow: inset 0 0 0 1px var(--primary); }
.levt.off { opacity: .5; }
.levt:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--focus-ring); }
.levt .en-ic { display: inline-flex; flex: none; color: var(--foreground-muted); }
.levt .en-ic svg { width: 12px; height: 12px; fill: currentColor; }
.levt.Minor .en-ic { color: var(--warning); }
.levt.Major .en-ic { color: color-mix(in srgb, var(--warning) 55%, var(--danger)); }
.levt.Critical .en-ic { color: var(--danger); }
.levt-l { max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.levt-op { flex: none; font-family: ui-monospace, monospace; color: var(--foreground-muted); }
.levt-edit { flex: 1 0 100%; display: flex; align-items: center; flex-wrap: wrap; gap: 10px; padding: 10px; border-radius: var(--radius-md); background: var(--surface-2); }
.levt-key { font-family: ui-monospace, monospace; font-size: 11px; color: var(--foreground-secondary); background: var(--surface-3); padding: 2px 8px; border-radius: var(--radius-sm); word-break: break-all; }

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
