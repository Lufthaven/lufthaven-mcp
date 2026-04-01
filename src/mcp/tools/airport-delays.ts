import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AirportDelaysInput } from "../../shared/schemas.js";
import { getAirportDelays } from "../../api/luftdata.js";

export function registerAirportDelays(server: McpServer): void {
  server.tool(
    "airport_delays",
    "Check FAA ground delay programs, ground stops, and traffic management initiatives at US airports. Provide an ICAO code for a specific airport, or omit to get all active delays nationwide.",
    AirportDelaysInput.shape,
    async ({ icao_code }) => {
      const data = await getAirportDelays(icao_code);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );
}
