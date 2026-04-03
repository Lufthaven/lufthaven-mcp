import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ReturnFlightsInput } from "../../shared/schemas.js";
import { getReturnFlights } from "../../api/search.js";

export function registerReturnFlights(server: McpServer): void {
  server.tool(
    "return_flights",
    "Get return flight options for a selected outbound flight. Use after flight_search — pass the selected outbound legs in selected_flights format: dep,date,arr,airline,num (semicolon-separated for connections).",
    ReturnFlightsInput.shape,
    async ({ origin, destination, departure_date, return_date, selected_flights, class: flightClass, currency }) => {
      const data = await getReturnFlights(origin, destination, departure_date, return_date, selected_flights, {
        flightClass,
        currency,
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
