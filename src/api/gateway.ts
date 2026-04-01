import { GATEWAY_API_URL } from "../shared/config.js";
import { apiGet } from "./client.js";
import type { FlightDeal, TsaWaitTime } from "./types.js";

export async function getFlightDeals(
  origin: string,
  destination?: string,
  maxPrice?: number,
): Promise<FlightDeal[]> {
  return apiGet<FlightDeal[]>(GATEWAY_API_URL, "/deals/search", {
    origin,
    destination,
    max_price: maxPrice,
  });
}

export async function getTsaWaitTimes(airportCode: string): Promise<TsaWaitTime[]> {
  return apiGet<TsaWaitTime[]>(GATEWAY_API_URL, "/api/tsa/wait", { airport: airportCode });
}

export async function getTsaOverview(): Promise<TsaWaitTime[]> {
  return apiGet<TsaWaitTime[]>(GATEWAY_API_URL, "/api/tsa/overview");
}
