import { useState, useEffect, useRef } from 'react';
import { HARDWARE_COMPONENTS } from './serverData';

export interface SimMetrics {
  temperature:  number | null;
  powerWatts:   number | null;
  utilization:  number | null;
  voltage:      number | null;
}

export interface LogEntry {
  id: number;
  ts: string;         // HH:MM:SS
  level: 'INFO' | 'WARN' | 'ERROR';
  compId: string;
  message: string;
}

let _logSeq = 0;
function nextId() { return ++_logSeq; }
function nowTs() {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(n => String(n).padStart(2, '0')).join(':');
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

/** Sine + random perturbation around a base value */
function perturb(base: number, amp: number, t: number, phase: number): number {
  return base + amp * Math.sin(t + phase) + (Math.random() - 0.5) * amp * 0.35;
}

// Pre-baked log messages per component type
const LOG_MSGS: Record<string, { level: LogEntry['level']; msg: string }[]> = {
  CPU:       [
    { level: 'INFO',  msg: 'Cache flush completed' },
    { level: 'INFO',  msg: 'Frequency scaling: 2.6 GHz → 2.4 GHz' },
    { level: 'WARN',  msg: 'Thermal throttle threshold 85°C reached' },
    { level: 'INFO',  msg: 'P-state transition P0 → P2' },
    { level: 'ERROR', msg: 'MCE: Machine Check Exception on core 7' },
  ],
  PSU:       [
    { level: 'INFO',  msg: 'Output voltage 12.05V ±0.3%' },
    { level: 'INFO',  msg: 'Fan speed 3200 RPM nominal' },
    { level: 'WARN',  msg: 'AC input voltage drop detected 218V' },
    { level: 'INFO',  msg: 'Efficiency 94.2% at current load' },
  ],
  FAN:       [
    { level: 'INFO',  msg: 'Fan 1 speed 8200 RPM' },
    { level: 'WARN',  msg: 'Fan 2 speed deviation >10% from target' },
    { level: 'INFO',  msg: 'Thermal zone temp 62°C, adjusting speed' },
    { level: 'ERROR', msg: 'Fan 3 stall detected, switching to backup' },
  ],
  HDD:       [
    { level: 'INFO',  msg: 'SMART self-test completed' },
    { level: 'WARN',  msg: 'Reallocated sectors count: 4' },
    { level: 'ERROR', msg: 'Read error rate exceeds threshold' },
    { level: 'INFO',  msg: 'I/O queue depth 32' },
  ],
  RISER:     [
    { level: 'ERROR', msg: 'RAID5 degraded — 1 disk offline' },
    { level: 'INFO',  msg: 'Backplane SES responding' },
    { level: 'WARN',  msg: 'Disk bay 0 hot-swap in progress' },
    { level: 'INFO',  msg: 'SAS expander firmware v2.14.1' },
  ],
  BASE_BOARD:[
    { level: 'INFO',  msg: 'BMC heartbeat OK' },
    { level: 'INFO',  msg: 'PCIe link training Gen4 x16 OK' },
    { level: 'WARN',  msg: 'DDR5 correctable ECC error count +1' },
    { level: 'INFO',  msg: 'IPMI watchdog reset' },
  ],
  default:   [
    { level: 'INFO',  msg: 'Component status polling OK' },
    { level: 'INFO',  msg: 'I2C read successful' },
    { level: 'WARN',  msg: 'Response latency 180ms (threshold 100ms)' },
    { level: 'INFO',  msg: 'Config register write verified' },
  ],
};

function pickLog(compId: string): LogEntry {
  const comp = HARDWARE_COMPONENTS.find(c => c.id === compId);
  const pool = LOG_MSGS[comp?.type ?? 'default'] ?? LOG_MSGS.default;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { id: nextId(), ts: nowTs(), level: pick.level, compId, message: pick.msg };
}

// ─── Metrics hook ─────────────────────────────────────────────────────────
export function useSimulatedMetrics(compId: string | null): SimMetrics | null {
  const [metrics, setMetrics] = useState<SimMetrics | null>(null);
  const tRef    = useRef(Math.random() * 20);
  const phaseX  = useRef(Math.random() * Math.PI * 2);

  useEffect(() => {
    if (!compId) { setMetrics(null); return; }
    const comp = HARDWARE_COMPONENTS.find(c => c.id === compId);
    const base = comp?.metrics;
    if (!base) { setMetrics(null); return; }
    // Capture as non-nullable so TypeScript is happy inside the closure
    const b = base as Required<typeof base>;

    function tick() {
      tRef.current += 0.15;
      const t = tRef.current, ph = phaseX.current;
      setMetrics({
        temperature: b.temperature !== undefined
          ? clamp(perturb(b.temperature, 4, t * 0.7, ph), 10, 99)
          : null,
        powerWatts: b.powerWatts !== undefined
          ? clamp(perturb(b.powerWatts, b.powerWatts * 0.08, t * 0.5, ph + 1), 1, b.powerWatts * 1.35)
          : null,
        utilization: b.utilization !== undefined
          ? clamp(perturb(b.utilization, 12, t * 0.9, ph + 2), 0, 100)
          : null,
        voltage: b.voltage !== undefined
          ? clamp(perturb(b.voltage, b.voltage * 0.025, t * 1.2, ph + 0.5), b.voltage * 0.9, b.voltage * 1.1)
          : null,
      });
    }

    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [compId]);

  return metrics;
}

// ─── Log hook ─────────────────────────────────────────────────────────────
export function useSimulatedLog(compId: string | null, maxEntries = 100): LogEntry[] {
  const [log, setLog] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (!compId) { setLog([]); return; }

    // Seed with several historical entries
    const seed: LogEntry[] = Array.from({ length: 8 }, () => pickLog(compId))
      .map((e, i) => {
        const d = new Date(Date.now() - (8 - i) * 4500);
        return { ...e, ts: [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2,'0')).join(':') };
      });
    setLog(seed);

    // Periodically add new entries
    const id = setInterval(() => {
      setLog(prev => {
        const next = [pickLog(compId), ...prev];
        return next.slice(0, maxEntries);
      });
    }, 2800 + Math.random() * 2200);

    return () => clearInterval(id);
  }, [compId, maxEntries]);

  return log;
}
