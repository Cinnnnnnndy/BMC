# 硬件适配 · 板卡告警配置 + 板卡详情 · UI 设计优化简报（PTO 设计系统 · 优化模式）

> 本文档是阶段一（phase1-requirement-analysis）优化模式产出的 **Demo 提示词**：
> 给 AI 的可执行设计简报，内含量化诊断（分析报告），**不是需求复述**。按用户要求**跳过可视化报告**。
>
> **对象**：`web-app-vue`（Vue 3 + VueFlow 子工程）中「硬件适配」相关的两个板卡配置面型：
> 1. **板卡告警配置** — `src/views/AlarmConfigView.vue`（底部 dock、横向流水线：监控对象 → 扇出传感器 → 事件）
> 2. **板卡详情** — `src/TopologyView.vue` 内 `.topo-property-panel`（右侧属性面板，含「联动工具」唤醒区），
>    骨架样式在 `src/styles/topology.css`（`.topo-property-panel` / `.pp-*`）。
>
> **交付形态硬约束（与 csr-topo 不同）**：这两处是**本仓库自有源码**（Vue SFC `<style scoped>` + `topology.css`），
> 不是压缩三方 bundle。因此优化**直接改源码**，做法是**消费 `pto-semantic.css` 已定义的规范 token**、
> **删除组件里私写的蓝调 fallback 值与裸 hex**，**禁止**再引入覆盖层 / `!important` 对抗 / JS 注入 DOM。
> 画布本体（VueFlow 节点/连线/`--canvas-*` 系）属 data-viz 豁免区，**本次不动**。

## 设计角色与领域上下文

你是一位专注于工程工具（Developer Tools / IDE 类）的 UI 设计师。

- 产品：openUBMC Studio 硬件拓扑视图 —— BMC 硬件适配的可视化建模工具。工程师在拓扑画布点选板卡后，
  右侧弹出**板卡详情**（读数/来源/解析状态 + 唤醒联动工具），从详情里唤起**板卡告警配置**，
  为该板卡的器件逐条配「监控对象 → 传感器（量+门限）→ 事件（告警）」，最终生成写入 `.sr` 的 CSR 对象。
- 宿主环境：`web-app-vue` 已内置完整 PTO 设计系统 token 链（`pto-foundation.css` → `pto-semantic.css` → `pto-components.css`，
  由 `main.ts` 全量导入），暗色 IDE 风格，中性灰表面。
- 目标用户：BMC 固件工程师，重度 VS Code / JetBrains 用户，长时间暗色作业；高信息密度、低装饰、状态语义一眼可辨。
- 核心矛盾：这两个面型仍**残留迁移前的旧蓝调视觉语言**（`分析材料/知识空间/视觉规范.md`，2026-04：`#060a0f`/`#0b1118` 蓝黑系）——
  组件内把 `var(--surface-1, #12141c)` 这类**蓝调 fallback** 与 `#fb923c` 这类**裸 hex** 直接写死，
  与已迁移到中性灰（`#161616 / #1c1c1c / #262626`）的 PTO 基线**貌合神离**：token 在则渲染正常，token 一改/复用即回落到旧蓝。

---

## §A 应用设计系统基线（源：`web-app-vue/src/styles/pto-*.css`，**不得发明新 token**）

> 所有改进必须消费下表**已存在的** token。**不得引入表外的新配色、新圆角、新字号。**
> 组件里凡出现 `var(--token, <蓝调 fallback>)`，一律删掉 fallback，只留 `var(--token)`（token 由 `main.ts` 保证全局存在）。

### 色彩系统（暗色，`:root` 即暗色；值取自 `pto-foundation.css` / `pto-semantic.css`）

| 用途 | Token | 值 |
|------|-------|-----|
| 页面/画布背景 | `--background`（`--ark-neutral-1`） | `#101010` |
| 面板/弹窗背景 | `--background-elevated`（`--ark-neutral-2`） | `#141414` |
| 卡片/输入框背景 | `--surface-1` | `#161616` |
| 次级表面 | `--surface-2` | `#1c1c1c` |
| hover / 三级表面 | `--surface-3` | `#262626` |
| 四级表面 | `--surface-4` | `#313131` |
| 主强调色 | `--primary`（`--ark-blue-500`） | `#4369ef` |
| 主强调色 hover | `--primary-hover`（`--ark-blue-600`） | `#5a92e6` |
| 辅助域色（联动/次要强调） | `--accent`（`--ark-domain-aux`） | `#7c8db8` |
| 成功 | `--success`（`--ark-green-500`） | `#04d793` |
| 警告 | `--warning`（`--ark-orange-500`） | `#ffaa3b` |
| 危险 | `--danger`（`--ark-red-500`） | `#ff4b7b` |
| 主文字 | `--foreground` | `rgba(255,255,255,.90)` |
| 次级文字 | `--foreground-secondary` | `rgba(255,255,255,.60)` |
| 弱提示文字 | `--foreground-muted` | `rgba(255,255,255,.40)` |
| 禁用文字 | `--foreground-disabled` | `rgba(255,255,255,.25)` |
| 边框-弱 / 默认 / 强 | `--border-subtle` / `--border-default` / `--border-strong` | `.06` / `.10` / `.16` 白 |
| 焦点环 | `--focus-ring` | `rgba(67,105,239,.42)` |
| hover 叠加 | `--state-hover` | `rgba(255,255,255,.06)` |
| **选中叠加** | `--state-selected` | **`rgba(255,255,255,.08)`（中性，非蓝！）** |
| 语气底（危险/警告/信息） | `--tone-critical-bg` / `--tone-warning-bg` / `--tone-info-bg` | `color-mix(danger/warning/primary, 14~16%)` |

### 组件规格（源：`pto-components.css`，已有变量，直接引用）

- **按钮三级体系**（当前两视图**完全缺失**，是本次重点）
  - `.btn-solid`（primary，提交/导出类：**复制全部**）：底 `--button-solid-bg`（=`--foreground` 白）、字 `--button-solid-fg`（=`--background` 深）；hover `--button-solid-bg-hover`。**每视图至多一个。**
  - `.btn`（secondary，入口/次级：查看 CSR、收起全部、添加轨、迟滞旁按钮）：底 `--button-secondary-bg`、边 `--button-secondary-border`（`--border-subtle`）、字 `--foreground`；hover `--surface-3`。
  - `.btn-ghost`（行内图标钮：删除链路/删除事件/关闭）：透明，hover `--state-hover`，字 `--foreground-secondary`→hover `--foreground`。
  - 高度 `--button-height-sm: 30px`，圆角 `--button-radius`（=`--radius-lg` 12px），字 `--button-font`（`500 12px`）。
  - **禁用 = `opacity: var(--button-disabled-opacity)` = 0.42，不换色。**
- **输入框 / select**：高 `--input-height-md` 34px（紧凑内联件可 28px），圆角 `--input-radius`（`--radius-md` 8px），底 `--surface-1`，边 `--input-border`（`--border-default`），focus 边 `--primary` + `0 0 0 2px var(--focus-ring)`。
- **面板壳（两视图应统一到此）**：`--panel-shell-radius: 14px`、`--panel-shell-bg: --background-elevated`、`--panel-shell-border: --border-subtle`、`--panel-shell-shadow: --shadow-lg`、头 `--panel-shell-header-padding: 12px 14px`、体 `--panel-shell-body-padding`。
- **卡片选中态**：`--card-selected-border: --primary` + `--card-selected-bg: --state-selected`（中性叠加 + 主色边/字，**不是蓝色大面积填充**）。
- **圆角词汇表（唯一合法档位）**：`--radius-sm 6 / --radius-md 8 / --radius-lg 12 / --radius-xl 16 / --radius-pill 999`。**禁用 4px / 5px / 10px 等表外值。**
- **字号阶梯**：`--font-size-label-xs 11` 是最小合法字号；`body-sm 12` / `body-md 14`。**禁用 9px / 10px 文本。**
- **色彩原则（`pto-components.css` 头注，强制）**：大面积透明色填充（如 `rgba(blue,.15)` 卡底、`color-mix(primary 22%)` chip 底）**不允许**；透明色只用于 tag / badge / 图标底等**紧凑强调区**。

---

## §B 当前 UI 问题诊断（逐条量化，标注运行期可见性）

> 说明：`main.ts` 全量加载 token，故 `var(--surface-1, #12141c)` 运行时解析为**真实中性灰** `#161616`——
> 蓝调 fallback 是**「死值」但埋雷**（token 改名 / 组件被单独复用即回落旧蓝，违背「消费 token」纪律）。
> 而**裸 hex**（非 `var()` 包裹）与 `color-mix(primary N%)` 是**运行期真实可见**问题。优先级：🔴 阻断 / 🟡 应修 / 🟢 卫生。

### 视图一：板卡告警配置（`AlarmConfigView.vue`）

| 维度 | 位置（行） | 当前状态（实测） | 运行期 | 优先级 |
|------|-----------|-----------------|--------|--------|
| 语义色错版 | `.dot.Major`（527） | `background: #fb923c` **裸橙**，卡在 warning(`#ffaa3b`) 与 danger(`#ff4b7b`) 之间，凭空造出第四档色；同组 `.dot.Minor`→warning、`.dot.Critical`→danger 走 token，唯 Major 私造 | ✅可见 | 🔴 |
| 三级严重度无梯 | 严重度 dot / `SEVERITIES`（64–68、526–528） | Minor/Major/Critical 三档色不成体系（token + 裸 hex 混搭），无法一眼判读升序 | ✅可见 | 🔴 |
| 蓝色大面积填充 | `.dev-chip.active`（473）/`.add-chip.all`（481） | 选中/主 chip 用 `color-mix(in srgb, var(--primary) 22%/20%, surface)`——**22% 主色水洗**违反 PTO 色彩原则（透明色仅限紧凑强调区）；选中应为中性 `--state-selected` + 主色边/字 | ✅可见 | 🟡 |
| 焦点不可见 | 全部按钮/输入（`all: unset`，无 `:focus-visible`） | 所有 `.dev-chip/.add-chip/.sensor-card/.btn-ghost/.ev-*` 用 `all: unset` 抹掉了原生轮廓，且无 `--focus-ring` 补偿——键盘导航完全不可见 | ✅可见 | 🟡 |
| 原生控件未纳管 | `.disc-sel/.thr-in/.num`（485–486、549–550、558） | `<select>/<input>` 有 `surface-3` 填充但**无边、无 focus 环**，下拉箭头走浏览器默认（浅色），与暗色断层 | ✅可见 | 🟡 |
| 按钮无层级 | 汇总条（446–448） | 「收起全部 / 查看 CSR / 复制全部」三枚**完全相同**的 `.btn-ghost` 灰胶囊；**复制全部**（导出主动作）无任何视觉优先级 | ✅可见 | 🟡 |
| 圆角越界 | `.thr-in`(5px, 549) / `.sensor-card`(10px, 511) / `.ev-edit`(10px, 566) | 出现 5px、10px——不在 `6/8/12/16` 词汇表内 | ✅可见 | 🟢 |
| 字号过小 | `.sc-kind`(9px,518) / `.on-sub`(10px,501) / `.ef`(10px,569) / `.rl-node i`(9px,467) 等 | 大量 9px / 10px 文本，低于 PTO 最小合法字号 11px，暗底可读性风险 | ✅可见 | 🟢 |
| 蓝调死值 fallback | 全文（460–583，约 30 处） | `var(--surface-1, #12141c)`/`#16181f`/`#1c1f2a`——fallback 均为**旧蓝黑**，与 PTO 中性灰 `#161616/#1c1c1c/#262626` 不符；语义色 fallback `#34d399/#f59e0b/#f87171` 亦非 PTO 值（应 `#04d793/#ffaa3b/#ff4b7b`） | ⚠️埋雷 | 🟢 |

### 视图二：板卡详情属性面板（`TopologyView.vue` + `topology.css`）

| 维度 | 位置 | 当前状态（实测） | 运行期 | 优先级 |
|------|------|-----------------|--------|--------|
| 唤醒区用 emoji 图标 | `.wake-btn`（446/450/454） | 联动工具三钮用 **emoji**：🧮 SMC / ⚙ 表达式 / ◈ 告警——违反 PTO 面型 SVG 图标纪律；且告警钮图标底走 `--warning` 琥珀（783），与其 dock 身份 ◈ 不一致；三钮各用 primary/accent/warning 三种色，无统一识别逻辑 | ✅可见 | 🟡 |
| 字段填充近乎隐形 | `.pp-field-value`（`topology.css` 202–209） | 底色 `--surface-subtle`（=`--border-subtle` = `rgba(255,255,255,.06)`）——在面板底 `--surface-2 #1c1c1c` 上几乎看不出分层；字段值读数应落 `--surface-1` 实底 | ✅可见 | 🟡 |
| 面板壳未统一 | `.topo-property-panel`（`topology.css` 164–174） | 240px 定宽 + `border-left` + `box-shadow: -4px 0 20px rgba(0,0,0,.4)` 重投影；未消费 `--panel-shell-*`（`--shadow-lg` 更克制），与告警视图（底部 dock、纯填充、无壳）**两套壳语言** | ✅可见 | 🟡 |
| 圆角越界 | `.pp-field-value`(4px) / `.pp-close`(无) / `.pp-delete`(6px) | 4px 不在词汇表；`.pp-delete`（214–223）用 `rgba(220,60,60,.4/.12)` + `#f87171` **裸红**，非 `--danger`（若此面板未用到该钮，仍属同文件卫生债） | ✅可见 | 🟢 |
| 死值 fallback / 裸色 | `.pp-*`、legend、`dock-hint` | `--text-secondary/#98a0b8`、`--board-tag-bg/#1b1b21` 等旧蓝调 fallback；`App.vue` `.dock-hint` 裸绿 `#34d399`（164）应走 `--success` | ⚠️埋雷 | 🟢 |

### 跨视图（两个「板卡配置」面型之间）

| 维度 | 现状 | 优先级 |
|------|------|--------|
| 壳语言分裂 | 详情=右侧浮层（重投影+左描边）；告警=底部 dock（纯填充无壳）。两个同源「板卡配置」面型无共享面板壳，`--panel-shell-*` 未被任一方消费 | 🟡 |
| 图标语言分裂 | `App.vue` `toolMeta` 用 emoji（🧮⚙❄◈）、详情唤醒钮用 emoji、关闭钮 `✕`——与 PTO 面型 SVG 纪律相悖；告警视图自身已用单色 SVG（`.on-ic`/`.sc-ic`），标准不一 | 🟡 |
| 选中语言分裂 | 详情/树用 `--state-selected`（中性）；告警 chip 用 `color-mix(primary 22%)`（蓝洗）——同一「选中」概念两种表达 | 🟡 |

---

## §C 问题 → 目标状态映射（逐条可验收）

**C1 · 语义色归 token（🔴）**
- 目标：删除 `.dot.Major` 的裸 `#fb923c`；三档严重度映射为**升序、成体系**的 PTO 语义色：
  `Minor → --warning(#ffaa3b)`、`Major → color-mix(in srgb, var(--warning) 55%, var(--danger))`（warning↔danger 之间的**受控**过渡，而非私造 hex）、`Critical → --danger(#ff4b7b)`。
- 验收：全文 `grep` 无裸 hex 严重度色；三档 dot 计算色呈黄→橙红→洋红升序，且 Major 由 token `color-mix` 得出。

**C2 · 选中态去蓝洗（🟡）**
- 目标：`.dev-chip.active` / `.add-chip.all` 改「中性叠加 + 主色语义」：底 `--state-selected`、字 `--foreground`、左/描边或圆点用 `--primary` 点睛；主 chip（＋全部添加）可用 `.btn` secondary 规格。移除 `color-mix(primary 20~22%)` 大面积水洗。
- 验收：计算样式中 chip 底不再出现 ≥20% 主色透明填充；选中仅靠中性叠加 + 主色小面积语义。

**C3 · 按钮三级体系落位（🟡）**
- 「复制全部」→ `.btn-solid`（白底深字，全视图唯一实心高对比）；「查看 CSR / 收起全部 / 添加（自定义轨）/ ＋添加事件」→ `.btn` secondary；「删除链路 ✕ / 删除事件 ✕ / 面板关闭 ✕」→ `.btn-ghost`。
- 高度统一 30px（内联小钮可 28px）、圆角统一 12px；禁用 `opacity:.42`。
- 验收：汇总条出现唯一实心按钮；其余为 secondary/ghost，无「三枚同款灰胶囊」。

**C4 · 焦点可见（🟡）**
- 目标：所有交互件（chip/卡/按钮/select/input）补 `:focus-visible { box-shadow: 0 0 0 2px var(--focus-ring); border-radius 对齐本体; }`；`all: unset` 的元素显式补回焦点环。
- 验收：键盘 Tab 走查，每个可聚焦件出现 `--focus-ring` 环。

**C5 · 原生控件纳管（🟡）**
- 目标：`.disc-sel/.thr-in/.num` 统一 `--surface-1` 底 + `--border-default` 边 + 8px 圆角 + focus 环；`<select>` 用 `appearance: none` + 自绘单色 SVG 箭头（`--foreground-muted`），去浏览器默认浅色箭头。
- 验收：暗色下 select/input 边、箭头、focus 一致，无浅色原生残留。

**C6 · 字段填充可辨 + 详情面板壳统一（🟡）**
- 目标：`.pp-field-value` 底改 `--surface-1`（在面板 `--surface-2` 上形成可辨分层）、圆角 `--radius-md 8`；`.topo-property-panel` 消费 `--panel-shell-*`（投影降到 `--shadow-lg`、描边 `--border-subtle`），头体内边距用 `--panel-shell-header/body-padding`。
- 验收：字段值块与面板底对比可辨；详情面板与告警 dock 共享同一套壳 token。

**C7 · 图标面型化（🟡）**
- 目标：详情唤醒三钮、`toolMeta`、关闭钮的 emoji → **单色面型 SVG**；AI/联动类入口统一 ✦ 四角星面型（`M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z`）+ `--accent` 紫灰，其余工具用与其领域一致的单色 SVG；图标底不再一钮一色，收敛到 `--state-hover` / 单一 `--accent` 20% 紧凑底。
- 验收：两视图无 emoji；联动入口统一 ✦；图标一律 `fill: currentColor` 单色。

**C8 · 圆角 / 字号归阶梯（🟢）**
- 目标：全文 4/5/10px 圆角 → 就近归 `6/8/12`；9/10px 文本 → 升到 11px（`--font-size-label-xs`）或改用非文本承载信息。
- 验收：`grep` 无表外圆角；无 <11px 文本。

**C9 · 清死值 + 裸色归 token（🟢）**
- 目标：删除组件里全部蓝调 fallback（`var(--surface-1, #12141c)` → `var(--surface-1)`）；语义色 fallback 同删；`App.vue` `.dock-hint` `#34d399` → `--success`；`.pp-delete` 裸红 → `--danger` + `--tone-critical-bg`。
- 验收：两目标文件（含 `topology.css` 相关段）内 `#[0-9a-f]{6}` 仅剩 data-viz 豁免区（画布/连线/minimap）。

---

## §D 跨视图一致性约束（两面型统一，不得偏离）

- 主强调色唯一 `#4369ef`（hover `#5a92e6`）；联动/次强调用 `--accent #7c8db8`。
- 选中概念唯一表达：**中性 `--state-selected` 叠加 + 主色小面积语义（边/字/圆点）**；禁止 ≥20% 主色透明水洗。
- 按钮只有三级：solid（白底深字，每视图 ≤1）/ secondary / ghost；禁用一律 `opacity .42` 不换色。
- 圆角词汇表：面板壳 14 / 卡片 12 / 输入·select·字段块 8 / 行内小件 6 / 胶囊 999；无 4/5/10。
- 语义色只用 `--success #04d793` / `--warning #ffaa3b` / `--danger #ff4b7b`；严重度中间档由 token `color-mix` 派生，禁止私造 hex。
- 图标一律单色面型 SVG（`fill: currentColor`）；联动/AI 入口统一 ✦ 四角星；全面禁 emoji。
- 两个「板卡配置」面型共享 `--panel-shell-*` 壳语言（详情浮层 + 告警 dock 头部同款圆角/描边/投影梯度）。
- 滚动条沿用 `design-tokens.css` 既有深色全局规则（勿动、勿加局部覆盖）。

## §E 视图实现要求（直接改源码 · 执行清单）

1. **`AlarmConfigView.vue` `<style scoped>`**：① 删全部蓝调 fallback，仅留 `var(--token)`；② `.dot.Major` 改 token `color-mix`（C1）；③ `.dev-chip.active`/`.add-chip.all` 去蓝洗（C2）；④ 汇总条按钮套 `.btn-solid/.btn/.btn-ghost`（C3）；⑤ 全交互件补 `:focus-visible` 焦点环（C4）；⑥ `.disc-sel/.thr-in/.num` 纳管 + 自绘 select 箭头（C5）；⑦ 4/5/10px 圆角与 9/10px 字号归阶梯（C8）。
2. **`styles/topology.css`**：`.topo-property-panel` 消费 `--panel-shell-*`；`.pp-field-value` 底改 `--surface-1`、圆角 8；`.pp-delete` 裸红 → `--danger`/`--tone-critical-bg`（C6/C9）。
3. **`TopologyView.vue`**：`.wake-btn` 三钮 emoji → 单色面型 SVG（联动统一 ✦），图标底收敛（C7）；`.wake-ic-alarm` 去 `--warning` 私色。
4. **`App.vue`**：`toolMeta` emoji → 面型 SVG（或在唤醒处统一）；`.dock-hint` `#34d399` → `--success`（C7/C9）。
5. **自检**：改完 `grep -nE '#[0-9a-fA-F]{6}' src/views/AlarmConfigView.vue src/TopologyView.vue src/styles/topology.css`，除 data-viz 豁免区（`--canvas-*`/连线/minimap）外应清零；`npm run typecheck` 通过。

## §F 状态覆盖要求

| 状态 | 触发 | 视觉表现 |
|------|------|---------|
| 空 | 告警流 0 链路 / 详情未选板卡 | `.empty` 与详情「状态说明」用 `--foreground-muted`，居中留白 ≥24px，无 emoji |
| hover | chip / 卡 / 按钮 / 树行 | secondary→`--surface-3`；ghost / 行→`--state-hover`；solid→`--button-solid-bg-hover` |
| focus | 键盘导航 | `0 0 0 2px var(--focus-ring)`（C4，全件覆盖） |
| selected | 当前器件 chip / 展开的传感器卡 / 详情激活板卡 | `--state-selected` 叠加 + `--primary` 边/字/圆点（C2，中性+主色语义） |
| disabled | 已添加的轨/量 chip（`.used`）/ 无数据的动作 | 本体 × `opacity .42`，`cursor: default` |
| 数据源未接 | `dsResolved=false` | `.sc-ds .dot.warn` = `--warning`；文案「数据源未接」 |
| 严重度 | Minor / Major / Critical | 升序 token 色（C1）：`--warning` → warning↔danger `color-mix` → `--danger` |
| 告警/校验 | `openEntry.warnings` | `.fn-warn` = `--warning`（`#ffaa3b`），非私造琥珀 |

## 明确不做的范围

- 不动画布本体（VueFlow 节点/连线/`--canvas-*`/minimap/legend 配色）——data-viz 豁免区，另行处理。
- 不改信息架构、字段语义、告警对象生成逻辑（`alarmObjectGenerator.ts` / `alarmKnowledge.ts` 纯逻辑不碰）。
- 不改文案（空状态既有文案保留）；不做可访问性深审（对比度全量审计属阶段二）。
- 不新增 token / 不改 `pto-*.css` 基线；不引入覆盖层或 `!important` 对抗。

## 修订记录

**R0（初版，2026-07-22）**：基于 `AlarmConfigView.vue`（586 行）与 `TopologyView.vue` 板卡详情面板 + `topology.css` 实测，
产出 9 条目标映射（C1–C9），核心是「清旧蓝调残留 + 补 PTO 三级按钮/焦点/面型图标 + 统一两面型壳语言」。

## 待确认清单

- [ ] 严重度中间档（Major）取 `warning↔danger 55%` 是否符合告警等级语义，或应引入 `--ark-orange-600` 类专用中间色（需产品/告警域确认 🔴）。
- [ ] `App.vue` `toolMeta` 图标改面型 SVG 后，是否需与 `web-app`（React 侧）rail tab 图标保持同一套字形。
- [ ] 详情面板由「浮层」是否要与告警一样支持 dock（信息架构，产品层决策）。
- [ ] `.pp-delete` 是否仍在板卡详情中使用（若已废弃可直接删段，而非归色）。
