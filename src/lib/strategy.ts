import type { FinancialProfile, Strategy, ActionItem, Debt } from './types'
import { EITC, CHILD_TAX_CREDIT, STUDENT_LOAN_DEDUCTION, SNAP, HEALTHCARE, EMPLOYER_401K, STRATEGY } from './rules'

export function generateStrategy(profile: FinancialProfile): Strategy {
  const monthlyIncome = getMonthlyIncome(profile)
  const totalExpenses = Object.values(profile.monthlyExpenses).reduce((a, b) => a + b, 0)
  const totalMinPayments = profile.debts.reduce((a, d) => a + d.minimumPayment, 0)
  const monthlyFree = monthlyIncome - totalExpenses - totalMinPayments
  const savingsPotential = Math.max(0, monthlyFree * STRATEGY.savingsPotentialRate)

  const totalDebt = profile.debts.reduce((a, d) => a + d.balance, 0)
  const debtFreeMonths = totalDebt > 0
    ? estimateDebtFreeMonths(profile.debts, Math.max(50, monthlyFree * STRATEGY.debtPaymentRate + totalMinPayments))
    : 0

  const debtFreeDate = new Date()
  debtFreeDate.setMonth(debtFreeDate.getMonth() + debtFreeMonths)

  const taxSavings = estimateTaxSavings(profile)
  const benefitsValue = estimateBenefitsValue(profile)

  const projectedNetWorth = (savingsPotential * 12 * 5) - totalDebt + (taxSavings * 5) + (benefitsValue * 5)

  const actionItems = generateActionItems(profile, monthlyFree)

  return {
    monthlySavingsPotential: Math.round(savingsPotential),
    debtFreeDate: debtFreeDate.toISOString(),
    projectedNetWorth: Math.round(projectedNetWorth),
    actionItems,
    taxSavings: Math.round(taxSavings),
    benefitsValue: Math.round(benefitsValue),
  }
}

export function getMonthlyIncome(profile: FinancialProfile): number {
  switch (profile.payFrequency) {
    case 'weekly': return profile.income * 52 / 12
    case 'biweekly': return profile.income * 26 / 12
    case 'monthly': return profile.income
  }
}

function estimateDebtFreeMonths(debts: Debt[], totalMonthlyPayment: number): number {
  if (totalMonthlyPayment <= 0) return 360 // 30 years cap
  let remaining = debts.map(d => ({ ...d }))
  let months = 0
  while (remaining.some(d => d.balance > 0) && months < 360) {
    months++
    // Apply interest
    remaining = remaining.map(d => ({
      ...d,
      balance: d.balance * (1 + d.interestRate / 100 / 12)
    }))
    // Pay minimum on all, extra on highest rate
    let budget = totalMonthlyPayment
    const sorted = [...remaining].filter(d => d.balance > 0).sort((a, b) => b.interestRate - a.interestRate)
    for (const debt of sorted) {
      const ref = remaining.find(d => d.id === debt.id)!
      const payment = Math.min(ref.balance, debt === sorted[0] ? budget : Math.min(budget, ref.minimumPayment))
      ref.balance -= payment
      budget -= payment
      if (budget <= 0) break
    }
  }
  return months
}

function estimateTaxSavings(profile: FinancialProfile): number {
  let savings = 0
  const annualIncome = getMonthlyIncome(profile) * 12
  // EITC estimate
  if (annualIncome < EITC.strategyIncomeLimit) {
    if (profile.dependents > 0) savings += Math.min(EITC.maxCredit.withDependents, annualIncome * EITC.estimateRate.withDependents)
    else savings += Math.min(EITC.maxCredit.withoutDependents, annualIncome * EITC.estimateRate.withoutDependents)
  }
  // Student loan interest deduction
  if (profile.debts.some(d => d.type === 'student_loan')) {
    savings += Math.min(STUDENT_LOAN_DEDUCTION.maxDeduction, profile.debts.filter(d => d.type === 'student_loan').reduce((a, d) => a + d.balance * d.interestRate / 100, 0)) * STUDENT_LOAN_DEDUCTION.taxRate
  }
  // Child tax credit
  savings += profile.dependents * CHILD_TAX_CREDIT.perChild * CHILD_TAX_CREDIT.strategyFactor
  return savings
}

function estimateBenefitsValue(profile: FinancialProfile): number {
  let value = 0
  const annualIncome = getMonthlyIncome(profile) * 12
  // SNAP estimate
  if (annualIncome < SNAP.baseIncomeLimit && profile.dependents > 0) value += SNAP.perPersonMonthly * 12
  // Medicaid/ACA subsidy
  if (annualIncome < HEALTHCARE.strategyIncomeLimit) value += HEALTHCARE.strategyMonthlyValue * 12
  // Employer benefits (401k match)
  if (profile.hasEmployerBenefits) value += annualIncome * EMPLOYER_401K.estimatedMatchRate
  return value
}

function generateActionItems(profile: FinancialProfile, monthlyFree: number): ActionItem[] {
  const items: ActionItem[] = []
  const annualIncome = getMonthlyIncome(profile) * 12

  // Emergency fund
  items.push({
    id: 'emergency-fund',
    title: `Build a $${STRATEGY.emergencyFundTarget.toLocaleString()} Emergency Fund`,
    description: `Before attacking debt, set aside $${STRATEGY.emergencyFundTarget.toLocaleString()}. This prevents new debt from unexpected expenses.`,
    impact: 'high',
    category: 'savings',
    completed: false,
  })

  // High interest debt
  const highInterest = profile.debts.filter(d => d.interestRate > STRATEGY.highInterestThreshold)
  if (highInterest.length > 0) {
    items.push({
      id: 'high-interest-debt',
      title: `Attack ${highInterest[0].name} First (${highInterest[0].interestRate}% APR)`,
      description: `This debt is costing you $${Math.round(highInterest[0].balance * highInterest[0].interestRate / 100 / 12)}/month in interest alone. Pay minimums on everything else and throw extra money here.`,
      impact: 'high',
      category: 'debt',
      completed: false,
    })
  }

  // Tax optimization
  if (annualIncome < EITC.strategyIncomeLimit) {
    const maxEitc = profile.dependents > 0 ? EITC.maxCredit.withDependents.toLocaleString() : EITC.maxCredit.withoutDependents.toLocaleString()
    items.push({
      id: 'eitc',
      title: 'Claim the Earned Income Tax Credit',
      description: `You may qualify for up to $${maxEitc} back. File taxes even if you don't owe — this is free money.`,
      impact: 'high',
      category: 'tax',
      completed: false,
    })
  }

  // Benefits
  if (annualIncome < HEALTHCARE.strategyIncomeLimit && profile.dependents > 0) {
    items.push({
      id: 'snap',
      title: 'Check SNAP/Food Benefits Eligibility',
      description: 'Your household may qualify for food assistance. This frees up cash for debt payoff and savings.',
      impact: 'medium',
      category: 'benefits',
      completed: false,
    })
  }

  // 401k match
  if (profile.hasEmployerBenefits) {
    items.push({
      id: '401k-match',
      title: 'Get Your Full 401(k) Match',
      description: "If your employer matches contributions, not contributing enough is leaving free money on the table. Even 3% of your paycheck counts.",
      impact: 'high',
      category: 'savings',
      completed: false,
    })
  }

  // Savings automation
  if (monthlyFree > STRATEGY.minFreeForAutoSavings) {
    items.push({
      id: 'automate-savings',
      title: `Automate $${Math.min(STRATEGY.maxAutoSavings, Math.round(monthlyFree * STRATEGY.autoSavingsRate))}/month to Savings`,
      description: 'Set up auto-transfer the day after payday. Money you don\'t see is money you don\'t spend.',
      impact: 'medium',
      category: 'savings',
      completed: false,
    })
  }

  // Income
  items.push({
    id: 'side-income',
    title: 'Explore One Income Boost',
    description: 'Even $200/month extra accelerates everything. Consider overtime, gig work, or selling unused items.',
    impact: 'medium',
    category: 'income',
    completed: false,
  })

  return items
}

export function calculateDebtPayoff(debts: Debt[], extraMonthly: number, method: 'avalanche' | 'snowball'): { months: number; totalInterest: number; timeline: { month: number; totalBalance: number }[] } {
  if (debts.length === 0) return { months: 0, totalInterest: 0, timeline: [] }

  const working = debts.map(d => ({ ...d }))
  const timeline: { month: number; totalBalance: number }[] = []
  let months = 0
  let totalInterest = 0
  const totalMinPayments = debts.reduce((a, d) => a + d.minimumPayment, 0)
  const monthlyBudget = totalMinPayments + extraMonthly

  timeline.push({ month: 0, totalBalance: working.reduce((a, d) => a + d.balance, 0) })

  while (working.some(d => d.balance > 0.01) && months < 360) {
    months++

    // Apply interest
    for (const debt of working) {
      if (debt.balance > 0) {
        const interest = debt.balance * debt.interestRate / 100 / 12
        debt.balance += interest
        totalInterest += interest
      }
    }

    // Sort by strategy
    const sorted = working.filter(d => d.balance > 0).sort((a, b) => {
      if (method === 'avalanche') return b.interestRate - a.interestRate
      return a.balance - b.balance
    })

    // Pay
    let budget = monthlyBudget
    for (const debt of sorted) {
      if (budget <= 0) break
      const minPay = Math.min(debt.balance, debt === sorted[0] ? budget : Math.min(budget, debt.minimumPayment))
      debt.balance -= minPay
      budget -= minPay
    }
    // Apply remaining to first priority
    if (budget > 0 && sorted.length > 0) {
      const payment = Math.min(sorted[0].balance, budget)
      sorted[0].balance -= payment
    }

    if (months % 3 === 0 || !working.some(d => d.balance > 0.01)) {
      timeline.push({ month: months, totalBalance: Math.max(0, working.reduce((a, d) => a + d.balance, 0)) })
    }
  }

  return { months, totalInterest: Math.round(totalInterest), timeline }
}
