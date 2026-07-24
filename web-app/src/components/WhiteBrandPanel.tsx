import React, { useState, useRef, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
type Mode = 'brand' | 'clear';

interface ImageField { key: string; label: string; name: string; }
interface ConfigField {
  key: string; label: string; type: 'text' | 'select';
  placeholder?: string; options?: { value: string; label: string }[];
}
interface ImgState { path?: string; preview?: string; clear?: boolean; }
type ImageMap = Record<string, ImgState>;
type ConfigMap = Record<string, string>;

// ── Static data ────────────────────────────────────────────────────────────
const IMAGE_FIELDS: ImageField[] = [
  { key: 'favicon',     label: '网站图标',  name: 'favicon.ico' },
  { key: 'login_logo',  label: '登录 Logo', name: 'login_logo.png' },
  { key: 'header_logo', label: '头部 Logo', name: 'header_logo.png' },
  { key: 'login_bg',    label: '登录背景',  name: 'login_bg.jpg' },
  { key: 'img_01',      label: '图片 01',   name: 'img_01.png' },
  { key: 'img_02',      label: '图片 02',   name: 'img_02.png' },
  { key: 'img_03',      label: '图片 03',   name: 'img_03.png' },
  { key: 'code1',       label: '二维码',    name: 'code1.png' },
];

const PATH_GROUPS = [
  { title: 'Web UI 标识', path: '/usr/share/bmcweb/static/', keys: ['favicon'] },
  { title: '登录界面',    path: '/bmcweb/static/login/',     keys: ['login_logo', 'login_bg'] },
  { title: '主界面资源',  path: '/bmcweb/static/images/',    keys: ['header_logo', 'img_01', 'img_02', 'img_03', 'code1'] },
];

const CONFIG_FIELDS: ConfigField[] = [
  { key: 'manufacturer',  label: '制造商',      type: 'text',   placeholder: 'My Corp' },
  { key: 'product_name',  label: '产品名称',    type: 'text',   placeholder: 'BMC Platform' },
  { key: 'model',         label: '型号',        type: 'text',   placeholder: 'BMC-1000' },
  { key: 'sw_version',    label: '软件版本',    type: 'text',   placeholder: '1.0.0' },
  { key: 'copyright',     label: '版权信息',    type: 'text',   placeholder: '© 2025 My Corp' },
  { key: 'support_email', label: '技术支持',    type: 'text',   placeholder: 'support@corp.com' },
  { key: 'support_url',   label: '支持链接',    type: 'text',   placeholder: 'https://support.corp.com' },
  { key: 'language',      label: '默认语言',    type: 'select',
    options: [{ value: 'zh_CN', label: '简体中文' }, { value: 'en_US', label: 'English' }] },
  { key: 'theme',         label: '界面主题',    type: 'select',
    options: [{ value: 'dark', label: '深色' }, { value: 'light', label: '浅色' }] },
  { key: 'timeout',       label: '会话超时 (s)', type: 'text',  placeholder: '1800' },
  { key: 'max_sessions',  label: '最大会话数',  type: 'text',   placeholder: '10' },
  { key: 'banner_text',   label: '登录提示语',  type: 'text',   placeholder: '未经授权的访问是被禁止的' },
];

// ── PTO token constants ────────────────────────────────────────────────────
const C = {
  bg:      '#101010' as const,
  s1:      '#161616' as const,
  s2:      'rgba(255,255,255,.06)' as const,
  s2h:     'rgba(255,255,255,.10)' as const,
  s2hh:    'rgba(255,255,255,.13)' as const,
  t90:     'rgba(255,255,255,.90)' as const,
  t60:     'rgba(255,255,255,.60)' as const,
  t42:     'rgba(255,255,255,.42)' as const,
  t40:     'rgba(255,255,255,.40)' as const,
  t30:     'rgba(255,255,255,.30)' as const,
  t28:     'rgba(255,255,255,.28)' as const,
  border:  'rgba(255,255,255,.06)' as const,
  border7: 'rgba(255,255,255,.07)' as const,
  primary: '#4369ef' as const,
  prim14:  'rgba(67,105,239,.14)' as const,
  prim55:  'rgba(67,105,239,.55)' as const,
  amber:   'rgba(251,191,36,1)' as const,
  amberBg: 'rgba(251,191,36,.06)' as const,
};

// ── Shared input style (fill-only, no border — matches SigningConfigPanel) ──
function useFieldStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '7px 10px', borderRadius: 6,
    fontFamily: 'inherit', fontSize: 12,
    background: focused ? C.s2h : C.s2,
    border: 'none', outline: 'none',
    color: C.t90, boxSizing: 'border-box',
    // Strip native select appearance so custom wrapper arrow shows correctly
    appearance: 'none', WebkitAppearance: 'none',
  };
}

// ── Shared micro-components ────────────────────────────────────────────────

function SectionTitle({ label, id, tip }: { label: string; id: string; tip?: string }) {
  return (
    <div id={id} title={tip} style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
      textTransform: 'uppercase', color: 'rgba(255,255,255,.30)',
      display: 'flex', alignItems: 'center', gap: 10,
      marginTop: 24, marginBottom: 10, scrollMarginTop: 12,
    }}>
      {label}
      <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
    </div>
  );
}

// Segmented control — matches SigningConfig method selector
function SegmentedControl({ options, value, onChange }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{
      display: 'inline-flex', background: C.s2, borderRadius: 7, padding: 2,
    }}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            padding: '6px 16px', border: 'none', borderRadius: 5, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12,
            background: active ? C.s2hh : 'transparent',
            color: active ? C.t90 : C.t42,
            fontWeight: active ? 600 : 400,
            transition: 'background .12s, color .12s',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

// Small action chip button
function ChipBtn({ children, onClick, primary, danger, disabled }: {
  children: React.ReactNode; onClick: () => void;
  primary?: boolean; danger?: boolean; disabled?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '4px 10px', borderRadius: 6, border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 11, fontFamily: 'inherit', fontWeight: 500,
        background: primary
          ? (hover ? 'rgba(67,105,239,.28)' : 'rgba(67,105,239,.18)')
          : danger
            ? (hover ? 'rgba(255,80,80,.18)' : 'rgba(255,80,80,.10)')
            : (hover ? C.s2h : C.s2),
        color: primary ? C.primary : danger ? 'rgba(255,80,80,.75)' : C.t60,
        transition: 'background .12s',
        opacity: disabled ? 0.4 : 1,
      }}
    >{children}</button>
  );
}

// ── Version input field ─────────────────────────────────────────────────────
function VersionInput({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');

  function validate(v: string) {
    if (!v.trim()) { setError('请输入版本号'); return; }
    if (!/^\d+\.\d{1,2}$/.test(v)) { setError('格式 x.y，y 最多两位'); return; }
    setError('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontSize: 11, color: C.t42, fontFamily: 'ui-monospace,monospace' }}>{label}</span>
      <div>
        <input
          value={value}
          placeholder="如 2.00、2.10"
          onChange={e => { onChange(e.target.value); validate(e.target.value); }}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); validate(value); }}
          style={{
            ...useFieldStyle(focused),
            fontFamily: 'ui-monospace,monospace',
            borderColor: error ? 'rgba(255,80,80,.55)' : focused ? C.prim55 : C.border7,
          }}
        />
        {error && <div style={{ fontSize: 11, color: 'rgba(255,80,80,.80)', marginTop: 3 }}>{error}</div>}
      </div>
    </div>
  );
}

// ── Image card (grid card for brand mode, compact row for clear mode) ─────────
function ImageCard({ field, state, mode, onSelect, onClear, onToggleClear }: {
  field: ImageField; state: ImgState; mode: Mode;
  onSelect: (key: string) => void;
  onClear: (key: string) => void;
  onToggleClear: (key: string, v: boolean) => void;
}) {
  const [hover, setHover] = useState(false);
  const cleared = !!state.clear;
  const hasPath = !!state.path;

  if (mode === 'clear') {
    return (
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
          borderBottom: '1px solid rgba(255,255,255,.04)',
          background: hover ? 'rgba(255,255,255,.025)' : 'transparent', transition: 'background .1s',
        }}>
        {/* Thumbnail */}
        <div style={{ width: 40, height: 28, flexShrink: 0, borderRadius: 3, overflow: 'hidden',
          background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {state.preview
            ? <img src={state.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="21 15 16 10 5 21"/>
              </svg>
          }
        </div>
        {/* Label */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: C.t90, opacity: cleared ? 0.4 : 1 }}>{field.label}</div>
          <div style={{ fontSize: 11, color: C.t28, fontFamily: 'ui-monospace,monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{field.name}</div>
        </div>
        {/* Actions — delete (only when custom file exists) + restore-default toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          {hasPath && (
            <button onClick={() => onClear(field.key)} title="删除已上传的自定义图片" style={{
              width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', borderRadius: 5, cursor: 'pointer',
              background: 'transparent', color: 'rgba(255,80,80,.40)',
              transition: 'background .1s, color .1s',
            }}
              onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,80,80,.10)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,.80)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,.40)'; }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          )}
          <button onClick={() => onToggleClear(field.key, !cleared)} style={{
            padding: '3px 9px', borderRadius: 5, border: 'none', cursor: 'pointer',
            fontSize: 11, fontFamily: 'inherit', whiteSpace: 'nowrap',
            background: cleared ? C.amberBg : C.s2,
            color: cleared ? C.amber : C.t42,
            transition: 'background .1s, color .1s',
          }}>
            {cleared ? '已标记' : '恢复默认'}
          </button>
        </div>
      </div>
    );
  }

  // Brand mode: card with large preview
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 8, overflow: 'hidden',
        background: hover ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.04)',
        border: '1px solid rgba(255,255,255,.07)', transition: 'background .1s',
      }}>
      {/* Preview area */}
      <div style={{
        width: '100%', aspectRatio: '16/9',
        background: state.preview ? 'rgba(0,0,0,.30)' : 'rgba(255,255,255,.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {state.preview
          ? <img src={state.preview} alt={field.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
        }
      </div>
      {/* Info + actions */}
      <div style={{ padding: '8px 10px 10px' }}>
        <div style={{ fontSize: 12, color: C.t90, fontWeight: 500, marginBottom: 2 }}>{field.label}</div>
        <div style={{ fontSize: 11, color: C.t28, fontFamily: 'ui-monospace,monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 8 }}>
          {hasPath ? state.path : field.name}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <ChipBtn onClick={() => onSelect(field.key)}>{hasPath ? '更换' : '选择'}</ChipBtn>
          {hasPath && <ChipBtn onClick={() => onClear(field.key)} danger>删除</ChipBtn>}
        </div>
      </div>
    </div>
  );
}

// ── Config field ────────────────────────────────────────────────────────────
function CfgField({ field, value, onChange }: {
  field: ConfigField; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const inputStyle = useFieldStyle(focused);
  return (
    <div style={{ paddingTop: 10 }}>
      <div style={{ fontSize: 12, color: C.t60, marginBottom: 5 }}>{field.label}</div>
      {field.type === 'select' ? (
        <div style={{ position: 'relative' }}>
          <select value={value} onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ ...inputStyle, paddingRight: 28, cursor: 'pointer' }}
          >
            <option value="">请选择</option>
            {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
            style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)',
              color: C.t42, pointerEvents: 'none', flexShrink: 0 }}>
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>
      ) : (
        <input type="text" value={value} placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={inputStyle}
        />
      )}
    </div>
  );
}

// ── Collapsible card section ───────────────────────────────────────────────
function CollapsibleCard({ title, tip, defaultOpen = true, children }: {
  title: string; tip?: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      marginBottom: 10, borderRadius: 10, overflow: 'hidden',
      border: `1px solid ${C.border7}`, background: 'rgba(255,255,255,.025)',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        title={tip}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 4,
          padding: '10px 14px',
          borderTop: 'none', borderLeft: 'none', borderRight: 'none',
          borderBottom: open ? `1px solid ${C.border}` : 'none',
          background: 'transparent',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: C.t90 }}>{title}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
          style={{
            color: C.t30, flexShrink: 0,
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform .2s',
          }}>
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>
      {open && <div style={{ padding: '14px 14px 16px' }}>{children}</div>}
    </div>
  );
}

// ── Clear-mode group container ─────────────────────────────────────────────
function ClearGroup({ grp, images, onSelect, onClear, onToggleClear, onGroupToggle }: {
  grp: typeof PATH_GROUPS[0];
  images: ImageMap;
  onSelect: (k: string) => void;
  onClear: (k: string) => void;
  onToggleClear: (k: string, v: boolean) => void;
  onGroupToggle: (keys: string[], v: boolean) => void;
}) {
  const allClear = grp.keys.every(k => images[k]?.clear);
  const someClear = grp.keys.some(k => images[k]?.clear);
  const cbRef = useRef<HTMLInputElement>(null);
  if (cbRef.current) cbRef.current.indeterminate = !allClear && someClear;

  return (
    <div style={{
      padding: '10px 12px', borderRadius: 6,
      background: 'rgba(255,255,255,.03)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 8, paddingBottom: 8,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.t90 }}>{grp.title}</span>
        <span style={{ fontSize: 11, color: C.t28, fontFamily: 'ui-monospace,monospace', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {grp.path}
        </span>
        <button onClick={() => onGroupToggle(grp.keys, !allClear)} style={{
          padding: '3px 9px', borderRadius: 5, border: 'none', cursor: 'pointer',
          fontSize: 11, fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
          background: allClear ? C.amberBg : C.s2,
          color: allClear ? C.amber : C.t42,
          transition: 'background .1s, color .1s',
        }}>
          {allClear ? '已全选' : someClear ? '全部恢复' : '恢复全部默认'}
        </button>
      </div>
      <div>
        {grp.keys.map(k => {
          const f = IMAGE_FIELDS.find(x => x.key === k)!;
          return (
            <ImageCard key={k} field={f} state={images[k] ?? {}} mode="clear"
              onSelect={onSelect} onClear={onClear} onToggleClear={onToggleClear} />
          );
        })}
      </div>
    </div>
  );
}

// ── Main panel component ───────────────────────────────────────────────────
export function WhiteBrandPanel() {
  const [mode, setMode] = useState<Mode>('brand');
  const [filelistVersion, setFilelistVersion] = useState('2.00');
  const [xmlVersion, setXmlVersion] = useState('2.00');
  const [pageStyle, setPageStyle] = useState('dark');
  const [images, setImages] = useState<ImageMap>({});
  const [config, setConfig] = useState<ConfigMap>({});
  const [dirty, setDirty] = useState(false);
  const [building, setBuilding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingKeyRef = useRef<string | null>(null);

  const mark = useCallback(() => setDirty(true), []);

  // ── Image ops ──────────────────────────────────────────────────────────
  function handleSelectImage(key: string) {
    pendingKeyRef.current = key;
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const key = pendingKeyRef.current;
    if (!file || !key) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImages(prev => ({ ...prev, [key]: { path: file.name, preview: reader.result as string } }));
      mark();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleClearImage(key: string) {
    setImages(prev => { const n = { ...prev }; delete n[key]; return n; });
    mark();
  }

  function handleToggleClear(key: string, v: boolean) {
    setImages(prev => ({ ...prev, [key]: { ...prev[key], clear: v } }));
    mark();
  }

  function handleGroupToggle(keys: string[], v: boolean) {
    setImages(prev => {
      const n = { ...prev };
      for (const k of keys) n[k] = { ...n[k], clear: v };
      return n;
    });
    mark();
  }

  // ── Footer actions ─────────────────────────────────────────────────────
  function handleCancel() {
    setImages({}); setConfig({});
    setFilelistVersion('2.00'); setXmlVersion('2.00');
    setPageStyle('dark'); setMode('brand');
    setDirty(false);
  }

  function handleSave() { setDirty(false); }

  function handleBuild() {
    if (building) return;
    setBuilding(true);
    setTimeout(() => setBuilding(false), 2000);
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--background,#101010)',
      fontFamily: 'var(--font-sans,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif)',
      fontSize: 13, color: C.t90,
    }}>
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        height: 44, padding: '0 20px', flexShrink: 0,
        borderBottom: `1px solid ${C.border7}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.t90 }}>白牌定制</span>
      </div>

      {/* Main scroll area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 80px' }}>

        {/* ── 模式 ── */}
        <CollapsibleCard title="模式" tip="白牌包：定制图片/风格/配置；清白牌包：把已定制的内容恢复为默认">
          <SegmentedControl
            options={[{ value: 'brand', label: '白牌包' }, { value: 'clear', label: '清白牌包' }]}
            value={mode}
            onChange={v => { setMode(v as Mode); mark(); }}
          />
        </CollapsibleCard>

        {/* ── 版本号 ── */}
        <CollapsibleCard title="版本号">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <VersionInput label="filelist.conf" value={filelistVersion} onChange={v => { setFilelistVersion(v); mark(); }} />
            <VersionInput label="web_custom.xml" value={xmlVersion} onChange={v => { setXmlVersion(v); mark(); }} />
          </div>
        </CollapsibleCard>

        {/* ── 风格定制 (brand only) ── */}
        {mode === 'brand' && (
          <CollapsibleCard title="风格定制">
            <SegmentedControl
              options={[{ value: 'dark', label: '深色' }, { value: 'light', label: '浅色' }, { value: 'auto', label: '跟随系统' }]}
              value={pageStyle}
              onChange={v => { setPageStyle(v); mark(); }}
            />
          </CollapsibleCard>
        )}

        {/* ── 图片定制 ── */}
        <CollapsibleCard
          title="图片定制"
          tip={mode === 'clear' ? '按 BMC 路径分组，勾选恢复默认会让该路径下所有图恢复默认' : '选择本地图片后显示预览，保存时图片会复制到白牌文件夹'}
        >
          {mode === 'brand' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
              {IMAGE_FIELDS.map(f => (
                <ImageCard key={f.key} field={f} state={images[f.key] ?? {}} mode="brand"
                  onSelect={handleSelectImage} onClear={handleClearImage} onToggleClear={handleToggleClear} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PATH_GROUPS.map(grp => (
                <ClearGroup key={grp.path} grp={grp} images={images}
                  onSelect={handleSelectImage} onClear={handleClearImage}
                  onToggleClear={handleToggleClear} onGroupToggle={handleGroupToggle} />
              ))}
            </div>
          )}
        </CollapsibleCard>

        {/* ── 配置定制 ── */}
        <CollapsibleCard
          title="配置定制"
          tip={mode === 'clear' ? '填入恢复后的默认值，对应 web_custom.xml 的属性' : '对应白牌包 web_custom.xml 的属性，随白牌定制统一保存'}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '0 16px' }}>
            {CONFIG_FIELDS.map(f => (
              <CfgField key={f.key} field={f} value={config[f.key] ?? ''}
                onChange={v => { setConfig(prev => ({ ...prev, [f.key]: v })); mark(); }} />
            ))}
          </div>
        </CollapsibleCard>

      </div>

      {/* ── Footer ── */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8,
        padding: '12px 20px', background: C.s1,
        borderTop: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <button disabled={!dirty} onClick={handleCancel} style={{
          padding: '7px 16px', borderRadius: 7, border: 'none',
          cursor: dirty ? 'pointer' : 'default', fontSize: 12, fontFamily: 'inherit',
          background: dirty ? C.s2h : C.s2,
          color: dirty ? C.t60 : C.t28, transition: 'background .12s',
        }}>
          取消
        </button>
        <button disabled={!dirty} onClick={handleSave} style={{
          padding: '7px 16px', borderRadius: 7, border: 'none',
          cursor: dirty ? 'pointer' : 'default', fontSize: 12,
          fontFamily: 'inherit', fontWeight: 500,
          background: dirty ? C.s2h : C.s2,
          color: dirty ? C.t60 : C.t28, transition: 'background .12s',
        }}>
          保存草稿
        </button>
        <button disabled={building} onClick={handleBuild} style={{
          padding: '7px 22px', borderRadius: 7, border: 'none',
          cursor: building ? 'default' : 'pointer', fontSize: 12,
          fontFamily: 'inherit', fontWeight: 600,
          background: building ? 'rgba(67,105,239,.50)' : C.primary,
          color: '#fff', transition: 'background .12s',
          minWidth: 128,
        }}>
          {building ? '构建中…' : mode === 'clear' ? '清白牌包构建' : '白牌包构建'}
        </button>
      </div>
    </div>
  );
}
