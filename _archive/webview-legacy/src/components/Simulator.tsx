import React, { useMemo, useState, useCallback } from 'react';
import type { CSRDocument } from '../types';

interface Props {
  csr: CSRDocument;
}

/**
 * 仿真调试：模拟 Scanner/Expression 取值，便于验证配置
 */
export function Simulator({ csr }: Props) {
  const objects = csr.Objects || {};
  const scanners = useMemo(
    () =>
      Object.entries(objects)
        .filter(([id]) => id.startsWith('Scanner_'))
        .map(([id]) => id),
    [objects]
  );
  const sensors = useMemo(
    () =>
      Object.entries(objects)
        .filter(([id]) => id.startsWith('ThresholdSensor_'))
        .map(([id]) => id),
    [objects]
  );

  const [mockValues, setMockValues] = useState<Record<string, number>>({});
  const [selectedScanner, setSelectedScanner] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const setMock = useCallback((id: string, value: number) => {
    setMockValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const getMockValue = useCallback(
    (id: string): number => mockValues[id] ?? 0,
    [mockValues]
  );

  const selectedScannerDef = selectedScanner ? (objects[selectedScanner] as Record<string, unknown>) : null;
  const selectedSensorDef = selectedSensor ? (objects[selectedSensor] as Record<string, unknown>) : null;

  return (
    <div style={{ display: 'flex', height: '100%', padding: 16, gap: 24, overflow: 'hidden' }}>
      <section style={{ flex: 1, overflowY: 'auto' }}>
        <h3 style={{ marginBottom: 12, fontSize: 14 }}>Scanner 仿真</h3>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
          为 Scanner 设置模拟值，用于验证下游 ThresholdSensor / Event 的触发逻辑
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {scanners.map((id) => (
            <div
              key={id}
              style={{
                padding: 12,
                background: selectedScanner === id ? '#0e639c33' : '#252526',
                borderRadius: 8,
                border: `1px solid ${selectedScanner === id ? '#0e639c' : '#3c3c3c'}`,
              }}
            >
              <div style={{ fontSize: 12, marginBottom: 8 }}>{id}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="number"
                  value={mockValues[id] ?? ''}
                  onChange={(e) => setMock(id, e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="模拟 Value"
                  style={{
                    width: 100,
                    padding: 6,
                    background: '#3c3c3c',
                    border: '1px solid #555',
                    color: '#fff',
                    borderRadius: 4,
                  }}
                />
                <button
                  onClick={() => setSelectedScanner(selectedScanner === id ? null : id)}
                  style={{
                    padding: '4px 8px',
                    fontSize: 11,
                    background: '#333',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  详情
                </button>
              </div>
            </div>
          ))}
        </div>
        {scanners.length === 0 && (
          <div style={{ color: '#888', fontSize: 12 }}>当前 CSR 中暂无 Scanner 对象</div>
        )}
      </section>

      <section style={{ flex: 1, overflowY: 'auto' }}>
        <h3 style={{ marginBottom: 12, fontSize: 14 }}>ThresholdSensor 仿真</h3>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
          查看传感器依赖的 Reading 及当前仿真取值
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sensors.map((id) => {
            const def = objects[id] as Record<string, unknown> | undefined;
            const reading = def?.Reading as string | undefined;
            const readingStr = String(reading || '');
            const refMatch = readingStr.match(/<=\/([^.]+)\.(\w+)/);
            const refId = refMatch?.[1];
            const refField = refMatch?.[2] || 'Value';
            const mockVal = refId ? getMockValue(refId) : null;

            return (
              <div
                key={id}
                onClick={() => setSelectedSensor(selectedSensor === id ? null : id)}
                style={{
                  padding: 12,
                  background: selectedSensor === id ? '#0e639c33' : '#252526',
                  borderRadius: 8,
                  border: `1px solid ${selectedSensor === id ? '#0e639c' : '#3c3c3c'}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 12, marginBottom: 4 }}>{id}</div>
                <div style={{ fontSize: 11, color: '#888' }}>
                  Reading: {readingStr}
                  {mockVal !== null && (
                    <span style={{ marginLeft: 8, color: '#4ec9b0' }}> → 仿真值: {mockVal}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {sensors.length === 0 && (
          <div style={{ color: '#888', fontSize: 12 }}>当前 CSR 中暂无 ThresholdSensor 对象</div>
        )}
      </section>

      {selectedScanner && selectedScannerDef && (
        <aside
          style={{
            width: 280,
            padding: 16,
            background: '#252526',
            borderRadius: 8,
            border: '1px solid #3c3c3c',
          }}
        >
          <h4 style={{ marginBottom: 12 }}>{selectedScanner}</h4>
          <pre style={{ fontSize: 11, overflow: 'auto', maxHeight: 300 }}>
            {JSON.stringify(selectedScannerDef, null, 2)}
          </pre>
        </aside>
      )}
      {selectedSensor && selectedSensorDef && (
        <aside
          style={{
            width: 280,
            padding: 16,
            background: '#252526',
            borderRadius: 8,
            border: '1px solid #3c3c3c',
          }}
        >
          <h4 style={{ marginBottom: 12 }}>{selectedSensor}</h4>
          <pre style={{ fontSize: 11, overflow: 'auto', maxHeight: 300 }}>
            {JSON.stringify(selectedSensorDef, null, 2)}
          </pre>
        </aside>
      )}
    </div>
  );
}
