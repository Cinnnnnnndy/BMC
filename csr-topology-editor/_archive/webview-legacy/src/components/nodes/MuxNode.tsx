import React from 'react';
import { Handle, Position } from '@xyflow/react';
import styles from './MuxNode.module.css';

interface MuxNodeData {
  label: string;
}

interface MuxNodeProps {
  data: { label: string };
  selected?: boolean | null;
}

const MuxNode: React.FC<MuxNodeProps> = ({ data, selected }) => {
  return (
    <div className={`${styles.muxNode} ${selected ? styles.selected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handleTop}
      />
      <div className={styles.label}>
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="1"
        className={styles.handleBottom1}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="2"
        className={styles.handleBottom2}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="3"
        className={styles.handleBottom3}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="4"
        className={styles.handleBottom4}
      />
    </div>
  );
};

export default MuxNode;
