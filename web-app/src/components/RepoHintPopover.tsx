import React, { useEffect, useRef } from 'react';
import { RepoCapabilityList } from './RepoCapabilityList';

/* ═══════════════════════════════════════════════════════════════════════
   仓识别提示弹窗 —— 从左下角罗盘按钮弹出（切仓即弹）。
   紧凑、少彩色：中性底与文字。点胶囊派发、点空白 / Esc 关闭。
   ═══════════════════════════════════════════════════════════════════════ */

interface Props {
  /** 内容区（工作区）左下角：距视口左、距视口底 */
  anchorLeft: number;
  anchorBottom: number;
  onOpenView: (viewId: string) => void;
  onRunAgent: (cmd: string) => void;
  onClose: () => void;
}

export function RepoHintPopover({ anchorLeft, anchorBottom, onOpenView, onRunAgent, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Element;
      // 点罗盘按钮本身不走「点空白关闭」——交给按钮自身的 onClick 切换关闭
      if (ref.current && !ref.current.contains(t) && !t.closest?.('[data-repo-toggle]')) onClose();
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    // 点到 iframe 视图（欢迎页/拓扑等）时父文档收不到 mousedown，靠 window blur 兜底关闭
    function onBlur() { onClose(); }
    const t = window.setTimeout(() => {
      document.addEventListener('mousedown', onDown);
      document.addEventListener('keydown', onKey);
      window.addEventListener('blur', onBlur);
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('blur', onBlur);
    };
  }, [onClose]);

  // 紧贴内容区左下角，向上/右展开，尽量少遮挡内容
  const INSET = 6;

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed', left: anchorLeft + INSET, bottom: anchorBottom + INSET, zIndex: 1000,
        width: 288, maxHeight: `calc(100vh - ${anchorBottom + 96}px)`, overflow: 'auto',
        background: '#161616', borderRadius: 12, padding: '13px 13px 10px',
        boxShadow: '0 10px 34px rgba(0,0,0,0.5)',
      }}
    >
      {/* 标题 + 关闭 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>功能提示</span>
        <button
          onClick={onClose}
          title="关闭"
          style={{
            width: 22, height: 22, borderRadius: 100, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
        >
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <RepoCapabilityList onOpenView={(v) => { onOpenView(v); onClose(); }} onRunAgent={(c) => { onRunAgent(c); onClose(); }} />
    </div>
  );
}
