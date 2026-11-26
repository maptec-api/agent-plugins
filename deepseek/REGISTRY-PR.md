# Maptec Maps — dsh-mcp-connector-registry PR

Local CI on the descriptor **passed** (`npm test`, `npm run validate`, `npm run assets:check`), including icon embed check for DSH Desktop.

Descriptor source: [`maptec-maps.connector.json`](./maptec-maps.connector.json) → upstream path `connectors/maptec-maps.json`.

## Option A — Script (recommended)

```bash
cd /path/to/agent-plugins
./scripts/prepare-dsh-registry-pr.sh
```

The script prints a ready git checkout under `$TMPDIR`. Then:

1. Fork https://github.com/duhu2000/dsh-mcp-connector-registry on GitHub.
2. In that checkout:

   ```bash
   cd "$TMPDIR/dsh-mcp-connector-registry-pr"   # path from script output
   git remote add fork git@github.com:<your-account>/dsh-mcp-connector-registry.git
   git push -u fork add-maptec-maps
   ```

3. Open PR: **base** `duhu2000/dsh-mcp-connector-registry` `main` ← **head** `<your-account>:add-maptec-maps`.
4. Paste the PR body below; complete the upstream PR checklist.

## Option B — GitHub UI only

1. Fork `duhu2000/dsh-mcp-connector-registry`.
2. In your fork: **Add file** → `connectors/maptec-maps.json`, paste contents from this repo.
3. Open PR to `duhu2000:main`.

## Option C — Maintainer intake

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