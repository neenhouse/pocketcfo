import type { FinancialProfile, Benefit } from '../types'

/**
 * A structured benefit rule that encapsulates eligibility logic, value
 * estimation, and metadata. This is the core unit of the verified rules engine.
 *
 * Rules are jurisdiction-scoped (federal or state) and tax-year-versioned.
 * State rules can supplement or override federal rules for the same benefit.
 */
export interface BenefitRule {
  id: string
  name: string
  description: string
  category: 'government' | 'employer' | 'tax'
  source: string
  taxYear: number
  jurisdiction: 'federal' | string // 'federal' or state code (e.g. 'OH', 'CA')

  /**
   * Whether this rule should be evaluated for the given profile.
   * Return false to skip (e.g., employer benefits when no employer benefits exist).
   */
  applies: (profile: FinancialProfile) => boolean

  /**
   * Whether the user is eligible for this benefit.
   */
  eligible: (profile: FinancialProfile, annualIncome: number) => boolean

  /**
   * Estimated annual dollar value of the benefit.
   */
  estimatedValue: (profile: FinancialProfile, annualIncome: number) => number

  /**
   * Human-readable requirements shown in the UI.
   */
  requirements: (profile: FinancialProfile, annualIncome: number) => string[]
}

/**
 * Evaluated result: a BenefitRule resolved against a specific profile.
 */
export type EvaluatedBenefit = Benefit

/**
 * A rules bundle groups rules by jurisdiction and tax year.
 * Used to compose federal + state rules for a given deployment.
 */
export interface RulesBundle {
  taxYear: number
  jurisdictions: string[] // e.g. ['federal', 'OH']
  rules: BenefitRule[]
}
