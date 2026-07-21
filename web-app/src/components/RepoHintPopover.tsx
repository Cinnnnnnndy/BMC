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
      <RepoCapabilityList onOpenView={(v) => { onOpenView(v); onClose(); }} onRunAgent={(c) => { onRunAgent(c); onClose(); }} />
    </div>
  );
}
