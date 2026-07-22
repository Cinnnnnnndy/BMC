import React, { useEffect, useRef } from 'react';
import { withBase } from './base';

/*
 * CSR 拓扑编辑器（csr-topo-ext webview）Web 端桥接。
 *
 * 该 webview 原本运行在 VS Code 扩展里，靠扩展宿主回应它的请求：板卡文件清单、
 * 单个 .sr 文件内容等。在 Web 里我们让 index.html 的 shim 把 webview 的出站消息
 * 转发到父窗口，由这里充当“宿主”：
 *   - 用 public/sr-samples/ 里的板卡样例库回应文件清单（让连接器能按 Bom/Type 解析）
 *   - 按需回应单个板卡文件内容（硬件 .sr 与 _soft.sr 合并为一个板卡描述符）
 *   - 默认加载示例工程根板（EXU 拓展板 14100513_920s），直接进入拓扑状态
 *
 * webview 侧消息协议（逆向自 bundle）：
 *   入站(host→webview): showTopologyView{data:{rootSrData,rootSrPath}}、
 *     allSrMetadata{data}、srFilesData{files}、srFileContent{path,data}、
 *     configLoaded{config}、initializeBoardName{boardName}、
 *     showSrManagementTopology{srPath,srData}、configListResponse{configs,…}
 *   出站(webview→host): webviewReady、loadAllSrMetadata、requestSrFiles、
 *     loadSrFile{path}、loadSrManagementTopology{path}、loadConfig、
 *     configListRequest、nodeSelected{nodeId}（硬件管理器左树点击）
 */

const ROOT_FILE = '14100513_920s.sr';

interface ManifestBoard {
  filename: string;
  unitType: string;
  hasUnit: boolean;
  soft: string | null;
}
interface ManifestAlias {
  /** exact filename a connector looks for, e.g. `<Bom>.sr` */
  filename: string;
  unitType: string;
  /** the real board file to serve for this alias */
  from: string;
}
interface PoolEntry {
  filename: string;
  fullPath: string;
  relativePath: string;
  unitType: string;
  hasUnit: boolean;
}
interface Pool {
  /** metadata grouped by unitType, as the webview's file index expects */
  metaByType: Record<string, PoolEntry[]>;
  /** fullPath -> merged (hw + _soft) parsed board descriptor */
  contentByPath: Map<string, unknown>;
  /** merged root board descriptor (rootSrData) */
  root: unknown | null;
}

/** String-aware JSONC comment stripper (.sr files may carry line and block comments). */
function stripJsonc(src: string): string {
  let out = '';
  let i = 0;
  const n = src.length;
  let inStr = false;
  let q = '';
  let esc = false;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (inStr) {
      out += c;
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === q) inStr = false;
      i++;
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; q = c; out += c; i++; continue; }
    if (c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    out += c;
    i++;
  }
  return out;
}

async function fetchSr(filename: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(withBase('sr-samples/' + filename));
    if (!res.ok) return null;
    return JSON.parse(stripJsonc(await res.text()));
  } catch {
    return null;
  }
}

/** Merge a hardware descriptor with its _soft pair into one board descriptor. */
function mergeSoft(hw: Record<string, unknown>, soft: Record<string, unknown> | null): Record<string, unknown> {
  if (!soft) return hw;
  const hwObjects = (hw.Objects as Record<string, Record<string, unknown>>) ?? {};
  const softObjects = (soft.Objects as Record<string, Record<string, unknown>>) ?? {};
  const objects: Record<string, Record<string, unknown>> = {};
  for (const [k, v] of Object.entries(hwObjects)) objects[k] = { ...v };
  for (const [k, v] of Object.entries(softObjects)) objects[k] = { ...(objects[k] ?? {}), ...v };
  return { ...hw, Objects: objects };
}

let poolPromise: Promise<Pool> | null = null;

// 板卡显示配置（unit_type→node_type/尺寸/SVG 映射），来自扩展 resources/topology/。
// webview canvas 在 mount 时发 loadConfig 请求，答以该 JSON 后板卡才按正确造型渲染。
let boardTypesPromise: Promise<unknown | null> | null = null;
function loadBoardTypes(): Promise<unknown | null> {
  if (boardTypesPromise) return boardTypesPromise;
  boardTypesPromise = (async () => {
    try {
      const res = await fetch(withBase('csr-topo-ext/resources/topology/board-types.json'));
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  })();
  return boardTypesPromise;
}

/** Load the sr-samples board library once (cached across mounts). */
function loadPool(): Promise<Pool> {
  if (poolPromise) return poolPromise;
  poolPromise = (async (): Promise<Pool> => {
    const metaByType: Record<string, PoolEntry[]> = {};
    const contentByPath = new Map<string, unknown>();
    let root: unknown | null = null;
    let manifest: { boards: ManifestBoard[]; aliases?: ManifestAlias[] };
    try {
      const res = await fetch(withBase('sr-samples/manifest.json'));
      manifest = await res.json();
    } catch {
      return { metaByType, contentByPath, root };
    }
    await Promise.all(
      (manifest.boards ?? []).map(async (b) => {
        const hw = await fetchSr(b.filename);
        if (!hw) return;
        const soft = b.soft ? await fetchSr(b.soft) : null;
        const merged = mergeSoft(hw, soft);
        contentByPath.set(b.filename, merged);
        if (b.filename === ROOT_FILE) root = merged;
        const entry: PoolEntry = {
          filename: b.filename,
          fullPath: b.filename,
          relativePath: b.filename,
          unitType: b.unitType,
          hasUnit: b.hasUnit,
        };
        (metaByType[b.unitType] ??= []).push(entry);
      }),
    );
    // Exact-match aliases: the sample project's downstream connectors carry no
    // Id/AuxId, so the editor resolves them by the exact filename `<Bom>.sr`.
    // Register those names against a real board so the slots auto-resolve and
    // render (BCU / SEU / CLU / PSU) instead of staying as "请选择板卡文件".
    for (const a of manifest.aliases ?? []) {
      const content = contentByPath.get(a.from);
      if (!content) continue;
      contentByPath.set(a.filename, content);
      (metaByType[a.unitType] ??= []).push({
        filename: a.filename,
        fullPath: a.filename,
        relativePath: a.filename,
        unitType: a.unitType,
        hasUnit: true,
      });
    }
    // Auto-resolve for the demo: the editor only auto-loads a board when a
    // connector matches a file by exact filename (IdentifyMode 2). The sample
    // root marks most downstream slots IdentifyMode 3 (resolve by type → manual
    // pick). For every connector whose expected file `<Bom>_<Id>_<AuxId>.sr` we
    // actually have (a real file or an alias), pin it to IdentifyMode 2 so the
    // slot resolves and renders; connectors with no matching file are left as-is
    // (they stay as a "请选择板卡文件" picker).
    if (root && typeof root === 'object') {
      const objs = (root as { Objects?: Record<string, Record<string, unknown>> }).Objects ?? {};
      for (const [k, c] of Object.entries(objs)) {
        if (!k.startsWith('Connector_') || !c || typeof c !== 'object') continue;
        const bom = String(c.Bom ?? '');
        const id = String(c.Id ?? '');
        const aux = String(c.AuxId ?? '');
        const expected = [bom, id, aux].filter(Boolean).join('_') + '.sr';
        if (contentByPath.has(expected)) c.IdentifyMode = 2;
      }
    }
    return { metaByType, contentByPath, root };
  })();
  return poolPromise;
}

/** 顶栏配置下拉：单配置演示。webview 的 configListRequest 可能早于桥接注册
 *  发出而被漏掉，因此 sendInit 里也主动推送一次（幂等）。 */
function postConfigList(post: (msg: unknown) => void): void {
  post({
    command: 'configListResponse',
    configs: [{ id: 'config-0', name: '配置1', topologyConfig: { Root: { children: [] } }, createdAt: '2026-01-01T00:00:00.000Z' }],
    activeConfigId: 'config-0',
    repos: {},
    activeTopologyConfig: { Root: { children: [] } },
  });
}

/**
 * Attach the host-side bridge to a csr-topo-ext iframe. Returns a cleanup fn.
 */
function attachBridge(iframe: HTMLIFrameElement): () => void {
  let disposed = false;
  const post = (msg: unknown) => {
    const win = iframe.contentWindow;
    if (win) win.postMessage(msg, '*');
  };

  const poolReady = loadPool();

  const sendInit = async () => {
    const pool = await poolReady;
    if (disposed) return;
    // 1) 机型名（硬件管理器左树信息栏）：取示例根板 Unit.Name，兜底「示例工程」
    const rootUnit = (pool.root as { Unit?: { Name?: string } } | null)?.Unit;
    post({ command: 'initializeBoardName', boardName: rootUnit?.Name || '示例工程' });
    // 2) provide the board-file index (both message shapes the webview accepts)
    post({ command: 'srFilesData', files: pool.metaByType });
    post({ command: 'allSrMetadata', data: pool.metaByType });
    // 2.5) 配置下拉数据（webview 首次 configListRequest 可能在桥接注册前发出）
    postConfigList(post);
    // 3) load the sample project's root board -> renders the topology
    if (pool.root) {
      post({ command: 'showTopologyView', data: { rootSrData: pool.root, rootSrPath: ROOT_FILE } });
    }
  };

  const onMessage = async (ev: MessageEvent) => {
    if (ev.source !== iframe.contentWindow) return;
    const data = ev.data as { command?: string; path?: string; srPath?: string } | null;
    if (!data || typeof data.command !== 'string') return;
    const pool = await poolReady;
    if (disposed) return;
    switch (data.command) {
      case 'webviewReady':
        sendInit();
        break;
      case 'loadAllSrMetadata':
        post({ command: 'allSrMetadata', data: pool.metaByType });
        break;
      case 'requestSrFiles':
        post({ command: 'srFilesData', files: pool.metaByType });
        break;
      case 'loadConfig': {
        const cfg = await loadBoardTypes();
        if (disposed) return;
        if (cfg) post({ command: 'configLoaded', config: cfg });
        break;
      }
      case 'configListRequest':
        postConfigList(post);
        break;
      case 'loadSrFile': {
        const p = (data.path || '').replace(/\\/g, '/');
        post({ command: 'srFileContent', path: data.path, data: pool.contentByPath.get(p) ?? null });
        break;
      }
      // 单板卡配置视图入口 ×2：硬件管理器左树点击（nodeSelected.nodeId）、
      // 画布双击板卡（loadSrManagementTopology.path）。standalone 传 false，
      // 保持左树可见 + 返回按钮可回到板间拓扑。
      case 'nodeSelected':
      case 'loadSrManagementTopology': {
        const raw = data.path || data.srPath || (data as { nodeId?: string }).nodeId || '';
        const p = raw.replace(/\\/g, '/');
        const content = pool.contentByPath.get(p) ?? null;
        post({ command: 'showSrManagementTopology', srPath: raw, srData: content, standalone: false });
        break;
      }
      default:
        break;
    }
  };

  window.addEventListener('message', onMessage);
  // The webview registers its listener shortly after mount and posts
  // `webviewReady`; if we miss it, push the init a few times defensively.
  sendInit();
  const t1 = window.setTimeout(sendInit, 400);
  const t2 = window.setTimeout(sendInit, 1200);

  return () => {
    disposed = true;
    window.removeEventListener('message', onMessage);
    window.clearTimeout(t1);
    window.clearTimeout(t2);
  };
}

/** CSR 拓扑编辑器 iframe，自带 web 端桥接（默认加载示例工程 + 板卡样例库）。 */
export function CsrTopoFrame({ src }: { src: string }) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src={src}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title="CSR拓扑编辑器"
      onLoad={() => {
        cleanupRef.current?.();
        cleanupRef.current = ref.current ? attachBridge(ref.current) : null;
      }}
    />
  );
}
