import React, { createContext, useContext } from 'react'
import { cn } from '../../lib/utils'

const TabsCtx = createContext(null)

export const Tabs = ({ value, onValueChange, className, children }) => (
  <TabsCtx.Provider value={{ value, onValueChange }}>
    <div className={className}>{children}</div>
  </TabsCtx.Provider>
)

export const TabsList = ({ className, children }) => (
  <div className={cn('flex gap-1 rounded-sm bg-ink-100 p-1', className)}>{children}</div>
)

export const TabsTrigger = ({ value, children, className }) => {
  const ctx = useContext(TabsCtx)
  const active = ctx.value === value
  return (
    <button
      type="button"
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'flex-1 rounded-sm px-2 py-1.5 text-xs font-medium transition-colors',
        active ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400 hover:text-ink-600',
        className,
      )}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, children, className }) => {
  const ctx = useContext(TabsCtx)
  if (ctx.value !== value) return null
  return <div className={className}>{children}</div>
}
