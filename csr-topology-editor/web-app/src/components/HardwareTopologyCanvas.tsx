import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { HW_BOARDS, HwBoard, TopoNode } from '../data/hardwareTopologyData';

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const TYPE_COLOR: Record<string, string> = {
  PSR: '#7c3aed', BCU: '#0891b2', CLU: '#059669', EXU: '#d97706',
  IEU: '#2563eb', SEU: '#dc2626', NICCard: '#db2777', BMC: '#4b5563',
};
const NODE_COLOR: Record<string, string> = {
  anchor: '#6b7280', hisport: '#0891b2', i2c_bus: '#0284c7', i2c_mux: '#7c3aed',
  eeprom: '#d97706', connector: '#16a34a', smc: '#ec4899', cpld: '#f59e0b',
  chip: '#64748b', jtag: '#94a3b8',
};
const GROUP_W = 250;
const GROUP_H = 240;
const GROUP_POSITIONS: Record<string, { x: number; y: number }> = {
  PSR:     { x: 30,   y: 260 },
  BCU:     { x: 350,  y: 100 },
  CLU:     { x: 350,  y: 400 },
  EXU:     { x: 680,  y: 280 },
  IEU:     { x: 680,  y: 60  },
  SEU:     { x: 1010, y: 140 },
  NICCard: { x: 1010, y: 360 },
  BMC:     { x: 30,   y: 540 },
};

/* ─────────────────────────────────────────────
   Canvas view state (centralised)
───────────────────────────────────────────── */
interface CVS {
  offset: { x: number; y: number };
  scale: number;
  filterType: string | null;
  showSoft: boolean;
  showI2C: boolean;
  showPCIe: boolean;
  highlightUids: string[];   // empty = all visible
  selectedBoardUid: string | null;
}
const DEFAULT_CVS: CVS = {
  offset: { x: 20, y: 40 }, scale: 0.5,
  filterType: null, showSoft: false, showI2C: false, showPCIe: true,
  highlightUids: [], selectedBoardUid: null,
};

/* ─────────────────────────────────────────────
   Chat message
───────────────────────────────────────────── */
interface ChatMsg {
  id: string;
  role: 'user' | 'agent';
  text: string;
  ts: number;
  snapshot?: CVS;   // canvas state BEFORE this user message
}

/* ─────────────────────────────────────────────
   Timeline history entry
───────────────────────────────────────────── */
interface HistoryEntry {
  id: string;
  userQuery: string;
  agentReply: string;
  ts: number;
  before: CVS;
  after: CVS;
}

function computeDiff(before: CVS, after: CVS): Array<{ label: string; color: string }> {
  const tags: Array<{ label: string; color: string }> = [];

  // Scale / viewport change
  if (Math.abs(before.scale - after.scale) > 0.08) {
    tags.push({ label: `${Math.round(before.scale * 100)}%→${Math.round(after.scale * 100)}%`, color: '#3b82f6' });
  }

  // Highlight change
  const bh = before.highlightUids.length, ah = after.highlightUids.length;
  if (ah !== bh) {
    if (ah === 0) {
      tags.push({ label: '清除高亮', color: '#475569' });
    } else {
      const types = [...new Set(HW_BOARDS.filter(b => after.highlightUids.includes(b.uid)).map(b => b.type))];
      tags.push({ label: `高亮 ${ah}×${types.slice(0, 2).join('/')}`, color: '#f97316' });
    }
  }

  // Board selection / focus
  if (before.selectedBoardUid !== after.selectedBoardUid && after.selectedBoardUid) {
    const b = HW_BOARDS.find(b => b.uid === after.selectedBoardUid);
    tags.push({ label: `定位 ${b?.name.replace('BC83', '') || ''}`, color: '#a78bfa' });
  }

  // Toggles
  if (before.showSoft !== after.showSoft)  tags.push({ label: after.showSoft  ? '软件叠加 ●' : '软件叠加 ○', color: '#fbbf24' });
  if (before.showI2C !== after.showI2C)    tags.push({ label: after.showI2C   ? 'I²C ●' : 'I²C ○',            color: '#64748b' });
  if (before.showPCIe !== after.showPCIe)  tags.push({ label: after.showPCIe  ? 'PCIe ●' : 'PCIe ○',          color: '#60a5fa' });
  if (before.filterType !== after.filterType) {
    tags.push({ label: after.filterType ? `筛选 ${after.filterType}` : '清除筛选', color: '#4ade80' });
  }

  if (tags.length === 0) tags.push({ label: '查询信息', color: '#475569' });
  return tags;
}

/* ─────────────────────────────────────────────
   Group layout
───────────────────────────────────────────── */
function computeGroupLayout(): Map<string, { x: number; y: number }> {
  const pos = new Map<string, { x: number; y: number }>();
  for (const [type, p] of Object.entries(GROUP_POSITIONS)) pos.set(type, p);
  return pos;
}

/* ─────────────────────────────────────────────
   Inter-board connections
───────────────────────────────────────────── */
const BOARD_CONNECTIONS = [
  // I²C 管理总线：PSR(BMC主控) → 各板卡（直连），左=input(PSR)，右=output(板卡)
  { fromType: 'PSR', toType: 'BCU',     label: 'I²C 管理总线',               color: '#0ea5e9', style: 'dashed' as const, sharedI2C: false as const },
  { fromType: 'PSR', toType: 'CLU',     label: 'I²C 管理总线',               color: '#0ea5e9', style: 'dashed' as const, sharedI2C: false as const },
  { fromType: 'PSR', toType: 'EXU',     label: 'I²C 管理总线',               color: '#0ea5e9', style: 'dashed' as const, sharedI2C: false as const },
  { fromType: 'PSR', toType: 'SEU',     label: 'I²C 管理总线',               color: '#0ea5e9', style: 'dashed' as const, sharedI2C: false as const },
  // PSR→IEU 已移除：IEU 的 I²C 不是直连，而是经由 BCU Hisport 侧带信道转发
  // Hisport：同一物理线缆承载 PCIe 数据面 + I²C 管理侧带（sharedI2C=true 触发双轨渲染）
  { fromType: 'BCU', toType: 'IEU',     label: 'Hisport (PCIe + I²C侧带)',   color: '#3b82f6', style: 'solid' as const, sharedI2C: true  as const },
  { fromType: 'BCU', toType: 'EXU',     label: 'PCIe Hisport↔OCP',           color: '#60a5fa', style: 'solid' as const, sharedI2C: false as const },
  { fromType: 'IEU', toType: 'SEU',     label: 'PCIe CEM↔UBC',               color: '#f97316', style: 'solid' as const, sharedI2C: false as const },
  { fromType: 'IEU', toType: 'NICCard', label: 'PCIe CEM',                   color: '#ec4899', style: 'solid' as const, sharedI2C: false as const },
  { fromType: 'EXU', toType: 'NICCard', label: 'OCP↔PCIe',                  color: '#a78bfa', style: 'solid' as const, sharedI2C: false as const },
  { fromType: 'EXU', toType: 'SEU',     label: 'PCIe CEM↔UBC',               color: '#f97316', style: 'solid' as const, sharedI2C: false as const },
];

/* ─────────────────────────────────────────────
   AI Agent: natural language processor
───────────────────────────────────────────── */
function generateBoardInfo(b: HwBoard): string {
  const ups = b.businessConnectors.filter(c => c.direction === 'Upstream');
  const downs = b.businessConnectors.filter(c => c.direction === 'Downstream');
  const chips = b.topoNodes.filter(n => ['smc', 'eeprom', 'chip', 'cpld'].includes(n.type));
  const connTypes = [...new Set(downs.map(d => d.connType))].join('/');
  let s = `**${b.name}** (${b.type}${b.desc ? '·' + b.desc : ''})\n`;
  s += `• I²C节点 ${b.topoNodes.length} 个，芯片 ${chips.length} 个\n`;
  if (ups.length) s += `• 上行接口: ${ups.map(u => `${u.linkWidth} ${u.connType}`).join('、')}\n`;
  if (downs.length) s += `• 下行插槽: ${downs.length} 个 ${connTypes}\n`;
  if (b.soft.eventCount) s += `• 软件事件定义: ${b.soft.eventCount} 个\n`;
  return s;
}

function findBoardsByQuery(q: string): HwBoard[] {
  const ql = q.toLowerCase();
  return HW_BOARDS.filter(b =>
    b.name.toLowerCase().includes(ql) ||
    b.type.toLowerCase() === ql ||
    b.desc.toLowerCase().includes(ql)
  );
}

interface AgentResult { text: string; updates: Partial<CVS> }

function runAgent(text: string, cur: CVS, positions: Map<string, { x: number; y: number }>, viewW: number, viewH: number): AgentResult {
  const t = text.trim();
  const tl = t.toLowerCase();

  // ── zoom to board ──
  const zoomMatch = t.match(/(?:放大|聚焦|查看|定位|找到|focus|zoom).{0,6}(BC83\w+)/i)
    || t.match(/(BC83\w+)/i);
  if (zoomMatch) {
    const name = zoomMatch[1].toUpperCase();
    const board = HW_BOARDS.find(b => b.name.toUpperCase() === name);
    if (board && positions.get(board.type)) {
      const { x, y } = positions.get(board.type)!;
      const targetScale = 1.1;
      const cx = viewW / 2, cy = viewH / 2;
      const bCx = x + GROUP_W / 2, bCy = y + GROUP_H / 2;
      return {
        text: generateBoardInfo(board),
        updates: {
          scale: targetScale,
          offset: { x: cx - bCx * targetScale, y: cy - bCy * targetScale },
          highlightUids: [board.uid],
          selectedBoardUid: board.uid,
        },
      };
    }
  }

  // ── board type filter / highlight ──
  for (const [type, keywords] of Object.entries({
    IEU: ['ieu', '扩展卡', 'riser', '上升卡', 'pcie扩展'],
    SEU: ['seu', '存储背板', '背板', 'nvme', 'sas', 'sata', 'hdd', '硬盘'],
    BCU: ['bcu', 'cpu板', '主板', 'cpu', '处理器板'],
    CLU: ['clu', '风扇', '散热', '风扇板'],
    EXU: ['exu', '扩展单元', 'expander', 'ocp'],
    PSR: ['psr', 'bmc', '管理控制', '主控'],
    NICCard: ['nic', '网卡', '以太网', 'ethernet', 'niccard'],
  })) {
    if (keywords.some(k => tl.includes(k)) || tl.includes(type.toLowerCase())) {
      const boards = HW_BOARDS.filter(b => b.type === type);
      const names = boards.map(b => b.name).join('、');
      const descs = [...new Set(boards.map(b => b.desc).filter(Boolean))].join('；');
      let resp = `找到 **${boards.length}** 块 **${type}** 板卡\n`;
      if (descs) resp += `类型：${descs}\n`;
      resp += `板卡：${names}`;
      return {
        text: resp,
        updates: { filterType: null, highlightUids: boards.map(b => b.uid) },
      };
    }
  }

  // ── connection query ──
  const connMatch = tl.match(/(bc83\w+).{0,10}(?:连接|接什么|上游|下游|插在|去哪)/);
  if (connMatch) {
    const name = connMatch[1].toUpperCase();
    const board = HW_BOARDS.find(b => b.name.toUpperCase() === name);
    if (board) {
      const ups = board.businessConnectors.filter(c => c.direction === 'Upstream');
      const downs = board.businessConnectors.filter(c => c.direction === 'Downstream');
      let resp = `**${board.name}** 的连接关系：\n`;
      if (ups.length) resp += `• 上游接口 ${ups.length} 个 → 插入**${upstreamTarget(board.type)}**\n`;
      if (downs.length) resp += `• 下游插槽 ${downs.length} 个 ${[...new Set(downs.map(d => d.connType))].join('/')} → 接**${downstreamTarget(board.type)}**\n`;
      if (!ups.length && !downs.length) resp += `• 该板卡通过 I²C 管理总线连接到 PSR/BMC`;
      return { text: resp, updates: { highlightUids: [board.uid] } };
    }
  }

  // ── overview / architecture ──
  if (/全览|总览|架构|overview|topology|full|全部板卡/.test(tl)) {
    const byType = new Map<string, number>();
    HW_BOARDS.forEach(b => byType.set(b.type, (byType.get(b.type) ?? 0) + 1));
    let resp = `**整体硬件架构**（共 ${HW_BOARDS.length} 块板卡）：\n`;
    resp += `• PSR/BMC：管理控制器，通过 I²C 管理总线连接全部板卡\n`;
    resp += `• BCU：${byType.get('BCU') ?? 0} 块 CPU 计算板，通过 Hisport 连接 IEU/EXU\n`;
    resp += `• CLU：${byType.get('CLU') ?? 0} 块风扇控制板\n`;
    resp += `• EXU：${byType.get('EXU') ?? 0} 块扩展板，提供 PCIe/OCP 插槽\n`;
    resp += `• IEU：${byType.get('IEU') ?? 0} 种 PCIe Riser 扩展卡（插入 BCU Hisport）\n`;
    resp += `• SEU：${byType.get('SEU') ?? 0} 种存储背板（NVMe/SAS/SATA，插入 IEU 下行 CEM 槽）\n`;
    resp += `• NICCard：${byType.get('NICCard') ?? 0} 种网卡（插入 IEU/EXU PCIe 槽）`;
    return { text: resp, updates: { filterType: null, highlightUids: [], scale: 0.5, offset: { x: 20, y: 40 } } };
  }

  // ── PCIe connections ──
  if (/pcie|连线|连接线/.test(tl)) {
    return {
      text: `**PCIe 连接关系**：\n• 🔵 BCU Hisport → IEU UBCDD（主 PCIe 上行）\n• 🟠 IEU PCIe CEM → SEU UBC（存储扩展）\n• 🩷 IEU/EXU PCIe CEM → NICCard\n• ⚫ I²C 管理总线连接所有板卡到 PSR\n\n已开启 PCIe 连线显示`,
      updates: { showPCIe: true },
    };
  }

  // ── I²C bus ──
  if (/i2c|i²c|管理总线/.test(tl)) {
    return {
      text: `**I²C 管理总线**：每块板卡都有 **Smc_ExpBoardSMC**（地址 0x60），通过 I²C 连接到 PSR 主控，用于固件更新、健康监控和传感器采集。\n\n已显示 I²C 连线`,
      updates: { showI2C: true },
    };
  }

  // ── software overlay ──
  if (/软件|software|overlay|叠加/.test(tl)) {
    const next = !cur.showSoft;
    return {
      text: next
        ? `已开启软件叠加。\n芯片节点上会显示：\n• 🟢 **Scanner** 引用（读取该芯片的扫描器数量）\n• 🟡 **FRU** 绑定（EEPROM 与 FRU 设备关联）`
        : `已关闭软件叠加`,
      updates: { showSoft: next },
    };
  }

  // ── storage / NVMe comparison ──
  if (/存储|nvme.*sas|对比.*seu|seu.*对比/.test(tl)) {
    const nvme = HW_BOARDS.filter(b => b.type === 'SEU' && b.desc.includes('NVMe'));
    const sas = HW_BOARDS.filter(b => b.type === 'SEU' && (b.desc.includes('SAS') || b.desc.includes('SATA')) && !b.desc.includes('NVMe'));
    return {
      text: `**SEU 存储背板对比**：\n• NVMe 背板 ${nvme.length} 种：${nvme.map(b => b.name).join('、')}\n• SAS/SATA 背板 ${sas.length} 种：${sas.map(b => b.name).join('、')}\n\n所有 SEU 通过 UBC 上行接口连接到 IEU 下行 PCIe CEM 槽`,
      updates: { highlightUids: HW_BOARDS.filter(b => b.type === 'SEU').map(b => b.uid) },
    };
  }

  // ── reset / clear ──
  if (/重置|清除|全部|全显|显示所有|clear|reset|all/.test(tl)) {
    return {
      text: `已重置画布，显示全部 ${HW_BOARDS.length} 块板卡，清除所有高亮`,
      updates: { filterType: null, highlightUids: [], selectedBoardUid: null, scale: 0.5, offset: { x: 20, y: 40 } },
    };
  }

  // ── search board name ──
  const nameSearch = t.match(/(?:找|查找|搜索|find|search)\s+(\w+)/i);
  if (nameSearch) {
    const results = findBoardsByQuery(nameSearch[1]);
    if (results.length) {
      return {
        text: `找到 **${results.length}** 个匹配结果：\n${results.map(b => `• ${b.name} (${b.type}) ${b.desc}`).join('\n')}`,
        updates: { highlightUids: results.map(b => b.uid) },
      };
    }
  }

  // ── help ──
  if (/帮助|help|能做什么|功能|指令/.test(tl)) {
    return {
      text: `**我能做的事情**：\n• 📌 **聚焦板卡**：输入型号如 "查看 BC83PRUOA"\n• 🔍 **筛选类型**：如 "显示 IEU 板卡"\n• 🔗 **查询连接**：如 "BC83PRUOA 连接到哪"\n• 📊 **总览架构**：输入 "全览架构"\n• 🔀 **开关图层**：如 "开启软件叠加" / "显示PCIe"\n• 🔄 **重置画布**：输入 "重置" 或 "显示全部"\n• 💾 **回退状态**：点击历史消息旁的 ↩ 按钮`,
      updates: {},
    };
  }

  // ── default ──
  const suggestions = ['查看 BC83PRUOA', '显示 IEU 板卡', '全览架构', 'BC83PRUOA 连接到哪', '开启软件叠加'];
  return {
    text: `暂未识别该指令。\n\n试试：\n${suggestions.map(s => `• "${s}"`).join('\n')}`,
    updates: {},
  };
}

function upstreamTarget(type: string) {
  const map: Record<string, string> = { IEU: 'BCU Hisport', SEU: 'IEU PCIe CEM 槽', NICCard: 'IEU/EXU PCIe 槽', EXU: 'BCU Hisport' };
  return map[type] ?? '上游主板';
}
function downstreamTarget(type: string) {
  const map: Record<string, string> = { IEU: 'SEU 背板 / NIC 网卡', EXU: 'NIC 网卡 / SEU 背板', BCU: 'IEU 扩展卡 / EXU 扩展板', SEU: 'NVMe/SAS/SATA 硬盘' };
  return map[type] ?? '下游设备';
}

/* ─────────────────────────────────────────────
   Agent Panel — Stitch-style bottom command bar
───────────────────────────────────────────── */
interface LatestResponse { msg: ChatMsg; userSnapshot: CVS }

function AgentPanel({
  cvs, setCvs, positions, viewW, viewH, onAddHistory,
}: {
  cvs: CVS; setCvs: (c: CVS) => void;
  positions: Map<string, { x: number; y: number }>;
  viewW: number; viewH: number;
  onAddHistory?: (entry: HistoryEntry) => void;
}) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { id: 'init', role: 'agent', ts: Date.now(), text: '' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [latestResponse, setLatestResponse] = useState<LatestResponse | null>(null);
  const [responseVisible, setResponseVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const barW = Math.min(580, viewW - 80);
  const barLeft = (viewW - barW) / 2;
  const userMsgs = msgs.filter(m => m.role === 'user');

  const scrollHistory = () =>
    setTimeout(() => historyRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 60);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const snapshot = { ...cvs };
    const userMsg: ChatMsg = { id: Math.random().toString(36).slice(2), role: 'user', text, ts: Date.now(), snapshot };
    setMsgs(m => [...m, userMsg]);
    setTyping(true);
    setResponseVisible(false);
    scrollHistory();
    setTimeout(() => {
      const { text: resp, updates } = runAgent(text, snapshot, positions, viewW, viewH);
      const resultCvs = { ...snapshot, ...updates };
      setCvs(resultCvs);
      const agentMsg: ChatMsg = { id: Math.random().toString(36).slice(2), role: 'agent', text: resp, ts: Date.now() };
      setMsgs(m => [...m, agentMsg]);
      setLatestResponse({ msg: agentMsg, userSnapshot: snapshot });
      setResponseVisible(true);
      setTyping(false);
      scrollHistory();
      // Notify timeline
      onAddHistory?.({
        id: agentMsg.id,
        userQuery: text,
        agentReply: resp,
        ts: agentMsg.ts,
        before: snapshot,
        after: resultCvs,
      });
    }, 380);
  }, [input, cvs, positions, viewW, viewH, setCvs]);

  const revert = useCallback((snapshot: CVS) => {
    setCvs(snapshot);
    setResponseVisible(false);
    const msg: ChatMsg = { id: Math.random().toString(36).slice(2), role: 'agent', text: '✓ 已恢复至此对话时的画布状态', ts: Date.now() };
    setMsgs(m => [...m, msg]);
    scrollHistory();
  }, [setCvs]);

  // Auto-dismiss response card after 30 s
  useEffect(() => {
    if (!responseVisible) return;
    const t = setTimeout(() => setResponseVisible(false), 30000);
    return () => clearTimeout(t);
  }, [responseVisible, latestResponse]);

  const formatText = (t: string) =>
    t.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.+?)\*\*/g).map((seg, j) =>
          j % 2 === 1 ? <strong key={j} style={{ color: '#e2e8f0' }}>{seg}</strong> : seg
        )}
        <br />
      </span>
    ));

  const CHIPS = ['全览架构', '显示IEU', '显示SEU', 'PCIe连接', '软件叠加', '重置'];

  return (
    <div style={{
      position: 'absolute',
      bottom: 28,
      left: barLeft,
      width: barW,
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>

      {/* ── Response card ── */}
      {responseVisible && latestResponse && (
        <div style={{
          pointerEvents: 'all',
          background: 'rgba(9,14,24,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '14px 16px 18px',
          backdropFilter: 'blur(28px)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(59,130,246,0.1)',
          animation: 'ai-slide-up 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#fff',
            }}>✦</div>
            <span style={{ fontSize: 10.5, color: '#60a5fa', fontWeight: 600, flex: 1, letterSpacing: '0.03em' }}>AI 助手</span>
            <button
              onClick={() => setResponseVisible(false)}
              style={{ background: 'none', border: 'none', color: '#2d3f52', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: '2px 4px', borderRadius: 4, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
              onMouseLeave={e => (e.currentTarget.style.color = '#2d3f52')}
            >✕</button>
          </div>

          {/* Content */}
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.68 }}>
            {formatText(latestResponse.msg.text)}
          </div>

          {/* Revert action */}
          <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
            <button
              onClick={() => revert(latestResponse.userSnapshot)}
              style={{
                fontSize: 10, padding: '5px 13px', borderRadius: 8,
                background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.22)',
                color: '#60a5fa', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; }}
            >↩ 撤销此操作</button>
            {showHistory ? null : (
              <button
                onClick={() => setShowHistory(true)}
                style={{
                  fontSize: 10, padding: '5px 13px', borderRadius: 8,
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
                  color: '#334155', cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#64748b'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#334155'; }}
              >查看历史</button>
            )}
          </div>

          {/* Auto-dismiss progress bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(59,130,246,0.07)' }}>
            <div style={{ height: '100%', background: 'rgba(59,130,246,0.35)', borderRadius: '0 0 16px 16px', animation: 'ai-shrink 30s linear forwards' }} />
          </div>
        </div>
      )}

      {/* ── History drawer ── */}
      {showHistory && (
        <div style={{
          pointerEvents: 'all',
          background: 'rgba(9,14,24,0.96)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          maxHeight: 300,
          display: 'flex', flexDirection: 'column',
          backdropFilter: 'blur(28px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          animation: 'ai-slide-up 0.22s ease',
          overflow: 'hidden',
        }}>
          {/* Sticky header */}
          <div style={{
            padding: '9px 14px 8px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center',
            background: 'rgba(9,14,24,0.98)',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 9, color: '#2d3f52', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', flex: 1 }}>对话历史</span>
            {userMsgs.length > 0 && (
              <span style={{ fontSize: 9, color: '#1e293b', marginRight: 10 }}>{userMsgs.length} 条指令</span>
            )}
            <button
              onClick={() => setShowHistory(false)}
              style={{ background: 'none', border: 'none', color: '#2d3f52', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: '1px 4px', borderRadius: 3, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
              onMouseLeave={e => (e.currentTarget.style.color = '#2d3f52')}
            >✕</button>
          </div>

          {/* Message list */}
          <div ref={historyRef} style={{ overflowY: 'auto', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
            {userMsgs.length === 0 ? (
              <div style={{ fontSize: 11, color: '#1e293b', textAlign: 'center', padding: '16px 0' }}>暂无对话记录</div>
            ) : msgs.filter(m => m.id !== 'init').map((msg) => (
              <div key={msg.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 6,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  flex: 1, fontSize: 10.5, lineHeight: 1.55, padding: '5px 10px',
                  borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '2px 10px 10px 10px',
                  background: msg.role === 'user' ? 'rgba(37,99,235,0.12)' : 'transparent',
                  border: msg.role === 'user' ? '1px solid rgba(37,99,235,0.2)' : 'none',
                  borderLeft: msg.role === 'agent' ? '2px solid rgba(255,255,255,0.06)' : undefined,
                  color: msg.role === 'user' ? '#93c5fd' : '#3d5068',
                }}>
                  {msg.role === 'agent'
                    ? msg.text.replace(/\*\*/g, '').split('\n')[0].slice(0, 72) + (msg.text.length > 72 ? '…' : '')
                    : msg.text
                  }
                </div>
                {msg.role === 'user' && msg.snapshot && (
                  <button
                    onClick={() => { revert(msg.snapshot!); setShowHistory(false); }}
                    title="恢复到此操作前的画布状态"
                    style={{
                      fontSize: 10, padding: '3px 7px', borderRadius: 6, flexShrink: 0, marginTop: 3,
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
                      color: '#2d3f52', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; e.currentTarget.style.color = '#60a5fa'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#2d3f52'; }}
                  >↩</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Suggestion chips ── */}
      {(focused || (!input && !responseVisible && !showHistory)) && (
        <div style={{
          pointerEvents: 'all',
          display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center',
          animation: 'ai-fade-in 0.2s ease',
        }}>
          {CHIPS.map(s => (
            <button
              key={s}
              onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 0); }}
              style={{
                fontSize: 10, padding: '4px 12px', borderRadius: 999,
                background: 'rgba(9,14,24,0.78)', border: '1px solid rgba(255,255,255,0.07)',
                color: '#3d5068', cursor: 'pointer', backdropFilter: 'blur(12px)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.color = '#93c5fd'; e.currentTarget.style.background = 'rgba(37,99,235,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#3d5068'; e.currentTarget.style.background = 'rgba(9,14,24,0.78)'; }}
            >{s}</button>
          ))}
        </div>
      )}

      {/* ── Main input bar ── */}
      <div style={{
        pointerEvents: 'all',
        display: 'flex', alignItems: 'center', gap: 6,
        background: focused ? 'rgba(11,17,29,0.97)' : 'rgba(9,14,24,0.85)',
        border: `1px solid ${focused ? 'rgba(59,130,246,0.38)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 999,
        padding: '5px 5px 5px 14px',
        backdropFilter: 'blur(28px)',
        boxShadow: focused
          ? '0 0 0 3px rgba(59,130,246,0.09), 0 8px 36px rgba(0,0,0,0.55)'
          : '0 4px 24px rgba(0,0,0,0.4)',
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* History toggle */}
        <button
          onClick={() => setShowHistory(v => !v)}
          title="对话历史"
          style={{
            flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
            background: showHistory ? 'rgba(37,99,235,0.22)' : userMsgs.length > 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
            border: showHistory ? '1px solid rgba(59,130,246,0.45)' : '1px solid rgba(255,255,255,0.08)',
            color: showHistory ? '#60a5fa' : userMsgs.length > 0 ? '#3d5068' : '#1a2535',
            cursor: 'pointer', fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s', userSelect: 'none',
          }}
        >
          {userMsgs.length > 0 ? userMsgs.length : <span style={{ fontSize: 13 }}>✦</span>}
        </button>

        {/* Input field */}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="问我关于硬件拓扑的问题..."
          style={{
            flex: 1, background: 'transparent', border: 'none',
            fontSize: 12.5, color: '#e2e8f0', outline: 'none',
            padding: '4px 0', caretColor: '#3b82f6',
          }}
        />

        {/* Typing indicator */}
        {typing && (
          <div style={{ display: 'flex', gap: 3, padding: '0 8px', flexShrink: 0, alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 4, height: 4, borderRadius: '50%', background: '#3b82f6',
                animation: `ai-dot 0.55s ease-in-out ${i * 0.15}s infinite alternate`,
              }} />
            ))}
          </div>
        )}

        {/* Send button */}
        <button
          onClick={send}
          disabled={!input.trim() || typing}
          style={{
            flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
            background: input.trim() && !typing
              ? 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)'
              : 'rgba(255,255,255,0.05)',
            border: 'none',
            color: input.trim() && !typing ? '#fff' : '#1a2535',
            cursor: input.trim() && !typing ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, transition: 'all 0.2s',
            boxShadow: input.trim() && !typing ? '0 2px 14px rgba(59,130,246,0.4)' : 'none',
            transform: input.trim() && !typing ? 'scale(1)' : 'scale(0.92)',
          }}
          onMouseEnter={e => { if (input.trim() && !typing) (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = input.trim() && !typing ? 'scale(1)' : 'scale(0.92)'; }}
        >↑</button>
      </div>

      <style>{`
        @keyframes ai-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ai-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ai-dot {
          from { opacity: 0.25; transform: scale(0.75); }
          to   { opacity: 1;    transform: scale(1.3); }
        }
        @keyframes ai-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mini I²C bus diagram
───────────────────────────────────────────── */
function getBusGroups(nodes: TopoNode[]) {
  const anchorChildren = nodes.filter(n => n.parent === 'Anchor');
  return anchorChildren.map(bus => {
    const directChips = nodes.filter(n => n.parent === bus.id);
    const muxChips = directChips.filter(n => n.type === 'i2c_mux')
      .flatMap(m => nodes.filter(n => n.parent === m.id));
    return {
      busId: bus.id, busType: bus.type,
      chips: [...directChips.filter(n => n.type !== 'i2c_mux'), ...muxChips].slice(0, 12),
    };
  });
}

function MiniBusDiagram({ board, showSoft }: { board: HwBoard; showSoft: boolean }) {
  const groups = useMemo(() => getBusGroups(board.topoNodes), [board]);
  const scannerChips = board.soft.scannerChips;
  const fruChips = useMemo(() => new Set(board.soft.fruData.map(f => f.chip)), [board]);

  // Find which bus contains Smc_ExpBoardSMC (the PSR I²C management entry)
  const mgmtBusId = useMemo(() => {
    const anchorBuses = board.topoNodes.filter(n => n.parent === 'Anchor');
    const mgmtBus = anchorBuses.find(bus =>
      board.topoNodes.some(n => n.parent === bus.id && n.id === 'Smc_ExpBoardSMC')
    );
    return mgmtBus?.id ?? null;
  }, [board]);

  // refConnector set: TopoNode Connectors that bridge to BusinessConnectors (PCIe↔I²C bridge)
  const bridgedConnectors = useMemo(() =>
    new Set(board.businessConnectors.map(bc => bc.refConnector).filter(Boolean)),
    [board]
  );

  return (
    <div style={{ padding: '4px 8px', flex: 1, overflow: 'hidden' }}>
      {groups.slice(0, 5).map(({ busId, busType, chips }) => {
        const isMgmtBus = busId === mgmtBusId;
        return (
          <div key={busId} style={{ marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <div style={{ height: 2, width: 8, background: busType === 'hisport' ? '#0891b2' : isMgmtBus ? '#0ea5e9' : '#0284c7' }} />
              <span style={{ fontSize: 9, color: busType === 'hisport' ? '#38bdf8' : isMgmtBus ? '#38bdf8' : '#475569', fontFamily: 'monospace' }}>
                {busId.replace(/^I2c_/, 'I²C_').replace(/^Hisport_/, 'HS_').replace(/^JtagOverLocalBus_/, 'JTAG_')}
              </span>
              {isMgmtBus && (
                <span style={{
                  fontSize: 7, padding: '0px 3px', borderRadius: 3,
                  background: 'rgba(14,165,233,0.15)', color: '#38bdf8',
                  border: '1px solid rgba(14,165,233,0.3)', flexShrink: 0,
                }}>← PSR I²C</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 3, paddingLeft: 14, flexWrap: 'wrap' }}>
              {chips.map(c => {
                const color = NODE_COLOR[c.type] ?? '#6b7280';
                const isEntryChip = c.id === 'Smc_ExpBoardSMC';
                const isTopoConnector = c.type === 'connector';
                const isBridged = bridgedConnectors.has(c.id);
                // Find the BusinessConnector that refConnects to this node
                const matchingBc = isBridged
                  ? board.businessConnectors.find(bc => bc.refConnector === c.id)
                  : null;
                const displayId = c.id
                  .replace(/^(?:I2cMux_Pca\w+_|I2cMux_|Connector_PCIE_|Connector_Com|Connector_|Chip_|Smc_|Eeprom_)/, '')
                  .slice(0, 10);
                return (
                  <div key={c.id}
                    title={
                      isTopoConnector
                        ? `[TopoNode Connector] ${c.id}\nI²C 在位检测节点，管理该插槽的热插拔信号${isBridged ? `\n⇌ 桥接 BusinessConnector: ${matchingBc?.id ?? ''} (${matchingBc?.connType ?? ''})` : ''}`
                        : c.id + (c.address != null ? ` 0x${c.address.toString(16).toUpperCase()}` : '')
                    }
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, position: 'relative' }}>
                    <div style={{
                      width: isTopoConnector ? 24 : 22,
                      height: isTopoConnector ? 14 : 16,
                      borderRadius: isTopoConnector ? 7 : (isEntryChip ? 3 : 3),
                      background: isEntryChip
                        ? 'rgba(14,165,233,0.25)'
                        : isTopoConnector
                          ? isBridged ? 'rgba(34,197,94,0.2)' : 'rgba(22,163,74,0.12)'
                          : color + '33',
                      border: isEntryChip
                        ? '1px solid #0ea5e9'
                        : isTopoConnector
                          ? isBridged ? '1px dashed #22c55e' : '1px dashed #16a34a'
                          : `1px solid ${color}88`,
                      boxShadow: isEntryChip
                        ? '0 0 6px rgba(14,165,233,0.5)'
                        : isBridged ? '0 0 5px rgba(34,197,94,0.4)'
                        : showSoft && fruChips.has(c.id) ? `0 0 5px ${color}`
                        : showSoft && (scannerChips[c.id]?.length ?? 0) > 0 ? '0 0 4px #4ade80' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isTopoConnector && (
                        <span style={{ fontSize: 6, color: isBridged ? '#22c55e' : '#16a34a', lineHeight: 1 }}>⚿</span>
                      )}
                      {c.address != null && !isTopoConnector && (
                        <div style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', fontSize: 7, color: '#475569', fontFamily: 'monospace' }}>
                          {c.address.toString(16).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* Bridge badge: PCIe↔I²C refConnector indicator */}
                    {isBridged && (
                      <div style={{
                        position: 'absolute', top: -5, right: -4,
                        fontSize: 6, padding: '0 2px', borderRadius: 2,
                        background: 'rgba(34,197,94,0.2)', color: '#22c55e',
                        border: '1px solid rgba(34,197,94,0.4)', lineHeight: '10px',
                        whiteSpace: 'nowrap',
                      }}>⇌</div>
                    )}
                    <div style={{ fontSize: 7, color: isEntryChip ? '#7dd3fc' : isTopoConnector ? '#4ade80' : '#374151', marginTop: isTopoConnector ? 6 : 8, maxWidth: 28, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayId}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Group Card
───────────────────────────────────────────── */
function GroupCard({ type, boards, cvs, highlighted, dimmed, onGroupClick, pos, onDragStart }: {
  type: string; boards: HwBoard[];
  cvs: CVS;
  highlighted: boolean; dimmed: boolean;
  onGroupClick: (type: string) => void;
  pos: { x: number; y: number };
  onDragStart: (type: string, e: React.MouseEvent) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  // If the CVS selectedBoardUid changes to a board of this type, sync activeIdx
  useEffect(() => {
    if (cvs.selectedBoardUid) {
      const idx = boards.findIndex(b => b.uid === cvs.selectedBoardUid);
      if (idx >= 0) setActiveIdx(idx);
    }
  }, [cvs.selectedBoardUid, boards]);

  const board = boards[Math.min(activeIdx, boards.length - 1)];
  const typeColor = TYPE_COLOR[type] ?? '#6b7280';
  const ups = board.businessConnectors.filter(bc => bc.direction === 'Upstream');
  const downs = board.businessConnectors.filter(bc => bc.direction === 'Downstream');

  return (
    <div
      data-board="true"
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: GROUP_W,
        minHeight: GROUP_H,
        background: highlighted ? '#0f1f35' : '#0b1118',
        border: `1px solid ${highlighted ? typeColor : typeColor + '44'}`,
        borderRadius: 8,
        boxShadow: highlighted ? `0 0 20px ${typeColor}55, 0 0 0 1px ${typeColor}33` : '0 2px 8px #00000066',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border 0.2s, box-shadow 0.2s, opacity 0.2s',
        opacity: dimmed ? 0.22 : 1,
        filter: dimmed ? 'grayscale(0.8)' : 'none',
        zIndex: highlighted ? 10 : 1,
        cursor: 'pointer',
      }}
    >
      {/* Header — drag to move, click to select group */}
      <div
        onMouseDown={e => onDragStart(type, e)}
        onClick={() => onGroupClick(type)}
        style={{
          padding: '5px 8px',
          borderBottom: `1px solid ${typeColor}22`,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          userSelect: 'none',
          cursor: 'grab',
        }}
      >
        <span style={{ fontSize: 8, padding: '1px 4px', borderRadius: 2, background: typeColor + '22', color: typeColor, border: `1px solid ${typeColor}44`, fontWeight: 700, flexShrink: 0 }}>{type}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.name}</span>
        {boards.length > 1 && (
          <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 9, background: typeColor + '18', color: typeColor + 'aa', border: `1px solid ${typeColor}22`, flexShrink: 0 }}>×{boards.length}</span>
        )}
      </div>

      {/* Board switcher — only shown when multiple boards exist */}
      {boards.length > 1 && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 6px', borderBottom: `1px solid ${typeColor}18`, background: typeColor + '08' }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={e => { e.stopPropagation(); setActiveIdx(i => (i - 1 + boards.length) % boards.length); }}
            style={{ width: 18, height: 18, borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#475569', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}
          >‹</button>
          <span style={{ flex: 1, fontSize: 9.5, color: '#94a3b8', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
            {board.name.replace('BC83', '')}
          </span>
          <span style={{ fontSize: 8, color: '#374151', flexShrink: 0 }}>{activeIdx + 1}/{boards.length}</span>
          <button
            onClick={e => { e.stopPropagation(); setActiveIdx(i => (i + 1) % boards.length); }}
            style={{ width: 18, height: 18, borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#475569', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}
          >›</button>
        </div>
      )}

      {board.desc && <div style={{ fontSize: 9, color: '#374151', padding: '2px 8px' }}>{board.desc}</div>}

      <MiniBusDiagram board={board} showSoft={cvs.showSoft} />

      <div style={{ padding: '3px 8px', borderTop: `1px solid #0f1a25`, display: 'flex', flexDirection: 'column', gap: 3, fontSize: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {ups.length > 0 && (
            <span style={{ color: '#60a5fa' }} title={ups.map(u => `${u.id}: ${u.linkWidth} ${u.connType}`).join('\n')}>
              ↑ {ups.map(u => u.connType || u.linkWidth).join(' ')}
            </span>
          )}
          {downs.length > 0 && (
            <span style={{ color: '#4ade80' }} title={downs.map(d => `${d.id}: ${d.linkWidth} ${d.connType}${d.refConnector ? ' → ' + d.refConnector : ''}`).join('\n')}>
              ↓ {downs.length}×{[...new Set(downs.map(d => d.connType))].join('/')}
            </span>
          )}
          {cvs.showSoft && board.soft.eventCount > 0 && <span style={{ color: '#fbbf24', marginLeft: 'auto' }}>{board.soft.eventCount}evt</span>}
        </div>
        {/* refConnector bridge: BusinessConnector ⇌ TopoNode Connector */}
        {downs.filter(d => d.refConnector).length > 0 && (
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {downs.filter(d => d.refConnector).map(d => (
              <span key={d.id} title={`BusinessConnector: ${d.id}\nPCIe ${d.connType} ${d.linkWidth}\n⇌ 桥接 TopoNode: ${d.refConnector}\n（I²C 在位检测节点）`}
                style={{
                  fontSize: 7, padding: '0 4px', borderRadius: 3, lineHeight: '12px',
                  background: 'rgba(34,197,94,0.08)', border: '1px dashed rgba(34,197,94,0.3)',
                  color: '#4ade80', cursor: 'default',
                }}>
                ⚿{d.refConnector!.replace('Connector_', '')} ⇌ {d.connType.split(' ')[0]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Connection Lines SVG (interactive)
───────────────────────────────────────────── */
function ConnectionLines({
  showI2C, showPCIe,
  selectedType, selectedConn,
  onConnClick, onConnHover,
  groupPositions,
}: {
  showI2C: boolean; showPCIe: boolean;
  selectedType: string | null; selectedConn: string | null;
  onConnClick: (key: string) => void;
  onConnHover: (key: string | null) => void;
  groupPositions: Record<string, { x: number; y: number }>;
}) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const connPaths = useMemo(() => {
    const result: Array<{
      key: string; d: string; color: string; style: 'solid' | 'dashed';
      colorName: string; fromType: string; toType: string;
      sharedI2C: boolean;
      coords: { fx: number; fy: number; cp1x: number; cp2x: number; tx: number; ty: number };
    }> = [];

    for (const conn of BOARD_CONNECTIONS) {
      if (conn.style === 'dashed' && !showI2C) continue;
      if (conn.style === 'solid' && !showPCIe) continue;

      const fromPos = groupPositions[conn.fromType];
      const toPos = groupPositions[conn.toType];
      if (!fromPos || !toPos) continue;

      // from: right edge of from-type group card
      const fx = fromPos.x + GROUP_W;
      const fy = fromPos.y + GROUP_H / 2;
      // to: left edge of to-type group card
      const tx = toPos.x;
      const ty = toPos.y + GROUP_H / 2;

      const cp1x = fx + Math.abs(tx - fx) * 0.45;
      const cp2x = tx - Math.abs(tx - fx) * 0.45;

      const d = `M ${fx} ${fy} C ${cp1x} ${fy} ${cp2x} ${ty} ${tx} ${ty}`;
      const colorName = conn.color === '#3b82f6' || conn.color === '#60a5fa' ? 'blue'
        : conn.color === '#f97316' ? 'orange'
        : conn.color === '#ec4899' ? 'pink'
        : conn.color === '#a78bfa' ? 'purple' : 'gray';
      const key = `${conn.fromType}|${conn.toType}`;
      result.push({ key, d, color: conn.color, style: conn.style, colorName, fromType: conn.fromType, toType: conn.toType, sharedI2C: conn.sharedI2C ?? false, coords: { fx, fy, cp1x, cp2x, tx, ty } });
    }
    return result;
  }, [showI2C, showPCIe, groupPositions]);

  const activeKeys = useMemo(() => {
    const s = new Set<string>();
    if (!selectedType && !selectedConn) return s; // empty = all active
    if (selectedType) {
      for (const cp of connPaths) {
        if (cp.fromType === selectedType || cp.toType === selectedType) s.add(cp.key);
      }
    }
    if (selectedConn) s.add(selectedConn);
    return s;
  }, [selectedType, selectedConn, connPaths]);

  const maxX = Math.max(...Object.values(groupPositions).map(p => p.x + GROUP_W + 200));
  const maxY = Math.max(...Object.values(groupPositions).map(p => p.y + GROUP_H + 200));

  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', zIndex: 20, pointerEvents: 'all' }}
      width={maxX} height={maxY}
    >
      <defs>
        {['blue', 'orange', 'pink', 'purple', 'gray'].map(name => {
          const cm: Record<string, string> = { blue: '#3b82f6', orange: '#f97316', pink: '#ec4899', purple: '#a78bfa', gray: '#475569' };
          return (
            <marker key={name} id={`arr-${name}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={cm[name]} />
            </marker>
          );
        })}
        <filter id="conn-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {connPaths.map(cp => {
        const isActive = activeKeys.size === 0 || activeKeys.has(cp.key);
        const isHovered = hoveredKey === cp.key;
        const opacity = isActive ? (isHovered ? 1 : 0.85) : 0.12;
        const strokeWidth = isHovered ? 2.5 : isActive ? 2 : 1;
        const c = cp.coords;
        const pcieD = cp.sharedI2C ? `M ${c.fx} ${c.fy + 5} C ${c.cp1x} ${c.fy + 5} ${c.cp2x} ${c.ty + 5} ${c.tx} ${c.ty + 5}` : cp.d;
        const i2cD  = cp.sharedI2C ? `M ${c.fx} ${c.fy - 5} C ${c.cp1x} ${c.fy - 5} ${c.cp2x} ${c.ty - 5} ${c.tx} ${c.ty - 5}` : null;
        return (
          <g key={cp.key}
            onMouseEnter={() => { setHoveredKey(cp.key); onConnHover(cp.key); }}
            onMouseLeave={() => { setHoveredKey(null); onConnHover(null); }}
            onClick={() => onConnClick(cp.key)}
            style={{ cursor: 'pointer' }}
          >
            {/* Wide transparent hit area */}
            <path d={cp.d} fill="none" stroke="transparent" strokeWidth={12} />
            {/* Visible line (PCIe track, offset +5 when sharedI2C) */}
            <path
              d={pcieD} fill="none" stroke={cp.color}
              strokeWidth={strokeWidth}
              strokeDasharray={cp.style === 'dashed' ? '4,3' : undefined}
              opacity={opacity}
              markerEnd={cp.style === 'solid' ? `url(#arr-${cp.colorName})` : undefined}
              filter={isHovered ? 'url(#conn-glow)' : undefined}
            />
            {/* I²C sideband track (only for sharedI2C connections, shown when showI2C) */}
            {cp.sharedI2C && showI2C && i2cD && (
              <>
                {/* bracket at source */}
                <line x1={c.fx} y1={c.fy - 8} x2={c.fx} y2={c.fy + 8} stroke="#0ea5e9" strokeWidth={1} opacity={opacity * 0.7} />
                {/* bracket at dest */}
                <line x1={c.tx} y1={c.ty - 8} x2={c.tx} y2={c.ty + 8} stroke="#0ea5e9" strokeWidth={1} opacity={opacity * 0.7} />
                {/* I²C dashed sideband */}
                <path
                  d={i2cD} fill="none" stroke="#0ea5e9"
                  strokeWidth={1}
                  strokeDasharray="4,3"
                  opacity={opacity * 0.8}
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Expanded view layout constants
───────────────────────────────────────────── */
const BOARD_W = 240;
const BOARD_H = 190;
const BOARD_COL_GAP = 50;
const BOARD_ROW_GAP = 34;
const BOARD_IEU_COLS = 3;
const BOARD_SEU_COLS = 2;
const BOARD_IEU_COL_W = BOARD_W + BOARD_COL_GAP;
const BOARD_COLS = {
  PSR: 80, BCU: 380, CLU: 380, EXU: 700,
  IEU: 1000,
  SEU: 1000 + BOARD_IEU_COLS * BOARD_IEU_COL_W + 60,
  NICCard: 1000 + BOARD_IEU_COLS * BOARD_IEU_COL_W + 60,
  BMC: 80,
};

function computeBoardLayout(boards: HwBoard[]): Map<string, { x: number; y: number }> {
  const byType = new Map<string, HwBoard[]>();
  for (const b of boards) {
    if (!byType.has(b.type)) byType.set(b.type, []);
    byType.get(b.type)!.push(b);
  }
  const pos = new Map<string, { x: number; y: number }>();
  let y = 180;
  for (const b of [...(byType.get('PSR') ?? []), ...(byType.get('BMC') ?? [])]) {
    pos.set(b.uid, { x: BOARD_COLS.PSR, y }); y += BOARD_H + BOARD_ROW_GAP;
  }
  y = 80;
  for (const b of byType.get('BCU') ?? []) { pos.set(b.uid, { x: BOARD_COLS.BCU, y }); y += BOARD_H + BOARD_ROW_GAP; }
  y = Math.max(y + 40, 80 + BOARD_H + 80);
  for (const b of byType.get('CLU') ?? []) { pos.set(b.uid, { x: BOARD_COLS.CLU, y }); y += BOARD_H + BOARD_ROW_GAP; }
  y = 80;
  for (const b of byType.get('EXU') ?? []) { pos.set(b.uid, { x: BOARD_COLS.EXU, y }); y += BOARD_H + BOARD_ROW_GAP; }
  (byType.get('IEU') ?? []).forEach((b, i) => {
    pos.set(b.uid, { x: BOARD_COLS.IEU + (i % BOARD_IEU_COLS) * BOARD_IEU_COL_W, y: 60 + Math.floor(i / BOARD_IEU_COLS) * (BOARD_H + BOARD_ROW_GAP) });
  });
  const seuBoards = byType.get('SEU') ?? [];
  seuBoards.forEach((b, i) => {
    pos.set(b.uid, { x: BOARD_COLS.SEU + (i % BOARD_SEU_COLS) * BOARD_IEU_COL_W, y: 60 + Math.floor(i / BOARD_SEU_COLS) * (BOARD_H + BOARD_ROW_GAP) });
  });
  const nicStartY = 60 + Math.ceil(seuBoards.length / BOARD_SEU_COLS) * (BOARD_H + BOARD_ROW_GAP) + 50;
  (byType.get('NICCard') ?? []).forEach((b, i) => {
    pos.set(b.uid, { x: BOARD_COLS.NICCard + i * BOARD_IEU_COL_W, y: nicStartY });
  });
  return pos;
}

/* ─────────────────────────────────────────────
   BoardNode (expanded view)
───────────────────────────────────────────── */
function BoardNode({ board, x, y, cvs, onSelect, onDragStart }: {
  board: HwBoard; x: number; y: number;
  cvs: CVS; onSelect: (b: HwBoard) => void;
  onDragStart?: (uid: string, e: React.MouseEvent) => void;
}) {
  const typeColor = TYPE_COLOR[board.type] ?? '#6b7280';
  const isSelected = cvs.selectedBoardUid === board.uid;
  const isHighlighted = cvs.highlightUids.length === 0 || cvs.highlightUids.includes(board.uid);
  const ups = board.businessConnectors.filter(bc => bc.direction === 'Upstream');
  const downs = board.businessConnectors.filter(bc => bc.direction === 'Downstream');

  // I²C entry port position on left edge (only for non-PSR boards that have Smc_ExpBoardSMC)
  const isPsr = board.type === 'PSR';
  const hasMgmtSmc = board.topoNodes.some(n => n.id === 'Smc_ExpBoardSMC');
  const i2cEntryY = hasMgmtSmc && !isPsr ? getI2cEntryY(board) : null;

  return (
    <div onClick={e => { e.stopPropagation(); onSelect(board); }}
      style={{
        position: 'absolute', left: x, top: y, width: BOARD_W, minHeight: BOARD_H,
        background: isSelected ? '#0f1f35' : '#0b1118',
        border: `1px solid ${isSelected ? typeColor : typeColor + '44'}`,
        borderRadius: 8, cursor: 'pointer',
        boxShadow: isSelected ? `0 0 16px ${typeColor}55` : '0 2px 8px #00000066',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.2s',
        opacity: isHighlighted ? 1 : 0.25,
        zIndex: isSelected ? 10 : 1,
        filter: isHighlighted ? 'none' : 'grayscale(0.7)',
      }}>
      {/* I²C input port indicator on left edge */}
      {i2cEntryY !== null && cvs.showI2C && (
        <div title="I²C 管理总线入口 (来自 PSR)" style={{
          position: 'absolute',
          left: -8,
          top: i2cEntryY - 6,
          width: 12, height: 12,
          borderRadius: '50%',
          background: '#0ea5e9',
          border: '1.5px solid #38bdf8',
          boxShadow: '0 0 6px rgba(14,165,233,0.7)',
          zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />
        </div>
      )}
      {/* PSR right-edge I²C output indicator */}
      {isPsr && cvs.showI2C && (
        <div title="I²C 管理总线输出 (→ 各板卡)" style={{
          position: 'absolute',
          right: -8,
          top: BOARD_H / 2 - 6,
          width: 12, height: 12,
          borderRadius: '50%',
          background: '#0ea5e9',
          border: '1.5px solid #38bdf8',
          boxShadow: '0 0 6px rgba(14,165,233,0.7)',
          zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />
        </div>
      )}
      <div
        onMouseDown={onDragStart ? (e => { e.stopPropagation(); onDragStart(board.uid, e); }) : undefined}
        style={{ padding: '5px 8px', borderBottom: `1px solid ${typeColor}22`, display: 'flex', alignItems: 'center', gap: 5, cursor: onDragStart ? 'grab' : 'pointer', userSelect: 'none' }}
      >
        <span style={{ fontSize: 8, padding: '1px 4px', borderRadius: 2, background: typeColor + '22', color: typeColor, border: `1px solid ${typeColor}44`, fontWeight: 700 }}>{board.type}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.name}</span>
      </div>
      {board.desc && <div style={{ fontSize: 9, color: '#374151', padding: '2px 8px' }}>{board.desc}</div>}
      <MiniBusDiagram board={board} showSoft={cvs.showSoft} />
      <div style={{ padding: '3px 8px', borderTop: '1px solid #0f1a25', display: 'flex', flexDirection: 'column', gap: 3, fontSize: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {ups.length > 0 && (
            <span style={{ color: '#60a5fa' }} title={ups.map(u => `${u.id}: ${u.linkWidth} ${u.connType}`).join('\n')}>
              ↑ {ups.map(u => u.connType || u.linkWidth).join(' ')}
            </span>
          )}
          {downs.length > 0 && (
            <span style={{ color: '#4ade80' }} title={downs.map(d => `${d.id}: ${d.linkWidth} ${d.connType}${d.refConnector ? ' → ' + d.refConnector : ''}`).join('\n')}>
              ↓ {downs.length}×{[...new Set(downs.map(d => d.connType))].join('/')}
            </span>
          )}
          {cvs.showSoft && board.soft.eventCount > 0 && <span style={{ color: '#fbbf24', marginLeft: 'auto' }}>{board.soft.eventCount}evt</span>}
        </div>
        {/* refConnector bridge: BusinessConnector ⇌ TopoNode Connector */}
        {downs.filter(d => d.refConnector).length > 0 && (
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {downs.filter(d => d.refConnector).map(d => (
              <span key={d.id} title={`BusinessConnector: ${d.id}\nPCIe ${d.connType} ${d.linkWidth}\n⇌ 桥接 TopoNode: ${d.refConnector}\n（I²C 在位检测节点）`}
                style={{
                  fontSize: 7, padding: '0 4px', borderRadius: 3, lineHeight: '12px',
                  background: 'rgba(34,197,94,0.08)', border: '1px dashed rgba(34,197,94,0.3)',
                  color: '#4ade80', cursor: 'default',
                }}>
                ⚿{d.refConnector!.replace('Connector_', '')} ⇌ {d.connType.split(' ')[0]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   I²C 入口总线信息（找到挂载 Smc_ExpBoardSMC 的总线）
───────────────────────────────────────────── */
function getI2cEntryInfo(board: HwBoard): { y: number; busId: string } {
  const HEADER_H = 28;
  const DESC_H = board.desc ? 14 : 0;
  const MINI_PAD_TOP = 4;
  const PER_BUS_H = 46;

  const anchorBuses = board.topoNodes.filter(n => n.parent === 'Anchor');
  const mgmtBusIdx = anchorBuses.findIndex(bus =>
    board.topoNodes.some(n => n.parent === bus.id && n.id === 'Smc_ExpBoardSMC')
  );
  const busIdx = Math.max(0, mgmtBusIdx);
  const bus = anchorBuses[busIdx];
  return {
    y: HEADER_H + DESC_H + MINI_PAD_TOP + busIdx * PER_BUS_H + PER_BUS_H * 0.55,
    busId: bus?.id ?? '',
  };
}

function getI2cEntryY(board: HwBoard): number {
  return getI2cEntryInfo(board).y;
}

/* ─────────────────────────────────────────────
   ExpandedConnectionLines (per-board, expanded view)
   支持 hover 查看连线名称和属性
───────────────────────────────────────────── */
interface EclPath {
  key: string;
  d: string;
  color: string;
  style: 'solid' | 'dashed';
  opacity: number;
  markerColor: string;
  // tooltip metadata
  label: string;
  fromName: string;
  toName: string;
  fromType: string;
  toType: string;
  protocol: string;
  entryBusId: string;   // e.g. "I2c_2" on the target board
  // midpoint for tooltip anchor
  mx: number;
  my: number;
  // dual-signal rendering
  sharedI2C: boolean;
  coords: { fx: number; fy: number; cp1x: number; cp2x: number; tx: number; ty: number };
}

interface EclTooltip {
  path: EclPath;
  svgX: number;  // in SVG/canvas coordinate space
  svgY: number;
}

function ExpandedConnectionLines({ boards, positions, showI2C, showPCIe, highlightUids }: {
  boards: HwBoard[];
  positions: Map<string, { x: number; y: number }>;
  showI2C: boolean;
  showPCIe: boolean;
  highlightUids: string[];
}) {
  const [tooltip, setTooltip] = useState<EclTooltip | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const paths = useMemo(() => {
    const result: EclPath[] = [];
    const boardsByType = new Map<string, HwBoard[]>();
    for (const b of boards) {
      if (!boardsByType.has(b.type)) boardsByType.set(b.type, []);
      boardsByType.get(b.type)!.push(b);
    }
    for (const conn of BOARD_CONNECTIONS) {
      if (conn.style === 'dashed' && !showI2C) continue;
      if (conn.style === 'solid' && !showPCIe) continue;
      const fromBoards = boardsByType.get(conn.fromType) ?? [];
      const toBoards = boardsByType.get(conn.toType) ?? [];
      for (const fb of fromBoards) {
        for (const tb of toBoards) {
          const fp = positions.get(fb.uid);
          const tp = positions.get(tb.uid);
          if (!fp || !tp) continue;

          const fx = fp.x + BOARD_W;
          const fy = fp.y + BOARD_H / 2;
          const entryInfo = conn.style === 'dashed' ? getI2cEntryInfo(tb) : null;
          const toEntryY = entryInfo ? entryInfo.y : BOARD_H / 2;
          const entryBusId = entryInfo?.busId ?? '';
          const tx = tp.x;
          const ty = tp.y + toEntryY;

          const cp1x = fx + Math.abs(tx - fx) * 0.45;
          const cp2x = tx - Math.abs(tx - fx) * 0.45;
          const d = `M ${fx} ${fy} C ${cp1x} ${fy} ${cp2x} ${ty} ${tx} ${ty}`;

          // approximate bezier midpoint (t=0.5)
          const t = 0.5;
          const mx = (1-t)**3*fx + 3*(1-t)**2*t*cp1x + 3*(1-t)*t**2*cp2x + t**3*tx;
          const my = (1-t)**3*fy + 3*(1-t)**2*t*fy   + 3*(1-t)*t**2*ty   + t**3*ty;

          const isActive = highlightUids.length === 0 || (highlightUids.includes(fb.uid) && highlightUids.includes(tb.uid));
          const protocol = conn.style === 'dashed' ? 'I²C' : (conn.sharedI2C ? 'PCIe + I²C侧带' : 'PCIe');
          result.push({
            key: `${fb.uid}|${tb.uid}`,
            d, color: conn.color, style: conn.style,
            opacity: isActive ? 0.75 : 0.07,
            markerColor: conn.color,
            label: conn.label,
            fromName: fb.name,
            toName: tb.name,
            fromType: conn.fromType,
            toType: conn.toType,
            protocol,
            entryBusId,
            mx, my,
            sharedI2C: conn.sharedI2C ?? false,
            coords: { fx, fy, cp1x, cp2x, tx, ty },
          });
        }
      }
    }
    return result;
  }, [boards, positions, showI2C, showPCIe, highlightUids]);

  const allPos = Array.from(positions.values());
  const maxX = allPos.length > 0 ? Math.max(...allPos.map(p => p.x + BOARD_W + 200)) : 3000;
  const maxY = allPos.length > 0 ? Math.max(...allPos.map(p => p.y + BOARD_H + 200)) : 2000;

  const markerColors = [...new Set(paths.map(p => p.markerColor))];

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>, path: EclPath) => {
    const svg = svgRef.current;
    if (!svg) return;
    // Convert screen coords → SVG canvas coords (accounts for parent scale/translate)
    try {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
      setTooltip({ path, svgX: svgPt.x, svgY: svgPt.y });
    } catch {
      // fallback: raw offset
      const rect = svg.getBoundingClientRect();
      setTooltip({ path, svgX: e.clientX - rect.left, svgY: e.clientY - rect.top });
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', zIndex: 5, pointerEvents: 'all' }}
      width={maxX} height={maxY}
      onMouseLeave={() => { setTooltip(null); setHoveredKey(null); }}
      onMouseMove={e => {
        // keep tooltip tracking when moving within same hovered path
        if (tooltip) handleMouseMove(e as React.MouseEvent<SVGSVGElement>, tooltip.path);
      }}
    >
      <defs>
        {markerColors.map(color => {
          const id = `ecl-arr-${color.replace('#', '')}`;
          const idHov = `ecl-arr-hov-${color.replace('#', '')}`;
          return (
            <React.Fragment key={id}>
              <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
              </marker>
              <marker id={idHov} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
              </marker>
            </React.Fragment>
          );
        })}
        <filter id="ecl-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {paths.map(p => {
        const isHovered = hoveredKey === p.key;
        const markerId = isHovered
          ? `ecl-arr-hov-${p.markerColor.replace('#', '')}`
          : `ecl-arr-${p.markerColor.replace('#', '')}`;
        const ec = p.coords;
        const pcieD = p.sharedI2C ? `M ${ec.fx} ${ec.fy + 5} C ${ec.cp1x} ${ec.fy + 5} ${ec.cp2x} ${ec.ty + 5} ${ec.tx} ${ec.ty + 5}` : p.d;
        const i2cD  = p.sharedI2C ? `M ${ec.fx} ${ec.fy - 5} C ${ec.cp1x} ${ec.fy - 5} ${ec.cp2x} ${ec.ty - 5} ${ec.tx} ${ec.ty - 5}` : null;
        return (
          <g key={p.key}
            onMouseEnter={e => { setHoveredKey(p.key); handleMouseMove(e as React.MouseEvent<SVGSVGElement>, p); }}
            onMouseLeave={() => { setHoveredKey(null); setTooltip(null); }}
            onMouseMove={e => handleMouseMove(e as React.MouseEvent<SVGSVGElement>, p)}
            style={{ cursor: 'crosshair' }}
          >
            {/* Wide transparent hit area */}
            <path d={p.d} fill="none" stroke="transparent" strokeWidth={12} />
            {/* Visible line (PCIe track, offset +5 when sharedI2C) */}
            <path
              d={pcieD} fill="none"
              stroke={p.color}
              strokeWidth={isHovered ? 2.8 : (p.style === 'dashed' ? 1.8 : 1.5)}
              strokeDasharray={p.style === 'dashed' ? '5,3' : undefined}
              opacity={isHovered ? 1 : p.opacity}
              markerEnd={`url(#${markerId})`}
              filter={isHovered ? 'url(#ecl-glow)' : undefined}
            />
            {/* I²C sideband track (only for sharedI2C Hisport connections) */}
            {p.sharedI2C && showI2C && i2cD && (
              <>
                {/* bracket at source */}
                <line x1={ec.fx} y1={ec.fy - 8} x2={ec.fx} y2={ec.fy + 8} stroke="#0ea5e9" strokeWidth={1} opacity={(isHovered ? 1 : p.opacity) * 0.7} />
                {/* bracket at dest */}
                <line x1={ec.tx} y1={ec.ty - 8} x2={ec.tx} y2={ec.ty + 8} stroke="#0ea5e9" strokeWidth={1} opacity={(isHovered ? 1 : p.opacity) * 0.7} />
                {/* I²C dashed sideband */}
                <path
                  d={i2cD} fill="none" stroke="#0ea5e9"
                  strokeWidth={1.2}
                  strokeDasharray="4,3"
                  opacity={isHovered ? 1 : p.opacity * 0.8}
                />
              </>
            )}
          </g>
        );
      })}

      {/* Tooltip rendered inside SVG as foreignObject for rich HTML */}
      {tooltip && (
        <foreignObject
          x={tooltip.svgX + 14}
          y={tooltip.svgY - 10}
          width={230} height={165}
          style={{ pointerEvents: 'none', overflow: 'visible' }}
        >
          <div style={{
            background: 'rgba(7,12,22,0.97)',
            border: `1px solid ${tooltip.path.color}66`,
            borderRadius: 8,
            padding: '9px 12px',
            fontSize: 11,
            color: '#94a3b8',
            lineHeight: 1.65,
            boxShadow: `0 4px 24px rgba(0,0,0,0.7), 0 0 0 1px ${tooltip.path.color}22`,
            backdropFilter: 'blur(12px)',
            width: 220,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
              <div style={{
                width: 20, height: 4, borderRadius: 2,
                background: tooltip.path.color,
                ...(tooltip.path.style === 'dashed'
                  ? { backgroundImage: `repeating-linear-gradient(90deg,${tooltip.path.color} 0 5px,transparent 5px 8px)`, background: 'transparent' }
                  : {}),
              }} />
              <span style={{ fontWeight: 700, fontSize: 12, color: '#e2e8f0' }}>
                {tooltip.path.label}
              </span>
            </div>
            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: '2px 6px' }}>
              <span style={{ color: '#475569' }}>协议</span>
              <span style={{ color: tooltip.path.color, fontWeight: 600 }}>{tooltip.path.protocol}</span>
              <span style={{ color: '#475569' }}>方向</span>
              <span style={{ color: '#cbd5e1' }}>
                <span style={{ color: '#94a3b8' }}>{tooltip.path.fromType}</span>
                <span style={{ color: '#475569', margin: '0 4px' }}>→</span>
                <span style={{ color: '#94a3b8' }}>{tooltip.path.toType}</span>
              </span>
              <span style={{ color: '#475569' }}>发送方</span>
              <span style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: 10 }}>{tooltip.path.fromName}</span>
              <span style={{ color: '#475569' }}>接收方</span>
              <span style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: 10 }}>{tooltip.path.toName}</span>
              {tooltip.path.protocol === 'I²C' && tooltip.path.entryBusId && (
                <>
                  <span style={{ color: '#475569' }}>入口总线</span>
                  <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: 10 }}>
                    {tooltip.path.entryBusId.replace(/^I2c_/, 'I²C_').replace(/^I2cMux_/, 'I²CMux_')}
                  </span>
                  <span style={{ color: '#475569' }}>入口芯片</span>
                  <span style={{ color: '#7dd3fc', fontSize: 10 }}>Smc_ExpBoardSMC</span>
                </>
              )}
              {tooltip.path.sharedI2C && (
                <>
                  <span style={{ color: '#0ea5e9', gridColumn: '1 / -1', borderTop: '1px solid #1e2d3d', paddingTop: 4, marginTop: 2, fontSize: 10 }}>I²C 侧带</span>
                  <span style={{ color: '#475569' }}>信道类型</span>
                  <span style={{ color: '#38bdf8', fontSize: 10 }}>Hisport 侧带（随 PCIe 复用）</span>
                  <span style={{ color: '#475569' }}>用途</span>
                  <span style={{ color: '#7dd3fc', fontSize: 10 }}>IEU I²C 管理（由 BCU 转发）</span>
                </>
              )}
            </div>
          </div>
        </foreignObject>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Board Detail Panel
───────────────────────────────────────────── */
function DetailPanel({ board, cvs, onClose }: { board: HwBoard; cvs: CVS; onClose: () => void }) {
  const typeColor = TYPE_COLOR[board.type] ?? '#6b7280';
  const tree = useMemo(() => {
    const map = new Map(board.topoNodes.map(n => [n.id, { n, children: [] as typeof board.topoNodes }]));
    const roots: typeof board.topoNodes = [];
    board.topoNodes.forEach(n => { if (!n.parent) roots.push(n); else map.get(n.parent)?.children.push(n); });
    return { roots, map };
  }, [board]);

  const initOpen = useMemo(() => {
    const s = new Set<string>(['Anchor']);
    board.topoNodes.filter(n => !n.parent || n.parent === 'Anchor').forEach(n => s.add(n.id));
    return s;
  }, [board]);
  const [open, setOpen] = useState<Set<string>>(initOpen);
  const prevUid = useRef(board.uid);
  if (prevUid.current !== board.uid) { prevUid.current = board.uid; setOpen(initOpen); }

  const fruChips = useMemo(() => new Set(board.soft.fruData.map(f => f.chip)), [board]);

  const renderNode = (n: typeof board.topoNodes[0], depth: number): React.ReactNode => {
    const children = tree.map.get(n.id)?.children ?? [];
    const isOpen = open.has(n.id);
    const color = NODE_COLOR[n.type] ?? '#6b7280';
    const scans = (board.soft.scannerChips[n.id] ?? []).length;
    const hasFru = fruChips.has(n.id);
    return (
      <div key={n.id}>
        <div onClick={() => children.length && setOpen(s => { const ns = new Set(s); ns.has(n.id) ? ns.delete(n.id) : ns.add(n.id); return ns; })}
          style={{ display: 'flex', alignItems: 'center', gap: 5, paddingLeft: depth * 14 + 4, paddingRight: 6, paddingTop: 2, paddingBottom: 2, cursor: children.length ? 'pointer' : 'default', borderRadius: 3 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0f1a25'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
          <span style={{ width: 10, fontSize: 9, color: '#555', userSelect: 'none' }}>{children.length ? (isOpen ? '▾' : '▸') : ''}</span>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: color + '55', border: `1px solid ${color}`, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#cbd5e1', flex: 1, fontFamily: 'monospace' }}>{n.id}</span>
          {n.address != null && <span style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace' }}>0x{n.address.toString(16).toUpperCase()}</span>}
          {n.channel != null && <span style={{ fontSize: 9, color: '#374151' }}>ch{n.channel}</span>}
          {cvs.showSoft && scans > 0 && <span style={{ fontSize: 8, padding: '0 3px', borderRadius: 8, background: '#16a34a33', color: '#4ade80', border: '1px solid #16a34a44' }}>{scans}scan</span>}
          {cvs.showSoft && hasFru && <span style={{ fontSize: 8, padding: '0 3px', borderRadius: 8, background: '#d9770633', color: '#fbbf24', border: '1px solid #d9770644' }}>FRU</span>}
        </div>
        {isOpen && children.map(c => renderNode(c, depth + 1))}
      </div>
    );
  };

  const ups = board.businessConnectors.filter(bc => bc.direction === 'Upstream');
  const downs = board.businessConnectors.filter(bc => bc.direction === 'Downstream');

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(58vw, 780px)', background: '#080d14', borderLeft: '1px solid #1e2d3d', display: 'flex', flexDirection: 'column', zIndex: 500, boxShadow: '-6px 0 28px #0008' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e2d3d', display: 'flex', alignItems: 'center', gap: 8, background: '#0a0f1a' }}>
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: typeColor + '22', color: typeColor, border: `1px solid ${typeColor}44` }}>{board.type}</span>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>{board.name}</span>
        {board.desc && <span style={{ fontSize: 11, color: '#4b6080' }}>{board.desc}</span>}
        <div style={{ flex: 1 }} />
        <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #1e2d3d', color: '#666', padding: '3px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {board.businessConnectors.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#4b6080', fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>PCIe 连接器</div>
            {ups.map(bc => (
              <div key={bc.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', marginBottom: 3, background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 4, fontSize: 11 }}>
                <span style={{ color: '#60a5fa' }}>↑</span>
                <span style={{ color: '#60a5fa', padding: '0 4px', background: '#1e3a5f', borderRadius: 2, fontSize: 10 }}>Upstream</span>
                <span style={{ color: '#e2e8f0', flex: 1 }}>{bc.name}</span>
                <span style={{ color: '#475569' }}>{bc.linkWidth}</span>
                <span style={{ color: '#374151' }}>{bc.connType}</span>
                <span style={{ color: '#1e3a5f', fontSize: 9 }}>{bc.maxRate}</span>
              </div>
            ))}
            {downs.map(bc => (
              <div key={bc.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', marginBottom: 3, background: '#0a1a0f', border: '1px solid #14532d', borderRadius: 4, fontSize: 11 }}>
                <span style={{ color: '#4ade80' }}>↓</span>
                <span style={{ color: '#4ade80', padding: '0 4px', background: '#14532d', borderRadius: 2, fontSize: 10 }}>Downstream</span>
                <span style={{ color: '#e2e8f0', flex: 1 }}>{bc.name}</span>
                <span style={{ color: '#475569' }}>{bc.linkWidth}</span>
                <span style={{ color: '#374151' }}>{bc.connType}</span>
                {bc.refConnector && <span style={{ color: '#22c55e', fontSize: 9, fontFamily: 'monospace' }}>{bc.refConnector}</span>}
              </div>
            ))}
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: '#4b6080', fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>I²C 管理拓扑</div>
          {tree.roots.map(n => renderNode(n, 0))}
        </div>
        {cvs.showSoft && (
          <div>
            <div style={{ fontSize: 10, color: '#4b6080', fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>软件层</div>
            {board.soft.fruData.length > 0 && <div style={{ fontSize: 11, color: '#fbbf24', marginBottom: 4 }}>FRU绑定: {board.soft.fruData.map(f => `${f.id}→${f.chip}`).join(', ')}</div>}
            {board.soft.components.length > 0 && <div style={{ fontSize: 11, color: '#a78bfa', marginBottom: 4 }}>组件: {board.soft.components.map(c => c.id.replace('Component_', '')).join(', ')}</div>}
            <div style={{ fontSize: 11, color: '#64748b' }}>事件: {board.soft.eventCount} | 传感器: {board.soft.sensorCount}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Timeline Panel (Grok-style right sidebar)
───────────────────────────────────────────── */
function TimelinePanel({
  entries, cvs, onRevert, onClose,
}: {
  entries: HistoryEntry[];
  cvs: CVS;
  onRevert: (c: CVS) => void;
  onClose: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(
    entries.length > 0 ? entries[entries.length - 1].id : null
  );
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [entries.length]);

  const reversed = [...entries].reverse();

  return (
    <div
      data-agent="true"
      style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 256,
        background: 'rgba(7,11,20,0.96)',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)',
        display: 'flex', flexDirection: 'column',
        zIndex: 160,
        animation: 'tl-slide-in 0.22s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '11px 14px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
          background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, color: '#fff',
        }}>✦</div>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', flex: 1 }}>对话时间轴</span>
        {entries.length > 0 && (
          <span style={{
            fontSize: 9, padding: '1px 6px', borderRadius: 999,
            background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)',
            color: '#3b82f6',
          }}>{entries.length} 步</span>
        )}
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#2d3f52', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: '2px 4px', borderRadius: 3, transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
          onMouseLeave={e => (e.currentTarget.style.color = '#2d3f52')}
        >✕</button>
      </div>

      {/* Current state pill */}
      <div style={{
        margin: '10px 12px 4px',
        padding: '6px 10px',
        background: 'rgba(59,130,246,0.07)',
        border: '1px solid rgba(59,130,246,0.18)',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', gap: 6,
        flexShrink: 0,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
        <span style={{ fontSize: 10, color: '#60a5fa' }}>当前状态</span>
        <span style={{ fontSize: 9, color: '#2d4a6a', marginLeft: 'auto' }}>{Math.round(cvs.scale * 100)}% · {cvs.highlightUids.length > 0 ? `${cvs.highlightUids.length}板高亮` : '全览'}</span>
      </div>

      {/* Timeline list */}
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '6px 0 80px' }}>
        {entries.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: 8, opacity: 0.3 }}>✦</div>
            <div style={{ fontSize: 11, color: '#1e293b', lineHeight: 1.6 }}>
              使用底部 AI 指令栏<br />发送第一条指令
            </div>
          </div>
        ) : reversed.map((entry, idx) => {
          const isLatest = idx === 0;
          const isExpanded = expandedId === entry.id;
          const diffs = computeDiff(entry.before, entry.after);
          const time = new Date(entry.ts).toLocaleTimeString('zh', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

          return (
            <div key={entry.id} style={{ display: 'flex', paddingRight: 10 }}>
              {/* Timeline line + dot */}
              <div style={{ width: 32, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 1, flex: '0 0 12px', background: isLatest ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)' }} />
                <div style={{
                  width: isLatest ? 9 : 7, height: isLatest ? 9 : 7,
                  borderRadius: '50%', flexShrink: 0,
                  background: isLatest ? '#3b82f6' : 'rgba(255,255,255,0.12)',
                  border: isLatest ? '2px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: isLatest ? '0 0 8px rgba(59,130,246,0.5)' : 'none',
                  transition: 'all 0.2s',
                }} />
                <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.06)', minHeight: 20 }} />
              </div>

              {/* Entry content */}
              <div
                style={{
                  flex: 1, paddingTop: 6, paddingBottom: 8, paddingLeft: 4,
                  cursor: 'pointer',
                  borderRadius: 8,
                  transition: 'background 0.15s',
                }}
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                {/* User query */}
                <div style={{ fontSize: 11, color: isLatest ? '#93c5fd' : '#475569', marginBottom: 4, lineHeight: 1.4, paddingRight: 4 }}>
                  {entry.userQuery.length > 28 ? entry.userQuery.slice(0, 28) + '…' : entry.userQuery}
                </div>

                {/* Diff tags */}
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 4 }}>
                  {diffs.map((d, i) => (
                    <span key={i} style={{
                      fontSize: 9, padding: '1px 6px', borderRadius: 999,
                      background: d.color + '18', border: `1px solid ${d.color}33`,
                      color: d.color,
                    }}>{d.label}</span>
                  ))}
                </div>

                {/* Time */}
                <div style={{ fontSize: 9, color: '#1e293b' }}>{time}</div>

                {/* Expanded: agent reply + action buttons */}
                {isExpanded && (
                  <div
                    style={{ marginTop: 8, animation: 'tl-fade-in 0.18s ease' }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Agent reply preview */}
                    <div style={{
                      fontSize: 10, color: '#334155', lineHeight: 1.55,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 6, padding: '6px 8px', marginBottom: 8,
                    }}>
                      {entry.agentReply.replace(/\*\*/g, '').split('\n')[0].slice(0, 80)}
                      {entry.agentReply.length > 80 && <span style={{ color: '#1e293b' }}>…</span>}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        onClick={() => onRevert(entry.after)}
                        style={{
                          flex: 1, fontSize: 9.5, padding: '5px 0', borderRadius: 6,
                          background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)',
                          color: '#60a5fa', cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.1)'; }}
                        title="跳转到该步执行后的画布状态"
                      >⟳ 跳到此步</button>
                      <button
                        onClick={() => onRevert(entry.before)}
                        style={{
                          flex: 1, fontSize: 9.5, padding: '5px 0', borderRadius: 6,
                          background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
                          color: '#334155', cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = '#64748b'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#334155'; }}
                        title="撤销该步，恢复到执行前"
                      >↩ 撤销此步</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Expand chevron */}
              <div style={{ paddingTop: 8, paddingLeft: 2, color: '#1e293b', fontSize: 9, flexShrink: 0, lineHeight: 1.5 }}>
                {isExpanded ? '▲' : '▼'}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes tl-slide-in {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes tl-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main: HardwareTopologyCanvas
───────────────────────────────────────────── */
export function HardwareTopologyCanvas() {
  const [cvs, setCvs] = useState<CVS>(DEFAULT_CVS);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [viewSize, setViewSize] = useState({ w: 1200, h: 700 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const cardDragRef = useRef<{ mode: 'group' | 'expanded'; key: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedConn, setSelectedConn] = useState<string | null>(null);
  const [groupPositions, setGroupPositions] = useState<Record<string, { x: number; y: number }>>(() => ({ ...GROUP_POSITIONS }));
  const [expandedPositions, setExpandedPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const m = computeBoardLayout(HW_BOARDS);
    const obj: Record<string, { x: number; y: number }> = {};
    for (const [uid, pos] of m) obj[uid] = pos;
    return obj;
  });
  const [viewMode, setViewMode] = useState<'grouped' | 'expanded'>('grouped');

  const positions = useMemo(() => computeGroupLayout(), []);
  const boardLayout = useMemo(() => computeBoardLayout(HW_BOARDS), []);
  const expandedPosMap = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    for (const [uid, pos] of Object.entries(expandedPositions)) m.set(uid, pos);
    return m;
  }, [expandedPositions]);

  // Measure viewport
  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const e = entries[0];
      setViewSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    if (canvasRef.current) obs.observe(canvasRef.current);
    return () => obs.disconnect();
  }, []);

  const selectedBoard = useMemo(() => HW_BOARDS.find(b => b.uid === cvs.selectedBoardUid) ?? null, [cvs.selectedBoardUid]);

  const groupsByType = useMemo(() => {
    const m = new Map<string, HwBoard[]>();
    for (const b of HW_BOARDS) {
      if (!m.has(b.type)) m.set(b.type, []);
      m.get(b.type)!.push(b);
    }
    return m;
  }, []);

  const highlightedTypes = useMemo(() => {
    const s = new Set<string>();
    if (!selectedType && !selectedConn) return s; // empty = all highlighted
    if (selectedType) {
      s.add(selectedType);
      for (const conn of BOARD_CONNECTIONS) {
        if (conn.fromType === selectedType) s.add(conn.toType);
        if (conn.toType === selectedType) s.add(conn.fromType);
      }
    }
    if (selectedConn) {
      const [from, to] = selectedConn.split('|');
      s.add(from); s.add(to);
    }
    return s;
  }, [selectedType, selectedConn]);

  const handleGroupClick = useCallback((type: string) => {
    setSelectedType(prev => prev === type ? null : type);
    setSelectedConn(null);
  }, []);

  const onCardDragStart = useCallback((type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    cardDragRef.current = {
      mode: 'group', key: type,
      startX: e.clientX, startY: e.clientY,
      origX: groupPositions[type]?.x ?? 0,
      origY: groupPositions[type]?.y ?? 0,
    };
  }, [groupPositions]);

  const onExpandedDragStart = useCallback((uid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const p = expandedPositions[uid];
    cardDragRef.current = {
      mode: 'expanded', key: uid,
      startX: e.clientX, startY: e.clientY,
      origX: p?.x ?? 0,
      origY: p?.y ?? 0,
    };
  }, [expandedPositions]);

  // Pan — also block timeline panel
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-board]') || (e.target as HTMLElement).closest('[data-agent]') || (e.target as HTMLElement).closest('[data-timeline]')) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, ox: cvs.offset.x, oy: cvs.offset.y };
    e.preventDefault();
  }, [cvs.offset]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (cardDragRef.current) {
      const { mode, key, startX, startY, origX, origY } = cardDragRef.current;
      const dx = (e.clientX - startX) / cvs.scale;
      const dy = (e.clientY - startY) / cvs.scale;
      if (mode === 'group') {
        setGroupPositions(prev => ({ ...prev, [key]: { x: origX + dx, y: origY + dy } }));
      } else {
        setExpandedPositions(prev => ({ ...prev, [key]: { x: origX + dx, y: origY + dy } }));
      }
      return;
    }
    if (!dragging.current) return;
    setCvs(c => ({ ...c, offset: { x: dragStart.current.ox + e.clientX - dragStart.current.x, y: dragStart.current.oy + e.clientY - dragStart.current.y } }));
  }, [cvs.scale]);

  const onMouseUp = useCallback(() => { dragging.current = false; cardDragRef.current = null; }, []);

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    setCvs(c => {
      const ns = Math.max(0.15, Math.min(2.5, c.scale * delta));
      return { ...c, scale: ns, offset: { x: mx - (mx - c.offset.x) * (ns / c.scale), y: my - (my - c.offset.y) * (ns / c.scale) } };
    });
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); el.removeEventListener('wheel', onWheel); };
  }, [onMouseMove, onMouseUp, onWheel]);

  const typeGroups = useMemo(() => [...new Set(HW_BOARDS.map(b => b.type))].map(t => ({ type: t, count: HW_BOARDS.filter(b => b.type === t).length })), []);

  // Visible types based on filterType
  const visibleTypes = useMemo(() => {
    if (cvs.filterType) return new Set([cvs.filterType]);
    return new Set(Object.keys(GROUP_POSITIONS));
  }, [cvs.filterType]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#060a0f', userSelect: 'none' }}>
      {/* Toolbar */}
      <div style={{ padding: '6px 14px', borderBottom: '1px solid #0f1a25', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: '#080c14', flexShrink: 0, zIndex: 20 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>硬件拓扑</span>
        <span style={{ fontSize: 10, color: '#1e2d3d' }}>{HW_BOARDS.length} 个板卡</span>
        {typeGroups.map(({ type, count }) => (
          <button key={type} onClick={() => setCvs(c => ({ ...c, filterType: c.filterType === type ? null : type }))}
            style={{ padding: '2px 8px', fontSize: 10, borderRadius: 10, cursor: 'pointer', background: cvs.filterType === type ? (TYPE_COLOR[type] ?? '#666') + '33' : 'transparent', border: `1px solid ${cvs.filterType === type ? (TYPE_COLOR[type] ?? '#666') : '#1e2d3d'}`, color: cvs.filterType === type ? (TYPE_COLOR[type] ?? '#aaa') : '#475569' }}>
            {type} {count}
          </button>
        ))}
        <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid #1e2d3d' }}>
          <button
            onClick={() => setViewMode('grouped')}
            style={{ padding: '3px 10px', fontSize: 10, cursor: 'pointer', background: viewMode === 'grouped' ? '#1e3a5f' : 'transparent', border: 'none', color: viewMode === 'grouped' ? '#60a5fa' : '#475569' }}
          >分组视图</button>
          <button
            onClick={() => setViewMode('expanded')}
            style={{ padding: '3px 10px', fontSize: 10, cursor: 'pointer', background: viewMode === 'expanded' ? '#1e3a5f' : 'transparent', border: '1px solid transparent', borderLeft: '1px solid #1e2d3d', color: viewMode === 'expanded' ? '#60a5fa' : '#475569' }}
          >展开视图</button>
        </div>
        <div style={{ flex: 1 }} />
        {[
          { key: 'showI2C', label: 'I²C连线', on: cvs.showI2C },
          { key: 'showPCIe', label: 'PCIe连线', on: cvs.showPCIe },
          { key: 'showSoft', label: '软件叠加', on: cvs.showSoft },
        ].map(({ key, label, on }) => (
          <button key={key} onClick={() => setCvs(c => ({ ...c, [key]: !on }))}
            style={{ padding: '3px 10px', fontSize: 10, borderRadius: 4, cursor: 'pointer', background: on ? '#1e3a5f' : 'transparent', border: `1px solid ${on ? '#3b82f6' : '#1e2d3d'}`, color: on ? '#60a5fa' : '#374151' }}>
            {on ? '●' : '○'} {label}
          </button>
        ))}
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={() => setCvs(c => ({ ...c, scale: Math.min(2.5, c.scale * 1.2) }))} style={{ padding: '2px 8px', fontSize: 12, background: 'transparent', border: '1px solid #1e2d3d', borderRadius: '4px 0 0 4px', color: '#475569', cursor: 'pointer' }}>+</button>
          <span style={{ padding: '2px 8px', fontSize: 10, border: '1px solid #1e2d3d', borderLeft: 'none', borderRight: 'none', color: '#374151' }}>{Math.round(cvs.scale * 100)}%</span>
          <button onClick={() => setCvs(c => ({ ...c, scale: Math.max(0.15, c.scale * 0.8) }))} style={{ padding: '2px 8px', fontSize: 12, background: 'transparent', border: '1px solid #1e2d3d', borderRadius: '0 4px 4px 0', color: '#475569', cursor: 'pointer' }}>−</button>
        </div>
        {viewMode === 'grouped' && (
          <button onClick={() => setGroupPositions({ ...GROUP_POSITIONS })} style={{ padding: '3px 10px', fontSize: 10, background: 'transparent', border: '1px solid #1e2d3d', borderRadius: 4, color: '#374151', cursor: 'pointer' }}>重置布局</button>
        )}
        {viewMode === 'expanded' && (
          <button onClick={() => {
            const m = computeBoardLayout(HW_BOARDS);
            const obj: Record<string, { x: number; y: number }> = {};
            for (const [uid, pos] of m) obj[uid] = pos;
            setExpandedPositions(obj);
          }} style={{ padding: '3px 10px', fontSize: 10, background: 'transparent', border: '1px solid #1e2d3d', borderRadius: 4, color: '#374151', cursor: 'pointer' }}>重置布局</button>
        )}
        <button onClick={() => setCvs(DEFAULT_CVS)} style={{ padding: '3px 10px', fontSize: 10, background: 'transparent', border: '1px solid #1e2d3d', borderRadius: 4, color: '#374151', cursor: 'pointer' }}>重置视图</button>
      </div>

      {/* Legend */}
      <div style={{ padding: '4px 14px', borderBottom: '1px solid #0a1020', display: 'flex', gap: 14, flexWrap: 'wrap', flexShrink: 0, background: '#060a0f' }}>
        {[
          { color: '#3b82f6', label: 'Hisport BCU→IEU (PCIe数据)', dash: false },
          { color: '#60a5fa', label: 'PCIe Hisport↔OCP (BCU→EXU)', dash: false },
          { color: '#f97316', label: 'PCIe CEM↔UBC (IEU→SEU)', dash: false },
          { color: '#ec4899', label: 'PCIe CEM (IEU/EXU→NIC)', dash: false },
          { color: '#0ea5e9', label: 'I²C 管理总线 (PSR→板卡直连, 虚线)', dash: true },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#374151' }}>
            <svg width={20} height={6}><line x1="0" y1="3" x2="20" y2="3" stroke={l.color} strokeWidth={l.dash ? 1 : 1.5} strokeDasharray={l.dash ? '3,2' : undefined} /></svg>
            {l.label}
          </div>
        ))}
        {/* Hisport dual-signal legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#374151' }}>
          <svg width={20} height={14}>
            <line x1="0" y1="4" x2="20" y2="4" stroke="#3b82f6" strokeWidth={1.5} />
            <line x1="0" y1="10" x2="20" y2="10" stroke="#0ea5e9" strokeWidth={1} strokeDasharray="3,2" />
            <line x1="0" y1="1" x2="0" y2="13" stroke="#0ea5e9" strokeWidth={1} opacity={0.6} />
            <line x1="20" y1="1" x2="20" y2="13" stroke="#0ea5e9" strokeWidth={1} opacity={0.6} />
          </svg>
          Hisport 双信号轨 (PCIe+I²C侧带)
        </div>
        {/* TopoNode Connector legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#374151' }}>
          <svg width={20} height={10}>
            <rect x={1} y={1} width={18} height={8} rx={4} fill="rgba(22,163,74,0.12)" stroke="#16a34a" strokeWidth={1} strokeDasharray="2,1.5" />
            <text x={9} y={7.5} textAnchor="middle" fontSize={6} fill="#4ade80">⚿</text>
          </svg>
          ⚿ TopoNode 在位检测连接器
        </div>
        {/* BusinessConnector bridge legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#374151' }}>
          <svg width={20} height={10}>
            <rect x={1} y={1} width={18} height={8} rx={2} fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth={1} strokeDasharray="2,1.5" />
            <text x={9} y={7.5} textAnchor="middle" fontSize={7} fill="#4ade80">⇌</text>
          </svg>
          ⇌ BusinessConnector ⇌ I²C 桥接
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 9, color: '#1e2d3d' }}>拖拽平移 · 滚轮缩放 · 点击分组查看详情 · 底部 ✦ AI 指令栏</div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onClick={() => { setSelectedType(null); setSelectedConn(null); }}
        style={{ flex: 1, overflow: 'hidden', position: 'relative', cursor: 'grab' }}
      >
        {/* Transformed canvas */}
        <div style={{ position: 'absolute', top: 0, left: 0, transform: `translate(${cvs.offset.x}px, ${cvs.offset.y}px) scale(${cvs.scale})`, transformOrigin: '0 0' }}>
          {viewMode === 'grouped' ? (
            <>
              {/* Connection lines — z-index 20, above group cards */}
              <ConnectionLines
                showI2C={cvs.showI2C}
                showPCIe={cvs.showPCIe}
                selectedType={selectedType}
                selectedConn={selectedConn}
                onConnClick={key => { setSelectedConn(prev => prev === key ? null : key); setSelectedType(null); }}
                onConnHover={() => {}}
                groupPositions={groupPositions}
              />
              {/* Group type labels */}
              {Array.from(visibleTypes).map(type => {
                const p = groupPositions[type];
                if (!p) return null;
                return (
                  <div key={type} style={{ position: 'absolute', left: p.x, top: p.y - 20, fontSize: 10, color: TYPE_COLOR[type] ?? '#666', fontWeight: 700, letterSpacing: 2, opacity: 0.5 }}>
                    {type}
                  </div>
                );
              })}
              {/* Group cards */}
              {Array.from(visibleTypes).map(type => {
                const boards = groupsByType.get(type);
                if (!boards || !boards.length) return null;
                const isHighlighted = highlightedTypes.size === 0 || highlightedTypes.has(type);
                const isDimmed = highlightedTypes.size > 0 && !highlightedTypes.has(type);
                return (
                  <GroupCard
                    key={type}
                    type={type}
                    boards={boards}
                    cvs={cvs}
                    highlighted={isHighlighted && highlightedTypes.size > 0}
                    dimmed={isDimmed}
                    onGroupClick={handleGroupClick}
                    pos={groupPositions[type] ?? { x: 0, y: 0 }}
                    onDragStart={onCardDragStart}
                  />
                );
              })}
            </>
          ) : (
            <>
              {/* Expanded view: per-board connection lines */}
              <ExpandedConnectionLines
                boards={HW_BOARDS.filter(b => !cvs.filterType || b.type === cvs.filterType)}
                positions={expandedPosMap}
                showI2C={cvs.showI2C}
                showPCIe={cvs.showPCIe}
                highlightUids={cvs.highlightUids}
              />
              {/* Individual board nodes */}
              {HW_BOARDS.filter(b => !cvs.filterType || b.type === cvs.filterType).map(board => {
                const pos = expandedPosMap.get(board.uid);
                if (!pos) return null;
                return (
                  <div key={board.uid} data-board="true">
                    <BoardNode
                      board={board}
                      x={pos.x} y={pos.y}
                      cvs={cvs}
                      onSelect={b => setCvs(c => ({ ...c, selectedBoardUid: c.selectedBoardUid === b.uid ? null : b.uid }))}
                      onDragStart={onExpandedDragStart}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* AI Agent Panel (fixed over canvas, not inside transform) */}
        <div data-agent="true">
          <AgentPanel
            cvs={cvs} setCvs={setCvs} positions={positions}
            viewW={viewSize.w} viewH={viewSize.h}
            onAddHistory={entry => setHistoryEntries(prev => [...prev, entry])}
          />
        </div>

        {/* Timeline toggle tab */}
        <div
          data-agent="true"
          onClick={() => setShowTimeline(v => !v)}
          title={showTimeline ? '关闭时间轴' : '对话时间轴'}
          style={{
            position: 'absolute',
            right: showTimeline ? 256 : 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 22,
            padding: '18px 0',
            background: showTimeline ? 'rgba(37,99,235,0.18)' : 'rgba(9,14,24,0.82)',
            border: `1px solid ${showTimeline ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRight: showTimeline ? 'none' : undefined,
            borderRadius: showTimeline ? '8px 0 0 8px' : '8px 0 0 8px',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            zIndex: 161,
            backdropFilter: 'blur(12px)',
            transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '-3px 0 16px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => { if (!showTimeline) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.3)'; }}
          onMouseLeave={e => { if (!showTimeline) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
          {/* Vertical text */}
          <span style={{ fontSize: 8, color: showTimeline ? '#60a5fa' : '#2d3f52', writingMode: 'vertical-rl', letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase', userSelect: 'none' }}>
            {showTimeline ? '收起' : '时间轴'}
          </span>
          {historyEntries.length > 0 && (
            <span style={{
              fontSize: 9, width: 16, height: 16, borderRadius: '50%',
              background: showTimeline ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, flexShrink: 0,
            }}>{historyEntries.length}</span>
          )}
        </div>

        {/* Timeline Panel */}
        {showTimeline && (
          <div data-timeline="true">
            <TimelinePanel
              entries={historyEntries}
              cvs={cvs}
              onRevert={setCvs}
              onClose={() => setShowTimeline(false)}
            />
          </div>
        )}
      </div>

      {/* Board detail panel */}
      {selectedBoard && (
        <>
          <div onClick={() => setCvs(c => ({ ...c, selectedBoardUid: null }))} style={{ position: 'fixed', inset: 0, zIndex: 499 }} />
          <DetailPanel board={selectedBoard} cvs={cvs} onClose={() => setCvs(c => ({ ...c, selectedBoardUid: null }))} />
        </>
      )}
    </div>
  );
}
