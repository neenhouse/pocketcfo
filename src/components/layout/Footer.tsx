import { Link } from 'react-router-dom'
import { branding } from '../../lib/branding'
import './Footer.css'

function DefaultFooterLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="fcoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#D97706"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#fcoinGrad)" stroke="#92400E" strokeWidth="2"/>
      <path d="M32 14 L35 28 L32 50 L29 28 Z" fill="#065F46" opacity="0.9"/>
      <circle cx="32" cy="32" r="4" fill="#FDE68A"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            {branding.logoUrl
              ? <img src={branding.logoUrl} alt="" width="24" height="24" />
              : <DefaultFooterLogo />
            }
            <span>{branding.appName}</span>
          </Link>
          <p className="footer-tagline">{branding.tagline}</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Tools</h4>
            <Link to="/assessment">Financial Assessment</Link>
            <Link to="/debt-optimizer">Debt Optimizer</Link>
            <Link to="/benefits">Benefits Finder</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#impact">Impact</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Built for the people who need it most. Free forever.</p>
          <p className="footer-copy">&copy; {new Date().getFullYear()} {branding.copyright}</p>
          {branding.showPoweredBy && (
            <p className="footer-powered">Powered by PocketCFO</p>
          )}
        </div>
      </div>
    </footer>
  )
}
