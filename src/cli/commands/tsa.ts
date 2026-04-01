import { getTsaWaitTimes } from "../../api/gateway.js";
import { bold, dim, green, yellow, red } from "../format.js";

export async function runTsa(args: string[], json: boolean): Promise<void> {
  const airport = args[0];
  if (!airport) { console.error("Usage: lufthaven tsa <airport_code>"); process.exit(1); }

  const data = await getTsaWaitTimes(airport.toUpperCase());

  if (json) { console.log(JSON.stringify(data, null, 2)); return; }

  const cur = data.current;
  const waitColor = cur.wait_minutes <= 5 ? green : cur.wait_minutes <= 15 ? yellow : red;

  console.log(bold(`TSA — ${data.airport}`));
  console.log(`  ${dim("Current wait:")}  ${waitColor(`${cur.wait_minutes} min`)}`);
  if (cur.precheck_minutes !== null) {
    console.log(`  ${dim("PreCheck:")}      ${green(`${cur.precheck_minutes} min`)}`);
  }
  console.log(`  ${dim("Updated:")}       ${cur.age_minutes}m ago`);
  console.log();

  if (data.checkpoints.length > 0) {
    console.log(dim("  Checkpoints:"));
    for (const cp of data.checkpoints) {
      const c = cp.wait <= 5 ? green : cp.wait <= 15 ? yellow : red;
      const pre = cp.precheck ? dim(" (PreCheck)") : "";
      console.log(`    ${cp.name.padEnd(28)} ${c(`${cp.wait} min`)}${pre}`);
    }
    console.log();
  }

  if (data.alerts.length > 0) {
    console.log(dim("  Alerts:"));
    for (const a of data.alerts) {
      console.log(`    ${a.severity === "warning" ? yellow(a.summary) : dim(a.summary)}`);
    }
  }
}
