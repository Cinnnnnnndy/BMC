import React, { useMemo, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { csrToFlow, flowToCsr } from '../csrParser';
import { CsrNode } from './CsrNode';
import type { CSRDocument } from '../types';

interface Props {
  csr: CSRDocument;
  onChange: (csr: CSRDocument) => void;
}

export function TopologyView({ csr, onChange }: Props) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => csrToFlow(csr),
    [csr]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const csrRef = useRef(csr);
  csrRef.current = csr;
  React.useEffect(() => {
    const next = flowToCsr(nodes, edges, csrRef.current);
    onChange(next);
  }, [nodes, edges, onChange]);

  const nodeTypes = useMemo(
    () => ({
      csrNode: CsrNode,
    }),
    []
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        fitView
        style={{ background: '#1e1e1e' }}
      >
        <Background color="#3c3c3c" gap={16} />
        <Controls />
        <MiniMap />
        <Panel position="top-left" style={{ color: '#888', fontSize: 12 }}>
          拖拽节点可调整布局，连线表示拓扑关系
        </Panel>
      </ReactFlow>
    </div>
  );
}
