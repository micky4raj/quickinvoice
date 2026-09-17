// All persistence is LocalStorage only. There is no server: business details,
// banking info, and payment handles never leave the browser.

const KEYS = {
  INVOICE: 'quickinvoice.invoice.v1',
  BUSINESS: 'quickinvoice.business.v1',
  PAYMENT: 'quickinvoice.payment.v1',
  SUBSCRIPTION: 'quickinvoice.subscription.v1',
  COUNTER: 'quickinvoice.invoiceCounter.v1',
}

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// Returns true on success, false if storage is full or unavailable (e.g. some
// private-browsing modes, or a quota exceeded by a large embedded logo image)
// so callers can surface that to the user instead of silently losing edits.
export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function nextInvoiceNumber() {
  const n = loadJSON(KEYS.COUNTER, 1000)
  saveJSON(KEYS.COUNTER, n + 1)
  return `INV-${n}`
}

// Reads the counter WITHOUT incrementing it — safe to call from a React
// useState lazy initializer, which React's StrictMode intentionally invokes
// twice in development. A read-then-write function like nextInvoiceNumber()
// would burn a number on every extra invocation; peeking is idempotent, and
// the caller commits the increment exactly once from an effect instead.
export function peekInvoiceNumber() {
  const n = loadJSON(KEYS.COUNTER, 1000)
  return `INV-${n}`
}

// Commits (increments) the counter previously observed via peekInvoiceNumber.
export function commitInvoiceNumber() {
  const n = loadJSON(KEYS.COUNTER, 1000)
  saveJSON(KEYS.COUNTER, n + 1)
}

export { KEYS }
