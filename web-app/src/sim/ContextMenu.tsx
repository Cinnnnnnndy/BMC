import { useState, useEffect, useRef, useCallback } from 'react';
import { useSimStore } from './simStore';
import { HARDWARE_COMPONENTS } from './serverData';

interface MenuState {
  visible: boolean;
  x: number;
  y: number;
  targetId: string | null;
}

export function ContextMenu() {
  const [menu, setMenu] = useState<MenuState>({
    visible: false,
    x: 0,
    y: 0,
    targetId: null,
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const { selectComponent, highlightConnections, clearHighlights, setCamera, deselectAll } =
    useSimStore();

  // Listen for custom context menu events from IsoCanvas
  useEffect(() => {
    const handler = (e: Event) => {
      const { x, y, targetId } = (e as CustomEvent<{
        x: number;
        y: number;
        targetId: string | null;
      }>).detail;
      setMenu({ visible: true, x, y, targetId });
    };
    window.addEventListener('sim:contextmenu', handler);
    return () => window.removeEventListener('sim:contextmenu', handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu((m) => ({ ...m, visible: false }));
      }
    };
    if (menu.visible) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [menu.visible]);

  const close = useCallback(() => {
    setMenu((m) => ({ ...m, visible: false }));
  }, []);

  function handleSelect() {
    if (menu.targetId) selectComponent(menu.targetId);
    close();
  }

  function handleHighlight() {
    if (!menu.targetId) return close();
    const comp = HARDWARE_COMPONENTS.find((c) => c.id === menu.targetId);
    if (!comp) return close();

    // Highlight all bus IDs this component participates in
    const busIds = comp.busConnections.map((bc) => bc.busId);
    if (busIds.length > 0) highlightConnections(busIds);
    close();
  }

  function handleClearHighlights() {
    clearHighlights();
    close();
  }

  function handleResetCamera() {
    setCamera({ x: 200, y: 130, zoom: 0.42 });
    close();
  }

  function handleDeselectAll() {
    deselectAll();
    clearHighlights();
    close();
  }

  if (!menu.visible) return null;

  const targetComp = menu.targetId
    ? HARDWARE_COMPONENTS.find((c) => c.id === menu.targetId)
    : null;

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    left: menu.x,
    top: menu.y,
    zIndex: 9999,
    background: '#1a1d2e',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 7,
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    minWidth: 160,
    overflow: 'hidden',
    fontSize: 12,
    color: 'rgba(200,215,255,0.85)',
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    cursor: 'pointer',
    transition: 'background 0.1s',
    userSelect: 'none',
  };

  const dividerStyle: React.CSSProperties = {
    height: 1,
    background: 'rgba(255,255,255,0.07)',
    margin: '2px 0',
  };

  const headerStyle: React.CSSProperties = {
    padding: '7px 14px 5px',
    fontSize: 10,
    color: 'rgba(200,215,255,0.4)',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  };

  return (
    <div ref={menuRef} style={menuStyle}>
      {targetComp && (
        <div style={headerStyle}>{targetComp.labelEn}</div>
      )}

      {targetComp && (
        <>
          <MenuItem
            icon="◎"
            label="查看属性"
            style={itemStyle}
            onClick={handleSelect}
          />
          <MenuItem
            icon="⬡"
            label="高亮连接"
            style={itemStyle}
            onClick={handleHighlight}
          />
          <div style={dividerStyle} />
        </>
      )}

      <MenuItem
        icon="✕"
        label="清除高亮"
        style={itemStyle}
        onClick={handleClearHighlights}
      />
      <MenuItem
        icon="↺"
        label="取消选中"
        style={itemStyle}
        onClick={handleDeselectAll}
      />
      <div style={dividerStyle} />
      <MenuItem
        icon="⊹"
        label="复位位置"
        style={itemStyle}
        onClick={handleResetCamera}
      />
    </div>
  );
}

function MenuItem({
  icon,
  label,
  style,
  onClick,
}: {
  icon: string;
  label: string;
  style: React.CSSProperties;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...style,
        background: hovered ? 'rgba(91,156,246,0.12)' : 'transparent',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ opacity: 0.6, fontSize: 11 }}>{icon}</span>
      {label}
    </div>
  );
}
