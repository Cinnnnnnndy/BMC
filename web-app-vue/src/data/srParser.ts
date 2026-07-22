// ── .sr 解析器 ──────────────────────────────────────────────────────────
// openUBMC 板卡配置文件（*.sr）是 JSONC（含 // 行注释）+ 引用语法：
//   "#/Name"            指针引用（指向对象 Name）
//   "#/Name.Field"      引用 Name 的字段
//   "<=/Name.Field"     读绑定（运行时从 Name.Field 取值）
// 顶层：{ FormatVersion, DataVersion, Unit:{Type,Name}, ManagementTopology, Objects }
//
// 本模块把一份 .sr 解析成结构化模型，供「板卡/器件配置面板」与「告警配置」作输入：
//   parseSr(text)      → SrDocument（unit + topology + objects）
//   bucketObjects(...) → 按类型前缀归桶（Accessor/Scanner/ThresholdSensor/Event/…）
//   sensorChains(...)  → 传感器 → 事件 链路（对齐告警视图的「监控对象→传感器→事件」）

export interface SrUnit { type: string; name: string }
export interface SrBus { chips: string[]; connectors: string[] }
export interface SrTopology { anchorBuses: string[]; buses: Record<string, SrBus> }
export type SrObject = Record<string, unknown>;
export interface SrDocument {
  formatVersion: string;
  unit: SrUnit;
  topology: SrTopology;
  objects: Record<string, SrObject>;
}

/** 去掉 JSONC 的 // 行注释（尊重字符串，避免误删 "#/x" / "<=/x" 内的斜杠）。*/
export function stripJsonc(text: string): string {
  let out = '';
  let inStr = false;
  let esc = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      out += c;
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; out += c; continue; }
    if (c === '/' && text[i + 1] === '/') { // 行注释 → 跳到行尾
      while (i < text.length && text[i] !== '\n') i++;
      out += '\n';
      continue;
    }
    if (c === '/' && text[i + 1] === '*') { // 块注释
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
      i++; // 跳过结尾的 '/'
      continue;
    }
    out += c;
  }
  return out;
}

/** 解析一份 .sr 文本 → 结构化文档。*/
export function parseSr(text: string): SrDocument {
  const raw = JSON.parse(stripJsonc(text)) as Record<string, unknown>;
  const unitRaw = (raw.Unit ?? {}) as Record<string, string>;
  const mt = (raw.ManagementTopology ?? {}) as Record<string, unknown>;
  const anchor = (mt.Anchor ?? {}) as Record<string, unknown>;
  const buses: Record<string, SrBus> = {};
  for (const [key, val] of Object.entries(mt)) {
    if (key === 'Anchor' || typeof val !== 'object' || val === null) continue;
    const b = val as Record<string, unknown>;
    buses[key] = {
      chips: Array.isArray(b.Chips) ? (b.Chips as string[]) : [],
      connectors: Array.isArray(b.Connectors) ? (b.Connectors as string[]) : [],
    };
  }
  return {
    formatVersion: String(raw.FormatVersion ?? ''),
    unit: { type: String(unitRaw.Type ?? ''), name: String(unitRaw.Name ?? '') },
    topology: { anchorBuses: Array.isArray(anchor.Buses) ? (anchor.Buses as string[]) : [], buses },
    objects: (raw.Objects ?? {}) as Record<string, SrObject>,
  };
}

/** 对象名 → 类型前缀（下划线前那段），如 "ThresholdSensor_InletTemp" → "ThresholdSensor"。*/
export function objectType(name: string): string {
  const i = name.indexOf('_');
  return i < 0 ? name : name.slice(0, i);
}

/** 按类型前缀把 Objects 的 key 归桶。*/
export function bucketObjects(objects: Record<string, SrObject>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const name of Object.keys(objects)) {
    const t = objectType(name);
    (out[t] ||= []).push(name);
  }
  return out;
}

/** 解析引用串 "<=/Name.Field" / "#/Name.Field" / "#/Name" → { target, field } */
export function parseRef(v: unknown): { target: string; field?: string } | null {
  if (typeof v !== 'string') return null;
  const m = v.match(/^(?:<=|#|>=|=)?\/([A-Za-z0-9_]+)(?:\.([A-Za-z0-9_]+))?$/);
  if (!m) return null;
  return { target: m[1], field: m[2] };
}

const THRESHOLD_FIELDS = [
  'UpperNonrecoverable', 'UpperCritical', 'UpperNoncritical',
  'LowerNoncritical', 'LowerCritical', 'LowerNonrecoverable',
] as const;

export interface SrEventNode {
  name: string;
  eventKeyId: string;
  /** 若 Condition 引用了某门限档位，这里给出档位名（如 UpperCritical）。 */
  level?: string;
  /** 字面触发值（离散量 Condition 为数字时）。 */
  condition?: number;
}
export interface SrSensorChain {
  name: string;
  kind: 'threshold' | 'discrete';
  sensorName?: string;
  thresholds: Record<string, number>;
  /** 数据源芯片（经 Scanner/Accessor 关联到的 Chip），尽力而为。 */
  sourceChip?: string;
  events: SrEventNode[];
}

/**
 * 从 Objects 重建「传感器 → 事件」链路（对齐告警视图）。
 * - 传感器：ThresholdSensor_* / DiscreteSensor_*
 * - 事件：Event_*，其 Condition 引用 "<=/<Sensor>.<Level>" → 归到该传感器该档位；
 *   离散量 Condition 为数字则记为字面触发值。
 */
export function sensorChains(objects: Record<string, SrObject>): SrSensorChain[] {
  const chains = new Map<string, SrSensorChain>();
  // 建传感器节点
  for (const [name, obj] of Object.entries(objects)) {
    const t = objectType(name);
    if (t !== 'ThresholdSensor' && t !== 'DiscreteSensor') continue;
    const thresholds: Record<string, number> = {};
    if (t === 'ThresholdSensor') {
      for (const f of THRESHOLD_FIELDS) {
        const v = obj[f];
        if (typeof v === 'number') thresholds[f] = v;
      }
    }
    const snRef = parseRef(obj.SensorName);
    chains.set(name, {
      name, kind: t === 'ThresholdSensor' ? 'threshold' : 'discrete',
      sensorName: typeof obj.SensorName === 'string' && !snRef ? obj.SensorName as string : undefined,
      thresholds, events: [],
    });
  }
  // 挂事件
  for (const [name, obj] of Object.entries(objects)) {
    if (objectType(name) !== 'Event') continue;
    const cond = obj.Condition;
    const ref = parseRef(cond);
    const eventKeyId = typeof obj.EventKeyId === 'string' ? obj.EventKeyId : '';
    if (ref && chains.has(ref.target)) {
      chains.get(ref.target)!.events.push({ name, eventKeyId, level: ref.field });
    } else if (ref && !chains.has(ref.target)) {
      // 引用了非「本表传感器」的对象（如信号/离散源）——建一个占位链路挂上
      if (!chains.has(ref.target)) {
        chains.set(ref.target, { name: ref.target, kind: 'discrete', thresholds: {}, events: [] });
      }
      chains.get(ref.target)!.events.push({ name, eventKeyId, level: ref.field });
    }
    // Condition 为字面数字的离散事件：无法从引用归属，暂按事件名前缀就近匹配（尽力而为）
    else if (typeof cond === 'number') {
      const host = [...chains.keys()].find((k) => name.includes(k.replace(/^[A-Za-z]+_/, '')));
      if (host) chains.get(host)!.events.push({ name, eventKeyId, condition: cond });
    }
  }
  return [...chains.values()];
}
