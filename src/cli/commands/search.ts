import { getFlightCalendar, searchFlights, getReturnFlights } from "../../api/search.js";
import { bold, dim, cyan, green } from "../format.js";

export async function runSearch(args: string[], json: boolean): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case "calendar":
      await runCalendar(args.slice(1), json);
      break;
    case "flights":
      await runFlights(args.slice(1), json);
      break;
    case "returns":
      await runReturns(args.slice(1), json);
      break;
    default:
      console.error(`Usage:
  lufthaven search calendar <origin> <destination> [--trip-length 7] [--class economy] [--currency USD]
  lufthaven search flights <origin> <destination> <dep-date> <ret-date> [--sort price] [--airlines BA,UA] [--max-price 2000]
  lufthaven search returns <origin> <destination> <dep-date> <ret-date> --selected <legs>`);
      process.exit(1);
  }
}

async function runCalendar(args: string[], json: boolean): Promise<void> {
  const origin = args[0]?.toUpperCase();
  const destination = args[1]?.toUpperCase();
  if (!origin || !destination) {
    console.error("Usage: lufthaven search calendar <origin> <destination>");
    process.exit(1);
  }

  const tripLength = flagValue(args, "--trip-length");
  const flightClass = flagValue(args, "--class");
  const currency = flagValue(args, "--currency");

  const data = await getFlightCalendar(
    origin, destination,
    tripLength ? parseInt(tripLength) : undefined,
    flightClass, currency,
  );

  if (json) { console.log(JSON.stringify(data, null, 2)); return; }

  console.log(bold(`${origin} → ${destination}`) + dim(` (${data.trip_length} days, ${data.class}, ${data.currency})`));
  console.log();

  const cheapest = [...data.prices].sort((a, b) => a.price - b.price).slice(0, 10);
  console.log(bold("Cheapest 10 dates:"));
  for (const p of cheapest) {
    console.log(`  ${p.departure_date}  ${green(`$${p.price}`)}`);
  }
  console.log(dim(`\n${data.prices.length} total dates available`));
}

async function runFlights(args: string[], json: boolean): Promise<void> {
  const origin = args[0]?.toUpperCase();
  const destination = args[1]?.toUpperCase();
  const depDate = args[2];
  const retDate = args[3];
  if (!origin || !destination || !depDate || !retDate) {
    console.error("Usage: lufthaven search flights <origin> <destination> <dep-date> <ret-date>");
    process.exit(1);
  }

  const data = await searchFlights(origin, destination, depDate, retDate, {
    sort: flagValue(args, "--sort") ,
    airlines: flagValue(args, "--airlines") ,
    excludeAirlines: flagValue(args, "--exclude-airlines") ,
    maxDuration: flagValue(args, "--max-duration") ? parseInt(flagValue(args, "--max-duration")!) : undefined,
    maxLayover: flagValue(args, "--max-layover") ? parseInt(flagValue(args, "--max-layover")!) : undefined,
    maxPrice: flagValue(args, "--max-price") ? parseFloat(flagValue(args, "--max-price")!) : undefined,
    stops: flagValue(args, "--stops") ,
    flightClass: flagValue(args, "--class") ,
    currency: flagValue(args, "--currency") ,
  });

  if (json) { console.log(JSON.stringify(data, null, 2)); return; }

  console.log(bold(`${origin} → ${destination}`) + dim(` ${depDate} → ${retDate}`));
  if (data.price_range) {
    console.log(dim(`Price range: $${data.price_range.low} – $${data.price_range.high}`));
  }
  console.log();

  for (const offer of data.offers.slice(0, 10)) {
    const leg = offer.outbound.legs[0];
    const stops = offer.stops === 0 ? "nonstop" : `${offer.stops} stop${offer.stops > 1 ? "s" : ""}`;
    console.log(`  ${green(`$${offer.price}`)}  ${bold(leg.airline)} ${dim(leg.flight_number)}  ${offer.total_duration}  ${dim(stops)}`);
    console.log(`    ${leg.departure.airport} ${dim(leg.departure.time.slice(11, 16))} → ${leg.arrival.airport} ${dim(leg.arrival.time.slice(11, 16))}`);
  }

  if (data.offers.length > 10) {
    console.log(dim(`\n  ... and ${data.offers.length - 10} more offers`));
  }
}

async function runReturns(args: string[], json: boolean): Promise<void> {
  const origin = args[0]?.toUpperCase();
  const destination = args[1]?.toUpperCase();
  const depDate = args[2];
  const retDate = args[3];
  const selected = flagValue(args, "--selected");
  if (!origin || !destination || !depDate || !retDate || !selected) {
    console.error("Usage: lufthaven search returns <origin> <destination> <dep-date> <ret-date> --selected <legs>");
    process.exit(1);
  }

  const data = await getReturnFlights(origin, destination, depDate, retDate, selected, {
    flightClass: flagValue(args, "--class") ,
    currency: flagValue(args, "--currency") ,
  });

  if (json) { console.log(JSON.stringify(data, null, 2)); return; }

  console.log(bold("Return flights:"));
  for (const rf of data.return_flights) {
    const leg = rf.legs[0];
    const stops = rf.stops === 0 ? "nonstop" : `${rf.stops} stop${rf.stops > 1 ? "s" : ""}`;
    console.log(`  ${bold(leg.airline)} ${dim(leg.flight_number)}  ${rf.total_duration}  ${dim(stops)}`);
    console.log(`    ${leg.departure.airport} ${dim(leg.departure.time.slice(11, 16))} → ${rf.legs[rf.legs.length - 1].arrival.airport} ${dim(rf.legs[rf.legs.length - 1].arrival.time.slice(11, 16))}`);
  }
}

function flagValue(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}
