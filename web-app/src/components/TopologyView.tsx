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
import { TaiShanBoardTopologyView } from './TaiShanBoardTopologyView';
import { VendorHuaweiTianChiTopologyView } from './VendorHuaweiTianChiTopologyView';
import { TaishanStaticVectorTopologyView } from './TaishanStaticVectorTopologyView';

interface Props {
  csr: CSRDocument;
  onChange: (csr: CSRDocument) => void;
  projectId?: string | null;
}

export function TopologyView({ csr, onChange, projectId }: Props) {
  if (projectId === 'huawei-kunpeng-taishan-2180-v2') {
    // 静态矢量复刻模式：不依赖 CSR，只复刻暗色.png 的“块状拓扑风格”
    return <TaishanStaticVectorTopologyView />;
  }
  if (projectId === 'huawei-tianchi') {
    return <VendorHuaweiTianChiTopologyView />;
  }

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => csrToFlow(csr), [csr]);

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

  const nodeTypes = useMemo(() => ({ csrNode: CsrNode }), []);

  return (
    <div className="flow-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        fitView
        className="glass-flow"
      >
        <Background color="rgba(229, 236, 255, 0.22)" gap={20} />
        <Controls />
        <MiniMap />
        <Panel position="top-left" className="flow-hint-panel">
          拖拽节点可调整布局，连线表示拓扑关系
        </Panel>
      </ReactFlow>
    </div>
  );
}
