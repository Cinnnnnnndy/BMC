# CSR 拓扑编辑器（csr-topo-ext）· UI 设计优化简报（PTO 设计系统 · 优化模式）

> 本文档是阶段一（phase1-requirement-analysis）优化模式产出的 Demo 提示词：
> 给 AI 的可执行设计简报，不是需求复述。按用户要求跳过可视化报告。
>
> **对象**：BMC Studio 主应用 rail tab「CSR 拓扑编辑器」所嵌入的 `web-app/public/csr-topo-ext/`
> （Vue + Element Plus 压缩构建产物，源码不在本仓库）。重点视图：**「创建整机项目」弹窗**
> （`.modal-overlay > .modal-content`，`data-v-896f735b`），兼顾整个 bundle 的跨视图一致性。
>
> **交付形态硬约束**：bundle 已压缩、不可改源码重建。所有优化以
> `csr-topo-ext/pto-overrides.css` 覆盖层实现，在 `csr-topo-ext/index.html` 中于
> bundle CSS **之后**引入（同名特异性靠加载顺序取胜，仅对抗源码 `!important` 时才用 `!important`）。
> 禁止改动 `assets/index.js` / `assets/index.css` 本体；禁止用 JS 注入 DOM。

## 设计角色与领域上下文

你是一位专注于工程工具（Developer Tools / IDE 类）的 UI 设计师。

- 产品：openUBMC CSR 拓扑编辑器 —— BMC 硬件拓扑的可视化建模工具，「创建整机项目」弹窗是新项目的第一入口（登记代码仓库 + 整机配置）。
- 宿主环境：BMC Studio（React IDE 壳），已全面采用 PTO 设计系统（`--ark-*` / semantic token），暗色 IDE 风格。
- 目标用户：BMC 固件工程师，重度 VS Code / JetBrains 用户，长时间暗色环境作业；高信息密度、低装饰、状态语义必须一眼可辨。
- 核心矛盾：iframe 内的编辑器仍是 Element Plus 默认暗色 + 三方混搭蓝，与宿主 PTO 视觉断层——用户在同一窗口里看到两套设计语言。

---

## §A 应用设计系统基线（源：`pto-design-system-main/tokens/`，不可发明新 token）

> 所有改进必须消费下表 token 值。**不得引入表外的新配色、新圆角、新字号。**

### 色彩系统（暗色，`:root` 默认即暗色）

| 用途 | Token | 值 |
|------|-------|-----|
| 页面背景 | `--ark-neutral-1` / `--background` | `#101010` |
| 面板/弹窗背景 | `--ark-neutral-2` / `--background-elevated` | `#141414` |
| 卡片/输入框背景 | `--surface-1` | `#161616` |
| 次级表面（secondary 按钮底） | `--surface-2` | `#1c1c1c` |
| hover 表面 | `--surface-3` | `#262626` |
| 主强调色 | `--primary`（= `--ark-blue-500`） | `#4369ef` |
| 主强调色 hover | `--primary-hover`（= `--ark-blue-600`） | `#5a92e6` |
| 主文字 | `--foreground` | `rgba(255,255,255,.90)` |
| 次级文字 | `--foreground-secondary` | `rgba(255,255,255,.60)` |
| 弱提示文字 | `--foreground-muted` | `rgba(255,255,255,.40)` |
| 禁用文字 | `--foreground-disabled` | `rgba(255,255,255,.25)` |
| 边框-弱 | `--border-subtle` | `rgba(255,255,255,.06)` |
| 边框-默认 | `--border-default` | `rgba(255,255,255,.10)` |
| 边框-强 | `--border-strong` | `rgba(255,255,255,.16)` |
| 焦点环 | `--focus-ring` | `rgba(67,105,239,.42)` |
| hover 叠加 | `--state-hover` | `rgba(255,255,255,.06)` |
| 选中叠加 | `--state-selected` | `rgba(67,105,239,.14)` |
| 成功 / 警告 / 危险 | `--success` / `--warning` / `--danger` | `#04d793` / `#ffaa3b` / `#ff4b7b` |

### 组件规格

- **按钮（PTO 三级体系，quick-reference.md）**
  - `.btn`（secondary，入口类动作：打开/导入/新增/浏览）：底 `color-mix(in srgb, var(--surface-2) 92%, white 3%)`，边 `--border-subtle`，字 `--foreground`；hover 底 `--surface-3`。
  - `.btn-solid`（primary，提交类动作：确定/执行/应用）：**白底深字** —— 底 `--foreground`，字 `--background`；hover `color-mix(--foreground 88%, transparent)`。每视图至多一个。
  - `.btn-ghost`（表格行内操作/图标钮）：透明，hover `--state-hover`，字 `--foreground-secondary` → hover `--foreground`。
  - 高度 `--button-height-sm: 30px`，圆角 `--button-radius`（= `--radius-lg` 12px），字 `500 12px var(--font-sans)`。
  - **禁用 = `opacity: 0.42`（`--button-disabled-opacity`），不换色**。
- **输入框**：高 34px，圆角 `--radius-md` 8px，底 `--surface-1`，边 `--border-default`，focus 边 `--primary` + `0 0 0 2px var(--focus-ring)`。
- **表格**：表头/行高 `36px`（`--table-header-height` / `--table-row-height`），分隔线 `--table-border`（= `--border-subtle`）。
- **弹窗面板**：圆角 `--radius-lg` 12px，阴影 `--shadow-lg`（`0 12px 30px rgba(0,0,0,.42)`），边 `--border-default`。
- **字体**：保留 bundle 现有 `HarmonyOS Sans SC` 栈（与 PTO HarmonyOS-aligned 排版一致），数值/路径用 `--font-mono`（`JetBrains Mono / Consolas`）。
- **色彩原则（components.css 头注）**：大面积透明色填充（如 `rgba(blue,.15)` 按钮底）**不允许**，透明色只用于 tag/badge/图标底等紧凑强调区。

### Element Plus 变量桥接（覆盖层唯一允许的"新"变量写法）

`html.dark` 上重映射：`--el-color-primary: #4369ef`；`--el-color-primary-light-3/5/7/8/9` 用
`color-mix(in srgb, #4369ef N%, #141414)` 递减生成；`--el-color-primary-dark-2: #5a92e6`；
`--el-border-color: rgba(255,255,255,.10)`；`--el-fill-color-blank: #161616`。
这样 bundle 内所有 `el-button / el-select / el-input / el-table` 一次性归色。

---

## §B 当前 UI 问题诊断（浏览器实测 @1280×720，逐条量化）

### 视图：创建整机项目弹窗

| 维度 | 位置 | 当前状态（实测） | 优先级 |
|------|------|-----------------|--------|
| 一致性 | 全弹窗 | **四种蓝并存**：入口按钮 `#409eff`（EP 默认）、确定按钮 `#007acc`（VSCode 蓝）、确定禁用 `#005a9e`、画布工具栏激活 `#4a90e2`；宿主 PTO 主色为 `#4369ef`。同屏两套设计语言 | 🔴 |
| 可用性 | 底部「确定」禁用态 | `.action-btn-disabled`：实底 `#005a9e` + 60% 白字 + `opacity:.6`——禁用态反而是全弹窗最重的实心蓝块，看起来最可点；与「一键导入代码仓」的禁用语言（`opacity:.3`）互相矛盾 | 🔴 |
| 视觉层级 | 全部按钮 | 三种高度（26 / 31 / 28px）、两种圆角（4 / 8px）并存；5 个蓝色透明底按钮（`rgba(64,158,255,.15)`）同权重铺开，唯一提交动作「确定」反而没有视觉优先级 | 🔴 |
| 空状态 | 两张表格 | 仓库 0 条、配置 0 条时 `tbody` 完全空白，只剩孤立表头行；无引导文案、无 CTA 指向，首次使用者不知道下一步 | 🟡 |
| 一致性 | 表格规格 | 表头高 33px（PTO token 36px）、表头底 `rgba(255,255,255,.05)` 灰块、容器圆角 6px（PTO md=8）、边框 `.08`（PTO subtle=.06/default=.10 之间的私造值） | 🟡 |
| 色彩原则 | 配置导入/新增仓库/新增配置 | 大面积蓝色透明填充按钮（`#409eff26` 底 + `#409eff4d` 边）违反 PTO 色彩原则（透明色仅限紧凑强调区） | 🟡 |
| 可访问性 | 全弹窗交互件 | 无 `:focus-visible` 焦点环，键盘导航不可见；表头文字 `rgba(255,255,255,.6)` 12px 尚可但底灰块压缩对比 | 🟡 |
| 布局 | `.modal-content` | 固定 `width:1400px; max-width:98vw`，1280 视口下 1254px 边到边（两侧仅 13px），失去模态的空间层次（表格列 min-width 合计 1180px，为宽度下限） | 🟢 |

### 跨视图（同 bundle 其余部分）

| 维度 | 位置 | 当前状态 | 优先级 |
|------|------|---------|--------|
| 一致性 | 硬件拓扑图底部工具栏 | 激活态 `#4a90e2`、主操作 `#007acc`，与宿主 PTO 蓝断层 | 🟡 |
| 一致性 | 所有 el-* 组件 | `--el-color-primary: #409eff` EP 出厂默认，从未对齐宿主 | 🔴 |

---

## §C 问题 → 目标状态映射（逐条可验收）

**C1 · 四蓝归一**
- 目标：bundle 内所有强调色收敛到 `#4369ef`（hover `#5a92e6`）。验收：计算样式中不再出现 `#409eff / #007acc / #005a9e / #4a90e2`。

**C2 · 禁用语义统一**
- 目标：一切禁用 = 本体样式 × `opacity: 0.42`，不换色、不实底强调。「确定」禁用态是"变淡的白底主按钮"，「一键导入代码仓」禁用态是"变淡的 secondary 按钮"。验收：`.action-btn-disabled` 计算背景不再是 `#005a9e`。

**C3 · 按钮三级体系落位**
- 「确定」→ `.btn-solid` 规格：白底（`rgba(255,255,255,.9)`）深字（`#141414`），高 30px，圆角 12px——全弹窗唯一实心高对比按钮。
- 「取消」「配置导入」「新增仓库」「一键导入代码仓」「新增配置」→ `.btn` secondary 规格：`#1f1f1f` 系底 + `--border-subtle` 边 + `.90` 白字，高 30px，圆角 12px。蓝色透明底全部退场。
- 表格行内「操作」列按钮 → `.btn-ghost` 规格：透明底，hover `--state-hover`。
- 验收：弹窗内按钮只有 30px 一种高度、12px 一种圆角；实心高对比按钮唯一。

**C4 · 空状态补齐**
- 目标：仓库表空时容器内出现居中提示「暂无仓库 — 点击右上角「新增仓库」添加」；配置表空时「暂无配置 — 点击「新增配置」创建第一份整机配置」。文字 `--foreground-muted` 13px，上下留白 ≥ 24px，无 emoji、无插图。验收：0 数据打开弹窗不再出现"孤立表头 + 空白"。

**C5 · 表格对齐 PTO token**
- 目标：表头高 36px、底透明、文字 `--foreground-secondary` 12px/500；行高 ≥ 36px、分隔线 `--border-subtle`；hover 行 `--state-hover`；容器圆角 8px、边 `--border-default`。

**C6 · 焦点可见**
- 目标：弹窗内所有 button/input `:focus-visible` 出现 `0 0 0 2px var(--focus-ring)`。

**C7 · 弹窗层次**
- 目标：`.modal-content` 宽 `min(1240px, 94vw)`，底色 `#141414`（`--background-elevated`），边 `--border-default`，阴影 `--shadow-lg`；标题栏保持 48px，标题 16px/600 `.90` 白。

**C8 · 跨视图归色**
- 目标：EP 变量桥接（§A）+ 工具栏激活/主操作按钮改 `#4369ef`；hover 一律 `#5a92e6` 或 `--state-hover`。

---

## §D 跨视图一致性约束（覆盖层全局生效，不得偏离）

- 主强调色唯一：`#4369ef`；hover：`#5a92e6`；选中叠加：`rgba(67,105,239,.14)`。
- 按钮只有三级：solid（白底深字，每视图 ≤1）/ secondary（`surface-2` 底）/ ghost（透明）。不再出现"蓝透明底按钮"这一层级。
- 禁用一律 `opacity .42`，不换色。
- 圆角词汇表：容器/弹窗 12px、输入框/表格容器 8px、按钮 12px、行内小件 6px。
- 边框只用三档：`.06 / .10 / .16` 白透明。
- 无 emoji；图标一律单色 SVG（bundle 现状已满足，覆盖层不得引入）。
- 滚动条：沿用页面既有深色全局规则（iframe 页自带，勿动）。

## §E 视图实现要求（直接执行清单）

1. 新建 `web-app/public/csr-topo-ext/pto-overrides.css`，顶部注释声明"PTO override layer, bundle untouched"。
2. `index.html` 在 bundle CSS `<link>` 之后、内联滚动条 `<style>` 之前插入 `<link rel="stylesheet" href="./pto-overrides.css">`。
3. 结构分区写覆盖：① EP 变量桥接（`html.dark`）② 弹窗容器与标题栏 ③ 按钮三级体系（含 `!important` 对抗 `.action-btn-disabled` 的源码 `!important`）④ 表格 ⑤ 空状态（`.repo-list-container:has(tbody:empty)::after` / 非 repo 的 `.config-list-container:has(tbody:empty)::after`，纯 CSS，不注入 DOM）⑥ 焦点环 ⑦ 跨视图归色（`.toolbar-icon.active`、`.action-btn-primary`、`.card-header-btn`）。
4. 选择器特异性 ≥ 源码（源码普遍为 `.class[data-v-896f735b]`，覆盖层用同形态或 `.modal-overlay .class` 提级），靠加载顺序取胜；`!important` 仅用于对抗源码 `!important`。

## §F 状态覆盖要求

| 状态 | 触发 | 视觉表现 |
|------|------|---------|
| 空 | 两表 0 行 | C4 空状态文案，`--foreground-muted` |
| hover | 按钮/表格行 | secondary→`--surface-3`；ghost/行→`--state-hover`；solid→88% 白 |
| focus | 键盘导航 | `0 0 0 2px var(--focus-ring)` |
| disabled | 确定（无配置）/ 一键导入（无仓库） | 本体 × `opacity .42`，cursor `not-allowed` |
| active/选中 | 当前激活配置行 | 文字 `#4369ef` + 行底 `--state-selected` |
| 错误 | 表单校验失败（bundle 内建 EP 逻辑） | 继承 EP `--el-color-danger`，映射为 `#ff4b7b` |

## 明确不做的范围

- 不改 bundle JS/源 CSS 本体；不重建源码（源码不在仓库）。
- 不动信息架构与文案（空状态新增文案除外）；不做可访问性深审（阶段二职责）。
- 不动 `vue-topo/`（拓扑视图 Vue 是另一 bundle，另行处理）。

## 修订记录

**R1（用户反馈，2026-07-17）：控制弹窗宽高比例；减少描边、多用填充。**
- 弹窗宽度 `min(1400px,94vw)` → `min(1080px,92vw)`；仓库表 6 列 min-width 全面收紧至合计 934px（< 1080 内宽），杜绝横向滚动。
- 分层策略从「描边」全面转向「填充」（ArkUI 填充优先，呼应 §A 色彩原则）：
  - 弹窗容器、标题栏、表格容器、表头的 1px 描边全部移除；
  - 容器用 `--surface-1` 填充、表头 `--surface-2`、secondary 按钮 `--surface-3`（hover `--surface-4: #313131`）、输入框 `--surface-3` 填充 + 置空 EP 的 inset 边框 box-shadow；
  - 保留的描边仅两处：表格行分隔 `--border-subtle` 细线、focus 焦点环（可访问性需要）。

## 待确认清单

- [ ] `csr-topo-ext` 上游源码仓何时回收本次视觉规格（覆盖层是过渡方案，bundle 重建后 `data-v-896f735b` 哈希会变）。
- [ ] 「配置导入」在 header 与「新增配置」职责是否重叠（信息架构问题，产品层决策 🔴）。
- [ ] 空状态文案是否需要与 VSCode 扩展版一致。
