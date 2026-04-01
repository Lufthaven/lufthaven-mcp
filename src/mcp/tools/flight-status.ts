import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FlightStatusInput } from "../../shared/schemas.js";
import { getFlightStatus } from "../../api/luftdata.js";

export function registerFlightStatus(server: McpServer): void {
  server.tool(
    "flight_status",
    "Look up real-time flight status by IATA or ICAO code (e.g., UA444, UAL444, AA100). Returns departure/arrival airports with times, gates, terminals, delays, live GPS position if airborne, aircraft info, and flight progress.",
    FlightStatusInput.shape,
    async ({ code, date }) => {
      const data = await getFlightStatus(code, date);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );
}
