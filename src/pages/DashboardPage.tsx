import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getMonthlyIncome } from '../lib/strategy'
import type { FinancialProfile, Strategy } from '../lib/types'
import { DEFAULT_PROFILE } from '../lib/types'
import './DashboardPage.css'

export default function DashboardPage() {
  const [profile] = useLocalStorage<FinancialProfile>('pocketcfo-profile', DEFAULT_PROFILE)
  const [strategy, setStrategy] = useLocalStorage<Strategy | null>('pocketcfo-strategy', null)

  if (!strategy || !profile.completedAt) {
    return (
      <div className="dashboard-empty container">
        <div className="empty-state">
          <svg aria-hidden="true" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--gold-400)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
          <h1>Your Dashboard is Waiting</h1>
          <p>Complete your financial assessment to unlock your personalized strategy.</p>
          <Link to="/assessment">
            <Button variant="primary" size="lg">Start Assessment</Button>
          </Link>
        </div>
      </div>
    )
  }

  const monthlyIncome = getMonthlyIncome(profile)
  const totalExpenses = Object.values(profile.monthlyExpenses).reduce((a, b) => a + b, 0)
  const totalDebt = profile.debts.reduce((a, d) => a + d.balance, 0)
  const completedActions = strategy.actionItems.filter(a => a.completed).length

  const toggleAction = (id: string) => {
    setStrategy(prev => {
      if (!prev) return prev
      return {
        ...prev,
        actionItems: prev.actionItems.map(a =>
          a.id === id ? { ...a, completed: !a.completed } : a
        ),
      }
    })
  }

  const impactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'var(--gold-400)'
      case 'medium': return 'var(--green-400)'
      default: return 'var(--text-muted)'
    }
  }

  const categoryIcon = (cat: string) => {
    switch (cat) {
      case 'debt': return '$'
      case 'savings': return '🏦'
      case 'tax': return '📋'
      case 'benefits': return '✅'
      case 'income': return '📈'
      default: return '💡'
    }
  }

  // Net worth projection (simple 5-year SVG chart)
  const months = 60
  const projections: number[] = []
  let netWorth = -totalDebt
  for (let i = 0; i <= months; i++) {
    projections.push(netWorth)
    netWorth += strategy.monthlySavingsPotential + (strategy.taxSavings + strategy.benefitsValue) / 12
  }
  const minVal = Math.min(...projections)
  const maxVal = Math.max(...projections)
  const range = maxVal - minVal || 1
  const chartWidth = 600
  const chartHeight = 200
  const points = projections.map((v, i) => {
    const x = (i / months) * chartWidth
    const y = chartHeight - ((v - minVal) / range) * (chartHeight - 20) - 10
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <h1>Your Financial Strategy</h1>
          <p className="dashboard-date">Generated {new Date(profile.completedAt!).toLocaleDateString()}</p>
        </div>
        <Link to="/assessment">
          <Button variant="ghost" size="sm">Retake Assessment</Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <Card className="summary-card">
          <div className="summary-label">Monthly Savings Potential</div>
          <div className="summary-value gold">${strategy.monthlySavingsPotential.toLocaleString()}</div>
          <div className="summary-sub">/month you can put to work</div>
        </Card>
        <Card className="summary-card">
          <div className="summary-label">Projected Debt-Free</div>
          <div className="summary-value green">{new Date(strategy.debtFreeDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
          <div className="summary-sub">{totalDebt > 0 ? `from $${totalDebt.toLocaleString()} total` : 'No debt! 🎉'}</div>
        </Card>
        <Card className="summary-card">
          <div className="summary-label">Tax Savings Found</div>
          <div className="summary-value gold">${strategy.taxSavings.toLocaleString()}</div>
          <div className="summary-sub">/year in credits & deductions</div>
        </Card>
        <Card className="summary-card">
          <div className="summary-label">Benefits Value</div>
          <div className="summary-value green">${strategy.benefitsValue.toLocaleString()}</div>
          <div className="summary-sub">/year in potential benefits</div>
        </Card>
      </div>

      {/* Income vs Expenses */}
      <Card className="budget-card">
        <h2>Monthly Cash Flow</h2>
        <div className="budget-bars">
          <div className="budget-row">
            <span className="budget-label">Income</span>
            <ProgressBar value={monthlyIncome} max={monthlyIncome} color="var(--green-400)" />
            <span className="budget-amount">${Math.round(monthlyIncome).toLocaleString()}</span>
          </div>
          <div className="budget-row">
            <span className="budget-label">Expenses</span>
            <ProgressBar value={totalExpenses} max={monthlyIncome} color="var(--gold-500)" />
            <span className="budget-amount">${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="budget-row">
            <span className="budget-label">Debt Payments</span>
            <ProgressBar value={profile.debts.reduce((a, d) => a + d.minimumPayment, 0)} max={monthlyIncome} color="var(--error)" />
            <span className="budget-amount">${profile.debts.reduce((a, d) => a + d.minimumPayment, 0).toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Net Worth Projection */}
      <Card className="chart-card">
        <h2>5-Year Net Worth Projection</h2>
        <p className="chart-subtitle">Based on your current savings potential and debt payoff schedule</p>
        <div className="chart-container">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="chart-svg" role="img" aria-label="5-year net worth projection chart">
            {/* Zero line */}
            {minVal < 0 && maxVal > 0 && (
              <line
                x1="0"
                y1={chartHeight - ((0 - minVal) / range) * (chartHeight - 20) - 10}
                x2={chartWidth}
                y2={chartHeight - ((0 - minVal) / range) * (chartHeight - 20) - 10}
                stroke="var(--border)"
                strokeDasharray="4 4"
              />
            )}
            {/* Area */}
            <polygon
              points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
              fill="url(#chartGrad)"
              opacity="0.3"
            />
            {/* Line */}
            <polyline points={points} fill="none" stroke="var(--gold-400)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* End dot */}
            <circle cx={chartWidth} cy={Number(points.split(' ').pop()?.split(',')[1])} r="4" fill="var(--gold-400)" />
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold-400)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--gold-400)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="chart-labels">
            <span>Today</span>
            <span>Year 1</span>
            <span>Year 2</span>
            <span>Year 3</span>
            <span>Year 4</span>
            <span>Year 5</span>
          </div>
        </div>
        <div className="chart-target">
          Projected net worth in 5 years: <strong>${strategy.projectedNetWorth.toLocaleString()}</strong>
        </div>
      </Card>

      {/* Action Items */}
      <div className="actions-section">
        <div className="actions-header">
          <h2>Your Action Plan</h2>
          <span className="actions-progress">{completedActions}/{strategy.actionItems.length} complete</span>
        </div>
        <ProgressBar value={completedActions} max={strategy.actionItems.length} color="var(--gold-400)" height={6} />

        <div className="actions-list">
          {strategy.actionItems.map(item => (
            <div key={item.id} className={`action-item ${item.completed ? 'completed' : ''}`}>
              <button
                className="action-check"
                onClick={() => toggleAction(item.id)}
                aria-label={item.completed ? `Mark "${item.title}" as incomplete` : `Mark "${item.title}" as complete`}
                aria-pressed={item.completed}
              >
                {item.completed ? (
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="var(--gold-400)" stroke="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                ) : (
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                )}
              </button>
              <div className="action-body">
                <div className="action-meta">
                  <span className="action-category">{categoryIcon(item.category)}</span>
                  <span className="action-impact" style={{ color: impactColor(item.impact) }}>
                    {item.impact} impact
                  </span>
                </div>
                <h3 className="action-title">{item.title}</h3>
                <p className="action-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <Link to="/debt-optimizer">
          <Card hover className="quick-link-card">
            <h3>Debt Optimizer</h3>
            <p>See avalanche vs snowball payoff projections</p>
          </Card>
        </Link>
        <Link to="/benefits">
          <Card hover className="quick-link-card">
            <h3>Benefits Finder</h3>
            <p>Check for unclaimed benefits & programs</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
