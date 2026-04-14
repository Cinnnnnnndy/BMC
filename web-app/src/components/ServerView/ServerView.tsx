import { useMemo, useState } from 'react';
import type { CSRDocument } from '../../types';
import { HOTSPOTS, type HotspotMetric, type HotspotStatus } from './hotspots';
import { StatusPanel } from './StatusPanel';
import './ServerView.css';

function isFanKey(key: string) {
  const u = key.toUpperCase();
  return u.includes('FAN') || u.includes('SYSFAN');
}

function inferFanInfo(objects: Record<string, unknown>) {
  const entries = Object.entries(objects);
  const fanCandidates = entries.filter(([k]) => isFanKey(k));
  const def = (fanCandidates[0]?.[1] as Record<string, unknown> | undefined) ?? undefined;

  const model = String((def as any)?.Model ?? (def as any)?.FanModel ?? (def as any)?.Type ?? 'SYS-FAN');
  const partCode = String((def as any)?.Code ?? (def as any)?.PartCode ?? (def as any)?.Id ?? 'FAN-14');

  const rpmRaw = (def as any)?.RPM ?? (def as any)?.Rpm ?? (def as any)?.SpeedRPM ?? (def as any)?.CurrentRPM ?? (def as any)?.Reading;
  const targetRaw = (def as any)?.TargetRPM ?? (def as any)?.TargetSpeedRPM ?? (def as any)?.TargetSpeed ?? (def as any)?.GoalRPM;

  const fallbackRpm = 8200;
  const fallbackTarget = 7500;
  const rpm = Number(rpmRaw);
  const target = Number(targetRaw);

  const safeRpm = Number.isFinite(rpm) ? rpm : fallbackRpm;
  const safeTarget = Number.isFinite(target) ? target : fallbackTarget;
  const ratio = safeTarget !== 0 ? safeRpm / safeTarget : safeRpm / fallbackTarget;

  return {
    model,
    partCode,
    rpm: Math.round(safeRpm),
    ratio,
  };
}

function inferMemoryExists(objects: Record<string, unknown>) {
  const keys = Object.keys(objects);
  return keys.some((k) => {
    const u = k.toUpperCase();
    return u.includes('DIMM') || u.includes('MEM') || u.includes('MEMORY');
  });
}

function makeMetrics(id: number, objects: Record<string, unknown>, fanInfo: ReturnType<typeof inferFanInfo>): HotspotMetric[] {
  if (id === 4) {
    return [
      { label: '状态', value: 'warning' },
      { label: '温度', value: '87°C' },
      { label: '利用率', value: '94%' },
      { label: '显存', value: '79 / 80 GB' },
      { label: '功耗', value: '380W' },
    ];
  }
  if (id === 7) {
    return [
      { label: '状态', value: 'warning' },
      { label: '转速', value: '8200 RPM' },
      { label: '目标', value: '7500 RPM' },
      { label: 'PWM', value: '85%' },
      { label: '速率比', value: '1.09x' },
    ];
  }
  if (id === 14) {
    return [
      { label: '状态', value: 'warning' },
      { label: '型号', value: fanInfo.model },
      { label: '转速', value: `${fanInfo.rpm} RPM` },
      { label: '速率比', value: `${fanInfo.ratio.toFixed(2)}x` },
      { label: '部件编码', value: fanInfo.partCode },
    ];
  }
  if (id === 15) {
    return [
      { label: '状态', value: 'error' },
      { label: '故障盘', value: '1 块' },
      { label: '在线盘', value: '23 块' },
      { label: '温度', value: '51°C' },
      { label: '阵列', value: 'RAID5' },
      { label: '状态', value: '降级运行' },
    ];
  }
  if (id === 18) {
    const exists = inferMemoryExists(objects);
    if (!exists) {
      return [
        { label: '状态', value: 'error' },
        { label: '错误原因', value: '内存条对象新增失败' },
        { label: '异常数量', value: '1' },
        { label: '建议', value: '检查 DIMM 映射/CSR 节点完整性' },
      ];
    }
    return [
      { label: '状态', value: 'normal' },
      { label: '容量', value: '256 GB' },
      { label: 'ECC', value: 'ON' },
      { label: '温度', value: '44°C' },
    ];
  }

  // 其余部件：按类型给合理值（模拟）
  const seed = id * 17;
  const t = 32 + (seed % 12);
  const v = 11.8 + ((seed % 7) / 10);
  const u = 18 + (seed % 63);
  return [
    { label: '状态', value: 'normal' },
    { label: '温度', value: `${t}°C` },
    { label: '电压', value: `${v.toFixed(1)} V` },
    { label: '利用率', value: `${u}%` },
    { label: '健康', value: 'OK' },
  ];
}

function makeStatus(id: number, objects: Record<string, unknown>): HotspotStatus {
  if (id === 18) return inferMemoryExists(objects) ? 'normal' : 'error';
  if (id === 4 || id === 7 || id === 14) return 'warning';
  if (id === 15) return 'error';
  return 'normal';
}

export function ServerView({ csr }: { csr: CSRDocument }) {
  const objects = csr.Objects || {};
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  const fanInfo = useMemo(() => inferFanInfo(objects), [objects]);
  const selectedMeta = selectedId ? HOTSPOTS.find((h) => h.id === selectedId) ?? null : null;

  const status: HotspotStatus = selectedId ? makeStatus(selectedId, objects) : 'normal';
  const metrics = selectedId ? makeMetrics(selectedId, objects, fanInfo) : [];

  const overall = useMemo(() => {
    const ids = HOTSPOTS.map((h) => h.id);
    let warn = 0;
    let error = 0;
    ids.forEach((id) => {
      const st = makeStatus(id, objects);
      if (st === 'warning') warn++;
      if (st === 'error') error++;
    });
    return { warn, error, normal: ids.length - warn - error };
  }, [objects]);

  return (
    <div className="server2-root">
      <div className="server2-left" style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <div className={`sim2-image-wrap ${selectedId !== null ? 'has-selection' : ''}`}>
          <img className="sim2-image" src="/images/server-exploded.png" alt="服务器爆炸图" />

          {HOTSPOTS.map((h) => {
            const isSelected = selectedId === h.id;
            const dim = selectedId !== null && !isSelected;
            const st = makeStatus(h.id, objects);
            return (
              <div
                key={h.id}
                className={`sim2-hotspot ${isSelected ? 'is-selected' : ''} ${dim ? 'is-dim' : ''} ${
                  st === 'warning' ? 'is-warning' : st === 'error' ? 'is-error' : ''
                }`}
                style={{ left: h.x, top: h.y, width: h.w, height: h.h }}
                data-label={h.name}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId((prev) => (prev === h.id ? null : h.id));
                }}
              />
            );
          })}
        </div>

        {/* 点击空白取消选中 */}
        <div
          style={{ position: 'absolute', inset: 0 }}
          onClick={() => setSelectedId(null)}
          aria-hidden
        />
      </div>

      <StatusPanel
        panelOpen={panelOpen}
        onToggle={() => setPanelOpen((v) => !v)}
        selectedId={selectedId}
        selectedName={selectedMeta?.name ?? null}
        status={status}
        metrics={metrics}
        onViewLog={() => {
          // eslint-disable-next-line no-console
          console.log('[ServerView] view detailed log', selectedId);
        }}
      />

      {/* 可在需要时展示 overall health（当前不强制展示） */}
      <div style={{ display: 'none' }}>{overall.normal}</div>
    </div>
  );
}

