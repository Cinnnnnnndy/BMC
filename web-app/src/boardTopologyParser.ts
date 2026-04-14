import type { BoardTopologyCard, BoardTopologyLink, BoardTopologyModel, CSRDocument } from './types';

function guessBoardFromConnector(connectorName: string): string {
  const stripped = connectorName.replace(/^Connector_/, '');
  const m = stripped.match(/^([A-Za-z]+)_?(\d+)?/);
  if (!m) return stripped || 'UnknownBoard';
  const type = m[1].toUpperCase();
  const idx = m[2] || '1';
  return `${type}_${idx}`;
}

function classifyBus(name: string): string {
  if (name.startsWith('I2cMux')) return 'I2cMux';
  if (name.startsWith('I2c')) return 'I2c';
  if (name.startsWith('Jtag')) return 'Jtag';
  if (name.startsWith('Hisport')) return 'Hisport';
  if (name.startsWith('Gpio')) return 'Gpio';
  return 'Other';
}

function firstRefObject(expr: unknown): string | null {
  if (typeof expr !== 'string') return null;
  const m = expr.match(/#\/([A-Za-z0-9_]+)/);
  if (m) return m[1];
  const m2 = expr.match(/<=\/([A-Za-z0-9_]+)/);
  return m2 ? m2[1] : null;
}

function findRefChipCandidates(obj: Record<string, unknown>, chipBus: Map<string, string>): string[] {
  const out: string[] = [];
  for (const val of Object.values(obj)) {
    const ref = firstRefObject(val);
    if (ref && chipBus.has(ref) && !out.includes(ref)) out.push(ref);
  }
  return out;
}

export function parseBoardTopologyFromCsr(csr: CSRDocument, modelName: string): BoardTopologyModel {
  const objects = csr.Objects || {};
  const mt = csr.ManagementTopology || { Anchor: { Buses: [] } };

  const boardMap = new Map<string, BoardTopologyCard>();
  const links: BoardTopologyLink[] = [];
  const chipBus = new Map<string, string>();
  const connectorToBoard = new Map<string, string>();
  const busConnectors = new Map<string, string[]>();

  const ensureBoard = (boardInstance: string, boardType?: string): BoardTopologyCard => {
    const existing = boardMap.get(boardInstance);
    if (existing) return existing;
    const card: BoardTopologyCard = {
      boardType: boardType || boardInstance.replace(/_.*/, ''),
      boardInstance,
      sourceFile: 'Loaded CSR',
      buses: [],
      connectors: [],
      devices: [],
    };
    boardMap.set(boardInstance, card);
    return card;
  };

  const root = ensureBoard('RootBoard', 'Root');

  for (const [key, val] of Object.entries(mt)) {
    if (key === 'Anchor' || !val) continue;
    const busClass = classifyBus(key);
    const connectors = (val.Connectors || []) as string[];
    const chips = (val.Chips || []) as string[];
    connectors.forEach((c) => {
      const list = busConnectors.get(key) || [];
      list.push(c);
      busConnectors.set(key, list);
    });
    chips.forEach((chip) => chipBus.set(chip, key));
    if (!root.buses.find((b) => b.name === key)) root.buses.push({ name: key, busClass });
  }

  for (const [name, raw] of Object.entries(objects)) {
    const obj = raw as Record<string, unknown>;
    if (!name.startsWith('Connector_')) continue;
    const board = guessBoardFromConnector(name);
    const boardCard = ensureBoard(board);
    connectorToBoard.set(name, board);
    const buses = Array.isArray(obj.Buses) ? (obj.Buses as string[]) : [];
    boardCard.connectors.push({
      name,
      type: typeof obj.Type === 'string' ? (obj.Type as string) : undefined,
      slot: typeof obj.Slot === 'number' || typeof obj.Slot === 'string' ? (obj.Slot as number | string) : undefined,
      silkText: typeof obj.SilkText === 'string' ? (obj.SilkText as string) : undefined,
      buses,
    });
    buses.forEach((b) => {
      if (!boardCard.buses.find((x) => x.name === b)) boardCard.buses.push({ name: b, busClass: classifyBus(b) });
      links.push({ fromBoard: 'RootBoard', viaConnector: name, toBoard: board, viaBus: b });
    });
  }

  for (const [name, raw] of Object.entries(objects)) {
    const obj = raw as Record<string, unknown>;
    let type: BoardTopologyCard['devices'][number]['type'] = 'Other';
    const upName = name.toUpperCase();
    if (name.startsWith('Chip_')) type = 'Chip';
    else if (name.startsWith('Scanner_')) type = 'Scanner';
    else if (name.startsWith('Event_')) type = 'Event';
    else if (name.startsWith('ThresholdSensor_')) type = 'ThresholdSensor';
    else if (name.startsWith('Component_')) type = 'Component';
    else if (name.startsWith('Eeprom_')) type = 'Chip';
    // Riser/IEU 内部常见的 I2c 扩展器件/芯片（文档示例中 Pca9545/Pca9555/Eeprom）
    else if (upName.startsWith('PCA9545_') || upName.startsWith('PCA9555_')) type = 'Component';
    else if (upName.startsWith('I2CMUX_')) type = 'Component';
    // 兼容更多器件前缀：SMC/LM75/PCIe（有些 CSR 里不会使用 Chip_/ThresholdSensor_/Component_ 前缀）
    else if (upName.startsWith('SMC_')) type = 'Chip';
    else if (upName.startsWith('LM75_')) type = 'ThresholdSensor';
    else if (upName.startsWith('PCIE_') || upName.startsWith('PCIe_')) type = 'Component';
    else continue;

    let refBus: string | null = null;
    let refConnector: string | null = null;
    let board = 'RootBoard';

    if (type === 'Chip') {
      refBus = chipBus.get(name) || null;
      const cs = refBus ? busConnectors.get(refBus) || [] : [];
      if (cs.length) {
        refConnector = cs[0];
        board = connectorToBoard.get(refConnector) || 'RootBoard';
      }
    } else {
      // 1) 先尝试“直接引用”字段：Chip / RefChip / RefSmcChip / RefSMCChip 等（统一用 firstRefObject 从字符串里抽取）
      const chipRefCandidates = findRefChipCandidates(obj, chipBus);
      const chipRef = chipRefCandidates[0] || firstRefObject(obj.Chip);
      if (chipRef) {
        refBus = chipBus.get(chipRef) || null;
      } else {
        // 2) 兼容 Reading 指向 chip 的情况
        const readingRef = firstRefObject(obj.Reading);
        if (readingRef && chipBus.has(readingRef)) refBus = chipBus.get(readingRef) || null;
      }
      if (refBus) {
        const cs = busConnectors.get(refBus) || [];
        if (cs.length) {
          refConnector = cs[0];
          board = connectorToBoard.get(refConnector) || 'RootBoard';
        }
      }
      const componentRef = firstRefObject(obj.Component);
      if (!refConnector && componentRef?.startsWith('Connector_')) {
        refConnector = componentRef;
        board = connectorToBoard.get(componentRef) || board;
      }
    }

    const card = ensureBoard(board);
    card.devices.push({ type, name, refBus, refConnector });
  }

  return {
    name: modelName,
    boards: Array.from(boardMap.values()),
    links,
  };
}

