import type { ServerPart } from './simulatorParts';

/** 轴侧视角下各板卡内部的示意细节（非序号，仅结构示意） */
export function SimulatorBoardGraphics({ part }: { part: ServerPart }) {
  switch (part.id) {
    case 'chassis':
      return (
        <div className="sim-board-inner sim-board-inner--chassis">
          <div className="sim-rail sim-rail--l" />
          <div className="sim-rail sim-rail--r" />
          <div className="sim-chassis-floor" />
        </div>
      );
    case 'mainboard':
      return (
        <div className="sim-board-inner sim-board-inner--mainboard">
          <div className="sim-mb-trace" />
          <div className="sim-mb-cpu-row">
            <div className="sim-heatsink" />
            <div className="sim-heatsink" />
          </div>
          <div className="sim-mb-dimm-banks">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="sim-dimm-row">
                {[0, 1, 2, 3, 4, 5].map((c) => (
                  <div key={c} className="sim-dimm" />
                ))}
              </div>
            ))}
          </div>
          <div className="sim-mb-io-edge">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="sim-io-port" />
            ))}
          </div>
          <div className="sim-mb-chip" />
        </div>
      );
    case 'psu':
      return (
        <div className="sim-board-inner sim-board-inner--psu">
          <div className="sim-psu-bay">
            <div className="sim-psu-grille" />
            <div className="sim-psu-handle" />
          </div>
          <div className="sim-psu-bay">
            <div className="sim-psu-grille" />
            <div className="sim-psu-handle" />
          </div>
        </div>
      );
    case 'fan':
      return (
        <div className="sim-board-inner sim-board-inner--fan">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="sim-fan-unit">
              <div className="sim-fan-hub" />
              {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => (
                <div key={b} className="sim-fan-blade" style={{ transform: `rotate(${b * 45}deg)` }} />
              ))}
            </div>
          ))}
        </div>
      );
    case 'shroud':
      return (
        <div className="sim-board-inner sim-board-inner--shroud">
          <div className="sim-shroud-duct" />
          <div className="sim-shroud-vent" />
        </div>
      );
    case 'disk':
      return (
        <div className="sim-board-inner sim-board-inner--disk">
          <div className="sim-bp-slots">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="sim-bp-slot" />
            ))}
          </div>
          <div className="sim-bp-trace" />
        </div>
      );
    case 'storage':
      return (
        <div className="sim-board-inner sim-board-inner--storage">
          <div className="sim-stor-grid">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="sim-stor-cell" />
            ))}
          </div>
        </div>
      );
    case 'pcie':
    case 'riser':
    case 'slot':
      return (
        <div className="sim-board-inner sim-board-inner--pcie">
          <div className="sim-pcie-edge" />
          <div className="sim-pcie-chips">
            <div className="sim-pcie-chip" />
            <div className="sim-pcie-chip" />
          </div>
          <div className="sim-pcie-conn" />
        </div>
      );
    case 'cpu':
      return (
        <div className="sim-board-inner sim-board-inner--cpu">
          <div className="sim-cpu-socket">
            <div className="sim-cpu-lid" />
          </div>
          <div className="sim-cpu-socket">
            <div className="sim-cpu-lid" />
          </div>
        </div>
      );
    case 'memory':
      return (
        <div className="sim-board-inner sim-board-inner--memory">
          {[0, 1].map((g) => (
            <div key={g} className="sim-mem-group">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="sim-dimm-stick" />
              ))}
            </div>
          ))}
        </div>
      );
    case 'bmc':
      return (
        <div className="sim-board-inner sim-board-inner--bmc">
          <div className="sim-bmc-soc" />
          <div className="sim-bmc-leds">
            <span /><span /><span />
          </div>
        </div>
      );
    case 'nic':
    case 'mgmt':
    case 'front-io':
    case 'io':
      return (
        <div className="sim-board-inner sim-board-inner--io">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="sim-io-jack" />
          ))}
        </div>
      );
    case 'chipset':
    case 'fpga':
    case 'debug':
      return (
        <div className="sim-board-inner sim-board-inner--chip">
          <div className="sim-chip-die" />
          <div className="sim-chip-pins" />
        </div>
      );
    case 'midplane':
      return (
        <div className="sim-board-inner sim-board-inner--mid">
          <div className="sim-mid-trace" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="sim-mid-pin" />
          ))}
        </div>
      );
    default:
      return <div className="sim-board-inner sim-board-inner--generic" />;
  }
}
