import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { uid } from '../lib/utils'
import { formatMoney } from '../lib/currency'

export default function ItemsTable({ items, onChange, currency }) {
  function updateRow(id, patch) {
    onChange(items.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  function addRow() {
    onChange([...items, { id: uid(), description: '', qty: 1, rate: 0 }])
  }

  function removeRow(id) {
    if (items.length === 1) return
    onChange(items.filter((row) => row.id !== id))
  }

  return (
    <div>
      <div className="grid grid-cols-[1fr_60px_90px_100px_32px] gap-2 px-1 pb-1 text-[11px] font-medium text-ink-400">
        <span>Description</span>
        <span>Qty</span>
        <span>Rate</span>
        <span className="text-right">Amount</span>
        <span />
      </div>
      <div className="space-y-2">
        {items.map((row, index) => (
          <div key={row.id} className="grid grid-cols-[1fr_60px_90px_100px_32px] items-center gap-2">
            <Input
              placeholder="Item or service"
              aria-label={`Line ${index + 1} description`}
              value={row.description}
              onChange={(e) => updateRow(row.id, { description: e.target.value })}
            />
            <Input
              type="number"
              min="0"
              aria-label={`Line ${index + 1} quantity`}
              value={row.qty}
              onChange={(e) => updateRow(row.id, { qty: parseFloat(e.target.value) || 0 })}
            />
            <Input
              type="number"
              min="0"
              aria-label={`Line ${index + 1} rate`}
              value={row.rate}
              onChange={(e) => updateRow(row.id, { rate: parseFloat(e.target.value) || 0 })}
            />
            <div className="text-right text-sm text-ink-600">
              {formatMoney(row.qty * row.rate, currency)}
            </div>
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="flex h-8 w-8 items-center justify-center text-ink-400 hover:text-red-600 disabled:opacity-30"
              disabled={items.length === 1}
              aria-label={`Remove line ${index + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="mt-3" onClick={addRow}>
        <Plus className="h-3.5 w-3.5" /> Add line
      </Button>
    </div>
  )
}
