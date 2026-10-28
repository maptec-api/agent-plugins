# Maptec Maps (ChatGPT / Codex)

ChatGPT Agent Plugins and Codex plugin package for [Maptec MCP](https://lbs.maptec.com/docs/en-US/mcp/introduction).

## Monorepo workflow

Edit **`../../skills/`** and **`../../assets/`** at the repository root. This directory’s `skills/`, `assets/`, and `.mcp.json` are **generated** — run from the repo root:

```bash
npm run build:codex-plugin
```

Host-specific files stay here and are committed:

| File | Purpose |
|------|---------|
| `plugin.json` | ChatGPT / agent-plugins.org manifest |
| `mcp.json` | ChatGPT MCP manifest (OpenAI auth extensions) |
| `mcp.codex.json` | Source for generated `.mcp.json` (Codex) |
| `.codex-plugin/plugin.json` | Codex plugin manifest |

## Codex local testing

```bash
npm run build:codex-plugin
codex plugin marketplace add .
```

Install **maptec-maps** from the **Maptec Open Plugins** marketplace, then configure your Maptec API key when prompted.

## ChatGPT

Install according to your team’s ChatGPT plugin workflow using `plugin.json` and `mcp.json` in this folder (after `build:codex-plugin`).

## License

MIT — see [../../LICENSE](../../LICENSE).
