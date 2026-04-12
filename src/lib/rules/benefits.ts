/**
 * Federal benefit rules for the verified rules engine.
 *
 * Each rule is a self-contained unit: it knows how to determine eligibility,
 * estimate value, and list requirements for a given financial profile.
 *
 * To add a new federal benefit: add a BenefitRule object to this array.
 * To add state-level rules: create a new file (e.g. rules/states/oh.ts)
 * and export a BenefitRule[] that can be merged with federal rules.
 */
import type { BenefitRule } from './types'
import {
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
} from './federal'

export const federalBenefitRules: BenefitRule[] = [
  {
    id: 'eitc',
    name: 'Earned Income Tax Credit (EITC)',
    description: 'A refundable tax credit for low-to-moderate income workers. Even if you owe no tax, you can get this as a refund.',
    category: 'tax',
    source: EITC.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: () => true,
    eligible: (profile, annualIncome) => {
      const limit = profile.dependents > 0 ? EITC.incomeLimit.withDependents : EITC.incomeLimit.withoutDependents
      return annualIncome > 0 && annualIncome < limit
    },
    estimatedValue: (profile, annualIncome) => {
      const max = profile.dependents > 0 ? EITC.maxCredit.withDependents : EITC.maxCredit.withoutDependents
      const rate = profile.dependents > 0 ? EITC.estimateRate.withDependents : EITC.estimateRate.withoutDependents
      return Math.min(max, Math.round(annualIncome * rate))
    },
    requirements: (profile) => {
      const limit = profile.dependents > 0 ? EITC.incomeLimit.withDependents : EITC.incomeLimit.withoutDependents
      return ['Must have earned income', 'Must file a tax return', `Income under $${limit.toLocaleString()}`]
    },
  },
  {
    id: 'ctc',
    name: 'Child Tax Credit',
    description: `Up to $${CHILD_TAX_CREDIT.perChild.toLocaleString()} per qualifying child under 17. Partially refundable even if you owe no tax.`,
    category: 'tax',
    source: CHILD_TAX_CREDIT.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: (profile) => profile.dependents > 0,
    eligible: (_profile, annualIncome) => annualIncome < CHILD_TAX_CREDIT.incomeLimit,
    estimatedValue: (profile) => profile.dependents * CHILD_TAX_CREDIT.perChild,
    requirements: () => [
      'Children under 17',
      'Must file a tax return',
      `Income under $${CHILD_TAX_CREDIT.incomeLimit.toLocaleString()}`,
    ],
  },
  {
    id: 'snap',
    name: 'SNAP (Food Stamps)',
    description: 'Monthly food assistance based on household size and income. Can be loaded onto an EBT card and used at grocery stores.',
    category: 'government',
    source: SNAP.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: () => true,
    eligible: (profile, annualIncome) =>
      annualIncome < SNAP.baseIncomeLimit * (1 + profile.dependents * SNAP.dependentFactor),
    estimatedValue: (profile) => (1 + profile.dependents) * SNAP.perPersonMonthly * 12,
    requirements: () => [
      'Meet income guidelines',
      'Apply through your state',
      'Must be a US citizen or qualified non-citizen',
    ],
  },
  {
    id: 'healthcare',
    name: 'Medicaid or ACA Subsidies',
    description: 'Free or low-cost health insurance. Medicaid for very low income, ACA marketplace subsidies for moderate income.',
    category: 'government',
    source: HEALTHCARE.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: () => true,
    eligible: (_profile, annualIncome) => annualIncome < HEALTHCARE.acaIncomeLimit,
    estimatedValue: (_profile, annualIncome) =>
      annualIncome < HEALTHCARE.medicaidIncomeLimit ? HEALTHCARE.medicaidAnnualValue : HEALTHCARE.acaAnnualValue,
    requirements: () => [
      'Income-based eligibility',
      'Apply through healthcare.gov or your state exchange',
    ],
  },
  {
    id: 'liheap',
    name: 'LIHEAP (Energy Assistance)',
    description: 'Helps pay heating and cooling bills. One-time payment or credit applied directly to your utility account.',
    category: 'government',
    source: LIHEAP.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: () => true,
    eligible: (_profile, annualIncome) => annualIncome < LIHEAP.incomeLimit,
    estimatedValue: () => LIHEAP.estimatedValue,
    requirements: () => [
      'Low income household',
      'Apply through local community action agency',
      'Seasonal availability',
    ],
  },
  {
    id: 'wic',
    name: 'WIC (Women, Infants & Children)',
    description: 'Nutrition program for pregnant women, new mothers, and children under 5. Covers milk, eggs, bread, cereal, and more.',
    category: 'government',
    source: WIC.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: (profile) => profile.dependents > 0,
    eligible: (_profile, annualIncome) => annualIncome < WIC.incomeLimit,
    estimatedValue: (profile) => WIC.monthlyPerChild * 12 * Math.min(profile.dependents, WIC.maxChildren),
    requirements: () => [
      'Pregnant, breastfeeding, or children under 5',
      'Meet income guidelines',
      'Apply at local WIC office',
    ],
  },
  {
    id: '401k',
    name: 'Employer 401(k) Match',
    description: "Your employer may match a percentage of your retirement contributions. This is literally free money — don't leave it on the table.",
    category: 'employer',
    source: EMPLOYER_401K.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: (profile) => profile.hasEmployerBenefits,
    eligible: () => true,
    estimatedValue: (_profile, annualIncome) => Math.round(annualIncome * EMPLOYER_401K.estimatedMatchRate),
    requirements: () => [
      'Check with HR for match percentage',
      'Typically must contribute at least 3-6% of pay',
    ],
  },
  {
    id: 'fsa',
    name: 'Flexible Spending Account (FSA)',
    description: 'Pre-tax dollars for medical expenses or dependent care. Saves you 22-37% on these costs.',
    category: 'employer',
    source: EMPLOYER_FSA.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: (profile) => profile.hasEmployerBenefits,
    eligible: () => true,
    estimatedValue: () => EMPLOYER_FSA.estimatedAnnualValue,
    requirements: () => [
      'Available during open enrollment',
      'Must estimate annual expenses',
      'Use-it-or-lose-it (mostly)',
    ],
  },
  {
    id: 'savers-credit',
    name: "Saver's Credit",
    description: `Tax credit for low-income workers who contribute to retirement accounts (401k, IRA). Up to $${SAVERS_CREDIT.maxCredit.toLocaleString()} credit.`,
    category: 'tax',
    source: SAVERS_CREDIT.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: () => true,
    eligible: (profile, annualIncome) => {
      const limit = profile.filingStatus === 'married' ? SAVERS_CREDIT.incomeLimit.married : SAVERS_CREDIT.incomeLimit.single
      return annualIncome < limit
    },
    estimatedValue: (_profile, annualIncome) =>
      Math.min(SAVERS_CREDIT.maxCredit, Math.round(annualIncome * SAVERS_CREDIT.estimateRate)),
    requirements: (profile) => {
      const limit = profile.filingStatus === 'married' ? SAVERS_CREDIT.incomeLimit.married : SAVERS_CREDIT.incomeLimit.single
      return ['Contribute to 401(k) or IRA', 'Must be 18+', `Income under $${limit.toLocaleString()}`]
    },
  },
  {
    id: 'student-loan-deduction',
    name: 'Student Loan Interest Deduction',
    description: `Deduct up to $${STUDENT_LOAN_DEDUCTION.maxDeduction.toLocaleString()} of student loan interest from your taxable income. No need to itemize.`,
    category: 'tax',
    source: STUDENT_LOAN_DEDUCTION.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: (profile) => profile.debts.some(d => d.type === 'student_loan'),
    eligible: (_profile, annualIncome) => annualIncome < STUDENT_LOAN_DEDUCTION.incomeLimit,
    estimatedValue: (profile) =>
      Math.min(
        STUDENT_LOAN_DEDUCTION.maxTaxSavings,
        Math.round(
          profile.debts
            .filter(d => d.type === 'student_loan')
            .reduce((a, d) => a + d.balance * d.interestRate / 100, 0) * STUDENT_LOAN_DEDUCTION.taxRate
        )
      ),
    requirements: () => [
      'Paid interest on qualified student loans',
      `Income under $${STUDENT_LOAN_DEDUCTION.incomeLimit.toLocaleString()} (single)`,
    ],
  },
  {
    id: 'free-filing',
    name: 'Free Tax Filing (IRS Free File)',
    description: `File your federal taxes for free if your income is under $${FREE_TAX_FILING.incomeLimit.toLocaleString()}. Many states offer free filing too.`,
    category: 'tax',
    source: FREE_TAX_FILING.source,
    taxYear: RULES_TAX_YEAR,
    jurisdiction: 'federal',
    applies: () => true,
    eligible: (_profile, annualIncome) => annualIncome < FREE_TAX_FILING.incomeLimit,
    estimatedValue: () => FREE_TAX_FILING.estimatedSavings,
    requirements: () => [
      `Income under $${FREE_TAX_FILING.incomeLimit.toLocaleString()}`,
      'Use IRS.gov/freefile',
      'Available January through October',
    ],
  },
]
