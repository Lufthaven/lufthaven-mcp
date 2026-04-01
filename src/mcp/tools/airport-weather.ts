import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AirportWeatherInput } from "../../shared/schemas.js";
import { getAirportWeather } from "../../api/luftdata.js";

export function registerAirportWeather(server: McpServer): void {
  server.tool(
    "airport_weather",
    "Get current aviation weather (METAR) for an airport by ICAO code (e.g., KJFK, EGLL, LFPG). Returns temperature, wind speed/direction, visibility, ceiling, flight rules (VFR/IFR), and raw METAR text.",
    AirportWeatherInput.shape,
    async ({ icao_code }) => {
      const data = await getAirportWeather(icao_code);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );
}
