import { useState } from 'react';
import { IsoCanvas } from './IsoCanvas';
import { SimPanel } from './SimPanel';
import { SimToolbar } from './SimToolbar';
import { ContextMenu } from './ContextMenu';
import { SimToast } from './SimToast';
import { CatalogBrowser } from './CatalogBrowser';

export function SimView() {
  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#05080f',
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
            /* Blueprint card frame: inset blue glow border */
            boxShadow: 'inset 0 0 0 1px rgba(58,111,216,0.25)',
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
              background: 'rgba(5,8,15,0.70)',
              border: '1px solid rgba(58,111,216,0.35)',
              backdropFilter: 'blur(6px)',
              color: 'rgba(140,180,255,0.75)',
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
            <span style={{ color: 'rgba(160,200,255,0.6)', margin: '0 2px' }}>·</span>
            <span>3D</span>
            <span style={{ color: 'rgba(90,130,220,0.6)' }}>·</span>
            <span style={{ color: 'rgba(160,200,255,0.55)' }}>openUBMC</span>
          </div>

          {/* Catalog toggle button — top-left overlay */}
          <button
            onClick={() => setCatalogOpen((v) => !v)}
            title="硬件模型库"
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: `1px solid ${catalogOpen ? 'rgba(58,111,216,0.55)' : 'rgba(58,111,216,0.20)'}`,
              background: catalogOpen ? 'rgba(40,80,180,0.18)' : 'rgba(5,8,15,0.82)',
              color: catalogOpen ? '#5b9cf6' : 'rgba(130,170,240,0.75)',
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
              background: 'radial-gradient(ellipse at 50% 110%, rgba(30,60,140,0.18) 0%, transparent 65%)',
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
