import React, { forwardRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { THEMES } from '../lib/themes'
import { calcTotals } from '../lib/totals'
import { formatMoney, convert } from '../lib/currency'
import { resolvePaymentTarget } from '../lib/payment'

const InvoicePreview = forwardRef(function InvoicePreview({ invoice, isPremium }, ref) {
  // Enforce the paywall at render time, not just at selection time: if a
  // premium theme was chosen while subscribed and the subscription later
  // lapses (or invoice.theme was set some other way), fall back to the free
  // theme rather than continuing to render a premium look for free.
  const selected = THEMES[invoice.theme]
  const theme = selected && (!selected.premium || isPremium) ? selected : THEMES.classic
  const { subtotal, discountAmount, taxAmount, grandTotal } = calcTotals(invoice)
  const qrTarget = resolvePaymentTarget(invoice.payment, {
    payeeName: invoice.business.name,
    amount: grandTotal.toFixed(2),
    note: invoice.meta.invoiceNumber,
  })

  const convertedTotal = invoice.showConversion
    ? convert(grandTotal, invoice.currency, invoice.secondaryCurrency, parseFloat(invoice.exchangeRate) || null)
    : null

  return (
    <div
      ref={ref}
      className="invoice-sheet relative mx-auto overflow-hidden font-sans"
      style={{ background: theme.paper, color: theme.ink }}
    >
      {!isPremium && (
        <div
          data-testid="pdf-watermark"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <span
            className="select-none whitespace-nowrap text-6xl font-bold"
            style={{ color: theme.ink, opacity: 0.06, transform: 'rotate(-28deg)' }}
          >
            Made with QuickInvoice
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-8 p-12">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-6" style={{ borderColor: theme.accent }}>
          <div className="flex items-start gap-4">
            {invoice.business.logoDataUrl && (
              <img src={invoice.business.logoDataUrl} alt="" className="h-14 w-14 object-contain" />
            )}
            <div>
              <p className="font-serif text-xl font-semibold">{invoice.business.name || 'Your Business Name'}</p>
              <p className="mt-1 whitespace-pre-line text-xs opacity-70">{invoice.business.address}</p>
              <p className="text-xs opacity-70">{[invoice.business.email, invoice.business.phone].filter(Boolean).join(' · ')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-serif text-2xl font-semibold" style={{ color: theme.accent }}>
              INVOICE
            </p>
            <p className="mt-1 text-xs opacity-70">{invoice.meta.invoiceNumber}</p>
            <p className="text-xs opacity-70">Date: {invoice.meta.date || '—'}</p>
            {invoice.meta.dueDate && <p className="text-xs opacity-70">Due: {invoice.meta.dueDate}</p>}
          </div>
        </div>

        {/* Bill to */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide opacity-50">Bill to</p>
          <p className="mt-1 text-sm font-medium">{invoice.client.name || 'Client name'}</p>
          <p className="whitespace-pre-line text-xs opacity-70">{invoice.client.address}</p>
          <p className="text-xs opacity-70">{[invoice.client.email, invoice.client.phone].filter(Boolean).join(' · ')}</p>
        </div>

        {/* Items */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-[10px] uppercase tracking-wide opacity-50" style={{ borderColor: theme.accent }}>
              <th className="py-2 font-medium">Description</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Rate</th>
              <th className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((row) => (
              <tr key={row.id} className="border-b border-black/5">
                <td className="py-2 pr-2">{row.description || '—'}</td>
                <td className="py-2 text-right">{row.qty}</td>
                <td className="py-2 text-right">{formatMoney(row.rate, invoice.currency)}</td>
                <td className="py-2 text-right">{formatMoney(row.qty * row.rate, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-1.5 text-sm">
            <div className="flex justify-between opacity-70">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal, invoice.currency)}</span>
            </div>
            {invoice.discountPercent > 0 && (
              <div className="flex justify-between opacity-70">
                <span>Discount ({invoice.discountPercent}%)</span>
                <span>-{formatMoney(discountAmount, invoice.currency)}</span>
              </div>
            )}
            {invoice.taxPercent > 0 && (
              <div className="flex justify-between opacity-70">
                <span>Tax ({invoice.taxPercent}%)</span>
                <span>{formatMoney(taxAmount, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-1.5 text-base font-semibold" style={{ borderColor: theme.accent }}>
              <span>Total</span>
              <span>{formatMoney(grandTotal, invoice.currency)}</span>
            </div>
            {invoice.showConversion && convertedTotal != null && (
              <div className="flex justify-between text-xs opacity-60">
                <span>≈ in {invoice.secondaryCurrency}</span>
                <span>{formatMoney(convertedTotal, invoice.secondaryCurrency)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment + bank + QR */}
        <div className="flex items-end justify-between border-t pt-6" style={{ borderColor: theme.accent }}>
          <div className="text-xs opacity-70">
            {invoice.business.bank.accountName && (
              <>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-50">Bank details</p>
                <p>{invoice.business.bank.accountName}</p>
                <p>{invoice.business.bank.bankName}</p>
                <p>
                  {invoice.business.bank.accountNumber}
                  {invoice.business.bank.ifsc ? ` · ${invoice.business.bank.ifsc}` : ''}
                </p>
              </>
            )}
            {invoice.notes && <p className="mt-3 max-w-xs whitespace-pre-line">{invoice.notes}</p>}
          </div>
          {qrTarget && (
            <div className="flex flex-col items-center gap-1">
              <QRCodeSVG value={qrTarget} size={72} />
              <span className="text-[9px] opacity-50">Scan to pay</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default InvoicePreview
