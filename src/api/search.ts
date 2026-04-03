import { FLIGHT_SEARCH_API_URL } from "../shared/config.js";
import { API_HEADERS } from "./client.js";
import type { CalendarResponse, SearchResponse, ReturnsResponse } from "./types.js";

async function searchApiGet<T>(path: string, params: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(path, FLIGHT_SEARCH_API_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== 0) {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    headers: API_HEADERS,
    signal: AbortSignal.timeout(20_000), // longer timeout — Google API can be slow
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as Record<string, unknown>;
    const msg = (body.error as string) ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

export async function getFlightCalendar(
  origin: string,
  destination: string,
  tripLength?: number,
  flightClass?: string,
  currency?: string,
  stops?: string,
): Promise<CalendarResponse> {
  return searchApiGet<CalendarResponse>("/v1/calendar", {
    origin,
    destination,
    trip_length: tripLength,
    class: flightClass,
    currency,
    stops,
  });
}

export async function searchFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string,
  options?: {
    sort?: string;
    airlines?: string;
    excludeAirlines?: string;
    maxDuration?: number;
    maxLayover?: number;
    maxPrice?: number;
    stops?: string;
    flightClass?: string;
    currency?: string;
    tripType?: string;
    bags?: string;
  },
): Promise<SearchResponse> {
  return searchApiGet<SearchResponse>("/v1/search", {
    origin,
    destination,
    departure_date: departureDate,
    return_date: returnDate,
    sort: options?.sort,
    airlines: options?.airlines,
    exclude_airlines: options?.excludeAirlines,
    max_duration: options?.maxDuration,
    max_layover: options?.maxLayover,
    max_price: options?.maxPrice,
    stops: options?.stops,
    class: options?.flightClass,
    currency: options?.currency,
    trip_type: options?.tripType,
    bags: options?.bags,
  });
}

export async function getReturnFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string,
  selectedFlights: string,
  options?: {
    flightClass?: string;
    currency?: string;
    stops?: string;
  },
): Promise<ReturnsResponse> {
  return searchApiGet<ReturnsResponse>("/v1/returns", {
    origin,
    destination,
    departure_date: departureDate,
    return_date: returnDate,
    selected_flights: selectedFlights,
    class: options?.flightClass,
    currency: options?.currency,
    stops: options?.stops,
  });
}
