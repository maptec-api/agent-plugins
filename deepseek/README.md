# DeepSeek Harness (DSH) — Maptec Maps

Two install paths:

| Path | Artifact | Best for |
| --- | --- | --- |
| **DSH bundle plugin** (recommended) | [`dsh-maptec-maps/`](./dsh-maptec-maps/) | `dsh plugin add` — MCP + bundled Skill in one bundle |
| **MCP connector market** | [`maptec-maps.connector.json`](./maptec-maps.connector.json) | Users who already use `dsh-mcp-connector` |

## User install — DSH bundle

1. Install the bundle into your profile (adjust profile name if needed):

   ```bash
   dsh plugin --profile web add ./deepseek/dsh-maptec-maps
   ```

   From Git: `dsh plugin --profile web add 'github:maptec-api/agent-plugins#path:deepseek/dsh-maptec-maps'`

2. Set your [Maptec application API Key](https://lbs.maptec.com/console/) as `MAPTEC_API_KEY` (raw key, **no** `Bearer` prefix) in the environment, then fully restart DSH.

3. Tools are exposed as `mcp__maptec__*`. Use the bundled skill via `/maptec-maps` when skills are enabled.

Endpoint: `https://mcp.maptec.com/mcp` (Streamable HTTP).

See [`dsh-maptec-maps/README.md`](./dsh-maptec-maps/README.md) for details.

## User install — MCP connector market

1. Install the MCP connector plugin in DSH ([dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector)).
2. Open **MCP 连接器**, refresh the catalog, and find **Maptec 地图** after the registry entry is published.
3. Connect with the same Maptec API Key rules as above.

## Publish to the public connector registry

The canonical descriptor for [dsh-mcp-connector-registry](https://github.com/duhu2000/dsh-mcp-connector-registry) is [`maptec-maps.connector.json`](./maptec-maps.connector.json).

1. Fork `duhu2000/dsh-mcp-connector-registry`.
2. Copy `maptec-maps.connector.json` to `connectors/maptec-maps.json` (filename must match `"id": "maptec-maps"`).
3. Run `npm ci --legacy-peer-deps && npm test && npm run validate && npm run assets:check` in that repo.
4. Open a PR following [ONBOARDING.md](https://github.com/duhu2000/dsh-mcp-connector-registry/blob/main/docs/ONBOARDING.md).

Do not commit real API keys in the descriptor. After merge, users refresh the MCP connector market in DSH.

## Release ZIP

`npm run package:marketplaces` builds `dist/marketplaces/maptec-maps-deepseek-<version>.zip` with the connector descriptor, the `dsh-maptec-maps` bundle, Skill, icons, and install notes for handoff or review.