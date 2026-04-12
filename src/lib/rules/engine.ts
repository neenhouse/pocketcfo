/**
 * Rules evaluation engine.
 *
 * Takes a financial profile and a set of benefit rules, evaluates eligibility
 * for each, and returns Benefit objects ready for the UI.
 *
 * The engine is jurisdiction-aware: when state rules exist for the same benefit
 * ID, the state rule overrides the federal rule (more specific wins).
 */
import type { FinancialProfile, Benefit } from '../types'
import type { BenefitRule } from './types'
import { getMonthlyIncome } from '../strategy'

/**
 * Evaluate all applicable rules against a financial profile.
 * State-specific rules override federal rules with the same ID.
 */
export function evaluateBenefits(profile: FinancialProfile, rules: BenefitRule[]): Benefit[] {
  const annualIncome = getMonthlyIncome(profile) * 12

  // State rules override federal rules for the same benefit ID
  const ruleMap = new Map<string, BenefitRule>()
  for (const rule of rules) {
    const existing = ruleMap.get(rule.id)
    if (!existing || (existing.jurisdiction === 'federal' && rule.jurisdiction !== 'federal')) {
      ruleMap.set(rule.id, rule)
    }
  }

  const benefits: Benefit[] = []
  for (const rule of ruleMap.values()) {
    if (!rule.applies(profile)) continue

    benefits.push({
      id: rule.id,
      name: rule.name,
      description: rule.description,
      category: rule.category,
      source: rule.source,
      eligible: rule.eligible(profile, annualIncome),
      estimatedValue: rule.estimatedValue(profile, annualIncome),
      requirements: rule.requirements(profile, annualIncome),
      claimed: false,
    })
  }

  return benefits
}
