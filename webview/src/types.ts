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
