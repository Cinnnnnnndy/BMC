// 告警配置「知识库」——把 CSR/IPMI 领域知识固化进工具（硬件适配视图版）。
// 用户只面对：板卡 → 监控对象(Entity) → 传感器 → 门限；
// OperatorId / SensorType / 单位编码 / 扫描周期 / Entity Id / Scanner·Accessor 由这里提供含义+推荐，UI 用下拉暴露。
// 取值来自 vpd 仓真实样例（Intel E810、天池 BCU/EXU、CPU VDDQ/VRD 电压域、README §6 扫描周期分类）。

export type QuantityKind = 'threshold' | 'discrete';

/* ── 触发方向（Event.OperatorId）────────────────────────────────────── */
export interface OperatorOption {
  id: number; label: string; symbol: string; desc: string; recommendFor: QuantityKind[];
}
export const OPERATORS: OperatorOption[] = [
  { id: 4, label: '高于门限', symbol: '≥', desc: '读数 ≥ 门限值即告警。适用过温、过压、带宽过载等「越大越危险」的量。', recommendFor: ['threshold'] },
  { id: 1, label: '低于门限', symbol: '≤', desc: '读数 ≤ 门限值即告警。适用欠压、转速偏低、余量偏低等「越小越危险」的量。', recommendFor: ['threshold'] },
  { id: 5, label: '状态命中', symbol: '=', desc: '读数 = 触发值（离散量一般为 1）即告警。适用 CATERR、在位、链路状态等。', recommendFor: ['discrete'] },
  { id: 3, label: '严格大于', symbol: '>', desc: '读数 > 门限值即告警（不含等于），少数场景使用。', recommendFor: [] },
  { id: 2, label: '严格小于', symbol: '<', desc: '读数 < 门限值即告警（不含等于），少数场景使用。', recommendFor: [] },
];
export function operatorById(id: number): OperatorOption | undefined { return OPERATORS.find((o) => o.id === id); }

/* ── 扫描周期分类（README §6，强制分类）──────────────────────────────── */
export interface PeriodCategory { label: string; periodMs: number; desc: string; recommendFor?: string[]; }
export const PERIOD_CATEGORIES: PeriodCategory[] = [
  { label: 'BCU/EXU PowerGood 告警', periodMs: 100, desc: '电源就绪类，最高优先级。', recommendFor: ['powergood'] },
  { label: '影响业务的离散电压/时钟/CPU 故障', periodMs: 400, desc: '影响业务的关键离散信号。', recommendFor: ['caterr', 'prochot', 'clockfail'] },
  { label: '业务关键状态（复位/上电超时/异常掉电/ThermTrip）', periodMs: 400, desc: '系统级关键状态。', recommendFor: ['thermaltrip'] },
  { label: '故障诊断的故障检测', periodMs: 1000, desc: '一般故障诊断检测。' },
  { label: '门限类温度扫描', periodMs: 1000, desc: '门限温度传感器。', recommendFor: ['temperature'] },
  { label: '门限类电压扫描', periodMs: 3000, desc: '门限电压传感器。', recommendFor: ['voltage'] },
  { label: '风扇转速扫描', periodMs: 1000, desc: '风扇转速。', recommendFor: ['fanspeed'] },
  { label: '热插拔部件在位', periodMs: 2000, desc: '热插拔在位状态。', recommendFor: ['presence_hotplug'] },
  { label: '非热插拔部件在位', periodMs: 8000, desc: '非热插拔在位扫描。', recommendFor: ['presence'] },
  { label: '不影响业务的硬件状态', periodMs: 5000, desc: '普通硬件状态。' },
  { label: '硬盘类状态扫描', periodMs: 5000, desc: '硬盘状态。', recommendFor: ['disk_presence'] },
  { label: '光模块温度', periodMs: 10000, desc: '连续 12 次失败认为异常。', recommendFor: ['om_temperature'] },
];
export function recommendedPeriod(quantityKey: string): PeriodCategory {
  return PERIOD_CATEGORIES.find((c) => c.recommendFor?.includes(quantityKey))
    ?? PERIOD_CATEGORIES.find((c) => c.periodMs === 1000) ?? PERIOD_CATEGORIES[3];
}

/* ── 数据链路知识：Accessor 与 Scanner 是同一次寄存器读，只差一个 Period ── */
export const DATA_SOURCE_NOTES = {
  deviceField: '器件读数：直接订阅器件模型已暴露的语义量（如 CPU_1.TemperatureCelsius），缩放/单位已在上游做好，最省心，优先用。',
  scanner: '周期读(Scanner)：BMC 按 Period 周期性读一段芯片寄存器（Chip+Offset+Size+Mask），把原始值放进 .Value，供传感器/事件订阅。',
  accessor: '按需读(Accessor)：与 Scanner 字段完全相同，但没有 Period —— 只在被引用时读一次。告警用周期读(Scanner)，一次性读配置/在位用 Accessor。',
} as const;

/* ── 门限量 → 分档事件模板：一个传感器按门限档产出多条告警（over/under × crit/noncrit）── */
export interface EventTemplate {
  suffix: string;   // 事件对象名后缀 & 去重 key（如 'OverCrit'）
  label: string;    // 中文档位（过压·严重）
  levelField: 'UpperNoncritical' | 'UpperCritical' | 'UpperNonrecoverable' | 'LowerNoncritical' | 'LowerCritical';
  operatorId: number;                 // 4=≥, 1=≤
  severity: 'Minor' | 'Major' | 'Critical';
  eventKeyId: string;                 // 告警字典条目（推荐，可在 UI 覆盖）
}

/* ── 监控量定义 ──────────────────────────────────────────────────── */
export interface QuantityDef {
  key: string; label: string; kind: QuantityKind; unitLabel?: string; readingField: string;
  sensor: {
    SensorType: number; ReadingType: number; BaseUnit?: number; Unit?: number; M?: number; RBExp?: number; Analog?: number;
    AssertMask?: number; DeassertMask?: number; DiscreteMask?: number;
  };
  recommend: {
    operatorId: number;
    thresholds?: Partial<Record<'UpperNoncritical' | 'UpperCritical' | 'UpperNonrecoverable' | 'LowerNoncritical' | 'LowerCritical', number>>;
    condition?: number; hysteresis?: number; periodKey: string;
    events?: EventTemplate[];          // 门限量：一个传感器的多条分档事件
    eventKeyIds: string[];             // 离散量/兜底：单事件可选字典
  };
  explain: string;
}

export const QUANTITIES: Record<string, QuantityDef> = {
  temperature: {
    key: 'temperature', label: '温度', kind: 'threshold', unitLabel: '°C', readingField: 'TemperatureCelsius',
    sensor: { SensorType: 1, ReadingType: 1, BaseUnit: 1, Unit: 128, M: 1, RBExp: 0, Analog: 1 },
    recommend: {
      operatorId: 4, hysteresis: 2, periodKey: 'temperature',
      thresholds: { UpperNoncritical: 95, UpperCritical: 100, UpperNonrecoverable: 105 },
      events: [
        { suffix: 'OverMinor', label: '过温·预警', levelField: 'UpperNoncritical', operatorId: 4, severity: 'Minor', eventKeyId: 'CPU.CPUOverTempMinor' },
        { suffix: 'OverMajor', label: '过温·严重', levelField: 'UpperCritical', operatorId: 4, severity: 'Major', eventKeyId: 'CPU.CPUOverTempCritical' },
        { suffix: 'OverFatal', label: '过温·不可恢复', levelField: 'UpperNonrecoverable', operatorId: 4, severity: 'Critical', eventKeyId: 'CPU.CPUOverTempFatal' },
      ],
      eventKeyIds: ['PCIeCard.PCIeCardOverTemp', 'CPU.CPUOverTempCritical', 'Chassis.ChassisInletOverTempMinor'],
    },
    explain: '器件温度（°C）。越高越危险，一个温度传感器按「预警/严重/不可恢复」三档各产出一条过温告警。',
  },
  voltage: {
    key: 'voltage', label: '电压', kind: 'threshold', unitLabel: 'V', readingField: 'Voltage',
    sensor: { SensorType: 2, ReadingType: 1, BaseUnit: 4, Unit: 128, M: 1, RBExp: -3, Analog: 1 },
    recommend: {
      operatorId: 1, hysteresis: 0, periodKey: 'voltage',
      thresholds: { UpperCritical: 1.1, UpperNoncritical: 1.05, LowerNoncritical: 0.95, LowerCritical: 0.9 },
      events: [
        { suffix: 'OverMajor', label: '过压·严重', levelField: 'UpperCritical', operatorId: 4, severity: 'Major', eventKeyId: 'CpuBoard.OverVoltageMajor' },
        { suffix: 'OverMinor', label: '过压·预警', levelField: 'UpperNoncritical', operatorId: 4, severity: 'Minor', eventKeyId: 'CpuBoard.OverVoltageMinor' },
        { suffix: 'LowerMinor', label: '欠压·预警', levelField: 'LowerNoncritical', operatorId: 1, severity: 'Minor', eventKeyId: 'CpuBoard.LowerVoltageMinor' },
        { suffix: 'LowerMajor', label: '欠压·严重', levelField: 'LowerCritical', operatorId: 1, severity: 'Major', eventKeyId: 'CpuBoard.LowerVoltageMajor' },
      ],
      eventKeyIds: ['CpuBoard.OverVoltage', 'CpuBoard.LowerVoltage', 'Mainboard.MainboardOverVoltageMajor', 'Mainboard.MainboardLowerVoltageMajor'],
    },
    explain: '供电电压（V）。过压欠压都要防：一条电压轨(rail)按「过压严重/过压预警/欠压预警/欠压严重」四档各产出一条告警。一个电压域通常有多条轨。',
  },
  fanspeed: {
    key: 'fanspeed', label: '风扇转速', kind: 'threshold', unitLabel: 'RPM', readingField: 'SpeedRPM',
    sensor: { SensorType: 4, ReadingType: 1, BaseUnit: 18, Unit: 0, M: 1, RBExp: 0, Analog: 1 },
    recommend: {
      operatorId: 1, hysteresis: 100, periodKey: 'fanspeed',
      thresholds: { LowerNoncritical: 1500, LowerCritical: 800 },
      events: [
        { suffix: 'LowMinor', label: '转速偏低·预警', levelField: 'LowerNoncritical', operatorId: 1, severity: 'Minor', eventKeyId: 'Fan.FanLowSpeedMinor' },
        { suffix: 'LowMajor', label: '转速过低·严重', levelField: 'LowerCritical', operatorId: 1, severity: 'Major', eventKeyId: 'Fan.FanLowSpeedMajor' },
      ],
      eventKeyIds: ['Fan.FanLowSpeed', 'Cooling.FanSpeedLow'],
    },
    explain: '风扇转速（RPM）。转速过低影响散热，按「偏低预警/过低严重」两档告警。',
  },
  bandwidth: {
    key: 'bandwidth', label: '带宽占用率', kind: 'threshold', unitLabel: '%', readingField: 'BandwidthUsagePercent',
    sensor: { SensorType: 1, ReadingType: 1, BaseUnit: 6, Unit: 0, M: 1, RBExp: 0, Analog: 1 },
    recommend: {
      operatorId: 4, hysteresis: 0, periodKey: 'bandwidth',
      thresholds: { UpperNoncritical: 90, UpperCritical: 100 },
      events: [
        { suffix: 'HighMinor', label: '带宽过载·预警', levelField: 'UpperNoncritical', operatorId: 4, severity: 'Minor', eventKeyId: 'NICCard.SystemNetworkBandwidthUsageHigh' },
      ],
      eventKeyIds: ['NICCard.SystemNetworkBandwidthUsageHigh'],
    },
    explain: '端口带宽占用百分比。用于业务网络过载预警。',
  },
  caterr: {
    key: 'caterr', label: 'CATERR（CPU 灾难性错误）', kind: 'discrete', readingField: 'CATERR',
    sensor: { SensorType: 7, ReadingType: 111, AssertMask: 2, DeassertMask: 2, DiscreteMask: 2 },
    recommend: { operatorId: 5, condition: 1, periodKey: 'caterr', eventKeyIds: ['CPU.CPUCATERR', 'Processor.ProcessorCATERR'] },
    explain: 'CPU 灾难性错误信号，置位即故障。离散量，「状态命中」即告警。',
  },
  prochot: {
    key: 'prochot', label: 'ProcessorHot（CPU 过热降频）', kind: 'discrete', readingField: 'ProcessorHot',
    sensor: { SensorType: 7, ReadingType: 111, AssertMask: 2, DeassertMask: 2, DiscreteMask: 2 },
    recommend: { operatorId: 5, condition: 1, periodKey: 'prochot', eventKeyIds: ['CPU.CPUProcHot', 'Processor.ProcessorHot'] },
    explain: 'CPU 过热触发降频。离散量，置位即告警。',
  },
  thermaltrip: {
    key: 'thermaltrip', label: 'ThermalTrip（过热掉电）', kind: 'discrete', readingField: 'ThermalTrip',
    sensor: { SensorType: 7, ReadingType: 111, AssertMask: 1, DeassertMask: 1, DiscreteMask: 1 },
    recommend: { operatorId: 5, condition: 1, periodKey: 'thermaltrip', eventKeyIds: ['CPU.CPUThermalTrip'] },
    explain: 'CPU 过热保护掉电，最高危离散状态。',
  },
  presence: {
    key: 'presence', label: '在位状态', kind: 'discrete', readingField: 'Presence',
    sensor: { SensorType: 8, ReadingType: 111, AssertMask: 1, DeassertMask: 1, DiscreteMask: 1 },
    recommend: { operatorId: 5, condition: 0, periodKey: 'presence', eventKeyIds: ['Component.ComponentRemoved'] },
    explain: '部件是否在位。离散量；不在位（=0）时可告警。',
  },
  disk_presence: {
    key: 'disk_presence', label: '硬盘在位', kind: 'discrete', readingField: 'Presence',
    sensor: { SensorType: 8, ReadingType: 111, AssertMask: 1, DeassertMask: 1, DiscreteMask: 1 },
    recommend: { operatorId: 5, condition: 0, periodKey: 'disk_presence', eventKeyIds: ['Disk.DiskRemoved', 'Storage.DiskAbsent'] },
    explain: '硬盘是否在位。SEU/背板类扫描周期 5s。',
  },
  linkstatus: {
    key: 'linkstatus', label: '链路状态', kind: 'discrete', readingField: 'LinkStatus',
    sensor: { SensorType: 8, ReadingType: 111, AssertMask: 1, DeassertMask: 1, DiscreteMask: 1 },
    recommend: { operatorId: 5, condition: 0, periodKey: 'presence', eventKeyIds: ['Port.PortDisconnected'] },
    explain: '端口链路 Up/Down。Down（=0）时告警。',
  },
  om_temperature: {
    key: 'om_temperature', label: '光模块温度', kind: 'threshold', unitLabel: '°C', readingField: 'TemperatureCelsius',
    sensor: { SensorType: 1, ReadingType: 1, BaseUnit: 1, Unit: 128, M: 1, RBExp: 0, Analog: 1 },
    recommend: {
      operatorId: 4, hysteresis: 2, periodKey: 'om_temperature',
      thresholds: { UpperNoncritical: 75 },
      events: [
        { suffix: 'OverMinor', label: '光模块过温·预警', levelField: 'UpperNoncritical', operatorId: 4, severity: 'Minor', eventKeyId: 'Port.PortOpticalModuleOverTemp' },
      ],
      eventKeyIds: ['Port.PortOpticalModuleOverTemp', 'PcieCard.PCIeCardOMOverTemp'],
    },
    explain: '光模块温度，扫描周期较长（10s，连续 12 次失败判异常）。',
  },
};

/* ── 电压域 → 多条电压轨(rail)预置。名称/标称取自 vpd 真实 BCU/EXU/CPU 样例 ──── */
export interface VoltageRail { key: string; label: string; nominal: number; }
export const VOLTAGE_RAILS_BY_BOARD: Record<string, VoltageRail[]> = {
  BCU: [
    { key: 'VCC_12V0_1', label: 'VCC_12V0_1', nominal: 12 },
    { key: 'VCC_12V0_2', label: 'VCC_12V0_2', nominal: 12 },
    { key: 'VCC_12V0_3', label: 'VCC_12V0_3', nominal: 12 },
    { key: 'P3V3', label: '3V3', nominal: 3.3 },
    { key: 'STBY_3V3', label: 'STBY_3V3', nominal: 3.3 },
    { key: 'VCORE', label: 'VCORE', nominal: 0.85 },
    { key: 'VDDQ', label: '1V1_VDDQ', nominal: 1.1 },
  ],
  EXU: [
    { key: 'VCC_12V0_1', label: 'VCC_12V0_1', nominal: 12 },
    { key: 'VCC_12V0_2', label: 'VCC_12V0_2', nominal: 12 },
    { key: 'STBY_3V3', label: 'STBY_3V3', nominal: 3.3 },
    { key: 'STBY_5V0', label: 'STBY_5V0', nominal: 5 },
  ],
  DEFAULT: [
    { key: 'P12V', label: '12V', nominal: 12 },
    { key: 'P5V', label: '5V', nominal: 5 },
    { key: 'P3V3', label: '3V3', nominal: 3.3 },
  ],
};
export function voltageRailsForBoard(type?: string): VoltageRail[] {
  return VOLTAGE_RAILS_BY_BOARD[type || 'DEFAULT'] || VOLTAGE_RAILS_BY_BOARD.DEFAULT;
}
// 按标称电压推荐四档门限：过压 +5%/+10%，欠压 -5%/-10%（round 到 3 位）。
export function railThresholds(nominal: number): Record<string, number> {
  const r = (x: number) => Math.round(x * 1000) / 1000;
  return {
    UpperCritical: r(nominal * 1.1), UpperNoncritical: r(nominal * 1.05),
    LowerNoncritical: r(nominal * 0.95), LowerCritical: r(nominal * 0.9),
  };
}

export interface DeviceTypeDef {
  match: RegExp; typeLabel: string; entity: { name: string; entityId: number }; quantities: string[]; componentPrefix: string;
}
export const DEVICE_TYPES: DeviceTypeDef[] = [
  { match: /^CPU_/, typeLabel: 'CPU', entity: { name: 'CPU', entityId: 3 }, quantities: ['temperature', 'caterr', 'prochot', 'thermaltrip'], componentPrefix: 'Component_ComCpu' },
  { match: /^NetworkAdapter_/, typeLabel: '网卡', entity: { name: 'PCIeCard', entityId: 11 }, quantities: ['temperature', 'bandwidth', 'linkstatus'], componentPrefix: 'Component_PCIeCard' },
  { match: /^OpticalModule_/, typeLabel: '光模块', entity: { name: 'PCIeCard', entityId: 11 }, quantities: ['om_temperature'], componentPrefix: 'Component_PCIeCard' },
  { match: /^Fan_/, typeLabel: '风扇', entity: { name: 'Fan', entityId: 29 }, quantities: ['fanspeed'], componentPrefix: 'Component_Fan' },
  { match: /^Voltage_/, typeLabel: '电压域', entity: { name: 'PowerUnit', entityId: 10 }, quantities: ['voltage'], componentPrefix: 'Component_Power' },
  { match: /^Disk_/, typeLabel: '硬盘', entity: { name: 'Drive', entityId: 4 }, quantities: ['disk_presence', 'temperature'], componentPrefix: 'Component_Disk' },
  { match: /^Memory_/, typeLabel: '内存', entity: { name: 'Memory', entityId: 32 }, quantities: ['temperature', 'presence'], componentPrefix: 'Component_Memory' },
];
export function deviceTypeOf(objectKey: string): DeviceTypeDef | undefined {
  return DEVICE_TYPES.find((d) => d.match.test(objectKey));
}
export function isVoltageDomain(deviceKey: string): boolean { return /^Voltage_/.test(deviceKey); }

/* ── 板卡类型 → 该板可监控器件（本视图无 live CSR，按板型推断）──────── */
export interface BoardDevice { key: string; typeLabel: string; quantities: string[]; }
export const BOARD_TYPE_DEVICES: Record<string, BoardDevice[]> = {
  BCU: [
    { key: 'CPU_1', typeLabel: 'CPU', quantities: ['temperature', 'caterr', 'prochot', 'thermaltrip'] },
    { key: 'CPU_2', typeLabel: 'CPU', quantities: ['temperature', 'caterr', 'prochot', 'thermaltrip'] },
    { key: 'Voltage_Domain', typeLabel: '电压域', quantities: ['voltage'] },
  ],
  CLU: [
    { key: 'Fan_1', typeLabel: '风扇', quantities: ['fanspeed'] },
    { key: 'Fan_2', typeLabel: '风扇', quantities: ['fanspeed'] },
    { key: 'Temp_Inlet', typeLabel: '进风温度', quantities: ['temperature'] },
  ],
  EXU: [
    { key: 'Voltage_Domain', typeLabel: '电压域', quantities: ['voltage'] },
    { key: 'Temp_Board', typeLabel: '单板温度', quantities: ['temperature'] },
  ],
  IEU: [
    { key: 'Temp_Riser', typeLabel: 'Riser 温度', quantities: ['temperature'] },
  ],
  SEU: [
    { key: 'Disk_1', typeLabel: '硬盘', quantities: ['disk_presence', 'temperature'] },
    { key: 'Temp_Backplane', typeLabel: '背板温度', quantities: ['temperature'] },
  ],
  NICCard: [
    { key: 'NetworkAdapter_1', typeLabel: '网卡', quantities: ['temperature', 'bandwidth', 'linkstatus'] },
    { key: 'OpticalModule_0', typeLabel: '光模块', quantities: ['om_temperature'] },
  ],
  Unknown: [
    { key: 'Temp_Board', typeLabel: '单板温度', quantities: ['temperature'] },
    { key: 'Voltage_Domain', typeLabel: '电压域', quantities: ['voltage'] },
  ],
};
export function devicesForBoardType(type?: string): BoardDevice[] {
  return BOARD_TYPE_DEVICES[type || 'Unknown'] || BOARD_TYPE_DEVICES.Unknown;
}
