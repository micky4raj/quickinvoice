import React from 'react'
import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-ink-900 text-paper hover:bg-ink-800',
  gold: 'bg-gold-400 text-ink-900 hover:bg-gold-600',
  outline: 'border border-ink-200 bg-transparent hover:bg-ink-50',
  ghost: 'bg-transparent hover:bg-ink-50',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes = {
  default: 'h-9 px-4 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-11 px-6 text-sm',
  icon: 'h-9 w-9',
}

export const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
