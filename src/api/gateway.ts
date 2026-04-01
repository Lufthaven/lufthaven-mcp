import { GATEWAY_API_URL } from "../shared/config.js";
import { apiGet } from "./client.js";
import type { FlightDeal, TsaResponse } from "./types.js";

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

export async function getTsaWaitTimes(airportCode: string): Promise<TsaResponse> {
  // TSA endpoint returns raw object, not { data } envelope
  const url = new URL("/api/tsa/wait", GATEWAY_API_URL);
  url.searchParams.set("airport", airportCode);
  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  return res.json() as Promise<TsaResponse>;
}
