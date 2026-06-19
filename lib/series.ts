export const ALL_SERIES = [
  'GUNDAM FORWARD',
  'HJ MECHANICS',
  'TECHNIQUE GUIDE',
  'MODELER GUIDE',
  'SCALE MODEL',
  "BEGINNER'S GUIDE",
  'GUNDAM WEAPONS',
] as const

export type SeriesName = (typeof ALL_SERIES)[number]

export const SERIES_COLORS: Record<string, string> = {
  'GUNDAM FORWARD': '#c8a84b',
  'HJ MECHANICS': '#4a90d9',
  'TECHNIQUE GUIDE': '#27ae60',
  'MODELER GUIDE': '#8e44ad',
  'SCALE MODEL': '#e67e22',
  "BEGINNER'S GUIDE": '#16a085',
  'GUNDAM WEAPONS': '#c0392b',
}

export const SERIES_DESCRIPTIONS: Record<string, string> = {
  'GUNDAM FORWARD': 'In-depth analyses of Gunpla model kits',
  'HJ MECHANICS': 'Technical breakdowns of mobile suit mechanics and designs',
  'TECHNIQUE GUIDE': 'Step-by-step modeling and painting techniques',
  'MODELER GUIDE': 'Profiles and work showcases of top Japanese modelers',
  'SCALE MODEL': 'Scale modeling guides across a range of genres',
  "BEGINNER'S GUIDE": 'Entry-level guides for new modelers',
  'GUNDAM WEAPONS': 'Weapons and armament reference books',
}

export function seriesColor(series: string): string {
  return SERIES_COLORS[series] ?? '#c8a84b'
}

/** "GUNDAM FORWARD" → "gundam-forward" */
export function seriesSlug(series: string): string {
  return series.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-')
}

export function seriesFromSlug(slug: string): SeriesName | undefined {
  return ALL_SERIES.find((s) => seriesSlug(s) === slug)
}

export function seriesPath(series: string): string {
  return `/series/${seriesSlug(series)}`
}
