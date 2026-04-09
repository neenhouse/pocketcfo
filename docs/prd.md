# PocketCFO — Product Requirements Document

## Status: Phase 1 (Honest Calculator + First Deployment)

## Current State

PocketCFO is a client-side React/TypeScript web app deployed on Cloudflare Pages. It provides:

- **Financial assessment** — 5-step form collecting income, expenses, debts, and goals
- **Dashboard** — summary metrics, cash flow visualization, 5-year projection, action plan
- **Debt optimizer** — avalanche vs. snowball comparison with payoff timeline
- **Benefits finder** — eligibility checker for 12 tax credits, government programs, and employer benefits

All data stored in localStorage. No backend. No accounts. No AI integration.

## Immediate Priorities (Phase 1 Cleanup)

### P0: Credibility

| Item | Status | Notes |
|------|--------|-------|
| Remove fabricated impact metrics from landing page | PLANNED | "$12.4M saved" etc. are not real numbers |
| Replace with verifiable claims or remove section | PLANNED | Options: remove entirely, show calculator methodology, or add "projected savings" with clear labeling |
| Audit "AI financial advisor" positioning | PLANNED | Product has no AI. Either add AI or change messaging |

### P0: First Institutional Deployment

| Item | Status | Notes |
|------|--------|-------|
| Identify first CDFI or employer willing to pilot | PLANNED | CDFIs are best first target — mission-aligned, smaller procurement cycles |
| Build white-label/branding configuration | PLANNED | Custom logo, colors, institution name, landing page |
| Add institution-specific benefit configuration | PLANNED | Map deploying institution's specific programs into benefits finder |
| Add aggregate analytics (anonymized) | PLANNED | Assessment count, benefit categories surfaced, estimated dollar impact — no PII |
| Deploy and measure outcomes | PLANNED | Benefit uptake rates, engagement metrics, user satisfaction |
| Write case study from first deployment | PLANNED | Real numbers, real outcomes — this sells the next deployment |

### P1: Accuracy

| Item | Status | Notes |
|------|--------|-------|
| Externalize tax thresholds and benefit eligibility rules | PLANNED | Currently hardcoded in calculations.ts — will decay as laws change |
| Add data source citations | PLANNED | Every dollar amount shown should link to its source (IRS.gov, benefits.gov) |
| Add "last updated" dates to benefit information | PLANNED | Users need to know if the EITC amounts are current year |
| State-level benefit variation | PLANNED | Benefits vary dramatically by state — current version is federal only |

### P2: Foundation for Phase 2

| Item | Status | Notes |
|------|--------|-------|
| Data export/import (JSON) | PLANNED | Let users backup and restore their data |
| Assessment versioning | PLANNED | Track when the user last updated each section |
| Return visit detection | PLANNED | If user has existing data, show dashboard directly instead of landing page |

### Phase 1 Success Metric:
**One institutional deployment live with measured outcomes.** Consumer 30-day return rate > 20% is a secondary metric for demo credibility.

## Phase 2: Institutional Platform (Next)

Depends on Phase 1 first deployment validation.

### Core capabilities:
- White-label deployment infrastructure (custom branding, domain, landing page)
- Institution-specific benefit configuration dashboard
- Aggregate impact dashboard (anonymized metrics for grant reporting)
- Audit trail (every recommendation traceable to rule + source)
- Optional encrypted user sync (anonymous, key-based, for longitudinal tracking)
- State-specific benefit eligibility rules (beyond federal-only)

### Success metric:
**3+ institutional deployments with measured outcomes** — benefit uptake increase, engagement rates, user satisfaction scores.

## Phase 3: Action Engine (Future)

Depends on Phase 2 validation. See docs/vision.md for the full thesis.

### Core capabilities:
- Plaid integration for balance auto-import
- Benefit application pre-fill
- Tax filing data export
- Savings automation via bank API

### Success metric:
**Weekly active usage** — users engaging with the tool at least weekly, indicating it's embedded in their financial routine.

## Non-Goals

- Investment advice or portfolio management
- Credit score monitoring (Credit Karma's territory)
- Lending or earned wage access (PayActiv's territory)
- Full tax preparation (TurboTax/FreeTaxUSA's territory)
- Banking services

## Technical Constraints

- Must work on low-end devices (budget Android phones)
- Must work on slow connections (< 1 Mbps)
- Total bundle size target: < 200KB gzipped
- No required external API calls for core functionality
- Offline-capable (PWA) for Phase 2+
