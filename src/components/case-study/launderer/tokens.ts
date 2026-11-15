// The Launderer page accent (the project's colour on the homepage).
export const ACCENT = "#2E6BFF";

// Colours of the touchscreen kiosk app (kiosk_app_flutter/lib/theme/app_theme.dart), so the
// recreated kiosk looks like the product.
export const K = {
  top: "#0B1C2C",
  bottom: "#1E3A5F",
  surface: "#1E2F47",
  muted: "#A0AEC0",
  green: "#46C987",
  input: "#1A3A4F",
  inactive: "#2A4A5F",
  fill: "rgba(255,255,255,0.05)",
  stroke: "rgba(255,255,255,0.10)",
};

/** Cents to a dollar string. Money is in minor units everywhere in the product. */
export const usd = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
