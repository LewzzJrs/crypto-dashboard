export function formatPrice(value: number | null, currency = "usd") {
  if(value === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(value);
}

export function formatPercent(value: number | null) {
  if(value === null) return "-";
  return value.toFixed(2) + "%"
}