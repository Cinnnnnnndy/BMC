import React, { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   Agent 终端（底栏 dock）— 模拟 openUBMC agent CLI
   工具名与 ai-assist.html 示例场景（MCP 工具驱动工作流）保持一致。
   样式全部消费 ide-frame.css 的 pto-ide-frame__terminal* pattern 类。
   ═══════════════════════════════════════════════════════════════════════ */

export interface TermRunRequest { id: number; cmd: string }

interface AgentTerminalProps {
  onOpenScenario: (viewId: string) => void;
  onClose: () => void;
  runRequest: TermRunRequest | null;
}

type LineKind = 'cmd' | 'plan' | 'tool' | 'out' | 'ok' | 'err' | 'open' | 'info';
interface TermLine { kind: LineKind; text: string }

const PROMPT = 'ubmc ›';

/* ── agent 任务词表（关键词 → 工具调用轨迹 + 关联视图） ────────────── */
interface AgentTask {
  keys: string[];
  title: string;
  tools: [name: string, ms: number][];
  out: string[];
  ok: string;
  view?: string;
  viewLabel?: string;
  /** 任务完成后的联动动作（如向安装引导 iframe 回写检测状态） */
  after?: 'wizard-env-ok';
}

const AGENT_TASKS: AgentTask[] = [
  // 注意：数组顺序即匹配优先级（find 首个 keys 命中者）。
  // VSIX 任务必须排在「诊断安装」之前——其触发词「扩展安装包」含「安装」。
  {
    keys: ['vsix', '安装包', '扩展安装'],
    title: 'BMC Studio CodeX 扩展构建安装（VSIX）',
    tools: [['setup_clone_codex', 1240], ['setup_build_vsix', 2180], ['setup_install_vsix', 860]],
    out: [
      'clone bmcstudio_codex … done（分支 master · 深度 1）',
      'npm install (847 packages) → npm run plugin-package',
      'openubmcstudio-codex-0.0.34.vsix 已生成并安装（code --install-extension exit 0）',
    ],
    ok: '扩展安装完成，code --list-extensions 已验证 openubmcstudio-codex',
  },
  {
    keys: ['资源', 'manifest', '下载', 'sdk'],
    title: '开发资源下载与工程初始化',
    tools: [['setup_clone_manifest', 1300], ['setup_install_sdk', 1400], ['setup_run_init', 1500]],
    out: [
      'manifest openubmc-24.03 克隆完成（172 repos synced）',
      'bmc_sdk 下载完成，校验和一致',
      'init.py --profile openubmc-24.03 执行完成 (exit 0 · 4.2s)',
    ],
    ok: '开发资源就绪，工程已初始化，可开始机型配置',
  },
  {
    keys: ['校验', 'validate'],
    title: 'CSR 全量校验',
    tools: [['csr_validate', 143]],
    out: [],
    ok: '校验通过：0 errors / 2 warnings（存在未引用对象）',
    view: 'topology', viewLabel: '拓扑视图',
  },
  {
    // WSL 引导：必须排在「诊断安装」之前——派发词「安装 wsl」含「安装」
    keys: ['wsl', '子系统'],
    title: 'WSL 环境安装引导',
    tools: [['setup_check_platform', 180]],
    out: [
      'wsl --install -d Ubuntu-22.04        # 安装 WSL2 内核 + Ubuntu-22.04，完成后重启',
      'sudo apt update && sudo apt upgrade -y   # 重启并设置用户名/密码后更新软件源',
      'code --install-extension ms-vscode-remote.remote-wsl   # 装 Remote-WSL，>< → Connect to WSL',
    ],
    ok: 'WSL 安装命令已在终端列出，按序执行完成后回向导点「WSL 安装完成，继续」',
  },
  {
    // AI 向导专用：环境准备配置检测——不带 view，不打开安装引导视图，
    // 由 AI 向导自身流转到「选择机型」（避免 setup 任务的 installGuide 分屏抢焦点）
    keys: ['配置检测'],
    title: '环境准备配置检测',
    tools: [['setup_verify_all', 143], ['setup_check_ssh', 120], ['setup_check_toolchain', 96]],
    out: [
      'GitCode SSH · manifest 代码仓 · bmc_sdk · Conan remote — 全部通过',
    ],
    ok: '环境准备 6/6 项通过',
  },
  {
    keys: ['安装', '诊断', '部署', 'setup'],
    title: '开发环境诊断（安装引导）',
    tools: [['setup_verify_all', 143], ['setup_configure_conan_remote', 310], ['setup_run_init', 1240]],
    out: [
      '诊断：✓ WSL2·Ubuntu 22.04  ✓ GitCode SSH  ✓ manifest  ✓ bmc_sdk  ✗ conan remote  ✗ init 未执行',
      '修复：conan remote 已配置（openubmc 源）→ init.py 执行完成 (exit 0)',
    ],
    ok: '环境准备 6/6 项通过，检测结果已回写安装引导「配置检测」',
    view: 'installGuide', viewLabel: '安装引导',
    after: 'wizard-env-ok',
  },
  {
    keys: ['巡检', '在线', '健康', 'inspect'],
    title: 'BMC 批量巡检（命令宏）',
    tools: [['bmc_remote_list_connections', 24], ['bmc_remote_check_health', 118], ['bmc_remote_macro_run', 351]],
    out: [
      'node-1  hostname → bmc-node1   exit 0   118ms',
      'node-2  hostname → bmc-node2   exit 0   102ms',
      'node-3  hostname → bmc-node3   exit 0   131ms',
    ],
    ok: '汇总：在线 3 / 离线 1（node-4 · 22 端口不可达），结果已同步面板',
    view: 'bmcEnv', viewLabel: 'BMC 环境管理',
  },
  {
    keys: ['过温', '事件', '告警'],
    title: 'CPU0 过温事件配置',
    tools: [['localview_search_paths', 41], ['csr_validate', 87]],
    out: ['Event_CPU0_OverTemp: temp_above_upper_critical ≥ 85℃ (critical)'],
    ok: 'csr_validate 通过（0 errors），已写入 CSR',
    view: 'event', viewLabel: '事件配置',
  },
  {
    keys: ['传感器', 'scanner', '温度芯片'],
    title: '温度芯片 Scanner 配置',
    tools: [['csr_list_chip_types', 33], ['binary_mask_validate', 12]],
    out: ['Scanner_TMP112_CH1: offset 0x1A · size 2 · period 5000ms'],
    ok: '已生成 ThresholdSensor 骨架，阈值字段待补全',
    view: 'sensor', viewLabel: '传感器配置',
  },
  {
    keys: ['拓扑', '总线', 'i2c', '挂载'],
    title: 'I2C 总线挂载 PCA9545',
    tools: [['csr_list_bus_types', 29], ['csr_list_chip_types', 33], ['csr_validate', 90]],
    out: ['+ 总线 I2C_3（Anchor: BMC.I2C3）', '+ 芯片 PCA9545_1 / PCA9545_2 → I2C_3'],
    ok: 'csr_validate 通过，画布已包含新增节点与连线',
    view: 'topology', viewLabel: '拓扑视图',
  },
  {
    keys: ['smc', '偏移'],
    title: 'SMC 偏移量编码',
    tools: [['binary_mask_encode', 8]],
    out: ['func[31:26]=0x0B  cmd[25:10]=0x120  rw[8]=1  param[7:0]=0x33'],
    ok: '整字结果 0x2C048133，已预填计算器',
    view: 'smcExt', viewLabel: 'SMC 偏移量',
  },
  {
    keys: ['表达式', '管道'],
    title: '管道表达式生成',
    tools: [['csr_analyze_expr', 19]],
    out: ['$1 | add $2 | toHex 8   →   $1=100, $2=155 ⇒ 0x000000FF ✓'],
    ok: '2 级管道，无 dynamic/sync 引用，已填入计算器',
    view: 'pipeExpr', viewLabel: '管道表达式',
  },
  {
    keys: ['路径', 'redfish', '反查'],
    title: '运行时路径反查定义',
    tools: [['localview_search_paths_fuzzy', 52], ['localview_get_path_node', 17]],
    out: ['top1: /redfish/v1/Systems/{id}/Sensors（score 12，实例段已过滤）'],
    ok: '定义已在资源管理器中定位',
    view: 'explorer', viewLabel: '资源管理器',
  },
  {
    keys: ['风扇', '故障', '孪生'],
    title: '风扇故障注入（数字孪生）',
    tools: [['sim_focus', 15], ['sim_inject_fault', 22]],
    out: ['FAN3 rpm 8000 → 1200，关联 PWM 总线已高亮'],
    ok: '故障已注入，转速仪表转红',
    view: 'simulator', viewLabel: '仿真调试',
  },
  {
    keys: ['调速', '温区', '曲线'],
    title: 'CPU 温区调速曲线调整',
    tools: [['cooling_update_curve', 26]],
    out: ['cpu_zone: 50℃→40% · 60℃→80%（原 55%）· 75℃→100%'],
    ok: 'YAML 已同步，可预览曲线并导出',
    view: 'coolingConfig', viewLabel: '能效调速配置',
  },
];

/* ── open 命令别名 ──────────────────────────────────────────────────── */
const OPEN_ALIASES: Record<string, { view: string; label: string }> = {
  env: { view: 'bmcEnv', label: 'BMC 环境管理' },
  bmc: { view: 'bmcEnv', label: 'BMC 环境管理' },
  topo: { view: 'topology', label: '拓扑视图' },
  topology: { view: 'topology', label: '拓扑视图' },
  event: { view: 'event', label: '事件配置' },
  sensor: { view: 'sensor', label: '传感器配置' },
  smc: { view: 'smcExt', label: 'SMC 偏移量' },
  expr: { view: 'pipeExpr', label: '管道表达式' },
  explorer: { view: 'explorer', label: '资源管理器' },
  setup: { view: 'installGuide', label: '安装引导' },
  install: { view: 'installGuide', label: '安装引导' },
  sim: { view: 'simulator', label: '仿真调试' },
  '3d': { view: 'threeD', label: '3D 仿真' },
  cooling: { view: 'coolingConfig', label: '能效调速配置' },
  welcome: { view: 'home', label: '欢迎页' },
  home: { view: 'home', label: '欢迎页' },
  ai: { view: 'aiAssist', label: 'AI 助手' },
};

const MCP_SUMMARY: string[] = [
  '已接入 7 个 MCP Server · 26 个工具',
  'setup        环境引导    verify_all · check_ssh · check_toolchain · configure_conan_remote · clone_manifest · install_sdk · run_init · check_platform',
  'bmc-remote   连接/巡检   list_connections · add_connection · set_auto_check · check_health · macro_run · ssh_exec',
  'csr          配置校验    validate · list_bus_types · list_chip_types · analyze_expr',
  'localview    接口路径    search_paths · search_paths_fuzzy · get_path_node',
  'binary-mask  位域计算    encode · validate',
  'sim          数字孪生    focus · inject_fault',
  'cooling      能效调速    update_curve',
];

const HELP_LINES: string[] = [
  '可用命令：',
  '  agent <任务描述>   让 agent 规划并执行任务（自动调用 MCP 工具）',
  '  mcp                查看已接入的 MCP 工具',
  '  open <视图>        打开功能视图（open env / topo / smc …）',
  '  views              列出可打开的视图',
  '  clear              清屏',
  '  exit               关闭终端',
  '示例：agent 诊断安装环境 ・ agent 巡检在线 BMC ・ agent 给 CPU0 加过温事件 ・ agent 校验当前 CSR',
];

const GREETING: string[] = [
  'openUBMC agent CLI — 输入 help 查看命令，agent <任务> 直接派发任务。',
];

export function AgentTerminal({ onOpenScenario, onClose, runRequest }: AgentTerminalProps) {
  const [lines, setLines] = useState<TermLine[]>(() => GREETING.map(t => ({ kind: 'info', text: t })));
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  busyRef.current = busy;

  // 挂载守卫：卸载后 timer 回调变 no-op。
  // 不能在卸载时 clearTimeout —— StrictMode 的模拟卸载会清掉刚派发的
  // 任务脚本（runRequest effect 首挂载即执行），导致 busy 卡死。
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function push(kind: LineKind, text: string) {
    setLines(prev => [...prev, { kind, text }]);
  }

  function schedule(fn: () => void, delay: number) {
    window.setTimeout(() => { if (mountedRef.current) fn(); }, delay);
  }

  // 任务状态写入 localStorage，供欢迎页 agent 工作台读取（同源 storage 事件联动）
  function writeAgentStatus(status: Record<string, unknown>) {
    try { localStorage.setItem('bmcAgentTaskStatus', JSON.stringify(status)); } catch { /* noop */ }
  }

  function runAgent(taskText: string) {
    const s = taskText.toLowerCase();
    const task = AGENT_TASKS.find(t => t.keys.some(k => s.includes(k)));
    if (!task) {
      push('err', '未匹配到可执行场景。试试：' + AGENT_TASKS.slice(0, 4).map(t => t.title).join(' ・ '));
      return;
    }
    setBusy(true);
    writeAgentStatus({ state: 'running', title: task.title, startedAt: Date.now() });
    let at = 260;
    push('plan', '⏺ 已规划任务：' + task.title);
    for (const [name, ms] of task.tools) {
      schedule(() => push('tool', `⚙ ${name}  … ok ${ms}ms`), at);
      at += 180 + ms;
    }
    for (const o of task.out) {
      schedule(() => push('out', '  ' + o), at);
      at += 120;
    }
    schedule(() => push('ok', '✔ ' + task.ok), at);
    at += 200;
    schedule(() => {
      if (task.view) {
        push('open', `↗ 已分屏打开「${task.viewLabel}」`);
        onOpenScenario(task.view);
      }
      setBusy(false);
      writeAgentStatus({ state: 'done', title: task.title, summary: task.ok, finishedAt: Date.now() });
    }, at);
    // 联动：向安装引导 iframe 回写检测状态（等 iframe 挂载完成后再发）
    if (task.after === 'wizard-env-ok') {
      schedule(() => {
        const wizard = document.querySelector<HTMLIFrameElement>('iframe[title="安装部署引导"]');
        wizard?.contentWindow?.postMessage({ type: 'conanChecked', exists: true, configured: true }, '*');
      }, at + 1500);
    }
  }

  function exec(raw: string) {
    const cmdline = raw.trim();
    if (!cmdline) return;
    push('cmd', `${PROMPT} ${cmdline}`);
    const [cmd, ...rest] = cmdline.split(/\s+/);
    const arg = rest.join(' ');
    switch (cmd.toLowerCase()) {
      case 'help':
        HELP_LINES.forEach(l => push('info', l));
        break;
      case 'agent':
        if (!arg) { push('err', '用法：agent <任务描述>，如 agent 巡检在线 BMC'); break; }
        runAgent(arg);
        break;
      case 'mcp':
        MCP_SUMMARY.forEach(l => push('info', l));
        break;
      case 'open': {
        const target = OPEN_ALIASES[arg.toLowerCase()];
        if (!target) { push('err', '未知视图。可用：' + Object.keys(OPEN_ALIASES).join(' / ')); break; }
        push('open', `↗ 已打开「${target.label}」`);
        onOpenScenario(target.view);
        break;
      }
      case 'views':
        push('info', Object.entries(OPEN_ALIASES).map(([k, v]) => `${k} → ${v.label}`).join('   '));
        break;
      case 'clear':
        setLines([]);
        break;
      case 'exit':
        onClose();
        break;
      default:
        push('err', `未知命令：${cmd}（输入 help 查看命令）`);
    }
  }

  // 顶栏快捷动作派发进来的命令
  const lastRunId = useRef<number | null>(null);
  useEffect(() => {
    if (!runRequest || runRequest.id === lastRunId.current) return;
    lastRunId.current = runRequest.id;
    if (busyRef.current) { push('err', 'agent 正在执行，请稍候…'); return; }
    exec(runRequest.cmd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runRequest]);

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (busy) return;
    const v = input;
    setInput('');
    exec(v);
  }

  return (
    <div className="ide-agent-terminal" onMouseDown={() => inputRef.current?.focus()}>
      <div className="pto-ide-frame__terminal-tabs">
        <div className="pto-ide-frame__terminal-tablist">
          <span className="pto-ide-frame__terminal-tab is-selected">openUBMC agent CLI</span>
          <span className="pto-ide-frame__terminal-tab">输出</span>
        </div>
        <div className="pto-ide-frame__terminal-actions">
          <button className="pto-ide-frame__terminal-action" title="清屏" onClick={() => setLines([])}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M6 6l12 12" /></svg>
          </button>
          <button className="pto-ide-frame__terminal-action" title="关闭终端" onClick={onClose}>
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>
      <div className="pto-ide-frame__terminal-body" ref={bodyRef}>
        {lines.map((l, i) => (
          <p key={i} className={`pto-ide-frame__terminal-line ide-term-line--${l.kind}`}>{l.text}</p>
        ))}
        {busy && <p className="pto-ide-frame__terminal-line ide-term-line--info">…<span className="pto-ide-frame__terminal-cursor" /></p>}
      </div>
      <div className="ide-terminal-input">
        <span className="pto-ide-frame__terminal-prompt">{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={busy ? 'agent 执行中…' : 'agent <任务描述> ／ help'}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
