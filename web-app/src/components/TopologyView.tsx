import React, { useMemo, useCallback, useRef, useState } from 'react';
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
import { BoardAlarmDrawer } from './BoardAlarmDrawer';
import { deviceTypeOf } from '../alarm/alarmKnowledge';
import { CsrExportDialog } from './CsrExportDialog';
import type { CsrExportConfig } from './CsrExportDialog';

interface Props {
  csr: CSRDocument;
  onChange: (csr: CSRDocument) => void;
  projectId?: string | null;
  eventDef?: Record<string, unknown> | null;
}

export function TopologyView({ csr, onChange, projectId, eventDef }: Props) {
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

  const [alarmOpen, setAlarmOpen] = useState(false);
  const [focusDevice, setFocusDevice] = useState<string | null>(null);
  const [csrExportOpen, setCsrExportOpen] = useState(false);
  const boardName = csr.Unit?.Name || (typeof csr.DataVersion === 'string' ? csr.DataVersion : '') || '当前板卡';

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: unknown, node: { id: string }) => {
    // 点到可监控器件节点时，打开抽屉并聚焦该器件；否则仅打开抽屉
    if (deviceTypeOf(node.id)) { setFocusDevice(node.id); setAlarmOpen(true); }
  }, []);

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
        onNodeClick={onNodeClick}
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
        <Panel position="top-right">
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => { setFocusDevice(null); setAlarmOpen(true); }}
              style={{
                padding: '7px 14px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                border: '1px solid color-mix(in srgb, var(--primary) 40%, transparent)',
                background: 'color-mix(in srgb, var(--primary) 16%, transparent)',
                color: 'var(--primary)', fontSize: 12, fontFamily: 'inherit',
              }}
            >
              配置板卡告警
            </button>
            <button
              onClick={() => setCsrExportOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                border: 'none',
                background: 'var(--primary)',
                color: '#fff', fontSize: 12, fontFamily: 'inherit',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              CSR 出包
            </button>
          </div>
        </Panel>
      </ReactFlow>
      {alarmOpen && (
        <BoardAlarmDrawer
          csr={csr}
          boardName={boardName}
          eventDef={eventDef}
          focusDevice={focusDevice}
          onChange={onChange}
          onClose={() => setAlarmOpen(false)}
        />
      )}
      <CsrExportDialog
        open={csrExportOpen}
        onClose={() => setCsrExportOpen(false)}
        boardName={boardName}
        onExport={(config: CsrExportConfig) => {
          // TODO: 调用 bingo CLI 或 vscode.postMessage 执行出包
          console.log('[CSR出包]', config);
        }}
        onBinBuild={(config: CsrExportConfig) => {
          console.log('[bin文件构建]', config);
        }}
      />
    </div>
  );
}
