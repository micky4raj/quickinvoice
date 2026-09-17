import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select } from './ui/select'
import { Switch } from './ui/switch'
import ItemsTable from './ItemsTable'
import { CURRENCIES } from '../lib/currency'

export default function ItemsAndTotalsPanel({ invoice, update, updateNested }) {
  const { client, items, currency, showConversion, secondaryCurrency, exchangeRate, discountPercent, taxPercent } = invoice

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold text-ink-900">Bill to</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="clientName">Client name</Label>
            <Input id="clientName" value={client.name} onChange={(e) => updateNested('client', { name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="clientEmail">Client email</Label>
            <Input id="clientEmail" type="email" value={client.email} onChange={(e) => updateNested('client', { email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="clientPhone">Client phone (for WhatsApp)</Label>
            <Input id="clientPhone" value={client.phone} onChange={(e) => updateNested('client', { phone: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="clientAddress">Client address</Label>
            <Input id="clientAddress" value={client.address} onChange={(e) => updateNested('client', { address: e.target.value })} />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-ink-900">Line items</p>
        <ItemsTable items={items} currency={currency} onChange={(next) => update({ items: next })} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select id="currency" value={currency} onChange={(e) => update({ currency: e.target.value })}>
            {Object.entries(CURRENCIES).map(([code, meta]) => (
              <option key={code} value={code}>
                {code} — {meta.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="discountPercent">Discount %</Label>
          <Input
            id="discountPercent"
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => update({ discountPercent: clampPercent(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="taxPercent">Tax %</Label>
          <Input
            id="taxPercent"
            type="number"
            min="0"
            max="100"
            value={taxPercent}
            onChange={(e) => update({ taxPercent: clampPercent(e.target.value) })}
          />
        </div>
      </div>

      <div className="rounded-sm border border-ink-100 bg-ink-50/50 p-3">
        <div className="flex items-center justify-between">
          <div id="convertToggleLabel">
            <p className="text-xs font-semibold text-ink-900">Show converted total</p>
            <p className="text-[11px] text-ink-400">Display the grand total in a second currency alongside {currency}</p>
          </div>
          <Switch
            checked={showConversion}
            onCheckedChange={(v) => update({ showConversion: v })}
            aria-labelledby="convertToggleLabel"
          />
        </div>
        {showConversion && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="secondaryCurrency">Convert to</Label>
              <Select id="secondaryCurrency" value={secondaryCurrency} onChange={(e) => update({ secondaryCurrency: e.target.value })}>
                {Object.keys(CURRENCIES)
                  .filter((c) => c !== currency)
                  .map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="exchangeRate">Custom rate (optional)</Label>
              <Input
                id="exchangeRate"
                type="number"
                min="0"
                step="0.0001"
                placeholder="Auto"
                value={exchangeRate}
                onChange={(e) => update({ exchangeRate: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function clampPercent(rawValue) {
  const n = parseFloat(rawValue)
  if (!Number.isFinite(n)) return 0
  return Math.min(100, Math.max(0, n))
}
