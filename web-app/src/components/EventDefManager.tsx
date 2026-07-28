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
  onOpenEventConfig?: () => void;
}

const SEVERITY_META: Record<number, { label: string; color: string }> = {
  0: { label: '提示', color: '#7c93a8' },
  1: { label: '一般', color: '#e5c07b' },
  2: { label: '重要', color: '#f0a35c' },
  3: { label: '紧急', color: '#e06c75' },
};

function severityMeta(id: number | undefined) {
  return SEVERITY_META[id ?? -1] ?? { label: `未知(${id ?? '-'})`, color: '#888' };
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

const BOX_BORDER = '1px solid #3c3c3c';
const LABEL_STYLE: React.CSSProperties = { fontSize: 11, color: '#8a8a8a', marginBottom: 4 };

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 7px', borderRadius: 10, fontSize: 11,
      color, background: `${color}22`, border: `1px solid ${color}55`, whiteSpace: 'nowrap',
    }}>
      {text}
    </span>
  );
}

export function EventDefManager({ csr, eventDef, onChange, onOpenEventConfig }: Props) {
  const [bundled, setBundled] = useState<EventDefBundle | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [bindingFilter, setBindingFilter] = useState<'all' | 'bound' | 'unbound'>('all');
  const [standardFilter, setStandardFilter] = useState<'all' | 'standard' | 'extra'>('all');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [descLang, setDescLang] = useState<'Zh' | 'En'>('Zh');

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
  const defs = useMemo(() => bundle?.EventDefinition ?? [], [bundle]);
  const descByKey = useMemo(() => {
    const map = new Map<string, EventDescEntry>();
    for (const d of bundle?.EventDescription ?? []) map.set(d.EventKeyId, d);
    return map;
  }, [bundle]);

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
    return {
      standardTotal: EVENT_STANDARD_KEY_SET.size,
      defTotal: defs.length,
      coveredStandard,
      extra,
      boundDefs,
    };
  }, [defs, bindingsByKey]);

  const selectedDef = selectedKey ? defs.find((d) => d.EventKeyId === selectedKey) ?? null : null;
  const selectedDesc = selectedKey ? descByKey.get(selectedKey) ?? null : null;
  const selectedBindings = selectedKey ? bindingsByKey.get(selectedKey) ?? [] : [];

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontSize: 13 }}>
        {loadError ?? '正在加载事件字典…'}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontSize: 12, color: '#ddd' }}>
      {/* ── 左：分类筛选 ── */}
      <aside style={{ width: 220, flexShrink: 0, borderRight: BOX_BORDER, overflowY: 'auto', padding: 8 }}>
        <input
          type="text"
          placeholder="搜索 EventKeyId / 名称 / 编码"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: 6, marginBottom: 8, background: '#3c3c3c', border: '1px solid #555', color: '#fff', borderRadius: 4 }}
        />

        <div style={LABEL_STYLE}>CSR 绑定状态</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['all', 'bound', 'unbound'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setBindingFilter(v)}
              style={{
                padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                background: bindingFilter === v ? '#0e639c' : '#2d2d2d', color: '#fff', border: '1px solid #444',
              }}
            >
              {v === 'all' ? '全部' : v === 'bound' ? '已绑定' : '未绑定'}
            </button>
          ))}
        </div>

        <div style={LABEL_STYLE}>字典来源</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['all', 'standard', 'extra'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setStandardFilter(v)}
              style={{
                padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                background: standardFilter === v ? '#0e639c' : '#2d2d2d', color: '#fff', border: '1px solid #444',
              }}
            >
              {v === 'all' ? '全部' : v === 'standard' ? '标准字典' : '字典外新增'}
            </button>
          ))}
        </div>

        <div style={LABEL_STYLE}>分类（{categories.length}）</div>
        <div
          onClick={() => setCategory('all')}
          style={{ padding: '6px 8px', marginBottom: 2, borderRadius: 4, cursor: 'pointer', background: category === 'all' ? '#0e639c33' : 'transparent' }}
        >
          全部（{defs.length}）
        </div>
        {categories.map(([name, count]) => (
          <div
            key={name}
            onClick={() => setCategory(name)}
            style={{
              padding: '6px 8px', marginBottom: 2, borderRadius: 4, cursor: 'pointer',
              background: category === name ? '#0e639c33' : 'transparent', display: 'flex', justifyContent: 'space-between',
            }}
          >
            <span>{name}</span>
            <span style={{ color: '#888' }}>{count}</span>
          </div>
        ))}
      </aside>

      {/* ── 中：表格 ── */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '8px 12px', borderBottom: BOX_BORDER, display: 'flex', gap: 16, flexWrap: 'wrap', color: '#9aa', fontSize: 11 }}>
          <span>标准字典 <b style={{ color: '#ddd' }}>{stats.standardTotal}</b> 项</span>
          <span>事件定义库 <b style={{ color: '#ddd' }}>{stats.defTotal}</b> 项</span>
          <span>标准字典覆盖 <b style={{ color: '#9cdcfe' }}>{stats.coveredStandard}</b> 项</span>
          <span>字典外新增 <b style={{ color: '#e5c07b' }}>{stats.extra}</b> 项</span>
          <span>当前 CSR 已绑定 <b style={{ color: '#98c379' }}>{stats.boundDefs}</b> / {stats.defTotal} 项定义</span>
          {!csr && <span style={{ color: '#e06c75' }}>（未加载 CSR，绑定数据不可用，新建绑定功能已禁用）</span>}
          <span style={{ marginLeft: 'auto' }}>共 {filtered.length} 条</span>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, background: '#252526', zIndex: 1, textAlign: 'left', color: '#8a8a8a' }}>
                <th style={{ padding: '6px 10px', fontWeight: 500 }}>EventKeyId</th>
                <th style={{ padding: '6px 10px', fontWeight: 500 }}>EventName</th>
                <th style={{ padding: '6px 10px', fontWeight: 500 }}>EventCode</th>
                <th style={{ padding: '6px 10px', fontWeight: 500 }}>级别</th>
                <th style={{ padding: '6px 10px', fontWeight: 500 }}>来源</th>
                <th style={{ padding: '6px 10px', fontWeight: 500 }}>CSR 绑定</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const boundCount = bindingsByKey.get(d.EventKeyId)?.length ?? 0;
                const sev = severityMeta(d.SeverityId);
                const isStandard = EVENT_STANDARD_KEY_SET.has(d.EventKeyId);
                return (
                  <tr
                    key={d.EventKeyId}
                    onClick={() => setSelectedKey(d.EventKeyId)}
                    style={{
                      cursor: 'pointer',
                      background: selectedKey === d.EventKeyId ? '#0e639c33' : 'transparent',
                      borderBottom: '1px solid #2a2a2a',
                    }}
                  >
                    <td style={{ padding: '5px 10px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{d.EventKeyId}</td>
                    <td style={{ padding: '5px 10px', color: '#ccc' }}>{d.EventName}</td>
                    <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: '#888' }}>{d.EventCode}</td>
                    <td style={{ padding: '5px 10px' }}><Badge text={sev.label} color={sev.color} /></td>
                    <td style={{ padding: '5px 10px' }}>
                      <Badge text={isStandard ? '标准' : '扩展'} color={isStandard ? '#61afef' : '#c678dd'} />
                    </td>
                    <td style={{ padding: '5px 10px' }}>
                      <Badge text={String(boundCount)} color={boundCount > 0 ? '#98c379' : '#666'} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#666' }}>无匹配的事件定义</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── 右：配置详情 ── */}
      <aside style={{ width: 360, flexShrink: 0, borderLeft: BOX_BORDER, overflowY: 'auto', padding: 16 }}>
        {!selectedDef ? (
          <div style={{ color: '#888', padding: 24 }}>请在中间表格选择一个事件查看详情与 CSR 绑定配置</div>
        ) : (
          <EventDetail
            def={selectedDef}
            desc={selectedDesc}
            bindings={selectedBindings}
            lang={descLang}
            onLangChange={setDescLang}
            csrLoaded={!!csr}
            onAddBinding={handleAddBinding}
            onOpenEventConfig={onOpenEventConfig}
          />
        )}
      </aside>
    </div>
  );
}

function EventDetail({
  def, desc, bindings, lang, onLangChange, csrLoaded, onAddBinding, onOpenEventConfig,
}: {
  def: EventDefEntry;
  desc: EventDescEntry | null;
  bindings: CsrBinding[];
  lang: 'Zh' | 'En';
  onLangChange: (l: 'Zh' | 'En') => void;
  csrLoaded: boolean;
  onAddBinding: () => void;
  onOpenEventConfig?: () => void;
}) {
  const sev = severityMeta(def.SeverityId);
  const isStandard = EVENT_STANDARD_KEY_SET.has(def.EventKeyId);
  const description = desc?.Description?.[lang];
  const placeholders = extractPlaceholders(desc?.Description?.Zh ?? desc?.Description?.En);

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', wordBreak: 'break-all' }}>{def.EventKeyId}</div>
      <div style={{ fontSize: 12, color: '#9aa', marginBottom: 8 }}>{def.EventName}</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        <Badge text={sev.label} color={sev.color} />
        <Badge text={isStandard ? '标准字典' : '字典外新增'} color={isStandard ? '#61afef' : '#c678dd'} />
        {def.DeassertFlag === 1 && <Badge text="支持去抖" color="#56b6c2" />}
      </div>

      <FieldGrid
        rows={[
          ['EventCode', def.EventCode || '-'],
          ['OldEventCode', def.OldEventCode || '-'],
          ['ReportChannel', def.ReportChannel === 65535 ? '65535（全通道）' : String(def.ReportChannel ?? '-')],
          ['EventType', String(def.EventType ?? '-')],
          ['LifeCycleId', String(def.LifeCycleId ?? '-')],
          ['ActionId', String(def.ActionId ?? '-')],
        ]}
      />

      {desc && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={LABEL_STYLE}>描述模板</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['Zh', 'En'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  style={{
                    padding: '1px 8px', borderRadius: 3, fontSize: 10.5, cursor: 'pointer',
                    background: lang === l ? '#0e639c' : '#2d2d2d', color: '#fff', border: '1px solid #444',
                  }}
                >
                  {l === 'Zh' ? '中' : 'EN'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: 8, background: '#1e1e1e', border: BOX_BORDER, borderRadius: 4, lineHeight: 1.6, wordBreak: 'break-all' }}>
            {description || '（无描述）'}
          </div>
          {placeholders.length > 0 && (
            <div style={{ marginTop: 6, fontSize: 10.5, color: '#7c93a8' }}>
              占位符 {placeholders.map((n) => `%${n}`).join(' ')} 依次取值于 CSR 侧该事件绑定的 Component / DescArg1~5 字段
            </div>
          )}

          {desc.Cause?.[lang] && <TextBlock label="可能原因" text={desc.Cause[lang]!} />}
          {desc.Influence?.[lang] && <TextBlock label="影响" text={desc.Influence[lang]!} />}
          {desc.Suggestion?.[lang] && <TextBlock label="处理建议" text={desc.Suggestion[lang]!} />}
        </div>
      )}

      <div style={{ marginTop: 16, borderTop: BOX_BORDER, paddingTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={LABEL_STYLE}>CSR 绑定（{bindings.length}）</span>
          {onOpenEventConfig && bindings.length > 0 && (
            <button
              onClick={onOpenEventConfig}
              style={{ fontSize: 10.5, color: '#9cdcfe', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              在事件配置中打开 →
            </button>
          )}
        </div>
        {bindings.length === 0 ? (
          <div style={{ color: '#666', marginBottom: 8 }}>当前 CSR 中暂无 Event_* 对象绑定此事件</div>
        ) : (
          <div style={{ marginBottom: 8 }}>
            {bindings.map((b) => (
              <div key={b.objectId} style={{ padding: '6px 8px', marginBottom: 4, background: '#1e1e1e', border: BOX_BORDER, borderRadius: 4 }}>
                <div style={{ fontFamily: 'monospace', color: '#ccc' }}>{b.objectId}</div>
                <div style={{ color: '#888', fontSize: 10.5, marginTop: 2 }}>
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
            width: '100%', padding: 7, background: csrLoaded ? '#0e639c' : '#333', color: '#fff', border: 'none',
            borderRadius: 4, cursor: csrLoaded ? 'pointer' : 'not-allowed', opacity: csrLoaded ? 1 : 0.6,
          }}
        >
          + 新增 CSR 绑定
        </button>
      </div>
    </div>
  );
}

function FieldGrid({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 4, columnGap: 8, fontSize: 11.5, marginBottom: 4 }}>
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <span style={{ color: '#8a8a8a' }}>{k}</span>
          <span style={{ color: '#ccc', fontFamily: 'monospace', wordBreak: 'break-all' }}>{v}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function TextBlock({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={LABEL_STYLE}>{label}</div>
      <div style={{ color: '#bbb', lineHeight: 1.6, wordBreak: 'break-all' }}>
        {text.split('@#AB;').map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </div>
  );
}
