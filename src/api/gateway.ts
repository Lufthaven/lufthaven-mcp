import { GATEWAY_API_URL } from "../shared/config.js";
import { API_HEADERS } from "./client.js";
import type { FlightDeal, TsaResponse } from "./types.js";

export async function getFlightDeals(
  origin: string,
  destination?: string,
  maxPrice?: number,
): Promise<FlightDeal[]> {
  const url = new URL("/api/deals", GATEWAY_API_URL);
  url.searchParams.set("origin", origin);
  if (destination) url.searchParams.set("destination", destination);
  const res = await fetch(url.toString(), {
    headers: API_HEADERS,
    signal: AbortSignal.timeout(10_000),
  });
  let deals = await res.json() as FlightDeal[];
  if (maxPrice) deals = deals.filter((d) => d.price <= maxPrice);
  return deals.slice(0, 20);
}

export async function getTsaWaitTimes(airportCode: string): Promise<TsaResponse> {
  const url = new URL("/api/tsa/wait", GATEWAY_API_URL);
  url.searchParams.set("airport", airportCode);
  const res = await fetch(url.toString(), {
    headers: API_HEADERS,
    signal: AbortSignal.timeout(10_000),
  });
  return res.json() as Promise<TsaResponse>;
}
