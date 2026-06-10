/**
 * SystemInfoPanel — floating top-left server status overlay (light theme).
 * A stack of cards: resource-object summary (always shown) + four collapsible
 * cards (system info / sensors / inlet temp / power) that default COLLAPSED and
 * expand on click. Static demo data for now; wire to real state later.
 */
import { useState } from 'react';

const card: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 14,
  padding: '15px 18px',
  boxShadow: '0 6px 20px rgba(60,80,120,0.10)',
};
const title: React.CSSProperties = { fontWeight: 700, fontSize: 15, color: '#1f2733' };
const headRow: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  cursor: 'pointer', userSelect: 'none',
};

function Caret({ open }: { open: boolean }) {
  return (
    <span style={{
      color: '#aab1bf', fontSize: 13, lineHeight: 1,
      transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s',
    }}>⌄</span>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 12.5 }}>
      <span style={{ color: '#9aa3b2' }}>{k}</span>
      <span style={{ fontWeight: 600, color: accent ?? '#4a5260' }}>{v}</span>
    </div>
  );
}

export function SystemInfoPanel() {
  // every collapsible card starts closed
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

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
      {/* 资源对象生成 — always shown */}
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
        <div style={headRow} onClick={() => toggle('sys')}>
          <span style={title}>系统信息</span>
          <Caret open={!!open.sys} />
        </div>
        {open.sys && (
          <div style={{ marginTop: 13 }}>
            <div style={{ fontSize: 12.5, color: '#7a838f', marginBottom: 13, lineHeight: 1.5 }}>
              名称 <b style={{ color: '#3a424f' }}>S920X05</b> ｜ 生产厂商 <b style={{ color: '#3a424f' }}>HUAWEI</b> ｜ 产品序列号 <b style={{ color: '#3a424f' }}>test13122589</b>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {chips.map((t) => (
                <span key={t} style={{ background: '#f1f3f7', borderRadius: 8, padding: '7px 13px', fontSize: 12.5, color: '#4a5260' }}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 传感器 */}
      <div style={card}>
        <div style={headRow} onClick={() => toggle('sensor')}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={title}>传感器</span>
            <span style={{ ...title, fontSize: 16 }}>61</span>
            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13 }}>+2</span>
          </span>
          <Caret open={!!open.sensor} />
        </div>
        {open.sensor && (
          <div style={{ marginTop: 13, display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Row k="CPU0 温度" v="58 ℃" />
            <Row k="CPU1 温度" v="55 ℃" />
            <Row k="内存温度" v="47 ℃" />
            <Row k="SSD 温度" v="41 ℃" />
            <Row k="12V 电压" v="12.08 V" />
          </div>
        )}
      </div>

      {/* 进风口温度 */}
      <div style={card}>
        <div style={headRow} onClick={() => toggle('inlet')}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={title}>进风口温度</span>
            <span style={{ ...title, fontSize: 16 }}>29℃</span>
          </span>
          <Caret open={!!open.inlet} />
        </div>
        {open.inlet && (
          <div style={{ marginTop: 13, display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Row k="传感器" v="inlet_temp" />
            <Row k="出风口温度" v="38 ℃" />
            <Row k="告警阈值" v="45 ℃" accent="#d97706" />
            <Row k="历史最高" v="34 ℃" />
          </div>
        )}
      </div>

      {/* 电源功率 */}
      <div style={card}>
        <div style={headRow} onClick={() => toggle('power')}>
          <span style={title}>电源功率</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <button
              onClick={(e) => e.stopPropagation()}
              style={{
                border: '1px solid #d5dae3', background: '#fff', borderRadius: 8,
                padding: '6px 15px', fontSize: 13, color: '#4a5260', cursor: 'pointer',
              }}
            >下电测试</button>
            <Caret open={!!open.power} />
          </span>
        </div>
        {open.power && (
          <div style={{ marginTop: 13, display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Row k="PSU 0" v="418 W" />
            <Row k="PSU 1" v="405 W" />
            <Row k="整机功率" v="823 W" accent="#16a34a" />
          </div>
        )}
      </div>
    </div>
  );
}
