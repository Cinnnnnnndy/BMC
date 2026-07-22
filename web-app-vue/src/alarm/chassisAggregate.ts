// ── 整机（Chassis）层聚合 ──────────────────────────────────────────────────
// 整机层 = 跨板总览 + 机箱级事件 + 一致性，不做逐条编辑。
//   机箱级事件：EventKeyId 命名空间以 `Chassis.` 开头（天然不属某一块板，由机箱主板 EXU 承载）。
//   数据来自多板演示集样例 .sr（硬件+_soft 合并），按 Unit.Name 标注来源板。
import { allParsedBoards, type ParsedBoard } from './srSeed';
import { sensorChains, objectType } from '../data/srParser';

// 各板数据源模型（分析结论）：温度走 LM75、其余走 SMC 扫描；SEU 走存储固件；PSU 走 PMBus 器件。
const SOURCE_MODEL: Record<string, string> = {
  EXU: 'SMC 扫描 + LM75', CLU: 'SMC 扫描', SEU: 'RAID / 存储固件',
  PSU: 'PMBus 器件', BCU: 'SMC 扫描', PSR: 'PMBus 器件',
};

function severityOf(keyId: string): 'min' | 'maj' | 'crit' {
  if (/Fail|Nonrecoverable|Fatal/i.test(keyId)) return 'crit';
  if (/Major|Critical/i.test(keyId)) return 'maj';
  return 'min';
}

// ── 各板明细（真实 .sr 直读）────────────────────────────────────────────────
export interface BoardRollup {
  name: string; type: string; chips: number;
  thresholdSensors: number; discreteSensors: number;
  events: number; chassisEvents: number; sourceModel: string;
}
function rollupOne(pb: ParsedBoard): BoardRollup {
  let thr = 0, disc = 0, events = 0, chassisEvents = 0;
  for (const [name, obj] of Object.entries(pb.objects)) {
    const t = objectType(name);
    if (t === 'ThresholdSensor') thr++;
    else if (t === 'DiscreteSensor') disc++;
    else if (t === 'Event') {
      events++;
      const kid = typeof obj.EventKeyId === 'string' ? obj.EventKeyId : '';
      if (/^Chassis\./.test(kid)) chassisEvents++;
    }
  }
  return {
    name: pb.unitName, type: pb.unitType, chips: pb.chips.length,
    thresholdSensors: thr, discreteSensors: disc, events, chassisEvents,
    sourceModel: SOURCE_MODEL[pb.unitType] || '—',
  };
}
export function boardRollup(): BoardRollup[] {
  return allParsedBoards().map(rollupOne);
}

// ── 机箱级事件（Chassis.* · 跨板）───────────────────────────────────────────
export interface ChassisEvent { board: string; keyId: string; name: string; severity: 'min' | 'maj' | 'crit'; }
export function chassisEvents(): ChassisEvent[] {
  const out: ChassisEvent[] = [];
  for (const pb of allParsedBoards()) {
    for (const [name, obj] of Object.entries(pb.objects)) {
      if (objectType(name) !== 'Event') continue;
      const kid = typeof obj.EventKeyId === 'string' ? obj.EventKeyId : '';
      if (!/^Chassis\./.test(kid)) continue;
      out.push({ board: pb.unitName, keyId: kid, name: kid.replace(/^Chassis\./, ''), severity: severityOf(kid) });
    }
  }
  return out;
}

// ── 机箱级传感器（门限，带阈值 —— 供一致性核对）────────────────────────────
export interface ChassisSensor {
  board: string; name: string; kind: 'threshold' | 'discrete';
  thresholds: Record<string, number>;
  events: { eventKeyId: string; level?: string }[];
}
export function chassisSensors(): ChassisSensor[] {
  const out: ChassisSensor[] = [];
  for (const pb of allParsedBoards()) {
    for (const ch of sensorChains(pb.objects)) {
      if (!ch.events.some((e) => /^Chassis\./.test(e.eventKeyId))) continue;
      out.push({
        board: pb.unitName,
        name: ch.name.replace(/^ThresholdSensor_|^DiscreteSensor_/, ''),
        kind: ch.kind,
        thresholds: ch.thresholds,
        events: ch.events.map((e) => ({ eventKeyId: e.eventKeyId, level: e.level })),
      });
    }
  }
  return out;
}

/** 一致性：同名机箱级传感器在多块板出现且门限不一致时给出告警项。 */
export interface Inconsistency { name: string; field: string; values: { board: string; value: number }[]; }
export function thresholdInconsistencies(): Inconsistency[] {
  const byName = new Map<string, ChassisSensor[]>();
  for (const s of chassisSensors()) (byName.get(s.name) ?? byName.set(s.name, []).get(s.name)!).push(s);
  const out: Inconsistency[] = [];
  for (const [name, list] of byName) {
    if (list.length < 2) continue;
    const fields = new Set<string>();
    list.forEach((s) => Object.keys(s.thresholds).forEach((f) => fields.add(f)));
    for (const f of fields) {
      const vals = list.map((s) => ({ board: s.board, value: s.thresholds[f] })).filter((v) => v.value != null);
      if (vals.length > 1 && new Set(vals.map((v) => v.value)).size > 1) out.push({ name, field: f, values: vals });
    }
  }
  return out;
}
