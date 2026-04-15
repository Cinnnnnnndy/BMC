import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { Node } from '@xyflow/react';

function BgImageNode({ data }: NodeProps<{ imgUrl: string }>) {
  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      <img
        src={data.imgUrl}
        alt=""
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none' }}
      />
    </div>
  );
}

export function TaishanVisionExplorationView() {
  const nodeTypes = useMemo(() => ({ taishanVisionBg: BgImageNode }), []);

  // 使用上一轮你提供的“暗色.png”作为静态背景，直接复刻画面内容
  const nodes = useMemo(() => {
    const imgUrl = '/images/taishan-vision-dark.png';
    const w = 1600;
    const h = 900;
    const bgNode: Node<{ imgUrl: string }> = {
      id: 'taishan-bg',
      type: 'taishanVisionBg',
      position: { x: 0, y: 0 },
      data: { imgUrl },
      style: { width: w, height: h },
    };
    return [bgNode];
  }, []);

  return (
    <div className="flow-wrap">
      <ReactFlow
        nodes={nodes}
        edges={[]}
        nodeTypes={nodeTypes}
        fitView
        className="glass-flow"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
      >
        {/* 背景网格用极淡一点，让截图的内容成为视觉主角 */}
        <Background color="rgba(229, 236, 255, 0.06)" gap={40} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

