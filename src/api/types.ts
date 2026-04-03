/** Standard API envelope */
export type ApiResponse<T> = {
  data: T;
  meta: {
    source: string;
    cached: boolean;
    timestamp: number;
    count?: number;
  };
};

/** Airport data */
export type Airport = {
  icao: string;
  iata: string | null;
  name: string;
  lat: number;
  lon: number;
  elevation_ft: number | null;
  country: string;
  municipality: string | null;
  type: string;
  timezone: string | null;
};

/** Live aircraft from ADS-B */
export type Aircraft = {
  hex: string;
  callsign: string | null;
  registration: string | null;
  type_code: string | null;
  type_desc: string | null;
  lat: number | null;
  lon: number | null;
  altitude_baro: number | null;
  altitude_geo: number | null;
  ground_speed: number | null;
  heading: number | null;
  vertical_rate: number | null;
  squawk: string | null;
  on_ground: boolean;
  last_seen: number;
};

/** Weather conditions */
export type Weather = {
  icao: string;
  temp: number | null;
  dewpoint: number | null;
  wind_dir: number | null;
  wind_speed: number | null;
  wind_gust: number | null;
  visibility: number | null;
  ceiling: number | null;
  flight_rules: string | null;
  raw: string | null;
  observed_at: string | null;
};

/** V2 flight response */
export type V2FlightResponse = {
  flight_code: string;
  legs: V2FlightLeg[];
  active_leg: number;
  total_legs: number;
};

export type V2FlightLeg = {
  flight_number: string;
  flight_code: string;
  callsign: string | null;
  date: string | null;
  status: string | null;
  status_detail: string;
  airline: { code: string | null; icao: string | null; name: string | null };
  departure: AirportInfo;
  arrival: AirportInfo;
  aircraft: { registration: string | null; type_code: string | null; type_name: string | null; icao24: string | null };
  progress: { percent: number; elapsed_minutes: number; remaining_minutes: number } | null;
  live: LivePosition | null;
  trail_available: boolean;
};

export type AirportInfo = {
  airport_code: string | null;
  airport_name: string | null;
  city: string | null;
  timezone: string | null;
  terminal: string | null;
  gate: string | null;
  scheduled: string | null;
  estimated: string | null;
  actual: string | null;
  delay_minutes: number | null;
};

export type LivePosition = {
  latitude: number;
  longitude: number;
  altitude_ft: number | null;
  ground_speed_kts: number | null;
  heading: number | null;
  vertical_rate_fpm: number | null;
  on_ground: boolean;
  updated_at: string;
};

/** Trail data */
export type TrailPoint = {
  ts: string;
  lat: number;
  lon: number;
  alt: number | null;
  gs: number | null;
  track: number | null;
  on_ground: boolean;
};

export type TrailResponse = {
  flight: string;
  date: string;
  trail: TrailPoint[];
  point_count: number;
};

/** Delay info */
export type DelayInfo = {
  airport: string;
  active: boolean;
  reasons: string[];
};

/** Flight deal */
export type FlightDeal = {
  id: string;
  origin: string;
  destination: string;
  price: number;
  currency: string;
  airlines: string | null;
  departure_date: string | null;
  return_date: string | null;
  trip_length_in_days: number | null;
  number_of_stops_departing: number | null;
  number_of_stops_returning: number | null;
  total_flight_duration: string | null;
  google_flights_url: string | null;
  offer_found_date: string;
  flight_class: number;
};

/** TSA wait time response */
export type TsaResponse = {
  airport: string;
  current: {
    wait_minutes: number;
    precheck_minutes: number | null;
    observed_at: string;
    source: string;
    age_minutes: number;
  };
  checkpoints: Array<{
    name: string;
    wait: number;
    precheck: boolean;
    observed_at: string;
    source: string;
  }>;
  historical: Array<{
    hour_utc: number;
    avg: number;
    p50: number;
    p90: number;
    sample_count: number;
  }>;
  alerts: Array<{
    headline: string;
    summary: string;
    severity: string;
    source_name: string;
  }>;
};

// ─── Flight Search API types ─────────────────────────────────

export type CalendarPrice = {
  departure_date: string;
  return_date: string;
  price: number;
};

export type CalendarResponse = {
  origin: string;
  destination: string;
  trip_length: number;
  class: string;
  currency: string;
  prices: CalendarPrice[];
};

export type FlightEndpoint = {
  airport: string;
  city: string;
  time: string;
};

export type FlightLeg = {
  airline: string;
  airline_code: string;
  flight_number: string;
  aircraft: string;
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  duration: string;
  legroom?: string;
};

export type FlightOffer = {
  price: number;
  total_duration: string;
  stops: number;
  layovers: string[];
  outbound: { legs: FlightLeg[] };
  booking_url?: string;
};

export type SearchResponse = {
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  currency: string;
  price_range?: { low: number; high: number };
  offers: FlightOffer[];
};

export type ReturnFlightOption = {
  total_duration: string;
  stops: number;
  layovers: string[];
  legs: FlightLeg[];
};

export type ReturnsResponse = {
  return_flights: ReturnFlightOption[];
};
