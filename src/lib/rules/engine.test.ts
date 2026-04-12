import { describe, it, expect } from 'vitest'
import { evaluateBenefits } from './engine'
import { federalBenefitRules } from './benefits'
import type { BenefitRule } from './types'
import type { FinancialProfile } from '../types'
import { DEFAULT_PROFILE } from '../types'
import { RULES_TAX_YEAR } from './federal'

const lowIncomeWorker: FinancialProfile = {
  ...DEFAULT_PROFILE,
  income: 1500,
  payFrequency: 'biweekly',
  filingStatus: 'single',
  dependents: 2,
  monthlyExpenses: { housing: 900, food: 300, transportation: 100, utilities: 100, insurance: 50, other: 100 },
  hasEmployerBenefits: false,
}

const moderateIncomeWithEmployer: FinancialProfile = {
  ...DEFAULT_PROFILE,
  income: 2500,
  payFrequency: 'biweekly',
  filingStatus: 'married',
  dependents: 1,
  monthlyExpenses: { housing: 1200, food: 400, transportation: 200, utilities: 150, insurance: 100, other: 200 },
  hasEmployerBenefits: true,
  debts: [{ id: '1', name: 'Student Loan', balance: 20000, interestRate: 5, minimumPayment: 200, type: 'student_loan' }],
}

describe('evaluateBenefits', () => {
  it('returns benefits for low-income worker with dependents', () => {
    const benefits = evaluateBenefits(lowIncomeWorker, federalBenefitRules)
    expect(benefits.length).toBeGreaterThan(0)

    const eitc = benefits.find(b => b.id === 'eitc')
    expect(eitc).toBeDefined()
    expect(eitc!.eligible).toBe(true)
    expect(eitc!.estimatedValue).toBeGreaterThan(0)

    const ctc = benefits.find(b => b.id === 'ctc')
    expect(ctc).toBeDefined()
    expect(ctc!.eligible).toBe(true)
    expect(ctc!.estimatedValue).toBe(4000) // 2 dependents * $2000

    const snap = benefits.find(b => b.id === 'snap')
    expect(snap).toBeDefined()
    expect(snap!.eligible).toBe(true)
  })

  it('includes employer benefits only when employer benefits exist', () => {
    const withoutEmployer = evaluateBenefits(lowIncomeWorker, federalBenefitRules)
    expect(withoutEmployer.find(b => b.id === '401k')).toBeUndefined()
    expect(withoutEmployer.find(b => b.id === 'fsa')).toBeUndefined()

    const withEmployer = evaluateBenefits(moderateIncomeWithEmployer, federalBenefitRules)
    expect(withEmployer.find(b => b.id === '401k')).toBeDefined()
    expect(withEmployer.find(b => b.id === 'fsa')).toBeDefined()
  })

  it('includes student loan deduction only with student loans', () => {
    const without = evaluateBenefits(lowIncomeWorker, federalBenefitRules)
    expect(without.find(b => b.id === 'student-loan-deduction')).toBeUndefined()

    const with_ = evaluateBenefits(moderateIncomeWithEmployer, federalBenefitRules)
    expect(with_.find(b => b.id === 'student-loan-deduction')).toBeDefined()
  })

  it('includes source citations on every benefit', () => {
    const benefits = evaluateBenefits(lowIncomeWorker, federalBenefitRules)
    for (const b of benefits) {
      expect(b.source).toBeTruthy()
      expect(b.source.length).toBeGreaterThan(0)
    }
  })

  it('skips child-dependent benefits when no dependents', () => {
    const noDeps: FinancialProfile = { ...lowIncomeWorker, dependents: 0 }
    const benefits = evaluateBenefits(noDeps, federalBenefitRules)
    expect(benefits.find(b => b.id === 'ctc')).toBeUndefined()
    expect(benefits.find(b => b.id === 'wic')).toBeUndefined()
  })

  it('state rules override federal rules with the same ID', () => {
    const stateRule: BenefitRule = {
      id: 'snap',
      name: 'Ohio SNAP (Enhanced)',
      description: 'Ohio-specific SNAP with higher benefit amounts.',
      category: 'government',
      source: 'Ohio DHS (2025)',
      taxYear: RULES_TAX_YEAR,
      jurisdiction: 'OH',
      applies: () => true,
      eligible: () => true,
      estimatedValue: () => 9999,
      requirements: () => ['Ohio resident'],
    }
    const combined = [...federalBenefitRules, stateRule]
    const benefits = evaluateBenefits(lowIncomeWorker, combined)
    const snap = benefits.find(b => b.id === 'snap')
    expect(snap).toBeDefined()
    expect(snap!.name).toBe('Ohio SNAP (Enhanced)')
    expect(snap!.estimatedValue).toBe(9999)
    expect(snap!.source).toBe('Ohio DHS (2025)')
  })
})
