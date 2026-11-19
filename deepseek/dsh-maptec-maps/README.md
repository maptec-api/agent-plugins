# dsh-maptec-maps

Installable **DSH bundle** for Maptec Maps: registers the official remote MCP (`maptec`) and ships the bundled `maptec-maps` skill.

## Install

From this repository checkout:

```bash
dsh plugin --profile web add ./deepseek/dsh-maptec-maps
```

From Git (pin a commit in production):

```bash
dsh plugin --profile web add 'github:maptec-api/agent-plugins#path:deepseek/dsh-maptec-maps&commit=<sha>'
```

Restart DeepSeek Harness after install (`dsh web` or Desktop).

## Configure Maptec API Key

Set your [Maptec application API Key](https://lbs.maptec.com/console/) in the environment **before** starting DSH. Use the raw key (no `Bearer` prefix):

```bash
export MAPTEC_API_KEY='your-key'
dsh web --profile web
```

Or add the same variable to your shell profile / Desktop launch environment.

Tools appear as `mcp__maptec__<tool>`. Invoke the skill with `/maptec-maps` when the filesystem skill provider is active.

## MCP 连接器市场（可选）

若用户已安装社区插件 `dsh-mcp-connector`，也可通过 [maptec-maps.connector.json](../maptec-maps.connector.json) 收录到 [dsh-mcp-connector-registry](https://github.com/duhu2000/dsh-mcp-connector-registry)。与本 bundle **二选一或并存**均可；bundle 不依赖连接器插件。

## Endpoint

`https://mcp.maptec.com/mcp` (Streamable HTTP).