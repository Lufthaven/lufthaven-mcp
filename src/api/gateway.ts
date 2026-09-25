import { GATEWAY_API_URL } from "../shared/config.js";
import { API_HEADERS } from "./client.js";
import type { TsaResponse } from "./types.js";

export async function getTsaWaitTimes(airportCode: string): Promise<TsaResponse> {
  const url = new URL("/api/tsa/wait", GATEWAY_API_URL);
  url.searchParams.set("airport", airportCode);
  const res = await fetch(url.toString(), {
    headers: API_HEADERS,
    signal: AbortSignal.timeout(10_000),
  });
  return res.json() as Promise<TsaResponse>;
}
