# openUBMC 一键日志解析 · 业务逻辑梳理

## 逻辑分类总览

| UI 区域 | 业务规则 | 规则来源 | 类型 |
|---------|---------|---------|------|
| 健康态徽章 | `Health`/`HealthSummary` 直接透传 MDB 原始值，无前端二次判定 | `event/Events` MDB 快照 | 后端业务逻辑（MDB 快照即"后端"） |
| 诊断 tab · 规则版列表 | 只统计 `operation.log` 关键词命中行，告警/性能扫描代码路径关闭 | `detection.js` 硬编码的 `assertedN=0`/`perfN=0` | 后端业务逻辑（且是**被刻意关闭**的功能） |
| 诊断 tab · 智能体列表 | 每条问题需 `evidence`（原文引用）+ `ragAssessment`（限定 fault_cases 知识库）才允许提交 | MCP `log_reviewer_analysis_upsert_issue` schema 校验 | 前后端协同的**防幻觉护栏**（schema 是 Host 定义的强约束，推理本身在 Agent） |
| TopN 设置 | 用户在设置里配的 `analysisTopN` 优先于 Agent 在 `analysis_complete` 里回传的 topN | `package.json` configuration + `register.js` 注释 | 后端业务逻辑（用户主权高于 Agent 建议） |
| 机型识别 | `resolveProfile` 按注册顺序匹配，无匹配落到 `GENERIC_PROFILE` | `machines/registry.js` | 后端业务逻辑（策略模式，当前只 1 个具体机型） |
| PDF 导出按钮 | 仅在 `analysis_complete` 回调后解锁 | `pdf-report-exporter.js` + 会话状态机 | 前端条件渲染，依据后端会话状态 |
| Dump 打开入口 | 压缩包自动解压定位 `AppDump`，普通目录直接按 `AppDump` 存在与否判定 | `extension.js: pickDumpDir` / `archive.ts` | 前端交互 + 后端目录探测 |

---

## 操作顺序约束

**规则版诊断（本地，无需网络/Agent）**：
```
1. loadApplog(base)           // 加载并按秒级时间桶建索引（必须先建索引，查询才是 O(bucket) 而非线性扫描全量日志）
2. scanFailures(base, range)  // 扫描 operation.log 关键词命中
3. 对每条失败 → inferFailureCause()
     L1: 精确模块名 ±5min 查 app.log
     L2: 命中则返回；否则查 MODULE_ALIASES 别名模块 ±5min
     L3: 命中则返回；否则去掉模块过滤，全局 ±5min 兜底
     均未命中 → 通用兜底文案："未在前后5分钟内找到关联错误日志"
4. 结果限流：最多 20 条失败 × 每条最多 8 条去重错误行
```
**依赖约束**：第 1 步必须先于第 2/3 步完成（索引未建则查询直接返回空数组，`_applogIndex` 为 `null` 时的防御性 guard）。第 2/3 步之间无顺序依赖（可任意顺序处理不同失败条目），但每条失败内部的 L1→L2→L3 是严格顺序（级联降级，前一级命中则短路，不做全部三级都跑一遍再择优）。

**智能体诊断会话（跨进程，MCP 驱动）**：
```
1. Host 发起会话 → 生成 analysisRef + callbackUri，写入 Prompt 交给 Agent
2. Agent 自由顺序调用 get_section/diagnose 收集证据（无强制顺序，Agent 自主规划）
3. 每条问题 upsert_issue（可对同一 issueId 反复调用，但 revision 必须递增——
   这是唯一贯穿整个会话生命周期的强顺序约束）
4. Agent 主动调用 complete 或 fail 结束会话（二选一，互斥终态）
5. complete 之后：TopN 快照固化 + PDF 导出解锁（这两个动作是 complete 的**副作用**，
   不是用户可单独触发的操作）
```
**必须按序**：`open`（或已有 dumpDir）→ 任意查询工具 → `complete`/`fail`。**可任意顺序**：查询阶段内部调用 `get_section` 的次数与顺序、覆盖哪些 section。**依赖约束**：`upsert_issue` 对同一 `issueId` 的多次调用之间有 `revision` 单调递增的硬约束；不同 `issueId` 之间互不影响。

---

## 三类逻辑区分标注

### 纯展示逻辑（前端完整实现，无需协同）
- 健康态 chip 颜色映射（Normal/Warning/Critical → 绿/黄/红，需前端自建，源码未提供枚举→颜色的映射表）
- Tab 切换、表格排序、面板布局
- `severity`/`urgency`/`confidence` 三个数值的可视化呈现方式（进度条/徽章/文字）——数值本身来自 Agent，展示形式前端自主

### 前端业务逻辑（前端实现，需与产品/设计确认规则细节）
- **告警/性能扫描"已禁用"的显式提示**——这不是可选的视觉打磨，是**必须做的业务判断**：`assertedN`/`perfN` 恒为 0 不代表"扫描过且干净"，前端必须能区分"规则未启用"与"规则跑过但零结果"这两种状态，而当前后端 API 在这两种情况下返回的数据结构完全相同（都是 `0`），**前端无法仅凭返回值做出正确判断，需要产品侧确认是否需要后端补一个 `scanEnabled` 标志位**（这是本分析发现的一处需要跨端协同修复的缺口，见 G 注意事项）
- PDF 导出按钮的解锁时机（`analysis_complete` 之后）与是否要在解锁前置灰提示"分析进行中"
- TopN 展示：用户设置值 vs Agent 建议值不一致时，是否需要在 UI 上说明"已按你的设置显示，Agent 建议为 X"

### 后端业务逻辑（后端/Agent 提供，前端消费；Demo 阶段应 Mock）
- 规则版三级降级查找（L1/L2/L3）——纯后端计算，前端只消费最终 `cause`/`errors`/`suggestion`
- RAG 校准（`openubmc_kb_query`，限定 `fault_cases`）——完全在 Agent 侧，前端/Host 都不参与推理，只做 schema 校验
- `revision` 单调递增校验、`eventId` 幂等——Host 侧状态机逻辑，前端不可绕过直接改状态

---

## 校验规则

| 校验点 | 规则 | 校验方 | 违反后果 |
|--------|------|--------|---------|
| `issue.ragAssessment.sourceScope` | 必须字面量等于 `'fault_cases'` | MCP tool schema（JSON Schema enum） | 参数不满足 enum，调用被 MCP 层拒绝（协议级，非业务级二次校验） |
| `issue.evidence` | 数组非空（`minItems: 1`） | 同上 | 同上——但 **"excerpt 必须是原始片段而非 Agent 总结"这条约束只在 description 文字里，没有可运行的 schema 校验**（无法从 JSON Schema 层面判断一段文本是否"原创摘要"还是"原文引用"），这是协议设计上的软约束，实际执行依赖 Agent 自律，值得在 G 注意事项里标出 |
| `issue.revision` | 同一 `issueId` 需递增 | 描述为"必须"，但**未在 JSON Schema 里看到运行时强制该约束的代码**（本分析仅读到工具定义，未读到 `analysis-session-service.js` 内部实现细节） | 【推断·待确认】需读 `host/analysis-session-service.js` 源码确认是否真正拒绝非递增请求 |
| `topN` | Agent 回传值不覆盖用户设置 | Host（`register.js` 注释 + `package.json` 描述） | 静默忽略 Agent 回传值，无报错反馈——**Agent 如果依赖自己回传的 topN 会产生预期外行为**，属于 API 设计上"静默偏离调用方期望"的一处风险点 |

---

## 未实现 / 已移除 / 实验性标注

| 能力 | 状态 | 证据 |
|------|------|------|
| 告警断言扫描（SEL → 诊断问题） | **代码路径存在但被禁用**（非"未实现"，是"实现后关闭"） | `detection.js` 注释："accuracy insufficient" |
| 性能异常扫描 | 同上，同样被禁用 | 同上 |
| `ALARM_RULES` 规则表 | 有 `_fallbacks` 兜底加载路径，但当前活跃诊断路径不消费它 | `detection.js` 注释："unused by the active path" |
| `detection_rules`/`_fallbacks` 外部规则文件 | **不随 vsix 分发**，try/catch 静默降级为空表 | `detection.js`：两层 require 均失败则 `OPERATION_FAILURE_PATTERNS = {}` |
| 多机型 Profile | 架构支持（`registerProfile` 可扩展），当前只注册 1 个（`BC83_PROFILE`） | `machines/registry.js` |

> 这五条合起来是本产品当前版本（0.0.23）最重要的"能力边界"事实：**规则版诊断远比它听起来窄**（只覆盖操作失败一类），**真正的智能诊断完全依赖外部 Agent + RAG 是否可用**——若运行环境没有配置 MCP Agent 或知识库不可达，用户能看到的诊断能力就只剩"操作失败 ±5 分钟关联查找"这一项。这个事实必须在设计上诚实呈现，而不是让 UI 看起来"AI 全面扫描过了"。
