import { useState, useMemo } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getMonthlyIncome } from '../lib/strategy'
import type { FinancialProfile, Benefit } from '../lib/types'
import { DEFAULT_PROFILE } from '../lib/types'
import './BenefitsFinderPage.css'

function getBenefits(profile: FinancialProfile): Benefit[] {
  const annualIncome = getMonthlyIncome(profile) * 12
  const benefits: Benefit[] = []

  // EITC
  benefits.push({
    id: 'eitc',
    name: 'Earned Income Tax Credit (EITC)',
    description: 'A refundable tax credit for low-to-moderate income workers. Even if you owe no tax, you can get this as a refund.',
    estimatedValue: profile.dependents > 0 ? Math.min(7430, Math.round(annualIncome * 0.15)) : Math.min(600, Math.round(annualIncome * 0.07)),
    category: 'tax',
    eligible: annualIncome > 0 && annualIncome < (profile.dependents > 0 ? 63398 : 17640),
    claimed: false,
    requirements: ['Must have earned income', 'Must file a tax return', `Income under $${(profile.dependents > 0 ? 63398 : 17640).toLocaleString()}`],
  })

  // Child Tax Credit
  if (profile.dependents > 0) {
    benefits.push({
      id: 'ctc',
      name: 'Child Tax Credit',
      description: `Up to $2,000 per qualifying child under 17. Partially refundable even if you owe no tax.`,
      estimatedValue: profile.dependents * 2000,
      category: 'tax',
      eligible: annualIncome < 200000,
      claimed: false,
      requirements: ['Children under 17', 'Must file a tax return', 'Income under $200,000'],
    })
  }

  // SNAP
  benefits.push({
    id: 'snap',
    name: 'SNAP (Food Stamps)',
    description: 'Monthly food assistance based on household size and income. Can be loaded onto an EBT card and used at grocery stores.',
    estimatedValue: (1 + profile.dependents) * 200 * 12,
    category: 'government',
    eligible: annualIncome < 40000 * (1 + profile.dependents * 0.3),
    claimed: false,
    requirements: ['Meet income guidelines', 'Apply through your state', 'Must be a US citizen or qualified non-citizen'],
  })

  // Medicaid/ACA
  benefits.push({
    id: 'healthcare',
    name: 'Medicaid or ACA Subsidies',
    description: 'Free or low-cost health insurance. Medicaid for very low income, ACA marketplace subsidies for moderate income.',
    estimatedValue: annualIncome < 20000 ? 6000 : 3600,
    category: 'government',
    eligible: annualIncome < 60000,
    claimed: false,
    requirements: ['Income-based eligibility', 'Apply through healthcare.gov or your state exchange'],
  })

  // LIHEAP
  benefits.push({
    id: 'liheap',
    name: 'LIHEAP (Energy Assistance)',
    description: 'Helps pay heating and cooling bills. One-time payment or credit applied directly to your utility account.',
    estimatedValue: 800,
    category: 'government',
    eligible: annualIncome < 35000,
    claimed: false,
    requirements: ['Low income household', 'Apply through local community action agency', 'Seasonal availability'],
  })

  // WIC
  if (profile.dependents > 0) {
    benefits.push({
      id: 'wic',
      name: 'WIC (Women, Infants & Children)',
      description: 'Nutrition program for pregnant women, new mothers, and children under 5. Covers milk, eggs, bread, cereal, and more.',
      estimatedValue: 100 * 12 * Math.min(profile.dependents, 3),
      category: 'government',
      eligible: annualIncome < 52000,
      claimed: false,
      requirements: ['Pregnant, breastfeeding, or children under 5', 'Meet income guidelines', 'Apply at local WIC office'],
    })
  }

  // 401k match
  if (profile.hasEmployerBenefits) {
    benefits.push({
      id: '401k',
      name: 'Employer 401(k) Match',
      description: "Your employer may match a percentage of your retirement contributions. This is literally free money — don't leave it on the table.",
      estimatedValue: Math.round(annualIncome * 0.03),
      category: 'employer',
      eligible: true,
      claimed: false,
      requirements: ['Check with HR for match percentage', 'Typically must contribute at least 3-6% of pay'],
    })

    benefits.push({
      id: 'fsa',
      name: 'Flexible Spending Account (FSA)',
      description: 'Pre-tax dollars for medical expenses or dependent care. Saves you 22-37% on these costs.',
      estimatedValue: 600,
      category: 'employer',
      eligible: true,
      claimed: false,
      requirements: ['Available during open enrollment', 'Must estimate annual expenses', 'Use-it-or-lose-it (mostly)'],
    })
  }

  // Saver's Credit
  benefits.push({
    id: 'savers-credit',
    name: "Saver's Credit",
    description: 'Tax credit for low-income workers who contribute to retirement accounts (401k, IRA). Up to $1,000 credit.',
    estimatedValue: Math.min(1000, Math.round(annualIncome * 0.05)),
    category: 'tax',
    eligible: annualIncome < (profile.filingStatus === 'married' ? 73000 : 36500),
    claimed: false,
    requirements: ['Contribute to 401(k) or IRA', 'Must be 18+', `Income under $${(profile.filingStatus === 'married' ? 73000 : 36500).toLocaleString()}`],
  })

  // Student loan deduction
  if (profile.debts.some(d => d.type === 'student_loan')) {
    benefits.push({
      id: 'student-loan-deduction',
      name: 'Student Loan Interest Deduction',
      description: 'Deduct up to $2,500 of student loan interest from your taxable income. No need to itemize.',
      estimatedValue: Math.min(550, Math.round(profile.debts.filter(d => d.type === 'student_loan').reduce((a, d) => a + d.balance * d.interestRate / 100, 0) * 0.22)),
      category: 'tax',
      eligible: annualIncome < 90000,
      claimed: false,
      requirements: ['Paid interest on qualified student loans', 'Income under $90,000 (single)'],
    })
  }

  // Free tax filing
  benefits.push({
    id: 'free-filing',
    name: 'Free Tax Filing (IRS Free File)',
    description: 'File your federal taxes for free if your income is under $84,000. Many states offer free filing too.',
    estimatedValue: 150,
    category: 'tax',
    eligible: annualIncome < 84000,
    claimed: false,
    requirements: ['Income under $84,000', 'Use IRS.gov/freefile', 'Available January through October'],
  })

  return benefits
}

export default function BenefitsFinderPage() {
  const [profile] = useLocalStorage<FinancialProfile>('pocketcfo-profile', DEFAULT_PROFILE)
  const [claimed, setClaimed] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'eligible' | 'government' | 'tax' | 'employer'>('all')

  const benefits = useMemo(() => getBenefits(profile), [profile])

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

            {benefit.eligible && (
              <button
                className={`claim-btn ${claimed.has(benefit.id) ? 'claimed' : ''}`}
                onClick={() => toggleClaimed(benefit.id)}
              >
                {claimed.has(benefit.id) ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
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
