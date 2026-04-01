import { getTsaWaitTimes } from "../../api/gateway.js";
import { bold, dim, green, yellow, red } from "../format.js";

export async function runTsa(args: string[], json: boolean): Promise<void> {
  const airport = args[0];
  if (!airport) { console.error("Usage: lufthaven tsa <airport_code>"); process.exit(1); }

  const waits = await getTsaWaitTimes(airport.toUpperCase());

  if (json) { console.log(JSON.stringify(waits, null, 2)); return; }

  if (waits.length === 0) { console.log(dim("No TSA wait data available.")); return; }

  console.log(bold(`TSA Wait Times — ${airport.toUpperCase()}`));
  console.log();
  for (const w of waits) {
    const mins = w.wait_minutes;
    const color = mins === null ? dim : mins <= 15 ? green : mins <= 30 ? yellow : red;
    const waitStr = mins !== null ? `${mins} min` : "N/A";
    console.log(`  ${w.checkpoint.padEnd(30)} ${color(waitStr)}`);
  }
}
