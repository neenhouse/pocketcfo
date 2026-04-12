# PocketCFO — Product Requirements Document

## Status: Phase 1 (Honest Calculator + First Deployment)

## Strategic Context

This PRD serves the vision outlined in `docs/vision.md`. PocketCFO is financial decision infrastructure for institutions serving low-income populations. The consumer app is the demo. The institutional deployment is the business. The verified rules engine is the moat. See the vision doc for the full flywheel thesis, buyer analysis, and 5-year survival argument.

**The single question Phase 1 must answer**: Will one institution deploy this for their population, and does it measurably improve outcomes?

## Current State

PocketCFO is a client-side React/TypeScript web app deployed on Cloudflare Pages. It provides:

- **Financial assessment** — 5-step form collecting income, expenses, debts, and goals
- **Dashboard** — summary metrics, cash flow visualization, 5-year projection, action plan
- **Debt optimizer** — avalanche vs. snowball comparison with payoff timeline
- **Benefits finder** — eligibility checker for 12 tax credits, government programs, and employer benefits

All data stored in localStorage. No backend. No accounts. No AI integration.

## First Buyer Profile

Phase 1 targets a single CDFI pilot. Not employers (too long a sales cycle), not nonprofits (grant-dependent timing). One CDFI.

**Ideal first pilot characteristics:**
- Mid-size CDFI (50–500 active clients)
- Program director who is personally frustrated by the gap between counselor bandwidth and client need
- Already tracking client outcomes for CDFI Fund certification or grant reporting — and finding it painful
- Located in a state with state-level benefit supplements (Ohio, California, New York, Texas) to maximize the value of rules encoding
- Willing to promote the tool to their client base and share aggregate outcome data

**What the CDFI gets from the pilot (the pitch):**
1. A branded version of PocketCFO configured with their specific programs
2. Extends their counselors' reach — clients can self-serve benefit screening and debt prioritization before (or instead of) a counselor appointment
3. Aggregate engagement metrics for their next grant report: "X assessments completed, Y benefits surfaced, $Z estimated impact"
4. No cost for the pilot (first deployment is free — the outcome data is the payment)

**What PocketCFO gets from the pilot:**
1. Validation that institutions will actually deploy and promote this
2. State-specific rules encoded into the verified database (first flywheel rotation)
3. Real outcome data for the first case study
4. A reference customer for the next sale

## Immediate Priorities (Phase 1)

### P0: Credibility (must-fix before any institutional conversation)

| Item | Status | Notes |
|------|--------|-------|
| Remove fabricated impact metrics from landing page | COMPLETE | Replaced fake numbers ($12.4M, 84K, $2.1M, 18mo) with verifiable methodology claims (12+ programs, IRS sources, 3 min assessment, zero data collected) |
| Replace with verifiable claims or remove section | COMPLETE | Section now shows "Built on Real Rules. Not Guesswork." with verifiable facts |
| Audit "AI financial advisor" positioning | RESOLVED | Checked — no AI claims in current code. Landing page positions against human advisors ("$500/hr financial advisor"), not as AI. Vision doc updated to address the label mismatch |

### P0: Institutional Deployment Readiness

These are the minimum capabilities needed to deploy at one CDFI:

| Item | Status | Notes |
|------|--------|-------|
| White-label branding configuration | COMPLETE | `BrandingConfig` in `src/lib/branding.ts`. Configures app name, hero text, CTA text, colors (CSS custom property overrides), logo URL, "Powered by PocketCFO" toggle. Example CDFI config included. Switch active branding with one line change |
| Institution-specific benefit configuration | COMPLETE | `institutionRules` field in `BrandingConfig`. Institution-specific `BenefitRule[]` merged with federal rules. Example CDFI config includes emergency grant and coaching programs |
| Aggregate analytics (anonymized) | PLANNED | Assessment count, benefit categories surfaced, estimated dollar impact. No PII. Simple event tracking to a privacy-respecting backend (Plausible or equivalent) |
| Audit trail for recommendations | COMPLETE | `generateAuditTrail()` in rules engine produces structured JSON per evaluation: rule ID, source, tax year, jurisdiction, user inputs, computed result. "Export Audit Report" button on Benefits Finder page |
| Deploy pilot and measure outcomes | PLANNED | 90-day pilot with pre-agreed success metrics |
| Write case study from pilot data | PLANNED | Real numbers, real outcomes. This is the sales collateral for every subsequent deal |

### P1: Accuracy (builds the verified rules moat)

| Item | Status | Notes |
|------|--------|-------|
| Externalize tax thresholds and benefit eligibility rules | COMPLETE | All thresholds moved to `src/lib/rules/federal.ts` with source citations. strategy.ts and BenefitsFinderPage.tsx import from rules module |
| Add data source citations to every calculation | COMPLETE | Every benefit card shows its source (IRS Publication 596, USDA FNS, CMS, etc.). Piped from rules/federal.ts |
| Add "last updated" dates to benefit information | COMPLETE | Tax year indicator ("Thresholds current as of Tax Year 2025") shown in Benefits Finder header |
| State-level benefit rules for pilot state | PLANNED | Federal-only is insufficient for a real deployment. Encode the pilot CDFI's state-specific rules |

### P2: Foundation for Phase 2

| Item | Status | Notes |
|------|--------|-------|
| Data export/import (JSON) | COMPLETE | Export/Import buttons on dashboard. Downloads dated JSON backup, imports with validation |
| Assessment versioning | COMPLETE | `sectionTimestamps` on profile, assessment pre-populates on retake, dashboard shows freshness banner after 14 days |
| Return visit detection | COMPLETE | Landing page redirects to dashboard if assessment exists. Bypass with `?new=1` |
| Rules database architecture | COMPLETE | `BenefitRule` type in `rules/types.ts`, evaluation engine in `rules/engine.ts`, federal rules in `rules/benefits.ts`. State rules override federal by ID. 6 tests including state override verification |

### Phase 1 Success Metrics

**Primary**: One institutional deployment live with measured outcomes after 90-day pilot.
- Measured outcomes: assessment completion rate, benefits surfaced per user, estimated dollar impact, CDFI counselor satisfaction
- Target: 50+ assessments completed, measurable increase in benefit uptake vs. pre-pilot baseline

**Secondary**: Consumer 30-day return rate > 20% (demo credibility).

**Flywheel checkpoint**: At end of Phase 1, can we articulate "deploying at a second institution would take X weeks instead of Y months because of what we learned and encoded from the first"?

## Phase 2: Institutional Platform (depends on Phase 1 validation)

Gate: Phase 1 pilot shows measurable outcomes and the CDFI would renew/recommend.

### Core capabilities:
- **Multi-tenant deployment platform** — self-service institution onboarding (branding, domain, benefit config) without code changes
- **Institution admin dashboard** — configure programs, view aggregate impact metrics, export grant-ready reports
- **Multi-state rules engine** — versioned benefit rules across 5+ states, updated quarterly, with change tracking
- **Audit trail system** — every recommendation traceable to rule + source + version. Exportable for institutional compliance review
- **Optional encrypted user sync** — anonymous, key-based, for longitudinal tracking. Opt-in only
- **API layer (v1)** — first version of the verified engine as a callable API, not just a web app

### Success metrics:
- **10+ institutional deployments across 3+ states**
- Flywheel evidence: new deployment in a covered state takes < 4 weeks
- Outcome data corpus is statistically credible (n > 1,000 assessments)
- At least one deployment renewal (retention, not just acquisition)

### Flywheel checkpoint:
Can we point to a specific example where deployment N was faster/cheaper because of rules and outcome data from deployments 1 through N-1?

## Phase 3: Financial Eligibility Infrastructure (depends on Phase 2 validation)

Gate: 10+ deployments, rules covering 5+ states, and at least one external system expressing interest in API access.

### Core capabilities:
- **Verified eligibility API** — third-party systems query PocketCFO for deterministic benefit calculations with audit trails
- **AI integration layer** — LLM systems call PocketCFO's API for verified financial answers (the "AI for conversation, rules for numbers" principle as a product)
- **Benefit application pre-fill** — generate completed forms for SNAP, Medicaid, LIHEAP
- **Tax filing handoff** — export data compatible with IRS Free File and VITA workflows
- **Calendar-aware nudges** — proactive alerts about filing deadlines, enrollment windows, benefit expirations

### Success metrics:
- **API consumers beyond direct institutional deployments** (other platforms querying PocketCFO)
- Rules coverage across 15+ states
- Outcome data corpus cited in at least one external report or grant application
- **The infrastructure test**: if PocketCFO's API goes down, do other systems notice within an hour?

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
