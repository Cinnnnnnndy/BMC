import React, { useState, useCallback } from 'react';

/* ── 签名档案类型（与 HPM 签名配置扩展 types.ts 对齐） ── */
export type SignMethod = 'self_sign' | 'server_sign' | 'signserver';

export interface SignProfile {
  id: string;
  name: string;
  method: SignMethod;
}

export interface CsrExportConfig {
  formatVersion: string;
  dataVersion: string;
  oemFile: File | null;
  spoofUids: string;
  signingProfileId: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  boardName?: string;
  signingProfiles?: SignProfile[];
  onExport?: (config: CsrExportConfig) => void;
  onBinBuild?: (config: CsrExportConfig) => void;
  onRefreshProfiles?: () => void;
  onAddProfile?: () => void;
}

/* ── 演示数据 ── */
const DEMO_PROFILES: SignProfile[] = [
  { id: 'local-1',      name: '本地签名1',     method: 'self_sign'   },
  { id: 'signserver-1', name: 'SignServer Mock', method: 'signserver'  },
  { id: 'server-1',     name: '简易服务器签名',  method: 'server_sign' },
];

const METHOD_LABEL: Record<SignMethod, string> = {
  self_sign:   '本地自签名',
  server_sign: '简易服务器',
  signserver:  'SignServer',
};

const METHOD_COLOR: Record<SignMethod, { bg: string; color: string }> = {
  self_sign:   { bg: 'rgba(4,215,147,.12)',  color: '#04d793' },
  server_sign: { bg: 'rgba(67,105,239,.14)', color: '#7b9fff' },
  signserver:  { bg: 'rgba(255,170,59,.12)', color: '#ffaa3b' },
};

const METHOD_DESC: Record<SignMethod, string> = {
  self_sign:   'rootca.der + signer.pem',
  server_sign: '远程签名服务器',
  signserver:  'CMS Worker + rootca.der',
};

/* ── Sub-components ── */
function SectionLabel({ title }: { title: string }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.07em',
      textTransform: 'uppercase', color: 'rgba(255,255,255,.30)',
      marginBottom: 8,
    }}>{title}</div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionLabel title={title} />
      <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: '10px 12px' }}>
        {children}
      </div>
    </div>
  );
}

/* ── Component ── */
export function CsrExportDialog({
  open,
  onClose,
  boardName = '当前板卡',
  signingProfiles,
  onExport,
  onBinBuild,
  onRefreshProfiles,
  onAddProfile,
}: Props) {
  const profiles = signingProfiles ?? DEMO_PROFILES;

  const [config, setConfig] = useState<CsrExportConfig>({
    formatVersion: '3.00',
    dataVersion: '3.17',
    oemFile: null,
    spoofUids: '',
    signingProfileId: null,
  });
  const [dragOver, setDragOver] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);

  const selected = config.signingProfileId
    ? profiles.find(p => p.id === config.signingProfileId) ?? null
    : null;

  const set = useCallback(<K extends keyof CsrExportConfig>(k: K, v: CsrExportConfig[K]) => {
    setConfig(c => ({ ...c, [k]: v }));
  }, []);

  function handleRefresh() {
    setRefreshSpin(true);
    onRefreshProfiles?.();
    setTimeout(() => setRefreshSpin(false), 600);
  }

  const handleExport = () => { onExport?.(config); onClose(); };
  const handleBin    = () => { onBinBuild?.(config); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) set('oemFile', file);
  };

  if (!open) return null;

  return (
    <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={s.dialog} role="dialog" aria-modal aria-label="CSR 出包配置">

        {/* Header */}
        <div style={s.header}>
          <div>
            <div style={s.title}>CSR 出包配置</div>
            <div style={s.subtitle}>{boardName}</div>
          </div>
          <button style={s.closeBtn} onClick={onClose} title="关闭">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={s.body}>

          {/* 基本信息 */}
          <SectionCard title="基本信息">
            <div style={{ marginBottom: 8 }}>
              <div style={s.fieldLabel}><span style={s.req}>* </span>FormatVersion</div>
              <input style={s.input} value={config.formatVersion}
                onChange={e => set('formatVersion', e.target.value)}
                onFocus={e => (e.target.style.background = 'rgba(255,255,255,.11)')}
                onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)')}
              />
            </div>
            <div>
              <div style={s.fieldLabel}><span style={s.req}>* </span>DataVersion</div>
              <input style={s.input} value={config.dataVersion}
                onChange={e => set('dataVersion', e.target.value)}
                onFocus={e => (e.target.style.background = 'rgba(255,255,255,.11)')}
                onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)')}
              />
            </div>
          </SectionCard>

          {/* OEM 定制消息 */}
          <SectionCard title="OEM 定制消息">
            <label
              style={{
                ...s.uploadArea,
                ...(dragOver ? s.uploadAreaHover : {}),
                ...(config.oemFile ? s.uploadAreaDone : {}),
              }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {config.oemFile ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#04d793">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span style={{ fontSize: 12, color: '#04d793', fontWeight: 600, fontFamily: 'ui-monospace,monospace' }}>
                    {config.oemFile.name}
                  </span>
                  <span style={s.uploadHint}>点击更换文件</span>
                </>
              ) : (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"
                    style={{ color: 'rgba(255,255,255,.22)' }}>
                    <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                  </svg>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.38)' }}>选择 OEM 文件</span>
                  <span style={s.uploadHint}>支持 .bin 和 .ini 格式，或拖拽至此</span>
                </>
              )}
              <input type="file" accept=".bin,.ini" style={{ display: 'none' }}
                onChange={e => set('oemFile', e.target.files?.[0] ?? null)} />
            </label>
          </SectionCard>

          {/* 伪装包 UID */}
          <SectionCard title="伪装包 UID 列表">
            <input
              style={s.input}
              placeholder="英文逗号分隔，仅支持数字和字母，如 <UID1>,<UID2>"
              value={config.spoofUids}
              onChange={e => set('spoofUids', e.target.value)}
              onFocus={e => (e.target.style.background = 'rgba(255,255,255,.11)')}
              onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)')}
            />
          </SectionCard>

          {/* 签名配置 */}
          <SectionCard title="签名配置">
            {/* 下拉 + 刷新 */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
              <select
                style={s.select}
                value={config.signingProfileId ?? ''}
                onChange={e => set('signingProfileId', e.target.value || null)}
              >
                <option value="">不使用签名</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}（{METHOD_LABEL[p.method]}）
                  </option>
                ))}
              </select>
              <button
                title="刷新签名列表"
                onClick={handleRefresh}
                style={s.iconBtn}
                onMouseOver={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.13)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.80)';
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.08)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.45)';
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"
                  style={{
                    transform: refreshSpin ? 'rotate(360deg)' : 'rotate(0deg)',
                    transition: refreshSpin ? 'transform .6s ease' : 'none',
                  }}>
                  <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </div>

            {/* 新增签名配置 */}
            <button
              onClick={() => onAddProfile?.()}
              style={s.addLink}
              onMouseOver={e => (e.currentTarget.style.color = '#4369ef')}
              onMouseOut={e => (e.currentTarget.style.color = 'rgba(67,105,239,.80)')}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 11H13V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z"/>
              </svg>
              新增签名配置
            </button>

            {/* 已选档案预览 */}
            {selected && (
              <div style={s.profilePreview}>
                <div style={{ ...s.profileIcon, background: METHOD_COLOR[selected.method].bg }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={METHOD_COLOR[selected.method].color}>
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={s.profileName}>{selected.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{
                      padding: '1px 7px', borderRadius: 4, fontSize: 11,
                      background: METHOD_COLOR[selected.method].bg,
                      color: METHOD_COLOR[selected.method].color, fontWeight: 600,
                    }}>{METHOD_LABEL[selected.method]}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,.38)' }}>
                      {METHOD_DESC[selected.method]}
                    </span>
                  </div>
                </div>
                <button style={s.editBtn}
                  onClick={() => { onClose(); }}>
                  编辑 ↗
                </button>
              </div>
            )}
          </SectionCard>

        </div>

        {/* Footer */}
        <div style={s.footer}>
          <button style={s.btnGhost} onClick={onClose}>取消</button>
          <div style={{ flex: 1 }} />
          <button style={s.btnSecondary} onClick={() => {}}>保存</button>
          <button style={s.btnSecondary} onClick={handleBin}>bin 文件构建</button>
          <button style={s.btnPrimary} onClick={handleExport}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            CSR 出包
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Styles ── */
const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    fontFamily: 'var(--font-sans,system-ui,sans-serif)',
  },
  dialog: {
    background: 'var(--surface-1,#161616)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 16,
    width: 500,
    maxHeight: '84vh',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 28px 80px rgba(0,0,0,.60)',
    color: 'rgba(255,255,255,.90)',
    fontSize: 13,
  },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: '14px 16px 12px',
    borderBottom: '1px solid rgba(255,255,255,.07)',
    flexShrink: 0,
  },
  title: { fontSize: 14, fontWeight: 700, letterSpacing: '-.01em' },
  subtitle: { fontSize: 11, color: 'rgba(255,255,255,.32)', marginTop: 2 },
  closeBtn: {
    width: 26, height: 26, borderRadius: 6,
    background: 'rgba(255,255,255,.06)', border: 'none',
    color: 'rgba(255,255,255,.45)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1, overflowY: 'auto',
    padding: '14px 16px 20px',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  fieldLabel: {
    fontSize: 12, color: 'rgba(255,255,255,.42)', marginBottom: 5,
  },
  req: { color: 'rgba(255,80,80,.65)', fontSize: 11 },
  input: {
    width: '100%', padding: '7px 10px', borderRadius: 6,
    fontFamily: 'inherit', fontSize: 13,
    background: 'rgba(255,255,255,.08)', border: 'none',
    color: 'rgba(255,255,255,.88)', outline: 'none', boxSizing: 'border-box',
  } as React.CSSProperties,
  uploadArea: {
    border: '1.5px dashed rgba(255,255,255,.10)',
    borderRadius: 8, padding: '16px 12px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    cursor: 'pointer', transition: 'all .14s', textAlign: 'center',
  },
  uploadAreaHover: {
    borderColor: 'rgba(67,105,239,.50)',
    background: 'rgba(67,105,239,.05)',
  },
  uploadAreaDone: {
    borderColor: 'rgba(4,215,147,.3)',
    background: 'rgba(4,215,147,.04)',
  },
  uploadHint: { fontSize: 11, color: 'rgba(255,255,255,.22)' },
  select: {
    flex: 1, width: 'auto', padding: '7px 28px 7px 10px', borderRadius: 6,
    fontFamily: 'inherit', fontSize: 13,
    background: 'rgba(255,255,255,.08)', border: 'none',
    color: 'rgba(255,255,255,.88)', outline: 'none',
    appearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='rgba(255,255,255,0.32)'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
  } as React.CSSProperties,
  iconBtn: {
    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', borderRadius: 6, cursor: 'pointer', flexShrink: 0,
    background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.45)',
    transition: 'background .1s, color .1s',
  },
  addLink: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    border: 'none', background: 'none', cursor: 'pointer',
    color: 'rgba(67,105,239,.80)', fontSize: 12, fontFamily: 'inherit', padding: 0,
    transition: 'color .1s',
  },
  profilePreview: {
    display: 'flex', alignItems: 'center', gap: 9,
    padding: '8px 10px',
    background: 'rgba(255,255,255,.05)',
    borderRadius: 7, marginTop: 10,
  },
  profileIcon: {
    width: 26, height: 26, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  profileName: { fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.88)' },
  editBtn: {
    padding: '3px 9px', background: 'rgba(255,255,255,.07)',
    border: 'none', borderRadius: 6,
    color: 'rgba(255,255,255,.55)',
    fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
  },
  footer: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '10px 16px 14px',
    borderTop: '1px solid rgba(255,255,255,.07)', flexShrink: 0,
  },
  btnPrimary: {
    padding: '7px 14px', background: 'var(--primary,#4369ef)', color: '#fff',
    border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600,
  },
  btnSecondary: {
    padding: '7px 12px', background: 'rgba(255,255,255,.07)',
    color: 'rgba(255,255,255,.60)',
    border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
  },
  btnGhost: {
    padding: '7px 12px', background: 'transparent',
    color: 'rgba(255,255,255,.45)',
    border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
  },
};
