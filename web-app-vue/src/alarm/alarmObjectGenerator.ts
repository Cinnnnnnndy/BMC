// 告警对象生成器（纯函数）。一条「监控对象 + 传感器(监控量/电压轨) + 门限」
// → 一组 CSR 对象（Entity / Sensor / 多条 Event / Component，必要时 Scanner）。
// 关键：一个门限传感器按门限档产出「多条」Event（过压严重/过压预警/欠压…），
// 电压域可挂多条电压轨 → 多个传感器。硬件适配视图无 live CSR，产出可写入板卡 .sr 的补丁。

import { QUANTITIES, deviceTypeOf, operatorById, type QuantityDef, type QuantityKind, type EventTemplate } from './alarmKnowledge';

export interface CSRLike { Objects?: Record<string, unknown>; }

export interface DataSourceSpec {
  mode: 'device-field' | 'scanner';
  field?: string;
  scanner?: { chip: string; offset: number; size: number; mask: number; periodMs: number };
}

export interface AlarmSpec {
  boardName: string;
  deviceKey: string;
  deviceLabel?: string;
  quantityKey: string;
  railKey?: string;          // 电压域：电压轨 key（如 VCC_12V0_1）
  railLabel?: string;        // 电压轨显示名
  enabled: boolean;
  operatorId: number;        // 离散量方向；门限量的方向由各事件模板给出
  thresholds?: Partial<Record<'UpperNoncritical' | 'UpperCritical' | 'UpperNonrecoverable' | 'LowerNoncritical' | 'LowerCritical', number>>;
  events?: EventTemplate[];  // 门限量：覆盖后的分档事件模板（可改 eventKeyId）
  hysteresis?: number;
  condition?: number;        // 离散量触发值
  eventKeyId?: string;       // 离散量：告警字典条目
  dataSource: DataSourceSpec;
  readingOverride?: string;
}

const ZH_LEVEL: Record<string, string> = {
  UpperNoncritical: '预警(上)', UpperCritical: '严重(上)', UpperNonrecoverable: '不可恢复(上)',
  LowerNoncritical: '预警(下)', LowerCritical: '严重(下)',
};

// UI 用：生成后可直接渲染的「传感器关系」结构
export interface GeneratedEvent { key: string; eventKeyId: string; label: string; operator: string; conditionLabel: string; severity?: string; }
export interface GeneratedSensor {
  configId: string;                       // deviceKey|quantityKey|railKey
  sensorKey: string; sensorName: string; kind: QuantityKind;
  entityKey: string; entityName: string; entityId: number;
  componentKey: string;
  dataSource: { kind: 'device-field' | 'scanner'; label: string; scannerKey?: string };
  events: GeneratedEvent[];
}

export interface GenerateResult {
  objects: Record<string, unknown>;
  sensor: GeneratedSensor | null;
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

export function alarmBaseName(deviceKey: string, q: QuantityDef, railKey?: string): string {
  const railPart = railKey ? pascal(railKey) : '';
  return `${pascal(deviceKey)}${railPart}${pascal(q.label || q.key)}`;
}
export function configId(deviceKey: string, quantityKey: string, railKey?: string): string {
  return `${deviceKey}|${quantityKey}|${railKey || ''}`;
}

export function generateAlarmObjects(csr: CSRLike, spec: AlarmSpec): GenerateResult {
  const objects = csr.Objects || {};
  const q = QUANTITIES[spec.quantityKey];
  const dev = deviceTypeOf(spec.deviceKey);
  const created: string[] = [];
  const reused: string[] = [];
  const warnings: string[] = [];
  const patch: Record<string, unknown> = {};

  if (!q) return { objects: {}, sensor: null, createdKeys: [], reusedKeys: [], warnings: [`未知监控量：${spec.quantityKey}`] };

  const base = alarmBaseName(spec.deviceKey, q, spec.railKey);
  const railName = spec.railLabel || spec.railKey;

  // ── 数据源（读数引用）：器件字段 或 周期读 Scanner ─────────────────
  let readingRef: string;
  let dsInfo: GeneratedSensor['dataSource'];
  if (spec.readingOverride) {
    readingRef = spec.readingOverride;
    dsInfo = { kind: 'device-field', label: spec.readingOverride };
  } else if (spec.dataSource.mode === 'scanner') {
    const s = spec.dataSource.scanner;
    if (!s || !s.chip) {
      warnings.push(`「${railName || q.label}」数据源未接：请选择硬件信号（Chip/Offset）或改用器件读数字段。`);
      readingRef = SUB(spec.deviceKey, spec.dataSource.field || q.readingField);
      dsInfo = { kind: 'device-field', label: '（未接，暂用器件字段兜底）' };
    } else {
      const scannerKey = `Scanner_${base}`;
      patch[scannerKey] = {
        Chip: s.chip.startsWith('#/') ? s.chip : `#/${s.chip}`,
        Offset: s.offset, Size: s.size, Mask: s.mask, Type: 0,
        Period: s.periodMs, Debounce: 'None', Value: 0,
      };
      created.push(scannerKey);
      readingRef = SUB(scannerKey, 'Value');
      dsInfo = { kind: 'scanner', label: `周期读 ${s.chip} @${s.periodMs}ms`, scannerKey };
    }
  } else {
    const field = spec.dataSource.field || q.readingField;
    readingRef = SUB(spec.deviceKey, field);
    dsInfo = { kind: 'device-field', label: `${spec.deviceKey}.${field}` };
  }

  // ── Entity / Component 按「监控对象」维度命名 → 同一对象多传感器共用，跨调用复用 ──
  const deviceName = pascal(spec.deviceKey);
  const entityName = dev ? dev.entity.name : deviceName;
  const entityId = dev ? dev.entity.entityId : 0;
  const entityKey = `Entity_${deviceName}`;
  if (objects[entityKey]) reused.push(entityKey);
  else {
    patch[entityKey] = { Id: entityId, Name: entityName, Instance: 1, PowerState: 1, Presence: 1 };
    created.push(entityKey);
  }

  const componentKey = `Component_${deviceName}`;
  if (objects[componentKey]) reused.push(componentKey);
  else {
    patch[componentKey] = {
      FruId: 255, Instance: SUB(spec.deviceKey, 'SlotID'), Name: SUB(spec.deviceKey, 'DeviceName'),
      Location: SUB(spec.deviceKey, 'Position'), Health: 0, Presence: 1, PowerState: 1,
    };
    created.push(componentKey);
  }

  // ── 传感器（一条监控量/一条电压轨 = 一个传感器）──────────────────────
  const sensorKey = q.kind === 'threshold' ? `ThresholdSensor_${base}` : `DiscreteSensor_${base}`;
  const sensorName = `${spec.boardName} ${railName || dev?.typeLabel || ''} ${q.label}`.replace(/\s+/g, ' ').trim();
  if (q.kind === 'threshold') {
    patch[sensorKey] = {
      ...q.sensor,
      SensorName: sensorName,
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
      SensorName: sensorName,
      Reading: readingRef,
      EntityId: SUB(entityKey, 'Id'),
      EntityInstance: SUB(entityKey, 'Instance'),
    };
  }
  created.push(sensorKey);

  // ── 事件（多条）：门限量按每个「已设门限的档位」产出一条；离散量产出一条 ──
  const genEvents: GeneratedEvent[] = [];
  if (q.kind === 'threshold') {
    const templates = spec.events && spec.events.length ? spec.events : (q.recommend.events || []);
    for (const ev of templates) {
      const thr = spec.thresholds?.[ev.levelField];
      if (thr == null) continue;                 // 未设该档门限 → 不产出该事件
      const eventKey = `Event_${base}${ev.suffix}`;
      patch[eventKey] = {
        EventKeyId: ev.eventKeyId,
        Reading: readingRef,
        Condition: SUB(sensorKey, ev.levelField),   // 引用传感器门限：改门限只改一处
        OperatorId: ev.operatorId,
        Component: `#/${componentKey}`,
        Enabled: spec.enabled,
        ...(spec.hysteresis != null ? { Hysteresis: spec.hysteresis } : {}),
        DescArg2: REF(componentKey, 'Name'),
        DescArg3: railName || dev?.typeLabel || spec.deviceKey,
        DescArg4: REF(eventKey, 'Reading'),
        DescArg5: REF(eventKey, 'Condition'),
      };
      created.push(eventKey);
      genEvents.push({
        key: eventKey, eventKeyId: ev.eventKeyId, label: ev.label,
        operator: operatorById(ev.operatorId)?.symbol || '', severity: ev.severity,
        conditionLabel: `${ZH_LEVEL[ev.levelField]} = ${thr}`,
      });
    }
    if (!genEvents.length) warnings.push(`未设置任何门限档位，未产出告警事件——请至少填一档门限。`);
  } else {
    const eventKey = `Event_${base}`;
    const cond = spec.condition ?? 1;
    patch[eventKey] = {
      EventKeyId: spec.eventKeyId || q.recommend.eventKeyIds[0] || '',
      Reading: readingRef,
      Condition: cond,
      OperatorId: spec.operatorId,
      Component: `#/${componentKey}`,
      Enabled: spec.enabled,
      DescArg2: REF(componentKey, 'Name'),
      DescArg3: dev?.typeLabel || spec.deviceKey,
      DescArg4: REF(eventKey, 'Reading'),
      DescArg5: REF(eventKey, 'Condition'),
    };
    created.push(eventKey);
    genEvents.push({
      key: eventKey, eventKeyId: spec.eventKeyId || q.recommend.eventKeyIds[0] || '',
      label: '状态命中', operator: operatorById(spec.operatorId)?.symbol || '=',
      conditionLabel: `命中值 = ${cond}`,
    });
  }

  const sensor: GeneratedSensor = {
    configId: configId(spec.deviceKey, spec.quantityKey, spec.railKey),
    sensorKey, sensorName, kind: q.kind,
    entityKey, entityName, entityId,
    componentKey,
    dataSource: dsInfo,
    events: genEvents,
  };

  return { objects: patch, sensor, createdKeys: created, reusedKeys: reused, warnings };
}
