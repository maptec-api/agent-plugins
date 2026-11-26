# Maptec Maps — dsh-mcp-connector-registry PR

Local CI on the descriptor **passed** (`npm test`, `npm run validate`, `npm run assets:check`), including icon embed check for DSH Desktop.

Descriptor source: [`maptec-maps.connector.json`](./maptec-maps.connector.json) → upstream path `connectors/maptec-maps.json`.

## Option A — Git fork and local checks

1. Fork https://github.com/duhu2000/dsh-mcp-connector-registry and branch, e.g. `add-maptec-maps`.
2. Copy [`maptec-maps.connector.json`](./maptec-maps.connector.json) to `connectors/maptec-maps.json` in that checkout.
3. Run (Node 24 recommended):

   ```bash
   npm ci --legacy-peer-deps
   npm test && npm run validate && npm run assets:check
   ```

4. Push to your fork and open PR: **base** `duhu2000/dsh-mcp-connector-registry` `main` ← **head** `<your-account>:add-maptec-maps`.
5. Paste the PR body below; complete the upstream PR checklist.

## Option B — GitHub UI only

1. Fork `duhu2000/dsh-mcp-connector-registry`.
2. In your fork: **Add file** → `connectors/maptec-maps.json`, paste contents from this repo.
3. Open PR to `duhu2000:main`.

## Option C — Maintainer intake (no PR)

If you cannot open a PR, file a [connector request issue](https://github.com/duhu2000/dsh-mcp-connector-registry/issues/new?template=connector-request.yml) and attach the JSON (no real keys).

---

## Suggested PR body

```markdown
## Summary

Add **Maptec 地图** (`maptec-maps`): official Maptec remote MCP (Streamable HTTP).

- Endpoint: `https://mcp.maptec.com/mcp`
- Auth: API key in `Authorization` header (raw key, **no** Bearer prefix)
- Vendor: 云图知行
- Docs: https://lbs.maptec.com/docs/en-US/mcp/introduction
- Key console: https://lbs.maptec.com/console/project-asset

Hosted MCP; anonymous probe may return 401 without credentials — expected.

## Checklist

- [x] `id` matches filename: `maptec-maps.json`
- [x] No secrets in descriptor
- [x] `npm test && npm run validate && npm run assets:check` passed locally
- [ ] Maintainer: `candidates/records/maptec-maps.json` / acceptance as required by ONBOARDING

Source repo: https://github.com/maptec-api/agent-plugins (`deepseek/maptec-maps.connector.json`)
```

After merge, users install `dsh-mcp-connector`, refresh the market, connect **Maptec 地图**, and enter the API key in the connector UI.