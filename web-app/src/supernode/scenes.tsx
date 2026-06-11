/**
 * 昇腾超节点 — 3D 场景组件（全程序化建模，无 GLB 依赖）
 *
 * 四个场景由 AscendSupernodeView 按视图模式切换：
 *   OverviewScene  超节点全景：16 机柜（12 计算 + 4 总线）+ 柜间光互联
 *   RackScene      单机柜内部：电源/管理刀片/计算节点/液冷管路（参考展出实拍）
 *   NodeScene      计算节点刀片：8×910C + 4×鲲鹏 + 7×L1 交换芯片 + DPU + 光口
 *   TopologyScene  灵衢两层 Clos：48 节点 × 7 UB 平面上行 + RDMA/VPC 平面
 *
 * 视觉语言沿用 docs/3d-libraries-and-patterns.md §7 的色板与材质参数。
 */
import { Suspense, useMemo, useRef, useState, type ComponentProps } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text as DreiText, Edges } from '@react-three/drei';
import * as THREE from 'three';
import {
  RACKS, RACK_DIM, ROW_GAP_Z, rackWorldPos,
  COMPUTE_RACK_UNITS, SWITCH_RACK_UNITS,
  NODE_DIM, NODE_PARTS,
  UB_PLANE_COLORS, RDMA_COLOR, VPC_COLOR, RACK_COLORS,
  type RackInfo, type RackUnit, type NodePart,
} from './data';

// ─── 共享回调类型 ─────────────────────────────────────────────────────────────
export interface SceneCallbacks {
  onHoverInfo: (text: string | null) => void;
}

const setCursor = (on: boolean) => { document.body.style.cursor = on ? 'pointer' : 'default'; };

// drei <Text> 通过 suspend-react 预加载字体（默认 CDN）。包一层局部 Suspense，
// 避免字体源不可达时 suspension 冒泡到外层、阻塞整个视图渲染。
function Text(props: ComponentProps<typeof DreiText>) {
  return (
    <Suspense fallback={null}>
      <DreiText {...props} />
    </Suspense>
  );
}

// ─── 通用：带描边的盒体 ──────────────────────────────────────────────────────
function Slab(props: {
  size: [number, number, number];
  position?: [number, number, number];
  color: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  edgeColor?: string;
  opacity?: number;
}) {
  const { size, position, color, metalness = 0.3, roughness = 0.6, emissive, emissiveIntensity = 0, edgeColor, opacity } = props;
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        emissive={emissive ?? '#000000'}
        emissiveIntensity={emissiveIntensity}
        transparent={opacity !== undefined}
        opacity={opacity ?? 1}
      />
      {edgeColor && <Edges color={edgeColor} threshold={20} />}
    </mesh>
  );
}

// ─── 地面 ────────────────────────────────────────────────────────────────────
function Floor({ size = 22 }: { size?: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#0b0e13" roughness={0.95} metalness={0.05} />
      </mesh>
      <gridHelper args={[size, size * 2, '#1c2a3a', '#131c28']} position={[0, 0.001, 0]} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. 全景：16 机柜 + 柜间光互联
// ═══════════════════════════════════════════════════════════════════════════

/** 单个机柜外观：黑色钣金 + 红色饰条 + 前面板单元发光槽（参考实拍 [6]） */
function RackBox({ rack, hovered, onClick, onHover }: {
  rack: RackInfo;
  hovered: boolean;
  onClick: () => void;
  onHover: (h: boolean) => void;
}) {
  const [x, , z] = rackWorldPos(rack);
  const isCompute = rack.kind === 'compute';
  const glow = isCompute ? RACK_COLORS.computeGlow : RACK_COLORS.switchGlow;
  // 前面板发光槽：计算柜对应 4 节点 + 电源；总线柜对应 7 个交换单元
  const units = isCompute ? COMPUTE_RACK_UNITS : SWITCH_RACK_UNITS;
  // 前门朝向通道：前排朝 +Z，后排朝 -Z
  const faceDir = rack.row === 0 ? 1 : -1;

  return (
    <group
      position={[x, 0, z]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); setCursor(true); }}
      onPointerOut={() => { onHover(false); setCursor(false); }}
    >
      {/* 柜体 */}
      <Slab
        size={[RACK_DIM.w, RACK_DIM.h, RACK_DIM.d]}
        position={[0, RACK_DIM.h / 2, 0]}
        color={RACK_COLORS.body}
        metalness={0.55} roughness={0.45}
        edgeColor={hovered ? glow : '#2a2f38'}
      />
      {/* 前门（深一阶） */}
      <Slab
        size={[RACK_DIM.w - 0.06, RACK_DIM.h - 0.08, 0.02]}
        position={[0, RACK_DIM.h / 2, faceDir * (RACK_DIM.d / 2 + 0.011)]}
        color={RACK_COLORS.door}
        metalness={0.4} roughness={0.6}
      />
      {/* 红色竖向饰条（实拍特征） */}
      <Slab
        size={[0.018, RACK_DIM.h - 0.12, 0.012]}
        position={[RACK_DIM.w / 2 - 0.05, RACK_DIM.h / 2, faceDir * (RACK_DIM.d / 2 + 0.024)]}
        color={RACK_COLORS.accent}
        emissive={RACK_COLORS.accent} emissiveIntensity={0.35}
        metalness={0.2} roughness={0.5}
      />
      {/* 单元发光槽 */}
      {units.filter((u) => u.type === 'node' || u.type === 'switch-unit' || u.type === 'power').map((u) => (
        <Slab
          key={u.id}
          size={[RACK_DIM.w - 0.14, Math.max(0.02, u.hFrac * RACK_DIM.h * 0.28), 0.008]}
          position={[0, (u.y0 + u.hFrac / 2) * RACK_DIM.h, faceDir * (RACK_DIM.d / 2 + 0.028)]}
          color={u.type === 'power' ? '#3a3f47' : glow}
          emissive={u.type === 'power' ? '#86efac' : glow}
          emissiveIntensity={hovered ? 0.9 : 0.4}
        />
      ))}
      {/* 顶部标签（悬停时浮现） */}
      {hovered && (
        <Text
          position={[0, RACK_DIM.h + 0.22, 0]}
          fontSize={0.16}
          color={glow}
          anchorX="center" anchorY="bottom"
          outlineWidth={0.008} outlineColor="#0b0e13"
        >
          {rack.id.startsWith('compute') ? `Compute ${rack.label.replace(/[^C0-9]/g, '')}` : `UB Switch ${rack.label.replace(/[^S0-9]/g, '')}`}
        </Text>
      )}
    </group>
  );
}

/** 柜间光互联束：每个计算柜顶 → 同排两个总线柜顶（弧线管） */
function OpticalLinks() {
  const geo = useMemo(() => {
    const group: THREE.TubeGeometry[] = [];
    const switches = RACKS.filter((r) => r.kind === 'switch');
    for (const c of RACKS.filter((r) => r.kind === 'compute')) {
      const [cx, , cz] = rackWorldPos(c);
      for (const s of switches.filter((s) => s.row === c.row)) {
        const [sx, , sz] = rackWorldPos(s);
        const mid = new THREE.Vector3((cx + sx) / 2, RACK_DIM.h + 0.5 + Math.abs(cx - sx) * 0.08, (cz + sz) / 2);
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(cx, RACK_DIM.h, cz),
          mid,
          new THREE.Vector3(sx, RACK_DIM.h, sz),
        );
        group.push(new THREE.TubeGeometry(curve, 24, 0.008, 5));
      }
    }
    return group;
  }, []);
  return (
    <group>
      {geo.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.32} />
        </mesh>
      ))}
    </group>
  );
}

export function OverviewScene({ onHoverInfo, onSelectRack }: SceneCallbacks & {
  onSelectRack: (rack: RackInfo) => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  return (
    <group>
      <Floor size={14} />
      {RACKS.map((rack) => (
        <RackBox
          key={rack.id}
          rack={rack}
          hovered={hoverId === rack.id}
          onClick={() => onSelectRack(rack)}
          onHover={(h) => {
            setHoverId(h ? rack.id : null);
            onHoverInfo(h
              ? rack.kind === 'compute'
                ? `${rack.label} · 4 计算节点 / 32× 910C / 16× 鲲鹏 920 · 液冷（点击下钻）`
                : `${rack.label} · 灵衢 L2 交换设备 · 全光互联 · 风冷（点击下钻）`
              : null);
          }}
        />
      ))}
      <OpticalLinks />
      {/* 冷通道标识 */}
      <Text position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.22} color="#1f4257" anchorX="center">
        COLD AISLE
      </Text>
      <Text position={[0, 0.02, ROW_GAP_Z / 2 + RACK_DIM.d + 0.8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.16} color="#173243" anchorX="center">
        Atlas 900 A3 SuperPoD - 16 Racks / 384 NPU
      </Text>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. 机柜内部
// ═══════════════════════════════════════════════════════════════════════════

/** 圆形液冷快接头（实拍：总线柜前面板的成组圆形接口） */
function QuickConnectors({ count, width }: { count: number; width: number }) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[(i - (count - 1) / 2) * (width / count), 0, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.02, 20]} />
          <meshStandardMaterial color="#23272e" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

/** 机柜内单元（刀片/电源/管路），按类型渲染前面板细节 */
function RackUnitMesh({ unit, rackKind, planeIdx, hovered, clickable, onClick, onHover }: {
  unit: RackUnit;
  rackKind: 'compute' | 'switch';
  planeIdx?: number;
  hovered: boolean;
  clickable: boolean;
  onClick?: () => void;
  onHover: (h: boolean) => void;
}) {
  const innerW = RACK_DIM.w * 2.6;       // 机柜视图放大 2.6 倍
  const innerD = RACK_DIM.d * 2.6;
  const rackH = RACK_DIM.h * 2.6;
  const h = unit.hFrac * rackH * 0.92;
  const y = (unit.y0 + unit.hFrac / 2) * rackH;
  const planeColor = planeIdx !== undefined ? UB_PLANE_COLORS[planeIdx % 7] : RACK_COLORS.computeGlow;

  const bodyColor =
    unit.type === 'power' ? '#3a404a' :
    unit.type === 'mgmt' ? '#2c3a4a' :
    unit.type === 'cdu' ? '#1c222b' :
    unit.type === 'switch-unit' ? '#272d37' : '#2a323d';

  return (
    <group
      position={[0, y, 0]}
      onClick={clickable ? (e) => { e.stopPropagation(); onClick?.(); } : undefined}
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); if (clickable) setCursor(true); }}
      onPointerOut={() => { onHover(false); setCursor(false); }}
    >
      <Slab
        size={[innerW - 0.12, h, innerD - 0.2]}
        color={bodyColor}
        metalness={0.3} roughness={0.55}
        edgeColor={hovered ? (rackKind === 'switch' ? planeColor : RACK_COLORS.computeGlow) : '#3d4654'}
      />
      {/* 前面板细节（朝 +Z） */}
      <group position={[0, 0, (innerD - 0.2) / 2]}>
        {unit.type === 'power' && (
          // 4 个电源模块 + 绿色 LED
          <group>
            {Array.from({ length: 4 }, (_, i) => (
              <group key={i} position={[(i - 1.5) * (innerW / 4.6), 0, 0.015]}>
                <Slab size={[innerW / 5.2, h * 0.7, 0.02]} color="#32373f" metalness={0.6} roughness={0.4} edgeColor="#3d434d" />
                <Slab size={[0.02, 0.02, 0.012]} position={[innerW / 12, h * 0.22, 0.014]} color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} />
              </group>
            ))}
          </group>
        )}
        {unit.type === 'mgmt' && (
          <group>
            <Slab size={[innerW * 0.7, h * 0.5, 0.02]} position={[-innerW * 0.06, 0, 0.012]} color="#10151c" edgeColor="#2c323c" />
            {Array.from({ length: 6 }, (_, i) => (
              <Slab key={i} size={[0.05, 0.026, 0.014]} position={[(i - 2.5) * 0.09 - innerW * 0.06, 0, 0.026]} color="#0a0e13" edgeColor="#39414d" />
            ))}
            <Slab size={[0.016, 0.016, 0.012]} position={[innerW * 0.36, 0, 0.018]} color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.1} />
          </group>
        )}
        {unit.type === 'node' && (
          <group>
            {/* 抽手柄 ×2 */}
            {[-1, 1].map((s) => (
              <Slab key={s} size={[0.05, h * 0.62, 0.03]} position={[s * (innerW / 2 - 0.16), 0, 0.02]} color="#3a3f47" metalness={0.6} roughness={0.4} />
            ))}
            {/* 通风格栅线 */}
            {Array.from({ length: 3 }, (_, i) => (
              <Slab key={i} size={[innerW * 0.62, 0.012, 0.012]} position={[0, (i - 1) * h * 0.26, 0.016]} color="#0c1016" />
            ))}
            {/* 液冷进出快接头 */}
            <group position={[0, -h * 0.32, 0.01]}>
              <QuickConnectors count={2} width={0.3} />
            </group>
            {/* 状态 LED */}
            <Slab size={[0.018, 0.018, 0.012]} position={[innerW * 0.33, h * 0.3, 0.018]} color={RACK_COLORS.computeGlow} emissive={RACK_COLORS.computeGlow} emissiveIntensity={hovered ? 1.6 : 0.9} />
          </group>
        )}
        {unit.type === 'switch-unit' && (
          <group>
            {/* 平面色条 */}
            <Slab size={[innerW * 0.78, 0.022, 0.014]} position={[0, h * 0.3, 0.016]} color={planeColor} emissive={planeColor} emissiveIntensity={0.8} />
            {/* 液冷快接头排（实拍特征：成组圆形接口） */}
            <group position={[0, -h * 0.12, 0.01]}>
              <QuickConnectors count={6} width={innerW * 0.72} />
            </group>
          </group>
        )}
        {unit.type === 'cdu' && (
          <group>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * innerW * 0.22, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.045, 0.045, 0.05, 16]} />
                <meshStandardMaterial color="#26527a" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
          </group>
        )}
      </group>
      {/* 左侧英文标签 */}
      <Text
        position={[-(innerW / 2) + 0.02, 0, (innerD - 0.2) / 2 + 0.04]}
        fontSize={0.072}
        color={hovered ? '#e2e8f0' : '#6b7686'}
        anchorX="left" anchorY="middle"
      >
        {unit.labelEn}
      </Text>
    </group>
  );
}

export function RackScene({ rack, onHoverInfo, onSelectNode }: SceneCallbacks & {
  rack: RackInfo;
  onSelectNode: (nodeSlot: number) => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const units = rack.kind === 'compute' ? COMPUTE_RACK_UNITS : SWITCH_RACK_UNITS;
  const innerW = RACK_DIM.w * 2.6;
  const innerD = RACK_DIM.d * 2.6;
  const rackH = RACK_DIM.h * 2.6;
  let switchPlane = 0;

  return (
    <group>
      <Floor size={12} />
      {/* 正面补光：照亮前面板细节（柜内单元朝 +Z） */}
      <pointLight position={[0, 4.2, 6]} intensity={55} color="#cfe8ff" />
      <pointLight position={[3.5, 1.4, 4.5]} intensity={22} color="#ffffff" />
      {/* 机柜框架（去前门的开放视图）：底座 + 双侧板 + 顶板 + 背板 */}
      <Slab size={[innerW + 0.1, 0.08, innerD + 0.1]} position={[0, 0.04, 0]} color="#101319" metalness={0.5} roughness={0.55} edgeColor="#262c36" />
      {[-1, 1].map((s) => (
        <Slab key={s} size={[0.05, rackH, innerD]} position={[s * (innerW / 2 + 0.05), rackH / 2 + 0.08, 0]} color={RACK_COLORS.body} metalness={0.55} roughness={0.45} edgeColor="#262c36" />
      ))}
      <Slab size={[innerW + 0.1, 0.06, innerD + 0.1]} position={[0, rackH + 0.11, 0]} color={RACK_COLORS.body} metalness={0.55} roughness={0.45} edgeColor="#262c36" />
      <Slab size={[innerW, rackH, 0.04]} position={[0, rackH / 2 + 0.08, -(innerD / 2 + 0.02)]} color="#0d1015" metalness={0.4} roughness={0.6} />
      {/* 红色饰条 */}
      <Slab size={[0.02, rackH, 0.02]} position={[innerW / 2 + 0.08, rackH / 2 + 0.08, innerD / 2 - 0.02]} color={RACK_COLORS.accent} emissive={RACK_COLORS.accent} emissiveIntensity={0.35} />

      {/* 内部单元 */}
      <group position={[0, 0.08, 0]}>
        {units.map((u) => {
          const planeIdx = u.type === 'switch-unit' ? switchPlane++ : undefined;
          return (
            <RackUnitMesh
              key={u.id}
              unit={u}
              rackKind={rack.kind}
              planeIdx={planeIdx}
              hovered={hoverId === u.id}
              clickable={u.type === 'node'}
              onClick={u.type === 'node' ? () => onSelectNode(u.nodeSlot!) : undefined}
              onHover={(h) => {
                setHoverId(h ? u.id : null);
                onHoverInfo(h ? `${u.label}${u.type === 'node' ? '（点击下钻查看刀片内部）' : ''}` : null);
              }}
            />
          );
        })}
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. 计算节点（刀片抽象）
// ═══════════════════════════════════════════════════════════════════════════

function NodePartMesh({ part, hovered, onHover }: {
  part: NodePart;
  hovered: boolean;
  onHover: (h: boolean) => void;
}) {
  const S = 3.2;       // 节点视图放大倍数
  const [px, py, pz] = part.pos;
  const [sx, sy, sz] = part.size;
  const planeIdx = part.type === 'ub-switch' ? Number(part.id.split('-')[1]) : 0;

  const visuals: Record<NodePart['type'], { body: string; top?: string; edge: string; em?: string }> = {
    npu:        { body: '#101418', top: '#b9bdc6', edge: '#4ade80' },
    cpu:        { body: '#15191f', top: '#c4c6cc', edge: '#38bdf8' },
    'ub-switch':{ body: '#12161c', top: UB_PLANE_COLORS[planeIdx % 7], edge: UB_PLANE_COLORS[planeIdx % 7] },
    dpu:        { body: '#1a2334', top: '#23304a', edge: '#818cf8' },
    optical:    { body: '#0d1117', edge: '#fbbf24' },
    dimm:       { body: '#11151b', edge: '#475263' },
  };
  const v = visuals[part.type];

  return (
    <group
      position={[px * S, py * S, pz * S]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); }}
      onPointerOut={() => onHover(false)}
    >
      {/* 基底封装 */}
      <Slab
        size={[sx * S, sy * S, sz * S]}
        color={v.body}
        metalness={0.35} roughness={0.6}
        edgeColor={hovered ? v.edge : '#39414d'}
      />
      {/* 顶面：NPU/CPU 冷板、UB 芯片平面色 die */}
      {v.top && (
        <Slab
          size={[sx * S * 0.82, sy * S * 0.5, sz * S * 0.82]}
          position={[0, sy * S * 0.62, 0]}
          color={v.top}
          metalness={part.type === 'ub-switch' ? 0.3 : 0.85}
          roughness={part.type === 'ub-switch' ? 0.5 : 0.3}
          emissive={part.type === 'ub-switch' ? v.top : undefined}
          emissiveIntensity={part.type === 'ub-switch' ? (hovered ? 0.9 : 0.35) : 0}
        />
      )}
      {/* NPU 冷板鳍片 + 双 die 分缝示意 */}
      {part.type === 'npu' && (
        <Slab size={[0.006 * S, sy * S * 0.56, sz * S * 0.84]} position={[0, sy * S * 0.64, 0]} color="#7e848e" metalness={0.8} roughness={0.35} />
      )}
      {/* 光口区：一排小端口 */}
      {part.type === 'optical' && (
        <group>
          {Array.from({ length: 14 }, (_, i) => (
            <Slab
              key={i}
              size={[0.028 * S, sy * S * 0.6, 0.008 * S]}
              position={[(i - 6.5) * 0.044 * S, 0, sz * S * 0.7]}
              color="#0a0e13"
              emissive="#fbbf24" emissiveIntensity={hovered ? 0.8 : 0.3}
            />
          ))}
        </group>
      )}
      {/* 丝印 */}
      {(part.type === 'npu' || part.type === 'cpu') && (
        <Text
          position={[0, sy * S * 0.92, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={part.type === 'npu' ? 0.062 : 0.045}
          color="#3c424c"
          anchorX="center" anchorY="middle"
        >
          {part.type === 'npu' ? 'ASCEND 910C' : 'KUNPENG 920'}
        </Text>
      )}
    </group>
  );
}

export function NodeScene({ onHoverInfo }: SceneCallbacks) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const S = 3.2;
  const w = NODE_DIM.w * S, h = NODE_DIM.h * S, d = NODE_DIM.d * S;

  return (
    <group>
      <Floor size={10} />
      <group position={[0, 0.5, 0]}>
        {/* 托盘：底板 + 低侧壁 */}
        <Slab size={[w + 0.12, 0.04, d + 0.12]} position={[0, -0.02, 0]} color="#1b1f26" metalness={0.6} roughness={0.45} edgeColor="#323845" />
        {[-1, 1].map((s) => (
          <Slab key={'w' + s} size={[0.03, h * 0.9, d + 0.12]} position={[s * (w / 2 + 0.045), h * 0.43, 0]} color="#22262e" metalness={0.6} roughness={0.45} />
        ))}
        {/* 主板 PCB */}
        <Slab size={[w, 0.018, d]} position={[0, 0.012, 0]} color="#13241c" metalness={0.1} roughness={0.85} edgeColor="#1f3a2c" />
        {/* 零件 */}
        {NODE_PARTS.map((p) => (
          <NodePartMesh
            key={p.id}
            part={p}
            hovered={hoverId === p.id}
            onHover={(hv) => { setHoverId(hv ? p.id : null); onHoverInfo(hv ? p.label : null); }}
          />
        ))}
        {/* 板内 UB 走线示意：每颗 NPU/CPU → 7 颗 L1 芯片方向的汇聚线 */}
        <UbBoardTraces />
      </group>
    </group>
  );
}

/** 板内走线：NPU/CPU 到 L1 交换芯片排的细发光线（单 BufferGeometry） */
function UbBoardTraces() {
  const S = 3.2;
  const { geo, colors } = useMemo(() => {
    const pts: number[] = [];
    const cols: number[] = [];
    const l1 = NODE_PARTS.filter((p) => p.type === 'ub-switch');
    const chips = NODE_PARTS.filter((p) => p.type === 'npu' || p.type === 'cpu');
    for (const c of chips) {
      for (let i = 0; i < l1.length; i++) {
        const t = l1[i];
        const col = new THREE.Color(UB_PLANE_COLORS[i % 7]);
        pts.push(c.pos[0] * S, 0.03, c.pos[2] * S, t.pos[0] * S, 0.03, t.pos[2] * S);
        cols.push(col.r, col.g, col.b, col.r, col.g, col.b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    return { geo: g, colors: cols };
  }, []);
  void colors;
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial vertexColors transparent opacity={0.16} />
    </lineSegments>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. 灵衢互联拓扑（两层 Clos 抽象）
// ═══════════════════════════════════════════════════════════════════════════

const TOPO = {
  nodeW: 0.34, nodeH: 0.1, nodeD: 0.5,
  colGap: 0.62, rackGap: 0.38, rowZ: 1.2,
  planeY: 3.0, planeGapY: 0.22,
  planeLen: 11.5, planeW: 0.34, planeH: 0.1,
  rdmaY: 5.2, vpcY: -0.0,
};

/** 节点底座位置：12 机柜 × 4 节点排成一行（X 轴），节点在 Z 向 2×2 小簇 */
function topoNodePos(nodeId: number): [number, number, number] {
  const rackIdx = Math.floor(nodeId / 4);    // 0..11
  const slot = nodeId % 4;                   // 0..3
  const baseX = (rackIdx - 5.5) * (2 * TOPO.colGap + TOPO.rackGap);
  const x = baseX + (slot % 2 === 0 ? -TOPO.colGap / 2 : TOPO.colGap / 2);
  const z = slot < 2 ? -TOPO.rowZ / 2 : TOPO.rowZ / 2;
  return [x, TOPO.nodeH / 2, z];
}

function planeY(planeIdx: number) {
  return TOPO.planeY + planeIdx * TOPO.planeGapY;
}

/** 48×7 上行链路（单 LineSegments，悬停节点时叠加高亮线） */
function UplinkLines({ highlightNode }: { highlightNode: number | null }) {
  const geo = useMemo(() => {
    const pts: number[] = [];
    const cols: number[] = [];
    for (let n = 0; n < 48; n++) {
      const [x, , z] = topoNodePos(n);
      for (let p = 0; p < 7; p++) {
        const col = new THREE.Color(UB_PLANE_COLORS[p]);
        pts.push(x, TOPO.nodeH, z, x + (p - 3) * 0.04, planeY(p), 0);
        cols.push(col.r, col.g, col.b, col.r, col.g, col.b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    return g;
  }, []);

  const hi = useMemo(() => {
    if (highlightNode === null) return null;
    const pts: number[] = [];
    const cols: number[] = [];
    const [x, , z] = topoNodePos(highlightNode);
    for (let p = 0; p < 7; p++) {
      const col = new THREE.Color(UB_PLANE_COLORS[p]);
      pts.push(x, TOPO.nodeH, z, x + (p - 3) * 0.04, planeY(p), 0);
      cols.push(col.r, col.g, col.b, col.r, col.g, col.b);
    }
    // RDMA（向上）+ VPC（向下）
    const rd = new THREE.Color(RDMA_COLOR);
    pts.push(x, TOPO.nodeH, z, x, TOPO.rdmaY, z * 0.4);
    cols.push(rd.r, rd.g, rd.b, rd.r, rd.g, rd.b);
    const vp = new THREE.Color(VPC_COLOR);
    pts.push(x, TOPO.nodeH / 2, z, x, 0.02, z + (z > 0 ? 1.6 : -1.6));
    cols.push(vp.r, vp.g, vp.b, vp.r, vp.g, vp.b);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    return g;
  }, [highlightNode]);

  return (
    <group>
      <lineSegments geometry={geo}>
        <lineBasicMaterial vertexColors transparent opacity={highlightNode === null ? 0.22 : 0.07} />
      </lineSegments>
      {hi && (
        <lineSegments geometry={hi}>
          <lineBasicMaterial vertexColors transparent opacity={0.95} linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
}

/** L2 平面条：7 条彩色横梁，每条上 16 个 L2 芯片刻度 */
function L2Planes({ onHoverInfo }: SceneCallbacks) {
  return (
    <group>
      {UB_PLANE_COLORS.map((c, p) => (
        <group key={p} position={[0, planeY(p), 0]}>
          <mesh
            onPointerOver={(e) => { e.stopPropagation(); onHoverInfo(`灵衢 L2 · UB 平面 ${p + 1}/7 · 16 颗交换芯片 · 每颗 48×28GB/s 端口，无收敛`); }}
            onPointerOut={() => onHoverInfo(null)}
          >
            <boxGeometry args={[TOPO.planeLen, TOPO.planeH, TOPO.planeW]} />
            <meshStandardMaterial color={c} transparent opacity={0.32} emissive={c} emissiveIntensity={0.25} metalness={0.2} roughness={0.6} />
          </mesh>
          {/* 16 颗 L2 芯片刻度 */}
          {Array.from({ length: 16 }, (_, i) => (
            <Slab
              key={i}
              size={[0.16, TOPO.planeH * 1.5, TOPO.planeW * 1.1]}
              position={[(i - 7.5) * (TOPO.planeLen / 16.4), 0, 0]}
              color={c}
              emissive={c} emissiveIntensity={0.6}
            />
          ))}
        </group>
      ))}
      <Text position={[TOPO.planeLen / 2 + 0.35, planeY(3), 0]} fontSize={0.2} color="#7dd3fc" anchorX="left">
        L2 UB x7 planes
      </Text>
    </group>
  );
}

/** RDMA / VPC 平面示意板 */
function ScaleOutPlanes() {
  return (
    <group>
      <mesh position={[0, TOPO.rdmaY, 0]}>
        <boxGeometry args={[TOPO.planeLen * 0.7, 0.06, 1.2]} />
        <meshStandardMaterial color={RDMA_COLOR} transparent opacity={0.18} emissive={RDMA_COLOR} emissiveIntensity={0.2} />
      </mesh>
      <Text position={[TOPO.planeLen * 0.35 + 0.3, TOPO.rdmaY, 0]} fontSize={0.18} color={RDMA_COLOR} anchorX="left">
        RDMA scale-out
      </Text>
    </group>
  );
}

/** 旋转缓动入场的拓扑节点 */
function TopoNode({ nodeId, hovered, onHover }: {
  nodeId: number;
  hovered: boolean;
  onHover: (h: boolean) => void;
}) {
  const [x, y, z] = topoNodePos(nodeId);
  const rackIdx = Math.floor(nodeId / 4);
  return (
    <group position={[x, y, z]}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); setCursor(true); }}
        onPointerOut={() => { onHover(false); setCursor(false); }}
        castShadow
      >
        <boxGeometry args={[TOPO.nodeW, TOPO.nodeH, TOPO.nodeD]} />
        <meshStandardMaterial
          color={hovered ? '#1d4044' : '#172028'}
          metalness={0.4} roughness={0.55}
          emissive={RACK_COLORS.computeGlow}
          emissiveIntensity={hovered ? 0.55 : 0.1}
        />
        <Edges color={hovered ? RACK_COLORS.computeGlow : '#2b333f'} threshold={20} />
      </mesh>
      {nodeId % 4 === 0 && (
        <Text position={[-TOPO.colGap / 2, -0.16, TOPO.rowZ / 2 + 0.5]} fontSize={0.12} color="#3e4a59" anchorX="center">
          {`C${rackIdx + 1}`}
        </Text>
      )}
    </group>
  );
}

export function TopologyScene({ onHoverInfo }: SceneCallbacks) {
  const [hoverNode, setHoverNode] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  // 轻微呼吸：平面发光层缓慢起伏，提示数据流动
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      if (child.name === 'plane-pulse') {
        const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        m.emissiveIntensity = 0.2 + 0.12 * Math.sin(clock.elapsedTime * 1.2 + i);
      }
    });
  });

  return (
    <group ref={groupRef}>
      <Floor size={18} />
      {Array.from({ length: 48 }, (_, n) => (
        <TopoNode
          key={n}
          nodeId={n}
          hovered={hoverNode === n}
          onHover={(h) => {
            setHoverNode(h ? n : null);
            onHoverInfo(h
              ? `计算节点 #${n + 1}（计算柜 C${Math.floor(n / 4) + 1} 槽位 ${n % 4 + 1}）· 8× 910C / 4× 鲲鹏 · 7 条 UB 上行 + RDMA + VPC`
              : null);
          }}
        />
      ))}
      <UplinkLines highlightNode={hoverNode} />
      <L2Planes onHoverInfo={onHoverInfo} />
      <ScaleOutPlanes />
      <Text position={[0, -0.02, TOPO.rowZ / 2 + 1.3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.22} color="#1f4257" anchorX="center">
        48 Compute Nodes x 7 UB Planes - Non-blocking 2-tier Clos
      </Text>
    </group>
  );
}
