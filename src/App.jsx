import React from 'react'
import InvoiceBuilder from './components/InvoiceBuilder'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  return (
    <div className="min-h-screen bg-ink-900">
      <ErrorBoundary>
        <InvoiceBuilder />
      </ErrorBoundary>
    </div>
  )
}
