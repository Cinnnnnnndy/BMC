import React, { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
type SignMethod = 'self_sign' | 'server_sign' | 'signserver';
interface SignProfile { id: string; name: string; method: SignMethod; }

interface Props {
  onClose?: () => void;
  signingProfiles?: SignProfile[];
  boardName?: string;
  onExport?: (config: CsrExportConfig) => void;
  onBinBuild?: (config: CsrExportConfig) => void;
  onRefreshProfiles?: () => void;
  onAddProfile?: () => void;
}

export interface CsrExportConfig {
  formatVersion: string;
  dataVersion: string;
  oemFile: File | null;
  spoofUids: string;
  signingProfileId: string;
}

const DEMO_PROFILES: SignProfile[] = [
  { id: '', name: '不使用签名', method: 'self_sign' },
  { id: '1', name: '本地签名1（本地自签）', method: 'self_sign' },
  { id: '2', name: 'SignServer Mock（SignServer 签名）', method: 'signserver' },
  { id: '3', name: '简易服务器签名（服务器签名）', method: 'server_sign' },
];

const METHOD_LABEL: Record<SignMethod, string> = {
  self_sign: '本地自签', server_sign: '服务器签名', signserver: 'SignServer',
};

// ── Shared fill-only input ──────────────────────────────────────────────────
const baseInput: React.CSSProperties = {
  width: '100%', padding: '7px 10px', borderRadius: 6,
  fontFamily: 'inherit', fontSize: 13,
  background: 'rgba(255,255,255,.08)', border: 'none',
  color: 'rgba(255,255,255,.88)', outline: 'none', boxSizing: 'border-box',
};

// ── Section label (flat uppercase, no border) ──────────────────────────────
function SectionLabel({ title }: { title: string }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.07em',
      textTransform: 'uppercase', color: 'rgba(255,255,255,.30)',
      marginBottom: 8,
    }}>{title}</div>
  );
}

// ── Section card (fill-based separation, no border) ────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <SectionLabel title={title} />
      <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: 12 }}>
        {children}
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export function CsrExportPanel({
  onClose,
  signingProfiles = DEMO_PROFILES,
  boardName = '当前板卡',
  onExport,
  onBinBuild,
  onRefreshProfiles,
  onAddProfile,
}: Props) {
  const [formatVersion, setFormatVersion] = useState('3.00');
  const [dataVersion, setDataVersion] = useState('3.17');
  const [oemFile, setOemFile] = useState<File | null>(null);
  const [spoofUids, setSpoofUids] = useState('');
  const [profileId, setProfileId] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const selectedProfile = signingProfiles.find(p => p.id === profileId && p.id !== '') ?? null;
  const config = (): CsrExportConfig => ({ formatVersion, dataVersion, oemFile, spoofUids, signingProfileId: profileId });

  function handleRefresh() {
    setRefreshSpin(true);
    onRefreshProfiles?.();
    setTimeout(() => setRefreshSpin(false), 600);
  }

  return (
    <div style={{
      width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--surface-1, #161616)',
      borderLeft: '1px solid rgba(255,255,255,.07)',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      fontSize: 13, color: 'rgba(255,255,255,.90)',
    }}>
      {/* Panel title — heavier weight, distinct from section labels */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.01em' }}>CSR 出包配置</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.32)', marginTop: 1 }}>{boardName}</div>
        </div>
        <button onClick={onClose} style={{
          width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', background: 'rgba(255,255,255,.06)', borderRadius: 6,
          color: 'rgba(255,255,255,.45)', cursor: 'pointer', fontSize: 15, lineHeight: 1,
        }}>×</button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 20px' }}>

        {/* 基本信息 */}
        <SectionCard title="基本信息">
          <div style={{ marginBottom: 10 }}>
            <div style={{ marginBottom: 5, fontSize: 12, color: 'rgba(255,255,255,.42)' }}>
              <span style={{ color: 'rgba(255,80,80,.65)', fontSize: 11 }}>* </span>FormatVersion
            </div>
            <input
              style={baseInput}
              value={formatVersion}
              onChange={e => setFormatVersion(e.target.value)}
              onFocus={e => (e.target.style.background = 'rgba(255,255,255,.11)')}
              onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)')}
            />
          </div>
          <div>
            <div style={{ marginBottom: 5, fontSize: 12, color: 'rgba(255,255,255,.42)' }}>
              <span style={{ color: 'rgba(255,80,80,.65)', fontSize: 11 }}>* </span>DataVersion
            </div>
            <input
              style={baseInput}
              value={dataVersion}
              onChange={e => setDataVersion(e.target.value)}
              onFocus={e => (e.target.style.background = 'rgba(255,255,255,.11)')}
              onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)')}
            />
          </div>
        </SectionCard>

        {/* OEM 定制消息 */}
        <SectionCard title="OEM 定制消息">
          <input ref={fileInputRef} type="file" accept=".bin,.ini" style={{ display: 'none' }}
            onChange={e => setOemFile(e.target.files?.[0] ?? null)} />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); setOemFile(e.dataTransfer.files[0] ?? null); }}
            style={{
              padding: '18px 12px', borderRadius: 7, textAlign: 'center', cursor: 'pointer',
              background: dragOver ? 'rgba(67,105,239,.10)' : 'rgba(255,255,255,.05)',
              border: `1.5px dashed ${dragOver ? 'rgba(67,105,239,.50)' : 'rgba(255,255,255,.10)'}`,
              transition: 'background .1s, border-color .1s',
            }}
          >
            {oemFile ? (
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.78)', fontFamily: 'ui-monospace, monospace' }}>
                  {oemFile.name}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', marginTop: 3 }}>
                  点击重新选择
                </div>
              </div>
            ) : (
              <div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                  style={{ color: 'rgba(255,255,255,.22)', marginBottom: 6 }}>
                  <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                </svg>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.38)' }}>选择 OEM 文件</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.20)', marginTop: 3 }}>
                  支持 .bin 和 .ini 格式，或拖拽至此
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* 伪装包 UID */}
        <SectionCard title="伪装包 UID 列表">
          <input
            style={baseInput}
            value={spoofUids}
            placeholder="英文逗号分隔，仅支持数字和字母，如 <UID1>,<UID>"
            onChange={e => setSpoofUids(e.target.value)}
            onFocus={e => (e.target.style.background = 'rgba(255,255,255,.11)')}
            onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)')}
          />
        </SectionCard>

        {/* 签名配置 */}
        <SectionCard title="签名配置">
          {/* Select + refresh */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
            <select
              style={{
                ...baseInput, flex: 1, width: 'auto', appearance: 'none', cursor: 'pointer',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='rgba(255,255,255,0.32)'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                paddingRight: 28,
              }}
              value={profileId}
              onChange={e => setProfileId(e.target.value)}
            >
              {signingProfiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              title="刷新签名列表"
              onClick={handleRefresh}
              style={{
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', borderRadius: 6, cursor: 'pointer', flexShrink: 0,
                background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.45)',
                transition: 'background .1s, color .1s',
              }}
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

          {/* Add new */}
          <button
            onClick={() => onAddProfile?.()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              border: 'none', background: 'none', cursor: 'pointer',
              color: 'rgba(67,105,239,.80)', fontSize: 12, fontFamily: 'inherit', padding: 0,
              transition: 'color .1s',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#4369ef')}
            onMouseOut={e => (e.currentTarget.style.color = 'rgba(67,105,239,.80)')}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 11H13V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z"/>
            </svg>
            新增签名配置
          </button>

          {selectedProfile && (
            <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 7, background: 'rgba(255,255,255,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.80)', fontWeight: 500 }}>
                  {selectedProfile.name.split('（')[0]}
                </span>
                <span style={{
                  padding: '2px 6px', borderRadius: 4, fontSize: 11,
                  background: 'rgba(255,255,255,.10)', color: 'rgba(255,255,255,.55)',
                }}>{METHOD_LABEL[selectedProfile.method]}</span>
              </div>
              <button style={{
                padding: '3px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11,
                background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.60)', fontFamily: 'inherit',
              }}>在签名配置中编辑 ↗</button>
            </div>
          )}
        </SectionCard>

      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,.07)',
        display: 'flex', gap: 6, flexShrink: 0,
      }}>
        <button onClick={onClose} style={{
          padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.60)',
          fontSize: 12, fontFamily: 'inherit',
        }}>取消</button>
        <button style={{
          padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.60)',
          fontSize: 12, fontFamily: 'inherit',
        }}>保存</button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => onBinBuild?.(config())}
          style={{
            padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.72)',
            fontSize: 12, fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>bin 文件构建</button>
        <button
          onClick={() => onExport?.(config())}
          style={{
            padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
            background: 'var(--primary, #4369ef)', color: '#fff',
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          CSR 出包
        </button>
      </div>
    </div>
  );
}
