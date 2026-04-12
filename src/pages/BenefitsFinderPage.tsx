import { useState, useMemo } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { FinancialProfile } from '../lib/types'
import { DEFAULT_PROFILE } from '../lib/types'
import { RULES_TAX_YEAR, federalBenefitRules, evaluateBenefits } from '../lib/rules'
import './BenefitsFinderPage.css'

export default function BenefitsFinderPage() {
  const [profile] = useLocalStorage<FinancialProfile>('pocketcfo-profile', DEFAULT_PROFILE)
  const [claimed, setClaimed] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'eligible' | 'government' | 'tax' | 'employer'>('all')

  const benefits = useMemo(() => evaluateBenefits(profile, federalBenefitRules), [profile])

  const filtered = benefits.filter(b => {
    if (filter === 'eligible') return b.eligible
    if (filter === 'all') return true
    return b.category === filter
  })

  const totalEligible = benefits.filter(b => b.eligible).reduce((a, b) => a + b.estimatedValue, 0)
  const totalClaimed = benefits.filter(b => claimed.has(b.id)).reduce((a, b) => a + b.estimatedValue, 0)

  const toggleClaimed = (id: string) => {
    setClaimed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case 'government': return 'Gov Program'
      case 'employer': return 'Employer'
      case 'tax': return 'Tax Benefit'
      default: return cat
    }
  }

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'government': return 'var(--green-400)'
      case 'employer': return 'var(--gold-400)'
      case 'tax': return '#818CF8'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <div className="benefits-page container">
      <div className="benefits-header">
        <h1>Benefits Finder</h1>
        <p>Billions in benefits go unclaimed every year. Let's make sure you're not leaving money on the table.</p>
        <p className="benefits-tax-year">Thresholds current as of Tax Year {RULES_TAX_YEAR}. All eligibility estimates based on federal guidelines.</p>
      </div>

      {/* Summary */}
      <div className="benefits-summary">
        <Card className="benefit-total-card">
          <div className="bt-label">You May Be Eligible For</div>
          <div className="bt-value">${totalEligible.toLocaleString()}</div>
          <div className="bt-sub">/year in benefits</div>
        </Card>
        <Card className="benefit-total-card">
          <div className="bt-label">Already Claimed</div>
          <div className="bt-value claimed">${totalClaimed.toLocaleString()}</div>
          <div className="bt-sub">/year captured</div>
        </Card>
        <Card className="benefit-total-card">
          <div className="bt-label">Still Unclaimed</div>
          <div className="bt-value unclaimed">${(totalEligible - totalClaimed).toLocaleString()}</div>
          <div className="bt-sub">/year waiting for you</div>
        </Card>
      </div>

      {profile.income === 0 && (
        <div className="benefits-notice">
          <p>Complete your <a href="/assessment">financial assessment</a> for personalized eligibility results.</p>
        </div>
      )}

      {/* Filters */}
      <div className="benefits-filters">
        {(['all', 'eligible', 'government', 'tax', 'employer'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'eligible' ? 'Eligible' : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Benefits List */}
      <div className="benefits-list">
        {filtered.map(benefit => (
          <Card key={benefit.id} className={`benefit-card ${!benefit.eligible ? 'ineligible' : ''} ${claimed.has(benefit.id) ? 'is-claimed' : ''}`}>
            <div className="benefit-top">
              <div className="benefit-meta">
                <span className="benefit-cat" style={{ color: categoryColor(benefit.category) }}>
                  {categoryLabel(benefit.category)}
                </span>
                {!benefit.eligible && <span className="benefit-ineligible">Not Eligible</span>}
              </div>
              <div className="benefit-val">${benefit.estimatedValue.toLocaleString()}/yr</div>
            </div>

            <h3 className="benefit-name">{benefit.name}</h3>
            <p className="benefit-desc">{benefit.description}</p>

            <div className="benefit-reqs">
              <span className="reqs-label">Requirements:</span>
              <ul>
                {benefit.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="benefit-source">Source: {benefit.source}</div>

            {benefit.eligible && (
              <button
                className={`claim-btn ${claimed.has(benefit.id) ? 'claimed' : ''}`}
                onClick={() => toggleClaimed(benefit.id)}
                aria-pressed={claimed.has(benefit.id)}
              >
                {claimed.has(benefit.id) ? (
                  <>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Claimed
                  </>
                ) : (
                  'Mark as Claimed'
                )}
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
