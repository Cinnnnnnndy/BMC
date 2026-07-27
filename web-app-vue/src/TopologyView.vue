<script setup lang="ts">
// Unified topology view.
// Layout: BMC → EXU → board groups (left → right, mind-map style).
// Each card shows inline: header + SN/PN dropdown + I2C bus / mux / chip tree.
import { computed, markRaw, nextTick, onMounted, provide, readonly, ref, watch } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background, BackgroundVariant } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';

import BmcNode        from './nodes/BmcNode.vue';
import BoardGroupNode  from './nodes/BoardGroupNode.vue';
import ManhattanEdge   from './nodes/ManhattanEdge.vue';
import AlarmConfigView from './views/AlarmConfigView.vue';
import { boardAlarm } from './alarm/alarmStore';
import { loadBoardOnce, boardChipDevices } from './alarm/srSeed';
import { boardRollup, chassisEvents, thresholdInconsistencies, boardSoftDetail, type BoardRollup } from './alarm/chassisAggregate';
import { getTopology } from './data/boardTopologies';
import { chipTypeLabel } from './data/srParser';

import { buildMindmap } from './data/mindmap';
import { smcTarget, inferFunc, exprTemplate, coolingEntities } from './data/toolContext';
import {
  STATE_LABEL,
  STATE_COLOR,
  TYPE_LABEL,
  type BoardGroup,
  type BoardRecord,
  type ResolutionState,
} from './data/boards';
import { BUS_LEGEND } from './data/palette';
import { useLinkage } from './composables/useLinkage';

const { state: link, invoke } = useLinkage();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNode = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEdge = any;

// ── Node types ─────────────────────────────────────────────────────────
const nodeTypes = {
  bmc:        markRaw(BmcNode),
  boardgroup: markRaw(BoardGroupNode),
};

const edgeTypes = {
  manhattan: markRaw(ManhattanEdge),
};

const { fitView } = useVueFlow();

// ── State ──────────────────────────────────────────────────────────────
const selectedByGroup = ref<Record<string, string>>({});
const activeNode      = ref<AnyNode | null>(null);

// Tracks the single selected edge id. Provided to ManhattanEdge via inject so all
// other edges dim. Trunk (smoothstep) is unaffected — it stays visible as "upstream".
const activeEdgeId = ref<string | null>(null);
provide('activeEdgeId', readonly(activeEdgeId));
/** Groups plucked into the sidebar list only (state='unclassified'). */
const unclassifiedGroups = ref<BoardGroup[]>([]);
/** Id of the unclassified group currently being assigned (shows a popover). */
const assigningId = ref<string | null>(null);

function handleSelect(groupId: string, boardId: string) {
  selectedByGroup.value = { ...selectedByGroup.value, [groupId]: boardId };
  nodes.value = nodes.value.map((n) =>
    n.id === groupId ? { ...n, data: { ...n.data, selectedId: boardId } } : n,
  );
}

const built = buildMindmap(handleSelect, selectedByGroup.value);
const nodes = ref<AnyNode[]>(built.nodes);
const edges = ref<AnyEdge[]>(built.edges);
unclassifiedGroups.value = built.unclassifiedGroups;

onMounted(() => setTimeout(() => fitView({ padding: 0.10 }), 80));

// ── Sidebar sections: group by state ───────────────────────────────────
const canvasGroups = computed<BoardGroup[]>(() =>
  built.groups.filter((g) => g.state !== 'unclassified'),
);
const groupsByState = computed<Record<ResolutionState, BoardGroup[]>>(() => {
  const acc: Record<ResolutionState, BoardGroup[]> = {
    'resolved': [],
    'multi-match': [],
    'type-placeholder': [],
    'missing': [],
    'unclassified': unclassifiedGroups.value,
  };
  for (const g of canvasGroups.value) acc[g.state].push(g);
  return acc;
});

/** Bottom-line summary counts (like the "检查" panel in 图一). */
const stateCounts = computed(() => ({
  'resolved':         groupsByState.value.resolved.length,
  'multi-match':      groupsByState.value['multi-match'].length,
  'type-placeholder': groupsByState.value['type-placeholder'].length,
  'missing':          groupsByState.value.missing.length,
  'unclassified':     groupsByState.value.unclassified.length,
}));

// ── 硬件管理器：按板卡类别组织的文件树（资源管理器风格） ───────────
const CAT_ORDER = ['BCU', 'CLU', 'EXU', 'IEU', 'SEU', 'NICCard', 'Unknown'];
const expandedCats   = ref<Record<string, boolean>>(Object.fromEntries(CAT_ORDER.map((c) => [c, true])));
const expandedGroups = ref<Record<string, boolean>>({});
const hwSearchQuery  = ref<string>('');
/** 硬件管理器左树可折叠为窄条（对齐 CSR 拓扑编辑器左树的交互）。 */
const paletteCollapsed = ref(false);

interface CatNode { type: string; label: string; groups: BoardGroup[]; boardCount: number }
const categoryTree = computed<CatNode[]>(() => {
  const all = [...canvasGroups.value, ...unclassifiedGroups.value];
  const byType = new Map<string, BoardGroup[]>();
  for (const g of all) {
    const t = g.type && TYPE_LABEL[g.type] ? g.type : 'Unknown';
    if (!byType.has(t)) byType.set(t, []);
    byType.get(t)!.push(g);
  }
  return CAT_ORDER.filter((t) => byType.has(t)).map((t) => ({
    type: t,
    label: TYPE_LABEL[t] ?? t,
    groups: byType.get(t)!,
    boardCount: byType.get(t)!.reduce((s, g) => s + g.boards.length, 0),
  }));
});

const filteredCategoryTree = computed<CatNode[]>(() => {
  const q = hwSearchQuery.value.trim().toLowerCase();
  if (!q) return categoryTree.value;
  return categoryTree.value
    .map((cat) => ({ ...cat, groups: cat.groups.filter((g) => g.name.toLowerCase().includes(q)) }))
    .filter((cat) => cat.groups.length > 0);
});

function toggleCat(t: string) {
  expandedCats.value = { ...expandedCats.value, [t]: !expandedCats.value[t] };
}
function toggleGroup(id: string) {
  expandedGroups.value = { ...expandedGroups.value, [id]: !expandedGroups.value[id] };
}
/** 组行点击：画布联动 + 展开/收起文件列表 */
function clickGroup(g: BoardGroup) {
  if (g.state !== 'unclassified') focusGroupInCanvas(g.id);
  if (g.boards.length) toggleGroup(g.id);
}
/** 文件行点击：切换该组当前展示的板卡实例并聚焦画布 */
function clickBoardFile(g: BoardGroup, b: BoardRecord) {
  handleSelect(g.id, b.id);
  focusGroupInCanvas(g.id);
}
/** 长文件名缩短显示：14060876_…1825.sr（title 保留全名） */
function shortFile(b: BoardRecord): string {
  return `${b.partNumber}_…${b.sn.slice(-4)}.sr`;
}

// ── Left-to-right sync ─────────────────────────────────────────────────
function focusGroupInCanvas(groupId: string) {
  // Highlight the matching canvas node and center on it.
  activeNode.value = nodes.value.find((n) => n.id === groupId) ?? null;
  const n = nodes.value.find((n) => n.id === groupId);
  if (n) {
    // Nudge VueFlow to keep the selected node visible. A real impl would
    // use setCenter(n.position.x, n.position.y, { zoom: 1 }); for now we
    // refit the view to include everything.
    setTimeout(() => fitView({ padding: 0.10, nodes: [n.id] }), 30);
  }
}

// ── Assign an unclassified group to a pending slot ─────────────────────
/** Pending slots = groups on canvas that still need user selection. */
const pendingSlots = computed<BoardGroup[]>(() =>
  canvasGroups.value.filter(
    (g) => g.state === 'type-placeholder' || g.state === 'missing',
  ),
);

function toggleAssign(uid: string) {
  assigningId.value = assigningId.value === uid ? null : uid;
}
function assignTo(unclassifiedId: string, slotId: string) {
  // Demo-only: remove from the unclassified list and flash the target slot.
  unclassifiedGroups.value = unclassifiedGroups.value.filter((g) => g.id !== unclassifiedId);
  assigningId.value = null;
  focusGroupInCanvas(slotId);
  // Real implementation would: rewrite the slot's state to 'resolved', bind
  // its Connector to the newly classified board, and re-emit the edge.
}

// ── Interactions ───────────────────────────────────────────────────────
function onNodeClick(ev: { node: AnyNode }) {
  activeNode.value = ev.node;
  activeEdgeId.value = null;
}
function onEdgeClick(ev: { edge: AnyEdge }) {
  const eid = ev.edge.id as string;
  activeEdgeId.value = activeEdgeId.value === eid ? null : eid;
}
function onPaneClick() {
  activeNode.value = null;
  activeEdgeId.value = null;
}
function handleResetLayout() {
  const next = buildMindmap(handleSelect, selectedByGroup.value);
  nodes.value = next.nodes;
  edges.value = next.edges;
  setTimeout(() => fitView({ padding: 0.10 }), 80);
}
function handleResetSelections() {
  const reset: Record<string, string> = {};
  for (const g of built.groups) {
    // Placeholder/missing groups may have empty boards arrays — skip them.
    if (g.boards[0]) reset[g.id] = g.boards[0].id;
  }
  selectedByGroup.value = reset;
  nodes.value = nodes.value.map((n) =>
    n.type === 'boardgroup' && reset[n.id]
      ? { ...n, data: { ...n.data, selectedId: reset[n.id] } }
      : n,
  );
}

// ── Property panel ─────────────────────────────────────────────────────
const activeGroup = computed<BoardGroup | null>(() => {
  const n = activeNode.value;
  if (!n || n.type !== 'boardgroup') return null;
  return n.data.group as BoardGroup;
});
const activeBoard = computed<BoardRecord | null>(() => {
  const g = activeGroup.value;
  if (!g || !g.boards.length) return null;
  const id = selectedByGroup.value[g.id] ?? g.boards[0].id;
  return g.boards.find((b) => b.id === id) ?? g.boards[0];
});

// Keep the code anchor in sync with the topology selection (two-way highlight).
watch(activeBoard, (b) => { link.selectedBoardId = b?.id ?? null; });

// 板卡配置面板 tab：详情 / 告警。告警+传感器是板卡级配置 → 作 tab 常驻；
// SMC 偏移量 / 表达式是「配置项辅助」→ 跟随对应配置项，不作 tab。
const panelTab = ref<'detail' | 'alarm'>('detail');
watch([activeGroup, panelTab], () => {
  if (panelTab.value === 'alarm' && activeGroup.value) {
    const g = activeGroup.value;
    link.inbound.alarm = { source: `${g.name} · ${g.type}`, boardType: g.type, boardName: g.name, ts: Date.now() };
  }
}, { immediate: true });

// 器件级配置：板卡 → 本板器件（物理芯片）列表；点芯片进入器件配置（按数据源芯片收窄）
// 器件 = ManagementTopology 里的物理芯片（SMC/LM75/Eeprom/CPLD/PCA9545…），只有点击才展开其配置。
interface PanelDevice { key: string; label: string; typeLabel: string; chipType?: string; bus?: string; sensorCount: number; eventCount: number; kind: 'chip' | 'firmware' }
const activeDevice = ref<PanelDevice | null>(null);
function computeDevicesFor(g: BoardGroup): PanelDevice[] {
  const real = boardChipDevices(g.name); // 来自真实 .sr（含每芯片传感器/独立事件数）
  let devs: PanelDevice[];
  if (real.length) {
    devs = real.map((c) => ({ key: c.name, label: c.name, typeLabel: c.typeLabel, chipType: c.type, bus: c.bus, sensorCount: c.sensorCount, eventCount: c.eventCount, kind: 'chip' as const }));
    // 固件/BIOS 推送（Reading=0 传感器 + 无数据源芯片的独立事件）单列一个通道设备
    const st = boardAlarm(g.name);
    const fwS = st.cfgs.filter((c) => !c.dsChip).length;
    const fwE = st.looseEvents.filter((e) => !e.dsChip).length;
    if (fwS || fwE) devs.push({ key: '__firmware', label: '固件 / BIOS 推送', typeLabel: '固件通道（非物理芯片）', chipType: 'firmware', sensorCount: fwS, eventCount: fwE, kind: 'firmware' });
  } else {
    // 未载入 .sr 明细的板：从拓扑推断芯片（按类型去重，传感器/事件数未知）
    const seen = new Set<string>();
    devs = [];
    for (const bus of getTopology(g.type, g.name).buses) {
      for (const c of [...bus.chips, ...(bus.mux?.chips ?? [])]) {
        if (seen.has(c.chipType)) continue; seen.add(c.chipType);
        devs.push({ key: c.chipType, label: c.label, typeLabel: chipTypeLabel(c.chipType), chipType: c.chipType, bus: bus.label, sensorCount: 0, eventCount: 0, kind: 'chip' });
      }
      if (bus.mux && !seen.has('Pca9545')) { seen.add('Pca9545'); devs.push({ key: 'Pca9545', label: bus.mux.label, typeLabel: chipTypeLabel('Pca9545'), chipType: 'Pca9545', bus: bus.label, sensorCount: 0, eventCount: 0, kind: 'chip' }); }
    }
  }
  return devs.sort((a, b) => (b.sensorCount + b.eventCount) - (a.sensorCount + a.eventCount));
}
const boardDevices = computed<PanelDevice[]>(() => activeGroup.value ? computeDevicesFor(activeGroup.value) : []);
// 告警 tab 上的数量：器件级取该器件，板卡级汇总全板（传感器数 / 告警事件数）
const alarmTabCount = computed<{ s: number; e: number }>(() => {
  if (activeDevice.value) return { s: activeDevice.value.sensorCount, e: activeDevice.value.eventCount };
  return boardDevices.value.reduce((a, d) => ({ s: a.s + d.sensorCount, e: a.e + d.eventCount }), { s: 0, e: 0 });
});

// 点击拓扑里的器件（芯片）→ 选中该板 + 打开该器件配置面板（区分板卡/器件入口）
const CHIP_TYPE_ALIAS: Record<string, string> = { smc: 'Smc', lm75: 'Lm75', eeprom: 'Eeprom', cpld: 'Cpld', pca9545: 'Pca9545', mux: 'Pca9545' };
function pickChip(g: BoardGroup, chip: { label: string; chipType: string }): void {
  const node = nodes.value.find((n) => n.type === 'boardgroup' && n.id === g.id);
  if (node) activeNode.value = node;
  loadBoardOnce(g.name);
  const devs = computeDevicesFor(g);
  const want = CHIP_TYPE_ALIAS[chip.chipType.toLowerCase()] || chip.chipType;
  const match = devs.find((d) => d.chipType === want)
    || devs.find((d) => d.label.toLowerCase() === chip.label.toLowerCase())
    || null;
  // activeGroup 变化会触发 watch 复位 activeDevice；用 nextTick 在其之后再设，避免被清掉
  nextTick(() => { activeDevice.value = match; panelTab.value = match && (match.sensorCount || match.eventCount) ? 'alarm' : 'detail'; });
}
provide('onChipPick', pickChip);
// 选中板卡：复位器件态；首次用真实 .sr 播种（使器件列表/告警立刻反映 .sr）
watch(activeGroup, (g) => {
  activeDevice.value = null;
  if (g) loadBoardOnce(g.name);
}, { immediate: true });

// 整机（Chassis）告警总览：现在常驻左侧「硬件管理器」，与「板卡分类」并列；
// 顶部放统计信息（跨板明细 + 机箱级事件 + 一致性），数据源与原浮层一致。
const allBoards = computed(() => nodes.value
  .filter((n) => n.type === 'boardgroup')
  .map((n) => { const g = n.data.group as BoardGroup; return { name: g.name, type: g.type }; }));
// 挂载即为每块画布板播种（使板卡/器件面板与总览同源、统计真实）
onMounted(() => { for (const b of allBoards.value) loadBoardOnce(b.name); });
const ovRows = computed(() => boardRollup());
const ovCEvents = computed(() => chassisEvents());
const ovIncons = computed(() => thresholdInconsistencies());
const ovTotalChips = computed(() => ovRows.value.reduce((n, r) => n + r.chips, 0));
const ovTotalSensors = computed(() => ovRows.value.reduce((n, r) => n + r.thresholdSensors + r.discreteSensors, 0));
const ovTotalEvents = computed(() => ovRows.value.reduce((n, r) => n + r.events, 0));
// 板卡明细按板名索引，供左侧「板卡分类」逐板内联显示（软硬件 + 机箱级放一起）
const rollupByName = computed(() => {
  const m = new Map<string, BoardRollup>();
  for (const r of ovRows.value) m.set(r.name, r);
  return m;
});
function rollupOf(name: string): BoardRollup | undefined { return rollupByName.value.get(name); }
function softOf(name: string) { return boardSoftDetail(name); }
/** 板卡组行的悬浮提示：来源 Connector + 该板软硬件计数（器件/门限/状态/事件/机箱）。 */
function groupTitle(g: BoardGroup): string {
  const base = g.connectorRef
    ? `来源 Connector：${g.connectorRef.parentGroupId} / ${g.connectorRef.connectorName}`
    : g.label;
  const r = rollupOf(g.name);
  if (!r) return base;
  const stats = `器件 ${r.chips} · 门限 ${r.thresholdSensors} · 状态 ${r.discreteSensors} · 事件 ${r.events}`
    + (r.chassisEvents ? ` · 机箱 ${r.chassisEvents}` : '');
  return `${base}\n${stats}`;
}

function ctxSource(): { source: string; detail?: string } {
  const g = activeGroup.value;
  const b = activeBoard.value;
  return {
    source: `${g?.name ?? '未知'} · ${g?.type ?? ''}`.trim(),
    detail: b ? `SN ${b.sn}` : undefined,
  };
}

// 偏移量寻址的对象是板上的 Smc 芯片 → 按板型推断功能码 + 定位目标 Smc
function wakeSmc() {
  const g = activeGroup.value;
  if (!g) return;
  const f = inferFunc(g.type, g.name);
  const tgt = smcTarget(g.type, g.name);
  const detail = [ctxSource().detail, tgt ? `Smc: ${tgt}` : null, f.label]
    .filter(Boolean).join(' · ');
  invoke('smc', { source: ctxSource().source, detail, func: f.func });
}
// sensor 的 expression 字段调试 → 按 sensor 芯片类型带入变换模板
function wakeExpr() {
  const g = activeGroup.value;
  if (!g) return;
  invoke('expr', { ...ctxSource(), expression: exprTemplate(g.type, g.name) });
}
// 风扇板 / 温度芯片 → 调速模板：沿拓扑取真实风扇与温区实体
function wakeCooling() {
  const g = activeGroup.value;
  const b = activeBoard.value;
  if (!g) return;
  const ent = b ? coolingEntities(b)
                : { fans: g.type === 'CLU' ? [`${g.name} 风扇组`] : [], tempZones: [] };
  invoke('cooling', { ...ctxSource(), fans: ent.fans, tempZones: ent.tempZones });
}
// 板卡告警：按板型推断可监控器件 → 可视化配门限 → 自动产生 CSR 对象
function wakeAlarm() {
  const g = activeGroup.value;
  if (!g) return;
  invoke('alarm', { ...ctxSource(), boardType: g.type, boardName: g.name });
}

// ── MiniMap colours ────────────────────────────────────────────────────
const TYPE_COLOR: Record<string, string> = {
  BCU: '#22c55e', CLU: '#f59e0b', EXU: '#a855f7',
  IEU: '#06b6d4', SEU: '#ec4899', NICCard: '#3b82f6',
  Unknown: '#6b7280',
};
function miniColor(n: AnyNode) {
  if (n.type === 'bmc') return '#4f6ef7';
  const g = n.data?.group as BoardGroup | undefined;
  return TYPE_COLOR[g?.type ?? 'Unknown'] ?? '#6b7280';
}

const totalBoards = computed(() => built.groups.reduce((s, g) => s + g.boards.length, 0));

function stateClass(state: ResolutionState): string {
  if (state === 'missing') return 'hw-count-err';
  if (state === 'resolved') return 'hw-count-ok';
  return 'hw-count-warn'; // multi-match, type-placeholder, unclassified
}
function catStateClass(cat: CatNode): string {
  if (cat.groups.some((g) => g.state === 'missing')) return 'hw-count-err';
  if (cat.groups.some((g) => g.state !== 'resolved')) return 'hw-count-warn';
  return 'hw-count-ok';
}
</script>

<template>
  <div class="topo-root">
    <!-- ── Left panel（对齐 CSR 拓扑编辑器左树：可折叠 + 整机总览汇总条）── -->
    <aside v-if="paletteCollapsed" class="topo-palette closed" title="展开硬件管理器" @click="paletteCollapsed = false">
      <svg class="rail-ic" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6.4 3.5 5.3 4.6 8.7 8l-3.4 3.4 1.1 1.1L10.9 8 6.4 3.5z"/></svg>
    </aside>
    <aside v-else class="topo-palette open">
      <!-- ── Panel header ── -->
      <div class="panel-hd">
        硬件管理器
        <div class="ph-actions">
          <button class="ib" title="重置布局" @click="handleResetLayout">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
            </svg>
          </button>
          <button class="ib" title="折叠面板" @click="paletteCollapsed = true">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3.5 6 8l3.5 4.5"/></svg>
          </button>
        </div>
      </div>

      <!-- ── 整机统计（顶部：跨板聚合概览，数据来自真实 .sr） ── -->
      <div class="ov-stats">
        <div class="ov-stat"><span class="ov-n">{{ ovRows.length }}</span><span class="ov-l">样例板卡</span></div>
        <div class="ov-stat"><span class="ov-n">{{ ovTotalChips }}</span><span class="ov-l">物理器件</span></div>
        <div class="ov-stat"><span class="ov-n">{{ ovTotalSensors }}</span><span class="ov-l">传感器</span></div>
        <div class="ov-stat"><span class="ov-n">{{ ovTotalEvents }}</span><span class="ov-l">事件/告警</span></div>
        <div class="ov-stat"><span class="ov-n">{{ ovCEvents.length }}</span><span class="ov-l">机箱级</span></div>
      </div>

      <!-- ── Search ── -->
      <div class="hw-search-row">
        <svg class="hw-search-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input class="hw-search-input" v-model="hwSearchQuery" placeholder="搜索板卡名称…" />
      </div>

      <!-- ── 管理器主体：板卡分类 + 整机总览 并列，整体滚动 ── -->
      <div class="mgr-scroll">
      <!-- ── Section header ── -->
      <div class="sec-hd">
        <svg viewBox="0 0 24 24" width="10" height="10" style="color:var(--foreground-muted);transform:rotate(90deg);flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>
        板卡分类
        <div class="sec-acts">
          <button class="ib" title="全部重置为首张" @click="handleResetSelections">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </button>
        </div>
      </div>

      <!-- ── 硬件管理器树：类别 → 板卡组 → 板卡文件 ────────────────── -->
      <div class="hw-tree">
        <template v-for="cat in filteredCategoryTree" :key="cat.type">
          <button class="hw-cat-row" @click="toggleCat(cat.type)">
            <span class="hw-caret" :class="{ open: expandedCats[cat.type] }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </span>
            <svg class="hw-cat-ic" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h4.4c.4 0 .78.16 1.06.44L10.4 6H16.5A1.5 1.5 0 0 1 18 7.5v8A1.5 1.5 0 0 1 16.5 17h-13A1.5 1.5 0 0 1 2 15.5v-10z"/></svg>
            <span class="hw-cat-label">{{ cat.label }}</span>
            <span class="hw-count">{{ cat.boardCount || cat.groups.length }}</span>
          </button>
          <div v-if="expandedCats[cat.type]" class="hw-cat-body">
            <template v-for="g in cat.groups" :key="g.id">
              <div
                class="hw-grp-row"
                :class="{ 'is-active': activeNode?.id === g.id }"
                :title="groupTitle(g)"
                @click="clickGroup(g)"
              >
                <span v-if="g.boards.length" class="hw-caret" :class="{ open: expandedGroups[g.id] }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </span>
                <span v-else class="hw-caret hw-caret-empty" />
                <span class="hw-state-dot" :style="{ background: STATE_COLOR[g.state] }" :title="STATE_LABEL[g.state]" />
                <span class="hw-grp-name">{{ g.name }}</span>
                <button
                  v-if="g.state === 'unclassified'"
                  class="unc-assign-btn"
                  :disabled="pendingSlots.length === 0"
                  @click.stop="toggleAssign(g.id)"
                >指派</button>
              </div>
              <!-- 展开：该板软硬件明细放一起（源文件[硬件] + 传感器/告警[软件]）；计数见行悬浮提示 -->
              <div v-if="expandedGroups[g.id]" class="hw-detail">
                <!-- 硬件：源文件（.sr / _soft.sr 折叠为主文件一行） -->
                <template v-if="g.boards.length">
                  <div class="hw-sub">硬件 · 源文件</div>
                  <div class="hw-files">
                    <button
                      v-for="b in g.boards"
                      :key="b.id"
                      class="hw-file-row"
                      :class="{ 'is-current': (selectedByGroup[g.id] ?? g.boards[0]?.id) === b.id }"
                      :title="'SN ' + b.sn + '\n' + b.files.join('\n')"
                      @click.stop="clickBoardFile(g, b)"
                    >
                      <svg class="hw-file-ic" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                      <span class="hw-file-name">{{ shortFile(b) }}</span>
                    </button>
                  </div>
                </template>
                <!-- 软件：传感器 → 告警事件 -->
                <template v-if="softOf(g.name).length">
                  <div class="hw-sub">软件 · 传感器 / 告警</div>
                  <div class="ov-soft">
                    <div v-for="s in softOf(g.name)" :key="s.name" class="ov-soft-row">
                      <div class="ov-soft-sensor">
                        <span class="ov-soft-kind" :class="s.kind">{{ s.kind === 'threshold' ? '门限' : '状态' }}</span>
                        <span class="ov-soft-name">{{ s.name }}</span>
                        <span class="ov-soft-cnt">{{ s.events.length }} 告警</span>
                      </div>
                      <div v-if="s.events.length" class="ov-soft-events">
                        <span v-for="e in s.events" :key="e.name" class="ov-soft-ev" :title="e.keyId + (e.level ? ' · ' + e.level : '')">
                          <i class="ov-dot" :class="e.severity"></i>{{ e.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <!-- 指派 popover（未分类板卡 → 空槽位） -->
              <div v-if="assigningId === g.id" class="unc-popover">
                <div v-if="pendingSlots.length === 0" class="unc-empty">暂无空槽位可指派</div>
                <button
                  v-for="slot in pendingSlots"
                  :key="slot.id"
                  class="unc-slot"
                  @click.stop="assignTo(g.id, slot.id)"
                >
                  <span class="unc-slot-type">{{ slot.type }}</span>
                  <span class="unc-slot-name">{{ slot.name }}</span>
                  <span class="unc-slot-state" :style="{ color: STATE_COLOR[slot.state] }">
                    {{ STATE_LABEL[slot.state] }}
                  </span>
                </button>
              </div>
            </template>
          </div>
        </template>
      </div>

      <!-- ── 整机事件（Chassis.* · 跨板，不归属单块板；含跨板一致性核对）── -->
      <div class="sec-hd">
        <svg viewBox="0 0 24 24" width="10" height="10" style="color:var(--foreground-muted);transform:rotate(90deg);flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>
        整机事件
        <span class="ov-help" title="Chassis.* 命名空间事件：跨板、天然归属机箱（非某一块板），由机箱主板承载">?</span>
      </div>
      <div class="ov-body">
        <!-- 逐条列出机箱级事件（样式对齐上面板卡分类树的行节奏） -->
        <div class="ov-chs-list">
          <div v-if="!ovCEvents.length" class="ov-empty">暂无机箱级事件</div>
          <div
            v-for="(e, i) in ovCEvents"
            :key="i"
            class="ov-chs-row"
            :title="e.board + ' · ' + e.keyId"
          >
            <i class="ov-dot" :class="e.severity"></i>
            <span class="ov-chs-nm">{{ e.name }}</span>
            <span class="ov-chs-bd">{{ e.board }}</span>
          </div>
        </div>
        <!-- 跨板一致性核对（自带标签的告警卡，仅有待核对项时出现） -->
        <div v-if="ovIncons.length" class="ov-card ov-warn">
          <div class="ov-cap">跨板一致性 · {{ ovIncons.length }} 项待核对</div>
          <div v-for="(it, i) in ovIncons" :key="i" class="ov-incon">
            <span class="ov-incon-name">{{ it.name }}.{{ it.field }}</span>
            <span class="ov-incon-vals"><span v-for="v in it.values" :key="v.board" class="ov-incon-v">{{ v.board }}={{ v.value }}</span></span>
          </div>
        </div>
      </div>
      </div><!-- /mgr-scroll -->

    </aside>

    <!-- ── Canvas ────────────────────────────────────────────────── -->
    <div class="topo-canvas-wrap">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :edge-types="edgeTypes"
        :fit-view-on-init="true"
        :default-viewport="{ x: 0, y: 0, zoom: 1 }"
        :min-zoom="0.1"
        :max-zoom="2.5"
        :nodes-draggable="true"
        :nodes-connectable="false"
        :elements-selectable="true"
        :pan-on-drag="true"
        @node-click="onNodeClick"
        @edge-click="onEdgeClick"
        @pane-click="onPaneClick"
      >
        <Background :variant="BackgroundVariant.Lines" pattern-color="rgba(255,255,255,0.045)" :gap="42" :size="1" />
        <Controls :show-interactive="false" />
        <MiniMap
          :node-color="miniColor"
          mask-color="rgba(8,8,18,0.65)"
          :style="{ background:'#141420', border:'1px solid #2e2e4e', borderRadius:'8px' }"
        />
      </VueFlow>

      <!-- ── Bus-type colour legend ──────────────────────────────── -->
      <div class="bus-legend">
        <span class="bus-legend-title">连线类型</span>
        <span v-for="b in BUS_LEGEND" :key="b.type" class="bus-legend-item">
          <span class="bus-legend-swatch" :style="{ background: b.color }" />
          {{ b.label }}
        </span>
      </div>
    </div>

    <!-- ── Property panel ────────────────────────────────────────── -->
    <div v-if="activeGroup" class="topo-property-panel" :class="{ wide: panelTab === 'alarm' && !activeDevice, 'wide-dev': panelTab === 'alarm' && !!activeDevice }" @click.stop>
      <div class="pp-header">
        <button v-if="activeDevice" class="pp-back" title="返回板卡" @click="activeDevice = null">‹</button>
        <span>{{ activeDevice ? activeDevice.label : '板卡配置' }}</span>
        <button class="pp-close" @click="activeNode = null">✕</button>
      </div>

      <!-- 板卡/器件级配置分 tab；SMC/表达式是配置项辅助，放详情里跟随，不作 tab -->
      <div class="pp-tabs" role="tablist">
        <button class="pp-tab" :class="{ active: panelTab === 'detail' }" @click="panelTab = 'detail'">详情</button>
        <button class="pp-tab" :class="{ active: panelTab === 'alarm' }" @click="panelTab = 'alarm'">告警<span class="pp-tab-n">{{ alarmTabCount.e }}</span> / 传感器<span class="pp-tab-n">{{ alarmTabCount.s }}</span></button>
      </div>

      <!-- ══════ 板卡模式 ══════ -->
      <template v-if="!activeDevice">
      <!-- ══ 详情 tab ══ -->
      <template v-if="panelTab === 'detail'">
      <div class="pp-body">
        <div class="pp-card">
        <div class="pp-field">
          <div class="pp-field-label">类型</div>
          <div class="pp-field-value">{{ activeGroup.label }}</div>
        </div>
        <div class="pp-field">
          <div class="pp-field-label">解析状态</div>
          <div
            class="pp-field-value"
            :style="{ color: STATE_COLOR[activeGroup.state] }"
          >
            {{ STATE_LABEL[activeGroup.state] }}
          </div>
        </div>
        <div v-if="activeGroup.connectorRef" class="pp-field">
          <div class="pp-field-label">来源 Connector</div>
          <div class="pp-field-value mono">
            {{ activeGroup.connectorRef.parentGroupId }} / {{ activeGroup.connectorRef.connectorName }}
          </div>
        </div>
        <div v-if="activeGroup.connectorRef?.identifyMode !== undefined" class="pp-field">
          <div class="pp-field-label">IdentifyMode</div>
          <div class="pp-field-value mono">{{ activeGroup.connectorRef.identifyMode }}</div>
        </div>
        <div v-if="activeGroup.missingFile" class="pp-field">
          <div class="pp-field-label">缺失文件</div>
          <div class="pp-field-value mono" style="color:var(--danger)">{{ activeGroup.missingFile }}</div>
        </div>
        </div>
        <div class="pp-card">
        <template v-if="activeBoard">
          <div class="pp-field">
            <div class="pp-field-label">同类板数量</div>
            <div class="pp-field-value">{{ activeGroup.boards.length }}</div>
          </div>
          <div class="pp-field">
            <div class="pp-field-label">当前 SN</div>
            <div class="pp-field-value mono">{{ activeBoard.sn }}</div>
          </div>
          <div class="pp-field">
            <div class="pp-field-label">Part Number</div>
            <div class="pp-field-value mono">{{ activeBoard.partNumber }}</div>
          </div>
          <div class="pp-field">
            <div class="pp-field-label">源文件</div>
            <div class="pp-field-value mono pp-files">
              <div v-for="f in activeBoard.files" :key="f">{{ f }}</div>
            </div>
          </div>
        </template>
        <div v-else class="pp-field">
          <div class="pp-field-label">状态说明</div>
          <div class="pp-field-value" style="font-size:11px;line-height:1.5">
            该板卡处于「{{ STATE_LABEL[activeGroup.state] }}」态，尚未选择具体板卡实例。
            请在卡片头部下拉中完成选择。
          </div>
        </div>
        </div>
      </div>
      </template>

      <!-- ══ 告警 / 传感器 tab（板卡级配置，内嵌告警配置视图）══ -->
      <div v-else class="pp-alarm">
        <AlarmConfigView />
      </div>
      </template>

      <!-- ══════ 器件模式（scope 收窄到该器件）══════ -->
      <template v-else>
        <div v-if="panelTab === 'detail'" class="pp-body">
          <div class="pp-card">
            <div class="pp-field"><div class="pp-field-label">器件</div><div class="pp-field-value mono">{{ activeDevice.label }}</div></div>
            <div class="pp-field"><div class="pp-field-label">类型</div><div class="pp-field-value">{{ activeDevice.typeLabel }}</div></div>
            <div v-if="activeDevice.bus" class="pp-field"><div class="pp-field-label">所在总线</div><div class="pp-field-value mono">{{ activeDevice.bus }}</div></div>
            <div class="pp-field"><div class="pp-field-label">承载传感器</div><div class="pp-field-value">{{ activeDevice.sensorCount }} 个</div></div>
            <div class="pp-field"><div class="pp-field-label">独立事件</div><div class="pp-field-value">{{ activeDevice.eventCount }} 条<span v-if="activeDevice.eventCount" style="color:var(--foreground-muted)"> · 不经传感器，直连本器件数据源</span></div></div>
            <div class="pp-field"><div class="pp-field-label">所属板卡</div><div class="pp-field-value mono">{{ activeGroup.name }} · {{ activeGroup.type }}</div></div>
          </div>
          <div v-if="activeDevice.kind === 'chip' && !activeDevice.sensorCount && !activeDevice.eventCount" class="pp-card">
            <div class="pp-field-value" style="font-size:11px;line-height:1.5;background:transparent;padding:0">
              该器件仅参与 I2C 拓扑与在位识别（EEPROM 信息 / CPLD 逻辑 / PCA9545 扩展等），未承载遥测传感器或独立事件（无 Scanner 数据源），因此没有告警链路。
            </div>
          </div>
          <div class="pp-wake">
            <div class="pp-wake-title">配置项辅助</div>
            <button class="wake-btn" @click="wakeSmc">
              <span class="wake-ic-wrap" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 4v3h10V6H7zm1 5h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/></svg></span>
              在 SMC 偏移量计算器中解析
            </button>
            <button class="wake-btn" @click="wakeExpr">
              <span class="wake-ic-wrap" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z"/></svg></span>
              在表达式计算器中调试 sensor
            </button>
          </div>
        </div>
        <div v-else class="pp-alarm">
          <AlarmConfigView :scope-chip-key="activeDevice.key" />
        </div>
      </template>
    </div>

  </div>
</template>

<style scoped>
/* ── 折叠态窄条（对齐 CSR 拓扑编辑器左树的折叠交互）── */
.topo-palette.closed {
  cursor: pointer;
  align-items: center;
  padding-top: 12px;
}
.topo-palette.closed:hover { background: var(--state-hover); }
.rail-ic { width: 14px; height: 14px; color: var(--foreground-muted); }

/* ── 整机统计（侧栏顶部 stat 条：样例板卡/物理器件/传感器/事件/机箱级） ── */
.ov-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}
.ov-stat {
  display: flex; flex-direction: column; gap: 1px; align-items: center;
  padding: 7px 3px; border-radius: var(--radius-md, 8px);
  background: var(--surface-1);
}
.ov-n { font-size: 15px; font-weight: 700; color: var(--foreground); }
.ov-l { font-size: 9px; color: var(--foreground-muted); white-space: nowrap; }

/* 管理器主体：板卡分类 + 整机总览 并列，整体滚动 */
.mgr-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* ── 搜索框：胶囊造型（对齐 CSR 拓扑编辑器左树搜索框）── */
.hw-search-row {
  margin: 10px 12px 8px;
  padding: 0 10px;
  height: 32px;
  border-radius: var(--radius-md, 8px);
  background: var(--surface-3);
  border-bottom: none;
}

/* ── 硬件管理器树（类别 → 板卡组 → 文件） ─────────────────────── */
.hw-tree {
  display: flex;
  flex-direction: column;
  flex: none;
  /* 小边距让 hover/选中圆角胶囊在面板内浮起，避免圆角贴边露出直角瑕疵（对齐 CSR 左树） */
  padding: 4px 6px;
}
.hw-caret {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--foreground-muted);
  transition: transform 0.12s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.hw-caret svg { width: 10px; height: 10px; display: block; }
.hw-caret.open { transform: rotate(90deg); }
.hw-caret-empty { visibility: hidden; }

/* 类别图标（对齐 CSR 拓扑编辑器左树的 folder 图标）*/
.hw-cat-ic {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  color: var(--foreground-muted);
}

/* category row – matches bmc-env .g-row，hover/选中改圆角胶囊（对齐 CSR 左树） */
.hw-cat-row {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0 8px 0 12px;
  height: 28px;
  cursor: pointer;
  font: 400 12px/1.5 var(--font-sans);
  color: var(--foreground-secondary);
  user-select: none;
}
.hw-cat-row:hover { background: var(--state-hover); border-radius: var(--radius-md, 8px); }
.hw-cat-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* count badge – grey, no color */
.hw-count {
  flex-shrink: 0;
  font: 500 11px/1.2 var(--font-sans);
  padding: 2px 8px;
  border-radius: 999px;
  height: 20px;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.08);
  color: var(--foreground-muted, #6b7498);
}

.hw-cat-body { display: flex; flex-direction: column; }

/* group row – matches bmc-env .c-row */
.hw-grp-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px 0 28px;
  height: 28px;
  cursor: pointer;
  user-select: none;
  font: 400 12px/1.5 var(--font-sans);
  color: var(--foreground-secondary);
  transition: background var(--duration-fast, 100ms), color var(--duration-fast, 100ms);
}
.hw-grp-row:hover { background: var(--state-hover); border-radius: var(--radius-md, 8px); }
.hw-grp-row.is-active {
  background: var(--state-selected, rgba(67, 105, 239, 0.14));
  border-radius: var(--radius-md, 8px);
  color: var(--foreground);
}
.hw-state-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.hw-grp-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* 展开区：一块板的软硬件明细放一起（内联在板卡分类树里） */
.hw-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 2px 8px 8px 28px;
}
.hw-sub {
  font-size: 9px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--foreground-muted);
  padding: 3px 2px 0;
}
.hw-detail .hw-files { padding-left: 0; }
.hw-detail .ov-soft { padding-left: 0; }
.hw-files {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding-left: 30px;
}
.hw-file-row {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  padding: 3px 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10.5px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--text-dim, #6b7498);
  transition: background 0.12s, color 0.12s;
}
.hw-file-row:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-sub, #c3c9de); }
.hw-file-row.is-current { color: #7c9aff; }
.hw-file-ic {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.hw-file-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.grp-summary {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.grp-summary li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary, #98a0b8);
}
.grp-s-badge {
  display: inline-block;
  min-width: 44px;
  padding: 1px 5px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 10px;
  text-align: center;
}
.grp-s-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.grp-s-count { opacity: 0.6; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
.pp-files { display: flex; flex-direction: column; gap: 2px; word-break: break-all; }

/* ── Bottom-left canvas toolbar: zoom controls + legend in one row ── */
:deep(.vue-flow__controls) {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  gap: 2px;
  left: 12px !important;
  bottom: 12px !important;
  margin: 0;
  padding: 4px;
  height: 34px;
  box-sizing: border-box;
  box-shadow: none !important;
  border-radius: 8px;
  background: var(--board-tag-bg, #1b1b21);
  backdrop-filter: blur(4px);
}
:deep(.vue-flow__controls-button) {
  width: 26px !important;
  height: 26px !important;
  min-width: 26px;
  background: transparent !important;
  border: none !important;
  border-radius: 6px;
  color: #e4e6ee;
  fill: #e4e6ee;
  box-sizing: border-box;
  padding: 0;
}
:deep(.vue-flow__controls-button svg) {
  fill: currentColor;
  max-width: 12px;
  max-height: 12px;
}
:deep(.vue-flow__controls-button:hover) {
  background: rgba(255, 255, 255, 0.10) !important;
}

.bus-legend {
  position: absolute;
  left: 110px;   /* clear of the 3-button zoom control pill (~94px wide) */
  bottom: 12px;
  z-index: 6;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 34px;
  box-sizing: border-box;
  padding: 0 14px;
  border-radius: 8px;
  background: var(--board-tag-bg, #1b1b21);
  backdrop-filter: blur(4px);
  font-size: 11px;
  color: var(--text-secondary, #c3c9de);
}
.bus-legend-title { font-weight: 700; color: var(--text-primary, #e6e8ef); }
.bus-legend-item { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; }
.bus-legend-swatch {
  width: 14px;
  height: 3px;
  border-radius: 2px;
  display: inline-block;
}

/* ── 整机总览常驻区（与板卡分类并列） ── */
.ov-body { display: flex; flex-direction: column; gap: 8px; padding: 4px 6px 12px; }
.ov-card { padding: 10px; border-radius: var(--radius-md, 8px); background: var(--surface-1); display: flex; flex-direction: column; gap: 7px; }
.ov-cap { font-size: 10.5px; color: var(--foreground-secondary); }
.ov-empty { font-size: 11px; color: var(--foreground-muted); }
.ov-warn { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--warning) 40%, transparent); }

/* 单板软件内容（传感器 → 告警事件）：整机总览与板卡分类树内联共用 */
.ov-soft { display: flex; flex-direction: column; gap: 6px; padding: 4px 2px 6px 8px; }
.ov-soft-row { display: flex; flex-direction: column; gap: 4px; padding: 6px 8px; border-radius: var(--radius-sm, 6px); background: var(--surface-2); }
.ov-soft-sensor { display: flex; align-items: center; gap: 6px; }
.ov-soft-kind { font-size: 9px; padding: 1px 6px; border-radius: var(--radius-pill, 999px); background: var(--surface-1); color: var(--foreground-muted); flex: none; }
.ov-soft-kind.threshold { color: var(--primary, #4369ef); }
.ov-soft-name { font-size: 10.5px; font-weight: 600; font-family: ui-monospace, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.ov-soft-cnt { font-size: 9px; color: var(--foreground-muted); flex: none; }
.ov-soft-events { display: flex; flex-wrap: wrap; gap: 4px; padding-left: 4px; }
.ov-soft-ev { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: var(--radius-pill, 999px); background: var(--surface-1); font-size: 9.5px; color: var(--foreground-secondary); }

.ov-incon { display: flex; flex-direction: column; gap: 2px; font-size: 10.5px; }
.ov-incon-name { font-family: ui-monospace, monospace; color: var(--foreground); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ov-incon-vals { display: flex; flex-wrap: wrap; gap: 6px; }
.ov-incon-v { color: var(--warning); }

/* 机箱级事件：逐条一行，行高/左缩进对齐上方板卡分类树（统一竖向节奏，不放卡片） */
.ov-chs-list { display: flex; flex-direction: column; }
.ov-help { display: inline-flex; align-items: center; justify-content: center; width: 13px; height: 13px; border-radius: 999px; background: var(--surface-2); color: var(--foreground-muted); font-size: 9px; cursor: help; text-transform: none; letter-spacing: 0; }
.ov-help:hover { background: var(--surface-3); color: var(--foreground-secondary); }
.ov-chs-row { display: flex; align-items: center; gap: 8px; height: 28px; padding: 0 8px 0 12px; border-radius: var(--radius-md, 8px); font-size: 11px; color: var(--foreground-secondary); }
.ov-chs-row:hover { background: var(--state-hover); }
.ov-chs-nm { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ov-chs-bd { flex: none; font-size: 9.5px; color: var(--foreground-muted); }
.ov-dot { width: 6px; height: 6px; border-radius: var(--radius-pill, 999px); background: var(--warning); flex: none; }
.ov-dot.min { background: var(--warning); }
.ov-dot.maj { background: color-mix(in srgb, var(--warning) 55%, var(--danger)); }
.ov-dot.crit { background: var(--danger); }


/* ── Defeat VueFlow's default grey edge stroke on the BMC→EXU trunk ── */
:deep(.vue-flow__edge.edge-trunk .vue-flow__edge-path) {
  stroke: #818cf8 !important;
  stroke-width: 2px !important;
  opacity: 0.9;
}

/* ── Wake-tool buttons (left linkage entry) ── */
.pp-wake {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 10px;
  padding: 12px;
  border-radius: var(--radius-lg);
  background: var(--surface-1);
}
.pp-wake-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: var(--foreground-muted);
  text-transform: uppercase;
  margin-bottom: 1px;
}
.wake-btn {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: var(--radius-md);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--foreground-secondary);
  background: var(--surface-2);
  cursor: pointer;
  transition: background var(--duration-fast) var(--easing-default),
              color var(--duration-fast) var(--easing-default);
}
.wake-btn:hover {
  background: var(--surface-3);
  color: var(--foreground);
}
.wake-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--focus-ring);
}
/* 图标收敛为中性面型 pill（去「一钮一色」），色随文字走 currentColor */
.wake-ic-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-sm);
  background: var(--surface-3);
  color: var(--foreground-secondary);
  flex-shrink: 0;
}
.wake-btn:hover .wake-ic-wrap { color: var(--foreground); }
.wake-ic-wrap svg { width: 14px; height: 14px; fill: currentColor; }

/* chk-chip styles are now defined in topology.css via .chk-ok / .chk-warn / .chk-err */

/* ── State sections in the sidebar ── */
.state-section {
  margin-top: 10px;
  padding: 6px 6px 8px;
  border: 1px solid rgba(255,255,255,0.06);
  border-left: 2px solid var(--state-accent, #6b7280);
  border-radius: 6px;
  background: rgba(255,255,255,0.02);
}
.state-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: var(--text-primary, #e6e8ef);
  padding-bottom: 4px;
}
.sec-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.sec-count {
  margin-left: auto;
  font-size: 10px;
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}
.sec-sub {
  font-size: 9.5px;
  font-weight: 500;
  opacity: 0.6;
  margin-left: -2px;
}

/* ── Clickable list items with sync-highlight ── */
.grp-item {
  padding: 4px 6px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.12s;
}
.grp-item:hover       { background: rgba(255,255,255,0.04); }
.grp-item.is-active   { background: rgba(79,110,247,0.22); }

/* ── Unclassified list rows ── */
.grp-item-unclassified { cursor: default; }
.grp-item-unclassified:hover { background: transparent; }
.unc-row { display: flex; align-items: center; gap: 6px; }
.unc-badge {
  background: rgba(107,114,128,0.3) !important;
  color: #cbd5e1 !important;
}
.unc-assign-btn {
  all: unset;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  background: rgba(79,110,247,0.18);
  color: #c7d2fe;
  cursor: pointer;
  flex-shrink: 0;
}
.unc-assign-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.unc-assign-btn:hover:not(:disabled) { background: rgba(79,110,247,0.3); }
.unc-meta {
  margin-top: 3px;
  padding-left: 4px;
  font-size: 10px;
  color: var(--text-secondary, #98a0b8);
  opacity: 0.75;
}
.unc-meta code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9.5px;
  background: rgba(255,255,255,0.04);
  padding: 0 4px;
  border-radius: 3px;
}
.unc-popover {
  margin-top: 6px;
  padding: 4px;
  border-radius: 6px;
  background: rgba(79,110,247,0.08);
  border: 1px solid rgba(79,110,247,0.3);
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.unc-slot {
  all: unset;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10.5px;
}
.unc-slot:hover { background: rgba(255,255,255,0.06); }
.unc-slot-type {
  font-weight: 700;
  color: var(--text-primary, #e6e8ef);
  font-size: 10px;
}
.unc-slot-name { flex: 1; color: var(--text-secondary, #98a0b8); }
.unc-slot-state { font-size: 9.5px; font-weight: 700; }
.unc-empty {
  padding: 8px;
  text-align: center;
  font-size: 10.5px;
  color: var(--text-secondary, #98a0b8);
}
</style>
