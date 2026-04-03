import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PACKAGE_VERSION } from "../shared/config.js";
import { registerFlightStatus } from "./tools/flight-status.js";
import { registerAirportSearch } from "./tools/airport-search.js";
import { registerLiveAircraft } from "./tools/live-aircraft.js";
import { registerAirportWeather } from "./tools/airport-weather.js";
import { registerAirportDelays } from "./tools/airport-delays.js";
import { registerFlightDeals } from "./tools/flight-deals.js";
import { registerTsaWaitTimes } from "./tools/tsa-wait-times.js";
import { registerFlightTrail } from "./tools/flight-trail.js";
import { registerFlightCalendar } from "./tools/flight-calendar.js";
import { registerFlightSearch } from "./tools/flight-search.js";
import { registerReturnFlights } from "./tools/return-flights.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "lufthaven",
    version: PACKAGE_VERSION,
  });

  registerFlightStatus(server);
  registerAirportSearch(server);
  registerLiveAircraft(server);
  registerAirportWeather(server);
  registerAirportDelays(server);
  registerFlightDeals(server);
  registerTsaWaitTimes(server);
  registerFlightTrail(server);
  registerFlightCalendar(server);
  registerFlightSearch(server);
  registerReturnFlights(server);

  return server;
}
