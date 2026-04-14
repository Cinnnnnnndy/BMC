import React from 'react';
import type { NodeProps } from '@xyflow/react';
import type { TopologyNodeData } from '../csrParser';

export function CsrNode({ data }: NodeProps<TopologyNodeData>) {
  const typeColors: Record<string, string> = {
    anchor: '#0e639c',
    bus: '#4ec9b0',
    chip: '#dcdcaa',
    connector: '#ce9178',
  };
  const color = typeColors[data.type as string] ?? '#666';
  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        background: '#252526',
        border: `2px solid ${color}`,
        minWidth: 100,
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{data.label}</div>
      <div style={{ fontSize: 10, color: '#888' }}>{data.type}</div>
    </div>
  );
}
