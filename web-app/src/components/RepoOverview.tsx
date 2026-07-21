import React from 'react';
import { detectRepo, REPO_CAPABILITIES, type Capability } from '../data/repoCapabilities';

/* ═══════════════════════════════════════════════════════════════════════
   仓概览 —— 认出「是什么仓」+ 列出「这个仓能做什么」。
   识别来自 detectRepo()（MCP 中层，当前 mock），清单来自 REPO_CAPABILITIES
   （Skill 上层的仓类型→功能映射）。视觉复用欢迎页「AGENT 工作台」能力卡 pattern：
   卡片 #111113 / 16px，胶囊 100px / rgba 填充分层少描边，AI 强调色 ✦ 紫 #a78bfa。
   点击：run→派发 agent 终端；open→打开功能视图（走 App.openScenario 分屏兜底）。
   ═══════════════════════════════════════════════════════════════════════ */

interface RepoOverviewProps {
  /** 打开功能视图（App.openScenario）—— 处理 CSR 依赖视图自动兜底样例 */
  onOpenView: (viewId: string) => void;
  /** 派发 agent 命令到底部终端（App.runQuickAction）*/
  onRunAgent: (cmd: string) => void;
}

// ✦ 四角星面型图标（CLAUDE.md 约束：AI/agent 入口统一此图标 + 紫色）
const STAR = 'M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z';

function Pill({ cap, onOpenView, onRunAgent }: RepoOverviewProps & { cap: Capability }) {
  const isAgent = !!cap.run;
  const handle = () => {
    if (cap.run) onRunAgent(cap.run);
    else if (cap.open) onOpenView(cap.open);
  };
  return (
    <button
      onClick={handle}
      title={isAgent ? '派发到 agent 终端执行' : '打开功能视图'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '8px 16px', borderRadius: 100, border: 'none',
        background: 'rgba(255,255,255,0.06)', cursor: 'pointer',
        fontFamily: 'inherit', transition: 'background 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
    >
      {isAgent ? (
        // agent 任务：✦ 紫，提示背后走 MCP 工具轨迹
        <svg viewBox="0 0 24 24" width="12" height="12" style={{ flexShrink: 0 }}>
          <path d={STAR} fill="#a78bfa" />
        </svg>
      ) : (
        // 打开视图：面型右上箭头
        <svg viewBox="0 0 24 24" width="12" height="12" style={{ flexShrink: 0, opacity: 0.5 }}>
          <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.90)' }}>{cap.name}</span>
    </button>
  );
}

export function RepoOverview({ onOpenView, onRunAgent }: RepoOverviewProps) {
  const repo = detectRepo();
  const groups = REPO_CAPABILITIES[repo.type] ?? [];

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'auto', background: 'var(--background, #101010)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 28px 40px' }}>

        {/* ── 仓身份：是什么 ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          background: '#111113', borderRadius: 16, padding: '18px 20px', marginBottom: 26,
        }}>
          {/* 仓图标（面型文件夹） */}
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: 'rgba(167,139,250,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill="#a78bfa" />
            </svg>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>{repo.name}</span>
              {/* AI 识别标记：✦ 紫 chip */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                height: 20, padding: '0 8px', borderRadius: 100,
                background: 'rgba(167,139,250,0.14)', color: '#a78bfa',
                fontSize: 11, fontWeight: 600,
              }}>
                <svg viewBox="0 0 24 24" width="11" height="11"><path d={STAR} fill="#a78bfa" /></svg>
                已识别
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.60)' }}>
              <span style={{ color: 'rgba(255,255,255,0.90)', fontWeight: 600 }}>{repo.title}</span>
              <span style={{ margin: '0 6px', color: 'rgba(255,255,255,0.30)' }}>·</span>
              {repo.desc}
            </div>
          </div>
        </div>

        {/* ── 功能清单：能做什么 ── */}
        {groups.map(g => (
          <section key={g.group} style={{ marginBottom: 22 }}>
            <div style={{
              fontSize: 12, fontWeight: 600, letterSpacing: '.03em',
              color: 'rgba(255,255,255,0.40)', marginBottom: 10,
            }}>{g.group}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {g.items.map(cap => (
                <Pill key={cap.name} cap={cap} onOpenView={onOpenView} onRunAgent={onRunAgent} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
