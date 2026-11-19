# dsh-maptec-maps

Installable **DSH bundle** for Maptec Maps: registers the official remote MCP (`maptec`) and ships the bundled `maptec-maps` skill.

## Install

From this repository checkout:

```bash
dsh plugin --profile web add ./deepseek/dsh-maptec-maps
```

From GitHub (whole repository — use this in the DSH “install from GitHub” UI):

```bash
dsh plugin --profile web add 'github:maptec-api/agent-plugins#<commit-sha>'
```

The repository root `package.json` declares `dsh.bundle` and points at this directory’s `cordis.patch.yml`. Pin a commit SHA in production.

Subdirectory-only install (optional):

```bash
dsh plugin --profile web add 'github:maptec-api/agent-plugins#path:deepseek/dsh-maptec-maps&commit=<sha>'
```

Restart DeepSeek Harness after install (`dsh web` or Desktop).

## Configure Maptec API Key

Use the **raw** application key (no `Bearer` prefix). DSH resolves `${credential:MAPTEC_API_KEY}` from, in order:

1. Saved entry in harness credentials (Settings / `.credentials.yaml`)
2. Environment when you **launch** DSH (`MAPTEC_API_KEY=… dsh web`)
3. Project `.env`, then `$DSH_HOME/.env`

**Desktop:** exporting in a terminal after the app is already running does **not** update DSH. Put the key in `~/.dsh/.env` as `MAPTEC_API_KEY=…`, save it in credentials, or fully quit and relaunch Desktop with the variable set.

If the plugin shows **“invalid config”** on enable, the old bundle used `!!js process.env.MAPTEC_API_KEY`, which becomes `undefined` when the env var is missing and fails schema validation. Pull the latest bundle and set the key using one of the paths above, then restart DSH.

Tools appear as `mcp__maptec__<tool>`. Invoke the skill with `/maptec-maps` when the filesystem skill provider is active.

## MCP 连接器市场（可选）

若用户已安装社区插件 `dsh-mcp-connector`，也可通过 [maptec-maps.connector.json](../maptec-maps.connector.json) 收录到 [dsh-mcp-connector-registry](https://github.com/duhu2000/dsh-mcp-connector-registry)。与本 bundle **二选一或并存**均可；bundle 不依赖连接器插件。

## Endpoint

`https://mcp.maptec.com/mcp` (Streamable HTTP).