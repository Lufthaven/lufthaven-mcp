import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FlightSearchInput } from "../../shared/schemas.js";
import { searchFlights } from "../../api/search.js";

export function registerFlightSearch(server: McpServer): void {
  server.tool(
    "flight_search",
    "Search for flights on a specific route and dates. Returns outbound flight options with prices, airlines, times, stops, and booking URLs. Supports filters: airlines, max duration, max layover, max price, sort order.",
    FlightSearchInput.shape,
    async ({ origin, destination, departure_date, return_date, sort, airlines, exclude_airlines, max_duration, max_layover, max_price, stops, class: flightClass, currency, trip_type }) => {
      const data = await searchFlights(origin, destination, departure_date, return_date, {
        sort,
        airlines,
        excludeAirlines: exclude_airlines,
        maxDuration: max_duration,
        maxLayover: max_layover,
        maxPrice: max_price,
        stops,
        flightClass,
        currency,
        tripType: trip_type,
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
