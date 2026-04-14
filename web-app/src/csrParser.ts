/**
 * CSR 解析：JSON <-> React Flow 拓扑 相互转换
 */
import type { Node, Edge } from '@xyflow/react';
import type { CSRDocument, ManagementTopology } from './types';

export type TopologyNodeType = 'anchor' | 'bus' | 'chip' | 'connector';

export interface TopologyNodeData {
  id: string;
  label: string;
  type: TopologyNodeType;
  // kind 用于区分语义（例如 Eeprom/Smc/LM75/PCIe/I2c/I2cMux/Pca9545/Pca9555）
  kind?: string;
  objectDef?: Record<string, unknown>;
}

function classifyKind(id: string, type: TopologyNodeType, objectDef?: Record<string, unknown>): string | undefined {
  const u = id.toUpperCase();

  if (type === 'anchor') return 'anchor';

  if (type === 'bus') {
    if (u.startsWith('I2CMUX_')) return 'i2cmux';
    if (u.startsWith('I2C_') || u === 'I2C') return 'i2c';
    if (u.startsWith('HISPORT_') || u.startsWith('HISPORT')) return 'hisport';
    if (u.startsWith('JTAGOVERLOCALBUS') || u.startsWith('JTAG_') || u.startsWith('JTAG')) return 'jtag';
    if (u.startsWith('PCA9545_')) return 'pca9545';
    if (u.startsWith('PCA9555_')) return 'pca9555';
    return 'bus';
  }

  if (type === 'connector') {
    const objType = typeof objectDef?.Type === 'string' ? String(objectDef.Type) : '';
    if (u.startsWith('CONNECTOR_PCI') && u.includes('PCIE')) return 'pcie-connector';
    if (u.startsWith('CONNECTOR_PCIe_') || u.startsWith('CONNECTOR_PCIE_')) return 'pcie-connector';
    if (objType === 'PCIe' || objType === 'PCIE') return 'pcie-connector';
    if (u.includes('PCIE')) return 'pcie-connector';
    return 'connector';
  }

  // chip
  if (type === 'chip') {
    if (id.startsWith('Eeprom_') || id.toUpperCase().startsWith('EEPROM_')) return 'eeprom';
    if (id.startsWith('Smc_') || id.toUpperCase().startsWith('SMC_') || id.toUpperCase().startsWith('SMC')) return 'smc';
    if (u.startsWith('LM75_') || u.startsWith('THRESHOLDSENSOR_') || u.includes('LM75')) return 'lm75';
    if (u.startsWith('PCA9545_')) return 'pca9545';
    if (u.startsWith('PCA9555_')) return 'pca9555';
    return 'chip';
  }

  return undefined;
}

export function csrToFlow(csr: CSRDocument): { nodes: Node<TopologyNodeData>[]; edges: Edge[] } {
  const nodes: Node<TopologyNodeData>[] = [];
  const edges: Edge[] = [];
  const mt = csr.ManagementTopology;
  if (!mt?.Anchor) return { nodes, edges };

  const objects = csr.Objects || {};
  const busWidth = 180;
  const busGap = 120;

  nodes.push({
    id: 'Anchor',
    type: 'csrNode',
    position: { x: 250, y: 0 },
    data: { id: 'Anchor', label: 'Anchor', type: 'anchor', kind: 'anchor' },
  });

  const buses = mt.Anchor.Buses || [];
  buses.forEach((busId, i) => {
    const obj = objects[busId] as Record<string, unknown> | undefined;
    const label = (obj && 'Id' in obj ? `${busId} (Id:${obj.Id})` : busId) as string;
    const kind = classifyKind(busId, 'bus', obj);

    nodes.push({
      id: busId,
      type: 'csrNode',
      position: { x: 80, y: 80 + i * busGap },
      data: { id: busId, label, type: 'bus', kind, objectDef: obj as Record<string, unknown> },
    });
    edges.push({ id: `e-anchor-${busId}`, source: 'Anchor', target: busId });

    const busNode = mt[busId];
    if (busNode) {
      let childIdx = 0;
      if (busNode.Chips) {
        busNode.Chips.forEach((chipId) => {
          const chipObj = objects[chipId] as Record<string, unknown> | undefined;
          const chipLabel = chipObj
            ? `${chipId} (0x${((chipObj.Address as number) ?? 0).toString(16)})`
            : chipId;
          const kind = classifyKind(chipId, 'chip', chipObj);
          nodes.push({
            id: chipId,
            type: 'csrNode',
            position: { x: 80 + busWidth + 60, y: 80 + i * busGap + childIdx * 80 },
            data: { id: chipId, label: chipLabel, type: 'chip', kind, objectDef: chipObj as Record<string, unknown> },
          });
          edges.push({ id: `e-${busId}-${chipId}`, source: busId, target: chipId });
          childIdx++;
        });
      }
      if (busNode.Connectors) {
        busNode.Connectors.forEach((connId) => {
          const connObj = objects[connId] as Record<string, unknown> | undefined;
          const connLabel = connObj ? `${connId} (Slot:${(connObj.Slot as number) ?? '-'})` : connId;
          const kind = classifyKind(connId, 'connector', connObj);
          nodes.push({
            id: connId,
            type: 'csrNode',
            position: { x: 80 + busWidth + 60, y: 80 + i * busGap + childIdx * 80 },
            data: { id: connId, label: connLabel, type: 'connector', kind, objectDef: connObj as Record<string, unknown> },
          });
          edges.push({ id: `e-${busId}-${connId}`, source: busId, target: connId });
          childIdx++;
        });
      }
    }
  });

  return { nodes, edges };
}

/**
 * 递归版拓扑：支持 ManagementTopology 中“多级 Buses/Chips/Connectors”链路
 * 例如：Hisport_5 -> Pca9545_IEU(芯片) -> I2cMux_...(子总线) -> Connector_...
 *
 * 该函数用于“只读拓扑展示”，不保证 flowToCsr 能完整还原。
 */
export function csrToFlowRecursive(csr: CSRDocument): { nodes: Node<TopologyNodeData>[]; edges: Edge[] } {
  const nodes: Node<TopologyNodeData>[] = [];
  const edges: Edge[] = [];
  const mt = csr.ManagementTopology;
  if (!mt?.Anchor) return { nodes, edges };

  const objects = csr.Objects || {};

  const nodePriority: Record<TopologyNodeType, number> = { anchor: 0, bus: 2, chip: 1, connector: 3 };
  const stepX = 260;
  const baseY = 80;
  const yStep = 80;

  // 让 i2c/hisport -> i2cmux -> pca -> connector 的展示更“线性”：固定列、竖向堆叠
  const yCursorByXGroup = new Map<number, number>();

  type Role = TopologyNodeType;
  type NodeMeta = { role: Role; label: string; kind?: string };
  const meta = new Map<string, NodeMeta>();
  const positionById = new Map<string, { x: number; y: number }>();

  const labelFor = (id: string, role: Role, obj?: Record<string, unknown>): string => {
    if (role === 'anchor') return 'Anchor';
    if (role === 'bus') return id;
    if (role === 'connector') {
      const slot = obj && typeof obj.Slot === 'number' ? obj.Slot : '-';
      return slot !== '-' ? `${id} (Slot:${slot})` : id;
    }
    // chip
    const address = obj && typeof obj.Address === 'number' ? obj.Address : undefined;
    return address !== undefined ? `${id} (0x${address.toString(16)})` : id;
  };

  const createNode = (id: string, role: Role, _depth: number, obj?: Record<string, unknown>) => {
    const existing = meta.get(id);
    if (!existing) {
      const kind = classifyKind(id, role, obj);
      const xGroup = (() => {
        if (role === 'anchor') return 0;
        if (role === 'bus') {
          if (kind === 'i2c' || kind === 'hisport') return 0;
          if (kind === 'i2cmux') return 1;
          return 0;
        }
        if (role === 'chip') {
          if (kind === 'eeprom' || kind === 'smc' || kind === 'lm75') return 1;
          if (kind === 'pca9545' || kind === 'pca9555') return 2;
          return 3;
        }
        // connector
        if (kind === 'pcie-connector') return 4;
        return 3;
      })();

      const y = yCursorByXGroup.get(xGroup) ?? baseY;
      yCursorByXGroup.set(xGroup, y + yStep);
      const x = 80 + xGroup * stepX;
      const label = labelFor(id, role, obj);
      meta.set(id, { role, label, kind });
      positionById.set(id, { x, y });
      nodes.push({
        id,
        type: 'csrNode',
        position: { x, y },
        data: { id, label, type: role, kind, objectDef: obj },
      });
      return;
    }

    // 如果再次以更高优先级角色被引用，则更新渲染类型/label/kind
    if (nodePriority[role] > nodePriority[existing.role]) {
      const objMaybe = obj ?? (objects[id] as Record<string, unknown> | undefined);
      const kind = classifyKind(id, role, objMaybe);
      const label = labelFor(id, role, objMaybe);
      meta.set(id, { role, label, kind });
      // 更新 nodes 中对应数据
      const n = nodes.find((x) => x.id === id);
      if (n) n.data = { ...(n.data || {}), type: role, label, kind, objectDef: objMaybe };
    }
  };

  // reuse：递归拓扑的“父->子”
  const processed = new Set<string>();

  const enqueueVisit = (startId: string) => {
    if (processed.has(startId)) return;
    processed.add(startId);
  };

  // Anchor node
  nodes.push({
    id: 'Anchor',
    type: 'csrNode',
    position: { x: 250, y: 0 },
    data: { id: 'Anchor', label: 'Anchor', type: 'anchor', kind: 'anchor' },
  });

  const visitQueue: Array<{ id: string; role: Role; depth: number }> = [];
  for (const busId of mt.Anchor.Buses || []) {
    // Anchor -> bus
    const busObj = objects[busId] as Record<string, unknown> | undefined;
    createNode(busId, 'bus', 1, busObj);
    edges.push({ id: `e-anchor-${busId}`, source: 'Anchor', target: busId });
    visitQueue.push({ id: busId, role: 'bus', depth: 1 });
  }

  while (visitQueue.length) {
    const { id, role, depth } = visitQueue.shift()!;
    const node = mt[id];
    if (!node) continue;

    // Buses: 当前节点 -> 子总线
    if (node.Buses) {
      for (const b of node.Buses) {
        const obj = objects[b] as Record<string, unknown> | undefined;
        createNode(b, 'bus', depth + 1, obj);
        edges.push({ id: `e-${id}-${b}`, source: id, target: b });
        enqueueVisit(b);
        visitQueue.push({ id: b, role: 'bus', depth: depth + 1 });
      }
    }

    // Chips: 当前节点 -> 芯片/器件
    if (node.Chips) {
      for (const chipId of node.Chips) {
        const obj = objects[chipId] as Record<string, unknown> | undefined;
        createNode(chipId, 'chip', depth + 1, obj);
        edges.push({ id: `e-${id}-${chipId}`, source: id, target: chipId });
        if (mt[chipId]) {
          enqueueVisit(chipId);
          visitQueue.push({ id: chipId, role: 'chip', depth: depth + 1 });
        }
      }
    }

    // Connectors: 当前节点 -> 连接器
    if (node.Connectors) {
      for (const connId of node.Connectors) {
        const obj = objects[connId] as Record<string, unknown> | undefined;
        createNode(connId, 'connector', depth + 1, obj);
        edges.push({ id: `e-${id}-${connId}`, source: id, target: connId });
        if (mt[connId]) {
          enqueueVisit(connId);
          visitQueue.push({ id: connId, role: 'connector', depth: depth + 1 });
        }
      }
    }
  }

  return { nodes, edges };
}

export function flowToCsr(
  nodes: Node<TopologyNodeData>[],
  edges: Edge[],
  baseCsr: CSRDocument
): CSRDocument {
  const mt: ManagementTopology = { Anchor: { Buses: [] } };
  const objects: Record<string, unknown> = { ...(baseCsr.Objects || {}) };

  const busEdges = edges.filter((e) => e.source === 'Anchor');
  const busIds = busEdges.map((e) => e.target).filter(Boolean);
  mt.Anchor!.Buses = busIds as string[];

  busIds.forEach((busId) => {
    const chipEdges = edges.filter((e) => e.source === busId);
    const chips = chipEdges.filter((e) => {
      const n = nodes.find((n2) => n2.id === e.target);
      return n?.data.type === 'chip';
    }).map((e) => e.target);
    const connectors = chipEdges.filter((e) => {
      const n = nodes.find((n2) => n2.id === e.target);
      return n?.data.type === 'connector';
    }).map((e) => e.target);
    if (chips.length || connectors.length) {
      mt[busId] = {};
      if (chips.length) mt[busId]!.Chips = chips;
      if (connectors.length) mt[busId]!.Connectors = connectors;
    }
  });

  nodes.forEach((n) => {
    if (n.data.objectDef && n.id !== 'Anchor') {
      objects[n.id] = n.data.objectDef;
    }
  });

  return { ...baseCsr, ManagementTopology: mt, Objects: objects };
}
