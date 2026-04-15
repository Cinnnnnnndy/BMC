# Mac 全栈开发环境配置 SOP

> 适用场景：Intel Mac + openUBMC Studio 插件开发 + Pixso MCP + AI 辅助编程
> 系统版本：macOS 15.2（Sequoia）
> 整理自实际踩坑记录，坑点均有标注

---

## 目录

1. [基础工具安装](#一基础工具安装)
2. [设计工具配置](#二设计工具配置)
3. [AI 编程工具安装](#三ai-编程工具安装)
4. [MCP 连接配置](#四mcp-连接配置)
5. [Claude Code 安装](#五claude-code-安装)
6. [工具协同关系总览](#六工具协同关系总览)

---

## 一、基础工具安装

### 1.1 打开终端

按 `Command + 空格` 搜索「终端」或「Terminal」，打开黑色窗口。
后续所有命令行操作都在这里进行。

---

### 1.2 安装 Homebrew

Homebrew 是 Mac 的包管理器，后续所有工具都靠它安装。

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

> ⚠️ **坑1：国内网络访问 GitHub 超时**
>
> 报错内容：
> ```
> Failed to download ruby from https://ghcr.io/...
> Error: Failed to install Homebrew Portable Ruby
> ```
>
> **解决方案：改用国内镜像脚本安装**
> ```bash
> /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
> ```
> 安装时选择「清华大学源」（输入数字选择），输入开机密码，等待 5-10 分钟。

**验证安装：**

```bash
brew --version
# 看到 Homebrew 4.x.x 即成功
```

> ⚠️ **坑2：安装完提示 command not found: brew**
>
> 原因：Homebrew 安装完后有「Next steps」提示，需要执行那两行命令。
> 解决：重新打开终端，按提示执行 Next steps 里的命令。

---

### 1.3 安装 Node.js

```bash
brew install node
```

**验证：**

```bash
node --version
# 看到 v22.x.x 即成功
```

---

### 1.4 安装 Git 并配置用户信息

```bash
brew install git
```

配置用户名和邮箱（**每行单独回车，不能合并成一行**）：

```bash
git config --global user.name "你的名字"
```

```bash
git config --global user.email "你的邮箱"
```

> ⚠️ **坑3：两行命令合并成一行执行**
>
> 报错：`错误：未指定任何操作`
>
> 原因：两行命令合并粘贴会被识别为一条命令。
> 解决：分开执行，每行单独回车。

**验证：**

```bash
git config --global --list
# 看到 user.name 和 user.email 即成功
```

---

## 二、设计工具配置

### 2.1 安装 Pixso 桌面端

> **注意：必须是桌面端 ≥ 2.2.0，网页版不支持 MCP 功能**

1. 浏览器打开 `pixso.cn`
2. 点击「下载客户端」→ 选择 macOS 版本
3. 打开 `.dmg` 文件，拖入「应用程序」文件夹
4. 登录或注册账号

---

### 2.2 启动 Pixso MCP 服务器

> **每次使用前都需要重新启动 MCP 服务器**

1. 打开 Pixso 桌面端
2. **必须先打开一个设计文件**（在主界面新建或打开已有文件）
3. 进入设计文件画布后，点击**左上角三个横杠（≡）**
4. 选择 **Pixso MCP → 打开本地 MCP 服务器**
5. 画布底部出现提示：`MCP服务器已开启，地址：http://127.0.0.1:3667/mcp`

> ⚠️ **坑4：找不到 Pixso MCP 菜单入口**
>
> 原因：MCP 菜单只在打开设计文件的画布界面才出现，在主界面找不到。
> 解决：必须先进入某个设计文件的画布，再找左上角菜单。

---

## 三、AI 编程工具安装

### 3.1 安装 Cursor

**方法：用 Homebrew 安装（推荐，绕过系统安全限制）**

```bash
brew install --cask cursor
```

> ⚠️ **坑5：直接从官网下载 Cursor 提示「已损坏，无法打开」**
>
> 系统版本：macOS 15.2（Sequoia）
> 报错：「"Cursor"已损坏，无法打开。你应该将它移到废纸篓。」
>
> 原因：macOS 15 对未经公证的 App 有额外安全限制。
>
> **解决方案一（推荐）：用 Homebrew 安装**
> ```bash
> brew install --cask cursor
> ```
>
> **解决方案二：手动移除隔离标记**
> ```bash
> sudo xattr -rd com.apple.quarantine /Applications/Cursor.app
> ```
>
> **解决方案三：系统设置里允许**
> 系统设置 → 隐私与安全性 → 找到「已阻止使用 Cursor」→ 点击「仍然允许」

---

### 3.2 安装 Windsurf（Cursor 额度不足时的替代）

```bash
brew install --cask windsurf
```

打开项目：

```bash
cd ~/projects/你的项目名
windsurf .
```

> **Windsurf vs Cursor：**
> - Windsurf 免费版额度每天刷新，Cursor 免费版试用后限制严格
> - 两者操作方式基本一致，MCP 配置方法相同
> - Windsurf 的 Agent 模式叫「Write 模式」，在输入框底部切换

---

### 3.3 安装 Blender（3D 建模，按需安装）

> ⚠️ **坑6：Blender 5.0 开始不再支持 Intel Mac**
>
> Intel Mac 必须安装 4.5 LTS 版本，不能安装最新的 5.x 版本。

**Intel Mac：**

```
下载地址：https://www.blender.org/download/lts/4-5/
选择：macOS – Intel
```

**Apple Silicon Mac（M1/M2/M3/M4）：**

```bash
brew install --cask blender
# 或直接去 blender.org 下载最新版
```

**确认你的芯片类型：**
左上角苹果图标 → 关于本机 → 查看处理器一栏

> ⚠️ **坑7：Blender 打开提示 Limited Platform Support**
>
> 内容：`Intel(R) Iris(TM) Plus Graphics 655 Metal API 1.2`
>
> 这只是警告，不是错误，直接点 Continue 关掉即可，Blender 可以正常使用。
>
> **建议修改渲染设置（避免卡顿）：**
> - 渲染引擎改为 EEVEE（不用 Cycles）
> - 视图模式保持 Solid，不用 Rendered 模式

---

## 四、MCP 连接配置

### 4.1 在 Cursor 里配置 Pixso MCP

1. 打开 Cursor → `Cursor → Settings → Cursor Settings`
2. 左侧找到 **MCP** 标签
3. 点击 **+ Add new MCP server**
4. 粘贴以下配置并保存：

```json
{
  "mcpServers": {
    "Pixso MCP": {
      "url": "http://localhost:3667/mcp",
      "headers": {}
    }
  }
}
```

5. 保存后回到 MCP 列表，Pixso MCP 旁边显示**绿点**即连接成功

> ⚠️ **坑8：MCP 绿点不亮**
>
> 原因 99%：Pixso 桌面端没打开，或者打开了但没有启动 MCP 服务器。
> 解决：先启动 Pixso MCP 服务器（见 2.2），再回到 Cursor 检查。

---

### 4.2 在 Windsurf 里配置 Pixso MCP

1. Windsurf → Settings → Cascade → MCP Servers → Add Server
2. 填入相同的配置：

```json
{
  "mcpServers": {
    "Pixso MCP": {
      "url": "http://127.0.0.1:3667/mcp",
      "headers": {}
    }
  }
}
```

---

### 4.3 安装 Blender MCP（让 AI 直接控制 Blender）

**第一步：安装 uv 依赖管理器**

```bash
brew install uv
```

**第二步：在 Blender 里安装插件**

1. 下载插件：`https://github.com/ahujasid/blender-mcp`
   点击绿色 Code → Download ZIP → 解压找到 `addon.py`
2. Blender → Edit → Preferences → Add-ons → Install
3. 选择 `addon.py` → 安装完成后搜索「MCP」→ 勾选启用

**第三步：在 Cursor/Windsurf 里配置 Blender MCP**

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

**第四步：每次使用前在 Blender 里启动服务器**

按 `N` 打开侧边栏 → Blender MCP 标签 → 点击 **Start Server**

> ⚠️ **坑9：Blender MCP 不稳定**
>
> Blender MCP 目前处于早期阶段，复杂场景控制不稳定，
> 适合简单建模任务，复杂场景建议用 Python 脚本代替。

---

## 五、Claude Code 安装

### 5.1 安装

```bash
sudo npm install -g @anthropic-ai/claude-code
```

> ⚠️ **坑10：npm 安装报 EACCES 权限错误**
>
> 报错：`Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/@anthropic-ai'`
>
> **解决方案一（最快）：加 sudo**
> ```bash
> sudo npm install -g @anthropic-ai/claude-code
> ```
>
> **解决方案二（一劳永逸）：修改全局包目录**
> ```bash
> mkdir -p ~/.npm-global
> npm config set prefix '~/.npm-global'
> echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
> source ~/.zshrc
> npm install -g @anthropic-ai/claude-code
> ```

---

### 5.2 配置代理（国内必须）

Claude Code 需要访问 `api.anthropic.com`，国内网络直接访问受限。

**使用 Clash 代理：**

1. 打开 Clash → Proxy → 模式切换为 **Global（全局）**
2. 终端设置代理（端口默认 7890，以 Clash General 里显示的为准）：

```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

**验证网络连通：**

```bash
curl https://api.anthropic.com
# 返回任何内容（不超时）即成功
```

---

### 5.3 登录并启动

```bash
claude
```

首次运行按提示登录 claude.ai 账号（需要 Pro 订阅）。

> ⚠️ **坑11：403 forbidden 错误**
>
> 报错：`API Error: 403 {"error":{"type":"forbidden","message":"Request not allowed"}}`
>
> 原因：Claude Code 需要 claude.ai **Pro 订阅**，Free 计划无法使用。
> 解决：升级到 Pro（$20/月）或使用 Windsurf 免费替代。

---

### 5.4 配置 Pixso MCP 给 Claude Code

```bash
claude mcp add --transport http pixso http://127.0.0.1:3667/mcp
```

验证：

```bash
claude mcp list
# 看到 pixso connected 即成功
```

---

### 5.5 在项目中使用

```bash
cd ~/projects/你的项目名
claude
```

在对话框里用自然语言描述需求，Claude Code 会直接读写项目文件。

---

## 六、工具协同关系总览

```
需求 & 规划
    ↓
claude.ai（本对话）
    ↓ 生成 PRD、提示词、原型草图
    ↓
Pixso（设计稿）
    ↓ 启动 MCP 服务器 localhost:3667
    ↓
Cursor / Windsurf（主力 IDE）
    ↓ 通过 MCP 读取设计数据，生成代码
    ↓
项目代码（React + TypeScript）
    ↓
Git 版本管理（全程）
```

### 各工具使用时机

| 工具 | 使用场景 | 费用 |
|---|---|---|
| claude.ai | 日常规划、提示词、答疑 | 免费 |
| Pixso | 设计稿管理、MCP 服务 | 免费 |
| Cursor | 主力开发 IDE | $20/月 Pro |
| Windsurf | Cursor 额度不足时替代 | 免费 |
| Blender | 3D 模型制作（按需） | 免费 |
| Claude Code | 自动化批量代码任务 | 需要 claude.ai Pro |
| Git | 全程版本管理 | 免费 |

---

## 附：快速验证清单

完成配置后，逐项检查：

- [ ] `brew --version` 输出版本号
- [ ] `node --version` 输出 v22.x.x
- [ ] `git config --global --list` 显示用户名和邮箱
- [ ] Pixso 桌面端能正常打开设计文件
- [ ] Pixso MCP 服务器启动，底部显示地址提示
- [ ] Cursor/Windsurf 里 MCP 列表显示绿点
- [ ] `claude` 命令能正常启动（需要代理 + Pro 订阅）

---

*文档更新时间：2026年*
*适用系统：macOS 15.2 Sequoia，Intel Mac*
