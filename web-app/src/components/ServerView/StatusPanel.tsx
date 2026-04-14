import type { HotspotMetric, HotspotStatus } from './hotspots';

export function StatusPanel({
  panelOpen,
  onToggle,
  selectedId,
  selectedName,
  status,
  metrics,
  onViewLog,
}: {
  panelOpen: boolean;
  onToggle: () => void;
  selectedId: number | null;
  selectedName: string | null;
  status: HotspotStatus;
  metrics: HotspotMetric[];
  onViewLog: () => void;
}) {
  return (
    <aside className={`sim2-panel ${panelOpen ? 'is-open' : 'is-collapsed'}`}>
      <div className="sim2-panel-head">
        <div className="sim2-panel-title">状态面板</div>
        <button className="sim2-panel-toggle" onClick={onToggle}>
          {panelOpen ? '收起' : '展开'}
        </button>
      </div>

      {panelOpen && (
        <div className="sim2-panel-body">
          {!selectedId || !selectedName ? (
            <div className="sim2-empty">点击左侧组件热区查看运维与仿真数据</div>
          ) : (
            <>
              <div className="sim2-selected-head">
                <div className="sim2-selected-name">
                  #{selectedId} {selectedName}
                </div>
                <span className={`sim2-badge ${status}`}>
                  {status === 'normal' ? '正常' : status === 'warning' ? '告警' : '故障'}
                </span>
              </div>

              <div className="sim2-metrics">
                {metrics.map((m, idx) => (
                  <div key={`${m.label}-${idx}`} className="sim2-metric">
                    <div className="sim2-metric-k">{m.label}</div>
                    <div className="sim2-metric-v">{m.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="sim2-log-btn"
                  onClick={onViewLog}
                  title="查看详细日志（暂时 console.log）"
                >
                  查看详细日志 ↗
                </button>
              </div>
            </>
          )}

          <div className="sim2-divider" />
          <div className="sim2-note">
            数据为模拟值：GPU(4)/风扇(14、7) 带预设告警；硬盘仓(15) 故障；内存DIMM(18) 若 CSR 未发现对象则为“新增失败”。
          </div>
        </div>
      )}
    </aside>
  );
}

