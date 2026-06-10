import { useState } from 'react';
import { IsoCanvas } from './IsoCanvas';
import { SimPanel } from './SimPanel';
import { SimToolbar } from './SimToolbar';
import { ContextMenu } from './ContextMenu';
import { SimToast } from './SimToast';
import { CatalogBrowser } from './CatalogBrowser';
import { SystemInfoPanel } from './SystemInfoPanel';

export function SimView() {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [sysOpen, setSysOpen] = useState(false);   // system-info panel hidden by default

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#dde8f2',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Main area: canvas + side panels */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Canvas area */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            minWidth: 0,
            /* Light-mode frame: subtle inset border */
            boxShadow: 'inset 0 0 0 1px rgba(140,170,210,0.20)',
          }}
        >
          <IsoCanvas />
          <ContextMenu />

          {/* ── "3D · openUBMC" badge — below the app header ── */}
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 14px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.60)',
              border: '1px solid rgba(140,170,200,0.40)',
              backdropFilter: 'blur(6px)',
              color: 'rgba(60,90,130,0.80)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Three dots — window chrome hint */}
            <span style={{ display: 'flex', gap: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#e05252', opacity: 0.9 }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d4a030', opacity: 0.9 }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3bb86e', opacity: 0.9 }} />
            </span>
            <span style={{ color: 'rgba(100,130,170,0.6)', margin: '0 2px' }}>·</span>
            <span>3D</span>
            <span style={{ color: 'rgba(100,130,170,0.5)' }}>·</span>
            <span style={{ color: 'rgba(80,110,150,0.65)' }}>openUBMC</span>
          </div>

          {/* System-info toggle (top-left) — panel is hidden until opened */}
          <button
            onClick={() => setSysOpen((v) => !v)}
            title="服务器系统信息"
            style={{
              position: 'absolute', top: 14, left: 14, zIndex: 11,
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 13px', borderRadius: 10,
              border: `1px solid ${sysOpen ? 'rgba(47,107,255,0.45)' : 'rgba(120,150,190,0.30)'}`,
              background: sysOpen ? 'rgba(47,107,255,0.10)' : 'rgba(255,255,255,0.92)',
              color: sysOpen ? '#2f6bff' : '#4a5260',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(60,80,120,0.12)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <span style={{ fontSize: 14 }}>🗔</span>
            系统信息
          </button>

          {/* Floating server system-info overlay (top-left), below the toggle */}
          {sysOpen && <SystemInfoPanel />}

          {/* Catalog toggle button — top-right overlay (system panel owns top-left) */}
          <button
            onClick={() => setCatalogOpen((v) => !v)}
            title="硬件模型库"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: `1px solid ${catalogOpen ? 'rgba(80,120,180,0.50)' : 'rgba(120,150,190,0.30)'}`,
              background: catalogOpen ? 'rgba(200,220,245,0.80)' : 'rgba(255,255,255,0.70)',
              color: catalogOpen ? '#2a5a9a' : 'rgba(60,90,140,0.80)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 14 }}>🗂</span>
            模型库
          </button>

          {/* Bottom vignette — gives depth like the card gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: 'radial-gradient(ellipse at 50% 110%, rgba(160,185,210,0.12) 0%, transparent 65%)',
              zIndex: 1,
            }}
          />
        </div>

        {/* Catalog Browser (slides in from right of canvas) */}
        {catalogOpen && (
          <CatalogBrowser onClose={() => setCatalogOpen(false)} />
        )}

        {/* Component inspector panel */}
        <SimPanel />
      </div>

      {/* Bottom toolbar */}
      <div style={{ height: 44, flexShrink: 0, display: 'flex' }}>
        <SimToolbar />
      </div>

      <SimToast />
    </div>
  );
}
