import { useMemo, useState } from 'react';
import type { CSRDocument } from '../types';
import { parseBoardTopologyFromCsr } from '../boardTopologyParser';
import type { BoardTopologyCard } from '../types';
import { boardShape } from './topology-shapes';
import {
  TAISHAN_CODE_MAP,
  TAISHAN_EDGE_LINES,
  TAISHAN_GRAPH_ORDER,
  TAISHAN_NODE_POS,
  getTaishanPopoverPos,
} from '../data/taishanLayout';
import '../styles/taishan-topology.css';

export function TaiShanBoardTopologyView({ csr }: { csr: CSRDocument }) {
  const model = useMemo(() => parseBoardTopologyFromCsr(csr, 'TaiShan 200 2180'), [csr]);
  const [selected, setSelected] = useState<string | null>(null);

  const pick = (keywords: string[]): BoardTopologyCard | undefined =>
    model.boards.find((b) => keywords.some((k) => b.boardInstance.toUpperCase().includes(k) || b.boardType.toUpperCase().includes(k)));

  const boardMap = {
    Root: pick(['ROOT']),
    EXU: pick(['EXU']),
    BCU: pick(['BCU']),
    Riser: pick(['IEU', 'RISER']),
    SDI: pick(['SDI']),
    CLU: pick(['CLU']),
    SEU: pick(['SEU']),
    NIC: pick(['NIC']),
  };

  const statText = (b?: BoardTopologyCard) =>
    b ? `总线 ${b.buses.length} / 连接器 ${b.connectors.length} / 器件 ${b.devices.length}` : '待接入';

  const selectedBoard = selected ? boardMap[selected as keyof typeof boardMap] : undefined;

  const toggleSelect = (key: string) => {
    setSelected((prev) => (prev === key ? null : key));
  };
  const popPos = selected ? getTaishanPopoverPos(selected) : null;

  const renderRiserInternalMiniTopology = () => {
    // 用启发式方式从整个 model 里聚合“Riser(IEU) 内部”与 9545/I2cMux/PCIe 相关的总线/连接器/器件。
    // 因为当前 parse 对“内部 Connector 属于哪个板卡边界”未完全等价 openUBMC 的逐级加载语义，
    // 这里用数据引用关系（refBus/refConnector/buses）来兜底让拓扑能先可视化。
    const allBoards = model.boards;
    const allDevices = allBoards.flatMap((b) => b.devices);
    const allConnectors = allBoards.flatMap((b) => b.connectors);

    const isRiserishBus = (bus: string) => /9545/i.test(bus) || /^I2c_/i.test(bus) || /^Hisport/i.test(bus) || /I2cMux/i.test(bus);
    const isRiserishDevice = (d: BoardTopologyCard['devices'][number]) => {
      const rb = d.refBus || '';
      return /PCA9545|PCA9555|Eeprom|Chip_MCU|MCU/i.test(d.name) || /9545/i.test(rb) || /I2cMux/i.test(rb);
    };
    const isRiserishConnector = (c: BoardTopologyCard['connectors'][number]) => {
      const buses = c.buses || [];
      return /PCIe/i.test(c.name) || buses.some((b) => /9545/i.test(b) || isRiserishBus(b));
    };

    const devices = Array.from(new Map(allDevices.filter(isRiserishDevice).map((d) => [d.name, d])).values());
    const connectors = Array.from(new Map(allConnectors.filter(isRiserishConnector).map((c) => [c.name, c])).values());

    const busSet = new Set<string>();
    for (const d of devices) if (d.refBus) busSet.add(d.refBus);
    for (const c of connectors) for (const b of c.buses || []) busSet.add(b);

    const buses = Array.from(busSet);
    // 让图里更像示意图：I2c_1 / I2cMux_9545Chan* 这类放前面
    buses.sort((a, b) => {
      const score = (x: string) => {
        if (/^I2c_/i.test(x)) return 0;
        if (/I2cMux_.*9545/i.test(x)) return 1;
        if (/9545/i.test(x)) return 2;
        return 3;
      };
      return score(a) - score(b) || a.localeCompare(b);
    });

    const deviceByBus = new Map<string, typeof devices>();
    for (const d of devices) {
      if (!d.refBus) continue;
      if (!deviceByBus.has(d.refBus)) deviceByBus.set(d.refBus, []);
      deviceByBus.get(d.refBus)!.push(d);
    }
    for (const arr of deviceByBus.values()) arr.sort((a, b) => a.name.localeCompare(b.name));

    const devicesByConnector = new Map<string, typeof devices>();
    for (const d of devices) {
      if (!d.refConnector) continue;
      if (!devicesByConnector.has(d.refConnector)) devicesByConnector.set(d.refConnector, []);
      devicesByConnector.get(d.refConnector)!.push(d);
    }

    // 简单布局：左侧 bus，右侧 connector，中间 device；用浅色方块表现
    // 这个版本用于“Riser 节点内部”，尺寸要压缩，便于直接塞进放大的节点
    const width = 300;
    const height = 170;
    const leftX = 26;
    const midX = 108;
    const rightX = 210;
    const busYStart = 16;
    const busYGap = 34;
    const devYGap = 15;

    const busNodes = buses.slice(0, 4);
    const connectorNodes = connectors.slice(0, 3);

    const busColor = '#7aa6ff';
    const connectorStroke = '#a78bfa';
    const deviceStroke = 'rgba(255,255,255,0.22)';

    const busToConnector = (bus: string) =>
      connectorNodes.filter((c) => (c.buses || []).some((b) => b === bus || (bus === c.buses?.[0] && b === bus)));

    return (
      <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >

          {/* buses on left */}
          {busNodes.map((bus, idx) => {
            const y = busYStart + idx * busYGap;
            const devList = deviceByBus.get(bus) || [];
            const cn = busToConnector(bus);
            return (
              <g key={`bus-${bus}`}>
                <rect x={leftX - 14} y={y - 10} width={68} height={20} rx={4} fill="rgba(64,160,255,0.10)" stroke={busColor} strokeWidth={1} />
                <text x={leftX + 20} y={y + 3} textAnchor="end" fontSize={9} fill="var(--taishan-node-text)">
                  {bus.length > 14 ? `${bus.slice(0, 10)}…` : bus}
                </text>

                {/* lines bus -> devices */}
                {devList.slice(0, 3).map((d, dIdx) => {
                  const dy = y + (dIdx - 1) * devYGap;
                  const devId = d.name;
                  return (
                    <g key={`busline-${devId}`}>
                      <line x1={leftX + 34} y1={y} x2={midX - 4} y2={dy} stroke="rgba(124,77,255,0.35)" strokeWidth={1.2} />
                      <rect x={midX} y={dy - 7} width={92} height={14} rx={3} fill="rgba(255,255,255,0.04)" stroke={deviceStroke} strokeWidth={1} />
                      <text x={midX + 46} y={dy + 2} textAnchor="middle" fontSize={9} fill="var(--taishan-node-text)">
                        {d.name.length > 18 ? `${d.name.slice(0, 10)}…` : d.name}
                      </text>
                    </g>
                  );
                })}

                {/* connector blocks on right */}
                {cn.slice(0, 2).map((c, cIdx) => {
                  const cy = y + (cIdx - 0.5) * 18;
                  return (
                    <g key={`conn-${c.name}`}>
                      <line x1={leftX + 34} y1={y} x2={rightX - 12} y2={cy} stroke="rgba(64,160,255,0.25)" strokeWidth={1} />
                      <rect x={rightX - 66} y={cy - 10} width={72} height={20} rx={4} fill="rgba(124,77,255,0.10)" stroke={connectorStroke} strokeWidth={1} />
                      <text x={rightX - 30} y={cy + 3} textAnchor="start" fontSize={9} fill="var(--taishan-node-text)">
                        {c.name.length > 13 ? `${c.name.slice(0, 9)}…` : c.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="taishan-topology">
      <div className="taishan-canvas-wrap">
        <svg width={980} height={520} style={{ position: 'absolute', left: 24, top: 24, pointerEvents: 'none' }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--taishan-line-strong)" />
            </marker>
          </defs>
          {TAISHAN_EDGE_LINES.map((l, idx) => (
            <line
              key={`line-${idx}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="var(--taishan-line)"
              strokeWidth="2"
              markerEnd={l.arrow ? 'url(#arrow)' : undefined}
            />
          ))}
        </svg>

        <div className="taishan-stage">
          {TAISHAN_GRAPH_ORDER.map((key) => {
            const p = TAISHAN_NODE_POS[key];
            const isRiserNode = key === 'Riser';
            const label = key === 'Root' ? 'BMC' : isRiserNode ? 'IEU' : key;
            const boardForKey = boardMap[key as keyof typeof boardMap];
            return (
              <div
                key={key}
                className={`taishan-node ${selected === key ? 'is-selected' : ''} ${isRiserNode ? 'taishan-node--riser-expanded' : ''}`}
                style={{
                  left: p.left,
                  top: p.top,
                }}
                onClick={() => toggleSelect(key)}
              >
                {isRiserNode ? (
                  <div className="taishan-riser-expanded-inner">
                    <div className="taishan-riser-expanded-header">
                      {boardShape(key, label, '', selected === key, boardForKey?.devices)}
                    </div>
                    <div className="taishan-riser-expanded-body">{renderRiserInternalMiniTopology()}</div>
                  </div>
                ) : (
                  boardShape(key, label, TAISHAN_CODE_MAP[key], selected === key, boardForKey?.devices)
                )}
              </div>
            );
          })}

          {selected && selected !== 'Riser' && (
            <div
              className={`taishan-config-pop ${popPos?.side === 'left' ? 'is-left' : 'is-right'}`}
              style={{ left: popPos?.left, top: popPos?.top }}
            >
              <div className="taishan-config-tail" />
              <div className="taishan-config-head">
                <div className="taishan-config-title">{selected} 配置</div>
                <button onClick={() => setSelected(null)} className="taishan-close">×</button>
              </div>
              <div className="taishan-config-stat">{statText(selectedBoard)}</div>
              {selectedBoard ? (
                <>
                  <div className="taishan-config-section">
                    <div className="taishan-kv-title">总线</div>
                    <div className="taishan-chip-wrap">
                      {selectedBoard.buses.map((b) => (
                        <span key={b.name} className="taishan-chip">
                          {b.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="taishan-config-section">
                    <div className="taishan-kv-title">连接器</div>
                    {selectedBoard.connectors.slice(0, 6).map((c) => (
                      <div key={c.name} className="taishan-kv-item">
                        {c.name}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="taishan-kv-title">器件</div>
                    {selectedBoard.devices.slice(0, 8).map((d) => (
                      <div key={d.name} className="taishan-kv-item">
                        {d.name} ({d.type})
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="taishan-config-empty">当前 CSR 未解析到该板卡对象。</div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="taishan-note">
          拓扑结构参考：Root(BMC) → EXU → BCU → Riser → SDI，且从 BCU 总线分支到 CLU/SEU/NIC。
        </div>
      </div>

    </div>
  );
}

