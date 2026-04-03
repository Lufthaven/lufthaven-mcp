import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FlightCalendarInput } from "../../shared/schemas.js";
import { getFlightCalendar } from "../../api/search.js";

export function registerFlightCalendar(server: McpServer): void {
  server.tool(
    "flight_calendar",
    "Get flight prices across dates for a route. Returns one price per departure date over ~5 months. Use to find the cheapest dates to fly.",
    FlightCalendarInput.shape,
    async ({ origin, destination, trip_length, class: flightClass, currency, stops }) => {
      const data = await getFlightCalendar(origin, destination, trip_length, flightClass, currency, stops);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
