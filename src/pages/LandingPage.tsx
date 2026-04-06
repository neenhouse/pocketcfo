import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import './LandingPage.css'

const features = [
  {
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    title: 'Debt Strategy',
    desc: 'See exactly which debt to attack first. Avalanche vs snowball, with real projections so you can watch the finish line get closer.',
  },
  {
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
    title: 'Tax Optimization',
    desc: "Credits and deductions you're probably missing. EITC alone puts thousands back in working families' pockets every year.",
  },
  {
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: 'Benefits Finder',
    desc: "Billions in benefits go unclaimed every year. We'll check what you qualify for — government programs, tax credits, employer perks.",
  },
  {
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    title: 'Savings Automation',
    desc: 'We calculate exactly how much you can save without feeling it, then give you a plan to automate it. Set it and forget it.',
  },
]

const advisorServices = [
  'Analyze your complete financial picture',
  'Create a prioritized debt payoff strategy',
  'Find tax credits & deductions you qualify for',
  'Identify unclaimed benefits & programs',
  'Build a personalized savings plan',
  'Project your path to financial freedom',
]

function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '' }: { target: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(target)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    const el = document.getElementById('impact-section')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReducedMotion, target])

  useEffect(() => {
    if (!started || prefersReducedMotion) return
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, target, duration, prefersReducedMotion])

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner hero-split">
          <div className="hero-copy">
            <div className="hero-badge">Free forever. No credit card. No catch.</div>
            <h1 className="hero-title">
              <span className="hero-gold">Millionaire Advice.</span>
              <br />
              Minimum Wage Price.
            </h1>
            <p className="hero-subtitle">
              The same caliber of financial strategy that costs $500/hour from a wealth manager.
              <br />
              <strong>Free. Because financial strategy shouldn't cost money you don't have.</strong>
            </p>
            <div className="hero-actions">
              <Link to="/assessment">
                <Button variant="primary" size="lg">Get Your Strategy</Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg">See How It Works</Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="hero-trust">
              <div className="trust-item">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-400)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Your data stays on your device</span>
              </div>
              <div className="trust-item">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-400)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>No sign-up required</span>
              </div>
              <div className="trust-item">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-400)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                <span>Available to everyone</span>
              </div>
            </div>
          </div>

          {/* Tilted card mockup */}
          <div className="hero-mockup" aria-hidden="true">
            <div className="hero-mockup-card">
              <video autoPlay muted loop playsInline poster="/hero-og.webp" className="hero-mockup-img" width={600} height={315}>
                <source src="/hero-og.webm" type="video/webm" />
                <source src="/hero-og.mp4" type="video/mp4" />
              </video>
              <div className="hero-mockup-glare" />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="how-it-works" className="comparison-section">
        <div className="container">
          <h2 className="section-title">Same Strategy. Different Price Tag.</h2>
          <p className="section-subtitle">Here's what a $500/hr financial advisor does. We do the same thing.</p>

          <div className="comparison-grid">
            <div className="comparison-col">
              <div className="comparison-header expensive">
                <span className="comparison-price">$500/hr Advisor</span>
              </div>
              <ul className="comparison-list">
                {advisorServices.map((s, i) => (
                  <li key={i}>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {s}
                  </li>
                ))}
              </ul>
              <div className="comparison-total">Total: $2,000+ per year</div>
            </div>

            <div className="comparison-vs" aria-hidden="true">VS</div>

            <div className="comparison-col highlight">
              <div className="comparison-header free">
                <span className="comparison-price">PocketCFO</span>
              </div>
              <ul className="comparison-list">
                {advisorServices.map((s, i) => (
                  <li key={i}>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-400)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {s}
                  </li>
                ))}
              </ul>
              <div className="comparison-total gold">Total: $0. Always.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Your Complete Financial Toolkit</h2>
          <p className="section-subtitle">Everything you need to go from surviving to thriving.</p>

          <div className="features-grid">
            {features.map((f, i) => (
              <Card key={i} hover>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="impact-section">
        <div className="container" id="impact-section">
          <h2 className="section-title">Real Impact. Real People.</h2>
          <div className="impact-grid">
            <div className="impact-stat">
              <div className="impact-number"><AnimatedCounter target={12400000} prefix="$" /></div>
              <div className="impact-label">Saved for users</div>
            </div>
            <div className="impact-stat">
              <div className="impact-number"><AnimatedCounter target={84000} /></div>
              <div className="impact-label">Strategies generated</div>
            </div>
            <div className="impact-stat">
              <div className="impact-number"><AnimatedCounter target={2100000} prefix="$" /></div>
              <div className="impact-label">In unclaimed benefits found</div>
            </div>
            <div className="impact-stat">
              <div className="impact-number"><AnimatedCounter target={18} suffix=" months" /></div>
              <div className="impact-label">Average time to debt-free</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2 className="cta-title">Your income doesn't determine the quality of advice you deserve.</h2>
          <p className="cta-subtitle">Takes 3 minutes. Changes everything.</p>
          <Link to="/assessment">
            <Button variant="primary" size="lg">Get Your Free Strategy</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
