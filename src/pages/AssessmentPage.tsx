import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateStrategy } from '../lib/strategy'
import type { FinancialProfile, Debt } from '../lib/types'
import { DEFAULT_PROFILE } from '../lib/types'
import type { Strategy } from '../lib/types'
import './AssessmentPage.css'

const STEPS = ['Income', 'Expenses', 'Debts', 'Goals', 'Review']

function uid() { return Math.random().toString(36).slice(2, 9) }

export default function AssessmentPage() {
  const navigate = useNavigate()
  const [, setProfile] = useLocalStorage<FinancialProfile>('pocketcfo-profile', DEFAULT_PROFILE)
  const [, setStrategy] = useLocalStorage<Strategy | null>('pocketcfo-strategy', null)
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FinancialProfile>({ ...DEFAULT_PROFILE })

  const updateField = <K extends keyof FinancialProfile>(key: K, value: FinancialProfile[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const updateExpense = (key: keyof FinancialProfile['monthlyExpenses'], value: number) => {
    setData(prev => ({
      ...prev,
      monthlyExpenses: { ...prev.monthlyExpenses, [key]: value },
    }))
  }

  const addDebt = () => {
    const newDebt: Debt = {
      id: uid(),
      name: '',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      type: 'credit_card',
    }
    setData(prev => ({ ...prev, debts: [...prev.debts, newDebt] }))
  }

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setData(prev => ({
      ...prev,
      debts: prev.debts.map(d => d.id === id ? { ...d, [field]: value } : d),
    }))
  }

  const removeDebt = (id: string) => {
    setData(prev => ({ ...prev, debts: prev.debts.filter(d => d.id !== id) }))
  }

  const handleSubmit = () => {
    const completed = { ...data, completedAt: new Date().toISOString() }
    setProfile(completed)
    const strat = generateStrategy(completed)
    setStrategy(strat)
    navigate('/dashboard')
  }

  const canProceed = () => {
    switch (step) {
      case 0: return data.income > 0
      case 1: return data.monthlyExpenses.housing > 0
      default: return true
    }
  }

  return (
    <div className="assessment">
      <div className="container assessment-container">
        <div className="assessment-header">
          <h1>Financial Health Assessment</h1>
          <p>3 minutes to a personalized strategy. Your data never leaves your device.</p>
        </div>

        <div className="assessment-progress">
          <ProgressBar value={step + 1} max={STEPS.length} showPercent />
          <div className="step-labels">
            {STEPS.map((s, i) => (
              <button
                key={s}
                className={`step-label ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="assessment-body">
          {step === 0 && (
            <div className="step-content">
              <h2>Tell us about your income</h2>
              <p className="step-desc">No judgment here. This is about getting you the right strategy.</p>

              <div className="form-group">
                <label>How much do you earn per paycheck? (before taxes)</label>
                <div className="input-with-prefix">
                  <span className="prefix">$</span>
                  <input
                    type="number"
                    value={data.income || ''}
                    onChange={e => updateField('income', Number(e.target.value))}
                    placeholder="0"
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label>How often do you get paid?</label>
                <div className="radio-group">
                  {(['weekly', 'biweekly', 'monthly'] as const).map(f => (
                    <button
                      key={f}
                      className={`radio-btn ${data.payFrequency === f ? 'selected' : ''}`}
                      onClick={() => updateField('payFrequency', f)}
                      aria-pressed={data.payFrequency === f}
                    >
                      {f === 'biweekly' ? 'Every 2 weeks' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Filing status</label>
                <div className="radio-group">
                  {([
                    ['single', 'Single'],
                    ['married', 'Married'],
                    ['head_of_household', 'Head of Household'],
                  ] as const).map(([val, label]) => (
                    <button
                      key={val}
                      className={`radio-btn ${data.filingStatus === val ? 'selected' : ''}`}
                      onClick={() => updateField('filingStatus', val)}
                      aria-pressed={data.filingStatus === val}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Dependents (kids, etc.)</label>
                  <input
                    type="number"
                    min="0"
                    value={data.dependents}
                    onChange={e => updateField('dependents', Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Employer offers benefits?</label>
                  <div className="radio-group">
                    <button
                      className={`radio-btn ${data.hasEmployerBenefits ? 'selected' : ''}`}
                      onClick={() => updateField('hasEmployerBenefits', true)}
                      aria-pressed={data.hasEmployerBenefits}
                    >Yes</button>
                    <button
                      className={`radio-btn ${!data.hasEmployerBenefits ? 'selected' : ''}`}
                      onClick={() => updateField('hasEmployerBenefits', false)}
                      aria-pressed={!data.hasEmployerBenefits}
                    >No</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="step-content">
              <h2>Monthly expenses</h2>
              <p className="step-desc">Rough estimates are fine. We're looking for the big picture.</p>

              {([
                ['housing', 'Housing (rent/mortgage)'],
                ['food', 'Food & Groceries'],
                ['transportation', 'Transportation'],
                ['utilities', 'Utilities & Phone'],
                ['insurance', 'Insurance'],
                ['other', 'Everything else'],
              ] as const).map(([key, label]) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <div className="input-with-prefix">
                    <span className="prefix">$</span>
                    <input
                      type="number"
                      value={data.monthlyExpenses[key] || ''}
                      onChange={e => updateExpense(key, Number(e.target.value))}
                      placeholder="0"
                    />
                    <span className="suffix">/mo</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2>Your debts</h2>
              <p className="step-desc">List everything — credit cards, student loans, car loans, medical bills. We'll figure out the best order to pay them off.</p>

              {data.debts.map((debt, i) => (
                <div key={debt.id} className="debt-card">
                  <div className="debt-header">
                    <span className="debt-number">Debt {i + 1}</span>
                    <button className="debt-remove" onClick={() => removeDebt(debt.id)}>Remove</button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" value={debt.name} onChange={e => updateDebt(debt.id, 'name', e.target.value)} placeholder="e.g. Chase Visa" />
                    </div>
                    <div className="form-group">
                      <label>Type</label>
                      <select value={debt.type} onChange={e => updateDebt(debt.id, 'type', e.target.value)}>
                        <option value="credit_card">Credit Card</option>
                        <option value="student_loan">Student Loan</option>
                        <option value="auto">Auto Loan</option>
                        <option value="medical">Medical</option>
                        <option value="personal">Personal Loan</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row triple">
                    <div className="form-group">
                      <label>Balance</label>
                      <div className="input-with-prefix">
                        <span className="prefix">$</span>
                        <input type="number" value={debt.balance || ''} onChange={e => updateDebt(debt.id, 'balance', Number(e.target.value))} placeholder="0" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Interest Rate</label>
                      <div className="input-with-prefix">
                        <input type="number" step="0.1" value={debt.interestRate || ''} onChange={e => updateDebt(debt.id, 'interestRate', Number(e.target.value))} placeholder="0" />
                        <span className="suffix">%</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Min Payment</label>
                      <div className="input-with-prefix">
                        <span className="prefix">$</span>
                        <input type="number" value={debt.minimumPayment || ''} onChange={e => updateDebt(debt.id, 'minimumPayment', Number(e.target.value))} placeholder="0" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="secondary" onClick={addDebt}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add a Debt
              </Button>
              {data.debts.length === 0 && <p className="no-debts">No debts? That's amazing. Skip ahead!</p>}
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h2>What are your goals?</h2>
              <p className="step-desc">Pick what matters most to you. We'll build a plan around it.</p>

              <div className="goals-grid">
                {[
                  { id: 'emergency', name: 'Build Emergency Fund', icon: '🛡' },
                  { id: 'debt-free', name: 'Become Debt-Free', icon: '🎉' },
                  { id: 'save-home', name: 'Save for a Home', icon: '🏠' },
                  { id: 'retirement', name: 'Start Retirement Savings', icon: '🌅' },
                  { id: 'education', name: 'Education Fund', icon: '📚' },
                  { id: 'vacation', name: 'Save for Vacation', icon: '✈️' },
                ].map(goal => {
                  const selected = data.goals.some(g => g.id === goal.id)
                  return (
                    <button
                      key={goal.id}
                      className={`goal-card ${selected ? 'selected' : ''}`}
                      aria-pressed={selected}
                      onClick={() => {
                        if (selected) {
                          setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== goal.id) }))
                        } else {
                          setData(prev => ({
                            ...prev,
                            goals: [...prev.goals, { id: goal.id, name: goal.name, targetAmount: 0, currentAmount: 0, targetDate: '', priority: 'medium' }],
                          }))
                        }
                      }}
                    >
                      <span className="goal-icon">{goal.icon}</span>
                      <span className="goal-name">{goal.name}</span>
                      {selected && (
                        <svg aria-hidden="true" className="goal-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-400)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-content">
              <h2>Ready to see your strategy?</h2>
              <p className="step-desc">Here's a quick summary of what you told us.</p>

              <div className="review-grid">
                <div className="review-item">
                  <span className="review-label">Income</span>
                  <span className="review-value">${data.income.toLocaleString()}/{data.payFrequency === 'monthly' ? 'mo' : data.payFrequency === 'biweekly' ? '2wk' : 'wk'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Monthly Expenses</span>
                  <span className="review-value">${Object.values(data.monthlyExpenses).reduce((a, b) => a + b, 0).toLocaleString()}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Total Debt</span>
                  <span className="review-value">${data.debts.reduce((a, d) => a + d.balance, 0).toLocaleString()}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Goals</span>
                  <span className="review-value">{data.goals.length} selected</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="assessment-nav">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
          )}
          <div style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Continue
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} size="lg">
              Generate My Strategy
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
