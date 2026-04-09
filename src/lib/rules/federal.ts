/**
 * Federal benefit eligibility rules and tax credit thresholds.
 *
 * All dollar amounts and income limits for the current tax year.
 * Update this file annually when IRS publishes new thresholds.
 */

export const RULES_TAX_YEAR = 2025

// --- Tax Credits ---

/** IRS Publication 596 — Earned Income Tax Credit */
export const EITC = {
  maxCredit: { withDependents: 7430, withoutDependents: 600 },
  incomeLimit: { withDependents: 63398, withoutDependents: 17640 },
  estimateRate: { withDependents: 0.15, withoutDependents: 0.07 },
  /** Income threshold used in strategy.ts for simplified eligibility check */
  strategyIncomeLimit: 60000,
  source: 'IRS Publication 596 (2025)',
} as const

/** IRS Publication 972 — Child Tax Credit */
export const CHILD_TAX_CREDIT = {
  perChild: 2000,
  incomeLimit: 200000,
  /** Fraction of credit used in strategy.ts net-worth estimate */
  strategyFactor: 0.5,
  source: 'IRS Publication 972 (2025)',
} as const

/** IRS Form 8880 — Saver's Credit */
export const SAVERS_CREDIT = {
  maxCredit: 1000,
  estimateRate: 0.05,
  incomeLimit: { single: 36500, married: 73000 },
  source: 'IRS Form 8880 (2025)',
} as const

/** IRS Publication 970 — Student Loan Interest Deduction */
export const STUDENT_LOAN_DEDUCTION = {
  maxDeduction: 2500,
  maxTaxSavings: 550,
  taxRate: 0.22,
  incomeLimit: 90000,
  source: 'IRS Publication 970 (2025)',
} as const

/** IRS Free File program */
export const FREE_TAX_FILING = {
  incomeLimit: 84000,
  estimatedSavings: 150,
  source: 'IRS.gov/freefile (2025)',
} as const

// --- Government Programs ---

/** USDA SNAP (Supplemental Nutrition Assistance Program) */
export const SNAP = {
  perPersonMonthly: 200,
  baseIncomeLimit: 40000,
  dependentFactor: 0.3,
  source: 'USDA FNS SNAP eligibility (2025)',
} as const

/** CMS — Medicaid and ACA Marketplace Subsidies */
export const HEALTHCARE = {
  medicaidIncomeLimit: 20000,
  medicaidAnnualValue: 6000,
  acaIncomeLimit: 60000,
  acaAnnualValue: 3600,
  /** Simplified monthly estimate used in strategy.ts */
  strategyMonthlyValue: 300,
  strategyIncomeLimit: 50000,
  source: 'Healthcare.gov / CMS (2025)',
} as const

/** HHS LIHEAP — Low Income Home Energy Assistance Program */
export const LIHEAP = {
  incomeLimit: 35000,
  estimatedValue: 800,
  source: 'HHS LIHEAP (2025)',
} as const

/** USDA WIC — Women, Infants, and Children */
export const WIC = {
  incomeLimit: 52000,
  monthlyPerChild: 100,
  maxChildren: 3,
  source: 'USDA FNS WIC (2025)',
} as const

// --- Employer Benefits ---

export const EMPLOYER_401K = {
  estimatedMatchRate: 0.03,
  source: 'Common employer match (typical 3%)',
} as const

export const EMPLOYER_FSA = {
  estimatedAnnualValue: 600,
  source: 'IRS Revenue Procedure — FSA contribution limits',
} as const

// --- Strategy Thresholds ---

export const STRATEGY = {
  emergencyFundTarget: 1000,
  highInterestThreshold: 15,
  maxAutoSavings: 200,
  autoSavingsRate: 0.2,
  minFreeForAutoSavings: 50,
  savingsPotentialRate: 0.7,
  debtPaymentRate: 0.3,
} as const
