import React, { useEffect, useRef } from 'react';
import { RepoCapabilityList } from './RepoCapabilityList';

/* ═══════════════════════════════════════════════════════════════════════
   仓识别提示弹窗 —— 从左侧活动栏 ✦ 按钮弹出（切仓即弹）。
   内容＝共享的 RepoCapabilityList，底部一个「固定到资源管理器」把清单钉成
   Explorer 常驻区（两者结合方案的「弹」端）。点空白 / Esc 关闭。
   ═══════════════════════════════════════════════════════════════════════ */

interface Props {
  /** 锚点（rail 按钮）垂直位置，弹窗左侧贴着活动栏 */
  anchorTop: number;
  onOpenView: (viewId: string) => void;
  onRunAgent: (cmd: string) => void;
  onPin: () => void;
  onClose: () => void;
}

export function RepoHintPopover({ anchorTop, onOpenView, onRunAgent, onPin, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    // 延一帧再挂，避免触发本次打开的同一次点击
    const t = window.setTimeout(() => {
      document.addEventListener('mousedown', onDown);
      document.addEventListener('keydown', onKey);
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const top = Math.min(anchorTop, window.innerHeight - 460);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed', left: 54, top: Math.max(56, top), zIndex: 1000,
        width: 336, maxHeight: 'calc(100vh - 120px)', overflow: 'auto',
        background: '#111113', borderRadius: 14, padding: '16px 16px 12px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
      }}
    >
      <RepoCapabilityList variant="popover" onOpenView={(v) => { onOpenView(v); onClose(); }} onRunAgent={(c) => { onRunAgent(c); onClose(); }} />

      {/* 固定 / 关闭 */}
      <div style={{ display: 'flex', gap: 8, marginTop: 6, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onPin}
          style={{
            flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            height: 32, borderRadius: 100, border: 'none', cursor: 'pointer',
            background: 'rgba(167,139,250,0.16)', color: '#a78bfa', fontSize: 12, fontWeight: 600,
            fontFamily: 'inherit', transition: 'background 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(167,139,250,0.26)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(167,139,250,0.16)'; }}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4h6M10 4l-1 7-3 2v1h12v-1l-3-2-1-7M12 17v5" /></svg>
          固定到资源管理器
        </button>
        <button
          onClick={onClose}
          style={{
            width: 32, height: 32, borderRadius: 100, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
          title="关闭"
        >
          <svg viewBox="0 0 24 24" width="13" height="13"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}
