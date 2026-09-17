import React from 'react'
import { cn } from '../../lib/utils'

export const Card = ({ className, ...props }) => (
  <div className={cn('rounded-md border border-ink-200 bg-white', className)} {...props} />
)

export const CardHeader = ({ className, ...props }) => (
  <div className={cn('flex items-center justify-between border-b border-ink-100 px-4 py-3', className)} {...props} />
)

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn('text-sm font-semibold text-ink-900', className)} {...props} />
)

export const CardContent = ({ className, ...props }) => (
  <div className={cn('p-4', className)} {...props} />
)
