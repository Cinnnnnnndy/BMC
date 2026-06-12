/**
 * AscendSupernodeView — 昇腾超节点模型（首页独立视图）
 *
 * 三级下钻 + 拓扑视图：
 *   全景总览（16 机柜）→ 机柜视图（电源/刀片/液冷）→ 节点视图（910C/鲲鹏/L1）
 *   互联拓扑（48 节点 × 7 UB 平面两层 Clos）
 *
 * 基线机型 Atlas 900 A3 SuperPoD (CloudMatrix 384)；数据与来源见 supernode/data.ts。
 * 全程序化建模（无 GLB），方法论见 docs/open-source-3d-model-pipeline.md §9。
 */
import { useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  RACKS, INFO, SOURCES, SUPERNODE_SPEC, UB_PLANE_COLORS, RDMA_COLOR, VPC_COLOR,
  type RackInfo, type ViewMode,
} from '../supernode/data';
import { OverviewScene, RackScene, NodeScene, TopologyScene } from '../supernode/scenes';

// 每个视图模式的初始相机位与注视点
const CAMERA: Record<ViewMode, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: { pos: [7.5, 5.5, 9.5], target: [0, 1.0, 0] },
  rack:     { pos: [4.6, 4.4, 8.6], target: [0, 2.8, 0] },
  node:     { pos: [2.4, 2.6, 3.0], target: [0, 0.5, 0] },
  topology: { pos: [0, 9, 14], target: [0, 2.8, 0] },
};

const MODE_TABS: { id: ViewMode; label: string }[] = [
  { id: 'overview', label: '全景总览' },
  { id: 'rack',     label: '机柜视图' },
  { id: 'node',     label: '节点视图' },
  { id: 'topology', label: '互联拓扑' },
];

export function AscendSupernodeView() {
  const [mode, setMode] = useState<ViewMode>('overview');
  const [rack, setRack] = useState<RackInfo>(RACKS.find((r) => r.kind === 'compute')!);
  const [nodeSlot, setNodeSlot] = useState(0);
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [nodeSubMode, setNodeSubMode] = useState<'compute' | 'ubswitch'>('compute');

  const onHoverInfo = useCallback((t: string | null) => setHoverInfo(t), []);

  const infoKey =
    mode === 'overview' ? 'overview' :
    mode === 'rack' ? (rack.kind === 'compute' ? 'computeRack' : 'switchRack') :
    mode === 'node' ? 'node' : 'topology';
  const info = INFO[infoKey];

  const breadcrumb: { label: string; onClick?: () => void }[] = [
    { label: '超节点', onClick: mode !== 'overview' ? () => setMode('overview') : undefined },
  ];
  if (mode === 'rack' || mode === 'node') {
    breadcrumb.push({ label: rack.label, onClick: mode === 'node' ? () => setMode('rack') : undefined });
  }
  if (mode === 'node') {
    breadcrumb.push({ label: `节点 ${nodeSlot + 1}` });
  }

  const cam = CAMERA[mode];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#eef2f8', color: '#1e2a3a' }}>
      {/* ── 工具栏 ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 14px', borderBottom: '1px solid #d0dae8', flexWrap: 'wrap', background: 'white' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {MODE_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              style={{
                padding: '5px 14px', fontSize: 12, borderRadius: 5, cursor: 'pointer',
                border: `1px solid ${mode === t.id ? '#0284c7' : '#d0dae8'}`,
                background: mode === t.id ? 'rgba(2,132,199,0.1)' : 'transparent',
                color: mode === t.id ? '#0284c7' : '#64748b',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* 节点子模式切换 */}
        {mode === 'node' && (
          <div style={{ display: 'flex', gap: 4, borderLeft: '1px solid #d0dae8', paddingLeft: 12 }}>
            {[{ id: 'compute', label: '计算节点' }, { id: 'ubswitch', label: '灵衢总线设备' }].map((t) => (
              <button key={t.id} onClick={() => setNodeSubMode(t.id as 'compute' | 'ubswitch')} style={{
                padding: '4px 12px', fontSize: 11.5, borderRadius: 4, cursor: 'pointer',
                border: `1px solid ${nodeSubMode === t.id ? '#0284c7' : '#d0dae8'}`,
                background: nodeSubMode === t.id ? 'rgba(2,132,199,0.1)' : 'transparent',
                color: nodeSubMode === t.id ? '#0284c7' : '#64748b',
              }}>{t.label}</button>
            ))}
          </div>
        )}
        {/* 面包屑 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          {breadcrumb.map((b, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ color: '#94a3b8' }}>›</span>}
              <span
                onClick={b.onClick}
                style={b.onClick ? { cursor: 'pointer', color: '#0284c7' } : { color: '#374151' }}
              >
                {b.label}
              </span>
            </span>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#64748b' }}>{SUPERNODE_SPEC.name} · 384× 910C · 灵衢 UB 全互联</span>
        <button
          onClick={() => setPanelOpen((v) => !v)}
          style={{ padding: '4px 10px', fontSize: 12, borderRadius: 5, cursor: 'pointer', border: '1px solid #d0dae8', background: 'transparent', color: '#64748b' }}
        >
          {panelOpen ? '收起信息 ▸' : '◂ 信息面板'}
        </button>
      </div>

      {/* ── 主区：Canvas + 信息面板 ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <Canvas
            key={mode}    /* 切换视图时重置相机与控制器 */
            camera={{ position: cam.pos, fov: 42 }}
            shadows
            dpr={[1, 2]}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            onCreated={({ gl }) => { gl.shadowMap.type = THREE.PCFSoftShadowMap; }}
          >
            <color attach="background" args={['#eef2f8']} />
            <fog attach="fog" args={['#eef2f8', 22, 46]} />
            <ambientLight intensity={1.8} />
            <directionalLight
              position={[8, 12, 6]}
              intensity={1.2}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-12} shadow-camera-right={12}
              shadow-camera-top={12} shadow-camera-bottom={-12}
            />
            <pointLight position={[0, 8, 0]} intensity={1.0} color="#e8f0ff" />

            {mode === 'overview' && (
              <OverviewScene
                onHoverInfo={onHoverInfo}
                onSelectRack={(r) => { setRack(r); setMode('rack'); }}
              />
            )}
            {mode === 'rack' && (
              <RackScene
                rack={rack}
                onHoverInfo={onHoverInfo}
                onSelectNode={(slot) => { setNodeSlot(slot); setMode('node'); }}
              />
            )}
            {mode === 'node' && <NodeScene onHoverInfo={onHoverInfo} nodeType={nodeSubMode} />}
            {mode === 'topology' && <TopologyScene onHoverInfo={onHoverInfo} />}

            <OrbitControls
              target={cam.target}
              enableDamping
              dampingFactor={0.08}
              minPolarAngle={0.1}
              maxPolarAngle={Math.PI / 2 - 0.04}
              minDistance={1.2}
              maxDistance={30}
            />
          </Canvas>

          {/* 悬停信息浮条 */}
          {hoverInfo && (
            <div style={{
              position: 'absolute', left: 14, bottom: 14, maxWidth: '70%',
              padding: '7px 12px', fontSize: 12.5, lineHeight: 1.5,
              background: 'rgba(255,255,255,0.95)', border: '1px solid #d0dae8', borderRadius: 6,
              color: '#1e2a3a', pointerEvents: 'none',
            }}>
              {hoverInfo}
            </div>
          )}

          {/* 拓扑图例 */}
          {mode === 'topology' && (
            <div style={{
              position: 'absolute', right: 14, bottom: 14, padding: '8px 12px', fontSize: 11.5,
              background: 'rgba(255,255,255,0.95)', border: '1px solid #d0dae8', borderRadius: 6,
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', maxWidth: 230 }}>
                {UB_PLANE_COLORS.map((c, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 10, height: 3, background: c, display: 'inline-block', borderRadius: 1 }} />
                    <span style={{ color: '#64748b' }}>P{i + 1}</span>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 3, background: RDMA_COLOR, display: 'inline-block', borderRadius: 1 }} />
                  <span style={{ color: '#64748b' }}>RDMA</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 3, background: VPC_COLOR, display: 'inline-block', borderRadius: 1 }} />
                  <span style={{ color: '#64748b' }}>VPC</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── 右侧信息面板 ── */}
        {panelOpen && (
          <div style={{
            width: 295, borderLeft: '1px solid #d0dae8', padding: '14px 16px',
            overflowY: 'auto', fontSize: 12.5, lineHeight: 1.65, flexShrink: 0,
            background: 'white', color: '#1e2a3a',
          }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0284c7', marginBottom: 8 }}>{info.title}</div>
            <ul style={{ margin: 0, paddingLeft: 16, color: '#374151' }}>
              {info.lines.map((l, i) => (
                <li key={i} style={{ marginBottom: 5 }}>{l}</li>
              ))}
            </ul>

            <div style={{ margin: '14px 0 6px', fontSize: 12, fontWeight: 600, color: '#374151' }}>关键规格</div>
            <table style={{ width: '100%', fontSize: 11.5, color: '#374151', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['NPU 总数', `${SUPERNODE_SPEC.totalNpus}× 昇腾 910C`],
                  ['CPU 总数', `${SUPERNODE_SPEC.totalCpus}× 鲲鹏 920`],
                  ['FP16 算力', `${SUPERNODE_SPEC.fp16Pflops} PFLOPS`],
                  ['HBM 总量', `${SUPERNODE_SPEC.totalHbmTB} TB 统一编址`],
                  ['UB 带宽/NPU', `${SUPERNODE_SPEC.npuUbGBs} GB/s 单向`],
                  ['单跳时延', `${SUPERNODE_SPEC.hopLatencyNs} ns`],
                  ['散热', SUPERNODE_SPEC.cooling],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: '1px solid #e8eef6' }}>
                    <td style={{ padding: '3px 0', color: '#64748b', whiteSpace: 'nowrap' }}>{k}</td>
                    <td style={{ padding: '3px 0 3px 10px', color: '#1e2a3a' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ margin: '14px 0 6px', fontSize: 12, fontWeight: 600, color: '#374151' }}>数据来源</div>
            <div style={{ fontSize: 10.5, color: '#64748b', lineHeight: 1.7 }}>
              {SOURCES.map((s, i) => (<div key={i}>{s}</div>))}
            </div>
            <div style={{ marginTop: 10, fontSize: 10.5, color: '#64748b', fontStyle: 'italic' }}>
              注：机柜外形采用官方 2250×600×1150mm；柜内/板内布局为基于公开资料的抽象示意。
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
