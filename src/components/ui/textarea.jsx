import React from 'react'
import { cn } from '../../lib/utils'

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex w-full rounded-sm border border-ink-200 bg-white px-3 py-2 text-sm placeholder:text-ink-400 focus-visible:ring-1 focus-visible:ring-gold-400',
      className,
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
