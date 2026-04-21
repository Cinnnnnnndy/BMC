# 3D 视图实现经验：开源库、模型库与引用方法

> 适用范围：`web-app/src/sim/IsoCanvas.tsx` 及 `serverData.ts`（TaiShan 200 2280 服务器 BMC 拓扑仿真视图）。
>
> 本文档沉淀当前代码里**已经在用**的开源库、引用方式、模型构造技法，以及多轮改图中形成的工作方法，供后续新增板卡 / 调整布局时直接复用。

---

## 1. 技术栈与依赖清单

`web-app/package.json` 中与 3D 视图直接相关的依赖：

| 包 | 版本 | 角色 |
| --- | --- | --- |
| `three` | ^0.183 | WebGL 渲染底座（几何 / 材质 / 纹理 / 光照 / 着色器） |
| `@react-three/fiber` | ^8.18 | React 声明式包装 three.js，提供 `<Canvas>`、`useFrame`、`useThree` |
| `@react-three/drei` | ^9.122 | 开源组件库（Helpers / Controls / Abstractions） |
| `@types/three` | ^0.183 | TypeScript 类型 |
| `zustand` | ^5 | 选中态 / 状态覆盖 / 总线高亮（`simStore.ts`） |
| `react` / `react-dom` | ^18 | 宿主 |

> **重要**：项目内所有 3D 元件均用 `@react-three/fiber` 的 JSX 声明式写法；不使用 `THREE.Scene` 命令式树。任何新建 mesh 都应该用 JSX 标签 (`<mesh>`, `<boxGeometry>`, `<meshStandardMaterial>` 等)。

---

## 2. 开源库引用方式

### 2.1 `@react-three/fiber`

```ts
import { Canvas, useFrame, useThree } from '@react-three/fiber';
```

| API | 用法 | 代码位置 |
| --- | --- | --- |
| `<Canvas>` | 根容器；开启阴影、色调映射、DPR 自适应 | `IsoCanvas.tsx:2161` |
| `useFrame((state, delta) => …)` | 每帧回调：LED 呼吸、风扇旋转、虚线滚动、error 脉动 | 贯穿各 Mesh 组件 |
| `useThree()` | 拿到 `camera`，用于响应 `sim:resetCamera` 自定义事件 | `CameraResetHandler` |

`<Canvas>` 推荐配置（已落地）：

```tsx
<Canvas
  camera={{ position: [18, 14, 18], fov: 45 }}
  shadows
  gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.18 }}
  dpr={[1, 2]}
  onCreated={({ gl }) => { gl.shadowMap.type = THREE.PCFSoftShadowMap; }}
/>
```

### 2.2 `@react-three/drei`

```ts
import {
  OrbitControls, Html, Environment,
  RoundedBox, Text, Edges,
} from '@react-three/drei';
```

| Helper | 已使用场景 |
| --- | --- |
| `<OrbitControls>` | 相机轨道：`enableDamping`、`minPolarAngle`/`maxPolarAngle` 限制俯仰避免穿地、`target=[0,0.8,0]` 锁视中心 |
| `<Environment preset="city" />` | HDR 环境贴图，给金属（IHS、金手指、风扇框）提供真实反射 |
| `<Html>` | 2D 标签 pill（组件英文名 + 状态点），跟随 3D 位置但用 CSS 排版 |
| `<RoundedBox>` | CPU IHS、BMC SoC IHS —— 比 `<boxGeometry>` 多一层倒角，真实感显著提升 |
| `<Text>` | 丝印 / 激光刻字：Kunpeng 920、HiSilicon…、BMC SoC、FLASH、BMC —— 避免纹理贴图写字的烦恼 |
| `<Edges>` | 薄线高亮物体轮廓（BMC 卡四周），让产品照感增强 |

### 2.3 three.js 原生

```ts
import * as THREE from 'three';
```

项目中已经用到的 three 原语：

- **几何**：`BoxGeometry`、`PlaneGeometry`、`CylinderGeometry`、`RingGeometry`、`CircleGeometry`（含 `segments=3` 画三角标记）、`TubeGeometry`、`ExtrudeGeometry`（风扇叶片 Bezier 曲线拉伸）、`EdgesGeometry`。
- **材质**：`MeshStandardMaterial`（默认 PBR，所有元件主体）、`MeshBasicMaterial`（不受光，用于 ring bevel、轮廓辅助）、`ShaderMaterial`（总线虚线动效）、`shadowMaterial`（只接阴影的地面）、`lineBasicMaterial`（选中轮廓、产品边）。
- **纹理**：`CanvasTexture` —— 动态生成 PCB、HDD 标签、蜂窝通风口。
- **光照**：`ambientLight`、`directionalLight`（含 `shadow-mapSize` / `shadow-camera-*` 裁剪）、`pointLight`（总线高亮辉光）。
- **向量 / 曲线**：`Vector3`、`CurvePath`、`LineCurve3`、`Shape`、`Color`。

---

## 3. 模型构造技法清单（可复用"模型库"）

以下技法均已在 `IsoCanvas.tsx` 中落地，可直接复制 / 参数化复用。

### 3.1 PCB 板：双层贴花

```tsx
{/* 1. 主 PCB 盒体 —— 深绿色基底 */}
<mesh castShadow receiveShadow>
  <boxGeometry args={[w, dh, d]} />
  <meshStandardMaterial color="#1a2416" roughness={0.85} metalness={0.10} envMapIntensity={0.5} />
</mesh>
{/* 2. 顶面 plane —— 用 createPCBTexture() 生成的 canvas texture 叠加走线、焊盘、过孔 */}
<mesh position={[0, dh/2 + 0.002, 0]} rotation={[-Math.PI/2, 0, 0]}>
  <planeGeometry args={[w - 0.04, d - 0.04]} />
  <meshStandardMaterial map={pcbTex} transparent opacity={0.94} />
</mesh>
```

要点：
- **两层不要直接共面**：顶层 plane 垫高 `+0.002` 避免 Z-fighting。
- 贴花是 `CanvasTexture`（`createPCBTexture(seed)`）：铜走线、SMD 焊盘、过孔、接地铜面全靠 2D canvas 画，成本低、可由 `seededRng` 生成不同板子。
- `envMapIntensity=0.5` 让阻焊漆有轻微反光但不抢戏。

### 3.2 带金手指的插卡（PCIe / BMC Card）

```tsx
{/* 金手指 —— 金属感 metalness=0.95、roughness=0.08、envMapIntensity=1.6 */}
<mesh position={[w/2 - 0.02, -dh/2 + 0.08, 0]}>
  <boxGeometry args={[0.08, 0.14, d * 0.88]} />
  <meshStandardMaterial color="#d4a85a" metalness={0.95} roughness={0.08} envMapIntensity={1.6} />
</mesh>
{/* 防呆缺口 —— 黑色 box 切一刀 */}
<mesh position={[w/2 - 0.02, -dh/2 + 0.08, 0]}>
  <boxGeometry args={[0.10, 0.16, 0.20]} />
  <meshStandardMaterial color="#05070a" roughness={0.9} />
</mesh>
```

### 3.3 芯片（SoC / BMC / DRAM）

- **三层堆叠**：substrate（暗色 FR-4）→ die package（黑色环氧）→ IHS（`<RoundedBox>` 金属银）。
- **翅片散热**：7 条薄 box（`0.04 × 0.10 × 宽度`），间距 0.18。
- **丝印文字**：`<Text>` + `outlineWidth=0.004`、`outlineColor="#101216"` 在深色表面压一圈描边才读得清。

### 3.4 DDR5 DIMM（细化版）

- PCB 分两半（中间留防呆缺口）。
- 金手指分段：模拟真实 DDR5 的分组 pin。
- 前后各 8 颗 DRAM：前 8 颗可见，后 8 颗用 `<boxGeometry>` 翻面放置。
- 白色 label 贴纸：`<Text>` 或 0.005 厚的 `planeGeometry` + 白材质。
- 插槽：黑色底座 + 两侧带拨杆的锁扣（`<RoundedBox>` + 旋转）。
- 位置计算：`groupZfrac = [-0.86, -0.28, +0.28, +0.86]` 乘以 `d/2` —— **用分数定位，板宽一变 DIMM 自动跟随**。

### 3.5 连接器：RJ45 / VGA / 排针

| 连接器 | 构造要点 |
| --- | --- |
| **RJ45 MGMT** | 黑色外壳 box + 中央黑色 jack 开口 + 两颗 LED（绿/黄，`emissive` + `useFrame` 心跳） |
| **VGA DE-15** | 蓝色外壳 box + 银色金属护盾 plane（`metalness=0.88`） |
| **2×N 调试排针** | 循环 `Array.from({length:10})`，用 `col=pi%2, row=pi/2` 铺成 2×5 金色 pin（`color="#c8a040"`, `metalness=0.9`）+ 黑色 header 底座 |

### 3.6 风扇（可动）

```ts
// ── 几何缓存 ──
const _fanBladeGeoCache = new Map<string, THREE.ExtrudeGeometry>();
function getFanBladeGeo(r: number) {
  const shape = new THREE.Shape();
  shape.moveTo(…); shape.bezierCurveTo(…); // 叶片轮廓
  return new THREE.ExtrudeGeometry(shape, { depth: …, bevelEnabled: false });
}

// ── 组件内 ──
useFrame(() => {
  const spd = effStatus === 'offline' ? 0 : effStatus === 'error' ? 0.008 : 0.055;
  if (blade0Ref.current) blade0Ref.current.rotation.y += spd;
  if (blade1Ref.current) blade1Ref.current.rotation.y -= spd; // 反向旋转
});
```

注意：几何体 **缓存在模块级 `Map`**，避免每次渲染重新计算。

### 3.7 CPU 裸片（无散热片）

层次从下到上：LGA 金色 pad → FR-4 substrate → 周围 SMD 电容小黑块 → `<RoundedBox>` IHS（镍镀色 `#c4c6cc`, `metalness=0.92`）→ `<Text>` 激光刻字 → 三角定位标记（`<circleGeometry args={[r, 3]}/>`）。

### 3.8 总线走线：虚线动画管

- `CurvePath<Vector3>` 串若干 `LineCurve3` 形成**硬直角折线**（不走 Catmull-Rom，避免软化）。
- `TubeGeometry(curvePath, segs*10, radius, 5)` 作为 pipe。
- **自定义 `ShaderMaterial`** 用 `uv.x` 沿管长 0→1 做 `fract` 运算画虚线，`useFrame` 每帧 `uniforms.uOffset -= 0.018` 制造"流动"效果。
- 端点放两个 `<boxGeometry>` + `emissive` 作为连接块。

### 3.9 InstancedMesh：PSU 通风孔

```ts
const meshRef = useRef<THREE.InstancedMesh>(null);
// 8 × 20 = 160 个孔 —— 若用 160 个 <mesh> 会卡，InstancedMesh 用单次 drawcall
```

### 3.10 状态视觉系统

- **`statusEmissive(effStatus)`** 返回 `{color, intensity}`；在材质上设置 `emissive`。
- **`error` 脉动**：`useFrame` 里 `emissiveIntensity = 0.1 + 0.2 * |sin(t * 2π)|`。
- **LED 心跳**：`(sin(t·2π)·0.5+0.5)·(sin(t·8π)·0.5+0.5)` 模拟 BMC 双脉冲。
- **选中轮廓**：`<StatusOutline>` 用比物体大 `+0.07` 的 `EdgesGeometry` + `lineBasicMaterial` 呼吸。
- **offline**：`opacity=0.38, transparent=true`。

---

## 4. 坐标系约定（全局规则）

```ts
// IsoCanvas.tsx
const CX = -6.5;   // 场景中心 X 偏移
const CZ = -9;     // 场景中心 Z 偏移
const g2wx = (gx) => gx + CX;      // grid X → world X
const g2wy = (gz) => gz;            // grid Z (height) → world Y
const g2wz = (gy) => gy + CZ;      // grid Y (depth)  → world Z
```

- `serverData.ts` 里 `grid` 用**逻辑网格坐标**（x=横向、y=纵深、z=高度）。
- 换到世界：**交换 y↔z**（因为 three.js 的 Y 是高度），并用 `CX/CZ` 把整场景平移回原点 `(0,0,0)`。
- 新增元件只需填 `grid.x/y/z` 和 `size.w/d/h`，渲染由 `ComponentMesh` 根据 `type` 派发到专属 Mesh 组件。

### 4.1 紧凑等距布局的算法

当前四大主体（BMC Card / Ext.Board / Main Board / Fans）采用**统一 1.0 网格单位间距**：
1. 选一个锚点（如 `base_board.grid.x = 1`）；
2. 向左逐个退位：`ext_board.grid.x = base_board.grid.x - ext_board.size.w - 1.0`；
3. 向右逐个前进：`fan.grid.x = base_board.grid.x + base_board.size.w + 1.0`；
4. 调整 `CX`：让 `(minX + maxX) / 2 + CX = 0`，视图保持中心。

---

## 5. 新增板卡 / 组件的落地清单

**每加一个新板卡，按以下顺序操作**：

1. **`serverData.ts`**：
   - `ComponentType` 追加枚举（如 `BMC_CARD`）。
   - `HARDWARE_COMPONENTS` 追加一个对象：`id / type / label / labelEn / grid / size / busConnections / metrics / description`。
   - `busConnections[].connectorPos` 决定总线从元件哪一面（top/bottom/left/right）出来，影响总线走线。

2. **`IsoCanvas.tsx`**：
   - 在 `PCB_MAT` 添加颜色参数（若是板卡类）：`{color, roughness, metalness}`。
   - 写一个 `XxxMesh({comp, isSelected, effStatus}: SpecProps)` 组件；优先复用 3.1–3.10 的构造块。
   - 在 `ComponentMesh` 的 dispatcher 增加分支：`{comp.type === 'XXX' && <XxxMesh {...specProps} />}`。
   - 记得最后加一行 `<StatusOutline w={w} dh={dh} d={d} isSelected={isSelected} effStatus={effStatus} />`。

3. **校验**：
   - `npx tsc --noEmit` 无新增错误；
   - Vite HMR 刷新（`web-app`，端口 5175）；
   - 肉眼确认位置、朝向、丝印文字、LED 状态切换（normal/warning/error/offline）均生效。

---

## 6. 性能与坑位备忘

1. **几何缓存**：重复使用的复杂 `ExtrudeGeometry` / `TubeGeometry` 一定要 `useMemo` 或模块级 `Map`，否则每帧重建。
2. **材质 / 纹理释放**：`useMemo` 创建 + `useEffect(() => () => tex.dispose(), [tex])` 清理，避免 WebGL 句柄泄漏。
3. **阴影开销**：`shadow-mapSize={[2048,2048]}` + `PCFSoftShadowMap` 已经是质量 / 性能折衷点；再高会掉帧。
4. **InstancedMesh**：数量 ≥ 数十个同形状小件时必用。
5. **Z-fighting**：同层贴花用 `±0.002` 微小偏移；丝印文字用 `+0.002`。
6. **Text 字体加载**：`<Text>` 默认字体是远程加载，首次渲染会闪。若要稳定，可预加载字体（`drei` 的 `preloadFont`）。
7. **`React.Ref<THREE.Mesh>` 类型转型**：`<RoundedBox ref={meshRef as unknown as React.Ref<THREE.Mesh>}>`，因为 drei 对 ref 的类型偏紧。
8. **`useFrame` 忌用 setState**：直接用 `ref.current.material.emissiveIntensity = …` 突变，不触发 React 重渲染。

---

## 7. 已经形成的视觉"语言"

| 场景 | 颜色 | 材质参数 |
| --- | --- | --- |
| 深色 PCB（Base/Ext） | `#1a2416` / `#1e2820` | rough 0.85 / metal 0.10 |
| BMC 卡 PCB（冷色） | `#112036` | rough 0.78 / metal 0.22 |
| Riser | `#2a2f3a` | rough 0.75 / metal 0.35 |
| 金属 IHS / 护罩 | `#c4c6cc` / `#8a8d94` | rough 0.28–0.34 / metal 0.82–0.92 |
| 金手指 | `#d4a85a` | rough 0.08 / metal 0.95 / envMap 1.6 |
| LGA 金脚 | `#b8860b` | rough 0.12 / metal 0.95 |
| LED 绿 | `#30ff80` emissive `#20ff80` | intensity 0.6–1.2 |
| LED 红（error） | `#ff3333` | intensity 脉动 0.3–0.95 |
| 总线 POWER 黄 / I2C 蓝 / PCIE 紫 / SATA 橙 / USB 绿 | 见 `BUS_COLORS` | ShaderMaterial 虚线 |
| 背景 / 雾 | `#0b0d14` | fog near=50 far=90 |
| 环境贴图 | `preset="city"` | —— |

保持这套色板一致性 = 保持"产品渲染照"风格不翻车。

---

## 8. 与 TaiShan 200 2280 的真实对应

当前模型对应华为 TaiShan 200 2280 服务器拆解视图（参考资料 EDOC1100088652），对照关系：

| 仿真 ID | 真实部件 |
| --- | --- |
| `cpu_0` / `cpu_1` | Kunpeng 920 5220 ×2（64 核，ARMv8.2，2.6 GHz） |
| `base_board` | 主板（已旋转 90° 的纵向 compute 布局） |
| `ext_board` | 2U 机箱左侧扩展背板（Riser1 / FlexIO1 PCIe） |
| `bmc_card` | 独立 BMC 插卡（Huawei Hi1711 / Hi1710 等效 SoC） |
| `fan_0..3` | 4 × 双转子热拔风扇模组 |
| `psu_0..1` | 冗余 CRPS PSU |
| `nvme_*` | 前置 U.2 NVMe SSD（PCIe Gen4 ×4） |
| `nic_*` | OCP 3.0 NIC（4 × 25GbE SFP28） |
| 总线 | I2C 管理 / PCIe 数据 / Power / SATA / USB |

---

## 9. 关键文件索引

- `web-app/src/sim/IsoCanvas.tsx` —— 所有 3D 渲染逻辑（~2200 行）。
- `web-app/src/sim/serverData.ts` —— 组件数据表 + 总线注册表 + 颜色映射。
- `web-app/src/sim/simStore.ts` —— zustand store：选中 / 状态覆盖 / 高亮。
- `web-app/src/sim/isoMath.ts` —— 2D iso 相关数学（若走非 3D 回退视图时用到）。

搜索约定：`IsoCanvas.tsx` 里**每个主要段落都有 `// ─── 标题 ───` 的横线注释**，按标题搜索即可跳到对应逻辑块。

---

> 更新：2026-04-20　维护：本项目 3D 视图负责人
