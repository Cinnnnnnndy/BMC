import React from 'react';
import { 
  MousePointer2, 
  Link, 
  Plus, 
  AlignCenter, 
  Undo, 
  Redo, 
  Move, 
  Lock, 
  MessageSquare, 
  Settings, 
  User 
} from 'lucide-react';
import styles from './BottomBar.module.css';

interface BottomBarProps {
  onToolSelect?: (tool: string) => void;
  selectedTool?: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ onToolSelect, selectedTool }) => {
  const tools = [
    { id: 'select', icon: MousePointer2, tooltip: '选择工具' },
    { id: 'connect', icon: Link, tooltip: '连线工具' },
    { id: 'add', icon: Plus, tooltip: '添加节点' },
    { id: 'align', icon: AlignCenter, tooltip: '对齐工具' },
    { id: 'undo', icon: Undo, tooltip: '撤销' },
    { id: 'redo', icon: Redo, tooltip: '重做' },
    { id: 'move', icon: Move, tooltip: '移动' },
    { id: 'lock', icon: Lock, tooltip: '锁定' },
    { id: 'comment', icon: MessageSquare, tooltip: '注释' },
    { id: 'settings', icon: Settings, tooltip: '更多设置' },
    { id: 'user', icon: User, tooltip: '用户' },
  ];

  return (
    <div className={styles.bottomBar}>
      <div className={styles.toolGroup}>
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`${styles.toolButton} ${selectedTool === tool.id ? styles.active : ''}`}
            onClick={() => onToolSelect?.(tool.id)}
            title={tool.tooltip}
          >
            <tool.icon size={16} />
          </button>
        ))}
      </div>
      
      <div className={styles.zoomControls}>
        <button className={styles.zoomButton}>—</button>
        <span className={styles.zoomLevel}>100%</span>
        <button className={styles.zoomButton}>+</button>
      </div>
    </div>
  );
};

export default BottomBar;
