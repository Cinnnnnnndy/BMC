/**
 * CSR 拓扑代码适配尝试 v2
 *
 * 从 vpd-main/vendor/openUBMC/ 实际 SR 文件提取 ManagementTopology，
 * 每种板卡类型选取一张，用与现有拓扑视图相同的视觉元素展示代码关联关系。
 *
 * 布局规则：
 *   左侧 = 输入（Anchor / 来自主板的 I2C 接口）
 *   右侧 = 输出（连接器 / 终端芯片）
 *
 * 边样式：
 *   虚线箭头 = 板卡间 I2C（Anchor → 第一级总线，对应物理拓扑图中的虚线连线）
 *   实线箭头 = 板卡内 I2C（总线 → 芯片 / 连接器，对应板卡内部走线）
 */
import { useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  ConnectionMode,
  MarkerType,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { csrToFlowRecursive } from '../csrParser';
import type { TopologyNodeData } from '../csrParser';
import { CsrNode } from './CsrNode';
import type { CSRDocument } from '../types';

// ─── 实际 SR 文件 ManagementTopology 数据 ─────────────────────────────────────

/** CLU 风扇板  14100363_00000001050302023924_soft.sr（无完整拓扑，使用 TTY 参考拓扑） */
const CLU_CSR: CSRDocument = {
  FormatVersion: '2.54',
  Unit: { Type: 'CLU', Name: 'FanBoard' },
  ManagementTopology: {
    Anchor: { Buses: ['I2c_2', 'I2c_4'] },
    I2c_2: {
      Chips: ['Smc_ExpBoardSMC'],
      Connectors: [
        'Connector_Fan1DualSensor',
        'Connector_Fan2DualSensor',
        'Connector_Fan3DualSensor',
        'Connector_Fan4DualSensor',
        'Connector_Fan5DualSensor',
        'Connector_Fan6DualSensor',
      ],
    },
  },
  Objects: {
    Smc_ExpBoardSMC: { Address: 0x60, AddrWidth: 1, OffsetWidth: 1 },
  },
};

/**
 * IEU 扩展卡（RiserCard X8*2）  14100513_000000010402580311.sr
 * 拓扑：Anchor → Hisport_0 → Pca9545_PCA9545 → I2cMux_* → 芯片/PCIe 连接器
 * Hisport_0 是来自主板的高速端口（板卡入口）
 */
const IEU_CSR: CSRDocument = {
  FormatVersion: '1.00',
  Unit: { Type: 'IEU', Name: 'RiserCard_X8x2_BC83PRUOA' },
  ManagementTopology: {
    Anchor: { Buses: ['Hisport_0'] },
    Hisport_0: { Chips: ['Pca9545_PCA9545'] },
    Pca9545_PCA9545: {
      Buses: [
        'I2cMux_Pca9545_PCA9545_2',
        'I2cMux_Pca9545_PCA9545_3',
        'I2cMux_Pca9545_PCA9545_4',
      ],
    },
    I2cMux_Pca9545_PCA9545_2: { Connectors: ['Connector_PCIE_SLOT2'] },
    I2cMux_Pca9545_PCA9545_3: { Connectors: ['Connector_PCIE_SLOT3'] },
    I2cMux_Pca9545_PCA9545_4: { Chips: ['Pca9555_IO', 'Chip_MCU1'] },
    Chip_MCU1: { Buses: ['I2cMux_McuSwitch'] },
    I2cMux_McuSwitch: { Chips: ['Eeprom_IEU'] },
  },
  Objects: {
    Pca9545_PCA9545: { Address: 0x70 },
    Pca9555_IO: { Address: 0x20 },
    Chip_MCU1: { Address: 0x08 },
    Eeprom_IEU: { Address: 0x50, OffsetWidth: 2 },
  },
};

/**
 * SEU 硬盘背板（HddBackplane BC83NHBO）  14100665_00000001030302046571.sr
 * 拓扑：Anchor → [I2c_2, I2cMux_pca9545_chan3, JtagOverLocalBus_1]
 *       I2c_2 → Smc_ExpBoardSMC（跨板 SMC）
 *       I2cMux_pca9545_chan3 → [Smc_EnclSMC, Eeprom_SEU, Chip_Cpld]
 *       Smc_EnclSMC → [I2cMux_SMC_1, I2cMux_SMC_2] → 连接器
 */
const SEU_CSR: CSRDocument = {
  FormatVersion: '1.00',
  Unit: { Type: 'SEU', Name: 'HddBackplane_BC83NHBO' },
  ManagementTopology: {
    Anchor: { Buses: ['I2c_2', 'I2cMux_pca9545_chan3', 'JtagOverLocalBus_1'] },
    I2c_2: { Chips: ['Smc_ExpBoardSMC'] },
    I2cMux_pca9545_chan3: { Chips: ['Smc_EnclSMC', 'Eeprom_SEU', 'Chip_Cpld'] },
    Smc_EnclSMC: { Buses: ['I2cMux_SMC_1', 'I2cMux_SMC_2'] },
    I2cMux_SMC_1: { Connectors: ['Connector_ComVPDConnect_1'] },
    I2cMux_SMC_2: { Connectors: ['Connector_ComVPDConnect_2'] },
    JtagOverLocalBus_1: { Chips: ['Cpld_1'] },
  },
  Objects: {
    Smc_ExpBoardSMC: { Address: 0x60 },
    Smc_EnclSMC: { Address: 0x61 },
    Eeprom_SEU: { Address: 0x50, OffsetWidth: 2 },
    Chip_Cpld: { Address: 0x10 },
    Cpld_1: { Address: 0x00 },
  },
};

/**
 * PSR BMC 板  14100513_00000001040302023953_soft.sr（对象层数据，无完整拓扑）
 * 使用参考拓扑：I2c_2 + I2cMux 挂载 EEPROM/SMC
 */
const PSR_CSR: CSRDocument = {
  FormatVersion: '3.00',
  Unit: { Type: 'PSR', Name: 'BMCBoard' },
  ManagementTopology: {
    Anchor: { Buses: ['I2c_2', 'I2cMux_i2c7_E0_6'] },
    I2c_2: { Chips: ['Eeprom_1', 'Smc_ExpBoardSMC'] },
    I2cMux_i2c7_E0_6: { Chips: ['Eeprom_FanPower'] },
  },
  Objects: {
    Eeprom_1: { Address: 0x50 },
    Smc_ExpBoardSMC: { Address: 0x60 },
    Eeprom_FanPower: { Address: 0x50 },
  },
};

/**
 * NICCard 4×GE（BC83ETHA）  14220246_00000001100302023955.sr
 * 拓扑：Anchor → [I2c_2, I2cMux_pca9545_chan1]
 *       I2c_2 → Smc_ExpBoardSMC（跨板 SMC，来自主板 I2C）
 *       I2cMux_pca9545_chan1 → [Eeprom_NIC, Lm75_1]
 */
const NIC_CSR: CSRDocument = {
  FormatVersion: '1.00',
  Unit: { Type: 'NICCard', Name: 'NICCard_4GE_BC83ETHA' },
  ManagementTopology: {
    Anchor: { Buses: ['I2c_2', 'I2cMux_pca9545_chan1'] },
    I2c_2: { Chips: ['Smc_ExpBoardSMC'] },
    I2cMux_pca9545_chan1: { Chips: ['Eeprom_NIC', 'Lm75_1'] },
  },
  Objects: {
    Eeprom_NIC: { Address: 0xae, OffsetWidth: 2 },
    Lm75_1: { Address: 0x90 },
    Smc_ExpBoardSMC: { Address: 0x60 },
  },
};

// ─── 板卡定义列表 ──────────────────────────────────────────────────────────────

interface BoardDef {
  id: string;
  label: string;
  typeTag: string;
  srFile: string;
  csr: CSRDocument;
  description: string;
}

const BOARDS: BoardDef[] = [
  {
    id: 'clu',
    label: 'CLU 风扇板',
    typeTag: 'CLU',
    srFile: '14100363_00000001050302023924.sr',
    csr: CLU_CSR,
    description: 'FanBoard — I2c_2 挂载 SMC 与 6 路风扇连接器',
  },
  {
    id: 'ieu',
    label: 'IEU 扩展卡',
    typeTag: 'IEU',
    srFile: '14100513_000000010402580311.sr',
    csr: IEU_CSR,
    description: 'RiserCard X8×2 BC83PRUOA — Hisport_0 → PCA9545 → I2cMux → PCIe/芯片链路',
  },
  {
    id: 'seu',
    label: 'SEU 硬盘背板',
    typeTag: 'SEU',
    srFile: '14100665_00000001030302046571.sr',
    csr: SEU_CSR,
    description: 'HddBackplane BC83NHBO — I2c/I2cMux/JtagOverLocalBus 多总线 + SMC 子树',
  },
  {
    id: 'psr',
    label: 'PSR BMC板',
    typeTag: 'PSR',
    srFile: '14100513_00000001040302023953_soft.sr',
    csr: PSR_CSR,
    description: 'PSR BMCBoard — I2c_2 + I2cMux 挂载 EEPROM/SMC',
  },
  {
    id: 'nic',
    label: 'NIC 网卡 4GE',
    typeTag: 'NICCard',
    srFile: '14220246_00000001100302023955.sr',
    csr: NIC_CSR,
    description: 'NICCard 4×GE BC83ETHA — I2c_2 (跨板 SMC) + I2cMux (EEPROM/温感)',
  },
];

// ─── 布局后处理：BFS 深度 → 左→右列布局，添加方向箭头 ─────────────────────────

/**
 * 对 csrToFlowRecursive 的输出进行重布局：
 *   1. BFS 从 Anchor 出发计算每个节点的"深度"
 *   2. x = 80 + depth × stepX（越深越靠右）
 *   3. y = 80 + index_in_depth_group × stepY（同列节点垂直排列）
 *   4. 边添加方向箭头（MarkerType.ArrowClosed）
 *   5. Anchor→第一级总线的边渲染为虚线（代表板卡间 I2C 外部连线）
 */
function reLayoutByDepth(
  nodes: Node<TopologyNodeData>[],
  edges: Edge[]
): { nodes: Node<TopologyNodeData>[]; edges: Edge[] } {
  // 构建邻接表（有向：source → target）
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) {
    const list = adj.get(e.source);
    if (list) list.push(e.target);
  }

  // BFS 计算每个节点的深度
  const depthMap = new Map<string, number>();
  depthMap.set('Anchor', 0);
  const queue: string[] = ['Anchor'];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    const d = depthMap.get(curr)!;
    for (const next of adj.get(curr) ?? []) {
      if (!depthMap.has(next)) {
        depthMap.set(next, d + 1);
        queue.push(next);
      }
    }
  }

  // 按深度分组，保持原始节点在同组内的相对顺序
  const byDepth = new Map<number, string[]>();
  // 遍历原始节点数组来保持顺序
  for (const n of nodes) {
    const d = depthMap.get(n.id) ?? 0;
    if (!byDepth.has(d)) byDepth.set(d, []);
    byDepth.get(d)!.push(n.id);
  }

  const stepX = 270;
  const stepY = 90;
  const startX = 80;
  const startY = 60;

  // 重新分配坐标
  const newNodes: Node<TopologyNodeData>[] = nodes.map((n) => {
    const d = depthMap.get(n.id) ?? 0;
    const group = byDepth.get(d) ?? [n.id];
    const idx = group.indexOf(n.id);
    return {
      ...n,
      position: {
        x: startX + d * stepX,
        y: startY + idx * stepY,
      },
    };
  });

  // 添加方向箭头；Anchor→总线 的边设为虚线（板卡间外部 I2C）
  const newEdges: Edge[] = edges.map((e) => {
    const isExternal = e.source === 'Anchor';
    return {
      ...e,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
      },
      style: isExternal
        ? {
            strokeDasharray: '8 4',
            strokeWidth: 2,
            stroke: 'rgba(96, 200, 255, 0.65)',
          }
        : {
            strokeWidth: 1.6,
            stroke: 'rgba(130, 180, 255, 0.5)',
          },
    };
  });

  return { nodes: newNodes, edges: newEdges };
}

// ─── 主组件 ────────────────────────────────────────────────────────────────────

const nodeTypes = { csrNode: CsrNode };

export function CsrCodeAdaptationView() {
  const [activeBoardId, setActiveBoardId] = useState(BOARDS[0].id);

  const board = useMemo(
    () => BOARDS.find((b) => b.id === activeBoardId) ?? BOARDS[0],
    [activeBoardId]
  );

  const { nodes, edges } = useMemo(() => {
    const raw = csrToFlowRecursive(board.csr);
    return reLayoutByDepth(raw.nodes, raw.edges);
  }, [board]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* 板卡类型选择条 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          background: 'rgba(10, 15, 28, 0.72)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: 'rgba(148, 163, 184, 0.8)',
            marginRight: 6,
            whiteSpace: 'nowrap',
          }}
        >
          板卡类型：
        </span>
        {BOARDS.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBoardId(b.id)}
            style={{
              padding: '4px 12px',
              fontSize: 12,
              borderRadius: 6,
              border: `1px solid ${activeBoardId === b.id ? 'rgba(100,180,255,0.7)' : 'rgba(255,255,255,0.12)'}`,
              background:
                activeBoardId === b.id
                  ? 'rgba(56,120,200,0.28)'
                  : 'rgba(255,255,255,0.04)',
              color:
                activeBoardId === b.id
                  ? 'rgba(200,228,255,0.95)'
                  : 'rgba(148,163,184,0.85)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                marginRight: 5,
                padding: '1px 5px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 3,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.03em',
              }}
            >
              {b.typeTag}
            </span>
            {b.label.replace(/^\S+\s/, '')}
          </button>
        ))}
      </div>

      {/* 当前板卡信息栏 */}
      <div
        style={{
          padding: '6px 14px',
          background: 'rgba(8, 12, 22, 0.55)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
          fontSize: 12,
        }}
      >
        <span style={{ color: 'rgba(100,200,255,0.9)', fontWeight: 600 }}>
          {board.label}
        </span>
        <span style={{ color: 'rgba(100,110,130,0.8)' }}>·</span>
        <span style={{ color: 'rgba(148,163,184,0.75)' }}>{board.description}</span>
        <span
          style={{
            marginLeft: 'auto',
            color: 'rgba(80,100,130,0.7)',
            fontFamily: 'monospace',
            fontSize: 11,
          }}
        >
          {board.srFile}
        </span>
      </div>

      {/* ReactFlow 画布 */}
      <div className="flow-wrap" style={{ flex: 1, minHeight: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          className="glass-flow"
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
        >
          <Background color="rgba(229, 236, 255, 0.22)" gap={20} />
          <Controls />
          <MiniMap />
          <Panel position="top-left" className="flow-hint-panel">
            CSR 代码拓扑 · {board.typeTag} · 数据来自 SR 文件 ManagementTopology
          </Panel>
          {/* 图例：虚线 = 板卡间，实线 = 板卡内 */}
          <Panel position="bottom-left">
            <div
              style={{
                background: 'rgba(8,14,28,0.75)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 11,
                color: 'rgba(148,163,184,0.85)',
                lineHeight: 1.8,
                backdropFilter: 'blur(6px)',
              }}
            >
              <div style={{ marginBottom: 4, fontWeight: 600, color: 'rgba(180,200,230,0.9)' }}>
                I2C 连线说明
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <svg width="36" height="10">
                  <line
                    x1="0" y1="5" x2="30" y2="5"
                    stroke="rgba(96,200,255,0.7)"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                  <polygon points="28,2 36,5 28,8" fill="rgba(96,200,255,0.7)" />
                </svg>
                <span>板卡间 I2C（来自主板）</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="36" height="10">
                  <line
                    x1="0" y1="5" x2="30" y2="5"
                    stroke="rgba(130,180,255,0.6)"
                    strokeWidth="1.8"
                  />
                  <polygon points="28,2 36,5 28,8" fill="rgba(130,180,255,0.6)" />
                </svg>
                <span>板卡内 I2C（内部走线）</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
