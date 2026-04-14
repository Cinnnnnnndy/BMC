import React, { useMemo, useState } from 'react';
import type { CSRDocument } from '../types';

interface EventDefItem {
  EventKeyId?: string;
  EventName?: string;
  EventCode?: string;
}

interface Props {
  csr: CSRDocument;
  eventDef?: Record<string, unknown> | null;
  onChange: (csr: CSRDocument) => void;
}

function extractEvents(obj: Record<string, unknown>): Array<{ id: string; def: Record<string, unknown> }> {
  return Object.entries(obj)
    .filter(([id]) => id.startsWith('Event_'))
    .map(([id, def]) => ({ id, def: def as Record<string, unknown> }));
}

export function EventConfig({ csr, eventDef, onChange }: Props) {
  const events = useMemo(() => extractEvents(csr.Objects || {}), [csr.Objects]);
  const [selected, setSelected] = useState<string | null>(null);
  const defList = useMemo(() => {
    const list = (eventDef?.EventDefinition as EventDefItem[]) || [];
    return list.map((d) => ({ key: d.EventKeyId, name: d.EventName, code: d.EventCode }));
  }, [eventDef]);

  const selectedEvent = selected ? events.find((e) => e.id === selected) : null;
  const obj = csr.Objects || {};

  const handleUpdate = (id: string, field: string, value: unknown) => {
    const next = { ...obj };
    if (!next[id]) next[id] = {};
    (next[id] as Record<string, unknown>)[field] = value;
    onChange({ ...csr, Objects: next });
  };

  const handleAdd = () => {
    const base = 'Event_New';
    let id = base;
    let i = 0;
    while (obj[id]) id = `${base}_${++i}`;
    const next = { ...obj };
    next[id] = { EventKeyId: '', Reading: '', Condition: 0, OperatorId: 5, Enabled: true, Component: '' };
    onChange({ ...csr, Objects: next });
    setSelected(id);
  };

  const handleDelete = (id: string) => {
    const next = { ...obj };
    delete next[id];
    onChange({ ...csr, Objects: next });
    if (selected === id) setSelected(null);
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <aside style={{ width: 260, borderRight: '1px solid #3c3c3c', overflowY: 'auto', padding: 8 }}>
        <button onClick={handleAdd} style={{ width: '100%', padding: 8, marginBottom: 8, background: '#0e639c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + 新增事件
        </button>
        {events.map((e) => (
          <div
            key={e.id}
            onClick={() => setSelected(e.id)}
            style={{ padding: 8, marginBottom: 4, background: selected === e.id ? '#0e639c33' : '#252526', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
          >
            {e.id}
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {selectedEvent ? (
          <EventForm
            id={selectedEvent.id}
            def={selectedEvent.def}
            defList={defList}
            objectKeys={Object.keys(obj).filter((k) => !k.startsWith('Event_'))}
            onUpdate={(field, value) => handleUpdate(selectedEvent.id, field, value)}
            onDelete={() => handleDelete(selectedEvent.id)}
          />
        ) : (
          <div style={{ color: '#888', padding: 24 }}>请在左侧选择或新增事件进行配置</div>
        )}
      </main>
    </div>
  );
}

function EventForm({
  id,
  def,
  defList,
  objectKeys,
  onUpdate,
  onDelete,
}: {
  id: string;
  def: Record<string, unknown>;
  defList: Array<{ key?: string; name?: string; code?: string }>;
  objectKeys: string[];
  onUpdate: (field: string, value: unknown) => void;
  onDelete: () => void;
}) {
  const fields = [
    { key: 'EventKeyId', label: 'EventKeyId', type: 'select', options: defList.map((d) => ({ value: d.key || '', label: `${d.name || d.key} (${d.code || ''})` })) },
    { key: 'Reading', label: 'Reading', type: 'ref', options: objectKeys },
    { key: 'Condition', label: 'Condition', type: 'number' },
    { key: 'OperatorId', label: 'OperatorId', type: 'number' },
    { key: 'Enabled', label: 'Enabled', type: 'boolean' },
    { key: 'Component', label: 'Component', type: 'ref', options: objectKeys.filter((k) => k.startsWith('Component_')) },
    { key: 'Hysteresis', label: 'Hysteresis', type: 'text' },
    { key: 'DescArg1', label: 'DescArg1', type: 'ref', options: objectKeys },
    { key: 'DescArg2', label: 'DescArg2', type: 'ref', options: objectKeys },
    { key: 'DescArg3', label: 'DescArg3', type: 'text' },
    { key: 'DescArg4', label: 'DescArg4', type: 'ref', options: objectKeys },
    { key: 'DescArg5', label: 'DescArg5', type: 'text' },
  ];

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>{id}</h3>
      {fields.map((f) => (
        <div key={f.key} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ width: 120, fontSize: 12 }}>{f.label}</label>
          {f.type === 'number' && (
            <input
              type="number"
              value={String(def[f.key] ?? '')}
              onChange={(e) => onUpdate(f.key, e.target.value === '' ? 0 : Number(e.target.value))}
              style={{ flex: 1, padding: 6, background: '#3c3c3c', border: '1px solid #555', color: '#fff', borderRadius: 4 }}
            />
          )}
          {f.type === 'boolean' && (
            <input type="checkbox" checked={Boolean(def[f.key])} onChange={(e) => onUpdate(f.key, e.target.checked)} />
          )}
          {(f.type === 'text' || f.type === 'ref') && (
            <input
              type="text"
              value={String(def[f.key] ?? '')}
              onChange={(e) => onUpdate(f.key, e.target.value)}
              style={{ flex: 1, padding: 6, background: '#3c3c3c', border: '1px solid #555', color: '#fff', borderRadius: 4 }}
            />
          )}
          {f.type === 'select' && (
            <select
              value={String(def[f.key] ?? '')}
              onChange={(e) => onUpdate(f.key, e.target.value)}
              style={{ flex: 1, padding: 6, background: '#3c3c3c', border: '1px solid #555', color: '#fff', borderRadius: 4 }}
            >
              <option value="">-- 选择 --</option>
              {(f.options || []).map((o: { value: string; label: string }) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>
      ))}
      <button onClick={onDelete} style={{ marginTop: 16, padding: '8px 16px', background: '#c53030', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        删除事件
      </button>
    </div>
  );
}
