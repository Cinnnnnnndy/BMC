// ─────────────────────────────────────────────────────────────────────────────
// 昇腾超节点（Ascend SuperPoD）— 建模数据层
//
// 基线机型：Atlas 900 A3 SuperPoD（华为云称 CloudMatrix 384 / CM384）
// 数据来源（按可信度排序，建模时以官方/论文为准）：
//   [1] arXiv:2506.12708 "Serving Large Language Models on Huawei CloudMatrix384"
//       — 48 节点、每节点 8×910C + 4×鲲鹏 + 7×L1 UB 交换芯片、两层无阻塞 Clos、
//         7 个 UB 子平面、L2 每平面 16 颗芯片（48×28GB/s 端口）、
//         单 NPU UB 392 GB/s（单向）、CPU 160 GB/s、RDMA 400Gbps/NPU、VPC 擎天卡
//   [2] 华为企业业务 Atlas 900 A3 SuperPoD 产品页 / hiascend.com 集群页
//       — 16 柜 = 12 计算柜(47U) + 4 总线设备柜(47U)；机柜 2250×600×1150mm；
//         计算柜液冷 + 总线柜风冷；NPU D2D 双向 784GB/s、单跳时延 200ns；
//         FP16 307.2/288.7 PFLOPS；48TB HBM 统一编址；1536 根 DDR5
//   [3] 华为 Atlas 800T A3 产品页（同架构风冷节点形态）
//       — 每节点 8 NPU + 4 CPU、32×DDR5、8×400GE RoCE + 56×400GE UB 直出、10U
//   [4] SemiAnalysis "Huawei AI CloudMatrix 384" — 每计算柜 4 节点/32 NPU、
//       约 6912 个 LPO 光模块（估算口径，速率 400G/800G 各家说法不一）
//   [5] 华为 HC2025 / 灵衢(UnifiedBus) 2.0 发布 — Atlas 950 SuperPoD：
//       160 柜（128 计算 + 32 互联）、8192 卡、每卡 2TB/s、全光互联 16 PB/s
//   [6] 现场展出实拍（用户提供照片）— 机柜外观黑色 + 红色竖向饰条；
//       刀片自上而下：电源管理 → 资源管理刀片(UB Management Blade) →
//       CPU/NPU 计算刀片（"8P FullMesh 全电互联"）；
//       灵衢互联设备 UnifiedBus LinkDevice（液冷、128×800GE、全光互联）
//
// 几何尺寸说明：机柜外形采用官方 2250×600×1150mm；柜内刀片/芯片布局为
// 示意性抽象（官方未公开钣金图纸），不代表真实 layout。
// ─────────────────────────────────────────────────────────────────────────────

export type RackKind = 'compute' | 'switch';
export type ViewMode = 'overview' | 'rack' | 'node' | 'topology';

// ─── 全局规格（Atlas 900 A3 / CM384 基线）───────────────────────────────────
export const SUPERNODE_SPEC = {
  name: 'Atlas 900 A3 SuperPoD / CloudMatrix 384',
  totalRacks: 16,
  computeRacks: 12,
  switchRacks: 4,
  nodesPerComputeRack: 4,
  totalNodes: 48,
  npusPerNode: 8,
  cpusPerNode: 4,
  l1SwitchChipsPerNode: 7,   // 节点板载 L1 UB 交换芯片，1 芯片 = 1 子平面 [1]
  ubPlanes: 7,               // 7 个独立 UB 子平面 [1]
  l2ChipsPerPlane: 16,       // 每个子平面 16 颗 L2 UB 交换芯片（分布在 4 个总线柜）[1]
  totalNpus: 384,
  totalCpus: 192,
  // 带宽
  npuUbGBs: 392,             // 每颗 910C 单向（双 die，每 die 7×224Gbps SerDes）[1]
  npuD2dGBs: 784,            // NPU 间 D2D 双向（官方口径）[2]
  cpuUbGBs: 160,             // 每颗鲲鹏 920 单向 [1]
  npuRdmaGbps: 400,          // RDMA scale-out 平面（RoCE，每颗 910C）[1][3]
  nodeVpcGbps: 400,          // 擎天卡（Qingtian DPU）VPC 平面 [1]
  l2PortGBs: 28,             // 每颗 L2 交换芯片 48 × 28 GB/s 端口 [1]
  l2PortsPerChip: 48,
  hopLatencyNs: 200,         // 单跳通信时延（官方）[2]
  // 芯片 / 内存
  npuHbmGB: 128,             // 每颗 910C：2 die × 64 GB HBM [1]
  npuHbmTBs: 3.2,            // 每颗 910C HBM 带宽 [1][3]
  totalHbmTB: 48,            // 384 × 128 GB，统一编址 [2]
  ddr5Total: 1536,           // 系统 DDR5 根数（每节点 32）[2][3]
  fp16Pflops: 307.2,         // FP16 算力（官方两档 307.2/288.7）[2]
  cooling: '计算柜冷板液冷 · 总线设备柜风冷',  // [2]
} as const;

// ─── 机柜布局：两排 × 8 柜，总线柜居中 ──────────────────────────────────────
// 物理排布官方未公开，这里采用对称、走线最短的常见机房布局（估计值）。
export interface RackInfo {
  id: string;
  kind: RackKind;
  label: string;
  row: number;     // 0 = 前排, 1 = 后排
  col: number;     // 0..7
  /** 计算柜内节点编号（全局 0..47），交换柜为空 */
  nodeIds: number[];
}

export const RACKS: RackInfo[] = (() => {
  const racks: RackInfo[] = [];
  // 每排 8 柜：6 计算 + 2 总线（第 3、4 列），两排共 12 计算 + 4 总线
  let nodeCounter = 0;
  let computeIdx = 0;
  let switchIdx = 0;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 8; col++) {
      const isSwitch = col === 3 || col === 4;
      if (isSwitch) {
        racks.push({
          id: `switch-rack-${switchIdx}`,
          kind: 'switch',
          label: `灵衢总线柜 S${switchIdx + 1}`,
          row, col, nodeIds: [],
        });
        switchIdx++;
      } else {
        const ids = Array.from({ length: 4 }, () => nodeCounter++);
        racks.push({
          id: `compute-rack-${computeIdx}`,
          kind: 'compute',
          label: `计算柜 C${computeIdx + 1}`,
          row, col, nodeIds: ids,
        });
        computeIdx++;
      }
    }
  }
  return racks;
})();

// ─── 机柜几何（场景单位 = 米；官方 2250×600×1150mm [2]）─────────────────────
export const RACK_DIM = { w: 0.6, h: 2.25, d: 1.15 };
export const RACK_GAP_X = 0.32;                            // 柜间距（估计）
export const ROW_GAP_Z = 2.6;                              // 排间冷通道（估计）

export function rackWorldPos(rack: RackInfo): [number, number, number] {
  const totalW = 8 * RACK_DIM.w + 7 * RACK_GAP_X;
  const x = rack.col * (RACK_DIM.w + RACK_GAP_X) - totalW / 2 + RACK_DIM.w / 2;
  const z = rack.row === 0 ? ROW_GAP_Z / 2 : -ROW_GAP_Z / 2;
  return [x, 0, z];
}

// ─── 计算柜内部布局（自上而下，参考展出实拍 [6]；具体槽位为示意）─────────────
export interface RackUnit {
  id: string;
  type: 'node' | 'switch-unit' | 'power' | 'mgmt' | 'cdu';
  label: string;
  labelEn: string;
  /** 单元底部相对柜内高度（0..1）与单元高度占比（0..1） */
  y0: number;
  hFrac: number;
  /** type === 'node' 时为柜内节点序号 0..3 */
  nodeSlot?: number;
}

// 官方计算柜 3D 展示页部件清单：机框 / Manifold（液冷分集水器）/ Busbar 供电母排 /
// 电源框 / 柜管模块 / 电源转换板 / 计算节点 / GE 交换机（管理网）。
// 每节点 ≈10U（4×10U + 配套 ≈ 47U，自洽推算）。
export const COMPUTE_RACK_UNITS: RackUnit[] = [
  { id: 'power',  type: 'power', label: '电源框 + 电源转换板（集中供电 Busbar）', labelEn: 'Power Shelf',         y0: 0.905, hFrac: 0.07 },
  { id: 'mgmt',   type: 'mgmt',  label: '柜管模块 + GE 管理交换机',               labelEn: 'Mgmt + GE Switch',    y0: 0.85, hFrac: 0.048 },
  { id: 'node-0', type: 'node',  label: '计算节点 1（液冷 ≈10U / 16.2kW max）',   labelEn: 'Compute Node 1',      y0: 0.655, hFrac: 0.18, nodeSlot: 0 },
  { id: 'node-1', type: 'node',  label: '计算节点 2（液冷 ≈10U / 16.2kW max）',   labelEn: 'Compute Node 2',      y0: 0.465, hFrac: 0.18, nodeSlot: 1 },
  { id: 'node-2', type: 'node',  label: '计算节点 3（液冷 ≈10U / 16.2kW max）',   labelEn: 'Compute Node 3',      y0: 0.275, hFrac: 0.18, nodeSlot: 2 },
  { id: 'node-3', type: 'node',  label: '计算节点 4（液冷 ≈10U / 16.2kW max）',   labelEn: 'Compute Node 4',      y0: 0.085, hFrac: 0.18, nodeSlot: 3 },
  { id: 'cdu',    type: 'cdu',   label: 'Manifold 液冷分集水器 / 快接头区',       labelEn: 'Liquid Manifold',     y0: 0.012, hFrac: 0.058 },
];

// 总线柜：L2 灵衢总线设备（系统共 7 平面 × 16 颗 L2 芯片分布于 4 柜 [1]；
// 此处每柜画 7 个交换单元、按平面着色，属可视化示意而非真实设备数）
export const SWITCH_RACK_UNITS: RackUnit[] = [
  { id: 'power', type: 'power', label: '电源管理 · 集中供电', labelEn: 'Power Shelf', y0: 0.90, hFrac: 0.075 },
  ...Array.from({ length: 7 }, (_, i): RackUnit => ({
    id: `l2-${i}`,
    type: 'switch-unit',
    label: `灵衢互联设备 · UB 平面 ${i + 1}`,
    labelEn: `UB LinkDevice P${i + 1}`,
    y0: 0.115 + (6 - i) * 0.112,
    hFrac: 0.095,
  })),
  { id: 'mgmt', type: 'mgmt', label: '管理 / 配线区', labelEn: 'Mgmt', y0: 0.015, hFrac: 0.09 },
];

// ─── 计算节点内部（抽象刀片布局，单位：米）──────────────────────────────────
// 形态参考 Atlas 800T A3（8 NPU + 4 CPU + 32 DIMM + 7 L1 交换芯片）[1][3]；
// 板内排布为抽象示意，非真实 layout。
export const NODE_DIM = { w: 0.8, h: 0.12, d: 0.7 };

export interface NodePart {
  id: string;
  type: 'npu' | 'cpu' | 'ub-switch' | 'dpu' | 'optical' | 'dimm';
  label: string;
  pos: [number, number, number];   // 相对节点中心
  size: [number, number, number];
}

export const NODE_PARTS: NodePart[] = (() => {
  const parts: NodePart[] = [];
  // 8× 昇腾 910C（双 die 封装 + 冷板）：2 行 × 4 列，居中偏后
  for (let i = 0; i < 8; i++) {
    const cx = (i % 4) * 0.155 - 0.2325;
    const cz = i < 4 ? -0.155 : 0.01;
    parts.push({
      id: `npu-${i}`, type: 'npu', label: `昇腾 910C #${i + 1} · 128GB HBM · UB 392GB/s`,
      pos: [cx, 0.022, cz], size: [0.105, 0.022, 0.105],
    });
  }
  // 4× 鲲鹏 920：前部一行
  for (let i = 0; i < 4; i++) {
    parts.push({
      id: `cpu-${i}`, type: 'cpu', label: `鲲鹏 920 #${i + 1} · UB 160GB/s`,
      pos: [i * 0.155 - 0.2325, 0.018, 0.155], size: [0.07, 0.014, 0.07],
    });
  }
  // 2 排 DIMM 区（每节点 32 根 DDR5 [3]，此处以条状区示意）
  for (let i = 0; i < 2; i++) {
    parts.push({
      id: `dimm-${i}`, type: 'dimm', label: 'DDR5 内存区（每节点 32 根）',
      pos: [0, 0.014, 0.245 + i * 0.045], size: [0.66, 0.018, 0.03],
    });
  }
  // 7× L1 UB 交换芯片：后沿一排（每颗对应一个 UB 子平面）
  for (let i = 0; i < 7; i++) {
    parts.push({
      id: `ub-${i}`, type: 'ub-switch', label: `灵衢 L1 交换芯片 · UB 平面 ${i + 1}`,
      pos: [i * 0.095 - 0.285, 0.016, -0.295], size: [0.055, 0.012, 0.055],
    });
  }
  // 擎天 DPU 卡（VPC 平面出口）
  parts.push({
    id: 'dpu', type: 'dpu', label: '擎天卡 Qingtian DPU · VPC 400Gbps',
    pos: [0.34, 0.02, 0.2], size: [0.08, 0.02, 0.16],
  });
  // 后面板光口区（56×400GE UB 直出 + 8×400GE RoCE [3]）
  parts.push({
    id: 'optical', type: 'optical', label: '光口区 · 56×400GE UB + 8×400GE RoCE',
    pos: [-0.04, 0.02, -0.337], size: [0.62, 0.026, 0.018],
  });
  return parts;
})();

// ─── UB 平面配色（7 平面 + RDMA + VPC）──────────────────────────────────────
export const UB_PLANE_COLORS = [
  '#2dd4bf', '#38bdf8', '#a78bfa', '#f472b6', '#fb923c', '#facc15', '#4ade80',
];
export const RDMA_COLOR = '#f43f5e';
export const VPC_COLOR = '#94a3b8';

// 机柜外观（参考展出实拍 [6]：黑色钣金 + 红色竖向饰条）
export const RACK_COLORS = {
  body: '#16181d',
  door: '#0d0f13',
  accent: '#e0252f',           // 红色饰条
  computeGlow: '#2dd4bf',
  switchGlow: '#fbbf24',
} as const;

// ─── 信息卡片文案 ────────────────────────────────────────────────────────────
export const INFO: Record<string, { title: string; lines: string[] }> = {
  overview: {
    title: '超节点全景 · Atlas 900 A3 SuperPoD (CloudMatrix 384)',
    lines: [
      '16 机柜 = 12 计算柜 + 4 灵衢总线柜，47U / 2250×600×1150mm [2]',
      '384× 昇腾 910C NPU + 192× 鲲鹏 920 CPU，48 个计算节点 [1][2]',
      'FP16 算力 307.2 PFLOPS；48TB HBM 统一编址 [2]',
      '计算柜冷板液冷，总线设备柜风冷 [2]',
      '柜间全光互联：约 6912 个 LPO 光模块（估算口径）[4]',
      '点击机柜可下钻查看内部结构',
    ],
  },
  computeRack: {
    title: '计算柜（冷板液冷 47U）',
    lines: [
      '每柜 4 个计算节点 = 32× NPU + 16× CPU [1][4]',
      '部件：电源框/Busbar → 柜管+GE交换机 → 节点×4 → Manifold [2][6]',
      '单节点最大功耗 16.2kW；系统总功耗约 559kW [3][4]',
      'NPU 间 D2D 双向带宽 784 GB/s，单跳时延 200ns [2]',
      '点击计算节点可下钻查看刀片内部',
    ],
  },
  switchRack: {
    title: '灵衢总线柜（L2 交换 · 风冷）',
    lines: [
      '4 柜共承载 L2 UB 交换：7 平面 × 16 颗 = 112 颗芯片 [1]',
      '约 56 台灵衢总线设备（每柜 ~14 台，转载口径）[4]',
      '每颗 L2 芯片 48 × 28 GB/s 端口，1:1 无收敛非阻塞 [1][2]',
      '跨节点带宽衰减 < 3%，时延增加 < 1 μs [1]',
      '展出新一代形态：UnifiedBus LinkDevice · 128×800GE 全光 [6]',
    ],
  },
  node: {
    title: '计算节点（刀片抽象视图）',
    lines: [
      '8× 昇腾 910C：双 die SIO 互联成 HiAM 模组，128GB HBM / 3.2TB/s [1][2]',
      '4× 鲲鹏 920 CPU 全网状 NUMA + 32× DDR5 [1][3]',
      '7× 灵衢 L1 交换芯片 = 7 个 UB 子平面，每颗上行 448 GB/s [1]',
      '单 NPU UB 392 GB/s、CPU 160 GB/s（单向）[1]',
      '光口 56×400G OSFP UB + 8×400G QSFP-DD RoCE；擎天 DPU 接 VPC [1][3][4]',
      '注：板内排布为抽象示意，非真实 layout',
    ],
  },
  topology: {
    title: '灵衢互联拓扑（两层无阻塞 Clos）',
    lines: [
      '每节点 7 颗 L1 芯片各属一个子平面，上行至同平面 L2 [1]',
      'L2 层：7 平面 × 16 芯片，L1↔L2 一一映射保持非阻塞 [1]',
      'NPU↔NPU 实测：节点内 167 GB/s / 跨节点 164 GB/s [1]',
      'RDMA 平面（红虚线）：400 Gbps/NPU，跨超节点 scale-out [1]',
      'VPC 平面（灰）：擎天卡 400 Gbps，接数据中心网络 [1]',
      '悬停节点可高亮其 7 条上行链路',
    ],
  },
};

// 数据来源索引（信息面板底部展示）
export const SOURCES = [
  '[1] arXiv:2506.12708 · Serving LLMs on Huawei CloudMatrix384',
  '[2] 华为 Atlas 900 A3 SuperPoD 产品页 / hiascend.com 集群页',
  '[3] 华为 Atlas 800T A3 产品页（同架构节点形态）',
  '[4] SemiAnalysis · Huawei AI CloudMatrix 384（估算口径）',
  '[5] 华为 HC2025 灵衢 2.0 发布（Atlas 950/960 路线）',
  '[6] 超节点展出实拍照片（用户提供）',
];
