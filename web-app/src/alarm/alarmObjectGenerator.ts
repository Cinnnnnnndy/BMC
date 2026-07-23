// 告警对象生成器（纯函数，无 UI 依赖）。
// 输入：一条「器件 + 监控量 + 用户门限」的告警意图。
// 输出：应合并进 csr.Objects 的对象补丁（Entity / Sensor / Event / Component，
//       必要时 Scanner），以及创建/复用/告警清单。
//
// 这就是「器件关联告警 → 自动产生 CSR 对象」的落地：
// 只有被配置了告警的器件才实例化这套对象，能复用的复用，key 稳定可覆盖更新。

import type { CSRDocument } from '../types';
import { QUANTITIES, deviceTypeOf, type QuantityDef } from './alarmKnowledge';

export interface DataSourceSpec {
  /** device-field: 直接订阅器件已有的语义读数（推荐，无需建 Scanner）
   *  scanner:      器件无该读数，需从寄存器新建 Scanner 兜底 */
  mode: 'device-field' | 'scanner';
  field?: string;
  scanner?: { chip: string; offset: number; size: number; mask: number; periodMs: number };
}

export interface AlarmSpec {
  boardName: string;
  deviceKey: string;
  quantityKey: string;
  enabled: boolean;
  eventKeyId: string;
  operatorId: number;
  /** 门限量 */
  thresholds?: Partial<Record<'UpperNoncritical' | 'UpperCritical' | 'UpperNonrecoverable' | 'LowerNoncritical' | 'LowerCritical', number>>;
  hysteresis?: number;
  /** 离散量触发值 */
  condition?: number;
  dataSource: DataSourceSpec;
  /** 直接指定 Reading 引用（如复用已有 Scanner：<=/Scanner_x.Value），优先级最高 */
  readingOverride?: string;
}

export interface GenerateResult {
  objects: Record<string, unknown>;
  createdKeys: string[];
  reusedKeys: string[];
  warnings: string[];
}

const REF = (key: string, field: string) => `#/${key}.${field}`;
const SUB = (key: string, field: string) => `<=/${key}.${field}`;

function pascal(s: string): string {
  return s.replace(/[^A-Za-z0-9]+/g, ' ').split(' ').filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

/** 稳定基名：同一器件+量重复配置会覆盖更新，不产生重复对象 */
export function alarmBaseName(deviceKey: string, q: QuantityDef): string {
  return `${pascal(deviceKey)}${pascal(q.label || q.key)}`;
}

/** 找该器件已存在的 Entity / Component，能复用就复用 */
function findExisting(objects: Record<string, unknown>, deviceKey: string, prefix: string): string | null {
  const dev = deviceTypeOf(deviceKey);
  // 优先：已有对象通过 <=/deviceKey 关联
  for (const [k, v] of Object.entries(objects)) {
    if (!k.startsWith(prefix)) continue;
    if (JSON.stringify(v).includes(deviceKey)) return k;
  }
  // 次选：命名匹配该器件类型的 Component/Entity
  if (dev) {
    const hint = prefix === 'Component_' ? dev.componentPrefix : `Entity_${dev.entity.name}`;
    if (objects[hint]) return hint;
  }
  return null;
}

export function generateAlarmObjects(csr: CSRDocument, spec: AlarmSpec): GenerateResult {
  const objects = csr.Objects || {};
  const q = QUANTITIES[spec.quantityKey];
  const dev = deviceTypeOf(spec.deviceKey);
  const created: string[] = [];
  const reused: string[] = [];
  const warnings: string[] = [];
  const patch: Record<string, unknown> = {};

  if (!q) {
    return { objects: {}, createdKeys: [], reusedKeys: [], warnings: [`未知监控量：${spec.quantityKey}`] };
  }

  const base = alarmBaseName(spec.deviceKey, q);

  // 1) 数据源：确定 Reading 引用
  let readingRef: string;
  if (spec.readingOverride) {
    readingRef = spec.readingOverride;
  } else if (spec.dataSource.mode === 'scanner') {
    const s = spec.dataSource.scanner;
    if (!s || !s.chip) {
      warnings.push(`「${q.label}」数据源未接：请选择硬件信号或改用器件读数字段。`);
      readingRef = SUB(spec.deviceKey, spec.dataSource.field || q.readingField);
    } else {
      const scannerKey = `Scanner_${base}`;
      patch[scannerKey] = {
        Chip: s.chip.startsWith('#/') ? s.chip : `#/${s.chip}`,
        Offset: s.offset, Size: s.size, Mask: s.mask, Type: 0,
        Period: s.periodMs, Debounce: 'None', Value: 0,
      };
      created.push(scannerKey);
      readingRef = SUB(scannerKey, 'Value');
    }
  } else {
    readingRef = SUB(spec.deviceKey, spec.dataSource.field || q.readingField);
  }

  // 2) Entity / Component 按「器件」维度命名 → 同一器件多条告警共用一套；
  //    优先复用 CSR 里已存在、且引用该器件的对象，否则用确定性 key 新建。
  const deviceName = pascal(spec.deviceKey);
  const entityName = dev ? dev.entity.name : deviceName;
  let entityKey = findExisting(objects, spec.deviceKey, 'Entity_') || (objects[`Entity_${deviceName}`] ? `Entity_${deviceName}` : null);
  if (!entityKey) {
    entityKey = `Entity_${deviceName}`;
    patch[entityKey] = {
      Id: dev ? dev.entity.entityId : 0,
      Name: entityName,
      Instance: 1,
      PowerState: 1,
      Presence: 1,
    };
    created.push(entityKey);
  } else {
    reused.push(entityKey);
  }

  // 3) Component（复用或新建；Event.Component 指向它）
  let componentKey = findExisting(objects, spec.deviceKey, 'Component_') || (objects[`Component_${deviceName}`] ? `Component_${deviceName}` : null);
  if (!componentKey) {
    componentKey = `Component_${deviceName}`;
    patch[componentKey] = {
      FruId: 255,
      Instance: SUB(spec.deviceKey, 'SlotID'),
      Name: SUB(spec.deviceKey, 'DeviceName'),
      Location: SUB(spec.deviceKey, 'Position'),
      Health: 0,
      Presence: 1,
      PowerState: 1,
    };
    created.push(componentKey);
  } else {
    reused.push(componentKey);
  }

  // 4) Sensor（Threshold / Discrete）
  const sensorKey = q.kind === 'threshold' ? `ThresholdSensor_${base}` : `DiscreteSensor_${base}`;
  if (q.kind === 'threshold') {
    patch[sensorKey] = {
      ...q.sensor,
      SensorName: `${spec.boardName} ${dev?.typeLabel ?? ''} ${q.label}`.trim(),
      Reading: readingRef,
      ReadingStatus: SUB(spec.deviceKey, `${q.readingField}Status`),
      EntityId: SUB(entityKey, 'Id'),
      EntityInstance: SUB(entityKey, 'Instance'),
      ...(spec.thresholds || {}),
      ...(spec.hysteresis != null ? { PositiveHysteresis: spec.hysteresis, NegativeHysteresis: spec.hysteresis } : {}),
    };
  } else {
    patch[sensorKey] = {
      ...q.sensor,
      SensorName: `${spec.boardName} ${dev?.typeLabel ?? ''} ${q.label}`.trim(),
      Reading: readingRef,
      EntityId: SUB(entityKey, 'Id'),
      EntityInstance: SUB(entityKey, 'Instance'),
    };
  }
  created.push(sensorKey);

  // 5) Event（告警规则）
  const eventKey = `Event_${base}`;
  // 门限量：Condition 引用传感器门限，做到「改门限只改一处」；离散量：用触发值常量
  const condition = q.kind === 'threshold'
    ? (spec.thresholds?.UpperNoncritical != null
        ? SUB(sensorKey, 'UpperNoncritical')
        : spec.thresholds?.LowerNoncritical != null
          ? SUB(sensorKey, 'LowerNoncritical')
          : 0)
    : (spec.condition ?? 1);

  patch[eventKey] = {
    EventKeyId: spec.eventKeyId,
    Reading: readingRef,
    Condition: condition,
    OperatorId: spec.operatorId,
    Component: `#/${componentKey}`,
    Enabled: spec.enabled,
    ...(spec.hysteresis != null && q.kind === 'threshold' ? { Hysteresis: spec.hysteresis } : {}),
    DescArg2: REF(componentKey, 'Name'),
    DescArg3: dev?.typeLabel ?? spec.deviceKey,
    DescArg4: REF(eventKey, 'Reading'),
    DescArg5: REF(eventKey, 'Condition'),
  };
  created.push(eventKey);

  return { objects: patch, createdKeys: created, reusedKeys: reused, warnings };
}

/** 删除某条告警产生的对象（保留可能被复用的 Entity/Component） */
export function removeAlarmObjects(csr: CSRDocument, deviceKey: string, quantityKey: string): Record<string, unknown> {
  const q = QUANTITIES[quantityKey];
  if (!q) return csr.Objects || {};
  const base = alarmBaseName(deviceKey, q);
  const next = { ...(csr.Objects || {}) };
  for (const k of [`Event_${base}`, `ThresholdSensor_${base}`, `DiscreteSensor_${base}`, `Scanner_${base}`, `Entity_${base}`]) {
    delete next[k];
  }
  return next;
}

export interface ExistingAlarm {
  deviceKey: string;
  quantityKey: string;
  eventKey: string;
  eventKeyId: string;
  enabled: boolean;
}

/** 扫描 CSR，列出已配置的告警（用于抽屉回填 + 板卡告警清单） */
export function listBoardAlarms(csr: CSRDocument): ExistingAlarm[] {
  const objects = csr.Objects || {};
  const out: ExistingAlarm[] = [];
  for (const [k, v] of Object.entries(objects)) {
    if (!k.startsWith('Event_') || typeof v !== 'object' || !v) continue;
    const ev = v as Record<string, unknown>;
    const reading = typeof ev.Reading === 'string' ? ev.Reading : '';
    const m = reading.match(/<=\/([A-Za-z0-9_]+)\./);
    const src = m ? m[1] : '';
    // 反查监控量：从 Reading 字段名猜测
    let quantityKey = '';
    for (const q of Object.values(QUANTITIES)) {
      if (reading.includes(`.${q.readingField}`)) { quantityKey = q.key; break; }
    }
    out.push({
      deviceKey: src,
      quantityKey,
      eventKey: k,
      eventKeyId: typeof ev.EventKeyId === 'string' ? ev.EventKeyId : '',
      enabled: ev.Enabled !== false,
    });
  }
  return out;
}
