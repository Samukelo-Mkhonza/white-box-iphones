// Deliberately not Intl.NumberFormat: en-ZA's thousands separator (comma vs.
// space) differs between Node's and Chromium's bundled ICU data, which
// produces a client/server hydration mismatch. Formatting manually keeps the
// output byte-identical everywhere.
export function formatZAR(cents: number): string {
  const isWhole = cents % 100 === 0;
  const rands = cents / 100;
  const fixed = isWhole ? Math.round(rands).toString() : rands.toFixed(2);
  const [intPart, decimalPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return decimalPart ? `R ${withThousands}.${decimalPart}` : `R ${withThousands}`;
}
