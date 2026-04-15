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
  objectDef?: Record<string, unknown>;
}

export interface TopologyEdgeData {
  source: string;
  target: string;
  relation: 'bus' | 'chip' | 'connector';
}

export function csrToFlow(csr: CSRDocument): { nodes: Node<TopologyNodeData>[]; edges: Edge[] } {
  const nodes: Node<TopologyNodeData>[] = [];
  const edges: Edge[] = [];
  const mt = csr.ManagementTopology;
  if (!mt?.Anchor) return { nodes, edges };

  const objects = csr.Objects || {};
  let y = 0;
  const busWidth = 180;
  const busGap = 120;

  // Anchor 根节点
  nodes.push({
    id: 'Anchor',
    type: 'csrNode',
    position: { x: 250, y: 0 },
    data: { id: 'Anchor', label: 'Anchor', type: 'anchor' },
  });

  const buses = mt.Anchor.Buses || [];
  buses.forEach((busId, i) => {
    const nodeId = busId;
    const obj = objects[nodeId] as Record<string, unknown> | undefined;
    const busType = inferBusType(busId);
    const label = (obj && 'Id' in obj ? `${busId} (Id:${obj.Id})` : busId) as string;

    nodes.push({
      id: nodeId,
      type: 'csrNode',
      position: { x: 80, y: 80 + i * busGap },
      data: {
        id: nodeId,
        label,
        type: 'bus',
        objectDef: obj as Record<string, unknown>,
      },
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
          nodes.push({
            id: chipId,
            type: 'csrNode',
            position: {
              x: 80 + busWidth + 60,
              y: 80 + i * busGap + childIdx * 80,
            },
            data: {
              id: chipId,
              label: chipLabel,
              type: 'chip',
              objectDef: chipObj as Record<string, unknown>,
            },
          });
          edges.push({ id: `e-${busId}-${chipId}`, source: busId, target: chipId });
          childIdx++;
        });
      }
      if (busNode.Connectors) {
        busNode.Connectors.forEach((connId) => {
          const connObj = objects[connId] as Record<string, unknown> | undefined;
          const connLabel = connObj
            ? `${connId} (Slot:${(connObj.Slot as number) ?? '-'})`
            : connId;
          nodes.push({
            id: connId,
            type: 'csrNode',
            position: {
              x: 80 + busWidth + 60,
              y: 80 + i * busGap + childIdx * 80,
            },
            data: {
              id: connId,
              label: connLabel,
              type: 'connector',
              objectDef: connObj as Record<string, unknown>,
            },
          });
          edges.push({ id: `e-${busId}-${connId}`, source: busId, target: connId });
          childIdx++;
        });
      }
    }
  });

  return { nodes, edges };
}

function inferBusType(id: string): string {
  if (id.startsWith('I2c') || id.includes('I2cMux')) return 'I2C';
  if (id.startsWith('Jtag')) return 'JTAG';
  if (id.startsWith('Gpio')) return 'GPIO';
  if (id.startsWith('Hisport')) return 'Hisport';
  return 'Bus';
}

export function flowToCsr(
  nodes: Node<TopologyNodeData>[],
  edges: Edge[],
  baseCsr: CSRDocument
): CSRDocument {
  const mt: ManagementTopology = { Anchor: { Buses: [] } };
  const objects: Record<string, unknown> = { ...(baseCsr.Objects || {}) };

  const anchor = nodes.find((n) => n.data.type === 'anchor');
  if (!anchor) return { ...baseCsr, ManagementTopology: mt };

  const busEdges = edges.filter((e) => e.source === 'Anchor');
  const busIds = busEdges.map((e) => e.target).filter(Boolean);
  mt.Anchor!.Buses = busIds as string[];

  busIds.forEach((busId) => {
    const chipEdges = edges.filter((e) => e.source === busId);
    const chips = chipEdges
      .filter((e) => {
        const n = nodes.find((n2) => n2.id === e.target);
        return n?.data.type === 'chip';
      })
      .map((e) => e.target);
    const connectors = chipEdges
      .filter((e) => {
        const n = nodes.find((n2) => n2.id === e.target);
        return n?.data.type === 'connector';
      })
      .map((e) => e.target);
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

  return {
    ...baseCsr,
    ManagementTopology: mt,
    Objects: objects,
  };
}

