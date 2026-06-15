# 开源模型驱动的 3D 硬件建模经验总结

> 适用范围：`web-app/src/sim/`（仿真调试 3D 视图）中已落地的"开源 3D 模型 → 网页 3D 视图"完整管线。
> 本文沉淀的是**方法论**：如何用开源模型 + 数据驱动的零件目录，低成本搭出一个尺寸可信、外观统一、可交互的服务器级 3D 模型，并能把同一套方法复制到新的硬件形态（如大规模加速集群，见 §9）。
>
> 姊妹文档：
> - `docs/3d-libraries-and-patterns.md` —— 程序化几何（procedural）的构造技法清单；
> - `web-app/src/sim/hardware-library/models/README.md` —— 模型下载/转换/归档的操作手册。
> 本文站在两者之上，讲"为什么这样设计"和"踩过哪些坑"。

---

## 1. 总体架构：五层管线

整个 3D 视图被拆成五层，**每层只通过数据（而非代码）与下一层耦合**：

```
① 零件目录 parts-catalog.ts        真实世界规格：mm 尺寸 / 连接器 / 热设计 / 来源链接
        ↓ (CatalogPart.id)
② 模型注册表 model-registry.ts     文件名约定：models/<part-id>.glb → import.meta.glob 自动扫描
        ↓ (url | undefined)
③ 渲染组件 CatalogPartModel.tsx    GLB 优先 / 程序化兜底，自动缩放居中 + 数据驱动材质
        ↓ (mesh)
④ 机箱模板 chassis-templates.ts    槽位系统：positionMM / acceptsCategories / rotationDeg
        ↓ (assembly)
⑤ 场景视图 SimView / IsoCanvas     相机、光照、交互、状态可视化、总线走线
```

这套分层带来的直接收益：

- **换模型零代码**：把一个命名正确的 `.glb` 丢进 `models/` 目录，刷新即生效；删掉文件自动回退程序化几何。
- **没模型也能跑**：程序化兜底（按 mm 尺寸生成圆角盒体）保证视图在任何时刻都是完整的，开源模型是"渐进增强"。
- **外观可以"口头调"**：`renderStyle` 把材质/描边/发光做成数据字段，改观感不碰渲染代码。

---

## 2. 第一性原则：真实尺寸是地基

所有零件在 `parts-catalog.ts` 里以**真实毫米尺寸**登记（`dimensionsMM`），场景统一用
`MM_PER_SCENE_UNIT = 20` 换算（`toScene(mm)`）。这是整个体系里最重要的一条经验：

1. **下载的模型尺寸/单位完全不用管**。`CatalogPartModel` 加载 GLB 后用 `Box3` 量出包围盒，
   按 `目标最大边 / GLB最大边` 整体缩放并居中——米制、毫米制、任意比例的模型丢进来都"恰好合身"。
2. **布局即查表**。机箱槽位（`ChassisSlot.positionMM`）也是 mm，零件装进槽位天然对齐，
   不存在"模型A是1:1、模型B是1:100"的混乱。
3. **尺寸数据有据可查**。每个零件记 `sourceReference`（OCP 规范页 / JEDEC / 厂商 datasheet），
   建模前先查 spec，宁可外观抽象也不让尺寸失真——观感可以后补，比例错了全盘返工。

坐标系全局约定（右手系）：**Y 向上，Z = 机箱前→后，X = 左→右**。所有零件、槽位、模型朝向修正都基于这一条。

---

## 3. 开源模型的获取与选型

### 3.1 来源渠道（按用途选）

| 来源 | 格式 | 许可 | 适合 |
|---|---|---|---|
| Sketchfab | 直接 GLB | 筛 CC0 / CC-BY | 外观好看的整件（CPU/PSU/整机） |
| GrabCAD | STEP/IGES | 单件各异，逐个看 | 工业件最全（PSU/HDD/风扇/导轨） |
| TraceParts / 3DContentCentral | STEP/GLB | 厂商授权 | 真实型号（台达风扇、连接器、滑轨） |
| KiCad `kicad-packages3D`（GitHub） | STEP/WRL | CC-BY-SA | DIMM / PCIe / 连接器 / 芯片封装 |
| OCP opencompute.org | STEP | OCPHL | OCP 网卡、ORV3 机架、托盘 |
| 嘉立创 EasyEDA | STEP | — | 国产电子元器件 |

**格式优先级**：`.glb`（直接用）>`.gltf` > `.obj` > `.step`（最准但面数爆炸，必须减面）> `.stl`（无材质，最后选择）。
一句话："要好看选 GLB（Sketchfab），要尺寸准选 STEP（厂商/GrabCAD）再转"。

### 3.2 "等效替代"是常态，不丢人

找不到目标零件的精确模型时，用**封装形态相同的等效件**并在归档里写明映射关系。实际案例：
鲲鹏 920 用的是 GrabCAD 上的 Intel Xeon E5 LGA 封装模型——

```
_sources/cpu-kunpeng920-hi1620/LICENSE.txt:
  Source: GrabCAD — "Intel Xeon E5-XXXXV3"
  Mapped to: cpu-kunpeng920-hi1620 (generic LGA server CPU package)
  Converted: occt STEP->GLB, modelRotationDeg [90,0,0] so IHS faces up
```

因为自动缩放会把它压到鲲鹏 920 的真实尺寸（77.4×60.2mm），再叠上 `<Text>` 丝印和官方徽标贴片，
观感与"专属模型"几乎无差。**封装形态 > 具体型号**，是选等效件的判断标准。

### 3.3 许可合规三件套

1. 优先 **CC0 > CC-BY（署名）> CC-BY-SA（传染）**；Sketchfab 下载时直接勾 Downloadable + CC 筛选。
2. 每个模型在 `models/_sources/<part-id>/` 归档：原始 CAD 文件 + `LICENSE.txt`（来源 URL、作者、许可、映射与转换记录）。
3. `import.meta.glob('./models/*.glb')` 只扫第一层目录不递归，`_sources/` 里的原始文件不会被误打包——归档零成本。

---

## 4. 转换工具链：全程无 GUI

两个 Node 脚本覆盖了全部转换需求，**不依赖 FreeCAD / Blender 桌面软件**，可以在任何环境（包括 CI）跑：

```bash
# STEP → GLB：occt-import-js（OpenCASCADE 的 WASM 端口）本地解析实体并网格化
node scripts/step-to-glb.mjs  ~/Downloads/fan.STEP  fan-60mm-1u-high-perf

# GLB/GLTF/OBJ → 优化 GLB：npx 按需拉 obj2gltf + gltf-pipeline，Draco 压缩
node scripts/convert-to-glb.mjs  ~/Downloads/nvme.glb  nvme-samsung-pm9a3-1920gb-u2
```

经验点：

- **第二个参数强制 = part id**，脚本直接输出到 `models/<part-id>.glb`——把"命名约定"焊死在工具里，杜绝手滑改名。
- GLTFExporter 在 Node 里跑需要 polyfill 浏览器的 `FileReader`（脚本里已内置）。
- 3DContentCentral 下载 STEP 时选「STEP (*.step)」，不要选「SDRC I-DEAS」变体，occt 解析不了。
- 转换后单件控制在 **< 50k 三角面**；STEP 转出来的面数普遍超标，需减面。

---

## 5. 接入约定：让"丢文件"成为唯一动作

`model-registry.ts` 的全部逻辑只有 30 行——`import.meta.glob` 把 `models/*.glb` 按文件名映射成
`partId → url` 字典。配合 Vite HMR，接入一个新模型的完整操作是：

```
下载 → (必要时)转 GLB → 重命名为 <part-id>.glb → 丢进 models/ → 刷新页面
```

唯一需要人工判断的是**朝向**。约定的期望姿态：PSU 长轴沿 Z、风扇出风沿 Z、U.2 盘竖立（高沿 Y）、插卡竖插。
模型歪了就在该零件的 catalog 条目上加一行 Euler 修正，**在自动缩放之前应用**（这样包围盒按修正后的姿态测量）：

```ts
modelRotationDeg: [90, 0, 0],   // 风扇是"正面朝你"导出的 → 转成竖立、出风沿 Z
```

> 坑位：旋转必须在 `Box3` 测量之前做。先量再转会导致扁平零件（如 CPU）缩放基准取错轴，整件巨大或消失。

验证闭环：模型库面板选中零件 → 预览徽标变绿「● 开源 GLB 模型」→ 回主视图确认尺寸协调。
若仍显示"程序化几何"，99% 是文件名与 part id 不完全一致（大小写/连字符）。

---

## 6. 数据驱动外观：renderStyle 体系

零件观感全部收敛到 `CatalogPart.renderStyle` 数据字段：

- `material`：具名材质预设（`brushed-metal` / `pcb-green` / `matte-plastic` / `anodized-dark`…），映射到 PBR 参数组；
- `fillColor` / `metalness` / `roughness` / `clearcoat`：显式覆盖；
- `outline`：描边开关 + 颜色 + 粗细 + 硬边角度阈值；
- `emissiveColor` / `emissiveIntensity`：状态灯与点缀发光。

两条重要规则：

1. **GLB 自带材质默认保留**。只有零件显式声明了 `renderStyle.material` 或 `fillColor` 才整体覆盖——
   Sketchfab 上精修过 PBR 的模型不要瞎动；要统一风格时再声明覆盖。
2. **状态是样式变换而非新材质**：`applyStatusToStyle(style, status)` 把 `normal/warning/error/offline`
   统一映射成发光/透明度变化（offline = `opacity 0.38`，error = 红色 emissive 脉动），GLB 和程序化几何走同一条路。

---

## 7. GLB vs 程序化：混合策略

实践中形成的分工原则：

| 用 GLB（开源模型） | 用程序化几何 |
|---|---|
| **标准件 / 通用件**：CPU 封装、风扇、HDD、PSU、网卡、SSD —— 开源世界里到处都是 | **定制件 / 找不到的件**：专有板卡、机箱钣金、背板、异形结构（如 L 形扩展板） |
| 形状复杂、手搓不划算（风扇叶片、散热鳍片） | 形状简单（盒+板+插槽就能表达） |
| 观感是卖点的近景主角 | 远景/批量/抽象层级的元素 |
| | **需要参数化批量生成**的（机柜×N、节点×M） |

程序化的构造技法（PCB 双层贴花、金手指、芯片三层堆叠、CanvasTexture 动态纹理等）见
`3d-libraries-and-patterns.md` §3，两套手法在同一场景里混用，靠 §6 的统一材质语言保持风格一致。

---

## 8. 迭代工作法（从提交历史回看）

这套模型不是一次画完的，回看 git 历史，路径是清晰的四步法：

1. **先全程序化占位**（`catalog-driven 3D model pipeline`）——尺寸、布局、交互先跑通，全是灰盒子也没关系；
2. **逐件替换开源模型**（`add 4 GrabCAD models` → `add NVMe + backplane` → `add CPU + NIC`）——
   一次接 2~4 件，每件单独验证朝向与缩放，commit 粒度 = 一批模型；
3. **对照实物照片修形**（`model ext board as an L-shape per the product photo`、
   `PSU bays use the new GLB with correct orientation`）——产品照是最好的 spec；
4. **统一视觉语言 + 性能收口**（官方徽标贴片、表面附着式 3D 文字、`Html` 标签换 sprite、
   按总线类型分层显隐）——最后做，避免过早优化。

配套的固定校验：每轮 `npx tsc --noEmit` + Vite HMR 肉眼检查位置/朝向/状态切换。

---

## 9. 方法论迁移：搭一个全新硬件形态的模型

把这套经验复用到新对象（例如大规模加速集群）时，操作顺序：

1. **先收集"尺寸与数量"事实**：机柜数、每柜单元数、每节点 NPU/CPU 数、互联方式——来源优先级
   官方 spec / 白皮书 > 论文 > 技术媒体。数字存进数据文件并标注来源（同 `sourceReference` 惯例）。
2. **定抽象层级，而不是一步到位**：超大系统拆成多个视图层级（整系统 → 机柜 → 节点/刀片 → 互联拓扑），
   每层只建该层看得清的细节；下钻交互代替"一个场景塞所有面数"。
3. **数据与渲染分离**：照搬 `CatalogPart` / `ChassisSlot` 的思路——mm 尺寸 + 槽位表驱动布局，
   渲染组件按 `category` 派发；机柜×N、节点×M 全部由数据循环生成。
4. **程序化打底，开源模型点睛**：批量元素（几十个节点、上百根互联线）必须程序化 + InstancedMesh；
   只有近景主角值得配 GLB，且走同一个 `models/<part-id>.glb` 约定。
5. **沿用既有视觉语言**（`3d-libraries-and-patterns.md` §7 色板）和状态体系，新旧视图风格不打架。

---

## 10. 坑位清单（速查）

1. `modelRotationDeg` 必须在包围盒测量**前**应用，否则自动缩放取错轴。
2. GLB `scene` 要 `clone(true)` 再改材质——`useGLTF` 有全局缓存，直接改会污染其他实例。
3. 文件名 = part id 是**精确匹配**（含大小写、连字符），接不上先查这个。
4. STEP 转出来面数普遍 >100k，不减面帧率必崩；单件预算 50k 三角面。
5. `import.meta.glob` 用 `eager: true + query: '?url'`，模型 URL 在构建期解析，运行时零开销。
6. 同形状小件 ≥ 数十个必用 `InstancedMesh`（一次 drawcall）。
7. `useFrame` 里禁止 setState，直接突变 `ref.current` 上的材质属性。
8. 许可证当场归档。事后补根本想不起来哪个模型从哪下的。

---

> 创建：2026-06-11　基于 `web-app/src/sim/hardware-library` 管线与提交历史整理
