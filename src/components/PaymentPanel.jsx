import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { resolvePaymentTarget } from '../lib/payment'

export default function PaymentPanel({ payment, onChange }) {
  const target = resolvePaymentTarget(payment)

  return (
    <div className="space-y-5">
      <p className="text-[11px] text-ink-400">
        Fill in whichever methods you accept. The first one filled below is embedded as a scannable QR code on the
        invoice, in this priority: UPI → Razorpay link → Stripe link → PayPal.
      </p>

      <div>
        <Label htmlFor="upi">UPI ID</Label>
        <Input id="upi" placeholder="yourname@upi" value={payment.upiId} onChange={(e) => onChange({ upiId: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="razorpay">Razorpay payment link</Label>
        <Input
          id="razorpay"
          placeholder="https://rzp.io/i/..."
          value={payment.razorpayLink}
          onChange={(e) => onChange({ razorpayLink: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="stripe">Stripe payment link</Label>
        <Input
          id="stripe"
          placeholder="https://buy.stripe.com/..."
          value={payment.stripeLink}
          onChange={(e) => onChange({ stripeLink: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="paypal">PayPal.me handle</Label>
        <Input
          id="paypal"
          placeholder="paypal.me/yourname"
          value={payment.paypalHandle}
          onChange={(e) => onChange({ paypalHandle: e.target.value })}
        />
      </div>

      <div className="rounded-sm border border-ink-100 p-3">
        <p className="mb-2 text-xs font-semibold text-ink-900">QR preview</p>
        {target ? (
          <div className="flex items-center gap-3">
            <div className="rounded-sm border border-ink-100 bg-white p-2">
              <QRCodeSVG value={target} size={80} />
            </div>
            <p className="break-all text-[11px] text-ink-400">{target}</p>
          </div>
        ) : (
          <p className="text-[11px] text-ink-400">Add a UPI ID or payment link above to generate a QR code.</p>
        )}
      </div>

      <p className="text-[11px] text-ink-400">
        Note: pasting a live Razorpay/Stripe secret key here would expose it to anyone who opens this page's source —
        use a hosted payment link or button URL instead, never a secret API key, in a browser-only app like this one.
      </p>
    </div>
  )
}
