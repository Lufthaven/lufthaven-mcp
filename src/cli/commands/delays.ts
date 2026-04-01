import { getAirportDelays } from "../../api/luftdata.js";
import { bold, dim, red, green, yellow } from "../format.js";

export async function runDelays(args: string[], json: boolean): Promise<void> {
  const raw = args.includes("--raw");
  const filtered = args.filter((a) => a !== "--raw");
  const icao = filtered[0]; // optional
  const data = await getAirportDelays(icao);

  if (json) { console.log(JSON.stringify(data, null, 2)); return; }

  const delays = Array.isArray(data) ? data : [data];
  const active = delays.filter((d) => d.active);

  if (active.length === 0) { console.log(green("No active delays.")); return; }

  console.log(bold(`${active.length} airport${active.length > 1 ? "s" : ""} with active delays`));
  console.log();

  for (const d of active) {
    console.log(`${red(bold(d.airport))}  ${red("DELAYED")}`);
    for (const reason of d.reasons) {
      if (raw) {
        console.log(`  ${dim(reason)}`);
      } else {
        console.log(`  ${yellow("→")} ${parseNotam(reason)}`);
      }
    }
    console.log();
  }

  if (!raw) {
    console.log(dim("Use --raw to see original NOTAM text"));
  }
}

/** Parse a raw NOTAM string into human-readable text */
function parseNotam(notam: string): string {
  // Remove the NOTAM ID prefix (e.g. "!SNA 03/067 SNA")
  const cleaned = notam.replace(/^![A-Z]{3,4}\s+\d{2}\/\d{3}\s+[A-Z]{3,4}\s+/, "");

  // Common NOTAM abbreviation expansions
  const replacements: [RegExp, string][] = [
    [/\bAD\b/g, "aerodrome"],
    [/\bAP\b/g, "airport"],
    [/\bCLSD\b/g, "closed"],
    [/\bDLY\b/g, "daily"],
    [/\bSKED\b/g, "scheduled"],
    [/\bTRANSIENT\b/g, "transient"],
    [/\bGA\b/g, "general aviation"],
    [/\bACFT\b/g, "aircraft"],
    [/\bEXC\b/g, "except"],
    [/\bPPR\b/g, "prior permission required"],
    [/\bNON\b/g, "non"],
    [/\bRWY\b/g, "runway"],
    [/\bTWY\b/g, "taxiway"],
    [/\bOPS\b/g, "operations"],
    [/\bSVC\b/g, "service"],
    [/\bUNAVBL\b/g, "unavailable"],
    [/\bTFR\b/g, "temporary flight restriction"],
    [/\bGDP\b/g, "ground delay program"],
    [/\bGS\b/g, "ground stop"],
    [/\bARR\b/g, "arrival"],
    [/\bDEP\b/g, "departure"],
  ];

  let text = cleaned;
  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  // Parse date ranges like "2603300630-2604041315" → "Mar 30 06:30 – Apr 4 13:15 UTC"
  text = text.replace(/(\d{10})-(\d{10})$/,
    (_, start: string, end: string) => `${formatNotamDate(start)} – ${formatNotamDate(end)} UTC`);

  // Parse time ranges like "0630-1315" → "06:30–13:15"
  text = text.replace(/\b(\d{4})-(\d{4})\b/g,
    (_, a: string, b: string) => `${a.slice(0, 2)}:${a.slice(2)}–${b.slice(0, 2)}:${b.slice(2)}`);

  // Capitalize first letter
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function formatNotamDate(d: string): string {
  if (d.length !== 10) return d;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = parseInt(d.slice(2, 4), 10) - 1;
  const day = d.slice(4, 6);
  const hour = d.slice(6, 8);
  const min = d.slice(8, 10);
  return `${months[month]} ${parseInt(day)} ${hour}:${min}`;
}
