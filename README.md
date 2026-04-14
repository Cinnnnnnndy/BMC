# openUBMC CSR 拓扑编辑器

基于 Web 的 openUBMC CSR（Component Self-description Record）可视化工具，支持硬件拓扑浏览、软硬件关联分析、传感器/事件配置与 IPMI 仿真调试。

---

## 快速启动（Preview）

> **唯一入口：`web-app/` 目录。** 所有可视化功能均在此目录下。

```bash
cd web-app
npm install      # 首次运行需要
npm run dev      # 启动开发服务器
```

浏览器打开 **http://localhost:5173**，选择项目即可进入编辑器。

---

## 项目结构总览

```
csr-topology-editor/
│
├── web-app/               ← ★ 核心 Preview 应用（React + Vite）
│   ├── src/
│   │   ├── App.tsx                    # 顶层路由与视图切换
│   │   ├── main.tsx                   # 应用入口
│   │   ├── types.ts                   # 全局类型定义
│   │   ├── csrParser.ts               # CSR JSON ↔ ReactFlow 转换
│   │   ├── boardTopologyParser.ts     # 板卡拓扑解析
│   │   │
│   │   ├── components/                # 各视图组件（一一对应 UI 入口）
│   │   │   ├── ProjectList.tsx              # 首页：项目选择 + 视图快速入口
│   │   │   ├── HardwareTopologyCanvas.tsx   # 硬件拓扑（分组/展开双视图）
│   │   │   ├── HardwareTopologyView.tsx     # 硬件拓扑外层容器
│   │   │   ├── TopologyView.tsx             # CSR 管理拓扑（ReactFlow 编辑器）
│   │   │   ├── TaishanStaticVectorTopologyView.tsx  # TaiShan 2180 静态矢量拓扑
│   │   │   ├── TaiShanBoardTopologyView.tsx         # TaiShan 板卡详细视图
│   │   │   ├── VendorHuaweiTianChiTopologyView.tsx  # 天池 拓扑视图
│   │   │   ├── TianChiBoardTopologyView.tsx         # 天池 板卡视图
│   │   │   ├── SoftwareHardwareAssociationView.tsx  # 软硬件关联拓扑图
│   │   │   ├── ServerAssociationView.tsx            # 软硬件关联列表
│   │   │   ├── BoardTopologyCards.tsx               # 板卡拓扑卡片组件
│   │   │   ├── EventConfig.tsx                      # 事件配置表单
│   │   │   ├── SensorConfig.tsx                     # 传感器配置表单
│   │   │   ├── Simulator.tsx                        # 仿真调试入口
│   │   │   ├── CsrNode.tsx                          # ReactFlow 节点渲染
│   │   │   ├── topology-shapes.tsx                  # 节点形状库
│   │   │   └── ServerView/                          # 服务器视图子模块
│   │   │
│   │   ├── sim/                       # 仿真引擎（IPMI 模拟）
│   │   │   ├── SimView.tsx / SimPanel.tsx / SimToolbar.tsx
│   │   │   ├── IsoCanvas.tsx          # 等轴测 3D 视图
│   │   │   ├── simStore.ts            # 仿真状态管理
│   │   │   └── useSimulation.ts / serverData.ts / ...
│   │   │
│   │   ├── data/                      # 静态数据（板卡拓扑、项目列表）
│   │   │   ├── hardwareTopologyData.ts   # 硬件拓扑连接数据（主数据文件）
│   │   │   ├── serverBoardsData.ts       # 板卡规格数据
│   │   │   ├── projects.ts               # 项目注册表
│   │   │   ├── taishanLayout.ts
│   │   │   └── tianchiBoardTopology.ts
│   │   │
│   │   ├── hooks/                     # 自定义 React Hooks
│   │   └── styles/                    # 全局样式与设计令牌
│   │
│   ├── public/
│   │   ├── images/                    # 静态图片资源
│   │   └── samples/                   # 示例 CSR 文件（.sr）
│   │       ├── huawei-kunpeng/root.sr
│   │       ├── huawei-tianchi/root.sr
│   │       └── openubmc-ref/root.sr
│   │
│   ├── package.json                   # 依赖：React、Vite、ReactFlow 等
│   └── vite.config.ts
│
├── src/                   ← VSCode Extension 宿主代码（与 Preview 无关）
│   ├── extension.ts             # 扩展激活入口
│   ├── editorProvider.ts        # WebView Panel 提供者（加载 web-app/dist/）
│   └── webviewContent.ts / types.ts
│
├── webview/               ← ⚠️ 已废弃的旧版 WebView（不使用）
│   └── （见 _archive/webview-legacy/）
│
├── _archive/              ← 历史代码存档（不参与构建，供参考）
│   ├── unused-components/        # 开发过程中被替代的视图原型
│   │   ├── TaishanVisionExplorationView.tsx   # 探索性背景图视图
│   │   ├── TaishanVisionVectorView.tsx        # CSR ReactFlow 早期版本
│   │   ├── TaishanIsoView.tsx                 # 等轴测 3D 原型
│   │   ├── SimulatorBoardPrism.tsx            # 棱柱体板卡渲染
│   │   └── SimulatorBoardGraphics.tsx         # 旧版板卡图形
│   └── webview-legacy/           # VSCode WebView 旧版前端
│
├── .gitignore
├── .claude/launch.json    ← Claude Code 预览服务配置（相对路径）
├── package.json           ← VSCode Extension 构建入口（与 Preview 无关）
├── tsconfig.json
└── README.md              ← 本文件
```

---

## 视图路由逻辑

`App.tsx` 根据 **项目选择** 和 **activeTab** 决定渲染哪个视图（同时只渲染一个）：

| 入口 / Tab | 渲染的组件 | 说明 |
|---|---|---|
| 未选择项目 | `ProjectList` | 首页：项目列表 + 视图快速入口 |
| 硬件拓扑视图 | `HardwareTopologyCanvas` | 无限画布，分组/展开视图切换 |
| 软硬件关联拓扑 | `ServerAssociationView` | 服务器级关联全图 |
| topology（TaiShan） | `TaishanStaticVectorTopologyView` | 静态矢量拓扑 |
| topology（天池） | `VendorHuaweiTianChiTopologyView` | 天池 CSR 拓扑 |
| topology（其他） | `TopologyView`（ReactFlow 编辑器） | 通用 CSR 编辑 |
| boardTopology | `TianChiBoardTopologyView` | 天池板卡视图 |
| association | `SoftwareHardwareAssociationView` | 软硬件关联列表视图 |
| sensor | `SensorConfig` | 传感器配置表单 |
| event | `EventConfig` | 事件配置表单 |
| simulator | `Simulator` → `SimView` | IPMI 仿真调试 |

---

## 技术栈

| 层次 | 技术 |
|---|---|
| 框架 | React 18 + TypeScript |
| 构建 | Vite |
| 图形 | ReactFlow（CSR 拓扑）/ Canvas 2D（硬件拓扑） |
| 样式 | CSS Modules + CSS Variables（设计令牌） |
| 状态 | useState / useReducer（无外部状态库） |

---

## 分支策略

```
main       ← 稳定基准（已验证可运行）
  └─ develop  ← 日常开发集成分支
       └─ feature/xxx  ← 具体功能分支
```

**工作流：**

```bash
# 开始新功能
git checkout develop
git checkout -b feature/功能名称

# 完成后合并回 develop
git checkout develop
git merge feature/功能名称

# 稳定后合并到 main（发版节点）
git checkout main
git merge develop
git tag v0.x.0
```

**规则：**
- 直接修改 `main` 分支：禁止
- `feature/*` 分支命名：`feature/功能名` 或 `fix/问题描述`
- 每次合并到 `develop` 前，必须确保 `npm run dev` 无报错

---

## 常见问题

**Q: `npm run dev` 启动后页面空白或报错**
```bash
# 确认在正确目录
cd web-app
npm install   # 如果 node_modules 不存在
npm run dev
```

**Q: 看到多个版本或渲染混乱**
- 确认运行的是 `web-app/` 下的服务器（端口 5173），而不是其他目录
- `webview/` 目录已废弃，请勿启动其 dev server
- `_archive/` 目录仅供参考，不参与构建

**Q: 如何添加新的硬件项目**
1. 在 `web-app/src/data/projects.ts` 注册项目
2. 在 `web-app/src/data/hardwareTopologyData.ts` 添加板卡连接数据
3. 在 `App.tsx` 的路由条件中处理新的 `projectId`

---

## VSCode Extension 构建（可选）

Preview 独立运行**不需要**以下步骤。仅在需要打包 VSCode 插件时执行：

```bash
# 在项目根目录（非 web-app/）
npm install
npm run compile   # 编译 Extension + 构建 web-app/dist/

# 打包 .vsix
npx @vscode/vsce package --no-dependencies
```
