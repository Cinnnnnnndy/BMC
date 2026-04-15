import React, { useMemo, useState } from 'react';
import type { CSRDocument } from '../types';

function extractScanners(obj: Record<string, unknown>): Array<{ id: string; def: Record<string, unknown> }> {
  return Object.entries(obj).filter(([id]) => id.startsWith('Scanner_')).map(([id, def]) => ({ id, def: def as Record<string, unknown> }));
}

function extractThresholdSensors(obj: Record<string, unknown>): Array<{ id: string; def: Record<string, unknown> }> {
  return Object.entries(obj).filter(([id]) => id.startsWith('ThresholdSensor_')).map(([id, def]) => ({ id, def: def as Record<string, unknown> }));
}

interface Props {
  csr: CSRDocument;
  onChange: (csr: CSRDocument) => void;
}

export function SensorConfig({ csr, onChange }: Props) {
  const [tab, setTab] = useState<'scanner' | 'threshold'>('scanner');
  const scanners = useMemo(() => extractScanners(csr.Objects || {}), [csr.Objects]);
  const sensors = useMemo(() => extractThresholdSensors(csr.Objects || {}), [csr.Objects]);
  const [selected, setSelected] = useState<string | null>(null);
  const obj = csr.Objects || {};
  const list = tab === 'scanner' ? scanners : sensors;

  const handleUpdate = (id: string, field: string, value: unknown) => {
    const next = { ...obj };
    if (!next[id]) next[id] = {};
    (next[id] as Record<string, unknown>)[field] = value;
    onChange({ ...csr, Objects: next });
  };

  const handleAdd = () => {
    const prefix = tab === 'scanner' ? 'Scanner_' : 'ThresholdSensor_';
    let id = `${prefix}New`;
    let i = 0;
    while (obj[id]) id = `${prefix}New_${++i}`;
    const next = { ...obj };
    next[id] = tab === 'scanner'
      ? { Chip: '', Offset: 0, Size: 1, Period: 1000, Value: 0 }
      : { Reading: '', SensorName: '', EntityId: '', EntityInstance: '' };
    onChange({ ...csr, Objects: next });
    setSelected(id);
  };

  const handleDelete = (id: string) => {
    const next = { ...obj };
    delete next[id];
    onChange({ ...csr, Objects: next });
    if (selected === id) setSelected(null);
  };

  const chipOptions = Object.keys(obj).filter((k) => k.startsWith('Chip_') || k.startsWith('Pca') || k.startsWith('Ads') || k.startsWith('Eeprom'));

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <aside style={{ width: 260, borderRight: '1px solid #3c3c3c', overflowY: 'auto', padding: 8 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => { setTab('scanner'); setSelected(null); }} style={{ flex: 1, padding: 8, background: tab === 'scanner' ? '#0e639c' : '#333', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Scanner</button>
          <button onClick={() => { setTab('threshold'); setSelected(null); }} style={{ flex: 1, padding: 8, background: tab === 'threshold' ? '#0e639c' : '#333', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>ThresholdSensor</button>
        </div>
        <button onClick={handleAdd} style={{ width: '100%', padding: 8, marginBottom: 8, background: '#0e639c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>+ 新增</button>
        {list.map((e) => (
          <div key={e.id} onClick={() => setSelected(e.id)} style={{ padding: 8, marginBottom: 4, background: selected === e.id ? '#0e639c33' : '#252526', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>{e.id}</div>
        ))}
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {selected && list.find((e) => e.id === selected) ? (
          tab === 'scanner' ? (
            <ScannerForm id={selected} def={list.find((e) => e.id === selected)!.def} chipOptions={chipOptions} onUpdate={(f, v) => handleUpdate(selected, f, v)} onDelete={() => handleDelete(selected)} />
          ) : (
            <ThresholdSensorForm id={selected} def={list.find((e) => e.id === selected)!.def} objectKeys={Object.keys(obj)} onUpdate={(f, v) => handleUpdate(selected, f, v)} onDelete={() => handleDelete(selected)} />
          )
        ) : (
          <div style={{ color: '#888', padding: 24 }}>请在左侧选择或新增传感器进行配置</div>
        )}
      </main>
    </div>
  );
}

function ScannerForm({ id, def, chipOptions, onUpdate, onDelete }: { id: string; def: Record<string, unknown>; chipOptions: string[]; onUpdate: (field: string, value: unknown) => void; onDelete: () => void }) {
  const chipRefs = chipOptions.map((c) => ({ value: `#/${c}`, label: c }));
  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>{id}</h3>
      {[{ key: 'Chip', label: 'Chip', options: chipRefs }, { key: 'Offset', label: 'Offset', type: 'number' }, { key: 'Size', label: 'Size', type: 'number' }, { key: 'Mask', label: 'Mask', type: 'number' }, { key: 'Type', label: 'Type', type: 'number' }, { key: 'Period', label: 'Period (ms)', type: 'number' }, { key: 'Value', label: 'Value', type: 'number' }].map((f) => (
        <div key={f.key} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ width: 120, fontSize: 12 }}>{f.label}</label>
          {f.type === 'number' ? (
            <input type="number" value={String(def[f.key] ?? '')} onChange={(e) => onUpdate(f.key, e.target.value === '' ? 0 : Number(e.target.value))} style={{ flex: 1, padding: 6, background: '#3c3c3c', border: '1px solid #555', color: '#fff', borderRadius: 4 }} />
          ) : (
            <select value={String(def[f.key] ?? '')} onChange={(e) => onUpdate(f.key, e.target.value)} style={{ flex: 1, padding: 6, background: '#3c3c3c', border: '1px solid #555', color: '#fff', borderRadius: 4 }}>
              <option value="">-- 选择 Chip --</option>
              {(f.options || []).map((o: { value: string; label: string }) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          )}
        </div>
      ))}
      <button onClick={onDelete} style={{ marginTop: 16, padding: '8px 16px', background: '#c53030', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>删除</button>
    </div>
  );
}

function ThresholdSensorForm({ id, def, objectKeys, onUpdate, onDelete }: { id: string; def: Record<string, unknown>; objectKeys: string[]; onUpdate: (field: string, value: unknown) => void; onDelete: () => void }) {
  const readingOptions = objectKeys.filter((k) => k.startsWith('Scanner_')).map((k) => ({ value: `<=/${k}.Value`, label: k }));
  const entityOpts = (key: string) => objectKeys.filter((k) => k.startsWith('Entity_')).map((k) => ({ value: key === 'EntityId' ? `<=/${k}.Id` : `<=/${k}.Instance`, label: k }));
  const fields = [
    { key: 'SensorName', label: 'SensorName', type: 'text' },
    { key: 'Reading', label: 'Reading', options: readingOptions },
    { key: 'ReadingStatus', label: 'ReadingStatus', options: objectKeys.map((k) => ({ value: `#/${k}.Value`, label: k })) },
    { key: 'EntityId', label: 'EntityId', options: entityOpts('EntityId') },
    { key: 'EntityInstance', label: 'EntityInstance', options: entityOpts('EntityInstance') },
    { key: 'UpperCritical', label: 'UpperCritical', type: 'number' },
    { key: 'LowerCritical', label: 'LowerCritical', type: 'number' },
    { key: 'UpperNoncritical', label: 'UpperNoncritical', type: 'number' },
    { key: 'LowerNoncritical', label: 'LowerNoncritical', type: 'number' },
    { key: 'PositiveHysteresis', label: 'PositiveHysteresis', type: 'number' },
    { key: 'NegativeHysteresis', label: 'NegativeHysteresis', type: 'number' },
  ];
  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>{id}</h3>
      {fields.map((f) => (
        <div key={f.key} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ width: 140, fontSize: 12 }}>{f.label}</label>
          {f.type === 'number' ? (
            <input type="number" value={String(def[f.key] ?? '')} onChange={(e) => onUpdate(f.key, e.target.value === '' ? 0 : Number(e.target.value))} style={{ flex: 1, padding: 6, background: '#3c3c3c', border: '1px solid #555', color: '#fff', borderRadius: 4 }} />
          ) : f.options?.length ? (
            <select value={String(def[f.key] ?? '')} onChange={(e) => onUpdate(f.key, e.target.value)} style={{ flex: 1, padding: 6, background: '#3c3c3c', border: '1px solid #555', color: '#fff', borderRadius: 4 }}>
              <option value="">-- 选择 --</option>
              {(f.options as Array<{ value: string; label: string }>).map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          ) : (
            <input type="text" value={String(def[f.key] ?? '')} onChange={(e) => onUpdate(f.key, e.target.value)} style={{ flex: 1, padding: 6, background: '#3c3c3c', border: '1px solid #555', color: '#fff', borderRadius: 4 }} />
          )}
        </div>
      ))}
      <button onClick={onDelete} style={{ marginTop: 16, padding: '8px 16px', background: '#c53030', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>删除</button>
    </div>
  );
}
