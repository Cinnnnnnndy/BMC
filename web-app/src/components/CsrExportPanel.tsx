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

// ── Shared field styles ─────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '7px 10px', borderRadius: 6, fontFamily: 'inherit', fontSize: 13,
  background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.07)',
  color: 'rgba(255,255,255,.88)', outline: 'none', boxSizing: 'border-box',
};

function SectionBar({ title }: { title: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
      paddingLeft: 8, borderLeft: '2px solid rgba(255,255,255,.22)',
    }}>
      <span style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '.06em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,.50)',
      }}>{title}</span>
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
}: Props) {
  const [formatVersion, setFormatVersion] = useState('3.00');
  const [dataVersion, setDataVersion] = useState('3.17');
  const [oemFile, setOemFile] = useState<File | null>(null);
  const [spoofUids, setSpoofUids] = useState('');
  const [profileId, setProfileId] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const selectedProfile = signingProfiles.find(p => p.id === profileId && p.id !== '') ?? null;

  const config = (): CsrExportConfig => ({ formatVersion, dataVersion, oemFile, spoofUids, signingProfileId: profileId });

  const [fmtFocus, setFmtFocus] = useState(false);
  const [dvFocus, setDvFocus] = useState(false);

  return (
    <div style={{
      width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--surface-1, #161616)',
      borderLeft: '1px solid rgba(255,255,255,.07)',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      fontSize: 13, color: 'rgba(255,255,255,.90)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>CSR 出包配置</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.38)', marginTop: 1 }}>{boardName}</div>
        </div>
        <button onClick={onClose} style={{
          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', background: 'rgba(255,255,255,.06)', borderRadius: 6,
          color: 'rgba(255,255,255,.55)', cursor: 'pointer', fontSize: 16, lineHeight: 1,
        }}>×</button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px' }}>

        {/* 基本信息 */}
        <div style={{ marginBottom: 20 }}>
          <SectionBar title="基本信息" />
          <div style={{ marginBottom: 10 }}>
            <div style={{ marginBottom: 5, fontSize: 12, color: 'rgba(255,255,255,.50)' }}>
              <span style={{ color: 'rgba(255,80,80,.7)', fontSize: 11 }}>* </span>FormatVersion
            </div>
            <input
              style={{ ...inputStyle, borderColor: fmtFocus ? 'rgba(67,105,239,.55)' : 'rgba(255,255,255,.07)' }}
              value={formatVersion}
              onChange={e => setFormatVersion(e.target.value)}
              onFocus={() => setFmtFocus(true)}
              onBlur={() => setFmtFocus(false)}
            />
          </div>
          <div>
            <div style={{ marginBottom: 5, fontSize: 12, color: 'rgba(255,255,255,.50)' }}>
              <span style={{ color: 'rgba(255,80,80,.7)', fontSize: 11 }}>* </span>DataVersion
            </div>
            <input
              style={{ ...inputStyle, borderColor: dvFocus ? 'rgba(67,105,239,.55)' : 'rgba(255,255,255,.07)' }}
              value={dataVersion}
              onChange={e => setDataVersion(e.target.value)}
              onFocus={() => setDvFocus(true)}
              onBlur={() => setDvFocus(false)}
            />
          </div>
        </div>

        {/* OEM 定制消息 */}
        <div style={{ marginBottom: 20 }}>
          <SectionBar title="OEM 定制消息" />
          <input ref={fileInputRef} type="file" accept=".bin,.ini" style={{ display: 'none' }}
            onChange={e => setOemFile(e.target.files?.[0] ?? null)} />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); setOemFile(e.dataTransfer.files[0] ?? null); }}
            style={{
              padding: '20px 12px', borderRadius: 8, textAlign: 'center', cursor: 'pointer',
              background: dragOver ? 'rgba(67,105,239,.10)' : 'rgba(255,255,255,.04)',
              border: `1.5px dashed ${dragOver ? 'rgba(67,105,239,.55)' : 'rgba(255,255,255,.12)'}`,
              transition: 'background .1s, border-color .1s',
            }}
          >
            {oemFile ? (
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.80)', fontFamily: 'ui-monospace, monospace' }}>
                  {oemFile.name}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 3 }}>
                  点击重新选择
                </div>
              </div>
            ) : (
              <div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.30)" strokeWidth="1.5" style={{ marginBottom: 6 }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>选择 OEM 文件</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 3 }}>
                  支持 .bin 和 .ini 格式，或拖拽至此
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 伪装包 UID */}
        <div style={{ marginBottom: 20 }}>
          <SectionBar title="伪装包 UID 列表" />
          <input
            style={inputStyle}
            value={spoofUids}
            placeholder="英文逗号分隔，仅支持数字和字母，如 <UID1>,<UID>"
            onChange={e => setSpoofUids(e.target.value)}
          />
        </div>

        {/* 签名配置 */}
        <div style={{ marginBottom: 20 }}>
          <SectionBar title="签名配置" />
          <select
            style={{
              ...inputStyle, appearance: 'none', cursor: 'pointer',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              paddingRight: 30,
            }}
            value={profileId}
            onChange={e => setProfileId(e.target.value)}
          >
            {signingProfiles.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {selectedProfile && (
            <div style={{
              marginTop: 8, padding: '10px 12px', borderRadius: 7,
              background: 'rgba(255,255,255,.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.80)', fontWeight: 500 }}>
                  {selectedProfile.name.split('（')[0]}
                </span>
                <span style={{
                  padding: '2px 7px', borderRadius: 999, fontSize: 11,
                  background: 'rgba(255,255,255,.10)', color: 'rgba(255,255,255,.60)',
                }}>{METHOD_LABEL[selectedProfile.method]}</span>
              </div>
              <button style={{
                padding: '3px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11,
                background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.65)', fontFamily: 'inherit',
              }}>在签名配置中编辑 ↗</button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.07)',
        display: 'flex', gap: 7, flexShrink: 0,
      }}>
        <button onClick={onClose} style={{
          padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.70)',
          fontSize: 12, fontFamily: 'inherit',
        }}>取消</button>
        <button style={{
          padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.70)',
          fontSize: 12, fontFamily: 'inherit',
        }}>保存</button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => onBinBuild?.(config())}
          style={{
            padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.80)',
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          CSR 出包
        </button>
      </div>
    </div>
  );
}
