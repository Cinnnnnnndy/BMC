// ── 整机（Chassis）层聚合 ──────────────────────────────────────────────────
// 整机层 = 跨板总览 + 机箱级传感器 + 一致性，不做逐条编辑。
//   机箱级传感器：事件 EventKeyId 命名空间以 `Chassis.` 开头（天然不属某一块板）。
//   数据来自所有样例 .sr（?raw 打包），按 Unit.Name 标注来源板。
import { parseSr, sensorChains } from '../data/srParser';
import expBoard1Sr from '../data/samples/ExpBoard_1_920s.sr?raw';

const SAMPLES: string[] = [expBoard1Sr as unknown as string];

export interface ChassisSensor {
  board: string; name: string; kind: 'threshold' | 'discrete';
  thresholds: Record<string, number>;
  events: { eventKeyId: string; level?: string }[];
}

/** 跨所有样例 .sr 收集机箱级（Chassis.*）传感器链路。 */
export function chassisSensors(): ChassisSensor[] {
  const out: ChassisSensor[] = [];
  for (const text of SAMPLES) {
    let doc;
    try { doc = parseSr(text); } catch { continue; }
    for (const ch of sensorChains(doc.objects)) {
      if (!ch.events.some((e) => /^Chassis\./.test(e.eventKeyId))) continue;
      out.push({
        board: doc.unit.name,
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
