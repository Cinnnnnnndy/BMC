// Auto-layout — ported from React view's computeAutoLayout().
// Board auto-sizes to fit content; bus → mux → chips stacked vertically.
// ELK cross-board layout is intentionally omitted for v1; initial positions
// already produce the reference screenshot.

import type { Node, Edge } from '@vue-flow/core';

const CHIP_W = 48, CHIP_H = 48;
const BIG_W  = 48, BIG_H  = 48;
const MUX_H  = 48, BUS_H  = 22;
const PAD       = 40;
const LABEL_H   = 24;
const H_GAP     = 14;
const V_GAP     = 60;
const BUS_MUX_V = 12;
const COLS      = 8;

function pxNum(v: unknown, fallback: number): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = parseFloat(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

export function computeAutoLayout(nodes: Node[], edges: Edge[]): Node[] {
  const edgeMap = new Map<string, string[]>();
  for (const e of edges) {
    if (!edgeMap.has(e.source)) edgeMap.set(e.source, []);
    edgeMap.get(e.source)!.push(e.target);
  }

  const byBoard = new Map<string, Node[]>();
  for (const n of nodes) {
    if (n.type === 'group') continue;
    const pid = (n as Node & { parentNode?: string }).parentNode ?? '__root__';
    if (!byBoard.has(pid)) byBoard.set(pid, []);
    byBoard.get(pid)!.push(n);
  }

  const nodeUpdates = new Map<string, Partial<Node>>();

  for (const [boardId, boardNodes] of byBoard) {
    const boardNode = nodes.find((n) => n.id === boardId);
    if ((boardNode as Node & { parentNode?: string })?.parentNode) continue;

    const buses  = boardNodes.filter((n) => n.type === 'bus' || n.type === 'smbus');
    const muxes  = boardNodes.filter((n) => n.type === 'mux');
    const chips  = boardNodes.filter((n) => n.type === 'chip' || n.type === 'bigchip');

    const placed = new Set<string>();
    let currentY = PAD + LABEL_H;

    let maxRight = 0, maxBottom = 0;
    const track = (x: number, y: number, w: number, h: number) => {
      maxRight  = Math.max(maxRight,  x + w);
      maxBottom = Math.max(maxBottom, y + h);
    };

    // include any sub-group nodes in bounds
    for (const n of nodes) {
      if (n.type !== 'group' || (n as Node & { parentNode?: string }).parentNode !== boardId) continue;
      const nw = pxNum((n.style as { width?: unknown })?.width, 100);
      const nh = pxNum((n.style as { height?: unknown })?.height, 60);
      track(n.position.x, n.position.y, nw, nh);
    }

    for (const bus of buses) {
      const busChildren = edgeMap.get(bus.id) ?? [];
      const connectedMux = muxes.find((m) => busChildren.includes(m.id) && !placed.has(m.id));
      const muxChildren  = connectedMux ? (edgeMap.get(connectedMux.id) ?? []) : [];

      const rowChips = chips.filter(
        (c) => (busChildren.includes(c.id) || muxChildren.includes(c.id)) && !placed.has(c.id),
      );

      const hasBig = rowChips.some((c) => c.type === 'bigchip');
      const cw = hasBig ? BIG_W : CHIP_W;
      const ch = hasBig ? BIG_H : CHIP_H;

      const chipRows: Node[][] = [];
      for (let i = 0; i < rowChips.length; i += COLS) chipRows.push(rowChips.slice(i, i + COLS));
      if (chipRows.length === 0) chipRows.push([]);

      const maxRowLen = Math.max(1, ...chipRows.map((r) => r.length));
      const chipsW = maxRowLen * cw + Math.max(0, maxRowLen - 1) * H_GAP;
      const chipsX0 = PAD;

      nodeUpdates.set(bus.id, { position: { x: PAD, y: currentY } });
      placed.add(bus.id);
      const busW = (bus.data as { nodeWidth?: number }).nodeWidth ?? 80;
      track(PAD, currentY, busW, BUS_H);

      const muxY = currentY + BUS_H + BUS_MUX_V;
      if (connectedMux) {
        const handleCount = chipRows[0]?.length ?? 4;
        const muxX = chipsX0 + Math.max(0, chipsW / 2 - MUX_H / 2);
        nodeUpdates.set(connectedMux.id, {
          position: { x: muxX, y: muxY },
          style: { ...(connectedMux.style ?? {}), width: `${MUX_H}px`, height: `${MUX_H}px` },
          data: { ...(connectedMux.data as object), handleCount },
        });
        placed.add(connectedMux.id);
        track(muxX, muxY, MUX_H, MUX_H);
      }

      const afterMuxY = connectedMux ? muxY + MUX_H : currentY + BUS_H;
      let chipsY = afterMuxY + V_GAP;
      for (const row of chipRows) {
        if (row.length === 0) continue;
        const rowCH = row.some((c) => c.type === 'bigchip') ? BIG_H : CHIP_H;
        row.forEach((chip, i) => {
          const cx = chipsX0 + i * (cw + H_GAP);
          nodeUpdates.set(chip.id, { position: { x: cx, y: chipsY } });
          placed.add(chip.id);
          track(cx, chipsY, cw, ch);
        });
        chipsY += rowCH + V_GAP;
      }
      currentY = chipsY;
    }

    // unplaced nodes
    let rx = PAD;
    for (const n of boardNodes) {
      if (placed.has(n.id)) continue;
      const nw = n.type === 'mux' ? 72 : n.type === 'bigchip' ? BIG_W : CHIP_W;
      const nh = n.type === 'mux' ? MUX_H : n.type === 'bigchip' ? BIG_H
               : (n.type === 'chip' ? CHIP_H : BUS_H);
      nodeUpdates.set(n.id, { position: { x: rx, y: currentY } });
      track(rx, currentY, nw, nh);
      rx += nw + H_GAP;
    }

    if (boardNode) {
      nodeUpdates.set(boardId, {
        style: {
          ...(boardNode.style ?? {}),
          width: `${maxRight + PAD}px`,
          height: `${maxBottom + PAD}px`,
        },
      });
    }
  }

  return nodes.map((n) => {
    const upd = nodeUpdates.get(n.id);
    return upd ? { ...n, ...upd } : n;
  });
}
