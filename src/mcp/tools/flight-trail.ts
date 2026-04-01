import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FlightTrailInput } from "../../shared/schemas.js";
import { getFlightTrail } from "../../api/luftdata.js";

export function registerFlightTrail(server: McpServer): void {
  server.tool(
    "flight_trail",
    "Get the flight path and position history for a flight. Returns timestamped lat/lon/altitude points showing the aircraft's trajectory. Supports GeoJSON output format.",
    FlightTrailInput.shape,
    async ({ code, date, format }) => {
      const data = await getFlightTrail(code, date, format);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );
}
