# QuickInvoice

A fast, zero-backend Micro-SaaS invoice builder. Everything — form state, branding,
banking details, PDF rendering — runs in the browser. Nothing is uploaded anywhere.

## Stack

- React + Vite
- Tailwind CSS, with a small set of hand-rolled shadcn-style primitives in `src/components/ui`
- `jspdf` + `html2canvas` for client-side PDF export
- `qrcode.react` for the embedded payment QR code

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Because there's no backend, `npm run build` output (the `dist/` folder) is a static
site — deploy it to Netlify, Vercel, Cloudflare Pages, or GitHub Pages as-is.

There is no `package-lock.json` included. I wasn't able to reach the npm registry
in the sandbox this was built in, so I couldn't generate one honestly — run
`npm install` once yourself to create a real lockfile and commit it, rather than
trust a fabricated one.

## How it works

- **State**: `src/hooks/useInvoice.js` holds the entire invoice as one object and
  persists it to `localStorage` on every change. `useSubscription.js` does the same
  for the premium flag. Loading is defensive: `mergeWithDefaults()` backfills any
  keys missing from a saved invoice (from an older version, or hand-edited data)
  against the current default shape, so a schema change doesn't crash the app.
- **Invoice numbering**: `peekInvoiceNumber()` / `commitInvoiceNumber()` in
  `src/lib/storage.js` are split on purpose. The very first render needs a number
  before it can commit to persisting one, and that read has to happen inside a
  `useState` lazy initializer — which React's StrictMode deliberately invokes
  twice in development. A plain read-and-increment there would burn a number on
  every extra invocation; peeking is side-effect-free, and the increment is
  committed exactly once from a ref-guarded effect.
- **Items & totals**: `src/lib/totals.js` computes subtotal → discount → tax →
  grand total from the line items; the same function is used by the live preview,
  the PDF export, and the WhatsApp message so they never drift apart. Discount and
  tax percentages are clamped to 0–100 in the UI.
- **Currency**: `src/lib/currency.js` formats amounts with `Intl.NumberFormat` and
  converts between INR/USD/EUR using either a built-in indicative rate or a rate
  you type in yourself (there's no live FX feed, by design — no backend to call one from).
- **Payment + QR**: `src/lib/payment.js` picks whichever payment method is filled in
  (UPI → Razorpay link → Stripe link → PayPal), turning a UPI ID into a proper
  `upi://pay` deep link, and encodes it as a QR with `qrcode.react`. The QR renders
  directly inside `InvoicePreview.jsx`, so it's captured in the PDF automatically.
- **Logo uploads**: `src/lib/image.js` downscales any uploaded image to a max
  320px edge on a canvas before it's stored as base64. LocalStorage is capped
  around 5–10MB per origin; an unscaled camera photo used as a "logo" could
  eat most of that on its own and silently break saving.
- **Responsive preview vs. PDF capture**: the on-screen invoice preview is scaled
  to fit its container via `ResponsiveStage.jsx` (a `ResizeObserver` computing an
  exact CSS transform), so it never overflows on a phone. PDF export does **not**
  capture that visible, scaled node — it renders a second, always full-resolution
  copy of the invoice positioned off-screen and captures that instead. Otherwise,
  exporting from a phone would rasterize at the shrunk on-screen size and produce
  a blurry PDF.
- **PDF export**: `src/lib/pdfGenerator.js` rasterizes that off-screen node with
  `html2canvas`, then drops the image into a single A4 page with `jspdf`. Export
  failures are caught and shown to the user instead of failing silently.
- **WhatsApp share**: `src/lib/whatsapp.js` builds a `wa.me` link with the invoice
  summary pre-filled as the message text — no WhatsApp Business API needed.
- **Themes**: `src/lib/themes.js` defines one free theme and five premium ones.
  The paywall is enforced at render time in `InvoicePreview.jsx`, not just at
  selection time — if `isPremium` is ever false, a premium theme choice falls
  back to the free theme, so a lapsed/canceled subscription can't keep a
  premium look indefinitely.
- **Monetization**: `useSubscription.js` is intentionally a local mock — there's no
  server to verify a real charge against. A persistent "Upgrade" / "Premium"
  control in the header always opens the plan modal, so subscribers can get back
  to it to cancel. See the comment in that file for the smallest real setup: a
  Stripe Checkout link plus a tiny serverless function (e.g. a single Cloudflare
  Worker or Vercel Function) that verifies payment via webhook and returns a
  signed token this hook can trust instead of a plain flag.
- **Crash recovery**: `src/components/ErrorBoundary.jsx` wraps the whole app. If
  something still throws after all the defensive loading above, the person sees
  a recovery screen with a reload button and a "reset saved data" escape hatch,
  instead of a permanent white screen.

## Security note

Never paste a Razorpay/Stripe **secret** key into this app — it's a static
client-side site, so anything typed into a field is visible to anyone who opens
dev tools. Use a hosted Payment Link URL (Razorpay Payment Links, Stripe Payment
Links) or a UPI ID/PayPal handle instead, which is what the Payment panel expects.

## How this was tested

The sandbox this was built in had no network access, so `npm install` against the
real registry wasn't possible. Rather than skip testing, I:

1. Bundled the actual `src/` with esbuild.
2. Wrote minimal local stand-ins for the three packages that couldn't be
   installed (`jspdf`, `html2canvas`, `qrcode.react`) plus a couple of tiny
   utility packages (`lucide-react`, `clsx`, `tailwind-merge`), matching each
   library's real, documented API surface. These are **not** included in this
   project — they only existed in the throwaway test harness.
3. Used the real React/React-DOM and a real headless Chromium (via Playwright)
   to load the bundle and click through every flow: adding/removing line items,
   discount/tax math, currency conversion, the UPI QR deep link, tab navigation,
   theme locking/unlocking, PDF export, the WhatsApp link, localStorage
   persistence across reload, malformed-data recovery, and the Escape-key/backdrop
   behavior of the premium modal.

That process caught several real bugs before they reached you (StrictMode
double-invoking the invoice counter, the premium-theme paywall bypass after
canceling, the mobile PDF-resolution issue, and the "no way to manage a
subscription once you have one" dead end) — all fixed in the current code.

What this **couldn't** verify: the exact runtime behavior of the real npm
versions of `jspdf`/`html2canvas`/`qrcode.react` (their public APIs are stable
and small, so risk here is low, but it's not the same as having run the real
packages), and anything dependent on Tailwind's actual compiled CSS output
(the test harness stripped CSS entirely to keep the offline bundle simple, so
purely visual/layout regressions in real Tailwind output wouldn't show up here).
Run `npm run build && npm run preview` yourself as a first check before deploying.

## Known limitations / production checklist

- **No live FX rate feed** — conversions use a hardcoded indicative table unless
  you enter a custom rate. Needs a backend or a client-safe third-party API.
- **No real payment verification** — `useSubscription.js` is a LocalStorage flag.
  Wire up Stripe Checkout + a webhook-verifying serverless function before
  charging real money.
- **No lockfile** — run `npm install` once and commit the generated
  `package-lock.json`.
- **Single A4 page** — very long item lists scale down to fit one page rather
  than paginating. Fine for typical invoices; add pagination if you expect
  50+ line items.
- **No automated test suite ships with the repo** — the Playwright suite used
  during development lived in a throwaway harness (it depended on stub
  packages, not the real ones) and wasn't included here to avoid shipping
  fake dependencies. Worth setting up a real Playwright/Vitest suite against
  the actual installed packages before you rely on this in production.

## Extending

- Multi-page PDFs for long item lists.
- Swap the local premium flag for a real Stripe Checkout + webhook.
- Add a live FX rate lookup (needs a backend or a third-party client-safe API,
  since browsers can't call most FX providers directly due to CORS/key exposure).
