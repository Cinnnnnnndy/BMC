import React from 'react';
import type { NodeProps } from '@xyflow/react';
import type { TopologyNodeData } from '../csrParser';

export function CsrNode({ data }: NodeProps<TopologyNodeData>) {
  const typeClass = `csr-node csr-node--${String(data.type).toLowerCase()}`;
  const kindClass = data.kind ? ` csr-node--kind-${String(data.kind).toLowerCase()}` : '';
  const showType = data.kind ? String(data.kind) : String(data.type);
  return (
    <div className={`${typeClass}${kindClass}`}>
      <div className="csr-node-label">{data.label}</div>
      <div className="csr-node-type">{showType}</div>
    </div>
  );
}
