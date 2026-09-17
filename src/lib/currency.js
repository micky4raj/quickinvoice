export const CURRENCIES = {
  INR: { symbol: '₹', label: 'Indian Rupee', locale: 'en-IN' },
  USD: { symbol: '$', label: 'US Dollar', locale: 'en-US' },
  EUR: { symbol: '€', label: 'Euro', locale: 'de-DE' },
}

// Indicative fallback rates (relative to 1 unit of the row currency, in USD).
// These are starting points only — the UI always lets the user override with
// a live/custom rate before it's used in the invoice, since QuickInvoice has
// no backend to fetch a live feed from.
export const DEFAULT_RATES_TO_USD = {
  INR: 0.012,
  USD: 1,
  EUR: 1.08,
}

export function formatMoney(amount, currencyCode) {
  const meta = CURRENCIES[currencyCode] || CURRENCIES.USD
  const safe = Number.isFinite(amount) ? amount : 0
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(safe)
  } catch {
    return `${meta.symbol}${safe.toFixed(2)}`
  }
}

export function convert(amount, fromCode, toCode, customRate) {
  if (fromCode === toCode) return amount
  if (customRate && customRate > 0) return amount * customRate
  const fromUsd = DEFAULT_RATES_TO_USD[fromCode] ?? 1
  const toUsd = DEFAULT_RATES_TO_USD[toCode] ?? 1
  return (amount * fromUsd) / toUsd
}
