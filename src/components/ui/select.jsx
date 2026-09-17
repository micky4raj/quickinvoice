import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Select = ({ className, children, ...props }) => (
  <div className="relative">
    <select
      className={cn(
        'h-9 w-full appearance-none rounded-sm border border-ink-200 bg-white px-3 pr-8 text-sm focus-visible:ring-1 focus-visible:ring-gold-400',
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
  </div>
)
