import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1e1510 60%, #0d0d0d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top gold bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#c8a84b', display: 'flex' }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '0 80px' }}>
          <div style={{
            fontSize: 26, color: '#c8a84b', fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase',
          }}>
            HOBBY JAPAN
          </div>
          <div style={{
            fontSize: 68, color: '#ffffff', fontWeight: 800,
            letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.1,
          }}>
            English Publications
          </div>
          <div style={{
            display: 'flex', gap: 20, marginTop: 8,
          }}>
            {['Gunpla', 'Model Kits', 'Technique Guides', 'Gundam Mechanics'].map((tag) => (
              <div key={tag} style={{
                fontSize: 18, color: '#999',
                border: '1px solid #3a3a3a',
                padding: '6px 16px', borderRadius: 4,
                display: 'flex',
              }}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gold bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: '#c8a84b', display: 'flex' }} />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
