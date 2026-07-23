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
  /** 由 HPM 签名配置扩展注入，或使用内置演示数据 */
  signingProfiles?: SignProfile[];
  onExport?: (config: CsrExportConfig) => void;
  onBinBuild?: (config: CsrExportConfig) => void;
}

/* ── 演示数据（接入真实扩展前的占位） ── */
const DEMO_PROFILES: SignProfile[] = [
  { id: 'local-1',       name: '本地签名1',    method: 'self_sign'   },
  { id: 'signserver-1',  name: 'SignServer Mock', method: 'signserver' },
  { id: 'server-1',      name: '简易服务器签名', method: 'server_sign' },
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

export function CsrExportDialog({
  open,
  onClose,
  boardName = '当前板卡',
  signingProfiles,
  onExport,
  onBinBuild,
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

  const selected = config.signingProfileId
    ? profiles.find(p => p.id === config.signingProfileId) ?? null
    : null;

  const set = useCallback(<K extends keyof CsrExportConfig>(k: K, v: CsrExportConfig[K]) => {
    setConfig(c => ({ ...c, [k]: v }));
  }, []);

  const handleExport = () => { onExport?.(config); onClose(); };
  const handleBin    = () => { onBinBuild?.(config); };
  const handleSave   = () => { /* TODO: persist */ };

  const handleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) set('oemFile', file);
  };

  if (!open) return null;

  return (
    <div style={s.overlay} onClick={handleOverlay}>
      <div style={s.dialog} role="dialog" aria-modal aria-label="CSR 出包配置">

        {/* ── Header ── */}
        <div style={s.header}>
          <span style={s.title}>CSR 出包配置</span>
          <span style={s.subtitle}>{boardName}</span>
          <button style={s.closeBtn} onClick={onClose} title="关闭">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div style={s.body}>

          {/* 基本信息 */}
          <section>
            <div style={s.secTitle}>基本信息</div>
            <div style={s.formRow}>
              <label style={s.label}><span style={s.req}>*</span> FormatVersion</label>
              <input style={s.input} value={config.formatVersion}
                onChange={e => set('formatVersion', e.target.value)} />
            </div>
            <div style={s.formRow}>
              <label style={s.label}><span style={s.req}>*</span> DataVersion</label>
              <input style={s.input} value={config.dataVersion}
                onChange={e => set('dataVersion', e.target.value)} />
            </div>
          </section>

          {/* OEM 定制消息 */}
          <section>
            <div style={s.secTitle}>OEM 定制消息</div>
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
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#04d793" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: 12, color: '#04d793', fontWeight: 600 }}>
                    {config.oemFile.name}
                  </span>
                  <span style={s.uploadHint}>点击更换文件</span>
                </>
              ) : (
                <>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                    stroke="var(--primary,#4369ef)" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span style={s.uploadBtn}>选择 OEM 文件</span>
                  <span style={s.uploadHint}>支持 .bin 和 .ini 格式，或拖拽至此</span>
                </>
              )}
              <input type="file" accept=".bin,.ini" style={{ display: 'none' }}
                onChange={e => set('oemFile', e.target.files?.[0] ?? null)} />
            </label>
          </section>

          {/* 伪装包 UID */}
          <section>
            <div style={s.secTitle}>伪装包 UID 列表</div>
            <input
              style={s.input}
              placeholder="英文逗号分隔，仅支持数字和字母，如 <UID1>,<UID2>"
              value={config.spoofUids}
              onChange={e => set('spoofUids', e.target.value)}
            />
          </section>

          {/* 签名配置 */}
          <section>
            <div style={s.secTitleRow}>
              <div style={s.secTitle}>签名配置</div>
              {profiles.length === 0 && (
                <span style={s.secHint}>在「HPM 签名配置」面板中新增档案</span>
              )}
            </div>

            <div style={s.selWrap}>
              <select
                style={s.select}
                value={config.signingProfileId ?? ''}
                onChange={e => {
                  const v = e.target.value;
                  if (v === '__new__') {
                    onClose();
                    // TODO: postMessage to open HPM signing config panel
                    return;
                  }
                  set('signingProfileId', v || null);
                }}
              >
                <option value="">不使用签名</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}（{METHOD_LABEL[p.method]}）
                  </option>
                ))}
                <option value="__new__">＋ 增加新配置...</option>
              </select>
              <span style={s.selArrow}>▾</span>
            </div>

            {/* Profile preview — shows connection to HPM signing panel */}
            {selected && (
              <div style={s.profilePreview}>
                <div style={{
                  ...s.profileIcon,
                  background: METHOD_COLOR[selected.method].bg,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke={METHOD_COLOR[selected.method].color} strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={s.profileName}>{selected.name}</div>
                  <div style={s.profileMeta}>
                    <span style={{
                      ...s.profileTag,
                      background: METHOD_COLOR[selected.method].bg,
                      color: METHOD_COLOR[selected.method].color,
                    }}>
                      {METHOD_LABEL[selected.method]}
                    </span>
                    <span style={s.profileDesc}>{METHOD_DESC[selected.method]}</span>
                  </div>
                </div>
                <button style={s.editBtn} onClick={() => { onClose(); /* TODO: focus HPM panel */ }}>
                  编辑 ↗
                </button>
              </div>
            )}
          </section>

        </div>

        {/* ── Footer ── */}
        <div style={s.footer}>
          <button style={s.btnGhost} onClick={onClose}>取消</button>
          <div style={{ flex: 1 }} />
          <button style={s.btnSecondary} onClick={handleSave}>保存</button>
          <button style={s.btnSecondary} onClick={handleBin}>bin 文件构建</button>
          <button style={s.btnPrimary} onClick={handleExport}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: 'middle' }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {' '}CSR 出包
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Styles (PTO tokens with fallbacks) ── */
const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    fontFamily: "'Inter','Source Han Sans SC','PingFang SC',sans-serif",
  },
  dialog: {
    background: 'var(--surface-2,#1c1c1c)',
    border: '1px solid rgba(255,255,255,.10)',
    borderRadius: 16,
    width: 500,
    maxHeight: '84vh',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 28px 80px rgba(0,0,0,.55)',
    color: 'var(--foreground,rgba(255,255,255,.9))',
    fontSize: 13,
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '15px 20px 13px',
    borderBottom: '1px solid rgba(255,255,255,.06)',
    flexShrink: 0,
  },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--foreground,rgba(255,255,255,.9))' },
  subtitle: {
    fontSize: 11, color: 'var(--foreground-muted,rgba(255,255,255,.4))',
    background: 'rgba(255,255,255,.06)', padding: '2px 7px',
    borderRadius: 999, marginLeft: 2,
  },
  closeBtn: {
    marginLeft: 'auto', width: 28, height: 28, borderRadius: 8,
    background: 'transparent', border: 'none',
    color: 'var(--foreground-muted,rgba(255,255,255,.4))',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all .12s',
  },
  body: {
    flex: 1, overflowY: 'auto',
    padding: '18px 20px',
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  secTitleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  secTitle: {
    fontSize: 12, fontWeight: 600,
    color: 'var(--foreground,rgba(255,255,255,.9))',
    borderLeft: '3px solid var(--primary,#4369ef)',
    paddingLeft: 8,
  },
  secHint: { fontSize: 11, color: 'var(--foreground-muted,rgba(255,255,255,.4))' },
  formRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 9 },
  label: { fontSize: 12, color: 'var(--foreground-secondary,rgba(255,255,255,.6))', width: 108, flexShrink: 0 },
  req: { color: 'var(--danger,#ff4b7b)' },
  input: {
    flex: 1,
    background: 'var(--surface-3,#262626)',
    border: '1px solid rgba(255,255,255,.10)',
    borderRadius: 8,
    color: 'var(--foreground,rgba(255,255,255,.9))',
    fontSize: 12, padding: '6px 10px',
    fontFamily: 'inherit', outline: 'none',
  },
  uploadArea: {
    border: '1.5px dashed rgba(255,255,255,.10)',
    borderRadius: 12, padding: '18px 16px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    cursor: 'pointer', transition: 'all .14s',
  },
  uploadAreaHover: {
    borderColor: 'var(--primary,#4369ef)',
    background: 'rgba(67,105,239,.05)',
  },
  uploadAreaDone: {
    borderColor: 'rgba(4,215,147,.3)',
    background: 'rgba(4,215,147,.04)',
  },
  uploadBtn: {
    padding: '6px 18px',
    background: 'var(--primary,#4369ef)', color: '#fff',
    borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer',
  },
  uploadHint: { fontSize: 11, color: 'var(--foreground-muted,rgba(255,255,255,.4))' },
  selWrap: { position: 'relative' },
  select: {
    width: '100%',
    background: 'var(--surface-3,#262626)',
    border: '1px solid rgba(255,255,255,.10)',
    borderRadius: 8,
    color: 'var(--foreground,rgba(255,255,255,.9))',
    fontSize: 12, padding: '7px 32px 7px 10px',
    appearance: 'none', cursor: 'pointer',
    outline: 'none', fontFamily: 'inherit',
  },
  selArrow: {
    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,.4)', pointerEvents: 'none', fontSize: 10,
  },
  profilePreview: {
    display: 'flex', alignItems: 'center', gap: 9,
    padding: '8px 10px',
    background: 'var(--surface-3,#262626)',
    border: '1px solid rgba(255,255,255,.06)',
    borderRadius: 8, marginTop: 6,
  },
  profileIcon: {
    width: 26, height: 26, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  profileName: { fontSize: 12, fontWeight: 600, color: 'var(--foreground,rgba(255,255,255,.9))' },
  profileMeta: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 },
  profileTag: {
    display: 'inline-flex', alignItems: 'center',
    padding: '1px 7px', borderRadius: 999,
    fontSize: 10.5, fontWeight: 600, lineHeight: 1.5,
  },
  profileDesc: { fontSize: 10.5, color: 'var(--foreground-muted,rgba(255,255,255,.4))' },
  editBtn: {
    padding: '3px 9px', background: 'transparent',
    border: '1px solid rgba(255,255,255,.10)',
    borderRadius: 999,
    color: 'var(--foreground-secondary,rgba(255,255,255,.6))',
    fontSize: 10.5, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s',
  },
  footer: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '12px 20px 16px',
    borderTop: '1px solid rgba(255,255,255,.06)', flexShrink: 0,
  },
  btnPrimary: {
    padding: '6px 14px', background: 'var(--primary,#4369ef)', color: '#fff',
    border: 'none', borderRadius: 12, fontSize: 12, cursor: 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5,
  },
  btnSecondary: {
    padding: '6px 12px', background: 'var(--surface-3,#262626)',
    color: 'var(--foreground-secondary,rgba(255,255,255,.6))',
    border: '1px solid rgba(255,255,255,.06)',
    borderRadius: 12, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
  },
  btnGhost: {
    padding: '6px 12px', background: 'transparent',
    color: 'var(--foreground-secondary,rgba(255,255,255,.6))',
    border: '1px solid rgba(255,255,255,.06)',
    borderRadius: 12, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
  },
};
