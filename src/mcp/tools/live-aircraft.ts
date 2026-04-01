import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { LiveAircraftInput } from "../../shared/schemas.js";
import { getLiveAircraft } from "../../api/luftdata.js";

export function registerLiveAircraft(server: McpServer): void {
  server.tool(
    "live_aircraft",
    "Find aircraft currently flying in a geographic area. Provide latitude, longitude, and optional radius in nautical miles (default 25, max 250). Returns aircraft positions, altitudes, speeds, callsigns, and types.",
    LiveAircraftInput.shape,
    async ({ latitude, longitude, radius_nm }) => {
      const data = await getLiveAircraft(latitude, longitude, radius_nm);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );
}
