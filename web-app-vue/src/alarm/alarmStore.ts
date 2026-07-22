// ── 告警配置共享 store（per-board）────────────────────────────────────────
// 把「板卡级」与「器件级」告警配置收敛到同一份 per-board 状态：
//   板卡面板的告警 tab 与 器件面板的告警 tab 读写同一个 board 的 cfgs（器件级只是按 deviceKey 过滤视图）。
//   ⇒ 器件级改动板卡级立刻可见，反之亦然（同源不同 scope）。
// 计数器（uidN/evSeq）也随 board 走，避免不同面板实例重挂后 id 冲突。
import { reactive } from 'vue';

export type ThrKey = 'UpperNoncritical' | 'UpperCritical' | 'UpperNonrecoverable' | 'LowerNoncritical' | 'LowerCritical';
export interface EvItem {
  id: string; suffix: string; label: string;
  severity: 'Minor' | 'Major' | 'Critical'; operatorId: number;
  levelField?: ThrKey; condition: number; eventKeyId: string; enabled: boolean;
}
export interface SensorCfg {
  id: string; deviceKey: string; deviceLabel: string; quantityKey: string;
  railKey?: string; railLabel?: string;
  dsMode: 'device-field' | 'scanner';
  dsChip: string; dsOffset: number; dsMask: number; dsSize: number; periodMs: number;
  thresholds: Record<string, number>;
  hysteresis: number; events: EvItem[]; enabled: boolean;
}

export interface BoardAlarm { cfgs: SensorCfg[]; uidN: number; evSeq: number; loaded: boolean; }

const store = reactive<Record<string, BoardAlarm>>({});

/** 取（或建）某板卡的告警状态。boardKey 用板卡显示名。 */
export function boardAlarm(boardKey: string): BoardAlarm {
  if (!store[boardKey]) store[boardKey] = { cfgs: [], uidN: 0, evSeq: 0, loaded: false };
  return store[boardKey];
}
export function nextUid(boardKey: string): string { return `e${++boardAlarm(boardKey).uidN}`; }
export function nextEvSeq(boardKey: string): number { return ++boardAlarm(boardKey).evSeq; }
