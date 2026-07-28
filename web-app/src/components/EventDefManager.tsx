import React, { useEffect, useMemo, useState } from 'react';
import type { CSRDocument } from '../types';
import { withBase } from '../base';
import { EVENT_STANDARD_KEY_SET } from '../data/eventStandardKeys';

interface EventDefEntry {
  EventCode?: string;
  ReportChannel?: number;
  OldEventCode?: string;
  EventType?: number;
  LifeCycleId?: number;
  DeassertFlag?: number;
  EventKeyId: string;
  SeverityId?: number;
  ActionId?: number;
  EventName?: string;
}

interface EventDescEntry {
  EventKeyId: string;
  Description?: { En?: string; Zh?: string };
  Cause?: { En?: string; Zh?: string };
  Influence?: { En?: string; Zh?: string };
  Suggestion?: { En?: string; Zh?: string };
}

interface EventDefBundle {
  Version?: string;
  EventDefinition?: EventDefEntry[];
  EventDescription?: EventDescEntry[];
}

interface CsrBinding {
  objectId: string;
  Component?: string;
  Condition?: unknown;
  OperatorId?: unknown;
  Enabled?: unknown;
}

interface Props {
  csr: CSRDocument | null;
  /** 用户在「事件配置」里上传的自定义字典，优先于内置的 event_def.json */
  eventDef?: Record<string, unknown> | null;
  onChange: (csr: CSRDocument) => void;
}

// 4 级严重度沿用系统语义色阶：提示(中性) → 一般(蓝) → 重要(橙) → 紧急(红)
const SEVERITY_META: Record<number, { label: string; tone: string }> = {
  0: { label: '提示', tone: 'var(--accent)' },
  1: { label: '一般', tone: 'var(--primary)' },
  2: { label: '重要', tone: 'var(--warning)' },
  3: { label: '紧急', tone: 'var(--danger)' },
};

function severityMeta(id: number | undefined) {
  return SEVERITY_META[id ?? -1] ?? { label: `未知(${id ?? '-'})`, tone: 'var(--foreground-muted)' };
}

function categoryOf(eventKeyId: string): string {
  const dot = eventKeyId.indexOf('.');
  return dot > 0 ? eventKeyId.slice(0, dot) : eventKeyId;
}

function extractPlaceholders(text: string | undefined): number[] {
  if (!text) return [];
  const nums = new Set<number>();
  for (const m of text.matchAll(/%(\d)/g)) nums.add(Number(m[1]));
  return [...nums].sort((a, b) => a - b);
}

function extractEvents(obj: Record<string, unknown>): Array<{ id: string; def: Record<string, unknown> }> {
  return Object.entries(obj)
    .filter(([id]) => id.startsWith('Event_'))
    .map(([id, def]) => ({ id, def: def as Record<string, unknown> }));
}

const LABEL_STYLE: React.CSSProperties = { font: 'var(--text-label)', color: 'var(--foreground-muted)', marginBottom: 5, display: 'block' };

function Badge({ text, tone }: { text: string; tone: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 500, color: tone, background: `color-mix(in srgb, ${tone} 16%, transparent)`,
      whiteSpace: 'nowrap',
    }}>
      {text}
    </span>
  );
}

function chipBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: '4px 10px', borderRadius: 999, fontSize: 11, cursor: 'pointer', border: 'none',
    fontFamily: 'inherit', fontWeight: active ? 600 : 400,
    background: active ? 'var(--primary)' : 'transparent',
    color: active ? 'var(--primary-foreground)' : 'var(--foreground-secondary)',
    transition: 'background .12s, color .12s',
  };
}

function fieldInputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%', boxSizing: 'border-box', padding: '6px 9px', borderRadius: 7,
    fontFamily: 'inherit', fontSize: 12, background: 'var(--state-hover)',
    border: `1px solid ${focused ? 'var(--primary)' : 'var(--border-subtle)'}`,
    color: 'var(--foreground)', outline: 'none',
  };
}

function EditField({ label, value, onChange, mono, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; mono?: boolean; type?: 'text' | 'number';
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...fieldInputStyle(focused), fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}
      />
    </div>
  );
}

export function EventDefManager({ csr, eventDef, onChange }: Props) {
  const [bundled, setBundled] = useState<EventDefBundle | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [bindingFilter, setBindingFilter] = useState<'all' | 'bound' | 'unbound'>('all');
  const [standardFilter, setStandardFilter] = useState<'all' | 'standard' | 'extra'>('all');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [descLang, setDescLang] = useState<'Zh' | 'En'>('Zh');
  // 会话内本地编辑覆盖（事件定义库本身是静态字典文件，编排结果先保存在页面内）
  const [overrides, setOverrides] = useState<Record<string, Partial<EventDefEntry>>>({});

  useEffect(() => {
    if (eventDef) return; // 用户已上传自定义字典，无需再拉内置文件
    if (bundled) return;
    let cancelled = false;
    fetch(withBase('data/event_def.json'))
      .then((res) => res.json())
      .then((data: EventDefBundle) => { if (!cancelled) setBundled(data); })
      .catch(() => { if (!cancelled) setLoadError('内置事件字典加载失败'); });
    return () => { cancelled = true; };
  }, [eventDef, bundled]);

  const bundle: EventDefBundle | null = (eventDef as EventDefBundle | undefined) ?? bundled;
  const rawDefs = useMemo(() => bundle?.EventDefinition ?? [], [bundle]);
  const defs = useMemo(
    () => rawDefs.map((d) => (overrides[d.EventKeyId] ? { ...d, ...overrides[d.EventKeyId] } : d)),
    [rawDefs, overrides]
  );
  const descByKey = useMemo(() => {
    const map = new Map<string, EventDescEntry>();
    for (const d of bundle?.EventDescription ?? []) map.set(d.EventKeyId, d);
    return map;
  }, [bundle]);

  const updateDef = (key: string, patch: Partial<EventDefEntry>) => {
    setOverrides((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };
  const resetDef = (key: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const csrObj = csr?.Objects ?? {};
  const bindingsByKey = useMemo(() => {
    const map = new Map<string, CsrBinding[]>();
    for (const { id, def } of extractEvents(csrObj)) {
      const key = String(def.EventKeyId ?? '');
      if (!key) continue;
      const list = map.get(key) ?? [];
      list.push({
        objectId: id,
        Component: def.Component as string | undefined,
        Condition: def.Condition,
        OperatorId: def.OperatorId,
        Enabled: def.Enabled,
      });
      map.set(key, list);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csr]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of defs) counts.set(categoryOf(d.EventKeyId), (counts.get(categoryOf(d.EventKeyId)) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [defs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return defs.filter((d) => {
      if (category !== 'all' && categoryOf(d.EventKeyId) !== category) return false;
      if (q && !(d.EventKeyId.toLowerCase().includes(q) || (d.EventName ?? '').toLowerCase().includes(q) || (d.EventCode ?? '').toLowerCase().includes(q))) return false;
      const boundCount = bindingsByKey.get(d.EventKeyId)?.length ?? 0;
      if (bindingFilter === 'bound' && boundCount === 0) return false;
      if (bindingFilter === 'unbound' && boundCount > 0) return false;
      const isStandard = EVENT_STANDARD_KEY_SET.has(d.EventKeyId);
      if (standardFilter === 'standard' && !isStandard) return false;
      if (standardFilter === 'extra' && isStandard) return false;
      return true;
    });
  }, [defs, search, category, bindingFilter, standardFilter, bindingsByKey]);

  const stats = useMemo(() => {
    const defKeys = new Set(defs.map((d) => d.EventKeyId));
    const coveredStandard = [...EVENT_STANDARD_KEY_SET].filter((k) => defKeys.has(k)).length;
    const extra = defs.length - coveredStandard;
    let boundDefs = 0;
    for (const d of defs) if ((bindingsByKey.get(d.EventKeyId)?.length ?? 0) > 0) boundDefs += 1;
    return { standardTotal: EVENT_STANDARD_KEY_SET.size, defTotal: defs.length, coveredStandard, extra, boundDefs };
  }, [defs, bindingsByKey]);

  const selectedDef = selectedKey ? defs.find((d) => d.EventKeyId === selectedKey) ?? null : null;
  const selectedDesc = selectedKey ? descByKey.get(selectedKey) ?? null : null;
  const selectedBindings = selectedKey ? bindingsByKey.get(selectedKey) ?? [] : [];
  const selectedEdited = selectedKey ? !!overrides[selectedKey] : false;

  const handleAddBinding = () => {
    if (!csr || !selectedDef) return;
    const shortName = selectedDef.EventKeyId.split('.').pop() || 'New';
    const base = `Event_${shortName}`;
    let id = base;
    let i = 0;
    while (csrObj[id]) id = `${base}_${++i}`;
    const next = { ...csrObj };
    next[id] = { EventKeyId: selectedDef.EventKeyId, Reading: '', Condition: 0, OperatorId: 5, Enabled: true, Component: '' };
    onChange({ ...csr, Objects: next });
  };

  if (!bundle) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--foreground-muted)', fontSize: 13 }}>
        {loadError ?? '正在加载事件字典…'}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontSize: 12, color: 'var(--foreground-secondary)' }}>
      {/* ── 左：分类筛选 ── */}
      <aside style={{ width: 232, flexShrink: 0, borderRight: '1px solid var(--border-subtle)', overflowY: 'auto', padding: '12px 10px' }}>
        <input
          type="text"
          placeholder="搜索 EventKeyId / 名称 / 编码"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...fieldInputStyle(false), marginBottom: 14 }}
        />

        <label style={LABEL_STYLE}>CSR 绑定状态</label>
        <div style={{ display: 'inline-flex', gap: 2, padding: 3, borderRadius: 10, background: 'var(--surface-disabled)', marginBottom: 14 }}>
          {(['all', 'bound', 'unbound'] as const).map((v) => (
            <button key={v} onClick={() => setBindingFilter(v)} style={chipBtnStyle(bindingFilter === v)}>
              {v === 'all' ? '全部' : v === 'bound' ? '已绑定' : '未绑定'}
            </button>
          ))}
        </div>

        <label style={LABEL_STYLE}>字典来源</label>
        <div style={{ display: 'inline-flex', gap: 2, padding: 3, borderRadius: 10, background: 'var(--surface-disabled)', marginBottom: 16 }}>
          {(['all', 'standard', 'extra'] as const).map((v) => (
            <button key={v} onClick={() => setStandardFilter(v)} style={chipBtnStyle(standardFilter === v)}>
              {v === 'all' ? '全部' : v === 'standard' ? '标准字典' : '字典外新增'}
            </button>
          ))}
        </div>

        <label style={LABEL_STYLE}>分类（{categories.length}）</label>
        <div
          onClick={() => setCategory('all')}
          style={{
            padding: '6px 10px', marginBottom: 2, borderRadius: 8, cursor: 'pointer',
            background: category === 'all' ? 'var(--state-selected)' : 'transparent',
            color: category === 'all' ? 'var(--foreground)' : 'var(--foreground-secondary)',
          }}
        >
          全部（{defs.length}）
        </div>
        {categories.map(([name, count]) => (
          <div
            key={name}
            onClick={() => setCategory(name)}
            style={{
              padding: '6px 10px', marginBottom: 2, borderRadius: 8, cursor: 'pointer',
              background: category === name ? 'var(--state-selected)' : 'transparent',
              color: category === name ? 'var(--foreground)' : 'var(--foreground-secondary)',
              display: 'flex', justifyContent: 'space-between',
            }}
          >
            <span>{name}</span>
            <span style={{ color: 'var(--foreground-muted)' }}>{count}</span>
          </div>
        ))}
      </aside>

      {/* ── 中：表格 ── */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', gap: 18, flexWrap: 'wrap', color: 'var(--foreground-muted)', fontSize: 11,
        }}>
          <span>标准字典 <b style={{ color: 'var(--foreground)' }}>{stats.standardTotal}</b> 项</span>
          <span>事件定义库 <b style={{ color: 'var(--foreground)' }}>{stats.defTotal}</b> 项</span>
          <span>标准字典覆盖 <b style={{ color: 'var(--primary)' }}>{stats.coveredStandard}</b> 项</span>
          <span>字典外新增 <b style={{ color: 'var(--warning)' }}>{stats.extra}</b> 项</span>
          <span>当前 CSR 已绑定 <b style={{ color: 'var(--success)' }}>{stats.boundDefs}</b> / {stats.defTotal} 项定义</span>
          {!csr && <span style={{ color: 'var(--danger)' }}>（未加载 CSR，绑定数据不可用，新建绑定功能已禁用）</span>}
          <span style={{ marginLeft: 'auto' }}>共 {filtered.length} 条</span>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                position: 'sticky', top: 0, background: 'var(--surface-1)', zIndex: 1, textAlign: 'left',
                color: 'var(--foreground-muted)', font: 'var(--text-label)',
              }}>
                <th style={{ padding: '8px 16px', fontWeight: 500 }}>EventKeyId</th>
                <th style={{ padding: '8px 10px', fontWeight: 500 }}>EventName</th>
                <th style={{ padding: '8px 10px', fontWeight: 500 }}>EventCode</th>
                <th style={{ padding: '8px 10px', fontWeight: 500 }}>级别</th>
                <th style={{ padding: '8px 10px', fontWeight: 500 }}>来源</th>
                <th style={{ padding: '8px 10px', fontWeight: 500 }}>CSR 绑定</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const boundCount = bindingsByKey.get(d.EventKeyId)?.length ?? 0;
                const sev = severityMeta(d.SeverityId);
                const isStandard = EVENT_STANDARD_KEY_SET.has(d.EventKeyId);
                const isSelected = selectedKey === d.EventKeyId;
                return (
                  <tr
                    key={d.EventKeyId}
                    onClick={() => setSelectedKey(d.EventKeyId)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'var(--state-selected)' : 'transparent',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = 'var(--state-hover)'; }}
                    onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                  >
                    <td style={{
                      padding: '7px 16px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
                      color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                      borderLeft: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                    }}>
                      {d.EventKeyId}{overrides[d.EventKeyId] && <span title="已本地编辑" style={{ marginLeft: 6, color: 'var(--warning)' }}>●</span>}
                    </td>
                    <td style={{ padding: '7px 10px', color: 'var(--foreground-secondary)' }}>{d.EventName}</td>
                    <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--foreground-muted)' }}>{d.EventCode}</td>
                    <td style={{ padding: '7px 10px' }}><Badge text={sev.label} tone={sev.tone} /></td>
                    <td style={{ padding: '7px 10px' }}>
                      <Badge text={isStandard ? '标准' : '扩展'} tone={isStandard ? 'var(--primary)' : 'var(--accent)'} />
                    </td>
                    <td style={{ padding: '7px 10px' }}>
                      <Badge text={String(boundCount)} tone={boundCount > 0 ? 'var(--success)' : 'var(--foreground-muted)'} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--foreground-muted)' }}>无匹配的事件定义</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── 右：配置详情（可编排） ── */}
      <aside style={{ width: 380, flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', overflowY: 'auto', padding: 18 }}>
        {!selectedDef ? (
          <div style={{ color: 'var(--foreground-muted)', padding: 24 }}>请在中间表格选择一个事件，查看并编排其定义与 CSR 绑定</div>
        ) : (
          <EventDetail
            def={selectedDef}
            desc={selectedDesc}
            bindings={selectedBindings}
            lang={descLang}
            onLangChange={setDescLang}
            csrLoaded={!!csr}
            edited={selectedEdited}
            onFieldChange={(patch) => updateDef(selectedDef.EventKeyId, patch)}
            onReset={() => resetDef(selectedDef.EventKeyId)}
            onAddBinding={handleAddBinding}
          />
        )}
      </aside>
    </div>
  );
}

function EventDetail({
  def, desc, bindings, lang, onLangChange, csrLoaded, edited, onFieldChange, onReset, onAddBinding,
}: {
  def: EventDefEntry;
  desc: EventDescEntry | null;
  bindings: CsrBinding[];
  lang: 'Zh' | 'En';
  onLangChange: (l: 'Zh' | 'En') => void;
  csrLoaded: boolean;
  edited: boolean;
  onFieldChange: (patch: Partial<EventDefEntry>) => void;
  onReset: () => void;
  onAddBinding: () => void;
}) {
  const isStandard = EVENT_STANDARD_KEY_SET.has(def.EventKeyId);
  const description = desc?.Description?.[lang];
  const placeholders = extractPlaceholders(desc?.Description?.Zh ?? desc?.Description?.En);
  const num = (v: unknown) => (v === undefined || v === null || v === '' ? 0 : Number(v) || 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ font: 'var(--text-label)', color: 'var(--foreground-muted)', wordBreak: 'break-all' }}>{def.EventKeyId}</div>
        {edited && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <Badge text="已编排" tone="var(--warning)" />
            <button onClick={onReset} style={{ background: 'none', border: 'none', color: 'var(--foreground-muted)', fontSize: 11, cursor: 'pointer', padding: 0 }}>
              还原
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 10, marginBottom: 14 }}>
        <EditField label="事件名称 EventName" value={def.EventName ?? ''} onChange={(v) => onFieldChange({ EventName: v })} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <SeveritySelect value={def.SeverityId} onChange={(v) => onFieldChange({ SeverityId: v })} />
        <Badge text={isStandard ? '标准字典' : '字典外新增'} tone={isStandard ? 'var(--primary)' : 'var(--accent)'} />
        <ToggleChip
          label="支持去抖"
          checked={def.DeassertFlag === 1}
          onChange={(v) => onFieldChange({ DeassertFlag: v ? 1 : 0 })}
        />
      </div>

      <label style={{ ...LABEL_STYLE, marginBottom: 8 }}>基础字段</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
        <EditField label="EventCode" mono value={def.EventCode ?? ''} onChange={(v) => onFieldChange({ EventCode: v })} />
        <EditField label="OldEventCode" mono value={def.OldEventCode ?? ''} onChange={(v) => onFieldChange({ OldEventCode: v })} />
        <EditField label="ReportChannel" type="number" value={String(def.ReportChannel ?? 0)} onChange={(v) => onFieldChange({ ReportChannel: num(v) })} />
        <EditField label="EventType" type="number" value={String(def.EventType ?? 0)} onChange={(v) => onFieldChange({ EventType: num(v) })} />
        <EditField label="LifeCycleId" type="number" value={String(def.LifeCycleId ?? 0)} onChange={(v) => onFieldChange({ LifeCycleId: num(v) })} />
        <EditField label="ActionId" type="number" value={String(def.ActionId ?? 0)} onChange={(v) => onFieldChange({ ActionId: num(v) })} />
      </div>
      {def.ReportChannel === 65535 && (
        <div style={{ fontSize: 10.5, color: 'var(--foreground-muted)', marginTop: 2 }}>65535 = 全通道上报</div>
      )}

      {desc && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>描述模板</label>
            <div style={{ display: 'inline-flex', gap: 2, padding: 3, borderRadius: 8, background: 'var(--surface-disabled)' }}>
              {(['Zh', 'En'] as const).map((l) => (
                <button key={l} onClick={() => onLangChange(l)} style={chipBtnStyle(lang === l)}>
                  {l === 'Zh' ? '中' : 'EN'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: 10, background: 'var(--surface-1)', borderRadius: 8, lineHeight: 1.6, wordBreak: 'break-all' }}>
            {description || '（无描述）'}
          </div>
          {placeholders.length > 0 && (
            <div style={{ marginTop: 6, fontSize: 10.5, color: 'var(--foreground-muted)' }}>
              占位符 {placeholders.map((n) => `%${n}`).join(' ')} 依次取值于 CSR 侧该事件绑定的 Component / DescArg1~5 字段
            </div>
          )}

          {desc.Cause?.[lang] && <TextBlock label="可能原因" text={desc.Cause[lang]!} />}
          {desc.Influence?.[lang] && <TextBlock label="影响" text={desc.Influence[lang]!} />}
          {desc.Suggestion?.[lang] && <TextBlock label="处理建议" text={desc.Suggestion[lang]!} />}
        </div>
      )}

      <div style={{ marginTop: 18, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
        <label style={{ ...LABEL_STYLE, marginBottom: 6 }}>CSR 绑定（{bindings.length}）</label>
        {bindings.length === 0 ? (
          <div style={{ color: 'var(--foreground-muted)', marginBottom: 8 }}>当前 CSR 中暂无 Event_* 对象绑定此事件</div>
        ) : (
          <div style={{ marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {bindings.map((b) => (
              <div key={b.objectId} style={{ padding: '7px 10px', background: 'var(--surface-1)', borderRadius: 8 }}>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--foreground)' }}>{b.objectId}</div>
                <div style={{ color: 'var(--foreground-muted)', fontSize: 10.5, marginTop: 2 }}>
                  Component: {String(b.Component || '-')} · Condition: {String(b.Condition ?? '-')} · Enabled: {String(b.Enabled ?? '-')}
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={onAddBinding}
          disabled={!csrLoaded}
          title={csrLoaded ? '在当前 CSR 中新建绑定此事件的 Event_* 对象' : '需先加载 CSR 才能新建绑定'}
          style={{
            width: '100%', padding: '8px 0', borderRadius: 8, border: 'none', fontSize: 12, fontFamily: 'inherit', fontWeight: 600,
            background: csrLoaded ? 'var(--primary)' : 'var(--surface-disabled)',
            color: csrLoaded ? 'var(--primary-foreground)' : 'var(--foreground-disabled)',
            cursor: csrLoaded ? 'pointer' : 'not-allowed',
          }}
        >
          + 新增 CSR 绑定
        </button>
      </div>
    </div>
  );
}

function SeveritySelect({ value, onChange }: { value: number | undefined; onChange: (v: number) => void }) {
  const sev = severityMeta(value);
  return (
    <select
      value={value ?? 0}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        appearance: 'none', WebkitAppearance: 'none', border: 'none', cursor: 'pointer',
        padding: '3px 22px 3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500, fontFamily: 'inherit',
        color: sev.tone, background: `color-mix(in srgb, ${sev.tone} 16%, transparent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 6px center/12px`,
      }}
    >
      {[0, 1, 2, 3].map((id) => (
        <option key={id} value={id} style={{ background: 'var(--surface-2)', color: 'var(--foreground)' }}>
          {SEVERITY_META[id].label}
        </option>
      ))}
    </select>
  );
}

function ToggleChip({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px 3px 8px', borderRadius: 999,
        fontSize: 11, fontFamily: 'inherit', border: 'none', cursor: 'pointer',
        background: checked ? 'color-mix(in srgb, var(--success) 16%, transparent)' : 'var(--surface-disabled)',
        color: checked ? 'var(--success)' : 'var(--foreground-muted)',
      }}
    >
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: checked ? 'var(--success)' : 'var(--foreground-disabled)',
      }} />
      {label}
    </button>
  );
}

function TextBlock({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ marginTop: 10 }}>
      <label style={LABEL_STYLE}>{label}</label>
      <div style={{ color: 'var(--foreground-secondary)', lineHeight: 1.6, wordBreak: 'break-all' }}>
        {text.split('@#AB;').map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </div>
  );
}
