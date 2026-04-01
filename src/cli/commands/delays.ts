import { getAirportDelays } from "../../api/luftdata.js";
import { bold, dim, red, green } from "../format.js";

export async function runDelays(args: string[], json: boolean): Promise<void> {
  const icao = args[0]; // optional
  const data = await getAirportDelays(icao);

  if (json) { console.log(JSON.stringify(data, null, 2)); return; }

  const delays = Array.isArray(data) ? data : [data];

  if (delays.length === 0) { console.log(green("No active delays.")); return; }

  for (const d of delays) {
    const status = d.active ? red("DELAYED") : green("OK");
    console.log(`${bold(d.airport)}  ${status}`);
    if (d.reasons.length > 0) {
      for (const reason of d.reasons) {
        console.log(`  ${dim("-")} ${reason}`);
      }
    }
  }
}
