import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AirportSearchInput } from "../../shared/schemas.js";
import { searchAirports } from "../../api/luftdata.js";

export function registerAirportSearch(server: McpServer): void {
  server.tool(
    "airport_search",
    "Search for airports by name, city, IATA code, or ICAO code. Returns matching commercial airports with location, timezone, and codes. Useful for resolving airport names to codes.",
    AirportSearchInput.shape,
    async ({ query, limit }) => {
      const data = await searchAirports(query, limit);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );
}
