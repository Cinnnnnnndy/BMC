import React, { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { ProjectList } from './components/ProjectList';
import { HARDWARE_PROJECTS } from './data/projects';
import type { CSRDocument } from './types';

// ── Lazy-loaded views ──────────────────────────────────────────────────────
const lazy = <T extends React.ComponentType<never>>(
  load: () => Promise<{ [k: string]: T }>,
  name: string
) => React.lazy(() => load().then((m) => ({ default: m[name] as T })));

const TopologyView               = lazy(() => import('./components/TopologyView'),               'TopologyView');
const EventConfig                = lazy(() => import('./components/EventConfig'),                'EventConfig');
const SensorConfig               = lazy(() => import('./components/SensorConfig'),               'SensorConfig');
const Simulator                  = lazy(() => import('./components/Simulator'),                  'Simulator');
const TianChiBoardTopologyView   = lazy(() => import('./components/TianChiBoardTopologyView'),   'TianChiBoardTopologyView');
const SoftwareHardwareAssociationView = lazy(() => import('./components/SoftwareHardwareAssociationView'), 'SoftwareHardwareAssociationView');
const ServerAssociationView      = lazy(() => import('./components/ServerAssociationView'),      'ServerAssociationView');
const HardwareTopologyCanvas     = lazy(() => import('./components/HardwareTopologyCanvas'),     'HardwareTopologyCanvas');

/** VSCode webview API bridge */
let _vscodeApi: { postMessage(msg: unknown): void } | null = null;
function getVscode() {
  type VscodeWindow = { acquireVsCodeApi?: () => { postMessage(msg: unknown): void } };
  if (_vscodeApi === null && typeof (window as unknown as VscodeWindow).acquireVsCodeApi === 'function') {
    _vscodeApi = (window as unknown as VscodeWindow).acquireVsCodeApi!();
  }
  return _vscodeApi;
}

function parseModelInfo(model: string): { name: string; badge: string | null } {
  const clean = model.replace(/[（(][^）)]*[）)]/g, '').trim();
  const matches = [...clean.matchAll(/\d{4}/g)];
  if (matches.length > 0) {
    const last = matches[matches.length - 1];
    const badge = last[0];
    const name = clean.slice(0, last.index).trim().replace(/\s+/g, ' ');
    return { name: name || clean, badge };
  }
  return { name: clean, badge: null };
}

// ── View routing ──────────────────────────────────────────────────────────
type ViewId =
  | 'home'
  | 'topology' | 'boardTopology' | 'association' | 'event' | 'sensor' | 'simulator'
  | 'vueTopo' | 'hwTopology' | 'serverView' | 'threeD'
  | 'smcOffset' | 'exprCalc' | 'coolingConfig';

const CSR_REQUIRED = new Set<ViewId>(['topology', 'boardTopology', 'association', 'event', 'sensor', 'simulator']);

// ── Rail icon SVG helper ───────────────────────────────────────────────────
function SI({ d }: { d: string | string[] }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg className="pto-ide-frame__rail-icon" viewBox="0 0 24 24">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  home:         <SI d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
  topology:     <SI d={['M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z','M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z','M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z','M8.59 13.51l6.83 3.98','M15.41 6.51l-6.82 3.98']} />,
  boardTopology:<SI d="M4 5h16M4 12h16M4 19h16M9 5v14M15 5v14" />,
  association:  <SI d={['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71','M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71']} />,
  event:        <SI d="M13 2L3 14h9l-1 8 10-12h-9l1-8" />,
  sensor:       <SI d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  simulator:    <SI d="M5 3l14 9-14 9V3z" />,
  hwTopology:   <SI d={['M9 3H5a2 2 0 0 0-2 2v4m6-6h6m-6 0v18m6-18h4a2 2 0 0 1 2 2v4M3 9h6M21 9h-6','M3 21h6m-6 0v-4m18 4h-6m6 0v-4M9 21v-4m0 0h6m0 0v4']} />,
  threeD:       <SI d={['M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z','M3.27 6.96L12 12.01l8.73-5.05','M12 22.08V12']} />,
  vueTopo:      <SI d={['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z']} />,
  serverView:   <SI d={['M21 4H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z','M21 14H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z']} />,
  smcOffset:    <SI d="M4 9h16M4 15h16M10 3v18M14 3v18" />,
  exprCalc:     <SI d={['M4 17l6-6-6-6','M12 19h8']} />,
  coolingConfig:<SI d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 10 16H2m15.73-8.27A2 2 0 1 1 19 12H2" />,
};

function ViewLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', width: '100%',
      color: 'var(--foreground-muted)', fontSize: 13, gap: 8,
    }}>
      <span style={{
        display: 'inline-block', width: 16, height: 16,
        border: '2px solid currentColor', borderTopColor: 'transparent',
        borderRadius: '50%', animation: 'spin 0.7s linear infinite',
      }} />
      加载中…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const vscode = getVscode();
  const [csr, setCsr] = useState<CSRDocument | null>(null);
  const [activeView, setActiveView] = useState<ViewId>(vscode ? 'topology' : 'home');
  const [eventDef, setEventDef] = useState<Record<string, unknown> | null>(null);
  const [dirty, setDirty] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<{ manufacturer: string; model: string } | null>(null);
  const [lightMode, setLightMode] = useState(false);

  const csrRef = useRef<typeof csr>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const eventDefInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { csrRef.current = csr; }, [csr]);

  useEffect(() => {
    if (lightMode) document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    return () => { document.documentElement.removeAttribute('data-theme'); };
  }, [lightMode]);

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

  useEffect(() => {
    if (!vscode) return;
    vscode.postMessage({ type: 'getInitialContent' });
    function handleMessage(event: MessageEvent) {
      const msg = event.data as { type: string; content?: string; uri?: string; eventDef?: Record<string, unknown> };
      if (msg.type === 'initialContent' && msg.content) {
        loadCsr(msg.content);
        if (msg.uri) setFileName(msg.uri.split('/').pop() || 'csr.sr');
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
          setActiveView('topology');
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
      setActiveView('topology');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleEventDefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { setEventDef(JSON.parse(reader.result as string)); }
      catch { alert('event_def.json 解析失败'); }
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

  const handleNavTo = useCallback((viewId: ViewId) => {
    if (viewId === 'home') {
      if (dirty && !window.confirm('有未保存的修改，确定要返回项目列表？')) return;
      setCsr(null);
      setCurrentProjectId(null);
      setCurrentProject(null);
      setFileName('');
      setDirty(false);
      setActiveView('home');
      return;
    }
    if (CSR_REQUIRED.has(viewId) && !csrRef.current) {
      setActiveView('home');
      return;
    }
    setActiveView(viewId);
  }, [dirty]);

  // VSCode: wait for extension to push content
  if (vscode && !csr) {
    return <div className="view-loading">正在加载 CSR 文件…</div>;
  }

  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL || '/';
  const vueSrc  = base.endsWith('/') ? base + 'vue-topo/index.html'  : base + '/vue-topo/index.html';
  const threeDSrc = base.endsWith('/') ? base + '3d-viewer/index.html' : base + '/3d-viewer/index.html';
  const modelInfo = currentProject ? parseModelInfo(currentProject.model) : null;

  // ── Content area ───────────────────────────────────────────────────────
  function renderContent() {
    switch (activeView) {
      case 'home':
        return (
          <>
            <input ref={fileInputRef} type="file" accept=".sr,.json,application/json" onChange={handleFileUpload} style={{ display: 'none' }} />
            <input ref={eventDefInputRef} type="file" accept=".json" onChange={handleEventDefUpload} style={{ display: 'none' }} />
            <ProjectList
              projects={HARDWARE_PROJECTS}
              onSelect={handleProjectSelect}
              onUpload={() => fileInputRef.current?.click()}
              onOpenView={(id) => handleNavTo(id as ViewId)}
            />
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
              <button onClick={() => eventDefInputRef.current?.click()} className="btn-secondary">
                上传 event_def.json
              </button>
            </div>
          </>
        );
      case 'topology':
        return csr ? <TopologyView csr={csr} onChange={handleCsrChange} projectId={currentProjectId} /> : null;
      case 'boardTopology':
        return (currentProjectId === 'huawei-tianchi' && csr) ? <TianChiBoardTopologyView /> : null;
      case 'association':
        return csr ? <SoftwareHardwareAssociationView csr={csr} /> : null;
      case 'event':
        return csr ? <EventConfig csr={csr} eventDef={eventDef} onChange={handleCsrChange} /> : null;
      case 'sensor':
        return csr ? <SensorConfig csr={csr} onChange={handleCsrChange} /> : null;
      case 'simulator':
        return csr ? <Simulator csr={csr} /> : null;
      case 'vueTopo':
        return <iframe src={vueSrc} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} title="CSR拓扑Vue视图" />;
      case 'hwTopology':
        return <HardwareTopologyCanvas />;
      case 'serverView':
        return <ServerAssociationView />;
      case 'threeD':
        return <iframe src={threeDSrc} style={{ width: '100%', height: '100%', border: 'none' }} title="3D仿真视图" />;
      case 'smcOffset':
        return <iframe src={`${vueSrc}#smc`} style={{ width: '100%', height: '100%', border: 'none' }} title="SMC偏移量计算器" />;
      case 'exprCalc':
        return <iframe src={`${vueSrc}#expr`} style={{ width: '100%', height: '100%', border: 'none' }} title="批量表达式计算器" />;
      case 'coolingConfig':
        return <iframe src={`${vueSrc}#cooling`} style={{ width: '100%', height: '100%', border: 'none' }} title="能效调速配置模板" />;
      default:
        return null;
    }
  }

  // ── Activity rail items ────────────────────────────────────────────────
  type RailItem = { id: ViewId; tooltip: string };

  const primaryItems: RailItem[] = [
    { id: 'home',         tooltip: '项目列表' },
    { id: 'topology',     tooltip: '拓扑视图' },
    ...(currentProjectId === 'huawei-tianchi' ? [{ id: 'boardTopology' as ViewId, tooltip: '板卡拓扑' }] : []),
    { id: 'association',  tooltip: '软硬件关联' },
    { id: 'event',        tooltip: '事件配置' },
    { id: 'sensor',       tooltip: '传感器配置' },
    { id: 'simulator',    tooltip: '仿真调试' },
  ];

  const secondaryItems: RailItem[] = [
    { id: 'hwTopology',    tooltip: '硬件拓扑' },
    { id: 'threeD',        tooltip: '3D仿真' },
    { id: 'vueTopo',       tooltip: 'CSR拓扑' },
    { id: 'serverView',    tooltip: '服务器视图' },
    { id: 'smcOffset',     tooltip: 'SMC计算' },
    { id: 'exprCalc',      tooltip: '表达式计算' },
    { id: 'coolingConfig', tooltip: '能效配置' },
  ];

  return (
    <div className="pto-ide-frame pto-ide-frame--page" data-ide-frame>
      {/* ── Topbar ── */}
      <div className="pto-ide-frame__topbar">
        <div className="pto-ide-frame__topbar-left">
          <span className="brand-logo">T</span>
          {modelInfo ? (
            <>
              <span className="header-server-name">{modelInfo.name}</span>
              {modelInfo.badge && <span className="header-model-badge">{modelInfo.badge}</span>}
            </>
          ) : (
            <span className="header-server-name" style={{ opacity: 0.5 }}>openUBMC Studio</span>
          )}
        </div>
        <div className="pto-ide-frame__topbar-center" />
        <div className="pto-ide-frame__topbar-right">
          <button
            className={`btn-text ${lightMode ? 'toggle-on' : ''}`}
            onClick={() => setLightMode((v) => !v)}
            style={{ fontSize: 14, padding: '0 6px' }}
            title="切换深浅色"
          >{lightMode ? '☀' : '🌙'}</button>
          {csr && (
            <button
              onClick={handleSave}
              className="btn-primary"
              disabled={!dirty}
              title={dirty ? (vscode ? '保存 CSR 文件' : '下载 CSR 文件') : '暂无修改'}
            >{vscode ? '保存' : 'CSR出包'}</button>
          )}
        </div>
      </div>

      {/* ── Body: activity rail + content ── */}
      <div className="pto-ide-frame__body">
        <nav className="pto-ide-frame__activity-rail ide-activity-rail">
          <div className="ide-rail-section">
            {primaryItems.map((item) => (
              <button
                key={item.id}
                className={`pto-ide-frame__rail-button ${activeView === item.id ? 'is-selected' : ''}`}
                onClick={() => handleNavTo(item.id)}
                title={item.tooltip}
              >
                {ICONS[item.id]}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div className="ide-rail-section" style={{ paddingBottom: 10 }}>
            {secondaryItems.map((item) => (
              <button
                key={item.id}
                className={`pto-ide-frame__rail-button ${activeView === item.id ? 'is-selected' : ''}`}
                onClick={() => handleNavTo(item.id)}
                title={item.tooltip}
              >
                {ICONS[item.id]}
              </button>
            ))}
          </div>
        </nav>

        <div className="pto-ide-frame__workarea">
          <main className="pto-ide-frame__pane pto-ide-frame__pane--stack" style={{ flex: 1 }}>
            <div className="pto-ide-frame__pane-body" style={{ overflow: 'hidden', position: 'relative' }}>
              <Suspense fallback={<ViewLoader />}>
                {renderContent()}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
