// ── 用真实 .sr 播种告警配置 ────────────────────────────────────────────────
// 把一份板卡 .sr 里已配置的「门限传感器 → 事件」链路映射成告警视图的 SensorCfg，
// 使板卡首次打开告警 tab 时就带出真实数据（而非空白）。
// 说明：当前映射聚焦「门限量」（温度类，映射干净）；离散量/电压轨的完整映射依赖
// mock 器件模型与 .sr schema 的进一步统一，暂只导入门限传感器（并记录跳过数）。
import { parseSr, sensorChains } from '../data/srParser';
import type { SensorCfg, EvItem, ThrKey } from './alarmStore';

// 打包进构建的样例 .sr（真实数据）。key = Unit.Name（板卡名）。
import expBoard1Sr from '../data/samples/ExpBoard_1_920s.sr?raw';

const SAMPLE_SR: string[] = [expBoard1Sr as unknown as string];

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

export interface SrSeedResult { cfgs: SensorCfg[]; skipped: number; }

/** 由 boardName 找到匹配 .sr 并解析出 SensorCfg（找不到则空）。 */
export function seedCfgsForBoard(boardName: string): SrSeedResult {
  for (const text of SAMPLE_SR) {
    let doc;
    try { doc = parseSr(text); } catch { continue; }
    if (doc.unit.name !== boardName) continue;
    const chains = sensorChains(doc.objects);
    const cfgs: SensorCfg[] = [];
    let skipped = 0; let n = 0; let ev = 0;
    for (const ch of chains) {
      // 只导入真实传感器对象（排除因事件引用产生的占位链路）
      if (!/^(ThresholdSensor|DiscreteSensor)_/.test(ch.name)) { skipped++; continue; }
      const name = ch.name.replace(/^(ThresholdSensor|DiscreteSensor)_/, '');
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
          // railKey=传感器名 → 区分同板多个门限传感器（Inlet/Outlet），并作显示标签
          id: `sr:${name}`, deviceKey: 'Temp_Board', deviceLabel: '单板温度',
          quantityKey: 'temperature', railKey: name, railLabel: name,
          dsMode: 'device-field', dsChip: '', dsOffset: 0, dsMask: 255, dsSize: 1, periodMs: 1000,
          thresholds: { ...ch.thresholds }, hysteresis: 2, events, enabled: true,
        });
        n++;
      } else if (ch.kind === 'discrete') {
        // 离散状态传感器：归到「系统状态」器件，用通用 sr_state 量
        const events: EvItem[] = ch.events.map((e) => ({
          id: `e${++ev}`, suffix: '', label: e.eventKeyId.split('.').pop() || '状态命中',
          severity: severityOf(e.eventKeyId), operatorId: 5,
          levelField: undefined, condition: e.condition ?? 1, eventKeyId: e.eventKeyId, enabled: true,
        }));
        cfgs.push({
          id: `sr:${name}`, deviceKey: 'System', deviceLabel: '系统状态',
          quantityKey: 'sr_state', railKey: name, railLabel: name,
          dsMode: 'device-field', dsChip: '', dsOffset: 0, dsMask: 255, dsSize: 1, periodMs: 8000,
          thresholds: {}, hysteresis: 0, events, enabled: true,
        });
        n++;
      } else { skipped++; }
    }
    return { cfgs, skipped };
  }
  return { cfgs: [], skipped: 0 };
}
