import { useEffect, useRef } from 'react';
import { useSimStore } from './simStore';
import type { SimToast as SimToastItem } from './simStore';

// ─── Border colors by level ─────────────────────────────────────────────────
const LEVEL_COLORS: Record<SimToastItem['level'], { border: string; bg: string; icon: string }> = {
  info:  { border: '#5B9CF6', bg: 'rgba(91,156,246,0.12)',  icon: 'ℹ' },
  warn:  { border: '#F5C842', bg: 'rgba(245,200,66,0.12)',  icon: '⚠' },
  error: { border: '#EF4444', bg: 'rgba(239,68,68,0.12)',   icon: '✕' },
};

const AUTO_DISMISS_MS = 4000;

// ─── Single toast item ──────────────────────────────────────────────────────
function ToastItem({ toast, onDismiss }: { toast: SimToastItem; onDismiss: () => void }) {
  const cfg = LEVEL_COLORS[toast.level];
  const mountedRef = useRef(false);

  useEffect(() => {
    // Trigger slide-in on the next paint
    mountedRef.current = true;
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
    // onDismiss identity is stable from zustand; including it here is safe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={onDismiss}
      title="点击关闭"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        minWidth: 260,
        maxWidth: 360,
        padding: '10px 12px',
        borderRadius: 7,
        background: '#13172a',
        border: '1px solid rgba(255,255,255,0.09)',
        borderLeft: `3px solid ${cfg.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.55)',
        cursor: 'pointer',
        userSelect: 'none',
        backdropFilter: 'blur(8px)',
        animation: 'toastSlideIn 0.22s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        backgroundColor: cfg.bg,
      }}
    >
      {/* Icon */}
      <span
        style={{
          fontSize: 13,
          color: cfg.border,
          flexShrink: 0,
          lineHeight: 1.4,
          fontWeight: 700,
        }}
      >
        {cfg.icon}
      </span>

      {/* Message body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: 'rgba(200,215,255,0.88)',
            lineHeight: 1.55,
            wordBreak: 'break-word',
          }}
        >
          {toast.message}
        </div>
        <div
          style={{
            marginTop: 3,
            fontSize: 9,
            color: 'rgba(200,215,255,0.3)',
            fontFamily: 'monospace',
          }}
        >
          {new Date(toast.ts).toLocaleTimeString('zh-CN', { hour12: false })}
        </div>
      </div>

      {/* Dismiss button */}
      <span
        style={{
          fontSize: 10,
          color: 'rgba(200,215,255,0.3)',
          flexShrink: 0,
          lineHeight: 1.4,
          paddingTop: 1,
        }}
      >
        ✕
      </span>
    </div>
  );
}

// ─── Toast container ────────────────────────────────────────────────────────
export function SimToast() {
  const toasts = useSimStore((s) => s.toasts);
  const dismissToast = useSimStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <>
      {/* Keyframe injection via a style tag */}
      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(28px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem
              toast={toast}
              onDismiss={() => dismissToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
