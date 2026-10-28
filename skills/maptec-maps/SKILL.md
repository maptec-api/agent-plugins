---
name: maptec-maps
description: Use Maptec MCP for place searches, geocoding, route planning, distances, map matching, and IP geolocation when the user requests Maptec mapping services.
---

Use the connected Maptec MCP server and discover its actual tools and parameter schemas before calling them. Answer in the user's language.

If the connection needs credentials, direct the user to the host's secure connection flow. Maptec application API keys are created at https://lbs.maptec.com/console/ . The official remote endpoint is https://mcp.maptec.com/mcp and expects the API key itself in the Authorization header. Do not prepend Bearer unless the provider changes its documented requirements. Never request keys in chat or store them in files.

For place and route questions, resolve ambiguous locations and the requested travel mode. Ask for a starting point when missing; never assume the user's current location. Use geocoding, nearby search, place details, and routing tools as available. Preserve coordinate order and units defined by each tool. Distinguish route distance from straight-line distance and include duration or traffic timing only when returned by the service.

The provider quick start mentions map_search_geocode, map_search_nearby, map_search_places, and map_routes_directions as example tools. These names and their schemas have not been verified by live discovery during packaging. Use the connected server's discovered schemas as authoritative; do not invent tools, parameters, ratings, opening hours, results, or routes.

Use locations and other data within the scope of the user's request. Do not send unrelated private data to the map service. If a tool fails or authentication is incomplete, explain the specific missing step and avoid presenting estimated outputs as service results.

Official documentation:
- Overview: https://lbs.maptec.com/docs/en-US/mcp/introduction
- Connection setup: https://lbs.maptec.com/docs/en-US/mcp/overview
