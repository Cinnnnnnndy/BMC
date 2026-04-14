/**
 * CSR (Component Self-description Record) 类型定义
 * 核心包含 ManagementTopology 和 Objects 两部分
 */

export interface CSRDocument {
  FormatVersion?: string | number;
  DataVersion?: string | number;
  Unit?: {
    Type: string;
    Name: string;
    Compatible?: string[];
  };
  ManagementTopology: ManagementTopology;
  Objects: Record<string, unknown>;
}

export interface ManagementTopology {
  Anchor: TopologyNode;
  [busId: string]: TopologyNode | undefined;
}

export interface TopologyNode {
  Buses?: string[];
  Chips?: string[];
  Connectors?: string[];
}

export interface ChipObject {
  OffsetWidth?: number;
  AddrWidth?: number;
  Address?: number;
  WriteTmout?: number;
  ReadTmout?: number;
  HealthStatus?: number;
  WriteRetryTimes?: number;
  ReadRetryTimes?: number;
}

export interface ScannerObject {
  Chip: string;
  Offset?: number;
  Size?: number;
  Mask?: number;
  Type?: number;
  Period?: number;
  Value?: number;
  Debounce?: string;
  ScanEnabled?: string;
  NominalValue?: number;
}

export interface ThresholdSensorObject {
  Reading: string;
  ReadingStatus?: string;
  SensorName?: string;
  SensorType?: number;
  ReadingType?: number;
  EntityId?: string;
  EntityInstance?: string;
  UpperCritical?: number;
  LowerCritical?: number;
  UpperNoncritical?: number;
  LowerNoncritical?: number;
  PositiveHysteresis?: number;
  NegativeHysteresis?: number;
  [key: string]: unknown;
}

export interface EventObject {
  EventKeyId: string;
  Reading: string;
  Condition?: number | string;
  OperatorId?: number;
  Enabled?: boolean;
  Component?: string;
  Hysteresis?: number | string;
  DescArg1?: string;
  DescArg2?: string;
  DescArg3?: string;
  DescArg4?: string;
  DescArg5?: string;
  DescArg6?: string;
  AdditionalInfo?: string;
  LedFaultCode?: string;
  "@Default"?: Record<string, unknown>;
  [key: string]: unknown;
}
