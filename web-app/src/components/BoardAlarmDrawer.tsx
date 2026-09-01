import React, { useMemo, useState } from 'react';
import type { CSRDocument } from '../types';
import {
  QUANTITIES, deviceTypeOf, OPERATORS,
  PERIOD_CATEGORIES, recommendedPeriod, type QuantityDef,
} from '../alarm/alarmKnowledge';
import {
  generateAlarmObjects, removeAlarmObjects, listBoardAlarms,
  alarmBaseName, type AlarmSpec, type GenerateResult,
} from '../alarm/alarmObjectGenerator';

/* 拓扑内「板卡告警配置」抽屉。
   用户视角只有：板卡 → 器件 → 监控量 → 门限。
   Scanner/Accessor/Entity/Sensor/OperatorId/单位编码 全部由知识库固化，
   有取值范围的一律下拉，并标注含义 + 推荐值（知识进工具）。*/

interface Props {
  csr: CSRDocument;
  boardName: string;
  onChange: (csr: CSRDocument) => void;
  onClose: () => void;
  /** 告警字典（可选）：{ EventDefinition: [{EventKeyId,EventName,Severity}] } */
  eventDef?: Record<string, unknown> | null;
  /** 点击拓扑节点带入的器件 key（可选） */
  focusDevice?: string | null;
}

interface DeviceItem { key: string; typeLabel: string; quantities: string[]; }

interface Draft {
  eventKeyId: string;
  operatorId: number;
  thresholds: Record<string, number>;
  condition: number;
  hysteresis: number;
  dsMode: 'device-field' | 'existing-scanner' | 'scanner';
  dsField: string;
  dsScannerKey: string;
  dsChip: string; dsOffset: number; dsMask: number; dsSize: number; periodMs: number;
}

/* ── design tokens (PTO) ── */
const T = {
  bg: 'var(--surface-1)', bgHead: 'var(--background)', bg2: 'var(--surface-2)', bg3: 'var(--surface-3)',
  fg: 'var(--foreground)', fg2: 'var(--foreground-secondary)', fg3: 'var(--foreground-muted)',
  border: 'var(--border-default)', borderSub: 'var(--border-subtle)', borderStrong: 'var(--border-strong)',
  primary: 'var(--primary)', warn: 'var(--warning)', ok: 'var(--success)', accent: 'var(--accent)',
  rSm: 'var(--radius-sm)', rMd: 'var(--radius-md)', rLg: 'var(--radius-lg)', pill: 'var(--radius-pill)',
};

function enumerateDevices(csr: CSRDocument): DeviceItem[] {
  const objs = csr.Objects || {};
  const out: DeviceItem[] = [];
  for (const key of Object.keys(objs)) {
    const dt = deviceTypeOf(key);
    if (dt) out.push({ key, typeLabel: dt.typeLabel, quantities: dt.quantities });
  }
  return out;
}

function hasField(objs: Record<string, unknown>, deviceKey: string, field: string): boolean {
  const o = objs[deviceKey];
  return !!o && typeof o === 'object' && field in (o as Record<string, unknown>);
}

function buildDraft(csr: CSRDocument, deviceKey: string, q: QuantityDef): Draft {
  const objs = csr.Objects || {};
  const linked = hasField(objs, deviceKey, q.readingField);
  return {
    eventKeyId: q.recommend.eventKeyIds[0] || '',
    operatorId: q.recommend.operatorId,
    thresholds: { ...(q.recommend.thresholds || {}) } as Record<string, number>,
    condition: q.recommend.condition ?? 1,
    hysteresis: q.recommend.hysteresis ?? 0,
    dsMode: linked ? 'device-field' : 'existing-scanner',
    dsField: q.readingField,
    dsScannerKey: '',
    dsChip: '', dsOffset: 0, dsMask: 255, dsSize: 1,
    periodMs: recommendedPeriod(q.recommend.periodKey).periodMs,
  };
}

export function BoardAlarmDrawer({ csr, boardName, onChange, onClose, eventDef, focusDevice }: Props) {
  const devices = useMemo(() => enumerateDevices(csr), [csr]);
  const [selDevice, setSelDevice] = useState<string | null>(
    focusDevice && devices.some((d) => d.key === focusDevice) ? focusDevice : devices[0]?.key ?? null,
  );
  const [openQ, setOpenQ] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [lastResult, setLastResult] = useState<GenerateResult | null>(null);

  const objs = csr.Objects || {};
  const existingAlarms = useMemo(() => listBoardAlarms(csr), [csr]);
  const scannerKeys = useMemo(() => Object.keys(objs).filter((k) => k.startsWith('Scanner_')), [objs]);
  const chipKeys = useMemo(
    () => Object.keys(objs).filter((k) => /^(Smc_|Pca|Eeprom_|Chip_|Ads)/.test(k)), [objs],
  );

  const dictOptions = useMemo(() => {
    const list = (eventDef?.EventDefinition as Array<{ EventKeyId?: string; EventName?: string; Severity?: string }>) || [];
    return list.map((d) => ({ id: d.EventKeyId || '', name: d.EventName || d.EventKeyId || '', sev: d.Severity || '' }));
  }, [eventDef]);

  const device = devices.find((d) => d.key === selDevice) || null;

  const openQuantity = (qKey: string) => {
    if (openQ === qKey) { setOpenQ(null); setDraft(null); return; }
    if (!selDevice) return;
    setOpenQ(qKey);
    setDraft(buildDraft(csr, selDevice, QUANTITIES[qKey]));
    setLastResult(null);
  };

  const patchDraft = (p: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...p } : d));

  const apply = () => {
    if (!selDevice || !openQ || !draft) return;
    const q = QUANTITIES[openQ];
    const isHigh = draft.operatorId === 4 || draft.operatorId === 3;
    const isLow = draft.operatorId === 1 || draft.operatorId === 2;
    const thresholds: Record<string, number> = {};
    if (q.kind === 'threshold') {
      for (const [k, v] of Object.entries(draft.thresholds)) {
        if (isHigh && k.startsWith('Upper')) thresholds[k] = v;
        else if (isLow && k.startsWith('Lower')) thresholds[k] = v;
        else if (!isHigh && !isLow) thresholds[k] = v;
      }
    }
    const spec: AlarmSpec = {
      boardName, deviceKey: selDevice, quantityKey: openQ, enabled: true,
      eventKeyId: draft.eventKeyId, operatorId: draft.operatorId,
      thresholds: q.kind === 'threshold' ? thresholds : undefined,
      hysteresis: q.kind === 'threshold' ? draft.hysteresis : undefined,
      condition: q.kind === 'discrete' ? draft.condition : undefined,
      dataSource:
        draft.dsMode === 'scanner'
          ? { mode: 'scanner', scanner: { chip: draft.dsChip, offset: draft.dsOffset, size: draft.dsSize, mask: draft.dsMask, periodMs: draft.periodMs } }
          : { mode: 'device-field', field: draft.dsField },
      readingOverride: draft.dsMode === 'existing-scanner' && draft.dsScannerKey ? `<=/${draft.dsScannerKey}.Value` : undefined,
    };
    const res = generateAlarmObjects(csr, spec);
    onChange({ ...csr, Objects: { ...objs, ...res.objects } });
    setLastResult(res);
  };

  const removeAlarm = (deviceKey: string, quantityKey: string) => {
    onChange({ ...csr, Objects: removeAlarmObjects(csr, deviceKey, quantityKey) });
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 90 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(70vw, 900px)',
        background: T.bg, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column',
        zIndex: 100, boxShadow: 'var(--shadow-lg)', color: T.fg,
        font: '13px/1.5 var(--font-sans, system-ui)',
      }}>
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}`, background: T.bgHead, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: T.pill, background: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: T.primary }}>板卡告警</span>
          <span style={{ fontWeight: 500, fontSize: 14 }}>{boardName}</span>
          <span style={{ fontSize: 12, color: T.fg3 }}>可视化定制 · 自动生成 CSR 对象</span>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={btn(T.bg2, T.fg2)}>关闭</button>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* Left: device list */}
          <aside style={{ width: 220, borderRight: `1px solid ${T.borderSub}`, overflowY: 'auto', padding: 10 }}>
            <div style={sectionLabel}>监控对象 / 器件</div>
            {devices.length === 0 && <div style={{ color: T.fg3, fontSize: 12, padding: 8 }}>该板卡未识别到可监控器件</div>}
            {devices.map((d) => {
              const cnt = existingAlarms.filter((a) => a.deviceKey === d.key).length;
              const active = selDevice === d.key;
              return (
                <div key={d.key} onClick={() => { setSelDevice(d.key); setOpenQ(null); setDraft(null); }}
                  style={{ padding: '8px 10px', marginBottom: 4, borderRadius: T.rMd, cursor: 'pointer',
                    background: active ? 'color-mix(in srgb, var(--primary) 14%, transparent)' : T.bg2,
                    border: `1px solid ${active ? 'color-mix(in srgb, var(--primary) 40%, transparent)' : T.borderSub}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: T.fg3 }}>{d.typeLabel}</span>
                    {cnt > 0 && <span style={{ marginLeft: 'auto', fontSize: 10, color: T.ok }}>{cnt} 条告警</span>}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 2 }}>{d.key}</div>
                </div>
              );
            })}
          </aside>

          {/* Right: quantities of selected device */}
          <main style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {!device && <div style={{ color: T.fg3, padding: 24 }}>请选择左侧器件</div>}
            {device && (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{device.key}</h3>
                  <span style={{ fontSize: 12, color: T.fg3 }}>{device.typeLabel} · 勾选监控量即为它加一条告警</span>
                </div>

                {device.quantities.map((qKey) => {
                  const q = QUANTITIES[qKey];
                  if (!q) return null;
                  const base = alarmBaseName(device.key, q);
                  const configured = !!objs[`Event_${base}`];
                  const open = openQ === qKey;
                  return (
                    <div key={qKey} style={{ marginBottom: 10, borderRadius: T.rLg, border: `1px solid ${open ? 'color-mix(in srgb, var(--primary) 40%, transparent)' : T.borderSub}`, background: T.bg2, overflow: 'hidden' }}>
                      <div onClick={() => openQuantity(qKey)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer' }}>
                        <span style={{ fontWeight: 500 }}>{q.label}</span>
                        <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: T.pill, background: T.bg3, color: T.fg3 }}>{q.kind === 'threshold' ? '门限量' : '状态量'}</span>
                        {configured && <span style={{ fontSize: 11, color: T.ok }}>已配置</span>}
                        <span title={q.explain} style={infoDot}>i</span>
                        <div style={{ flex: 1 }} />
                        <span style={{ fontSize: 12, color: T.primary }}>{open ? '收起' : configured ? '编辑' : '+ 加告警'}</span>
                      </div>

                      {open && draft && (
                        <div style={{ padding: '4px 14px 16px', borderTop: `1px solid ${T.borderSub}` }}>
                          <div style={{ fontSize: 12, color: T.fg2, margin: '8px 0 12px' }}>{q.explain}</div>

                          <DataSourceField
                            q={q} draft={draft} patch={patchDraft}
                            linked={hasField(objs, device.key, q.readingField)} deviceKey={device.key}
                            scannerKeys={scannerKeys} chipKeys={chipKeys}
                          />

                          <Labeled label="告警项" hint="上报到北向的告警字典条目（EventKeyId）。">
                            <KnowSelect
                              value={draft.eventKeyId}
                              onChange={(v) => patchDraft({ eventKeyId: v })}
                              recommended={q.recommend.eventKeyIds[0]}
                              options={(dictOptions.length ? dictOptions.map((o) => ({ value: o.id, label: `${o.name}${o.sev ? ' · ' + o.sev : ''}`, desc: o.id })) : q.recommend.eventKeyIds.map((k) => ({ value: k, label: k, desc: '来自知识库推荐（未加载告警字典）' })))}
                            />
                          </Labeled>

                          <Labeled label="触发方向" hint="读数与门限的比较方式（Event.OperatorId），已按量的性质给出推荐。">
                            <KnowSelect
                              value={String(draft.operatorId)}
                              onChange={(v) => patchDraft({ operatorId: Number(v) })}
                              recommended={String(q.recommend.operatorId)}
                              options={OPERATORS.map((o) => ({ value: String(o.id), label: `${o.label}（${o.symbol}）`, desc: o.desc }))}
                            />
                          </Labeled>

                          {q.kind === 'threshold' ? (
                            <ThresholdFields q={q} draft={draft} patch={patchDraft} />
                          ) : (
                            <Labeled label="触发值" hint="离散状态命中该值即告警，一般为 1（置位）；在位/链路类用 0。">
                              <input type="number" value={draft.condition} onChange={(e) => patchDraft({ condition: Number(e.target.value) })} style={numInput} />
                              <span style={recoTag}>推荐 {q.recommend.condition ?? 1}</span>
                            </Labeled>
                          )}

                          {q.kind === 'threshold' && (
                            <Labeled label="迟滞" hint="回差值，避免在门限附近抖动反复告警/恢复。">
                              <input type="number" value={draft.hysteresis} onChange={(e) => patchDraft({ hysteresis: Number(e.target.value) })} style={numInput} />
                              <span style={recoTag}>推荐 {q.recommend.hysteresis ?? 2}</span>
                            </Labeled>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                            <button onClick={apply} style={btn(T.primary, 'var(--primary-foreground)')}>{configured ? '更新告警并生成对象' : '生成告警对象'}</button>
                            {configured && <button onClick={() => { removeAlarm(device.key, qKey); setOpenQ(null); setDraft(null); }} style={btn(T.bg3, T.warn)}>删除该告警</button>}
                          </div>

                          {lastResult && open && <GeneratedPreview res={lastResult} />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

/* ── 数据源字段：唯一「可能必须由用户补」的隐藏项 ── */
function DataSourceField({ q, draft, patch, linked, deviceKey, scannerKeys, chipKeys }: {
  q: QuantityDef; draft: Draft; patch: (p: Partial<Draft>) => void; linked: boolean;
  deviceKey: string; scannerKeys: string[]; chipKeys: string[];
}) {
  return (
    <Labeled label="数据源" hint="告警读的是哪个值。优先用器件已有的语义读数，无需关心寄存器。">
      <div style={{ flex: 1 }}>
        <KnowSelect
          value={draft.dsMode}
          onChange={(v) => patch({ dsMode: v as Draft['dsMode'] })}
          recommended={linked ? 'device-field' : undefined}
          options={[
            { value: 'device-field', label: linked ? `器件读数 · ${deviceKey}.${q.readingField}` : `器件读数字段（当前无 ${q.readingField}）`, desc: linked ? '已接：直接订阅器件的语义读数，最省心。' : `该器件对象上暂无 ${q.readingField} 字段，选此项需保证运行时有值。` },
            { value: 'existing-scanner', label: '复用已有 Scanner', desc: '从本板已定义的 Scanner 里选一个作为数据源。' },
            { value: 'scanner', label: '手动指定寄存器（高级）', desc: '芯片偏移/掩码是硬件事实，需与硬件约定；新增 Scanner 分类须经 subPC 评审。' },
          ]}
        />
        {!linked && draft.dsMode === 'device-field' && (
          <div style={warnLine}>该器件当前没有 {q.readingField} 读数，运行时若无值告警不会生效。</div>
        )}
        {draft.dsMode === 'existing-scanner' && (
          <div style={{ marginTop: 8 }}>
            <KnowSelect
              value={draft.dsScannerKey}
              onChange={(v) => patch({ dsScannerKey: v })}
              options={scannerKeys.length ? scannerKeys.map((k) => ({ value: k, label: k, desc: `Reading = <=/${k}.Value` })) : [{ value: '', label: '本板暂无 Scanner', desc: '改用「手动指定寄存器」。' }]}
            />
          </div>
        )}
        {draft.dsMode === 'scanner' && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <KnowSelect value={draft.dsChip} onChange={(v) => patch({ dsChip: v })}
              options={chipKeys.length ? chipKeys.map((k) => ({ value: k, label: k, desc: '数据来源芯片对象。' })) : [{ value: '', label: '本板暂无芯片对象', desc: '' }]} />
            <div style={{ display: 'flex', gap: 8 }}>
              <MiniNum label="Offset" value={draft.dsOffset} onChange={(n) => patch({ dsOffset: n })} />
              <MiniNum label="Size" value={draft.dsSize} onChange={(n) => patch({ dsSize: n })} />
              <MiniNum label="Mask" value={draft.dsMask} onChange={(n) => patch({ dsMask: n })} />
            </div>
            <Labeled label="扫描周期" hint="来自 README §6 扫描周期分类，选类别自动带出周期，不用填毫秒。">
              <KnowSelect
                value={String(draft.periodMs)}
                onChange={(v) => patch({ periodMs: Number(v) })}
                recommended={String(recommendedPeriod(q.recommend.periodKey).periodMs)}
                options={PERIOD_CATEGORIES.map((c) => ({ value: String(c.periodMs), label: `${c.label} · ${c.periodMs}ms`, desc: c.desc || `周期 ${c.periodMs}ms` }))}
              />
            </Labeled>
          </div>
        )}
      </div>
    </Labeled>
  );
}

function ThresholdFields({ q, draft, patch }: { q: QuantityDef; draft: Draft; patch: (p: Partial<Draft>) => void }) {
  const isHigh = draft.operatorId === 4 || draft.operatorId === 3;
  const keys = isHigh
    ? ['UpperNoncritical', 'UpperCritical', 'UpperNonrecoverable']
    : ['LowerNoncritical', 'LowerCritical'];
  const zh: Record<string, string> = {
    UpperNoncritical: '预警(上)', UpperCritical: '严重(上)', UpperNonrecoverable: '不可恢复(上)',
    LowerNoncritical: '预警(下)', LowerCritical: '严重(下)',
  };
  const reco = q.recommend.thresholds || {};
  return (
    <Labeled label={`门限（${q.unitLabel || ''}）`} hint="分档门限，Event 的触发值默认引用「预警」档，改门限只改传感器一处。">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {keys.map((k) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 11, color: T.fg3 }}>{zh[k]}</span>
            <input type="number" value={draft.thresholds[k] ?? ''} placeholder={reco[k as keyof typeof reco] != null ? String(reco[k as keyof typeof reco]) : ''}
              onChange={(e) => patch({ thresholds: { ...draft.thresholds, [k]: Number(e.target.value) } })}
              style={{ ...numInput, width: 92 }} />
            {reco[k as keyof typeof reco] != null && <span style={{ fontSize: 10, color: T.fg3 }}>推荐 {reco[k as keyof typeof reco]}</span>}
          </div>
        ))}
      </div>
    </Labeled>
  );
}

function GeneratedPreview({ res }: { res: GenerateResult }) {
  return (
    <div style={{ marginTop: 14, border: `1px solid ${T.borderSub}`, borderRadius: T.rMd, background: T.bg, padding: 12 }}>
      <div style={{ fontSize: 12, color: T.fg2, marginBottom: 8 }}>已自动生成 / 更新的 CSR 对象</div>
      {res.warnings.map((w, i) => <div key={i} style={warnLine}>{w}</div>)}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {res.createdKeys.map((k) => <span key={k} style={objTag(T.primary)}>{k}</span>)}
        {res.reusedKeys.map((k) => <span key={k} style={objTag(T.fg3)}>复用 {k}</span>)}
      </div>
    </div>
  );
}

/* ── 小组件 ── */
function Labeled({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
      <label style={{ width: 96, flexShrink: 0, fontSize: 12, color: T.fg2, paddingTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}{hint && <span title={hint} style={infoDot}>i</span>}
      </label>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

function KnowSelect({ value, onChange, options, recommended }: {
  value: string; onChange: (v: string) => void; recommended?: string;
  options: Array<{ value: string; label: string; desc?: string }>;
}) {
  const cur = options.find((o) => o.value === value);
  return (
    <div style={{ flex: 1, minWidth: 220 }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}{recommended === o.value ? '（推荐）' : ''}</option>
        ))}
      </select>
      {cur?.desc && <div style={{ fontSize: 11, color: T.fg3, marginTop: 4 }}>{cur.desc}</div>}
    </div>
  );
}

function MiniNum({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontSize: 11, color: T.fg3 }}>{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ ...numInput, width: 84 }} />
    </div>
  );
}

/* ── styles ── */
const sectionLabel: React.CSSProperties = { fontSize: 10, letterSpacing: 1, color: T.fg3, padding: '4px 8px 8px' };
const infoDot: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14, borderRadius: T.pill, background: T.bg3, color: T.fg3, fontSize: 10, fontStyle: 'italic', cursor: 'help' };
const numInput: React.CSSProperties = { padding: '5px 8px', background: T.bg, border: `1px solid ${T.border}`, color: T.fg, borderRadius: T.rSm, width: 110 };
const selectStyle: React.CSSProperties = { width: '100%', padding: '6px 8px', background: T.bg, border: `1px solid ${T.border}`, color: T.fg, borderRadius: T.rSm };
const recoTag: React.CSSProperties = { fontSize: 11, color: T.fg3 };
const warnLine: React.CSSProperties = { fontSize: 11, color: T.warn, marginTop: 6 };
function objTag(color: string): React.CSSProperties {
  return { fontSize: 11, padding: '2px 8px', borderRadius: T.rSm, border: `1px solid ${T.borderSub}`, color, background: T.bg2, fontFamily: 'var(--font-mono, monospace)' };
}
function btn(bg: string, fg: string): React.CSSProperties {
  return { padding: '6px 14px', background: bg, color: fg, border: 'none', borderRadius: T.pill, cursor: 'pointer', fontSize: 12 };
}

export default BoardAlarmDrawer;
