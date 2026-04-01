const isTTY = process.stdout.isTTY && !process.env.NO_COLOR;

const c = (code: number) => (text: string) => isTTY ? `\x1b[${code}m${text}\x1b[0m` : text;

export const bold = c(1);
export const dim = c(2);
export const green = c(32);
export const red = c(31);
export const yellow = c(33);
export const blue = c(34);
export const cyan = c(36);
export const magenta = c(35);

export function statusColor(status: string | null): (text: string) => string {
  switch (status) {
    case "landed": return green;
    case "en_route": case "departed": return cyan;
    case "delayed": return red;
    case "cancelled": return red;
    case "scheduled": return yellow;
    default: return dim;
  }
}

export function flightRulesColor(rules: string | null): (text: string) => string {
  switch (rules) {
    case "VFR": return green;
    case "MVFR": return blue;
    case "IFR": return red;
    case "LIFR": return magenta;
    default: return dim;
  }
}

export function formatTime(iso: string | null): string {
  if (!iso) return dim("--:--");
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short" });
}

export function padRight(text: string, width: number): string {
  // Strip ANSI codes for length calculation
  const plain = text.replace(/\x1b\[[0-9;]*m/g, "");
  const padding = Math.max(0, width - plain.length);
  return text + " ".repeat(padding);
}
