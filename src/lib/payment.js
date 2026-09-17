// Picks the payment target to encode as a QR code, in priority order.
// UPI IDs are expanded into the standard `upi://pay` deep link so scanning
// with any UPI app opens a pre-filled payment screen.
export function resolvePaymentTarget(payment, opts = {}) {
  const { payeeName, amount, note } = opts
  if (payment.upiId) {
    const params = new URLSearchParams({ pa: payment.upiId })
    if (payeeName) params.set('pn', payeeName)
    if (amount) params.set('am', String(amount))
    if (note) params.set('tn', note)
    return `upi://pay?${params.toString()}`
  }
  if (payment.razorpayLink) return payment.razorpayLink
  if (payment.stripeLink) return payment.stripeLink
  if (payment.paypalHandle) {
    return payment.paypalHandle.startsWith('http')
      ? payment.paypalHandle
      : `https://${payment.paypalHandle.replace(/^\/+/, '')}`
  }
  return ''
}
