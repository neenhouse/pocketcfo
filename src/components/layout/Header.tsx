import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { branding } from '../../lib/branding'
import './Header.css'

function DefaultLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="hcoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#D97706"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#hcoinGrad)" stroke="#92400E" strokeWidth="2"/>
      <path d="M32 14 L35 28 L32 50 L29 28 Z" fill="#065F46" opacity="0.9"/>
      <path d="M14 32 L28 29 L50 32 L28 35 Z" fill="#065F46" opacity="0.6"/>
      <circle cx="32" cy="32" r="4" fill="#FDE68A"/>
    </svg>
  )
}

export default function Header() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { to: '/assessment', label: 'Get Started' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/debt-optimizer', label: 'Debt Optimizer' },
    { to: '/benefits', label: 'Benefits Finder' },
  ]

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="header-logo">
          {branding.logoUrl
            ? <img src={branding.logoUrl} alt="" width="28" height="28" />
            : <DefaultLogo />
          }
          <span>{branding.appName}</span>
        </Link>

        <nav id="header-nav" className={`header-nav ${mobileOpen ? 'open' : ''}`} aria-label="Main navigation">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="header-nav"
        >
          <span className={`hamburger ${mobileOpen ? 'open' : ''}`} />
        </button>
      </div>
    </header>
  )
}
