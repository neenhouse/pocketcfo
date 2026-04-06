import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { calculateDebtPayoff } from '../lib/strategy'
import type { FinancialProfile, Debt } from '../lib/types'
import { DEFAULT_PROFILE } from '../lib/types'
import './DebtOptimizerPage.css'

function uid() { return Math.random().toString(36).slice(2, 9) }

export default function DebtOptimizerPage() {
  const [profile] = useLocalStorage<FinancialProfile>('pocketcfo-profile', DEFAULT_PROFILE)
  const [debts, setDebts] = useState<Debt[]>(
    profile.debts.length > 0 ? profile.debts : []
  )
  const [extraMonthly, setExtraMonthly] = useState(100)
  const [method, setMethod] = useState<'avalanche' | 'snowball'>('avalanche')

  const addDebt = () => {
    setDebts(prev => [...prev, {
      id: uid(),
      name: '',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      type: 'credit_card' as const,
    }])
  }

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d))
  }

  const removeDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id))
  }

  const validDebts = debts.filter(d => d.balance > 0 && d.minimumPayment > 0)

  const avalanche = useMemo(() => calculateDebtPayoff(validDebts, extraMonthly, 'avalanche'), [validDebts, extraMonthly])
  const snowball = useMemo(() => calculateDebtPayoff(validDebts, extraMonthly, 'snowball'), [validDebts, extraMonthly])

  const activeResult = method === 'avalanche' ? avalanche : snowball
  const interestSaved = snowball.totalInterest - avalanche.totalInterest

  // Chart
  const timeline = activeResult.timeline
  const chartWidth = 600
  const chartHeight = 200
  const maxBalance = Math.max(...timeline.map(t => t.totalBalance), 1)

  const barWidth = timeline.length > 1 ? (chartWidth / timeline.length) * 0.7 : 40
  const barGap = timeline.length > 1 ? (chartWidth / timeline.length) * 0.3 : 10

  return (
    <div className="debt-optimizer container">
      <div className="debt-opt-header">
        <h1>Debt Payoff Optimizer</h1>
        <p>Enter your debts, choose your strategy, and see exactly when you'll be free.</p>
      </div>

      {/* Input Section */}
      <div className="debt-inputs">
        {debts.map((debt, i) => (
          <Card key={debt.id} className="debt-input-card">
            <div className="debt-input-header">
              <span className="debt-num">#{i + 1}</span>
              <button className="debt-rm" onClick={() => removeDebt(debt.id)}>Remove</button>
            </div>
            <div className="debt-input-fields">
              <div className="field">
                <label>Name</label>
                <input type="text" value={debt.name} onChange={e => updateDebt(debt.id, 'name', e.target.value)} placeholder="e.g. Visa card" />
              </div>
              <div className="field">
                <label>Balance</label>
                <input type="number" value={debt.balance || ''} onChange={e => updateDebt(debt.id, 'balance', Number(e.target.value))} placeholder="$0" />
              </div>
              <div className="field">
                <label>APR %</label>
                <input type="number" step="0.1" value={debt.interestRate || ''} onChange={e => updateDebt(debt.id, 'interestRate', Number(e.target.value))} placeholder="0%" />
              </div>
              <div className="field">
                <label>Min Payment</label>
                <input type="number" value={debt.minimumPayment || ''} onChange={e => updateDebt(debt.id, 'minimumPayment', Number(e.target.value))} placeholder="$0" />
              </div>
            </div>
          </Card>
        ))}

        <Button variant="secondary" onClick={addDebt}>
          + Add Debt
        </Button>

        {debts.length === 0 && profile.debts.length === 0 && (
          <div className="debt-opt-empty">
            <p>No debts from your assessment. Add some to compare strategies, or go back and update your profile.</p>
            <Link to="/assessment"><Button variant="ghost">Go to Assessment</Button></Link>
          </div>
        )}
      </div>

      {validDebts.length > 0 && (
        <>
          {/* Extra payment slider */}
          <Card className="extra-payment-card">
            <h3>Extra Monthly Payment</h3>
            <p className="extra-desc">How much extra can you throw at debt each month (above minimums)?</p>
            <div className="slider-row">
              <input
                type="range"
                min="0"
                max="1000"
                step="25"
                value={extraMonthly}
                onChange={e => setExtraMonthly(Number(e.target.value))}
                className="slider"
              />
              <span className="slider-value">${extraMonthly}/mo</span>
            </div>
          </Card>

          {/* Strategy Toggle */}
          <div className="strategy-toggle">
            <button
              className={`strategy-btn ${method === 'avalanche' ? 'active' : ''}`}
              onClick={() => setMethod('avalanche')}
              aria-pressed={method === 'avalanche'}
            >
              <span className="strategy-name">Avalanche</span>
              <span className="strategy-desc">Highest interest first (saves the most)</span>
            </button>
            <button
              className={`strategy-btn ${method === 'snowball' ? 'active' : ''}`}
              onClick={() => setMethod('snowball')}
              aria-pressed={method === 'snowball'}
            >
              <span className="strategy-name">Snowball</span>
              <span className="strategy-desc">Smallest balance first (quick wins)</span>
            </button>
          </div>

          {/* Results */}
          <div className="results-grid">
            <Card className={`result-card ${method === 'avalanche' ? 'highlight' : ''}`}>
              <h3>Avalanche Method</h3>
              <div className="result-stat">{avalanche.months} months</div>
              <div className="result-label">to debt free</div>
              <div className="result-interest">${avalanche.totalInterest.toLocaleString()} in interest</div>
            </Card>
            <Card className={`result-card ${method === 'snowball' ? 'highlight' : ''}`}>
              <h3>Snowball Method</h3>
              <div className="result-stat">{snowball.months} months</div>
              <div className="result-label">to debt free</div>
              <div className="result-interest">${snowball.totalInterest.toLocaleString()} in interest</div>
            </Card>
          </div>

          {interestSaved > 0 && (
            <div className="interest-saved">
              Avalanche saves you <strong>${interestSaved.toLocaleString()}</strong> in interest vs snowball.
              {interestSaved < 200 && " (They're close — pick whichever motivates you more.)"}
            </div>
          )}

          {/* Chart */}
          {timeline.length > 1 && (
            <Card className="payoff-chart">
              <h3>Payoff Timeline ({method === 'avalanche' ? 'Avalanche' : 'Snowball'})</h3>
              <div className="chart-wrap">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} className="bar-chart" role="img" aria-label="Debt payoff timeline bar chart">
                  {timeline.map((point, i) => {
                    const barHeight = (point.totalBalance / maxBalance) * chartHeight
                    const x = i * (barWidth + barGap) + barGap / 2
                    const y = chartHeight - barHeight
                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx="3"
                          fill={point.totalBalance <= 0 ? 'var(--green-500)' : 'var(--gold-500)'}
                          opacity={0.7 + (i / timeline.length) * 0.3}
                        />
                        {i % Math.max(1, Math.floor(timeline.length / 6)) === 0 && (
                          <text
                            x={x + barWidth / 2}
                            y={chartHeight + 20}
                            textAnchor="middle"
                            fill="var(--text-muted)"
                            fontSize="10"
                          >
                            {point.month === 0 ? 'Now' : `${point.month}mo`}
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>
              </div>
            </Card>
          )}

          {/* Debt order */}
          <Card className="payoff-order">
            <h3>Payoff Order ({method === 'avalanche' ? 'Avalanche' : 'Snowball'})</h3>
            <ol className="order-list">
              {[...validDebts]
                .sort((a, b) => method === 'avalanche' ? b.interestRate - a.interestRate : a.balance - b.balance)
                .map((d, i) => (
                  <li key={d.id} className="order-item">
                    <span className="order-num">{i + 1}</span>
                    <div className="order-info">
                      <strong>{d.name || 'Unnamed'}</strong>
                      <span>${d.balance.toLocaleString()} at {d.interestRate}% APR</span>
                    </div>
                  </li>
                ))}
            </ol>
          </Card>
        </>
      )}
    </div>
  )
}
