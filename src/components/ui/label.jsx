import React from 'react'
import { cn } from '../../lib/utils'

export const Label = ({ className, ...props }) => (
  <label className={cn('text-xs font-medium text-ink-600', className)} {...props} />
)
