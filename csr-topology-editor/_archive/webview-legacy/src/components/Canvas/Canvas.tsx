import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ConnectionMode,
  NodeTypes,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { BusNode, MuxNode, ChipNode, BigChipNode, SMBusNode, GroupNode } from '../nodes';
import styles from './Canvas.module.css';

const nodeTypes: NodeTypes = {
  bus: BusNode,
  mux: MuxNode,
  chip: ChipNode,
  bigchip: BigChipNode,
  smbus: SMBusNode,
  group: GroupNode,
};

interface CanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onPaneClick?: (event: React.MouseEvent) => void;
}

const CanvasContent: React.FC<CanvasProps> = ({
  initialNodes,
  initialEdges,
  onNodeClick,
  onPaneClick
}) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  );

  const defaultEdgeOptions = useMemo(() => ({
    animated: false,
    type: 'smoothstep',
    style: { strokeWidth: 1.5 },
  }), []);

  return (
    <div className={styles.canvas}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        minZoom={0.1}
        maxZoom={2}
        className={styles.reactFlow}
      >
        <Background
          color="#2a2a3a"
          gap={20}
          size={1}
          variant={BackgroundVariant.Dots}
        />
        <Controls
          className={styles.controls}
          showZoom={false}
          showFitView={true}
          showInteractive={false}
        />
        <MiniMap
          className={styles.minimap}
          nodeColor={(node) => {
            switch (node.type) {
              case 'bus': return '#e879a0';
              case 'mux': return '#a855f7';
              case 'smbus': return '#4ade80';
              case 'chip': return '#252535';
              case 'bigchip': return '#252535';
              default: return '#1e1e2e';
            }
          }}
          maskColor="rgba(26, 26, 42, 0.8)"
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
};

const Canvas: React.FC<CanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <CanvasContent {...props} />
    </ReactFlowProvider>
  );
};

export default Canvas;
