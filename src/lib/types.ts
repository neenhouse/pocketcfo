export interface FinancialProfile {
  income: number
  payFrequency: 'weekly' | 'biweekly' | 'monthly'
  filingStatus: 'single' | 'married' | 'head_of_household'
  dependents: number
  monthlyExpenses: {
    housing: number
    food: number
    transportation: number
    utilities: number
    insurance: number
    other: number
  }
  debts: Debt[]
  goals: Goal[]
  hasEmployerBenefits: boolean
  completedAt?: string
}

export interface Debt {
  id: string
  name: string
  balance: number
  interestRate: number
  minimumPayment: number
  type: 'credit_card' | 'student_loan' | 'auto' | 'medical' | 'personal' | 'other'
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  priority: 'high' | 'medium' | 'low'
}

export interface Strategy {
  monthlySavingsPotential: number
  debtFreeDate: string
  projectedNetWorth: number
  actionItems: ActionItem[]
  taxSavings: number
  benefitsValue: number
}

export interface ActionItem {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'debt' | 'savings' | 'tax' | 'benefits' | 'income'
  completed: boolean
}

export interface Benefit {
  id: string
  name: string
  description: string
  estimatedValue: number
  category: 'government' | 'employer' | 'tax'
  eligible: boolean
  claimed: boolean
  requirements: string[]
}

export const DEFAULT_PROFILE: FinancialProfile = {
  income: 0,
  payFrequency: 'biweekly',
  filingStatus: 'single',
  dependents: 0,
  monthlyExpenses: {
    housing: 0,
    food: 0,
    transportation: 0,
    utilities: 0,
    insurance: 0,
    other: 0,
  },
  debts: [],
  goals: [],
  hasEmployerBenefits: false,
}
