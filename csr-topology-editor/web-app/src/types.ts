export interface CSRDocument {
  FormatVersion?: string | number;
  DataVersion?: string | number;
  Unit?: { Type: string; Name: string; Compatible?: string[] };
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

export interface BoardConnector {
  name: string;
  type?: string;
  slot?: number | string;
  silkText?: string;
  buses?: string[];
}

export interface BoardDevice {
  type: 'Chip' | 'Scanner' | 'Event' | 'ThresholdSensor' | 'Component' | 'Other';
  name: string;
  refBus: string | null;
  refConnector: string | null;
}

export interface BoardTopologyCard {
  boardType: string;
  boardInstance: string;
  sourceFile: string;
  buses: Array<{ name: string; busClass: string }>;
  connectors: BoardConnector[];
  devices: BoardDevice[];
}

export interface BoardTopologyLink {
  fromBoard: string;
  viaConnector: string;
  toBoard: string;
  viaBus?: string;
}

export interface BoardTopologyModel {
  name: string;
  boards: BoardTopologyCard[];
  links: BoardTopologyLink[];
}
