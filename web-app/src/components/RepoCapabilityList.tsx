import React from 'react';
import { detectRepo, REPO_CAPABILITIES, type Capability } from '../data/repoCapabilities';

/* ═══════════════════════════════════════════════════════════════════════
   仓能力清单（共享渲染）—— 仓身份头 + 分组功能胶囊。
   同一份内容喂给两个宿主：
   - variant='popover'：左侧 rail 提示按钮弹出的识别卡（切仓即弹）
   - variant='dock'   ：固定后停靠在资源管理器左栏底部的常驻区
   识别来自 detectRepo()（MCP mock），清单来自 REPO_CAPABILITIES（Skill 映射）。
   视觉复用欢迎页工作台 pattern：胶囊 100px 填充分层、AI 强调 ✦ 紫 #a78bfa。
   ═══════════════════════════════════════════════════════════════════════ */

// ✦ 四角星面型图标（CLAUDE.md：AI/agent 入口统一此图标 + 紫）
export const STAR = 'M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z';

interface Props {
  variant: 'popover' | 'dock';
  onOpenView: (viewId: string) => void;
  onRunAgent: (cmd: string) => void;
}

function Pill({ cap, onOpenView, onRunAgent }: { cap: Capability; onOpenView: Props['onOpenView']; onRunAgent: Props['onRunAgent'] }) {
  const isAgent = !!cap.run;
  return (
    <button
      onClick={() => { if (cap.run) onRunAgent(cap.run); else if (cap.open) onOpenView(cap.open); }}
      title={isAgent ? '派发到 agent 终端执行' : '打开功能视图'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', borderRadius: 100, border: 'none',
        background: 'rgba(255,255,255,0.06)', cursor: 'pointer',
        fontFamily: 'inherit', transition: 'background 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
    >
      {isAgent ? (
        <svg viewBox="0 0 24 24" width="11" height="11" style={{ flexShrink: 0 }}><path d={STAR} fill="#a78bfa" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" width="11" height="11" style={{ flexShrink: 0, opacity: 0.45 }}>
          <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.90)' }}>{cap.name}</span>
    </button>
  );
}

export function RepoCapabilityList({ variant, onOpenView, onRunAgent }: Props) {
  const repo = detectRepo();
  const groups = REPO_CAPABILITIES[repo.type] ?? [];
  const dock = variant === 'dock';

  return (
    <div>
      {/* ── 仓身份：是什么 ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: dock ? 12 : 16 }}>
        <div style={{
          width: dock ? 30 : 38, height: dock ? 30 : 38, borderRadius: 9, flexShrink: 0,
          background: 'rgba(167,139,250,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 24 24" width={dock ? 17 : 20} height={dock ? 17 : 20}>
            <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill="#a78bfa" />
          </svg>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: dock ? 13.5 : 15, fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.name}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0,
              height: 18, padding: '0 7px', borderRadius: 100,
              background: 'rgba(167,139,250,0.14)', color: '#a78bfa', fontSize: 10.5, fontWeight: 600,
            }}>
              <svg viewBox="0 0 24 24" width="10" height="10"><path d={STAR} fill="#a78bfa" /></svg>
              已识别
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: dock ? 'nowrap' : 'normal' }}>
            {repo.title}{!dock && <><span style={{ margin: '0 5px', color: 'rgba(255,255,255,0.30)' }}>·</span>{repo.desc}</>}
          </div>
        </div>
      </div>

      {/* ── 功能清单：能做什么 ── */}
      {groups.map(g => (
        <section key={g.group} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.03em', color: 'rgba(255,255,255,0.40)', marginBottom: 8 }}>{g.group}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {g.items.map(cap => <Pill key={cap.name} cap={cap} onOpenView={onOpenView} onRunAgent={onRunAgent} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
