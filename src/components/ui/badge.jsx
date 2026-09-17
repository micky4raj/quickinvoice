import React from 'react'
import { cn } from '../../lib/utils'

export const Badge = ({ className, variant = 'default', ...props }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium',
      variant === 'gold' && 'bg-gold-50 text-gold-600',
      variant === 'default' && 'bg-ink-100 text-ink-600',
      className,
    )}
    {...props}
  />
)
