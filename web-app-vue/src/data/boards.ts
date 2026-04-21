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
