import { IsoCanvas } from './IsoCanvas';
import { SimPanel } from './SimPanel';
import { SimToolbar } from './SimToolbar';
import { ContextMenu } from './ContextMenu';
import { SimToast } from './SimToast';

export function SimView() {
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
      {/* Main area: canvas + side panel */}
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
          {/* Context menu is a portal-like overlay */}
          <ContextMenu />
        </div>

        {/* Right panel */}
        <SimPanel />
      </div>

      {/* Bottom toolbar */}
      <div
        style={{
          height: 44,
          flexShrink: 0,
          display: 'flex',
        }}
      >
        <SimToolbar />
      </div>

      {/* Toast overlay — fixed position, outside flex layout */}
      <SimToast />
    </div>
  );
}
