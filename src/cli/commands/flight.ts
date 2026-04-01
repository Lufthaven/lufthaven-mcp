import { getFlightStatus } from "../../api/luftdata.js";
import { bold, dim, statusColor, formatTime, cyan } from "../format.js";

export async function runFlight(args: string[], json: boolean): Promise<void> {
  const code = args[0];
  if (!code) { console.error("Usage: lufthaven flight <code> [--date YYYY-MM-DD]"); process.exit(1); }
  const dateIdx = args.indexOf("--date");
  const date = dateIdx !== -1 ? args[dateIdx + 1] : undefined;

  const data = await getFlightStatus(code, date);

  if (json) { console.log(JSON.stringify(data, null, 2)); return; }

  for (const leg of data.legs) {
    const sc = statusColor(leg.status);
    console.log(`${bold(leg.flight_number)}  ${sc(leg.status_detail)}`);
    console.log(`${dim("Airline:")} ${leg.airline.name ?? leg.airline.code ?? "Unknown"}`);
    console.log();

    const dep = leg.departure;
    const arr = leg.arrival;
    console.log(`  ${bold(dep.airport_code ?? "???")} ${dim(dep.city ?? "")}  ${dim("→")}  ${bold(arr.airport_code ?? "???")} ${dim(arr.city ?? "")}`);
    console.log(`  ${dim("Sched:")}  ${formatTime(dep.scheduled)}  ${dim("→")}  ${formatTime(arr.scheduled)}`);
    if (dep.actual || arr.actual) {
      console.log(`  ${dim("Actual:")} ${formatTime(dep.actual)}  ${dim("→")}  ${formatTime(arr.actual)}`);
    }
    if (dep.gate || dep.terminal) {
      console.log(`  ${dim("Gate:")}   ${dep.terminal ? `T${dep.terminal}` : ""}${dep.gate ? ` ${dep.gate}` : ""}`);
    }

    if (leg.progress) {
      const bar = progressBar(leg.progress.percent, 20);
      console.log(`  ${dim("Progress:")} ${bar} ${leg.progress.percent}% (${leg.progress.remaining_minutes}m remaining)`);
    }

    if (leg.live) {
      console.log(`  ${cyan("LIVE")} ${leg.live.latitude.toFixed(3)}, ${leg.live.longitude.toFixed(3)}  alt=${leg.live.altitude_ft ?? "?"}ft  gs=${leg.live.ground_speed_kts ?? "?"}kts`);
    }
    console.log();
  }
}

function progressBar(pct: number, width: number): string {
  const filled = Math.round((pct / 100) * width);
  return "[" + "=".repeat(filled) + " ".repeat(width - filled) + "]";
}
