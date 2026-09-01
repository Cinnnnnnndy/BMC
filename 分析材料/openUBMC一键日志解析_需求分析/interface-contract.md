# openUBMC 一键日志解析 · 接口契约

> 先判断后端形态：本产品**没有 HTTP/REST 接口**。它是一个 VS Code / openUBMC Studio 扩展，后端逻辑跑在扩展宿主进程内，通过两条独立通道对外暴露能力：
> 1. **Webview 消息桥**（宿主 ↔ 前端 Vue webview）
> 2. **MCP 工具协议**（宿主 ↔ 外部 AI Agent，如 Claude／Studio 内置 Agent）
> 全部按「宿主桥 / 消息协议」模板整理，不套用 REST 的请求方式/路径/分页模型。

---

## 通道一：Webview ↔ Host 消息桥（`api-bridge.ts` + `backend/registry.js`）

**协议形态**：Vue 前端不发真实 HTTP 请求，而是把 `/api/<route>?<params>` 形式的路径经 `postMessage` 交给扩展宿主，宿主用 `dispatch(route, params, {dumpDir})` 在内存中直接调用对应 handler 函数，结果再 `postMessage` 回前端——**全程零网络、零端口**，这也是 README 强调的"运行时零依赖、无需起服务"的技术实现。

```typescript
// 请求形态（前端 → 宿主）
interface ApiRequest {
  route: string;              // 42 个只读 route 之一，见 data-structure.md「路由清单」
  params?: Record<string, string>;  // 可选：page/pageSize/filter 等，逐 handler 自定义
}

// 响应形态（宿主 → 前端）
type ApiResponse<T> = T | ApiError;
interface ApiError { error: string; }   // in-band 错误：不是异常，是返回值里的 error 字段
```

**字段 → UI 状态映射**（以最常用的 `overview`/`detection-report` 为例）：
```
res.HealthSummary.{Critical,Major,Minor}  → 概览页三个数字徽章
res.Health                                 → 顶部健康态 chip（Normal/Warning/Critical…原始字符串直传，UI 需自建映射表）
isApiError(res) === true                   → 错误提示 + 该模块区域置灰，不阻断其他 tab
res.Items = []（detection-report）         → 空状态："本次扫描未发现操作失败类问题"，
                                              但**必须**同时提示"告警/性能异常扫描当前未启用"（见 data-structure.md 魔法值节），
                                              否则用户会把「未启用」误读成「已扫描且干净」
```

**缓存行为（影响前端预期）**：`dispatch()` 结果按 `route + 排序后的 params JSON` 做 key，LRU 上限 32 条，仅缓存成功结果（`ApiError` 不缓存，允许瞬时失败重试）；同一 dump 目录生命周期内无 TTL 失效（dump 目录不可变假设）。前端可放心假设"同参数重复请求不会看到旧数据过期问题"，但**换 dump 后必须确认拿到的是新 dumpDir 对应的结果**（缓存 key 已含 dumpDir，理论安全，但值得在联调清单里显式确认一次）。

**待联调确认事项**：
1. [ ] `route` 参数拼错（如传入不存在的 route 名）时的返回形态——从代码看会在 `dispatch` 层找不到 handler，需确认前端如何兜底展示
2. [ ] `params` 里数值类型是否需要在前端预先 `String()` 化（后端 handler 普遍按字符串处理再自行 `parseInt`）
3. [ ] 42 个 route 里哪些是"数据量可能很大需要分页"（如 `applog`/`journalctl`），当前 handler 层未见统一分页协议，需逐个确认

---

## 通道二：MCP 工具协议（宿主 ↔ 外部 AI Agent）

**协议形态**：本产品向 MCP 客户端（如 Claude Code / Studio 内置 Agent）暴露 **7 个工具**，其中前 4 个是「查询/只读」，后 3 个组成一个**有状态的回调协议**（Agent 主动推送分析结果，而非被拉取）。

### 只读工具（4 个）

```typescript
// 1) 打开一个 dump（压缩包会先解压），返回概况
log_reviewer_open(path: string): {
  dumpDir: string; availableSections: string[];
  model: string | null; health: string | null; healthSummary: object | null;
}

// 2) 列出「最近打开」历史（与侧边栏同源）
log_reviewer_active(): { dumps: Array<{dumpDir: string; label: string; openedAt: number}> }

// 3) 结构化诊断：并行取 detection-report + faultdiag
log_reviewer_diagnose(dumpDir?, analysisRef?, callbackUri?): {
  detection: DetectionReportResult;   // 规则版结果，见 data-structure.md
  faultdiag: FaultDiagResult;          // 原始证据文件
}
// 任一子请求失败即整体抛错（core.js: unwrap 逻辑），不做部分成功

// 4) 取一个业务域的数据（跨文件关联/解析类，grep 能读的原始日志不走这里）
log_reviewer_get_section(dumpDir, section: SectionKey, params?): object
// SECTION_ROUTE_MAP 把 11 个语义化 section 映射到底层 route（inventory 是 8 个 route 的并行合并）
```

`SECTION_ROUTE_MAP`（core.js，语义 section → 底层 route，供 Agent 调用时不必记住 42 个原始 route 名）：
```
overview → overview
inventory → [cpuinfo, meminfo, storageinfo, psuinfo, faninfo, netadapter, apprevision, packageinfo]（并行取，任一失败即整体报错）
sensors → sensorinfo
events → events
performance → perfinfo
cooling / cooling.pid / cooling.policies → cooling / pidconfig / cooling_policies
power → powerstats
fru → fru
csr → csrinfo
silk → silkinfo
cable → cable
arch_diagram → arch_diagram
synctrace → synctrace
```

### 有状态回调协议（3 个工具，组成一次"分析会话"）

这是本产品**真正的智能诊断能力**所在——规则版 `detection-report` 只是喂给 Agent 的原始信号之一，最终结论由 Agent 在会话里流式产出：

```
时序：
1. Host 侧发起分析会话，生成 analysisRef（任务标识）+ callbackUri（本机回调地址），
   连同"必须检索 fault_cases 知识库、evidence 必须原文引用"等约束写入 Prompt 交给 Agent
2. Agent 循环调用 log_reviewer_get_section / log_reviewer_diagnose 收集证据
3. Agent 每确认一条问题，调用一次：
   log_reviewer_analysis_upsert_issue(analysisRef, callbackUri, eventId, issue: Issue)
   → issue.ragAssessment 必须先做 openubmc_kb_query（sourceScope 固定 fault_cases）
   → 同一 issueId 再次调用時 revision 必须比上次大（否则视为业务规则违反，具体拒绝行为需在 host 层联调确认）
4. Agent 认为分析完成：
   log_reviewer_analysis_complete(analysisRef, callbackUri, eventId, summary?, topN?)
   → topN 只做"协议确认"用途，Host 不采纳，始终用用户在设置里配置的 analysisTopN（1–50，默认 10）
   → 调用后解锁 PDF 导出
5. 若中途判断无法继续：
   log_reviewer_analysis_fail(analysisRef, callbackUri, eventId, error: string)
   → 失败原因实时显示到页面，会话终止
```

**前后端（Host ↔ Agent）责任划分**：

| 能力 | Agent 负责 | Host 负责 | 联调验证点 |
|------|-----------|-----------|-----------|
| 证据检索 | 调用 get_section/diagnose 主动收集 | 提供原始数据，不做推理 | Agent 是否真的引用了原始 excerpt，而非改写总结（schema 强制但无法运行时语义校验） |
| RAG 校准 | 必须调用 `openubmc_kb_query`（sourceScope=fault_cases） | 无（RAG 检索本身在 Agent 侧） | Host 是否真的校验了 `ragAssessment.references` 非空、`sourceScope` 字面量匹配 |
| TopN 收敛 | 可回传建议值（仅协议确认） | **强制**以用户设置为准，Agent 不可覆盖 | 需确认 Host 侧是否真的丢弃了 Agent 回传的 topN，而非"信任但不总用" |
| 结果稳定性 | `revision` 单调递增维护同一 issueId 的修正历史 | 落盘/展示最新 revision | 并发或乱序回调（网络重试导致的重复 eventId）如何处理，代码未见明确并发锁证据，待确认 |
| PDF 导出 | 无 | `analysis_complete` 后解锁（`pdf-report-exporter.js`） | 导出内容是否等于"最终 TopN 快照"，还是包含被后续 revision 覆盖的旧问题 |

**待联调确认事项（通道二）**：
1. [ ] `callbackUri` 的实际协议（HTTP 本机回环端口？命名管道？`analysis-callback-server.js` 暗示是本机 HTTP server，端口分配/冲突策略待确认）
2. [ ] `revision` 违反单调递增时 Host 的具体拒绝行为（丢弃/报错/覆盖）
3. [ ] `analysisTopN` 配置在会话进行中被用户修改时是否生效（当前只保证"新会话生效"）
4. [ ] `log_reviewer_diagnose` 与 `log_reviewer_get_section` 均接受 `analysisRef`/`callbackUri` 作为可选参数，但只读工具 1/2 没有——这两个参数在只读工具里出现的意义待确认（是否用于分析会话内的进度上报）
