import React from 'react'
import { cn } from '../../lib/utils'

export const Switch = ({ checked, onCheckedChange, className, ...props }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
      checked ? 'bg-gold-400' : 'bg-ink-200',
      className,
    )}
    {...props}
  >
    <span
      className={cn(
        'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
        checked ? 'translate-x-4' : 'translate-x-0.5',
      )}
    />
  </button>
)
