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

/** Structured audit record for a single benefit evaluation */
export interface AuditRecord {
  ruleId: string
  ruleName: string
  source: string
  taxYear: number
  jurisdiction: string
  evaluatedAt: string
  inputs: {
    annualIncome: number
    filingStatus: string
    dependents: number
    hasEmployerBenefits: boolean
  }
  result: {
    eligible: boolean
    estimatedValue: number
    requirements: string[]
  }
}

/**
 * Resolve which rules apply, handling state-over-federal overrides.
 */
function resolveRules(rules: BenefitRule[]): Map<string, BenefitRule> {
  const ruleMap = new Map<string, BenefitRule>()
  for (const rule of rules) {
    const existing = ruleMap.get(rule.id)
    if (!existing || (existing.jurisdiction === 'federal' && rule.jurisdiction !== 'federal')) {
      ruleMap.set(rule.id, rule)
    }
  }
  return ruleMap
}

/**
 * Evaluate all applicable rules against a financial profile.
 * State-specific rules override federal rules with the same ID.
 */
export function evaluateBenefits(profile: FinancialProfile, rules: BenefitRule[]): Benefit[] {
  const annualIncome = getMonthlyIncome(profile) * 12
  const ruleMap = resolveRules(rules)

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

/**
 * Generate a full audit trail for all evaluated benefits.
 * Each record documents the rule, inputs, and computed result.
 */
export function generateAuditTrail(profile: FinancialProfile, rules: BenefitRule[]): AuditRecord[] {
  const annualIncome = getMonthlyIncome(profile) * 12
  const ruleMap = resolveRules(rules)
  const now = new Date().toISOString()

  const records: AuditRecord[] = []
  for (const rule of ruleMap.values()) {
    if (!rule.applies(profile)) continue

    records.push({
      ruleId: rule.id,
      ruleName: rule.name,
      source: rule.source,
      taxYear: rule.taxYear,
      jurisdiction: rule.jurisdiction,
      evaluatedAt: now,
      inputs: {
        annualIncome: Math.round(annualIncome),
        filingStatus: profile.filingStatus,
        dependents: profile.dependents,
        hasEmployerBenefits: profile.hasEmployerBenefits,
      },
      result: {
        eligible: rule.eligible(profile, annualIncome),
        estimatedValue: rule.estimatedValue(profile, annualIncome),
        requirements: rule.requirements(profile, annualIncome),
      },
    })
  }

  return records
}
