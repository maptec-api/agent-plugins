# DeepSeek Harness (DSH) — Maptec Maps

Maptec remote MCP for DeepSeek Harness via the community **MCP 连接器** plugin (`dsh-mcp-connector`).

## User install

1. Install the MCP connector plugin in DSH (see [dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector)).
2. Open **MCP 连接器**, refresh the catalog, and find **Maptec 地图** after the registry entry is published.
3. Connect with your [Maptec application API Key](https://lbs.maptec.com/console/). Use the raw key in `Authorization` without a `Bearer` prefix.

Endpoint: `https://mcp.maptec.com/mcp` (Streamable HTTP).

Optional: install the Skill from this repository with `npx skills add maptec-api/agent-plugins --skill maptec-maps`, or use the Skill bundled in the `maptec-maps-deepseek-*.zip` release artifact.

## Publish to the public registry

The canonical descriptor for [dsh-mcp-connector-registry](https://github.com/duhu2000/dsh-mcp-connector-registry) is [`maptec-maps.connector.json`](./maptec-maps.connector.json).

1. Fork `duhu2000/dsh-mcp-connector-registry`.
2. Copy `maptec-maps.connector.json` to `connectors/maptec-maps.json` (filename must match `"id": "maptec-maps"`).
3. Run `npm ci --legacy-peer-deps && npm test && npm run validate && npm run assets:check` in that repo.
4. Open a PR following [ONBOARDING.md](https://github.com/duhu2000/dsh-mcp-connector-registry/blob/main/docs/ONBOARDING.md).

Do not commit real API keys in the descriptor. After merge, users refresh the MCP connector market in DSH.

## Release ZIP

`npm run package:marketplaces` builds `dist/marketplaces/maptec-maps-deepseek-<version>.zip` containing this descriptor, the shared Skill, icons, and install notes for internal handoff or review bundles.
