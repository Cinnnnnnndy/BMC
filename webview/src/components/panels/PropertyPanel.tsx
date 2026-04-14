import React, { useState } from 'react';
import { X, Edit, Trash2, Copy } from 'lucide-react';
import { Node } from '@xyflow/react';
import styles from './PropertyPanel.module.css';

interface PropertyPanelProps {
  node?: Node;
  onClose: () => void;
  onUpdate?: (nodeId: string, updates: Partial<Node>) => void;
  onDelete?: (nodeId: string) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  node,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(node?.data || {});

  if (!node) return null;

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(node.id, { data: editedData });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(node.data || {});
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('确定要删除这个节点吗？')) {
      onDelete(node.id);
      onClose();
    }
  };

  const handleCopy = () => {
    // Copy node logic would be implemented here
    alert('复制节点功能待实现');
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>节点属性</h3>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.field}>
          <label>节点ID:</label>
          <input
            type="text"
            value={node.id}
            disabled
            className={styles.disabledInput}
          />
        </div>
        
        <div className={styles.field}>
          <label>节点类型:</label>
          <input
            type="text"
            value={node.type || ''}
            disabled
            className={styles.disabledInput}
          />
        </div>
        
        <div className={styles.field}>
          <label>位置 X:</label>
          <input
            type="number"
            value={Math.round(node.position.x)}
            disabled
            className={styles.disabledInput}
          />
        </div>
        
        <div className={styles.field}>
          <label>位置 Y:</label>
          <input
            type="number"
            value={Math.round(node.position.y)}
            disabled
            className={styles.disabledInput}
          />
        </div>
        
        {isEditing ? (
          <div className={styles.field}>
            <label>数据:</label>
            <textarea
              value={JSON.stringify(editedData, null, 2)}
              onChange={(e) => {
                try {
                  const data = JSON.parse(e.target.value);
                  setEditedData(data);
                } catch (err) {
                  // Invalid JSON, don't update
                }
              }}
              className={styles.textarea}
              rows={6}
            />
          </div>
        ) : (
          <div className={styles.field}>
            <label>数据:</label>
            <pre className={styles.dataDisplay}>
              {JSON.stringify(node.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className={styles.actions}>
        {isEditing ? (
          <>
            <button className={styles.saveButton} onClick={handleSave}>
              保存
            </button>
            <button className={styles.cancelButton} onClick={handleCancel}>
              取消
            </button>
          </>
        ) : (
          <>
            <button className={styles.editButton} onClick={() => setIsEditing(true)}>
              <Edit size={14} />
              编辑
            </button>
            <button className={styles.copyButton} onClick={handleCopy}>
              <Copy size={14} />
              复制
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
              <Trash2 size={14} />
              删除
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;
