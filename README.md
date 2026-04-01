# Lufthaven

Flight data MCP server + CLI. Real-time flight tracking, airport weather, deals, and TSA wait times for AI agents and developers.

**No API key required.** Works with ChatGPT, Claude, and any MCP-compatible AI agent.

## Quick Start

### CLI
```bash
npx lufthaven flight UA444
npx lufthaven weather KJFK
npx lufthaven deals SFO
npx lufthaven tsa LAX
```

### Claude Code / Claude Desktop

Add to your MCP config (`claude_desktop_config.json` or `.mcp.json`):
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

Then ask Claude: *"What's the status of UA444?"* or *"Are there any delays at JFK?"*

### ChatGPT

Connect the hosted MCP endpoint in Settings → Connectors → Create:
```
https://lufthaven-mcp.workers.dev/mcp
```

## Tools

| Tool | What it does |
|------|-------------|
| `flight_status` | Real-time flight status by code (UA444, AA100) |
| `airport_search` | Find airports by name, code, or city |
| `live_aircraft` | Aircraft in a geographic area |
| `airport_weather` | METAR weather for any airport |
| `airport_delays` | FAA ground delays and stops |
| `flight_deals` | Cheap flight deals from an origin |
| `tsa_wait_times` | TSA security checkpoint wait times |
| `flight_trail` | Flight path / position history |

## CLI Commands

```
lufthaven flight <code>         Flight status
lufthaven airport <query>       Search airports
lufthaven weather <ICAO>        Airport weather (METAR)
lufthaven delays [ICAO]         FAA delays
lufthaven live --airport <code> Aircraft near airport
lufthaven deals <origin>        Cheap flights
lufthaven tsa <airport>         TSA wait times
```

All commands support `--json` for raw JSON output.

## Data Sources

- **Live ADS-B**: Real-time aircraft positions via community receivers
- **FAA SWIM**: US flight status from FAA data feeds
- **Weather**: METAR/TAF from aviationweather.gov
- **Delays**: FAA NAS status
- **Deals**: Google Flights price monitoring
- **TSA**: Airport security wait times

## License

MIT
