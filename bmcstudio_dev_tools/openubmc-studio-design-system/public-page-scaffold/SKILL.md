---
name: public-page-scaffold
description: 在 web-app/public/ 下新建 HTML 页面时使用。自动填充完整 boilerplate：暗色滚动条、openUBMC Studio design token、背景、postMessage 联动模板，消除 R1/R2 违规源头。触发词：新建页面、新 HTML、create page、新增页面、加一个页面。
---

# public-page-scaffold — 新建 public/ 独立页面

## 何时使用

在 `web-app/public/` 下新建任何 `.html` 文件时，**先用本 skill 确定页面类型，再从对应模板开始写**。不要从空白文件起步——那是 R1/R2/R4 违规的主要来源。

## 页面分三类

根据页面用途选择对应模板：

### A. 全屏欢迎系页面
**适用场景**：welcome、install-entry 等全屏居中的引导/入口页面
**特征**：蓝紫渐变背景、居中卡片布局、大标题 + CTA 按钮

### B. 智能助手面板
**适用场景**：ai-assist、ai-install、install-guide 等嵌入 IDE pane 的 AI 助手面板
**特征**：实底 `#101010`、100vh 面板、对话气泡 + 建议按钮 + 输入区、紫色 ✦ 四角星、postMessage 联动

### C. 数据管理页面
**适用场景**：bmc-env、release-notes 等数据密集的列表/表格页面
**特征**：完整 openUBMC Studio 语义 token、表格/列表为主、筛选/分页

### D. 弹窗 / 对话框
**适用场景**：确认操作、快捷选择器（QuickPick）、完成态蒙层
**特征**：半透明遮罩 `rgba(0,0,0,.55)` + 居中卡片 `480px` / 搜索列表 `400px` / 全屏成功态

### E. 全屏配置向导
**适用场景**：setup-wizard、多步骤配置流程
**特征**：顶部步骤条（胶囊 pill）、可折叠配置卡（grid-template-rows 动画）、底部导航按钮

### F. 抽屉面板
**适用场景**：底部日志/输出面板、侧边详情面板、Toast 通知、右键菜单
**特征**：底部抽屉（height 过渡 `.25s`）、侧边抽屉（width 过渡 `.22s`）、固定定位 toast + context menu

### G. 加载态 / 空状态
**适用场景**：数据加载中、列表为空、AI 就绪态、进度反馈
**特征**：骨架屏（shimmer 动画）、空状态（图标 + 文案 + CTA）、进度条 + 步骤指示器

## 模板内容

不管选哪个类型，**以下三块必须存在**（缺任何一块都会被 `check-ui-style.mjs` 拦截）：

### 块 1：全局深色滚动条（R1 强制）

```css
/* ═══ 全局深色滚动条约束（design constraint — 禁止默认白底滚动条）═══ */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.16); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }
* { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.16) transparent; }
```

### 块 2：openUBMC Studio design tokens（R2 强制 — 禁止私造配色）

```css
:root {
  /* 表面层 */
  --background: #101010;
  --surface-1: #161616;
  --surface-2: #1c1c1c;
  --surface-3: #262626;
  /* 文字 */
  --foreground: rgba(255,255,255,.90);
  --foreground-secondary: rgba(255,255,255,.60);
  --foreground-muted: rgba(255,255,255,.40);
  /* 边框 */
  --border-default: rgba(255,255,255,.10);
  --border-subtle: rgba(255,255,255,.06);
  /* 品牌主色（#0077FF 是唯一主色，禁止 #4369ef 及其他私造 indigo/violet） */
  --primary: #0077FF;
  --primary-hover: #0063D1;
  --success: #04d793;
  --accent-purple: #a78bfa;
  /* 状态 */
  --state-hover: rgba(255,255,255,.06);
  --state-selected: rgba(0,119,255,.14);
  /* 字体 */
  --font-sans: 'Inter','Source Han Sans SC','PingFang SC',sans-serif;
  --font-mono: 'JetBrains Mono','Fira Code','Consolas',monospace;
}
```

### 块 3：排版层级

```css
/* 排版层级（勿自拟大小） */
/* page title:   20px / 700 / #fff */
/* section head: 16px / 650 / #fff */
/* card title:   14px / 600 / rgba(255,255,255,.90) */
/* body text:    13px / 400 / rgba(255,255,255,.60) */
/* label/hint:   12px / 500 / rgba(255,255,255,.40) */
/* mono/code:    12px / 500 / var(--font-mono) */
```

## 类型 A 模板：全屏欢迎系页面

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>【页面标题】</title>
<style>
/* ═══ 全局深色滚动条约束 ═══ */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.16); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }
* { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.16) transparent; }

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background:
    radial-gradient(circle at 20% 20%, rgba(161,174,255,0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 120%, rgba(53,80,244,0.3) 0%, transparent 70%),
    #181B20;
  color: rgba(255,255,255,0.90);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.wrap {
  width: 100%;
  max-width: 660px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.heading { text-align: center; }
.heading h1 { font-size: 22px; font-weight: 700; letter-spacing: 0.3px; color: #fff; }
.heading p { margin-top: 8px; font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.6; }

/* 卡片：#111113 填充分层，radius 16px，禁止 1px 描边 */
.card {
  background: #111113;
  border-radius: 16px;
  padding: 20px;
}

/* 主 CTA 按钮 */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 24px;
  border-radius: 100px;
  border: none;
  background: #0077FF;
  color: #fff;
  font-size: 14px; font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover { background: rgba(50,145,254,1); }

/* 胶囊 chip */
.chip {
  display: inline-flex; align-items: center;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(255,255,255,0.06);
  font-size: 12.5px; font-weight: 600;
  color: rgba(255,255,255,0.90);
  cursor: pointer;
  border: none;
  transition: background 0.15s;
}
.chip:hover { background: rgba(255,255,255,0.12); }

/* AI/agent 四角星图标色 */
.icon-ai { color: #a78bfa; }
</style>
</head>
<body>
<div class="wrap">
  <div class="heading">
    <h1>页面标题</h1>
    <p>页面描述文案</p>
  </div>

  <div class="card">
    <!-- 卡片内容 -->
  </div>
</div>
</body>
</html>
```

## 类型 B 模板：智能助手面板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>【面板标题】</title>
<style>
/* ═══ 全局深色滚动条约束 ═══ */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.16); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }
* { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.16) transparent; }

:root {
  --background: #101010;
  --surface-1: #161616;
  --surface-2: #1c1c1c;
  --surface-3: #262626;
  --foreground: rgba(255,255,255,.90);
  --foreground-secondary: rgba(255,255,255,.60);
  --foreground-muted: rgba(255,255,255,.40);
  --border-default: rgba(255,255,255,.10);
  --border-subtle: rgba(255,255,255,.06);
  --primary: #0077FF;
  --primary-hover: #0063D1;
  --success: #04d793;
  --accent-purple: #a78bfa;
  --state-hover: rgba(255,255,255,.06);
  --state-selected: rgba(67,105,239,.14);
  --font-sans: 'Inter','Source Han Sans SC','PingFang SC',sans-serif;
  --font-mono: 'JetBrains Mono','Fira Code','Consolas',monospace;
}

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  height: 100%;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  font-size: 13px;
  overflow: hidden;
}

.panel {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 面板头 */
.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  flex-shrink: 0;
  padding: 0 8px 0 14px;
}
.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
  flex: 1;
}

/* 面板体 */
.panel-body {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  padding: 0 14px 14px;
}

/* AI 四角星 */
.icon-ai { color: var(--accent-purple); display: block; }
</style>
</head>
<body>
<div class="panel">
  <div class="panel-header">
    <svg class="icon-ai" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/></svg>
    <span class="panel-title">面板标题</span>
  </div>
  <div class="panel-body">
    <!-- 面板内容 -->
  </div>
</div>

<script>
/* ── postMessage 联动模板 ──
   向宿主 IDE 派发 agent 任务：
   window.parent.postMessage({ type: 'ai-run-agent', cmd: 'agent <任务关键词>' }, '*');
   关键词须命中 AgentTerminal AGENT_TASKS 词表。
*/
</script>
</body>
</html>
```

## 类型 C 模板：数据管理页面

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
<meta charset="UTF-8">
<title>【管理页标题】</title>
<style>
/* ═══ 全局深色滚动条约束 ═══ */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.16); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }
* { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.16) transparent; }

:root, [data-theme="dark"] {
  --background: #101010;
  --background-elevated: #141414;
  --surface-1: #161616;
  --surface-2: #1c1c1c;
  --surface-3: #262626;
  --surface-4: #313131;
  --foreground: rgba(255,255,255,.90);
  --foreground-secondary: rgba(255,255,255,.60);
  --foreground-muted: rgba(255,255,255,.40);
  --foreground-disabled: rgba(255,255,255,.25);
  --border-subtle: rgba(255,255,255,.06);
  --border-default: rgba(255,255,255,.10);
  --border-strong: rgba(255,255,255,.16);
  --primary: #0077FF;
  --primary-hover: #0063D1;
  --success: #04d793;
  --warning: #ffaa3b;
  --danger: #ff4b7b;
  --accent-purple: #a78bfa;
  --state-hover: rgba(255,255,255,.06);
  --state-press: rgba(255,255,255,.10);
  --state-selected: rgba(67,105,239,.14);
  --focus-ring: rgba(67,105,239,.42);
  --font-sans: 'Inter','Source Han Sans SC','PingFang SC',sans-serif;
  --font-mono: 'JetBrains Mono','Fira Code','Consolas',monospace;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 999px;
  /* 排版预设 */
  --text-title-1: 600 20px/1.30 var(--font-sans);
  --text-title-2: 600 16px/1.30 var(--font-sans);
  --text-body: 400 14px/1.50 var(--font-sans);
  --text-body-sm: 400 12px/1.50 var(--font-sans);
  --text-label: 500 11px/1.20 var(--font-sans);
  --text-mono: 500 12px/1.40 var(--font-mono);
}

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
html,body {
  height: 100%;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.6;
}

.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  overflow-y: auto;
  height: 100vh;
}

/* 页头 */
.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.page-title { font: var(--text-title-1); }

/* 表格 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.data-table th {
  text-align: left;
  font: var(--text-label);
  color: var(--foreground-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 8px 12px;
}
.data-table td {
  padding: 10px 12px;
  font: var(--text-body-sm);
  border-top: 1px solid var(--border-subtle);
}
.data-table tr:hover td {
  background: var(--state-hover);
}

/* 状态标签 */
.tag {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border-radius: var(--radius-pill);
  font: var(--text-label);
  letter-spacing: 0.02em;
}
.tag-success { background: color-mix(in srgb, #04d793 14%, transparent); color: var(--success); }
.tag-warning { background: color-mix(in srgb, #ffaa3b 16%, transparent); color: var(--warning); }
.tag-danger  { background: color-mix(in srgb, #ff4b7b 14%, transparent); color: var(--danger); }
.tag-info    { background: color-mix(in srgb, #0077FF 16%, transparent); color: var(--primary); }
</style>
</head>
<body>
<div class="page">
  <div class="page-header">
    <h1 class="page-title">页面标题</h1>
  </div>

  <table class="data-table">
    <thead>
      <tr>
        <th>列标题</th>
        <th>列标题</th>
        <th>状态</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>示例数据</td>
        <td>示例数据</td>
        <td><span class="tag tag-success">正常</span></td>
      </tr>
    </tbody>
  </table>
</div>
</body>
</html>
```

## 绝对禁止

无论哪种模板，以下行为被 `check-ui-style.mjs` 自动拦截：

| 规则 | 禁止内容 |
|------|----------|
| R2   | 使用 `#4F46E5` `#5b8af5` `#6159ef` `#7c3aed` `#8b5cf6` `#6366f1` 等私造 indigo/violet |
| R3   | AI/agent 入口用描边星形/机器人/对话泡图标（必须用面型四角星 `M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z`） |
| R4   | 每页超过 2 处 `border: 1px solid rgba(255,255,255,...)`（用填充色分层代替描边） |

## postMessage 联动（适用于 B/C 类型）

需要向 IDE 终端派发 agent 任务时：

```js
window.parent.postMessage({
  type: 'ai-run-agent',
  cmd: 'agent <任务关键词>'
}, '*');
```

`cmd` 必须是 `agent <关键词>` 格式，关键词须命中 AgentTerminal `AGENT_TASKS` 词表。页内模拟终端块只做摘要展示，加注「⤷ 完整执行过程见底部 agent 终端」。

## 使用流程

1. 确认页面属于 A / B / C / D / E / F / G 哪种类型（可组合：D/F/G 是覆盖层组件，通常嵌入 A/B/C 页面中）
2. 复制对应模板作为起点（模板文件在 `.claude/skills/public-page-scaffold/templates/` 目录下）
3. 修改 `<title>` 和页面标题
4. 在模板结构上添加业务内容
5. 写完后 `check-ui-style.mjs` 自动运行校验（PostToolUse hook）

## 模板文件索引

| 模板 | 文件 | 用途 |
|------|------|------|
| A | `templates/A-fullscreen-welcome.html` | 全屏欢迎/引导页 |
| B | `templates/B-ai-assistant-panel.html` | 智能助手面板 |
| C | `templates/C-data-management.html` | 数据管理页 |
| D | `templates/D-modal-dialog.html` | 弹窗 / QuickPick / 完成态 |
| E | `templates/E-fullscreen-config.html` | 全屏配置向导 |
| F | `templates/F-drawer.html` | 抽屉 / Toast / 右键菜单 |
| G | `templates/G-loading-empty.html` | 加载态 / 空状态 / 进度条 |
