import React, { useRef, useState } from 'react'
import { FileText, RotateCcw } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import BrandingPanel from './BrandingPanel'
import ItemsAndTotalsPanel from './ItemsAndTotalsPanel'
import PaymentPanel from './PaymentPanel'
import ThemeExportPanel from './ThemeExportPanel'
import InvoicePreview from './InvoicePreview'
import ResponsiveStage from './ResponsiveStage'
import PremiumModal from './PremiumModal'
import { useInvoice } from '../hooks/useInvoice'
import { useSubscription } from '../hooks/useSubscription'
import { exportInvoiceToPDF } from '../lib/pdfGenerator'
import { calcTotals } from '../lib/totals'
import { buildWhatsAppLink } from '../lib/whatsapp'
import { resolvePaymentTarget } from '../lib/payment'

const TABS = [
  { key: 'branding', label: 'Branding' },
  { key: 'items', label: 'Items & Totals' },
  { key: 'payment', label: 'Payment & QR' },
  { key: 'export', label: 'Theme & Export' },
]

export default function InvoiceBuilder() {
  const { invoice, update, updateNested, resetForNewInvoice, saveError } = useInvoice()
  const { isPremium, setIsPremium } = useSubscription()
  const [tab, setTab] = useState('branding')
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const sheetRef = useRef(null)

  const { grandTotal } = calcTotals(invoice)

  async function handleExportPDF() {
    if (!sheetRef.current) return
    setExporting(true)
    setExportError('')
    try {
      await exportInvoiceToPDF(sheetRef.current, `${invoice.meta.invoiceNumber || 'invoice'}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
      setExportError('Could not generate the PDF. Try again, or reload the page if it keeps failing.')
    } finally {
      setExporting(false)
    }
  }

  function handleSendWhatsApp() {
    const payLink = resolvePaymentTarget(invoice.payment)
    const link = buildWhatsAppLink({ invoice, grandTotal, payLink, phone: invoice.client.phone })
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[420px_1fr]">
      {/* Form column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-lg font-semibold text-paper">QuickInvoice</p>
            <p className="text-xs text-ink-200">Invoices, generated entirely in your browser.</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              data-testid="premium-nav-button"
              className={isPremium ? 'text-gold-400 hover:bg-white/10' : 'text-ink-200 hover:bg-white/10'}
              onClick={() => setPremiumOpen(true)}
            >
              {isPremium ? 'Premium' : 'Upgrade'}
            </Button>
            <Button variant="ghost" size="sm" className="text-ink-200 hover:bg-white/10" onClick={resetForNewInvoice}>
              <RotateCcw className="h-3.5 w-3.5" /> New
            </Button>
          </div>
        </div>

        {saveError && (
          <div role="alert" className="rounded-sm border border-red-300 bg-red-50 p-3 text-xs text-red-700">
            Your browser couldn't save the latest changes locally (storage may be full or unavailable in this
            browsing mode). Your edits will be lost on reload until this is resolved — try removing the logo image
            or freeing up browser storage.
          </div>
        )}

        <div className="rounded-md bg-white p-4 shadow-paper">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Invoice #</Label>
              <Input value={invoice.meta.invoiceNumber} onChange={(e) => updateNested('meta', { invoiceNumber: e.target.value })} />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={invoice.meta.date} onChange={(e) => updateNested('meta', { date: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Due date</Label>
              <Input type="date" value={invoice.meta.dueDate} onChange={(e) => updateNested('meta', { dueDate: e.target.value })} />
              {invoice.meta.dueDate && invoice.meta.date && invoice.meta.dueDate < invoice.meta.date && (
                <p className="mt-1 text-[11px] text-red-600">Due date is before the invoice date.</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-md bg-white p-4 shadow-paper">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              {TABS.map((t) => (
                <TabsTrigger key={t.key} value={t.key}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="mt-4">
              <TabsContent value="branding">
                <BrandingPanel business={invoice.business} onChange={(patch) => updateNested('business', patch)} />
              </TabsContent>
              <TabsContent value="items">
                <ItemsAndTotalsPanel invoice={invoice} update={update} updateNested={updateNested} />
              </TabsContent>
              <TabsContent value="payment">
                <PaymentPanel payment={invoice.payment} onChange={(patch) => updateNested('payment', patch)} />
              </TabsContent>
              <TabsContent value="export">
                <ThemeExportPanel
                  theme={invoice.theme}
                  onThemeChange={(t) => update({ theme: t })}
                  isPremium={isPremium}
                  onUpgrade={() => setPremiumOpen(true)}
                  onExportPDF={handleExportPDF}
                  onSendWhatsApp={handleSendWhatsApp}
                  exporting={exporting}
                  exportError={exportError}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Preview column */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex w-full max-w-[794px] items-center justify-between text-xs text-ink-200">
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Live preview — this is exactly what exports to PDF
          </span>
          {!isPremium && (
            <button onClick={() => setPremiumOpen(true)} className="underline underline-offset-2 hover:text-gold-400">
              Remove watermark
            </button>
          )}
        </div>
        <div className="w-full max-w-[794px] shadow-paper">
          <ResponsiveStage contentWidth={794}>
            <InvoicePreview invoice={invoice} isPremium={isPremium} />
          </ResponsiveStage>
        </div>
      </div>

      {/* Hidden, always full-resolution twin of the preview, used only for PDF
          capture. The visible preview above is deliberately shrunk to fit
          narrow screens (via ResponsiveStage's CSS transform), and capturing
          straight from that transformed, on-screen node would export a
          blurry, viewport-sized PDF on mobile. Rendering an untransformed
          copy off-screen keeps every export full quality regardless of the
          device it was generated on. */}
      <div
        aria-hidden="true"
        className="pointer-events-none opacity-0"
        style={{ position: 'fixed', left: 0, top: 0, zIndex: -1, transform: 'translateX(-100000px)', width: 794 }}
      >
        <InvoicePreview ref={sheetRef} invoice={invoice} isPremium={isPremium} />
      </div>

      <PremiumModal
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        isPremium={isPremium}
        onSubscribe={() => setIsPremium(true)}
        onCancel={() => setIsPremium(false)}
      />
    </div>
  )
}
