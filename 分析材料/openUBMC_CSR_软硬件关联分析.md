# openUBMC CSR 软硬件关联分析报告

> 分析范围：`vpd-main/vendor/openUBMC/` 目录下全部 66 个 CSR 文件（33 对板卡）
> 分析时间：2026-04-05
> 配套可视化：`web-app` → "服务器软硬件关联网络" 视图

---

## 1. CSR 文件格式概述

CSR（Component Self-description Record）是 openUBMC 使用的板卡自描述格式，每张板卡由两个 JSON 文件描述：

| 文件类型 | 命名规则 | 主要内容 |
|---------|---------|---------|
| 硬件文件 | `<产品码>_<UID>.sr` | `ManagementTopology`（I²C 总线树）+ `Objects`（芯片/连接器配置） |
| 软件文件 | `<产品码>_<UID>_soft.sr` | `Objects`（组件/事件/传感器/FRU 定义） |

### 文件顶层结构

```json
{
  "FormatVersion": "3.00",
  "DataVersion": "3.07",
  "Unit": { "Type": "IEU", "Name": "RiserCard_1" },
  "ManagementTopology": {
    "Anchor": { "Buses": ["Hisport_0"] },
    "Hisport_0": { "Buses": ["I2c_0"] },
    "I2c_0": { "Chips": ["Eeprom_IEU"], "Buses": ["PCA9545_ch0"] }
  },
  "Objects": {
    "Eeprom_IEU": { "Address": 174, "OffsetWidth": 2 },
    "Component_RiserCard": { "Instance": "${Slot}", "Type": 255 },
    "Event_RiserCardReplaceMntr": { "Component": "#/Component_RiserCard" }
  }
}
```

---

## 2. 整机硬件架构

### 2.1 板卡类型统计

| 类型 | 数量 | 功能说明 | 代表型号 |
|-----|-----|---------|---------|
| **PSR** | 1 | 平台服务资源板（主控/BMC） | S920X20 |
| **EXU** | 2 | 扩展单元（系统管理扩展板） | BC83SMMBD, BC83SMMBC |
| **BCU** | 1 | CPU 板 | BC83AMDA |
| **CLU** | 1 | 风扇板 | BC83FDCA |
| **IEU** | 15 | PCIe 扩展单元（Riser 卡） | BC83PRU*/BC83PRV* 系列 |
| **SEU** | 10 | 存储扩展单元（硬盘背板/M.2转接卡） | BC83NHB*/BC83HBB*, BC83MSMA |
| **NICCard** | 3 | 网卡 | BC83ETHA/ETHB/ETHBA |
| **合计** | **33** | | |

### 2.2 整机硬件对象统计

| 对象类型 | 总数 | 说明 |
|---------|-----|-----|
| 芯片（Chip/EEPROM/SMC/LM75/CDR/PCA9xxx） | ~260 | I²C 可寻址设备，具有 Address 字段 |
| 连接器（Connector/BusinessConnector） | ~120 | PCIe 插槽、背板接口等 |
| I²C MUX（PCA9545/PCA9555 通道） | ~54 | 总线扩展，带 ChannelId |
| **硬件对象合计** | **434** | |

### 2.3 I²C 管理拓扑结构

每张板卡的 `ManagementTopology` 描述物理 I²C 总线树，遍历规则：

```
Anchor
  └─ Hisport_0  (HiSpeed 主总线，连接到主板)
       └─ I2c_0
            ├─ Chips: [Eeprom_IEU]          (叶节点：芯片)
            └─ Buses: [PCA9545_ch0]          (MUX 通道)
                   └─ Chips: [Pca9555_GPIO]  (下级芯片)
                   └─ Connectors: [PCIe_Slot_1]
```

---

## 3. 软件层分析

### 3.1 软件对象类型与统计

| 对象类型 | 前缀 | 总数（估） | 功能 |
|---------|-----|---------|-----|
| Component | `Component_` | ~150 | FRU 组件注册 |
| Event | `Event_` | ~1800 | 健康事件监控 |
| Scanner | `Scanner_` | ~800 | I²C 寄存器扫描 |
| ThresholdSensor | `ThresholdSensor_` | ~200 | 阈值传感器 |
| DiscreteSensor | `DiscreteSensor_` | ~50 | 离散传感器 |
| FruData / Fru | `FruData_`, `Fru_` | ~130 | FRU 数据绑定 |
| 固件/诊断 | `MCUFirmware_`, `Dft*` | ~140 | MCU 固件、自诊断 |
| **合计** | | **~3273** | |

---

## 4. 软硬件关联关系

### 4.1 硬件→软件关联（共 1122 条）

软件对象通过 `#/ChipName` 指针引用硬件对象：

```json
"Scanner_InletTemp": { "Chip": "#/Lm75_InletTemp" },
"FruData_IEU":       { "FruDev": "#/Eeprom_IEU" },
"MCUFirmware_1":     { "RefChip": "#/Chip_MCU1" }
```

| 关联类型 | 说明 |
|---------|-----|
| Scanner → Chip/SMC | 传感器读取 I²C 芯片寄存器 |
| FruData → Eeprom | FRU 数据存储在 EEPROM |
| MCUFirmware → MCU | 固件管理绑定 MCU 芯片 |
| SRUpgrade → Eeprom | SR 升级存储芯片 |

### 4.2 软件内部关联（共 344 条）

软件对象间通过 `#/SwObjectId` 互相引用：

```json
"Event_RiserCardReplaceMntr": {
  "Component": "#/Component_RiserCard",
  "Reading":   "#/Scanner_RiserPres"
},
"Fru_IEU": { "FruDataId": "#/FruData_IEU" }
```

| 引用模式 | 数量 | 说明 |
|---------|-----|-----|
| Event → Component | 最多 | 事件绑定到 FRU 组件 |
| Event → Event | ~260 | 事件级联触发 |
| Fru → FruData | ~34 | FRU 状态绑定存储 |
| DftEeprom → FruData | ~32 | 自诊断引用 FRU 数据 |
| Event → ThresholdSensor | ~9 | 事件读取传感器阈值 |

### 4.3 板卡间关联（共 23 条）

PSR 作为管理中枢，通过 UID 白名单机制维护全机槽位注册表：

```json
"UnitConfiguration_IEU1": {
  "SlotType": "IEU", "SlotNumber": 1,
  "CompatibleBoardId": ["00000001040302023945", ...]
},
"Event_IEU1_UBNotPresent": {
  "RefUnit": "#/UnitConfiguration_IEU1"
}
```

| PSR 管理目标 | 槽位数 |
|-----------|-------|
| IEU（PCIe 扩展）| 10 个（IEU1-4, 11-14, 21-22）|
| SEU（存储扩展）| 5 个 |
| EXU（系统扩展）| 1 个 |
| FlexIO（NIC）| 4 个 |

---

## 5. 关键板卡深度分析

### 5.1 PSR — 平台服务资源板

- **UID：** `00000001040302023953`
- **软件：** 6 Component + 17 Event + 8 hw↔sw + 6 sw↔sw + **22 板间关联**
- **特点：** 全机唯一的槽位注册中心，每个扩展槽在此有 `UnitConfiguration_*` 记录

### 5.2 EXU — 扩展单元（最高关联密度）

- **硬件：** 13~14 芯片（3× SMC, 3× EEPROM, 2× PCA9545, 2× LM75, CPLD）
- **软件：** 88~89 事件，16 传感器，~90 hw↔sw 关联（全机最高）
- **特点：** `Smc_ExpBoardSMC` 单芯片承载数十个 Scanner，是全机最复杂的关联节点

### 5.3 IEU — PCIe 扩展单元（软件高度标准化）

- **15 种型号：** PCIe Gen4/5，X8/X16 各组合，部分含 TianChi 接口
- **软件层（所有型号一致）：** 1 Component + 1 Event + 1 FruData + 1 Fru
- **特点：** 硬件多样，软件标准化，体现接口规范化设计

### 5.4 SEU — 存储扩展单元

- 覆盖 2.5"/3.5" HDD 背板（2~24 盘位）和 M.2 转接卡
- BC83MSMA 含跨板 `PcieAddrInfo_SAS_*` 引用（唯一非 PSR 的板间关联）

### 5.5 NICCard — 网卡（3 种规格）

| 型号 | 规格 | 特殊芯片 |
|-----|-----|---------|
| BC83ETHA | 4×1GE | LM75 |
| BC83ETHB | 2×25GE | CDR5902L Retimer |
| BC83ETHBA | 1×100GE | CDR5902L Retimer |

---

## 6. 全局统计汇总

| 维度 | 数量 |
|-----|-----|
| 板卡总数 | 33 |
| 硬件对象总数 | 434 |
| 软件对象总数 | 3273 |
| 硬件↔软件关联 | **1122** |
| 软件↔软件关联 | **344** |
| 板卡间关联 | **23** |

---

## 7. 设计规律总结

1. **自描述原则**：每张板卡 CSR 文件自包含完整定义，无跨文件依赖
2. **hw→sw 单向绑定**：软件引用硬件，不反向，解耦稳定性与灵活性
3. **PSR 中心化管理**：全机唯一管理中枢，持有所有扩展槽注册表
4. **IEU 标准化**：15 种硬件变体，软件层完全一致
5. **事件三层链路**：传感器（Scanner）→事件（Event）→组件（Component）
6. **CSR 运行时表达式**：`${Slot}` 动态槽位绑定，`<=/Obj.Field` 跨对象引用

---

## 8. 配套可视化说明

**服务器软硬件关联网络**视图提供三层交互：

| 层次 | 功能 |
|-----|-----|
| 概览层 | 33 张板卡分类展示，miniGraph 显示关联密度（白线=hw↔sw，绿虚线=sw↔sw） |
| 详情层·硬件↔软件 | 两列对比，点击对象高亮关联集合 |
| 详情层·软件↔软件 | Event→Component 等内部引用链分组列出 |
| 详情层·板卡间 | 跨板 UID 引用，显示目标板卡类型、名称、引用来源 |

---

*本文档由 openUBMC CSR 拓扑编辑器分析生成 · 2026-04-05*
