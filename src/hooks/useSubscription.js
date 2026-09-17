import { useEffect, useState } from 'react'
import { loadJSON, saveJSON, KEYS } from '../lib/storage'

// QuickInvoice has no backend, so there is no server to verify a real
// Stripe/Razorpay subscription against. This flag is a local stand-in:
// wiring it to a real payment provider means adding a small serverless
// function that verifies the payment and returns a signed "premium" token,
// which this hook would then trust instead of a plain LocalStorage flag.
export function useSubscription() {
  const [isPremium, setIsPremium] = useState(() => loadJSON(KEYS.SUBSCRIPTION, false))

  useEffect(() => {
    saveJSON(KEYS.SUBSCRIPTION, isPremium)
  }, [isPremium])

  return { isPremium, setIsPremium }
}
