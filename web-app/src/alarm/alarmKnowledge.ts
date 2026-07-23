// 告警配置「知识库」——把 CSR/IPMI 领域知识固化进工具。
// 目的：用户在拓扑抽屉里只面对「器件 + 监控量 + 门限」，
// 而 OperatorId / SensorType / 单位编码 / 扫描周期 / Entity Id 这些
// 硬约束由这里提供「含义 + 推荐值」，UI 用下拉暴露，不让用户手填。
//
// 所有取值均来自 vpd 仓真实样例（Intel E810、天池 BCU、README §6 扫描周期分类）。

export type QuantityKind = 'threshold' | 'discrete';

/* ── 触发方向（Event.OperatorId）─────────────────────────────
   语义已用 vpd 真实事件校准：
   4=≥ 过温/过载, 1=≤ 欠压/余量低, 5== 状态命中, 3=> , 2=< */
export interface OperatorOption {
  id: number;
  label: string;
  symbol: string;
  desc: string;
  /** 适用的监控量种类，用于「推荐」标注 */
  recommendFor: QuantityKind[];
}

export const OPERATORS: OperatorOption[] = [
  { id: 4, label: '高于门限', symbol: '≥', desc: '读数 ≥ 门限值即告警。适用过温、过压、带宽过载等「越大越危险」的量。', recommendFor: ['threshold'] },
  { id: 1, label: '低于门限', symbol: '≤', desc: '读数 ≤ 门限值即告警。适用欠压、寿命/余量偏低等「越小越危险」的量。', recommendFor: ['threshold'] },
  { id: 5, label: '状态命中', symbol: '=', desc: '读数 = 触发值（离散量一般为 1）即告警。适用 CATERR、在位、链路状态等。', recommendFor: ['discrete'] },
  { id: 3, label: '严格大于', symbol: '>', desc: '读数 > 门限值即告警（不含等于），少数场景使用。', recommendFor: [] },
  { id: 2, label: '严格小于', symbol: '<', desc: '读数 < 门限值即告警（不含等于），少数场景使用。', recommendFor: [] },
];

export function operatorById(id: number): OperatorOption | undefined {
  return OPERATORS.find((o) => o.id === id);
}

/* ── 扫描周期分类（Scanner.Period）──────────────────────────
   直接来自 vpd README §6「Scanner 扫描周期配置原则」。
   只有当监控量的数据源尚未接入、需要新建 Scanner 时才会用到；
   规则：新增 Scanner 必须落在已有分类，否则需 subPC 评审。*/
export interface PeriodCategory {
  label: string;
  periodMs: number;
  desc: string;
  /** 命中这些监控量 key 时作为推荐项 */
  recommendFor?: string[];
}

export const PERIOD_CATEGORIES: PeriodCategory[] = [
  { label: 'BCU/EXU PowerGood 告警', periodMs: 100, desc: '电源就绪类，最高优先级。', recommendFor: ['powergood'] },
  { label: '影响业务的离散电压/时钟/CPU 故障', periodMs: 400, desc: '影响业务的关键离散信号。', recommendFor: ['caterr', 'prochot', 'clockfail', 'voltage_discrete'] },
  { label: '业务关键状态（复位/上电超时/异常掉电/ThermTrip）', periodMs: 400, desc: '系统级关键状态。', recommendFor: ['thermaltrip', 'reset'] },
  { label: '故障诊断的故障检测', periodMs: 1000, desc: '一般故障诊断检测。' },
  { label: '门限类温度扫描', periodMs: 1000, desc: '门限温度传感器。', recommendFor: ['temperature'] },
  { label: '门限类电压扫描', periodMs: 3000, desc: '门限电压传感器。', recommendFor: ['voltage'] },
  { label: '风扇转速扫描', periodMs: 1000, desc: '风扇转速。', recommendFor: ['fanspeed'] },
  { label: '热插拔部件在位', periodMs: 2000, desc: '热插拔在位状态。', recommendFor: ['presence_hotplug'] },
  { label: '非热插拔部件在位', periodMs: 8000, desc: '非热插拔在位扫描。', recommendFor: ['presence'] },
  { label: '不影响业务的硬件状态', periodMs: 5000, desc: '普通硬件状态。' },
  { label: '硬盘类状态扫描', periodMs: 5000, desc: '硬盘状态。' },
  { label: '光模块温度', periodMs: 10000, desc: '连续 12 次失败认为异常。', recommendFor: ['om_temperature'] },
  { label: '纽扣电池扫描', periodMs: 10000, desc: '纽扣电池电压。' },
];

export function recommendedPeriod(quantityKey: string): PeriodCategory {
  return (
    PERIOD_CATEGORIES.find((c) => c.recommendFor?.includes(quantityKey)) ??
    PERIOD_CATEGORIES.find((c) => c.periodMs === 1000) ??
    PERIOD_CATEGORIES[3]
  );
}

/* ── 监控量目录 ─────────────────────────────────────────────
   每个「量」把用户可见输入（门限）与隐藏编码（SensorType/单位/M/RBExp）
   绑在一起。sensor.* 字段用户永远看不到，由这里按量种类固化。*/
export interface QuantityDef {
  key: string;
  label: string;
  kind: QuantityKind;
  unitLabel?: string;
  /** 器件对象上提供活读数的字段名；抽屉据此判断「数据源是否已接」 */
  readingField: string;
  /** IPMI 传感器编码默认值（隐藏，不暴露给用户） */
  sensor: {
    SensorType: number;
    ReadingType: number;
    BaseUnit?: number;
    Unit?: number;
    M?: number;
    RBExp?: number;
    Analog?: number;
    /** 离散量的位掩码默认值 */
    AssertMask?: number;
    DeassertMask?: number;
    DiscreteMask?: number;
  };
  recommend: {
    operatorId: number;
    thresholds?: Partial<Record<'UpperNoncritical' | 'UpperCritical' | 'UpperNonrecoverable' | 'LowerNoncritical' | 'LowerCritical', number>>;
    condition?: number;
    hysteresis?: number;
    /** 周期分类关键字，映射到 PERIOD_CATEGORIES.recommendFor */
    periodKey: string;
    /** 告警字典建议项（无 eventDef 时兜底） */
    eventKeyIds: string[];
  };
  explain: string;
}

export const QUANTITIES: Record<string, QuantityDef> = {
  temperature: {
    key: 'temperature',
    label: '温度', kind: 'threshold', unitLabel: '°C', readingField: 'TemperatureCelsius',
    sensor: { SensorType: 1, ReadingType: 1, BaseUnit: 1, Unit: 128, M: 1, RBExp: 0, Analog: 1 },
    recommend: {
      operatorId: 4,
      thresholds: { UpperNoncritical: 95, UpperCritical: 100, UpperNonrecoverable: 105 },
      hysteresis: 2, periodKey: 'temperature',
      eventKeyIds: ['PCIeCard.PCIeCardOverTemp', 'CPU.CPUOverTempCritical', 'Chassis.ChassisInletOverTempMinor'],
    },
    explain: '器件温度（°C）。越高越危险，一般配「高于门限」三档：预警 / 严重 / 不可恢复。',
  },
  voltage: {
    key: 'voltage',
    label: '电压', kind: 'threshold', unitLabel: 'V', readingField: 'Voltage',
    sensor: { SensorType: 2, ReadingType: 1, BaseUnit: 4, Unit: 128, M: 1, RBExp: -3, Analog: 1 },
    recommend: {
      operatorId: 1,
      thresholds: { LowerNoncritical: 0.95, LowerCritical: 0.9 },
      hysteresis: 0, periodKey: 'voltage',
      eventKeyIds: ['PcieCard.PCIeCardLowerVoltMajor', 'PSU.PSUOutputLowerVoltage'],
    },
    explain: '供电电压（V）。欠压比过压更常见，默认配「低于门限」。',
  },
  bandwidth: {
    key: 'bandwidth',
    label: '带宽占用率', kind: 'threshold', unitLabel: '%', readingField: 'BandwidthUsagePercent',
    sensor: { SensorType: 1, ReadingType: 1, BaseUnit: 6, Unit: 0, M: 1, RBExp: 0, Analog: 1 },
    recommend: {
      operatorId: 4,
      thresholds: { UpperNoncritical: 90, UpperCritical: 100 },
      hysteresis: 0, periodKey: 'bandwidth',
      eventKeyIds: ['NICCard.SystemNetworkBandwidthUsageHigh'],
    },
    explain: '端口带宽占用百分比。用于业务网络过载预警。',
  },
  caterr: {
    key: 'caterr',
    label: 'CATERR（CPU 灾难性错误）', kind: 'discrete', readingField: 'CATERR',
    sensor: { SensorType: 7, ReadingType: 111, AssertMask: 2, DeassertMask: 2, DiscreteMask: 2 },
    recommend: { operatorId: 5, condition: 1, periodKey: 'caterr', eventKeyIds: ['CPU.CPUCATERR', 'Processor.ProcessorCATERR'] },
    explain: 'CPU 灾难性错误信号，置位即故障。离散量，「状态命中」即告警。',
  },
  prochot: {
    key: 'prochot',
    label: 'ProcessorHot（CPU 过热降频）', kind: 'discrete', readingField: 'ProcessorHot',
    sensor: { SensorType: 7, ReadingType: 111, AssertMask: 2, DeassertMask: 2, DiscreteMask: 2 },
    recommend: { operatorId: 5, condition: 1, periodKey: 'prochot', eventKeyIds: ['CPU.CPUProcHot', 'Processor.ProcessorHot'] },
    explain: 'CPU 过热触发降频。离散量，置位即告警。',
  },
  thermaltrip: {
    key: 'thermaltrip',
    label: 'ThermalTrip（过热掉电）', kind: 'discrete', readingField: 'ThermalTrip',
    sensor: { SensorType: 7, ReadingType: 111, AssertMask: 1, DeassertMask: 1, DiscreteMask: 1 },
    recommend: { operatorId: 5, condition: 1, periodKey: 'thermaltrip', eventKeyIds: ['CPU.CPUThermalTrip'] },
    explain: 'CPU 过热保护掉电，最高危离散状态。',
  },
  presence: {
    key: 'presence',
    label: '在位状态', kind: 'discrete', readingField: 'Presence',
    sensor: { SensorType: 8, ReadingType: 111, AssertMask: 1, DeassertMask: 1, DiscreteMask: 1 },
    recommend: { operatorId: 5, condition: 0, periodKey: 'presence', eventKeyIds: ['Component.ComponentRemoved'] },
    explain: '部件是否在位。离散量；不在位（=0）时可告警。',
  },
  linkstatus: {
    key: 'linkstatus',
    label: '链路状态', kind: 'discrete', readingField: 'LinkStatus',
    sensor: { SensorType: 8, ReadingType: 111, AssertMask: 1, DeassertMask: 1, DiscreteMask: 1 },
    recommend: { operatorId: 5, condition: 0, periodKey: 'presence', eventKeyIds: ['Port.PortDisconnected'] },
    explain: '端口链路 Up/Down。Down（=0）时告警。',
  },
  om_temperature: {
    key: 'om_temperature',
    label: '光模块温度', kind: 'threshold', unitLabel: '°C', readingField: 'TemperatureCelsius',
    sensor: { SensorType: 1, ReadingType: 1, BaseUnit: 1, Unit: 128, M: 1, RBExp: 0, Analog: 1 },
    recommend: {
      operatorId: 4, thresholds: { UpperNoncritical: 75 }, hysteresis: 2, periodKey: 'om_temperature',
      eventKeyIds: ['Port.PortOpticalModuleOverTemp', 'PcieCard.PCIeCardOMOverTemp'],
    },
    explain: '光模块温度，扫描周期较长（10s，连续 12 次失败判异常）。',
  },
};

/* ── 器件目录 ───────────────────────────────────────────────
   把「对象 key 前缀 → 器件类型 → 可监控量 + Entity 身份」固化。
   抽屉据此从 csr.Objects 里识别一块板上的监控对象。*/
export interface DeviceTypeDef {
  match: RegExp;
  typeLabel: string;
  /** IPMI Entity 字典（Id 取自 vpd 样例，如 PCIeCard=11） */
  entity: { name: string; entityId: number };
  quantities: string[];
  componentPrefix: string;
}

export const DEVICE_TYPES: DeviceTypeDef[] = [
  { match: /^CPU_/, typeLabel: 'CPU', entity: { name: 'CPU', entityId: 3 }, quantities: ['temperature', 'caterr', 'prochot', 'thermaltrip'], componentPrefix: 'Component_ComCpu' },
  { match: /^NetworkAdapter_/, typeLabel: '网卡', entity: { name: 'PCIeCard', entityId: 11 }, quantities: ['temperature', 'bandwidth', 'linkstatus'], componentPrefix: 'Component_PCIeCard' },
  { match: /^OpticalModule_/, typeLabel: '光模块', entity: { name: 'PCIeCard', entityId: 11 }, quantities: ['om_temperature'], componentPrefix: 'Component_PCIeCard' },
  { match: /^Memory_/, typeLabel: '内存', entity: { name: 'Memory', entityId: 32 }, quantities: ['temperature', 'presence'], componentPrefix: 'Component_Memory' },
  { match: /^NetworkPort_/, typeLabel: '网口', entity: { name: 'PCIeCard', entityId: 11 }, quantities: ['bandwidth', 'linkstatus'], componentPrefix: 'Component_PCIeCard' },
  { match: /^PCIeDevice_/, typeLabel: 'PCIe 设备', entity: { name: 'PCIeCard', entityId: 11 }, quantities: ['temperature'], componentPrefix: 'Component_PCIeCard' },
];

export function deviceTypeOf(objectKey: string): DeviceTypeDef | undefined {
  return DEVICE_TYPES.find((d) => d.match.test(objectKey));
}

/* ── 告警严重级（派生自告警字典，非 Event 字段，仅展示）────── */
export const SEVERITY_LABELS: Record<string, string> = {
  Minor: '一般', Major: '重要', Critical: '紧急', Normal: '提示',
};
