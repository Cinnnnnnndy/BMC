# openUBMC 开源仓数据抽成清单

> 数据源: `vpd-main/vendor/openUBMC/` 目录下的 `.sr` / `_soft.sr` 文件
> 抽取时间: 2026-04-21
> 抽取脚本: `web-app-vue/scripts/gen-boards.mjs`
> 机器可读版: `web-app-vue/src/data/boards.ts` （`BOARDS` 常量）

---

## 1. 文件命名规则

```
<PartNumber>_<SerialNumber>[_soft].sr
```

| 字段            | 含义                                              | 例                      |
| --------------- | ------------------------------------------------- | ----------------------- |
| `PartNumber`    | 板卡物料号（同一物料号可对应一种板类型）          | `14100513`              |
| `SerialNumber` | 具体板卡实例的序列号                               | `00000001040302044498`  |
| `_soft` 后缀    | 软件侧描述（加固件映射、驱动拓扑）；无此后缀为硬件侧描述 | `…_soft.sr`             |

**一块"物理板" = 一对 `.sr` + `_soft.sr`**。抽取脚本按 `PartNumber_SerialNumber`
为键把这两个文件合并成一条 `BoardRecord`。

## 2. 文件内容结构（`.sr` = JSON）

```json
{
  "FormatVersion": "3.00",
  "DataVersion": "3.17",
  "Unit": {           // 可能缺失 → 记为 Unknown
    "Type": "EXU",    // BCU / CLU / EXU / IEU / SEU / NICCard ...
    "Name": "ExpBoard_1"
  },
  "ManagementTopology": {   // 硬件 I2C / JTAG / Hisport 拓扑
    "Anchor":   { "Buses": ["I2c_1", "I2c_2", …, "Hisport_21"] },
    "I2c_1":    { "Chips": ["Smc_CpuBrdSMC"],      "Connectors": [...] },
    "I2c_4":    { "Chips": ["Smc_FanBoardSMC"],    "Connectors": [...] },
    "I2c_7":    { "Chips": ["Pca9545_i2c7_chip"] },
    ...
  },
  "Objects": { ... }        // 传感器、FRU、LED 等元数据
}
```

> 目前 Vue 思维导图视图只消费 `Unit.Type` / `Unit.Name`。`ManagementTopology`
> 里的 I2C → Mux → Chip 详情用于"详情"视图，v1 暂用 React 原视图移植的模拟
> 数据，后续再打通。

## 3. 板卡类型约定

| Type     | 全称（推断）                     | Unit.Name 示例          | 作用                      |
| -------- | -------------------------------- | ----------------------- | ------------------------- |
| `BCU`    | Baseboard / CPU Unit             | `CpuBoard_1`            | CPU 主板                  |
| `CLU`    | Cooling Unit                     | `FanBoard_1`            | 风扇板                    |
| `EXU`    | Expansion Unit                   | `ExpBoard_1`            | 拓展板（连接其他板的 hub）|
| `IEU`    | I/O Expansion Unit               | `RiserCard_1`           | Riser 卡                  |
| `SEU`    | Storage Expansion Unit           | `HddBackplane_1`, `M2TransferCard_1` | 存储/转接板   |
| `NICCard`| 网卡                             | `BoardNICCard_1`        | 网卡                      |
| `Unknown`| `.sr` 里没有 `Unit` 字段         | —                       | 未分类                    |

## 4. 拓扑关系（管理面）

从 `EXU` 的 `ManagementTopology` 可以看出扩展板是整个管理拓扑的 hub：

```
EXU
├─ I2c_1 → Connector_BCU_1     → BCU  (CpuBoard)
├─ I2c_4 → Connector_CLU_1     → CLU  (FanBoard)
├─ I2c_5 → Connector_SEU_1     → SEU  (HddBackplane / M2TransferCard)
├─ I2c_7 → Pca9545_i2c7_chip   → 下挂多个 IEU (RiserCard)
├─ I2c_8 → Lm75_InletTemp, Chip_UsbCc_On, Chip_UsbCc_Sgm
└─ Hisport_0..21                → 高速管理口（内部通信）
```

思维导图视图据此画出：

```
BMC ── EXU ── BCU / CLU / IEU / SEU / NICCard / (Unknown)
```

## 5. 抽成清单（33 张物理板）

> 源: 66 个 `.sr` 文件，按 `PartNumber_SerialNumber` 聚合为 33 条记录。

### 5.1 统计

| 组 (Type · Name)                     | 数量 |
| ------------------------------------ | ---- |
| BCU · CpuBoard_1                     | 1    |
| CLU · FanBoard_1                     | 1    |
| EXU · ExpBoard_1                     | 2    |
| IEU · RiserCard_1                    | 15   |
| SEU · HddBackplane_1                 | 9    |
| SEU · M2TransferCard_1               | 1    |
| NICCard · BoardNICCard_1             | 3    |
| Unknown · Unknown                    | 1    |
| **合计**                             | **33** |

### 5.2 完整清单

| # | PartNumber | SerialNumber            | Type    | Name               |
| - | ---------- | ----------------------- | ------- | ------------------ |
|  1 | 14060876   | 00000001020302031825    | BCU     | CpuBoard_1         |
|  2 | 14100363   | 00000001050302023924    | CLU     | FanBoard_1         |
|  3 | 14100513   | 00000001010302044491    | EXU     | ExpBoard_1         |
|  4 | 14100513   | 00000001010302044492    | EXU     | ExpBoard_1         |
|  5 | 14100513   | 000000010402580311      | IEU     | RiserCard_1        |
|  6 | 14100513   | 000000010402580324      | IEU     | RiserCard_1        |
|  7 | 14100513   | 00000001040302023945    | IEU     | RiserCard_1        |
|  8 | 14100513   | 00000001040302023947    | IEU     | RiserCard_1        |
|  9 | 14100513   | 00000001040302023953    | Unknown | Unknown            |
| 10 | 14100513   | 00000001040302025554    | IEU     | RiserCard_1        |
| 11 | 14100513   | 00000001040302044498    | IEU     | RiserCard_1        |
| 12 | 14100513   | 00000001040302044499    | IEU     | RiserCard_1        |
| 13 | 14100513   | 00000001040302044501    | IEU     | RiserCard_1        |
| 14 | 14100513   | 00000001040302044502    | IEU     | RiserCard_1        |
| 15 | 14100513   | 00000001040302044504    | IEU     | RiserCard_1        |
| 16 | 14100513   | 00000001040302046567    | IEU     | RiserCard_1        |
| 17 | 14100513   | 00000001040302046572    | IEU     | RiserCard_1        |
| 18 | 14100513   | 00000001040302046574    | IEU     | RiserCard_1        |
| 19 | 14100513   | 00000001040302052957    | IEU     | RiserCard_1        |
| 20 | 14100513   | 00000001040302066464    | IEU     | RiserCard_1        |
| 21 | 14100665   | 00000001030302023925    | SEU     | HddBackplane_1     |
| 22 | 14100665   | 00000001030302023933    | SEU     | HddBackplane_1     |
| 23 | 14100665   | 00000001030302023934    | SEU     | HddBackplane_1     |
| 24 | 14100665   | 00000001030302023936    | SEU     | HddBackplane_1     |
| 25 | 14100665   | 00000001030302023938    | SEU     | HddBackplane_1     |
| 26 | 14100665   | 00000001030302023954    | SEU     | M2TransferCard_1   |
| 27 | 14100665   | 00000001030302024340    | SEU     | HddBackplane_1     |
| 28 | 14100665   | 00000001030302044496    | SEU     | HddBackplane_1     |
| 29 | 14100665   | 00000001030302046566    | SEU     | HddBackplane_1     |
| 30 | 14100665   | 00000001030302046571    | SEU     | HddBackplane_1     |
| 31 | 14220246   | 00000001100302023955    | NICCard | BoardNICCard_1     |
| 32 | 14220246   | 00000001100302023956    | NICCard | BoardNICCard_1     |
| 33 | 14220246   | 00000001100302025549    | NICCard | BoardNICCard_1     |

### 5.3 特殊记录

- **#9 (14100513_00000001040302023953)**: 同时缺 `.sr` 和 `_soft.sr` 两个文件的 `Unit` 字段 → 判定为 Unknown
- **#23 (14100665_00000001030302023934)**: `.sr` 无 `Unit`，但 `_soft.sr` 有 `Unit.Type=SEU` → 合并后分类为 SEU/HddBackplane_1

## 6. 数据更新流程

```bash
cd web-app-vue

# 默认路径: ../../../vpd-main/vendor/openUBMC
node scripts/gen-boards.mjs

# 自定义路径
OPENUBMC_DIR=/abs/path/openUBMC node scripts/gen-boards.mjs
```

脚本会就地更新 `src/data/boards.ts` 中的 `BOARDS` 数组（其他代码不动）。
此 md 文档需要手工同步更新；也可以在 gen-boards 脚本里加一步同时 dump 出
markdown 表格。

## 7. 后续扩展思路

- [ ] 解析 `ManagementTopology` 每张板的 I2C/Mux/Chip 结构，生成"详情视图"的真实拓扑（替换当前的模拟数据）
- [ ] 把 `Objects` 里的传感器/FRU/LED 元数据抽到独立清单
- [ ] 在 gen-boards 脚本里自动输出一份 JSON manifest，让 Vue 运行时按需按 SN 加载
- [ ] 用 `Connector_*` 字段推断 EXU ↔ 子板的连接关系，取代当前"全部连到 EXU[0]"的硬编码
