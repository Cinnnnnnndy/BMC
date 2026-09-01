import React, {
  useState, useRef, useEffect, useCallback,
  useImperativeHandle, forwardRef,
} from 'react';

/* ═══════════════════════════════════════════════════════════════
   Bottom dock: 终端 · ubmc-agent / 问题 / 输出
   Agent 是主角：终端里用自然语言驱动 Agent（巡检 / 生成配置 / 校验 /
   SMC / 表达式 / 拓扑 / 数字孪生），步骤行展示真实 MCP 工具名，
   完成后联动打开对应功能视图，并把结果同步到「问题」「输出」。
   ═══════════════════════════════════════════════════════════════ */

export interface TerminalDockHandle {
  run: (text: string) => void;
  focusInput: () => void;
}

interface TermLine {
  kind: 'user' | 'agent' | 'step' | 'ok' | 'warn' | 'err' | 'dim' | 'plain';
  text: string;
  tool?: string;        // step 行的 MCP 工具名
  status?: 'ok' | 'warn' | 'run';
}

interface ProblemItem { level: 'ok' | 'warn' | 'err'; msg: string; src: string; }
interface OutputItem { time: string; text: string; level: 'info' | 'ok' | 'warn'; }

interface FlowStep { tool: string; note: string; status?: 'ok' | 'warn'; }
interface AgentFlow {
  title: string;
  steps: FlowStep[];
  done: string;
  view?: string;
  problems?: ProblemItem[];
  output: string;
}

// ── Agent 流程（对应 bmcstudio MCP 工具编目） ─────────────────────
const FLOWS: Record<string, AgentFlow> = {
  inspect: {
    title: '批量巡检',
    steps: [
      { tool: 'bmc_remote_list_connections', note: '5 台连接 · 实验室A / 网络测试组' },
      { tool: 'bmc_remote_check_health', note: 'SSH 22 探测 · 3 可达 1 不可达', status: 'warn' },
      { tool: 'bmc_remote_macro_run', note: '「巡检-基础状态」targetScope=all-reachable · 3 台 × 3 cmds' },
    ],
    done: '汇总：ok 3 / partial 0 / unreachable 1（BMC-A03 未纳入）。结果已同步到「BMC 环境管理」。',
    view: 'bmcEnv',
    problems: [{ level: 'warn', msg: 'BMC-A03 (192.168.1.102) SSH 22 端口不可达', src: 'bmc_remote_check_health' }],
    output: 'macro 巡检-基础状态 finished: ok 3 / unreachable 1',
  },
  health: {
    title: '健康检查',
    steps: [
      { tool: 'bmc_remote_list_connections', note: 'includeHealth=true' },
      { tool: 'bmc_remote_check_health', note: '全量探测' },
    ],
    done: 'BMC-A01 / A02 在线，BMC-A03 离线；NET-BMC-01/02 在线。详见「BMC 环境管理」。',
    view: 'bmcEnv',
    problems: [{ level: 'warn', msg: 'BMC-A03 (192.168.1.102) 离线', src: 'bmc_remote_check_health' }],
    output: 'health check: 4/5 reachable',
  },
  event: {
    title: '生成过温事件',
    steps: [
      { tool: 'localview_search_paths', note: 'Sensor_CPU0_Temp 定义' },
      { tool: 'csr_validate', note: 'Event_CPU0_OverTemp · schema+微语法+规则 3 层校验' },
    ],
    done: '已生成 Event_CPU0_OverTemp（阈值 85，GE，critical），csr_validate 0 errors。请在「事件配置」确认。',
    view: 'event',
    problems: [{ level: 'ok', msg: 'Event_CPU0_OverTemp 校验通过（0 errors）', src: 'csr_validate' }],
    output: 'generated Event_CPU0_OverTemp, csr_validate passed',
  },
  sensor: {
    title: '生成温度 Scanner',
    steps: [
      { tool: 'csr_list_chip_types', note: 'TMP112 · PCA9545 CH1' },
      { tool: 'binary_mask_validate', note: 'Offset 0x1A 在 U8 范围内' },
      { tool: 'csr_validate', note: 'Scanner_TMP112_CH1 + ThresholdSensor 骨架' },
    ],
    done: '已生成 Scanner_TMP112_CH1（Offset 0x1A / Size 2 / Period 5000ms），阈值字段待填。',
    view: 'sensor',
    problems: [{ level: 'ok', msg: 'Scanner_TMP112_CH1 校验通过', src: 'csr_validate' }],
    output: 'generated Scanner_TMP112_CH1',
  },
  validate: {
    title: 'CSR 校验',
    steps: [
      { tool: 'csr_parse', note: '词法/语法解析' },
      { tool: 'csr_validate', note: 'schema + 微语法 + 规则三层管线' },
    ],
    done: '校验完成：0 errors / 0 warnings。诊断已同步「问题」面板。',
    problems: [
      { level: 'ok', msg: 'schema 校验通过', src: 'csr_validate' },
      { level: 'ok', msg: '微语法表达式通过', src: 'csr_validate' },
      { level: 'ok', msg: '规则集校验通过', src: 'csr_validate' },
    ],
    output: 'csr_validate: 0 errors',
  },
  smc: {
    title: 'SMC 偏移量编码',
    steps: [
      { tool: 'binary_mask_encode', note: 'func=0x0B cmd=0x120 rw=1 param=0x33' },
    ],
    done: '位域拆装完成：整字 0x2C048133。已在「SMC 偏移量」预填，可 hex/dec 互转复制。',
    view: 'smcExt',
    output: 'smc encode: 0x2C048133',
  },
  expr: {
    title: '管道表达式生成',
    steps: [
      { tool: 'csr_analyze_expr', note: '2 级管道 · 无 dynamic/sync 引用' },
    ],
    done: '表达式 $1 | add $2 | toHex 8，测试 $1=100 $2=155 → 0x000000FF。已填入「管道表达式」。',
    view: 'pipeExpr',
    output: 'expr generated: $1 | add $2 | toHex 8',
  },
  topo: {
    title: '拓扑改造',
    steps: [
      { tool: 'csr_list_bus_types', note: 'I2C 合法类型' },
      { tool: 'csr_list_chip_types', note: 'PCA9545' },
      { tool: 'csr_validate', note: '新增 I2C_3 + 2× PCA9545' },
    ],
    done: '已在 ManagementTopology 新增 I2C_3 总线并挂载 PCA9545_1/2，画布可拖拽微调。',
    view: 'topology',
    problems: [{ level: 'ok', msg: 'I2C_3 / PCA9545_1 / PCA9545_2 校验通过', src: 'csr_validate' }],
    output: 'topology: added I2C_3 with 2x PCA9545',
  },
  sim: {
    title: '数字孪生 · 故障注入',
    steps: [
      { tool: 'sim_focus', note: 'FAN3' },
      { tool: 'sim_inject_fault', note: 'rpm 8000 → 1200' },
    ],
    done: '已聚焦 FAN3 并注入转速骤降，仪表转红。后续经 bmc_remote_ssh_exec 拉真机数据可做孪生监控。',
    view: 'threeD',
    output: 'sim: injected rpm fault on FAN3',
  },
  path: {
    title: '运行时路径反查',
    steps: [
      { tool: 'localview_search_paths_fuzzy', note: '/redfish/v1/Systems/1/Sensors · top1 score 12' },
      { tool: 'localview_get_path_node', note: '取完整定义 data' },
    ],
    done: '命中 /redfish/v1/Systems/{id}/Sensors（实例段已过滤），定义已在「资源管理器」定位。',
    view: 'explorer',
    output: 'path lookup resolved: Systems/{id}/Sensors',
  },
  kb: {
    title: '社区知识检索',
    steps: [
      { tool: 'openubmc_kb_query', note: 'mode=mix · LightRAG' },
    ],
    done: '已检索 openUBMC 社区知识库，综合 3 篇文档给出回答（示例）。',
    output: 'kb_query: 3 docs retrieved',
  },
};

// ── 自然语言意图路由 ──────────────────────────────────────────────
function routeIntent(text: string): string | null {
  const t = text.toLowerCase();
  if (/巡检|在线|可达|健康|宏|macro|批量/.test(t)) return 'inspect';
  if (/事件|过温|告警|event/.test(t)) return 'event';
  if (/传感器|scanner|阈值|sensor/.test(t)) return 'sensor';
  if (/校验|validate|检查/.test(t)) return 'validate';
  if (/smc|偏移|寄存器/.test(t)) return 'smc';
  if (/表达式|管道|tohex|expr/.test(t)) return 'expr';
  if (/拓扑|总线|i2c|挂载|pca/.test(t)) return 'topo';
  if (/3d|风扇|故障|孪生|仿真/.test(t)) return 'sim';
  if (/路径|redfish|反查/.test(t)) return 'path';
  if (/知识|文档|社区|为什么/.test(t)) return 'kb';
  return null;
}

const MCP_GROUPS: [string, string][] = [
  ['bmcstudio_bmc_remote (16)', 'list_connections · check_health · ssh_exec · sftp_upload_file/dir · 分组 CRUD ×4 · 连接 CRUD ×3 · set_auto_check · set_notify · macro_list · macro_run'],
  ['FileTreeView (10)', 'localview_get_data_source/all_paths/path_node · search_paths(_fuzzy) · recipe_list/current/apply · template_list/generate'],
  ['bmcstudio_dsl (11)', 'csr_parse · csr_analyze_expr · binary_mask_encode/validate · MDB 查询 ×4 · csr_get_config · csr_validate · csr_run_rule_tests'],
  ['bmcstudio_welcome (2)', 'get_role · get_setup_state'],
  ['openubmc-rag (4)', 'kb_query · kb_status · kb_list · kb_upload'],
];

const HELP_TEXT = [
  'ubmc-agent 命令：',
  '  ubmc inspect            批量巡检（health + macro_run）',
  '  ubmc event / sensor     生成事件 / 传感器配置（csr_validate 兜底）',
  '  ubmc validate           对当前 CSR 跑三层校验',
  '  ubmc smc / expr         SMC 偏移量编码 / 管道表达式',
  '  ubmc topo / sim         拓扑改造 / 3D 故障注入',
  '  mcp tools               列出 43 个 MCP 工具',
  '  ls · clear · help',
  '也可以直接输入自然语言，Agent 会自动判断意图并打开对应视图。',
].join('\n');

let outputSeq = 0;

export const TerminalDock = forwardRef<TerminalDockHandle, {
  open: boolean;
  onClose: () => void;
  onOpenView: (viewId: string) => void;
}>(function TerminalDock({ open, onClose, onOpenView }, ref) {
  const [height, setHeight] = useState(260);
  const [tab, setTab] = useState<'terminal' | 'problems' | 'output'>('terminal');
  const [lines, setLines] = useState<TermLine[]>([
    { kind: 'dim', text: 'ubmc-agent 已就绪。试试：「对所有在线机器跑一遍巡检」，或 help。' },
  ]);
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const historyRef = useRef<string[]>([]);
  const histIdxRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const append = useCallback((l: TermLine | TermLine[]) => {
    setLines(prev => [...prev, ...(Array.isArray(l) ? l : [l])]);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, tab, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const logOutput = useCallback((text: string, level: OutputItem['level'] = 'info') => {
    const d = new Date();
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    outputSeq += 1;
    setOutputs(prev => [...prev, { time, text, level }]);
  }, []);

  const runFlow = useCallback((key: string) => {
    const flow = FLOWS[key];
    if (!flow) return;
    setBusy(true);
    append({ kind: 'agent', text: `ubmc-agent 开始「${flow.title}」…` });
    let i = 0;
    const next = () => {
      if (i < flow.steps.length) {
        const s = flow.steps[i++];
        append({ kind: 'step', text: s.note, tool: s.tool, status: s.status ?? 'ok' });
        setTimeout(next, 480 + Math.random() * 220);
        return;
      }
      append({ kind: 'agent', text: flow.done });
      if (flow.problems?.length) setProblems(prev => [...prev, ...flow.problems!]);
      logOutput(`[agent] ${flow.output}`, flow.problems?.some(p => p.level === 'warn') ? 'warn' : 'ok');
      if (flow.view) onOpenView(flow.view);
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    };
    setTimeout(next, 420);
  }, [append, logOutput, onOpenView]);

  const exec = useCallback((raw: string) => {
    const cmd = raw.trim();
    if (!cmd || busy) return;
    append({ kind: 'user', text: cmd });
    const lower = cmd.toLowerCase();
    const parts = lower.split(/\s+/);

    if (lower === 'help' || lower === '?') { append({ kind: 'dim', text: HELP_TEXT }); return; }
    if (lower === 'clear' || lower === 'cls') { setLines([]); return; }
    if (parts[0] === 'ls') {
      append({ kind: 'plain', text: '欢迎页  BMC环境管理  CSR拓扑  事件配置  传感器配置  SMC偏移量  管道表达式  能效调速  3D仿真  资源管理器' });
      return;
    }
    if (lower === 'mcp tools' || lower === 'mcp') {
      append(MCP_GROUPS.map(([g, tools]) => ({ kind: 'dim' as const, text: `${g}\n  ${tools}` })));
      return;
    }
    if (parts[0] === 'ubmc') {
      const sub = parts[1] || '';
      const map: Record<string, string> = {
        inspect: 'inspect', health: 'health', event: 'event', sensor: 'sensor',
        validate: 'validate', smc: 'smc', expr: 'expr', topo: 'topo',
        sim: 'sim', path: 'path', kb: 'kb',
      };
      if (map[sub]) { runFlow(map[sub]); return; }
      append({ kind: 'dim', text: HELP_TEXT });
      return;
    }

    const intent = routeIntent(cmd);
    if (intent) { runFlow(intent); return; }
    append({ kind: 'dim', text: '未识别的意图。可以描述要做的事（巡检 / 生成事件 / 校验 CSR / 算 SMC 偏移…），或输入 help。' });
  }, [busy, append, runFlow]);

  useImperativeHandle(ref, () => ({
    run: (text: string) => exec(text),
    focusInput: () => inputRef.current?.focus(),
  }), [exec]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = input.trim();
      if (!v || busy) return;
      setInput('');
      historyRef.current.push(v);
      histIdxRef.current = historyRef.current.length;
      exec(v);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdxRef.current > 0) {
        histIdxRef.current -= 1;
        setInput(historyRef.current[histIdxRef.current] ?? '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdxRef.current < historyRef.current.length - 1) {
        histIdxRef.current += 1;
        setInput(historyRef.current[histIdxRef.current] ?? '');
      } else {
        histIdxRef.current = historyRef.current.length;
        setInput('');
      }
    }
  };

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = height;
    const onMove = (ev: MouseEvent) => {
      setHeight(Math.max(120, Math.min(window.innerHeight - 220, startH + (startY - ev.clientY))));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (!open) return null;

  const problemCount = problems.filter(p => p.level !== 'ok').length;

  return (
    <div className="ide-bottom-dock" style={{ height }}>
      <div className="ide-dock-resize" onMouseDown={startResize} />
      <div className="ide-dock-tabbar">
        <button
          className={`ide-dock-tab${tab === 'terminal' ? ' is-active' : ''}`}
          onClick={() => { setTab('terminal'); setTimeout(() => inputRef.current?.focus(), 30); }}
        >
          <span className="ide-dock-dot" /> 终端 · ubmc-agent
        </button>
        <button
          className={`ide-dock-tab${tab === 'problems' ? ' is-active' : ''}`}
          onClick={() => setTab('problems')}
        >
          问题 <span className={`ide-dock-count${problemCount ? ' has-warn' : ''}`}>{problems.length}</span>
        </button>
        <button
          className={`ide-dock-tab${tab === 'output' ? ' is-active' : ''}`}
          onClick={() => setTab('output')}
        >输出</button>
        <div className="ide-dock-actions">
          <button className="ide-dock-act" title="帮助" onClick={() => { setTab('terminal'); exec('help'); }}>?</button>
          <button className="ide-dock-act" title="清空终端" onClick={() => setLines([])}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
          </button>
          <button className="ide-dock-act" title="关闭面板" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <div className="ide-dock-body">
        {tab === 'terminal' && (
          <div className="ide-term-scroll" ref={scrollRef} onClick={() => { if (!window.getSelection()?.toString()) inputRef.current?.focus(); }}>
            <div className="ide-term-banner">
              <span className="ide-term-brand">ubmc-agent</span> · openUBMC Studio — 输入自然语言驱动 Agent，或 <code>help</code> 查看命令
            </div>
            {lines.map((l, i) => (
              <div key={i} className={`ide-term-line tl-${l.kind}`}>
                {l.kind === 'user' && <span className="ide-term-prompt">ubmc <span className="tp-arrow">➜</span> </span>}
                {l.kind === 'agent' && <span className="tl-marker">◆ </span>}
                {l.kind === 'step' && (
                  <>
                    <span className="tl-bullet">● </span>
                    <span className="tl-tool">{l.tool}</span>
                    {'  '}
                    <span className="tl-note">{l.text}</span>
                    {'  '}
                    <span className={l.status === 'warn' ? 'tl-warnmark' : 'tl-check'}>{l.status === 'warn' ? '!' : '✓'}</span>
                  </>
                )}
                {l.kind !== 'step' && l.text}
              </div>
            ))}
            <div className="ide-term-input-line">
              <span className="ide-term-prompt">ubmc <span className="tp-arrow">➜</span></span>
              <input
                ref={inputRef}
                className="ide-term-input"
                value={input}
                disabled={busy}
                placeholder={busy ? 'Agent 工作中…' : 'e.g. 对所有在线机器跑一遍巡检'}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                spellCheck={false}
              />
            </div>
          </div>
        )}
        {tab === 'problems' && (
          <div className="ide-dock-problems">
            {problems.length === 0
              ? <div className="ide-dock-empty">暂无问题 — Agent 执行校验后结果会显示在这里。</div>
              : problems.map((p, i) => (
                <div key={i} className={`ide-problem-item pi-${p.level}`}>
                  <span className="pi-icon">{p.level === 'ok' ? '✓' : p.level === 'warn' ? '!' : '×'}</span>
                  <span className="pi-msg">{p.msg}</span>
                  <span className="pi-src">{p.src}</span>
                </div>
              ))}
          </div>
        )}
        {tab === 'output' && (
          <div className="ide-dock-output">
            {outputs.length === 0
              ? <div className="ide-dock-empty">Agent 执行日志输出。</div>
              : outputs.map((o, i) => (
                <div key={i} className="ide-output-line">
                  <span className="ol-time">{o.time}</span>
                  <span className={`ol-${o.level}`}>{o.text}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
});
