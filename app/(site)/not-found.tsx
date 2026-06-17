import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      maxWidth: 1100, margin: '80px auto', padding: '0 24px', textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#c8a84b', marginBottom: 8 }}>404</h1>
      <p style={{ fontSize: '1.1rem', color: '#e8e8e8', marginBottom: 8 }}>
        Page not found
      </p>
      <p style={{ fontSize: '0.9rem', color: '#999', marginBottom: 32 }}>
        The publication you are looking for may have moved or no longer exists.
      </p>
      <Link href="/" style={{
        display: 'inline-block', background: '#c8a84b', color: '#111',
        fontWeight: 700, fontSize: '0.85rem', padding: '10px 22px', borderRadius: 3,
      }}>
        Back to All Publications
      </Link>
    </div>
  )
}
