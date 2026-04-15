import React, { useMemo, useState } from 'react';
import type { CSRDocument } from '../types';

interface Props {
  csr: CSRDocument;
}

type HwCategory = 'chip' | 'connector' | 'mux' | 'accessor';
type SwCategory = 'component' | 'event' | 'sensor' | 'firmware' | 'fru' | 'other';

interface HwItem {
  id: string;
  label: string;
  category: HwCategory;
  address?: number;
  busPath: string[];
  details: Record<string, unknown>;
}

interface SwItem {
  id: string;
  label: string;
  category: SwCategory;
  refs: string[];
  details: Record<string, unknown>;
}

function getHwCategory(key: string, val: Record<string, unknown>): HwCategory | null {
  if (key.startsWith('Connector_') || key.startsWith('BusinessConnector_')) return 'connector';
  if (key.startsWith('I2cMux_')) return 'mux';
  if (key.startsWith('Accessor_')) return 'accessor';
  if ('Address' in val || key.startsWith('Chip_') || key.startsWith('Eeprom_') ||
      key.startsWith('Pca9') || key.startsWith('Lm7') || key.startsWith('CDR') ||
      key.startsWith('SMC_') || key.startsWith('CPLD_')) return 'chip';
  return null;
}

function getSwCategory(key: string): SwCategory | null {
  if (key.startsWith('Component_')) return 'component';
  if (key.startsWith('Event_')) return 'event';
  if (key.startsWith('Scanner_') || key.startsWith('ThresholdSensor_') || key.startsWith('DiscreteSensor_')) return 'sensor';
  if (key.startsWith('MCUFirmware_') || key.startsWith('SRUpgrade_') || key.startsWith('Dft')) return 'firmware';
  if (key.startsWith('FruData_') || key.startsWith('Fru_')) return 'fru';
  return null;
}

/** Extract #/ObjName or #/ObjName.Field references from an object's values */
function extractRefs(val: Record<string, unknown>): string[] {
  const refs = new Set<string>();
  function walk(v: unknown) {
    if (typeof v === 'string') {
      const m = v.match(/#\/(\w+)/g);
      if (m) m.forEach((r) => refs.add(r.slice(2).split('.')[0]));
    } else if (Array.isArray(v)) {
      v.forEach(walk);
    } else if (typeof v === 'object' && v !== null) {
      Object.values(v as Record<string, unknown>).forEach(walk);
    }
  }
  walk(val);
  return [...refs];
}

/** Build bus path for each chip by traversing ManagementTopology */
function buildBusPaths(topology: CSRDocument['ManagementTopology']): Map<string, string[]> {
  const paths = new Map<string, string[]>();
  function visit(nodeId: string, path: string[]) {
    const node = topology[nodeId];
    if (!node) return;
    const nextPath = nodeId === 'Anchor' ? [] : [...path, nodeId];
    (node.Chips || []).forEach((chipId) => paths.set(chipId, nextPath));
    (node.Connectors || []).forEach((connId) => paths.set(connId, nextPath));
    (node.Buses || []).forEach((busId) => visit(busId, nextPath));
  }
  visit('Anchor', []);
  return paths;
}

const HW_CATEGORY_LABEL: Record<HwCategory, string> = {
  chip: '芯片',
  connector: '连接器',
  mux: 'I²C MUX',
  accessor: '寄存器访问',
};

const SW_CATEGORY_LABEL: Record<SwCategory, string> = {
  component: '组件',
  event: '事件',
  sensor: '传感器',
  firmware: '固件/诊断',
  fru: 'FRU',
  other: '其他',
};

const HW_CATEGORY_COLOR: Record<HwCategory, string> = {
  chip: '#3b82f6',
  connector: '#8b5cf6',
  mux: '#06b6d4',
  accessor: '#f59e0b',
};

const SW_CATEGORY_COLOR: Record<SwCategory, string> = {
  component: '#10b981',
  event: '#ef4444',
  sensor: '#f97316',
  firmware: '#6366f1',
  fru: '#84cc16',
  other: '#6b7280',
};

function ItemCard({
  id,
  label,
  color,
  isSelected,
  isHighlighted,
  isConnected,
  onClick,
  children,
}: {
  id: string;
  label: string;
  color: string;
  isSelected: boolean;
  isHighlighted: boolean;
  isConnected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '8px 10px',
        marginBottom: 4,
        borderRadius: 6,
        border: `1px solid ${isSelected || isConnected ? color : 'rgba(255,255,255,0.08)'}`,
        background: isSelected
          ? `${color}22`
          : isConnected
          ? `${color}11`
          : 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
        opacity: isHighlighted && !isSelected && !isConnected ? 0.35 : 1,
        transition: 'all 0.15s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background: color, boxShadow: isSelected ? `0 0 6px ${color}` : 'none',
        }} />
        <span style={{ fontSize: 12, fontWeight: isSelected ? 600 : 400, color: isSelected ? '#fff' : '#ccc', flex: 1 }}>
          {label}
        </span>
      </div>
      {(isSelected || isConnected) && children && (
        <div style={{ marginTop: 4, paddingLeft: 14 }}>{children}</div>
      )}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: unknown }) {
  const display = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return (
    <div style={{ fontSize: 10, color: '#aaa', marginBottom: 1, display: 'flex', gap: 4 }}>
      <span style={{ color: '#666', flexShrink: 0 }}>{label}:</span>
      <span style={{ color: '#bbb', wordBreak: 'break-all' }}>{display}</span>
    </div>
  );
}

export function SoftwareHardwareAssociationView({ csr }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterHw, setFilterHw] = useState<HwCategory | 'all'>('all');
  const [filterSw, setFilterSw] = useState<SwCategory | 'all'>('all');

  const { hwItems, swItems, allRefs } = useMemo(() => {
    const topology = csr.ManagementTopology || {};
    const objects = (csr.Objects || {}) as Record<string, Record<string, unknown>>;
    const busPaths = buildBusPaths(topology);

    const hwItems: HwItem[] = [];
    const swItems: SwItem[] = [];
    // map: swItemId → set of hwItemIds they reference
    const allRefs = new Map<string, Set<string>>();

    for (const [key, raw] of Object.entries(objects)) {
      const val = (raw || {}) as Record<string, unknown>;
      const hwCat = getHwCategory(key, val);
      const swCat = getSwCategory(key);

      if (hwCat) {
        hwItems.push({
          id: key,
          label: key,
          category: hwCat,
          address: typeof val.Address === 'number' ? val.Address : undefined,
          busPath: busPaths.get(key) || [],
          details: val,
        });
      } else if (swCat) {
        const refs = extractRefs(val);
        swItems.push({
          id: key,
          label: key,
          category: swCat,
          refs,
          details: val,
        });
        allRefs.set(key, new Set(refs));
      }
    }

    return { hwItems, swItems, allRefs };
  }, [csr]);

  // Given selection, compute connected sets
  const { connectedHw, connectedSw } = useMemo(() => {
    if (!selectedId) return { connectedHw: new Set<string>(), connectedSw: new Set<string>() };
    const connectedHw = new Set<string>();
    const connectedSw = new Set<string>();

    // If a hw item is selected, find all sw items that reference it
    if (hwItems.find((h) => h.id === selectedId)) {
      swItems.forEach((sw) => {
        if (sw.refs.includes(selectedId)) connectedSw.add(sw.id);
      });
    }
    // If a sw item is selected, find all hw items it references
    if (swItems.find((s) => s.id === selectedId)) {
      const refs = allRefs.get(selectedId) || new Set();
      refs.forEach((r) => {
        if (hwItems.find((h) => h.id === r)) connectedHw.add(r);
      });
    }
    return { connectedHw, connectedSw };
  }, [selectedId, hwItems, swItems, allRefs]);

  const hasSelection = selectedId !== null;

  const filteredHw = filterHw === 'all' ? hwItems : hwItems.filter((h) => h.category === filterHw);
  const filteredSw = filterSw === 'all' ? swItems : swItems.filter((s) => s.category === filterSw);

  const hwGroups = useMemo(() => {
    const groups: Record<HwCategory, HwItem[]> = { chip: [], connector: [], mux: [], accessor: [] };
    filteredHw.forEach((h) => groups[h.category].push(h));
    return groups;
  }, [filteredHw]);

  const swGroups = useMemo(() => {
    const groups: Record<SwCategory, SwItem[]> = { component: [], event: [], sensor: [], firmware: [], fru: [], other: [] };
    filteredSw.forEach((s) => groups[s.category].push(s));
    return groups;
  }, [filteredSw]);

  // Count connections
  const connectionCount = useMemo(() => {
    let count = 0;
    swItems.forEach((sw) => {
      sw.refs.forEach((r) => {
        if (hwItems.find((h) => h.id === r)) count++;
      });
    });
    return count;
  }, [hwItems, swItems]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#111', color: '#ccc', fontFamily: 'monospace' }}>
      {/* Header bar */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>软硬件关联视图</span>
        <span style={{ fontSize: 11, color: '#666' }}>
          {hwItems.length} 硬件对象 · {swItems.length} 软件对象 · {connectionCount} 关联
        </span>
        {selectedId && (
          <button
            onClick={() => setSelectedId(null)}
            style={{ marginLeft: 'auto', fontSize: 11, padding: '3px 8px', background: '#222', border: '1px solid #444', borderRadius: 4, color: '#ccc', cursor: 'pointer' }}
          >
            清除选择
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div style={{ padding: '6px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', gap: 24, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#555', marginRight: 4 }}>硬件</span>
          {(['all', 'chip', 'connector', 'mux', 'accessor'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterHw(cat)}
              style={{
                fontSize: 10, padding: '2px 7px',
                background: filterHw === cat ? '#333' : 'transparent',
                border: `1px solid ${filterHw === cat ? '#555' : '#333'}`,
                borderRadius: 3, color: filterHw === cat ? '#fff' : '#666', cursor: 'pointer',
              }}
            >
              {cat === 'all' ? '全部' : HW_CATEGORY_LABEL[cat]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#555', marginRight: 4 }}>软件</span>
          {(['all', 'component', 'event', 'sensor', 'firmware', 'fru'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterSw(cat)}
              style={{
                fontSize: 10, padding: '2px 7px',
                background: filterSw === cat ? '#333' : 'transparent',
                border: `1px solid ${filterSw === cat ? '#555' : '#333'}`,
                borderRadius: 3, color: filterSw === cat ? '#fff' : '#666', cursor: 'pointer',
              }}
            >
              {cat === 'all' ? '全部' : SW_CATEGORY_LABEL[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Main panels */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Hardware panel */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 8px 12px 16px', borderRight: '1px solid #1e1e1e' }}>
          <div style={{ fontSize: 11, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            硬件层
          </div>
          {(Object.entries(hwGroups) as [HwCategory, HwItem[]][])
            .filter(([, items]) => items.length > 0)
            .map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: HW_CATEGORY_COLOR[cat], marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 20, height: 1, background: HW_CATEGORY_COLOR[cat], display: 'inline-block' }} />
                  {HW_CATEGORY_LABEL[cat]}
                  <span style={{ color: '#444' }}>({items.length})</span>
                </div>
                {items.map((hw) => (
                  <ItemCard
                    key={hw.id}
                    id={hw.id}
                    label={hw.label}
                    color={HW_CATEGORY_COLOR[hw.category]}
                    isSelected={selectedId === hw.id}
                    isHighlighted={hasSelection && selectedId !== hw.id}
                    isConnected={connectedHw.has(hw.id)}
                    onClick={() => setSelectedId(selectedId === hw.id ? null : hw.id)}
                  >
                    {hw.address !== undefined && (
                      <DetailField label="地址" value={`0x${hw.address.toString(16).toUpperCase()} (${hw.address})`} />
                    )}
                    {hw.busPath.length > 0 && (
                      <DetailField label="总线路径" value={hw.busPath.join(' → ')} />
                    )}
                    {hw.details.OffsetWidth !== undefined && (
                      <DetailField label="偏移宽度" value={hw.details.OffsetWidth} />
                    )}
                    {hw.details.ChannelId !== undefined && (
                      <DetailField label="通道" value={hw.details.ChannelId} />
                    )}
                    {hw.details.Direction !== undefined && (
                      <DetailField label="方向" value={hw.details.Direction} />
                    )}
                    {hw.details.ConnectorType !== undefined && (
                      <DetailField label="接口类型" value={hw.details.ConnectorType} />
                    )}
                    {hw.details.LinkWidth !== undefined && (
                      <DetailField label="通道宽度" value={hw.details.LinkWidth} />
                    )}
                    {connectedHw.has(hw.id) && (
                      <div style={{ fontSize: 10, color: HW_CATEGORY_COLOR[hw.category], marginTop: 2 }}>
                        ← 被选中的软件对象引用
                      </div>
                    )}
                  </ItemCard>
                ))}
              </div>
            ))}
        </div>

        {/* Center: connection summary (optional, visible when item is selected) */}
        {selectedId && (
          <div style={{ width: 160, flexShrink: 0, padding: '12px 8px', borderRight: '1px solid #1e1e1e', overflow: 'auto' }}>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              关联
            </div>
            {connectedHw.size === 0 && connectedSw.size === 0 ? (
              <div style={{ fontSize: 11, color: '#444', marginTop: 20, textAlign: 'center' }}>无直接关联</div>
            ) : (
              <>
                {connectedHw.size > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: '#3b82f6', marginBottom: 4 }}>→ 硬件 ({connectedHw.size})</div>
                    {[...connectedHw].map((id) => (
                      <div
                        key={id}
                        onClick={() => setSelectedId(id)}
                        style={{ fontSize: 10, color: '#7ab3f7', cursor: 'pointer', padding: '3px 6px', borderRadius: 3, marginBottom: 2, background: '#1a2333' }}
                      >
                        {id}
                      </div>
                    ))}
                  </div>
                )}
                {connectedSw.size > 0 && (
                  <div>
                    <div style={{ fontSize: 10, color: '#10b981', marginBottom: 4 }}>← 软件 ({connectedSw.size})</div>
                    {[...connectedSw].map((id) => (
                      <div
                        key={id}
                        onClick={() => setSelectedId(id)}
                        style={{ fontSize: 10, color: '#6ee7b7', cursor: 'pointer', padding: '3px 6px', borderRadius: 3, marginBottom: 2, background: '#1a2b23' }}
                      >
                        {id}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Software panel */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px 12px 8px' }}>
          <div style={{ fontSize: 11, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            软件层
          </div>
          {(Object.entries(swGroups) as [SwCategory, SwItem[]][])
            .filter(([, items]) => items.length > 0)
            .map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: SW_CATEGORY_COLOR[cat], marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 20, height: 1, background: SW_CATEGORY_COLOR[cat], display: 'inline-block' }} />
                  {SW_CATEGORY_LABEL[cat]}
                  <span style={{ color: '#444' }}>({items.length})</span>
                </div>
                {items.map((sw) => {
                  const hwRefs = sw.refs.filter((r) => hwItems.find((h) => h.id === r));
                  return (
                    <ItemCard
                      key={sw.id}
                      id={sw.id}
                      label={sw.label}
                      color={SW_CATEGORY_COLOR[sw.category]}
                      isSelected={selectedId === sw.id}
                      isHighlighted={hasSelection && selectedId !== sw.id}
                      isConnected={connectedSw.has(sw.id)}
                      onClick={() => setSelectedId(selectedId === sw.id ? null : sw.id)}
                    >
                      {/* Show key fields */}
                      {sw.details.EventKeyId !== undefined && (
                        <DetailField label="事件ID" value={sw.details.EventKeyId} />
                      )}
                      {sw.details.Reading !== undefined && (
                        <DetailField label="读取源" value={sw.details.Reading} />
                      )}
                      {sw.details.UID !== undefined && (
                        <DetailField label="UID" value={sw.details.UID} />
                      )}
                      {sw.details.SoftwareId !== undefined && (
                        <DetailField label="SoftwareId" value={sw.details.SoftwareId} />
                      )}
                      {sw.details.FruId !== undefined && (
                        <DetailField label="FruId" value={sw.details.FruId} />
                      )}
                      {sw.details.Type !== undefined && (
                        <DetailField label="类型" value={sw.details.Type} />
                      )}
                      {hwRefs.length > 0 && (
                        <div style={{ marginTop: 3 }}>
                          <span style={{ fontSize: 10, color: '#555' }}>引用硬件: </span>
                          {hwRefs.map((r) => (
                            <span
                              key={r}
                              onClick={(e) => { e.stopPropagation(); setSelectedId(r); }}
                              style={{ fontSize: 10, color: '#7ab3f7', cursor: 'pointer', marginRight: 4 }}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </ItemCard>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
