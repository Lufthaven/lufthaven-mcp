import { REQUEST_TIMEOUT_MS, PACKAGE_VERSION } from "../shared/config.js";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** Detect if running as MCP server (stdio) or CLI */
const CLIENT_TYPE = process.argv[1]?.endsWith("stdio.js") ? "mcp" : "cli";
const USER_AGENT = `lufthaven-${CLIENT_TYPE}/${PACKAGE_VERSION}`;

/** Standard headers for all API requests — enables analytics on the API side */
export const API_HEADERS = {
  Accept: "application/json",
  "User-Agent": USER_AGENT,
  "X-Lufthaven-Client": CLIENT_TYPE,
  "X-Lufthaven-Version": PACKAGE_VERSION,
};

/** Fetch JSON from an API with timeout and error handling */
export async function apiGet<T>(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(path, baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    headers: API_HEADERS,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const body = await res.json() as Record<string, unknown>;

  if (!res.ok) {
    const code = (body.error as string) ?? "API_ERROR";
    const message = (body.message as string) ?? `HTTP ${res.status}`;
    throw new ApiError(code, message, res.status);
  }

  // Unwrap { data, meta } envelope if present
  if ("data" in body) return body.data as T;
  return body as T;
}
