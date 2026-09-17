import React from 'react'

// Local data can drift out of sync with the app's expected shape (an older
// version's saved invoice, a hand-edited localStorage value, a corrupted
// upload). useInvoice.js defends against the common cases, but this is the
// last line of defense: if something still throws during render, show a
// recovery screen instead of a permanent white screen.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('QuickInvoice crashed:', error, info)
  }

  handleResetData = () => {
    try {
      localStorage.clear()
    } catch {
      // ignore — we're already in a recovery path
    }
    window.location.reload()
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 p-6">
        <div className="w-full max-w-sm rounded-md bg-white p-6 text-center shadow-paper">
          <p className="font-serif text-lg font-semibold text-ink-900">Something went wrong</p>
          <p className="mt-2 text-sm text-ink-400">
            QuickInvoice hit an unexpected error. Reloading usually fixes it. If it keeps happening, the saved
            invoice data in this browser may be the cause — you can reset it below (this clears everything
            QuickInvoice has stored in this browser).
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={this.handleReload}
              className="h-9 rounded-sm bg-ink-900 text-sm font-medium text-paper hover:bg-ink-800"
            >
              Reload
            </button>
            <button
              onClick={this.handleResetData}
              className="h-9 rounded-sm border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Reset saved data and reload
            </button>
          </div>
        </div>
      </div>
    )
  }
}
