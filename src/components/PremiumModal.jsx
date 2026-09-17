import React from 'react'
import { Check, Sparkles } from 'lucide-react'
import { Dialog } from './ui/dialog'
import { Button } from './ui/button'

const PERKS = [
  'Remove the "Made with QuickInvoice" watermark',
  'Unlock 5 premium PDF themes',
  'Priority support by email',
]

export default function PremiumModal({ open, onClose, isPremium, onSubscribe, onCancel }) {
  return (
    <Dialog open={open} onClose={onClose} title="QuickInvoice Premium">
      <div className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-ink-900">$3</span>
          <span className="text-sm text-ink-400">/ month</span>
        </div>
        <ul className="space-y-2">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-2 text-sm text-ink-600">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
              {perk}
            </li>
          ))}
        </ul>

        {isPremium ? (
          <div className="rounded-sm bg-gold-50 p-3 text-xs text-gold-600">
            <Sparkles className="mb-1 h-3.5 w-3.5" />
            <p>Premium is active in this browser.</p>
          </div>
        ) : (
          <p className="text-[11px] text-ink-400">
            QuickInvoice has no backend, so this demo activates premium locally rather than charging a real card. A
            production version would route this button to a Stripe Checkout link and unlock premium once Stripe
            confirms the payment via webhook.
          </p>
        )}

        <div className="flex gap-2">
          {isPremium ? (
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancel premium
            </Button>
          ) : (
            <Button variant="gold" className="flex-1" onClick={onSubscribe}>
              Simulate subscribe
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
