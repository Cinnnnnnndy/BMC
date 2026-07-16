# BMC-01 项目约束

## UI 硬约束（违反即 bug）

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
