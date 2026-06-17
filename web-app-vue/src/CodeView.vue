<script setup lang="ts">
// Code anchor: the .sr / CSR text twin of the topology. Shows the selected
// board's Objects block; the tool-editable fields are clickable and dock the
// matching tool (code ↔ tool). Tool writebacks land back on the field.
import { computed } from 'vue';
import { BOARDS } from './data/boards';
import { getTopology } from './data/boardTopologies';
import { inferFunc, smcTarget, exprTemplate, coolingEntities } from './data/toolContext';
import { useLinkage } from './composables/useLinkage';

const { state: link, setAnchor, invoke } = useLinkage();

const board = computed(() => BOARDS.find((b) => b.id === link.selectedBoardId) ?? null);
const busIds = computed(() =>
  board.value ? getTopology(board.value.type, board.value.name).buses.map((b) => b.id) : [],
);
const cooling = computed(() => (board.value ? coolingEntities(board.value) : { fans: [], tempZones: [] }));
const func = computed(() => (board.value ? inferFunc(board.value.type, board.value.name) : null));

// Tool writebacks landing on their field (closes the tool → code loop).
function wb(tool: 'smc' | 'expr' | 'cooling'): string | null {
  return link.lastWriteback?.tool === tool ? link.lastWriteback.code : null;
}

function openSmc() {
  const b = board.value; if (!b) return;
  const f = inferFunc(b.type, b.name);
  const tgt = smcTarget(b.type, b.name);
  invoke('smc', {
    source: `${b.name} · ${b.type}`,
    detail: [`SN ${b.sn}`, tgt ? `Smc: ${tgt}` : null, f.label].filter(Boolean).join(' · '),
    func: f.func,
  });
}
function openExpr() {
  const b = board.value; if (!b) return;
  invoke('expr', { source: `${b.name} · ${b.type}`, detail: `SN ${b.sn}`, expression: exprTemplate(b.type, b.name) });
}
function openCooling() {
  const b = board.value; if (!b) return;
  const e = coolingEntities(b);
  invoke('cooling', { source: `${b.name} · ${b.type}`, detail: `SN ${b.sn}`, fans: e.fans, tempZones: e.tempZones });
}
</script>

<template>
  <div class="code-root">
    <div class="code-head">
      <span class="code-file">{{ board ? board.partNumber + '_' + board.sn + '.sr' : 'root.sr' }}</span>
      <span class="code-sub">CSR · ManagementTopology / Objects</span>
      <button class="code-topo-btn" @click="setAnchor('topology')">在拓扑中查看 →</button>
    </div>

    <div v-if="!board" class="code-empty">
      在拓扑里选择一块板卡,这里显示它的 .sr / CSR 代码,字段可点击联动工具。
    </div>

    <pre v-else class="code-body"><span class="ln-c">// CSR Objects · {{ board.name }} ({{ board.type }})</span>
<span class="k">Connector_{{ board.name }}</span>: {
  <span class="k">Bom</span>:          <span class="s">"{{ board.partNumber }}"</span>,
  <span class="k">Id</span>:           <span class="s">"{{ board.sn }}"</span>,
  <span class="k">Type</span>:         <span class="s">"{{ board.type }}"</span>,
  <span class="k">Buses</span>:        [<span class="s">{{ busIds.join(', ') }}</span>],
  <span class="k">IdentifyMode</span>: <span class="n">2</span>,
<span class="ln-c">  // ── 可联动字段(点击在右侧打开对应工具)──</span>
<span class="field" :class="{ active: link.dockTool==='smc' }" @click="openSmc"><span class="k">  Smc.Offset</span>:   <span class="v">{{ wb('smc') || '0x________' }}</span> <span class="tag tag-smc">SMC · func {{ func?.func }} ↗</span></span>
<span class="field" :class="{ active: link.dockTool==='expr' }" @click="openExpr"><span class="k">  Sensor.Expression</span>: <span class="v">"{{ wb('expr') || exprTemplate(board.type, board.name) }}"</span> <span class="tag tag-expr">表达式 ↗</span></span>
<span v-if="cooling.fans.length || cooling.tempZones.length" class="field" :class="{ active: link.dockTool==='cooling' }" @click="openCooling"><span class="k">  cooling_config</span>: { fans: <span class="n">{{ cooling.fans.length }}</span>, temp_zones: <span class="n">{{ cooling.tempZones.length }}</span> } <span class="tag tag-cool">调速 ↗</span></span>
}</pre>
  </div>
</template>

<style scoped>
.code-root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0a0d18;
  overflow: hidden;
}
.code-head {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  flex-shrink: 0;
  padding: 0 14px;
  background: #0e1017;
  border-bottom: 1px solid #1e2240;
}
.code-file { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; color: #e6e8ef; font-weight: 600; }
.code-sub  { font-size: 11px; color: #6b7498; }
.code-topo-btn {
  all: unset;
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 11.5px;
  color: #34d399;
  border: 1px solid rgba(52,211,153,0.4);
  cursor: pointer;
}
.code-topo-btn:hover { background: rgba(52,211,153,0.12); }

.code-empty { padding: 24px; color: #6b7498; font-size: 13px; line-height: 1.7; }

.code-body {
  flex: 1;
  overflow: auto;
  margin: 0;
  padding: 16px 18px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12.5px;
  line-height: 1.9;
  color: #c3c9de;
  tab-size: 2;
}
.ln-c { color: #5a6178; font-style: italic; }
.k { color: #93c5fd; }
.s { color: #a7f3d0; }
.n { color: #fcd34d; }
.v { color: #f0abfc; }

.field {
  display: block;
  margin: 2px -8px;
  padding: 1px 8px;
  border-radius: 5px;
  cursor: pointer;
  border-left: 2px solid transparent;
}
.field:hover { background: rgba(255,255,255,0.05); }
.field.active { background: rgba(79,110,247,0.16); border-left-color: #4f6ef7; }
.tag {
  font-size: 10.5px;
  padding: 0 6px;
  border-radius: 999px;
  margin-left: 6px;
}
.tag-smc  { background: rgba(79,110,247,0.2);  color: #c7d2fe; }
.tag-expr { background: rgba(167,139,250,0.2); color: #ddd6fe; }
.tag-cool { background: rgba(52,211,153,0.2);  color: #a7f3d0; }
</style>
