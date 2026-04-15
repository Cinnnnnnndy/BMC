import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X, Download, Copy } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import styles from './CodeViewModal.module.css';

interface CodeViewModalProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

const CodeViewModal: React.FC<CodeViewModalProps> = ({
  nodes,
  edges,
  onClose
}) => {
  const csrData = {
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
      ...(node.parentId && { parentId: node.parentId }),
      ...(node.style && { style: node.style })
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      ...(edge.style && { style: edge.style }),
      ...(edge.label && { label: edge.label }),
      ...(edge.labelStyle && { labelStyle: edge.labelStyle }),
      ...(edge.labelBgStyle && { labelBgStyle: edge.labelBgStyle })
    }))
  };

  const jsonString = JSON.stringify(csrData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    // Show toast or notification
    alert('CSR JSON 已复制到剪贴板');
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taishan2280-csr.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>CSR 拓扑代码</h3>
          <div className={styles.actions}>
            <button 
              className={styles.actionButton}
              onClick={handleCopy}
              title="复制代码"
            >
              <Copy size={16} />
            </button>
            <button 
              className={styles.actionButton}
              onClick={handleDownload}
              title="下载文件"
            >
              <Download size={16} />
            </button>
            <button 
              className={styles.closeButton}
              onClick={onClose}
              title="关闭"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className={styles.content}>
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: '12px',
              lineHeight: '1.5',
              background: '#1e1e2e'
            }}
            showLineNumbers
            wrapLines
          >
            {jsonString}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CodeViewModal;
