// Build the mind-map (BMC → EXU → board groups) as VueFlow nodes/edges.
import { markRaw } from 'vue';
import {
  BOARDS,
  groupBoards,
  classifyGroups,
  isOnCanvas,
  type BoardGroup,
} from './boards';
import { getTopology } from './boardTopologies';
import { BUS_COLOR } from './palette';

// ── Column X positions ────────────────────────────────────────────────
// EXU card is ~565 flow-units wide, so its right edge lands at ~1075.
// Children must start after EXU right edge + LANE_FAR (270) + margin.
const COL_X = [40, 510, 1450];

// ── Node height estimates ─────────────────────────────────────────────
// Each card = node-padding(22) + header(24) + combo-btn(24) +
//             topo-section-header(37) + bus rows.
// Per bus row (with chips): ~89 px;  with mux+fanout: ~174 px;
// empty/HSP row: ~36 px.  Row gap in MiniTopology: 10 px.
const NODE_H_BY_TYPE: Record<string, number> = {
  EXU:     1020,  // 10 bus rows, 2 mux fan-outs (I2c_1, I2c_2)
  BCU:     520,   // 5 bus rows, 1 mux fan-out
  CLU:     200,   // 1 bus row
  IEU:     450,   // 4 bus rows
  NICCard: 250,   // 2 bus rows
  Unknown: 120,   // no buses
};
const BMC_HEIGHT     = 310;  // BmcNode: no combo-btn; 3 bus rows (SMC + 2×HSP)
const DEFAULT_NODE_H = 250;
const NODE_V_GAP     = 64;   // gap between sibling nodes in same column
const CANVAS_CENTER_Y = 500; // logical vertical midpoint used for initial layout

// SEU has two distinct sub-types with different bus counts
function seuHeight(g: BoardGroup): number {
  return g.name.startsWith('M2') ? 200 : 300;
}

// ── Edge colours per child board type ────────────────────────────────
// Colours match bus-type convention from the reference:
//   pink (#e879f9)  → I2C connections (BCU, IEU, SEU)
//   teal (#22d3ee)  → HiSport connections (CLU, NICCard)
//   gray            → Unknown
const TYPE_EDGE_COLOR: Record<string, string> = {
  BCU:     '#e879f9',   // I2C  (pink)
  CLU:     '#22d3ee',   // HiSport (teal)
  IEU:     '#e879f9',   // I2C  (pink)
  SEU:     '#e879f9',   // I2C  (pink)
  NICCard: '#22d3ee',   // HiSport (teal)
  Unknown: '#6b7280',
};

export interface MindmapBuildResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edges: any[];
  /** All groups (canvas + list-only). */
  groups: BoardGroup[];
  /** Groups that only live in the left list (state='unclassified'). */
  unclassifiedGroups: BoardGroup[];
}

export function buildMindmap(
  onSelect: (groupId: string, boardId: string) => void,
  selected: Record<string, string> = {},
): MindmapBuildResult {
  // 1. Raw grouping (by type+name)
  // 2. classifyGroups attaches resolution state + injects demo cases
  // 3. Split canvas vs list-only
  const allGroups          = classifyGroups(groupBoards(BOARDS));
  const canvasGroups       = allGroups.filter(isOnCanvas);
  const unclassifiedGroups = allGroups.filter((g) => !isOnCanvas(g));

  const exuGroups   = canvasGroups.filter((g) => g.category === 'exu');
  const childGroups = canvasGroups.filter((g) => g.category !== 'exu');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const edges: any[] = [];

  function nodeH(g: BoardGroup): number {
    if (g.type === 'SEU') return seuHeight(g);
    return NODE_H_BY_TYPE[g.type] ?? DEFAULT_NODE_H;
  }

  // ── Child column height → used to center both EXU and BMC ─────────
  const childColHeight =
    childGroups.reduce((s, g) => s + nodeH(g), 0) +
    Math.max(0, childGroups.length - 1) * NODE_V_GAP;
  const childColMidY = CANVAS_CENTER_Y; // all columns share this midpoint

  // ── BMC node ──────────────────────────────────────────────────────
  const bmcId = 'bmc-root';
  nodes.push({
    id:       bmcId,
    type:     'bmc',
    position: { x: COL_X[0], y: childColMidY - BMC_HEIGHT / 2 },
    data:     markRaw({ label: 'BMC', subtitle: '根节点 · openUBMC' }),
    draggable:  true,
    selectable: true,
  });

  // ── EXU column ────────────────────────────────────────────────────
  // Build per-group bus lists for round-robin slot assignment.
  // Groups with no buses get a single dummy slot so they still show an edge.
  const SP = 8; // px between parallel lines at target card (flow coords)

  const groupBuses = childGroups.map((g) => {
    const topology = getTopology(g.type, g.name);
    const real = topology.buses
      .filter((b) => !b.dashed)
      .map(({ id, label, busType, color }) => ({ id, label, busType, color }));
    return real.length > 0
      ? real
      : [{ id: 'fallback', label: '', busType: 'default', color: BUS_COLOR.default }];
  });

  // Round-robin: slot 0 = group0/bus0, slot 1 = group1/bus0, slot 2 = group2/bus0,
  // slot N = group0/bus1, etc. — mirrors EXU physical port distribution.
  interface Slot {
    groupIdx: number;
    busIdxInGroup: number;
    bus: { id: string; label: string; busType: string; color: string };
  }
  const allSlots: Slot[] = [];
  const maxBuses = Math.max(0, ...groupBuses.map((bs) => bs.length));
  for (let round = 0; round < maxBuses; round++) {
    for (let gi = 0; gi < childGroups.length; gi++) {
      if (round < groupBuses[gi].length) {
        allSlots.push({ groupIdx: gi, busIdxInGroup: round, bus: groupBuses[gi][round] });
      }
    }
  }
  const totalSlots = allSlots.length;

  // One EXU source handle per bus slot (round-robin order), coloured by bus type.
  const sourceHandles = allSlots.map((slot, srcIdx) => ({
    id:    `r-${childGroups[slot.groupIdx].id}-${slot.bus.id}`,
    pct:   (srcIdx + 0.5) / totalSlots,
    color: BUS_COLOR[slot.bus.busType] ?? slot.bus.color ?? BUS_COLOR.default,
  }));

  const exuColHeight =
    exuGroups.reduce((s, g) => s + nodeH(g), 0) +
    Math.max(0, exuGroups.length - 1) * NODE_V_GAP;
  let exuY = childColMidY - exuColHeight / 2;

  const exuNodeIds: string[] = [];
  for (const g of exuGroups) {
    const nid = g.id;
    exuNodeIds.push(nid);
    nodes.push({
      id:       nid,
      type:     'boardgroup',
      position: { x: COL_X[1], y: exuY },
      data: {
        group:         g,
        selectedId:    selected[g.id] ?? g.boards[0].id,
        onSelect,
        sourceHandles, // fan-out handles for EXU → children
      },
      draggable:  true,
      selectable: true,
    });
    // BMC → EXU edge
    edges.push({
      id:           `e-${bmcId}-${nid}`,
      source:       bmcId,
      sourceHandle: 'r',
      target:       nid,
      targetHandle: 'l',
      type:         'smoothstep',
      class:        'edge-trunk',
      style:        { stroke: '#818cf8', strokeWidth: 2, opacity: 0.9 },
    });
    exuY += nodeH(g) + NODE_V_GAP;
  }

  // ── Child column ──────────────────────────────────────────────────
  let childY = childColMidY - childColHeight / 2;
  const parentExuId = exuNodeIds[0]; // currently always one EXU group

  // Lane offsets for orthogonal routing: top group gets the farthest (rightmost)
  // vertical lane; bottom group gets the nearest lane. This mirrors the demo layout
  // and avoids max crossing overlap.
  const N = childGroups.length;
  const LANE_NEAR = 40;
  const LANE_FAR  = 270;
  const laneStep  = N > 1 ? (LANE_FAR - LANE_NEAR) / (N - 1) : 0;

  for (let i = 0; i < childGroups.length; i++) {
    const g          = childGroups[i];
    const nid        = g.id;
    const laneOffset = (N - 1 - i) * laneStep + LANE_NEAR;
    const buses      = groupBuses[i];
    const nBuses     = buses.length;

    nodes.push({
      id:       nid,
      type:     'boardgroup',
      position: { x: COL_X[2], y: childY },
      data: {
        group:      g,
        selectedId: selected[g.id] ?? g.boards[0]?.id ?? '',
        onSelect,
      },
      draggable:  true,
      selectable: true,
    });

    if (parentExuId) {
      // Edge style per resolution state (applied to all buses in this group).
      let dash: string | undefined;
      let opacity = 0.88;
      let stateStroke: string | undefined; // overrides bus-type colour when set
      switch (g.state) {
        case 'multi-match':     stateStroke = '#f59e0b'; dash = '5 3'; break;
        case 'type-placeholder': stateStroke = '#eab308'; dash = '5 3'; break;
        case 'missing':         stateStroke = '#ef4444'; dash = '3 3'; opacity = 0.75; break;
      }

      // One edge per bus. yOffAtTarget spreads arrival lines around the l handle.
      for (let j = 0; j < nBuses; j++) {
        const bus          = buses[j];
        const yOffAtTarget = (j - (nBuses - 1) / 2) * SP;
        const stroke       = stateStroke ?? BUS_COLOR[bus.busType] ?? bus.color ?? BUS_COLOR.default;

        edges.push({
          id:           `e-${parentExuId}-${nid}-${bus.id}`,
          source:       parentExuId,
          sourceHandle: `r-${nid}-${bus.id}`,
          target:       nid,
          targetHandle: 'l',
          type:         'manhattan',
          data:         { laneOffset, yOffAtTarget, groupId: nid },
          style: {
            stroke,
            strokeWidth:     1.5,
            strokeDasharray: dash,
            opacity,
          },
        });
      }
    }

    childY += nodeH(g) + NODE_V_GAP;
  }

  return { nodes, edges, groups: allGroups, unclassifiedGroups };
}
