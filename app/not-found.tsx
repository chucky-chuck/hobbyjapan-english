import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#1a1a1a', padding: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#c8a84b', marginBottom: 8 }}>404</h1>
        <p style={{ fontSize: '1.1rem', color: '#e8e8e8', marginBottom: 32 }}>
          Page not found
        </p>
        <Link href="/" style={{
          display: 'inline-block', background: '#c8a84b', color: '#111',
          fontWeight: 700, fontSize: '0.85rem', padding: '10px 22px', borderRadius: 3,
        }}>
          Back to All Publications
        </Link>
      </div>
    </div>
  )
}
