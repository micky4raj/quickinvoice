import React from 'react'
import { cn } from '../../lib/utils'

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-9 w-full rounded-sm border border-ink-200 bg-white px-3 text-sm placeholder:text-ink-400 focus-visible:ring-1 focus-visible:ring-gold-400',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'
