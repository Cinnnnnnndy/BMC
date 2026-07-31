import React, { useEffect, useMemo, useState } from 'react';
import type { CSRDocument } from '../types';
import { withBase } from '../base';
import { EVENT_STANDARD_KEY_SET } from '../data/eventStandardKeys';

// 「事件定义」= 事件模板：EventCode/Severity/ActionId 等由字典统一定义，
// CSR 里的每个 Event_* 对象只是引用某个模板并填入本机差异化参数
// （Component / Reading / DescArg1~5），因此本页以模板表格为主视图，
// 同时把 CSR 绑定（原「硬件适配」独立事件弹窗做的事）收进同一处编排。
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
  /** 手动归类覆盖：字典客观归属之外，允许本地重新标记 */
  SourceOverride?: 'standard' | 'extra';
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

// 触发方向（OperatorId）：与「硬件适配」独立事件弹窗共用同一套编号/词表
// （来源：web-app-vue/src/alarm/alarmKnowledge.ts OPERATORS），确保两处编排是同一件事。
const OPERATOR_LABELS: Array<{ id: number; label: string; symbol: string }> = [
  { id: 4, label: '高于门限', symbol: '≥' },
  { id: 1, label: '低于门限', symbol: '≤' },
  { id: 5, label: '状态命中', symbol: '=' },
  { id: 3, label: '严格大于', symbol: '>' },
  { id: 2, label: '严格小于', symbol: '<' },
  { id: 6, label: '状态跳变', symbol: '⇌' },
  { id: 7, label: '在位 / 插入', symbol: '＋' },
  { id: 8, label: '离位 / 移除', symbol: '－' },
];
function categoryOf(eventKeyId: string): string {
  const dot = eventKeyId.indexOf('.');
  return dot > 0 ? eventKeyId.slice(0, dot) : eventKeyId;
}

/** 事件来源归类：手动覆盖优先，否则按标准字典客观归属判定 */
function sourceTag(d: EventDefEntry): 'standard' | 'extra' {
  return d.SourceOverride ?? (EVENT_STANDARD_KEY_SET.has(d.EventKeyId) ? 'standard' : 'extra');
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

/** 空集合 = 不筛选（全部通过） */
function passesSet(set: Set<string>, tag: string): boolean {
  return set.size === 0 || set.has(tag);
}

const PAGE_SIZE = 20;

const LABEL_STYLE: React.CSSProperties = { font: 'var(--text-label)', color: 'var(--foreground-muted)', marginBottom: 5, display: 'block' };
// 分区大标题（"基础字段" / "描述模板" / "CSR 绑定"）：字重、大小写、字距都区别于下面
// 一个个具体字段的小说明文字（LABEL_STYLE），避免两级标签长得太像分不清层级。
const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 700, color: 'var(--foreground-secondary)',
  textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block',
};
const SECTION_WRAP_STYLE: React.CSSProperties = { marginTop: 18, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 };
// 字段下方的辅助提示文字（"占位符 %1... "、"多条原因用 @#AB; 分隔"）：比字段名称
// （LABEL_STYLE）更暗更小、并用斜体，三级层次一眼能分：分区 > 字段名 > 提示语。
const HINT_STYLE: React.CSSProperties = { fontSize: 10, color: 'var(--foreground-disabled)', fontStyle: 'italic', lineHeight: 1.5, display: 'block' };

function PageBtn({ children, disabled, onClick, title }: { children: React.ReactNode; disabled?: boolean; onClick: () => void; title?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 26, height: 26, padding: '0 6px',
        borderRadius: 7, border: 'none', fontSize: 12, fontFamily: 'inherit', cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? 'var(--surface-disabled)' : (hover ? 'var(--surface-3)' : 'var(--surface-2)'),
        color: disabled ? 'var(--foreground-disabled)' : 'var(--foreground-secondary)',
      }}
    >
      {children}
    </button>
  );
}

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

/** 字段名后的「?」——hover 显示该配置项含义，不占用常驻空间 */
function InfoTip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle' }}>
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          width: 14, height: 14, borderRadius: '50%', border: 'none', cursor: 'default', padding: 0, lineHeight: 1,
          background: 'var(--state-hover)', color: 'var(--foreground-muted)', fontSize: 9.5, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ?
      </button>
      {show && (
        <div style={{
          position: 'absolute', left: 18, top: -6, width: 230, zIndex: 60,
          background: 'var(--surface-2)', borderRadius: 8, padding: '8px 10px', boxShadow: 'var(--shadow-lg)',
          fontSize: 11, fontWeight: 400, fontStyle: 'normal', textTransform: 'none', letterSpacing: 'normal',
          color: 'var(--foreground-secondary)', lineHeight: 1.6, pointerEvents: 'none',
        }}>
          {text}
        </div>
      )}
    </span>
  );
}

function EditField({ label, value, onChange, mono, type = 'text', tip }: {
  label: string; value: string; onChange: (v: string) => void; mono?: boolean; type?: 'text' | 'number'; tip?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={LABEL_STYLE}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          {label}
          {tip && <InfoTip text={tip} />}
        </span>
      </label>
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

/** 短标签 + 任意控件（select / toggle）——把「级别」「来源」「去抖」这类紧凑控件
 * 也套进跟 EditField 一致的「配置项」外观：名称在上、控件在下、名称后可挂「?」提示。 */
function MiniField({ label, tip, children }: { label: string; tip?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={LABEL_STYLE}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          {label}
          {tip && <InfoTip text={tip} />}
        </span>
      </label>
      {children}
    </div>
  );
}

function EditTextarea({ label, value, onChange, hint, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...fieldInputStyle(focused), resize: 'vertical', lineHeight: 1.5 }}
      />
      {hint && <div style={{ ...HINT_STYLE, marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

interface FilterOption { value: string; label: string; count: number }

/** 表头内嵌的筛选下拉：点击表头图标展开选项，代替左侧筛选列表 */
function FilterTh({ label, options, selected, onChange, width, mono }: {
  label: string;
  options: FilterOption[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  width?: number;
  mono?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const active = selected.size > 0;

  const toggleValue = (v: string) => {
    const next = new Set(selected);
    if (next.has(v)) next.delete(v); else next.add(v);
    onChange(next);
  };

  return (
    <th style={{ position: 'relative', padding: '6px 6px', fontWeight: 500, textAlign: 'left', width, whiteSpace: 'nowrap' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={`按「${label}」筛选`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', cursor: 'pointer', borderRadius: 7,
          padding: '4px 7px 4px 9px', font: 'inherit', fontWeight: active ? 600 : 500,
          fontFamily: mono ? 'var(--font-mono)' : 'inherit',
          color: active ? 'var(--primary)' : 'var(--foreground-secondary)',
          background: active
            ? `color-mix(in srgb, var(--primary) ${hover ? 24 : 16}%, transparent)`
            : (hover ? 'var(--surface-3)' : 'var(--surface-2)'),
        }}
      >
        {label}
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: active ? 1 : 0.55, flexShrink: 0 }}>
          <path d="M7 10l5 5 5-5z" />
        </svg>
        {active && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 14, height: 14,
            borderRadius: 999, background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 9, padding: '0 3px',
          }}>
            {selected.size}
          </span>
        )}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 50, minWidth: 180, maxHeight: 300,
            overflowY: 'auto', background: 'var(--surface-2)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', padding: 6,
          }}>
            {active && (
              <button
                onClick={() => onChange(new Set())}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '5px 8px', marginBottom: 2, borderRadius: 6,
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--primary)', fontWeight: 500,
                }}
              >
                清空筛选
              </button>
            )}
            {options.map((o) => (
              <label
                key={o.value}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 6, cursor: 'pointer',
                  fontSize: 12, fontWeight: 400, color: 'var(--foreground-secondary)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.background = 'var(--state-hover)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.background = 'transparent'; }}
              >
                <input type="checkbox" checked={selected.has(o.value)} onChange={() => toggleValue(o.value)} style={{ accentColor: 'var(--primary)' }} />
                <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{o.label}</span>
                <span style={{ color: 'var(--foreground-muted)', fontSize: 10.5 }}>{o.count}</span>
              </label>
            ))}
            {options.length === 0 && <div style={{ padding: '5px 8px', fontSize: 11, color: 'var(--foreground-muted)' }}>无可选项</div>}
          </div>
        </>
      )}
    </th>
  );
}

export function EventDefManager({ csr, eventDef, onChange }: Props) {
  const [bundled, setBundled] = useState<EventDefBundle | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Set<string>>(new Set());
  const [severityFilter, setSeverityFilter] = useState<Set<string>>(new Set());
  const [eventTypeFilter, setEventTypeFilter] = useState<Set<string>>(new Set());
  const [lifeCycleFilter, setLifeCycleFilter] = useState<Set<string>>(new Set());
  const [deassertFilter, setDeassertFilter] = useState<Set<string>>(new Set());
  const [sourceFilter, setSourceFilter] = useState<Set<string>>(new Set());
  const [bindingFilter, setBindingFilter] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [descLang, setDescLang] = useState<'Zh' | 'En'>('Zh');
  const [pageRaw, setPage] = useState(1);
  // 会话内本地编辑覆盖（事件定义库本身是静态字典文件，编排结果先保存在页面内）
  const [overrides, setOverrides] = useState<Record<string, Partial<EventDefEntry>>>({});
  const [descOverrides, setDescOverrides] = useState<Record<string, Partial<EventDescEntry>>>({});
  // 用户在本页新增的事件模板（不在字典文件里）
  const [customDefs, setCustomDefs] = useState<EventDefEntry[]>([]);

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
  const allRawDefs = useMemo(() => [...rawDefs, ...customDefs], [rawDefs, customDefs]);
  const defs = useMemo(
    () => allRawDefs.map((d) => (overrides[d.EventKeyId] ? { ...d, ...overrides[d.EventKeyId] } : d)),
    [allRawDefs, overrides]
  );
  const customKeySet = useMemo(() => new Set(customDefs.map((d) => d.EventKeyId)), [customDefs]);
  const descByKey = useMemo(() => {
    const map = new Map<string, EventDescEntry>();
    for (const d of bundle?.EventDescription ?? []) map.set(d.EventKeyId, d);
    return map;
  }, [bundle]);

  const updateDef = (key: string, patch: Partial<EventDefEntry>) => {
    setOverrides((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };
  const updateDescField = (key: string, field: 'Description' | 'Cause' | 'Influence' | 'Suggestion', lang: 'Zh' | 'En', value: string) => {
    setDescOverrides((prev) => {
      const base = descByKey.get(key);
      const prevPatch = prev[key] ?? {};
      const baseFieldObj = (base?.[field] as { En?: string; Zh?: string } | undefined) ?? {};
      const prevFieldObj = (prevPatch[field] as { En?: string; Zh?: string } | undefined) ?? baseFieldObj;
      return { ...prev, [key]: { ...prevPatch, [field]: { ...prevFieldObj, [lang]: value } } };
    });
  };
  const resetKey = (key: string) => {
    setOverrides((prev) => { const n = { ...prev }; delete n[key]; return n; });
    setDescOverrides((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handleAddDef = () => {
    const existingKeys = new Set(allRawDefs.map((d) => d.EventKeyId));
    let n = 1;
    let key = `Custom.NewEvent${n}`;
    while (existingKeys.has(key)) key = `Custom.NewEvent${++n}`;
    const draft: EventDefEntry = {
      EventKeyId: key, EventName: '新事件', SeverityId: 0, EventCode: '', ActionId: 0,
      EventType: 0, LifeCycleId: 0, DeassertFlag: 0, ReportChannel: 65535,
    };
    setCustomDefs((prev) => [...prev, draft]);
    setSelectedKey(key);
  };
  const renameCustomDef = (oldKey: string, newKeyRaw: string) => {
    const newKey = newKeyRaw.trim();
    if (!newKey || newKey === oldKey || allRawDefs.some((d) => d.EventKeyId === newKey)) return;
    setCustomDefs((prev) => prev.map((d) => (d.EventKeyId === oldKey ? { ...d, EventKeyId: newKey } : d)));
    if (overrides[oldKey]) {
      setOverrides((prev) => { const n = { ...prev }; n[newKey] = n[oldKey]; delete n[oldKey]; return n; });
    }
    setSelectedKey(newKey);
  };
  const deleteCustomDef = (key: string) => {
    setCustomDefs((prev) => prev.filter((d) => d.EventKeyId !== key));
    resetKey(key);
    if (selectedKey === key) setSelectedKey(null);
    // 级联清理该模板在当前 CSR 里留下的绑定，避免残留悬空引用
    for (const b of bindingsByKey.get(key) ?? []) handleDeleteBinding(b.objectId);
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

  // ── 表头筛选下拉的选项 + 计数（基于全量字典，独立于其它列的筛选结果）──
  const categoryOptions = useMemo<FilterOption[]>(() => {
    const counts = new Map<string, number>();
    for (const d of defs) counts.set(categoryOf(d.EventKeyId), (counts.get(categoryOf(d.EventKeyId)) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, label: value, count }));
  }, [defs]);

  const severityOptions = useMemo<FilterOption[]>(() => (
    [0, 1, 2, 3].map((id) => ({ value: String(id), label: SEVERITY_META[id].label, count: defs.filter((d) => (d.SeverityId ?? 0) === id).length }))
      .filter((o) => o.count > 0)
  ), [defs]);

  const eventTypeOptions = useMemo<FilterOption[]>(() => {
    const counts = new Map<number, number>();
    for (const d of defs) { const v = d.EventType ?? 0; counts.set(v, (counts.get(v) ?? 0) + 1); }
    return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([v, count]) => ({ value: String(v), label: `EventType ${v}`, count }));
  }, [defs]);

  const lifeCycleOptions = useMemo<FilterOption[]>(() => {
    const counts = new Map<number, number>();
    for (const d of defs) { const v = d.LifeCycleId ?? 0; counts.set(v, (counts.get(v) ?? 0) + 1); }
    return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([v, count]) => ({ value: String(v), label: `LifeCycleId ${v}`, count }));
  }, [defs]);

  const deassertOptions = useMemo<FilterOption[]>(() => {
    const yes = defs.filter((d) => d.DeassertFlag === 1).length;
    return [
      { value: '1', label: '支持去抖', count: yes },
      { value: '0', label: '不支持', count: defs.length - yes },
    ].filter((o) => o.count > 0);
  }, [defs]);

  const sourceOptions = useMemo<FilterOption[]>(() => {
    const standard = defs.filter((d) => sourceTag(d) === 'standard').length;
    return [
      { value: 'standard', label: '标准字典', count: standard },
      { value: 'extra', label: '字典外新增', count: defs.length - standard },
    ].filter((o) => o.count > 0);
  }, [defs]);

  const bindingOptions = useMemo<FilterOption[]>(() => {
    const bound = defs.filter((d) => (bindingsByKey.get(d.EventKeyId)?.length ?? 0) > 0).length;
    return [
      { value: 'bound', label: '已绑定', count: bound },
      { value: 'unbound', label: '未绑定', count: defs.length - bound },
    ].filter((o) => o.count > 0);
  }, [defs, bindingsByKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return defs.filter((d) => {
      if (q && !(d.EventKeyId.toLowerCase().includes(q) || (d.EventName ?? '').toLowerCase().includes(q) || (d.EventCode ?? '').toLowerCase().includes(q))) return false;
      if (!passesSet(categoryFilter, categoryOf(d.EventKeyId))) return false;
      if (!passesSet(severityFilter, String(d.SeverityId ?? 0))) return false;
      if (!passesSet(eventTypeFilter, String(d.EventType ?? 0))) return false;
      if (!passesSet(lifeCycleFilter, String(d.LifeCycleId ?? 0))) return false;
      if (!passesSet(deassertFilter, String(d.DeassertFlag ?? 0))) return false;
      if (!passesSet(sourceFilter, sourceTag(d))) return false;
      const boundCount = bindingsByKey.get(d.EventKeyId)?.length ?? 0;
      if (!passesSet(bindingFilter, boundCount > 0 ? 'bound' : 'unbound')) return false;
      return true;
    });
  }, [defs, search, categoryFilter, severityFilter, eventTypeFilter, lifeCycleFilter, deassertFilter, sourceFilter, bindingFilter, bindingsByKey]);

  const activeFilterCount = categoryFilter.size + severityFilter.size + eventTypeFilter.size + lifeCycleFilter.size + deassertFilter.size + sourceFilter.size + bindingFilter.size;
  const clearAllFilters = () => {
    setCategoryFilter(new Set()); setSeverityFilter(new Set()); setEventTypeFilter(new Set());
    setLifeCycleFilter(new Set()); setDeassertFilter(new Set()); setSourceFilter(new Set()); setBindingFilter(new Set());
  };

  // ── 分页：换搜索/筛选条件时回到第 1 页 ──
  useEffect(() => { setPage(1); }, [search, categoryFilter, severityFilter, eventTypeFilter, lifeCycleFilter, deassertFilter, sourceFilter, bindingFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(pageRaw, totalPages);
  const pagedRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedDef = selectedKey ? defs.find((d) => d.EventKeyId === selectedKey) ?? null : null;
  const selectedDesc = useMemo(() => {
    if (!selectedKey) return null;
    const base = descByKey.get(selectedKey);
    const patch = descOverrides[selectedKey];
    if (!base && !patch) return null;
    return { EventKeyId: selectedKey, ...base, ...patch } as EventDescEntry;
  }, [selectedKey, descByKey, descOverrides]);
  const selectedBindings = selectedKey ? bindingsByKey.get(selectedKey) ?? [] : [];
  const selectedEdited = selectedKey ? (!!overrides[selectedKey] || !!descOverrides[selectedKey]) : false;
  const selectedIsCustom = selectedKey ? customKeySet.has(selectedKey) : false;

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
  const handleUpdateBinding = (objectId: string, patch: Record<string, unknown>) => {
    if (!csr) return;
    const cur = csrObj[objectId] as Record<string, unknown> | undefined;
    if (!cur) return;
    onChange({ ...csr, Objects: { ...csrObj, [objectId]: { ...cur, ...patch } } });
  };
  const handleDeleteBinding = (objectId: string) => {
    if (!csr) return;
    const next = { ...csrObj };
    delete next[objectId];
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
      {/* ── 主区：事件模板表格（表头即筛选器）── */}
      {/* 大屏下内容居中定宽，避免为了扫一行数据而来回转头 */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ width: '100%', maxWidth: 1180, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 4px 10px' }}>
            <h1 style={{ font: 'var(--text-title-1)', color: 'var(--foreground)', margin: 0 }}>事件管理</h1>
          </div>

          <div style={{
            padding: '0 4px 10px', borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <button
              onClick={handleAddDef}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, border: 'none',
                cursor: 'pointer', fontSize: 11.5, fontWeight: 600, fontFamily: 'inherit',
                background: 'var(--primary)', color: 'var(--primary-foreground)',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              新建事件模板
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    padding: '5px 12px', borderRadius: 999, fontSize: 11, cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                    background: 'color-mix(in srgb, var(--primary) 16%, transparent)', color: 'var(--primary)',
                  }}
                >
                  清除全部筛选（{activeFilterCount}）
                </button>
              )}
              <input
                type="text"
                placeholder="搜索 EventKeyId / 名称 / 编码"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...fieldInputStyle(false), width: 260 }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {/* table-layout: fixed + 每列定宽，避免「事件」列被拉伸导致后面列隔得很远 */}
            <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  position: 'sticky', top: 0, background: 'var(--surface-1)', zIndex: 1, textAlign: 'left',
                  color: 'var(--foreground-muted)', font: 'var(--text-label)',
                }}>
                  {/* 列顺序按扫读优先级排列：身份 → 级别/绑定状态（最需要一眼看到）→ 分类归属 → 技术细节字段（靠后，低频查看） */}
                  <th style={{ padding: '8px 10px', fontWeight: 500, width: 300 }}>事件（EventKeyId / EventName）</th>
                  <FilterTh label="级别" options={severityOptions} selected={severityFilter} onChange={setSeverityFilter} width={70} />
                  <FilterTh label="CSR 绑定" options={bindingOptions} selected={bindingFilter} onChange={setBindingFilter} width={90} />
                  <FilterTh label="分类" options={categoryOptions} selected={categoryFilter} onChange={setCategoryFilter} width={100} />
                  <FilterTh label="来源" options={sourceOptions} selected={sourceFilter} onChange={setSourceFilter} width={80} />
                  <th style={{ padding: '8px 10px', fontWeight: 500, width: 110 }}>EventCode</th>
                  <FilterTh label="去抖" options={deassertOptions} selected={deassertFilter} onChange={setDeassertFilter} width={70} />
                  <FilterTh label="EventType" options={eventTypeOptions} selected={eventTypeFilter} onChange={setEventTypeFilter} width={90} />
                  <FilterTh label="LifeCycleId" options={lifeCycleOptions} selected={lifeCycleFilter} onChange={setLifeCycleFilter} width={100} />
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((d) => {
                  const boundCount = bindingsByKey.get(d.EventKeyId)?.length ?? 0;
                  const sev = severityMeta(d.SeverityId);
                  const isStandard = sourceTag(d) === 'standard';
                  const isSelected = selectedKey === d.EventKeyId;
                  const isCustom = customKeySet.has(d.EventKeyId);
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
                        padding: '7px 10px', overflow: 'hidden',
                        borderLeft: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                      }}>
                        <div
                          title={d.EventKeyId}
                          style={{
                            fontFamily: 'var(--font-mono)', color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}
                        >
                          {d.EventKeyId}
                          {isCustom && <span title="本页新建的自定义事件模板" style={{ marginLeft: 6, color: 'var(--accent)' }}>●</span>}
                          {overrides[d.EventKeyId] && <span title="已本地编辑" style={{ marginLeft: 4, color: 'var(--warning)' }}>●</span>}
                        </div>
                        <div style={{ color: 'var(--foreground-muted)', fontSize: 10.5, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.EventName}</div>
                      </td>
                      <td style={{ padding: '7px 10px' }}><Badge text={sev.label} tone={sev.tone} /></td>
                      <td style={{ padding: '7px 10px' }}>
                        <Badge text={String(boundCount)} tone={boundCount > 0 ? 'var(--success)' : 'var(--foreground-muted)'} />
                      </td>
                      <td style={{ padding: '7px 10px', color: 'var(--foreground-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{categoryOf(d.EventKeyId)}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <Badge text={isStandard ? '标准' : '扩展'} tone={isStandard ? 'var(--primary)' : 'var(--accent)'} />
                      </td>
                      <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--foreground-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.EventCode}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <Badge text={d.DeassertFlag === 1 ? '是' : '否'} tone={d.DeassertFlag === 1 ? 'var(--success)' : 'var(--foreground-muted)'} />
                      </td>
                      <td style={{ padding: '7px 10px', color: 'var(--foreground-muted)', fontFamily: 'var(--font-mono)' }}>{d.EventType ?? 0}</td>
                      <td style={{ padding: '7px 10px', color: 'var(--foreground-muted)', fontFamily: 'var(--font-mono)' }}>{d.LifeCycleId ?? 0}</td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} style={{ padding: 24, textAlign: 'center', color: 'var(--foreground-muted)' }}>无匹配的事件定义</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 条数统计 + 分页放在一起，置底 */}
          <div style={{
            padding: '10px 4px', borderTop: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
          }}>
            <span style={{ color: 'var(--foreground-muted)', fontSize: 11 }}>共 {filtered.length} / {defs.length} 条</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
              <PageBtn title="第一页" disabled={page <= 1} onClick={() => setPage(1)}>«</PageBtn>
              <PageBtn title="上一页" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</PageBtn>
              <span style={{ fontSize: 11, color: 'var(--foreground-secondary)', padding: '0 6px', whiteSpace: 'nowrap' }}>第 {page} / {totalPages} 页</span>
              <PageBtn title="下一页" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>›</PageBtn>
              <PageBtn title="最后一页" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>»</PageBtn>
            </div>
          </div>
        </div>
      </main>

      {/* ── 右：配置详情（选中事件才打开，关闭即清除选中）── */}
      {selectedDef && (
        <aside style={{ width: 380, flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', overflowY: 'auto', padding: 18, position: 'relative' }}>
          <button
            onClick={() => setSelectedKey(null)}
            title="关闭"
            style={{
              position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: 6, border: 'none',
              background: 'var(--state-hover)', color: 'var(--foreground-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <CloseIcon />
          </button>
          <EventDetail
            def={selectedDef}
            desc={selectedDesc}
            bindings={selectedBindings}
            lang={descLang}
            onLangChange={setDescLang}
            csrLoaded={!!csr}
            edited={selectedEdited}
            isCustom={selectedIsCustom}
            onFieldChange={(patch) => updateDef(selectedDef.EventKeyId, patch)}
            onDescFieldChange={(field, lang, value) => updateDescField(selectedDef.EventKeyId, field, lang, value)}
            onReset={() => resetKey(selectedDef.EventKeyId)}
            onRename={(newKey) => renameCustomDef(selectedDef.EventKeyId, newKey)}
            onDeleteDef={() => deleteCustomDef(selectedDef.EventKeyId)}
            onAddBinding={handleAddBinding}
            onUpdateBinding={handleUpdateBinding}
            onDeleteBinding={handleDeleteBinding}
          />
        </aside>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  );
}

function EventDetail({
  def, desc, bindings, lang, onLangChange, csrLoaded, edited, isCustom,
  onFieldChange, onDescFieldChange, onReset, onRename, onDeleteDef,
  onAddBinding, onUpdateBinding, onDeleteBinding,
}: {
  def: EventDefEntry;
  desc: EventDescEntry | null;
  bindings: CsrBinding[];
  lang: 'Zh' | 'En';
  onLangChange: (l: 'Zh' | 'En') => void;
  csrLoaded: boolean;
  edited: boolean;
  isCustom: boolean;
  onFieldChange: (patch: Partial<EventDefEntry>) => void;
  onDescFieldChange: (field: 'Description' | 'Cause' | 'Influence' | 'Suggestion', lang: 'Zh' | 'En', value: string) => void;
  onReset: () => void;
  onRename: (newKey: string) => void;
  onDeleteDef: () => void;
  onAddBinding: () => void;
  onUpdateBinding: (objectId: string, patch: Record<string, unknown>) => void;
  onDeleteBinding: (objectId: string) => void;
}) {
  const isStandard = sourceTag(def) === 'standard';
  const description = desc?.Description?.[lang] ?? '';
  const cause = desc?.Cause?.[lang] ?? '';
  const influence = desc?.Influence?.[lang] ?? '';
  const suggestion = desc?.Suggestion?.[lang] ?? '';
  const placeholders = extractPlaceholders(desc?.Description?.Zh ?? desc?.Description?.En);
  const num = (v: unknown) => (v === undefined || v === null || v === '' ? 0 : Number(v) || 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ font: 'var(--text-title-2)', fontFamily: 'var(--font-mono)', color: 'var(--foreground)', wordBreak: 'break-all' }}>{def.EventKeyId}</span>
          {isCustom && <Badge text="自定义" tone="var(--accent)" />}
        </div>
        {edited && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <Badge text="已编排" tone="var(--warning)" />
            <button onClick={onReset} style={{ background: 'none', border: 'none', color: 'var(--foreground-muted)', fontSize: 11, cursor: 'pointer', padding: 0 }}>
              还原
            </button>
          </div>
        )}
      </div>

      {isCustom && (
        <div style={{ marginTop: 10 }}>
          <EditField label="EventKeyId（分类.名称，如 Custom.MyEvent）" mono value={def.EventKeyId} onChange={onRename} />
        </div>
      )}

      <div style={{ marginTop: 10, marginBottom: 14 }}>
        <EditField
          label="事件名称 EventName" value={def.EventName ?? ''} onChange={(v) => onFieldChange({ EventName: v })}
          tip="该事件在 BMC 事件字典中的短名称，通常与 EventKeyId 最后一段一致。"
        />
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <MiniField label="级别 Severity" tip="事件的严重程度分级：提示 / 一般 / 重要 / 紧急，决定告警展示的紧急程度。">
          <SeveritySelect value={def.SeverityId} onChange={(v) => onFieldChange({ SeverityId: v })} />
        </MiniField>
        <MiniField label="来源 Source" tip="该事件是否属于官方标准事件字典。可点击手动切换本地归类标记，不影响标准字典本身。">
          <SourceToggle isStandard={isStandard} onChange={(std) => onFieldChange({ SourceOverride: std ? 'standard' : 'extra' })} />
        </MiniField>
        <MiniField label="去抖 DeassertFlag" tip="是否支持去抖（deassert）：开启后，触发条件解除时会自动上报一次“已恢复”事件。">
          <ToggleChip
            label={def.DeassertFlag === 1 ? '是' : '否'}
            checked={def.DeassertFlag === 1}
            onChange={(v) => onFieldChange({ DeassertFlag: v ? 1 : 0 })}
          />
        </MiniField>
      </div>

      <div style={SECTION_WRAP_STYLE}>
        <label style={{ ...SECTION_LABEL_STYLE, marginBottom: 10 }}>基础字段</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 4 }}>
          <EditField
            label="事件编码 EventCode" mono value={def.EventCode ?? ''} onChange={(v) => onFieldChange({ EventCode: v })}
            tip="该事件在字典中的十六进制唯一编码，例如 0x0200001F，用于标识事件条目本身。"
          />
          <EditField
            label="旧版事件编码 OldEventCode" mono value={def.OldEventCode ?? ''} onChange={(v) => onFieldChange({ OldEventCode: v })}
            tip="该事件在旧版编码规则下对应的编码，用于跨版本兼容映射；没有对应关系时留空。"
          />
          <EditField
            label="上报通道 ReportChannel" type="number" value={String(def.ReportChannel ?? 0)} onChange={(v) => onFieldChange({ ReportChannel: num(v) })}
            tip="事件上报的目标通道位掩码。65535（0xFFFF）表示全部通道均上报。"
          />
          <EditField
            label="事件类型 EventType" type="number" value={String(def.EventType ?? 0)} onChange={(v) => onFieldChange({ EventType: num(v) })}
            tip="事件的类型编号，具体分类由 BMC 固件事件类型表定义，当前字典里常见取值为 0、1。"
          />
          <EditField
            label="生命周期标识 LifeCycleId" type="number" value={String(def.LifeCycleId ?? 0)} onChange={(v) => onFieldChange({ LifeCycleId: num(v) })}
            tip="标识事件在其生命周期中所处的阶段/类别编号，具体取值由 BMC 固件生命周期定义决定。"
          />
          <EditField
            label="动作标识 ActionId" type="number" value={String(def.ActionId ?? 0)} onChange={(v) => onFieldChange({ ActionId: num(v) })}
            tip="事件触发后关联执行的动作编号；当前字典中所有事件均为 0，即暂未启用动作关联。"
          />
        </div>
        {def.ReportChannel === 65535 && (
          <div style={{ ...HINT_STYLE, marginTop: 2 }}>65535 = 全通道上报</div>
        )}
      </div>

      <div style={SECTION_WRAP_STYLE}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={SECTION_LABEL_STYLE}>描述模板</label>
          <div style={{ display: 'inline-flex', gap: 2, padding: 3, borderRadius: 8, background: 'var(--surface-disabled)' }}>
            {(['Zh', 'En'] as const).map((l) => (
              <button key={l} onClick={() => onLangChange(l)} style={chipBtnStyle(lang === l)}>
                {l === 'Zh' ? '中' : 'EN'}
              </button>
            ))}
          </div>
        </div>
        <EditTextarea label="Description" value={description} onChange={(v) => onDescFieldChange('Description', lang, v)} rows={2} />
        {placeholders.length > 0 && (
          <div style={{ ...HINT_STYLE, marginTop: 6 }}>
            占位符 {placeholders.map((n) => `%${n}`).join(' ')} 依次取值于 CSR 侧该事件绑定的 Component / DescArg1~5 字段
          </div>
        )}
        <div style={{ marginTop: 10 }}>
          <EditTextarea label="可能原因 Cause" value={cause} onChange={(v) => onDescFieldChange('Cause', lang, v)} hint="多条原因用 @#AB; 分隔" />
        </div>
        <div style={{ marginTop: 10 }}>
          <EditTextarea label="影响 Influence" value={influence} onChange={(v) => onDescFieldChange('Influence', lang, v)} />
        </div>
        <div style={{ marginTop: 10 }}>
          <EditTextarea label="处理建议 Suggestion" value={suggestion} onChange={(v) => onDescFieldChange('Suggestion', lang, v)} hint="多条建议用 @#AB; 分隔" />
        </div>
      </div>

      <div style={SECTION_WRAP_STYLE}>
        <label style={{ ...SECTION_LABEL_STYLE, marginBottom: 10 }}>CSR 绑定（{bindings.length}）</label>
        {bindings.length === 0 ? (
          <div style={{ color: 'var(--foreground-muted)', marginBottom: 8 }}>当前 CSR 中暂无 Event_* 对象绑定此事件</div>
        ) : (
          <div style={{ marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {bindings.map((b) => (
              <BindingRow
                key={b.objectId}
                binding={b}
                onUpdate={(patch) => onUpdateBinding(b.objectId, patch)}
                onDelete={() => onDeleteBinding(b.objectId)}
              />
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

      {isCustom && (
        <div style={{ marginTop: 18, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
          <button
            onClick={onDeleteDef}
            style={{
              width: '100%', padding: '8px 0', borderRadius: 8, border: 'none', fontSize: 12, fontFamily: 'inherit', fontWeight: 600,
              background: 'color-mix(in srgb, var(--danger) 14%, transparent)', color: 'var(--danger)', cursor: 'pointer',
            }}
          >
            删除该自定义事件模板
          </button>
        </div>
      )}
    </div>
  );
}

/** CSR 绑定行：字段与「硬件适配」独立事件弹窗一致（归属 FRU / 触发值 / 方向 / 启用），两处编排同一份数据 */
function BindingRow({ binding, onUpdate, onDelete }: {
  binding: CsrBinding;
  onUpdate: (patch: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ padding: '8px 10px', background: 'var(--surface-1)', borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--foreground)', fontSize: 11.5 }}>{binding.objectId}</div>
        <button
          onClick={onDelete}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          title="删除该绑定"
          style={{
            width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, border: 'none',
            cursor: 'pointer', background: hover ? 'color-mix(in srgb, var(--danger) 16%, transparent)' : 'transparent',
            color: hover ? 'var(--danger)' : 'var(--foreground-muted)',
          }}
        >
          <TrashIcon />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <EditField label="归属 FRU（Component）" mono value={String(binding.Component ?? '')} onChange={(v) => onUpdate({ Component: v })} />
        <EditField label="触发值（Condition）" type="number" value={String(binding.Condition ?? 0)} onChange={(v) => onUpdate({ Condition: Number(v) || 0 })} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={LABEL_STYLE}>方向（OperatorId）</label>
          <select
            value={Number(binding.OperatorId ?? 5)}
            onChange={(e) => onUpdate({ OperatorId: Number(e.target.value) })}
            style={{ ...fieldInputStyle(false), cursor: 'pointer' }}
          >
            {OPERATOR_LABELS.map((o) => (
              <option key={o.id} value={o.id}>{o.symbol} {o.label}</option>
            ))}
          </select>
        </div>
        <ToggleChip label="启用" checked={binding.Enabled !== false} onChange={(v) => onUpdate({ Enabled: v })} />
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
      title="点击切换严重级别"
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

/** 标准字典 / 字典外新增 —— 可点击手动重分类（不影响标准字典本身，仅本地标记） */
function SourceToggle({ isStandard, onChange }: { isStandard: boolean; onChange: (std: boolean) => void }) {
  const [hover, setHover] = useState(false);
  const tone = isStandard ? 'var(--primary)' : 'var(--accent)';
  return (
    <button
      onClick={() => onChange(!isStandard)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="点击切换「标准字典 / 字典外新增」归类标记（本地标记，不改变官方字典本身）"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 999,
        fontSize: 11, fontWeight: 500, fontFamily: 'inherit', border: 'none', cursor: 'pointer',
        color: tone, background: `color-mix(in srgb, ${tone} ${hover ? 26 : 16}%, transparent)`,
        boxShadow: hover ? `0 0 0 1px ${tone} inset` : 'none',
      }}
    >
      {isStandard ? '标准字典' : '字典外新增'}
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M8 7l8 5-8 5" /></svg>
    </button>
  );
}

function ToggleChip({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const [hover, setHover] = useState(false);
  const tone = checked ? 'var(--success)' : 'var(--foreground-muted)';
  return (
    <button
      onClick={() => onChange(!checked)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="点击切换"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px 3px 8px', borderRadius: 999,
        fontSize: 11, fontFamily: 'inherit', border: 'none', cursor: 'pointer',
        background: checked ? `color-mix(in srgb, var(--success) ${hover ? 26 : 16}%, transparent)` : (hover ? 'var(--state-hover)' : 'var(--surface-disabled)'),
        color: tone,
        boxShadow: hover ? `0 0 0 1px ${tone} inset` : 'none',
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
