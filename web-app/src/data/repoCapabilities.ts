/* ═══════════════════════════════════════════════════════════════════════
   代码仓识别 → 功能清单（仓身份 + 这个仓能做什么）

   分层：
   - MCP（中层）：detectRepo() —— 认出「是什么仓」。当前为 mock，
     真实实现应读资源管理器的树/manifest/conanfile 得出类型。
   - Skill（上层）：REPO_CAPABILITIES —— 一张「仓类型 → 分组功能清单」
     静态映射，命中类型即整组亮出。先不做打分/状态排序（那是二期）。

   每个功能项二选一：
   - open: 直接打开某功能视图（走 App.openScenario，CSR 依赖视图自动兜底样例）
   - run : 派发 agent 任务到底部终端（cmd 须命中 AgentTerminal.AGENT_TASKS 词表）
   ═══════════════════════════════════════════════════════════════════════ */

export type RepoType = 'vpd' | 'sdk' | 'component';

export interface RepoIdentity {
  type: RepoType;
  /** 仓目录名 */
  name: string;
  /** 人类可读的仓类型 */
  title: string;
  /** 一句话说明「是什么」 */
  desc: string;
}

export interface Capability {
  name: string;
  /** 打开的功能视图 id（App ViewId），与 run 二选一 */
  open?: string;
  /** 派发到 agent 终端的命令（须命中 AGENT_TASKS），与 open 二选一 */
  run?: string;
}

export interface CapabilityGroup {
  group: string;
  items: Capability[];
}

/* ── 认出「是什么仓」（mock）─────────────────────────────────────────────
   真实实现的探测种子：
   - vendor 目录下有 .sr + conanfile.py + registry.py → vpd（机型/VPD 配置仓）
   - 有 bmc_sdk / manifest 结构                        → sdk
   - 单组件（有 mds/model 但无 vendor 机型树）          → component
   现在固定返回资源管理器里那个 vpd-main。 */
export function detectRepo(): RepoIdentity {
  return {
    type: 'vpd',
    name: 'vpd-main',
    title: '机型 / VPD 配置仓',
    desc: 'openUBMC 24.03 · 硬件 PSR/CSR、机型软件配置、北向接口映射',
  };
}

/* ── 仓类型 → 功能清单 ──────────────────────────────────────────────────
   「不同仓做不同事」就落在这张表：换类型即换一组。 */
export const REPO_CAPABILITIES: Record<RepoType, CapabilityGroup[]> = {
  vpd: [
    {
      group: '配置编辑',
      items: [
        { name: '拓扑视图', open: 'topology' },
        { name: '事件配置', open: 'event' },
        { name: '传感器配置', open: 'sensor' },
        { name: '能效调速', open: 'coolingConfig' },
        { name: 'SMC 偏移量', open: 'smcExt' },
        { name: '管道表达式', open: 'pipeExpr' },
      ],
    },
    {
      group: '校验',
      items: [
        { name: 'CSR 全量校验', run: 'agent 校验当前 CSR' },
      ],
    },
    {
      group: '接口',
      items: [
        { name: '北向接口映射', open: 'jsonNorth' },
        { name: 'MIB 支持', open: 'mibSup' },
      ],
    },
    {
      group: '预览 / 仿真',
      items: [
        { name: 'SR 文件预览', open: 'srPrev' },
        { name: '数字孪生仿真', open: 'simulator' },
      ],
    },
  ],

  // 下列为「不同仓不同功能」的示例映射（detectRepo 暂不返回，占位说明模式）
  sdk: [
    {
      group: '构建',
      items: [
        { name: '构建 VSIX 扩展', run: 'agent 构建扩展安装包 vsix' },
        { name: '下载开发资源', run: 'agent 下载开发资源 sdk' },
      ],
    },
    {
      group: '环境',
      items: [
        { name: '环境诊断', run: 'agent 诊断安装环境' },
      ],
    },
  ],
  component: [
    {
      group: '校验',
      items: [
        { name: 'CSR 全量校验', run: 'agent 校验当前 CSR' },
      ],
    },
    {
      group: '配置编辑',
      items: [
        { name: '拓扑视图', open: 'topology' },
        { name: '事件配置', open: 'event' },
      ],
    },
  ],
};
