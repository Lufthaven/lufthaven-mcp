import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FlightDealsInput } from "../../shared/schemas.js";
import { getFlightDeals } from "../../api/gateway.js";

export function registerFlightDeals(server: McpServer): void {
  server.tool(
    "flight_deals",
    "Find cheap flight deals from an origin airport. Optionally filter by destination and maximum price. Returns deals with prices, airlines, dates, and number of stops.",
    FlightDealsInput.shape,
    async ({ origin, destination, max_price }) => {
      const data = await getFlightDeals(origin, destination, max_price);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );
}
