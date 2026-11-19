<div align="center">

<a name="maptec-agent-plugins"></a>

### <picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/maptec-agent-plugins-title-dark.svg"><img src="./.github/assets/maptec-agent-plugins-title.svg" alt="Maptec Agent Plugins" width="360" height="45"></picture>

[English](README.md) | [简体中文](README.zh-CN.md)

</div>

由 **云图知行** 提供的 **Maptec Maps** 技能与插件集合，为 AI 助手提供地点搜索、地理编码、路线规划、距离计算、沿途搜索、轨迹绑路、IP 定位和地图预览等能力。具体可用工具以实际连接的 MCP 服务为准。

源码：[maptec-api/agent-plugins](https://github.com/maptec-api/agent-plugins)。

<p align="center">
  <img src="./.github/assets/maptec-maps-cover.jpg" alt="Maptec Maps：地点搜索、地理编码、路线规划等功能" width="720">
</p>

## 使用条件

- 支持 Skill 或 MCP 的 AI 助手。
- 从 [Maptec 控制台](https://lbs.maptec.com/console/) 获取的应用 API Key。
- 使用 Skills CLI 需要 Node.js 22.20 或更新版本；源码检查和构建推荐使用 Node.js 24。

## 安装

### 单独安装 Skill

```bash
npx skills add maptec-api/agent-plugins --skill maptec-maps
```

按提示选择使用的 AI 助手。此方式安装 Skill 使用指引，实时查询还需要单独配置已鉴权的 Maptec MCP 连接。

### Claude Code

在 Claude Code 中执行：

```text
/plugin marketplace add maptec-api/agent-plugins
/plugin install maptec-maps@maptec-open-plugins
```

通过宿主的安全凭据提示配置 `maptec_api_key` 敏感设置。

### Cursor

1. 使用 `.cursor-plugin/marketplace.json` 将本仓库添加为插件市场，或将仓库根目录作为插件加载。
2. 安装 **Maptec Maps**。
3. 在插件设置中填写 **Maptec API Key**（`MAPTEC_API_KEY`）。

### Gemini CLI

```bash
gemini extensions install https://github.com/maptec-api/agent-plugins
```

通过扩展的 **Maptec API Key** 敏感设置填写密钥。

### Kimi

在 Kimi Code 中执行：

```text
/plugins install https://github.com/maptec-api/agent-plugins
/reload
```

在 Kimi Work 中，将仓库链接交给 Plugin Builder 导入 Skill。

Kimi 包仅包含 Skill，使用前需要在宿主中配置并完成 Maptec MCP 连接鉴权。

### Codex

有已发布版本时，从 [GitHub Releases](https://github.com/maptec-api/agent-plugins/releases) 下载 `maptec-maps-codex-<版本号>.zip`，解压后在解压目录中执行：

```bash
codex plugin marketplace add .
```

从 **Maptec Open Plugins** 中安装 **maptec-maps**，通过宿主的凭据配置流程填写 API Key。ZIP 已包含市场索引和插件文件，无需本地构建。

也可以从源码安装：

```bash
git clone https://github.com/maptec-api/agent-plugins.git
cd agent-plugins
npm run build:codex-plugin
codex plugin marketplace add .
```

详见 [ChatGPT / Codex 包说明](plugins/maptec-maps/README.md)。

### WorkBuddy

WorkBuddy 有两条互不替代的安装通道：

**1. 连接器（推荐上架官方连接器市场）**  
在 [WorkBuddy 开放平台](https://open.workbuddy.cn) 创建 **连接器（MCP + Skill）**，上传 Release 中的 `maptec-maps-workbuddy-<版本号>.zip`（含 `connector-meta.json`、`mcp.json`、`token-schema.json`、Skill 与图标）。用户通过 Token 表单填写 **Maptec API Key**（`Authorization` 使用原始 Key，不要加 Bearer）。

**2. 插件市场**  
```text
/plugin marketplace add maptec-api/agent-plugins
/plugin install maptec-maps@maptec-open-plugins
```
启用后在插件详情/配置里填写 `maptec_api_key`（清单优先 `.codebuddy-plugin/plugin.json`，根目录 `.mcp.json` 使用 `${user_config.maptec_api_key}`）。插件通道**不会**读 `workbuddy/token-schema.json`。

安装后若仍无 Key 入口，请先：
1. 从 `~/.workbuddy/mcp.json` **删除手写的 `maptec` 段**（否则会绕过插件配置）；
2. `/plugin disable maptec-maps@maptec-open-plugins` 再 `/plugin enable maptec-maps@maptec-open-plugins`，或在插件页打开配置/重新启用。

### DeepSeek Harness

**推荐：DSH bundle 插件**

1. 安装 bundle：本地 `dsh plugin --profile web add ./deepseek/dsh-maptec-maps`；从 GitHub 填 `maptec-api/agent-plugins` 或 `dsh plugin --profile web add 'github:maptec-api/agent-plugins#<commit>'`（须用仓库根目录，子目录包不可直接在 UI 里填整仓 URL）。详见 [`deepseek/dsh-maptec-maps/README.md`](deepseek/dsh-maptec-maps/README.md)。
2. 启动 DSH 前设置环境变量 `MAPTEC_API_KEY`（原始 Key，不要加 `Bearer`），然后完全重启 Harness。
3. MCP 工具名为 `mcp__maptec__*`；内置 Skill 可用 `/maptec-maps` 调用。

**可选：MCP 连接器市场**

1. 安装社区插件 **MCP 连接器**（[dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector)）。
2. 将 [`deepseek/maptec-maps.connector.json`](deepseek/maptec-maps.connector.json) 提交到 [dsh-mcp-connector-registry](https://github.com/duhu2000/dsh-mcp-connector-registry)（详见 [`deepseek/README.md`](deepseek/README.md)）。

Release 附件 `maptec-maps-deepseek-<版本号>.zip` 含 bundle、连接器描述符、Skill 与说明。

### 其他宿主安装包

| 宿主 | 配置文件 | 连接要求 |
|---|---|---|
| ZCode | `.zcode-plugin/plugin.json` | 在插件设置中配置 `maptec_api_key`（当前为非敏感字段）；也可使用已单独鉴权的 Maptec MCP 连接配合 Skill |
| MiniMax | `.minimax-plugin/plugin.json` | 仅包含 Skill，需要宿主提供已鉴权的 Maptec 连接 |
| ChatGPT | `plugins/maptec-maps/plugin.json`、`mcp.json` | 需要支持自定义请求头 API Key 的接入方式；ChatGPT 标准远程 MCP 配置流程目前不提供此选项 |
| Open Plugins | `.plugin/plugin.json` | 需要兼容的宿主并配置 Maptec API Key |
| WorkBuddy | `.codebuddy-plugin/plugin.json`（插件）或 `workbuddy/` ZIP（连接器） | 插件用 `userConfig`；连接器用 `token-schema` Token 表单 |
| DeepSeek Harness | `deepseek/dsh-maptec-maps/`（bundle）或 `deepseek/maptec-maps.connector.json`（连接器市场） | Bundle：`MAPTEC_API_KEY`；连接器市场：Registry PR 合并后一键连接 |

## MCP 连接配置

- 服务端点：`https://mcp.maptec.com/mcp`
- 传输方式：Streamable HTTP
- 请求头：`Authorization`，值为原始 API Key，不添加 `Bearer`

通过宿主的安全配置流程填写凭据，避免将真实密钥写入仓库、安装包或聊天。

## 使用示例

连接完成后，可以尝试：

- “搜索新加坡坐标 1.2868,103.8545 周围 1000 米内的咖啡馆。”
- “查找 Marina Bay Sands Singapore 的地址和坐标。”
- “规划从 1.2868,103.8545 到 1.2834,103.8607 的驾车路线。”

规划路线时请提供起点和出行方式。Skill 提供使用指引，实时查询结果需要通过已鉴权的 MCP 连接获取。

## 构建安装包

```bash
npm ci --ignore-scripts
npm run check
npm run package:marketplaces
```

各平台 ZIP 输出到 `dist/marketplaces/`，包含对应平台声明、共享 Skill、品牌资源、许可证和安装说明；Codex ZIP 还包含本地市场索引。共享内容在根目录 `skills/`、`assets/` 中维护，修改后重新构建。

GitHub Actions 会自动检查 PR 和推送到 `main` 的改动。发布标签与 `package.json` 版本一致的 GitHub Release（格式为 `v<版本号>`）后，会自动构建、检查并将各平台 ZIP 添加为附件。已发布安装包可从 [Releases](https://github.com/maptec-api/agent-plugins/releases) 获取。

## 官方文档

- [Maptec MCP 介绍](https://lbs.maptec.com/docs/en-US/mcp/introduction)
- [Maptec MCP 接入说明](https://lbs.maptec.com/docs/en-US/mcp/overview)

## 许可证

本项目采用 [MIT 许可证](LICENSE)。
