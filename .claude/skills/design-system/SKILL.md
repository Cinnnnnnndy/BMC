# BMC-01 暗色 IDE 设计系统

## 触发词
design system, 设计系统, 设计手册, design playbook, 视觉规范, 配色, token, 组件规格, 脚手架, scaffold, 页面模板

## 何时加载
当会话涉及 UI 开发、新建页面、组件设计、视觉调优、配色选择、布局决策时自动加载。这份技能是完整的设计参考手册，CLAUDE.md 中的硬约束（R1-R8）是它的子集摘要。

## 设计手册
完整的交互式设计手册发布在 `.claude/skills/design-system/design-playbook.html`，包含可视化线框图、配色色板、组件规格表和 9 种页面脚手架画廊。

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
| 背景 | `var(--surface-1)` | PTO token |
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
