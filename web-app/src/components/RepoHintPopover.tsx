import React, { useEffect, useRef } from 'react';
import { RepoCapabilityList } from './RepoCapabilityList';

/* ═══════════════════════════════════════════════════════════════════════
   仓识别提示弹窗 —— 从左下角罗盘按钮弹出（切仓即弹）。
   紧凑、少彩色：中性底与文字，底部「固定到资源管理器」把清单钉进 Explorer。
   点空白 / Esc 关闭。
   ═══════════════════════════════════════════════════════════════════════ */

interface Props {
  /** 锚点（罗盘按钮）垂直位置 */
  anchorTop: number;
  onOpenView: (viewId: string) => void;
  onRunAgent: (cmd: string) => void;
  onPin: () => void;
  onClose: () => void;
}

export function RepoHintPopover({ anchorTop, onOpenView, onRunAgent, onPin, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
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

  // 弹窗底部对齐锚点上方（罗盘在左下角），不足则夹取
  const bottom = Math.max(52, window.innerHeight - anchorTop + 8);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed', left: 52, bottom: Math.min(bottom, window.innerHeight - 90), zIndex: 1000,
        width: 288, maxHeight: 'calc(100vh - 130px)', overflow: 'auto',
        background: '#161616', borderRadius: 12, padding: '13px 13px 10px',
        boxShadow: '0 10px 34px rgba(0,0,0,0.5)',
      }}
    >
      <RepoCapabilityList onOpenView={(v) => { onOpenView(v); onClose(); }} onRunAgent={(c) => { onRunAgent(c); onClose(); }} />

      <div style={{ display: 'flex', gap: 7, marginTop: 4, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onPin}
          style={{
            flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            height: 30, borderRadius: 100, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.82)', fontSize: 11.5, fontWeight: 600,
            fontFamily: 'inherit', transition: 'background 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4h6M10 4l-1 7-3 2v1h12v-1l-3-2-1-7M12 17v5" /></svg>
          固定到资源管理器
        </button>
        <button
          onClick={onClose}
          title="关闭"
          style={{
            width: 30, height: 30, borderRadius: 100, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </div>
  );
}
