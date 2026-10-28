# Maptec Maps (ChatGPT / Codex)

Maptec MCP and Skills package by **云图知行**.

[English installation guide](../../README.md) | [中文安装说明](../../README.zh-CN.md)

Source: [maptec-api/agent-plugins](https://github.com/maptec-api/agent-plugins).

## Codex installation

When a published version is available, download `maptec-maps-codex-<version>.zip` from [GitHub Releases](https://github.com/maptec-api/agent-plugins/releases). Extract the archive and run `codex plugin marketplace add .` in the extracted directory. It includes the market index and plugin content, so no build is required.

### From source

Run from the repository root:

```bash
npm run build:codex-plugin
codex plugin marketplace add .
```

Install **maptec-maps** from **Maptec Open Plugins**, then configure your Maptec API key through the host credential flow.

## ChatGPT connection requirements

`plugin.json` and `mcp.json` declare the Skill and remote Maptec MCP connection. The package requires a host that supports custom-header API-key authentication. Standard ChatGPT remote MCP setup currently does not provide this API-key configuration flow.

## Maptec API key

Create an application API key in the [Maptec console](https://lbs.maptec.com/console/).

- Endpoint: `https://mcp.maptec.com/mcp`
- Header: `Authorization`, with the raw API key and no `Bearer` prefix

Use the host credential flow to enter the key.

## Package files

| File | Purpose |
|---|---|
| `plugin.json` | Portable plugin manifest |
| `mcp.json` | MCP connection and authentication declaration |
| `mcp.codex.json` | Source for the generated Codex `.mcp.json` |
| `.codex-plugin/plugin.json` | Codex plugin manifest |

The `skills/`, `assets/`, and `.mcp.json` in this directory are generated. Shared sources are at the repository root.

## License

[MIT](../../LICENSE).
