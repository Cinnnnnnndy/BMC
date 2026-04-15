import { create } from 'zustand';
import type { ComponentStatus } from './serverData';

// ─── Sim types ─────────────────────────────────────────────────────────────
export type SimSpeed = 1 | 2 | 5 | 10;
export type FaultType = 'overheat' | 'bus_timeout' | 'power_fail' | 'voltage_anomaly';

export interface ActiveFault {
  id: string;
  type: FaultType;
  targetId: string;
  injectedAt: number;
}

export interface SimToast {
  id: number;
  message: string;
  level: 'info' | 'warn' | 'error';
  ts: number;
}

interface MetricSnapshot {
  simTime: number;
  metrics: Record<string, {
    temperature?: number;
    powerWatts?: number;
    utilization?: number;
    voltage?: number;
  }>;
}

// ─── State shape ───────────────────────────────────────────────────────────
interface SimState {
  // Selection
  selectedId: string | null;
  selectedBusId: string | null;

  // Camera
  camera: { x: number; y: number; zoom: number };

  // Bus highlights
  highlightedConnections: string[];

  // Simulation engine
  speed: SimSpeed;
  isPlaying: boolean;
  simTick: number;

  // Component status overrides (from fault injection)
  statusOverrides: Record<string, ComponentStatus>;

  // Active faults
  activeFaults: ActiveFault[];

  // Toast notifications
  toasts: SimToast[];

  // History (last 60 snapshots, 1 per real second)
  history: MetricSnapshot[];
  historyPlayhead: number | null;

  // ── Actions ───────────────────────────────────────────────────────────
  selectComponent: (id: string) => void;
  deselectAll: () => void;
  selectBus: (id: string | null) => void;
  setCamera: (c: Partial<{ x: number; y: number; zoom: number }>) => void;
  highlightConnections: (ids: string[]) => void;
  clearHighlights: () => void;
  setSpeed: (s: SimSpeed) => void;
  togglePlay: () => void;
  advanceTick: (dt: number) => void;
  injectFault: (type: FaultType, targetId: string) => void;
  clearFault: (id: string) => void;
  clearAllFaults: () => void;
  pushToast: (message: string, level: SimToast['level']) => void;
  dismissToast: (id: number) => void;
  overrideStatus: (compId: string, status: ComponentStatus) => void;
  clearStatusOverride: (compId: string) => void;
  pushHistorySnapshot: (snapshot: MetricSnapshot) => void;
  setHistoryPlayhead: (idx: number | null) => void;
}

// ─── Fault → status mapping ────────────────────────────────────────────────
function faultToStatus(type: FaultType): ComponentStatus {
  switch (type) {
    case 'overheat':        return 'warning';
    case 'bus_timeout':     return 'error';
    case 'power_fail':      return 'offline';
    case 'voltage_anomaly': return 'warning';
  }
}

// ─── Fault toast messages ──────────────────────────────────────────────────
function faultToast(type: FaultType, targetId: string): { message: string; level: SimToast['level'] } {
  switch (type) {
    case 'overheat':
      return {
        message: `[过热告警] ${targetId} 温度超限，已触发热保护`,
        level: 'warn',
      };
    case 'bus_timeout':
      return {
        message: `[总线故障] ${targetId} 超时无响应，链路中断`,
        level: 'error',
      };
    case 'power_fail':
      return {
        message: `[电源故障] ${targetId} 电源失效，组件离线`,
        level: 'error',
      };
    case 'voltage_anomaly':
      return {
        message: `[电压异常] ${targetId} 电压偏差超过 ±5% 阈值`,
        level: 'warn',
      };
  }
}

// ─── Store ─────────────────────────────────────────────────────────────────
export const useSimStore = create<SimState>((set, get) => ({
  // Selection
  selectedId: null,
  selectedBusId: null,

  // Camera — initial values center the TaiShan 200 scene
  camera: { x: 310, y: 200, zoom: 0.52 },

  // Bus highlights
  highlightedConnections: [],

  // Simulation engine
  speed: 1,
  isPlaying: true,
  simTick: 0,

  // Overrides / faults
  statusOverrides: {},
  activeFaults: [],

  // Toasts
  toasts: [],

  // History
  history: [],
  historyPlayhead: null,

  // ── Selection actions ────────────────────────────────────────────────────
  selectComponent: (id) =>
    set((state) => ({
      selectedId:    state.selectedId === id ? null : id,
      selectedBusId: null,
    })),

  deselectAll: () => set({ selectedId: null, selectedBusId: null }),

  selectBus: (id) =>
    set({ selectedBusId: id, selectedId: null }),

  // ── Camera actions ───────────────────────────────────────────────────────
  setCamera: (partial) =>
    set((state) => ({
      camera: { ...state.camera, ...partial },
    })),

  // ── Highlight actions ────────────────────────────────────────────────────
  highlightConnections: (ids) => set({ highlightedConnections: ids }),

  clearHighlights: () => set({ highlightedConnections: [] }),

  // ── Simulation control ────────────────────────────────────────────────────
  setSpeed: (s) => set({ speed: s }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  advanceTick: (dt) =>
    set((state) => {
      if (!state.isPlaying) return {};
      return { simTick: state.simTick + dt * state.speed };
    }),

  // ── Fault injection ───────────────────────────────────────────────────────
  injectFault: (type, targetId) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const fault: ActiveFault = {
      id,
      type,
      targetId,
      injectedAt: Date.now(),
    };
    const toastPayload = faultToast(type, targetId);
    const status = faultToStatus(type);

    set((state) => ({
      activeFaults: [...state.activeFaults, fault],
      statusOverrides: { ...state.statusOverrides, [targetId]: status },
    }));

    get().pushToast(toastPayload.message, toastPayload.level);
  },

  clearFault: (id) =>
    set((state) => {
      const fault = state.activeFaults.find((f) => f.id === id);
      if (!fault) return {};
      const remaining = state.activeFaults.filter((f) => f.id !== id);
      // Only remove the status override if no other fault targets the same component
      const stillTargeted = remaining.some((f) => f.targetId === fault.targetId);
      const overrides = { ...state.statusOverrides };
      if (!stillTargeted) delete overrides[fault.targetId];
      return { activeFaults: remaining, statusOverrides: overrides };
    }),

  clearAllFaults: () =>
    set({ activeFaults: [], statusOverrides: {} }),

  // ── Toast actions ─────────────────────────────────────────────────────────
  pushToast: (message, level) =>
    set((state) => {
      const toast: SimToast = {
        id: Date.now(),
        message,
        level,
        ts: Date.now(),
      };
      // Keep at most 5 toasts (drop oldest if needed)
      const next = [toast, ...state.toasts].slice(0, 5);
      return { toasts: next };
    }),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // ── Status overrides ──────────────────────────────────────────────────────
  overrideStatus: (compId, status) =>
    set((state) => ({
      statusOverrides: { ...state.statusOverrides, [compId]: status },
    })),

  clearStatusOverride: (compId) =>
    set((state) => {
      const overrides = { ...state.statusOverrides };
      delete overrides[compId];
      return { statusOverrides: overrides };
    }),

  // ── History ───────────────────────────────────────────────────────────────
  pushHistorySnapshot: (snapshot) =>
    set((state) => {
      const next = [...state.history, snapshot];
      // Keep last 60 snapshots
      if (next.length > 60) next.splice(0, next.length - 60);
      return { history: next };
    }),

  setHistoryPlayhead: (idx) => set({ historyPlayhead: idx }),
}));
