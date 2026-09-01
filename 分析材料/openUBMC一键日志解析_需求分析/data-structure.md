# openUBMC 一键日志解析（bmcstudio-log-reviewer v0.0.23）· 数据结构

> 依据：`bmcstudio-log-reviewer-0.0.23.vsix` 反编译后的 `out/` 产物（TypeScript 编译后 JS，源码级证据，标【输入】）。VSIX 本身是 zip 包，`extension/` 下含 `out/backend`（17 个数据模块）、`out/host`（分析会话/PDF 导出）、`out/mcp`（7 个 MCP 工具）、`out/webview`（Vue3 前端）。

---

## ① 实体清单

### Dump 目录（顶层输入实体）

一次"一键日志"采集的解压产物，固定含 `AppDump` 子目录（判定依据，见 `extension.js` / `archive.ts` 的 `findDumpRoot`）。核心子目录：

| 子目录 | 内容 | 消费者 |
|--------|------|--------|
| `AppDump/` | 结构化业务数据根：`event/sel.txt`、`product_mgmt`、`bmc_network`、`frudata/fruinfo.txt`、`firmware_mgmt/firmware_mgmt_info.txt`、`fault_diagnosis/` 等 | overview / fru / detection / faultdiag |
| `LogDump/` | 原始滚动日志：`app.log*`（含 `.gz`）、`operation.log*` | detection（智能诊断的证据来源）、operations |
| MDB 属性快照文件（如 `mdb_info.log`，按 `mdbGetFirst(base, module, objectPath, prop)` 三段式键读取） | openUBMC 组件的属性树导出——**不是 MS Access 数据库**，是纯文本、按对象路径分组的 key-value 快照 | overview/genericinfo、fru 等几乎所有模块 |

> **【推断·待确认】** VSIX 未随附真实 dump 样例（README 提到 `tests/mock_dump/` 但不在本 vsix 包内），本文档的目录/字段清单来自 handler 源码里的路径拼接与解析逻辑，未用真实 dump 交叉验证过字段实际取值分布。

### MDB 属性快照（`parseMDBProperties`，`parsers/mdb.js`）

按对象路径分组的属性表，取值强制类型转换规则（源码逐字复刻）：
```
带引号字符串 → 去引号
"true"/"false" → boolean
"[]" → 空数组
纯数字字符串 → Number
同一属性第一次出现的值生效（后续重复忽略）
空行 → 重置当前对象/属性上下文
```
读取方式统一为 `mdbGetFirst(base, moduleName, objectPath, propertyName)`，例：
```
mdbGetFirst(base, 'event', 'Events', 'Health')                                          → 整机健康态
mdbGetFirst(base, 'product_mgmt', '/bmc/kepler/Systems/1/Product', 'ProductName')        → 产品名
mdbGetFirst(base, 'bmc_network', 'EthernetInterfaces', 'Mac')                            → BMC 网卡 MAC
```

### GenericInfo（`handlers/overview.js: handleGenericInfo`，route `genericinfo`）

| 字段 | 来源 | 说明 |
|------|------|------|
| `HealthSummary.{Critical,Major,Minor}` | MDB `event/Events` 的 `CriticalCount`/`MajorCount`/`MinorCount` | 三级告警计数，字符串转 `parseInt` |
| `Health` | MDB `event/Events.Health`，缺省 `'Normal'` | 整机健康枚举，**枚举值本身未在代码中收窄**（直接透传 MDB 原始字符串） |
| `PowerState` | 硬编码 `'On'` | **【推断·待确认】** 无法从当前 dump 格式取得真实开机状态，代码写死 |
| `IndicatorLEDState` | 硬编码 `'Off'` | 同上，硬编码 |
| `CurrentTime` | `latestEventTime(base)`：取 `sel.txt`/`current_event.txt` 里最晚的事件时间 | 不是采集时刻本身，是"dump 内最新事件时间"的近似替代 |
| `Copyright` | `resolveProfile(ctx).vendor.copyright` | 由机型 Profile（见下）提供，非硬编码华为字符串（源码注释标注"was the hardcoded Huawei string"，说明这是从旧版本重构而来） |
| `FanSupported` / `KVMSupported` | 硬编码 `true` | **魔法值/简化假设**：不区分机型是否真的有风扇/KVM |
| `SystemIds` | 硬编码 `'1'` | 单系统假设 |

### ProductInfo（route `productinfo`）

来自两个定宽/半结构化文本文件的正则/切片解析（非 JSON/YAML）：

| 来源文件 | 解析方式 | 关键字段 |
|---------|---------|---------|
| `AppDump/firmware_mgmt/firmware_mgmt_info.txt` | **定宽列**（`Id(0-32) Name(32-64) Version(64-80) BuildNum(80-90) ReleaseDate(90-115) …Location(186+)`），跳过 `---` 分隔行与表头 `Id ` 行 | `fid === 'ActiveBMC'` → `Product.BMCVersion`；`fid === 'Bios'` → `Product.BIOSVersion` |
| `AppDump/frudata/fruinfo.txt` | 用正则先切出 `FRUID 0（BMC）` 段落，再逐字段匹配 `Product Name/Serial Number/Manufacturer` | `Product.{ProductName,ProductSN,SystemSN,ProductManufacturer}` |

> **动态字段陷阱**：定宽列的边界（`0-32`、`32-64`…）是对源文本格式的硬编码假设，若上游 dump 生成器改变列宽会静默产出错位数据而不报错——这是一处未做防御性校验的耦合点，写进 G 注意事项。

### DetectionItem（智能诊断·规则版，route `detection-report`，`handlers/detection.js`）

**⚠️ 关键发现（【输入】源码级证据）：规则版诊断只扫描"操作失败"一类信号，告警断言扫描与性能异常扫描在代码里被显式禁用。**

```js
// 1. Alarms → cause inference (disabled — accuracy insufficient)
const assertedN = 0;
// 3. Performance anomalies (disabled — accuracy insufficient)
const perfN = 0;
```

实际生效的唯一信号链：`operation.log` 里含 `fail/error/denied/invalid/not found` 关键词的行 → 取失败时间点 → 在 `app.log` 中按"精确模块名(±5min) → 别名模块(±5min) → 全局(±5min)"三级降级窗口查找相邻错误日志 → 指纹去重（数字/十六进制归一化为 `N`/`0xN`）→ 若命中外部规则文件 `detection_rules`（`OPERATION_FAILURE_PATTERNS`/`MODULE_ALIASES`，**不随本 vsix 分发，try/catch 静默降级为空表**）给出建议，否则给通用建议"根据上述 app 日志排查模块运行错误"。

| 字段 | 类型/取值 | 说明 |
|------|----------|------|
| `category` | 固定 `'操作'` | 当前只有这一类（告警/性能类目已停用） |
| `severity` | 固定 `'Warning'` | 规则版不产出 Critical/Major，只有 Warning |
| `cause` | 字符串，含指纹去重后的错误行列表 | 例：`app日志中模块 X 异常(共12条，去重3种) [展示前8种]` |
| `errors` | `string[]`，最多 8 条 | 已做数字/十六进制归一化去重的原始日志行 |
| `suggestion` | 字符串 | 命中 `detection_rules` 关键词表则给具体建议，否则给通用兜底建议 |

限流：单次最多返回 20 条操作失败（`failures.slice(0, 20)`）。

### FaultDiag（route `faultdiag`，`handlers/logs.js: handleFaultdiag`）

**不是推理结果，是原始证据文件的透传读取器**：遍历 `AppDump/fault_diagnosis/` 下所有文件（排除 `sync_property_trace.log`），按扩展名分三类读取：
- `.tar.gz` → 流式读取 tar 成员，单成员内容截断至 50000 字符，总体积上限 256 KiB
- `.db` → 尝试用 `better-sqlite3` 打开，逐表 `SELECT * LIMIT 200`，读不到时静默降级为提示字符串
- 其余（含 `.json`）→ 直接按 UTF-8 读取全文

返回 `{Files: [{Name, Type, Content, Size}], Total}`，即**未加工的诊断证据原文**——真正的"诊断"发生在下游（见 business-logic.md 的智能体分析链路）。

### Issue（智能体诊断·结构化问题，MCP 工具 `log_reviewer_analysis_upsert_issue` 的入参 schema，`mcp/register.js`）

**这是本产品第二条、也是更核心的诊断链路**——由外部 AI Agent（经 MCP）产出，Host 只做接收与展示，不做推理：

| 字段 | 类型 | 约束 |
|------|------|------|
| `issueId` | string | 同一 issue 多次修正共享此 ID |
| `revision` | integer | **同一 issueId 的 revision 必须单调递增**（业务规则，非纯展示） |
| `severity` | enum | `critical / high / medium / low` |
| `urgency` | number | `0–100` |
| `confidence` | number | `0–1` |
| `evidence[]` | `{source, location?, excerpt}[]`，`minItems: 1` | **`excerpt` 必须是原始日志片段，禁止 Agent 总结改写**（schema description 原文强制要求） |
| `ragAssessment` | object，`minItems: 1` references | `sourceScope` 必须为 `'fault_cases'`（**限定只能用故障案例知识库，不允许通用检索**）；`query`（实际发给 RAG 的查询）+ `assessment`（RAG 依据如何支撑 severity/urgency 的说明）+ `references[]`（命中的原始片段） |

> **枚举映射（面向设计的翻译）**：
> `severity: critical/high/medium/low` → UI 应译为「严重 / 高 / 中 / 低」，不能直接展示英文枚举值。
> `urgency`（0–100）与 `confidence`（0–1）是两个独立维度（紧迫度 × 可信度），不能合并成一个分数——一条"高置信度但不紧急"和"低置信度但很紧急"的问题，处置优先级完全不同，UI 必须分别可见。

### 分析会话配置（`bmcstudio.logReviewer.analysisTopN`，`package.json` contributes.configuration）

```
类型：integer，默认 10，范围 1–50
生效范围：新分析会话；MCP complete 的 topN 参数不允许覆盖用户设置（register.js 注释原文："Host 不允许它覆盖会话创建时的用户设置"）
```
→ 这是一条**服务端强制的用户主权规则**：AI Agent 可以在 `log_reviewer_analysis_complete` 里回传它认为的 topN，但 Host 不采纳，始终以用户在设置里配的值为准。

### 机型 Profile（`backend/machines/registry.js`）

```
resolveProfile(ctx) = PROFILES.find(p => p.matches(ctx)) ?? GENERIC_PROFILE
PROFILES = [BC83_PROFILE]   // 当前只注册了一个具体机型
```
`BC83_PROFILE` 内含 `component-uids.json`（组件 UID 映射表）。架构上是"策略模式，可插拔多机型"，**但当前实现只有 1 个具体机型 + 1 个通用兜底**，"多机型支持"是架构承诺而非当前已验证能力——写入 G 注意事项 / 待确认清单。

### 路由清单（`shared/routes.js`，42 个只读 route，按域分组）

| 域 | route |
|----|-------|
| 概览/健康 | `overview` `overviewsummary` `genericinfo` `productinfo` |
| 硬件清单 | `fru` `cpuinfo` `meminfo` `storageinfo` `psuinfo` `faninfo` `netadapter` |
| 版本 | `apprevision` `packageinfo` |
| 告警/传感器 | `events` `sensorinfo` |
| 日志 | `applog` `frameworklog` `maintenancelog` `seriallog` `journalctl` |
| 诊断 | `faultdiag` `detection-report` |
| 操作 | `operationlog` `cmdhistory` |
| 性能 | `perfinfo` `topinfo` `memusage` |
| 调速 | `cooling` `pidconfig` `cooling_policies`（别名 `cooling-policies`） |
| 功率/温度 | `powerstats` `inlettemp` |
| CSR/丝印/线缆/架构 | `csrinfo` `silkinfo` `cable` `arch_diagram` |
| 驱动/Trace/启动 | `driverinfo` `synctrace` `startuptimeline` |
| 树/读文件 | `tree` `read` |

---

## ② 魔法值标注

| 字段 | 魔法值 | 含义 | UI 处理要求 |
|------|--------|------|-----------|
| `GenericInfo.PowerState` | 硬编码 `'On'` | 非真实读数，代码占位 | **不应作为可信状态展示**，或需标注数据来源受限 |
| `GenericInfo.IndicatorLEDState` | 硬编码 `'Off'` | 同上 | 同上 |
| `GenericInfo.FanSupported/KVMSupported` | 硬编码 `true` | 未按机型区分 | 不应作为"该机型是否支持风扇"的判断依据 |
| `DetectionItem.severity` | 规则版永远是 `'Warning'` | 规则引擎无法产出 Critical/Major | UI 若按 severity 做红黄绿分级，规则版数据只会落在黄色一档——需向用户说明"当前仅覆盖操作失败类问题" |
| `assertedN` / `perfN` | 恒为 `0` | 告警扫描、性能异常扫描代码路径被禁用 | **不能让用户误以为"0 条告警异常"是真实巡检结果**——UI 必须显式声明这两类扫描当前未启用，否则是一个会误导现场工程师的严重缺陷 |
| `ragAssessment.sourceScope` | 只允许字面量 `'fault_cases'` | Schema 级强制，非运行时校验 | 提示"仅基于故障案例知识库检索"字样，管理用户预期（不是全网检索） |

---

## ③ 实体关系图

```
Dump 目录（.tar.gz/.tgz/.tar/.zip 或已解压目录）
└── AppDump/                        ← 结构化数据根
    ├── event/sel.txt                → Health/HealthSummary/CurrentTime 的来源
    ├── product_mgmt, bmc_network     → GenericInfo 各字段
    ├── frudata/fruinfo.txt           → ProductInfo.Product
    ├── firmware_mgmt/*.txt           → ProductInfo.Firmware[] + BMC/BIOS 版本
    └── fault_diagnosis/              → FaultDiag.Files[]（原始证据，非结论）
└── LogDump/                        ← 原始滚动日志根
    ├── app.log*(.gz)                → DetectionItem 的错误证据来源
    └── operation.log*(.gz)          → DetectionItem 的失败事件来源

DetectionItem（规则版，本地生成）─┐
                                    ├─→ 一起喂给 MCP 客户端（外部 AI Agent）
FaultDiag.Files[]（原始证据）  ────┘        │
                                             ▼
                          Agent 结合 openubmc_kb_query（RAG，限 fault_cases）
                                             │
                                             ▼
                          Issue[]（upsert_issue 流式回传，revision 递增）
                                             │
                                             ▼
                          analysis_complete（TopN 快照，解锁 PDF 导出）
```

「本地标识」vs「全局唯一 ID」：`issueId` 由 Agent 生成、Host 侧只做幂等校验，**不是 Host 分配的全局 ID**——同一 `eventId`（每次回调的唯一标识）幂等，但 `issueId` 本身的唯一性完全依赖 Agent 自律，Host 未见对 issueId 冲突做防护（写入待确认清单）。

## ④ 动态字段标注

```
mdbGetFirst(base, module, objectPath, prop)
→ 三段式动态查询语法：模块名·对象路径·属性名，运行时拼路径读文本快照
→ 不是固定 schema 的强类型对象，UI/文档层不能假设某个属性一定存在
→ 几乎所有 handler 的取值都对空结果做了 `|| '默认值'` 兜底（如 `|| ''`、`|| 'Normal'`），
  这些兜底值与"MDB 里真实读到该值"在语义上不可区分——是本产品最大的一类隐性魔法值来源
```
