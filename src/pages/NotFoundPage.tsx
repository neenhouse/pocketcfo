import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '40px 24px',
        textAlign: 'center',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-primary)',
      }}
    >
      <p style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px' }}>404</p>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Page not found</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '360px' }}>
        That page doesn't exist. Let's get your finances back on track.
      </p>
      <Link
        to="/"
        style={{
          padding: '10px 24px',
          background: 'var(--accent)',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '14px',
        }}
      >
        Back to home
      </Link>
    </div>
  )
}
