import React, { useState } from 'react'
import { Lock, Download, Send } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { THEMES } from '../lib/themes'

export default function ThemeExportPanel({ theme, onThemeChange, isPremium, onUpgrade, onExportPDF, onSendWhatsApp, exporting, exportError }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-ink-900">Theme</p>
          {!isPremium && <Badge variant="gold">5 premium themes</Badge>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(THEMES).map(([key, t]) => {
            const locked = t.premium && !isPremium
            return (
              <button
                key={key}
                type="button"
                onClick={() => (locked ? onUpgrade() : onThemeChange(key))}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 rounded-sm border p-2 text-[11px]',
                  theme === key ? 'border-ink-900' : 'border-ink-100',
                )}
              >
                <span
                  className="h-6 w-full rounded-sm"
                  style={{ background: t.accent, opacity: locked ? 0.35 : 1 }}
                />
                <span className={cn('text-ink-600', locked && 'text-ink-400')}>{t.label}</span>
                {locked && <Lock className="absolute right-1.5 top-1.5 h-3 w-3 text-ink-400" />}
              </button>
            )
          })}
        </div>
      </div>

      {!isPremium && (
        <div data-testid="watermark-upsell-banner" className="rounded-sm border border-dashed border-gold-400 bg-gold-50 p-3">
          <p className="text-xs text-ink-900">Your PDFs currently include a "Made with QuickInvoice" watermark.</p>
          <Button variant="gold" size="sm" className="mt-2" onClick={onUpgrade}>
            Remove watermark — $3/mo
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={onExportPDF} disabled={exporting}>
          <Download className="h-4 w-4" /> {exporting ? 'Generating PDF…' : 'Download PDF'}
        </Button>
        {exportError && (
          <p role="alert" className="text-[11px] text-red-600">
            {exportError}
          </p>
        )}
        <Button variant="outline" onClick={onSendWhatsApp}>
          <Send className="h-4 w-4" /> Send via WhatsApp
        </Button>
      </div>
    </div>
  )
}
