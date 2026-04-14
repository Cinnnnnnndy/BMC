# openUBMC CSR 拓扑图形化编辑器

将 CSR (Component Self-description Record) 的 JSON 文本转化为可视化拓扑树，支持拖拽操作、事件配置、传感器配置与仿真调试。

基于 [openUBMC 板卡适配指南](https://www.openubmc.cn/docs/zh/development/tool_guide/board_integration_guide.html) 设计。

## Web 工具（推荐）

独立 Web 应用，在浏览器中直接使用：

```bash
cd web-app
npm install
npm run dev
```

浏览器打开 http://localhost:5173 ，上传 `.sr` 文件或粘贴 JSON 即可编辑，修改后点击「下载保存」导出。

## 功能模块

### 1. 拓扑图形化编辑器
- 使用 **React Flow** 展示 ManagementTopology 的链路拓扑
- 节点类型：Anchor、Bus（I2C/JTAG/GPIO 等）、Chip、Connector
- 支持拖拽调整布局、连线表示拓扑关系

### 2. 事件配置
- 表单式配置 Event 对象
- 支持从 event_def.json 预定义模板选择 EventKeyId
- 配置 Reading、Condition、Component、DescArg 等字段

### 3. 传感器配置
- **Scanner**：配置 Chip 引用、Offset、Size、Period 等
- **ThresholdSensor**：配置 Reading、EntityId、上下限阈值等

### 4. 仿真调试
- 为 Scanner 设置模拟 Value
- 查看 ThresholdSensor 的 Reading 依赖及仿真取值

## 技术栈

- **前端**: React + TypeScript + React Flow
- **数据**: 直接读写本地 `.sr` JSON 文件（VS Code Extension API）
- **运行**: VS Code WebView Panel，打包为 `.vsix` 安装到 openUBMC Studio

## 安装

```bash
# 打包
npm run compile
npx @vscode/vsce package --no-dependencies

# 在 VS Code / openUBMC Studio 中安装
code --install-extension openubmc-csr-topology-editor-0.1.0.vsix
```

## 使用

1. 在 openUBMC Studio 中打开 vpd 工作空间
2. 右键任意 `.sr` 文件，选择「打开方式」→「CSR 拓扑图形化编辑器」
3. 或通过命令面板执行「打开 CSR 拓扑编辑器」

## 项目结构

```
csr-topology-editor/
├── src/                 # Extension 源码
│   ├── extension.ts
│   ├── editorProvider.ts
│   ├── webviewContent.ts
│   └── types.ts
├── webview/              # WebView 前端 (React)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── csrParser.ts   # JSON <-> Flow 转换
│   │   ├── components/
│   │   │   ├── TopologyView.tsx
│   │   │   ├── EventConfig.tsx
│   │   │   ├── SensorConfig.tsx
│   │   │   └── Simulator.tsx
│   │   └── ...
│   └── dist/             # 构建产物
└── package.json
```

## CSR 结构说明

CSR 核心包含：
- **ManagementTopology**: 链路拓扑（Anchor → Buses → Chips/Connectors）
- **Objects**: 器件对象定义（Chip、Scanner、ThresholdSensor、Event 等）

数据格式为 JSON，详见 openUBMC 社区文档。
