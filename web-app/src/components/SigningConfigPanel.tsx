import React, { useState } from 'react';
import { METHOD_LABEL, METHOD_HUE, profilePreview } from '../signing-types';
import type { SignProfile } from '../signing-types';
import { SigningConfigEditor } from './SigningConfigEditor';

// ── Cert types (local only) ────────────────────────────────────────────────
interface CertEntry {
  id: string; name: string; type: 'root_ca' | 'signer' | 'ts_signer'; path: string; expiry: string;
}

const CERT_TYPE_LABEL: Record<CertEntry['type'], string> = {
  root_ca: '根证书', signer: '签名证书', ts_signer: '时间戳',
};

const DEMO_CERTS: CertEntry[] = [
  { id: 'c1', name: 'rootca.der',        type: 'root_ca',   path: 'certs/rootca.der',        expiry: '2034-12-31' },
  { id: 'c2', name: 'rootca.crl',        type: 'root_ca',   path: 'certs/rootca.crl',        expiry: '2025-06-30' },
  { id: 'c3', name: 'signer.pem.enc',    type: 'signer',    path: 'certs/signer.pem.enc',    expiry: '2026-08-01' },
  { id: 'c4', name: 'ts_signer.pem.enc', type: 'ts_signer', path: 'certs/ts_signer.pem.enc', expiry: '2026-08-01' },
];

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  profiles: SignProfile[];
  onProfilesChange: (ps: SignProfile[]) => void;
}

// ── Component ──────────────────────────────────────────────────────────────
export function SigningConfigPanel({ profiles, onProfilesChange }: Props) {
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [editId, setEditId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'signing' | 'certs'>('signing');
  const [certs, setCerts] = useState<CertEntry[]>(DEMO_CERTS);
  const [hoverRow, setHoverRow] = useState<string | null>(null);

  function openEdit(id: string) {
    setEditId(id);
    setMode('edit');
  }

  function handleNew() {
    const id = Date.now().toString();
    onProfilesChange([...profiles, { id, name: '新建签名配置', method: 'self_sign' }]);
    openEdit(id);
  }

  function handleDeleteRow(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    onProfilesChange(profiles.filter(p => p.id !== id));
    if (id === editId) setEditId(null);
  }

  // ── Edit view ──────────────────────────────────────────────────────────
  if (mode === 'edit') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        background: 'var(--background,#101010)',
        fontFamily: 'var(--font-sans,system-ui,sans-serif)',
      }}>
        {/* Back nav bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 44, padding: '0 14px',
          borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0,
        }}>
          <button
            onClick={() => setMode('list')}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: 0, border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'rgba(255,255,255,.45)',
              fontSize: 12, fontFamily: 'inherit', outline: 'none',
              transition: 'color .1s',
            }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.85)'; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.45)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            签名配置
          </button>
          <span style={{ color: 'rgba(255,255,255,.20)', fontSize: 13 }}>/</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.40)' }}>
            {profiles.find(p => p.id === editId)?.name ?? '档案编辑'}
          </span>
        </div>

        {/* Editor fills remaining space */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <SigningConfigEditor
            profiles={profiles}
            onProfilesChange={onProfilesChange}
            editId={editId}
          />
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────
  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 18px',
    borderTop: 'none', borderLeft: 'none', borderRight: 'none',
    borderBottom: `2px solid ${active ? 'var(--primary,#4369ef)' : 'transparent'}`,
    background: 'transparent',
    fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
    color: active ? 'rgba(255,255,255,.90)' : 'rgba(255,255,255,.42)',
    transition: 'color .12s, border-color .12s',
  });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--background,#101010)',
      fontFamily: 'var(--font-sans,system-ui,sans-serif)',
      fontSize: 13, color: 'rgba(255,255,255,.90)',
    }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0 }}>
        <button style={tabBtnStyle(activeTab === 'signing')} onClick={() => setActiveTab('signing')}>
          签名管理
        </button>
        <button style={tabBtnStyle(activeTab === 'certs')} onClick={() => setActiveTab('certs')}>
          证书管理
        </button>
      </div>

      {/* Signing profiles list */}
      {activeTab === 'signing' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 24px 12px',
            borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.88)' }}>签名档案</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>
                {profiles.length} 个配置
              </div>
            </div>
            <button onClick={handleNew} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: 'var(--primary,#4369ef)', color: '#fff',
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              新增签名配置
            </button>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
            {profiles.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 14, padding: '60px 24px',
                color: 'rgba(255,255,255,.25)',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,.12)">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <div style={{ fontSize: 13 }}>尚无签名配置</div>
                <button onClick={handleNew} style={{
                  padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: 'var(--primary,#4369ef)', color: '#fff', fontSize: 13, fontFamily: 'inherit',
                }}>新建签名配置</button>
              </div>
            ) : profiles.map((p, idx) => {
              const isHover = p.id === hoverRow;
              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoverRow(p.id)}
                  onMouseLeave={() => setHoverRow(null)}
                  style={{
                    display: 'flex', alignItems: 'center',
                    position: 'relative',
                    borderBottom: '1px solid rgba(255,255,255,.04)',
                    background: isHover
                      ? 'rgba(255,255,255,.04)'
                      : (idx % 2 !== 0 ? 'rgba(255,255,255,.012)' : 'transparent'),
                    transition: 'background .1s',
                  }}
                >
                  {/* Name + preview */}
                  <div style={{ flex: 1, minWidth: 0, padding: '13px 0 13px 24px' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <span style={{
                        fontSize: 13, color: 'rgba(255,255,255,.78)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        display: 'block',
                      }}>{p.name}</span>
                    </div>
                    <div style={{
                      fontSize: 11, color: 'rgba(255,255,255,.28)', marginTop: 2,
                      fontFamily: 'ui-monospace,monospace',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {profilePreview(p)}
                    </div>
                  </div>

                  {/* Method badge */}
                  <div style={{ padding: '0 12px 0 8px', flexShrink: 0 }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 999, fontSize: 11,
                      background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.50)',
                      whiteSpace: 'nowrap',
                    }}>{METHOD_LABEL[p.method]}</span>
                  </div>

                  {/* Actions — always visible */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    paddingRight: 14, paddingLeft: 8, flexShrink: 0,
                  }}>
                    <button
                      onClick={() => openEdit(p.id)}
                      title="编辑"
                      style={{
                        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', borderRadius: 5, cursor: 'pointer',
                        background: 'transparent', color: 'rgba(255,255,255,.38)',
                        transition: 'background .1s, color .1s',
                      }}
                      onMouseOver={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.06)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.80)';
                      }}
                      onMouseOut={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.38)';
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    <button
                      onClick={e => handleDeleteRow(p.id, e)}
                      title="删除"
                      style={{
                        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', borderRadius: 5, cursor: 'pointer',
                        background: 'transparent', color: 'rgba(255,255,255,.38)',
                        transition: 'background .1s, color .1s',
                      }}
                      onMouseOver={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.06)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.80)';
                      }}
                      onMouseOut={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.38)';
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certs tab */}
      {activeTab === 'certs' && (
        <CertsTab certs={certs} onDelete={id => setCerts(cs => cs.filter(c => c.id !== id))} />
      )}
    </div>
  );
}

// ── CertsTab ───────────────────────────────────────────────────────────────
function CertsTab({ certs, onDelete }: { certs: CertEntry[]; onDelete: (id: string) => void }) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px 12px', borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.88)', display: 'flex', alignItems: 'center', gap: 6 }}>
            证书管理
            <div style={{ position: 'relative', display: 'flex' }}>
              <button
                onMouseEnter={() => setShowTip(true)}
                onMouseLeave={() => setShowTip(false)}
                style={{
                  width: 15, height: 15, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: 'default',
                  background: 'rgba(255,255,255,.10)', color: 'rgba(255,255,255,.40)',
                  fontSize: 10, fontWeight: 700, fontFamily: 'inherit',
                }}
              >?</button>
              {showTip && (
                <div style={{
                  position: 'absolute', left: 20, top: -6, width: 224, zIndex: 200,
                  background: '#1a1a1a', borderRadius: 8, padding: '10px 12px',
                  border: '1px solid rgba(255,255,255,.10)',
                  fontSize: 12, color: 'rgba(255,255,255,.50)', lineHeight: 1.65,
                  pointerEvents: 'none', whiteSpace: 'normal',
                }}>
                  证书文件由各签名档案引用，导入的证书仅记录路径，不会复制文件。
                </div>
              )}
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>
            {certs.length} 个证书
          </div>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.75)',
          fontSize: 12, fontFamily: 'inherit',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          导入证书
        </button>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 76px 110px 32px',
        padding: '7px 24px', borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0,
      }}>
        {['文件名', '类型', '有效期至', ''].map((col, i) => (
          <span key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', fontWeight: 500, letterSpacing: '.03em' }}>
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {certs.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,.22)', fontSize: 12 }}>
            暂无证书，点击「导入证书」添加
          </div>
        )}
        {certs.map((c, idx) => (
          <div key={c.id}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 76px 110px 32px',
              padding: '11px 24px', alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,.04)',
              background: idx % 2 !== 0 ? 'rgba(255,255,255,.012)' : 'transparent',
              transition: 'background .1s',
            }}
            onMouseOver={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.04)'}
            onMouseOut={e => (e.currentTarget as HTMLDivElement).style.background = idx % 2 !== 0 ? 'rgba(255,255,255,.012)' : 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,255,255,.28)" style={{ flexShrink: 0 }}>
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
              </svg>
              <span style={{
                fontFamily: 'ui-monospace,monospace', fontSize: 12,
                color: 'rgba(255,255,255,.78)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{c.name}</span>
            </div>
            <span style={{
              display: 'inline-block', width: 'fit-content',
              padding: '2px 6px', borderRadius: 4, fontSize: 11,
              background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.48)',
              whiteSpace: 'nowrap',
            }}>{CERT_TYPE_LABEL[c.type]}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.38)', fontFamily: 'ui-monospace,monospace' }}>
              {c.expiry}
            </span>
            <button onClick={() => onDelete(c.id)} title="删除" style={{
              width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', borderRadius: 5, cursor: 'pointer',
              background: 'transparent', color: 'rgba(255,255,255,.38)',
              transition: 'background .1s, color .1s',
            }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.06)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.80)';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.38)';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
