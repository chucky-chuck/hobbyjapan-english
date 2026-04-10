export default function Footer() {
  return (
    <footer style={{ background: '#111', borderTop: '1px solid #3a3a3a', padding: '32px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: 'inline-block', background: '#fff', padding: '6px 10px',
            borderRadius: 4, fontWeight: 900, fontSize: '0.9rem', color: '#111',
            letterSpacing: '0.05em', lineHeight: 1.1,
          }}>
            HOBBY<br />JAPAN
          </div>
        </div>
        <p style={{ fontSize: '0.72rem', color: '#999', lineHeight: 2 }}>
          ©SOTSU·SUNRISE &nbsp;|&nbsp; ©SOTSU·SUNRISE·MBS &nbsp;|&nbsp; ©SOTSU·SUNRISE·TV TOKYO &nbsp;|&nbsp; ©Hobby Japan
        </p>
        <p style={{ fontSize: '0.72rem', color: '#999', marginTop: 8 }}>
          HOBBY JAPAN CO., LTD. &nbsp;—&nbsp; Japanese Publisher specialized in Hobbies
        </p>
      </div>
    </footer>
  )
}
