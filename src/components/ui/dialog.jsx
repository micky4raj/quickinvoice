import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export const Dialog = ({ open, onClose, title, children }) => {
  const closeButtonRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    // Move focus into the dialog so keyboard/screen-reader users land
    // somewhere sensible, and restore it to whatever triggered the dialog
    // when it closes.
    const previouslyFocused = document.activeElement
    closeButtonRef.current?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      // Minimal focus trap: keep Tab cycling within the dialog panel.
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-md bg-white shadow-paper"
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
          <button ref={closeButtonRef} onClick={onClose} aria-label="Close">
            <X className="h-4 w-4 text-ink-400 hover:text-ink-900" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
