// ── 用真实 .sr 播种告警配置 + 物理器件（芯片）模型 ─────────────────────────
// 把一份板卡 .sr（硬件 + _soft 软件，字段级合并）里已配置的「传感器 → 事件」链路
// 映射成告警视图的 SensorCfg，并把每个传感器绑到它真实的数据源芯片（Reading→Scanner.Chip）。
// ⇒ 板卡首次打开告警 tab 就带真实数据；器件面板按「数据源芯片」收窄视图。
import { parseSr, mergeObjects, sensorChains, boardChips, sensorChipMap, type SrChip } from '../data/srParser';
import type { SensorCfg, EvItem, ThrKey } from './alarmStore';

// 打包进构建的样例 .sr（真实数据）。硬件文件带门限/EventKeyId/Condition/Scanner.Chip；
// _soft 带 Reading/OperatorId/Component —— 两者按对象名字段级合并后才完整。
import expBoard1Hw   from '../data/samples/ExpBoard_1_920s.sr?raw';
import expBoard1Soft from '../data/samples/ExpBoard_1_920s_soft.sr?raw';

interface SrPair { hw: string; soft?: string }
// key = Unit.Name（板卡名）
const SR_PAIRS: SrPair[] = [
  { hw: expBoard1Hw as unknown as string, soft: expBoard1Soft as unknown as string },
];

const VALID_LEVELS: ThrKey[] = ['UpperNonrecoverable', 'UpperCritical', 'UpperNoncritical', 'LowerNoncritical', 'LowerCritical'];
const ZH: Record<string, string> = {
  UpperNoncritical: '预警(上)', UpperCritical: '严重(上)', UpperNonrecoverable: '不可恢复(上)',
  LowerNoncritical: '预警(下)', LowerCritical: '严重(下)',
};
function severityOf(eventKeyId: string): EvItem['severity'] {
  if (/Nonrecoverable|Fatal|Fail/i.test(eventKeyId)) return 'Critical';
  if (/Major|Critical/i.test(eventKeyId)) return 'Major';
  return 'Minor';
}

/** 解析一份板卡 .sr（硬件+软件合并），带缓存。 */
export interface ParsedBoard {
  unitName: string; unitType: string;
  objects: Record<string, Record<string, unknown>>;
  chips: SrChip[];
  chipMap: Record<string, string>; // 传感器名 → 数据源芯片名
}
const boardCache = new Map<string, ParsedBoard | null>();
function parsePair(p: SrPair): ParsedBoard | null {
  try {
    const hwDoc = parseSr(p.hw);
    const objects = p.soft ? mergeObjects(hwDoc.objects, parseSr(p.soft).objects) : hwDoc.objects;
    return {
      unitName: hwDoc.unit.name, unitType: hwDoc.unit.type,
      objects, chips: boardChips(hwDoc), chipMap: sensorChipMap(objects),
    };
  } catch { return null; }
}
export function parsedBoard(boardName: string): ParsedBoard | null {
  if (boardCache.has(boardName)) return boardCache.get(boardName)!;
  let found: ParsedBoard | null = null;
  for (const p of SR_PAIRS) {
    const pb = parsePair(p);
    if (pb && pb.unitName === boardName) { found = pb; break; }
  }
  boardCache.set(boardName, found);
  return found;
}

/** 该板真实物理器件（芯片）列表 + 每个芯片承载的传感器数（供本板器件列表）。 */
export interface ChipDevice extends SrChip { sensorCount: number }
export function boardChipDevices(boardName: string): ChipDevice[] {
  const pb = parsedBoard(boardName);
  if (!pb) return [];
  const cnt: Record<string, number> = {};
  for (const chip of Object.values(pb.chipMap)) cnt[chip] = (cnt[chip] || 0) + 1;
  return pb.chips.map((c) => ({ ...c, sensorCount: cnt[c.name] || 0 }));
}

export interface SrSeedResult { cfgs: SensorCfg[]; skipped: number; }

/** 由 boardName 找到匹配 .sr 并解析出 SensorCfg（找不到则空）。每条绑定真实数据源芯片。 */
export function seedCfgsForBoard(boardName: string): SrSeedResult {
  const pb = parsedBoard(boardName);
  if (!pb) return { cfgs: [], skipped: 0 };
  const chains = sensorChains(pb.objects);
  const cfgs: SensorCfg[] = [];
  let skipped = 0; let ev = 0;
  for (const ch of chains) {
    if (!/^(ThresholdSensor|DiscreteSensor)_/.test(ch.name)) { skipped++; continue; }
    const name = ch.name.replace(/^(ThresholdSensor|DiscreteSensor)_/, '');
    const dsChip = pb.chipMap[ch.name] || '';
    if (ch.kind === 'threshold' && Object.keys(ch.thresholds).length > 0) {
      const events: EvItem[] = ch.events.map((e) => {
        const lf = e.level && (VALID_LEVELS as string[]).includes(e.level) ? e.level as ThrKey : undefined;
        return {
          id: `e${++ev}`, suffix: '', label: lf ? ZH[lf] : (e.eventKeyId.split('.').pop() || '事件'),
          severity: severityOf(e.eventKeyId),
          operatorId: lf ? (lf.startsWith('Upper') ? 4 : 1) : 4,
          levelField: lf, condition: e.condition ?? 1, eventKeyId: e.eventKeyId, enabled: true,
        };
      });
      cfgs.push({
        id: `sr:${name}`, deviceKey: 'Temp_Board', deviceLabel: '单板温度',
        quantityKey: 'temperature', railKey: name, railLabel: name,
        dsMode: dsChip ? 'scanner' : 'device-field', dsChip, dsOffset: 0, dsMask: 255, dsSize: 1, periodMs: 1000,
        thresholds: { ...ch.thresholds }, hysteresis: 2, events, enabled: true,
      });
    } else if (ch.kind === 'discrete') {
      const events: EvItem[] = ch.events.map((e) => ({
        id: `e${++ev}`, suffix: '', label: e.eventKeyId.split('.').pop() || '状态命中',
        severity: severityOf(e.eventKeyId), operatorId: 5,
        levelField: undefined, condition: e.condition ?? 1, eventKeyId: e.eventKeyId, enabled: true,
      }));
      cfgs.push({
        id: `sr:${name}`, deviceKey: 'System', deviceLabel: '系统状态',
        quantityKey: 'sr_state', railKey: name, railLabel: name,
        dsMode: dsChip ? 'scanner' : 'device-field', dsChip, dsOffset: 0, dsMask: 255, dsSize: 1, periodMs: 8000,
        thresholds: {}, hysteresis: 0, events, enabled: true,
      });
    } else { skipped++; }
  }
  return { cfgs, skipped };
}
