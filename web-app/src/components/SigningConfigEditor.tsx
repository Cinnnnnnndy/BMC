import React, { useState, useEffect } from 'react';
import { METHOD_LABEL, METHOD_DESC } from '../signing-types';
import type { SignProfile, SignMethod } from '../signing-types';

interface Props {
  profiles: SignProfile[];
  onProfilesChange: (ps: SignProfile[]) => void;
  editId: string | null;
}

// ── Form helpers ───────────────────────────────────────────────────────────
function inputSt(focused: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '7px 10px', borderRadius: 6,
    fontFamily: 'inherit', fontSize: 12,
    background: 'rgba(255,255,255,.06)',
    border: `1px solid ${focused ? 'rgba(67,105,239,.55)' : 'rgba(255,255,255,.07)'}`,
    color: 'rgba(255,255,255,.88)', outline: 'none', boxSizing: 'border-box' as const,
  };
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  const [f, setF] = useState(false);
  return (
    <input type={type} style={inputSt(f)} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setF(true)} onBlur={() => setF(false)} />
  );
}

function PathField({ label, iniKey, value, placeholder, onChange }: {
  label: string; iniKey: string; value: string; placeholder: string; onChange: (v: string) => void;
}) {
  const [f, setF] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,.60)' }}>{label}</span>
        <code style={{
          fontFamily: 'ui-monospace,monospace', fontSize: 10,
          color: 'rgba(255,255,255,.28)', background: 'rgba(255,255,255,.06)',
          padding: '1px 4px', borderRadius: 3,
        }}>{iniKey}</code>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          style={{ ...inputSt(f), flex: 1, minWidth: 0 }}
          value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setF(true)} onBlur={() => setF(false)}
        />
        <button style={{
          padding: '7px 11px', borderRadius: 6, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.70)',
          fontSize: 12, fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap',
        }}>浏览</button>
      </div>
    </div>
  );
}

function LF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ marginBottom: 5, fontSize: 12, color: 'rgba(255,255,255,.60)' }}>{label}</div>
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function SigningConfigEditor({ profiles, onProfilesChange, editId }: Props) {
  // savedProfile from props — determines whether the profile still exists
  const savedProfile = profiles.find(p => p.id === editId) ?? null;

  // editingProfile — local working copy; only reset when editId changes
  const [editingProfile, setEditingProfile] = useState<SignProfile | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const found = profiles.find(p => p.id === editId) ?? null;
    setEditingProfile(found ? { ...found } : null);
    setDirty(false);
  }, [editId]); // intentionally excludes `profiles` — prevents overwriting in-progress edits

  function updateField<K extends keyof SignProfile>(key: K, value: SignProfile[K]) {
    setEditingProfile(prev => prev ? { ...prev, [key]: value } : null);
    setDirty(true);
  }

  function handleSave() {
    if (!editingProfile) return;
    onProfilesChange(profiles.map(p => p.id === editingProfile.id ? { ...editingProfile } : p));
    setDirty(false);
  }

  function handleDiscard() {
    const original = profiles.find(p => p.id === editId);
    setEditingProfile(original ? { ...original } : null);
    setDirty(false);
  }

  function handleDelete() {
    if (!editId) return;
    onProfilesChange(profiles.filter(p => p.id !== editId));
  }

  // Empty state: no profile selected, or selected profile was deleted
  if (!savedProfile) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: 12, color: 'rgba(255,255,255,.28)',
        background: 'var(--background,#101010)',
        fontFamily: 'var(--font-sans,system-ui,sans-serif)',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(255,255,255,.12)">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <div style={{ fontSize: 13 }}>
          {editId ? '该签名档案已被删除' : '从签名配置列表中选择档案以编辑'}
        </div>
        {editId && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.18)' }}>
            可从左侧列表新建或选择其他档案
          </div>
        )}
      </div>
    );
  }

  const profile = editingProfile ?? savedProfile;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--background,#101010)',
      fontFamily: 'var(--font-sans,system-ui,sans-serif)',
      fontSize: 13, color: 'rgba(255,255,255,.90)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px 14px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,.92)' }}>
            {profile.name || '未命名档案'}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>
            {METHOD_LABEL[profile.method]} · 签名档案编辑
          </div>
        </div>
      </div>

      {/* Unsaved changes banner */}
      {dirty && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '7px 24px',
          background: 'rgba(67,105,239,.10)', borderBottom: '1px solid rgba(67,105,239,.18)',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.60)' }}>有未保存的更改</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleDiscard} style={{
              padding: '3px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.60)',
              fontSize: 11, fontFamily: 'inherit',
            }}>取消修改</button>
            <button onClick={handleSave} style={{
              padding: '3px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
              background: 'var(--primary,#4369ef)', color: '#fff',
              fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
            }}>保存</button>
          </div>
        </div>
      )}

      {/* Form body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px 28px' }}>
        <div style={{ maxWidth: 600 }}>

          <LF label="档案名称">
            <TextInput value={profile.name} placeholder="输入档案名称"
              onChange={v => updateField('name', v)} />
          </LF>

          {/* Method selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 8, fontSize: 12, color: 'rgba(255,255,255,.60)' }}>签名方式</div>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,.06)', borderRadius: 7, padding: 2 }}>
              {(['self_sign', 'server_sign', 'signserver'] as SignMethod[]).map(m => (
                <button key={m}
                  onClick={() => updateField('method', m)}
                  style={{
                    flex: 1, padding: '7px 0', border: 'none', borderRadius: 5,
                    fontFamily: 'inherit', cursor: 'pointer', fontSize: 12,
                    background: profile.method === m ? 'rgba(255,255,255,.13)' : 'transparent',
                    color: profile.method === m ? 'rgba(255,255,255,.90)' : 'rgba(255,255,255,.42)',
                    fontWeight: profile.method === m ? 600 : 400,
                    transition: 'all .12s',
                  }}
                >{METHOD_LABEL[m]}</button>
              ))}
            </div>
            <div style={{ marginTop: 7, fontSize: 11, color: 'rgba(255,255,255,.32)' }}>
              {METHOD_DESC[profile.method]}
            </div>
          </div>

          {profile.method === 'self_sign' && (<>
            <PathField label="根证书 (DER)" iniKey="rootca_der"
              value={profile.rootcaDer ?? ''} placeholder="/path/to/rootca.der"
              onChange={v => updateField('rootcaDer', v)} />
            <PathField label="吊销列表 (CRL)" iniKey="rootca_crl"
              value={profile.rootcaCrl ?? ''} placeholder="/path/to/rootca.crl"
              onChange={v => updateField('rootcaCrl', v)} />
            <PathField label="签名证书" iniKey="signer_pem"
              value={profile.signerPem ?? ''} placeholder="/path/to/signer.pem.enc"
              onChange={v => updateField('signerPem', v)} />
            <PathField label="时间戳证书" iniKey="ts_signer_pem"
              value={profile.tsSignerPem ?? ''} placeholder="/path/to/ts_signer.pem.enc"
              onChange={v => updateField('tsSignerPem', v)} />
            <PathField label="时间戳配置" iniKey="ts_signer_cnf"
              value={profile.tsSignerCnf ?? ''} placeholder="/path/to/tsa.cnf"
              onChange={v => updateField('tsSignerCnf', v)} />
          </>)}

          {profile.method === 'server_sign' && (<>
            <LF label="服务器地址">
              <TextInput value={profile.serverUrl ?? ''} placeholder="https://sign.internal:9000"
                onChange={v => updateField('serverUrl', v)} />
            </LF>
            <LF label="用户名">
              <TextInput value={profile.username ?? ''} placeholder="hpm_sign"
                onChange={v => updateField('username', v)} />
            </LF>
            <LF label="密码">
              <TextInput value="" type="password" placeholder="••••••••" onChange={() => {}} />
            </LF>
          </>)}

          {profile.method === 'signserver' && (<>
            <LF label="SignServer 地址">
              <TextInput value={profile.signserverUrl ?? ''} placeholder="https://signserver.example.com:8443"
                onChange={v => updateField('signserverUrl', v)} />
            </LF>
            <LF label="证书配置 ID">
              <TextInput value={profile.certProfileId ?? ''} placeholder="HpmSignProfile"
                onChange={v => updateField('certProfileId', v)} />
            </LF>
            <LF label="Worker 名称">
              <TextInput value={profile.workerName ?? ''} placeholder="PlainSigner"
                onChange={v => updateField('workerName', v)} />
            </LF>
          </>)}

        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,.06)', flexShrink: 0,
      }}>
        {/* Left: delete */}
        <button
          onClick={handleDelete}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'rgba(255,80,80,.50)',
            fontSize: 12, fontFamily: 'inherit',
            transition: 'background .1s, color .1s',
          }}
          onMouseOver={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,80,80,.10)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,.85)';
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,.50)';
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
          删除档案
        </button>
        {/* Right: save */}
        <div style={{ display: 'flex', gap: 8 }}>
          {dirty && (
            <button onClick={handleDiscard} style={{
              padding: '7px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.60)',
              fontSize: 12, fontFamily: 'inherit',
            }}>取消修改</button>
          )}
          <button onClick={handleSave} disabled={!dirty} style={{
            padding: '7px 22px', borderRadius: 7, border: 'none',
            cursor: dirty ? 'pointer' : 'default',
            background: dirty ? 'var(--primary,#4369ef)' : 'rgba(255,255,255,.07)',
            color: dirty ? '#fff' : 'rgba(255,255,255,.30)',
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            transition: 'background .15s, color .15s',
          }}>保存配置</button>
        </div>
      </div>
    </div>
  );
}
