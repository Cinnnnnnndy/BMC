// Shared linkage bus between 拓扑 (topology) / 代码 (code) and the three tools.
//
// Mental model (see linkage map):
//   拓扑视图  = 选择器 / 上下文源   → 左联动（inbound）
//   代码视图  = 落地目标            → 右联动（outbound / writeback）
//   三个工具  = 中间加工台          → 通过这两个锚点中转，工具之间不直接耦合
//
// Topology calls invoke('smc' | 'expr' | 'cooling', ctx) to wake a tool with
// context; the tool reads inbound on mount and renders a "来自拓扑" banner.
// The tool calls writeBack(...) to push a snippet toward the code view.
import { reactive } from 'vue';

export type ToolId = 'smc' | 'expr' | 'cooling';
export type TabId = 'topology' | ToolId;

/** Context pushed from the topology into a tool (left linkage). */
export interface InboundContext {
  /** Human-readable origin, e.g. "CpuBoard_1 · BCU". */
  source: string;
  /** Optional secondary line, e.g. the selected SN. */
  detail?: string;
  /** SMC: pre-fill the function field, e.g. "0x0C". */
  func?: string;
  /** Expr: pipeline expression to debug. */
  expression?: string;
  /** Cooling: fan entities resolved from the topology. */
  fans?: string[];
  /** Cooling: temperature zones / sensors resolved from the topology. */
  tempZones?: string[];
  ts: number;
}

/** A snippet pushed from a tool toward the code view (right linkage). */
export interface WritebackEvent {
  tool: ToolId;
  /** What kind of artifact, e.g. "offset → sensor 地址". */
  label: string;
  /** The code snippet itself. */
  code: string;
  ts: number;
}

/** Which surface occupies the main (left) pane. The tools never take it over;
 *  they dock into the side (right) pane so the anchor stays visible. */
export type AnchorId = 'topology' | 'code';

interface LinkageState {
  /** Main-pane anchor (always visible). */
  anchor: AnchorId;
  /** Tool docked in the split side-pane, or null when the anchor is full-width. */
  dockTool: ToolId | null;
  /** Board (BoardRecord.id) currently selected — shared by topology & code so
   *  the two anchors stay highlighted on the same entity. */
  selectedBoardId: string | null;
  inbound: Record<ToolId, InboundContext | null>;
  lastWriteback: WritebackEvent | null;
}

const state = reactive<LinkageState>({
  anchor: 'topology',
  dockTool: null,
  selectedBoardId: null,
  inbound: { smc: null, expr: null, cooling: null },
  lastWriteback: null,
});

export function useLinkage() {
  function setAnchor(anchor: AnchorId) {
    state.anchor = anchor;
  }

  function selectEntity(boardId: string | null) {
    state.selectedBoardId = boardId;
  }

  /** Wake a tool with inbound context, docked beside the anchor (split-screen).
   *  Does NOT replace the anchor — topology/code stays on the left. */
  function invoke(tool: ToolId, ctx: Omit<InboundContext, 'ts'>) {
    state.inbound[tool] = { ...ctx, ts: Date.now() };
    state.dockTool = tool;
  }

  /** Toggle a tool's side-pane on/off (no new context). */
  function toggleDock(tool: ToolId) {
    state.dockTool = state.dockTool === tool ? null : tool;
  }

  function closeDock() {
    state.dockTool = null;
  }

  function clearInbound(tool: ToolId) {
    state.inbound[tool] = null;
  }

  /** Push a snippet toward the code view. */
  function writeBack(tool: ToolId, label: string, code: string) {
    state.lastWriteback = { tool, label, code, ts: Date.now() };
  }

  return { state, setAnchor, selectEntity, invoke, toggleDock, closeDock, clearInbound, writeBack };
}
