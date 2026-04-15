import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TopologyView } from './components/TopologyView';
import { EventConfig } from './components/EventConfig';
import { SensorConfig } from './components/SensorConfig';
import { Simulator } from './components/Simulator';
import { ProjectList } from './components/ProjectList';
import { TianChiBoardTopologyView } from './components/TianChiBoardTopologyView';
import { SoftwareHardwareAssociationView } from './components/SoftwareHardwareAssociationView';
import { ServerAssociationView } from './components/ServerAssociationView';
import { HardwareTopologyCanvas } from './components/HardwareTopologyCanvas';
import { CsrCodeAdaptationView } from './components/CsrCodeAdaptationView';
import { HARDWARE_PROJECTS } from './data/projects';
import type { CSRDocument } from './types';

/** VSCode webview API bridge — called at most once per page */
let _vscodeApi: { postMessage(msg: unknown): void } | null = null;
function getVscode() {
  type VscodeWindow = { acquireVsCodeApi?: () => { postMessage(msg: unknown): void } };
  if (_vscodeApi === null && typeof (window as unknown as VscodeWindow).acquireVsCodeApi === 'function') {
    _vscodeApi = (window as unknown as VscodeWindow).acquireVsCodeApi!();
  }
  return _vscodeApi;
}

/** 从 model 字符串中提取显示名称和型号徽章（取最后一个4位数字作为型号） */
function parseModelInfo(model: string): { name: string; badge: string | null } {
  const clean = model.replace(/[（(][^）)]*[）)]/g, '').trim();
  // 优先匹配最后出现的4位数字作为型号徽章
  const matches = [...clean.matchAll(/\d{4}/g)];
  if (matches.length > 0) {
    const last = matches[matches.length - 1];
    const badge = last[0];
    const name = clean.slice(0, last.index).trim().replace(/\s+/g, ' ');
    return { name: name || clean, badge };
  }
  return { name: clean, badge: null };
}

export default function App() {
  const vscode = getVscode();
  const [csr, setCsr] = useState<CSRDocument | null>(null);
  const [activeTab, setActiveTab] = useState<'topology' | 'boardTopology' | 'association' | 'event' | 'sensor' | 'simulator' | 'csrAdaptation'>('topology');
  const [eventDef, setEventDef] = useState<Record<string, unknown> | null>(null);
  const [dirty, setDirty] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<{ manufacturer: string; model: string } | null>(null);
  const [lightMode, setLightMode] = useState(false);
  const [showServerView, setShowServerView] = useState(false);
  const [showHwTopology, setShowHwTopology] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const eventDefInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (lightMode) document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    return () => { document.documentElement.removeAttribute('data-theme'); };
  }, [lightMode]);

  useEffect(() => {
    if (!viewMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
        setViewMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [viewMenuOpen]);

  const loadCsr = useCallback((content: string) => {
    try {
      const parsed = JSON.parse(content) as CSRDocument;
      if (parsed.ManagementTopology && parsed.Objects !== undefined) {
        setCsr(parsed);
        setDirty(false);
      } else {
        setCsr(null);
        alert('无效的 CSR 格式：需包含 ManagementTopology 和 Objects');
      }
    } catch (err) {
      setCsr(null);
      alert('JSON 解析失败：' + String(err));
    }
  }, []);

  // VSCode webview message bridge — must come after loadCsr to avoid temporal dead zone
  useEffect(() => {
    if (!vscode) return;
    vscode.postMessage({ type: 'getInitialContent' });
    function handleMessage(event: MessageEvent) {
      const msg = event.data as { type: string; content?: string; uri?: string; eventDef?: Record<string, unknown> };
      if (msg.type === 'initialContent' && msg.content) {
        loadCsr(msg.content);
        if (msg.uri) {
          setFileName(msg.uri.split('/').pop() || 'csr.sr');
        }
      } else if (msg.type === 'eventDefLoaded' && msg.eventDef) {
        setEventDef(msg.eventDef);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [vscode, loadCsr]);

  const handleProjectSelect = useCallback(
    async (project: { id: string; manufacturer: string; model: string; rootSrPath?: string }) => {
      setCurrentProjectId(project.id);
      setCurrentProject({ manufacturer: project.manufacturer, model: project.model });
      if (project.rootSrPath) {
        try {
          const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL || '/';
          const path = base.endsWith('/') ? base + project.rootSrPath : base + '/' + project.rootSrPath;
          const res = await fetch(path);
          const text = await res.text();
          loadCsr(text);
          setFileName(`${project.manufacturer}_${project.model}.sr`);
        } catch (err) {
          alert('加载项目 CSR 失败：' + String(err));
        }
      } else {
        fileInputRef.current?.click();
      }
    },
    [loadCsr]
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      loadCsr(reader.result as string);
      setFileName(file.name);
      setCurrentProjectId(null);
      setCurrentProject(null);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleEventDefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setEventDef(JSON.parse(reader.result as string));
      } catch {
        alert('event_def.json 解析失败');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = useCallback(() => {
    if (!csr) return;
    const content = JSON.stringify(csr, null, 4);
    if (vscode) {
      vscode.postMessage({ type: 'saveContent', content });
      setDirty(false);
    } else {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'csr_modified.sr';
      a.click();
      URL.revokeObjectURL(url);
      setDirty(false);
    }
  }, [csr, fileName, vscode]);

  const handleCsrChange = useCallback((next: CSRDocument) => {
    setCsr(next);
    setDirty(true);
  }, []);

  const handleBackToProjects = useCallback(() => {
    if (dirty && !window.confirm('有未保存的修改，确定要返回项目列表？')) return;
    setCsr(null);
    setCurrentProjectId(null);
    setCurrentProject(null);
    setFileName('');
    setDirty(false);
  }, [dirty]);

  const handleOpenView = useCallback(
    async (viewId: string) => {
      if (viewId === 'hwTopology') { setShowHwTopology(true); return; }
      if (viewId === 'serverView') { setShowServerView(true); return; }
      // Project-dependent views: load first project with rootSrPath then set tab
      const tabId = viewId as 'topology' | 'boardTopology' | 'association' | 'event' | 'sensor' | 'simulator' | 'csrAdaptation';
      setActiveTab(tabId);
      const firstProject = HARDWARE_PROJECTS.find((p) => p.rootSrPath);
      if (firstProject) {
        await handleProjectSelect(firstProject);
      }
    },
    [handleProjectSelect]
  );

  const tabs = [
    { id: 'topology' as const, label: '拓扑视图' },
    ...(currentProjectId === 'huawei-tianchi' ? [{ id: 'boardTopology' as const, label: '板卡拓扑' }] : []),
    { id: 'association' as const, label: '软硬件关联' },
    { id: 'event' as const, label: '事件配置' },
    { id: 'sensor' as const, label: '传感器配置' },
    { id: 'simulator' as const, label: '仿真调试' },
    { id: 'csrAdaptation' as const, label: 'CSR拓扑代码适配尝试' },
  ];

  const modelInfo = currentProject ? parseModelInfo(currentProject.model) : null;
  const activeTabLabel = tabs.find((t) => t.id === activeTab)?.label ?? '拓扑视图';

  if (showHwTopology) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e2d3d', background: '#0a0f1a', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setShowHwTopology(false)} style={{ padding: '4px 10px', fontSize: 12, background: 'transparent', border: '1px solid #1e2d3d', borderRadius: 4, color: '#94a3b8', cursor: 'pointer' }}>
            ← 返回
          </button>
          <span style={{ fontSize: 13, color: '#64748b' }}>openUBMC 硬件拓扑视图</span>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <HardwareTopologyCanvas />
        </div>
      </div>
    );
  }

  if (showServerView) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #222', background: '#0a0a0a', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setShowServerView(false)} style={{ padding: '4px 10px', fontSize: 12, background: 'transparent', border: '1px solid #444', borderRadius: 4, color: '#aaa', cursor: 'pointer' }}>
            ← 返回
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ServerAssociationView />
        </div>
      </div>
    );
  }

  if (!csr) {
    // In VSCode: show a loading indicator while waiting for the extension to push content
    if (vscode) {
      return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 14 }}>
          正在加载 CSR 文件…
        </div>
      );
    }
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept=".sr,.json,application/json"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <input ref={eventDefInputRef} type="file" accept=".json" onChange={handleEventDefUpload} style={{ display: 'none' }} />
        <ProjectList
          projects={HARDWARE_PROJECTS}
          onSelect={handleProjectSelect}
          onUpload={() => fileInputRef.current?.click()}
          onOpenView={handleOpenView}
        />
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, color: '#555' }}>
          <button onClick={() => eventDefInputRef.current?.click()} style={{ padding: '5px 10px', background: '#1a1a28', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, cursor: 'pointer' }}>
            上传 event_def.json
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        {/* 左侧：返回 + 品牌信息 + 视图切换 */}
        <button onClick={handleBackToProjects} className="btn-ghost header-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="brand-logo">T</span>
        <span className="header-server-name">
          {modelInfo ? modelInfo.name : (fileName || '未命名')}
        </span>
        {modelInfo?.badge && (
          <span className="header-model-badge">{modelInfo.badge}</span>
        )}

        {/* 管理视图下拉菜单 */}
        <div className="view-menu-wrap" ref={viewMenuRef}>
          <button
            className={`view-menu-trigger ${viewMenuOpen ? 'open' : ''}`}
            onClick={() => setViewMenuOpen((v) => !v)}
          >
            {activeTabLabel}
            <svg className="view-menu-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {viewMenuOpen && (
            <div className="view-menu-dropdown">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={`view-menu-item ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => { setActiveTab(t.id); setViewMenuOpen(false); }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* 右侧：操作按钮 */}
        <button className="btn-text" title="查看代码">查看代码</button>
        <span className="pipe-sep">|</span>
        <button
          className={`btn-text ${activeTab === 'simulator' ? 'toggle-on' : ''}`}
          onClick={() => setActiveTab('simulator')}
          title="仿真调试"
        >
          在线调试
        </button>
        <span className="pipe-sep">|</span>
        <button className="btn-text" title="配置检查">配置检查</button>
        <span className="pipe-sep">|</span>
        <button
          className={`btn-text ${lightMode ? 'toggle-on' : ''}`}
          onClick={() => setLightMode((v) => !v)}
          title="切换深浅色"
          style={{ fontSize: 14, padding: '0 6px' }}
        >
          {lightMode ? '☀' : '🌙'}
        </button>
        <button onClick={handleSave} className="btn-primary" disabled={!dirty} title={dirty ? (vscode ? '保存 CSR 文件' : '下载 CSR 文件') : '暂无修改'}>
          {vscode ? '保存' : 'CSR出包'}
        </button>
      </header>
      <main className="app-main">
        {activeTab === 'topology' && <TopologyView csr={csr} onChange={handleCsrChange} projectId={currentProjectId} />}
        {activeTab === 'boardTopology' && currentProjectId === 'huawei-tianchi' && <TianChiBoardTopologyView />}
        {activeTab === 'association' && <SoftwareHardwareAssociationView csr={csr} />}
        {activeTab === 'event' && <EventConfig csr={csr} eventDef={eventDef} onChange={handleCsrChange} />}
        {activeTab === 'sensor' && <SensorConfig csr={csr} onChange={handleCsrChange} />}
        {activeTab === 'simulator' && <Simulator csr={csr} />}
        {activeTab === 'csrAdaptation' && <CsrCodeAdaptationView />}
      </main>
    </div>
  );
}
