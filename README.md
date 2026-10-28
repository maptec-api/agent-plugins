# Maptec Agent Plugins

Monorepo for Maptec agent skills and plugins on AI coding assistants. Same layout idea as [mapbox-agent-skills](https://github.com/mapbox/mapbox-agent-skills): **skills and MCP live at the repo root** — no build step for Cursor.

| Host | Path | Notes |
|------|------|--------|
| **Cursor** | Repository root (`.cursor-plugin/plugin.json`) | Edit `skills/`, `.mcp.json` — no build |
| Open Plugins | `.plugin/plugin.json` | Same root `skills/` and `.mcp.json` |
| ChatGPT / Codex | `plugins/maptec-maps/` | Run `npm run build:codex-plugin` after skill/asset changes |

## Cursor

### Prerequisites

- [Cursor](https://cursor.com) with Plugins
- Maptec application API key from the [console](https://lbs.maptec.com/console/)

### Install

1. Clone or add this repository as a Cursor plugin marketplace (`.cursor-plugin/marketplace.json`).
2. Install **Maptec Maps** from the marketplace, or point Cursor at this repo root.
3. Configure **Maptec API Key** (`MAPTEC_API_KEY`) in plugin settings.

The key is sent as the `Authorization` header to `https://mcp.maptec.com/mcp`. Do not add `Bearer` unless [Maptec’s MCP docs](https://lbs.maptec.com/docs/en-US/mcp/overview) require it.

### Develop

Edit `skills/` and `.mcp.json` at the repo root. Commit changes; no build for Cursor.

### ChatGPT / Codex

```bash
npm run build:codex-plugin
```

Copies root `skills/` and `assets/` into `plugins/maptec-maps/`, and generates `.mcp.json` from `mcp.codex.json`. ChatGPT manifests (`plugin.json`, `mcp.json`) stay in that folder. See [plugins/maptec-maps/README.md](./plugins/maptec-maps/README.md).

## Layout

```text
.
├── .cursor-plugin/
│   ├── marketplace.json
│   └── plugin.json
├── .plugin/plugin.json      # Open Plugins manifest
├── .mcp.json
├── assets/
├── skills/maptec-maps/
├── plugins/maptec-maps/     # ChatGPT/Codex manifests + generated skills/assets
├── .agents/plugins/marketplace.json
├── package.json
├── scripts/build-codex-plugin.js
├── LICENSE
└── README.md
```

## Documentation

- [MCP introduction](https://lbs.maptec.com/docs/en-US/mcp/introduction)
- [MCP connection overview](https://lbs.maptec.com/docs/en-US/mcp/overview)

## License

MIT — see [LICENSE](./LICENSE).
