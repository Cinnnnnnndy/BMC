export const TAISHAN_CODE_MAP: Record<string, string> = {
  Root: '01',
  EXU: '0101',
  BCU: '010101',
  Riser: '01010103',
  SDI: '0101010305',
  CLU: '010103',
  SEU: '010102',
  NIC: '010105',
};

export const TAISHAN_NODE_POS: Record<string, { left: number; top: number }> = {
  Root: { left: 40, top: 148 },
  EXU: { left: 250, top: 148 },
  BCU: { left: 440, top: 148 },
  Riser: { left: 650, top: 148 },
  SDI: { left: 860, top: 148 },
  CLU: { left: 440, top: 38 },
  SEU: { left: 440, top: 278 },
  NIC: { left: 440, top: 408 },
};

export const TAISHAN_GRAPH_ORDER = ['Root', 'EXU', 'BCU', 'Riser', 'SDI', 'CLU', 'SEU', 'NIC'] as const;

export interface TaishanLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  arrow?: boolean;
}

export const TAISHAN_EDGE_LINES: TaishanLine[] = [
  { x1: 180, y1: 190, x2: 250, y2: 190, arrow: true },
  { x1: 390, y1: 190, x2: 440, y2: 190, arrow: true },
  { x1: 580, y1: 190, x2: 650, y2: 190, arrow: true },
  { x1: 790, y1: 190, x2: 860, y2: 190, arrow: true },

  { x1: 485, y1: 190, x2: 485, y2: 60 },
  { x1: 485, y1: 190, x2: 485, y2: 320 },
  { x1: 485, y1: 190, x2: 485, y2: 450 },

  { x1: 485, y1: 80, x2: 440, y2: 80, arrow: true },
  { x1: 485, y1: 320, x2: 440, y2: 320, arrow: true },
  { x1: 485, y1: 450, x2: 440, y2: 450, arrow: true },
];

export function getTaishanPopoverPos(
  nodeKey: string,
  popWidth = 280,
  popHeight = 300
): { left: number; top: number; side: 'left' | 'right' } {
  const pos = TAISHAN_NODE_POS[nodeKey] || { left: 440, top: 148 };
  const stageWidth = 980;
  const stageHeight = 520;
  const gap = 10;
  const nodeWidth = 140;
  const nodeHeight = 84;
  let side: 'left' | 'right' = 'right';

  let left = pos.left + nodeWidth + gap;
  if (left + popWidth > stageWidth - 8) {
    left = pos.left - popWidth - gap;
    side = 'left';
  }
  if (left < 8) left = 8;

  let top = pos.top - 8;
  if (top + popHeight > stageHeight - 8) {
    top = pos.top + nodeHeight - popHeight;
  }
  if (top < 8) top = 8;

  return { left, top, side };
}

