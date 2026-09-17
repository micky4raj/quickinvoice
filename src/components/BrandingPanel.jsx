import React, { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { resizeImageFile } from '../lib/image'

export default function BrandingPanel({ business, onChange }) {
  const fileRef = useRef(null)
  const [logoError, setLogoError] = useState('')

  async function handleLogo(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return
    setLogoError('')
    try {
      const dataUrl = await resizeImageFile(file)
      onChange({ logoDataUrl: dataUrl })
    } catch (err) {
      setLogoError(err.message || 'Could not use that image.')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Label id="logo-label">Logo</Label>
        <div className="mt-1.5 flex items-center gap-3">
          {business.logoDataUrl ? (
            <div className="relative">
              <img src={business.logoDataUrl} alt="Business logo" className="h-14 w-14 rounded-sm border border-ink-200 object-contain bg-white" />
              <button
                onClick={() => onChange({ logoDataUrl: '' })}
                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink-900 text-white"
                aria-label="Remove logo"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-dashed border-ink-200 text-ink-400">
              <Upload className="h-4 w-4" />
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            aria-labelledby="logo-label"
            onChange={handleLogo}
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={() => fileRef.current.click()}>
            Upload logo
          </Button>
        </div>
        {logoError && (
          <p role="alert" className="mt-1.5 text-[11px] text-red-600">
            {logoError}
          </p>
        )}
        <p className="mt-1.5 text-[11px] text-ink-400">Automatically resized to keep things fast — large photos work fine.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label htmlFor="bizName">Business name</Label>
          <Input id="bizName" value={business.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Acme Studio" />
        </div>
        <div>
          <Label htmlFor="bizEmail">Email</Label>
          <Input id="bizEmail" type="email" value={business.email} onChange={(e) => onChange({ email: e.target.value })} placeholder="hello@acme.co" />
        </div>
        <div>
          <Label htmlFor="bizPhone">Phone</Label>
          <Input id="bizPhone" value={business.phone} onChange={(e) => onChange({ phone: e.target.value })} placeholder="+91 98765 43210" />
        </div>
        <div className="col-span-2">
          <Label htmlFor="bizAddress">Address</Label>
          <Textarea id="bizAddress" rows={2} value={business.address} onChange={(e) => onChange({ address: e.target.value })} placeholder="Street, city, postal code" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-ink-900">Banking details</p>
        <p className="mb-2 text-[11px] text-ink-400">Printed on the invoice for wire/bank transfers. Stored only in this browser.</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="bankAccountName">Account holder name</Label>
            <Input
              id="bankAccountName"
              value={business.bank.accountName}
              onChange={(e) => onChange({ bank: { ...business.bank, accountName: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="bankName">Bank name</Label>
            <Input
              id="bankName"
              value={business.bank.bankName}
              onChange={(e) => onChange({ bank: { ...business.bank, bankName: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="bankAccountNumber">Account number</Label>
            <Input
              id="bankAccountNumber"
              value={business.bank.accountNumber}
              onChange={(e) => onChange({ bank: { ...business.bank, accountNumber: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="bankIfsc">IFSC / SWIFT</Label>
            <Input
              id="bankIfsc"
              value={business.bank.ifsc}
              onChange={(e) => onChange({ bank: { ...business.bank, ifsc: e.target.value } })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
