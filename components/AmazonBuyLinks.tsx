'use client'

import { useState } from 'react'
import { type AmazonLink, AMAZON_REGION_LABELS } from '@/lib/amazon'
import { TrackOutboundLink } from '@/components/TrackOutboundLink'

type AmazonBuyLinksProps = {
  links: AmazonLink[]
  slug: string
  series: string
  location: 'detail' | 'hero'
}

function AmazonIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="#111">
      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.493.124.104.17.08.338-.07.505-.966 1.226-2.174 2.173-3.617 2.847-1.45.67-2.957 1.007-4.525 1.007-3.015 0-5.72-.897-8.116-2.695l-.314-.262c-.18-.15-.214-.29-.114-.42l.19-.385zM12.73 4.15c.065.065.065.13 0 .195-.1.074-.196.048-.284-.08C11.62 3.1 10.44 2.44 9.007 2.1c-.23-.055-.33-.14-.305-.264.024-.123.14-.172.35-.15 1.634.19 2.986.88 4.054 2.07l-.38.393zM5.17 4.15c-.066.065-.066.13 0 .195.1.074.196.048.284-.08C6.28 3.1 7.46 2.44 8.893 2.1c.23-.055.33-.14.305-.264-.024-.123-.14-.172-.35-.15-1.634.19-2.986.88-4.054 2.07l.38.393z" />
    </svg>
  )
}

export function AmazonBuyLinks({ links, slug, series, location }: AmazonBuyLinksProps) {
  const defaultRegion = links.find((link) => link.region === 'US')?.region ?? links[0]?.region
  const [activeRegion, setActiveRegion] = useState(defaultRegion)
  const activeLink = links.find((link) => link.region === activeRegion) ?? links[0]

  if (!activeLink) return null

  const isHero = location === 'hero'
  const buttonStyle = isHero
    ? {
        display: 'inline-flex' as const,
        alignItems: 'center' as const,
        gap: 6,
        background: 'var(--amazon)',
        color: '#111',
        fontWeight: 700,
        fontSize: '0.85rem',
        padding: '10px 18px',
        borderRadius: 3,
      }
    : {
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: 8,
        background: '#ff9900',
        color: '#111',
        fontWeight: 700,
        fontSize: '0.88rem',
        padding: '11px 0',
        borderRadius: 4,
      }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <TrackOutboundLink
        href={activeLink.url}
        target="_blank"
        rel="noopener noreferrer"
        event="Amazon Click"
        eventData={{ slug, series, location, region: activeLink.region }}
        style={buttonStyle}
      >
        <AmazonIcon />
        Buy on Amazon ({activeLink.region})
      </TrackOutboundLink>

      {links.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {links.map((link) => {
            const isActive = link.region === activeLink.region
            return (
              <button
                key={link.region}
                type="button"
                onClick={() => setActiveRegion(link.region)}
                title={AMAZON_REGION_LABELS[link.region]}
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  padding: '4px 8px',
                  borderRadius: 3,
                  border: `1px solid ${isActive ? '#ff9900' : '#555'}`,
                  background: isActive ? 'rgba(255, 153, 0, 0.15)' : 'transparent',
                  color: isActive ? '#ff9900' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {link.region}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
