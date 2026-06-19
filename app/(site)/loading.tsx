export default function SiteLoading() {
  return (
    <div className="catalog-loading" aria-busy="true" aria-label="Loading catalog">
      <div className="catalog-loading-hero skeleton-block" />
      <div className="catalog-loading-bar skeleton-block" />
      <div className="catalog-loading-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="catalog-loading-card skeleton-block" />
        ))}
      </div>
    </div>
  )
}
