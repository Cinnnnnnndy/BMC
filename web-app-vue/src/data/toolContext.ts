// Derive tool-linkage context from a board, so the topology view and the code
// view feed the three tools identically (single source of truth).
import { getTopology } from './boardTopologies';
import type { BoardRecord } from './boards';

/** All chip types present on a board (direct + mux-downstream). */
export function boardChips(type: string, name: string): string[] {
  const topo = getTopology(type, name);
  const out: string[] = [];
  for (const bus of topo.buses) {
    for (const c of bus.chips) out.push(c.chipType);
    if (bus.mux) for (const c of bus.mux.chips) out.push(c.chipType);
  }
  return out;
}

/** Locate the addressable Smc chip → "bus / chip" label. */
export function smcTarget(type: string, name: string): string | undefined {
  const topo = getTopology(type, name);
  for (const bus of topo.buses) {
    const direct = bus.chips.find((c) => c.chipType === 'Smc');
    if (direct) return `${bus.label} / ${direct.label}`;
    const muxed = bus.mux?.chips.find((c) => c.chipType === 'Smc');
    if (muxed) return `${bus.label} · ${bus.mux!.label} / ${muxed.label}`;
  }
  return undefined;
}

/** Infer the SMC Function code from board role + chips. */
export function inferFunc(type: string, name: string): { func: string; label: string } {
  const chips = boardChips(type, name);
  if (type === 'CLU')         return { func: '0x03', label: 'Fan 风扇控制' };
  if (chips.includes('Lm75')) return { func: '0x0C', label: 'Thermal 温度管理' };
  if (chips.includes('VRD'))  return { func: '0x02', label: 'Power 电源管理' };
  if (type === 'SEU')         return { func: '0x10', label: 'Storage 存储' };
  if (type === 'NICCard')     return { func: '0x20', label: 'Network 网络' };
  return { func: '0x01', label: 'System 系统管理' };
}

/** A representative transform template keyed by the board's sensor chips. */
export function exprTemplate(type: string, name: string): string {
  const chips = boardChips(type, name);
  if (chips.includes('Lm75')) return '$1 | mul 0.125 | round 1';        // Lm75 raw → °C
  if (chips.includes('VRD'))  return '$1 | mul 4 | div 1000 | round 3'; // raw → V
  return '$1 | mul 100 | div 256 | toHex 4';
}

/** Resolve real fan + temperature-zone entities for the cooling template. */
export function coolingEntities(b: BoardRecord): { fans: string[]; tempZones: string[] } {
  const chips = boardChips(b.type, b.name);
  const conns = b.connectors ?? [];

  const fans = conns
    .filter((c) => /fan|clu/i.test(c.name + c.type))
    .map((c) => c.name);
  const tempZones: string[] = [];
  if (chips.includes('Lm75')) tempZones.push(`${b.name} 板温(Lm75)`);
  conns.filter((c) => /disk|seu/i.test(c.name + c.type))
       .forEach((c) => tempZones.push(`${c.name} 盘温`));
  if (b.type === 'BCU' || chips.includes('CPU')) tempZones.push('CpuInlet 进风口');

  return {
    fans: fans.length ? fans : (b.type === 'CLU' ? [`${b.name} 风扇组`] : []),
    tempZones,
  };
}
