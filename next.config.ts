import type { NextConfig } from 'next'
import path from 'path'
import { ALL_SERIES, seriesPath } from './lib/series'

const legacySeriesRedirects = ALL_SERIES.map((series) => ({
  source: '/',
  has: [{ type: 'query' as const, key: 'series', value: series }],
  destination: seriesPath(series),
  permanent: true,
}))

const config: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'query', key: 'series', value: 'ALL' }],
        destination: '/',
        permanent: true,
      },
      ...legacySeriesRedirects,
    ]
  },
}

export default config
