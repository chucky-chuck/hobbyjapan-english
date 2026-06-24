export const AMAZON_REGIONS = ['US', 'UK', 'CA', 'DE', 'FR', 'IT', 'ES', 'NL'] as const

export type AmazonRegion = (typeof AMAZON_REGIONS)[number]

export type AmazonLink = {
  region: AmazonRegion
  url: string
}

export const AMAZON_REGION_LABELS: Record<AmazonRegion, string> = {
  US: 'United States',
  UK: 'United Kingdom',
  CA: 'Canada',
  DE: 'Germany',
  FR: 'France',
  IT: 'Italy',
  ES: 'Spain',
  NL: 'Netherlands',
}

export function primaryAmazonUrl(
  links?: AmazonLink[],
  fallback?: string,
): string | undefined {
  return links?.find((link) => link.region === 'US')?.url ?? links?.[0]?.url ?? fallback
}

export function resolveAmazonLinks(
  links?: AmazonLink[],
  fallback?: string,
): AmazonLink[] {
  if (links?.length) return links
  if (fallback) return [{ region: 'US', url: fallback }]
  return []
}
