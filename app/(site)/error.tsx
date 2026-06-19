'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="status-page">
      <h1 className="status-page-title">Something went wrong</h1>
      <p className="status-page-lead">
        We could not load the catalog right now. This is usually temporary — please try again.
      </p>
      <div className="status-page-actions">
        <button type="button" onClick={reset} className="status-page-button status-page-button-primary">
          Try again
        </button>
        <Link href="/" className="status-page-button status-page-button-secondary">
          Back to All Publications
        </Link>
      </div>
    </div>
  )
}
