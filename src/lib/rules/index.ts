export {
  RULES_TAX_YEAR,
  EITC,
  CHILD_TAX_CREDIT,
  SAVERS_CREDIT,
  STUDENT_LOAN_DEDUCTION,
  FREE_TAX_FILING,
  SNAP,
  HEALTHCARE,
  LIHEAP,
  WIC,
  EMPLOYER_401K,
  EMPLOYER_FSA,
  STRATEGY,
} from './federal'

export type { BenefitRule, EvaluatedBenefit, RulesBundle } from './types'
export { federalBenefitRules } from './benefits'
export { evaluateBenefits } from './engine'
