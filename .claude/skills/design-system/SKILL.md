# BMC-01 暗色 IDE 设计系统

## 触发词
design system, 设计系统, 设计手册, design playbook, 视觉规范, 配色, token, 组件规格, 脚手架, scaffold, 页面模板

## 何时加载
当会话涉及 UI 开发、新建页面、组件设计、视觉调优、配色选择、布局决策时自动加载。这份技能是完整的设计参考手册，CLAUDE.md 中的硬约束（R1-R8）是它的子集摘要。

## 设计手册
完整的交互式设计手册发布在 `.claude/skills/design-system/design-playbook.html`，包含可视化线框图、配色色板、组件规格表和 9 种页面脚手架画廊。

## openUBMC Studio 设计系统指南
openUBMC Studio 设计系统完整指南（Claude Design 导出）存档在 `.claude/skills/design-system/openUBMC-Studio-Design-System-Guide.html`，包含 token 定义、组件 pattern、布局规范。在浏览器中打开即可查阅。

## 参考文件与资源

openUBMC Studio 设计系统权威参考，按用途分类：

**速查与规范**
- `references/quick-reference.md`：token 和 class 速查表
- `references/openubmc-studio-design-system-map.md`：元素分类规则（UI 元素 → 设计系统部件映射）
- `references/DESIGN.md`：设计系统完整规范（theme、surface、palette、typography、spacing、component、governance）

**改造与审批**
- `references/retrofit-container-audit.md`：改造时删除 legacy container decoration 的强制规则
- `references/preview-gate.md`：新增视觉样式的审批流程

**Token CSS 源文件**
- `tokens/foundation.css`：基础色板、排版、间距、圆角、阴影、层级、动效变量
- `tokens/semantic.css`：语义 token（surface、foreground、border、state、功能色）
- `tokens/components.css`：组件级 token（按钮、输入框、工具栏等）

**组件样式**
- `css/style.css`：完整组件 class 实现（按钮、badge、card、input、toolbar 等 HTML class）

**审计脚本**
- `audit-theme.mjs`：验证 theme token 使用是否正确
- `audit-typography.mjs`：验证排版（14px 正文基线、12px UI 最小值、未批准的 11px 以下字号）

---

## 一、三条元规则

1. **做减法比做加法难**：60% 的 polish 提交是在删东西。新组件上线时先只放必要信息。
2. **布局方案必须同时回答「全局」和「局部」**：配置型 UI 在概念设计阶段就把概览 + 深编辑两个维度画出来。
3. **视觉约束必须自动化**：问题出现第 2 次写文档，第 3 次写 `check-ui-style.mjs` 自动检查。

---

## 二、配色系统

### Surface 灰阶（四级）
| Token | 值 | 用途 |
|-------|------|------|
| `--background` | `#101010` | 页面底 |
| `--surface-1` | `#161616` | 卡片底 |
| `--surface-2` | `#1c1c1c` | 嵌套区域 |
| `--surface-3` | `#262626` | 悬停/选中态 |

### 文字透明度
- 主文本 `rgba(255,255,255,.90)`
- 辅助 `rgba(255,255,255,.60)`
- 弱化 `rgba(255,255,255,.40)`

### 功能色
| 角色 | 色值 | 用途 |
|------|------|------|
| 品牌主色 | `#0077FF`（hover `#0063D1`） | CTA 按钮、链接 |
| AI/紫 | `#a78bfa` | AI 入口、四角星图标 |
| 成功 | `#04d793` | 状态标签、完成态 |
| 警告 | `#ffaa3b` | 告警条 |
| 危险 | `#ff4b7b` | 错误、删除 |
| 欢迎页卡片底 | `#111113` | 仅 welcome 系列卡片 |

### 禁用色值（R2 / R8 自动检查）
**禁用蓝紫系**：`#4369ef` `#3457d5` `#5a92e6` `#4F46E5` `#5b8af5` `#7a9ff7` `#6159ef` `#7c3aed` `#8b5cf6` `#6366f1` `#818cf8` `#a5b4fc`
**禁用绿色系**：`#3dd68c` `#10b981` `#34d399`

---

## 三、视觉原则

### 1. 填充优先，减少描边（Fill over Stroke）
- 卡片/按钮/chip 用 `--surface-*` 灰阶分层替代 border
- 每页白描边上限 2 处（R4 自动检查）
- 分隔线用 `rgba(255,255,255,.06)` 的 `border-bottom` 细线
- Tag 背景用 `color-mix(in srgb, var(--color) 20%, transparent)`

### 2. 面型图标，统一 AI 标识
- 图标用 `fill="currentColor"` 面型
- AI/agent 入口统一 ✦ 四角星面型 + `#a78bfa`
- Path 固定：`M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z`
- 禁止描边星形、机器人、对话泡（R3 自动检查）

### 3. 三级透明度文本
- 标题 20px/700，section 16px/650
- 卡片标题 14px/600，正文 13px/400
- 标签 12px/500

### 4. 胶囊 + 大圆角
- 按钮/chip/输入框 `border-radius: 100px`（R7 自动检查）
- 卡片 `16px`
- IDE 面板 `8px`
- Pane 实底 `var(--background)`，禁止半透明玻璃底

### 5. 页面背景
- 全屏欢迎系页面：蓝紫渐变 + `#181B20`
- 嵌入 IDE pane 页面：实底 `#101010`（R5 自动检查）

---

## 四、IDE 框架布局

### 区域尺寸
| 区域 | 尺寸 | 说明 |
|------|------|------|
| Topbar | `min-height: 48px` | 品牌 Logo + 工程名 + 窗口操作 |
| Activity Rail | `width: 48px` | 垂直图标栏，30×30 按钮 |
| Workarea | `flex: 1` | 递归分屏树，叶子节点 = 带 tab 的 iframe pane |
| AI 助手面板 | `min 260px / max 680px` | 右侧可拖拽，默认 ~40% 屏宽 |
| Terminal Dock | `默认 240px` | 底部 Agent 终端，min 140px / max 600px |
| Status Strip | `min-height: 24px` | 状态信息 |
| Tab Row | `height: 33px` | tab 25px 高，max-width 168px |

### Spacing Tokens
| Token | 值 | 用途 |
|-------|------|------|
| `--ide-frame-pane-inset-top` | `6px` | Workarea 上内边距 |
| `--ide-frame-pane-inset-h` | `8px` | Pane 之间水平间隙 |
| `--ide-frame-pane-inset-bottom` | `8px` | Workarea 下内边距 |
| `--ide-frame-header-height` | `32px` | Pane 头高度 |

### 分屏树逻辑
- 数据模型：`LeafPane = { kind: 'leaf', tabs, activeTabId }` / `SplitPane = { kind: 'split', dir: 'h'|'v', ratio, a, b }`
- 拖动手柄：透明间隙 + 居中 4×44px 胶囊，hover 45% 白 + 56px
- Tab 拖拽分屏：5 个 DropZone（中/左/右/上/下）
- 叶子 Pane：实底 + 圆角 + 边框 + 阴影，iframe 加载页面内容

---

## 五、资源管理器（ExplorerView）

280px 固定左面板，Activity Rail 点击「文件夹」图标激活。

### 左面板结构
| 区域 | 尺寸 | 样式 |
|------|------|------|
| 面板宽度 | `280px`, `flexShrink: 0` | `var(--surface-2)` 底 + `border-right` |
| 面板头 | `height: 44px` | 500 11px 大写 + 0.06em 字距 |
| Section Label | `height: 32px` | 10×10 chevron + 大写标题 |
| 树区 | `flex: 1`, `minHeight: 60px` | `overflowY: auto` |
| ExplorerSection | 头 `30px`, `maxHeight: 42%` | 可折叠 + `border-top` 分割 |

### TreeItem 递归节点
- 缩进 = `8 + depth × 14px` 左 padding
- 行高 `1.6`，字号 `12.5px`，gap `4px`
- 选中态 `rgba(255,255,255,0.08)`，hover `rgba(255,255,255,0.04)`
- Chevron 12×12 SVG，rotate(90°) 展开，0.12s 过渡
- 目录默认展开 `depth < 2`

### 底部可折叠功能区
- **模版浏览器**：分组 pill 按钮（ChipButton），radius 100px，rgba(.06) 底
- **Timeline**：最近变更记录，默认折叠

### 右侧代码面板（CodePane）
- 字体 `ui-monospace, JetBrains Mono, Menlo`，12.5px/1.7
- 行号 11px，min-width 28px
- 诊断：Error wavy #f87171、Warning wavy #fbbf24

---

## 六、配置抽屉（Config Drawer）

右侧滑入式面板。核心模式：「遮罩 + 固定面板 + Header」外壳，内部布局自由。

### 外壳规格（所有抽屉必须遵守）
| 属性 | 值 | 说明 |
|------|------|------|
| 定位 | `position: fixed; top:0; right:0; bottom:0` | 从右侧覆盖 |
| 宽度 | `min(58-72vw, 780-920px)` | 按场景选择区间 |
| 背景 | `var(--surface-1)` | openUBMC Studio token |
| 边框 | `borderLeft: 1px solid var(--border-default)` | 左分割线 |
| 层级 | `z-index: 100`（遮罩 90） | |
| 遮罩 | `rgba(0,0,0,0.35)` | 点击关闭 |
| Header | `padding: 12px 16px` | Pill 徽章 + 标题 14px/500 |

### 内部布局（按场景选择）
1. **单栏详情**：整个 body 是滚动区。适合硬件拓扑详情
2. **两栏 master-detail**：左列表 220px + 右表单。适合板卡告警
3. **卡片列表 + 展开编辑**：垂直可展开卡，展开态 `color-mix(primary 40%)` 边框
4. **表格 / 数据视图**：数据密集场景

### 项目中的 4 种变体
| 组件 | 宽度 | 内部布局 | 特殊 |
|------|------|----------|------|
| BoardAlarmDrawer | `min(70vw, 900px)` | 两栏 master-detail | 左 220px 器件列表 + 右知识库表单 |
| HardwareTopologyView | `min(65vw, 860px)` | 单栏详情 | `#0d1117` 底色 |
| HardwareTopologyCanvas | `min(58vw, 780px)` | 单栏详情 | CSS slide-in `translateX(24px)` |
| ServerAssociationView | `min(72%, 920px)` | 单栏详情 | 带 2px 品牌色边框 |

---

## 七、已验证的组件模式

| 组件 | 规格 |
|------|------|
| `.panel-header` | 44px 高，500 11px 大写，`--foreground-secondary` |
| `.tag / .check-chip` | 20px 高，radius 999px，`color-mix(20%)` 背景 |
| `.capsule-btn` | `#0077FF` 底，radius 100px，14px/600 白字 |
| `.chip` | `rgba(.06)` 底，12.5px/600，hover `.12`，无描边 |
| `.split-handle` | 透明间隙 + 4×44px 胶囊，hover 45% 白 56px |
| `.modal-bg + .modal` | `rgba(0,0,0,.55)` 遮罩，480px 卡 |
| `.bottom-drawer` | 44px 收起 → 340px 展开，`.25s` cubic-bezier |
| `.side-drawer` | `width: 0` → `min(360px,80%)`，`.22s` ease |
| `.toast` | 固定右下，slideup .3s，4s 自动关闭，z:600 |
| `.ctx-menu` | 光标定位，12px radius，danger 红色项 |
| `.skeleton` | shimmer 1.5s，宽度 + 圆形变体 |

---

## 八、9 种页面脚手架

| 类型 | 名称 | 用途 | 模板来源 |
|------|------|------|----------|
| A | 全屏欢迎页 | 引导入口（welcome、install-entry） | `public-page-scaffold/templates/A-fullscreen-welcome.html` |
| B | 智能助手面板 | AI 面板（ai-assist） | `public-page-scaffold/templates/B-ai-panel.html` |
| C | 数据管理页 | 数据密集页（bmc-env） | `public-page-scaffold/templates/C-data-management.html` |
| D | 弹窗/对话框 | 确认弹窗 + QuickPick | `public-page-scaffold/templates/D-modal-dialog.html` |
| E | 全屏配置向导 | 步骤条向导（setup-wizard） | `public-page-scaffold/templates/E-fullscreen-config.html` |
| F | 抽屉/通知 | 底部抽屉 + Toast | `public-page-scaffold/templates/F-drawer-toast.html` |
| G | 加载态/空状态 | 骨架屏 + 进度条 | `public-page-scaffold/templates/G-loading-empty.html` |
| H | 资源管理器 | 左面板文件树（React 组件） | ExplorerView.tsx |
| I | 配置抽屉 | 右侧配置面板（React 组件） | BoardAlarmDrawer.tsx 等 |

---

## 九、自动检查规则（R1-R8）

`scripts/check-ui-style.mjs` 在 PostToolUse hook 中自动运行。

| 规则 | 检查内容 | 触发条件 |
|------|----------|----------|
| R1 | 全局深色滚动条 | 缺少 `::-webkit-scrollbar` 或 `scrollbar-width: thin` |
| R2 | 禁用蓝紫配色 | 包含 BANNED_COLORS 中的色值 |
| R3 | 描边星形图标 | AI 入口使用 stroke 星形 |
| R4 | 白色描边上限 | `border: 1px solid rgba(255,255,255` 超过 2 处 |
| R5 | 嵌入页禁渐变 | 非 welcome 页面包含蓝紫渐变 |
| R6 | :root token | 缺少 `--background`/`--surface-1`/`--primary` |
| R7 | 胶囊圆角 | 使用 `border-radius: 8px`/`12px` |
| R8 | 禁用私造绿色 | 使用 `#3dd68c`/`#10b981`/`#34d399` |

---

## 十、iframe / 独立页面踩坑

1. **iframe 不继承宿主 CSS** → 每个 public/ 页面必须自带完整 `:root` token 和滚动条规则
2. **z-index 和 safe-distance** → `position: absolute/fixed` 元素会被 topbar（48px）遮挡
3. **postMessage 联动** → `{ type:'ai-run-agent', cmd:'agent <关键词>' }`，关键词须命中 AgentTerminal 词表
4. **背景区分** → 全屏用蓝紫渐变 + `#181B20`；嵌入 IDE pane 用实底 `#101010`

---

## 十一、交互模式判断

### 有效模式
- 泳道 + 浮层卡分层（全景 + 深编辑）
- hover 才显操作按钮
- SVG 连线四态：默认灰→active→dim→dashed hover
- 表头筛选替代左侧列表（100+ 条数据时更高效）

### 失败模式
- 纯节点图（传感器多后连线交叉）
- 聚焦发光框（暗色下刺眼）
- 每步彩色状态标签（页面色块过多）
- 独立浮层做概览（与导航树分裂）

---

## 十二、信息密度清单（Q1-Q4）

新组件上线前过一遍：
- Q1 这条信息在 80% 的操作路径中必须吗？→ 不必须收进 hover
- Q2 这个操作按钮在浏览态需要吗？→ 不需要默认隐藏
- Q3 这个功能入口在别处已经有了吗？→ 有就删掉
- Q4 这一级标题和上一级有区分度吗？→ 没有就合并

---

## 十三、Pattern-first 工作流

所有 BMC 页面 = 选定的页面外壳 + 设计系统 token/组件组合。产品页只负责业务数据和 domain logic，不要新造按钮、徽章、卡片、配色或间距语言。

可读性基线：正文、描述、帮助文案使用 14px/1.5；紧凑控件、表格、树、表单 label 不低于 12px；11px 只用于短 badge、eyebrow 等 micro label，不得承载正文。低于 11px 默认禁止。不要用 `zoom`、`transform: scale(...)` 或更小字号解决拥挤——应调整布局、换行、截断或滚动。

### 工作流 A：需求拆解（新建页面）

写代码前先列出页面需要的 UI 部件，逐一映射到现有组件：

1. 判断页面类型 → 选脚手架（第八节 A-I）
2. 列出所有 UI 元素：header/toolbar、buttons、toggle、chip、labels/badges、card、input、data-viz
3. 用第七节「已验证的组件模式」和附录 token 做映射，标注每个元素对应的 class/token
4. 判断背景：全屏欢迎系 → 蓝紫渐变；嵌入 IDE pane → 实底 `#101010`
5. 判断 postMessage 联动需求：是否需要向 AgentTerminal 派发任务

映射完成后进入工作流 C 构建页面。

### 工作流 B：Shell-first 改造（改造已有页面）

已有 HTML/CSS 页面需要迁移到 BMC 设计系统时：

1. 自上而下阅读页面，列出所有视觉元素：buttons、inputs、panels、badges、surfaces、hard-coded colors
2. 判断页面是否已符合 BMC 框架。没有时，第一步是接入正确的外壳（IDE pane 或 welcome 系），不要只改色保留旧结构
3. 对每个元素，用附录 token、第七节组件模式做映射
4. 执行 container decoration audit：每个 card、panel、list item 都检查，删除私造的 border、shadow、gradient、accent bar
5. **先给用户看迁移表，再动手**：

   | 原页面元素 | BMC 等价物 | 使用的 class / token | 需要删除的 legacy 装饰 |
   |---|---|---|---|
   | `<button class="cta">` | capsule-btn | `.capsule-btn` + `#0077FF` | 私有 shadow / gradient |
   | `background: #1a1a1a` | surface-2 | `var(--surface-2)` | 硬编码颜色 |
   | `border: 1px solid white` | fill 分层 | `var(--surface-3)` 或 `rgba(255,255,255,.06)` | 白描边 |

6. 用户确认后，替换 HTML class 和 inline styles，把 hard-coded 值改成 token
7. 删除 legacy container decoration——不要把私有 border 换成 token 色后继续保留
8. 用工作流 C 做最终检查
9. 最终回复列出：使用了哪些 token/class、删除了哪些 legacy 装饰、哪些元素没有等价物需用户决策

### 工作流 C：统一页面构建流程

无论页面是 welcome、数据管理、AI 面板还是配置向导，都按此流程：

**Step 1 — 选页面外壳**

| 页面类型 | 外壳 | 背景 |
|---|---|---|
| 全屏欢迎系（welcome、install-entry） | 脚手架 A | 蓝紫渐变 + `#181B20` |
| AI 面板（ai-assist） | 脚手架 B，嵌入 IDE pane | 实底 `#101010` |
| 数据管理（bmc-env） | 脚手架 C，嵌入 IDE pane | 实底 `#101010` |
| 配置向导（setup-wizard） | 脚手架 E | 按场景 |
| 抽屉/通知 | 脚手架 F | 遮罩 + `var(--surface-1)` |

**Step 2 — 映射内容到组件**

用第七节组件表和附录 E 组件 token 组合页面内容。domain-specific 布局用 flex/grid，不要新造视觉语言。

**Step 3 — 必须包含的基础设施**

每个独立 HTML 页面（`web-app/public/*.html`）必须包含：
- 完整 `:root` token 声明（至少 `--background`、`--surface-1`、`--primary`）（R6）
- 深色滚动条全局规则（R1）
- iframe 不继承宿主样式，所以每个页面都要自带

**Step 4 — 运行自动检查**

```bash
node scripts/check-ui-style.mjs web-app/public/<页面>.html
```

R1-R8 全部通过才能提交。PostToolUse hook 会在每次 Write/Edit 后自动运行。

**Step 5 — 浏览器验证**

启动 dev server，在浏览器中验证：
- 金色路径和边缘情况
- 100% zoom 下字号是否可读
- 暗色滚动条是否生效
- postMessage 联动是否正常

---

## 十四、IDE Frame 接入检查清单

每个嵌入 IDE 的页面，在写业务内容前先检查：

- [ ] **背景**：实底 `#101010`，禁止蓝紫渐变（R5）
- [ ] **:root token**：声明 `--background`、`--surface-1`、`--primary`（R6）
- [ ] **滚动条**：自带完整深色滚动条规则（R1）
- [ ] **Topbar 安全距离**：`position: absolute/fixed` 元素避开 topbar 48px 高度
- [ ] **Pane 样式**：实底 `var(--background)` + 圆角 + 边框，禁止半透明玻璃底
- [ ] **分屏手柄**：引用 `--ide-frame-pane-inset-*` token，不要写死数值
- [ ] **Tab Row**：33px 高，tab 25px 高，max-width 168px
- [ ] **postMessage**：如需联动终端，cmd 格式 `agent <关键词>`，关键词命中 AgentTerminal 词表

---

## 十五、硬性规则汇编

以下规则由 R1-R8 自动检查或 CLAUDE.md 硬约束强制执行：

**配色**
- 禁用蓝紫系私造色（R2）和私造绿色（R8），只用二、配色系统中列出的色值
- 品牌主色 `#0077FF`（hover `#0063D1`），AI 紫 `#a78bfa`，成功绿 `#04d793`

**造型**
- 按钮/chip/输入框 `border-radius: 100px`（R7），卡片 `16px`
- 填充优先减少描边，每页白描边上限 2 处（R4）
- 面型图标 `fill="currentColor"`，AI 入口统一 ✦ 四角星（R3）

**布局**
- 嵌入 IDE 页面实底 `#101010`，禁止蓝紫渐变（R5）
- 每个独立 HTML 页面 `:root` 必须声明核心 token（R6）
- 深色滚动条规则每个独立页面自带（R1）

**组件纪律**
- 不要创建私有 button/toggle/badge/card 系统
- 有现成 token 时不要 hard-code colors、radii、shadows、font sizes、spacing
- 不要保留 legacy card/panel decoration 后只把颜色换成 token
- generic cards/panels 不要保留 `border-left`、inset `box-shadow`、accent bar，除非它们编码业务数据
- 不要把 border/outline 作为主要视觉语言——优先用 fills、spacing、typography、opacity

**排版**
- 正文、描述、帮助文案 ≥ 14px
- 紧凑控件、表格、树 ≥ 12px
- 11px 只用于 micro label
- 不要用缩放解决拥挤

---

## 十六、常见失败模式

- 从空白 HTML/CSS 造页面，跳过现有脚手架和组件体系
- 嵌入 IDE 的页面用了蓝紫渐变背景
- 每个 card、panel、button 都加白描边，变成 border-heavy 页面
- 为了塞下更多内容把正文降到 12px 或更小
- 只改色值保留 legacy 结构，没有真正接入设计系统
- 私造绿色/蓝紫色代替系统功能色
- 用 `border-radius: 8px/12px` 代替胶囊 `100px`
- iframe 页面没有自带滚动条规则和 `:root` token
- postMessage cmd 格式不对或关键词没命中 AgentTerminal 词表
- 用 `zoom`/`scale` 解决拥挤而不是调整布局
- legacy card borders、left rails、pseudo-elements 只是换成 token 色后继续保留
- 在组件内联样式里写 IDE 框架级样式，没有放进 `ide-frame.css`
- 使用 `#4369ef` 等已禁用旧蓝色代替品牌色 `#0077FF`

---

## 十七、缺失样式审批门

工作流 A/C 中，如果现有设计系统无法满足需求：

1. **停止**——不要直接在业务页面里私造样式
2. 创建 preview 文件展示：
   - 最接近的现有组件/pattern
   - 提议的新 pattern
   - normal / hover / active / selected 状态覆盖
   - 使用了哪些 token
   - 当前系统为什么不够
3. 等用户明确批准
4. 批准后，先把新 pattern 吸收到共享设计系统（更新 `check-ui-style.mjs` 规则），再由业务页面消费

---

## 十八、最终回复清单

完成 UI 工作后，回复必须说明：

- 选用了哪种脚手架（A-I）和页面外壳
- 复用了哪些现有组件和 token
- 背景选择（渐变 vs 实底）及原因
- R1-R8 自动检查结果（全部通过 / 哪些修复了）
- 如果是改造：完整迁移表 + 删除了哪些 legacy 装饰
- 哪些需求超出现有系统，是否创建了 preview page
- postMessage 联动是否配置（如适用）
- 排版审计：正文 computed font size、最小 UI 字号

---

## 附录：openUBMC Studio 设计系统完整 Token 参考

以下 token 摘录自 `openUBMC-Studio-Design-System-Guide.html`（Claude Design 导出）。项目中所有自定义值**必须引用这些 token**，不得私造。

### A. 原始色板（Ark Primitives）

| Token | 值 | 说明 |
|-------|------|------|
| `--ark-neutral-0` | `#0b0b0b` | 最深底 |
| `--ark-neutral-1` | `#101010` | 页面底 = `--background` |
| `--ark-neutral-2` | `#141414` | 提升底 |
| `--ark-neutral-3` | `#1a1a1a` | 中灰 |
| `--ark-neutral-4` | `#343434` | 亮灰 |
| `--ark-blue-500` | `#4369ef` | 原始蓝（**项目中已替换为 `#0077FF`**） |
| `--ark-blue-600` | `#5a92e6` | 蓝 hover |
| `--ark-domain-aux` | `#7c8db8` | 辅助色 |
| `--ark-green-500` | `#04d793` | 成功绿 |
| `--ark-orange-500` | `#ffaa3b` | 警告橙 |
| `--ark-red-500` | `#ff4b7b` | 危险红 |

### B. 语义 Token（Surface / Foreground / Border / State）

```css
/* 表面 */
--background: var(--ark-neutral-1);           /* #101010 */
--background-elevated: var(--ark-neutral-2);  /* #141414 */
--surface-1: #161616;
--surface-2: #1c1c1c;
--surface-3: #262626;
--surface-4: #313131;

/* 前景文字 */
--foreground:           rgba(255, 255, 255, 0.90);
--foreground-secondary: rgba(255, 255, 255, 0.60);
--foreground-muted:     rgba(255, 255, 255, 0.40);
--foreground-disabled:  rgba(255, 255, 255, 0.25);

/* 边框 */
--border-subtle:  rgba(255, 255, 255, 0.06);
--border-default: rgba(255, 255, 255, 0.10);
--border-strong:  rgba(255, 255, 255, 0.16);

/* 语义色 */
--primary: var(--ark-blue-500);
--primary-hover: var(--ark-blue-600);
--primary-foreground: #ffffff;
--accent: var(--ark-domain-aux);
--success: var(--ark-green-500);
--warning: var(--ark-orange-500);
--danger: var(--ark-red-500);

/* 状态叠层 */
--state-hover:    rgba(255, 255, 255, 0.06);
--state-press:    rgba(255, 255, 255, 0.10);
--state-muted:    rgba(255, 255, 255, 0.06);
--state-selected: rgba(67, 105, 239, 0.14);
--state-focus:    rgba(67, 105, 239, 0.20);
--focus-ring:     rgba(67, 105, 239, 0.42);

/* 禁用态 */
--surface-disabled: rgba(255, 255, 255, 0.04);
--border-disabled:  rgba(255, 255, 255, 0.06);

/* 语义色背景 */
--tone-critical-bg:   color-mix(in srgb, var(--danger) 14%, transparent);
--tone-warning-bg:    color-mix(in srgb, var(--warning) 16%, transparent);
--tone-info-bg:       color-mix(in srgb, var(--primary) 16%, transparent);
--tone-blue-strong:   color-mix(in srgb, var(--primary) 28%, transparent);
--tone-green-strong:  color-mix(in srgb, var(--success) 22%, transparent);
--tone-warning-strong:color-mix(in srgb, var(--warning) 22%, transparent);
```

### C. 排版（Typography）

```css
--font-sans: 'Inter', 'Source Han Sans SC', 'PingFang SC', 'Noto Sans SC', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

--font-size-display-lg: 28px;
--font-size-title-md:   20px;
--font-size-title-sm:   16px;
--font-size-body-md:    14px;
--font-size-body-sm:    12px;
--font-size-label-xs:   11px;

--font-weight-bold:     700;
--font-weight-semibold: 600;
--font-weight-medium:   500;

--line-height-display: 1.25;
--line-height-body:    1.5;
--line-height-label:   1.2;

--letter-spacing-body:  0;
--letter-spacing-label: 0.5px;
```

### D. 间距 / 圆角 / 阴影 / 层级 / 动效

```css
/* 间距 */
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 20px;  --space-6: 24px;

/* 圆角 */
--radius-sm: 6px;    --radius-md: 8px;    --radius-lg: 12px;
--radius-xl: 16px;   --radius-pill: 999px;

/* 阴影 */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.28);
--shadow-md: 0 6px 18px rgba(0, 0, 0, 0.34);
--shadow-lg: 0 12px 30px rgba(0, 0, 0, 0.42);

/* 层级 */
--z-base: 0;      --z-raised: 10;     --z-dropdown: 100;
--z-overlay: 200;  --z-modal: 300;     --z-toast: 400;

/* 动效 */
--duration-fast: 100ms;  --duration-base: 200ms;  --duration-slow: 350ms;
--easing-default: cubic-bezier(0.4, 0, 0.2, 1);
--easing-out:     cubic-bezier(0, 0, 0.2, 1);
```

### E. 组件 Token

```css
/* 按钮 — 尺寸 */
--button-height-sm: 30px;   --button-height-md: 36px;   --button-height-lg: 42px;
--button-radius: var(--radius-lg);
--button-padding-x-sm: var(--space-2);
--button-padding-x-md: var(--space-3);
--button-padding-x-lg: var(--space-4);
--button-gap: 6px;
--button-font: 500 12px / 1 var(--font-sans);

/* 按钮 — Solid */
--button-solid-bg:       var(--foreground);
--button-solid-bg-hover: color-mix(in srgb, var(--foreground) 88%, transparent);
--button-solid-bg-press: color-mix(in srgb, var(--foreground) 80%, transparent);
--button-solid-fg:       var(--background);

/* 按钮 — Secondary */
--button-secondary-bg:       color-mix(in srgb, var(--surface-2) 92%, white 3%);
--button-secondary-bg-hover: var(--surface-3);
--button-secondary-border:   var(--border-subtle);
--button-secondary-fg:       var(--foreground);
--button-secondary-shadow:   inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 8px rgba(0,0,0,0.16);

/* 按钮 — Ghost */
--button-ghost-bg-hover: var(--state-hover);
--button-ghost-bg-press: var(--state-press);
--button-ghost-fg:       var(--foreground-secondary);
--button-ghost-fg-hover: var(--foreground);

/* 按钮通用 */
--button-focus-ring: var(--focus-ring);
--button-disabled-opacity: 0.42;

/* 输入框 */
--input-height-md: 34px;
--input-radius: var(--radius-md);
--input-border: var(--border-default);

/* 工具栏 */
--comp-toolbar-height: 44px;
--comp-toolbar-bg: color-mix(in srgb, var(--background) 92%, black);
--comp-toolbar-border: var(--border-subtle);
```

### F. IDE 框架 Token

```css
--ide-frame-page-bg: var(--background);
--ide-frame-pane-bg: var(--surface-1);
--ide-frame-pane-border: var(--border-subtle);
--ide-frame-control-bg: color-mix(in srgb, var(--ide-frame-page-bg) 28%, transparent);
--ide-frame-selected-bg: color-mix(in srgb, var(--foreground) 8%, transparent);
--ide-frame-header-height: 32px;
--ide-frame-title-font: 600 12.5px / 1.2 var(--font-sans);
--ide-frame-meta-font: 500 11px / 1.35 var(--font-mono);
```

### G. 高亮色阶（Highlight Ramps）

openUBMC Studio 设计系统定义了 6 组完整色阶（0-1000），用于代码高亮、数据可视化等场景：

| 色阶名 | Source 色 | 用途 |
|--------|-----------|------|
| `copy-blue` | `#3577F6` | 蓝色系高亮 |
| `l0a-violet` | `#A855F7` | 紫色系高亮 |
| `l0b-deep-violet` | `#4F46E5` | 深紫色高亮 |
| `accum-orange` | `#F97316` | 橙色系高亮 |
| `ub-green` | `#87C80F` | 绿色系高亮 |
| `mte-amber` | `#EAB308` | 琥珀色高亮 |

每组包含 `--highlight-{name}-{0..1000}` 共 11 级（0 最亮 → 1000 最暗），完整值见 `openUBMC-Studio-Design-System-Guide.html`。
