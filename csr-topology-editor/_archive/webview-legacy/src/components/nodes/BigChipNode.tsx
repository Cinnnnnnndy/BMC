import React from 'react';
import { Handle, Position } from '@xyflow/react';
import styles from './BigChipNode.module.css';

interface BigChipNodeData {
  chipType: string;
}

interface BigChipNodeProps {
  data: { chipType: string };
  selected?: boolean | null;
}

const BigChipNode: React.FC<BigChipNodeProps> = ({ data, selected }) => {
  return (
    <div className={`${styles.bigChipNode} ${selected ? styles.selected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
      />
      <div className={styles.body}>
        <svg width="50" height="40" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="40" height="30" fill="#6b7280" stroke="#374151" strokeWidth="1"/>
          <line x1="15" y1="5" x2="15" y2="2" stroke="#6b7280" strokeWidth="1"/>
          <line x1="25" y1="5" x2="25" y2="2" stroke="#6b7280" strokeWidth="1"/>
          <line x1="35" y1="5" x2="35" y2="2" stroke="#6b7280" strokeWidth="1"/>
          <line x1="15" y1="35" x2="15" y2="38" stroke="#6b7280" strokeWidth="1"/>
          <line x1="25" y1="35" x2="25" y2="38" stroke="#6b7280" strokeWidth="1"/>
          <line x1="35" y1="35" x2="35" y2="38" stroke="#6b7280" strokeWidth="1"/>
          <line x1="5" y1="12" x2="2" y2="12" stroke="#6b7280" strokeWidth="1"/>
          <line x1="5" y1="20" x2="2" y2="20" stroke="#6b7280" strokeWidth="1"/>
          <line x1="5" y1="28" x2="2" y2="28" stroke="#6b7280" strokeWidth="1"/>
          <line x1="45" y1="12" x2="48" y2="12" stroke="#6b7280" strokeWidth="1"/>
          <line x1="45" y1="20" x2="48" y2="20" stroke="#6b7280" strokeWidth="1"/>
          <line x1="45" y1="28" x2="48" y2="28" stroke="#6b7280" strokeWidth="1"/>
          <circle cx="25" cy="20" r="3" fill="#374151"/>
        </svg>
      </div>
      <div className={styles.footer}>
        {data.chipType}
      </div>
    </div>
  );
};

export default BigChipNode;
