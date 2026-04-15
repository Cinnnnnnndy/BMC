# 硬件拓扑展开视图 — I²C 连线分析文档

> 对应视图：openUBMC CSR 拓扑编辑器 → 硬件拓扑 → **展开视图**（开启"I²C连线"图层）  
> 代码文件：`csr-topology-editor/web-app/src/components/HardwareTopologyCanvas.tsx`

---

## 一、视图整体思路

展开视图（Expanded View）将系统中每块硬件板卡单独渲染成一张卡片，并在卡片之间用连线表达物理信号通路。连线分两种协议层：

| 连线类型 | 样式 | 含义 |
|---|---|---|
| **PCIe 连线** | 实线 + 箭头 | 高速数据通道（Hisport / CEM / OCP） |
| **I²C 管理总线** | 虚线 + 箭头 | BMC 管理通道，用于健康监控、固件升级、传感器读取 |

I²C 连线的方向是：**PSR（BMC 主控）→ 各外围板卡**，即 PSR 是 I²C 总线主设备（Master），其余板卡是从设备（Slave）。这与物理拓扑图中"主板发出虚线连到各子板"的含义完全一致。

---

## 二、Hover Tooltip 字段解释

悬停任意 I²C 虚线时，弹出如下信息卡：

```
协议      I²C
方向      PSR → CLU
发送方    BC83RCIA
接收方    BC83FDCA
入口总线  I²C_2
入口芯片  Smc_ExpBoardSMC
```

### 字段含义

#### 协议（Protocol）
当前连线所使用的通信协议。I²C（Inter-Integrated Circuit）是一种两线串行总线，在 BMC 固件中用于：
- 读取温度传感器（LM75）
- 读写板卡 EEPROM（VPD 信息）
- 控制 SMC（子板管理控制器）进行固件升级

#### 方向（Direction）
`fromType → toType`，表示 **数据流的起点和终点板卡类型**。I²C 管理总线中 PSR 始终是发起方（Master），其余类型（CLU/BCU/IEU/SEU/EXU）是响应方（Slave）。

#### 发送方 / 接收方（fromName / toName）
具体的板卡 UID 名称（如 BC83RCIA 是 PSR 板，BC83FDCA 是 CLU 风扇板），来自 SR 文件中的 `Unit.Name` 字段。一个类型可能有多块实例，所以需要显示具体型号。

#### 入口总线（Entry Bus）

**这是最关键的字段。**

每块外围板卡的 `ManagementTopology` 中，`Anchor` 下挂了若干总线（Buses）。其中有一条总线专门用于接收来自主板 PSR 的 I²C 信号，这条总线就叫**入口总线**。

识别方式：找到挂载了 `Smc_ExpBoardSMC` 芯片的那条总线。

```json
// 以 CLU 风扇板为例（SR 文件 ManagementTopology）
{
  "Anchor": { "Buses": ["I2c_2", "I2c_4"] },
  "I2c_2": {
    "Chips": ["Smc_ExpBoardSMC"],     ← 这条总线就是入口总线
    "Connectors": ["Connector_Fan1DualSensor", ...]
  }
}
```

不同板卡类型的入口总线名称不同：

| 板卡类型 | 入口总线示例 | 说明 |
|---|---|---|
| CLU 风扇板 | `I²C_2` | 标准 I²C 总线编号 |
| BCU CPU板 | `I²C_2` | 同上 |
| EXU 扩展板 | `I²C_2` | 同上 |
| SEU 背板 | `I²C_2` | 同上 |
| IEU 扩展卡 | `Hisport_0` | 通过高速端口传输，内部再走 I²C |
| PSR BMC板 | （自身是主控，无入口） | — |

> **为什么 IEU 是 Hisport_0？**  
> IEU（Riser Card）没有独立的物理 I²C 接口，它通过 PCIe Hisport 连接到 BCU，BCU 再将管理 I²C 信号转发进来。SR 文件中的 `Anchor → Hisport_0 → Pca9545_PCA9545` 拓扑正是这一结构的代码表达。

#### 入口芯片（Entry Chip）

固定为 `Smc_ExpBoardSMC`（SMC = Sub-Board Management Controller，子板管理控制器）。

这是每块外围板卡上必须存在的标准芯片，I²C 地址固定为 `0x60`。PSR 通过 I²C 访问它来：
- 下发固件升级命令
- 读取板卡健康状态
- 触发板卡复位

`Smc_ExpBoardSMC` 是整个 I²C 管理总线的"物理终点"，因此在视图中高亮（蓝色发光边框），并作为入口总线连线的对齐锚点。

---

## 三、连线绘制逻辑

### 3.1 方向定义（BOARD_CONNECTIONS）

```typescript
// HardwareTopologyCanvas.tsx
const BOARD_CONNECTIONS = [
  // I²C：左=PSR(主控/input)，右=各板卡(slave/output)
  { fromType: 'PSR', toType: 'BCU', label: 'I²C 管理总线', color: '#0ea5e9', style: 'dashed' },
  { fromType: 'PSR', toType: 'CLU', label: 'I²C 管理总线', color: '#0ea5e9', style: 'dashed' },
  { fromType: 'PSR', toType: 'IEU', label: 'I²C 管理总线', color: '#0ea5e9', style: 'dashed' },
  { fromType: 'PSR', toType: 'EXU', label: 'I²C 管理总线', color: '#0ea5e9', style: 'dashed' },
  { fromType: 'PSR', toType: 'SEU', label: 'I²C 管理总线', color: '#0ea5e9', style: 'dashed' },
  // PCIe：实线
  { fromType: 'BCU', toType: 'IEU', label: 'PCIe Hisport↔UBCDD', color: '#3b82f6', style: 'solid' },
  ...
];
```

### 3.2 入口总线查找（getI2cEntryInfo）

```typescript
function getI2cEntryInfo(board: HwBoard): { y: number; busId: string } {
  // 找到挂载了 Smc_ExpBoardSMC 的总线
  const anchorBuses = board.topoNodes.filter(n => n.parent === 'Anchor');
  const mgmtBusIdx = anchorBuses.findIndex(bus =>
    board.topoNodes.some(n => n.parent === bus.id && n.id === 'Smc_ExpBoardSMC')
  );
  const bus = anchorBuses[Math.max(0, mgmtBusIdx)];
  return {
    y: /* 该总线在卡片中的 Y 坐标 */,
    busId: bus?.id ?? '',  // e.g. "I2c_2" 或 "Hisport_0"
  };
}
```

### 3.3 连线终点对齐到入口总线

```typescript
// I²C 连线终点不是板卡中心，而是对齐到 Smc_ExpBoardSMC 所在总线的 Y 位置
const entryInfo = conn.style === 'dashed' ? getI2cEntryInfo(tb) : null;
const toEntryY = entryInfo ? entryInfo.y : BOARD_H / 2;
const ty = tp.y + toEntryY;  // 精确对齐到入口总线行

// 贝塞尔曲线路径
const d = `M ${fx} ${fy} C ${cp1x} ${fy} ${cp2x} ${ty} ${tx} ${ty}`;
```

### 3.4 板卡左侧入口端口指示器

```typescript
// BoardNode 组件：在卡片左边缘绘制蓝色圆点，标明 I²C 信号进入的确切位置
{i2cEntryY !== null && cvs.showI2C && (
  <div style={{
    position: 'absolute',
    left: -8,
    top: i2cEntryY - 6,      // 与入口总线行对齐
    width: 12, height: 12,
    borderRadius: '50%',
    background: '#0ea5e9',   // 蓝色 = I²C 信号
    boxShadow: '0 0 6px rgba(14,165,233,0.7)',
  }} />
)}
```

---

## 四、板卡内部 I²C 结构（MiniBusDiagram）

每张板卡卡片内展示了该板卡的 I²C 内部拓扑，来自 SR 文件的 `ManagementTopology` 字段。

```
板卡卡片（BoardNode）
├── 标题：BC83FDCA (CLU)
├── I²C_1 ─── [CpuBrdSMC] [BCU_EEPROM] ...    ← 内部总线
├── I²C_2 ← PSR I²C ──── [Smc_ExpBoardSMC]    ← 入口总线（蓝色标注）
├── I²C_8
└── JTAG_1 ── [Cpld_1]
```

- 入口总线旁有 `← PSR I²C` 徽章标注
- `Smc_ExpBoardSMC` 芯片节点用蓝色发光边框高亮，与外部 I²C 虚线在视觉上形成"同一根线"的连续感

---

## 六、Connector 概念的两层含义

代码中出现的 "Connector" 有**两种完全不同的含义**，需严格区分：

---

### 6.1 TopoNode Connector（拓扑节点连接器）

**定义**：`ManagementTopology` 树中 `type: "connector"` 的 `TopoNode` 节点。它**不是板卡间的物理边连接器**，而是某个物理插槽/接口在 I²C 管理层面的抽象节点。

**作用**：PSR 通过 I²C 总线可以侦测该插槽的 **在位信号（Presence）** 和 **侧带信号（Sideband）**，例如：
- 风扇是否插入 → `Connector_Fan1DualSensor`
- PCIe 卡是否插入 → `Connector_PCIE_SLOT2`

**在数据中的分布**：

| 板卡 | I²C 总线 | Connector 节点示例 | 含义 |
|---|---|---|---|
| CLU 风扇板 | `I2c_2` | `Connector_Fan1DualSensor` … `Connector_Fan8DualSensor` | 8 个风扇位在位检测 |
| BCU CPU板 | `I2c_1` | `Connector_DIMM0` … `Connector_Module0` 等 25个 | 内存/扩展模块插槽在位 |
| IEU 扩展卡 | `I2cMux_Pca9545_PCA9545_2` | `Connector_PCIE_SLOT2` | PCIe 槽在位（经 I²C Mux 管理） |
| IEU 扩展卡 | `I2cMux_Pca9545_PCA9545_3` | `Connector_PCIE_SLOT3` | PCIe 槽在位（经 I²C Mux 管理） |

```json
// CLU ManagementTopology 示例
{
  "I2c_2": {
    "Chips": ["Smc_ExpBoardSMC"],
    "Connectors": [
      "Connector_Fan1DualSensor",
      "Connector_Fan2DualSensor",
      ...
    ]
  }
}
```

---

### 6.2 BusinessConnector（业务连接器）

**定义**：SR 文件顶层 `businessConnectors[]` 数组中的条目，描述**板卡间的物理边缘连接器**（PCIe 插槽、高速端口等）。

**关键字段**：

| 字段 | 含义 |
|---|---|
| `id` | 连接器唯一标识，如 `BusinessConnector_4` |
| `direction` | `Upstream`（该板卡是接收方）/ `Downstream`（该板卡是提供方） |
| `connType` | 连接类型：`UBCDD`、`PCIe CEM`、`SAS`、`UBC` |
| `refConnector` | **关键桥接字段**，见第七节 |

**在数据中的分布**：

| 板卡 | businessConnectors 数量 | 典型 connType |
|---|---|---|
| BCU CPU板 | 0（无独立业务连接器字段） | — |
| CLU 风扇板 | 0 | — |
| IEU 扩展卡 | 3 | 1× UBCDD Upstream + 2× PCIe CEM Downstream |
| SEU 背板 | 9 | 1× UBC Upstream + 8× SAS Downstream |
| PSR BMC板 | 0 | — |

---

### 6.3 两种 Connector 的对比

| 维度 | TopoNode Connector | BusinessConnector |
|---|---|---|
| **位置** | `ManagementTopology` 树节点 | SR 顶层 `businessConnectors[]` |
| **物理含义** | 插槽在位检测节点（I²C 可读） | 板卡间物理边连接器 |
| **协议层** | I²C 管理平面 | PCIe / SAS / UBC 数据平面 |
| **跨板** | 仅表示本板上的插槽状态，不跨板 | 描述跨板连接关系（有 fromBoard/toBoard） |
| **在视图中** | 体现为板卡卡片内 MiniBusDiagram 的子节点 | 驱动画布上 PCIe 实线连线的生成 |

---

## 七、refConnector — I²C 与 PCIe 的代码桥接字段

`BusinessConnector.refConnector` 是连接 **PCIe 物理层**与 **I²C 管理层**的关键字段。

### 7.1 字段含义

当一块板卡提供 PCIe CEM 下游槽（`Downstream`），该槽的 **物理在位和侧带状态**是由 I²C 管理总线来读取的。`refConnector` 字段就记录了"哪一个 TopoNode Connector 负责管理这个 PCIe 槽"：

```json
// IEU 扩展卡 businessConnectors 示例（简化）
{
  "id": "BusinessConnector_Down_2",
  "direction": "Downstream",
  "connType": "PCIe CEM X8",
  "refConnector": "Connector_PCIE_SLOT2"   ← 指向本板 TopoNode 中的管理节点
}
```

```json
// 对应的 ManagementTopology（I²C 侧）
{
  "Hisport_0": {
    "Chips": ["Smc_ExpBoardSMC"],
    "I2cMux_Pca9545_PCA9545_2": {
      "Connectors": ["Connector_PCIE_SLOT2"]   ← 同一个 ID，从这里读在位
    }
  }
}
```

### 7.2 桥接关系图

```
PCIe 数据平面                    I²C 管理平面
─────────────────                ─────────────────────────────
BusinessConnector_Down_2         Hisport_0
  connType: PCIe CEM    ──────►    └─ I2cMux_Pca9545_PCA9545_2
  refConnector: ─────────────────────   └─ Connector_PCIE_SLOT2
```

### 7.3 当前视图中的使用情况

目前 `HardwareTopologyCanvas.tsx` 的连线生成逻辑**仅读取 `businessConnectors` 的 `connType` 和 `direction`** 来决定画哪条 PCIe 实线，**尚未读取 `refConnector`** 来在视图中标注"这条 PCIe 线的在位管理由哪条 I²C 总线负责"。

这意味着：当前展开视图中，PCIe 实线和 I²C 虚线在视觉上是**相互独立的两套线**，虽然物理上同一根 Hisport 线缆同时承载两者。

---

## 八、板卡内部 I²C 结构：非 PSR 管理总线

当前展开视图只展示了"PSR → 各板卡"这一管理路径（入口总线），但实际上每块板卡内部还存在**独立的板内 I²C 子网络**，用于板内自管理。

### 8.1 各板卡的内部 I²C 总线

#### CLU 风扇板

| 总线 | 芯片/连接器 | 功能 |
|---|---|---|
| `I2c_2` | `Smc_ExpBoardSMC`（入口） | PSR 管理入口（已在视图中显示） |
| `I2c_4` | `Smc_FanBoardSMC` + `Eeprom_CLU` + `Chip_Fan_PWM` | **风扇板内部自管理**：自身 SMC、VPD 读写、风扇 PWM 控制 |

#### BCU CPU板

| 总线 | 芯片/连接器 | 功能 |
|---|---|---|
| `I2c_2` | `Smc_ExpBoardSMC`（入口） | PSR 管理入口 |
| `I2c_1` | `Smc_CpuBrdSMC` + `Eeprom_BCU` + 25个Connector节点 | **CPU板内部自管理**：CPU板 SMC、VPD、内存插槽在位 |
| `Hisport_0`~`Hisport_21` | 各 PCIe Hisport 端口 | 面向 IEU 的高速 PCIe 通道（数据+管理） |

#### SEU 背板

| 总线 | 芯片/连接器 | 功能 |
|---|---|---|
| `I2c_2` | `Smc_ExpBoardSMC`（入口） | PSR 管理入口 |
| `I2c_5` | `Smc_EnclSMC` + `Eeprom_SEU` | **背板自管理**：机框 SMC、VPD 读写 |

#### IEU 扩展卡（特殊）

| 总线 | 芯片/连接器 | 功能 |
|---|---|---|
| `Hisport_0` | `Smc_ExpBoardSMC`（入口）+ I²C Mux 树 | PSR 管理入口（经 BCU Hisport 转发） |
| `I2cMux_Pca9545_PCA9545_2` | `Connector_PCIE_SLOT2` | PCIe 槽 2 在位管理（挂在 I²C Mux 下） |
| `I2cMux_Pca9545_PCA9545_3` | `Connector_PCIE_SLOT3` | PCIe 槽 3 在位管理 |

### 8.2 内部 I²C 是否存在跨板关联？

**结论：当前 SR 数据中，板内 I²C 子网络（非入口总线）不存在直接的跨板 I²C 连接。**

分析依据：
- 所有 `refConnector` 引用均指向**同一块板卡**的 TopoNode Connector，没有跨板指向
- `Smc_FanBoardSMC`（CLU）、`Smc_CpuBrdSMC`（BCU）、`Smc_EnclSMC`（SEU）均只服务本板
- IEU 的 I²C 子树（Pca9545 Mux）虽然从物理上通过 BCU Hisport 接入，但在拓扑数据中它被归属于 IEU 板自己的 `ManagementTopology`

**特殊情况 — IEU 的 I²C 可达性：**

```
PSR (I²C Master)
  └─ I²C 物理线 ──► BCU (中继)
                      └─ Hisport (PCIe 侧带信道) ──► IEU
                                                      ├─ Smc_ExpBoardSMC  (I²C 入口)
                                                      └─ I2cMux_Pca9545
                                                           ├─ Connector_PCIE_SLOT2
                                                           └─ Connector_PCIE_SLOT3
```

IEU 的 I²C 子树在**物理上由 PSR 通过 BCU Hisport 转发**，但在**数据模型上属于 IEU 自己的 ManagementTopology**。因此展开视图将其作为 IEU 内部结构展示，入口总线标注为 `Hisport_0`。

### 8.3 I²C 线与 PCIe 线的关系

| 维度 | PCIe 连线（实线） | I²C 连线（虚线） |
|---|---|---|
| **协议** | PCIe Gen4/Gen5 | I²C（400 kHz） |
| **用途** | 高速数据传输（NVMe、GPU 等） | 低速管理（固件、健康、VPD） |
| **物理载体** | 独立 PCIe 差分对 | 对于 Hisport：复用同一根线缆的侧带信号 |
| **在视图中** | 蓝色实线，板卡到板卡 | 蓝色虚线，PSR 到各板卡 |
| **代码桥接** | `businessConnectors[].connType` | `businessConnectors[].refConnector → TopoNode Connector` |

**同一物理 Hisport 线缆同时承载两者：**
- 主差分对 = PCIe 数据通道（实线表示）
- 侧带线对 = I²C 管理通道（虚线表示）

当前视图将两者画成两条独立的线，但它们实际上是同一根物理线缆的两个信号面。

---

## 九、当前视图的局限性与可扩展方向

当前展开视图展示的是**第一层管理路径**（PSR → 各板卡入口总线），以下内容**尚未纳入视图**，但技术上可实现：

### 9.1 板内 I²C 子网络（非入口总线）

目前每块板卡的 `MiniBusDiagram` 会显示所有总线（含内部总线），但内部 I²C 总线（如 `I2c_4/Smc_FanBoardSMC`）的**跨板语义尚未体现**。

**可扩展方向**：
- 在卡片内对内部总线添加标注，区分"PSR 管理入口"和"板内自管理"（已部分实现：入口总线有 `← PSR I²C` 徽章）
- 增加图例说明两类 I²C 总线的不同颜色

### 9.2 PCIe 线与 I²C 管理节点的联动高亮

当用户 Hover PCIe 实线时，可同时高亮对应的 `refConnector` I²C 管理节点，表达"这条 PCIe 线的在位管理是由这个 I²C 节点负责的"。

**实现思路**：
```typescript
// PCIe 实线 hover 时，查找 refConnector 并高亮
const refNode = toBoard.topoNodes.find(n => n.id === conn.refConnector);
if (refNode) highlightTopoNode(refNode.id);
```

### 9.3 Hisport I²C 转发路径（PSR→BCU→IEU）

当前 IEU 的 I²C 入口显示为 `Hisport_0`，但视图并未画出**PSR → BCU → IEU 的两段 I²C 路径**（先走 PSR→BCU I²C，再由 BCU Hisport 转发到 IEU）。

**可扩展方向**：在 PSR→IEU 虚线的 Tooltip 中增加"经由 BCU 中继"说明，或在视图中增加一段折线经过 BCU 而不是直连 PSR→IEU。

### 9.4 Connector 在位状态（实时数据）

TopoNode Connector 节点目前仅作为静态拓扑展示，未接入实时传感器数据。

**可扩展方向**：若有 BMC 实时数据推送，可在对应的 Connector 节点上显示在位状态（已插入/空槽）颜色标注。

---

## 五、视图设计原则总结

| 设计原则 | 实现方式 |
|---|---|
| **左=输入，右=输出** | PSR 固定在最左列，连线箭头向右指向各板卡 |
| **外部线 → 内部结构连通** | I²C 虚线终点精确对齐到板卡内部入口总线行，端口圆点作为视觉锚点 |
| **同一根物理线的可追溯性** | 外部虚线颜色（`#0ea5e9`）、端口圆点颜色、内部 `← PSR I²C` 标签、`Smc_ExpBoardSMC` 高亮色统一为同一蓝色系 |
| **Hover 可读性** | 悬停连线显示协议/方向/板卡名/入口总线名，无需打开详情面板即可了解连线属性 |
| **数据来源于 SR 文件** | `entryBusId` 直接读自 `topoNodes`，不是硬编码，不同板型自动适配 |
