import { z } from "zod";

export const FlightStatusInput = z.object({
  code: z.string().min(3).max(10).regex(/^[A-Za-z0-9]+$/).describe("Flight code in IATA (UA444) or ICAO (UAL444) format"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Date in YYYY-MM-DD format. Defaults to today."),
});

export const AirportSearchInput = z.object({
  query: z.string().min(2).max(100).describe("Search by airport name, city, IATA code, or ICAO code"),
  limit: z.number().int().min(1).max(20).optional().default(8).describe("Max results (default 8)"),
});

export const LiveAircraftInput = z.object({
  latitude: z.number().min(-90).max(90).describe("Center latitude in decimal degrees"),
  longitude: z.number().min(-180).max(180).describe("Center longitude in decimal degrees"),
  radius_nm: z.number().min(1).max(250).optional().default(25).describe("Search radius in nautical miles (default 25, max 250)"),
});

export const AirportWeatherInput = z.object({
  icao_code: z.string().min(2).max(10).regex(/^[A-Za-z0-9]+$/).describe("ICAO airport code (e.g., KJFK, EGLL, LFPG)"),
});

export const AirportDelaysInput = z.object({
  icao_code: z.string().min(2).max(10).regex(/^[A-Za-z0-9]+$/).optional().describe("ICAO airport code. Omit for all active delays."),
});

export const FlightDealsInput = z.object({
  origin: z.string().length(3).describe("Origin airport IATA code (e.g., SFO)"),
  destination: z.string().length(3).optional().describe("Destination airport IATA code"),
  max_price: z.number().positive().optional().describe("Maximum price in USD"),
});

export const TsaWaitTimesInput = z.object({
  airport_code: z.string().min(3).max(4).describe("Airport IATA or ICAO code (e.g., LAX, KLAX)"),
});

export const FlightTrailInput = z.object({
  code: z.string().min(3).max(10).regex(/^[A-Za-z0-9]+$/).describe("Flight code in IATA or ICAO format"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Date in YYYY-MM-DD format"),
  format: z.enum(["points", "geojson"]).optional().default("points").describe("Output format"),
});

// ─── Flight Search API schemas ─────────────────────────────

export const FlightCalendarInput = z.object({
  origin: z.string().length(3).describe("Origin airport IATA code (e.g., JFK)"),
  destination: z.string().length(3).describe("Destination airport IATA code (e.g., LHR)"),
  trip_length: z.number().int().min(1).max(30).optional().default(7).describe("Days between departure and return (default 7)"),
  class: z.enum(["economy", "premium_economy", "business", "first"]).optional().describe("Travel class"),
  currency: z.string().length(3).optional().describe("ISO currency code (e.g., USD, EUR)"),
  stops: z.enum(["any", "nonstop", "1", "2"]).optional().describe("Max stops"),
});

export const FlightSearchInput = z.object({
  origin: z.string().length(3).describe("Origin airport IATA code"),
  destination: z.string().length(3).describe("Destination airport IATA code"),
  departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Departure date (YYYY-MM-DD)"),
  return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Return date (YYYY-MM-DD)"),
  sort: z.enum(["top", "price", "departure", "arrival", "duration", "emissions"]).optional().describe("Sort order"),
  airlines: z.string().optional().describe("Include only these airlines (comma-separated IATA codes or STAR_ALLIANCE, SKYTEAM, ONEWORLD)"),
  exclude_airlines: z.string().optional().describe("Exclude these airlines (comma-separated IATA codes)"),
  max_duration: z.number().int().positive().optional().describe("Max flight duration in minutes"),
  max_layover: z.number().int().positive().optional().describe("Max layover duration in minutes"),
  max_price: z.number().positive().optional().describe("Max ticket price"),
  stops: z.enum(["any", "nonstop", "1", "2"]).optional().describe("Max stops"),
  class: z.enum(["economy", "premium_economy", "business", "first"]).optional().describe("Travel class"),
  currency: z.string().length(3).optional().describe("ISO currency code"),
  trip_type: z.enum(["round_trip", "one_way"]).optional().describe("Trip type"),
  bags: z.enum(["checked", "carry_on"]).optional().describe("Minimum baggage: 'checked' = must include free checked bag, 'carry_on' = carry-on minimum"),
});

export const ReturnFlightsInput = z.object({
  origin: z.string().length(3).describe("Origin airport IATA code"),
  destination: z.string().length(3).describe("Destination airport IATA code"),
  departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Departure date (YYYY-MM-DD)"),
  return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Return date (YYYY-MM-DD)"),
  selected_flights: z.string().describe("Selected outbound legs: dep,date,arr,airline,num (semicolon-separated for multi-leg)"),
  class: z.enum(["economy", "premium_economy", "business", "first"]).optional().describe("Travel class"),
  currency: z.string().length(3).optional().describe("ISO currency code"),
});
