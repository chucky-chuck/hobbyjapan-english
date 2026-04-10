import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header style={{ background: '#111', borderBottom: '2px solid #c8a84b', padding: '0 24px' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, padding: '14px 0', flexWrap: 'wrap',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'inherit' }}>
          <Image
            src="/hobby-japan-logo.png"
            alt="Hobby Japan"
            width={80}
            height={52}
            style={{ display: 'block', objectFit: 'contain' }}
            priority
          />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em', color: '#c8a84b' }}>
              HOBBY JAPAN CO., LTD.
            </div>
            <div style={{ fontSize: '0.75rem', color: '#999', letterSpacing: '0.04em' }}>
              Japanese Publisher specialized in Hobbies
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SocialLink href="https://www.instagram.com/hobbyjapanenglish/" title="Instagram">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="#fff">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </SocialLink>
          <SocialLink href="https://twitter.com/hobbyjapan_eng" title="Twitter/X">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="#fff">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.737l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </SocialLink>
        </div>
      </div>
    </header>
  )
}

function SocialLink({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      style={{
        width: 36, height: 36, borderRadius: '50%', background: '#2e2e2e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {children}
    </a>
  )
}
