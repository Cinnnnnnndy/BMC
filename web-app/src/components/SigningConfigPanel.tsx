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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.20)" strokeWidth="1.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
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
    padding: '9px 16px', border: 'none', background: 'transparent',
    fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
    color: active ? 'rgba(255,255,255,.88)' : 'rgba(255,255,255,.38)',
    fontWeight: active ? 500 : 400,
    borderBottom: `1px solid ${active ? 'rgba(255,255,255,.30)' : 'transparent'}`,
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
          签名配置
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
          <div style={{ flex: 1, overflowY: 'auto' }}>
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
                      style={{
                        padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                        background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.70)',
                        fontSize: 11, fontFamily: 'inherit', whiteSpace: 'nowrap',
                      }}
                    >编辑</button>
                    <button
                      onClick={e => handleDeleteRow(p.id, e)}
                      style={{
                        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', borderRadius: 5, cursor: 'pointer',
                        background: 'transparent', color: 'rgba(255,80,80,.45)',
                        transition: 'background .1s, color .1s',
                      }}
                      onMouseOver={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,80,80,.12)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,.85)';
                      }}
                      onMouseOut={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,.45)';
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M9 6V4h6v2"/>
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
  const today = new Date();

  function expiryColor(dateStr: string) {
    const d = new Date(dateStr);
    const daysLeft = (d.getTime() - today.getTime()) / 86400000;
    if (daysLeft < 0) return 'rgba(255,80,80,.80)';
    if (daysLeft < 90) return 'rgba(255,170,59,.80)';
    return 'rgba(255,255,255,.38)';
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px 12px', borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.88)' }}>证书管理</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>
            {certs.length} 个证书
          </div>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,.09)', color: 'rgba(255,255,255,.80)',
          fontSize: 12, fontFamily: 'inherit',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          导入证书
        </button>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 80px 110px 32px',
        padding: '7px 24px', borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0,
      }}>
        {['文件名', '类型', '有效期至', ''].map((col, i) => (
          <span key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,.30)', fontWeight: 500, letterSpacing: '.03em' }}>
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
              display: 'grid', gridTemplateColumns: '1fr 80px 110px 32px',
              padding: '11px 24px', alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,.04)',
              background: idx % 2 !== 0 ? 'rgba(255,255,255,.012)' : 'transparent',
              transition: 'background .1s',
            }}
            onMouseOver={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.04)'}
            onMouseOut={e => (e.currentTarget as HTMLDivElement).style.background = idx % 2 !== 0 ? 'rgba(255,255,255,.012)' : 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.30)" strokeWidth="1.8" style={{ flexShrink: 0 }}>
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span style={{
                fontFamily: 'ui-monospace,monospace', fontSize: 12,
                color: 'rgba(255,255,255,.80)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{c.name}</span>
            </div>
            <span style={{
              padding: '2px 8px', borderRadius: 999, fontSize: 11,
              background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.55)',
              whiteSpace: 'nowrap',
            }}>{CERT_TYPE_LABEL[c.type]}</span>
            <span style={{ fontSize: 12, color: expiryColor(c.expiry), fontFamily: 'ui-monospace,monospace' }}>
              {c.expiry}
            </span>
            <button onClick={() => onDelete(c.id)} style={{
              width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', borderRadius: 5, cursor: 'pointer',
              background: 'transparent', color: 'rgba(255,80,80,.40)',
              transition: 'background .1s, color .1s',
            }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,80,80,.10)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,.80)';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,.40)';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Note */}
      <div style={{
        padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,.06)',
        fontSize: 12, color: 'rgba(255,255,255,.28)', lineHeight: 1.6, flexShrink: 0,
      }}>
        证书文件由各签名档案引用，导入的证书仅记录路径，不会复制文件。
        有效期即将到期以橙色标注，已过期以红色标注。
      </div>
    </div>
  );
}
