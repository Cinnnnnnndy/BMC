// Generated from vpd-main/vendor/openUBMC. Re-run `node scripts/gen-boards.mjs`
// with OPENUBMC_DIR=/absolute/path pointing at the folder to refresh.
//
// Each record = one physical board (the .sr / _soft.sr pair collapsed into one).

export interface BoardRecord {
  /** partNumber + '_' + sn */
  id: string;
  partNumber: string;
  sn: string;
  /** Unit.Type from the .sr file, or 'Unknown' */
  type: string;
  /** Unit.Name from the .sr file, or 'Unknown' */
  name: string;
  /** Source filenames (hardware + software descriptors) */
  files: string[];
}

export const BOARDS: BoardRecord[] = [
  { id: '14060876_00000001020302031825', partNumber: '14060876', sn: '00000001020302031825', type: 'BCU', name: 'CpuBoard_1', files: ["14060876_00000001020302031825.sr","14060876_00000001020302031825_soft.sr"] },
  { id: '14100363_00000001050302023924', partNumber: '14100363', sn: '00000001050302023924', type: 'CLU', name: 'FanBoard_1', files: ["14100363_00000001050302023924.sr","14100363_00000001050302023924_soft.sr"] },
  { id: '14100513_00000001010302044491', partNumber: '14100513', sn: '00000001010302044491', type: 'EXU', name: 'ExpBoard_1', files: ["14100513_00000001010302044491.sr","14100513_00000001010302044491_soft.sr"] },
  { id: '14100513_00000001010302044492', partNumber: '14100513', sn: '00000001010302044492', type: 'EXU', name: 'ExpBoard_1', files: ["14100513_00000001010302044492.sr","14100513_00000001010302044492_soft.sr"] },
  { id: '14100513_000000010402580311', partNumber: '14100513', sn: '000000010402580311', type: 'IEU', name: 'RiserCard_1', files: ["14100513_000000010402580311.sr","14100513_000000010402580311_soft.sr"] },
  { id: '14100513_000000010402580324', partNumber: '14100513', sn: '000000010402580324', type: 'IEU', name: 'RiserCard_1', files: ["14100513_000000010402580324.sr","14100513_000000010402580324_soft.sr"] },
  { id: '14100513_00000001040302023945', partNumber: '14100513', sn: '00000001040302023945', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302023945.sr","14100513_00000001040302023945_soft.sr"] },
  { id: '14100513_00000001040302023947', partNumber: '14100513', sn: '00000001040302023947', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302023947.sr","14100513_00000001040302023947_soft.sr"] },
  { id: '14100513_00000001040302023953', partNumber: '14100513', sn: '00000001040302023953', type: 'Unknown', name: 'Unknown', files: ["14100513_00000001040302023953.sr","14100513_00000001040302023953_soft.sr"] },
  { id: '14100513_00000001040302025554', partNumber: '14100513', sn: '00000001040302025554', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302025554.sr","14100513_00000001040302025554_soft.sr"] },
  { id: '14100513_00000001040302044498', partNumber: '14100513', sn: '00000001040302044498', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302044498.sr","14100513_00000001040302044498_soft.sr"] },
  { id: '14100513_00000001040302044499', partNumber: '14100513', sn: '00000001040302044499', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302044499.sr","14100513_00000001040302044499_soft.sr"] },
  { id: '14100513_00000001040302044501', partNumber: '14100513', sn: '00000001040302044501', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302044501.sr","14100513_00000001040302044501_soft.sr"] },
  { id: '14100513_00000001040302044502', partNumber: '14100513', sn: '00000001040302044502', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302044502.sr","14100513_00000001040302044502_soft.sr"] },
  { id: '14100513_00000001040302044504', partNumber: '14100513', sn: '00000001040302044504', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302044504.sr","14100513_00000001040302044504_soft.sr"] },
  { id: '14100513_00000001040302046567', partNumber: '14100513', sn: '00000001040302046567', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302046567.sr","14100513_00000001040302046567_soft.sr"] },
  { id: '14100513_00000001040302046572', partNumber: '14100513', sn: '00000001040302046572', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302046572.sr","14100513_00000001040302046572_soft.sr"] },
  { id: '14100513_00000001040302046574', partNumber: '14100513', sn: '00000001040302046574', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302046574.sr","14100513_00000001040302046574_soft.sr"] },
  { id: '14100513_00000001040302052957', partNumber: '14100513', sn: '00000001040302052957', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302052957.sr","14100513_00000001040302052957_soft.sr"] },
  { id: '14100513_00000001040302066464', partNumber: '14100513', sn: '00000001040302066464', type: 'IEU', name: 'RiserCard_1', files: ["14100513_00000001040302066464.sr","14100513_00000001040302066464_soft.sr"] },
  { id: '14100665_00000001030302023925', partNumber: '14100665', sn: '00000001030302023925', type: 'SEU', name: 'HddBackplane_1', files: ["14100665_00000001030302023925.sr","14100665_00000001030302023925_soft.sr"] },
  { id: '14100665_00000001030302023933', partNumber: '14100665', sn: '00000001030302023933', type: 'SEU', name: 'HddBackplane_1', files: ["14100665_00000001030302023933.sr","14100665_00000001030302023933_soft.sr"] },
  { id: '14100665_00000001030302023934', partNumber: '14100665', sn: '00000001030302023934', type: 'SEU', name: 'HddBackplane_1', files: ["14100665_00000001030302023934.sr","14100665_00000001030302023934_soft.sr"] },
  { id: '14100665_00000001030302023936', partNumber: '14100665', sn: '00000001030302023936', type: 'SEU', name: 'HddBackplane_1', files: ["14100665_00000001030302023936.sr","14100665_00000001030302023936_soft.sr"] },
  { id: '14100665_00000001030302023938', partNumber: '14100665', sn: '00000001030302023938', type: 'SEU', name: 'HddBackplane_1', files: ["14100665_00000001030302023938.sr","14100665_00000001030302023938_soft.sr"] },
  { id: '14100665_00000001030302023954', partNumber: '14100665', sn: '00000001030302023954', type: 'SEU', name: 'M2TransferCard_1', files: ["14100665_00000001030302023954.sr","14100665_00000001030302023954_soft.sr"] },
  { id: '14100665_00000001030302024340', partNumber: '14100665', sn: '00000001030302024340', type: 'SEU', name: 'HddBackplane_1', files: ["14100665_00000001030302024340.sr","14100665_00000001030302024340_soft.sr"] },
  { id: '14100665_00000001030302044496', partNumber: '14100665', sn: '00000001030302044496', type: 'SEU', name: 'HddBackplane_1', files: ["14100665_00000001030302044496.sr","14100665_00000001030302044496_soft.sr"] },
  { id: '14100665_00000001030302046566', partNumber: '14100665', sn: '00000001030302046566', type: 'SEU', name: 'HddBackplane_1', files: ["14100665_00000001030302046566.sr","14100665_00000001030302046566_soft.sr"] },
  { id: '14100665_00000001030302046571', partNumber: '14100665', sn: '00000001030302046571', type: 'SEU', name: 'HddBackplane_1', files: ["14100665_00000001030302046571.sr","14100665_00000001030302046571_soft.sr"] },
  { id: '14220246_00000001100302023955', partNumber: '14220246', sn: '00000001100302023955', type: 'NICCard', name: 'BoardNICCard_1', files: ["14220246_00000001100302023955.sr","14220246_00000001100302023955_soft.sr"] },
  { id: '14220246_00000001100302023956', partNumber: '14220246', sn: '00000001100302023956', type: 'NICCard', name: 'BoardNICCard_1', files: ["14220246_00000001100302023956.sr","14220246_00000001100302023956_soft.sr"] },
  { id: '14220246_00000001100302025549', partNumber: '14220246', sn: '00000001100302025549', type: 'NICCard', name: 'BoardNICCard_1', files: ["14220246_00000001100302025549.sr","14220246_00000001100302025549_soft.sr"] },
];

// ─────────────────────────────────────────────────────────────────────────
// Resolution state — drives how a board group is rendered in the topology.
//
//   resolved           1.1  Unique .sr match. Board drawn normally. Dropdown
//                           stays as a *switcher* (variants of same type).
//   multi-match        1.2  Multiple .sr files matched by Bom+Id+AuxId.
//                           Board rendered as placeholder; dropdown options
//                           are the candidate files (with relative paths).
//   type-placeholder   2.1  IdentifyMode != 2 and Type is known. Board
//                           rendered as type-placeholder; dropdown lists all
//                           boards of that Type.
//   unclassified       2.2  Type missing or unknown. Group is NOT drawn on
//                           canvas — it only appears in the left list, where
//                           the user can assign it to a pending slot.
//   missing            1.3  File referenced by the Connector was not found.
//                           Board drawn with default image + red error label.
//                           (Stays on canvas — does not go to 未分类.)
// ─────────────────────────────────────────────────────────────────────────
export type ResolutionState =
  | 'resolved'
  | 'multi-match'
  | 'type-placeholder'
  | 'unclassified'
  | 'missing';

/** Describes the upstream Connector object that produced this group. */
export interface ConnectorRef {
  /** id of the parent group (BMC / EXU / etc.) that owns the Connector */
  parentGroupId: string;
  /** Connector name from the .sr file, e.g. 'I2c_1', 'HiSport_2', 'JTAG_1' */
  connectorName: string;
  bom?: string;
  id?: string;
  auxId?: string;
  /** 2 → resolve by Bom+Id+AuxId filename. Other values → resolve by Type. */
  identifyMode?: number;
  /** Type field used when IdentifyMode != 2. */
  type?: string;
  /** Bom+Id+AuxId concatenated — what we expected to match. */
  expectedFile?: string;
}

// ─────────────────────────────────────────────────────────────────────────
// Group model used by the mind-map view.
// Boards with the same (type, name) are collapsed into one node; the node
// has a searchable dropdown to switch between variants.
// ─────────────────────────────────────────────────────────────────────────

export interface BoardGroup {
  /** stable id, e.g. 'grp-EXU-ExpBoard_1' or 'grp-Unknown' */
  id: string;
  type: string;       // e.g. 'EXU'
  name: string;       // e.g. 'ExpBoard_1'
  /** Display label shown on the node card (e.g. "EXU · ExpBoard_1") */
  label: string;
  /** Short label (e.g. "EXU") */
  shortLabel: string;
  boards: BoardRecord[];
  /** Category for tree placement */
  category: 'bmc' | 'exu' | 'child' | 'unknown';

  // ── Resolution state (set by classifyGroups) ────────────────────────
  state: ResolutionState;
  /** Upstream Connector that produced this group. */
  connectorRef?: ConnectorRef;
  /** For state='multi-match': candidate .sr files that all matched. */
  fileMatches?: Array<{ file: string; relPath: string }>;
  /** For state='type-placeholder': the pool of boards of the same Type. */
  typeCandidates?: BoardRecord[];
  /** For state='missing': the filename that was expected but not found. */
  missingFile?: string;
}

// Friendly Chinese labels for each board type
export const TYPE_LABEL: Record<string, string> = {
  BCU:      'CPU 板 (BCU)',
  CLU:      '风扇板 (CLU)',
  EXU:      '拓展板 (EXU)',
  IEU:      'Riser 卡 (IEU)',
  SEU:      '存储/转接板 (SEU)',
  NICCard:  '网卡 (NICCard)',
  Unknown:  '未分类板卡',
};

export function groupBoards(boards: BoardRecord[] = BOARDS): BoardGroup[] {
  // Group by (type, name) — distinct names in the same type (e.g.
  // SEU/HddBackplane vs SEU/M2TransferCard) become separate groups.
  const key = (b: BoardRecord) => `${b.type}__${b.name}`;
  const byKey = new Map<string, BoardRecord[]>();
  for (const b of boards) {
    const k = key(b);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(b);
  }

  const groups: BoardGroup[] = [];
  for (const [k, list] of byKey) {
    const t = list[0].type;
    const n = list[0].name;
    const isExu = t === 'EXU';
    const isUnknown = t === 'Unknown';
    const shortLabel = t === 'Unknown' ? '未分类' : t;
    const friendly = TYPE_LABEL[t] ?? t;
    // For EXU: label is just the type-friendly name.
    // For children: append the specific board name.
    const label = isExu
      ? friendly
      : isUnknown
      ? TYPE_LABEL.Unknown
      : `${friendly} · ${n}`;
    groups.push({
      id: `grp-${t}-${n}`.replace(/[^A-Za-z0-9_-]/g, '_'),
      type: t,
      name: n,
      label,
      shortLabel,
      boards: list,
      category: isExu ? 'exu' : isUnknown ? 'unknown' : 'child',
      // Default every real group to 'resolved'. The classifier below may
      // override this and may also *inject* synthetic groups that exercise
      // the other four states for demonstration.
      state: isUnknown ? 'unclassified' : 'resolved',
    });
  }

  // Stable ordering for columns — EXU first among children unused
  // since EXU goes in its own column; here we sort child groups alphabetically
  // by type for deterministic rendering.
  const order = ['BCU', 'CLU', 'IEU', 'SEU', 'NICCard', 'Unknown'];
  groups.sort((a, b) => {
    const ai = order.indexOf(a.type);
    const bi = order.indexOf(b.type);
    if (ai !== bi) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    return a.name.localeCompare(b.name);
  });
  return groups;
}

// ─────────────────────────────────────────────────────────────────────────
// classifyGroups(): assign ResolutionState to every group and inject a few
// synthesized groups so the UI demonstrates all five states.
//
// In a production build this would be driven by the .sr-file parser that
// reads each upstream Connector object (IdentifyMode / Bom / Id / AuxId /
// Type) and looks up the matching file(s) in the board library. For now we
// hand-craft the interesting cases so the UI can be exercised.
// ─────────────────────────────────────────────────────────────────────────

/** Canonical parent group id used by all demo Connector references. */
const DEMO_PARENT = 'grp-EXU-ExpBoard_1';

/**
 * Post-processes groupBoards() output:
 *   1. Enriches existing groups with connector metadata (demo values).
 *   2. Injects demo groups for multi-match / type-placeholder / missing /
 *      unclassified states.
 */
export function classifyGroups(groups: BoardGroup[]): BoardGroup[] {
  // Enrich the BMC → EXU chain with demo Connector info so the right panel
  // has something to show. Real data would come from the .sr parser.
  const enriched = groups.map((g) => {
    if (g.type === 'EXU') {
      return {
        ...g,
        connectorRef: {
          parentGroupId: 'bmc-root',
          connectorName: 'I2c_3',
          bom: g.boards[0]?.partNumber,
          id: '01',
          auxId: '01',
          identifyMode: 2,
          expectedFile: `${g.boards[0]?.partNumber}_${g.boards[0]?.sn}.sr`,
        },
      };
    }
    if (g.category === 'child' && g.state === 'resolved') {
      return {
        ...g,
        connectorRef: {
          parentGroupId: DEMO_PARENT,
          connectorName: `I2c_${(g.type[0] || 'x').toLowerCase()}`,
          bom: g.boards[0]?.partNumber,
          id: '01',
          auxId: '00',
          identifyMode: 2,
          expectedFile: `${g.boards[0]?.partNumber}_${g.boards[0]?.sn}.sr`,
        },
      };
    }
    return g;
  });

  // The pool used by type-placeholder demo is all IEU boards.
  const ieuPool = groups.find((g) => g.type === 'IEU')?.boards ?? [];
  const seuPool = groups.find((g) => g.type === 'SEU')?.boards ?? [];

  // ── Injected demo groups (exercise every state) ─────────────────────
  const demoMultiMatch: BoardGroup = {
    id: 'grp-demo-multimatch',
    type: 'IEU',
    name: 'RiserCard_Demo',
    label: 'Riser 卡 (IEU) · RiserCard_Demo',
    shortLabel: 'IEU',
    boards: ieuPool.length >= 2 ? [ieuPool[0]] : [],
    category: 'child',
    state: 'multi-match',
    connectorRef: {
      parentGroupId: DEMO_PARENT,
      connectorName: 'I2c_4',
      bom: '14100513',
      id: '02',
      auxId: '03',
      identifyMode: 2,
      expectedFile: '14100513_00000001040302_*.sr',
    },
    fileMatches: ieuPool.slice(0, 3).map((b, i) => ({
      file: b.files[0],
      relPath: `./vendor/openUBMC/${['taishan', 'tianchi', 'altas'][i] ?? 'misc'}/`,
    })),
  };

  const demoTypePlaceholder: BoardGroup = {
    id: 'grp-demo-typeplaceholder',
    type: 'SEU',
    name: '待选具体型号',
    label: '存储/转接板 (SEU) · 未指定具体型号',
    shortLabel: 'SEU',
    boards: [],   // No specific board picked yet
    category: 'child',
    state: 'type-placeholder',
    connectorRef: {
      parentGroupId: DEMO_PARENT,
      connectorName: 'I2c_5',
      id: '03',
      auxId: '01',
      identifyMode: 1,
      type: 'SEU',
    },
    typeCandidates: seuPool,
  };

  const demoMissing: BoardGroup = {
    id: 'grp-demo-missing',
    type: 'NICCard',
    name: 'NICCard_Missing',
    label: '网卡 (NICCard) · 文件缺失',
    shortLabel: 'NICCard',
    boards: [],
    category: 'child',
    state: 'missing',
    connectorRef: {
      parentGroupId: DEMO_PARENT,
      connectorName: 'HSP_6',
      bom: '14220247',
      id: '05',
      auxId: '02',
      identifyMode: 2,
      expectedFile: '14220247_00000001100302099999.sr',
    },
    missingFile: '14220247_00000001100302099999.sr',
  };

  const demoUnclassified: BoardGroup = {
    id: 'grp-demo-unclassified',
    type: 'Unknown',
    name: 'MysteryConnector_I2c_7',
    label: '未分类 · I2c_7 下游',
    shortLabel: '未分类',
    boards: [],
    category: 'unknown',
    state: 'unclassified',
    connectorRef: {
      parentGroupId: DEMO_PARENT,
      connectorName: 'I2c_7',
      identifyMode: 1,
      // no Type -> we really don't know
    },
  };

  return [
    ...enriched,
    demoMultiMatch,
    demoTypePlaceholder,
    demoMissing,
    demoUnclassified,
  ];
}

/** True when the group should render on the main canvas. */
export function isOnCanvas(g: BoardGroup): boolean {
  return g.state !== 'unclassified';
}

/** Friendly labels for each resolution state. */
export const STATE_LABEL: Record<ResolutionState, string> = {
  'resolved':         '已解析',
  'multi-match':      '多匹配',
  'type-placeholder': '待选型号',
  'unclassified':     '未分类',
  'missing':          '文件缺失',
};

/** Status colour tokens used across the app. */
export const STATE_COLOR: Record<ResolutionState, string> = {
  'resolved':         '#22c55e',
  'multi-match':      '#f59e0b',
  'type-placeholder': '#eab308',
  'unclassified':     '#6b7280',
  'missing':          '#ef4444',
};
