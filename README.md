# Lufthaven

Flight data for AI agents and developers. Real-time tracking, weather, deals, and TSA wait times.

No API key required.

## What You Get

- `flight_status` — real-time flight status, gates, delays, live GPS position
- `airport_search` — find airports by name, code, or city
- `live_aircraft` — aircraft currently flying in an area
- `airport_weather` — METAR conditions and flight rules
- `airport_delays` — FAA ground delay programs
- `flight_deals` — cheap flight deals from an origin
- `tsa_wait_times` — TSA security checkpoint wait times
- `flight_trail` — flight path / position history

## Requirements

- **Node.js 18 or later**

## Install

### Claude Code

```bash
claude mcp add lufthaven -- npx -y lufthaven
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "lufthaven": {
      "command": "npx",
      "args": ["-y", "lufthaven"]
    }
  }
}
```

### Codex

Add to your project's `codex.json` or global MCP config:

```json
{
  "mcpServers": {
    "lufthaven": {
      "command": "npx",
      "args": ["-y", "lufthaven"]
    }
  }
}
```

### ChatGPT

Settings → Connectors → Create, then paste:

```
https://lufthaven-mcp.workers.dev/mcp
```

Then try:

```
What's the status of UA444?
Are there any delays at JFK right now?
Find me cheap flights from SFO to Tokyo.
What's the weather at Heathrow?
```

## CLI

Also works as a standalone CLI:

```bash
npx lufthaven flight UA444
npx lufthaven weather KJFK
npx lufthaven deals SFO --to NRT
npx lufthaven tsa LAX
npx lufthaven live --airport KLAX
npx lufthaven delays
npx lufthaven airport "san francisco"
```

All commands support `--json` for raw JSON output.

## Data

- **Live ADS-B** — real-time aircraft positions from community receivers worldwide
- **FAA SWIM** — US flight status direct from FAA data feeds
- **Weather** — METAR/TAF from aviationweather.gov
- **Delays** — FAA NAS ground delay programs
- **Deals** — Google Flights price monitoring
- **TSA** — airport security checkpoint wait times

## License

MIT
