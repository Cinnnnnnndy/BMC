/**
 * SystemInfoPanel — floating top-left server status overlay (light theme),
 * a stack of cards: resource-object summary, system info, sensors, inlet temp,
 * power. Static demo data for now; wire to real state later.
 */
const card: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 14,
  padding: '15px 18px',
  boxShadow: '0 6px 20px rgba(60,80,120,0.10)',
};
const title: React.CSSProperties = { fontWeight: 700, fontSize: 15, color: '#1f2733' };
const caret: React.CSSProperties = { color: '#aab1bf', fontSize: 13, userSelect: 'none' };

export function SystemInfoPanel() {
  const stats: [string, string, string][] = [
    ['18', '新增对象', '#16a34a'],
    ['2', '新增传感器', '#16a34a'],
    ['1', '失败对象', '#d1136b'],
    ['3', '失败读值', '#d1136b'],
    ['3', '异常属性', '#d1136b'],
  ];
  const chips = ['处理器（2/2）', '内存（32/32）', '硬盘背板（2/5）', 'Riser 卡（1/3）', 'PCIe 卡（2/3）'];

  return (
    <div style={{
      position: 'absolute', top: 14, left: 14, width: 312, zIndex: 9,
      display: 'flex', flexDirection: 'column', gap: 11,
      maxHeight: 'calc(100% - 28px)', overflowY: 'auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* 资源对象生成 */}
      <div style={card}>
        <div style={{ ...title, marginBottom: 15 }}>资源对象生成</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          {stats.map(([n, l, c]) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 800, fontSize: 23, color: c, lineHeight: 1 }}>{n}</span>
              <span style={{ fontSize: 11, color: '#9aa3b2', whiteSpace: 'nowrap' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 系统信息 */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
          <span style={title}>系统信息</span>
          <span style={caret}>⌄</span>
        </div>
        <div style={{ fontSize: 12.5, color: '#7a838f', marginBottom: 13, lineHeight: 1.5 }}>
          名称 <b style={{ color: '#3a424f' }}>S920X05</b> ｜ 生产厂商 <b style={{ color: '#3a424f' }}>HUAWEI</b> ｜ 产品序列号 <b style={{ color: '#3a424f' }}>test13122589</b>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chips.map((t) => (
            <span key={t} style={{ background: '#f1f3f7', borderRadius: 8, padding: '7px 13px', fontSize: 12.5, color: '#4a5260' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* 传感器 */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={title}>传感器</span>
            <span style={{ ...title, fontSize: 16 }}>61</span>
            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13 }}>+2</span>
          </span>
          <span style={caret}>⌃</span>
        </div>
      </div>

      {/* 进风口温度 */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={title}>进风口温度</span>
            <span style={{ ...title, fontSize: 16 }}>29℃</span>
          </span>
          <span style={caret}>⌃</span>
        </div>
      </div>

      {/* 电源功率 */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={title}>电源功率</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <button style={{
              border: '1px solid #d5dae3', background: '#fff', borderRadius: 8,
              padding: '6px 15px', fontSize: 13, color: '#4a5260', cursor: 'pointer',
            }}>下电测试</button>
            <span style={caret}>⌄</span>
          </span>
        </div>
      </div>
    </div>
  );
}
