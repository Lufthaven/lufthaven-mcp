import { getAirportWeather } from "../../api/luftdata.js";
import { bold, dim, flightRulesColor } from "../format.js";

export async function runWeather(args: string[], json: boolean): Promise<void> {
  const icao = args[0];
  if (!icao) { console.error("Usage: lufthaven weather <ICAO>"); process.exit(1); }

  const w = await getAirportWeather(icao);

  if (json) { console.log(JSON.stringify(w, null, 2)); return; }

  const frc = flightRulesColor(w.flight_rules);
  console.log(`${bold(w.icao)}  ${frc(w.flight_rules ?? "Unknown")}`);
  console.log(`  ${dim("Temp:")}       ${w.temp ?? "?"}C  ${dim("Dewpoint:")} ${w.dewpoint ?? "?"}C`);
  console.log(`  ${dim("Wind:")}       ${w.wind_dir ?? "VRB"}@ ${w.wind_speed ?? "?"}kt${w.wind_gust ? ` G${w.wind_gust}kt` : ""}`);
  console.log(`  ${dim("Visibility:")} ${w.visibility ?? "?"}SM`);
  console.log(`  ${dim("Ceiling:")}    ${w.ceiling ?? "CLR"}ft`);
  if (w.raw) console.log(`  ${dim("Raw:")}        ${w.raw}`);
  if (w.observed_at) console.log(`  ${dim("Observed:")}   ${w.observed_at}`);
}
