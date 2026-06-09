# 开源 3D 模型下载 · 转换 · 归档指南

这个目录是 3D 视图的**模型仓库**。系统通过 `model-registry.ts` 的
`import.meta.glob('./models/*.glb')` 自动扫描本目录，**约定文件名 = 零件的
`CatalogPart.id`**。把一个命名正确的 `.glb` 放进来，主仿真视图和模型库预览
就会自动用它替换程序化几何——**无需改任何代码**。

---

## 0. 一句话工作流

```
下载模型 → (必要时)转成 GLB → 重命名为 <part-id>.glb → 丢进本目录 → 刷新页面
```

> 尺寸/单位**不用管**：加载器会自动把模型缩放到该零件的真实 mm 尺寸并居中。
> 你只需要保证**朝向**大致正确（见 §5）。

---

## 1. 归档规范（最重要）

| 项 | 规定 |
|---|---|
| 存放目录 | `web-app/src/sim/hardware-library/models/` |
| 文件名 | **必须** = `<CatalogPart.id>.glb`（见 §4 对照表） |
| 格式 | 最终必须是 `.glb`（单文件，含材质） |
| 原始文件 | 放到 `models/_sources/<part-id>/`（见下） |

**原始文件 + 许可证归档**（强烈建议）：
```
models/
  psu-delta-dps800ab-800w.glb          ← 运行时加载（自动检测）
  _sources/
    psu-delta-dps800ab-800w/
      original.step                     ← 下载的原始 CAD
      LICENSE.txt                       ← 许可证 / 来源 URL / 作者
      notes.md                          ← 备注（缩放、朝向调整记录）
```
> `import.meta.glob('./models/*.glb')` **只扫描本目录第一层**，不递归，所以
> `_sources/` 里的 `.glb`/`.step` 不会被误加载。放心归档。

---

## 2. 格式选择（优先级）

| 格式 | 处理方式 | 说明 |
|---|---|---|
| **`.glb`** ⭐ | 直接用 | three.js 原生，单文件带材质，首选 |
| `.gltf`(+bin) | 跑转换脚本压缩成 glb | 多文件，建议合并 |
| `.obj`(+mtl) | `convert-to-glb.mjs` 自动转 | 网格+基础材质 |
| `.stl` | Blender/在线转 | 只有网格，无材质/无颜色 |
| `.step`/`.stp`/`.iges` | FreeCAD/Blender 转 | 工业 CAD，最准但面数高，**必须减面** |
| `.fbx` | Blender 转 | 导入后导出 glb |

**经验**：要"好看"选 GLB（Sketchfab）；要"尺寸准"选 STEP（厂商/GrabCAD）再转。

---

## 3. 转换命令

```bash
# 在 web-app/ 目录下。<part-id> 必须等于零件 id（见 §4）
node scripts/convert-to-glb.mjs <输入文件> <part-id>

# 例：把下载的 NVMe STEP/OBJ/GLB 转成可用模型
node scripts/convert-to-glb.mjs ~/Downloads/u2_ssd.glb  nvme-samsung-pm9a3-1920gb-u2
node scripts/convert-to-glb.mjs ~/Downloads/fan.obj     fan-60mm-1u-high-perf
```
- `.glb/.gltf` → 自动 Draco 压缩并输出到本目录
- `.obj` → 自动转换 + 压缩

**STEP → GLB（全自动，无需 FreeCAD）** ⭐ — 用 occt-import-js（OpenCASCADE WASM）：
```bash
node scripts/step-to-glb.mjs <input.step> <part-id>
# 例：node scripts/step-to-glb.mjs ~/Downloads/fan.STEP fan-60mm-1u-high-perf
```
直接在本机解析 STEP 实体、网格化并导出 GLB，输出到本目录、按 part id 命名。
（3DContentCentral 下载时选「STEP (*.step)」，**不要**选「SDRC I-DEAS (*.step)」。）

---

## 4. 按零件下载对照表

> ✅ = 已接入。优先做**主视图用到的 8 个**（标 ★）。文件名列就是你要保存的名字。

### 主视图在用（优先）

| ★ | 零件 | 期望文件名 | 推荐来源 | 搜索关键词 |
|---|---|---|---|---|
| ★ | 鲲鹏920 CPU | `cpu-kunpeng920-hi1620.glb` | Sketchfab / GrabCAD | `server CPU`, `LGA CPU`, `处理器` |
| ★ | 60mm 风扇 | `fan-60mm-1u-high-perf.glb` | **TraceParts** / GrabCAD | `60mm fan Delta`, `axial fan` |
| ★ | 3.5" HDD | `hdd-seagate-exos-x16-4tb-sata.glb` | GrabCAD / Sketchfab | `3.5 HDD`, `Seagate Exos` |
| ★ | U.2 NVMe | `nvme-samsung-pm9a3-1920gb-u2.glb` | GrabCAD / Sketchfab | `U.2 SSD`, `2.5 enterprise SSD` |
| ★✅ | DPS-800 PSU | `psu-delta-dps800ab-800w.glb` | （已用脚本生成，可换真模型） | `server PSU`, `CRPS 1U` |
| ★ | OCP 网卡 | `nic-mellanox-mcx512a-ocp3-2x25g.glb` | **OCP** / GrabCAD | `OCP 3.0 NIC`, `OCP mezzanine` |
| ★ | Hi1711 BMC 卡 | `bmc-huawei-hi1711-card.glb` | Sketchfab / GrabCAD | `PCIe card half height`, `mezzanine card` |
| ★ | PCIe Riser | `riser-pcie4-x16-fhhl.glb` | GrabCAD / KiCad | `PCIe riser`, `x16 slot card` |

### 模型库其它零件（可选，按需补）

| 零件 | 期望文件名 |
|---|---|
| Intel Xeon 8480+ | `cpu-intel-xeon-8480plus.glb` |
| AMD EPYC 9654 | `cpu-amd-epyc-9654.glb` |
| DDR5 32G RDIMM | `mem-ddr5-32gb-4800-rdimm.glb` |
| DDR5 64G RDIMM | `mem-ddr5-64gb-4800-rdimm.glb` |
| DDR4 32G RDIMM | `mem-ddr4-32gb-3200-rdimm.glb` |
| Nytro XF1230 NVMe | `nvme-seagate-nytro-xf1230-960gb-u2.glb` |
| 2.5" HDD | `hdd-seagate-exos-4tb-sata-25.glb` |
| 华为 900W PSU | `psu-huawei-900w-hot-swap.glb` |
| DPS-1300 PSU | `psu-delta-dps1300ab-1300w.glb` |
| 双 80mm 对旋风扇 | `fan-dual80mm-counterrotating.glb` |
| Intel E810 网卡 | `nic-intel-e810-ocp3-4x25g.glb` |
| Mellanox CX6 网卡 | `nic-mellanox-cx6-2x100g-pcie.glb` |
| Nuvoton NPCM750 BMC | `bmc-nuvoton-npcm750-module.glb` |

> DIMM/插槽/连接器类，**KiCad `kicad-packages3D`** 仓库（GitHub，免登录直下 STEP/WRL）质量高。

---

## 5. 下载源说明

| 来源 | 登录 | 格式 | 许可 | 适合 |
|---|---|---|---|---|
| **Sketchfab** | 免费账号 | **直接 GLB** | 筛 CC-BY/CC0 | 外观好看的整件（CPU/PSU/服务器） |
| **GrabCAD** | 免费账号 | STEP/IGES | 各异，看单件 | 工业件全（PSU/HDD/风扇/导轨） |
| **TraceParts** / 3D ContentCentral | 免费账号 | STEP/**GLB** | 厂商授权 | 真实型号（台达/建准风扇、连接器、滑轨） |
| **KiCad kicad-packages3D** (GitHub) | 免登录 | STEP/WRL | CC-BY-SA | DIMM/PCIe/连接器/芯片 |
| **OCP** opencompute.org | 免登录 | STEP | OCPHL | OCP 网卡、ORV3 机架、托盘 |
| **嘉立创/LCSC EasyEDA** | 免费账号 | STEP | — | 国产电子元器件 |

下载时优先勾选 **Downloadable + CC-BY / CC0**（Sketchfab 有该筛选）。

---

## 6. 模型要求（接入前自查）

1. **尺寸**：✅ **不用管**——加载器自动按零件真实 mm 缩放并居中。
2. **朝向**：⚠️ 需要对，但**一行就能修**。世界轴：**Y 上**，**Z = 机箱前→后**，X = 左右。
   - 期望姿态：PSU 长轴沿 Z；风扇出风沿 Z；U.2 盘竖立（高沿 Y）；卡类竖插（高沿 Y）。
   - 若下载的模型朝向歪了，在 `parts-catalog.ts` 给该零件加一行
     **`modelRotationDeg: [x, y, z]`**（Euler 角度，加载时在自动缩放前应用）。例：
     ```ts
     // 风扇模型是“正面朝你”导出的，转成竖立出风沿 Z
     modelRotationDeg: [90, 0, 0],
     ```
   - 不确定转多少？把零件名告诉我，我看一眼帮你定角度。
3. **面数**：单件 < 50k 三角面。STEP 转换后务必用 Blender Decimate 减面。
4. **材质**：可保留原模型 PBR 材质；想统一风格就在 `parts-catalog.ts` 给该零件设
   `renderStyle.material`/`fillColor`（见 `render-style.ts` 预设）。

---

## 7. 许可与合规

- 商用/分发请确认许可：**CC0**（随便用）> **CC-BY**（需署名）> CC-BY-SA（传染）。
- GrabCAD/TurboSquid 等单件许可差异大，**逐个看模型页**。
- 把许可证文本和来源 URL 存进 `_sources/<part-id>/LICENSE.txt`。
- 厂商官方 CAD（TraceParts）通常允许设计用途，但不可二次售卖模型本身。

---

## 8. 验证

放入文件并刷新后：
1. 打开**模型库**面板 → 选中该零件 → 顶部预览徽标应变绿「● 开源 GLB 模型」，
   下方「模型替换」面板显示「已接入开源模型」。
2. 回**仿真调试 3D 视图** → 该零件应显示真实模型、尺寸与周围协调。
3. 若仍是「程序化几何」：检查文件名是否与 §4 的 `part-id` **完全一致**（含大小写、连字符）。
