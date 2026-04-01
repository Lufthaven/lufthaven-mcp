import { searchAirports } from "../../api/luftdata.js";
import { bold, dim } from "../format.js";

export async function runAirport(args: string[], json: boolean): Promise<void> {
  const query = args.join(" ");
  if (!query) { console.error("Usage: lufthaven airport <name|code|city>"); process.exit(1); }

  const airports = await searchAirports(query);

  if (json) { console.log(JSON.stringify(airports, null, 2)); return; }

  if (airports.length === 0) { console.log(dim("No airports found.")); return; }

  for (const a of airports) {
    console.log(`${bold(a.iata ?? "---")} / ${a.icao}  ${a.name}`);
    console.log(`  ${dim(a.municipality ?? "")}${a.municipality && a.country ? ", " : ""}${a.country}  ${dim(a.timezone ?? "")}  ${dim(a.type)}`);
    console.log();
  }
}
