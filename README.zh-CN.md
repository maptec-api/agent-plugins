# Maptec Agent Plugins

[English](README.md) | [简体中文](README.zh-CN.md)

由 **云图知行** 提供的 **Maptec Maps** 技能与插件集合，为 AI 助手提供地点搜索、地理编码、路线规划、距离计算、轨迹绑路和 IP 定位等能力。具体可用工具以实际连接的 MCP 服务为准。

源码：[maptec-api/agent-plugins](https://github.com/maptec-api/agent-plugins)。

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

### 其他宿主安装包

| 宿主 | 配置文件 | 连接要求 |
|---|---|---|
| ZCode | `.zcode-plugin/plugin.json` | 需要支持 `maptec_api_key` 敏感设置；也可使用已单独鉴权的 Maptec MCP 连接配合 Skill |
| MiniMax | `.minimax-plugin/plugin.json` | 仅包含 Skill，需要宿主提供已鉴权的 Maptec 连接 |
| ChatGPT | `plugins/maptec-maps/plugin.json`、`mcp.json` | 需要支持自定义请求头 API Key 的接入方式；ChatGPT 标准远程 MCP 配置流程目前不提供此选项 |
| Open Plugins | `.plugin/plugin.json` | 需要兼容的宿主并配置 Maptec API Key |

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
