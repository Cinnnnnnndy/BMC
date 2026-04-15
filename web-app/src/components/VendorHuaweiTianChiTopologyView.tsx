import React, { useEffect, useMemo, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';

import { CsrNode } from './CsrNode';
import type { CSRDocument } from '../types';
import { csrToFlowRecursive } from '../csrParser';
import type { TopologyNodeData } from '../csrParser';

// 把 vendor/Huawei/TianChi 下的所有 .sr 文件合并到同一个画布上（只读展示）。
// 注意：src 路径在构建时会被 Vite 处理；若你的构建器限制了跨目录读取，
// 需要改成把这些 .sr 预先拷贝到 web-app/public 下。
const VENDOR_SR_MAP = import.meta.glob('../../../../社区组件/vpd-main/vendor/Huawei/TianChi/**/*.sr', {
  query: '?raw',
  eager: true,
});

export function VendorHuaweiTianChiTopologyView() {
  const allFiles = useMemo(() => Object.entries(VENDOR_SR_MAP).sort((a, b) => a[0].localeCompare(b[0])), []);
  const firstSrPerChild = useMemo(() => {
    // TianChi/<childDir>/**/*.sr -> 每个 <childDir> 只取字典序最小的第一个 sr
    const map = new Map<string, [string, string]>();
    for (const entry of allFiles) {
      const [path, raw] = entry;
      const marker = '/TianChi/';
      const idx = path.indexOf(marker);
      if (idx < 0) continue;
      const after = path.slice(idx + marker.length); // <childDir>/...
      const segments = after.split('/');
      const childDir = segments[0];
      if (!childDir) continue;
      const existing = map.get(childDir);
      if (!existing) {
        map.set(childDir, entry as [string, string]);
      } else {
        // 选字典序更小的那个文件
        if (existing[0].localeCompare(path) > 0) map.set(childDir, entry as [string, string]);
      }
    }
    return Array.from(map.values()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allFiles]);
  const [nodes, setNodes] = useState<Node<TopologyNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ done: 0, total: firstSrPerChild.length });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const mergedNodes: Node<TopologyNodeData>[] = [];
      const mergedEdges: Edge[] = [];

      // 简单网格偏移，避免所有 SR 从同一位置叠在一起
      const tileCols = 3;
      const tileW = 900;
      const tileH = 650;

      for (let fileIdx = 0; fileIdx < firstSrPerChild.length; fileIdx++) {
        if (cancelled) return;
        const [path, raw] = firstSrPerChild[fileIdx];
        const prefix = path.split('/').pop()?.replace(/\.sr$/i, '') || `tianchi_${fileIdx}`;
        const text =
          typeof raw === 'string'
            ? raw
            : raw && typeof raw === 'object' && 'default' in raw
              ? String((raw as { default?: unknown }).default ?? '')
              : String(raw);

        let csr: CSRDocument | null = null;
        try {
          csr = JSON.parse(text) as CSRDocument;
        } catch {
          // 跳过无法解析的文件
          csr = null;
        }

        if (csr) {
          const flow = csrToFlowRecursive(csr);
          const tileX = (fileIdx % tileCols) * tileW;
          const tileY = Math.floor(fileIdx / tileCols) * tileH;

          for (const n of flow.nodes) {
            const newId = `${prefix}:${n.id}`;
            mergedNodes.push({
              ...n,
              id: newId,
              position: { x: (n.position?.x ?? 0) + tileX, y: (n.position?.y ?? 0) + tileY },
              data: n.data,
            });
          }

          for (const e of flow.edges) {
            mergedEdges.push({
              ...e,
              id: `${prefix}:${e.id}`,
              source: `${prefix}:${e.source}`,
              target: `${prefix}:${e.target}`,
            type: 'straight',
            style: { stroke: 'rgba(124,77,255,0.55)', strokeWidth: 1.2 },
            });
          }
        }

        // 分片让 UI 可更新：每 2 个文件让出一次主线程
        const done = fileIdx + 1;
        if (done % 2 === 0 || done === firstSrPerChild.length) {
          if (!cancelled) setProgress({ done, total: firstSrPerChild.length });
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      if (cancelled) return;
      setNodes(mergedNodes);
      setEdges(mergedEdges);
      setProgress({ done: firstSrPerChild.length, total: firstSrPerChild.length });
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [firstSrPerChild]);

  const nodeTypes = useMemo(() => ({ csrNode: CsrNode }), []);

  return (
    <div className="flow-wrap">
      {loading ? (
        <div
          style={{
            width: '100%',
            height: 520,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            color: 'rgba(232, 237, 248, 0.9)',
            fontSize: 13,
          }}
        >
          <div style={{ fontWeight: 700 }}>正在加载 Huawei/TianChi vendor 拓扑…</div>
          <div style={{ width: 420, border: '1px solid rgba(255,255,255,0.18)', borderRadius: 10, padding: 10, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ height: 10, borderRadius: 999, background: 'rgba(124,77,255,0.22)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%`,
                  height: '100%',
                  background: 'rgba(64,160,255,0.55)',
                  transition: 'width 120ms linear',
                }}
              />
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(232, 237, 248, 0.78)' }}>
              <span>
                {progress.done}/{progress.total}
              </span>
              <span>{progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          className="glass-flow"
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
        >
          <Background color="rgba(229, 236, 255, 0.22)" gap={20} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      )}
    </div>
  );
}

