import React, { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

import TopBar from './components/TopBar/TopBar';
import Canvas from './components/Canvas/Canvas';
import PropertyPanel from './components/panels/PropertyPanel';
import CodeViewModal from './components/panels/CodeViewModal';
import { initialNodes, initialEdges } from './data/taishan2280';
import styles from './App.module.css';

export default function App() {
  const [selectedNode, setSelectedNode] = useState<Node | undefined>();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(undefined);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<Node>) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setEdges(prevEdges => 
      prevEdges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
    );
  }, []);

  return (
    <div className={styles.app}>
      <TopBar />
      
      <div className={styles.mainContent}>
        <Canvas
          initialNodes={nodes}
          initialEdges={edges}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
        />
        
        {selectedNode && (
          <PropertyPanel
            node={selectedNode}
            onClose={() => setSelectedNode(undefined)}
            onUpdate={handleNodeUpdate}
            onDelete={handleNodeDelete}
          />
        )}
      </div>
      
      {showCodeModal && (
        <CodeViewModal
          nodes={nodes}
          edges={edges}
          onClose={() => setShowCodeModal(false)}
        />
      )}
    </div>
  );
}
