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
