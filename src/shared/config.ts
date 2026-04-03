export const LUFTDATA_API_URL =
  process.env.LUFTDATA_API_URL ?? "https://luftdata-api.admin-e34.workers.dev";

export const GATEWAY_API_URL =
  process.env.GATEWAY_API_URL ?? "https://lufthaven-api.admin-e34.workers.dev";

export const FLIGHT_SEARCH_API_URL =
  process.env.FLIGHT_SEARCH_API_URL ?? "https://search-api.velocity-scale.com";

export const REQUEST_TIMEOUT_MS = 10_000;

export const PACKAGE_VERSION = "0.1.5";
