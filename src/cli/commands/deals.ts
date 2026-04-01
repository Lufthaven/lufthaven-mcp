import { getFlightDeals } from "../../api/gateway.js";
import { bold, dim, green } from "../format.js";

export async function runDeals(args: string[], json: boolean): Promise<void> {
  const origin = args[0];
  if (!origin) { console.error("Usage: lufthaven deals <origin> [--to <dest>] [--max <price>]"); process.exit(1); }

  const toIdx = args.indexOf("--to");
  const maxIdx = args.indexOf("--max");
  const destination = toIdx !== -1 ? args[toIdx + 1] : undefined;
  const maxPrice = maxIdx !== -1 ? parseInt(args[maxIdx + 1], 10) : undefined;

  const deals = await getFlightDeals(origin.toUpperCase(), destination?.toUpperCase(), maxPrice);

  if (json) { console.log(JSON.stringify(deals, null, 2)); return; }

  if (deals.length === 0) { console.log(dim("No deals found.")); return; }

  console.log(bold(`Deals from ${origin.toUpperCase()}`));
  console.log();
  for (const d of deals) {
    const price = green(`$${d.price}`);
    const route = `${d.origin} → ${d.destination}`;
    const airline = d.airlines ?? "";
    const stops = d.number_of_stops_departing !== null
      ? (d.number_of_stops_departing === 0 ? "nonstop" : `${d.number_of_stops_departing} stop${d.number_of_stops_departing > 1 ? "s" : ""}`)
      : "";
    const duration = d.total_flight_duration ?? "";
    console.log(`  ${price.padEnd(12)} ${bold(route)}  ${dim(airline)}  ${dim(stops)}  ${dim(duration)}`);
    if (d.departure_date) {
      const dep = new Date(d.departure_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const ret = d.return_date ? new Date(d.return_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
      console.log(`  ${"".padEnd(12)} ${dim(dep)}${ret ? ` → ${ret}` : ""}${d.trip_length_in_days ? ` (${d.trip_length_in_days}d)` : ""}`);
    }
    if (d.google_flights_url) {
      console.log(`  ${"".padEnd(12)} ${dim(d.google_flights_url)}`);
    }
  }
}
