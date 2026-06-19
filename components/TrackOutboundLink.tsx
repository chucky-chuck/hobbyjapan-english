'use client'

import { track } from '@vercel/analytics'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

type TrackOutboundLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string
  eventData?: Record<string, string | number | boolean | null>
  children: ReactNode
}

export function TrackOutboundLink({
  event,
  eventData,
  onClick,
  children,
  ...props
}: TrackOutboundLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, eventData)
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
