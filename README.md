# Maptec Agent Plugins

[English](README.md) | [简体中文](README.zh-CN.md)

**Maptec Maps**, by **云图知行**, connects AI assistants to Maptec for place search, geocoding, route planning, distance calculation, map matching, and IP geolocation. Available capabilities depend on the tools exposed by your connected MCP server.

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

### Other host packages

| Host | Configuration | Connection requirements |
|---|---|---|
| ZCode | `.zcode-plugin/plugin.json` | Requires support for sensitive `maptec_api_key` settings, or a separately authenticated Maptec MCP connection with the Skill |
| MiniMax | `.minimax-plugin/plugin.json` | Skill only; requires an authenticated Maptec connection provided by the host |
| ChatGPT | `plugins/maptec-maps/plugin.json` and `mcp.json` | Requires custom-header API-key support; standard ChatGPT remote MCP setup currently does not provide this configuration flow |
| Open Plugins | `.plugin/plugin.json` | Requires a compatible host and Maptec API-key configuration |

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
