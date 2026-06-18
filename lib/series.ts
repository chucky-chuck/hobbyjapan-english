export const SERIES_COLORS: Record<string, string> = {
  'GUNDAM FORWARD': '#c8a84b',
  'HJ MECHANICS': '#4a90d9',
  'TECHNIQUE GUIDE': '#27ae60',
  'MODELER GUIDE': '#8e44ad',
  'SCALE MODEL': '#e67e22',
  "BEGINNER'S GUIDE": '#16a085',
  'GUNDAM WEAPONS': '#c0392b',
}

export function seriesColor(series: string): string {
  return SERIES_COLORS[series] ?? '#c8a84b'
}
