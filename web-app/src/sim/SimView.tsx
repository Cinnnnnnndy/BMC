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
        background: '#0d0f18',
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
          }}
        >
          <IsoCanvas />
          <ContextMenu />

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
              border: `1px solid ${catalogOpen ? 'rgba(91,156,246,0.5)' : 'rgba(255,255,255,0.12)'}`,
              background: catalogOpen ? 'rgba(91,156,246,0.12)' : 'rgba(13,16,24,0.82)',
              color: catalogOpen ? '#5b9cf6' : 'rgba(200,215,255,0.7)',
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
