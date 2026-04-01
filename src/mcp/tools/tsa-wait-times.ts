import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TsaWaitTimesInput } from "../../shared/schemas.js";
import { getTsaWaitTimes } from "../../api/gateway.js";

export function registerTsaWaitTimes(server: McpServer): void {
  server.tool(
    "tsa_wait_times",
    "Get current TSA security checkpoint wait times for a US airport. Returns estimated wait in minutes per checkpoint. Useful for travel planning.",
    TsaWaitTimesInput.shape,
    async ({ airport_code }) => {
      const data = await getTsaWaitTimes(airport_code);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );
}
