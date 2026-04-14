import React from 'react';
import type { BoardTopologyModel } from '../types';
import '../styles/board-topology-cards.css';

function busColor(busClass: string): string {
  if (busClass === 'I2c') return '#4a9eff';
  if (busClass === 'I2cMux') return '#7c4dff';
  if (busClass === 'Jtag') return '#ff9800';
  if (busClass === 'Hisport') return '#4caf50';
  if (busClass === 'Gpio') return '#8bc34a';
  return '#888';
}

function deviceColor(type: string): string {
  if (type === 'Chip') return '#ffd54f';
  if (type === 'Scanner') return '#4db6ac';
  if (type === 'ThresholdSensor') return '#f48fb1';
  if (type === 'Event') return '#ef9a9a';
  return '#90a4ae';
}

function deviceKind(name: string): 'smc' | 'lm75' | 'pcie' | 'other' {
  const u = name.toUpperCase();
  if (u.includes('SMC')) return 'smc';
  if (u.includes('LM75')) return 'lm75';
  if (u.includes('PCIE') || u.includes('PCIe'.toUpperCase())) return 'pcie';
  return 'other';
}

export function BoardTopologyCards({ model }: { model: BoardTopologyModel }) {
  return (
    <div className="board-topology-page">
      <div className="board-topology-container">
        <h3 className="board-topology-title">{model.name} 板卡拓扑</h3>
        <p className="board-topology-subtitle">
          自动解析关系链：总线 {'->'} 连接器 {'->'} 板卡 {'->'} 器件
        </p>

        <div className="board-links">
          <div className="board-links-title">板卡间链路</div>
          <div className="board-links-list">
            {model.links.slice(0, 200).map((link, idx) => (
              <div key={`${link.fromBoard}-${idx}`} className="board-link-item">
                <span className="board-link-from">{link.fromBoard}</span>
                {' -> '}
                <span className="board-link-connector">{link.viaConnector}</span>
                {link.viaBus ? (
                  <>
                    {' ['}
                    <span className="board-link-bus">{link.viaBus}</span>
                    {'] '}
                  </>
                ) : ' '}
                {'-> '}
                <span className="board-link-to">{link.toBoard}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="board-cards-grid">
          {model.boards.map((board) => (
            <div key={board.boardInstance} className="board-card">
              <div className="board-card-head">
                <div className="board-card-name">
                  {board.boardType} / {board.boardInstance}
                </div>
                <div className="board-card-file">{board.sourceFile}</div>
              </div>

              <div className="board-card-body">
                <div>
                  <div className="board-sec-title">总线</div>
                  <div className="board-bus-list">
                    {board.buses.map((b) => (
                      <span key={b.name} className="board-bus-chip" style={{ background: busColor(b.busClass) }}>
                        {b.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="board-sec-title">连接器</div>
                  <div className="board-connectors">
                    {board.connectors.map((c) => (
                      <div key={c.name} className="board-connector-item">
                        <div className="board-connector-name">
                          {c.name}
                          {c.slot !== undefined ? ` (Slot:${c.slot})` : ''}
                        </div>
                        <div className="board-connector-meta">
                          Type: {c.type || 'N/A'} {c.silkText ? `| Silk: ${c.silkText}` : ''}
                        </div>
                        {c.buses?.length ? (
                          <div className="board-connector-buses">
                            关联总线：{c.buses.join(', ')}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="board-sec-title">器件</div>
                  <div className="board-mini-canvas">
                    {(() => {
                      type Device = BoardTopologyModel['boards'][number]['devices'][number];
                      const groups: Record<'smc' | 'lm75' | 'pcie' | 'other', Device[]> = {
                        smc: [],
                        lm75: [],
                        pcie: [],
                        other: [],
                      };

                      board.devices.forEach((d) => groups[deviceKind(d.name)].push(d));

                      // 把器件放到“板卡卡片中区”的区域网格里（更像第二张截图的“器件落在板卡内部”）
                      const cols = 3;

                      const regions: Record<'smc' | 'lm75' | 'pcie' | 'other', { xMin: number; xMax: number; yMin: number }> = {
                        smc: { xMin: 20, xMax: 48, yMin: 54 },
                        pcie: { xMin: 48, xMax: 72, yMin: 74 },
                        lm75: { xMin: 72, xMax: 88, yMin: 52 },
                        other: { xMin: 32, xMax: 80, yMin: 92 },
                      };

                      const yGap = 22;

                      const renderNodes = (kind: 'smc' | 'lm75' | 'pcie' | 'other') => {
                        const nodes = groups[kind];
                        const region = regions[kind];
                        const xStep = cols <= 1 ? 0 : (region.xMax - region.xMin) / (cols - 1);
                        return nodes.map((d, idx) => {
                          const color = deviceColor(d.type);
                          const col = idx % cols;
                          const row = Math.floor(idx / cols);
                          const x = region.xMin + col * xStep;
                          const y = region.yMin + row * yGap;
                          return (
                            <div
                              key={`${d.name}-${kind}-${idx}`}
                              className={`board-mini-node board-mini-node--${kind}`}
                              style={{
                                left: `${x}%`,
                                top: `${y}px`,
                                borderLeftColor: color,
                              }}
                              title={`${d.name}\nType:${d.type}\nBus:${d.refBus || '—'}\nConnector:${d.refConnector || '—'}`}
                            >
                              <div className="board-mini-node-name">{d.name}</div>
                              <div className="board-mini-node-meta">{d.type}</div>
                            </div>
                          );
                        });
                      };

                      return (
                        <>
                          {renderNodes('smc')}
                          {renderNodes('pcie')}
                          {renderNodes('lm75')}
                          {renderNodes('other')}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

