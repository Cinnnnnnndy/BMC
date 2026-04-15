# 硬件拓扑图与 2.5D 仿真视图开发指南

> 基于 TaiShan 200 Server 项目实践总结
> 适用场景：服务器硬件管理平台、嵌入式设备调试工具、工业设备可视化

---

## 目录

1. [拓扑图开发规范](#1-拓扑图开发规范)
2. [2.5D 等轴视图开发规范](#2-25d-等轴视图开发规范)
3. [Three.js 3D 视图开发规范](#3-threejs-3d-视图开发规范)
4. [技术选型决策树](#4-技术选型决策树)
5. [Vibe Coding 提示词模板库](#5-vibe-coding-提示词模板库)
6. [常见问题与修复方案](#6-常见问题与修复方案)

---

## 1. 拓扑图开发规范

### 1.1 核心原则

**永远不要让 AI 自己决定坐标，让数学算法决定。**

布局计算权必须交给专业引擎（dagre / elkjs），AI 只描述节点和边的关系（拓扑），布局引擎负责空间排列。

### 1.2 常见布局问题

| 问题现象 | 根本原因 | 解决方案 |
|---------|---------|---------|
| 连线互相穿越 | 无 crossing minimization | 启用 `elk.layered.crossingMinimization.strategy: 'LAYER_SWEEP'` |
| 节点重叠 | 无碰撞检测 | 布局后执行 bounding box 碰撞检测，自动增大 nodesep |
| 线绕远路 | 默认路由非最优 | 改用 ORTHOGONAL 路由模式 |
| 分组框压住节点 | padding 不足 | subgraph padding 设为 30px，z-index 低于节点层 |
| 手动拖拽后重布局跳动 | 未保留用户位置 | 用 `locked` 标记手动移动过的节点，重布局时跳过 |

### 1.3 技术栈选型

```
简单树形拓扑    → Mermaid.js（零代码，内置 dagre）
中等复杂度      → React Flow + dagre（生态最成熟）
复杂多层总线图  → React Flow + elkjs（布局算法最强）
纯静态导出      → Graphviz (dot 语言) → SVG
```

### 1.4 React Flow + ELK 布局配置（推荐）

```typescript
// ELK 布局配置
const elkOptions = {
  algorithm: 'layered',
  'elk.direction': 'DOWN',
  'elk.spacing.nodeNode': '80',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.edgeRouting': 'ORTHOGONAL',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
}

// 关键：等待 elk.layout() 异步返回后再渲染
const { nodes: layoutedNodes, edges: layoutedEdges } = await elk.layout(graph)
```

### 1.5 手动拖拽 + 自动布局共存方案

```typescript
// 节点数据结构增加 locked 标记
interface NodeData {
  id: string
  locked?: boolean      // true = 用户手动移动过，自动布局跳过
  position: { x: number; y: number }
}

// 拖拽结束时标记
onNodeDragStop={(_, node) => {
  updateNode(node.id, { locked: true })
}}

// 自动布局时过滤 locked 节点
const nodesToLayout = nodes.filter(n => !n.data.locked)

// 工具栏提供"解锁全部"按钮，清除所有 locked 标记
```

### 1.6 拖入新图元（Drag & Drop）

```typescript
// 左侧图元面板 → 拖入 React Flow 画布
const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}

const onDrop = (e: DragEvent) => {
  const type = e.dataTransfer.getData('application/reactflow')
  const position = reactFlowInstance.screenToFlowPosition({
    x: e.clientX,
    y: e.clientY,
  })
  addNode({ id: nanoid(), type, position })
}
```

### 1.7 总线连线颜色规范

```typescript
// 固定色彩映射，全项目统一使用
export const BUS_COLORS = {
  POWER:  '#E8B84B',   // 暖黄色  —— 电源走线
  I2C:    '#5B9CF6',   // 蓝色    —— I2C 数据总线
  PCIE:   '#B57FE8',   // 淡紫色  —— PCIe 高速总线
  SATA:   '#E86B3A',   // 橙红色  —— SATA 存储总线
  USB:    '#34D399',   // 绿色    —— USB 总线
} as const
```

### 1.8 节点数据模型

```typescript
interface HardwareComponent {
  id: string
  type: 'CPU' | 'EEPROM' | 'FAN' | 'HDD' | 'PSU' | 'I2C_BUS'
       | 'RISER' | 'IO_PANEL' | 'BASE_BOARD' | 'EXT_BOARD'
  label: string
  status: 'normal' | 'warning' | 'error' | 'offline' | 'selected'
  busConnections: BusConnection[]
  metrics?: {
    temperature?: number   // °C
    powerWatts?: number
    utilization?: number   // 0–100
    voltage?: number
  }
}

interface BusConnection {
  busId: string
  busType: keyof typeof BUS_COLORS
  role: 'master' | 'slave' | 'peer'
}
```

---

## 2. 2.5D 等轴视图开发规范

### 2.1 坐标系设计

**核心原则：所有图元坐标使用逻辑网格坐标，禁止直接写死屏幕像素坐标。**

```typescript
// 等轴投影参数
const ISO = {
  TILE_W: 64,   // 网格单元屏幕宽度（px）
  TILE_H: 32,   // 网格单元屏幕高度（px）
  TILE_Z: 40,   // 高度单元屏幕高度（px）
}

// 逻辑坐标 → 屏幕坐标转换（唯一合法途径）
function toScreen(gridX: number, gridY: number, gridZ: number) {
  return {
    x: (gridX - gridY) * ISO.TILE_W / 2,
    y: (gridX + gridY) * ISO.TILE_H / 2 - gridZ * ISO.TILE_Z,
  }
}
```

### 2.2 图元三面渲染规则

每个组件用顶/左/右三面模拟立体感：

```typescript
// 三面亮度系数（固定）
const FACE_BRIGHTNESS = {
  top:   1.00,   // 顶面最亮
  left:  0.75,   // 左侧面中等
  right: 0.55,   // 右侧面最暗
}

// 颜色计算
function getFaceColor(baseColor: string, face: keyof typeof FACE_BRIGHTNESS) {
  return shadeColor(baseColor, FACE_BRIGHTNESS[face])
}
```

### 2.3 组件状态视觉规范

```typescript
const STATUS_STYLES = {
  normal:   { overlay: null,                          border: 'rgba(255,255,255,0.15)' },
  warning:  { overlay: 'rgba(245,200,66,0.15)',       border: '#F5C842' },
  error:    { overlay: 'rgba(239,68,68,0.20)',        border: '#EF4444', animation: 'blink 0.5s infinite' },
  selected: { overlay: null,                          border: 'rgba(255,255,255,0.80)', glow: true },
  offline:  { overlay: null,                          border: 'transparent', filter: 'grayscale(80%) opacity(50%)' },
}
```

### 2.4 走线路由规则（2.5D）

```
走线分层（从低到高）：
  Layer 0 (Z = boardTop + 0.05)：板面水平走线段，紧贴 PCB 表面
  Layer 1 (Z = compTop + 0.10)：跨越组件时的局部抬升段
  Layer 2 (Z = compTop + 0.20)：多条线交叉的最高层

禁止：
  × 走线 Z 高度 > 最高组件 Z + 0.3
  × 不经过组件却无故抬高的线段
  × 直角转弯点悬空（转弯点必须落在组件边缘或板面上）
```

### 2.5 走线虚线样式（参照 TaiShan 图3）

```typescript
// 虚线参数
const DASH_CONFIG = {
  dashSize: 0.35,
  gapSize:  0.20,
  tubeRadius: 0.03,   // 细管，视觉约 2px
}

// GLSL Fragment Shader 实现管道虚线
const fragmentShader = `
  uniform vec3 color;
  uniform float dashSize;
  uniform float gapSize;
  uniform float totalLength;
  varying float vU;
  void main() {
    float pos = fract(vU * totalLength / (dashSize + gapSize));
    if (pos > dashSize / (dashSize + gapSize)) discard;
    gl_FragColor = vec4(color, 1.0);
  }
`

// 连接器端点：小发光方块
// BoxGeometry(0.12, 0.12, 0.12)
// emissiveIntensity: 0.6
```

---

## 3. Three.js 3D 视图开发规范

### 3.1 渲染器配置

```typescript
// Canvas 配置
<Canvas
  camera={{ position: [22, 18, 22], fov: 40 }}
  shadows
  gl={{
    antialias: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 0.9,
  }}
  dpr={[1, 2]}
>
```

### 3.2 轨道控制器

```typescript
<OrbitControls
  makeDefault
  enableDamping
  dampingFactor={0.05}
  target={[4, 0, 2]}          // 略偏右，主板居中
  minPolarAngle={0.4}         // 最小俯角 ~67°，不允许平视
  maxPolarAngle={Math.PI / 2.4}  // 最大俯角 ~75°
  minDistance={15}
  maxDistance={50}
/>
```

### 3.3 组件尺寸比例规范（以主板为基准）

| 组件类型 | 宽 (W) | 深 (D) | 高 (H) | 备注 |
|---------|--------|--------|--------|------|
| Main Board | 20.0 | 14.0 | 0.3 | 基准单元 |
| CPU（含散热器）| 3.5 | 3.5 | 1.8 | 高约主板宽 9% |
| EEPROM | 1.2 | 0.8 | 0.4 | 极薄贴片 |
| Fan（单个）| 3.2 | 3.2 | 1.4 | 高约等于宽 |
| PSU | 5.0 | 8.0 | 2.8 | 高 ≤ 主板宽 14% |
| HDD（单个）| 4.0 | 1.8 | 0.8 | 扁平，堆叠间距 0.15 |
| Riser | 4.5 | 0.3 | 2.5 | 竖立薄板 |
| Front I/O | 2.5 | 0.8 | 1.6 | 矮宽比例 |
| Ext.Board | 6.0 | 4.0 | 0.35 | 略厚于主板 |

> **绝对上限：** `MAX_COMPONENT_HEIGHT = 3.0`，任何组件不得超过此值

### 3.4 材质规范

```typescript
// PCB 主板（深军绿，参照真实 PCB）
const pcbMaterial = new MeshStandardMaterial({
  color: '#1a2416',
  roughness: 0.85,
  metalness: 0.10,
})

// CPU 散热器（铝制金属）
const heatsinkMaterial = new MeshStandardMaterial({
  color: '#3a3a3a',
  roughness: 0.55,
  metalness: 0.75,
})

// 风扇外框（深蓝灰）
const fanMaterial = new MeshStandardMaterial({
  color: '#252830',
  roughness: 0.70,
  metalness: 0.40,
})

// PSU / HDD / IO Panel（深灰系）
const enclosureMaterial = new MeshStandardMaterial({
  color: '#1e2026',
  roughness: 0.60,
  metalness: 0.60,
})

// 禁止出现的颜色（会破坏工业风整体感）
// × 橙色 / 琥珀色 (#b87333, #d97706)
// × 鲜红色外壳
// × 纯白色表面
// 所有组件颜色必须在 #1a1a1a ~ #404040 深灰区间
```

### 3.5 光照系统

```typescript
// 1. 环境光（全局基础，模拟机房漫反射）
<ambientLight intensity={0.3} color="#b0c4de" />

// 2. 主方向光（顶部日光灯，产生阴影）
<directionalLight
  position={[15, 25, 10]}
  intensity={1.2}
  castShadow
  shadow-mapSize={[2048, 2048]}
  shadow-bias={-0.001}
/>

// 3. 补光（消除过深阴影）
<directionalLight position={[-10, 10, -8]} intensity={0.4} color="#4060a0" />

// 4. 底部反光（机柜环境光）
<pointLight position={[0, -2, 0]} intensity={0.2} color="#203050" />

// 5. 总线激活时的局部点光源
// 在每条激活总线的中点添加，颜色同总线色，distance=5
```

### 3.6 场景环境

```typescript
// 背景色：深蓝黑
<color attach="background" args={['#0D0F14']} />

// 远处雾效（远处组件自然消隐）
<fog attach="fog" color="#0D0F14" near={40} far={80} />

// 地面网格（参照图3的网格背景）
<gridHelper args={[60, 60, '#1a1f2e', '#1a1f2e']} />

// 环境贴图（增强金属反射，机房风格）
<Environment preset="warehouse" />
```

### 3.7 散热器鳍片生成

```typescript
// CPU 散热器：22 片鳍片
function HeatSink({ width = 3.5, depth = 3.5 }) {
  const FINS = 22
  const FIN_THICKNESS = 0.05
  const FIN_HEIGHT = 1.5
  const FIN_SPACING = (width - FIN_THICKNESS) / (FINS - 1)

  return (
    <group>
      {/* 底座 */}
      <mesh>
        <boxGeometry args={[width, 0.3, depth]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.9} />
      </mesh>
      {/* 鳍片阵列 */}
      {Array.from({ length: FINS }).map((_, i) => (
        <mesh key={i} position={[-width/2 + i * FIN_SPACING, 0.3 + FIN_HEIGHT/2, 0]}>
          <boxGeometry args={[FIN_THICKNESS, FIN_HEIGHT, depth * 0.9]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}
```

### 3.8 风扇组件

```typescript
// 风扇：外框 + 5 片扇叶 + 旋转动画
function Fan({ isRunning = true, isFault = false }) {
  const bladeRef = useRef()

  useFrame((_, delta) => {
    if (!bladeRef.current) return
    const speed = isFault ? 0.005 : isRunning ? 0.08 : 0
    bladeRef.current.rotation.z += speed
  })

  return (
    <group>
      {/* 外框 */}
      <mesh>
        <boxGeometry args={[3.2, 1.4, 3.2]} />
        <meshStandardMaterial color="#252830" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* 扇叶（绕 Y 轴 72° 复制 5 片）*/}
      <group ref={bladeRef}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
            {/* 用 ShapeGeometry 生成弧形叶片 */}
            <meshStandardMaterial color="#1a1c20" metalness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
```

### 3.9 总线走线 3D 实现

```typescript
// TubeGeometry + 虚线 ShaderMaterial
function BusLine({ points, busType, isActive, isError }) {
  const timeRef = useRef(0)
  const matRef = useRef()

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.05),
    [points]
  )

  useFrame((_, delta) => {
    if (matRef.current && isActive) {
      timeRef.current += delta
      matRef.current.uniforms.time.value = timeRef.current
    }
  })

  return (
    <mesh>
      <tubeGeometry args={[curve, points.length * 20, 0.03, 8, false]} />
      <shaderMaterial
        ref={matRef}
        uniforms={{
          color:       { value: new THREE.Color(BUS_COLORS[busType]) },
          time:        { value: 0 },
          dashSize:    { value: 0.35 },
          gapSize:     { value: 0.20 },
          totalLength: { value: curve.getLength() },
          isError:     { value: isError ? 1.0 : 0.0 },
        }}
        vertexShader={TUBE_VERT}
        fragmentShader={TUBE_FRAG}
      />
    </mesh>
  )
}

// 走线高度约束（最重要规则）
const BOARD_TOP_Y    = 0.3     // 主板顶面
const WIRE_ON_BOARD  = 0.35    // 板面走线高度（仅高出 0.05）
const WIRE_MAX_Y     = 3.5     // 绝对上限，超过即为 bug
```

### 3.10 视角预设

```typescript
const CAMERA_PRESETS = {
  default:  { position: [22, 18, 22], target: [4, 0, 2]   },  // 左前方俯视（主视角）
  top:      { position: [4,  35,  3], target: [4, 0, 2]   },  // 正上方俯视
  front:    { position: [4,   8, 30], target: [4, 0, 2]   },  // 正前方
  right:    { position: [-28, 10, 2], target: [4, 0, 2]   },  // 右侧面
}

// 切换时用 gsap 做 0.8s 动画过渡
function switchPreset(name: keyof typeof CAMERA_PRESETS) {
  const { position, target } = CAMERA_PRESETS[name]
  gsap.to(camera.position, { ...position, duration: 0.8, ease: 'power2.inOut' })
  gsap.to(controls.target,  { ...target,   duration: 0.8, ease: 'power2.inOut' })
}
```

---

## 4. 技术选型决策树

```
需要可视化硬件拓扑/结构？
│
├── 只需要展示关系图（不需要 3D 旋转）
│   │
│   ├── 静态文档用途 → Mermaid.js（graph TD）
│   │
│   └── 需要交互（点击/拖拽/编辑）
│       │
│       ├── 关系简单（< 30 节点）→ React Flow + dagre
│       └── 关系复杂（多层总线、分组）→ React Flow + elkjs
│
└── 需要 3D 空间感（等轴视图 / 可旋转）
    │
    ├── 固定视角（等轴，不可旋转）
    │   └── Pixi.js / Canvas 2D + 等轴投影算法
    │
    └── 可自由旋转 + 真实感
        └── Three.js + @react-three/fiber + @react-three/drei
            ├── 简单场景 → MeshStandardMaterial
            └── 高真实感 → PBR 材质 + 环境贴图 + 阴影
```

---

## 5. Vibe Coding 提示词模板库

### 5.1 拓扑图布局（防止线重叠）

```
使用 React Flow + elkjs 实现硬件拓扑图，要求：

【布局引擎】强制使用 elkjs 自动布局，禁止手动指定任何节点 x/y 坐标
配置：{ algorithm:'layered', 'elk.direction':'DOWN',
        'elk.spacing.nodeNode':'80', 'elk.edgeRouting':'ORTHOGONAL',
        'elk.layered.crossingMinimization.strategy':'LAYER_SWEEP' }
所有坐标等待 elk.layout() 异步返回后再渲染

【边路由】使用正交折线（只有水平和垂直线段），禁止对角线
同类总线的多条边保持 6px 间距，不允许完全重合

【节点碰撞】布局后检查所有节点 bounding box，若重叠则增大 nodesep 重算

【交互】节点可手动拖拽，拖拽后 locked=true，重布局时跳过 locked 节点
左侧图元面板支持 onDrop 拖入新节点
工具栏有"重新自动布局"和"解锁全部"按钮
```

### 5.2 2.5D 等轴场景

```
实现等轴 2.5D 硬件场景，要求：

【坐标系】所有组件用逻辑网格坐标 (gridX, gridY, gridZ) 定位
统一转换：screenX=(gx-gy)*TILE_W/2，screenY=(gx+gy)*TILE_H/2-gz*TILE_Z
TILE_W=64 TILE_H=32 TILE_Z=40，禁止硬编码屏幕像素坐标

【图元三面渲染】顶面亮度 1.0，左侧面 0.75，右侧面 0.55
配色统一深灰系（#1a1a1a ~ #404040），禁止橙色/红色/纯白

【走线】走线紧贴板面（Z 仅高出主板 0.05），跨越组件时局部抬升 0.1
使用虚线样式 dashSize=0.35 gapSize=0.20，线管半径 0.03
禁止走线 Z > 最高组件 Z + 0.3
```

### 5.3 Three.js 真实感场景

```
用 Three.js (@react-three/fiber) 实现可旋转服务器 3D 场景：

【渲染器】ACESFilmicToneMapping，exposure=0.9，PCFSoftShadowMap
【相机】fov=40（减少透视形变），position=[22,18,22]，target=[4,0,2]
【轨道控制】OrbitControls enableDamping，minPolarAngle=0.4 maxPolarAngle=π/2.4
【光照】顶部主光 castShadow + 侧面补光 + 环境光 + <Environment preset="warehouse">
【所有组件】castShadow + receiveShadow

【尺寸约束】主板 20×14×0.3 为基准，MAX_HEIGHT=3.0，所有组件不超过此值
【材质色系】全部深灰 #1a1a1a~#404040，禁止橙/红/白
【走线】TubeGeometry radius=0.03，虚线 ShaderMaterial，走线 Y ≤ 最高组件 + 0.3
```

### 5.4 故障注入与仿真

```
实现前端仿真引擎（无需后端）：

【数据生成】使用 Zustand store，每 500ms 更新
CPU温度：35 + 20*sin(tick/5000) + random()*5
PSU功耗：所有组件功耗求和 + ±5W 随机波动

【故障注入】4种故障类型：
  温度过高（CPU > 95°C）/ 总线超时（I2C 无响应）
  掉电（级联影响子组件）/ 电压异常（±10% 偏差）
触发后：对应图元红色闪烁 + 走线变红 + 日志推送 ERROR + Toast 通知 3s

【状态面板】右侧抽屉 280px，三个 Tab：
  [属性] 型号/位置/连接总线
  [指标] 温度圆弧进度条 + 功耗横向条 + 利用率仪表盘
  [日志] 滚动日志流，支持级别过滤（INFO/WARN/ERROR）
```

---

## 6. 常见问题与修复方案

### 6.1 拓扑图问题

**Q: 连线互相穿越，不可读**
```
A: 加入提示词：
"使用 crossing minimization 算法，
 启用 elk.layered.crossingMinimization.strategy: LAYER_SWEEP"
```

**Q: 节点重叠**
```
A: 加入提示词：
"布局后执行碰撞检测，所有节点 bounding box 不重叠，
 冲突时自动增大 nodesep 并重新布局"
```

**Q: 手动拖拽后重布局位置跳变**
```
A: 用 locked 字段标记手动移动的节点，
   重布局时将 locked 节点固定，只对未锁定节点重算
```

### 6.2 2.5D / 3D 场景问题

**Q: 组件高度比例失调（PSU/风扇过高）**
```
A: 强制约束：
   MAX_COMPONENT_HEIGHT = 3.0
   PSU: height=2.8，Fan: height=1.4
   风扇改为 Z 轴方向平铺排列，不垂直堆叠
```

**Q: 走线悬浮过高，脱离板面**
```
A: 强制约束：
   板面走线 Y = BOARD_TOP + 0.05
   跨越组件时 Y = comp.top + 0.10
   绝对上限 Y ≤ MAX_COMPONENT_HEIGHT + 0.3
```

**Q: 组件颜色过于花哨，破坏工业风**
```
A: 加入约束：
   "所有组件颜色在 #1a1a1a ~ #404040 深灰区间，
    禁止橙色(#b87333)、鲜红色、纯白色"
```

**Q: 转动时透视形变严重，不像工业图**
```
A: 将 fov 从 45 改为 40，
   极端情况用 OrthographicCamera 完全消除透视形变
```

**Q: 走线是实线，不像图纸/原理图风格**
```
A: 改用虚线 ShaderMaterial：
   dashSize=0.35, gapSize=0.20
   或用 LineDashedMaterial（注意 WebGL linewidth 限制为 1px）
```

### 6.3 性能问题

**Q: 大量节点时帧率下降**
```
A: 使用 InstancedMesh 批量渲染相同类型组件
   LOD (Level of Detail)：距离远时降低几何体细分数
   走线使用 BufferGeometry 而非每帧重建 TubeGeometry
```

**Q: 阴影质量差或性能开销大**
```
A: shadow-mapSize 按需调整：
   开发时 [512, 512]，生产时 [2048, 2048]
   只对主要大组件开启 castShadow，小电容等细节关闭
```

---

## 附录：配色速查表

### 总线颜色

| 总线类型 | 颜色值 | 用途 |
|---------|--------|------|
| POWER | `#E8B84B` | 电源走线（暖黄色）|
| I2C | `#5B9CF6` | I2C 数据总线（蓝色）|
| PCIE | `#B57FE8` | PCIe 高速总线（淡紫色）|
| SATA | `#E86B3A` | SATA 存储总线（橙红色）|
| USB | `#34D399` | USB 总线（绿色）|

### 组件材质颜色

| 组件 | 颜色值 | 说明 |
|------|--------|------|
| PCB 主板 | `#1a2416` | 深军绿，真实 PCB 色 |
| CPU 散热器 | `#3a3a3a` | 铝灰色 |
| 风扇外框 | `#252830` | 深蓝灰 |
| PSU | `#1e2026` | 深灰 |
| HDD | `#282c35` | 深灰偏蓝 |
| Riser | `#2a2f3a` | 深蓝灰 |
| Front I/O | `#20232a` | 深灰 |
| Ext.Board | `#1e2820` | 深灰偏绿 |

### 组件状态颜色

| 状态 | 边框颜色 | 叠加色 |
|------|---------|--------|
| normal | `rgba(255,255,255,0.15)` | 无 |
| warning | `#F5C842` | `rgba(245,200,66,0.15)` |
| error | `#EF4444` | `rgba(239,68,68,0.20)` + 闪烁 |
| selected | `rgba(255,255,255,0.80)` | 无，外发光 |
| offline | 透明 | 灰度 80% + 透明度 50% |

---

*文档版本：1.0 | 基于 TaiShan 200 Server 2.5D/3D 仿真项目实践*
