import React from 'react';
import { Handle, Position } from '@xyflow/react';
import styles from './BusNode.module.css';

interface BusNodeData {
  label: string;
  dashed?: boolean;
}

interface BusNodeProps {
  data: BusNodeData;
  selected?: boolean | null;
}

const BusNode: React.FC<BusNodeProps> = ({ data, selected }) => {
  return (
    <div className={`${styles.busNode} ${selected ? styles.selected : ''} ${data.dashed ? styles.dashed : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
      />
      <div className={styles.label}>
        {data.label}
      </div>
    </div>
  );
};

export default BusNode;
