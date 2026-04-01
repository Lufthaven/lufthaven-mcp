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
    const airline = d.airline ?? "";
    const stops = d.stops !== null ? (d.stops === 0 ? "nonstop" : `${d.stops} stop${d.stops > 1 ? "s" : ""}`) : "";
    console.log(`  ${price.padEnd(12)} ${bold(route)}  ${dim(airline)}  ${dim(stops)}`);
    if (d.departure_date) console.log(`  ${"".padEnd(12)} ${dim(d.departure_date)}${d.return_date ? ` → ${d.return_date}` : ""}`);
  }
}
