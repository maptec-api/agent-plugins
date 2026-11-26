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

2. Set your [Maptec application API Key](https://lbs.maptec.com/console/project-asset) as `MAPTEC_API_KEY` (raw key, **no** `Bearer` prefix) in the environment, then fully restart DSH.

3. Tools are exposed as `mcp__maptec__*`. Use the bundled skill via `/maptec-maps` when skills are enabled.

Endpoint: `https://mcp.maptec.com/mcp` (Streamable HTTP).

See [`dsh-maptec-maps/README.md`](./dsh-maptec-maps/README.md) for details.

## User install — MCP connector market

1. Install the MCP connector plugin in DSH ([dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector)).
2. Open **MCP 连接器**, refresh the catalog, and find **Maptec 地图** after the registry entry is published.
3. Connect with the same Maptec API Key rules as above.

## Publish to the public connector registry

Canonical descriptor: [`maptec-maps.connector.json`](./maptec-maps.connector.json).

- **Icon:** `https://cdn.jsdelivr.net/gh/maptec-api/agent-plugins@main/assets/logo.png` (pin to a commit tag in the PR if maintainers require a fixed URL).
- **Key UI:** `auth.api-key` with `Authorization` header (raw key, no Bearer); help link → Maptec console.

### PR checklist

1. Fork [dsh-mcp-connector-registry](https://github.com/duhu2000/dsh-mcp-connector-registry) and branch, e.g. `add-maptec-maps`.
2. Copy **this file** to `connectors/maptec-maps.json` (`id` must be `maptec-maps`).
3. Locally (Node 24 recommended), or from this repo:

   ```bash
   ./scripts/prepare-dsh-registry-pr.sh
   ```

   Then push the printed `$WORK` checkout to your fork and open the PR. Manual equivalent:

   ```bash
   npm ci --legacy-peer-deps
   npm test && npm run validate && npm run assets:check
   ```

4. Open a PR to `duhu2000/dsh-mcp-connector-registry:main`; complete the PR template checklist.
5. Expect maintainers to add `candidates/records/maptec-maps.json` (vendor verification / acceptance). Hosted API-key probes may return 401 without a key — that is expected.
6. After merge, users refresh **MCP 连接器** in DSH; no connector npm release required.

Do not commit real API keys. Optional Skill for end users: `npx skills add maptec-api/agent-plugins --skill maptec-maps` (not part of the registry descriptor).

## Release ZIP

`npm run package:marketplaces` builds `dist/marketplaces/maptec-maps-deepseek-<version>.zip` with the connector descriptor, the `dsh-maptec-maps` bundle, Skill, icons, and install notes for handoff or review.