import React from 'react';
import { Handle, Position } from '@xyflow/react';
import styles from './SMBusNode.module.css';

interface SMBusNodeData {
  label: string;
}

interface SMBusNodeProps {
  data: SMBusNodeData;
  selected?: boolean;
}

const SMBusNode: React.FC<SMBusNodeProps> = ({ data, selected }) => {
  return (
    <div className={`${styles.smbusNode} ${selected ? styles.selected : ''}`}>
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

export default SMBusNode;
