// Build the mind-map (BMC → EXU → board groups) as VueFlow nodes/edges.
import { markRaw } from 'vue';
import { BOARDS, groupBoards, type BoardGroup } from './boards';

// ── Column X positions ────────────────────────────────────────────────
// Wider gaps so smoothstep edge curves have room to fan out.
const COL_X = [40, 510, 960];

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
  groups: BoardGroup[];
}

export function buildMindmap(
  onSelect: (groupId: string, boardId: string) => void,
  selected: Record<string, string> = {},
): MindmapBuildResult {
  const groups      = groupBoards(BOARDS);
  const exuGroups   = groups.filter((g) => g.category === 'exu');
  const childGroups = groups.filter((g) => g.category !== 'exu');

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
  // One source-handle per child group, evenly distributed along right edge.
  // Each handle is coloured by the target group's type so the fan-out is
  // visually traceable even before the edge is followed.
  const sourceHandles = childGroups.map((g, i) => ({
    id:    `r-${g.id}`,
    pct:   (i + 0.5) / childGroups.length,   // 0.07, 0.21, 0.36 … evenly spaced
    color: TYPE_EDGE_COLOR[g.type] ?? '#9ca3af',
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
      style:        { stroke: '#818cf8', strokeWidth: 1.8, opacity: 0.9 },
    });
    exuY += nodeH(g) + NODE_V_GAP;
  }

  // ── Child column ──────────────────────────────────────────────────
  let childY = childColMidY - childColHeight / 2;
  const parentExuId = exuNodeIds[0]; // currently always one EXU group

  for (let i = 0; i < childGroups.length; i++) {
    const g          = childGroups[i];
    const nid        = g.id;
    const edgeColor  = TYPE_EDGE_COLOR[g.type] ?? '#9ca3af';
    const isUnknown  = g.category === 'unknown';

    nodes.push({
      id:       nid,
      type:     'boardgroup',
      position: { x: COL_X[2], y: childY },
      data: {
        group:      g,
        selectedId: selected[g.id] ?? g.boards[0].id,
        onSelect,
        // children have no outgoing edges, so no sourceHandles
      },
      draggable:  true,
      selectable: true,
    });

    if (parentExuId) {
      edges.push({
        id:           `e-${parentExuId}-${nid}`,
        source:       parentExuId,
        sourceHandle: `r-${nid}`,   // specific distributed handle on EXU
        target:       nid,
        targetHandle: 'l',
        type:         'smoothstep',
        style: {
          stroke:          isUnknown ? '#9ca3af' : edgeColor,
          strokeWidth:     1.5,
          strokeDasharray: isUnknown ? '6 4' : undefined,
          opacity:         0.88,
        },
      });
    }

    childY += nodeH(g) + NODE_V_GAP;
  }

  return { nodes, edges, groups };
}
