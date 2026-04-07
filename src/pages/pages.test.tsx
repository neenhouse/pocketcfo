import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './LandingPage'
import AssessmentPage from './AssessmentPage'
import DashboardPage from './DashboardPage'
import DebtOptimizerPage from './DebtOptimizerPage'
import BenefitsFinderPage from './BenefitsFinderPage'

function renderWithRouter(ui: React.ReactElement, path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      {ui}
    </MemoryRouter>
  )
}

describe('LandingPage', () => {
  it('renders hero title', () => {
    renderWithRouter(<LandingPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/Millionaire Advice/)).toBeInTheDocument()
  })

  it('renders all four feature cards', () => {
    renderWithRouter(<LandingPage />)
    expect(screen.getByText('Debt Strategy')).toBeInTheDocument()
    expect(screen.getByText('Tax Optimization')).toBeInTheDocument()
    expect(screen.getByText('Benefits Finder')).toBeInTheDocument()
    expect(screen.getByText('Savings Automation')).toBeInTheDocument()
  })

  it('renders the comparison section', () => {
    renderWithRouter(<LandingPage />)
    expect(screen.getByText('Same Strategy. Different Price Tag.')).toBeInTheDocument()
  })

  it('renders CTA to start assessment', () => {
    renderWithRouter(<LandingPage />)
    expect(screen.getAllByText(/Get Your.*Strategy/).length).toBeGreaterThan(0)
  })

  it('renders trust indicators', () => {
    renderWithRouter(<LandingPage />)
    expect(screen.getByText('Your data stays on your device')).toBeInTheDocument()
    expect(screen.getByText('No sign-up required')).toBeInTheDocument()
  })
})

describe('AssessmentPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the first step heading', () => {
    renderWithRouter(<AssessmentPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Financial Health Assessment')).toBeInTheDocument()
  })

  it('renders income step by default', () => {
    renderWithRouter(<AssessmentPage />)
    expect(screen.getByText('Tell us about your income')).toBeInTheDocument()
  })

  it('renders step navigation labels', () => {
    renderWithRouter(<AssessmentPage />)
    expect(screen.getByText('Income')).toBeInTheDocument()
    expect(screen.getByText('Expenses')).toBeInTheDocument()
    expect(screen.getByText('Debts')).toBeInTheDocument()
    expect(screen.getByText('Goals')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
  })

  it('continue button is disabled when income is 0', () => {
    renderWithRouter(<AssessmentPage />)
    const continueBtn = screen.getByRole('button', { name: 'Continue' })
    expect(continueBtn).toBeDisabled()
  })

  it('renders pay frequency options', () => {
    renderWithRouter(<AssessmentPage />)
    expect(screen.getByText('Weekly')).toBeInTheDocument()
    expect(screen.getByText('Every 2 weeks')).toBeInTheDocument()
    expect(screen.getByText('Monthly')).toBeInTheDocument()
  })
})

describe('DashboardPage (empty state)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders empty state when no strategy exists', () => {
    renderWithRouter(<DashboardPage />)
    expect(screen.getByText('Your Dashboard is Waiting')).toBeInTheDocument()
  })

  it('links to the assessment from empty state', () => {
    renderWithRouter(<DashboardPage />)
    expect(screen.getByRole('button', { name: 'Start Assessment' })).toBeInTheDocument()
  })
})

describe('DebtOptimizerPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the page heading', () => {
    renderWithRouter(<DebtOptimizerPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Debt Payoff Optimizer')).toBeInTheDocument()
  })

  it('renders add debt button', () => {
    renderWithRouter(<DebtOptimizerPage />)
    expect(screen.getByRole('button', { name: '+ Add Debt' })).toBeInTheDocument()
  })

  it('renders empty state when no debts', () => {
    renderWithRouter(<DebtOptimizerPage />)
    expect(screen.getByText(/No debts from your assessment/)).toBeInTheDocument()
  })
})

describe('BenefitsFinderPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the page heading', () => {
    renderWithRouter(<BenefitsFinderPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Benefits Finder')).toBeInTheDocument()
  })

  it('renders filter buttons', () => {
    renderWithRouter(<BenefitsFinderPage />)
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eligible' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Government' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tax' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Employer' })).toBeInTheDocument()
  })

  it('renders the assessment notice when income is 0', () => {
    renderWithRouter(<BenefitsFinderPage />)
    expect(screen.getByText(/Complete your/)).toBeInTheDocument()
  })

  it('renders EITC benefit card', () => {
    renderWithRouter(<BenefitsFinderPage />)
    expect(screen.getByText('Earned Income Tax Credit (EITC)')).toBeInTheDocument()
  })

  it('renders summary cards', () => {
    renderWithRouter(<BenefitsFinderPage />)
    expect(screen.getByText('You May Be Eligible For')).toBeInTheDocument()
    expect(screen.getByText('Already Claimed')).toBeInTheDocument()
    expect(screen.getByText('Still Unclaimed')).toBeInTheDocument()
  })
})
