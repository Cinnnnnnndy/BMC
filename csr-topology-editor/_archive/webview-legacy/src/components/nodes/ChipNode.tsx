import React from 'react';
import { Handle, Position } from '@xyflow/react';
import styles from './ChipNode.module.css';

interface ChipNodeData {
  chipType: string;
}

interface ChipNodeProps {
  data: ChipNodeData;
  selected?: boolean | null;
}

const ChipNode: React.FC<ChipNodeProps> = ({ data, selected }) => {
  const getHeaderColor = (chipType: string): string => {
    switch (chipType) {
      case 'Eeprom': return '#6b7280';
      case 'CPU': return '#22c55e';
      case 'Lm75': return '#8b5cf6';
      case 'Smc': return '#f59e0b';
      case 'Cpld': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`${styles.chipNode} ${selected ? styles.selected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
      />
      <div 
        className={styles.header}
        style={{ backgroundColor: getHeaderColor(data.chipType) }}
      />
      <div className={styles.body}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" fill="#6b7280" stroke="#374151" strokeWidth="1"/>
          <line x1="8" y1="4" x2="8" y2="2" stroke="#6b7280" strokeWidth="1"/>
          <line x1="12" y1="4" x2="12" y2="2" stroke="#6b7280" strokeWidth="1"/>
          <line x1="16" y1="4" x2="16" y2="2" stroke="#6b7280" strokeWidth="1"/>
          <line x1="8" y1="20" x2="8" y2="22" stroke="#6b7280" strokeWidth="1"/>
          <line x1="12" y1="20" x2="12" y2="22" stroke="#6b7280" strokeWidth="1"/>
          <line x1="16" y1="20" x2="16" y2="22" stroke="#6b7280" strokeWidth="1"/>
          <line x1="4" y1="8" x2="2" y2="8" stroke="#6b7280" strokeWidth="1"/>
          <line x1="4" y1="12" x2="2" y2="12" stroke="#6b7280" strokeWidth="1"/>
          <line x1="4" y1="16" x2="2" y2="16" stroke="#6b7280" strokeWidth="1"/>
          <line x1="20" y1="8" x2="22" y2="8" stroke="#6b7280" strokeWidth="1"/>
          <line x1="20" y1="12" x2="22" y2="12" stroke="#6b7280" strokeWidth="1"/>
          <line x1="20" y1="16" x2="22" y2="16" stroke="#6b7280" strokeWidth="1"/>
          <circle cx="12" cy="12" r="2" fill="#374151"/>
        </svg>
      </div>
      <div className={styles.footer}>
        {data.chipType}
      </div>
    </div>
  );
};

export default ChipNode;
