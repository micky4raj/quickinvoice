import { useEffect, useRef, useState } from 'react'
import { loadJSON, saveJSON, KEYS, peekInvoiceNumber, commitInvoiceNumber, nextInvoiceNumber } from '../lib/storage'
import { uid } from '../lib/utils'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function blankInvoice(invoiceNumber) {
  return {
    meta: {
      invoiceNumber,
      date: todayISO(),
      dueDate: '',
    },
    business: {
      name: '',
      email: '',
      phone: '',
      address: '',
      logoDataUrl: '',
      bank: { accountName: '', accountNumber: '', ifsc: '', bankName: '' },
    },
    client: { name: '', email: '', phone: '', address: '' },
    items: [{ id: uid(), description: '', qty: 1, rate: 0 }],
    currency: 'INR',
    showConversion: false,
    secondaryCurrency: 'USD',
    exchangeRate: '',
    discountPercent: 0,
    taxPercent: 0,
    payment: { upiId: '', paypalHandle: '', razorpayLink: '', stripeLink: '' },
    theme: 'classic',
    notes: 'Thank you for your business.',
  }
}

// Fills in any keys missing from a saved invoice (e.g. saved by an older
// version of the app, or hand-edited) against a fresh default shape, so a
// schema change never crashes the app on load — it just backfills sane
// defaults for whatever's missing.
function mergeWithDefaults(saved, invoiceNumber) {
  const base = blankInvoice(invoiceNumber)
  if (!saved || typeof saved !== 'object') return base
  return {
    ...base,
    ...saved,
    meta: { ...base.meta, ...(saved.meta || {}) },
    business: {
      ...base.business,
      ...(saved.business || {}),
      bank: { ...base.business.bank, ...(saved.business && saved.business.bank ? saved.business.bank : {}) },
    },
    client: { ...base.client, ...(saved.client || {}) },
    payment: { ...base.payment, ...(saved.payment || {}) },
    items: Array.isArray(saved.items) && saved.items.length > 0 ? saved.items : base.items,
  }
}

export function useInvoice() {
  const existingRaw = useState(() => loadJSON(KEYS.INVOICE, null))[0]
  const [invoice, setInvoice] = useState(() =>
    existingRaw ? mergeWithDefaults(existingRaw, existingRaw?.meta?.invoiceNumber || peekInvoiceNumber()) : blankInvoice(peekInvoiceNumber()),
  )
  const [saveError, setSaveError] = useState(false)
  const numberCommittedRef = useRef(false)

  // Commit the peeked invoice number exactly once. Using a ref guard makes
  // this safe under React StrictMode, which double-invokes effects in
  // development — without the guard the counter would skip an extra number
  // every time a brand-new invoice is first created.
  useEffect(() => {
    if (numberCommittedRef.current) return
    numberCommittedRef.current = true
    if (!existingRaw) commitInvoiceNumber()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const ok = saveJSON(KEYS.INVOICE, invoice)
    setSaveError(!ok)
  }, [invoice])

  function update(patch) {
    setInvoice((prev) => ({ ...prev, ...patch }))
  }

  function updateNested(section, patch) {
    setInvoice((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }))
  }

  function resetForNewInvoice() {
    setInvoice((prev) => ({
      ...blankInvoice(nextInvoiceNumber()),
      business: prev.business,
      payment: prev.payment,
      theme: prev.theme,
      currency: prev.currency,
    }))
  }

  return { invoice, setInvoice, update, updateNested, resetForNewInvoice, saveError }
}
