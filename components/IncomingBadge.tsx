type IncomingBadgeProps = {
  compact?: boolean
}

export function IncomingBadge({ compact = false }: IncomingBadgeProps) {
  return (
    <span className={`badge-incoming${compact ? ' badge-incoming--compact' : ''}`}>
      Incoming
    </span>
  )
}
