import React from 'react';
import styles from './GroupNode.module.css';

interface GroupNodeData {
  label: string;
}

interface GroupNodeProps {
  data: GroupNodeData;
  selected?: boolean;
  children?: React.ReactNode;
}

const GroupNode: React.FC<GroupNodeProps> = ({ data, selected }) => {
  return (
    <div className={`${styles.groupNode} ${selected ? styles.selected : ''}`}>
      <div className={styles.label}>
        {data.label}
      </div>
    </div>
  );
};

export default GroupNode;
