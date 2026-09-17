import { formatMoney } from './currency'

// Builds a wa.me deep link with a pre-filled message. No API key or backend
// needed — this opens WhatsApp (app or web) with the text already composed.
export function buildWhatsAppLink({ invoice, grandTotal, payLink, phone }) {
  const lines = [
    `Invoice ${invoice.meta.invoiceNumber} from ${invoice.business.name || 'your vendor'}`,
    `Bill to: ${invoice.client.name || '—'}`,
    `Amount due: ${formatMoney(grandTotal, invoice.currency)}`,
    invoice.meta.dueDate ? `Due date: ${invoice.meta.dueDate}` : null,
    payLink ? `Pay here: ${payLink}` : null,
    'Thank you for your business!',
  ].filter(Boolean)

  const text = encodeURIComponent(lines.join('\n'))
  const digits = (phone || '').replace(/[^\d]/g, '')
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/'
  return `${base}?text=${text}`
}
