import { LUFTDATA_API_URL } from "../shared/config.js";
import { apiGet } from "./client.js";
import type { V2FlightResponse, Airport, Aircraft, Weather, TrailResponse, DelayInfo } from "./types.js";

export async function getFlightStatus(code: string, date?: string): Promise<V2FlightResponse> {
  return apiGet<V2FlightResponse>(LUFTDATA_API_URL, `/v2/flight/${encodeURIComponent(code)}`, { date });
}

export async function searchAirports(query: string, limit?: number): Promise<Airport[]> {
  return apiGet<Airport[]>(LUFTDATA_API_URL, "/v1/airports/autocomplete", { q: query, limit });
}

export async function getLiveAircraft(lat: number, lon: number, radius?: number): Promise<Aircraft[]> {
  return apiGet<Aircraft[]>(LUFTDATA_API_URL, "/v1/live", { lat, lon, radius });
}

export async function getAirportWeather(icao: string): Promise<Weather> {
  return apiGet<Weather>(LUFTDATA_API_URL, `/v1/weather/${encodeURIComponent(icao)}`);
}

export async function getAirportDelays(icao?: string): Promise<DelayInfo[] | DelayInfo> {
  if (icao) {
    return apiGet<DelayInfo>(LUFTDATA_API_URL, `/v1/delays/${encodeURIComponent(icao)}`);
  }
  return apiGet<DelayInfo[]>(LUFTDATA_API_URL, "/v1/delays");
}

export async function getFlightTrail(code: string, date?: string, format?: string): Promise<TrailResponse> {
  return apiGet<TrailResponse>(LUFTDATA_API_URL, `/v1/flight/${encodeURIComponent(code)}/trail`, { date, format });
}
