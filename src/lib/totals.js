export function calcTotals(invoice) {
  const subtotal = invoice.items.reduce((sum, row) => sum + (row.qty || 0) * (row.rate || 0), 0)
  const discountAmount = subtotal * ((invoice.discountPercent || 0) / 100)
  const taxable = subtotal - discountAmount
  const taxAmount = taxable * ((invoice.taxPercent || 0) / 100)
  const grandTotal = taxable + taxAmount
  return { subtotal, discountAmount, taxAmount, grandTotal }
}
