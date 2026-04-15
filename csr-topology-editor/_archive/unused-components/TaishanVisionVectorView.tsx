import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';

import type { CSRDocument, TopologyNodeData } from '../types';
import { csrToFlowRecursive } from '../csrParser';
import { CsrNode } from './CsrNode';

export function TaishanVisionVectorView({ csr }: { csr: CSRDocument }) {
  const { nodes, edges } = useMemo(() => {
    const flow = csrToFlowRecursive(csr);

    // 统一线性视觉：straight + 明显紫色/青色一类
    const typedEdges: Edge[] = flow.edges.map((e) => ({
      ...e,
      type: 'straight',
      style: { stroke: 'rgba(189, 139, 255, 0.70)', strokeWidth: 1.2 },
    }));

    // 给节点做一点“卡片化”宽度，让整体看起来更像截图中的块状拓扑
    const typedNodes: Node<TopologyNodeData>[] = flow.nodes.map((n) => ({
      ...n,
      style: {
        ...(n.style || {}),
        borderRadius: 10,
        padding: 0,
      },
    }));

    return { nodes: typedNodes, edges: typedEdges };
  }, [csr]);

  const nodeTypes = useMemo(() => ({ csrNode: CsrNode }), []);

  return (
    <div className="flow-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="glass-flow"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
      >
        <Background color="rgba(229, 236, 255, 0.16)" gap={18} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

