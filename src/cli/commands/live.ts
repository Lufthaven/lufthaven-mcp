import { getLiveAircraft } from "../../api/luftdata.js";
import { searchAirports } from "../../api/luftdata.js";
import { bold, dim, cyan } from "../format.js";

export async function runLive(args: string[], json: boolean): Promise<void> {
  let lat: number, lon: number, radius = 25;

  // Check for --airport shorthand
  const airportIdx = args.indexOf("--airport");
  if (airportIdx !== -1 && args[airportIdx + 1]) {
    const airports = await searchAirports(args[airportIdx + 1], 1);
    if (airports.length === 0) { console.error(`Airport not found: ${args[airportIdx + 1]}`); process.exit(1); }
    lat = airports[0].lat; lon = airports[0].lon;
  } else {
    const latIdx = args.indexOf("--lat");
    const lonIdx = args.indexOf("--lon");
    if (latIdx === -1 || lonIdx === -1) {
      console.error("Usage: lufthaven live --lat <lat> --lon <lon> [--radius <nm>]");
      console.error("       lufthaven live --airport <code>");
      process.exit(1);
    }
    lat = parseFloat(args[latIdx + 1]); lon = parseFloat(args[lonIdx + 1]);
  }

  const radiusIdx = args.indexOf("--radius");
  if (radiusIdx !== -1) radius = parseInt(args[radiusIdx + 1], 10);

  const aircraft = await getLiveAircraft(lat, lon, radius);

  if (json) { console.log(JSON.stringify(aircraft, null, 2)); return; }

  console.log(`${bold(`${aircraft.length} aircraft`)} within ${radius}NM of ${lat.toFixed(2)}, ${lon.toFixed(2)}`);
  console.log();

  for (const ac of aircraft.slice(0, 20)) {
    const cs = ac.callsign ? bold(ac.callsign.padEnd(8)) : dim("--------");
    const alt = ac.altitude_baro !== null ? `${ac.altitude_baro}ft` : dim("GND");
    const spd = ac.ground_speed !== null ? `${Math.round(ac.ground_speed)}kts` : "";
    console.log(`  ${cs} ${cyan(ac.hex)}  ${alt.padStart(8)}  ${spd.padStart(7)}  ${ac.type_code ?? ""}`);
  }
  if (aircraft.length > 20) console.log(dim(`  ... and ${aircraft.length - 20} more`));
}
