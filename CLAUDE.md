# BMC-01 项目约束

## UI 硬约束（违反即 bug）

### 品牌色 #0077FF（写死 · 全项目唯一高亮色）
**高亮色和重点按钮一律用品牌色 `#0077FF`。这一条写死，之后所有新增页面/组件都必须遵守。**
自动检查：`node scripts/check-brand-color.mjs`（PostToolUse hook 每次 Write/Edit 后自动运行，违规必须立即修复）。

允许集合（**仅此 4 个色值 + 其 rgba 形式**，不得再派生其它蓝）：

| 用途 | 色值 |
|---|---|
| 主色：高亮、重点/主 CTA 按钮、选中态、激活态 | `#0077FF` |
| hover | `#3291FE`（= `rgba(50,145,254,1)`，同欢迎页「新建工程」） |
| active / pressed | `#0062D6` |
| 深底上的高亮**文字/图标**（唯一允许的派生浅色） | `#4DA3FF` |
| 弱化底/描边/焦点环 | `rgba(0,119,255,α)` |

- **token 权威**：`web-app/src/styles/pto-foundation.css` 的 `--brand-primary` / `--brand-primary-hover` / `--brand-primary-active` / `--brand-primary-tint` / `--brand-primary-soft` / `--brand-primary-ring`。`--primary`、`--ark-blue-500/600`、`--focus-ring`、`--state-focus` 全部由它派生。写组件时优先 `var(--primary)`，兜底值只能写 `var(--primary, #0077FF)`。
- **独立 HTML / iframe 页面**（public/ 下）不继承宿主 token，必须自己声明这组 `--brand-primary*`，或直接写 `#0077FF`。
- **禁止**再出现任何其它主蓝字面量：`#4369ef #3457d5 #5a92e6 #4F46E5 #4f6ef7 #7c8cf8 #7c9aff #a5b4fc #3b82f6 #2563eb #1d4ed8 #60a5fa #93c5fd #818cf8 #6366f1 #4a90e2 #007acc #1e90ff` 及其 rgba 形式（checker B1 强制）。
- **data-viz 例外**：拓扑节点/连线、图表分类色、位域色阶、代码着色属于数据语义色，不是 UI 高亮色，可以保留其它色相 —— 但必须显式标记，否则 checker 报错：
  - 行内或前 3 行写 `data-viz-exempt`
  - 区块用 `data-viz-exempt:start` … `data-viz-exempt:end`
  - 整文件用 `data-viz-exempt:file`
  - **按钮、选中态、hover 高亮、焦点环不属于 data-viz，一律不得用该标记豁免。**

### 滚动条
任何滚动区域**禁止出现浏览器默认的白底滚动条**。规则：

- React 应用（web-app/src）：全局规则已在 `web-app/src/index.css`，新组件不要再写局部滚动条样式覆盖它。
- **每个独立 HTML / iframe 页面**（web-app/public/ 下所有 *.html 及其 CSS）必须自带这段全局规则（iframe 不继承宿主样式）：

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.16); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }
* { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.16) transparent; }
```

- 新建任何 public/ 页面时先插入此段，再写页面样式。只写 `.some-class::-webkit-scrollbar` 的局部版本不算满足约束。

### IDE 框架布局（ide-frame.css 为唯一权威）
框架级样式一律写在 `web-app/src/styles/ide-frame.css`，不要散落到 app-shell.css 或组件内联样式：

- 间距 token：`--ide-frame-pane-inset-top: 6px`、`--ide-frame-pane-inset-h: 8px`、`--ide-frame-pane-inset-bottom: 8px`。所有 pane、AI 面板、分屏手柄引用这些 token，不要写死数值。
- topbar：`min-height: 48px; padding: 0 14px; border-bottom: 0`（PTO ide-frame pattern 原始值，不要改矮）。
- 分屏/AI 面板拖动手柄：macOS 风格，透明间隙 + 居中 4×44px 胶囊（hover 45% 白、56px 高），禁止整条分割线。
- `ide-leaf-pane`：实底 `var(--background)` + 圆角 + 边框，禁止半透明玻璃底（会透出页面蓝紫渐变）。

### 设计系统
视觉样式必须消费 PTO design system 的既有 token/类（源：`~/Downloads/pto-design-system-main`），不得私造按钮/徽章/卡片/配色。修改前先对照 pattern 原始值。

### 欢迎系页面视觉规范（public/ 独立页面，违反即 bug）
适用：welcome.html、install-entry.html、ai-install.html、install-guide.html、ai-assist.html 及所有新增 public/ 页面。
自动检查：`node scripts/check-ui-style.mjs`（PostToolUse hook 会在每次 Write/Edit 后自动运行，违规必须立即修复）。

1. **PTO token 值**（新页面直接复制这组 `:root`，不要自拟数值）：
   - 表面：`--background #101010` `--surface-1 #161616` `--surface-2 #1c1c1c` `--surface-3 #262626`；欢迎页卡片底 `#111113`
   - 文字：`rgba(255,255,255,.90 / .60 / .40)`
   - 主色 = 品牌色 `#0077FF`（hover `#3291FE`）、成功 `#04d793`、紫 `#a78bfa`；主 CTA 用 `#0077FF` 胶囊（同欢迎页「新建工程」）
   - **禁用**（checker R2/B1 强制）：`#4F46E5 #5b8af5 #6159ef #7c3aed #8b5cf6 #6366f1 #4369ef #3b82f6` 等私造 indigo/violet 与其它主蓝，全部改用品牌色，详见上文「品牌色 #0077FF」
2. **减少描边**：卡片/按钮/chip/输入框一律用填充色分层（`--surface-*` 或 `rgba(255,255,255,.06)`），禁止 1px 白色描边框线（每页面上限 2 处，checker R4）；列表行分隔用 `border-bottom: 1px solid rgba(255,255,255,.06)` 细线。
3. **面型图标**：图标优先 `fill="currentColor"`（面型），少用描边（stroke）图标。AI/agent 相关入口统一用 ✦ 四角星面型图标（`M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z`）+ 紫色 `#a78bfa`（同 ai-assist 面板头），禁止描边星形/机器人/对话泡等自创图标。
4. **胶囊造型**：按钮/chip/输入框 `border-radius: 100px`（同欢迎页「新建工程」）；卡片 `border-radius: 16px`。
5. **页面背景**：欢迎系全屏页复用欢迎页蓝紫渐变
   `radial-gradient(circle at 20% 20%, rgba(161,174,255,0.15) 0%, transparent 50%), radial-gradient(circle at 50% 120%, rgba(53,80,244,0.3) 0%, transparent 70%), #181B20`；
   嵌入 IDE pane 的页面（如 ai-install、ai-assist）用实底 `#101010`。
6. **公告条位置**：message-bar 等公告类元素放在内容区上方（GET STARTED 之后、功能区之前），不要沉底。
7. **空状态**：列表/状态区无真实数据时用演示数据兜底展示（参照 ai-assist 示例场景），不允许留空白占位文案。
8. **终端联动**：向导/工作台派发任务必须走 postMessage `{ type:'ai-run-agent', cmd:'agent <任务描述>' }`——cmd 必须是 `agent <关键词>` 格式且关键词能命中 AgentTerminal AGENT_TASKS 词表（词表按数组顺序 find 首个命中，新词条注意排序）；页内模拟终端块只做摘要，并加「⤷ 完整执行过程见底部 agent 终端」注记。
