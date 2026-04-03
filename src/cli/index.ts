#!/usr/bin/env node
import { PACKAGE_VERSION } from "../shared/config.js";
import { ApiError } from "../api/client.js";
import { runFlight } from "./commands/flight.js";
import { runAirport } from "./commands/airport.js";
import { runWeather } from "./commands/weather.js";
import { runDelays } from "./commands/delays.js";
import { runLive } from "./commands/live.js";
import { runDeals } from "./commands/deals.js";
import { runTsa } from "./commands/tsa.js";
import { runSearch } from "./commands/search.js";

const args = process.argv.slice(2);
const command = args[0];
const rest = args.slice(1).filter((a) => a !== "--json" && a !== "--no-color");
const json = args.includes("--json");

async function main(): Promise<void> {
  switch (command) {
    case "flight":  await runFlight(rest, json); break;
    case "airport": await runAirport(rest, json); break;
    case "weather": await runWeather(rest, json); break;
    case "delays":  await runDelays(rest, json); break;
    case "live":    await runLive(rest, json); break;
    case "deals":   await runDeals(rest, json); break;
    case "tsa":     await runTsa(rest, json); break;
    case "search":  await runSearch(rest, json); break;
    case "--version": case "-v": console.log(`lufthaven v${PACKAGE_VERSION}`); break;
    case "--help": case "-h": case "help": case undefined: printHelp(); break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function printHelp(): void {
  console.log(`
  lufthaven v${PACKAGE_VERSION} — Flight data CLI

  Usage: lufthaven <command> [options]

  Commands:
    flight <code>        Flight status (e.g., UA444, AA100)
    airport <query>      Search airports by name, code, or city
    weather <ICAO>       Airport weather (METAR)
    delays [ICAO]        FAA delay programs (all or specific airport)
    live                 Aircraft in an area (--lat/--lon or --airport)
    deals <origin>       Cheap flight deals (--to, --max)
    tsa <airport>        TSA security wait times
    search calendar      Price calendar for a route
    search flights       Search flights with filters
    search returns       Return flights for selected outbound

  Options:
    --json               Output raw JSON
    --no-color           Disable colors
    --date YYYY-MM-DD    Specify date (flight, trail commands)
    -v, --version        Show version
    -h, --help           Show this help

  Examples:
    lufthaven flight UA444
    lufthaven weather KJFK
    lufthaven live --airport KLAX
    lufthaven deals SFO --to NRT --max 500
    lufthaven tsa LAX

  MCP Server:
    lufthaven-mcp        Start MCP server (stdio) for Claude Desktop/Code

  Config for Claude Desktop (claude_desktop_config.json):
    { "mcpServers": { "lufthaven": { "command": "npx", "args": ["-y", "lufthaven"] } } }
`);
}

main().catch((err) => {
  if (err instanceof ApiError) {
    console.error(`Error: ${err.message} (${err.code})`);
  } else {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  process.exit(1);
});
