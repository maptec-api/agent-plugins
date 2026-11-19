# Maptec Agent Plugins

[English](README.md) | [简体中文](README.zh-CN.md)

**Maptec Maps**, by **云图知行**, connects AI assistants to Maptec for place search, geocoding, route planning, distance calculation, along-route search, map matching, IP geolocation, and map preview rendering. Available capabilities depend on the tools exposed by your connected MCP server.

Source: [maptec-api/agent-plugins](https://github.com/maptec-api/agent-plugins).

## Requirements

- An AI assistant with Skill or MCP support.
- A Maptec application API key from the [console](https://lbs.maptec.com/console/).
- Node.js 22.20 or later for the Skills CLI; Node.js 24 is recommended for source checks and builds.

## Installation

### Skill only

```bash
npx skills add maptec-api/agent-plugins --skill maptec-maps
```

Choose your assistant when prompted. This installs the Skill instructions; configure an authenticated Maptec MCP connection separately for live queries.

### Claude Code

Run in Claude Code:

```text
/plugin marketplace add maptec-api/agent-plugins
/plugin install maptec-maps@maptec-open-plugins
```

Configure the sensitive `maptec_api_key` setting through the host credential prompt.

### Cursor

1. Add this repository as a plugin marketplace using `.cursor-plugin/marketplace.json`, or load the repository root as a plugin.
2. Install **Maptec Maps**.
3. Set **Maptec API Key** (`MAPTEC_API_KEY`) in plugin settings.

### Gemini CLI

```bash
gemini extensions install https://github.com/maptec-api/agent-plugins
```

Enter your key through the sensitive **Maptec API Key** extension setting.

### Kimi

In Kimi Code:

```text
/plugins install https://github.com/maptec-api/agent-plugins
/reload
```

In Kimi Work, give the repository URL to Plugin Builder to import the Skill.

The Kimi package contains the Skill. Configure and authenticate a Maptec MCP connection in your host before using it.

### Codex

Download `maptec-maps-codex-<version>.zip` from [GitHub Releases](https://github.com/maptec-api/agent-plugins/releases), when a published version is available. Extract it, then run inside the extracted directory:

```bash
codex plugin marketplace add .
```

Install **maptec-maps** from **Maptec Open Plugins** and configure the API key through the host credential flow. The ZIP includes the market index and plugin files, so no local build is required.

Alternatively, install from source:

```bash
git clone https://github.com/maptec-api/agent-plugins.git
cd agent-plugins
npm run build:codex-plugin
codex plugin marketplace add .
```

See the [ChatGPT / Codex package instructions](plugins/maptec-maps/README.md).

### WorkBuddy

WorkBuddy has two separate install paths:

**1. Connector (recommended for the official Connector marketplace)**  
Create an **MCP + Skill connector** on the [WorkBuddy Open Platform](https://open.workbuddy.cn) and upload `maptec-maps-workbuddy-<version>.zip` from Releases. Users enter a **Maptec API Key** through the token form (`Authorization` uses the raw key without a `Bearer` prefix).

**2. Plugin marketplace**  
```text
/plugin marketplace add maptec-api/agent-plugins
/plugin install maptec-maps@maptec-open-plugins
```
After enable, set `maptec_api_key` in the plugin detail/config UI (prefer `.codebuddy-plugin/plugin.json`; root `.mcp.json` uses `${user_config.maptec_api_key}`). The plugin path does **not** read `workbuddy/token-schema.json`.

If there is still no Key field:
1. Remove any handwritten `maptec` entry from `~/.workbuddy/mcp.json` (it bypasses plugin config);
2. Run `/plugin disable maptec-maps@maptec-open-plugins` then `/plugin enable maptec-maps@maptec-open-plugins`, or open Configure / re-enable in the plugin UI.

### DeepSeek Harness

**Recommended: DSH bundle plugin**

1. Install the bundle: `dsh plugin --profile web add ./deepseek/dsh-maptec-maps` (or the `dsh-maptec-maps/` directory from the Release ZIP). See [`deepseek/dsh-maptec-maps/README.md`](deepseek/dsh-maptec-maps/README.md).
2. Set `MAPTEC_API_KEY` (raw key, no `Bearer`) in the environment before starting DSH, then fully restart Harness.
3. MCP tools appear as `mcp__maptec__*`. Invoke the bundled skill with `/maptec-maps`.

**Optional: MCP connector market**

1. Install [dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector).
2. Publish [`deepseek/maptec-maps.connector.json`](deepseek/maptec-maps.connector.json) to [dsh-mcp-connector-registry](https://github.com/duhu2000/dsh-mcp-connector-registry) ([`deepseek/README.md`](deepseek/README.md)).

Release artifact `maptec-maps-deepseek-<version>.zip` includes the bundle, connector descriptor, Skill, and notes.

### Other host packages

| Host | Configuration | Connection requirements |
|---|---|---|
| ZCode | `.zcode-plugin/plugin.json` | Configure `maptec_api_key` in plugin settings (marked non-sensitive), or use a separately authenticated Maptec MCP connection with the Skill |
| MiniMax | `.minimax-plugin/plugin.json` | Skill only; requires an authenticated Maptec connection provided by the host |
| ChatGPT | `plugins/maptec-maps/plugin.json` and `mcp.json` | Requires custom-header API-key support; standard ChatGPT remote MCP setup currently does not provide this configuration flow |
| Open Plugins | `.plugin/plugin.json` | Requires a compatible host and Maptec API-key configuration |
| WorkBuddy | `.codebuddy-plugin/plugin.json` (plugin) or `workbuddy/` ZIP (connector) | Plugin: `userConfig`; Connector: `token-schema` token form |
| DeepSeek Harness | `deepseek/dsh-maptec-maps/` (bundle) or `deepseek/maptec-maps.connector.json` (connector market) | Bundle: `MAPTEC_API_KEY`; connector market: after registry PR merge |

## MCP connection

- Endpoint: `https://mcp.maptec.com/mcp`
- Transport: Streamable HTTP
- Header: `Authorization`, containing the API key itself without `Bearer`

Enter credentials through your host's secure configuration flow. Keep real keys out of the repository, installation archives, and chat.

## Usage

After connecting, try:

- “Find cafes within 1000 meters of 1.2868,103.8545 in Singapore.”
- “Find the address and coordinates of Marina Bay Sands Singapore.”
- “Plan a driving route from 1.2868,103.8545 to 1.2834,103.8607.”

Provide your starting location and travel mode for route requests. A Skill supplies instructions; live results require an authenticated MCP connection.

## Build installation packages

```bash
npm ci --ignore-scripts
npm run check
npm run package:marketplaces
```

Platform ZIPs are generated in `dist/marketplaces/`. Each package contains its platform manifest, shared Skills, assets, license, and installation instructions; the Codex ZIP also includes a local marketplace index. Edit shared content in the root `skills/` and `assets/` directories, then rebuild.

GitHub Actions checks pull requests and pushes to `main`. Publishing a GitHub Release with a tag matching `v<package.json version>` builds, checks, and attaches the platform ZIPs to that release. Published installation packages are available from [Releases](https://github.com/maptec-api/agent-plugins/releases).

## Documentation

- [Maptec MCP introduction](https://lbs.maptec.com/docs/en-US/mcp/introduction)
- [Maptec MCP connection setup](https://lbs.maptec.com/docs/en-US/mcp/overview)

## License

[MIT](LICENSE).
