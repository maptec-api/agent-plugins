---
name: maptec-maps
description: Search places and nearby businesses, resolve addresses or coordinates, plan routes, compare travel distances, search along a route, match road tracks, locate IP addresses, and render map previews using Maptec MCP. Use when Maptec is requested or is the connected map provider, including mapping requests that do not mention Maptec by name.
description_zh: 使用 Maptec MCP 进行地点与周边搜索、地理编码、路线规划、距离计算、沿途搜索、轨迹绑路、IP 定位与地图预览；当用户需要地图、路线、地址或坐标查询时使用。
description_en: Search places, geocode, plan routes, and related map tasks with Maptec MCP; use for map, routing, address, or coordinate requests.
version: 0.2.1
author: 云图知行
---

Use the connected Maptec MCP server and discover its actual tools and parameter schemas before calling them. Answer in the user's language.

Use only the connected Maptec MCP tools for Maptec queries and previews. If authorization is missing or expired, stop the affected calls and direct the user to the host's Maptec connection settings to connect or reconnect. Maptec application API keys are created at https://lbs.maptec.com/console/project-asset . The official remote endpoint is https://mcp.maptec.com/mcp and expects the API key itself in the Authorization header. Do not prepend Bearer unless the provider changes its documented requirements. If access to a service is denied, tell the user which service needs permission. Leave credential handling to the connector. Do not inspect local configuration or credential stores, ask for keys in chat, or fall back to shell commands, direct HTTP requests, or a browser SDK to retrieve Maptec results.

Ask only for information needed for the requested operation. Use locations and coordinates already supplied in the conversation. Clarify an ambiguous city or place only when it would materially change the result. Ask for a search center when a nearby request lacks one. Never assume the user's current location. Place search and geocoding do not require a route starting point or travel mode. For routing, clarify the mode when necessary and state the mode if you use a documented default.

## Route planning and map previews

1. Reuse known endpoints. Resolve place names with `map_search_text` and street addresses with `map_search_geocode`. Ask only about missing or materially ambiguous endpoints.
2. Reuse a route already computed for the same inputs in this task, or call `map_routes_directions` with the confirmed endpoints and mode. If the service returns `ZERO_RESULTS`, report that no route was found and stop the route workflow. Use the selected route's `summary.distanceMeters` and `summary.durationSeconds` when returned. Label `summary.trafficDurationSeconds` as traffic-aware if reported. Only generate a map if the user requests one.
3. To show the route on a map, pass the selected route's exact `overviewPolyline` as `routes[].encodedPolyline` to `map_ui_compose_scene`. Pass the resulting scene to `map_ui_preview_html`. For along-route search, pass the same exact value as `route.encodedPolyline` to `map_search_along_route`. Treat the polyline as an opaque value and do not manually transcribe, repair, or re-encode it.
4. If the geometry is missing, malformed, truncated, or cannot be passed intact, stop the operation that needs it. For an unavailable map preview, whether due to geometry, a missing or failed tool, or an output the user cannot open, return the verified route summary and explain the limitation. Do not repeat a successful route call to recover geometry.

## Tool reference

The tables below document the current published tool set. The connection's discovered tools and schemas remain authoritative; treat these as reference, not as a substitute for discovery.

### map_search_text — text place search

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `query` | string | yes | Search keywords |
| `pageSize` | integer | no | Results per page, 1-20 |
| `region` | string | no | Region code, e.g. `SG` |
| `language` | string | no | Language code |
| `locationBias` | object | no | Preference area. Circle uses `center` + `radius`, rectangle uses `northeast` + `southwest`. Mutually exclusive with `locationLimit` |
| `locationLimit` | object | no | Restriction area. Same shape rules as `locationBias`. Mutually exclusive with `locationBias` |
| `rank` | string | no | Ranking, e.g. `RELEVANCE` |

`locationBias` / `locationLimit` shape: `center`, `northeast`, and `southwest` take `{ "latitude": number, "longitude": number }`; `radius` is meters, 0-50000.

### map_search_nearby — nearby search

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `locationLimit` | object | yes | Circle only, must contain both `center` and `radius` |
| `query` | string | no | Search keywords, optional |
| `resultLimit` | integer | no | Result cap, 1-20 |
| `language` | string | no | Language code |
| `region` | string | no | Region code |

### map_search_along_route — search along a route

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `route` | object | yes | Route object, typically `{ "encodedPolyline": "..." }` taken from `map_routes_directions` `overviewPolyline` |
| `query` | string | no | Search keywords; at least one of `query` or `types` |
| `types` | string | no | Type filter; at least one of `query` or `types` |
| `routeBufferMeters` | integer | no | Route buffer distance in meters, e.g. 1500 |
| `evaluationMode` | string | no | Evaluation mode, e.g. `STANDARD` |
| `resultLimit` | integer | no | Result cap, 1-20 |
| `language` | string | no | Language code |
| `region` | string | no | Region code |

### map_search_suggest — input suggestions

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `query` | string | yes | Input keywords |
| `resultLimit` | integer | no | Result cap, 1-20 |
| `language` | string | no | Language code |
| `region` | string | no | Region code |
| `locationBias` | object | no | Preference area, same shape as `map_search_text` |
| `locationLimit` | object | no | Restriction area, same shape as `map_search_text` |

### map_search_places — place details

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `placeId` | string | yes | Place ID from a previous search result |
| `language` | string | no | Language code |
| `region` | string | no | Region code |
| `sessionToken` | string | no | Session token |
| `includeExtraFields` | boolean | no | Whether to include extra fields |
| `entry` | string | no | Entry identifier |
| `extraFields` | array | no | Additional returned fields |

### map_search_geocode — forward geocoding

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `address` | string | no | Free-form address |
| `components` | string | no | Component filter |
| `locationBias` | string | no | Rectangle as a JSON string, e.g. `{"northeast":{"latitude":1.3,"longitude":103.9},"southwest":{"latitude":1.2,"longitude":103.6}}`. Circle is not accepted here |
| `language` | string | no | Language code |
| `region` | string | no | Region code |

### map_search_reverse — reverse geocoding

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `location` | string | yes | `"latitude,longitude"` as a string, e.g. `1.3521,103.8198` |
| `resultType` | string | no | Result type, multiple values joined by `|` |
| `locationType` | string | no | `ROOFTOP`, `INTERPOLATED`, `CENTER`; multiple values joined by `|` |
| `language` | string | no | Language code |
| `region` | string | no | Region code |

### map_routes_directions — route planning

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `origin` | object | yes | `{ "location": { "latitude": number, "longitude": number } }` |
| `destination` | object | yes | `{ "location": { "latitude": number, "longitude": number } }` |
| `waypoints` | array | no | Waypoints, up to 25, same `location` shape |
| `mode` | string | no | `driving` / `truck` / `cycling` / `walking`; defaults to `driving` |
| `strategy` | string | no | `fastest` / `shortest` / `eco` / `balanced` |
| `departureTime` | string | no | Departure time |
| `trafficEnabled` | boolean | no | Whether to consider traffic |

### map_matrix_distance — distance and duration matrix

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `origins` | array | yes | Origin points, up to 25; each `{ "lat": number, "lng"?: number, "lon"?: number }` |
| `destinations` | array | yes | Destination points, up to 25; same shape; origins × destinations must not exceed 625 |
| `mode` | string | no | `driving` / `truck` / `walking` / `cycling`; defaults to `driving` |
| `strategy` | string | no | Route strategy |
| `trafficEnabled` | boolean | no | Field name is `trafficEnabled`, not `traffic_enabled` |
| `departureTime` | string | no | ISO-8601, e.g. `2025-10-31T10:00:00Z` |
| `async` | boolean | no | Asynchronous mode |
| `callbackUrl` | string | no | HTTPS callback URL for async mode |
| `truckParams` | object | no | Truck parameters: `height`, `weight`, `width`, `length`, `axle_count` (integer >= 1), `hazardous` |

### map_track_snap_to_roads — track matching

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `points` | array | yes | 2-500 track points, each `{ "latitude": number, "longitude": number }` |

### map_location_ip — IP geolocation

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `ip` | string | yes | IPv4 or IPv6 address |
| `output` | string | no | Output format, e.g. `json` |
| `coord_type` | string | no | Coordinate system, e.g. `wgs84` |

### map_ui_compose_scene — build a map scene

Assembles place markers and routes into a MapScene for browser rendering. It performs no search or routing call.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `center` | array | no | Map center as `[lng, lat]` |
| `zoom` | number | no | Zoom level, defaults to 14 |
| `style` | string | no | Map style URL |
| `markers` | array | no | Markers: `id`, `lngLat` as `[lng, lat]`, or `latitude` / `longitude`, `title`, `placeId` |
| `routes` | array | no | Routes: `id`, `encodedPolyline` (required), `mode`, `color` |
| `fitBounds` | boolean | no | Whether to fit bounds, defaults to true |

### map_ui_preview_html — render a map preview page

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `scene` | object | yes | MapScene v1 JSON, typically from `map_ui_compose_scene` |
| `title` | string | no | Page title |

The preview may need separate browser-side basemap authorization. Keep the MCP connector credential out of the preview HTML and URL.

## Choosing tools

| User goal | Tool choice |
|---|---|
| Find a place or business by name or keyword | Prefer text search, such as `map_search_text`; use `map_search_suggest` for incomplete names or search suggestions |
| Convert a street address to coordinates | Geocoding, such as `map_search_geocode` |
| Find an address for supplied coordinates | Reverse geocoding, such as `map_search_reverse` |
| Find businesses around a location | Nearby search, such as `map_search_nearby`; resolve a named search center to coordinates first if needed |
| Find businesses or services along a planned route | `map_search_along_route` with the selected route's complete `overviewPolyline` |
| Get more information about a returned place | Place details, such as `map_search_places`, using an actual returned place ID |
| Plan a route between locations | Follow the route workflow above to resolve named endpoints and call `map_routes_directions` |
| Compare travel distances or times across origins and destinations | Distance matrix, such as `map_matrix_distance` |
| Align supplied track points to roads | Map matching, such as `map_track_snap_to_roads`, preserving the supplied point order |
| Look up the approximate location of a supplied IP address | IP geolocation, such as `map_location_ip`; do not present it as an exact device or live GPS location |
| Show the results on a map | `map_ui_compose_scene`, then `map_ui_preview_html`. Follow the route workflow above if drawing a route |

Preserve the coordinate order, coordinate system, and units defined by each tool; do not silently swap latitude and longitude or convert coordinate systems. Distinguish route distance from straight-line distance. Include duration or traffic timing only when returned by the service. Do not invent tools, parameters, ratings, opening hours, results, or routes.

For combined searches, reuse place IDs and coordinates already returned during the task. Request only enough candidates to answer the question, and fetch place details only when the requested information is missing. Apply supported location and language parameters from the user's context; a search bias or relevance ranking alone does not establish a strict radius or travel-time boundary.

- To find the closest place by driving or walking, search for candidates, then compare routed distances or durations with a matrix using the requested mode. Keep matrix rows and columns associated with their original locations, and exclude unreachable or failed pairs from the ranking. Request detailed directions for the selected destination when needed. Describe it as the best among the evaluated candidates, rather than the globally nearest place.
- For a request such as "cafes within a ten-minute walk," retrieve a reasonable candidate set and filter using returned walking durations. Do not convert the time threshold to an assumed search radius or infer walking duration from driving results. If the needed routing tools or mode are unavailable, explain that the travel-time condition could not be verified. A finite candidate search is not a complete reachable-area calculation.
- Prefer a supported matrix call for comparing multiple journeys over repeated directions calls, respecting the discovered batch limits. Reuse results for unchanged inputs within the task; refresh time-sensitive data when the user's timing or route conditions change.

Check the service response status even when the MCP call itself reports no transport error. A response with status ERROR is a failed query. When geocoding returns isDegraded or isPartial, or only a country-level match for a specific address or place, describe that precision limit. Do not present a degraded match as an exact location or use it as a precise routing endpoint. Where a place-name search can resolve the request using information already supplied, try it before asking for more details. Ask for a more specific address or coordinate if the result remains ambiguous or too coarse. Verify the returned place and coordinates before planning a route.

Use locations and other data within the scope of the user's request. Do not send unrelated private data to the map service. If a tool fails or authentication is incomplete, explain the specific missing step and avoid presenting estimated outputs as service results.

Official documentation:
- Overview: https://lbs.maptec.com/docs/en-US/mcp/introduction
- Connection setup: https://lbs.maptec.com/docs/en-US/mcp/overview
