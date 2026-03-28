import { describe, it, expect } from 'vitest'
import { generateStrategy, getMonthlyIncome, calculateDebtPayoff } from './strategy'
import type { FinancialProfile, Debt } from './types'
import { DEFAULT_PROFILE } from './types'

describe('getMonthlyIncome', () => {
  it('converts weekly pay to monthly', () => {
    const profile: FinancialProfile = { ...DEFAULT_PROFILE, income: 500, payFrequency: 'weekly' }
    const monthly = getMonthlyIncome(profile)
    expect(monthly).toBeCloseTo(500 * 52 / 12, 0)
  })

  it('converts biweekly pay to monthly', () => {
    const profile: FinancialProfile = { ...DEFAULT_PROFILE, income: 1200, payFrequency: 'biweekly' }
    const monthly = getMonthlyIncome(profile)
    expect(monthly).toBeCloseTo(1200 * 26 / 12, 0)
  })

  it('returns monthly pay directly', () => {
    const profile: FinancialProfile = { ...DEFAULT_PROFILE, income: 3000, payFrequency: 'monthly' }
    expect(getMonthlyIncome(profile)).toBe(3000)
  })
})

describe('generateStrategy', () => {
  it('generates action items', () => {
    const profile: FinancialProfile = {
      ...DEFAULT_PROFILE,
      income: 2000,
      payFrequency: 'biweekly',
      monthlyExpenses: { housing: 1200, food: 400, transportation: 200, utilities: 150, insurance: 100, other: 200 },
      debts: [{ id: '1', name: 'Visa', balance: 5000, interestRate: 22, minimumPayment: 150, type: 'credit_card' }],
    }
    const strategy = generateStrategy(profile)
    expect(strategy.actionItems.length).toBeGreaterThan(0)
    expect(strategy.monthlySavingsPotential).toBeGreaterThanOrEqual(0)
  })

  it('includes tax savings for low income workers', () => {
    const profile: FinancialProfile = {
      ...DEFAULT_PROFILE,
      income: 1500,
      payFrequency: 'biweekly',
      dependents: 2,
      monthlyExpenses: { housing: 900, food: 300, transportation: 100, utilities: 100, insurance: 50, other: 100 },
    }
    const strategy = generateStrategy(profile)
    expect(strategy.taxSavings).toBeGreaterThan(0)
  })

  it('identifies benefits for workers with employer plans', () => {
    const profile: FinancialProfile = {
      ...DEFAULT_PROFILE,
      income: 2500,
      payFrequency: 'biweekly',
      hasEmployerBenefits: true,
      monthlyExpenses: { housing: 1000, food: 400, transportation: 150, utilities: 100, insurance: 100, other: 100 },
    }
    const strategy = generateStrategy(profile)
    expect(strategy.benefitsValue).toBeGreaterThan(0)
    expect(strategy.actionItems.some(a => a.id === '401k-match')).toBe(true)
  })
})

describe('calculateDebtPayoff', () => {
  const debts: Debt[] = [
    { id: '1', name: 'High Interest', balance: 3000, interestRate: 24, minimumPayment: 60, type: 'credit_card' },
    { id: '2', name: 'Low Balance', balance: 500, interestRate: 12, minimumPayment: 25, type: 'personal' },
  ]

  it('calculates avalanche payoff (highest rate first)', () => {
    const result = calculateDebtPayoff(debts, 200, 'avalanche')
    expect(result.months).toBeGreaterThan(0)
    expect(result.months).toBeLessThan(360)
    expect(result.totalInterest).toBeGreaterThan(0)
  })

  it('calculates snowball payoff (lowest balance first)', () => {
    const result = calculateDebtPayoff(debts, 200, 'snowball')
    expect(result.months).toBeGreaterThan(0)
    expect(result.timeline.length).toBeGreaterThan(0)
  })

  it('avalanche pays less interest than snowball', () => {
    const avalanche = calculateDebtPayoff(debts, 200, 'avalanche')
    const snowball = calculateDebtPayoff(debts, 200, 'snowball')
    expect(avalanche.totalInterest).toBeLessThanOrEqual(snowball.totalInterest)
  })

  it('returns zero months for empty debt list', () => {
    const result = calculateDebtPayoff([], 100, 'avalanche')
    expect(result.months).toBe(0)
    expect(result.totalInterest).toBe(0)
  })
})
